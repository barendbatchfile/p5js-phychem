let ball = { x: 60, y: 40, vx: 3.2, vy: 2.6, diameter: 30 };
let paddleWidth = 80;
let paddleHeight = 12;
let paddleX = 0;
let paddleY;
let speed = 10;

function setup() {
    createCanvas(320, 200);
    noStroke();
    paddleY = height - 2 * paddleHeight;
}

function draw() {
    background(220);

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (keyIsDown(LEFT_ARROW)) paddleX = constrain(paddleX - speed, -paddleWidth/2, width -paddleWidth/2);
    if (keyIsDown(RIGHT_ARROW)) paddleX = constrain(paddleX + speed, -paddleWidth/2, width -paddleWidth/2);

    let ballBottom = ball.y + ball.diameter / 2;

    if (ballBottom > paddleY &&
	ball.y < paddleY + paddleHeight &&
	ball.x > paddleX &&
	ball.x < paddleX + paddleWidth &&
	ball.vy > 0) {
	ball.vy = -ball.vy;
    }

    let radius = ball.diameter / 2;
    if (ball.x - radius < 0)      { ball.x = radius;          ball.vx = -ball.vx; }
    if (ball.x + radius > width)  { ball.x = width - radius;  ball.vx = -ball.vx; }
    if (ball.y - radius < 0)      { ball.y = radius;          ball.vy = -ball.vy; }
    if (ball.y + radius > height) { ball.y = height - radius; ball.vy = -ball.vy; }

    fill(60);
    circle(ball.x, ball.y, ball.diameter);

    rect(paddleX, paddleY, paddleWidth, paddleHeight, 5);
}
