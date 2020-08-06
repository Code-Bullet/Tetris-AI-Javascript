class AI {


    constructor(gameWidth, gameHeight, brain) {




        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.movementPlan = new MoveHistory();
        this.brain = brain;

    }

    //Main function
    //Given the state of the matrix returns a string of instructions to get the block into position.
    calculateMovementPlan(currentShape_, heldShape_, nextShape_, blockMatrix_) {

        //clone all the input so we dont fuck it up
        let currentShape = currentShape_.clone();
        let heldShape = heldShape_ ? heldShape_.clone() : null;
        let nextShape = nextShape_ ? nextShape_.clone() : null;


        let blockMatrix = new BlockMatrix(this.gameWidth, this.gameHeight);
        blockMatrix.copyFromMatrix(blockMatrix_);

        let bestEndPositionForCurrentShape = this.getBestEndPosition(currentShape, blockMatrix);

        //check held piece and see if thats better

        //if there is no held shape then check the next shape instead
        let bestEndPositionForHeld = heldShape == null ? this.getBestEndPosition(nextShape, blockMatrix) : this.getBestEndPosition(heldShape, blockMatrix);


        //choose the piece with the best shape cost
        if (bestEndPositionForCurrentShape.shapeCost <= bestEndPositionForHeld.shapeCost) {
            this.chosenEndPosition = bestEndPositionForCurrentShape.bestShape;
        } else {
            this.chosenEndPosition = bestEndPositionForHeld.bestShape;
            this.chosenEndPosition.moveHistory.unshift("hold");
        }


        this.movementPlan = this.chosenEndPosition.moveHistory;

    }

    //ok so this ones going to look at the next shape to see what were working with
    calculateMovementPlan2(currentShape_, heldShape_, nextShape_, blockMatrix_) {
        //clone all the input so we dont fuck it up
        let currentShape = currentShape_.clone();
        let heldShape = heldShape_ ? heldShape_.clone() : null;
        let nextShape = nextShape_ ? nextShape_.clone() : null;
        let blockMatrix = new BlockMatrix(this.gameWidth, this.gameHeight);
        blockMatrix.copyFromMatrix(blockMatrix_);


        //first we get all the possible end positions for the current and held pieces

        let endPositionsForCurrentShape = this.getAllEndPositions(currentShape, blockMatrix);
        let possibleEndBlockMatricesForCurrentShape = this.convertEndPositionsToMatrices(endPositionsForCurrentShape, blockMatrix, false);


        let endPositionsForHeldShape;
        if (heldShape == null) {
            endPositionsForHeldShape = this.getAllEndPositions(nextShape, blockMatrix);
        } else {
            endPositionsForHeldShape = this.getAllEndPositions(heldShape, blockMatrix);
        }
        let possibleEndBlockMatricesForHeldShape = this.convertEndPositionsToMatrices(endPositionsForHeldShape, blockMatrix, true);

        let allPossibleEndBlockMatrices = [...possibleEndBlockMatricesForCurrentShape, ...possibleEndBlockMatricesForHeldShape];


        //so heres what im thinking, we remove all end positions apart from those which have the minimum number of holes,
        //so if there are 3 positions with only 1 hole and thats the minimum we remove all but those 3.
        //after that we take each resulting block matrix and generate all the posible end positions of the next shape on each matrix,
        //the one with the smallest cost is chosen.

        //this will do for now but there is the possibility of checking all combinations of next piece, current piece, and held piece.
        //e.g. we could do: current -> held, current -> next, held -> next, held ->current. and we check all of these for the best possible outcome then we chill
        //this will double the processing time because we are currently only doing current -> next and held -> next


        //get the minimum number of holes in the matrices

        let minNumberOfHoles = 1000;

        for (let matrix of allPossibleEndBlockMatrices) {
            minNumberOfHoles = Math.min(matrix.holeCount, minNumberOfHoles);
        }

        //now add all matrices which  have the min number of holes to a new list
        let minHoleMatrices = [];
        for (let i = 0; i < allPossibleEndBlockMatrices.length; i++) {
            if (allPossibleEndBlockMatrices[i].holeCount === minNumberOfHoles) {
                minHoleMatrices.push(allPossibleEndBlockMatrices[i]);
                // print(`matrix no: ${i}`);
                // allPossibleEndBlockMatrices[i].printMatrix();
            }
        }


        //ok now we run the next piece over each of these and then get the cost and the winner is chosen


        //actually heres the plan, all we want to do is remove all matrices which force the next piece to produce a hole

        let minNextPieceHoleMatrices = [];
        minNumberOfHoles = 1000;
        for (let i = 0; i < minHoleMatrices.length; i++) {
            let bestEndPositionData = this.getBestEndPosition(nextShape, minHoleMatrices[i]);
            let tempMatrix = minHoleMatrices[i].clone();
            tempMatrix.addShapeToMatrix(bestEndPositionData.bestShape);
            tempMatrix.clearFullRows();
            tempMatrix.countHoles();

            if(tempMatrix.holeCount=== minNumberOfHoles){
                minNextPieceHoleMatrices.push(minHoleMatrices[i]);
            }else if(tempMatrix.holeCount<minNumberOfHoles){
                minNextPieceHoleMatrices=[];
                minNumberOfHoles=tempMatrix.holeCount;
                minNextPieceHoleMatrices.push(minHoleMatrices[i]);
            }
        }


        //ok now we have a list of the matrices which we get from the current and hold pieces which produce the minimal number of holes for itself and the next piece
        //so now lets just get the lowest cost matrix and choose it.

        let minCost = 10000000;
        let minCostMatrix = null;
        for (let i = 0; i < minHoleMatrices.length; i++) {

            let matrixCost = minHoleMatrices[i].cost;
            if (minCost > matrixCost) {
                minCost = matrixCost;
                minCostMatrix = minHoleMatrices[i];
            }
        }







        // let minCost = 10000000;
        // let minCostMatrix = null;
        // for (let i = 0; i < minHoleMatrices.length; i++) {
        //
        //
        //     let bestEndPositionData = this.getBestEndPosition(nextShape, minHoleMatrices[i]);
        //     let tempMatrix = minHoleMatrices[i].clone();
        //     tempMatrix.addShapeToMatrix(bestEndPositionData.bestShape);
        //     tempMatrix.clearFullRows();
        //     tempMatrix.countHoles();
        //     tempMatrix.countPillars();
        //     tempMatrix.calculateMaximumLineHeight();
        //     tempMatrix.calculateCost();
        //     // print("-------------------------------------------");
        //     // print(`matrix no ${i} first shape`);
        //     // minHoleMatrices[i].printMatrix();
        //     // print(`matrix no ${i} second shape`);
        //     // tempMatrix.printMatrix();
        //     // print(tempMatrix);
        //     let matrixCost = bestEndPositionData.shapeCost;
        //     if (minCost > matrixCost) {
        //         minCost = matrixCost;
        //         minCostMatrix = minHoleMatrices[i];
        //     }
        // }

        // if(minCost >= 100){
        //     paused = true;
        // }
        // minCostMatrix.printMatrix();
        // print(minCostMatrix);
        // paused = true;
        this.movementPlan = minCostMatrix.movementHistory;
        // print(this.movementPlan.moveHistoryList);
    }

    //not in JS arrays are passed by reference
    removeRepeatsInPossibleEndPositions(endPositions) {
        for (let i = 0; i < endPositions.length; i++) {
            for (let j = i + 1; j < endPositions.length; j++) {
                //comparing block i to block j

                let shapeI = endPositions[i];
                let shapeJ = endPositions[j];
                let matchFound = false;

                for (let blockI of shapeI.blocks) {
                    matchFound = false;
                    for (let blockJ of shapeJ.blocks) {
                        let blockIPos = p5.Vector.add(shapeI.currentPos, blockI.currentGridPos);
                        let blockJPos = p5.Vector.add(shapeJ.currentPos, blockJ.currentGridPos);

                        if (p5.Vector.dist(blockIPos, blockJPos) < 0.1) {
                            matchFound = true;
                        }
                    }
                    if (!matchFound) {
                        break;
                    }
                }
                if (matchFound) {
                    endPositions.splice(j, 1);
                    j -= 1;
                }
            }
        }
    }


    calculateShapeCost(shape, blockMatrix_) {
        let blockMatrix = blockMatrix_.clone();
        blockMatrix.addShapeToMatrix(shape);
        blockMatrix.clearFullRows();
        blockMatrix.countHoles();
        blockMatrix.countPillars();
        blockMatrix.calculateMaximumLineHeight();
        blockMatrix.countNumberOfBlocksInRightmostLane();
        blockMatrix.calculateBumpiness();
        blockMatrix.calculateCost(this.brain);
        return blockMatrix.cost;
    }


    getAllEndPositions(startingShape, blockMatrix_) {
        //so now we need to run a loop to hit all the possible positions
        let endPositions = this.getShortestPathsToAllEndPositions(startingShape, blockMatrix_);
        //since some shape can look the same when rotated we need to remove repeats
        this.removeRepeatsInPossibleEndPositions(endPositions);
        return endPositions;
    }


    getBestEndPosition(startingShape, blockMatrix_) {

        let endPositions = this.getAllEndPositions(startingShape, blockMatrix_);
        //now lets count all the holes for each shape option and pick the lowest hole count
        let minShapeCost = 100000;
        let minShapeCostIndex = 0;
        for (let i = 0; i < endPositions.length; i++) {
            let shapeCost = this.calculateShapeCost(endPositions[i], blockMatrix_);
            if (shapeCost < minShapeCost) {
                minShapeCost = shapeCost;
                minShapeCostIndex = i;
            }
        }

        return {
            bestShape: endPositions[minShapeCostIndex],
            shapeCost: minShapeCost
        }

    }

    getNextMove() {
        if (this.movementPlan.moveHistoryList.length > 0) {

            //if all the remaining moves are downs then snap it down
            let allDown = true;
            for (let move of this.movementPlan.moveHistoryList) {
                if (move !== "DOWN") {
                    allDown = false;
                    break;
                }
            }
            if (allDown) {
                return "ALL DOWN";
            }
            return this.movementPlan.moveHistoryList.splice(0, 1)[0];
        } else {
            return "DOWN";
        }
    }

    //returns a list of all the possible end positions from this starting shape
    getShortestPathsToAllEndPositions(startingShape, blockMatrix) {
        let counter = 0;
        let endPositions = [];
        let checkedPositions = new CheckedPositionsArray(blockMatrix);
        let checkInDirection = (queue, shape, x, y, r) => {
            if (r) {
                if (shape.canRotateShape(true, blockMatrix)) {
                    let rotatedShape = shape.clone();
                    rotatedShape.rotateShape(true,blockMatrix);

                    if (!checkedPositions.hasShapesPositionBeenChecked(rotatedShape)) {
                        checkedPositions.setCheckedPositionsArrayValueAtShapesPosition(rotatedShape, true);
                        queue.push(rotatedShape);
                    }
                }
            } else {
                if (shape.canMoveInDirection(x, y, blockMatrix)) {
                    let movedShape = shape.clone();
                    movedShape.moveShape(x, y,blockMatrix);

                    if (!checkedPositions.hasShapesPositionBeenChecked(movedShape)) {
                        checkedPositions.setCheckedPositionsArrayValueAtShapesPosition(movedShape, true);
                        queue.push(movedShape);
                    }
                    // else{
                    //     if(y == 1){
                    //
                    //         print("ok");
                    //         print(movedShape);
                    //         print(checkedPositions.getIndexOfCoordinates(movedShape.currentPos.x,movedShape.currentPos.y,movedShape.currentRotationCount%4));
                    //         print(checkedPositions.getShapeFromPosition(movedShape));
                    //     }
                    // }
                }
            }
        };


        let queue = [];
        queue.push(startingShape);
        while (queue.length > 0) {

            counter++;
            //grab a shape off the front of the queue
            let shape = queue.splice(0, 1)[0];

            //if the shape cannot move down then it is a possible end position
            if (!shape.canMoveDown(blockMatrix)) {
                endPositions.push(shape.clone());
            }

            //check if you can move this shape in each way, if you can move it then add it to the back of the queue

            checkInDirection(queue, shape, -1, 0);//check left
            checkInDirection(queue, shape, 1, 0);//check right
            checkInDirection(queue, shape, 0, 0, 1);//check rotation
            checkInDirection(queue, shape, 0, 1);//check down
        }

        return endPositions;

    }


    countNumberOfBlocksInRightmostLane(shape) {
        let blockPositions = [];
        let blocksInRightLaneCounter = 0;
        for (let block of shape.blocks) {
            blockPositions.push(p5.Vector.add(shape.currentPos, block.currentGridPos));
        }
        for (let pos of blockPositions) {
            if (pos.x === this.gameWidth - 1) {
                blocksInRightLaneCounter++;
            }
        }
        return blocksInRightLaneCounter;
    }

    convertEndPositionsToMatrices(endPositions, currentMatrix, hasHeld) {
        let endMatrices = [];
        for (let shape of endPositions) {
            let newMatrix = currentMatrix.clone();
            newMatrix.addShapeToMatrix(shape);
            newMatrix.clearFullRows();
            newMatrix.countHoles();
            newMatrix.countPillars();
            newMatrix.calculateMaximumLineHeight();
            newMatrix.countNumberOfBlocksInRightmostLane();
            newMatrix.calculateBumpiness();
            newMatrix.calculateCost(this.brain);

            //add the shapes movement history to the matrix so we know how to reach this matrix
            newMatrix.addMovementHistory(shape.moveHistory);
            //if the shape is from the held spot then add the hold move to the start of the move history
            if (hasHeld) {
                newMatrix.movementHistory.addHoldMove(false);
            }

            endMatrices.push(newMatrix);
        }

        return endMatrices;
    }
}

//todo: optimise to reduce the number of bubbles in the whole map instead of just directly below
//todo: if the next piece is the same as the held piece and you can add the held piece then fuckin do it
//todo: potential look ahead (gonna be very brute forcy) to see where the next position goes
//todo: reduce the number of large pillars of blank space
//todo: kinda stop the pieces from being put ontop of holes, so you have to spend less time digging them out
//todo: optimise for how many pieces the map can accomidate for.
//todo: optimise for minimising the average height of shit i guess
//todo: kinda hard code strategy

