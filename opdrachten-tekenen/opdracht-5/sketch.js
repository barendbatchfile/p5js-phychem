function setup() {
    createCanvas(400, 400);
    noStroke();
    fill(60);
}

function draw() {
    background(220);

    let count = 20;
    for (let i = 0; i < count; i++) {
	for (let j = 0; j < count; j++) {
	    if (j%2 != i%2) {
		circle(i*width/count + width/(count*2), width/(count*2) + j*width/count, height/count);
	    } else {
		square(i*width/count, j*width/count, height/count);
	    }
	}
    }
}
