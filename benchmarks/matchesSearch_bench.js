function matchesSearchBase(node, searchQuery) {
    if (!searchQuery) return false;
    return (node._titleLower && node._titleLower.includes(searchQuery)) ||
           (node._subtitleLower && node._subtitleLower.includes(searchQuery)) ||
           (node._seriesLabelLower && node._seriesLabelLower.includes(searchQuery)) ||
           (node._conceptsLower && node._conceptsLower.some(c => c.includes(searchQuery)));
}

function matchesSearchOpt(node, searchQuery) {
    if (!searchQuery) return false;
    if (node._titleLower && node._titleLower.includes(searchQuery)) return true;
    if (node._subtitleLower && node._subtitleLower.includes(searchQuery)) return true;
    if (node._seriesLabelLower && node._seriesLabelLower.includes(searchQuery)) return true;
    if (node._conceptsLower) {
        const concepts = node._conceptsLower;
        for (let i = 0; i < concepts.length; i++) {
            if (concepts[i].includes(searchQuery)) return true;
        }
    }
    return false;
}

const node1 = {
    _titleLower: "some long title of the node",
    _subtitleLower: "subtitle info here",
    _seriesLabelLower: "series one",
    _conceptsLower: ["concept1", "concept2", "concept3", "concept4", "concept5", "searchterm"]
};

const node2 = {
    _titleLower: "short title",
    _conceptsLower: ["c1", "c2"]
};

const nodes = Array(1000).fill(node1).concat(Array(1000).fill(node2));
const query = "searchterm";

const startBase = performance.now();
for (let k = 0; k < 60 * 100; k++) {
    for (let i = 0; i < nodes.length; i++) {
        matchesSearchBase(nodes[i], query);
    }
}
const endBase = performance.now();
console.log('Baseline 6000 frames:', (endBase - startBase).toFixed(2), 'ms');

const startOpt = performance.now();
for (let k = 0; k < 60 * 100; k++) {
    for (let i = 0; i < nodes.length; i++) {
        matchesSearchOpt(nodes[i], query);
    }
}
const endOpt = performance.now();
console.log('Optimized 6000 frames:', (endOpt - startOpt).toFixed(2), 'ms');
console.log('Speedup:', ((endBase - startBase) / (endOpt - startOpt)).toFixed(2) + 'x');
