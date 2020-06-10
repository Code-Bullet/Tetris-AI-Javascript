class Block{
    constructor(startingGridPos, color) {
        this.startingGridPos = startingGridPos;
        this.currentGridPos = startingGridPos;
        this.color = color;
        this.isDead = false;
    }

    draw(){
        if(this.isDead)
            return;
        push();
        let pos = this.currentGridPos;
        fill(this.color);
        stroke(0);
        strokeWeight(3);
        rect(pos.x*BLOCK_SIZE,pos.y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
        pop();
    }

}