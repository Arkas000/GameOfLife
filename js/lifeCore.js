//Constructor
function LifeGame(canvasId, squareSize) {
    var that = this;
    this.squareSize = squareSize;
    this.spaceSize = 2;
    this.visualMatrix = new VisualMatrix(canvasId, this.squareSize, this.spaceSize);
    this.loopInterval = null;

    this.smartCellValue = false;

    this.currentIteration = 0;

    this.timeSpeed = 4;

    this.COLS = this.visualMatrix.squares.length;
    this.ROWS = this.visualMatrix.squares[0].length;

    this.matrix = new Array(this.COLS);
    for(var i = 0; i < this.COLS; i++) {
        this.matrix[i] = new Array(this.ROWS);
    }
    for(i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.matrix[i][j] = false;
        }
    }

    this.supportMatrix = new Array(this.COLS);
    for(var i = 0; i < this.COLS; i++) {
        this.supportMatrix[i] = new Array(this.ROWS);
    }
    for(i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.supportMatrix[i][j] = false;
        }
    }

    this.savedMatrix = new Array(this.COLS);
    for(var i = 0; i < this.COLS; i++) {
        this.savedMatrix[i] = new Array(this.ROWS);
    }
    for(i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.savedMatrix[i][j] = false;
        }
    }

    this.drawStatusMatrix = new Array(this.COLS);
    for(var i = 0; i < this.COLS; i++) {
        this.drawStatusMatrix[i] = new Array(this.ROWS);
    }
    for(i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.drawStatusMatrix[i][j] = false;
        }
    }

    //----------- setup mouse interactions -------------
    this.lastQ = null;
    this.mouseDown = false;
    this.lastUp = null;
    this.visualMatrix.canvas.on("mousedown",function(e) {
        that.mouseDown = true;
        that.lastUp = null;
    });
    this.visualMatrix.canvas.on("mouseup",function(e) {
        that.mouseDown = false;
    });
    this.visualMatrix.canvas.on("mousemove",function(e) {
        if(that.mouseDown) {
            var cell = that.getCellFromScreenCoordinates(e.clientX,e.clientY);
            if(that.lastQ && !(cell.x == that.lastQ.x && cell.y == that.lastQ.y))
                that.updateCell(cell.x, cell.y);

            that.lastQ = cell;
            that.lastUp = cell;
        }
    });
    this.visualMatrix.canvas.on("click",function(e) {
        var cell = that.getCellFromScreenCoordinates(e.clientX,e.clientY);
        if(!that.lastUp)
            that.updateCell(cell.x,cell.y,!that.matrix[cell.x][cell.y]);
        that.lastUp = null;
    });
    //--------------------------------------------------
}

//draw cell with "val" (boolean) content
LifeGame.prototype.updateCell = function(x,y, val) {
    if(typeof val == 'undefined') {
        val = !this.matrix[x][y];
    }
    if(this.matrix[x] && typeof this.matrix[x][y] != 'undefined') {
        val = !!val;
        this.matrix[x][y] = val;
        if(val) {
            (this.visualMatrix.getSquare(x,y)).paint(gradient[1]);
        } else {
            (this.visualMatrix.getSquare(x,y)).paint(gradient[0]);
        }
    }
};

LifeGame.prototype.updateCellSmart = function(x,y) {
    if(this.matrix[x] && typeof this.matrix[x][y] != 'undefined' && this.matrix[x][y] != this.smartCellValue) {
        this.matrix[x][y] = this.smartCellValue;
        (this.visualMatrix.getSquare(x,y)).paint();
    }
};

LifeGame.prototype.updateSupportCell = function(x,y,val) {
    if(this.supportMatrix[x] && typeof this.supportMatrix[x][y] != 'undefined') {
        val = !!val;
        this.supportMatrix[x][y] = val;
    }
};

LifeGame.prototype.updateCopyCell = function(x,y,val) {
    if(this.savedMatrix[x] && typeof this.savedMatrix[x][y] != 'undefined') {
        val = !!val;
        this.savedMatrix[x][y] = val;
    }
};

LifeGame.prototype.getCellFromScreenCoordinates = function(screenX,screenY) {
    if(this.matrix[Math.floor(screenX/(this.squareSize + this.spaceSize))])
        return {x:Math.floor(screenX/(this.squareSize + this.spaceSize)),y:Math.floor(screenY/(this.squareSize + this.spaceSize))};
    return null;
};

