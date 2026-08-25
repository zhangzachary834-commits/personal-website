const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = { getItem: () => null, setItem: () => {} };
global.window.matchMedia = () => ({ matches: false, addEventListener: () => {} });
global.requestAnimationFrame = (cb) => { /* mock */ };

// run script
try {
  require('./script.js');
  
  // Trigger DOMContentLoaded
  document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  console.log("Script executed without errors!");
} catch (e) {
  console.error("Error executing script:", e);
}
