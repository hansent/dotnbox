
/**
 * creates an n x m grid to play dots and lines on.
 * @param {Number} n 
 * @param {Number} m
 */
var Grid = function(n, m){
    this.width = n;
    this.height = m;

    this.edges = [];
    for (var x=0; x<n-1; x++){
    for (var y=0; y<m-1; y++){
            this.edges.push({
                'from': {'x':x+1, 'y':y}, 
                'to': {'x':x, 'y':y+1},
                'player': 0,
            });
    }
    }
};


g = new Grid(4,4);
console.log(g);