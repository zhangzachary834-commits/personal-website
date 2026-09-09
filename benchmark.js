const fs = require('fs');
let nodes = [];
for (let i = 0; i < 5000; i++) {
    nodes.push({ x: Math.random() * 5000, y: Math.random() * 5000, vx: 0, vy: 0 });
}
const repulsion = 2400;

// BASELINE
let start = performance.now();
for (let k = 0; k < 60; k++) {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const n1 = nodes[i];
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distSq = dx * dx + dy * dy || 1;
            if (distSq < 48000) {
                const force = repulsion / distSq;
                const dist = Math.sqrt(distSq);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                n1.vx -= fx; n1.vy -= fy;
                n2.vx += fx; n2.vy += fy;
            }
        }
    }
}
let end = performance.now();
const baselineTime = end - start;
console.log('Baseline 60 frames:', baselineTime.toFixed(2), 'ms');

nodes.forEach(n => { n.vx = 0; n.vy = 0; });

// OPTIMIZED
start = performance.now();
for (let k = 0; k < 60; k++) {
    const CELL_SIZE = 220; // Slightly larger than sqrt(48000) ~ 219.09
    const grid = new Map();

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const cx = Math.floor(node.x / CELL_SIZE);
        const cy = Math.floor(node.y / CELL_SIZE);
        const key = cx + ',' + cy;
        let cell = grid.get(key);
        if (!cell) {
            cell = [];
            grid.set(key, cell);
        }
        cell.push(node);
    }

    for (const [key, cellNodes] of grid.entries()) {
        const commaIndex = key.indexOf(',');
        const cx = parseInt(key.substring(0, commaIndex));
        const cy = parseInt(key.substring(commaIndex + 1));

        // Check against same cell and 4 neighboring cells to avoid double counting
        const neighbors = [
            [cx, cy],
            [cx + 1, cy],
            [cx - 1, cy + 1],
            [cx, cy + 1],
            [cx + 1, cy + 1]
        ];

        for (let i = 0; i < cellNodes.length; i++) {
            const n1 = cellNodes[i];

            for (let nIdx = 0; nIdx < neighbors.length; nIdx++) {
                const nx = neighbors[nIdx][0];
                const ny = neighbors[nIdx][1];
                const neighborKey = nx + ',' + ny;
                const neighborNodes = grid.get(neighborKey);

                if (neighborNodes) {
                    const isSameCell = (nx === cx && ny === cy);
                    const startIndex = isSameCell ? i + 1 : 0;

                    for (let j = startIndex; j < neighborNodes.length; j++) {
                        const n2 = neighborNodes[j];
                        const dx = n2.x - n1.x;
                        const dy = n2.y - n1.y;
                        const distSq = dx * dx + dy * dy || 1;
                        if (distSq < 48000) {
                            const force = repulsion / distSq;
                            const dist = Math.sqrt(distSq);
                            const fx = (dx / dist) * force;
                            const fy = (dy / dist) * force;
                            n1.vx -= fx; n1.vy -= fy;
                            n2.vx += fx; n2.vy += fy;
                        }
                    }
                }
            }
        }
    }
}
end = performance.now();
const optimizedTime = end - start;
console.log('Optimized 60 frames:', optimizedTime.toFixed(2), 'ms');
console.log('Speedup:', (baselineTime / optimizedTime).toFixed(2) + 'x');
