class Node{

    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;

        this.checked = false;
        this.minMovesToPoint = 10000;
        this.edges = [];
    }

}