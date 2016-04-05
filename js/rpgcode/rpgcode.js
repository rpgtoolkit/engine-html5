function rpgcode() {
  this.api = {
    getGlobal: this.getGlobal,
    getRenderNowCanvas: this.getRenderNowCanvas,
    loadAssets: this.loadAssets,
    log: this.log,
    pixelText: this.pixelText,
    removeAssets: this.removeAssets,
    renderNowCanvas: this.renderNowCanvas,
    sendToBoard: this.sendToBoard,
    setColor: this.setColor,
    setGlobal: this.setGlobal,
    setImage: this.setImage
  };
  this.canvases = {"renderNowCanvas": rpgtoolkit.screen.renderNowCanvas};
  this.globals = {"swordactive": false};
  this.rgba = {r: 255, g: 255, b: 255, a: 1.0};
  this.font = "14px Arial";
}

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
  var canvas = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (canvas) {
    var context = canvas.getContext("2d");
    var rgba = rpgtoolkit.rpgcodeApi.rgba;
    context.fillStyle = "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + rgba.a + ")";
    context.font = rpgtoolkit.rpgcodeApi.font;
    context.fillText(text, x, y);
  }
};

rpgcode.prototype.removeAssets = function (assets) {
  Crafty.removeAssets(assets);
};

rpgcode.prototype.renderNowCanvas = function () {
  rpgtoolkit.screen.isRenderNow = true;
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
  var canvas = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (canvas) {
    var image = Crafty.asset(Crafty.__paths.images + fileName);
    if (image) {
      var context = canvas.getContext("2d");
      context.drawImage(image, x, y, width, height);
    }
  }
};


