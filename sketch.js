let currentShape;

let deadBlocks = [];
let deadBlocksMatrix = [];
let gameWidth;
let gameHeight;
let shapeIDs = [];
let shapeFallRate = 1;//number of falls per second

let horizontalMoveEveryXFrames = 3;// the speed the blocks move when the left or right key is down
let horizontalMoveCounter = 0;
let verticalMoveEveryXFrames = 2;// the speed the blocks move when the left or right key is down
let verticalMoveCounter = 0;
let game;
let BLOCK_SIZE = 35;
let gameWidthBlocks = 10;
let gameHeightBlocks = 20;
function setup() {
    window.canvas = createCanvas(1000, 800);
    window.canvas.parent("canvas");
    game = new Game(gameWidthBlocks,gameHeightBlocks);
    frameRate(30);
}

function draw() {

    game.draw();
    if (leftKeyIsDown || rightKeyIsDown) {
        if (horizontalMoveCounter >= horizontalMoveEveryXFrames) {
            leftKeyIsDown ? game.moveShapeLeft() : game.moveShapeRight();
            horizontalMoveCounter = 0;
        }
        horizontalMoveCounter++;
    }

    if(downKeyIsDown){
        if (verticalMoveCounter >= verticalMoveEveryXFrames) {
            game.moveShapeDown();
            verticalMoveCounter = 0;
        }
        verticalMoveCounter++;
    }
    //uncomment to rotate the current shape every 17 frames
    // if (frameCount % 17 === 0) {
    //     currentShape.rotateShape(true);
    // }
    if (frameCount % int(1000 / shapeFallRate) === 0) {
        game.moveShapeDown();
    }

}


let leftKeyIsDown = false;
let upKeyIsDown = false;
let rightKeyIsDown = false;
let downKeyIsDown = false;


function keyPressed() {
    if (keyCode === UP_ARROW) {
        game.rotateShape();
        upKeyIsDown = true;
    } else if (keyCode === DOWN_ARROW) {
        downKeyIsDown = true;
    }
    if (keyCode === LEFT_ARROW) {
        game.moveShapeLeft();
        leftKeyIsDown = true;
        horizontalMoveCounter = 0;
    } else if (keyCode === RIGHT_ARROW) {
        game.moveShapeRight();
        rightKeyIsDown = true;
        horizontalMoveCounter = 0;
    }
    if(key === ' '){
        game.holdShape();
    }
}

function keyReleased() {

    if (keyCode === UP_ARROW) {
        upKeyIsDown = false;
    } else if (keyCode === DOWN_ARROW) {
        downKeyIsDown = false;
    }

    if (keyCode === LEFT_ARROW) {
        leftKeyIsDown = false;
    } else if (keyCode === RIGHT_ARROW) {
        rightKeyIsDown = false;
    }
}