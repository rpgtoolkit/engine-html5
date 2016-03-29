function screenRenderer(board) {
  this.board = board;
  this.tilesets = {};
}

screenRenderer.prototype.render = function (cnv) {
  var cnv = cnv || document.createElement("canvas");

  cnv.width = this.board.width * 32;
  cnv.height = this.board.height * 32;

  var context = cnv.getContext("2d");

  // Draw a black background.  
  context.fillStyle = "#000000";
  context.fillRect(0, 0, cnv.width, cnv.height);

  var layer, row, tile, source, data, renderer;

  // Loop through layers.
  for (var i = 0; i < this.board.layerCount; i++) {
    layer = this.board.tiles[i];

    /*
     * Step 1: Render this layer's tiles. 
     */
    // y axis
    for (var y = 0; y < layer.length; y++) {
      row = layer[y];

      // x axis
      for (var x = 0; x < row.length; x++) {
        tile = row[x] - 1;

        if (tile > -1) {
          source = this.board.tileNames[tile];

          if (source) {
            // extract data (filename and index)
            data = this.getTileData(source);

            // load tileset
            if (this.tilesets[data.tileset] === undefined) {
              this.tilesets[data.tileset] = new tileset(PATH_TILESET + data.tileset);
            }

            renderer = new tilesetRenderer(this.tilesets[data.tileset]);

            // render tile to board canvas
            renderer.renderTile(context, data["tile"] - 1, x * 32, y * 32);
          }
        }
      }
    }

    /*
     * Step 2: Render items.
     */
    // TODO: render any items on this layer.

    /*
     * Step 3: Render npcs.
     */
    // TODO: render any npcs on this layer.

    /*
     * Step 4: Render the player above everything on this layer.
     */
    // TODO: if the player is on this layer render them now.
    if (player.layer === i) {
      // Draw a black background.  
      context.fillStyle = "#FFFFFF";
      context.drawImage(
              player.graphics.south.frames[player.graphics.frameIndex],
              player.x,
              player.y,
              player.graphics.south.animationWidth,
              player.graphics.south.animationHeight);
    }
  }

  /*
   * Step 5: Message windows etc?
   */
  // TODO: figure out how message windows and menus will be rendered.

  return cnv;
};

screenRenderer.prototype.getTileData = function (source) {
  var splitPoint = source.indexOf(".tst") + 4;
  return {
    tileset: source.substring(0, splitPoint),
    tile: source.substring(splitPoint)
  };
};