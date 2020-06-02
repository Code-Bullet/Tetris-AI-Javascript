var BLOCK_SIZE = 40;
class Block{
    constructor(startingGridPos, color) {
        this.startingGridPos = startingGridPos;
        this.currentGridPos = startingGridPos;
        this.color = color;
    }

    draw(){
        push();
        let pos = this.currentGridPos;
        fill(this.color);
        stroke(0);
        strokeWeight(3);
        rect(pos.x*BLOCK_SIZE,pos.y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
        pop();
    }

    moveDown(){
        this.currentGridPos.y +=1;
    }
}