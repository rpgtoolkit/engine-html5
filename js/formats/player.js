Player.prototype = new Sprite();
Player.prototype.constructor = Player;

function Player(filename) {
  // TODO: Make the changes here that chrome suggests.
  var req = new XMLHttpRequest();
  req.open("GET", filename, false);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.send(null);

  var player = JSON.parse(req.responseText);

  player.DirectionEnum = this.DirectionEnum;
  player.changeGraphics = this.changeGraphics;
  player.animate = this.animate;
  player.checkCollisions = this.checkCollisions;
  player.loadGraphics = this.loadGraphics;
  player.loadFrames = this.loadFrames;

  player.direction = this.DirectionEnum.SOUTH;
  player.renderReady = false;

  return player;
}