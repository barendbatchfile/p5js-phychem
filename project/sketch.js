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

let physicsSettings = {
    timeMultiplier: 1,
    gravityMultiplier: 1e8,
    softeningConst: 2,
};

let paused = false;
let physicsOptions = {
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

let physicsConstents = {
    gravity: 6.67384e-11,
    atomicMass: 1.660538921e-27,
    spring: 1e-24,
};

let atomRadius = {
    1: 31,   // H
    2: 28,   // He
    3: 128,  // Li
    4: 96,   // Be
    5: 84,   // B
    6: 76,   // C
    7: 71,   // N
    8: 66,   // O
    9: 57,   // F
    10: 58,  // Ne
    11: 166, // Na
    12: 141, // Mg
    13: 121, // Al
    14: 111, // Si
    15: 107, // P
    16: 105, // S
    17: 102, // Cl
    18: 106, // Ar
};

let secondsDay = 24 * 60 * 60;
let secondsYear = 365.25*secondsDay;
let periodicTable = [
    {symbol: "H", Z:1, r:31, c:"#ff0000",
     isotopes: [{A:1, halfTime: 0, alpha: false, beta: false},
		{A:2, halfTime: 0, alpha: false, beta: false},
		{A:3, halfTime: 12.3*secondsYear, alpha: false, beta: true}],},
    {symbol: "He", Z:2, r:28, c:"#00ff00",
     isotopes: [{A:3, halfTime: 0, alpha: false, beta: false},
		{A:4, halfTime: 0, alpha: false, beta: false},
		{A:6, halfTime: 0.807, alpha: false, beta: true}],},
    {symbol: "Li", Z:3, r:128, c:"#0000ff",
     isotopes: [{A:6, halfTime: 0, alpha: false, beta: false},
		{A:7, halfTime: 0, alpha: false, beta: false},
		{A:8, halfTime: 0.838, alpha: false, beta: true}],},
    {symbol: "Be", Z:4, r:96, c:"#ffff00",
     isotopes: [{A:7, halfTime: 0, alpha: false, beta: false},
		{A:8, halfTime: 1e-16, alpha: true, beta: false},
		{A:9, halfTime: 0, alpha: false, beta: false},
		{A:10, halfTime: secondsYear*1.5e6, alpha: false, beta: true}],},
    {symbol: "B", Z:5, r:84, c:"#ff00ff",
     isotopes: [{A:8, halfTime: 0.77, alpha: false, beta: true},
		{A:10, halfTime: 1e-16, alpha: true, beta: false},
		{A:11, halfTime: 0, alpha: false, beta: false},
		{A:12, halfTime: 0.02, alpha: false, beta: true}],},
    {symbol: "C", Z:6, r:76, c:"#00ffff",
     isotopes: [{A:10, halfTime: 19.2, alpha: false, beta: true},
		{A:11, halfTime: 20.4*60, alpha: true, beta: false},
		{A:12, halfTime: 0, alpha: false, beta: false},
		{A:13, halfTime: 02, alpha: false, beta: true},
		{A:14, halfTime: 5730*secondsYear, alpha: false, beta: true}],},
    {symbol: "N", Z:7, r:71, c:"#bb0000",
     isotopes: [{A:12, halfTime: 0.011, alpha: false, beta: true},
		{A:13, halfTime: 9.97*60, alpha: false, beta: true},
		{A:14, halfTime: 0, alpha: false, beta: false},
		{A:15, halfTime: 0, alpha: false, beta: true},
		{A:16, halfTime: 7.13, alpha: false, beta: true}],},
    {symbol: "O", Z:8, r:66, c:"#00bb00",
     isotopes: [{A:15, halfTime: 0.011, alpha: false, beta: true},
		{A:16, halfTime: 9.97*60, alpha: false, beta: true},
		{A:17, halfTime: 0, alpha: false, beta: false},
		{A:18, halfTime: 0, alpha: false, beta: true},
		{A:19, halfTime: 7.13, alpha: false, beta: true}],},
    {symbol: "F", Z:9, r:57, c:"#0000bb",
     isotopes: [{A:19, halfTime: 0, alpha: false, beta: false},],},
    {symbol: "Ne", Z:10, r:58, c:"#bbbb00",
     isotopes: [{A:20, halfTime: 0, alpha: false, beta: false},
		{A:21, halfTime: 0, alpha: false, beta: false},
		{A:22, halfTime: 0, alpha: false, beta: false},
		{A:24, halfTime: 3.38*60, alpha: false, beta: true},],},
    {symbol: "Na", Z:11, r:166, c:"#00bbbb",
     isotopes: [{A:22, halfTime: 2.6*secondsYear, alpha: false, beta: true},
		{A:23, halfTime: 0, alpha: false, beta: false},
		{A:24, halfTime: 14.96*3600, alpha: false, beta: true}, ,],},
    {symbol: "Mg", Z:12, r:141, c:"#bb00bb",
     isotopes: [{A:22, halfTime: 3.9, alpha: false, beta: true},
		{A:24, halfTime: 0, alpha: false, beta: false},
		{A:25, halfTime: 0, alpha: false, beta: false},
		{A:26, halfTime: 0, alpha: false, beta: false},
		{A:28, halfTime: 14.96*3600, alpha: false, beta: true},],},
    {symbol: "Al", Z:13, r:121, c:"#990000",
     isotopes: [{A:26, halfTime: secondsYear*7.17e7, alpha: false, beta: true},
		{A:27, halfTime: 0, alpha: false, beta: false},
		{A:28, halfTime: 2.4*60, alpha: false, beta: true},],},
    {symbol: "Si", Z:14, r:111, c:"#009900",
     isotopes: [{A:28, halfTime: 0, alpha: false, beta: false},
		{A:29, halfTime: 0, alpha: false, beta: false},
		{A:30, halfTime: 0, alpha: false, beta: false},
		{A:31, halfTime: 2.6*3600, alpha: false, beta: true},
		{A:32, halfTime: secondsYear*150, alpha: false, beta: true},],},
    {symbol: "P", Z:15, r:107, c:"#000099",
     isotopes: [{A:30, halfTime: 2.5*60, alpha: false, beta: true},
		{A:31, halfTime: 0, alpha: false, beta: false},
		{A:32, halfTime: 14.3*secondsDay, alpha: false, beta: true},
		{A:32, halfTime: 25.3*secondsDay, alpha: false, beta: true},],},
    {symbol: "S", Z:16, r:105, c:"#999900",
     isotopes: [{A:32, halfTime: 0, alpha: false, beta: false},
		{A:33, halfTime: 0, alpha: false, beta: false},
		{A:34, halfTime: 0, alpha: false, beta: false},
		{A:35, halfTime: 87.3*secondsDay, alpha: false, beta: true},
		{A:36, halfTime: 0, alpha: false, beta: false},
		{A:38, halfTime: 2.84*secondsDay, alpha: false, beta: true},],},
    {symbol: "Cl", Z:17, r:102, c:"#990099",
     isotopes: [{A:34, halfTime: 1.53, alpha: false, beta: true},
		{A:35, halfTime: 0, alpha: false, beta: false},
		{A:36, halfTime: secondsYear*3.01e5, alpha: false, beta: true},
		{A:37, halfTime: 0, alpha: false, beta: false},
		{A:38, halfTime: 37.2*60, alpha: false, beta: true},
		{A:39, halfTime: 55.5*60, alpha: false, beta: true},],},
    {symbol: "Ar", Z:18, r:106, c:"#009999",
     isotopes: [{A:36, halfTime: 0, alpha: false, beta: false},
		{A:37, halfTime: 0, alpha: false, beta: false},
		{A:38, halfTime: 0, alpha: false, beta: false},
		{A:39, halfTime: 269*secondsDay, alpha: false, beta: true},
		{A:40, halfTime: 0, alpha: false, beta: false},],},
];

let atomSelector = {
    size: 0,
    count: 3,
    h: 0,
    w: 0,
    x: 0,
    y: 0,
    current: 0,
    atoms: [
	{
	    symbol: "H",
	    Z: 1,
	    A: 1,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#00ff00",
	    r: 0,
	},
	{
	    symbol: "H",
	    Z: 1,
	    A: 2,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#00ff00",
	    r: 0,
	},
	{
	    symbol: "H",
	    Z: 1,
	    A: 3,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#00ff00",
	    r: 0,
	},
	{
	    symbol: "O",
	    Z: 8,
	    A: 15,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 0,
	},
	{
	    symbol: "O",
	    Z: 8,
	    A: 16,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 0,
	},
	{
	    symbol: "O",
	    Z: 8,
	    A: 17,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 0,
	},
	{
	    symbol: "O",
	    Z: 8,
	    A: 18,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 0,
	},
	{
	    symbol: "O",
	    Z: 8,
	    A: 19,
	    x: 0,
	    y: 0,
	    vx: 0,
	    vy: 0,
	    ax: 0,
	    ay: 0,
	    c: "#5555ff",
	    r: 0,
	},
    ],
};

let atoms = [];
let minAtomDiamater = 5;
let maxAtomDiamater = 0;
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
	label: "Reset",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Settings",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Pause",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Select atom",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    {
	label: "Help",
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
	buttons[id].x = width/2 - buttons[id].w - padding;
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
    } else if (id === 4) {
	buttons[id].w = bounds.w;
	buttons[id].h = bounds.h;
	buttons[id].x = width/2 + padding;
	buttons[id].y = 3*padding + buttons[id].h - textDescent(buttons[id].label);
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
    maxAtomDiamater = 2*max(width, height);
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
    atoms = [];
}

