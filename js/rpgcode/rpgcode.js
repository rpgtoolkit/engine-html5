/* global rpgtoolkit */

function rpgcode() {
  this.api = {
    animateItem: this.animateItem,
    animatePlayer: this.animatePlayer,
    clearCanvas: this.clearCanvas,
    clearDialog: this.clearDialog,
    createCanvas: this.createCanvas,
    delay: this.delay,
    destroyCanvas: this.destroyCanvas,
    destroyItem: this.destroyItem,
    drawOntoCanvas: this.drawOntoCanvas,
    drawText: this.drawText,
    fillRect: this.fillRect,
    getBoardName: this.getBoardName,
    getGlobal: this.getGlobal,
    getPlayerDirection: this.getPlayerDirection,
    getPlayerLocation: this.getPlayerLocation,
    loadAssets: this.loadAssets,
    log: this.log,
    playSound: this.playSound,
    pushItem: this.pushItem,
    pushPlayer: this.pushPlayer,
    registerKeyDown: this.registerKeyDown,
    registerKeyUp: this.registerKeyUp,
    removeAssets: this.removeAssets,
    renderNow: this.renderNow,
    replaceTile: this.replaceTile,
    sendToBoard: this.sendToBoard,
    setColor: this.setColor,
    setGlobal: this.setGlobal,
    setImage: this.setImage,
    setDialogGraphics: this.setDialogGraphics,
    setItemLocation: this.setItemLocation,
    setItemStance: this.setItemStance,
    setPlayerLocation: this.setPlayerLocation,
    setPlayerStance: this.setPlayerStance,
    showDialog: this.showDialog,
    stopSound: this.stopSound,
    unregisterKeyDown: this.unregisterKeyDown,
    unregisterKeyUp: this.unregisterKeyUp
  };

  this.source = {}; // The entity that triggered the program.

  this.canvases = {"renderNowCanvas": {
      canvas: rpgtoolkit.screen.renderNowCanvas,
      render: false
    }
  };

  this.globals = {};

  this.rgba = {r: 255, g: 255, b: 255, a: 1.0};
  this.font = "14px Arial";

  this.dialogWindow = {
    visible: false,
    profile: null,
    background: null,
    lineY: 5
  };
}

/**
 * Play the items current animation.
 * 
 * @param {type} itemId
 * @returns {undefined}
 */
rpgcode.prototype.animateItem = function (itemId) {
  var item = rpgtoolkit.craftyBoard.board.sprites[itemId];
  if (item) {
    
  }
};

/**
 * Play the players current animation.
 * 
 * @param {type} playerId
 * @returns {undefined}
 */
rpgcode.prototype.animatePlayer = function (playerId) {
    // TODO: playerId will be unused until parties with multiple players 
    // are supported.
    var player = rpgtoolkit.craftyPlayer.player;
    var activeGraphics = player.graphics.active;
    var frameRate = activeGraphics.frameRate;
    var delay = frameRate * 1000; // Get number of milliseconds.
    var repeat = activeGraphics.frames.length - 1;
    Crafty.e("Delay").delay(function() {
      player.animate(frameRate);
      Crafty.trigger("Invalidate");
    }, delay, repeat);
};

/**
 * Clears an entire canvas and triggers a redraw.
 * 
 * @param {type} canvasId the canvas to clear if undefined defaults to "renderNowCanas"
 * @returns {undefined}
 */
rpgcode.prototype.clearCanvas = function (canvasId) {
  if (!canvasId) {
    canvasId = "renderNowCanvas";
  }

  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var canvas = instance.canvas;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    instance.render = false;
    Crafty.trigger("Invalidate");
  }
};

/**
 * Clears and hides the dialog box.
 * 
 * @returns {undefined}
 */
rpgcode.prototype.clearDialog = function () {
  var rpgcode = rpgtoolkit.rpgcodeApi;
  rpgcode.dialogWindow.visible = false;
  rpgcode.dialogWindow.lineY = 5;
  rpgcode.clearCanvas("renderNowCanvas");
};

/**
 * Creates a canvas with the specified width, height, and ID. This canvas will not
 * be drawn until renderNow is called with its ID.
 * 
 * @param {type} width in pixels
 * @param {type} height in pixels
 * @param {type} canvasId a unique identifier
 * @returns {undefined}
 */
rpgcode.prototype.createCanvas = function (width, height, canvasId) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  rpgtoolkit.rpgcodeApi.canvases[canvasId] = {canvas: canvas, render: false};
};

/**
 * Delays a program for a specified number of milliseconds, after which the 
 * callback function is invoked.
 * 
 * @param {type} ms time to wait in milliseconds
 * @param {type} callback function to execute after the delay
 * @returns {undefined}
 */
