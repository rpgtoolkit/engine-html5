/* global rpgtoolkit, PATH_ANIMATION, PATH_PROGRAM */

function Sprite() {
  this.x = 0;
  this.y = 0;
  this.layer = 0;
  this.graphics = {
    elapsed: 0,
    frameIndex: 0,
    active: {},
    south: null,
    north: null,
    east: null,
    west: null,
    southEast: null,
    southWest: null,
    northEast: null,
    northWest: null,
    southIdle: null,
    northIdle: null,
    eastIdle: null,
    westIdle: null,
    southEastIdle: null,
    southWestIdle: null,
    northEastIdle: null,
    northWestIdle: null,
    attack: null,
    defend: null,
    specialMove: null,
    die: null,
    rest: null,
    custom: {
      
    }
  };
}

Sprite.prototype.DirectionEnum = {
  NORTH: "n",
  SOUTH: "s",
  EAST: "e",
  WEST: "w",
  NORTH_EAST: "ne",
  NORTH_WEST: "nw",
  SOUTH_EAST: "se",
  SOUTH_WEST: "sw"
};

Sprite.prototype.load = function () {
  var frames = this.loadAnimations();
  var soundEffects = this.loadSoundEffects();
  this.loadAssets(frames, soundEffects);
  
  // TODO: Remove this when assest loading callbacks are implemented correctly.
  this.setReady();
};

Sprite.prototype.loadAssets = function (frames, soundEffects) {
  var entity = this;
  var assets = {"images": frames, "audio": soundEffects};
  console.log(assets);
  Crafty.load(assets, // WE KEEP RESETTING THE CALLBACKS HERE!!! FIX IT!!!
          function () {
            // loaded
            console.log("loaded assets=[" + assets + "] for entity=[" + entity.toString() + "].");
            entity.setReady();
          },
          function (e) {
            // progress
            console.log("loading assets=[" + assets + "] for entity=[" + entity + "].");
          },
          function (e) {
            // uh oh, error loading
            console.error("failed to load assets=[" + assets + "] for entity=[" + entity + "].");
          });
};

Sprite.prototype.loadAnimations = function () {
  // Load up the standard animations.
  this.graphics.south = this._loadAnimation(this.standardGraphics[0]);
  this.graphics.north = this._loadAnimation(this.standardGraphics[1]);
  this.graphics.east = this._loadAnimation(this.standardGraphics[2]);
  this.graphics.west = this._loadAnimation(this.standardGraphics[3]);
  this.graphics.northEast = this._loadAnimation(this.standardGraphics[4]);
  this.graphics.northWest = this._loadAnimation(this.standardGraphics[5]);
  this.graphics.southEast = this._loadAnimation(this.standardGraphics[6]);
  this.graphics.southWest = this._loadAnimation(this.standardGraphics[7]);
  this.graphics.attack = this._loadAnimation(this.standardGraphics[8]);
  this.graphics.defend = this._loadAnimation(this.standardGraphics[9]);
  this.graphics.specialMove = this._loadAnimation(this.standardGraphics[10]);
  this.graphics.die = this._loadAnimation(this.standardGraphics[11]);
  this.graphics.rest = this._loadAnimation(this.standardGraphics[12]);
  
  // Load up the idle animations.
  this.graphics.southIdle = this._loadAnimation(this.standingGraphics[0]);
  this.graphics.northIdle = this._loadAnimation(this.standingGraphics[1]);
  this.graphics.eastIdle = this._loadAnimation(this.standingGraphics[2]);
  this.graphics.westIdle = this._loadAnimation(this.standingGraphics[3]);
  this.graphics.northEastIdle = this._loadAnimation(this.standingGraphics[4]);
  this.graphics.northWestIdle = this._loadAnimation(this.standingGraphics[5]);
  this.graphics.southEastIdle = this._loadAnimation(this.standingGraphics[6]);
  this.graphics.southWestIdle = this._loadAnimation(this.standingGraphics[7]);
  
  // Load up the custom graphics.
  var len = this.customGraphicsNames.length;
  for (var i = 0; i < len; i++) {
    var customGraphicName = this.customGraphicsNames[i];
    var customGraphic = this.customGraphics[i];
    this.graphics.custom[customGraphicName] = this._loadAnimation(customGraphic);
  }
  
  return this.loadFrames();
};

Sprite.prototype._loadAnimation = function(fileName) {
  if (fileName) {
    var animation = new Animation(PATH_ANIMATION + fileName);
    animation.boundingBox = {
      x: 0,
      y: 0,
      width: 30,
      height: 15
    };
    return animation;
  } else {
    return null;
  }
};

Sprite.prototype.loadFrames = function () {
  var frames = [];
  frames = frames.concat(this.graphics.north.frames);
  frames = frames.concat(this.graphics.south.frames);
  frames = frames.concat(this.graphics.east.frames);
  frames = frames.concat(this.graphics.west.frames);

  for (var customAnimation in this.graphics.custom) {
    if (this.graphics.custom.hasOwnProperty(customAnimation)) {
      frames = frames.concat(this.graphics.custom[customAnimation].frames);
    }
  }
  
  return frames;
};

Sprite.prototype.loadSoundEffects = function () {
  var soundEffects = {};
  soundEffects[this.graphics.north.soundEffect] = this.graphics.north.soundEffect;
  soundEffects[this.graphics.south.soundEffect] = this.graphics.south.soundEffect;
  soundEffects[this.graphics.east.soundEffect] = this.graphics.east.soundEffect;
  soundEffects[this.graphics.west.soundEffect] = this.graphics.west.soundEffect;

  for (var customAnimation in this.graphics.custom) {
    if (this.graphics.custom.hasOwnProperty(customAnimation)) {
      soundEffects[this.graphics.custom[customAnimation].soundEffect] = this.graphics.custom[customAnimation].soundEffect;
    }
  }
  
  delete soundEffects[""]; // TODO: need to make sure this can't happen.
  
  return soundEffects;
};

Sprite.prototype.setReady = function () {
  console.log("setting ready");
  this.graphics.active = this.graphics.south;
  this.renderReady = true;
  var e = {ctx: Crafty.canvasLayer.context};
  Crafty.trigger("Draw", e);
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
    case this.DirectionEnum.NORTH_EAST:
      this.graphics.active = this.grapics.northEast;
      break;
    case this.DirectionEnum.NORTH_WEST:
      this.graphics.active = this.graphics.northWest;
      break;
    case this.DirectionEnum.SOUTH_EAST:
      this.graphics.active = this.graphics.southEast;
      break;
    case this.DirectionEnum.SOUTH_WEST:
      this.graphics.active = this.graphics.southWest;
      break;
    default:
      this.graphics.active = this.graphics.custom[direction];
  }
};

Sprite.prototype.checkCollisions = function (collision, entity) {
  var object = collision.obj;
  switch (object.vectorType) {
    case "item":
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