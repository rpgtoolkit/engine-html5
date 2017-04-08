/* global rpgtoolkit */

function Board(filename) {
    // TODO: Make the changes here that chrome suggests.
    var req = new XMLHttpRequest();
    req.open("GET", filename, false);
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send(null);

    var board = JSON.parse(req.responseText);
    for (var property in board) {
        this[property] = board[property];
    }

    this.tiles = [];
    this.layerCache = [];
    this.filename = filename;
}

Board.prototype.setReady = function () {
    rpgtoolkit.craftyBoard.show = true;

    if (this.backgroundMusic) {
        rpgtoolkit.playSound(this.backgroundMusic, -1);
    }
};

Board.prototype.generateLayerCache = function () {
    this.layerCache = [];

    // Loop through layers
    var board = this;
    this.layers.forEach(function (layer) {
        var cnvLayer = document.createElement("canvas");
        cnvLayer.width = board.width * board.tileWidth;
        cnvLayer.height = board.height * board.tileHeight;
        var context = cnvLayer.getContext("2d");

        // Render the layer tiles
        var tiles = layer.tiles.slice();
        for (var y = 0; y < board.height; y++) {
            for (var x = 0; x < board.width; x++) {
                var tile = tiles.shift().split(":");
                var tileSetIndex = tile[0];
                var tileIndex = tile[1];

                var tileSet = board.tileSets[tileSetIndex];
                var renderer = new TilesetRenderer(rpgtoolkit.tilesets[tileSet]);

                // Render tile to board canvas
                renderer.renderTile(
                        context, tileIndex,
                        x * board.tileWidth, y * board.tileHeight);
            }
        }

        board.layerCache.push(cnvLayer);
    });
};
  