// main.js — hybrid inference renderer + physics integration
// ES6 module

import * as physics from './physics.js';
import * as inference from './inference.js';

// ------------------------------------------------------------
// DOM REFERENCES
// ------------------------------------------------------------
const infoBox = document.getElementById('info');
const slider = document.getElementById('speed-slider');
const resLabel = document.getElementById('resolution-label');

// ------------------------------------------------------------
// PIXI SETUP
// ------------------------------------------------------------
const app = new PIXI.Application({
    resizeTo: document.getElementById('widget'),
    background: '#050608',
    antialias: true
});
document.getElementById('widget').appendChild(app.view);

const stage = app.stage;

// Layers
const gridLayer = new PIXI.Graphics();
const frameLayer = new PIXI.Graphics();
const circleLayer = new PIXI.Graphics();
const inferenceLayer = new PIXI.Graphics(); // hybrid wavefield

stage.addChild(inferenceLayer);
stage.addChild(gridLayer);
stage.addChild(frameLayer);
stage.addChild(circleLayer);

// ------------------------------------------------------------
// LAYOUT
// ------------------------------------------------------------
let squareSize = 0;
let squareX = 0;
let squareY = 0;

function layout() {
    const w = app.renderer.width;
    const h = app.renderer.height;

    const margin = 40;
    squareSize = Math.min(w, h) - margin * 2;
    squareX = (w - squareSize) / 2;
    squareY = (h - squareSize) / 2;
}
window.addEventListener('resize', layout);

// ------------------------------------------------------------
// HYBRID INFERENCE WAVEFIELD
// ------------------------------------------------------------
function renderInferenceField(state) {
    const { side, theta, localPhase, index, N } = state;

    const cell = squareSize / side;

    inferenceLayer.clear();

    for (let i = 0; i < side; i++) {
        for (let j = 0; j < side; j++) {

            // Soft wavefield
            const w1 = Math.sin(2 * Math.PI * (theta + (i + j) / (2 * side)));

            // Interference pattern
            const w2 = Math.sin(2 * Math.PI * (localPhase + i / side)) *
                       Math.sin(2 * Math.PI * (index / N + j / side));

            // Vector field magnitude (phase gradient)
            const vx = Math.cos(2 * Math.PI * (theta + (i + j) / side));
            const vy = Math.sin(2 * Math.PI * (theta + (i + j) / side));
            const vmag = Math.sqrt(vx * vx + vy * vy);

            // Composite color
            const r = 0.5 + 0.5 * w1;
            const g = 0.5 + 0.5 * Math.abs(w2);
            const b = 0.3 + 0.7 * vmag;

            const color = PIXI.utils.rgb2hex([r, g, b]);

            const x = squareX + j * cell;
            const y = squareY + i * cell;

            inferenceLayer.beginFill(color, 0.35);
            inferenceLayer.drawRect(x, y, cell, cell);
            inferenceLayer.endFill();

            // Vector arrows (subtle)
            const cx = x + cell / 2;
            const cy = y + cell / 2;
            const arrowLen = cell * 0.25;

            inferenceLayer.lineStyle(1, 0x88ffff, 0.4);
            inferenceLayer.moveTo(cx, cy);
            inferenceLayer.lineTo(cx + vx * arrowLen, cy + vy * arrowLen);
        }
    }
}

// ------------------------------------------------------------
// GRID + FRAME + CIRCLE
// ------------------------------------------------------------
function renderGrid(state) {
    const { side } = state;
    const cell = squareSize / side;

    gridLayer.clear();
    gridLayer.lineStyle(1, 0x333333, 1);

    for (let i = 0; i <= side; i++) {
        const y = squareY + i * cell;
        gridLayer.moveTo(squareX, y);
        gridLayer.lineTo(squareX + squareSize, y);
    }
    for (let j = 0; j <= side; j++) {
        const x = squareX + j * cell;
        gridLayer.moveTo(x, squareY);
        gridLayer.lineTo(x, squareY + squareSize);
    }
}

function renderFrameBox(state) {
    const { index, side } = state;
    const cell = squareSize / side;

    const i = Math.floor(index / side);
    const j = index % side;

    const x = squareX + j * cell;
    const y = squareY + i * cell;

    frameLayer.clear();
    frameLayer.lineStyle(2, 0x88ffff, 0.9);
    frameLayer.drawRect(x, y, cell, cell);
}

function renderCircle(state) {
    const { normX, normY, localPhase } = state;

    const cx = squareX + normX * squareSize;
    const cy = squareY + normY * squareSize;

    const baseR = squareSize * 0.03;
    const pulse = 0.5 + 0.5 * Math.sin(localPhase * Math.PI * 2);
    const r = baseR * (0.7 + 0.6 * pulse);

    circleLayer.clear();
    circleLayer.lineStyle(2, 0xff4444, 1);
    circleLayer.beginFill(0xff0000, 0.4);
    circleLayer.drawCircle(cx, cy, r);
    circleLayer.endFill();
}

// ------------------------------------------------------------
// INFO BOX
// ------------------------------------------------------------
function renderInfo(state) {
    const { resolutionExp, N } = state;
    resLabel.textContent = `R = ${resolutionExp} (N = ${N})`;
    infoBox.innerHTML = inference.describe(state);
}

// ------------------------------------------------------------
// INPUT: SCROLL → PHASE SHIFT
// ------------------------------------------------------------
document.addEventListener('wheel', (e) => {
    physics.scrollPhase(e.deltaY);
});

// ------------------------------------------------------------
// INPUT: SPEED SLIDER
// ------------------------------------------------------------
slider.addEventListener('input', () => {
    physics.setSpeedSlider(parseFloat(slider.value));
});

// ------------------------------------------------------------
// INPUT: CLICK TO SELECT NUMBER
// ------------------------------------------------------------
app.view.addEventListener('pointerdown', (e) => {
    const rect = app.view.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const state = physics.getState();
    const { side } = state;
    const cell = squareSize / side;

    if (
        x < squareX || x > squareX + squareSize ||
        y < squareY || y > squareY + squareSize
    ) return;

    const j = Math.floor((x - squareX) / cell);
    const i = Math.floor((y - squareY) / cell);
    const k = i * side + j;

    physics.jumpToNumber(k);
});

// ------------------------------------------------------------
// MAIN LOOP
// ------------------------------------------------------------
app.ticker.add((delta) => {
    physics.update(delta / 60);

    const state = physics.getState();

    renderInferenceField(state);
    renderGrid(state);
    renderFrameBox(state);
    renderCircle(state);
    renderInfo(state);
});

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
layout();
slider.value = 0.5;
physics.setSpeedSlider(0.5);
