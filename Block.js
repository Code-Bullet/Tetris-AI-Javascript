class Block{
    constructor(startingGridPos, color) {
        this.startingGridPos = startingGridPos;
        this.currentGridPos = startingGridPos;
        this.color = color;
        this.isDead = false;
    }

    clone(){
        let clone = new Block(this.startingGridPos.copy(),this.color);
        clone.isDead = this.isDead;
        clone.currentGridPos = this.currentGridPos.copy();
        return clone;
    }

    draw(tetrised = false, linesToBeCleared = []){
        if(this.isDead)
            return;
        push();
        let pos = this.currentGridPos;
        if(tetrised && linesToBeCleared.includes(this.currentGridPos.y)){
            stroke(0);
            fill(255);

        }else{
            fill(this.color);
            stroke(0);

        }
        strokeWeight(3);
        rect(pos.x*BLOCK_SIZE,pos.y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
        pop();
    }

}