function mouseClicked() {
    if (showWelcome) {
	showWelcome = false;
	return;
    }

    if (mouseX > physicsOptions.x &&
	mouseX < physicsOptions.x + physicsOptions.w &&
	mouseY > physicsOptions.y &&
	mouseY < physicsOptions.y + physicsOptions.h) {
	if (isMouseOverButton(1)) {
	    console.log("clicked button 1 (physics settings)");
	    physicsSettingsOpen = !physicsSettingsOpen;
	    return;
	}

	for (let i = 0; i < physicsOptions.checkBoxes.length; i++) {
	    let checkBox = physicsOptions.checkBoxes[i];
	    if (mouseX > physicsOptions.x &&
		mouseX < physicsOptions.x + physicsOptions.w &&
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
	let y = buttons[3].y + 3 * padding + lineSize;
	stroke(0);
	for (let i = 0; i < atomSelector.atoms.length; i++) {
	    if (mouseX > x &&
		mouseX < x + atomSelector.size &&
		mouseY > y &&
		mouseY < y + atomSelector.size) {
		atomSelector.current = i;
		atomSelectorOpen = false;
		return;
	    }

	    let atom = atomSelector.atoms[i];
	    let bounds = textBounds(atom.symbol + "-" + atom.A, 0, 0);
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

	if (isMouseOverButton(4)) {
	    console.log("clicked button 4 (help)");
	    showWelcome = true;
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

    let atom = Object.create(atomSelector.atoms[atomSelector.current]);
    let radius = atomRadius[atom.Z];
    if (radius === undefined) {
	atom.r = 100e-12;
    } else {
	atom.r = radius * 1e-12;
    }

    atom.x = (mouseX - centerX) * (scale*10**exponent) / stepSize;
    atom.y = (mouseY - centerY) * (scale*10**exponent) / stepSize;
    atoms.push(atom);
}

function mouseWheel(event) {
    let oldPixelsPerUnit = stepSize / (scale*10**exponent);

    if (exponent < 3 && event.delta > 0) { scale *= 2};
    if (exponent > -12 && event.delta < 0) { scale /= 2};
    if (scale <= 0) { scale = 0.1; }
    if (scale >= 10) { scale /= 10; exponent += 1; }
    if (scale < 0.1) { scale *= 10; exponent -= 1; }

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
    maxAtomDiamater = 2*max(width, height);
    updateCenter();
    updateButtons();
}

function processGravity(dt) {
    for (let i = 0; i < atoms.length; i++) {
	let atomA = atoms[i];
	for (let j = 0; j < atoms.length; j++) {
	    if (i === j) { continue; }
	    let atomB = atoms[j];
	    let massB = atomB.A * physicsConstents.atomicMass; // convert mass in u to kg.

	    let dx = atomB.x - atomA.x;
	    let dy = atomB.y - atomA.y;
	    let r;
	    if (physicsOptions.checkBoxes[3].value) {
		let softening = physicsSettings.softeningConst * (atomA.r + atomB.r);
		r = sqrt(dx * dx + dy * dy + softening * softening);
	    } else {
		r = sqrt(dx * dx + dy * dy);
	    }

	    if (r === 0) { continue; }

	    let a = physicsConstents.gravity * massB / (r**2) * physicsSettings.gravityMultiplier;
	    atomA.ax += a * dx / r;
	    atomA.ay += a * dy / r;
	}
    }
}

function bounce(atomA, atomB) {
    let dx = atomB.x - atomA.x;
    let dy = atomB.y - atomA.y
    let distance = dist(atomA.x , atomA.y, atomB.x, atomB.y);
    let u = atomA.r + atomB.r - distance;

    if (distance === 0) { return; }
    let massA = (atomA.A * physicsConstents.atomicMass);
    let massB = (atomB.A * physicsConstents.atomicMass);
    let nx = dx / distance;
    let ny = dy / distance;

    atomB.ay += physicsConstents.spring * u / massB * ny;
    atomB.ax += physicsConstents.spring * u / massB * nx;
    atomA.ax -= physicsConstents.spring * u / massA * nx;
    atomA.ay -= physicsConstents.spring * u / massA * ny;
}

function processPhysics() {
    let dt = deltaTime * physicsSettings.timeMultiplier / 1000; //convert deltaTime from miliseconds to seconds.
    for (let i = 0; i < atoms.length; i++) {
        atoms[i].ax = 0;
        atoms[i].ay = 0;
    }

    //gravity
    if (physicsOptions.checkBoxes[0].value) {
	processGravity(dt);
    }

    //bounce
    if (physicsOptions.checkBoxes[1].value) {
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
    if (physicsOptions.checkBoxes[2].value) {
	for (let i = 0; i < atoms.length; i++) {
	    atoms[i].vx += atoms[i].ax * dt;
	    atoms[i].vy += atoms[i].ay * dt;
	    atoms[i].x += atoms[i].vx * dt;
	    atoms[i].y += atoms[i].vy * dt;
	}
    }
}

function getUnit() {
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

    let panStep = cursorSpeed * deltaTime / 1000;
    if (keyIsDown('ArrowLeft') || keyIsDown('a')) {
	cursor.x += panStep;
	centerX = offset.x + cursor.x;
    }

    if (keyIsDown('ArrowRight') || keyIsDown('d')) {
	cursor.x -= panStep;
	centerX = offset.x + cursor.x;
    }

    if (keyIsDown('ArrowUp') || keyIsDown('w')) {
	cursor.y += panStep;
	centerY = offset.y + cursor.y;
    }

    if (keyIsDown('ArrowDown') || keyIsDown('s')) {
	cursor.y -= panStep;
	centerY = offset.y + cursor.y
    }
}

function drawCoordinatePlane() {
    let minMarkY = Math.ceil((centerY - height) / stepSize);
    let maxMarkY = Math.floor(centerY / stepSize);
    let minMarkX = Math.ceil((0 - centerX) / stepSize);
    let maxMarkX = Math.floor((width - centerX) / stepSize);

    noStroke();
    textSize(16);

    for (let i = minMarkX; i <= maxMarkX; i++) {
	let x = centerX + i * stepSize;
	fill(62);
	stroke(62);
	rect(x, 0, lineSize, height);

	fill(0);
	stroke(0);
	let value = Math.round(i * scale * 1000) / 1000;
	let txt = value + getUnit();
	let bounds = textBounds(txt, x, centerY);
	text(txt, x + padding, centerY - bounds.h - padding);
    }

    for (let i = minMarkY; i <= maxMarkY; i++) {
	fill(62);
	stroke(62);
	let y = centerY - i * stepSize;
	rect(0, y, width, lineSize);

	fill(0);
	stroke(0);
	let value = Math.round(i * scale * 1000) / 1000;
	let txt = value + getUnit();
	let bounds = textBounds(txt, centerX, y);
	text(txt, centerX + padding, y - bounds.h - padding);
    }

    fill(0);
    rect(centerX - lineSize, 0, 2 * lineSize, height);
    rect(0, centerY - lineSize, width, 2 * lineSize);
}

function drawAtoms() {
    for (let i = 0; i < atoms.length; i++) {
	let atom = atoms[i];
	let x = centerX + atom.x / (scale*10**exponent) * stepSize;
	let y = centerY + atom.y / (scale*10**exponent) * stepSize;
	let d = constrain(2*atom.r * stepSize/(scale*10**exponent), minAtomDiamater, maxAtomDiamater);

	if (x + d/2 < 0 ||
	    x - d/2 > width ||
	    y + d/2 < 0 ||
	    y - d/2 > height) {
	    continue;
	}

	fill(atom.c);
	circle(x, y, d);
	let name = atom.symbol + "-" + atom.A;
	let size = 160;
	while (true) {
	    textSize(size);
	    let bounds = textBounds(name, x, y);
	    let txtR = sqrt(bounds.w*bounds.w + bounds.h*bounds.h);
	    if (txtR > d * 0.8) {
		size -= 1;
	    }

	    if (size <= 4 || txtR <= d * 0.8) {
		break;
	    }
	}

	if (size > 4) {
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
    let scaleStatus = "scale = 1:" + (scale*10**exponent).toExponential(2);
    let atomStatus = "atoms = " + atoms.length;
    let fpsStatus = "fps = " + Math.round(frameRate());

    let scaleBounds = textBounds(scaleStatus, width/2, 0);
    let atomBounds = textBounds(atomStatus, width/2, 0);
    let fpsBounds = textBounds(fpsStatus, width/2, 0);

    // recompute new bar.
    bar.h = buttons[0].h + 2*padding;
    bar.w = buttons[0].w + scaleBounds.w + atomBounds.w + fpsBounds.w + buttons[4].w + 2*padding + 4*padding;
    bar.x = buttons[0].x - scaleBounds.w - padding;

    // draw bar
    fill(255);
    rect(bar.x, bar.y, bar.w, bar.h);
    circle(bar.x, bar.h/2 + bar.y, bar.h);
    circle(bar.x+bar.w, bar.h/2 + bar.y, bar.h);

    // draw text around button.
    stroke(0);
    fill(0);
    text(scaleStatus, bar.x, bar.y + scaleBounds.h + padding);
    text(atomStatus, buttons[4].x + buttons[4].w + padding, bar.y + atomBounds.h + padding);
    text(fpsStatus, buttons[4].x + buttons[4].w+atomBounds.w+2*padding, bar.y + atomBounds.h + padding);
    drawButton(0);
    drawButton(4);
}

function drawPaused() {
    let button = buttons[2];
    if (paused) {
	button.label = "Resume";
    } else {
	button.label = "Pause";
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
    physicsOptions.h = padding + button.h + padding + lineSize/2;
    physicsOptions.w = 0;
    for (let i = 0; i < physicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(physicsOptions.checkBoxes[i].label, 0, 0);
	physicsOptions.w = max(physicsOptions.w, bounds.w + 1.5 * padding + checkBoxSize);
    }

    physicsOptions.w = max(physicsOptions.w, 1.5 * padding + button.h/2 + button.w) + 2 * padding;
    for (let i = 0; i < physicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(physicsOptions.checkBoxes[i].label, 0, 0);
	physicsOptions.h += max(bounds.h, checkBoxSize) + padding;
    }

    physicsOptions.h += padding;
    physicsOptions.x = button.x - padding - button.h/2;
    physicsOptions.y = button.y - button.h;

    fill(255);
    rect(physicsOptions.x, physicsOptions.y, physicsOptions.w, physicsOptions.h, 10);
    fill(127);
    rect(button.x, button.y + 2 * padding - lineSize/2, button.w, lineSize);

    let y = button.y + 2.5 * padding + lineSize;
    textAlign(LEFT, CENTER);
    for (let i = 0; i < physicsOptions.checkBoxes.length; i++) {
	let checkBox = physicsOptions.checkBoxes[i];
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
	physicsOptions.h = button.h + padding;
	physicsOptions.w = button.w + button.h + padding;
	physicsOptions.x = button.x - padding - button.h/2;
	physicsOptions.y = button.y - button.h;
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
    atomSelector.h = button.h + 4*padding + lineSize + Math.ceil(atomSelector.atoms.length/atomSelector.count) * atomSelector.size;
    atomSelector.w = max(button.w + button.h, 3*atomSelector.size) + 2*padding;
    atomSelector.x = width - atomSelector.w - 2*padding - button.h/2;
    atomSelector.y = button.y - button.h;
    rect(atomSelector.x, atomSelector.y, atomSelector.w, atomSelector.h, 10);
    fill(127);
    rect(atomSelector.x + padding/2, button.y + 2 * padding - lineSize/2, atomSelector.count*atomSelector.size, lineSize);

    let x = atomSelector.x + padding;
    let y = button.y + 3 * padding + lineSize;
    stroke(0);
    for (let i = 0; i < atomSelector.atoms.length; i++) {
	let atom = atomSelector.atoms[i];
	let txt = atom.symbol + "-" + atom.A;
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
    On the left side there is a button which opens a menu of settings for the physics engine.
    On the right side there is a button which opens a menu for selecting different atoms.
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
    if (!paused) { processPhysics(); }
    drawCoordinatePlane();
    drawAtoms();
    drawHud();
    if (showWelcome) { drawWelcome(); }
}
