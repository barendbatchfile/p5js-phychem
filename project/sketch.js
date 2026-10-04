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

let phyicsSettings = {
    timeMultiplier: 1,
    gravityMultiplier: 1e8,
    softeningConst: 2,
};

let paused = false;
let phyicsOptions = {
    h: 0,
    w: 0,
    x: 0,
    y: 0,
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

let atomSelector = {
    size: 0,
    count: 3,
    h: 0,
    w: 0,
    x: 0,
    y: 0,
    current: 0,
    periodicTable: [
	{
	    name: "H",
	    number: 1,
	    m: 1,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#00ff00",
	    r: 5.3e-11,
	},
	{
	    name: "H",
	    number: 2,
	    m: 2,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#00ff00",
	    r: 5.3e-11,
	},
	{
	    name: "H",
	    number: 3,
	    m: 3,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#00ff00",
	    r: 5.3e-11,
	},
	{
	    name: "O",
	    number: 15,
	    m: 15,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 5.3e-11,
	},
	{
	    name: "O",
	    number: 16,
	    m: 16,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 5.3e-11,
	},
	{
	    name: "O",
	    number: 17,
	    m: 17,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 5.3e-11,
	},
	{
	    name: "O",
	    number: 18,
	    m: 18,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 5.3e-11,
	},
	{
	    name: "O",
	    number: 19,
	    m: 19,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 5.3e-11,
	},
    ],
};

let atoms = [];
let atomSelectorOpen = false;
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
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Physics settings",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Pause simulation",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Atom selector",
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
    } else if (id === 3) {
	buttons[id].w = bounds.w;
	buttons[id].h = bounds.h + padding;
	buttons[id].y = 2*padding + buttons[id].h;
	buttons[id].x = width - 3*padding - buttons[id].w - buttons[id].h;

	bounds = textBounds("WW-WWW", 0, 0);
	atomSelector.size = max(bounds.h, bounds.w);
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

    if (mouseX > phyicsOptions.x &&
	mouseX < phyicsOptions.x + phyicsOptions.w &&
	mouseY > phyicsOptions.y &&
	mouseY < phyicsOptions.y + phyicsOptions.h) {
	if (isMouseOverButton(1)) {
	    console.log("clicked button 1 (physics settings)");
	    physicsSettingsOpen = !physicsSettingsOpen;
	    return;
	}

	for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	    let checkBox = phyicsOptions.checkBoxes[i];
	    if (mouseX > phyicsOptions.x &&
		mouseX < phyicsOptions.x + phyicsOptions.w &&
		mouseY > checkBox.y &&
		mouseY < checkBox.y + checkBox.h) {
		checkBox.value = !checkBox.value;
		return;
	    }
	}

	return;
    }

    if (mouseX > atomSelector.x &&
	mouseX < atomSelector.x + atomSelector.w &&
	mouseY > atomSelector.y &&
	mouseY < atomSelector.y + atomSelector.h) {
	if (isMouseOverButton(3)) {
	    console.log("clicked button 3 (atom selector)");
	    atomSelectorOpen = !atomSelectorOpen;
	    return;
	}

	let x = atomSelector.x + padding;
	let y = atomSelector.y + 3 * padding + lineSize;
	stroke(0);
	for (let i = 0; i < atomSelector.periodicTable.length; i++) {
	    if (mouseX > x &&
		mouseX < x + atomSelector.size &&
		mouseY > y &&
		mouseY < y + atomSelector.size) {
		atomSelector.current = i;
		atomSelectorOpen = false;
		return;
	    }

	    let atom = atomSelector.periodicTable[i];
	    let bounds = textBounds(atom.name + "-" + atom.number, 0, 0);
	    square(x, y, atomSelector.size);

	    if ((i+1)% atomSelector.count === 0) {
		y += atomSelector.size;
		x = atomSelector.x + padding;
	    } else {
		x += atomSelector.size;
	    }


	}

	return;
    }

    if (mouseX > bar.x &&
	mouseX < bar.x + bar.w &&
	mouseY > bar.y &&
	mouseY < bar.y + bar.h) {
	if (isMouseOverButton(0)) {
	    console.log("clicked button 0 (reset)");
	    resetGame();
	    return;
	}

	return;
    }

    if (mouseX > buttons[2].x &&
	mouseX < buttons[2].x + buttons[2].w &&
	mouseY < buttons[2].y &&
	mouseY > buttons[2].y - buttons[2].h) {

	console.log("clicked button 2 (pause/unpause)");
	paused = !paused;
	return;
    }

    if (dragging) { return; }

    let atom = Object.create(atomSelector.periodicTable[atomSelector.current]);
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
	    atomA.ax = a * dx / r;
	    atomA.ay = a * dy / r;
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

    //bounce
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

    // movement
    if (phyicsOptions.checkBoxes[2].value) {
	for (let i = 0; i < atoms.length; i++) {
	    atoms[i].vx += atoms[i].ax * dt;
	    atoms[i].vy += atoms[i].ay * dt;
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
	paused = !paused;
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
    let button = buttons[2];
    if (paused) {
	button.label = "Resume simulation";
    } else {
	button.label = "Pause simulation";
    }

    let bounds = textBounds(button.label, width/2, height);
    button.y = height - bounds.h - 3.5*padding;
    button.x = width/2 - bounds.w/2 + padding/2;
    button.w = bounds.w + padding;
    button.h = bounds.h + padding;

    fill(255);
    stroke(255);
    rect(button.x - padding/2, button.y - button.h + padding/2, button.w, button.h);
    circle(button.x - padding/2, button.y - button.h/2 + padding/2, button.h);
    circle(button.x + button.w, button.y - button.h/2 + padding/2, button.h);
    stroke(0);
    fill(0);
    drawButton(2);
}

function drawPhysicsOptions() {
    let button = buttons[1];
    phyicsOptions.h = padding + button.h + padding + lineSize/2;
    phyicsOptions.w = 0;
    for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(phyicsOptions.checkBoxes[i].label, 0, 0);
	phyicsOptions.w = max(phyicsOptions.w, bounds.w + 1.5 * padding + checkBoxSize);
    }

    phyicsOptions.w = max(phyicsOptions.w, 1.5 * padding + button.h/2 + button.w) + 2 * padding;
    for (let i = 0; i < phyicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(phyicsOptions.checkBoxes[i].label, 0, 0);
	phyicsOptions.h += max(bounds.h, checkBoxSize) + padding;
    }

    phyicsOptions.h += padding;
    phyicsOptions.x = button.x - padding - button.h/2;
    phyicsOptions.y = button.y - button.h;

    fill(255);
    rect(phyicsOptions.x, phyicsOptions.y, phyicsOptions.w, phyicsOptions.h, 10);
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
	phyicsOptions.h = button.h + padding;
	phyicsOptions.w = button.w + button.h + padding;
	phyicsOptions.x = button.x - padding - button.h/2;
	phyicsOptions.y = button.y - button.h;
	rect(button.x - padding/2, button.y - button.h, button.w + padding, button.h + padding);
	circle(button.x - padding/2, button.y - button.h/2 + padding/2, button.h+padding);
	circle(button.x + button.w + padding/2, button.y - button.h/2 + padding/2, button.h+padding);
    }

    drawButton(1);
}

