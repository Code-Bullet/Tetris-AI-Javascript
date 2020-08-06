class Population {

    constructor(size) {
        this.players = [];
        this.fitnessSum = 0;
        this.bestPlayer = null;
        this.generation = 1;


        //batch stuff
        this.batchSize = 16;
        this.currentBatchNumber = 0;
        this.numberOfBatches = Math.ceil(size / this.batchSize);

        this.playersPerRow = Math.ceil(Math.sqrt(this.batchSize));
        this.playersPerColumn = Math.ceil(Math.sqrt(this.batchSize));

        this.playerWidth = canvas.width / this.playersPerRow;
        this.playerHeight = canvas.height / this.playersPerColumn;

        for (let i = 0; i < size; i++) {
            let player = new Player(i === 0);
            player.windowWidth = this.playerWidth;
            player.windowHeight = this.playerHeight;
            this.players.push(player);
        }


    }

    getCurrentBatchOfPlayers() {
        let currentBatch = [];
        for (let i = this.currentBatchNumber * this.batchSize; i < (this.currentBatchNumber + 1) * this.batchSize; i++) {
            currentBatch.push(this.players[i]);
        }
        return currentBatch;

    }


    show() {
        push();
        background(240);


        textSize(30);
        fill(100);
        stroke(100);
        textAlign(CENTER,CENTER);
        text("Gen: " + this.generation + "\t\t Batch: " + (this.currentBatchNumber +1) + "\t\tAverage Fitness: " + (this.fitnessSum/this.players.length).toFixed(2),canvas.width/2,25 );

        translate(0, 50);
        scale(1, (canvas.height - 50) / canvas.height);


        let x = 0;
        let y = 0;
        let currentBatch = this.getCurrentBatchOfPlayers();
        for (let i = 0; i < currentBatch.length; i++) {
            push();
            translate(x * this.playerWidth, y * this.playerHeight);
            currentBatch[i].show();
            x++;
            if (x >= this.playersPerRow) {
                x = 0;
                y++;
            }
            pop();
        }

        pop();
    }

    update() {
        let currentBatch = this.getCurrentBatchOfPlayers();
        for (let i = 0; i < currentBatch.length; i++) {
            currentBatch[i].update();
        }
        if (this.areAllPlayersInBatchDead()) {
            this.currentBatchNumber++;
        }
    }


    naturalSelection() {
        let nextGen = [];
        this.calculatePlayerFitnesses();
        this.calculateFitnessSum();
        //make sure best player makes it to the next gen
        this.setBestPlayer();
        let parent = this.bestPlayer;
        let child = parent.clone();
        child.brain.mutate();
        nextGen.push(child);

        while (nextGen.length < this.players.length) {
            parent = this.selectPlayer();
            child = parent.clone();
            child.brain.mutate();
            nextGen.push(child);
        }


        this.players = nextGen;
        this.generation++;
        this.currentBatchNumber = 0;
    }

    setBestPlayer() {
        this.bestPlayer = this.players[0];
        for (let player of this.players) {
            if (player.fitness > this.bestPlayer.fitness) {
                this.bestPlayer = player;
            }
        }
    }

    //assuming that the fitness sum has been calculated
    selectPlayer() {
        let randomNumber = random(this.fitnessSum);
        let runningSum = 0;
        for (let player of this.players) {
            runningSum += player.fitness;
            if (runningSum > randomNumber) {
                return player;
            }
        }

        return null;//somethings wrong
    }

    calculatePlayerFitnesses() {
        for (let player of this.players) {
            player.calculateFitness();
        }
    }

    calculateFitnessSum() {
        this.fitnessSum = 0;
        for (let player of this.players) {
            this.fitnessSum += player.fitness;
        }
    }

    areAllPlayersDead() {
        for (let player of this.players) {
            if (!player.isDead) {
                return false;
            }
        }
        return true;
    }

    areAllPlayersInBatchDead() {
        for (let player of this.getCurrentBatchOfPlayers()) {
            if (!player.isDead) {
                return false;
            }
        }
        return true;
    }


}

//todo allPlayersDead(), player.isDead, thats about it