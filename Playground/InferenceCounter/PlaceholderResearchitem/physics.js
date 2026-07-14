// physics.js — smooth global phase, octave morphing, number resonance
// ES6 module, pure logic, no DOM, no PIXI

// ------------------------------------------------------------
// INTERNAL STATE
// ------------------------------------------------------------
let theta = 0;          // global phase in [0,1)
let resolutionExp = 1;  // R in {1,2,3,4}
let speedScalar = 0.5;  // slider 0..1

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
function clamp01(x) {
    return Math.min(1, Math.max(0, x));
}

function getN(R) {
    return Math.pow(4, R); // 4^R
}

function getSide(R) {
    return Math.pow(2, R); // 2^R
}

// Map slider [0,1] to phase velocity v
function speedFromSlider(s) {
    const minV = 0.01;   // very slow
    const maxV = 1.20;   // very fast
    return minV + (maxV - minV) * clamp01(s);
}

// ------------------------------------------------------------
// PUBLIC API
// ------------------------------------------------------------

// Advance global phase by dt
// If θ wraps, advance resolution R smoothly
export function update(dt) {
    const v = speedFromSlider(speedScalar);
    const oldTheta = theta;

    theta = (theta + v * dt) % 1;

    // Detect wrap-around
    if (theta < oldTheta) {
        // Advance resolution (octave morph)
        resolutionExp++;
        if (resolutionExp > 4) resolutionExp = 1;
    }
}

// Scroll wheel shifts θ directly (not resolution)
export function scrollPhase(deltaY) {
    const shift = deltaY * 0.0005; // sensitivity
    theta = (theta + shift + 1) % 1;
}

// Set speed slider in [0,1]
export function setSpeedSlider(s) {
    speedScalar = clamp01(s);
}

// Jump to a specific number index, preserving local phase
export function jumpToNumber(targetIndex) {
    const N = getN(resolutionExp);
    if (N <= 0) return;

    const x = theta * N;
    const currentIndex = Math.floor(x);
    const localPhase = x - currentIndex;

    const k = Math.max(0, Math.min(N - 1, targetIndex));
    const newTheta = (k + localPhase) / N;

    theta = newTheta % 1;
}

// ------------------------------------------------------------
// STATE QUERY
// ------------------------------------------------------------
export function getState() {
    const R = resolutionExp;
    const N = getN(R);
    const side = getSide(R);

    const x = theta * N;
    const index = Math.floor(x) % N;
    const localPhase = x - index;

    const i = Math.floor(index / side);
    const j = index % side;

    const u = (j + 0.5) / side;
    const v = (i + 0.5) / side;

    return {
        theta,
        resolutionExp: R,
        N,
        side,
        index,
        localPhase,
        gridI: i,
        gridJ: j,
        normX: u,
        normY: v,
        speedScalar
    };
}
