const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const assert = require("assert");

// Initialize DOM with HTML containing .essays-grid
const html = `<!DOCTYPE html>
<html>
<head></head>
<body>
    <div class="essays-grid"></div>
</body>
</html>`;

const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

const { window } = dom;
const { document, localStorage } = window;

// Mock matchMedia for jsdom environment
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {},
        addEventListener: function() {},
        removeEventListener: function() {}
    };
};

// Set up malicious custom article in localStorage
const xssPayload = `<img src=x onerror="window.xssExecuted=true">`;
const maliciousArticle = {
    id: "custom-xss-1",
    title: `<script>window.scriptExecuted=true;</script>Title XSS`,
    subtitle: `<svg onload="window.svgExecuted=true">`,
    excerpt: `<img src=x onerror="window.imgExecuted=true">`,
    author: `"><script>window.authorXss=true</script>`,
    slug: `test-xss" onload="alert(1)`
};

localStorage.setItem("dimension_custom_articles", JSON.stringify([maliciousArticle]));

// Read script.js content
const scriptContent = fs.readFileSync(path.join(__dirname, "script.js"), "utf8");

// Execute script.js in jsdom context
const scriptEl = document.createElement("script");
scriptEl.textContent = scriptContent;
document.body.appendChild(scriptEl);

// Trigger DOMContentLoaded
const evt = document.createEvent("Event");
evt.initEvent("DOMContentLoaded", true, true);
document.dispatchEvent(evt);

// Assertions
const essaysGrid = document.querySelector(".essays-grid");
assert.ok(essaysGrid, ".essays-grid should exist");

const card = essaysGrid.querySelector(".essay-card");
assert.ok(card, "Custom article card should be prepended to .essays-grid");

// Check that script execution flags were NOT set on window
assert.strictEqual(window.xssExecuted, undefined, "xssExecuted should be undefined");
assert.strictEqual(window.scriptExecuted, undefined, "scriptExecuted should be undefined");
assert.strictEqual(window.svgExecuted, undefined, "svgExecuted should be undefined");
assert.strictEqual(window.imgExecuted, undefined, "imgExecuted should be undefined");
assert.strictEqual(window.authorXss, undefined, "authorXss should be undefined");

// Check that script, img, svg tags were NOT created in the DOM inside card
assert.strictEqual(card.querySelectorAll("script").length, 0, "No <script> elements should be in card");
assert.strictEqual(card.querySelectorAll("img").length, 0, "No <img> elements should be in card");
assert.strictEqual(card.querySelectorAll("svg").length, 0, "No <svg> elements should be in card");

// Verify that text content contains the raw payload escaped as plain text
const titleLink = card.querySelector(".essay-title a");
assert.ok(titleLink.textContent.includes("<script>window.scriptExecuted=true;</script>Title XSS"), "Title should contain text literally");

const subtitlePara = card.querySelector(".essay-subtitle");
assert.ok(subtitlePara.textContent.includes('<svg onload="window.svgExecuted=true">'), "Subtitle should contain text literally");

const excerptPara = card.querySelector(".essay-excerpt");
assert.ok(excerptPara.textContent.includes('<img src=x onerror="window.imgExecuted=true">'), "Excerpt should contain text literally");

console.log("✅ Security Test Passed: All dynamic properties properly escaped against DOM XSS!");
