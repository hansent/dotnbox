var $ = require('jquery');
var Game = require('./game');


var ConsoleUI = require('./console');
var DomUI = require('./dom');


$(function(){
    var game = new Game();
    var consoleUI = ConsoleUI(game);
    var domUI = DomUI(game);

});




