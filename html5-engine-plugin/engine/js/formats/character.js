Character.prototype = new Sprite();
Character.prototype.constructor = Character;

function Character(filename) {
    // TODO: Make the changes here that chrome suggests.
    var req = new XMLHttpRequest();
    req.open("GET", filename, false);
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send(null);

    var character = JSON.parse(req.responseText);
    for (var property in character) {
        this[property] = character[property];
    }
}