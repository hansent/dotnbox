module.exports = DomUI;


var $ = require('jquery');
var _ = require('underscore');

var PLAYER_COLOR = [
    "#FFF",
    "#F00",
    "#00F"
]


function DomUI(game){
    var root =  $("<div id='game'></div>");
    $("body").append(root);

    renderGameBoard(game);

    game.on('line_added', function(row, col){
        $('#'+row+"-"+col).css({'background-color': '#000'});
    });

    game.on('box_closed', function(row, col, player){
        $('#box-'+row+'-'+col)
            .css({'background-color': PLAYER_COLOR[player]});
    });

    game.on('end_turn', function(){
        $('#current_player').html(game.current_player);
    });

    game.on('score_changed', function(){
        var score = game.getScore();
        $('#score-p1').text(score[1]);
        $('#score-p2').text(score[2]);
    });

    game.on('game_over', function(){
        var score = game.getScore();
        alert("GAME OVER");
        if (score[1] > score[2])
            alert("player 1 wins the game!");
        else
            alert("player 2 wins the game!");
    });
}



// load and compile simple templates for the rows on the board
var scoreTemplate = require('./templates/score.html')
var vertexRowTemplate = require('./templates/vertex-row.html');
var edgeRowTemplate = require('./templates/edge-row.html');
var renderVertexRow = _.template(vertexRowTemplate);
var renderEdgeRow = _.template(edgeRowTemplate);


/**
 * renders the game board
 * 
 * @param  {game}
 * @return {string}
 */
function renderGameBoard(game){
    var gameDiv = $('#game');
    gameDiv.empty();

    gameDiv.append($(scoreTemplate));

    for (var i=0; i<game.edges.length; i++){
        var row_html = "";
        if (i%2)
            row_html = renderEdgeRow({row: i});
        else
            row_html = renderVertexRow({row: i});
        gameDiv.append($(row_html));
    }

    $(".line").on('click', function(){
        var edge_index = this.id.split('-');
        var row = parseInt(edge_index[0]);
        var col = parseInt(edge_index[1]);
        game.insertLine(row, col);
    });
}



