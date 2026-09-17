function setup() {
    createCanvas(300, 200);
    stroke(40);
}

function draw() {
    background(220);
    let count = 10;
    for (let i = 0; i < count; i++) {
	y = map(i, 0, count, 0, height);
	line(20, y, 280, (height - y));
	line(20, (height - y), 280, y);
    }
}