var lastTimeSpeed = this.timeSpeed;
//animate as quickly as possible. It could be better by updating the UI just 30~60times per second, but it would create some glitches
LifeGame.prototype.startAnimation = function() {
    var that = this;

    if(!this.isPaused) {
        this.saveBehaviour();
    }
    this.animationTrigger = true;
    this.isPaused = false;
    clearInterval(this.loopInterval);
    var lastDate = Date.now();
    this.loopInterval = setInterval(function(){
        that.updateLifeLoop();
        that.currentIteration++;

        if(that.timeSpeed != lastTimeSpeed) {
            that.startAnimation();
        }
    },1000./this.timeSpeed);
};

//pause life execution
LifeGame.prototype.pauseAnimation = function() {
    this.isPaused = true;
    clearInterval(this.loopInterval);
    this.animationTrigger = false;
};

//stop life execution (reset to initial behaviour)
LifeGame.prototype.stopAnimation = function() {
    this.isPaused = false;
    clearInterval(this.loopInterval);
    this.animationTrigger = false;
    this.loadSavedBehaviour();
    this.emptyBuffer();
    this.currentIteration = 0;
};

//increase life execution speed *2
LifeGame.prototype.increaseSpeed = function() {
    this.timeSpeed *= 2;
    if(this.timeSpeed > 4096) {
        this.timeSpeed = 4096;
    }
};

//decrease life execution speed /2
LifeGame.prototype.decreaseSpeed = function() {
    this.timeSpeed /= 2;
    if(this.timeSpeed < 0.25) {
        this.timeSpeed = 0.25;
    }
};

//save current information data
LifeGame.prototype.saveBehaviour = function() {
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.updateCopyCell(i,j,this.matrix[i][j]);
        }
    }
};

//load saved information data
LifeGame.prototype.loadSavedBehaviour = function() {
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.updateCell(i,j,this.savedMatrix[i][j]);
        }
    }
};

//reset Life behaviour
LifeGame.prototype.reset = function() {
    this.stopAnimation();
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.updateCell(i,j,false);
            this.updateCopyCell(i,j,false);
            this.updateSupportCell(i,j,false);
        }
    }
    this.currentIteration = 0;
};

//reset buffer matrix
LifeGame.prototype.emptyBuffer = function() {
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            this.updateSupportCell(i,j,false);
        }
    }
    this.currentIteration = 0;
};

//move support matrix content to main buffer matrix
LifeGame.prototype.copySupportMatrix = function() {
    this.smartCellValue = true;
    this.visualMatrix.setContextColor(gradient[1]);
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            //this.updateCell(i,j,this.supportMatrix[i][j]);
            if(this.supportMatrix[i][j])
                this.updateCellSmart(i,j);
        }
    }
    this.smartCellValue = false;
    this.visualMatrix.setContextColor(gradient[0]);
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
           //this.updateCell(i,j,this.supportMatrix[i][j]);
            if(!this.supportMatrix[i][j])
                this.updateCellSmart(i,j);
        }
    }
};

//main Life cycle algorithm
LifeGame.prototype.updateLifeLoop = function() {
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            var adjCells = this.getAdjacentCells(i,j);
            var aliveCellsAround = this.countAliveCells(adjCells);
            if(this.matrix[i][j]) {
                if (aliveCellsAround < 2) this.updateSupportCell(i, j, false);
                else if (aliveCellsAround == 2 || aliveCellsAround == 3) this.updateSupportCell(i, j, true);
                else this.updateSupportCell(i, j, false);
            } else {
                if (aliveCellsAround == 3) this.updateSupportCell(i, j, true);
            }
        }
    }
    this.copySupportMatrix();
};

//support function to update adjacent cells by a given coordinate
LifeGame.prototype.getAdjacentCells = function(x,y) {
    var array = [];
    for(var i = x-1; i <= x+1; i++) {
        for(var j = y-1; j <= y+1; j++) {
            if(this.matrix[i] && typeof this.supportMatrix[i][j] != 'undefined' && !(i == x && j == y)) {
                array.push({x:i,y:j});
            }
        }
    }
    return array;
};

//get number of alive cells in a given array
LifeGame.prototype.countAliveCells = function(array) {
    var count = 0;
    for(var i = 0; i < array.length; i++) {
        if(this.matrix[array[i].x][array[i].y])
            count++;
    }
    return count;
};

//update graphics with the latest calculated data
LifeGame.prototype.updateGraphics = function() {
    var square;   
    for(var i = 0; i < this.COLS; i++) {
        for(var j = 0; j < this.ROWS; j++) {
            square = this.visualMatrix.getSquare(i,j);
            if(this.drawStatusMatrix[i][j] != this.matrix[i][j]) {
                if(this.matrix[i][j]) {
                    this.visualMatrix.setContextColor(gradient[1]);
                } else {
                    this.visualMatrix.setContextColor(gradient[0]);
                }
                square.paint();
                this.drawStatusMatrix[i][j] = this.matrix[i][j];
            }
        }
    }
};