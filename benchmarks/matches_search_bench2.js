const { performance } = require('perf_hooks');

const nodes = [];
for (let i = 0; i < 5000; i++) {
    nodes.push({
        title: `Node title ${i} with React`,
        subtitle: `Subtitle of ${i}`,
        seriesLabel: i % 2 === 0 ? `Series ${i} nodejs` : undefined,
        concepts: [`Concept ${i}`, i % 3 === 0 ? 'performance' : 'design']
    });
}

let searchQuery = 'performance';

function baselineMatchesSearch(node) {
    if (!searchQuery) return false;
    return node.title.toLowerCase().includes(searchQuery) ||
           node.subtitle.toLowerCase().includes(searchQuery) ||
           (node.seriesLabel && node.seriesLabel.toLowerCase().includes(searchQuery)) ||
           (node.concepts && node.concepts.some(c => c.toLowerCase().includes(searchQuery)));
}

let start = performance.now();
let baselineMatches = 0;
for (let k = 0; k < 60; k++) {
    for (let i = 0; i < nodes.length; i++) {
        if (baselineMatchesSearch(nodes[i])) baselineMatches++;
    }
}
let end = performance.now();
const baselineTime = end - start;
console.log('Baseline 60 frames:', baselineTime.toFixed(2), 'ms', 'matches:', baselineMatches);

function optMatchesSearch(node) {
    if (!searchQuery) return false;

    // Avoid creating new strings or arrays inline
    // We already have lowercase values in the node
    if (node._titleLower && node._titleLower.includes(searchQuery)) return true;
    if (node._subtitleLower && node._subtitleLower.includes(searchQuery)) return true;
    if (node._seriesLabelLower && node._seriesLabelLower.includes(searchQuery)) return true;

    if (node._conceptsLower) {
        for (let j=0; j < node._conceptsLower.length; j++) {
             if (node._conceptsLower[j].includes(searchQuery)) return true;
        }
    }
    return false;
}

// Precompute strings
for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node._titleLower = node.title.toLowerCase();
    node._subtitleLower = node.subtitle.toLowerCase();
    if (node.seriesLabel) node._seriesLabelLower = node.seriesLabel.toLowerCase();
    if (node.concepts) {
        node._conceptsLower = [];
        for(let j=0; j<node.concepts.length; j++) {
            node._conceptsLower.push(node.concepts[j].toLowerCase());
        }
    }
}

start = performance.now();
let optMatches = 0;
for (let k = 0; k < 60; k++) {
    for (let i = 0; i < nodes.length; i++) {
        if (optMatchesSearch(nodes[i])) optMatches++;
    }
}
end = performance.now();
const optimizedTime = end - start;
console.log('Optimized 60 frames:', optimizedTime.toFixed(2), 'ms', 'matches:', optMatches);
console.log('Speedup:', (baselineTime / optimizedTime).toFixed(2) + 'x');
