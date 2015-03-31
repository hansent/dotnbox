
var $ = require('jquery');



/**
 * create a 4x4 game board for playing dots and lines
 */
function Game(){
    this.num_rows = 4;
    this.num_columns = 4;

    // two dimensional array to address edges in 
    // the graph / lines in the game
    this.edges = [
        [0,0,0],   // (3 edges)  * -- * -- * -- *  <- "vertex row"
        [0,0,0,0], // (4 edges)  |    |    |    |  <- "edge row"
        [0,0,0],   // (3 edges)  * -- * -- * -- *  <- "vertex row"
        [0,0,0,0], // (4 edges)  |    |    |    |  <- "edge row"
        [0,0,0],   // (3 edges)  * -- * -- * -- *  <- "vertex row"
        [0,0,0,0], // (4 edges)  |    |    |    |  <- "edge row"
        [0,0,0]    // (3 edges)  * -- * -- * -- *  <- "vertex row"
    ];

}


/**
 * inserts a line between two dots in the game
 * @param  {Number} row index of the edge the line is being put on
 * @param  {Number} col index of the edge the line is being put on
 */
Game.prototype.insertLine = function(row, col){
    this.edges[row][col] = 1;
}






/**
 * renders the game board
 * @param  {game}
 * @return {string}
 */
function renderGameState(game){
    var out = "";
    for (var i=0; i<game.edges.length; i++){
        var row = game.edges[i];
        out += renderRow(row) + "\n";
    }
    return out;
}



/**
 * renders a row of the game board calls either
 * renderVertexRow for even rows and VertexEdge
 * on odd rows
 * @param  {array}
 * @return {string}
 */
function renderRow(row){
    if (row.length%2)
        return renderVertexRow(row);
    else
        return renderEdgeRow(row);
}



/**
 * constructs string representation of a "vertex row" 
 * like e.g.: "* -- * -- * -- *"
 * 
 * @param  {array} edges  an array of edge states
 * @return {string} 
 */
function renderVertexRow(edges){
    // we render " ## " instead of " -- "
    // to indicate lines placed by players 
    
    // e.g.: "* -- * ## * -- *"  indicates
    // that the line was placed in the middle
    var out = "*"; 
    for (var i=0; i<edges.length; i++){
        if (edges[i])
            out += " ## *";
        else
            out += " -- *";
    }
    return out;
}



/**
 * construct string representation of edge rows
 * like e.g.: "|    |    |    |"
 * 
 * @param  {array} edges  an array of edge states
 * @return {string} 
 */
function renderEdgeRow(edges){
    // we render "#" instead of "|"
    // to indicate lines placed by players 

    // e.g.: "#    #    |    |" if the two lef most
    // edges had "lines placed on them"
    var out = ""; 
    for (var i=0; i<edges.length; i++){
        if (edges[i])
            out += "#";
        else
            out += "|";

        if (i < edges.length-1) // all but last one
            out += "    ";
    }
    return out;
}






$(function(){
    var game = new Game();
    game.insertLine(0,0);
    game.insertLine(1,0);

    var ascii_board = renderGameState(game);
    console.log(ascii_board);
    $('#game').html("<pre>" + ascii_board + "</pre>");

});




