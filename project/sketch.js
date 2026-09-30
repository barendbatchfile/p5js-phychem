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
let textPadding = 5;

function setup() {
    createCanvas(windowWidth, windowHeight);
    offset.x = width / 2;
    offset.y = height / 2;
    centerX = offset.x + cursor.x;
    centerY = offset.y + cursor.y;
}

function mouseWheel(event) {
    if (exponent < 3 && event.delta > 0) { scale *= 10};
    if (exponent > -20 && event.delta < 0) { scale /= 10};
    if (scale <= 0) { scale = 0.1; }
    if (scale >= 10) { scale /= 10; exponent += 1; }
    if (scale < 0.1) { scale *= 10; exponent -= 1; }
    stepSize = markDist / scale;
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    offset.x = width / 2;
    offset.y = height / 2;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
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
    if (exponent >= 1 && exponent < 2) { return "dem"; }
    if (exponent >= 2 && exponent < 3) { return "hm"; }
    if (exponent >= 3) { return "km"; }
}

function mouseDragged() {
    cursor.x += mouseX - pmouseX;
    cursor.y += mouseY - pmouseY;
    centerY = offset.y + cursor.y;
    centerX = offset.x + cursor.x;
}

function keyTyped() {
    if (key === 'r') {
	cursor.x = 0;
	cursor.y = 0;
	centerY = offset.y + cursor.y;
	centerX = offset.x + cursor.x;
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
    textSize(16);

    for (let i = minMarkX; i <= maxMarkX; i++) {
        let x = centerX + i * stepSize;
        rect(x, 0, lineSize, height);

        let txt = i + getUnit();
        let bounds = textBounds(txt, x, centerY);
        text(txt, x + textPadding, centerY - bounds.h - textPadding);
    }

    for (let i = minMarkY; i <= maxMarkY; i++) {
        let y = centerY - i * stepSize;
        rect(0, y, width, lineSize);

        let txt = i + getUnit();
        let bounds = textBounds(txt, centerX, y);
        text(txt, centerX + textPadding, y - bounds.h - textPadding);
    }

    rect(centerX - lineSize, 0, 2 * lineSize, height);
    rect(0, centerY - lineSize, width, 2 * lineSize);
}

function draw() {
    background(255);
    fill(128, 255, 128);
    handleKeys();
    drawCoordinatePlane();
}
