Animation.prototype.constructor = Animation;

function Animation(filename) {
  // TODO: Make the changes here that chrome suggests.
  var req = new XMLHttpRequest();
  req.open("GET", filename, false);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.send(null);
  
  var animation = JSON.parse(req.responseText);
  
  return animation;
}


