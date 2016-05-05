function screenRenderer() {
  this.renderNowCanvas = document.createElement("canvas");
  this.renderNowCanvas.width = Crafty.viewport._width;
  this.renderNowCanvas.height = Crafty.viewport._height;
}

screenRenderer.prototype.render = function (context) {
  var x = -Crafty.viewport._x;
  var y = -Crafty.viewport._y;
  var width = Crafty.viewport._width;
  var height = Crafty.viewport._height;

  var player = rpgtoolkit.craftyPlayer.player;
  player.x = rpgtoolkit.craftyPlayer.x;
  player.y = rpgtoolkit.craftyPlayer.y;

  if (rpgtoolkit.craftyBoard.show) {
    this.board = rpgtoolkit.craftyBoard.board;

    // Draw a black background.  
    context.fillStyle = "#000000";
    context.fillRect(x, y, width, height);

    if (!this.board.layerCache.length) {
      this.board.generateLayerCache();
    }

    var layer, row, tile, source, data, renderer;

    // Loop through layers.
    for (var i = 0; i < this.board.layerCount; i++) {
      layer = this.board.tiles[i];

      /*
       * Render this layer. 
       */
      context.drawImage(this.board.layerCache[i], x, y, width, height, x, y, width, height);

      var layerSprites = [];
      if (player.layer === i && player.renderReady) {
        layerSprites.push(player);
      }

      /*
       * Render items.
       */
      this.board.sprites.forEach(function (entity) {
        var sprite = entity.sprite;
        var item = sprite.item;
        if (i === sprite.layer && item.renderReady) {
          sprite.item.x = entity.x;
          sprite.item.y = entity.y;
          layerSprites.push(sprite.item);
        }
      });
      
      layerSprites.sort(function(a, b) {
         return a.y - b.y;
      });

      layerSprites.forEach(function (sprite) {
        var asset = Crafty.__paths.images + 
                sprite.graphics.active.frames[sprite.graphics.frameIndex];
        var frame = Crafty.assets[asset];
        context.drawImage(
                frame,
                sprite.x - (frame.width / 2),
                sprite.y - frame.height,
                sprite.graphics.active.animationWidth,
                sprite.graphics.active.animationHeight);
      });

      /*
       * Render npcs.
       */
      // TODO: render any npcs on this layer.

      /*
       * Render the player above everything on this layer.
       */
//      var player = rpgtoolkit.craftyPlayer.player;
//      if (player.layer === i && player.renderReady) {
//        var asset = Crafty.__paths.images + player.graphics.active.frames[player.graphics.frameIndex];
//        var frame = Crafty.assets[asset];
//        context.drawImage(
//                frame,
//                rpgtoolkit.craftyPlayer.x - (frame.width / 2),
//                rpgtoolkit.craftyPlayer.y - frame.height,
//                player.graphics.active.animationWidth,
//                player.graphics.active.animationHeight);
//
//        // Draw player collision rectangle.
//        var boxWidth = player.graphics.active.boundingBox.width;
//        var boxHeight = player.graphics.active.boundingBox.height;
//        context.beginPath();
//        context.lineWidth = "2";
//        context.strokeStyle = "#FFFFFF";
//        context.rect(
//                rpgtoolkit.craftyPlayer.x - (boxWidth / 2),
//                rpgtoolkit.craftyPlayer.y - boxHeight,
//                boxWidth,
//                boxHeight);
//        context.stroke();
//      }
    }

    /*
     * (Optional) Render Vectors.
     */
    this.board.vectors.forEach(function (vector) {
      var haveMoved = false;
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = 2.0;
      context.beginPath();
      vector.points.forEach(function (point) {
        if (!haveMoved) {
          context.moveTo(point.x, point.y);
          haveMoved = true;
        } else {
          context.lineTo(point.x, point.y);
        }
      }, this);
      context.closePath();
      context.stroke();
    }, this);

    /*
     * (Optional) Render Programs.
     */
    this.board.programs.forEach(function (program) {
      var haveMoved = false;
      context.strokeStyle = "#FFFF00";
      context.lineWidth = 2.0;
      context.beginPath();
      program.points.forEach(function (point) {
        if (!haveMoved) {
          context.moveTo(point.x, point.y);
          haveMoved = true;
        } else {
          context.lineTo(point.x, point.y);
        }
      }, this);
      context.closePath();
      context.stroke();
    }, this);
  }

  /*
   * Render rpgcode canvases.
   */
  var canvases = rpgtoolkit.rpgcodeApi.canvases;
  for (var property in canvases) {
    if (canvases.hasOwnProperty(property)) {
      var element = canvases[property];
      if (element.render) {
        context.drawImage(element.canvas, x, y);
      }
    }
  }
};