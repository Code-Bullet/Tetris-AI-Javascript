class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.shapeGenerator = new ShapeGenerator();
        this.deadBlocks = [];
        this.deadBlocksMatrix = [];
        this.currentShape = this.shapeGenerator.getNewRandomShape(createVector(int(this.gameWidth / 2), 0));
        this.resetBlocksMatrix();
        this.nextShape = this.shapeGenerator.getNewRandomShape(createVector(int(this.gameWidth / 2), 0));
        this.heldShape = null;
        this.hasHeldThisShape = false;
    }

    resetBlocksMatrix() {
        this.deadBlocksMatrix = [];
        for (let i = 0; i < this.gameWidth; i++) {
            let column = [];
            for (let j = 0; j < this.gameHeight; j++) {
                column.push(null);
            }
            this.deadBlocksMatrix.push(column);
        }
    }

    moveShapeDown() {
        this.currentShape.moveDown();

        if (this.currentShape.isDead) {
            this.hasHeldThisShape = false;
            this.checkForClearedLines();
            this.currentShape = this.nextShape;
            this.nextShape = this.shapeGenerator.getNewRandomShape(createVector(int(this.gameWidth / 2), 0));
            //if the new block is stuck then the game resets
            if (!this.currentShape.canMoveDown()) {
                this.resetBlocksMatrix();
                this.deadBlocks = [];
                this.currentShape = this.shapeGenerator.getNewRandomShape(createVector(int(this.gameWidth / 2), 0));
                this.nextShape = this.shapeGenerator.getNewRandomShape(createVector(int(this.gameWidth / 2), 0));

            }
        }
    }

    checkForClearedLines() {
        for (let j = 0; j < this.gameHeight; j++) {
            let rowCleared = true;
            for (let i = 0; i < this.gameWidth; i++) {
                if (this.deadBlocksMatrix[i][j] == null) {
                    rowCleared = false;
                    break;
                }
            }
            if (rowCleared) {
                //deactivate row
                for (let i = 0; i < this.gameWidth; i++) {
                    this.deadBlocksMatrix[i][j].isDead = true;
                }

                //for each row above the cleared row move them down
                for (let rowIndexToMoveDown = j - 1; rowIndexToMoveDown >= 0; rowIndexToMoveDown--) {
                    for (let i = 0; i < this.gameWidth; i++) {

                        if (this.deadBlocksMatrix[i][rowIndexToMoveDown] !== null) {
                            this.deadBlocksMatrix[i][rowIndexToMoveDown].currentGridPos.y += 1;
                        }
                        this.deadBlocksMatrix[i][rowIndexToMoveDown + 1] = this.deadBlocksMatrix[i][rowIndexToMoveDown];
                        this.deadBlocksMatrix[i][rowIndexToMoveDown] = null;
                    }
                }

            }
        }
    }

    moveShapeLeft() {
        this.currentShape.moveShape(-1, 0);
    }

    moveShapeRight() {
        this.currentShape.moveShape(1, 0);
    }

    rotateShape() {
        this.currentShape.rotateShape(true);
    }

    draw() {


        background(240);

        //draw a rectangle boarder around the whole thing
        push();
        {
            noFill();
            stroke(200);
            strokeWeight(4);
            rect(2, 2, canvas.width - 4, canvas.height - 4);
        }
        pop();


        push();
        {

            //translate so that the game is in the center of the canvas
            let gameWidthInPixels = this.gameWidth * BLOCK_SIZE;
            let gameHeightInPixels = this.gameHeight * BLOCK_SIZE;
            translate((canvas.width - gameWidthInPixels) / 2, (canvas.height - gameHeightInPixels) / 2);

            //draw the grid
            this.drawGrid();
            //draw the blocks which have already been placed
            for (let block of this.deadBlocks) {
                block.draw();
            }
            //draw the current shape
            this.currentShape.draw();

            //draw a rectangle boarder around the grid
            push();
            {
                noFill();
                stroke(0);
                strokeWeight(4);
                rect(0, 0, this.gameWidth * BLOCK_SIZE, this.gameHeight * BLOCK_SIZE);
            }
            pop();
        }
        pop();

        this.drawNextShape();
        this.drawHeldShape();
    }

    holdShape(){

        if(this.hasHeldThisShape)
            return;
        if(this.heldShape){
            this.hasHeldThisShape = true;
            let temp = this.heldShape;
            this.heldShape = this.currentShape;
            this.heldShape.resetPosition();
            this.currentShape = temp;
            this.currentShape.resetPosition();

        }else{
            this.heldShape = this.currentShape;
            this.heldShape.resetPosition();
            this.currentShape = this.nextShape;
            this.nextShape = this.shapeGenerator.getNewRandomShape(createVector(int(this.gameWidth / 2), 0));
        }
    }

    drawNextShape() {
        let gameWidthInPixels = this.gameWidth * BLOCK_SIZE;
        let gameHeightInPixels = this.gameHeight * BLOCK_SIZE;
        let gamePositionTopLeft = createVector((canvas.width - gameWidthInPixels) / 2, (canvas.height - gameHeightInPixels) / 2);

        let nextShapeWidthInPixels = 4 * BLOCK_SIZE;
        push();
        {
            translate((gamePositionTopLeft.x + gameWidthInPixels) + gamePositionTopLeft.x / 2 - nextShapeWidthInPixels / 2, gamePositionTopLeft.y);
            fill(255);
            stroke(0);
            strokeWeight(4);
            rect(0, 0, nextShapeWidthInPixels, nextShapeWidthInPixels);

            translate(2 * BLOCK_SIZE, 2 * BLOCK_SIZE);
            ellipse(0, 0, 10);
            this.nextShape.drawAtOrigin();
            pop();
        }
    }



    drawHeldShape() {
        let gameWidthInPixels = this.gameWidth * BLOCK_SIZE;
        let gameHeightInPixels = this.gameHeight * BLOCK_SIZE;
        let gamePositionTopLeft = createVector((canvas.width - gameWidthInPixels) / 2, (canvas.height - gameHeightInPixels) / 2);

        let nextShapeWidthInPixels = 4 * BLOCK_SIZE;
        push();
        {
            translate( gamePositionTopLeft.x / 2 - nextShapeWidthInPixels / 2, gamePositionTopLeft.y);
            fill(255);
            stroke(0);
            strokeWeight(4);
            rect(0, 0, nextShapeWidthInPixels, nextShapeWidthInPixels);

            translate(2 * BLOCK_SIZE, 2 * BLOCK_SIZE);
            ellipse(0, 0, 10);
            if(this.heldShape){
                this.heldShape.drawAtOrigin();
            }
            pop();


        }
    }

    drawGrid() {
        push();
        noStroke();

        fill(255);
        rect(0, 0, this.gameWidth * BLOCK_SIZE, this.gameHeight * BLOCK_SIZE);
        stroke(200);
        strokeWeight(1);
        for (let i = 0; i < this.gameWidth; i++) {
            line(i * BLOCK_SIZE, 0, i * BLOCK_SIZE, this.gameHeight * BLOCK_SIZE);
        }
        for (let j = 0; j < this.gameHeight; j++) {
            line(0, j * BLOCK_SIZE, this.gameWidth * BLOCK_SIZE, j * BLOCK_SIZE);
        }
        pop();
    }

    isPositionVacant(position) {
        //if the position is within the grid of the game
        if (position.y < this.gameHeight && position.x >= 0 && position.x < this.gameWidth) {
            //if the position is not null in the matrix
            if (this.deadBlocksMatrix[position.x][position.y] != null) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }
}