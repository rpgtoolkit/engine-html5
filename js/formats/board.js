function board(filename) {
  // synchronous request for binary
  var req = new XMLHttpRequest();
  req.open("GET", filename, false);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.send(null);
  
  var board = JSON.parse(req.responseText);
  board.tiles = [];

  var skipTiles = 0, tileIndex = 0;

  // loop through layers
  for (var layer = 0; layer < board.layerCount; layer++) {
    var currentLayer = [];

    // y axis
    for (var y = 0; y < board.height; y++) {
      var currentColumn = [];

      // x axis
      for (var x = 0; x < board.width; x++) {

        // if still repeating for X tiles
        if (skipTiles > 0) {
          skipTiles -= 1;
          currentColumn.push(tileIndex);
        } else {
          // get tile
          tileIndex = board.tileIndex.shift();

          // if tile is less than -X, means we're repeating the next tile for (-X) -1
          if (tileIndex < 0) {
            skipTiles = (-tileIndex) - 1;

            // get tile to be repeated
            tileIndex = board.tileIndex.shift();
          }
          
          currentColumn.push(tileIndex);
        }
      }
      
      currentLayer.push(currentColumn);
    }

    board.tiles.push(currentLayer);
  }

  return board;
}