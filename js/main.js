/*
 * The basis for the logic in this file came from:
 *  http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/ 
 */
 
if (showFPS) {
  var fpsmeter = new FPSMeter();
}

var runGameLoop = false; // Must explictly start the game loop.

var now;
var dt = 0;
var last = timestamp();
var step = 1 / 60;

var screen;
var canvas = document.getElementById("canvas");

var currentBoard;

var frame1 = new Image();
frame1.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_south_walk1.png";

var frame2 = new Image();
frame2.src = "../game/TheWizardsTower-JS/Bitmap/Hero_world_south_walk2.png";

// TODO: define a complete player state object.
var player = {
  x: 0,
  y: 0,
  layer: 0,
  input: {
    up: false, 
    down: false, 
    left: false, 
    right: false
  },
  graphics: {
    elapsed: 0,
    frameIndex: 0,
    south: {
      frameRate: 0.5,
      frames: [
          frame1,
          frame2
      ],
      animationHeight: 50,
      soundEffect: "",
      animationWidth: 50
    }
  }
};

/**
 * Setups up the games initial state based on the configuration found in the main file.
 * 
 * @returns {undefined}
 */
function setup() {
  // Screen settings.
  canvas.width = 640;
  canvas.height = 480;
  
  currentBoard = new board(PATH_BOARD + "Room0.brd.json");
  player.x = currentBoard.startingPositionX;
  player.y = currentBoard.startingPositionY;
  screen = new screenRenderer(currentBoard);

  // Game input settings.
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);
  canvas.addEventListener("click", onClick, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("touchstart", onTouchStart, false);
  canvas.addEventListener("touchmove", onTouchMove, false);

  // Run the startup program before the game logic loop.
  var fileref = document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", "../game/TheWizardsTower-JS/Prg/INTRO.js");

  if (typeof fileref !== "undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}

function start() {
  requestAnimationFrame(frame);
  runGameLoop = true;
}

function stop() {
  runGameLoop = false;
}

/**q
 * Processes a frame of game logic.
 * 
 * @returns {undefined}
 */
function frame() {
  var doRender = false;
  
  if (showFPS) {
    fpsmeter.tickStart();
  }

  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > step) {
    dt = dt - step;
    doRender = update(step);
  }
  
  if (doRender) {
    render(dt);
  }
  
  last = now;
  
  if (runGameLoop) {
    requestAnimationFrame(frame);
  }

  if (showFPS) {
    fpsmeter.tick();
  }
}

/**
 * Updates the state of the game engine.
 * 
 * @param {type} step time in milliseconds since last update.
 * @returns {undefined}
 */
function update(step) {
  var updated = false;
  
  /*
   * Step 1: Process player input.
   */
  // TODO: base displacement off values configured in the main file. Will also have to consider
  // the players actual location in the game not just on the screen.
  if (player.input.up) {
    player.y -= 1;
    updated = true;
  } else if (player.input.down) {
    player.y += 1;
    updated = true;
  } else if (player.input.left) {
    player.x -= 1;
    updated = true;
  } else if (player.input.right) {
    player.x += 1;
    updated = true;
  }
  
  // temp rubbish 
  if (updated) {
    player.graphics.elapsed += step;
    
    if (player.graphics.elapsed >= player.graphics.south.frameRate) {
      player.graphics.elapsed = player.graphics.elapsed - player.graphics.south.frameRate;
      var frame = player.graphics.frameIndex + 1;
      if (frame < player.graphics.south.frames.length) {
        player.graphics.frameIndex = frame;
      } else {
        player.graphics.frameIndex = 0;
      }
    }
  }
  
  return updated;
}

/**
 * Renders the game screen.
 * 
 * @param {type} step
 * @returns {undefined}
 */
function render(step) {
  screen.render(canvas);
}

/**
 * 
 * @returns {Number}
 */
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/*
 * Main entry point for the game.
 */
setup();
