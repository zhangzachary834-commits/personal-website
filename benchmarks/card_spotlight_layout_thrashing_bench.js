const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html>
<html>
<body>
  <div class="project-card">Card 1</div>
  <div class="project-card">Card 2</div>
  <div class="project-card">Card 3</div>
</body>
</html>`);

const { window } = dom;
const { document } = window;

// Mock window properties
window.scrollX = 0;
window.scrollY = 0;
window.matchMedia = () => ({ matches: false });

// Global metrics
let layoutThrashCount = 0;

// Mock elements getBoundingClientRect
const originalGetBoundingClientRect = window.Element.prototype.getBoundingClientRect;
window.Element.prototype.getBoundingClientRect = function() {
  layoutThrashCount++;
  return { left: 100, top: 100, width: 200, height: 100, right: 300, bottom: 200 };
};

// Simulate baseline
function simulateBaseline() {
    layoutThrashCount = 0;
    const cards = document.querySelectorAll(".project-card");

    // Attach listeners
    cards.forEach(card => {
        card.addEventListener("mousemove", function baselineMouseMove(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", x + "px");
            card.style.setProperty("--mouse-y", y + "px");
        });
    });

    // Simulate interactions
    const card = cards[0];

    console.time("Baseline Layout Thrash (10,000 moves)");
    for (let i = 0; i < 10000; i++) {
        const event = new window.MouseEvent("mousemove", { clientX: 150 + i%50, clientY: 150 + i%50 });
        card.dispatchEvent(event);
    }
    console.timeEnd("Baseline Layout Thrash (10,000 moves)");
    console.log(`Baseline getBoundingClientRect calls: ${layoutThrashCount}`);
}

// Simulate optimized
function simulateOptimized() {
    // Reset state
    layoutThrashCount = 0;

    // Clear old event listeners by replacing the nodes
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        card.parentNode.replaceChild(clone, card);
    });

    const newCards = document.querySelectorAll(".project-card");

    // Attach optimized listeners
    newCards.forEach(card => {
        let cachedLeft = 0;
        let cachedTop = 0;

        card.addEventListener("pointerenter", () => {
            const rect = card.getBoundingClientRect();
            cachedLeft = rect.left + window.scrollX;
            cachedTop = rect.top + window.scrollY;
        });

        card.addEventListener("mousemove", (e) => {
            const x = e.pageX - cachedLeft;
            const y = e.pageY - cachedTop;
            card.style.setProperty("--mouse-x", x + "px");
            card.style.setProperty("--mouse-y", y + "px");
        });
    });

    const card = newCards[0];

    console.time("Optimized Execution (10,000 moves)");

    // 1 pointerenter
    const enterEvent = new window.MouseEvent("pointerenter");
    card.dispatchEvent(enterEvent);

    // 10,000 mousemoves
    for (let i = 0; i < 10000; i++) {
        const event = new window.MouseEvent("mousemove", { pageX: 150 + i%50, pageY: 150 + i%50 });
        card.dispatchEvent(event);
    }
    console.timeEnd("Optimized Execution (10,000 moves)");
    console.log(`Optimized getBoundingClientRect calls: ${layoutThrashCount}`);
}

simulateBaseline();
console.log("---");
simulateOptimized();
