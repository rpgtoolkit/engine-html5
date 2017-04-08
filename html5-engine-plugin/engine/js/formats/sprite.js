/* global rpgtoolkit, PATH_ANIMATION, PATH_PROGRAM */

function Sprite() {
    this.x = 0;
    this.y = 0;
    this.layer = 0;
    this.spriteGraphics = {
        elapsed: 0,
        frameIndex: 0,
        active: {},
        south: null,
        north: null,
        east: null,
        west: null,
        southEast: null,
        southWest: null,
        northEast: null,
        northWest: null,
        southIdle: null,
        northIdle: null,
        eastIdle: null,
        westIdle: null,
        southEastIdle: null,
        southWestIdle: null,
        northEastIdle: null,
        northWestIdle: null,
        attack: null,
        defend: null,
        specialMove: null,
        die: null,
        rest: null,
        custom: {

        }
    };
}

Sprite.prototype.DirectionEnum = {
    NORTH: "n",
    SOUTH: "s",
    EAST: "e",
    WEST: "w",
    NORTH_EAST: "ne",
    NORTH_WEST: "nw",
    SOUTH_EAST: "se",
    SOUTH_WEST: "sw"
};

Sprite.prototype.load = function () {
    var frames = this.loadAnimations();
    var soundEffects = this.loadSoundEffects();

    // Return the assets that need to be loaded.
    return {"images": frames, "audio": soundEffects};
};

Sprite.prototype.loadAnimations = function () {
    // Load up the standard animations.
    var standardKeys = ["SOUTH", "NORTH", "EAST", "WEST", "NORTH_EAST", "NORTH_WEST",
        "SOUTH_EAST", "SOUTH_WEST", "ATTACK", "DEFEND", "SPECIAL_MOVE", "DIE",
        "REST", "SOUTH_IDLE", "NORTH_IDLE", "EAST_IDLE", "WEST_IDLE",
        "NORTH_EAST_IDLE", "NORTH_WEST_IDLE", "SOUTH_EAST_IDLE", "SOUTH_WEST_IDLE"];

    this.spriteGraphics.south = this._loadAnimation(this.animations[standardKeys[0]]);
    this.spriteGraphics.north = this._loadAnimation(this.animations[standardKeys[1]]);
    this.spriteGraphics.east = this._loadAnimation(this.animations[standardKeys[2]]);
    this.spriteGraphics.west = this._loadAnimation(this.animations[standardKeys[3]]);
    this.spriteGraphics.northEast = this._loadAnimation(this.animations[standardKeys[4]]);
    this.spriteGraphics.northWest = this._loadAnimation(this.animations[standardKeys[5]]);
    this.spriteGraphics.southEast = this._loadAnimation(this.animations[standardKeys[6]]);
    this.spriteGraphics.southWest = this._loadAnimation(this.animations[standardKeys[7]]);
    this.spriteGraphics.attack = this._loadAnimation(this.animations[standardKeys[8]]);
    this.spriteGraphics.defend = this._loadAnimation(this.animations[standardKeys[9]]);
    this.spriteGraphics.specialMove = this._loadAnimation(this.animations[standardKeys[10]]);
    this.spriteGraphics.die = this._loadAnimation(this.animations[standardKeys[11]]);
    this.spriteGraphics.rest = this._loadAnimation(this.animations[standardKeys[12]]);

    // Load up the idle animations.
    this.spriteGraphics.southIdle = this._loadAnimation(this.animations[standardKeys[13]]);
    this.spriteGraphics.northIdle = this._loadAnimation(this.animations[standardKeys[14]]);
    this.spriteGraphics.eastIdle = this._loadAnimation(this.animations[standardKeys[15]]);
    this.spriteGraphics.westIdle = this._loadAnimation(this.animations[standardKeys[16]]);
    this.spriteGraphics.northEastIdle = this._loadAnimation(this.animations[standardKeys[17]]);
    this.spriteGraphics.northWestIdle = this._loadAnimation(this.animations[standardKeys[18]]);
    this.spriteGraphics.southEastIdle = this._loadAnimation(this.animations[standardKeys[19]]);
    this.spriteGraphics.southWestIdle = this._loadAnimation(this.animations[standardKeys[20]]);

    // Get a copy of the animations for the next step;
    var animations = {};
    for (var animation in this.animations) {
        animations[animation] = this.animations[animation];
    }

    // Clear out the standard animations to get the custom ones.
    standardKeys.forEach(function (key) {
        delete animations[key];
    });

    // Load up the custom graphics.
    for (var animation in animations) {
        this.spriteGraphics.custom[animation] = this._loadAnimation(animations[animation]);
    }

    return this.loadFrames();
};

