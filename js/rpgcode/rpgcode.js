function rpgcode() {
  this.api = {
    clear: this.clear,
    getGlobal: this.getGlobal,
    getRenderNowCanvas: this.getRenderNowCanvas,
    loadAssets: this.loadAssets,
    log: this.log,
    pixelText: this.pixelText,
    removeAssets: this.removeAssets,
    renderNow: this.renderNow,
    replaceTile: this.replaceTile,
    sendToBoard: this.sendToBoard,
    setColor: this.setColor,
    setGlobal: this.setGlobal,
    setImage: this.setImage
  };
  this.canvases = {"renderNowCanvas": {
      canvas: rpgtoolkit.screen.renderNowCanvas,
      render: false
    }
  };
  this.globals = {};
  this.rgba = {r: 255, g: 255, b: 255, a: 1.0};
  this.font = "14px Arial";
}

rpgcode.prototype.clear = function (canvasId) {
  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var canvas = instance.canvas;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    instance.render = false;
    Crafty.trigger("Invalidate");
  }
};

rpgcode.prototype.getGlobal = function (id, callback) {
  callback(rpgtoolkit.rpgcodeApi.globals[id]);
};

rpgcode.prototype.getRenderNowCanvas = function (callback) {
  callback("renderNowCanvas"); // Can only pass an id.
};

rpgcode.prototype.loadAssets = function (assets, onLoad) {
  // If the assets already exist Crafty just ignores 
  // them but still invokes the callback.
  Crafty.load(assets, onLoad);
};

rpgcode.prototype.log = function (message) {
  console.log(message);
};

rpgcode.prototype.pixelText = function (x, y, text, canvasId) {
  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var context = instance.canvas.getContext("2d");
    var rgba = rpgtoolkit.rpgcodeApi.rgba;
    context.fillStyle = "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
    context.font = rpgtoolkit.rpgcodeApi.font;
    context.fillText(text, x, y);
  }
};

rpgcode.prototype.removeAssets = function (assets) {
  Crafty.removeAssets(assets);
};

rpgcode.prototype.renderNow = function (canvasId) {
  var canvas = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (canvas) {
    canvas.render = true;
    Crafty.trigger("Invalidate");
  }
};

rpgcode.prototype.replaceTile = function(tileX, tileY, layer, tileName) {
  var index = rpgtoolkit.craftyBoard.tileNames.indexOf(tileName);
  if (index === -1) {
    index = rpgtoolkit.craftyBoard.tileNames.push(tileName);
  } else {
    index += 1;
  }
  rpgtoolkit.craftyBoard.tiles[layer][tileY][tileX] = index;
  rpgtoolkit.craftyBoard.layerCache = []; // TODO: Very expensive.
};

rpgcode.prototype.sendToBoard = function (boardName, tileX, tileY) {
  rpgtoolkit.switchBoard(boardName, tileX, tileY);
};

rpgcode.prototype.setColor = function (r, g, b, a) {
  rpgtoolkit.rpgcodeApi.rgba = {r: r, g: g, b: b, a: a};
};

rpgcode.prototype.setGlobal = function (id, value) {
  rpgtoolkit.rpgcodeApi.globals[id] = value;
};

rpgcode.prototype.setImage = function (fileName, x, y, width, height, canvasId) {
  var instance = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (instance) {
    var image = Crafty.asset(Crafty.__paths.images + fileName);
    if (image) {
      var context = instance.canvas.getContext("2d");
      context.drawImage(image, x, y, width, height);
    }
  }
};