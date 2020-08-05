
class AI {
    constructor() {
        this.checkedPositions = [];
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.possibleEndPositions = [];
        this.chosenEndPosition = null;
        this.movementPlan = [];


        //this shit is for showing all the current moves
        this.endPosCounter = 0;
        this.tempEndPos = null;

    }

    resetCheckedPositions() {
        this.checkedPositions = [];
        for (let i = 0; i < this.gameWidth * this.gameHeight * 4; i++) {
            this.checkedPositions.push(false);
        }

    }

    removeRepeatsInPossibleEndPositions() {
        for (let i = 0; i < this.possibleEndPositions.length; i++) {
            for (let j = i + 1; j < this.possibleEndPositions.length; j++) {
                //comparing block i to block j

                let shapeI = this.possibleEndPositions[i];
                let shapeJ = this.possibleEndPositions[j];
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
                    this.possibleEndPositions.splice(j, 1);
                    j -= 1;
                }
            }
        }
    }

    showPossibleMoveNo(moveNo) {

        if (moveNo >= this.possibleEndPositions.length) {
            return;
        }
        push();
        {

            //translate so that the game is in the center of the canvas
            let gameWidthInPixels = this.gameWidth * BLOCK_SIZE;
            let gameHeightInPixels = this.gameHeight * BLOCK_SIZE;
            translate((canvas.width - gameWidthInPixels) / 2, (canvas.height - gameHeightInPixels) / 2);
            for (let block of this.possibleEndPositions[moveNo].blocks) {
                block.color = color(0, 0, 0, 0);
            }
            this.possibleEndPositions[moveNo].draw();
            pop();
        }
    }

    //probs get rid of this
    showAllEndPositionPaths(){
        if(this.tempEndPos.movementPlan.length > 0){

        }
        this.endPosCounter = 0;
        this.tempEndPos = null;
    }

    showBestMove() {
        if (this.chosenEndPosition != null) {
            push();
            {
                //translate so that the game is in the center of the canvas
                let gameWidthInPixels = this.gameWidth * BLOCK_SIZE;
                let gameHeightInPixels = this.gameHeight * BLOCK_SIZE;
                translate((canvas.width - gameWidthInPixels) / 2, (canvas.height - gameHeightInPixels) / 2);
                for (let block of this.chosenEndPosition.blocks) {
                    block.color = color(0, 0, 0, 0);
                }
                this.chosenEndPosition.draw();
                pop();
            }
        }
    }


    calculateTotalWorldHoles(shape, blockMatrix_) {
        //clone the block matrix
        let blockMatrix = [];

        for (let i = 0; i < game.gameWidth; i++) {
            let column = [];
            for (let j = 0; j < game.gameHeight; j++) {
                if (blockMatrix_[i][j] !== null) {
                    column.push(blockMatrix_[i][j].clone())
                } else {
                    column.push(null);
                }
            }
            blockMatrix.push(column);
        }

        //add the shape to the block matrix
        for (let block of shape.blocks) {
            //the block becomes disconnected from the shape and therefore the current grid position is no longer relative to the shape
            let newPosition = p5.Vector.add(block.currentGridPos, shape.currentPos);
            blockMatrix[newPosition.x][newPosition.y] = block.clone();
        }

        //clear required lines
        for (let j = 0; j < this.gameHeight; j++) {
            let rowCleared = true;
            for (let i = 0; i < this.gameWidth; i++) {
                if (blockMatrix[i][j] == null) {
                    rowCleared = false;
                    break;
                }
            }
            if (rowCleared) {

                //for each row above the cleared row move them down
                for (let rowIndexToMoveDown = j - 1; rowIndexToMoveDown >= 0; rowIndexToMoveDown--) {
                    for (let i = 0; i < this.gameWidth; i++) {

                        if (blockMatrix[i][rowIndexToMoveDown] !== null) {
                            blockMatrix[i][rowIndexToMoveDown].currentGridPos.y += 1;
                        }
                        blockMatrix[i][rowIndexToMoveDown + 1] = blockMatrix[i][rowIndexToMoveDown];
                        blockMatrix[i][rowIndexToMoveDown] = null;
                    }
                }

            }
        }

        //count holes
        //holes are blank spaces with a block above it.
        let holeCount = 0;


        for (let i = 0; i < this.gameWidth; i++) {

            //going down each column look for a block and once found each block below is a hole
            let blockFound = false;
            for (let j = 0; j < this.gameHeight; j++) {
                if (blockMatrix[i][j] != null) {
                    blockFound = true;
                } else if (blockFound) {
                    holeCount++;
                }
            }
        }

        return holeCount;
    }


    calculateHoles(shape) {
        let blockPositions = [];
        let holeCounter = 0;
        for (let block of shape.blocks) {
            blockPositions.push(p5.Vector.add(shape.currentPos, block.currentGridPos));
        }

        for (let pos of blockPositions) {
            let posBelow = createVector(round(pos.x), round(pos.y + 1));
            if (game.isPositionVacant(posBelow)) {
                let isInCurrentShape = false;
                for (let pos2 of blockPositions) {
                    if (pos2.equals(posBelow)) {
                        isInCurrentShape = true;
                        break;
                    }
                }
                if (!isInCurrentShape) {
                    holeCounter++;
                }
            }
        }
        return holeCounter;
    }


    calculateShapeCost(shape, blockMatrix) {
        // let holeCountMultiplier = 100;
        let holeCountMultiplier = 100;
        let shapeHeightMultiplier = 1;
        // let shapeHeightMultiplier = 0;
        let pillarCountMultiplier = 2;
        // let pillarCountMultiplier = 0;
        //let gridHeightMultiplier = 1;

        let noneLineShapeInRightMostLaneMultiplier = 1;

        let holeCount = this.calculateTotalWorldHoles(shape, blockMatrix);
        let shapeHeight = this.gameHeight - shape.currentPos.y;

        let pillarCount = this.countNumberAndHeightOfPillars(shape, blockMatrix);
        // let noneLineBlocksInRightmostLaneCount = shape.shapeID.name === "Line" ? 0 : this.countNumberOfBlocksInRightmostLane(shape);


        let costOfShape =
            holeCount * holeCountMultiplier +
            shapeHeight * shapeHeightMultiplier +
            pillarCount * pillarCountMultiplier;
        // noneLineBlocksInRightmostLaneCount + noneLineShapeInRightMostLaneMultiplier;
        return costOfShape;
    }

    cloneBlockMatrix(blockMatrix_) {
        let blockMatrix = [];

        for (let i = 0; i < game.gameWidth; i++) {
            let column = [];
            for (let j = 0; j < game.gameHeight; j++) {
                if (blockMatrix_[i][j] !== null) {
                    column.push(blockMatrix_[i][j].clone())
                } else {
                    column.push(null);
                }
            }
            blockMatrix.push(column);
        }
        return blockMatrix;

    }

    //Given the state of the matrix returns a string of instructions to get the block into position.
    calculateMovementPlan(currentShape_, heldShape_, nextShape_, blockMatrix_) {

        //clone all the input so we dont fuck it up
        let currentShape = currentShape_.clone();
        let heldShape = heldShape_ ? heldShape_.clone() : null;
        let nextShape = nextShape_ ? nextShape_.clone() : null;
        let blockMatrix = this.cloneBlockMatrix(blockMatrix_);


        let bestEndPositionForCurrentShape = this.getBestEndPosition(currentShape, blockMatrix_);

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
//Given the state of the matrix returns a string of instructions to get the block into position.
    calculateMovementPlanByConsideringNextShape(currentShape_, heldShape_, nextShape_, blockMatrix_) {

        //clone all the input so we dont fuck it up
        let currentShape = currentShape_.clone();
        let heldShape = heldShape_ ? heldShape_.clone() : null;
        let nextShape = nextShape_ ? nextShape_.clone() : null;
        let blockMatrix = this.cloneBlockMatrix(blockMatrix_);

        //populate the array with falses since we haven't found any yet
        this.resetCheckedPositions();
        this.resetPossibleEndPositions();

        this.calculateShortestPathsToAllEndPositions(startingShape);

        //since some shape can look the same when rotated we need to remove repeats
        this.removeRepeatsInPossibleEndPositions();

        //now lets count all the holes for each shape option and pick the lowest hole count
        let minShapeCost = 100000;
        let minShapeCostIndex = 0;
        for (let i = 0; i < this.possibleEndPositions.length; i++) {
            let shapeCost = this.calculateShapeCost(this.possibleEndPositions[i], blockMatrix_);
            if (shapeCost < minShapeCost) {
                minShapeCost = shapeCost;
                minShapeCostIndex = i;
            }
        }

        return {
            bestShape: this.possibleEndPositions[minShapeCostIndex],
            shapeCost: minShapeCost
        }



        //---------------------
        // old shit






        let bestEndPositionForCurrentShape = this.getBestEndPosition(currentShape, blockMatrix_);

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


    getBestEndPosition(startingShape, blockMatrix_) {
        //populate the array with falses since we haven't found any yet
        this.resetCheckedPositions();
        this.resetPossibleEndPositions();

        //so now we need to run a loop to hit all the possible positions
        // this.checkAllPositionsReachableFrom(currentShape);
        this.calculateShortestPathsToAllEndPositions(startingShape);

        //since some shape can look the same when rotated we need to remove repeats
        this.removeRepeatsInPossibleEndPositions();

        //now lets count all the holes for each shape option and pick the lowest hole count
        let minShapeCost = 100000;
        let minShapeCostIndex = 0;
        for (let i = 0; i < this.possibleEndPositions.length; i++) {
            let shapeCost = this.calculateShapeCost(this.possibleEndPositions[i], blockMatrix_);
            if (shapeCost < minShapeCost) {
                minShapeCost = shapeCost;
                minShapeCostIndex = i;
            }
        }

        return {
            bestShape: this.possibleEndPositions[minShapeCostIndex],
            shapeCost: minShapeCost
        }

    }

    getNextMove() {
        if (this.movementPlan.length > 0) {

            //if all the remaining moves are downs then snap it down
            let allDown = true;
            for (let move of this.movementPlan) {
                if ((move === "hold") || !move.equals(createVector(0, 1, 0))) {
                    allDown = false;
                    break;
                }
            }
            if (allDown) {
                return "allDown";
            }
            return this.movementPlan.splice(0, 1)[0];
        } else {
            return createVector(0, 1, 0);
        }
    }

    hasPositionBeenChecked(x, y, r) {
        return this.checkedPositions[game.gameWidth * y + x + game.gameWidth * game.gameHeight * r];
    }

    setCheckedPositionsArrayValue(x, y, r, value) {
        this.checkedPositions[game.gameWidth * y + x + game.gameWidth * game.gameHeight * r] = value;
    }

    hasShapesPositionBeenChecked(shape) {
        return this.hasPositionBeenChecked(shape.currentPos.x, shape.currentPos.y, shape.currentRotationCount % 4);
    }

    setCheckedPositionsArrayValueAtShapesPosition(shape, value) {
        this.setCheckedPositionsArrayValue(shape.currentPos.x, shape.currentPos.y, shape.currentRotationCount % 4, value);
    }



    calculateShortestPathsToAllEndPositions(startingShape, _blockMatrix) {
        let counter = 0;
        let checkInDirection = (queue, shape, x, y, r) => {
            if (r && shape.canRotateShape(true)) {
                let rotatedShape = shape.clone();
                rotatedShape.rotateShape(true);

                if (!this.hasShapesPositionBeenChecked(rotatedShape)) {
                    this.setCheckedPositionsArrayValueAtShapesPosition(rotatedShape, true);
                    queue.push(rotatedShape);
                }
            } else {
                if (shape.canMoveInDirection(x, y)) {
                    let movedShape = shape.clone();
                    movedShape.moveShape(x, y);

                    if (!this.hasShapesPositionBeenChecked(movedShape)) {
                        this.setCheckedPositionsArrayValueAtShapesPosition(movedShape, true);
                        queue.push(movedShape);
                    }
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
            if (!shape.canMoveDown()) {
                this.possibleEndPositions.push(shape.clone());
            }

            //check if you can move this shape in each way, if you can move it then add it to the back of the queue

            checkInDirection(queue, shape, -1, 0);//check left
            checkInDirection(queue, shape, 1, 0);//check right
            checkInDirection(queue, shape, 0, 0, 1);//check rotation
            checkInDirection(queue, shape, 0, 1);//check down
        }

        print("counter is " + counter);

    }

    checkAllPositionsReachableFrom(startingShape) {
        let checkInDirection = (x, y, r) => {
            if (r && startingShape.canRotateShape(true)) {
                let rotatedShape = startingShape.clone();
                rotatedShape.rotateShape(true);
                if (!this.hasShapesPositionBeenChecked(rotatedShape)) {
                    this.setCheckedPositionsArrayValueAtShapesPosition(rotatedShape, true);
                    this.checkAllPositionsReachableFrom(rotatedShape);
                }
            } else {
                if (startingShape.canMoveInDirection(x, y)) {
                    let movedShape = startingShape.clone();
                    movedShape.moveShape(x, y);

                    if (!this.hasShapesPositionBeenChecked(movedShape)) {
                        this.setCheckedPositionsArrayValueAtShapesPosition(movedShape, true);
                        this.checkAllPositionsReachableFrom(movedShape);
                    }
                }
            }
        };

        if (!startingShape.canMoveDown()) {
            this.possibleEndPositions.push(startingShape.clone());
        }

        checkInDirection(0, 1);
        checkInDirection(-1, 0);
        checkInDirection(1, 0);
        checkInDirection(0, 0, 1);

    }

    resetPossibleEndPositions() {
        this.possibleEndPositions = [];
    }

    //a pillar is an area which is reliant on a line piece, i.e. a formation of 3 or more blocks high with and empty space next to each
    //note will probably allow it for pillars on the right side so you can get some sweet tetrises
    countNumberAndHeightOfPillars(shape, blockMatrix_) {
        let blockMatrix = this.cloneBlockMatrix(blockMatrix_);

        //add the shape to the block matrix
        for (let block of shape.blocks) {
            //the block becomes disconnected from the shape and therefore the current grid position is no longer relative to the shape
            let newPosition = p5.Vector.add(block.currentGridPos, shape.currentPos);
            blockMatrix[newPosition.x][newPosition.y] = block.clone();
        }


        //clear required lines
        for (let j = 0; j < this.gameHeight; j++) {
            let rowCleared = true;
            for (let i = 0; i < this.gameWidth; i++) {
                if (blockMatrix[i][j] == null) {
                    rowCleared = false;
                    break;
                }
            }
            if (rowCleared) {

                //for each row above the cleared row move them down
                for (let rowIndexToMoveDown = j - 1; rowIndexToMoveDown >= 0; rowIndexToMoveDown--) {
                    for (let i = 0; i < this.gameWidth; i++) {

                        if (blockMatrix[i][rowIndexToMoveDown] !== null) {
                            blockMatrix[i][rowIndexToMoveDown].currentGridPos.y += 1;
                        }
                        blockMatrix[i][rowIndexToMoveDown + 1] = blockMatrix[i][rowIndexToMoveDown];
                        blockMatrix[i][rowIndexToMoveDown] = null;
                    }
                }

            }
        }


        //count pillars

        let pillarCount = 0;


        for (let i = 0; i < this.gameWidth; i++) {

            //going up each column look for 3 blocks in a row with nothing to the left
            let currentPillarHeightL = 0;
            let currentPillarHeightR = 0;
            for (let j = this.gameHeight - 1; j >= 0; j--) {

                //if this positions has a block and there is no block to the left then this is potentially part of a pillar
                if (i > 0 && blockMatrix[i][j] != null && blockMatrix[i - 1][j] === null) {
                    currentPillarHeightL++;
                } else {
                    //if the current pillar height is >=3 then we have found a pillar, yay
                    if (currentPillarHeightL >= 3) {
                        //pillar count is 1 for a 3 height pillar 2 for a 4 height pillar ect.
                        pillarCount += currentPillarHeightL - 2;
                    }
                    currentPillarHeightL = 0;
                }

                //check to the right
                //note dont check the spot 2 spots back from the right because we want them tetrises
                if (i < this.gameWidth - 1 && blockMatrix[i][j] != null && blockMatrix[i + 1][j] === null) {
                    currentPillarHeightR++;
                } else {
                    //if the current pillar height is >=3 then we have found a pillar, yay
                    if (currentPillarHeightR >= 3) {
                        //pillar count is 1 for a 3 height pillar 2 for a 4 height pillar ect.
                        pillarCount += currentPillarHeightR - 2;
                    }
                    currentPillarHeightR = 0;
                }
            }
            if (currentPillarHeightL >= 3) {
                //pillar count is 1 for a 3 height pillar 2 for a 4 height pillar ect.
                pillarCount += currentPillarHeightL - 2;
            }
            if (currentPillarHeightR >= 3) {
                //pillar count is 1 for a 3 height pillar 2 for a 4 height pillar ect.
                pillarCount += currentPillarHeightR - 2;
            }
        }

        return pillarCount;
    }

    countNumberOfBlocksInRightmostLane(shape) {
        let blockPositions = [];
        let blocksInRightLaneCounter = 0;
        for (let block of shape.blocks) {
            blockPositions.push(p5.Vector.add(shape.currentPos, block.currentGridPos));
        }
        for(let pos of blockPositions){
            if(pos.x === this.gameWidth-1){
                blocksInRightLaneCounter++;
            }
        }
        return blocksInRightLaneCounter;
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