function drawAtomSelectorOpen() {
    fill(255);
    noStroke();

    let button = buttons[3];
    atomSelector.h = button.h + 4*padding + lineSize + Math.ceil(atomSelector.periodicTable.length/atomSelector.count) * atomSelector.size;
    atomSelector.w = max(button.w + button.h, 3*atomSelector.size) + 2*padding;
    atomSelector.x = width - atomSelector.w - 2*padding - button.h/2;
    atomSelector.y = button.y - button.h;
    rect(atomSelector.x, atomSelector.y, atomSelector.w, atomSelector.h, 10);
    fill(127);
    rect(atomSelector.x + padding/2, button.y + 2 * padding - lineSize/2, atomSelector.count*atomSelector.size, lineSize);

    let x = atomSelector.x + padding;
    let y = button.y + 3 * padding + lineSize;
    stroke(0);
    for (let i = 0; i < atomSelector.periodicTable.length; i++) {
	let atom = atomSelector.periodicTable[i];
	let txt = atom.name + "-" + atom.number;
	let bounds = textBounds(txt, 0, 0);
	fill(atom.c);
	square(x, y, atomSelector.size);
	fill(0);
	text(txt, x + (atomSelector.size - bounds.w)/2, y + atomSelector.size -(atomSelector.size - bounds.h)/2);

	if ((i+1)% atomSelector.count === 0) {
	    y += atomSelector.size;
	    x = atomSelector.x + padding;
	} else {
	    x += atomSelector.size;
	}
    }

    drawButton(3);
}

function drawAtomSelector() {
    fill(255);
    noStroke();

    let button = buttons[3];
    if (atomSelectorOpen)  {
	drawAtomSelectorOpen();
    } else {
	atomSelector.h = button.h + padding;
	atomSelector.w = button.w + button.h + padding;
	atomSelector.x = button.x - padding - button.h/2;
	atomSelector.y = button.y - button.h;
	rect(button.x - padding/2, button.y - button.h, button.w + padding, atomSelector.h);
	circle(button.x - padding/2, button.y - button.h/2 + padding/2, button.h+padding);
	circle(button.x + button.w + padding/2, button.y - button.h/2 + padding/2, button.h+padding);
    }

    drawButton(3);
}

function drawHud() {
    drawStatusBar();
    drawPhysicsSettings();
    drawAtomSelector();
    drawPaused();
}

function drawWelcome() {
    textSize(16);
    noStroke();
    let welcomeText = `Welcome to phychem-ulator, a physics and chemistry simulator
    Usage:
    Move around by grabbing the coordinate plane by dragging it while pressing your left mouse button, by using the WASD-keys, or by using the arrow-keys.
    Place atoms by clicking with your left mouse button.
    Scroll up/down to zoom in/out.

    UI:
    In the top middle part of your screen there is a bar with your current scale/zoom level compared to when you just launched the simulation. A reset button which reset the simulation, your cursor position, and your zoom, but not your settings. And a count of the total number of atoms in the simulation.
    On the left side the is a button which opens a menu of settings for the physics engine.
    On the right side the is a button which opens a menu for selecting different atoms.
In the bottom middle part of your screen there is a pause/resume button with pauses or resmuses the simuation.

    Good things to know:
    The Simulation aims to be realistic, atoms are always drawn but at least 5 pixels in size, but are realistic in size. Thus you'll need to zoom in alot (10'000'000'000 times) to be able to really seem them. On that note zooming in can be kind of difficult when every thing is so small, I suggest you place an atom, keep your mouse still, and then zoom in until the you can see the atom. This way you'll end up with your cursor at the atom. Also gravity is made 100'000'000 times stronger so you'll be able to actually see stuff moving in a timely manner.

    Clicking anywhere will close this screen.`
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
    if (!paused) { processPhyics(); }
    drawCoordinatePlane();
    drawAtoms();
    drawHud();
    if (showWelcome) { drawWelcome(); }
}
