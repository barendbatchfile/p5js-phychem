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
	});
    }
}

function draw() {
    background(220);
    for (let i = 0; i < ball_count; i++) {
	let ball = balls[i];

	circle(ball.x, ball.y, ball.r * 2);
    }
}
