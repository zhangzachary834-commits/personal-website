const maxDist = 160;
const w = 1920;
const h = 1080;
const stars = [];
for (let i = 0; i < 2000; i++) {
    stars.push({ x: Math.random() * w, y: Math.random() * h });
}

function getGridCoords(star) {
    return {
        col: Math.floor(star.x / maxDist),
        row: Math.floor(star.y / maxDist)
    };
}

function stringMap() {
    const grid = new Map();
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const { col, row } = getGridCoords(star);
        const key = col + "," + row;
        let cell = grid.get(key);
        if (!cell) { cell = []; grid.set(key, cell); }
        cell.push(i);
    }

    let checks = 0;
    for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const { col, row } = getGridCoords(a);
        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                const cell = grid.get((col + dc) + "," + (row + dr));
                if (cell) checks += cell.length;
            }
        }
    }
    return checks;
}

function intMap() {
    const grid = new Map();
    const COLS = 10000;
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const { col, row } = getGridCoords(star);
        const key = col + row * COLS;
        let cell = grid.get(key);
        if (!cell) { cell = []; grid.set(key, cell); }
        cell.push(i);
    }

    let checks = 0;
    for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const { col, row } = getGridCoords(a);
        for (let dc = -1; dc <= 1; dc++) {
            for (let dr = -1; dr <= 1; dr++) {
                const cell = grid.get((col + dc) + (row + dr) * COLS);
                if (cell) checks += cell.length;
            }
        }
    }
    return checks;
}

const iters = 200;

console.time("stringMap");
for (let i=0; i<iters; i++) stringMap();
console.timeEnd("stringMap");

console.time("intMap");
for (let i=0; i<iters; i++) intMap();
console.timeEnd("intMap");
