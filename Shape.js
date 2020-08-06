class Shape {
    constructor(shapeID, startingPos, game) {
        this.game = game;
        this.shapeID = shapeID;
        this.currentPos = createVector(startingPos.x, startingPos.y);
        this.startingPos = createVector(startingPos.x, startingPos.y);
        this.blocks = [];
        for (let pos of shapeID.blockPositions) {
            this.blocks.push(new Block(createVector(pos.x, pos.y), shapeID.color));
        }
        this.isDead = false;
        this.currentRotationCount = 0;

        //vectors which control this piece into the best position
        this.moveHistory = new MoveHistory();
    }



    clone(){

        let clone = new Shape(this.shapeID, this.startingPos, this.game);
        clone.currentPos = this.currentPos.copy();
        clone.blocks = [];
        for(let block of this.blocks){
                clone.blocks.push(block.clone());
        }
        clone.isDead = this.isDead;
        clone.currentRotationCount = this.currentRotationCount;
        clone.moveHistory = this.moveHistory.clone();
        return clone;

    }


    draw() {
        push();
        translate(this.currentPos.x * BLOCK_SIZE, this.currentPos.y * BLOCK_SIZE);
        for (let block of this.blocks) {
            block.draw();
        }
        pop();
    }

    //draws the shape with its CENTER at 0,0
    drawAtOrigin() {

        //get the midpoint of the shape
        let sumX = 0;
        let sumY = 0;
        for (let block of this.blocks) {
            sumX += block.currentGridPos.x + 0.5;
            sumY += block.currentGridPos.y + 0.5;
        }
        let midpoint = createVector(sumX / this.blocks.length, sumY / this.blocks.length);
        push();

        //translate so that the midpoint is at 0,0
        translate(-midpoint.x * BLOCK_SIZE, -midpoint.y * BLOCK_SIZE);

        for (let block of this.blocks) {
            block.draw();
        }
        pop();

    }

    moveShape(x, y,blockMatrix) {
        if(blockMatrix){
            if (this.canMoveInDirection(x, y, blockMatrix)) {
                this.currentPos.x += x;
                this.currentPos.y += y;
                this.moveHistory.addDirectionalMove(x,y);
            }
        }else if (this.canMoveInDirection(x, y)) {
            this.currentPos.x += x;
            this.currentPos.y += y;
            this.moveHistory.addDirectionalMove(x,y);
        }
    }

    moveDown(resetAfterDeath) {
        if (this.canMoveDown()) {
            this.currentPos.y += 1;
        } else {
            this.killShape(resetAfterDeath);
        }
    }

    resetPosition() {
        this.currentPos = createVector(this.startingPos.x, this.startingPos.y);
    }

    killShape(resetAfterDeath) {
        this.isDead = true;
        if(!resetAfterDeath){
            for (let block of this.blocks) {
                //the block becomes disconnected from the shape and therefore the current grid position is no longer relative to the shape
                block.currentGridPos.add(this.currentPos);
                this.game.deadBlocks.push(block);
                this.game.deadBlocksMatrix[block.currentGridPos.x][block.currentGridPos.y] = block;
            }
        }
    }



    canMoveDown(blockMatrix) {
        for (let block of this.blocks) {
            let futureBlockPosition = p5.Vector.add(this.currentPos, block.currentGridPos);
            futureBlockPosition.y += 1;
            //if a block matrix is passed into the function then look at that instead of the game
            if (blockMatrix){
                if(!blockMatrix.isPositionVacant(futureBlockPosition)){
                    return false;
                }
            }else{
                if (!this.game.isPositionVacant(futureBlockPosition)) {
                    return false;
                }
            }
        }
        return true;
    }

    canMoveInDirection(x, y,blockMatrix ) {
        //look at the future position of each block in the shape and if all those positions are vacant then we good
        for (let block of this.blocks) {
            let futureBlockPosition = p5.Vector.add(this.currentPos, block.currentGridPos);
            futureBlockPosition.y += y;
            futureBlockPosition.x += x;

            //if a block matrix is passed into the function then look at that instead of the game
            if (blockMatrix){
                if(!blockMatrix.isPositionVacant(futureBlockPosition)){
                    return false;
                }
            }else{
                if (!this.game.isPositionVacant(futureBlockPosition)) {
                    return false;
                }
            }
        }
        return true;
    }


    canRotateShape(isClockwise,blockMatrix) {
        for (let i = 0; i < this.blocks.length; i++) {
            let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i], isClockwise);
            let newAbsolutePosition = p5.Vector.add(newPosition, this.currentPos);
            //if a block matrix is passed into the function then look at that instead of the game
            if (blockMatrix){
                if(!blockMatrix.isPositionVacant(newAbsolutePosition)){
                    return false;
                }
            }else{
                if (!this.game.isPositionVacant(newAbsolutePosition)) {
                    return false;
                }
            }
        }
        return true;
    }

    getBlockPositionAfterShapeIsRotated(block, isClockwise) {
        let startingPos = block.currentGridPos;
        let rotationPoint = this.shapeID.rotationPoint;
        let startingPosRelativeToRotationPoint = p5.Vector.sub(startingPos, rotationPoint);
        let rotatedRelativePoint = startingPosRelativeToRotationPoint.rotate(
            isClockwise ? Math.PI / 2 : -Math.PI / 2);
        let newPosition = p5.Vector.add(rotationPoint, rotatedRelativePoint);
        newPosition.x = Math.round(newPosition.x);
        newPosition.y = Math.round(newPosition.y);
        return newPosition;

    }

    rotateShape(isClockwise, blockMatrix) {

        if(blockMatrix){
            if (this.canRotateShape(isClockwise,blockMatrix)) {
                for (let i = 0; i < this.blocks.length; i++) {
                    let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i], isClockwise);
                    this.blocks[i].currentGridPos = newPosition;
                }
                this.currentRotationCount+=1;
                this.moveHistory.addRotationMove();
            }
        }else{
            if (this.canRotateShape(isClockwise)) {
                for (let i = 0; i < this.blocks.length; i++) {
                    let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i], isClockwise);
                    this.blocks[i].currentGridPos = newPosition;
                }
                this.currentRotationCount+=1;
                this.moveHistory.addRotationMove();
            }

        }

    }

}
