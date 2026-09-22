let balls = [];
let ball_count = 10;

function setup() {
    createCanvas(320, 200);
    noStroke();
    fill(60);
    for (let i = 0; i < ball_count; i++) {
	balls.push({
	    x: random(width),
	    y: random(height),
	    r: random(0, 10),
	    vx: random(-1, 1),
	    vy: random(-1, 1),
	});
    }
}

function draw() {
    background(220);
    for (let i = 0; i < ball_count; i++) {
	let ball = balls[i];
	ball.x += ball.vx;
	ball.y += ball.vy;
	if (ball.x > width + ball.r) { ball.x = -ball.r; }
	if (ball.x < -ball.r) { ball.x = width + ball.r; }
	if (ball.y > height + ball.r) { ball.y = -ball.r; }
	if (ball.y < -ball.r) { ball.y = height + ball.r; }

	circle(ball.x, ball.y, ball.r * 2);
    }
}
