dotnbox
===========

## quickstart

clone the repository and run `npm install`
```
git clone https://github.com/hansent/dotnbox.git
cd dotnbox
npm install
```

run `gulp` after dependencies are installed to start a local dev server.  
```
gulp
```

Your borwser should open automatically and reload on file changes (you might have to restart gulp if you change some of the template files).


## how to play
add lines, by clicking on the gray lines to turn them black.  The boxes should turn blue or red based on which player closed the box and the score will be updated (There is a bug/edge case with detecting properly which boxes are closed right now).

## alternative ways to play
open your browser console, and play the game using the console.  you can add a line, by calling the `addLine(row, col)` function, which is attached to the window object / in the global namespace.

The row and col values are indexes into a 2 dimensional array representing the edges in the grid.
```
var edges = [
    [0,0,0],   // row[0] (3 edges)  * -- * -- * -- * 
    [0,0,0,0], // row[1] (4 edges)  |    |    |    |  
    [0,0,0],   // row[2] (3 edges)  * -- * -- * -- * 
    [0,0,0,0], // row[3] (4 edges)  |    |    |    |  
    [0,0,0],   // row[4] (3 edges)  * -- * -- * -- * 
    [0,0,0,0], // row[5] (4 edges)  |    |    |    |  
    [0,0,0]    // row[6] (3 edges)  * -- * -- * -- * 
];
```

e.g. to close the box in the middle using a function call, you would type `addLine(4,1)` to add the middle line in the 4th row.
```
 * -- * ## * ## *        * -- * ## * ## *
 |    |    # P1 #        |    |    # P1 #
 * -- * ## * ## *        * -- * ## * ## *
 |    #    #    |   ->   |    # P2 #    |
 * ## * -- * -- *        * ## * ## * -- *
 #    |    |    |        #    |    |    |
 * -- * -- * -- *        * -- * -- * -- *
```

The DOM based UI should stay in sync with any changes made to the game state using the `addLine` function.



