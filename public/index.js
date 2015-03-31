
var $ = require('jquery');



/**
 * create a 4x4 game board for playing dots and lines
 */
function Game(){
    this.num_rows = 4;
    this.num_columns = 4;

    this.current_player = 1;

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

    // two dimensional array to keep track of which boxes have been
    // closed and which player has won them.
    this.boxes = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    
}


/**
 * inserts a line between two dots in the game
 * 
 * @param  {Number} row index of the edge the line is being put on
 * @param  {Number} col index of the edge the line is being put on
 */
Game.prototype.insertLine = function(row, col){
    //check if this edge is already taken
    if (this.edges[row][col] !== 0)
        return;

    //mark the edge by setting its vaue to the player id
    this.edges[row][col] = this.current_player;
    //if this move closed any boxes, the same player goes again
    //otherwise its the other players turn
    if (this.checkBoxes(row, col) === 0)
        this.current_player = (this.current_player%2) + 1;
};


/**
 * checks whether any of the boxes adjecent to the edge identified
 * by row/col are completly enclosed.  if any of the boxes are closed
 * and haven not yet been claimed, we assign them to the current player.
 * 
 * @param  {Number} row index of the edge the line is being put on
 * @param  {Number} col index of the edge the line is being put on
 * @return {Number} the number of boxes that were closed by the last move
 */
Game.prototype.checkBoxes = function(row, col){
    if (row%2)
        return this.checkBoxLeft(row, col) + this.checkBoxRight(row, col) ;
    else
        return this.checkBoxTop(row, col) + this.checkBoxBottom(row, col);
};


/**
 * checks whether the box to the left of the edge identified by row/col 
 * is completly enclosed.  if it is, and it has not not yet been claimed, 
 * we assign it to the current player and return 1.
 * 
 * @param  {Number} row index of the right edge of the box being checked for
 * @param  {Number} col index of the right edge of the box being checked for
 * @return {Number} 1 if the box left of this edge was closed, otherwise 0
 */
Game.prototype.checkBoxLeft = function(row, col){
    var e = this.edges;
    if (col > 0) { //left most edge has no box to the left
        // closed_horizontal?  check if both left and right edges are closed
        var closed_horizontal = e[row][col] && e[row][col-1];  
        // closed_vertical? check if both top and bottom edges are closed
        var closed_vertical = e[row-1][col-1] && e[row+1][col-1];  

        // if the box is enclosed on all sides, assign it to the current player
        // and return 1
        if(closed_horizontal && closed_vertical){
            this.boxes[Math.floor(row/2)][col-1] = this.current_player;
            return 1;
        }
    }
    return 0;
};


/**
 * checks whether the box to the right of the edge identified by row/col 
 * is completly enclosed.  if it is, and it has not not yet been claimed, 
 * we assign it to the current player and return 1.
 * 
 * @param  {Number} row index of the left edge of the box being checked for
 * @param  {Number} col index of the left edge of the box being checked for
 * @return {Number} 1 if the box left of this edge was closed, otherwise 0
 */
Game.prototype.checkBoxRight = function(row, col){
    var e = this.edges;
    if (col < this.num_columns - 1) { //right most edge has no box to the right
        // closed_horizontal?  check if both left and right edges are closed
        var closed_horizontal = e[row][col] && e[row][col+1];  
        // closed_vertical? check if both top and bottom edges are closed
        var closed_vertical = e[row-1][col] && e[row+1][col];  

        // if the box is enclosed on all sides, assign it to the current player
        // and return 1
        if(closed_horizontal && closed_vertical){
            this.boxes[Math.floor(row/2)][col] = this.current_player;
            return 1;
        }
    }
    return 0;
};


/**
 * checks whether the box on top of the edge identified by row/col 
 * is completly enclosed.  if it is, and it has not not yet been claimed, 
 * we assign it to the current player and return 1.
 * 
 * @param  {Number} row index of the bottom edge of the box being checked
 * @param  {Number} col index of the bottom edge of the box being checked
 * @return {Number} 1 if the box left of this edge was closed, otherwise 0
 */
