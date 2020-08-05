class ShapeGenerator {
    constructor() {
        this.setShapeIDs();
        this.shapeIDs = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];
        this.currentBagOfShapeIDs = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];

    }

    getNewRandomShape(position, game) {
        return new Shape(this.getRandomShapeID(), position, game);
    }

    getRandomShapeID() {
        if (this.currentBagOfShapeIDs.length > 0) {
            return this.currentBagOfShapeIDs.splice(Math.floor(random(0, this.currentBagOfShapeIDs.length)), 1)[0];
        } else {
            this.currentBagOfShapeIDs = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];
            return this.getRandomShapeID();
        }
    }

    setShapeIDs() {
        this.squareShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(1, 0), createVector(1, 1)],
            rotationPoint: createVector(0.5, 0.5),
            color: color(255, 239, 43),
            name: "Square"
        }
        this.lShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(1, 2)],
            rotationPoint: createVector(0, 1),
            color: color(247, 167, 0),
            name: "L"
        }
        this.reverseLShape = {
            blockPositions: [createVector(1, 0), createVector(1, 1), createVector(1, 2), createVector(0, 2)],
            rotationPoint: createVector(1, 1),
            color: color(0, 100, 200),
            name: "ReverseL"
        }
        this.lineShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
            rotationPoint: createVector(0.5, 1.5),
            color: color(0, 201, 223),
            name: "Line"
        }

        this.tShape = {
            blockPositions: [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(1, 2)],
            rotationPoint: createVector(1, 1),
            color: color(155, 0, 190),
            name: "T"
        }

        this.zShape = {

            blockPositions: [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
            rotationPoint: createVector(1, 1),
            color: color(220, 0, 0),
            name: "Z"

        }
        this.sShape = {
            blockPositions: [createVector(0, 1), createVector(1, 1), createVector(1, 0), createVector(2, 0)],
            rotationPoint: createVector(1, 1),
            color: color(0, 230, 50),
            name: "S"
        }

    }

}
