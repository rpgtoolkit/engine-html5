function Tileset(filename) {
    // TODO: Make the changes here that chrome suggests.
    var req = new XMLHttpRequest();
    req.open("GET", filename, false);
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send(null);

    var tileSet = JSON.parse(req.responseText);
    this.images = tileSet.images;
    this.tileWidth = tileSet.tileWidth;
    this.tileHeight = tileSet.tileHeight;
}

Tileset.prototype.load = function () {
    this.img = Crafty.assets[this.images[0]];

    this.tileRows = Math.floor(this.img.height / this.tileHeight);
    this.tileColumns = Math.floor(this.img.width / this.tileWidth);
    this.count = this.tileRows * this.tileColumns;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.drawImage(this.img, 0, 0);
};

Tileset.prototype.getTile = function (index) {
    // Converted 1D index to 2D cooridnates.
    var x = index % this.tileColumns;
    var y = Math.floor(index / this.tileColumns);

    var tile = this.ctx.getImageData(
            x * this.tileWidth, y * this.tileHeight, 
            this.tileWidth, this.tileHeight);

    return tile;
};