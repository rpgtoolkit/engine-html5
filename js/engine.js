var dt; // Craftyjs time step since last frame;

var screen;
var canvas = document.getElementById("canvas");

var currentBoard;
var currentPlayer;

/**
 * Setups up the games initial state based on the configuration found in the main file.
 * 
 * @param {type} filename
 * @returns {undefined}
 */
function setup(filename) {
  Crafty.init(0, 0);
  
  // Screen settings.
  canvas.width = 640;
  canvas.height = 480;

  currentBoard = new board(PATH_BOARD + "Room0.brd.json");
  loadBoard(currentBoard);

  // Setup the Player.
  var tkPlayer = new player("");
  tkPlayer.graphics.active = tkPlayer.graphics.south;
  tkPlayer.x = currentBoard.startingPositionX;
  tkPlayer.y = currentBoard.startingPositionY;
  loadPlayer(tkPlayer);

  // Setup the drawing canvas (game screen).
  screen = new screenRenderer(currentBoard);

  // Run the startup program before the game logic loop.
//  runProgram("../game/TheWizardsTower-JS/Prg/INTRO.js");

  screen.render(canvas);
}

function loadBoard(board) {
  /*
   * Setup vectors.
   */
  board.vectors.forEach(function (vector) {
    var points = vector.points;
    var len = points.length;
    for (var i = 0; i < len - 1; i++) {
      createVector(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, vector.layer);
    }

    if (vector.isClosed) {
      createVector(points[0].x, points[0].y, points[len - 1].x, points[len - 1].y, vector.layer);
    }
  }, this);
  
  /*
   * Setup programs.
   */
  
  /*
   * Setup player.
   */
  
  /*
   * Play background music.
   */
  if (board.backgroundMusic) {
    var assets = {
      "audio": {
        "backgroundMusic": [PATH_MEDIA + board.backgroundMusic]
      }
    };
    Crafty.load(assets, function() { playSound("backgroundMusic", -1); });
  }
}

function loadPlayer(tkPlayer) {
  currentPlayer = Crafty.e("2D, DOM, Fourway, Collision")
          .attr({
            x: tkPlayer.x,
            y: tkPlayer.y,
            w: 20,
            h: 15,
            player: tkPlayer})
          .fourway(50)
          .bind("Moved", function (from) {
            this.player.animate(dt);
            this.player.checkCollisions(this, from);
          })
          .bind("NewDirection", function (direction) {
            if (direction.x === 0 && direction.y === -1) {
              this.player.changeGraphics(this.player.DirectionEnum.NORTH);
            } else if (direction.x === 0 && direction.y === 1) {
              this.player.changeGraphics(this.player.DirectionEnum.SOUTH);
            } else if (direction.x === -1 && direction.y === 0) {
              this.player.changeGraphics(this.player.DirectionEnum.WEST);
            } else if (direction.x === 1 && direction.y === 0) {
              this.player.changeGraphics(this.player.DirectionEnum.EAST);
            }
          })
          .bind("EnterFrame", function (event) {
            dt = event.dt / 1000;
          });
}

function runProgram(filename) {
  var fileref = document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", filename);

  if (typeof fileref !== "undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}

function createVector(x1, y1, x2, y2, layer) {
  var xDiff = x2 - x1;
  var yDiff = y2 - y1;

  var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

  var width;
  var height;

  if (x1 !== x2) {
    width = distance;
    height = 2;

    if (xDiff < 0) {
      x1 = x2;
    }
  } else {
    width = 2;
    height = distance;

    if (yDiff < 0) {
      y1 = y2;
    }
  }

  Crafty.e("solid-" + layer + ", Collision")
          .attr({x: x1, y: y1, w: width, h: height});
}

function playSound(sound, loop) {
  Crafty.audio.play(sound, loop);
}

/**
 * Utility function for getting accurate timestamps across browsers.
 * 
 * @returns {Number}
 */
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
