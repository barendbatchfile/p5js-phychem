let lineSize = 2;
let scale = 1;        // Actual scale is 1:scale*C, where C is some constant we don't care about.
let markDist = 300;
let stepSize = markDist / (scale%1000);

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function calcMarkCount(begin, end) {
    let step = begin;
    for (let i = 0; true; i++) {
	step += stepSize;
	if (step > end) {
	    return step - stepSize;
	}
    }
}

function drawCoordinatePlane() {
    let centerY = height/2;
    let centerX = width/2;
    let markCountX = calcMarkCount(centerX, width);
    let markCountY = calcMarkCount(centerY, height);

    fill(128);
    for (let i = 1; i < markCountX; i++) {
	let x = centerX + stepSize * i;
	rect(x, 0, lineSize, height);
    }

    for (let i = 1; i < markCountX; i++) {
	let x = centerX + stepSize * -i;
	rect(x, 0, lineSize, height);
    }

    for (let i = 1; i < markCountY; i++) {
	let y = centerY + stepSize * -i;
	rect(0, y, width, lineSize);
    }

    for (let i = 1; i < markCountY; i++) {
	let y = centerY + stepSize * i;
	rect(0, y, width, lineSize);
    }

    fill(0);
    rect(width / 2 - lineSize, 0, 2 * lineSize, height);
    rect(0, height / 2 - lineSize, width, 2 * lineSize);
}

function draw() {
    background(255);
    fill(128, 255, 128);
    drawCoordinatePlane();
}
