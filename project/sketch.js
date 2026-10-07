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
    betaSpeedMultiplier: 1e-17,
    alphaSpeedMultiplier: 1e-17,
    gammaSpeedMultiplier: 1e-18,
};

let gamma = [];
let electrons = [];
let positrons = [];

let instructionsMenu = {
    open: false,
    title: {
	label: "Instructions",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    button: {
	label: "back",
	    x: 0,
	    y: 0,
	    w: 0,
	    h: 0,
    },
}

let paused = false;
let homeMenu = {
    open: true,
    title: {
	label: "Phychem-ulator",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
    buttons: [
	{
	    label: "Start/continue",
	    x: 0,
	    y: 0,
	    w: 0,
	    h: 0,
	},
	{
	    label: "Instructions",
	    x: 0,
	    y: 0,
	    w: 0,
	    h: 0,
	},
    ],
};

let physicsOptions = {
    h: 0,
    w: 0,
    x: 0,
    y: 0,
    open: false,
    checkBoxes: [
	{
	    label: "Gravity",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "Collision",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "Movement",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "Softening",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
	{
	    label: "Radioactive decay",
	    value: true,
	    x: -100,
	    y: -100,
	    w: 0,
	    h: 0,
	},
    ],
};

let physicsConstants = {
    gravity: 6.67384e-11,
    atomicMass: 1.660538921e-27,
    spring: 1e-24,
    C: 2.997e8,
    elektronRadius: 2.81794e-15,
};

let secondsDay = 24 * 60 * 60;
let secondsYear = 365.25*secondsDay;
let currentAtom = {
    symbol: "H",
    A: 1,
    Z: 1,
    r: 31,
    c: "#ff0000",
    halfTime: 0,
    alpha: false,
    betaMin: false,
    betaPlus: false,
    gamma: false,
};

let periodicTable = [
    {symbol: "H", Z:1, r:31, c:"#ff0000",
     isotopes: [{A:1, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:2, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:3, halfTime: 12.3*secondsYear, alpha: false, betaPlus: false, betaMin: true, gamma: false }],},
    {symbol: "He", Z:2, r:28, c:"#00ff00",
     isotopes: [{A:3, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:4, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:6, halfTime: 0.807, alpha: false, betaPlus: false, betaMin: true, gamma: false }],},
    {symbol: "Li", Z:3, r:128, c:"#ffff00",
     isotopes: [{A:6, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:7, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:8, halfTime: 0.838, alpha: false, betaPlus: false, betaMin: true, gamma: false }],},
    {symbol: "Be", Z:4, r:96, c:"#ff00ff",
     isotopes: [{A:7, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:8, halfTime: 1e-16, alpha: true, betaPlus: false, betaMin: false, gamma: false },
		{A:9, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:10, halfTime: secondsYear*1.5e6, alpha: false, betaPlus: false, betaMin: true, gamma: false }],},
    {symbol: "B", Z:5, r:84, c:"#00ffff",
     isotopes: [{A:8, halfTime: 0.77, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:10, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:11, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:12, halfTime: 0.02, alpha: false, betaPlus: false, betaMin: true, gamma: true }],},
    {symbol: "C", Z:6, r:76, c:"#ffbb00",
     isotopes: [{A:10, halfTime: 19.2, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:11, halfTime: 20.4*60, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:12, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:13, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:14, halfTime: 5730*secondsYear, alpha: false, betaPlus: false, betaMin: true, gamma: false }],},
    {symbol: "N", Z:7, r:71, c:"#ff00bb",
     isotopes: [{A:12, halfTime: 0.011, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:13, halfTime: 9.97*60, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:14, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:15, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:16, halfTime: 7.13, alpha: false, betaPlus: false, betaMin: true, gamma: false }],},
    {symbol: "O", Z:8, r:66, c:"#bbff00",
     isotopes: [{A:15, halfTime: 0.011, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:16, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:17, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:18, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:19, halfTime: 7.13, alpha: false, betaPlus: false, betaMin: true, gamma: true }],},
    {symbol: "F", Z:9, r:57, c:"#00ffbb",
     isotopes: [{A:19, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },],},
    {symbol: "Ne", Z:10, r:58, c:"#bb00ff",
     isotopes: [{A:20, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:21, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:22, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:24, halfTime: 3.38*60, alpha: false, betaPlus: false, betaMin: true, gamma: true },],},
    {symbol: "Na", Z:11, r:166, c:"#ffbbbb",
     isotopes: [{A:22, halfTime: 2.6*secondsYear, alpha: false, betaPlus: true, betaMin: false, gamma: true },
		{A:23, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:24, halfTime: 14.96*3600, alpha: false, betaPlus: false, betaMin: true, gamma: true },],},
    {symbol: "Mg", Z:12, r:141, c:"#bbffbb",
     isotopes: [{A:22, halfTime: 3.9, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:24, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:25, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:26, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:28, halfTime: 14.96*3600, alpha: false, betaPlus: false, betaMin: true, gamma: false },],},
    {symbol: "Al", Z:13, r:121, c:"#bbbbff",
     isotopes: [{A:26, halfTime: secondsYear*7.17e7, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:27, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:28, halfTime: 2.4*60, alpha: false, betaPlus: false, betaMin: true, gamma: true },],},
    {symbol: "Si", Z:14, r:111, c:"#bb0000",
     isotopes: [{A:28, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:29, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:30, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:31, halfTime: 2.6*3600, alpha: false, betaPlus: false, betaMin: true, gamma: false },
		{A:32, halfTime: secondsYear*150, alpha: false, betaPlus: false, betaMin: true, gamma: false },],},
    {symbol: "P", Z:15, r:107, c:"#00bb00",
     isotopes: [{A:30, halfTime: 2.5*60, alpha: false, betaPlus: true, betaMin: false, gamma: false },
		{A:31, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:32, halfTime: 14.3*secondsDay, alpha: false, betaPlus: false, betaMin: true, gamma: false },
		{A:33, halfTime: 25.3*secondsDay, alpha: false, betaPlus: false, betaMin: true, gamma: false },],},
    {symbol: "S", Z:16, r:105, c:"#bbbb00",
     isotopes: [{A:32, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:33, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:34, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:35, halfTime: 87.3*secondsDay, alpha: false, betaPlus: false, betaMin: true, gamma: false },
		{A:36, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:38, halfTime: 2.84*secondsDay, alpha: false, betaPlus: false, betaMin: true, gamma: false },],},
    {symbol: "Cl", Z:17, r:102, c:"#bb00bb",
     isotopes: [{A:34, halfTime: 1.53, alpha: false, betaPlus: true, betaMin: false, gamma: true },
		{A:35, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:36, halfTime: secondsYear*3.01e5, alpha: false, betaPlus: true, betaMin: true, gamma: false },
		{A:37, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:38, halfTime: 37.2*60, alpha: false, betaPlus: false, betaMin: true, gamma: true },
		{A:39, halfTime: 55.5*60, alpha: false, betaPlus: false, betaMin: true, gamma: false },],},
    {symbol: "Ar", Z:18, r:106, c:"#00bbbb",
     isotopes: [{A:36, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:37, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:38, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },
		{A:39, halfTime: 269*secondsDay, alpha: false, betaPlus: false, betaMin: true, gamma: false },
		{A:40, halfTime: 0, alpha: false, betaPlus: false, betaMin: false, gamma: false },],},
];

let atomSelector = {
    size: 0,
    open: false,
    columns: 3,
    count: 0,
    scroll: 0,
    max: 0,
    h: 0,
    w: 0,
    x: 0,
    y: 0,
};

let atoms = [];
let minAtomDiamater = 5;
let maxAtomDiamater = 0;
let checkBoxSize = 0;
let lineSize = 2;
let exponent = -10;
let scale = 1;
let markDist = 300;
let stepSize = markDist;
let centerX = 0;
let centerY = 0;
let offset = { x: 0, y: 0, };
let cursor = { x: 0, y: 0, };
let cursorSpeed = 800;
let padding = 5;
let dragging = false;
let bar = {
    x: 0,
    w: 0,
    h: 0,
    y: 2 * padding,
}

let UIButtons = [
    {
	label: "Home",
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
	label: "Reset",
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
	label: "Settings",
	x: 0,
	y: 0,
	w: 0,
	h: 0,
    },
];

function updateUIButton(id) {
    textSize(24);
    let bounds = textBounds(UIButtons[id].label, width/2, id);
    if (id === 0) {
	UIButtons[id].h = bounds.h;
	UIButtons[id].w = bounds.w;
	UIButtons[id].x = width/2 - bounds.w/2;
	UIButtons[id].y = 3*padding + UIButtons[id].h;
    } else if (id === 1) {
	UIButtons[id].h = bounds.h;
	UIButtons[id].w = bounds.w;
	UIButtons[id].x = UIButtons[0].x - UIButtons[id].w - 2*padding;
	UIButtons[id].y = 3*padding + UIButtons[id].h - textDescent(UIButtons[id].label);
    } else if (id === 2) {
	UIButtons[id].h = bounds.h;
	UIButtons[id].w = bounds.w + padding;
	UIButtons[id].x = UIButtons[0].x + UIButtons[0].w + 2*padding;
	UIButtons[id].y = 3*padding + UIButtons[id].h;
    } else if (id === 3) {
	UIButtons[id].w = bounds.w;
	UIButtons[id].h = bounds.h + padding;
	UIButtons[id].x = width - 3*padding - UIButtons[id].w - UIButtons[id].h;
	UIButtons[id].y = 2*padding + UIButtons[id].h;

	bounds = textBounds("WW-WWW", 0, 0);
	atomSelector.size = max(bounds.h, bounds.w);
    } else if (id === 4) {
	UIButtons[id].h = bounds.h;
	UIButtons[id].w = bounds.w;
	UIButtons[id].x = 2*padding+ UIButtons[id].h + padding;
	UIButtons[id].y = 3*padding + UIButtons[id].h;
    }
}

function updateUIButtons() {
    for (let i = 0; i < UIButtons.length; i++) {
	updateUIButton(i);
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
    updateUIButtons();
    textSize(24);
    maxAtomDiamater = 2*max(width, height);
    let bounds = textBounds("W", 0, 0);
    checkBoxSize = 1.1*max(bounds.h, bounds.w);
    for (let i = 0; i < periodicTable.length; i++) {
	atomSelector.count += periodicTable[i].isotopes.length;
    }

}

function mousePressed() {
    dragging = false;
}

function drawButton(buttons, id) {
    let	color = "#458588";
    if (isMouseOverButton(buttons, id)) {
	color = "#98971A";
    }

    stroke(color);
    fill(color);
    text(buttons[id].label, buttons[id].x, buttons[id].y);
}

function isMouseOverButton(buttons, id) {
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

    exponent = -10;
    scale = 1;
    atoms = [];
    electrons = [];
    gamma = [];
    positrons = [];
}

function mouseClicked() {
    if (homeMenu.open) {
	if (mouseX > homeMenu.buttons[0].x - homeMenu.buttons[0].h/2 &&
	    mouseX < homeMenu.buttons[0].x + homeMenu.buttons[0].w + homeMenu.buttons[0].h/2 &&
	    mouseY > homeMenu.buttons[0].y - homeMenu.buttons[0].h + 3*padding &&
	    mouseY < homeMenu.buttons[0].y + 3*padding) {
	    homeMenu.open = false;
	    console.log("Closed homeMenu");
	    return;
	}

	if (mouseX > homeMenu.buttons[1].x - homeMenu.buttons[1].h/2 &&
	    mouseX < homeMenu.buttons[1].x + homeMenu.buttons[1].w + homeMenu.buttons[1].h/2 &&
	    mouseY > homeMenu.buttons[1].y - homeMenu.buttons[1].h + 3*padding &&
	    mouseY < homeMenu.buttons[1].y + 3*padding) {
	    homeMenu.open = false;
	    instructionsMenu.open = true;
	    console.log("Opened instructionsmenu");
	    return;
	}

	return;
    }

    if (instructionsMenu.open) {
	if (mouseX > instructionsMenu.button.x- instructionsMenu.button.h/2 &&
	    mouseX < instructionsMenu.button.x + instructionsMenu.button.w + instructionsMenu.button.h/2 &&
	    mouseY > instructionsMenu.button.y -instructionsMenu.button.h + 3*padding &&
	    mouseY < instructionsMenu.button.y + 3*padding) {
	    homeMenu.open = true;
	    instructionsMenu.open = false;
	    console.log("Opened homeMenu");
	    return;
	}
	return;
    }

    if (mouseX > physicsOptions.x &&
	mouseX < physicsOptions.x + physicsOptions.w &&
	mouseY > physicsOptions.y &&
	mouseY < physicsOptions.y + physicsOptions.h) {
	if (isMouseOverButton(UIButtons, 4)) {
	    console.log("clicked button 4 (physics settings)");
	    physicsOptions.open = !physicsOptions.open;
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
	if (isMouseOverButton(UIButtons, 3)) {
	    console.log("clicked button 3 (atom selector)");
	    atomSelector.open = !atomSelector.open;
	    return;
	}

	let x = atomSelector.x + 3*padding;
	let y = UIButtons[3].y + 3 * padding + lineSize;
	let totalIndex = 0;
	let placed = 0;
	stroke(0);
	for (let i = 0; i < periodicTable.length; i++) {
	    for (let j = 0; j < periodicTable[i].isotopes.length; j++) {
		totalIndex += 1;
		if (totalIndex <= atomSelector.scroll * atomSelector.columns) continue;
		placed += 1;
		if (placed > atomSelector.max) continue;
		if (mouseX > x &&
		    mouseX < x + atomSelector.size &&
		    mouseY > y &&
		    mouseY < y + atomSelector.size) {
		    let atom = periodicTable[i]
		    currentAtom = {
			symbol: atom.symbol,
			A: atom.isotopes[j].A,
			Z: atom.Z,
			r: atom.r,
			c: atom.c,
			halfTime: atom.isotopes[j].halfTime,
			alpha: atom.isotopes[j].alpha,
			betaMin: atom.isotopes[j].betaMin,
			betaPlus: atom.isotopes[j].betaPlus,
			gamma: atom.isotopes[j].gamma,
		    };

		    console.log("clicked: (%d, %d)", i, j);
		    atomSelector.open = false;
		    return;
		}

		if (placed%atomSelector.columns === 0) {
		    y += atomSelector.size;
		    x = atomSelector.x + 3*padding;
		} else {
		    x += atomSelector.size;
		}
	    }
	}

	return;
    }

    if (mouseX > bar.x &&
	mouseX < bar.x + bar.w &&
	mouseY > bar.y &&
	mouseY < bar.y + bar.h) {
	if (isMouseOverButton(UIButtons, 2)) {
	    console.log("clicked button 2 (reset)");
	    resetGame();
	    return;
	}

	if (isMouseOverButton(UIButtons, 1)) {
	    console.log("clicked button 1 (pause/unpause)");
	    paused = !paused;
	    if (paused) {
		UIButtons[1].label = "Resume";
	    } else {
		UIButtons[1].label = "Pause";
	    }

	    updateUIButton(1);
	    return;
	}

	if (isMouseOverButton(UIButtons, 0)) {
	    console.log("clicked button 0 (homeMenu)");
	    homeMenu.open = true;
	    return;
	}

	return;
    }

    if (dragging) { return; }
    let atom = {
	symbol: currentAtom.symbol,
	A: currentAtom.A,
	Z: currentAtom.Z,
	r: currentAtom.r * 1e-12,
	c: currentAtom.c,
	halfTime: currentAtom.halfTime,
	alpha: currentAtom.alpha,
	betaMin: currentAtom.betaMin,
	betaPlus: currentAtom.betaPlus,
	gamma: currentAtom.gamma,
	x: (mouseX - centerX) * (scale*10**exponent) / stepSize,
	y: (centerY - mouseY) * (scale*10**exponent) / stepSize,
	vx: 0,
	vy: 0,
	ax: 0,
	ay: 0,
    };

    atoms.push(atom);
}

function mouseWheel(event) {
    if (homeMenu.open) return false;
    if (instructionsMenu.open) {

	return false;
    }

    if (mouseX > atomSelector.x &&
	mouseX < atomSelector.x + atomSelector.w &&
	mouseY > atomSelector.y &&
	mouseY < atomSelector.y + atomSelector.h) {

	let prev = atomSelector.scroll;
	(event.delta > 0) ? atomSelector.scroll += 1 : atomSelector.scroll -= 1;
	if (atomSelector.scroll < 0) atomSelector.scroll = 0;
	if (atomSelector.count - atomSelector.scroll*atomSelector.columns + atomSelector.columns-1 < atomSelector.max) atomSelector.scroll = prev;

	return false;
    }

    let oldPixelsPerUnit = stepSize / (scale*10**exponent);

    if (exponent < 3 && event.delta > 0) { scale *= 2};
    if (exponent > -15 && event.delta < 0) { scale /= 2};
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
    updateUIButtons();
}

function processGravity(dt) {
    for (let i = 0; i < atoms.length; i++) {
	let atomA = atoms[i];
	for (let j = 0; j < atoms.length; j++) {
	    if (i === j) { continue; }
	    let atomB = atoms[j];
	    let massB = atomB.A * physicsConstants.atomicMass; // convert mass in u to kg.

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

	    let a = physicsConstants.gravity * massB / (r**2) * physicsSettings.gravityMultiplier;
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

    if (distance === 0) return;
    let massA = (atomA.A * physicsConstants.atomicMass);
    let massB = (atomB.A * physicsConstants.atomicMass);
    let nx = dx / distance;
    let ny = dy / distance;

    atomB.ay += physicsConstants.spring * u / massB * ny;
    atomB.ax += physicsConstants.spring * u / massB * nx;
    atomA.ax -= physicsConstants.spring * u / massA * nx;
    atomA.ay -= physicsConstants.spring * u / massA * ny;
}

function updateDecayedAtom(atom) {
    const element = periodicTable[atom.Z - 1];

    if (!element) {
        console.warn(`Missing element data for Z = ${atom.Z}`);
        atom.halfTime = 0;
        atom.alpha = false;
	atom.betaMin = false;
	atom.betaPlus = false;
	atom.gamma = false;
        return false;
    }

    const isotope = element.isotopes.find(isotope => isotope.A === atom.A);
    if (!isotope) {
        console.log("Missing isotope for " + element.symbol);
        atom.halfTime = 0;
        atom.alpha = false;
	atom.betaMin = false;
	atom.betaPlus = false;
	atom.gamma = false;
        return false;
    }

    atom.symbol = element.symbol;
    atom.r = element.r * 1e-12;
    atom.c = element.c;
    atom.halfTime = isotope.halfTime;
    atom.alpha = isotope.alpha;
    atom.betaMin = isotope.betaMin;
    atom.betaPlus = isotope.betaPlus;
    atom.gamma = isotope.gamma;
    return true;
}

function spawnGamma(atom) {
    let randAngle = random(0, 2*PI);
    gamma.push({
	vx: physicsSettings.gammaSpeedMultiplier*physicsConstants.C*cos(randAngle),
	vy: physicsSettings.gammaSpeedMultiplier*physicsConstants.C*sin(randAngle),
	angle: randAngle,
	x: atom.x,
	y: atom.y,
	lambda: 10 * 1e-12,
    });
}

function processDecay(dt) {
    for (let i = 0; i < atoms.length; i++) {
	let atom = atoms[i];
	if (atom.halfTime === 0) continue;

	if (Math.random() < 1 - (0.5**(dt/atom.halfTime))) {
	    let randSpeed = random(0, 0.05*physicsConstants.C);
	    let randAngle = random(0, 2*PI);
	    if (atom.alpha) {
		atom.A -= 4;
		atom.Z -= 2;
		atoms.push({
		    A: 4,
		    Z: 2,
		    alpha: false,
		    beta: false,
		    halfTime: 0,
		    r: 28 * 1e-12,
		    c: "#00ff00",
		    symbol: "He",
		    vx: atom.vx + physicsSettings.alphaSpeedMultiplier*randSpeed*sin(randAngle),
		    vy: atom.vy + physicsSettings.alphaSpeedMultiplier*randSpeed*cos(randAngle),
		    ay: 0,
		    ax: 0,
		    x: atom.x,
		    y: atom.y,
		});

		console.log(randSpeed*sin(randAngle));
		if (atom.gamma) spawnGamma(atom);
		updateDecayedAtom(atom);
	    } else if (atom.betaMin) {
		atom.Z += 1;
		electrons.push({
		    x: atom.x,
		    y: atom.y,
		    vx: atom.vx + physicsSettings.betaSpeedMultiplier*randSpeed*sin(randAngle),
		    vy: atom.vy + physicsSettings.betaSpeedMultiplier*randSpeed*cos(randAngle),
		    ay: 0,
		    ax: 0,
		});

		if (atom.gamma) spawnGamma(atom);
		updateDecayedAtom(atom);
	    } else if (atom.betaPlus) {
		atom.Z -= 1;
		positrons.push({
		    x: atom.x,
		    y: atom.y,
		    vx: atom.vx + physicsSettings.betaSpeedMultiplier*randSpeed*sin(randAngle),
		    vy: atom.vy + physicsSettings.betaSpeedMultiplier*randSpeed*cos(randAngle),
		    ay: 0,
		    ax: 0,
		});

		if (atom.gamma) spawnGamma(atom);
		updateDecayedAtom(atom);
	    } else {
		console.log("BUG: the following atom decay type was unknown:");
		console.log(atom);
	    }
	}
    }
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

    // Radioactive decay.
    if (physicsOptions.checkBoxes[4].value) {
	processDecay(dt);
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
	for (let i = 0; i < electrons.length; i++) {
	    electrons[i].vx += electrons[i].ax * dt;
	    electrons[i].vy += electrons[i].ay * dt;
	    electrons[i].x += electrons[i].vx * dt;
	    electrons[i].y += electrons[i].vy * dt;
	}

	for (let i = 0; i < positrons.length; i++) {
	    positrons[i].vx += positrons[i].ax * dt;
	    positrons[i].vy += positrons[i].ay * dt;
	    positrons[i].x += positrons[i].vx * dt;
	    positrons[i].y += positrons[i].vy * dt;
	}

	for (let i = 0; i < gamma.length; i++) {
	    gamma[i].x += gamma[i].vx * dt;
	    gamma[i].y += gamma[i].vy * dt;
	}

	for (let i = 0; i < atoms.length; i++) {
	    atoms[i].vx += atoms[i].ax * dt;
	    atoms[i].vy += atoms[i].ay * dt;
	    atoms[i].x += atoms[i].vx * dt;
	    atoms[i].y += atoms[i].vy * dt;
	}
    }
}

function getUnit() {
    if (exponent > -18 && exponent <= -15) { return "pm"; }
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
    if (homeMenu.open) { return; }
    if (instructionsMenu.open) { return; }
    cursor.x += mouseX - pmouseX;
    cursor.y += mouseY - pmouseY;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
    dragging = true;
}

function keyTyped() {
    if (homeMenu.open) { return; }
    if (code === 'KeyR') {
	resetGame();
    }

    if (code === 'KeyP') {
	paused = !paused;
    }

    if (code === 'KeyZ') {
	atoms.pop();
    }
}

function keyPressed() {
    if (key === "Escape" || keyCode === 27) {
        if (instructionsMenu.open) {
            instructionsMenu.open = false;
            homeMenu.open = true;
        } else if (homeMenu.open) {
            homeMenu.open = false;
        } else if (atomSelector.open || physicsOptions.open) {
            atomSelector.open = false;
            physicsOptions.open = false;
        } else {
            homeMenu.open = true;
        }

        return false;
    }
}

function handleKeys() {
    if (keyIsDown(RETURN)) homeMenu.open = false;
    if (homeMenu.open) { return; }

    let panStep = cursorSpeed * deltaTime / 1000;
    if (keyIsDown('ArrowLeft') || keyIsDown('KeyA')) {
	cursor.x += panStep;
	centerX = offset.x + cursor.x;
    }

    if (keyIsDown('ArrowRight') || keyIsDown('KeyD')) {
	cursor.x -= panStep;
	centerX = offset.x + cursor.x;
    }

    if (keyIsDown('ArrowUp') || keyIsDown('KeyW')) {
	cursor.y += panStep;
	centerY = offset.y + cursor.y;
    }

    if (keyIsDown('ArrowDown') || keyIsDown('KeyS')) {
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
	let y = centerY - atom.y / (scale*10**exponent) * stepSize;
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
    textSize(24);
    noStroke();

    let scaleStatus = "scale = " + scale.toFixed(2) + getUnit();
    let atomStatus = "atoms = " + atoms.length;
    let fpsStatus = "fps = " + Math.round(frameRate());

    let scaleBounds = textBounds(scaleStatus, width/2, 0);
    let atomBounds = textBounds(atomStatus, width/2, 0);
    let fpsBounds = textBounds(fpsStatus, width/2, 0);

    bar.h = UIButtons[0].h + 2*padding;
    bar.w = UIButtons[0].w + scaleBounds.w + atomBounds.w + fpsBounds.w + UIButtons[1].w + UIButtons[2].w + 10*padding;
    bar.x = UIButtons[0].x - scaleBounds.w - 4*padding - UIButtons[1].w;
    let statusY = bar.y + bar.h / 2;

    fill("#32302F");
    rect(bar.x, bar.y, bar.w, bar.h);
    circle(bar.x, bar.h/2 + bar.y, bar.h);
    circle(bar.x+bar.w, bar.h/2 + bar.y, bar.h);
    fill("#EBDBB2");

    textAlign(LEFT, CENTER);
    text(scaleStatus, bar.x, statusY);
    text(atomStatus, UIButtons[2].x + UIButtons[2].w + 2 * padding, statusY);
    text(fpsStatus, UIButtons[2].x + UIButtons[2].w + atomBounds.w + 4 * padding, statusY);
    textAlign(LEFT, BASELINE);
    drawButton(UIButtons, 0);
    drawButton(UIButtons, 1);
    drawButton(UIButtons, 2);
}

function drawPhysicsOptions() {
    let button = UIButtons[4];
    physicsOptions.h = padding + button.h + padding + lineSize/2;
    physicsOptions.w = 0;
    for (let i = 0; i < physicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(physicsOptions.checkBoxes[i].label, 0, 0);
	physicsOptions.w = max(physicsOptions.w, bounds.w + 1.5 * padding + checkBoxSize) + padding;
    }

    physicsOptions.w = max(physicsOptions.w, 1.5 * padding + button.h/2 + button.w) + 2 * padding;
    for (let i = 0; i < physicsOptions.checkBoxes.length; i++) {
	let bounds = textBounds(physicsOptions.checkBoxes[i].label, 0, 0);
	physicsOptions.h += max(bounds.h, checkBoxSize) + padding;
    }

    physicsOptions.h += padding;
    physicsOptions.x = button.x - padding - button.h/2;
    physicsOptions.y = button.y - button.h;

    fill("#32302F");
    rect(physicsOptions.x, physicsOptions.y, physicsOptions.w, physicsOptions.h, 10);
    fill(127);
    rect(button.x, button.y + 2 * padding - lineSize/2, physicsOptions.w-4*padding, lineSize);

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
	fill("#EBDBB2");
	text(checkBox.label, checkBox.x + checkBoxSize + padding/2, checkBox.y + checkBoxSize/2);

	let bounds = textBounds(checkBox.label, 0, 0);
	y += max(bounds.h, checkBoxSize) + padding;
    }

    textAlign(LEFT, BASELINE);
}

function drawPhysicsSettings() {
    fill("#32302F");
    noStroke();

    let button = UIButtons[4];
    if (physicsOptions.open)  {
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

    drawButton(UIButtons, 4);
}

function drawAtomSelectorOpen() {
    fill("#32302F");
    noStroke();

    let button = UIButtons[3];
    let heading = button.h + 4*padding + lineSize
    atomSelector.max = floor((height - heading - 4*padding)/atomSelector.size) * atomSelector.columns;
    atomSelector.h = heading + 4*padding + Math.ceil(min(atomSelector.count, atomSelector.max)/atomSelector.columns) * atomSelector.size;
    atomSelector.w = max(button.w + button.h, atomSelector.columns*atomSelector.size) + 6*padding;
    atomSelector.x = width - atomSelector.w - 2*padding - button.h/2;
    atomSelector.y = button.y - button.h;
    rect(atomSelector.x, atomSelector.y, atomSelector.w, atomSelector.h, 10);
    fill(127);
    rect(atomSelector.x + 3*padding, button.y + 2 * padding - lineSize/2, atomSelector.columns*atomSelector.size, lineSize);

    let x = atomSelector.x + 3*padding;
    let y = button.y + 3 * padding + lineSize;
    let totalIndex = 0;
    let placed = 0;
    stroke(0);
    for (let i = 0; i < periodicTable.length; i++) {
	for (let j = 0; j < periodicTable[i].isotopes.length; j++) {
	    totalIndex += 1;
	    if (totalIndex <= atomSelector.scroll * atomSelector.columns) continue;
	    placed += 1;
	    if (placed > atomSelector.max) continue;
	    let atom = periodicTable[i].isotopes[j];
	    let txt = periodicTable[i].symbol + "-" + periodicTable[i].isotopes[j].A;
	    let bounds = textBounds(txt, 0, 0);
	    fill(periodicTable[i].c);
	    square(x, y, atomSelector.size);
	    fill(0);
	    text(txt, x + (atomSelector.size - bounds.w)/2, y + atomSelector.size -(atomSelector.size - bounds.h)/2);

	    if (placed%atomSelector.columns === 0) {
		y += atomSelector.size;
		x = atomSelector.x + 3*padding;
	    } else {
		x += atomSelector.size;
	    }
	}
    }

    drawButton(UIButtons, 3);
}

function drawAtomSelector() {
    fill("#32302F");
    noStroke();

    let button = UIButtons[3];
    if (atomSelector.open)  {
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

    drawButton(UIButtons, 3);
}

function drawHud() {
    drawStatusBar();
    drawPhysicsSettings();
    drawAtomSelector();
}

function drawHomeMenu() {
    fill("#EBDBB2BB");
    rect(0, 0, width,height);
    textSize(48);
    noStroke();

    let titleBounds = textBounds(homeMenu.title.label, 0, 0);
    textSize(32);
    let startBounds = textBounds(homeMenu.buttons[0].label, 0, 0);
    let instructionsBounds = textBounds(homeMenu.buttons[1].label, 0, 0);

    let totalHeight = titleBounds.h + 6*padding + startBounds.h + 6*padding + instructionsBounds.h + 6*padding + 2*3*padding;

    homeMenu.title.w = titleBounds.w + 6*padding + titleBounds.h;
    homeMenu.title.h = titleBounds.h + 6*padding;
    homeMenu.title.x = width/2 - homeMenu.title.w/2;
    homeMenu.title.y = height/2 - totalHeight/2;

    homeMenu.buttons[0].w = startBounds.w + 6*padding + startBounds.h;
    homeMenu.buttons[0].h = startBounds.h + 6*padding;
    homeMenu.buttons[0].x = width/2 - homeMenu.buttons[0].w/2;
    homeMenu.buttons[0].y = homeMenu.title.y + homeMenu.title.h + 2*padding;

    homeMenu.buttons[1].w = instructionsBounds.w + 6*padding + instructionsBounds.h;
    homeMenu.buttons[1].h = instructionsBounds.h + 6*padding;
    homeMenu.buttons[1].x = width/2 - homeMenu.buttons[1].w/2;
    homeMenu.buttons[1].y = homeMenu.buttons[0].y + homeMenu.buttons[0].h + 2*padding;

    fill("#32302F");
    rect(homeMenu.title.x, homeMenu.title.y - homeMenu.title.h + 3* padding, homeMenu.title.w, homeMenu.title.h);
    circle(homeMenu.title.x, homeMenu.title.y - homeMenu.title.h/2 + 3*padding, homeMenu.title.h);
    circle(homeMenu.title.x + homeMenu.title.w, homeMenu.title.y - homeMenu.title.h/2 + 3*padding, homeMenu.title.h);
    fill("#EBDBB2");
    textSize(48);
    fill("#CC241D");
    text(homeMenu.title.label, homeMenu.title.x + 6*padding, homeMenu.title.y-1.5*padding);

    textSize(32);
    noStroke();
    for (let i = 0; i < homeMenu.buttons.length; i++) {
	fill("#32302F");
	let button = homeMenu.buttons[i];
	rect(button.x, button.y - button.h + 3* padding, button.w, button.h);
	circle(button.x, button.y - button.h/2 + 3*padding, button.h);
	circle(button.x + button.w, button.y - button.h/2 + 3*padding, button.h);
	fill("#EBDBB2");
	if (mouseX > button.x - button.h/2 &&
	    mouseX < button.x + button.w + button.h/2 &&
	    mouseY > button.y -button.h + 3*padding &&
	    mouseY < button.y + 3*padding) {
	    fill("#98971A");
	} else {
	    fill("#EBDBB2");
	}

	text(button.label, button.x + 6*padding, button.y);
    }
}

function drawInstructionsMenu() {
    fill("#EBDBB2BB");
    rect(0, 0, width,height);
    noStroke();

    let instructionText = [
	"UI-elements:",
	"- left: settings menu for the physics engine.",
	"- right menu to select an atom to place.",
	"- middle bar with infomartion and the following buttons:",
	"  - left: A button to pause/resume the simulation.",
	"  - middle: A Home button to bring you to the main menu.",
	"  - right: A button to reset the simulation, but not your settings.",
	"",
	"Move around by:",
	"- Dragging the coordinateplane whiles holding down the left mouse button.",
	"- By using the W-, A-, S-, and D-keys.",
	"- By using the Arrow-keys.",
	"",
	"Miscellaneous:",
	"Place atoms by clicking with your left mouse button.",
	"Press z to undo the last placement.",
    ];

    let textHeight = 0;
    let textWidth = 0;
    textSize(16);
    let bBounds = textBounds("|", 0, 0);
    let maxH = bBounds.h;
    for (let i = 0; i < instructionText.length; i++) {
	if (instructionText[i] === "") {
	    textHeight += maxH + padding;
	} else {
	    let bounds = textBounds(instructionText[i], 0, 0);
	    textHeight += bounds.h + padding;
	    textWidth = max(textWidth, bounds.w);
	}
    }

    textSize(48);
    let titleBounds = textBounds(instructionsMenu.title.label, 0, 0);
    textSize(32);
    let startBounds = textBounds(instructionsMenu.button.label, 0, 0);
    let instructionsBounds = textBounds(instructionsMenu.button.label, 0, 0);
    let totalHeight = titleBounds.h + 6*padding + startBounds.h + 6*padding + instructionsBounds.h + 6*padding + 2*3*padding + textHeight;

    instructionsMenu.title.w = titleBounds.w + 6*padding + titleBounds.h;
    instructionsMenu.title.h = titleBounds.h + 6*padding;
    instructionsMenu.title.x = width/2 - instructionsMenu.title.w/2;
    instructionsMenu.title.y = height/2 - totalHeight/2;

    instructionsMenu.button.w = startBounds.w + 6*padding + startBounds.h;
    instructionsMenu.button.h = startBounds.h + 6*padding;
    instructionsMenu.button.x = width/2 - instructionsMenu.button.w/2;
    instructionsMenu.button.y = instructionsMenu.title.y + instructionsMenu.title.h + 2*padding;

    fill("#32302F");
    rect(instructionsMenu.title.x, instructionsMenu.title.y - instructionsMenu.title.h + 3* padding, instructionsMenu.title.w, instructionsMenu.title.h);
    circle(instructionsMenu.title.x, instructionsMenu.title.y - instructionsMenu.title.h/2 + 3*padding, instructionsMenu.title.h);
    circle(instructionsMenu.title.x + instructionsMenu.title.w, instructionsMenu.title.y - instructionsMenu.title.h/2 + 3*padding, instructionsMenu.title.h);
    fill("#EBDBB2");
    textSize(48);
    fill("#CC241D");
    text(instructionsMenu.title.label, instructionsMenu.title.x + 6*padding, instructionsMenu.title.y-1.5*padding);

    textSize(32);
    fill("#32302F");
    rect(instructionsMenu.button.x, instructionsMenu.button.y - instructionsMenu.button.h + 3* padding, instructionsMenu.button.w, instructionsMenu.button.h);
    circle(instructionsMenu.button.x, instructionsMenu.button.y - instructionsMenu.button.h/2 + 3*padding, instructionsMenu.button.h);
    circle(instructionsMenu.button.x + instructionsMenu.button.w, instructionsMenu.button.y - instructionsMenu.button.h/2 + 3*padding, instructionsMenu.button.h);
    fill("#EBDBB2");
    if (mouseX > instructionsMenu.button.x- instructionsMenu.button.h/2 &&
	mouseX < instructionsMenu.button.x + instructionsMenu.button.w + instructionsMenu.button.h/2 &&
	mouseY > instructionsMenu.button.y -instructionsMenu.button.h + 3*padding &&
	mouseY < instructionsMenu.button.y + 3*padding) {
	fill("#98971A");
    } else {
	fill("#EBDBB2");
    }

    text(instructionsMenu.button.label, instructionsMenu.button.x + 6*padding, instructionsMenu.button.y);

    textSize(16);
    fill("#32302F");
    let x = width/2 - textWidth/2;
    let y = instructionsMenu.button.y + 12*padding;
    rect(x-padding, y-padding, textWidth+2*padding,textHeight+2*padding, 10);

    fill("#EBDBB2");
    for (let i = 0; i < instructionText.length; i++) {
	if (instructionText[i] === "") {
	    y += maxH + padding;
	} else {
	    let bounds = textBounds(instructionText[i], 0, 0);
	    y += bounds.h + padding;
	    text(instructionText[i], x, y);
	}
    }
}

function drawElectrons() {
    for (let i = 0; i < electrons.length; i++) {
	let x = centerX + electrons[i].x / (scale*10**exponent) * stepSize;
	let y = centerY - electrons[i].y / (scale*10**exponent) * stepSize;
	let d = constrain(2*physicsConstants.elektronRadius * stepSize/(scale*10**exponent), minAtomDiamater, maxAtomDiamater);

	if (x + d/2 < 0 ||
	    x - d/2 > width ||
	    y + d/2 < 0 ||
	    y - d/2 > height) continue;

	fill(255,0,0);
	circle(x, y, d);
	let name = "e-";
	let size = 16;
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

function drawPositrons() {
    for (let i = 0; i < positrons.length; i++) {
	let x = centerX + positrons[i].x / (scale*10**exponent) * stepSize;
	let y = centerY - positrons[i].y / (scale*10**exponent) * stepSize;
	let d = constrain(2*physicsConstants.elektronRadius * stepSize/(scale*10**exponent), minAtomDiamater, maxAtomDiamater);

	if (x + d/2 < 0 ||
	    x - d/2 > width ||
	    y + d/2 < 0 ||
	    y - d/2 > height) continue;

	fill(255,0,0);
	circle(x, y, d);
	let name = "e+";
	let size = 16;
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

function drawGamma() {
    for (let i = 0; i < gamma.length; i++) {
	let x = centerX + gamma[i].x / (scale*10**exponent) * stepSize;
	let y = centerY - gamma[i].y / (scale*10**exponent) * stepSize;

	let lineLength = gamma[i].lambda / (scale*10**exponent) * stepSize;
	let dx = cos(gamma[i].angle) * lineLength/2;
        let dy = -sin(gamma[i].angle) * lineLength/2;

        if (x < -lineLength ||
	    x > width + lineLength ||
	    y < -lineLength ||
	    y > height + lineLength)  continue;

	stroke(127);
	strokeWeight(3);
	line(x-dx, y-dy, x+dx, y+dy);
	strokeWeight(1);
    }
}

function draw() {
    background("#EBDBB2");
    fill(128, 255, 128);
    handleKeys();
    if (!paused && !homeMenu.open && !instructionsMenu.open) processPhysics();
    drawCoordinatePlane();
    drawAtoms();
    drawElectrons();
    drawPositrons();
    drawGamma();
    if (!homeMenu.open && !instructionsMenu.open) drawHud();
    if (homeMenu.open) drawHomeMenu();
    if (instructionsMenu.open) drawInstructionsMenu();
}
