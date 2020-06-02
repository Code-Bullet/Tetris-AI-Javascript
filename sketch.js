let shapes = [];

let shapeIDs = [];

function setup() {
    window.canvas = createCanvas(800, 800);
    window.canvas.parent("canvas");
    frameRate(4);
    setShapeIDs();
    shapeIDs = [squareShape, lShape, reverseLShape, lineShape, tShape, zShape, sShape];
    // shapeIDs = [lineShape];
    let newShape = new Shape(getRandomShapeID(), createVector(10, 0));
    shapes.push(newShape);
}

function draw() {

    background(255);

    drawGrid();
    for (let shape of shapes) {
        shape.draw();
        shape.moveDown();
        shape.rotateShape();
    }
    // if (frameCount % 4 === 0) {
        shapes.push(new Shape(getRandomShapeID(), createVector(Math.floor(random(1, canvas.width / BLOCK_SIZE - 2)), 0)));
    // }

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