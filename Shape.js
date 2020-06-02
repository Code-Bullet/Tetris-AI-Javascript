class Shape {
    constructor(shapeID, startingPos) {
        this.shapeID = shapeID;
        this.currentPos = startingPos;
        this.blocks = [];
        for (let pos of shapeID.blockPositions) {
            this.blocks.push(new Block(createVector(pos.x,pos.y), shapeID.color));
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

    moveDown() {
        if(this.canMoveDown()){
            this.currentPos.y += 1;
        }else{
            this.killShape();
        }
    }

    killShape(){
        this.isDead = true;
        for(let block of this.blocks){
            block.isDead = true;

            //the block becomes disconnected from the shape and therefore the current grid position is no longer relative to the shape
            block.currentGridPos.add(this.currentPos);
            deadBlocks.push(block);
            deadBlocksMatrix[block.currentGridPos.x][block.currentGridPos.y] = block;

        }
    }

    canMoveDown(){
        for(let block of this.blocks){
            let futureBlockPosition = p5.Vector.add(this.currentPos,block.currentGridPos);
            futureBlockPosition.y+=1;

            if(!isPositionVacant(futureBlockPosition)){

                return false;
            }
            // if(futureBlockPosition.y<gameHeight){
            //
            //     if(deadBlocksMatrix[futureBlockPosition.x][futureBlockPosition.y] != null){
            //         return false;
            //     }
            // }else{
            //     return false;
            // }
        }
        return true;
    }



    canRotateShape(isClockwise){
        for (let i = 0; i < this.blocks.length; i++) {
            let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i],isClockwise);
            let newAbsolutePosition = p5.Vector.add(newPosition,this.currentPos);
            if(!isPositionVacant(newAbsolutePosition)){
                return false;
            }
        }
        return true;
    }

    getBlockPositionAfterShapeIsRotated(block, isClockwise){
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
        if(this.canRotateShape()){
            for (let i = 0; i < this.blocks.length; i++) {
                let newPosition = this.getBlockPositionAfterShapeIsRotated(this.blocks[i],isClockwise);
                this.blocks[i].currentGridPos = newPosition;

            }
        }
    }
}
function isPositionVacant(position){
    if(position.y<gameHeight && position.x>0 && position.x<gameWidth){

        if(deadBlocksMatrix[position.x][position.y] != null){
            print("hit other piece");
            return false;
        }
    }else{
        print("Hit bottom");
        return false;

    }
    return true;

}
let squareShape;
let lShape;
let reverseLShape;
let lineShape;
let tShape;
let zShape;
let sShape;


function setShapeIDs() {

    squareShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(1, 0), createVector(1, 1)],
        rotationPoint: createVector(0.5, 0.5),
        color: color(255, 239, 43)
    }
    lShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(1, 2)],
        rotationPoint: createVector(0, 1),
        color: color(247, 167, 0)

    }
    reverseLShape = {
        blockPositions: [createVector(1, 0), createVector(1, 1), createVector(1, 2), createVector(0, 2)],
        rotationPoint: createVector(1, 1),
        color: color(0, 100, 200)
    }
    lineShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
        rotationPoint: createVector(0.5, 1.5),
        color: color(0, 201, 223)
    }

    tShape = {
        blockPositions: [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(1, 2)],
        rotationPoint: createVector(1, 1),
        color: color(155, 0, 190)
    }

    zShape = {

        blockPositions: [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
        rotationPoint: createVector(1, 1),
        color: color(220, 0, 0)

    }

    sShape = {
        blockPositions: [createVector(0, 1), createVector(1, 1), createVector(1, 0), createVector(2, 0)],
        rotationPoint: createVector(1, 1),
        color: color(0, 230, 50)
    }
    shapeIDs = [squareShape, lShape, reverseLShape, lineShape, tShape, zShape, sShape];

}


