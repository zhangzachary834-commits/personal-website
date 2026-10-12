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
    // By precomputing a single concatenated string for each node during graph construction,
    // we can avoid multiple string concatenations, lowercasing, and array iterations per node per frame.
    // Let's assume we precompute `node._searchString` = (title + ' ' + subtitle + ' ' + seriesLabel + ' ' + concepts.join(' ')).toLowerCase();
    return node._searchString.includes(searchQuery);
}

// Precompute strings
for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let str = node.title + ' ' + node.subtitle;
    if (node.seriesLabel) str += ' ' + node.seriesLabel;
    if (node.concepts) str += ' ' + node.concepts.join(' ');
    node._searchString = str.toLowerCase();
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
