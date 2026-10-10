const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
  <div id="draw-stage">
    <canvas id="draw-canvas"></canvas>
  </div>
</body>
</html>`);

const { window } = dom;
const { document } = window;

// Global metrics
let layoutThrashCount = 0;

// Mock elements getBoundingClientRect
const originalGetBoundingClientRect = window.Element.prototype.getBoundingClientRect;
window.Element.prototype.getBoundingClientRect = function() {
  layoutThrashCount++;
  return { left: 100, top: 100, width: 800, height: 600, right: 900, bottom: 700 };
};

const WIDTH = 800;
const HEIGHT = 600;

function simulateBaseline() {
    layoutThrashCount = 0;
    const stage = document.getElementById("draw-stage");

    stage.addEventListener("pointermove", (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);
    });

    console.time("Baseline Layout Thrash (10,000 moves)");
    for (let i = 0; i < 10000; i++) {
        const event = new window.MouseEvent("pointermove", { clientX: 100 + i%50, clientY: 100 + i%50 });
        stage.dispatchEvent(event);
    }
    console.timeEnd("Baseline Layout Thrash (10,000 moves)");
    console.log(`Baseline getBoundingClientRect calls: ${layoutThrashCount}`);
}

function simulateOptimized() {
    layoutThrashCount = 0;
    const stage = document.getElementById("draw-stage");

    // Clear old event listeners by replacing the nodes
    const clone = stage.cloneNode(true);
    stage.parentNode.replaceChild(clone, stage);
    const newStage = document.getElementById("draw-stage");

    let cachedRect = null;

    newStage.addEventListener("pointerenter", () => {
        cachedRect = newStage.getBoundingClientRect();
    });

    newStage.addEventListener("pointermove", (e) => {
        const rect = cachedRect || newStage.getBoundingClientRect();
        const x = (e.clientX - rect.left);
        const y = (e.clientY - rect.top);
    });

    console.time("Optimized Execution (10,000 moves)");

    const enterEvent = new window.MouseEvent("pointerenter");
    newStage.dispatchEvent(enterEvent);

    for (let i = 0; i < 10000; i++) {
        const event = new window.MouseEvent("pointermove", { clientX: 100 + i%50, clientY: 100 + i%50 });
        newStage.dispatchEvent(event);
    }
    console.timeEnd("Optimized Execution (10,000 moves)");
    console.log(`Optimized getBoundingClientRect calls: ${layoutThrashCount}`);
}

simulateBaseline();
console.log("---");
simulateOptimized();
