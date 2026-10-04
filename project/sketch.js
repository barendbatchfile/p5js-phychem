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

let phyicsSettings = {
    timeMultiplier: 1,
    gravityMultiplier: 1e8,
    softeningConst: 2,
    pause: false,
};

let phyicsOptions = {
    checkBoxes: [
	{
	    label: "gravity",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "bounce",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "movement",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "softening",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
    ],
};

let phyicsConstents = {
    gravity: 6.67384e-11,
    atomicMass: 1.660538921e-27,
};

let showWelcome = true;
let checkBoxSize = 0;
let physicsSettingsOpen = false;
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

let buttons = [
    {
	label: "Reset simulator",
	x: -100,
	y: -100,
	w: 0,
	h: 0,
    },
    {
	label: "physics settings",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
];

function updateButton(id) {
    textSize(16);
    let bounds = textBounds(buttons[id].label, width/2, id);
    if (id === 0) {
	buttons[id].w = bounds.w;
	buttons[id].h = bounds.h;
	buttons[id].x = width/2 - buttons[id].w/2;
	buttons[id].y = 3*padding + buttons[id].h;
    } else if (id === 1) {
	buttons[id].w = bounds.w;
	buttons[id].h = bounds.h;
	buttons[id].y = 2*padding + buttons[id].h;
	buttons[id].x = padding + buttons[id].h;
    }
}

function updateButtons() {
    for (let i = 0; i < buttons.length; i++) {
	updateButton(i);
    }
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
    updateButtons();
    textSize(16);
    let bounds = textBounds("W", 0, 0);
    checkBoxSize = 1.1*max(bounds.h, bounds.w);
}

function mousePressed() {
    dragging = false;
}

function drawButton(id) {
    let color = "#ff7777";
    if (isMouseOverButton(id)) {
	color = "#7777ff";
    }

    stroke(color);
    fill(color);
    text(buttons[id].label, buttons[id].x, buttons[id].y);
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
    if (showWelcome) {
	showWelcome = false;
	return;
    }

    for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	let checkBox = phyicsOptions.checkBoxes[i];
	if (mouseX > checkBox.x &&
	    mouseX < checkBox.x + checkBox.w &&
	    mouseY > checkBox.y &&
	    mouseY < checkBox.y + checkBox.h) {
	    checkBox.value = !checkBox.value;
	    return;
	}
    }

    if (isMouseOverButton(0)) {
	console.log("clicked button 0 (reset)");
	resetGame();
	return;
    }

    if (isMouseOverButton(1)) {
	console.log("clicked button 1 (physics settings)");
	physicsSettingsOpen = !physicsSettingsOpen;
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
    updateButtons();
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
	    if (phyicsOptions.checkBoxes[3].value) {
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
    if (phyicsOptions.checkBoxes[0].value) {
	processGravity(dt);
    }

    if (phyicsOptions.checkBoxes[1].value) {
	for (let i = 0; i < atoms.length; i++) {
	    let atomA = atoms[i];

	    for (let j = i + 1; j < atoms.length; j++) {
		let atomB = atoms[j];
		let distance = dist(atomA.x , atomA.y, atomB.x, atomB.y);
		if (distance <= atomA.r + atomB.r) bounce(atomA, atomB);
	    }
	}
    }

    if (phyicsOptions.checkBoxes[2].value) {
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
    if (showWelcome) { return; }
    cursor.x += mouseX - pmouseX;
    cursor.y += mouseY - pmouseY;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
    dragging = true;
}

function keyTyped() {
    if (showWelcome) { return; }
    if (key === 'r') {
	resetGame();
    }

    if (key === 'p') {
	phyicsSettings.pause = !phyicsSettings.pause;
    }
}

function handleKeys() {
    if (keyIsDown(RETURN)) showWelcome = false;
    if (showWelcome) { return; }
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

function drawStatusBar() {
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
    drawButton(0);
}

function drawPaused() {
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

function drawPhysicsOptions() {
    let button = buttons[1];
    let optionsHeight = padding + button.h + padding + lineSize/2;
    let optionsWidth = 0;
    for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(phyicsOptions.checkBoxes[i].label, 0, 0);
	optionsWidth = max(optionsWidth, bounds.w + 1.5 * padding + checkBoxSize);
    }

    optionsWidth = max(optionsWidth, 1.5 * padding + button.h/2 + button.w) + 2 * padding;
    for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(phyicsOptions.checkBoxes[i].label, 0, 0);
	optionsHeight += max(bounds.h, checkBoxSize) + padding;
    }

    optionsHeight += padding;

    fill(255);
    rect(button.x - padding - button.h/2, button.y - button.h, optionsWidth, optionsHeight, 10);
    fill(127);
    rect(button.x, button.y + 2 * padding - lineSize/2, button.w, lineSize);

    let y = button.y + 2.5 * padding + lineSize;
    textAlign(LEFT, CENTER);
    for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	let checkBox = phyicsOptions.checkBoxes[i];
	checkBox.x = button.x;
	checkBox.y = y;
	checkBox.w = checkBoxSize;
	checkBox.h = checkBoxSize;

	stroke(127);
	if (checkBox.value) {
	    fill(0, 255, 0);
	} else {
	    fill(127);
	}

	square(checkBox.x, checkBox.y, checkBoxSize);

	noStroke();
	fill(0);
	text(checkBox.label, checkBox.x + checkBoxSize + padding/2, checkBox.y + checkBoxSize/2);

	let bounds = textBounds(checkBox.label, 0, 0);
	y += max(bounds.h, checkBoxSize) + padding;
    }

    textAlign(LEFT, BASELINE);
}

function drawPhysicsSettings() {
    fill(255);
    noStroke();

    let button = buttons[1];
    if (physicsSettingsOpen)  {
	drawPhysicsOptions();
    } else {
	rect(button.x - padding/2, button.y - button.h, button.w + padding, button.h + padding);
	circle(button.x - padding/2, button.y - button.h/2 + padding/2, button.h+padding);
	circle(button.x + button.w + padding/2, button.y - button.h/2 + padding/2, button.h+padding);
    }

    drawButton(1);
}

function drawHud() {
    drawStatusBar();
    drawPhysicsSettings();
    if (phyicsSettings.pause) {
	drawPaused();
    }
}

function drawWelcome() {
    textSize(16);
    noStroke();
    let welcomeText = `Welcome to phychem-ulator, a physics and chemistry simulator
    Useage:
    Move around by grabbing the plane with your left mouse button, by using the WASD-keys, or by using the arrow-keys.
    Place atoms by clicking with your left mouse button.
    Scroll up/down to zoom in/out.

    UI:
    In the top middle part of your screen there is a bar with your current scale/zoom level compared to when you just launched the simulation. A reset button which reset the simulation, your cursor position, and your zoom, but not your settings. And a count of the total number of atoms in the simulation.
    On the right side the is a button which opens a menu of settings for the physics engine.

    Good things to know:
    The Simulation aims to be realistic, atoms are always drawn but at least 5 pixels in size, but are realistic in size. Thus you'll need to zoom in alot (10'000'000'000 times) to be able to really seem them. On that note zooming in can be kind of difficult when every thing is so small, I suggest you place an atom, keep your mouse still, and then zoom in until the you can see the atom. This way you'll and up with your cursor at the atom. Also gravity is made 100'000'000 times stronger so you'll be able to actually see stuff moving.

    Clicking will close this screen.`
    let welcomeWidth = width/2 + padding;
    let bounds = textBounds(welcomeText, width/2, 0, welcomeWidth - padding);
    let welcomeHeight = bounds.h + 2*padding;

    fill(255);
    rect(width/2-welcomeWidth/2, height/2-welcomeHeight/2, welcomeWidth, welcomeHeight, 10);

    fill(0);
    stroke(0);
    text(welcomeText, width/2-welcomeWidth/2+padding/2, height/2 - welcomeHeight/2+padding, welcomeWidth - padding);
}

function draw() {
    background(172);
    fill(128, 255, 128);
    handleKeys();
    if (!phyicsSettings.pause) { processPhyics(); }
    drawCoordinatePlane();
    drawAtoms();
    drawHud();
    if (showWelcome) { drawWelcome(); }
}
