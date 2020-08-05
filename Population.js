class Population {

    constructor(size) {
        this.players = [];
        this.fitnessSum = 0;
        this.bestPlayer = null;
        this.generation = 1;


        this.playersPerRow = Math.ceil(Math.sqrt(size));
        this.playersPerColumn = Math.ceil(Math.sqrt(size));

        this.playerWidth = canvas.width / Math.ceil(Math.sqrt(size));
        this.playerHeight = canvas.height / Math.ceil(Math.sqrt(size));

        for (let i = 0; i < size; i++) {
            let player = new Player();
            player.windowWidth = this.playerWidth;
            player.windowHeight = this.playerHeight;
            this.players.push(player);
        }


    }


    show() {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.players.length; i++) {
            push();
            translate(x * this.playerWidth, y * this.playerHeight);
            this.players[i].show();
            x++;
            if (x >= this.playersPerRow) {
                x = 0;
                y++;
            }

            pop();
        }
    }


    update() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].update();
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

        this.generation++;
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


}

//todo allPlayersDead(), player.isDead, thats about it