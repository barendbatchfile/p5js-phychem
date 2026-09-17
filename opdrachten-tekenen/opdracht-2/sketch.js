function setup() {
    createCanvas(300, 300);
    noStroke();
    fill(60);
}

function draw() {
    background(220);

    for (let i = 0; i < 10; i++) {
	for (let j = 0; j < 10; j++) {
	    let x = width/(10*2) + i * width/10
	    let y = height/(10*2) + j * height/10
	    circle(x, y, width/(10))
	}
    }
}