rpgcode.prototype.delay = function (ms, callback) {
  Crafty.e("Delay").delay(callback, ms);
};

/**
 * Destroys the canvas.
 * 
 * @param {type} canvasId canvas to destroy
 * @returns {undefined}
 */
rpgcode.prototype.destroyCanvas = function (canvasId) {
  delete rpgtoolkit.rpgcodeApi.canvases[canvasId];
};

/**
 * Destroys a particular item instance and removes it from play.
 * 
 * @param {type} itemId
 * @returns {undefined}
 */
rpgcode.prototype.destroyItem = function (itemId) {
  var len = rpgtoolkit.craftyBoard.sprites.length;
  var index = -1;
  
  // TODO: store sprites based on item name if it is unique enough.
  for (var i = 0; i < len; i++) {
    if (rpgtoolkit.craftyBoard.sprites[i].item.name === itemId) {
      index = i;
      break;
    }
  }
  
  if (index > 0) {
    delete rpgtoolkit.craftyBoard.sprites[index];
    Crafty.trigger("Invalidate");
  }
};

/**
 * 
 * 
 * @param {type} sourceId
 * @param {type} x
 * @param {type} y
 * @param {type} width
 * @param {type} height
 * @param {type} targetId
 * @returns {undefined}
 */
rpgcode.prototype.drawOntoCanvas = function (sourceId, x, y, width, height, targetId) {
  var source = rpgtoolkit.rpgcodeApi.canvases[sourceId];
  var target = rpgtoolkit.rpgcodeApi.canvases[targetId];

  if (source && target) {
    var sourceCanvas = source.canvas;
    var targetContext = target.canvas.getContext("2d");
    targetContext.drawImage(sourceCanvas, x, y, width, height);
  }
};

/**
 * Draws the text on the canvas startig at the specified (x, y) position, if no 
 * canvas is specified it defaults to the "renderNowCanvas".
 * 
 * @param {type} x
 * @param {type} y
 * @param {type} text
 * @param {type} canvasId
 * @returns {undefined}
 */
rpgcode.prototype.drawText = function (x, y, text, canvasId) {
  if (!canvasId) {
    canvasId = "renderNowCanvas";
  }

  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var context = instance.canvas.getContext("2d");
    var rgba = rpgtoolkit.rpgcodeApi.rgba;
    context.fillStyle = "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
    context.font = rpgtoolkit.rpgcodeApi.font;
    context.fillText(text, x, y);
  }
};

/**
 * Fills a solid rectangle on the canvas.
 * 
 * @param {type} x start x postion
 * @param {type} y start y postion
 * @param {type} width 
 * @param {type} height
 * @param {type} canvasId canvas to draw on
 * @returns {undefined}
 */
rpgcode.prototype.fillRect = function (x, y, width, height, canvasId) {
  if (!canvasId) {
    canvasId = "renderNowCanvas";
  }

  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var context = instance.canvas.getContext("2d");
    var rgba = rpgtoolkit.rpgcodeApi.rgba;
    context.fillStyle = "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
    context.fillRect(x, y, width, height);
  }
};

/**
 * Gets the current board's file name and returns it to the callback function.
 * 
 * @param {type} callback
 * @returns {undefined}
 */
rpgcode.prototype.getBoardName = function(callback) {
  if (callback) {
    callback(rpgtoolkit.craftyBoard.board.filename);
  }
};

/**
 * Gets a global variable and returns it to the callback.
 * 
 * @param {type} id variable ID
 * @param {type} callback function to invoke
 * @returns {undefined}
 */
rpgcode.prototype.getGlobal = function (id, callback) {
  callback(rpgtoolkit.rpgcodeApi.globals[id]);
};

/**
 * Gets the player's current direction and returns it to the callback.
 * 
 * @param {type} callback function to invoke
 * @returns {undefined}
 */
rpgcode.prototype.getPlayerDirection = function (callback) {
  callback(rpgtoolkit.craftyPlayer.player.direction);
};

/**
 * Gets the player's current location (in tiles) and returns it to the callback.
 * 
 * @param {type} callback function to invoke
 * @returns {undefined}
 */
rpgcode.prototype.getPlayerLocation = function (callback) {
  var instance = rpgtoolkit.craftyPlayer;
  callback(instance.x / rpgtoolkit.tileSize,
          instance.y / rpgtoolkit.tileSize,
          instance.player.layer);
};

/**
 * Loads the requested assets into the engine, when all of the assets have been loaded
 * the onLoad callback is invoked.
 * 
 * @param {type} assets 
 * @param {type} onLoad callback to invoke after assets are loaded
 * @returns {undefined}
 */
rpgcode.prototype.loadAssets = function (assets, onLoad) {
  // If the assets already exist Crafty just ignores 
  // them but still invokes the callback.
  Crafty.load(assets, onLoad);
};

