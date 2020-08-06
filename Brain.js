class Brain {
    constructor(isFirst) {
        this.multipliers = {};
        if(isFirst){
            this.setAsMyMultipliers();
        }else{
            this.randomizeMultipliers();
        }
    }

    randomizeMultipliers() {
        this.multipliers = {
            holeCountMultiplier: 100 * random(0, 2),
            openHoleCountMultiplier: 70 * random(0, 2),
            maximumLineHeightMultiplier: 1 * random(0, 2),
            addedShapeHeightMultiplier: 1 * random(0, 2),
            pillarCountMultiplier: 4 * random(0, 2),
            blocksInRightMostLaneMultiplier: 10 * random(0, 2),
            nonTetrisClearPenalty: 20 * random(0, 2),
            blocksAboveHolesMultiplier: 5 * random(0, 2),
            bumpinessMultiplier: 5 * random(0, 2),
            tetrisRewardMultiplier: -10 * random(0, 2)
        };
    }

    setAsMyMultipliers() {
        this.multipliers = {
            holeCountMultiplier: 100,// * random(0, 2),
            openHoleCountMultiplier: 70,// * random(0, 2),
            maximumLineHeightMultiplier: 1,// * random(0, 2),
            addedShapeHeightMultiplier: 1,// * random(0, 2),
            pillarCountMultiplier: 4,// * random(0, 2),
            blocksInRightMostLaneMultiplier: 10,// * random(0, 2),
            nonTetrisClearPenalty: 20,// * random(0, 2),
            blocksAboveHolesMultiplier: 5,// * random(0, 2),
            bumpinessMultiplier: 5,// * random(0, 2),
            tetrisRewardMultiplier: -10,// * random(0, 2)
        };
    }

    mutate() {
        let mutationRate = 0.1;
        this.multipliers.holeCountMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersopenHoleCountMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersmaximumLineHeightMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersaddedShapeHeightMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multiplierspillarCountMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersblocksInRightMostLaneMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersnonTetrisClearPenalty *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersblocksAboveHolesMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multipliersbumpinessMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
        this.multipliers.multiplierstetrisRewardMultiplier *= random(1.0) < mutationRate ? random(0.95, 1.05) : 1;
    }


    clone(){
        let clone = new Brain();
        clone.multipliers = Object.assign({}, this.multipliers);
        return clone;

    }


    getCostOfMatrix(blockMatrix){
        let linesClearedWhichArentTetrises = blockMatrix.linesCleared > 0 && blockMatrix.linesCleared < 4 ? 1 : 0;
        let tetrises = blockMatrix.linesCleared === 4 ? 1 : 0;

        blockMatrix.cost =
            blockMatrix.holeCount * this.multipliers.holeCountMultiplier +
            blockMatrix.openHoleCount * this.multipliers.openHoleCountMultiplier +
            blockMatrix.blocksAboveHoles * this.multipliers.blocksAboveHolesMultiplier +
            linesClearedWhichArentTetrises * this.multipliers.nonTetrisClearPenalty +
            tetrises * this.multipliers.tetrisRewardMultiplier +
            blockMatrix.maximumLineHeight * this.multipliers.maximumLineHeightMultiplier +
            blockMatrix.addedShapeHeight * this.multipliers.addedShapeHeightMultiplier +
            blockMatrix.pillarCount * this.multipliers.pillarCountMultiplier+
            blockMatrix.blocksInRightLane * this.multipliers.blocksInRightMostLaneMultiplier+
            blockMatrix.bumpiness * this.multipliers.bumpinessMultiplier;

        return blockMatrix.cost;
    }

    writeMultipliers(startingX,startingY){

        push();



        let  multiplierStats = [`Hole Count: ${this.multipliers.holeCountMultiplier.toFixed(2)}`,
            `Open Hole Count: ${this.multipliers.openHoleCountMultiplier.toFixed(2)}`,
            `Blocks above Holes: ${this.multipliers.blocksAboveHolesMultiplier.toFixed(2)}`,
            `Non tetris clear: ${this.multipliers.nonTetrisClearPenalty.toFixed(2)}`,
            `Tetris clear: ${this.multipliers.tetrisRewardMultiplier.toFixed(2)}`,
            `Maximum line height: ${this.multipliers.maximumLineHeightMultiplier.toFixed(2)}`,
            `Added Shape Height: ${this.multipliers.addedShapeHeightMultiplier.toFixed(2)}`,
            `Pillar Count: ${this.multipliers.pillarCountMultiplier.toFixed(2)}`,
            `Blocks in right lane: ${this.multipliers.blocksInRightMostLaneMultiplier.toFixed(2)}`,
            `Bumpiness: ${this.multipliers.bumpinessMultiplier.toFixed(2)}`];


        textAlign(LEFT, CENTER);
        fill(100);
        stroke(0);
        strokeWeight(1);

        let textGap = 30;

        textSize(20);
        noStroke();

        text("Multipliers", startingX, startingY);
        textSize(15);
        noStroke();
        for (let i = 0; i < multiplierStats.length; i++) {
            text(multiplierStats[i], startingX, startingY + (i + 1) * textGap);
        }


        pop();


    }

}