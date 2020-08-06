class BlockMatrix {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.matrix = [];
        this.resetMatrix();

        this.holeCount = 0;
        this.openHoleCount = 0;
        this.blocksAboveHoles = 0;
        this.pillarCount = 0;
        this.addedShapeHeight = 0;
        this.maximumLineHeight = 0;
        this.bumpiness = 0;

        this.linesCleared = 0;

        this.cost = 0;//the cost of this matrix essentially how bad it is, determined by the number of holes and added shape height,
        this.movementHistory = new MoveHistory();//the movements required to reach this block matrix, usually is empty
    }


    addMovementHistory(movementHistory) {
        this.movementHistory = movementHistory.clone();
    }

    //returns a copy of the block matrix
    clone() {
        let clone = new BlockMatrix(this.width, this.height);

        //clone the matrix
        for (let i = 0; i < clone.width; i++) {
            for (let j = 0; j < clone.height; j++) {
                if (this.matrix[i][j] !== null)
                    clone.matrix[i][j] = this.matrix[i][j].clone();
            }
        }

        clone.holeCount = this.holeCount;
        clone.pillarCount = this.pillarCount;


        return clone;
    }

    //returns a copy of the block matrix
    copyFromMatrix(matrixToCopyFrom) {
        //clone the matrix
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (matrixToCopyFrom[i][j] !== null)
                    this.matrix[i][j] = matrixToCopyFrom[i][j].clone();
            }
        }
    }

    //resets the matrix to all nulls and creates the matrix from scratch
    resetMatrix() {
        this.matrix = [];
        for (let i = 0; i < this.width; i++) {
            let column = [];
            for (let j = 0; j < this.height; j++) {
                column.push(null);
            }
            this.matrix.push(column);
        }
    }

    //adds the parameter shape to the matrix
    //DOES NOT CLEAR LINES
    addShapeToMatrix(shape) {
        //add the shape to the block matrix
        for (let block of shape.blocks) {
            //the block becomes disconnected from the shape and therefore the current grid position is no longer relative to the shape
            let newPosition = p5.Vector.add(block.currentGridPos, shape.currentPos);
            this.matrix[newPosition.x][newPosition.y] = block.clone();
        }

        this.addedShapeHeight = this.height - shape.currentPos.y;
    }


    calculateMaximumLineHeight() {

        this.maximumLineHeight = 0;


        for (let i = 0; i < this.width; i++) {

            //going down each column look for a block and then add its height to the total
            for (let j = 0; j < this.height; j++) {
                if (this.matrix[i][j] != null) {
                    this.maximumLineHeight = Math.max(this.maximumLineHeight, this.height - j);
                    break;
                }
            }
        }


    }

    isPositionVacant(position) {

        //check the position is within the matrix, for example -1,4 is not in the matrix and therefore is not vacant
        if (position.y >= 0 && position.y < this.height && position.x >= 0 && position.x < this.width) {
            //if the position is null then its vacant
            if (this.matrix[position.x][position.y] === null) {
                return true;
            }
        }

        //if the position is out of bounds or has a block in its place then return false
        return false;
    }

    //Checks for cleared rows and removes them
    clearFullRows() {
        this.linesCleared = 0;
        for (let j = 0; j < this.height; j++) {
            //check if this row has been cleared
            let rowCleared = true;
            for (let i = 0; i < this.width; i++) {
                if (this.matrix[i][j] == null) {
                    rowCleared = false;
                    break;
                }
            }

            //if it has them remove it and move all layers above it down.
            if (rowCleared) {

                this.linesCleared++;
                //for each row above the cleared row move them down
                for (let rowIndexToMoveDown = j - 1; rowIndexToMoveDown >= 0; rowIndexToMoveDown--) { //for each row above the to be removed row
                    for (let i = 0; i < this.width; i++) { //for each block in that row

                        //if its not null then change the position of the block
                        if (this.matrix[i][rowIndexToMoveDown] !== null) {
                            this.matrix[i][rowIndexToMoveDown].currentGridPos.y += 1;
                        }

                        //move this block into the lower row and set the blocks previous row position to null
                        this.matrix[i][rowIndexToMoveDown + 1] = this.matrix[i][rowIndexToMoveDown];
                        this.matrix[i][rowIndexToMoveDown] = null;
                    }
                }

            }
        }

    }

    printMatrix() {

        let printString = "";
        for (let j = 0; j < this.height; j++) {
            let printLine = "";
            let pieceCount = 0;
            for (let i = 0; i < this.width; i++) {
                printLine += this.matrix[i][j] != null ? "X" : " ";
                pieceCount += this.matrix[i][j] != null ? 1 : 0;
            }
            if (pieceCount > 0) {
                printString += printLine;
                printString += '\n';
            }
        }
        print(printString);
    }


    //counts the number of holes in the matrix
    countHoles() {

        this.holeCount = 0;
        this.openHoleCount = 0;
        //an open hole is one which isnt fully covered, like there isnt a block to the left or right,
        //open holes are less bad than normal holes because you can slip a piece in there.
        //actually an open hole needs 2 spots to a side to be able to be filled.

        this.blocksAboveHoles = 0;

        for (let i = 0; i < this.width; i++) {

            //going down each column look for a block and once found each block below is a hole
            let blockFound = false;
            let numberOfBlocksFound = 0;
            for (let j = 0; j < this.height; j++) {
                if (this.matrix[i][j] != null) {
                    blockFound = true;
                    numberOfBlocksFound++;
                } else if (blockFound) {
                    this.blocksAboveHoles += numberOfBlocksFound;


                    if (i < this.width - 2) {
                        //check if there is 2 spaces to the right
                        if (this.matrix[i + 1][j] === null && this.matrix[i + 2][j] === null) {
                            // this is not a full hole this is an open hole
                            // wait not yet, if the hole has a free block next to it and a free block below that, then it is a proper hole because you cannot fill this hole without creating a proper hole
                            if (j === this.height - 1 || this.matrix[i+1][j+1] != null ) {//if were on the bottom layer or the block 1 to the right and 1 down is a block, then we chill
                                this.openHoleCount++
                                continue;
                            }

                        }
                    }

                    if (i >= 2) {
                        //check to the left
                        if (this.matrix[i - 1][j] === null && this.matrix[i - 2][j] === null) {
                            // this is not a full hole this is an open hole
                            // wait not yet, if the hole has a free block next to it and a free block below that, then it is a proper hole because you cannot fill this hole without creating a proper hole
                            if (j === this.height - 1 || this.matrix[i-1][j+1] != null ) {//if were on the bottom layer or the block 1 to the left and 1 down is a block, then we chill
                                    this.openHoleCount++
                                    continue;
                            }
                        }
                    }

                    //if reached this point then the hole is a full hole
                    //sad
                    this.holeCount++;
                }
            }
        }

    }

    //count the number and height of each pillar, a pillar of 3 is worth 1, a pillar of 4 is worth 2, 5 si 3 etc.
    countPillars() {

        //count pillars
        this.pillarCount = 0;

        for (let i = 0; i < this.width; i++) {

            //going up each column look for 3 blocks in a row with nothing to the left or the right
            let currentPillarHeightL = 0;
            let currentPillarHeightR = 0;
            for (let j = this.height - 1; j >= 0; j--) {

                //First we look to the left

                //if this positions has a block and there is no block to the left then this is potentially part of a pillar
                if (i > 0 && this.matrix[i][j] != null && this.matrix[i - 1][j] === null) {
                    currentPillarHeightL++;
                } else {
                    //if the current pillar height is >=3 then we have found a pillar, yay
                    if (currentPillarHeightL >= 3) {
                        //pillar count is 1 for a 3 height pillar 2 for a 4 height pillar ect.

                        this.pillarCount += currentPillarHeightL;
                    }
                    currentPillarHeightL = 0;
                }

                //check to the right
                //note dont check the spot 2 spots back from the right because we want them tetrises
                if (i < this.width - 2 && this.matrix[i][j] != null && this.matrix[i + 1][j] === null) {
                    currentPillarHeightR++;
                } else {
                    //if the current pillar height is >=3 then we have found a pillar, yay
                    if (currentPillarHeightR >= 3) {
                        this.pillarCount += currentPillarHeightR;
                    }
                    currentPillarHeightR = 0;
                }
            }
            if (currentPillarHeightL >= 3) {
                this.pillarCount += currentPillarHeightL;
            }
            if (currentPillarHeightR >= 3) {
                this.pillarCount += currentPillarHeightR;
            }
        }
    }


    countNumberOfBlocksInRightmostLane() {
        this.blocksInRightLane = 0;

        //going down each column look for a block and once found each block below is a hole
        for (let j = 0; j < this.height; j++) {
            if (this.matrix[this.width - 1][j] != null) {
                this.blocksInRightLane++;
            }
        }

    }

    calculateBumpiness() {
        //bumpiness is defined as the total difference between column heights
        this.bumpiness = 0;
        let previousLineHeight = 0;

        for (let i = 0; i < this.width - 1; i++) {//note dont care about final row
            for (let j = 0; j < this.height; j++) {
                if (this.matrix[i][j] != null) {
                    let currentLineHeight = this.height - j;
                    if (i !== 0) {
                        this.bumpiness += Math.abs(previousLineHeight - currentLineHeight);
                    }
                    previousLineHeight = currentLineHeight;
                    break;
                }
            }
        }

    }


    //assumes a shape has been added, the lines have been cleared, the holes are counted and the pillars are counted
    calculateCost(brain) {
        if (brain) {
            this.cost = brain.getCostOfMatrix(this);
            return;
        }


        let holeCountMultiplier = 100;
        let openHoleCountMultiplier = 70;

        let maximumLineHeightMultiplier = 0;
        let addedShapeHeightMultiplier = 1;
        let pillarCountMultiplier = 4;
        let blocksInRightMostLaneMultiplier = 10;
        let nonTetrisClearPenalty = 20;
        let blocksAboveHolesMultiplier = 5;
        let bumpinessMultiplier = 5;
        let tetrisRewardMultiplier = -10;//negative because it reduces cost


        let linesClearedWhichArentTetrises = this.linesCleared > 0 && this.linesCleared < 4 ? 1 : 0;
        let tetrises = this.linesCleared === 4 ? 1 : 0;

        //if shit aint going great then stop trying to tetris shit
        if (this.maximumLineHeight > 10 || this.holeCount > 0 || this.pillarCount > 10) {
            nonTetrisClearPenalty = 0;
            maximumLineHeightMultiplier = 1;
        }
        this.cost =
            this.holeCount * holeCountMultiplier +
            this.openHoleCount * openHoleCountMultiplier +
            this.blocksAboveHoles * blocksAboveHolesMultiplier +
            linesClearedWhichArentTetrises * nonTetrisClearPenalty +
            tetrises * tetrisRewardMultiplier +
            this.maximumLineHeight * maximumLineHeightMultiplier +
            this.addedShapeHeight * addedShapeHeightMultiplier +
            this.pillarCount * pillarCountMultiplier +
            this.blocksInRightLane * blocksInRightMostLaneMultiplier +
            this.bumpiness * bumpinessMultiplier;
    }
}

//ok so whats the plan for today, lets go like ummmmm fuck what am i doing lets think,
// 1. make the different hole types worth different amounts for example a hole with an opening is better than a hole which is enclosed.
// 2. punish pieces which bury holes deeper, so add a thing to calculate cost which is like pieces over hole.
// ok lets go