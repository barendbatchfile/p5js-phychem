/*  phychem-ulator is a physics and chemistry simulator.
    Copyright (C) 2026 Barend Koster

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

let atoms = [];
let current_atom = {
    name: "H",
    number: 1,
    m: 1,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    c: "#00ff00",
    r: 5.3e-11,
};

let buttons = [
    {
	label: "Reset simulator",
	x: -100,
	y: -100,
	w: 0,
	h: 0,
	id: 0,
    },
];

let phyicsSettings = {
    gravity: true,
    movement: true,
    timeMultiplier: 1,
    gravityMultiplier: 1e8,
    softening: true,
    softeningConst: 2,
    bounce: true,
    pause: false,
};

let phyicsConstents = {
    gravity: 6.67384e-11,
    atomicMass: 1.660538921e-27,
};

let lineSize = 2;
let exponent = 0;
let scale = 1;
let markDist = 300;
let stepSize = markDist;
let centerX = 0;
let centerY = 0;
let offset = { x: 0, y: 0, };
let cursor = { x: 0, y: 0, };
let cursorSpeed = 50;
let padding = 5;
let dragging = false;

let bar = {
    x: 0,
    w: 0,
    h: 0,
    y: 2 * padding,
}

function updateButton(id) {
    textSize(16);
    let bounds = textBounds(buttons[id].label, width/2, id);
    buttons[id].w = bounds.w;
    buttons[id].h = bounds.h;
    buttons[id].x = width/2 - buttons[id].w/2;
    buttons[id].y = 3*padding + buttons[id].h;
}

function updateCenter() {
    offset.x = width / 2;
    offset.y = height / 2;
    centerX = offset.x + cursor.x;
    centerY = offset.y + cursor.y;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    updateCenter();
    updateButton(0);
}

function mousePressed() {
    dragging = false;
}

function drawButton(id) {
    text(buttons[0].label, buttons[0].x, buttons[0].y);
}

function isMouseOverButton(id) {
    return (mouseX > buttons[id].x &&
	    mouseX < buttons[id].x + buttons[id].w &&
	    mouseY > buttons[id].y - buttons[id].h &&
	    mouseY < buttons[id].y);
}

function resetGame() {
    cursor.x = 0;
    cursor.y = 0;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;

    exponent = 0;
    scale = 1;
    stepSize = markDist / scale;
    atoms = [];
}

function mouseClicked() {
    if (isMouseOverButton(0)) {
	resetGame();
	return;
    }

    if (dragging) { return; }

    let atom = Object.create(current_atom);
    atom.x = (mouseX - centerX) * (scale*10**exponent) / stepSize;
    atom.y = (mouseY - centerY) * (scale*10**exponent) / stepSize;
    atoms.push(atom);
}

function mouseWheel(event) {
    let oldPixelsPerUnit = stepSize / (scale*10**exponent);

    if (exponent < 3 && event.delta > 0) { scale *= 2};
    if (exponent > -20 && event.delta < 0) { scale /= 2};
    if (scale <= 0) { scale = 0.1; }
    if (scale >= 10) { scale /= 10; exponent += 1; }
    if (scale < 0.1) { scale *= 10; exponent -= 1; }
    stepSize = markDist / scale;

    let newPixelsPerUnit = stepSize / (scale*10**exponent);
    let zoomRatio = newPixelsPerUnit / oldPixelsPerUnit;
    cursor.x = mouseX - offset.x
        - (mouseX - offset.x - cursor.x) * zoomRatio;
    cursor.y = mouseY - offset.y
        - (mouseY - offset.y - cursor.y) * zoomRatio;
    centerX = offset.x + cursor.x;
    centerY = offset.y + cursor.y;
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateCenter();
    updateButton(0);
}

function processGravity(dt) {
    for (let i = 0; i < atoms.length; i++) {
	let atomA = atoms[i];

	for (let j = 0; j < atoms.length; j++) {
	    if (i === j) { continue; }
	    let atomB = atoms[j];
	    let massB = atomB.m * phyicsConstents.atomicMass; // convert mass in u to kg.

	    let dx = atomB.x - atomA.x;
	    let dy = atomB.y - atomA.y;
	    let r;
	    if (phyicsSettings.softening) {
		let softening = phyicsSettings.softeningConst * (atomA.r + atomB.r);
		r = sqrt(dx * dx + dy * dy + softening * softening);
	    } else {
		r = sqrt(dx * dx + dy * dy);
	    }

	    if (r === 0) { continue; }

	    let a = phyicsConstents.gravity * massB / (r**2) * phyicsSettings.gravityMultiplier;
	    let ax = a * dx / r;
	    let ay = a * dy / r;

	    atomA.vx += ax * dt;
	    atomA.vy += ay * dt;
	}
    }
}

function bounce(atomA, atomB) {
    let tempV = atomA.vx;
    atomA.vx = atomB.vx;
    atomB.vx = tempV;

    tempV = atomA.vy;
    atomA.vy = atomB.vy;
    atomB.vy = tempV;
}

function processPhyics() {
    let dt = deltaTime * phyicsSettings.timeMultiplier / 1000; //convert deltaTime from miliseconds to seconds.
    if (phyicsSettings.gravity) {
	processGravity(dt);
    }

    if (phyicsSettings.bounce) {
	for (let i = 0; i < atoms.length; i++) {
	    let atomA = atoms[i];

	    for (let j = i + 1; j < atoms.length; j++) {
		let atomB = atoms[j];
		let distance = dist(atomA.x , atomA.y, atomB.x, atomB.y);
		if (distance <= atomA.r + atomB.r) bounce(atomA, atomB);
	    }
	}
    }

    if (phyicsSettings.movement) {
	for (let i = 0; i < atoms.length; i++) {
	    atoms[i].x += atoms[i].vx * dt;
	    atoms[i].y += atoms[i].vy * dt;
	}
    }
}

function getUnit() {
    if (exponent > -21 && exponent <= -18) { return "am"; }
    if (exponent > -18 && exponent <= -15) { return "fm"; }
    if (exponent > -15 && exponent <= -12) { return "pm"; }
    if (exponent > -12 && exponent <= -9) { return "nm"; }
    if (exponent > -9 && exponent <= -6) { return "μm"; }
    if (exponent > -6 && exponent <= -3) { return "mm"; }
    if (exponent > -3 && exponent <= -2) { return "cm"; }
    if (exponent > -2 && exponent <= -1) { return "dm"; }
    if (exponent > -1 && exponent < 1) { return "m"; }
    if (exponent >= 1 && exponent < 2) { return "dam"; }
    if (exponent >= 2 && exponent < 3) { return "hm"; }
    if (exponent >= 3) { return "km"; }
}

function mouseDragged() {
    cursor.x += mouseX - pmouseX;
    cursor.y += mouseY - pmouseY;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
    dragging = true;
}

function keyTyped() {
    if (key === 'r') {
	resetGame();
    }

    if (key === 'p') {
	phyicsSettings.pause = !phyicsSettings.pause;
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
    let minMarkY = Math.ceil((centerY - height) / stepSize);
    let maxMarkY = Math.floor(centerY / stepSize);
    let minMarkX = Math.ceil((0 - centerX) / stepSize);
    let maxMarkX = Math.floor((width - centerX) / stepSize);

    fill(0);
    stroke(0);
    textSize(16);

    for (let i = minMarkX; i <= maxMarkX; i++) {
	let x = centerX + i * stepSize;
	rect(x, 0, lineSize, height);

	let txt = i + getUnit();
	let bounds = textBounds(txt, x, centerY);
	text(txt, x + padding, centerY - bounds.h - padding);
    }

    for (let i = minMarkY; i <= maxMarkY; i++) {
	let y = centerY - i * stepSize;
	rect(0, y, width, lineSize);

	let txt = i + getUnit();
	let bounds = textBounds(txt, centerX, y);
	text(txt, centerX + padding, y - bounds.h - padding);
    }

    rect(centerX - lineSize, 0, 2 * lineSize, height);
    rect(0, centerY - lineSize, width, 2 * lineSize);
}

function drawAtoms() {
    for (let i = 0; i < atoms.length; i++) {
	let atom = atoms[i];
	let x = centerX + atom.x / (scale*10**exponent) * stepSize;
	let y = centerY + atom.y / (scale*10**exponent) * stepSize;
	let d = max(5, 2 * atom.r * stepSize / (scale * 10 ** exponent));

	fill(atom.c);
	circle(x, y, d);
	let name = atom.name + "-" + atom.number;
	let size = 160;
	while (true) {
	    textSize(size);
	    let bounds = textBounds(name, x, y);
	    let txtR = sqrt(bounds.w*bounds.w + bounds.h*bounds.h);
	    if (txtR > d) {
		size -= 1;
	    }

	    if (size <= 0 || txtR <= d) {
		break;
	    }
	}

	if (size > 0) {
	    textSize(size);
	    fill(0);
	    let bounds = textBounds(name, x, y);
	    text(name, x - bounds.w/2, y+bounds.h/2);
	}
    }
}

function drawHud() {
    textSize(16);
    noStroke();
    let scaleStatus = " -- scale = 1:" + scale*10**exponent + " -- ";
    let atomStatus = " -- atoms = " + atoms.length + " -- ";

    let scaleBounds = textBounds(scaleStatus, width/2, 0);
    let atomBounds = textBounds(atomStatus, width/2, 0);

    // recompute new bar.
    bar.h = buttons[0].h + 2*padding;
    bar.w = buttons[0].w + scaleBounds.w + atomBounds.w + 2*padding;
    bar.x = buttons[0].x - scaleBounds.w;

    // draw bar
    fill(255);
    rect(bar.x, bar.y, bar.w, bar.h);
    circle(bar.x, bar.h/2 + bar.y, bar.h);
    circle(bar.x+bar.w, bar.h/2 + bar.y, bar.h);

    // draw text around button.
    stroke(0);
    fill(0);
    text(scaleStatus, bar.x, bar.y + scaleBounds.h + padding);
    text(atomStatus, buttons[0].x + buttons[0].w, bar.y + atomBounds.h + padding);

    // button hover effect.
    let color = "#ff7777";
    if (isMouseOverButton(0)) {
	color = "#7777ff";
    }

    stroke(color);
    fill(color);
    drawButton(0);

    // draw if game is pauzed
    if (phyicsSettings.pause) {
	let pauseBounds = textBounds("pauzed", width/2, height);
	let y = height - pauseBounds.h - 4*padding;
	let x = width/2 - pauseBounds.w/2;

	fill(255);
	stroke(255);
	rect(x, y, pauseBounds.w, padding+pauseBounds.h);
	circle(x, y+pauseBounds.h/2 + padding/2, pauseBounds.h+padding);
	circle(x+pauseBounds.w, y+pauseBounds.h/2+padding/2, pauseBounds.h+padding);
	stroke(0);
	fill(0);
	text("pauzed", x, y+pauseBounds.h);
    }

}

function draw() {
    background(172);
    fill(128, 255, 128);
    handleKeys();
    if (!phyicsSettings.pause) { processPhyics(); }
    drawCoordinatePlane();
    drawAtoms();
    drawHud();
}
