/* global PATH_BITMAP, PATH_MEDIA, PATH_PROGRAM, PATH_BOARD, PATH_CHARACTER, PATH_ITEM, jailed, rpgcode, PATH_TILESET */

var rpgtoolkit = new RPGToolkit();

function RPGToolkit() {
    this.dt = 0; // Craftyjs time step since last frame;
    this.screen = {};

    // Assets to load.
    this.assetsToLoad = {"images": [], "audio": {}};
    this.waitingEntities = []; // The entities to setReady at assets are loaded.

    // Game entities.
    this.craftyBoard = {};
    this.craftyCharacter = {};

    // TileSets.
    this.tilesets = {};
    this.tileSize = 32;

    // Program cache, stores programs as Function objects.
    this.programCache = {};

    // Used to store state when runProgram is called.
    this.keyboardHandler = {};
    this.endProgramCallback = null;
    this.keyDownHandlers = null;
    this.keyUpHandlers = null;
}

/**
 * Setups up the games initial state based on the configuration found in the main file.
 * 
 * @param {type} filename
 * @returns {undefined}
 */
RPGToolkit.prototype.setup = function (filename) {
    var project = new Project(filename);

    // Configure Crafty.
    Crafty.init(project.resolutionWidth, project.resolutionHeight);
    Crafty.canvasLayer.init();
    Crafty.viewport.init(project.resolutionWidth, project.resolutionHeight);
    Crafty.paths({audio: PATH_MEDIA, images: PATH_BITMAP});

    // Setup run time keys.
    this.keyboardHandler = new Keyboard();
    this.keyboardHandler.downHandlers[project.menuKey] = function () {
        rpgtoolkit.runProgram(PATH_PROGRAM + project.menuPlugin, {});
    };

    // Setup the drawing canvas (game screen).
    this.screen = new ScreenRenderer();

    // Setup the RPGcode rutime.
    rpgcode = new RPGcode();

    this.loadCharacter(new Character(PATH_CHARACTER + project.initialCharacter));
    this.loadBoard(new Board(PATH_BOARD + project.initialBoard));
    
    // Setup up the Character's starting position.
    this.craftyCharacter.character.x = this.craftyBoard.board.startingPosition["x"];
    this.craftyCharacter.character.y = this.craftyBoard.board.startingPosition["y"];
    this.craftyCharacter.x = this.craftyCharacter.character.x;
    this.craftyCharacter.y = this.craftyCharacter.character.y;
    Crafty.viewport.follow(this.craftyCharacter, 0, 0);
    
    this.loadCraftyAssets(this.loadScene);

//    // Run the startup program before the game logic loop.
//    if (!project.startupPrg) {
//        this.runProgram(PATH_PROGRAM + project.startupPrg, {}, function () {
//            rpgtoolkit.loadBoard();
//        });
//    } else {
//        rpgtoolkit.loadBoard();
//    }
};

RPGToolkit.prototype.loadScene = function (e) {
    if (e) {
        if (e.type === "loading") {
            console.info(e);
        } else {
            console.error(e);
        }
    } else {
        Crafty.trigger("Draw", {ctx: Crafty.canvasLayer.context});
    }
};

RPGToolkit.prototype.queueCraftyAssets = function (assets, waitingEntity) {
    if (assets.images) {
        this.assetsToLoad.images = this.assetsToLoad.images.concat(assets.images);
    }
    if (assets.audio) {
        this.assetsToLoad.audio = Object.assign({}, this.assetsToLoad.audio, assets.audio);
    }

    if (waitingEntity) {
        this.waitingEntities.push(waitingEntity);
    }
};

RPGToolkit.prototype.loadCraftyAssets = function (callback) {
    var assets = this.assetsToLoad;
    Crafty.load(assets,
            function () { // loaded
                console.log("loaded assets=[" + JSON.stringify(assets) + "]");
                rpgtoolkit.waitingEntities.forEach(function (entity) {
                    entity.setReady();
                });
                callback();
            },
            function (e) {  // progress 
                callback({"type": "loading", "value": e});
            },
            function (e) { // uh oh, error loading
                callback({"type": "error", "value": e});
            }
    );
};