Game.prototype.checkBoxTop = function(row, col){
    var e = this.edges;
    if (row > 2) { //top most edge has no box on top (and second row is an edge row)
        // closed_vertical? check if both top and bottom edges are closed
        var closed_vertical = e[row][col] && e[row-2][col];  
        // closed_horizontal?  check if both left and right edges are closed
        var closed_horizontal = e[row-1][col] && e[row-1][col+1];  
        

        // if the box is enclosed on all sides, assign it to the current player
        // and return 1
        if(closed_horizontal && closed_vertical){
            this.boxes[Math.floor(row/2)-1][col] = this.current_player;
            return 1;
        }
    }
    return 0;
};


/**
 * checks whether the box below the edge identified by row/col 
 * is completly enclosed.  if it is, and it has not not yet been claimed, 
 * we assign it to the current player and return 1.
 * 
 * @param  {Number} row index of the top edge of the box being checked 
 * @param  {Number} col index of the top edge of the box being checked 
 * @return {Number} 1 if the box left of this edge was closed, otherwise 0
 */
Game.prototype.checkBoxBottom = function(row, col){
    var e = this.edges;
    if (row < e.length - 2) { //bottom most edge has no box below
        // closed_vertical? check if both top and bottom edges are closed
        var closed_vertical = e[row][col] && e[row+2][col];  
        // closed_horizontal?  check if both left and right edges are closed
        var closed_horizontal = e[row+1][col] && e[row+1][col+1];  
        

        // if the box is enclosed on all sides, assign it to the current player
        // and return 1
        if(closed_horizontal && closed_vertical){
            this.boxes[Math.floor(row/2)][col] = this.current_player;
            return 1;
        }
    }
    return 0;
};



/**
 * renders the game board
 * 
 * @param  {game}
 * @return {string}
 */
function renderGameState(game){
    var out = "";
    for (var i=0; i<game.edges.length; i++){
        out += renderRow(game, i) + "\n";
    }
    out += "\nplayer " + game.current_player + "'s turn."
    return out;
}



/**
 * renders a row of the game board calls either
 * renderVertexRow for even rows and VertexEdge
 * on odd rows
 * 
 * @param  {Game}   game  the game instance
 * @param  {Number} row   the row index to be rendered
 * @return {string}
 */
function renderRow(game, row){
    if (row%2)
        return renderEdgeRow(game, row);
    else
        return renderVertexRow(game, row);
}



/**
 * constructs string representation of a "vertex row" 
 * like e.g.: "* -- * -- * -- *"
 * 
 * @param  {Game}   game  the game instance
 * @param  {Number} row   the row index to be rendered
 * @return {string} 
 */
function renderVertexRow(game, row){
    // we render " ## " instead of " -- "
    // to indicate lines placed by players 
    // e.g.: "* -- * ## * -- *"  indicates
    // that the line was placed in the middle
    var edges = game.edges[row];
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
 * @param  {Game}   game  the game instance
 * @param  {Number} row   the row index to be rendered
 * @return {string} 
 */
function renderEdgeRow(game, row){
    // we render "#" instead of "|"
    // to indicate lines placed by players 
    // e.g.: "#    #    |    |" if the two lef most
    // edges had "lines placed on them"
    var edges = game.edges[row];
    var out = ""; 
    for (var i=0; i<edges.length; i++){
        if (edges[i])
            out += "#";
        else
            out += "|";

        if (i < edges.length-1){ // all but last one
            var box_row = game.boxes[Math.floor(row/2)];
            var owner = game.boxes[Math.floor(row/2)][i];
            out += owner === 0 ? "    " : " P"+owner+" ";
        }
    }
    return out;
}





$(function(){
    window.game = new Game();
    game.insertLine(0,0);
    game.insertLine(1,0);
    window.render = function(){
        var ascii_board = renderGameState(game);
        console.log(ascii_board);
        $('#game').html("<pre>" + ascii_board + "</pre>");

    }
    render();

});




