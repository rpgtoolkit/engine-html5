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
var currentPlayer;

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
  
  // Setup the Player.
  currentPlayer = new player("");
  currentPlayer.graphics.active = currentPlayer.graphics.south;
  currentPlayer.x = currentBoard.startingPositionX;
  currentPlayer.y = currentBoard.startingPositionY;
  
  screen = new screenRenderer(currentBoard);

  // Game input settings.
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);
  canvas.addEventListener("click", onClick, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("touchstart", onTouchStart, false);
  canvas.addEventListener("touchmove", onTouchMove, false);

  // Run the startup program before the game logic loop.
//  var fileref = document.createElement("script");
//  fileref.setAttribute("type", "text/javascript");
//  fileref.setAttribute("src", "../game/TheWizardsTower-JS/Prg/INTRO.js");
//
//  if (typeof fileref !== "undefined") {
//    document.getElementsByTagName("head")[0].appendChild(fileref);
//  }
  start();
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
  if (currentPlayer.input.up) {
    currentPlayer.move(currentPlayer.DirectionEnum.NORTH, step);
    updated = true;
  } else if (currentPlayer.input.down) {
    currentPlayer.move(currentPlayer.DirectionEnum.SOUTH, step);
    updated = true;
  } else if (currentPlayer.input.right) {
    currentPlayer.move(currentPlayer.DirectionEnum.EAST, step);
    updated = true;
  } else if (currentPlayer.input.left) {
    currentPlayer.move(currentPlayer.DirectionEnum.WEST, step);
    updated = true;
  }
  
  /*
   * Step 2: Check for collision.
   */
  // TODO
  
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
