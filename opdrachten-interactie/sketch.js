let x = 60;
let y = 50;
let vx = 3.5;
let vy = 2.4;
let diameter = 36;
let r = diameter / 2;

function setup() {
    createCanvas(320, 200);
    noStroke();
    fill(60);
}

function draw() {
    background(220);

    x += vx;
    y += vy;

    if (x+r >= width) {
	vx = -vx;
	x = width - (width - x);
    }

    if (y+r >= height) {
	vy = -vy;
	y = height - (height - y);
    }

    if (y-r <= 0) {
	vy = -vy;
	y = abs(y);
    }

    if (x-r <= 0) {
	vx = -vx;
	x = abs(x);
    }

    circle(x, y, diameter);
}
