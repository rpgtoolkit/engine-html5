var north_frame1 = new Image();
north_frame1.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_walk_north1.png";
var north_frame2 = new Image();
north_frame2.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_walk_north2.png";

var south_frame1 = new Image();
south_frame1.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_south_walk1.png";
var south_frame2 = new Image();
south_frame2.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_south_walk2.png";

var east_frame1 = new Image();
east_frame1.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_walk_east1.png";
var east_frame2 = new Image();
east_frame2.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_walk_east2.png";

var west_frame1 = new Image();
west_frame1.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_walk_west1.png";
var west_frame2 = new Image();
west_frame2.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_walk_west2.png";

function player(filename) {
  this.x = 0;
  this.y = 0;
  this.layer = 0;
  this.direction = 1;
  this.input = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  this.graphics = {
    elapsed: 0,
    frameIndex: 0,
    active: {},
    north: {
      frameRate: 0.2,
      frames: [
        north_frame1,
        north_frame2
      ],
      animationHeight: 57,
      soundEffect: "",
      animationWidth: 39
    },
    south: {
      frameRate: 0.2,
      frames: [
        south_frame1,
        south_frame2
      ],
      animationHeight: 57,
      soundEffect: "",
      animationWidth: 39
    },
    east: {
      frameRate: 0.2,
      frames: [
        east_frame1,
        east_frame2
      ],
      animationHeight: 57,
      soundEffect: "",
      animationWidth: 39
    },
    west: {
      frameRate: 0.2,
      frames: [
        west_frame1,
        west_frame2
      ],
      animationHeight: 57,
      soundEffect: "",
      animationWidth: 39
    }
  };
  this.boundingBox = {
    width: 40,
    height: 10
  };
}

player.prototype.DirectionEnum = {
  NORTH: 0,
  SOUTH: 1,
  EAST: 2,
  WEST: 3
};

player.prototype.move = function (direction, step) {
  if (this.direction !== direction) {
    this.direction = direction;
    this.changeGraphics(direction);
  } else {
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
  }

  switch (direction) {
    case this.DirectionEnum.NORTH:
      this.y -= 1;
      break;
    case this.DirectionEnum.SOUTH:
      this.y += 1;
      break;
    case this.DirectionEnum.EAST:
      this.x += 1;
      break;
    case this.DirectionEnum.WEST:
      this.x -= 1;
      break;
  }
};

player.prototype.changeGraphics = function (direction) {
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


