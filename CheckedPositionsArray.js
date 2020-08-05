class CheckedPositionsArray{
    //an array which stores whether each position and rotation of a shape has already been checked for this matrix.

    constructor(blockMatrix){
        this.blockMatrix = blockMatrix;
        this.checkedPositions = [];
        this.checkedPositionShapes = [];
        this.setAllPositionsToFalse();


    }

    getIndexOfCoordinates(x,y,r){
        return x + this.blockMatrix.width * y  + this.blockMatrix.width * this.blockMatrix.height * r;
    }

    setAllPositionsToFalse(){
        this.checkedPositions = [];
        for (let i = 0; i < this.blockMatrix.width * this.blockMatrix.height * 4; i++) {
            this.checkedPositions.push(false);
            this.checkedPositionShapes.push(null);
        }
    }

    resetCheckedPositions(){
        this.checkedPositions = [];
        for (let i = 0; i < this.blockMatrix.width * this.blockMatrix.height * 4; i++) {
            this.checkedPositions.push(false);
        }
    }

    hasPositionBeenChecked(x, y, r) {
        return this.checkedPositions[this.getIndexOfCoordinates(x,y,r)];
    }

    setCheckedPositionsArrayValue(x, y, r, value) {
        this.checkedPositions[this.getIndexOfCoordinates(x,y,r)] = value;
    }

    hasShapesPositionBeenChecked(shape) {
        return this.checkedPositions[this.getIndexOfCoordinates(shape.currentPos.x, shape.currentPos.y, shape.currentRotationCount % 4)];
    }
    getShapeFromPosition(shape) {
        return this.checkedPositionShapes[this.getIndexOfCoordinates(shape.currentPos.x, shape.currentPos.y, shape.currentRotationCount % 4)];
    }
    setCheckedPositionsArrayValueAtShapesPosition(shape, value) {
        this.checkedPositions[this.getIndexOfCoordinates(shape.currentPos.x, shape.currentPos.y, shape.currentRotationCount % 4)] = value;
        // this.checkedPositionShapes[this.getIndexOfCoordinates(shape.currentPos.x, shape.currentPos.y, shape.currentRotationCount % 4)] = shape;
    }


}