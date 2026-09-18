let r = 30;
let x = -r;
let y = -r;
let vx = 1;
let vy = 1;

function setup() {
    createCanvas(300, 120);
    noStroke();
    fill(60);
}

function draw() {
    background(220);
    x += vx;
    y += vy;
    x = x%(width+r);
    y = y%(height+r);
    circle(x, y, r);

}