Sprite.prototype._loadAnimation = function (fileName) {
    if (fileName) {
        var animation = new Animation(PATH_ANIMATION + fileName);
        animation.boundingBox = {
            x: 0,
            y: 0,
            width: 30,
            height: 15
        };
        return animation;
    } else {
        return null;
    }
};

Sprite.prototype.loadFrames = function () {
    var frames = [];
    frames = frames.concat(this.spriteGraphics.north.frames);
    frames = frames.concat(this.spriteGraphics.south.frames);
    frames = frames.concat(this.spriteGraphics.east.frames);
    frames = frames.concat(this.spriteGraphics.west.frames);

    for (var customAnimation in this.spriteGraphics.custom) {
        if (this.spriteGraphics.custom.hasOwnProperty(customAnimation)) {
            frames = frames.concat(this.spriteGraphics.custom[customAnimation].frames);
        }
    }

    return frames;
};

Sprite.prototype.loadSoundEffects = function () {
    var soundEffects = {};
    soundEffects[this.spriteGraphics.north.soundEffect] = this.spriteGraphics.north.soundEffect;
    soundEffects[this.spriteGraphics.south.soundEffect] = this.spriteGraphics.south.soundEffect;
    soundEffects[this.spriteGraphics.east.soundEffect] = this.spriteGraphics.east.soundEffect;
    soundEffects[this.spriteGraphics.west.soundEffect] = this.spriteGraphics.west.soundEffect;

    for (var customAnimation in this.spriteGraphics.custom) {
        if (this.spriteGraphics.custom.hasOwnProperty(customAnimation)) {
            soundEffects[this.spriteGraphics.custom[customAnimation].soundEffect] = this.spriteGraphics.custom[customAnimation].soundEffect;
        }
    }

    delete soundEffects[""]; // TODO: need to make sure this can't happen.

    return soundEffects;
};

Sprite.prototype.setReady = function () {
    console.log("setting ready");
    this.spriteGraphics.active = this.spriteGraphics.south;
    this.renderReady = true;
//  var e = {ctx: Crafty.canvasLayer.context};
//  Crafty.trigger("Draw", e);
};

Sprite.prototype.animate = function (step) {
    this.spriteGraphics.elapsed += step;

    if (this.spriteGraphics.elapsed >= this.spriteGraphics.active.frameRate) {
        this.spriteGraphics.elapsed = this.spriteGraphics.elapsed - this.spriteGraphics.active.frameRate;
        var frame = this.spriteGraphics.frameIndex + 1;
        if (frame < this.spriteGraphics.active.frames.length) {
            this.spriteGraphics.frameIndex = frame;
        } else {
            this.spriteGraphics.frameIndex = 0;
        }
    }
};

Sprite.prototype.changeGraphics = function (direction) {
    this.spriteGraphics.elapsed = 0;
    this.spriteGraphics.frameIndex = 0;

    switch (direction) {
        case this.DirectionEnum.NORTH:
            this.spriteGraphics.active = this.spriteGraphics.north;
            break;
        case this.DirectionEnum.SOUTH:
            this.spriteGraphics.active = this.spriteGraphics.south;
            break;
        case this.DirectionEnum.EAST:
            this.spriteGraphics.active = this.spriteGraphics.east;
            break;
        case this.DirectionEnum.WEST:
            this.spriteGraphics.active = this.spriteGraphics.west;
            break;
        case this.DirectionEnum.NORTH_EAST:
            this.spriteGraphics.active = this.grapics.northEast;
            break;
        case this.DirectionEnum.NORTH_WEST:
            this.spriteGraphics.active = this.spriteGraphics.northWest;
            break;
        case this.DirectionEnum.SOUTH_EAST:
            this.spriteGraphics.active = this.spriteGraphics.southEast;
            break;
        case this.DirectionEnum.SOUTH_WEST:
            this.spriteGraphics.active = this.spriteGraphics.southWest;
            break;
        default:
            this.spriteGraphics.active = this.spriteGraphics.custom[direction];
    }
};

Sprite.prototype.checkCollisions = function (collision, entity) {
    var object = collision.obj;
    switch (object.vectorType) {
        case "item":
            entity.x += collision.normal.x;
            entity.y += collision.normal.y;

            if (object.sprite.activationProgram) {
                rpgtoolkit.runProgram(PATH_PROGRAM.concat(object.sprite.activationProgram), object);
            }

            entity.resetHitChecks();
            break;
        case "program":
            rpgtoolkit.runProgram(object.fileName, entity);
            break;
        case "SOLID":
            entity.x += collision.normal.x;
            entity.y += collision.normal.y;
            entity.resetHitChecks();
            break;
        case "PASSABLE":
            break;
    }
    
    var events = object.events;
    events.forEach(function(event) {
        if (event.program) {
            rpgtoolkit.runProgram(PATH_PROGRAM.concat(event.program), object);
        }
    });
};