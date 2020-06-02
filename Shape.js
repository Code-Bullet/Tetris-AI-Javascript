class Shape {
    constructor(shapeID, startingPos) {
        this.shapeID = shapeID;
        this.currentPos = startingPos;
        this.blocks = [];
        for (let pos of shapeID.blockPositions) {
            this.blocks.push(new Block(pos, shapeID.color));
        }
    }

    draw() {
        push();
        translate(this.currentPos.x*BLOCK_SIZE,this.currentPos.y*BLOCK_SIZE);
        for (let block of this.blocks) {
            block.draw();
        }
        pop();
    }

    moveDown() {
        this.currentPos.y +=1;
        // for (let block of this.blocks) {
        //     block.moveDown();
        // }
    }

    rotateShape(){
        for(let i = 0 ; i< this.blocks.length; i++){
            let startingPos = this.blocks[i].currentGridPos;
            let rotationPoint = this.shapeID.rotationPoint;
            let startingPosRelativeToRotationPoint = p5.Vector.sub(startingPos, rotationPoint);
            let rotatedRelativePoint = startingPosRelativeToRotationPoint.rotate(Math.PI/2);
            let newPosition = p5.Vector.add(rotationPoint, rotatedRelativePoint);
            this.blocks[i].currentGridPos = newPosition;
            // print("startingPos,rotationPoint, startingPosRelativeToRotationPoint,rotatedRelativePoint,newPosition");

            // print(startingPos,rotationPoint, startingPosRelativeToRotationPoint,rotatedRelativePoint,newPosition);
        }
    }
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
        color : color(255,239,43)
    }
    lShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(1, 2)],
        rotationPoint: createVector(0, 1),
        color : color(247,167,0)

    }
    reverseLShape = {
        blockPositions: [createVector(1, 0), createVector(1, 1), createVector(1, 2), createVector(0, 2)],
        rotationPoint: createVector(1, 1),
        color: color(0,100,200)
    }
    lineShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
        rotationPoint: createVector(0.5, 1.5),
        color: color(0,201,223)
    }

    tShape = {
        blockPositions: [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(1, 2)],
        rotationPoint: createVector(1, 1),
        color: color(155,0,190)
    }

    zShape = {

        blockPositions: [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
        rotationPoint: createVector(1, 1),
        color: color(220,0,0)

    }

    sShape = {
        blockPositions: [createVector(0, 1), createVector(1, 1), createVector(1, 0), createVector(2, 0)],
        rotationPoint: createVector(1, 1),
        color: color(0,230,50)
    }

}


