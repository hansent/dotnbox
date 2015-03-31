module.exports = ConsoleUI;



function ConsoleUI(game){

    //need a way to make a move / select a line from the console
    window.addLine = function(row, col){
        game.insertLine(row, col);
    };

    //render initial game state
    console.log(renderGameState(game));

    game.on('line_added', function(){
        console.log("line added by player "+ game.current_player);
        console.log(renderGameState(game));
    });

    game.on('end_turn', function(){
        console.log("end of turn");
        console.log("-----------------------------");
        console.log("next up: player "+ game.current_player);
        console.log(renderGameState(game));
    });

    game.on('score_changed', function(){
        var score = game.getScore();
        console.log("score changed:");
        console.log("player 1:", score[0]);
        console.log("player 2:", score[1]);
        console.log(score.open, "boxes left on the board.");
    });

    game.on('game_over', function(){
        var score = game.getScore();

        console.log("=============================");
        console.log("         GAME OVER           ");
        console.log("=============================");
        if (score[0] > score[1])
            console.log("player 1 wins the game!");
        else
            console.log("player 2 wins the game!");
    });


}


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
