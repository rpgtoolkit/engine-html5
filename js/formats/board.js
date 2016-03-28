function board(filename) {
  // synchronous request for binary
  var req = new XMLHttpRequest();
  req.open("GET", filename, false);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.send(null);

  // create buffer
  return JSON.parse(req.responseText);
}