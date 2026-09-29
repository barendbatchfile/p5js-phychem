let lineSize = 2;
let scale = 1;        // Actual scale is 1:scale*C, where C is some constant we don't care about.
let markDist = 300;
let stepSize = markDist / (scale%1000);
let centerX = 0;
let centerY = 0;
let offset = { x: 0, y: 0, };
let cursor = { x: 0, y: 0, };
let cursorSpeed = 50;

function setup() {
    createCanvas(windowWidth, windowHeight);
    offset.x = width / 2;
    offset.y = height / 2;
    centerX = offset.x + cursor.x;
    centerY = offset.y + cursor.y;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    offset.x = width / 2;
    offset.y = height / 2;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
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

function mouseDragged() {
    cursor.x += mouseX - pmouseX;
    cursor.y += mouseY - pmouseY;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
}

function keyTyped() {
    if (key === 'r') {
	cursor.x = 0;
	cursor.y = 0;
	centerY = offset.y + cursor.y;
	centerX = offset.x + cursor.x;
    }
}

function handleKeys() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
	cursor.x += cursorSpeed;
	centerX = offset.x + cursor.x;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
	cursor.x -= cursorSpeed;
	centerX = offset.x + cursor.x;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
	cursor.y += cursorSpeed;
	centerY = offset.y + cursor.y;
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
	cursor.y -= cursorSpeed;
	centerY = offset.y + cursor.y
    }
}

function drawCoordinatePlane() {
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
    rect(centerX - lineSize, 0, 2 * lineSize, height);
    rect(0, centerY - lineSize, width, 2 * lineSize);
}

function draw() {
    background(255);
    fill(128, 255, 128);
    handleKeys();
    drawCoordinatePlane();
}
