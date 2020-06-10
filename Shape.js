class Shape {
    constructor(shapeID, startingPos) {
        this.shapeID = shapeID;
        this.currentPos = createVector(startingPos.x, startingPos.y);
        this.startingPos = createVector(startingPos.x, startingPos.y);
        this.blocks = [];
        for (let pos of shapeID.blockPositions) {
            this.blocks.push(new Block(createVector(pos.x, pos.y), shapeID.color));
        }
        this.isDead = false;
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

    moveShape(x, y) {
        if (this.canMoveInDirection(x, y)) {
            this.currentPos.x += x;
            this.currentPos.y += y;
        }
    }

    moveDown() {
        if (this.canMoveDown()) {
            this.currentPos.y += 1;
        } else {
            this.killShape();
        }
    }

    resetPosition() {
        this.currentPos = createVector(this.startingPos.x, this.startingPos.y);
    }

    killShape() {
        this.isDead = true;
        for (let block of this.blocks) {
            //the block becomes disconnected from the shape and therefore the current grid position is no longer relative to the shape
            block.currentGridPos.add(this.currentPos);
            game.deadBlocks.push(block);
            game.deadBlocksMatrix[block.currentGridPos.x][block.currentGridPos.y] = block;

        }
    }

    canMoveDown() {
        for (let block of this.blocks) {
            let futureBlockPosition = p5.Vector.add(this.currentPos, block.currentGridPos);
            futureBlockPosition.y += 1;

            if (!game.isPositionVacant(futureBlockPosition)) {

                return false;
            }
        }
        return true;
    }

    canMoveInDirection(x, y) {
        for (let block of this.blocks) {
            let futureBlockPosition = p5.Vector.add(this.currentPos, block.currentGridPos);
            futureBlockPosition.y += y;
            futureBlockPosition.x += x;

            if (!game.isPositionVacant(futureBlockPosition)) {
                return false;
            }
        }
        return true;
    }


    canRotateShape(isClockwise) {
        for (let i = 0; i < this.blocks.length; i++) {
            let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i], isClockwise);
            let newAbsolutePosition = p5.Vector.add(newPosition, this.currentPos);
            if (!game.isPositionVacant(newAbsolutePosition)) {
                return false;
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

    rotateShape(isClockwise) {
        if (this.canRotateShape(isClockwise)) {
            for (let i = 0; i < this.blocks.length; i++) {
                let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i], isClockwise);
                this.blocks[i].currentGridPos = newPosition;
            }
        }
    }


}