RPGToolkit.prototype.createCraftyBoard = function (board) {
    var width = board.width * this.tileSize;
    var height = board.height * this.tileSize;

    Crafty.c("Board", {
        ready: true,
        width: width,
        height: height,
        init: function () {
            this.addComponent("2D, Canvas");
            this.attr({x: 0, y: 0, w: width, h: height, board: board, show: false});
            this.bind("Draw", function (e) {
                rpgtoolkit.screen.render(e.ctx);
            });
        }
    });

    this.craftyBoard = Crafty.e("Board");
    return this.craftyBoard;
};

RPGToolkit.prototype.loadBoard = function (board) {
    var craftyBoard = this.createCraftyBoard(board);

    craftyBoard.board.tileSets.forEach(function (file) {
        var tileSet = new Tileset(PATH_TILESET + file);
        rpgtoolkit.tilesets[tileSet.name] = tileSet;
        rpgtoolkit.queueCraftyAssets({"images": tileSet.images}, tileSet);
    });

//    /*
//     * Setup vectors.
//     */
//    board.vectors.forEach(function (vector) {
//        var points = vector.points;
//        var len = points.length;
//        for (var i = 0; i < len - 1; i++) {
//            this.createSolidVector(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, vector.layer);
//        }
//
//        if (vector.isClosed) {
//            this.createSolidVector(points[0].x, points[0].y, points[len - 1].x, points[len - 1].y, vector.layer);
//        }
//    }, this);

//    /*
//     * Setup board sprites.
//     */
//    var len = board.sprites.length;
//    for (var i = 0; i < len; i++) {
//        var sprite = board.sprites[i];
//        sprite.item = new Item(PATH_ITEM + sprite.fileName);
//        var boardSprite = this.loadSprite(sprite);
//        boardSprite.sprite.item.load();
//        board.sprites[i] = boardSprite;
//    }
//
//    /*
//     * Play background music.
//     */
//    var backgroundMusic = board.backgroundMusic;
//    if (backgroundMusic) {
//        if (Crafty.asset(backgroundMusic)) {
//            Crafty.audio.play(backgroundMusic);
//        } else {
//            var assets = {"audio": {}};
//            assets.audio[board.backgroundMusic] = board.backgroundMusic;
//            Crafty.load(assets, function () {
//                rpgtoolkit.playSound(backgroundMusic, -1);
//            });
//        }
//    }

    this.queueCraftyAssets({}, craftyBoard.board);
};

RPGToolkit.prototype.switchBoard = function (boardName, tileX, tileY) {
    this.craftyCharacter.disableControl();

    Crafty("Solid").destroy();
    Crafty("Board").destroy();
    Crafty.audio.stop();

    this.craftyCharacter.x = tileX * this.tileSize;
    this.craftyCharacter.y = tileY * this.tileSize;

    this.loadBoard(new board(PATH_BOARD + boardName));

    this.craftyCharacter.enableControl();
};

RPGToolkit.prototype.loadCharacter = function (character) {
    this.craftyCharacter = Crafty.e("DOM, Fourway, Collision")
            .attr({
                x: character.x,
                y: character.y,
                character: character})
            .fourway(50)
            .collision(new Crafty.polygon([-15, -10, 15, -10, -15, 0, 15, 0]))
            .checkHits("Solid")
            .bind("HitOn", function (hitData) {
                this.character.checkCollisions(hitData[0], this);
            })
            .bind("HitOff", function (comp) {
                Crafty.log(comp);
                Crafty.log("Collision with Solid entity ended.");
            })
            .bind("Moved", function (from) {
                this.character.animate(this.dt);
            })
            .bind("NewDirection", function (direction) {
                if (direction.x === 0 && direction.y === -1) {
                    this.character.direction = this.character.DirectionEnum.NORTH;
                    this.character.changeGraphics(this.character.direction);
                } else if (direction.x === 0 && direction.y === 1) {
                    this.character.direction = this.character.DirectionEnum.SOUTH;
                    this.character.changeGraphics(this.character.DirectionEnum.SOUTH);
                } else if (direction.x === -1 && direction.y === 0) {
                    this.character.direction = this.character.DirectionEnum.WEST;
                    this.character.changeGraphics(this.character.DirectionEnum.WEST);
                } else if (direction.x === 1 && direction.y === 0) {
                    this.character.direction = this.character.DirectionEnum.EAST;
                    this.character.changeGraphics(this.character.DirectionEnum.EAST);
                }
            })
            .bind("EnterFrame", function (event) {
                this.dt = event.dt / 1000;
            });
    this.craftyCharacter.visible = false;
    var assets = this.craftyCharacter.character.load();
    this.queueCraftyAssets(assets, character);
};

