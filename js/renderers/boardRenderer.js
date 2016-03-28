function boardRenderer(board) {
  this.board = board;
  this.tilesets = {};
}

boardRenderer.prototype.render = function (cnv) {
  var cnv = cnv || document.createElement("canvas");

  cnv.width = this.board.width * 32;
  cnv.height = this.board.height * 32;

  var context = cnv.getContext("2d");

  var layer, row, tile, data, renderer;

  // loop through layers
  for (var i = 0; i < this.board.layerCount; i++) {
    layer = this.board.tiles[i];

    // y axis
    for (var y = 0; y < layer.length; y++) {
      row = layer[y];

      // x axis
      for (var x = 0; x < row.length; x++) {
        tile = row[x];

        if (tile) {
          // extract data (filename and index)
          data = this.getTileData(tile);

          // load tileset
          if (this.tilesets[data.tileset] === undefined) {
            this.tilesets[data.tileset] = new tileset(PATH_TILESET + data.tileset);
          }

          renderer = new tilesetRenderer(this.tilesets[data.tileset]);

          // render tile to board canvas
          renderer.renderTile(context, data['tile'] - 1, x * 32, y * 32);
        }
      }
    }
  }

  return cnv;
};

boardRenderer.prototype.getTileData = function (source) {
  var splitPoint = source.indexOf(".tst") + 4;
  return {
    tileset: source.substring(0, splitPoint),
    tile: source.substring(splitPoint)
  };
};