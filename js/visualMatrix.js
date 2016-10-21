function VisualMatrix(canvasId, squareSize, spaceSize) {
    this.canvas = $("#"+canvasId);
    this.ctx=this.canvas[0].getContext("2d");

    this.squareSize = squareSize;
    this.spaceSize = spaceSize;
    this.totalCellSize = squareSize + spaceSize;

    var wH = $(window).height();
    var wW = $(window).width();
    this.ctx.canvas.width = wW;
    this.ctx.canvas.height = wH;

    this.maxX = Math.ceil(wW / this.totalCellSize);
    this.maxY = Math.ceil(wH / this.totalCellSize);

    this.squares = [];

    //initialize
    for (var i = 0; i < this.maxX; i++) {
        this.squares.push([]);
        for (var j = 0; j < this.maxY; j++) {
            this.squares[i].push(new VisualSquare(i, j, this.squareSize, this.spaceSize, gradient[0],this.ctx));
        }
    }
}

VisualMatrix.prototype.getSquare = function(x, y) {
    if(this.squares[x])
        return this.squares[x][y];
    return null;
};


VisualMatrix.prototype.setContextColor = function(color) {
    this.ctx.fillStyle = color;
};

function VisualSquare(x, y, squareSize, spaceSize, baseColor, ctx) {
    this.x = x;
    this.y = y;
    this.squareSize = squareSize;
    this.spaceSize = spaceSize;
    this.totalCellSize = squareSize + spaceSize;

    this._ctx = ctx;

    this.paint(baseColor);
}

VisualSquare.prototype.paint = function(color) {
    if(color) {
        this._ctx.fillStyle = color;
    }
    this._ctx.fillRect(this.x * this.totalCellSize, this.y * this.totalCellSize, this.squareSize, this.squareSize);
};