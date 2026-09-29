const fs = require('fs');

// We need to set up a mock DOM environment since script.js expects a browser environment
const scriptContent = fs.readFileSync('./script.js', 'utf-8');

let callCount = 0;

const mockWindow = {
    addEventListener: (event, handler, options) => {
        if (event === 'scroll') {
            mockWindow.scrollHandler = handler;
        }
    },
    devicePixelRatio: 1,
    requestAnimationFrame: (cb) => {
        // Simulate a frame executing later
        setTimeout(() => cb(), 16);
    }
};

const mockCanvas = {
    getBoundingClientRect: () => {
        callCount++;
        return { width: 800, height: 600, top: 0, left: 0 };
    },
    getContext: () => ({ setTransform: () => {} }),
    width: 800,
    height: 600
};

const mockDocument = {
    getElementById: (id) => {
        if (id === 'graph-canvas') return mockCanvas;
        if (id === 'graph-container') return { getBoundingClientRect: () => ({ width: 800, height: 600 }), style: { display: 'none' } };
        if (id === 'grid-container') return { style: { display: 'grid' } };
        if (id === 'graph-view-toggle') return { addEventListener: () => {} };
        return {
            addEventListener: () => {},
            style: {},
            classList: { add: () => {}, remove: () => {}, toggle: () => {} },
            appendChild: () => {},
            removeAttribute: () => {},
            setAttribute: () => {}
        };
    },
    createElement: () => ({ classList: { add: () => {} }, appendChild: () => {}, style: {} }),
    documentElement: { scrollTop: 0, scrollHeight: 1000, clientHeight: 800 },
    querySelectorAll: () => []
};

// Expose globals for script.js
global.window = mockWindow;
global.document = mockDocument;

// Extract the entire script and run it in a sandbox-like way
// We can just extract all the functions we need
const updateCanvasRectMatch = scriptContent.match(/function updateCanvasRect\(\) \{[\s\S]*?\n        \}/);

if (updateCanvasRectMatch) {
    // Just run the minimum required parts
    global.canvas = mockCanvas;
    global.cachedCanvasRect = null;
    global.isGraphView = true;

    // Evaluate updateCanvasRect
    eval(updateCanvasRectMatch[0]);

    // Create the scroll handler exactly as it appears in the file
    let ticking = false; // Add ticking in case it's used
    let graphScrollTicking = false; // Add for the optimized version

    // Define the exact code snippet we want to test
    const scrollListenerCode = `
        let graphScrollTicking = false;
        window.addEventListener("scroll", () => {
            if (isGraphView && !graphScrollTicking) {
                window.requestAnimationFrame(() => {
                    updateCanvasRect();
                    graphScrollTicking = false;
                });
                graphScrollTicking = true;
            }
        }, { passive: true });
    `;

    eval(scrollListenerCode);

    // Now trigger the scroll event rapidly
    console.log("Simulating 10,000 rapid scroll events...");

    const start = process.hrtime.bigint();

    for (let i = 0; i < 10000; i++) {
        if (mockWindow.scrollHandler) {
            mockWindow.scrollHandler();
        }
    }

    const end = process.hrtime.bigint();
    const timeMs = Number(end - start) / 1_000_000;

    // Wait for any pending animation frames
    setTimeout(() => {
        console.log(`\n--- Results ---`);
        console.log(`getBoundingClientRect calls: ${callCount}`);
        console.log(`Time taken: ${timeMs.toFixed(2)} ms`);

        if (callCount === 10000) {
            console.log(`\nStatus: Unoptimized (Synchronous Thrashing)`);
        } else if (callCount < 100) {
            console.log(`\nStatus: Optimized (requestAnimationFrame throttling working)`);
        } else {
            console.log(`\nStatus: Unknown state`);
        }
    }, 50); // wait a bit for setTimeouts (mock rAF) to clear
} else {
    console.error("Could not find updateCanvasRect in script.js");
}