/**
 * Log a message to the console.
 * 
 * @param {type} message message to log
 * @returns {undefined}
 */
rpgcode.prototype.log = function (message) {
  console.log(message);
};

/**
 * Plays the supplied sound file, up to five sound channels can be active at once. 
 * 
 * @param {type} file 
 * @param {type} loop 
 * @returns {undefined}
 */
rpgcode.prototype.playSound = function (file, loop) {
  var count = loop ? -1 : 1;
  Crafty.audio.play(file, count);
};

/**
 * Pushs the item by 8 pixels in the given direction.
 * 
 * @param {type} item
 * @param {type} direction
 * @returns {undefined}
 */
rpgcode.prototype.pushItem = function (item, direction) {
  switch (item) {
    case "source":
      rpgtoolkit.rpgcodeApi.source.move(direction, 8);
      break;
  }
};

/**
 * Pushs the player by 8 pixels in the given direction.
 * 
 * @param {type} direction
 * @returns {undefined}
 */
rpgcode.prototype.pushPlayer = function (direction) {
  rpgtoolkit.craftyPlayer.move(direction, 8);
};

/**
 * Registers a keyDown listener for a specific key, for a list of valid key values see:
 *    http://craftyjs.com/api/Crafty-keys.html
 *    
 * The callback function will continue to be invoked for every keyDown event until it
 * is unregistered.
 * 
 * @param {type} key
 * @param {type} callback
 * @returns {undefined}
 */
rpgcode.prototype.registerKeyDown = function (key, callback) {
  rpgtoolkit.keyboardHandler.downHandlers[Crafty.keys[key]] = callback;
};

/**
 * Registers a keyUp listener for a specific key, for a list of valid key values see:
 *    http://craftyjs.com/api/Crafty-keys.html
 *    
 * The callback function will continue to be invoked for every keyUp event until it
 * is unregistered.
 * 
 * @param {type} key
 * @param {type} callback
 * @returns {undefined}
 */
rpgcode.prototype.registerKeyUp = function (key, callback) {
  rpgtoolkit.keyboardHandler.upHandlers[Crafty.keys[key]] = callback;
};

/**
 * Removes assets from the engine.
 * 
 * @param {type} assets
 * @returns {undefined}
 */
rpgcode.prototype.removeAssets = function (assets) {
  Crafty.removeAssets(assets);
};

/**
 * Renders the specified canvas, if none then the "renderNowCanvas" is shown.
 * 
 * @param {type} canvasId
 * @returns {undefined}
 */
rpgcode.prototype.renderNow = function (canvasId) {
  if (!canvasId) {
    canvasId = "renderNowCanvas";
  }

  var canvas = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (canvas) {
    canvas.render = true;
    Crafty.trigger("Invalidate");
  }
};

/**
 * Replaces a tile at the supplied (x, y, z) position.
 * 
 * @param {type} tileX
 * @param {type} tileY
 * @param {type} layer
 * @param {type} tileName
 * @returns {undefined}
 */
rpgcode.prototype.replaceTile = function (tileX, tileY, layer, tileName) {
  var index = rpgtoolkit.craftyBoard.board.tileNames.indexOf(tileName);
  if (index === -1) {
    index = rpgtoolkit.craftyBoard.board.tileNames.push(tileName);
  } else {
    index += 1;
  }
  rpgtoolkit.craftyBoard.board.tiles[layer][tileY][tileX] = index;
  rpgtoolkit.craftyBoard.board.layerCache = []; // TODO: Very expensive.
};

/**
 * Sends the player to a board and places them at the given (x, y) position in tiles.
 * 
 * @param {type} boardName
 * @param {type} tileX
 * @param {type} tileY
 * @returns {undefined}
 */
rpgcode.prototype.sendToBoard = function (boardName, tileX, tileY) {
  rpgtoolkit.switchBoard(boardName, tileX, tileY);
};

/**
 * Sets the RGBA color for all drawing operations to use.
 * 
 * @param {type} r
 * @param {type} g
 * @param {type} b
 * @param {type} a
 * @returns {undefined}
 */
rpgcode.prototype.setColor = function (r, g, b, a) {
  rpgtoolkit.rpgcodeApi.rgba = {r: r, g: g, b: b, a: a};
};

/**
 * Sets a global value in the engine, if it doesn't exist it is created.
 * 
 * @param {type} id
 * @param {type} value
 * @returns {undefined}
 */
rpgcode.prototype.setGlobal = function (id, value) {
  rpgtoolkit.rpgcodeApi.globals[id] = value;
};

/**
 * Sets an image on the canvas.
 * 
 * @param {type} fileName
 * @param {type} x
 * @param {type} y
 * @param {type} width
 * @param {type} height
 * @param {type} canvasId
 * @returns {undefined}
 */
