const stars = [];
const count = 1000;
const w = 1920;
const h = 1080;

for (let i = 0; i < count; i++) {
    stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        pulseEnergy: 0,
        pulseTarget: 0,
        pulseState: 0,
        pulseJumps: 0,
        pulseHue: 0,
        orbitOffset: Math.random() * Math.PI * 2,
    });
}

function renderConnectionsBaseline(w, cascadeParams) {
    const { cascadeHueShift, cascadeSat, cascadeLit } = cascadeParams;
    let distChecks = 0;
    let validPairs = 0;
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const a = stars[i];
            const b = stars[j];
            distChecks++;
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            const maxDist = w > 768 ? 160 : 100;

            if (dist < maxDist) {
                validPairs++;
            }
        }
    }
    return { distChecks, validPairs };
}

function renderConnectionsOptimized(w, cascadeParams) {
    const { cascadeHueShift, cascadeSat, cascadeLit } = cascadeParams;
    let distChecks = 0;
    let validPairs = 0;

    const maxDist = w > 768 ? 160 : 100;
    const cellSize = maxDist;
    const grid = new Map();

    for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const col = Math.floor(s.x / cellSize);
        const row = Math.floor(s.y / cellSize);
        const key = `${col},${row}`;

        if (!grid.has(key)) {
            grid.set(key, []);
        }
        grid.get(key).push(i);
    }

    for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const col = Math.floor(a.x / cellSize);
        const row = Math.floor(a.y / cellSize);

        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                const key = `${col + dc},${row + dr}`;
                const cellStars = grid.get(key);
                if (cellStars) {
                    for (let k = 0; k < cellStars.length; k++) {
                        const j = cellStars[k];
                        if (j > i) {
                            const b = stars[j];
                            distChecks++;
                            const dist = Math.hypot(a.x - b.x, a.y - b.y);

                            if (dist < maxDist) {
                                validPairs++;
                            }
                        }
                    }
                }
            }
        }
    }
    return { distChecks, validPairs };
}

console.log("Warming up...");
renderConnectionsBaseline(w, { cascadeHueShift: 1, cascadeSat: 1, cascadeLit: 1 });
renderConnectionsOptimized(w, { cascadeHueShift: 1, cascadeSat: 1, cascadeLit: 1 });

console.time("Baseline");
for (let i = 0; i < 100; i++) renderConnectionsBaseline(w, { cascadeHueShift: 1, cascadeSat: 1, cascadeLit: 1 });
console.timeEnd("Baseline");

console.time("Optimized");
for (let i = 0; i < 100; i++) renderConnectionsOptimized(w, { cascadeHueShift: 1, cascadeSat: 1, cascadeLit: 1 });
console.timeEnd("Optimized");

const resB = renderConnectionsBaseline(w, { cascadeHueShift: 1, cascadeSat: 1, cascadeLit: 1 });
const resO = renderConnectionsOptimized(w, { cascadeHueShift: 1, cascadeSat: 1, cascadeLit: 1 });
console.log("Baseline checks:", resB.distChecks, "Valid pairs:", resB.validPairs);
console.log("Optimized checks:", resO.distChecks, "Valid pairs:", resO.validPairs);
