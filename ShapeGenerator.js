class ShapeGenerator {
    constructor() {
        this.setShapeIDs();
        this.shapeIDs = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];
    }

    getNewRandomShape(position) {
        return new Shape(this.getRandomShapeID(), position);
    }

    getRandomShapeID() {
        return this.shapeIDs[Math.floor(random(0, this.shapeIDs.length))];
    }

    setShapeIDs() {
        this.squareShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(1, 0), createVector(1, 1)],
            rotationPoint: createVector(0.5, 0.5),
            color: color(255, 239, 43)
        }
        this.lShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(1, 2)],
            rotationPoint: createVector(0, 1),
            color: color(247, 167, 0)

        }
        this.reverseLShape = {
            blockPositions: [createVector(1, 0), createVector(1, 1), createVector(1, 2), createVector(0, 2)],
            rotationPoint: createVector(1, 1),
            color: color(0, 100, 200)
        }
        this.lineShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
            rotationPoint: createVector(0.5, 1.5),
            color: color(0, 201, 223)
        }

        this.tShape = {
            blockPositions: [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(1, 2)],
            rotationPoint: createVector(1, 1),
            color: color(155, 0, 190)
        }

        this.zShape = {

            blockPositions: [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
            rotationPoint: createVector(1, 1),
            color: color(220, 0, 0)

        }
        this.sShape = {
            blockPositions: [createVector(0, 1), createVector(1, 1), createVector(1, 0), createVector(2, 0)],
            rotationPoint: createVector(1, 1),
            color: color(0, 230, 50)
        }

    }

}
