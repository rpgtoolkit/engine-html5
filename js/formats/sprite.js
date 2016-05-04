function Sprite() {
  
}

Sprite.prototype.DirectionEnum = {
  NORTH: "n",
  SOUTH: "s",
  EAST: "e",
  WEST: "w"
};

Sprite.prototype.loadGraphics = function () {
  var frames = [];
  frames = frames.concat(this.graphics.north.frames);
  frames = frames.concat(this.graphics.south.frames);
  frames = frames.concat(this.graphics.east.frames);
  frames = frames.concat(this.graphics.west.frames);
  
  // Remove the duplicates.
  var unique = frames.reduce(function(a, b) {
    if (a.indexOf(b) < 0 ) {
      a.push(b);
    }
    return a;
  },[]);
  
  // TODO: Check what is already loaded by Crafty.

  this.loadFrames(unique);
};

Sprite.prototype.loadFrames = function (frames) {
  var assets = {
    "images": frames
  };

  var entity = this;
  Crafty.load(assets,
          function () {
            // when loaded
            entity.graphics.active = entity.graphics.south;
            entity.renderReady = true;
            var e = {ctx: Crafty.canvasLayer.context};
            Crafty.trigger("Draw", e);
          },
          function (e) {
            // progress
          },
          function (e) {
            // uh oh, error loading
            console.error("failed to load frames for: " + entity);
          });
};

Sprite.prototype.animate = function (step) {
  this.graphics.elapsed += step;

  if (this.graphics.elapsed >= this.graphics.active.frameRate) {
    this.graphics.elapsed = this.graphics.elapsed - this.graphics.active.frameRate;
    var frame = this.graphics.frameIndex + 1;
    if (frame < this.graphics.active.frames.length) {
      this.graphics.frameIndex = frame;
    } else {
      this.graphics.frameIndex = 0;
    }
  }
};

Sprite.prototype.changeGraphics = function (direction) {
  this.graphics.elapsed = 0;
  this.graphics.frameIndex = 0;

  switch (direction) {
    case this.DirectionEnum.NORTH:
      this.graphics.active = this.graphics.north;
      break;
    case this.DirectionEnum.SOUTH:
      this.graphics.active = this.graphics.south;
      break;
    case this.DirectionEnum.EAST:
      this.graphics.active = this.graphics.east;
      break;
    case this.DirectionEnum.WEST:
      this.graphics.active = this.graphics.west;
      break;
  }
};

Sprite.prototype.checkCollisions = function (collision, entity) {
  var object = collision.obj;
  switch (object.vectorType) {
    case "item":
      // TODO: need to examine the item, determine if it is a solid,
      //       does it have a program attached etc.
      entity.x += collision.normal.x;
      entity.y += collision.normal.y;

      if (object.sprite.activationProgram) {
        rpgtoolkit.runProgram(PATH_PROGRAM.concat(object.sprite.activationProgram), object);
      }

      entity.resetHitChecks();
      break;
    case "program":
      rpgtoolkit.runProgram(object.fileName, entity);
      break;
    case "solid":
      entity.x += collision.normal.x;
      entity.y += collision.normal.y;
      entity.resetHitChecks();
      break;
  }
};
