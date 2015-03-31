
module.exports = Game;

var _ = require('underscore');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


/**
 * create a 4x4 game board for playing dots and lines
 * the game object is an EventEmitter instance
 */
function Game(){
    EventEmitter.call(this);
    this.num_rows = 4;
    this.num_columns = 4;

    this.current_player = 1;

    // two dimensional array to address edges in 
    // the graph / lines in the game
    this.edges = [
        [0,0,0],   //row[0] (3 edges)  * -- * -- * -- *  <- "vertex row"
        [0,0,0,0], //row[1] (4 edges)  |    |    |    |  <- "edge row"
        [0,0,0],   //row[2] (3 edges)  * -- * -- * -- *  <- "vertex row"
        [0,0,0,0], //row[3] (4 edges)  |    |    |    |  <- "edge row"
        [0,0,0],   //row[4] (3 edges)  * -- * -- * -- *  <- "vertex row"
        [0,0,0,0], //row[5] (4 edges)  |    |    |    |  <- "edge row"
        [0,0,0]    //row[6] (3 edges)  * -- * -- * -- *  <- "vertex row"
    ];

    // two dimensional array to keep track of which boxes have been
    // closed and which player has won them.
    this.boxes = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    return this;
}

util.inherits(Game, EventEmitter);





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
    this.emit('line_added', row, col);
    //if this move closed any boxes, the same player goes again
    //otherwise its the other players turn
    if (this.checkBoxes(row, col) === 0){
        this.current_player = (this.current_player%2) + 1;
        this.emit('end_turn');
    }
    else {
        this.emit('score_changed');
        this.checkGameOver();
    }

};


/**
 * returns the score, by counting the number of boxes each player has
 * won so far.  the function returns a object/hash with the number of
 * boxes won by each player and the number of open boxes remaining on
 * the board.  e.g. {'1': 2, '2': 3, 'open': 4} if player 1 has taken 
 * 2 boxes,player 2 has taken 3, and there are 4 open boxes left on 
 * the board.
 * 
 * @return {object} object with # of boxes open and claimed by players             
 */
Game.prototype.getScore = function(){
    return _.countBy(_.flatten(this.boxes), function(state){
        return state === 0 ? 'open' : state;
    });
};



/**
 * checks whether the game is over / all boxes have been claimed
 * 
 * @return {boolean} true if the game is done / all boxes are claimed
 */
Game.prototype.checkGameOver = function(){
    var score = this.getScore();
    if (score.open === 0)
        this.emit('game_over');
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
            var boxrow = Math.floor(row/2);
            this.boxes[boxrow][col-1] = this.current_player;
            this.emit('box_closed', boxrow, col-1, this.current_player);
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
            var boxrow = Math.floor(row/2);
            this.boxes[boxrow][col] = this.current_player;
            this.emit('box_closed', boxrow, col, this.current_player);
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
            var boxrow = Math.floor(row/2)-1;
            this.boxes[boxrow][col] = this.current_player;
            this.emit('box_closed', boxrow, col, this.current_player);
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
            var boxrow = Math.floor(row/2);
            this.boxes[boxrow][col] = this.current_player;
            this.emit('box_closed', boxrow, col, this.current_player);
            return 1;
        }
    }
    return 0;
};
