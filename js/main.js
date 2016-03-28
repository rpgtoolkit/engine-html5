/*
 * The basis for the logic in this file came from:
 *  http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/ 
 */

if (showFPS) {
  var fpsmeter = new FPSMeter();
}

var now;
var dt = 0;
var last = timestamp();
var step = 1 / 60;

var screen;
var canvas = document.getElementById("canvas");

// TODO: define a complete player state object.
var player = {
  x: 0,
  y: 0,
  layer: 0,
  input: {up: false, down: false, left: false, right: false}
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
  screen = new screenRenderer(new board(PATH_BOARD + "test.brd.json"));

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
    document.getElementsByTagName("head")[0].appendChild(fileref)
  }
}

/**
 * Processes a frame of game logic.
 * 
 * @returns {undefined}
 */
function frame() {
  if (showFPS) {
    fpsmeter.tickStart();
  }

  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while (dt > step) {
    dt = dt - step;
    update(step);
  }
  render(dt);
  last = now;
  requestAnimationFrame(frame);

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
  /*
   * Step 1: Process player input.
   */
  // TODO: base displacement off values configured in the main file. Will also have to consider
  // the players actual location in the game not just on the screen.
  if (player.input.up) {
    player.y -= 1;
  } else if (player.input.down) {
    player.y += 1;
  } else if (player.input.left) {
    player.x -= 1;
  } else if (player.input.right) {
    player.x += 1;
  }
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
//requestAnimationFrame(frame);
