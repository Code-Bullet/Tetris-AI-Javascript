class Player {
    constructor() {
        this.brain = new Brain();
        this.fitness = 0;
        this.score = 0;
        this.tetrisRate = 0;
        this.currentGame = new Game(10, 20);
        this.ai = new AI(this.currentGame.gameWidth, this.currentGame.gameHeight, this.brain);
        this.ai.calculateMovementPlan2(this.currentGame.currentShape, this.currentGame.heldShape, this.currentGame.nextShape, this.currentGame.deadBlocksMatrix);
        this.windowHeight = canvas.height / 2;
        this.windowWidth = canvas.width / 2;
    }

    calculateMovementPlan(){
        this.ai.brain = this.brain;//just incase
        this.ai.calculateMovementPlan2(this.currentGame.currentShape,
            this.currentGame.heldShape,
            this.currentGame.nextShape,
            this.currentGame.deadBlocksMatrix);

    }

    calculateFitness(){
        this.fitness = this.currentGame.score * (1+this.currentGame.tetrisRate);
    }

    clone(){
        let clone = new Player();
        clone.game.needsNewMovementPlan = true;
        clone.brain = this.brain.clone();
        clone.ai.brain = clone.brain;
        return clone;
    }

    show() {
        push();
        // translate(this.windowPosition.x, this.windowPosition.y);
        scale(this.windowWidth / canvas.width, this.windowHeight / canvas.height);
        this.currentGame.draw();
        pop();
    }

    update() {


        if(this.currentGame.justTetrised)
            return
        // move the shape down at a rate of (shape Fall Rate) drops per second
        if (this.currentGame.needsNewMovementPlan) {
            this.ai.calculateMovementPlan2(this.currentGame.currentShape, this.currentGame.heldShape, this.currentGame.nextShape, this.currentGame.deadBlocksMatrix);
            this.currentGame.needsNewMovementPlan = false;
        }

        let nextMove = this.ai.getNextMove();

        switch (nextMove) {
            case "ALL DOWN":
                let downMoveMultiplier = 2;
                // let downMoveMultiplier = 2;
                while (this.ai.movementPlan.moveHistoryList.length > 0 && downMoveMultiplier > 0) {
                    this.ai.movementPlan.moveHistoryList.splice(0, 1);
                    this.currentGame.moveShapeDown();
                    downMoveMultiplier -= 1;
                }
                break;
            case "HOLD":
                this.currentGame.holdShape();
                break;
            case "ROTATE":
                this.currentGame.rotateShape();
                break;
            case "RIGHT":
                this.currentGame.moveShapeRight();
                break;
            case "LEFT":
                this.currentGame.moveShapeLeft();
                break;
            case "DOWN":
                this.currentGame.moveShapeDown();
                break;
        }
    }
}