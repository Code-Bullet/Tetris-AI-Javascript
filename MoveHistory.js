class MoveHistory{

    constructor() {
        this.moveHistoryList=[];
    }


    addDirectionalMove(x,y){
        if(x === -1){
            this.moveHistoryList.push("LEFT");
        }else if(x === 1){
            this.moveHistoryList.push("RIGHT");
        }else if(y === 1){
            this.moveHistoryList.push("DOWN");
        }else{
            print(`ERROR BRO WHAT THE FUCK IS: ${x}, ${y}`);
        }
    }

    addRotationMove(){
        this.moveHistoryList.push("ROTATE");
    }
    addHoldMove(addToTail = true){
        if(addToTail){
            this.moveHistoryList.push("HOLD");
        }else{
            this.moveHistoryList.unshift("HOLD");
        }
    }

    clone(){
        let clone = new MoveHistory();
        for(let i = 0 ; i < this.moveHistoryList.length;i++){
            clone.moveHistoryList.push(""+ this.moveHistoryList[i]);
        }
        return clone;
    }
}