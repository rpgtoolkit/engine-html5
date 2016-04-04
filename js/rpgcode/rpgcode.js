function rpgcode() {
  this.api = {
    getGlobal: this.getGlobal,
    getRenderNowCanvas: this.getRenderNowCanvas,
    log: this.log,
    pixelText: this.pixelText,
    renderNowCanvas: this.renderNowCanvas,
    sendToBoard: this.sendToBoard,
    setColor: this.setColor,
    setGlobal: this.setGlobal,
    setImage: this.setImage
  };
  this.canvases = {"renderNowCanvas": rpgtoolkit.screen.renderNowCanvas};
  this.globals = {"swordactive": false};
}

rpgcode.prototype.getGlobal = function (id, callback) {
  callback(rpgtoolkit.rpgcodeApi.globals[id]);
};

rpgcode.prototype.getRenderNowCanvas = function (callback) {
  callback("renderNowCanvas"); // Can only pass an id.
};

rpgcode.prototype.log = function (message) {
  console.log(message);
};

rpgcode.prototype.pixelText = function () {

};

rpgcode.prototype.renderNowCanvas = function () {
  rpgtoolkit.screen.isRenderNow = true;
};

rpgcode.prototype.sendToBoard = function (boardName, tileX, tileY) {
  rpgtoolkit.switchBoard(boardName, tileX, tileY);
};

rpgcode.prototype.setColor = function (r, g, b, a) {

};

rpgcode.prototype.setGlobal = function (id, value) {
  rpgtoolkit.rpgcodeApi.globals[id] = value;
};

rpgcode.prototype.setImage = function (fileName, x, y, width, height, canvasId) {
  var canvas = rpgtoolkit.rpgcodeApi.canvases[canvasId];
  if (canvas) {
    var image = new Image();
    image.onload = function () {
      var context = canvas.getContext("2d");
      context.drawImage(image, x, y, width, height);
    };
    image.src = PATH_BITMAP + fileName;
  }
};


