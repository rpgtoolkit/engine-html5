var fpsmeter = new FPSMeter();

var now;
var dt = 0;
var last = timestamp();
var step = 1/60;

var screen;
var canvas = document.getElementById("canvas");

function setup() {
  screen = new boardRenderer(new board(PATH_BOARD + "test.brd.json"));
}

function frame() {
  fpsmeter.tickStart();
  
  now = timestamp();
  dt = dt + Math.min(1, (now - last) / 1000);
  while(dt > step) {
    dt = dt - step;
    update(step);
  }
  render(dt);
  last = now;
  requestAnimationFrame(frame);
  
  fpsmeter.tick();
}

function update(step) {
  
}

function render(dt) {
  screen.render(canvas);
}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

setup();
requestAnimationFrame(frame);
