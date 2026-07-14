// inference.js — hybrid inference: wave mechanics + Spireason + optics
// ES6 module, pure logic

function f6(x) {
    return Number.isFinite(x) ? x.toFixed(6) : "—";
}

// ------------------------------------------------------------
// HYBRID WAVEFIELD GENERATOR
// ------------------------------------------------------------
//
// This function computes the hybrid inference pattern for a given
// resolution and phase state. main.js uses this to draw the
// background behind the text box.
//
// It returns a 2D array of objects:
//   { r, g, b, vx, vy }
//
// where:
//   - r,g,b are floats 0..1 (color channels)
//   - vx,vy are vector field components
//
export function generateWavefield(state) {
    const { side, theta, localPhase, index, N } = state;

    const field = [];
    for (let i = 0; i < side; i++) {
        field[i] = [];
        for (let j = 0; j < side; j++) {

            // ------------------------------------------------------------
            // 1. Soft wavefield (carrier)
            // ------------------------------------------------------------
            const w1 = Math.sin(2 * Math.PI * (theta + (i + j) / (2 * side)));

            // ------------------------------------------------------------
            // 2. Interference pattern (octave harmonics)
            // ------------------------------------------------------------
            const w2 =
                Math.sin(2 * Math.PI * (localPhase + i / side)) *
                Math.sin(2 * Math.PI * (index / N + j / side));

            // ------------------------------------------------------------
            // 3. Vector field (phase gradient)
            // ------------------------------------------------------------
            const phase = theta + (i + j) / side;
            const vx = Math.cos(2 * Math.PI * phase);
            const vy = Math.sin(2 * Math.PI * phase);
            const vmag = Math.sqrt(vx * vx + vy * vy);

            // ------------------------------------------------------------
            // 4. Composite color
            // ------------------------------------------------------------
            const r = 0.5 + 0.5 * w1;
            const g = 0.5 + 0.5 * Math.abs(w2);
            const b = 0.3 + 0.7 * vmag;

            field[i][j] = { r, g, b, vx, vy };
        }
    }

    return field;
}

// ------------------------------------------------------------
// MEANING TEXT GENERATOR
// ------------------------------------------------------------
export function describe(state) {
    const {
        theta,
        resolutionExp,
        N,
        index,
        localPhase,
        normX,
        normY,
        speedScalar
    } = state;

    const R = resolutionExp;
    const octaveName = `octave ${R}`;
    const freq = N;
    const phasesPerNumberApprox = (speedScalar * 60) / N;

    // ------------------------------------------------------------
    // Scientific wave mechanics
    // ------------------------------------------------------------
    const waveSection = `
        <b>Wave mechanics</b><br>
        Carrier phase θ = ${f6(theta)}<br>
        Local phase φ = ${f6(localPhase)}<br>
        Resolution R = ${R} (N = ${N}, ${octaveName})<br>
        Frequency ≈ ${freq} segments per cycle<br>
        Resonance index k = ${index}<br>
        Position ≈ (${f6(normX)}, ${f6(normY)}) in the square<br>
        Effective phases per number ≈ ${f6(phasesPerNumberApprox)}
    `;

    // ------------------------------------------------------------
    // Spireason resonance meaning
    // ------------------------------------------------------------
    const spireasonSection = `
        <b>Spireason resonance</b><br>
        A single carrier phase θ threads through all resolutions. Changing R
        does not break time; it only refines how many distinct identities (k)
        share that same phase. Each number is a local standing wave, a moment
        where cause, effect, and goal briefly coincide.<br><br>
        When you change the number, φ is preserved: identity jumps, but the
        resonance stays smooth. This is octave self‑correspondence: the same
        moment in the wave reappears in a different discrete label, like the
        same chord played in a higher register.
    `;

    // ------------------------------------------------------------
    // Optics / navigation metaphor
    // ------------------------------------------------------------
    const opticsSection = `
        <b>Optics & navigation</b><br>
        The square behaves like a calm sea at night. The carrier phase θ is the
        slow turning of the sky; the grid is your chart; the red circle is a
        lighthouse reflection moving across the water. Changing resolution is
        like changing magnification: the coastline becomes more detailed, but
        the bearing to the lighthouse does not change.<br><br>
        At high speed, many ripples pass under the boat while the coastline
        drifts slowly: quantum‑like flicker with stable landmarks. At low
        speed, each landmark (number) is visited with many gentle wavelets,
        like counting sheep by the rhythm of the swell.
    `;

    return `
        <div style="margin-bottom:6px;">
            ${waveSection}
        </div>
        <div style="margin-bottom:6px;">
            ${spireasonSection}
        </div>
        <div>
            ${opticsSection}
        </div>
    `;
}