rpgcode.prototype.setImage = function (fileName, x, y, width, height, canvasId) {
  if (!canvasId) {
    canvasId = "renderNowCanvas";
  }

  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var image = Crafty.asset(Crafty.__paths.images + fileName);
    if (image) {
      var context = instance.canvas.getContext("2d");
      context.drawImage(image, x, y, width, height);
    }
  }
};

/**
 * Sets the dialog box's speaker profile image and the background image.
 * 
 * @param {type} profileImage
 * @param {type} backgroundImage
 * @returns {undefined}
 */
rpgcode.prototype.setDialogGraphics = function (profileImage, backgroundImage) {
  rpgtoolkit.rpgcodeApi.dialogWindow.profile = profileImage;
  rpgtoolkit.rpgcodeApi.dialogWindow.background = backgroundImage;
};

/**
 * 
 * @param {type} itemId
 * @param {type} x
 * @param {type} y
 * @param {type} layer
 * @param {type} isTiles
 * @returns {undefined}
 */
rpgcode.prototype.setItemLocation = function (itemId, x, y, layer, isTiles) {
  if (isTiles) {
    x *= rpgtoolkit.tileSize;
    y *= rpgtoolkit.tileSize;
  }
  
  var item = rpgtoolkit.craftyBoard.board.sprites[itemId];
  if (item) {
    item.x = x;
    item.y = y;
    item.layer = layer;
    Crafty.trigger("Invalidate");
  }
};

/**
 * 
 * @param {type} itemId
 * @param {type} stanceId
 * @returns {undefined}
 */
rpgcode.prototype.setItemStance = function (itemId, stanceId) {
  var item = rpgtoolkit.craftyBoard.board.sprites[itemId];
  if (item) {
    item.changeGraphics(stanceId);
  }
};

/**
 * Sets the players location without triggering any animation.
 * 
 * @param {type} playerId
 * @param {type} x
 * @param {type} y
 * @param {type} layer
 * @param {type} isTiles
 * @returns {undefined}
 */
rpgcode.prototype.setPlayerLocation = function (playerId, x, y, layer, isTiles) {
  if (isTiles) {
    x *= rpgtoolkit.tileSize;
    y *= rpgtoolkit.tileSize;
  }
  
  // TODO: playerId will be unused until parties with multiple players 
  // are supported.
  rpgtoolkit.craftyPlayer.x = x;
  rpgtoolkit.craftyPlayer.y = y;
  rpgtoolkit.craftyPlayer.player.layer = layer;
};

/**
 * 
 * @param {type} playerId
 * @param {type} stanceId
 * @returns {undefined}
 */
rpgcode.prototype.setPlayerStance = function (playerId, stanceId) {
  // TODO: playerId will be unused until parties with multiple players 
  // are supported.
  rpgtoolkit.craftyPlayer.player.changeGraphics(stanceId);
  Crafty.trigger("Invalidate");
};

/**
 * Shows the dialog window and adds the dialog to it if it is already 
 * visible the dialog is just appended.
 * 
 * Note the dialog window is drawn on the default "renderNowCanvas".
 * 
 * @param {type} dialog
 * @returns {undefined}
 */
rpgcode.prototype.showDialog = function (dialog) {
  var rpgcode = rpgtoolkit.rpgcodeApi;
  var dialogWindow = rpgcode.dialogWindow;

  if (!dialogWindow.visible) {
    rpgcode.setImage(dialogWindow.profile, 0, 0, 100, 100);
    rpgcode.setImage(dialogWindow.background, 100, 0, 540, 100);
    dialogWindow.visible = true;

  }

  dialogWindow.lineY += parseInt(rpgcode.font);
  rpgcode.drawText(105, dialogWindow.lineY, dialog);
  rpgcode.renderNow();
};

/**
 * Stop playing a specific sound file, if no file is set stop
 * all sounds.
 * 
 * @param {type} file
 * @returns {undefined}
 */
rpgcode.prototype.stopSound = function (file) {
  if (file) {
    Crafty.audio.stop(file);
  } else {
    Crafty.audio.stop();
  }
};

/**
 * Removes a previously registered keyDown listener.
 * 
 * @param {type} key
 * @returns {undefined}
 */
rpgcode.prototype.unregisterKeyDown = function (key) {
  delete rpgtoolkit.keyboardHandler.downHandlers[Crafty.keys[key]];
};

/**
 * Removes a previously registered keyUp listener.
 * 
 * @param {type} key
 * @returns {undefined}
 */
rpgcode.prototype.unregisterKeyUp = function (key) {
  delete rpgtoolkit.keyboardHandler.upHandlers[Crafty.keys[key]];
};