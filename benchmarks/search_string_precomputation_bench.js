const nodes = [];
for (let i = 0; i < 500; i++) {
    const title = "Some Title " + i;
    const subtitle = "Subtitle " + i;
    const seriesLabel = i % 2 === 0 ? "Series " + i : null;
    const concepts = ["concept " + i, "other concept " + i];

    const searchTokens = [title, subtitle, seriesLabel, ...(concepts || [])].filter(Boolean).map(s => s.toLowerCase());
    const searchString = searchTokens.join(" ");

    nodes.push({
        title,
        subtitle,
        seriesLabel,
        concepts,
        searchString
    });
}

function matchesSearchBaseline(node, searchQuery) {
    if (!searchQuery) return false;
    return node.title.toLowerCase().includes(searchQuery) ||
           node.subtitle.toLowerCase().includes(searchQuery) ||
           (node.seriesLabel && node.seriesLabel.toLowerCase().includes(searchQuery)) ||
           (node.concepts && node.concepts.some(c => c.toLowerCase().includes(searchQuery)));
}

function matchesSearchOptimized(node, searchQuery) {
    if (!searchQuery) return false;
    return node.searchString && node.searchString.includes(searchQuery);
}

const queries = ["some", "title 5", "concept 10", "missing", "series 4"];

console.log("Warming up...");
for (let i = 0; i < 1000; i++) {
    queries.forEach(q => nodes.forEach(n => matchesSearchBaseline(n, q)));
    queries.forEach(q => nodes.forEach(n => matchesSearchOptimized(n, q)));
}

console.time("Baseline (inline toLowerCase)");
for (let j = 0; j < 10000; j++) {
    for (let q = 0; q < queries.length; q++) {
        for (let i = 0; i < nodes.length; i++) {
            matchesSearchBaseline(nodes[i], queries[q]);
        }
    }
}
console.timeEnd("Baseline (inline toLowerCase)");

console.time("Optimized (precomputed searchString)");
for (let j = 0; j < 10000; j++) {
    for (let q = 0; q < queries.length; q++) {
        for (let i = 0; i < nodes.length; i++) {
            matchesSearchOptimized(nodes[i], queries[q]);
        }
    }
}
console.timeEnd("Optimized (precomputed searchString)");