RPGToolkit.prototype.loadSprite = function (sprite) {
    // TODO: width and height of item must contain the collision polygon.
    var attr = {
        x: sprite.x,
        y: sprite.y,
        layer: sprite.layer,
        w: this.tileSize,
        h: this.tileSize,
        vectorType: "item",
        sprite: sprite
    };
    var entity = Crafty.e("2D, Solid, Collision")
            .attr(attr)
            .checkHits("Solid")
            .collision(new Crafty.polygon([-16, -32, 16, -32, 16, 0, -16, 0]))
            .bind("HitOn", function (hitData) {
                this.sprite.item.checkCollisions(hitData[0], this);
            });
    entity.visible = false;
    return entity;
};

RPGToolkit.prototype.openProgram = function (filename) {
    var program = rpgtoolkit.programCache[filename];

    if (!program) {
        // TODO: Make the changes here that chrome suggests.
        var req = new XMLHttpRequest();
        req.open("GET", filename, false);
        req.overrideMimeType("text/plain; charset=x-user-defined");
        req.send(null);

        program = new Function(req.responseText);
        rpgtoolkit.programCache[filename] = program;
    }

    return program;
};

RPGToolkit.prototype.runProgram = function (filename, source, callback) {
    rpgcode.source = source; // Entity that triggered the program.

    rpgtoolkit.craftyCharacter.disableControl();

    // Store endProgram callback and runtime key handlers.
    rpgtoolkit.endProgramCallback = callback;
    rpgtoolkit.keyDownHandlers = rpgtoolkit.keyboardHandler.downHandlers;
    rpgtoolkit.keyUpHandlers = rpgtoolkit.keyboardHandler.upHandlers;
    rpgtoolkit.keyboardHandler.downHandlers = {};
    rpgtoolkit.keyboardHandler.upHandlers = {};

    var program = rpgtoolkit.openProgram(filename);
    program();
};

RPGToolkit.prototype.endProgram = function (nextProgram) {
    if (nextProgram) {
        rpgtoolkit.runProgram(PATH_PROGRAM + nextProgram, rpgcode.source,
                rpgtoolkit.endProgramCallback);
    } else {
        if (rpgtoolkit.endProgramCallback) {
            rpgtoolkit.endProgramCallback();
            rpgtoolkit.endProgramCallback = null;
        }

        rpgtoolkit.keyboardHandler.downHandlers = rpgtoolkit.keyDownHandlers;
        rpgtoolkit.keyboardHandler.upHandlers = rpgtoolkit.keyUpHandlers;
        rpgtoolkit.craftyCharacter.enableControl();
    }
};

RPGToolkit.prototype.createSolidVector = function (x1, y1, x2, y2, layer) {
    var attr = this.calculateVectorPosition(x1, y1, x2, y2);
    attr.layer = layer;
    attr.vectorType = "solid";

    Crafty.e("Solid, Collision")
            .attr(attr);
};

RPGToolkit.prototype.createProgramVector = function (x1, y1, x2, y2, layer, fileName) {
    var attr = this.calculateVectorPosition(x1, y1, x2, y2);
    attr.layer = layer;
    attr.vectorType = "program";
    attr.fileName = fileName;

    Crafty.e("Solid, Collision")
            .attr(attr);
};

RPGToolkit.prototype.calculateVectorPosition = function (x1, y1, x2, y2) {
    var xDiff = x2 - x1;
    var yDiff = y2 - y1;

    var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

    var width;
    var height;

    if (x1 !== x2) {
        width = distance;
        height = 2;

        if (xDiff < 0) {
            x1 = x2;
        }
    } else {
        width = 2;
        height = distance;

        if (yDiff < 0) {
            y1 = y2;
        }
    }

    return {x: x1, y: y1, w: width, h: height};
};

RPGToolkit.prototype.playSound = function (sound, loop) {
    Crafty.audio.play(sound, loop);
};

/**
 * Utility function for getting accurate timestamps across browsers.
 * 
 * @returns {Number}
 */
RPGToolkit.prototype.timestamp = function () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

// TODO: Make this a utility function. When there is a Craftyjs compiler
// it will do it instead.
RPGToolkit.prototype.prependPath = function (prepend, items) {
    var len = items.length;
    for (var i = 0; i < len; i++) {
        items[i] = prepend.concat(items[i]);
    }
};
