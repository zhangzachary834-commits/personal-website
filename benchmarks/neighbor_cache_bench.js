const nodes = [];
const edges = [];
for (let i = 0; i < 100; i++) {
    const node = { id: i, neighbors: new Set() };
    nodes.push(node);
}

for (let i = 0; i < 300; i++) {
    const s = nodes[Math.floor(Math.random() * nodes.length)];
    const t = nodes[Math.floor(Math.random() * nodes.length)];
    edges.push({ source: s, target: t });
    s.neighbors.add(t);
    t.neighbors.add(s);
}

function baselineIsNeighbor(a, b) {
    if (a === b) return true;
    return edges.some(e => (e.source === a && e.target === b) || (e.source === b && e.target === a));
}

function optimizedIsNeighbor(a, b) {
    if (a === b) return true;
    return a.neighbors && a.neighbors.has(b);
}

console.log("Warming up...");
baselineIsNeighbor(nodes[0], nodes[1]);
optimizedIsNeighbor(nodes[0], nodes[1]);

console.time("Baseline");
for (let i = 0; i < 100000; i++) {
    const a = nodes[i % nodes.length];
    const b = nodes[(i + 5) % nodes.length];
    baselineIsNeighbor(a, b);
}
console.timeEnd("Baseline");

console.time("Optimized");
for (let i = 0; i < 100000; i++) {
    const a = nodes[i % nodes.length];
    const b = nodes[(i + 5) % nodes.length];
    optimizedIsNeighbor(a, b);
}
console.timeEnd("Optimized");
