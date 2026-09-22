const grid = new Map();
for (let i = 0; i < 1000; i++) {
    grid.set(i * 10, [1, 2, 3, 4, 5]);
}

function baseline() {
    let sum = 0;
    for (const [key, cellNodes] of grid.entries()) {
        const neighborKeys = [
            key - 10001, key - 10000, key - 9999,
            key - 1, key, key + 1,
            key + 9999, key + 10000, key + 10001
        ];
        for (let i = 0; i < neighborKeys.length; i++) {
            sum += neighborKeys[i];
        }
    }
    return sum;
}

const offsets = [
    -10001, -10000, -9999,
    -1, 0, 1,
    9999, 10000, 10001
];
function optimized() {
    let sum = 0;
    for (const [key, cellNodes] of grid.entries()) {
        for (let i = 0; i < offsets.length; i++) {
            sum += key + offsets[i];
        }
    }
    return sum;
}

const startBase = performance.now();
for (let k = 0; k < 60 * 100; k++) {
    baseline();
}
const endBase = performance.now();
console.log('Baseline 6000 frames:', (endBase - startBase).toFixed(2), 'ms');

const startOpt = performance.now();
for (let k = 0; k < 60 * 100; k++) {
    optimized();
}
const endOpt = performance.now();
console.log('Optimized 6000 frames:', (endOpt - startOpt).toFixed(2), 'ms');
console.log('Speedup:', ((endBase - startBase) / (endOpt - startOpt)).toFixed(2) + 'x');
