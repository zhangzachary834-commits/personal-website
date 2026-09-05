const { JSDOM } = require("jsdom");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

// Read script.js content
const scriptContent = fs.readFileSync(path.join(__dirname, "script.js"), "utf8");

// Setup JSDOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="tooltip"></div></body></html>`, {
    runScripts: "dangerously",
    url: "http://localhost/"
});
const { window } = dom;
const { document } = window;

window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

// Evaluate script.js in JSDOM context so escapeHtml is defined
window.eval(scriptContent);

const escapeHtml = window.escapeHtml;

// Test escapeHtml function directly
assert.strictEqual(typeof escapeHtml, "function", "escapeHtml should be defined globally");
assert.strictEqual(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
assert.strictEqual(escapeHtml('"test" & \'hello\''), '&quot;test&quot; &amp; &#039;hello&#039;');

// Simulate tooltip populating logic with malicious node properties
const hoveredNode = {
    title: '<img src=x onerror=alert("XSS_TITLE")>',
    subtitle: '<script>alert("XSS_SUBTITLE")</script>',
    category: 'ontology"><script>alert("XSS_CAT")</script>',
    color: '#6ee7d8'
};

const catNames = {
    ontology: "Epistemology · Relational Ontology"
};

const tooltip = document.getElementById("tooltip");

const catText = escapeHtml(catNames[hoveredNode.category] || hoveredNode.category);
const titleText = escapeHtml(hoveredNode.title);
const subText = hoveredNode.subtitle ? escapeHtml(hoveredNode.subtitle) : "";

tooltip.innerHTML = `
    <div style="font-size:0.72rem;color:${hoveredNode.color};text-transform:uppercase;font-weight:600;margin-bottom:2px;">
        ${catText}
    </div>
    <strong style="color:var(--gold);font-size:0.95rem;">${titleText}</strong>
    ${subText ? `<div style="font-size:0.78rem;color:var(--muted);margin-top:2px;">${subText}</div>` : ""}
`;

// Verify no script or img elements were created in DOM via innerHTML
const scriptTags = tooltip.querySelectorAll("script");
const imgTags = tooltip.querySelectorAll("img");

assert.strictEqual(scriptTags.length, 0, "No script tags should be rendered in tooltip");
assert.strictEqual(imgTags.length, 0, "No img tags should be rendered in tooltip");

// Check text content contains escaped literal string
assert(tooltip.textContent.includes('<img src=x onerror=alert("XSS_TITLE")>'));
assert(tooltip.textContent.includes('<script>alert("XSS_SUBTITLE")</script>'));

console.log("✅ All XSS fix tests passed successfully!");
