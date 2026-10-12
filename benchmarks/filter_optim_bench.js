const { performance } = require('perf_hooks');

const entries = [];
const categories = ['engineering', 'design', 'writing', 'misc'];

// Generate mock data
for (let i = 0; i < 5000; i++) {
    const text = `This is a sample essay title ${i} with some keywords like react, nodejs, performance.`;
    const category = categories[i % categories.length];

    // We mock the DOM element interface
    const card = {
        style: { display: '' },
        dataset: { category }
    };

    entries.push({ card, text: text.toLowerCase() });
}

let filter = "all";
const query = "react performance essay";

// Baseline
let start = performance.now();
for (let iter = 0; iter < 1000; iter++) {
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    entries.forEach(({ card, text }) => {
        const matches = (filter === "all" || card.dataset.category === filter) &&
            terms.every(term => text.includes(term));
        card.style.display = matches ? "" : "none";
        if (matches) visible++;
    });
}
let end = performance.now();
const baselineTime = end - start;
console.log('Baseline 1000 iters:', baselineTime.toFixed(2), 'ms');

// Optimized
start = performance.now();
for (let iter = 0; iter < 1000; iter++) {
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;

    // Standard loop
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const card = entry.card;

        let matches = (filter === "all" || card.dataset.category === filter);
        if (matches) {
            const text = entry.text;
            // standard loop for every
            for (let j = 0; j < terms.length; j++) {
                if (!text.includes(terms[j])) {
                    matches = false;
                    break;
                }
            }
        }

        card.style.display = matches ? "" : "none";
        if (matches) visible++;
    }
}
end = performance.now();
const optimizedTime = end - start;
console.log('Optimized 1000 iters:', optimizedTime.toFixed(2), 'ms');
console.log('Speedup:', (baselineTime / optimizedTime).toFixed(2) + 'x');
