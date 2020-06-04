let currentShape;

let deadBlocks = [];
let deadBlocksMatrix = [];
let gameWidth;
let gameHeight;
let shapeIDs = [];
let shapeFallRate = 30;//number of falls per second


function setup() {
    window.canvas = createCanvas(800, 800);
    window.canvas.parent("canvas");
    gameHeight = canvas.height / BLOCK_SIZE;
    gameWidth = canvas.width / BLOCK_SIZE;
    for (let i = 0; i < gameWidth; i++) {
        let column = [];
        for (let j = 0; j < gameHeight; j++) {
            column.push(null);
        }
        deadBlocksMatrix.push(column);
    }
    print(deadBlocksMatrix);

    frameRate(30);
    setShapeIDs();
    currentShape = new Shape(getRandomShapeID(), createVector(10, 0));
}

function draw() {

    background(255);

    drawGrid();


    for (let block of deadBlocks) {
        block.draw();
    }
    currentShape.draw();
    if (frameCount % 17 === 0) {
        currentShape.rotateShape(true);
    }
    if (frameCount % (30 / shapeFallRate) === 0) {
        currentShape.moveDown();
        if (currentShape.isDead) {
            currentShape = new Shape(getRandomShapeID(), createVector(floor(random(1, gameWidth - 2)), 0));
            if(!currentShape.canMoveDown()){
                for (let i = 0; i < gameWidth; i++) {
                    let column = [];
                    for (let j = 0; j < gameHeight; j++) {
                        column.push(null);
                    }
                    deadBlocksMatrix[i]=column;
                }
                deadBlocks = [];
                currentShape = new Shape(getRandomShapeID(), createVector(floor(random(1, gameWidth - 2)), 0));

            }
        }
    }

    push();
    noFill();
    stroke(0);
    strokeWeight(6);
    rect(0, 0, canvas.width - 1, canvas.height - 1);

    pop();
}

function getRandomShapeID() {

    return shapeIDs[Math.floor(random(0, shapeIDs.length))];
}

function drawGrid() {
    push();
    stroke(200);
    strokeWeight(1);
    for (let i = 0; i < canvas.width / BLOCK_SIZE; i++) {
        line(i * BLOCK_SIZE, 0, i * BLOCK_SIZE, canvas.height);
    }
    for (let j = 0; j < canvas.height / BLOCK_SIZE; j++) {
        line(0, j * BLOCK_SIZE, canvas.width, j * BLOCK_SIZE);
    }
    pop();
}
