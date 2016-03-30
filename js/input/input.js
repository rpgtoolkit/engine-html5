var KEY = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
  A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
  TILDA: 192
};

/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function onKeyDown(event) {
  switch (event.keyCode) {
    case KEY.UP:
      currentPlayer.input.up = true;
      event.preventDefault();
      break;
    case KEY.DOWN:
      currentPlayer.input.down = true;
      event.preventDefault();
      break;
    case KEY.LEFT:
      currentPlayer.input.left = true;
      event.preventDefault();
      break;
    case KEY.RIGHT:
      currentPlayer.input.right = true;
      event.preventDefault();
      break;
  }
}

/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function onKeyUp(event) {
  switch (event.keyCode) {
    case KEY.UP:
      currentPlayer.input.up = false;
      event.preventDefault();
      break;
    case KEY.DOWN:
      currentPlayer.input.down = false;
      event.preventDefault();
      break;
    case KEY.LEFT:
      currentPlayer.input.left = false;
      event.preventDefault();
      break;
    case KEY.RIGHT:
      currentPlayer.input.right = false;
      event.preventDefault();
      break;
  }
}

/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function onClick(event) {
  event.preventDefault();
}

/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function onMouseMove(event) {
  event.preventDefault();
}

/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function onTouchStart(event) {
  event.preventDefault();
}

/**
 * 
 * @param {type} event
 * @returns {undefined}
 */
function onTouchMove(event) {
  event.preventDefault();
}

