function setup() {
    createCanvas(300, 300);
    noStroke();
}

function draw() {
    background(220);
    count = 144;
    seperator = sqrt(count)/3;
    diameter = min(height, width)/sqrt(count);
    for (let i = 0; i < sqrt(count); i++) {
	for (let j = 0; j < sqrt(count); j++) {
	    x = diameter/2 + i * width/sqrt(count);
	    y = diameter/2 + j * height/sqrt(count);
	    channel = map(i, 0, sqrt(count), 0, 255);
	    if (seperator > j) {
		fill(channel, 0, 0);
	    } else if (seperator*2 > j) {
		fill(0, channel, 0);
	    } else {
		fill(0, 0, channel);
	    }

	    circle(x, y, diameter);
	}
    }
}
