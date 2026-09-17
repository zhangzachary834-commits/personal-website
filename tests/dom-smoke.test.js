const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const pages = [
  'index.html',
  'story.html',
  'manifesto.html',
  'library.html',
  'ecosystem.html',
  'contact.html',
  'studio.html',
  'posts/ai-training-data-discipleship.html'
];

function makeCanvasContext() {
  const noop = () => {};
  return new Proxy({
    canvas: { width: 1280, height: 720 },
    measureText: text => ({ width: String(text).length * 8 }),
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    putImageData: noop,
  }, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === 'symbol') return target[prop];
      return noop;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  });
}

function installBrowserMocks(window) {
  const ctx = makeCanvasContext();
  Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: () => ctx
  });
  Object.defineProperty(window.HTMLCanvasElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600 })
  });

  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; }
  });
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
  window.scrollTo = () => {};
  window.open = () => null;
  window.alert = () => {};
  window.confirm = () => true;
  window.URL.createObjectURL = () => 'blob:mock';
  window.URL.revokeObjectURL = () => {};
  window.navigator.clipboard = { writeText: async () => {} };
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
}

for (const page of pages) {
  test(`client script initializes without uncaught errors on ${page}`, () => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const dom = new JSDOM(html, {
      url: `https://example.test/${page}`,
      runScripts: 'outside-only',
      pretendToBeVisual: true
    });
    installBrowserMocks(dom.window);

    const errors = [];
    dom.window.addEventListener('error', event => {
      errors.push(event.error || new Error(event.message));
      event.preventDefault();
    });

    assert.doesNotThrow(() => dom.window.eval(script));
    assert.doesNotThrow(() => {
      dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
    });
    assert.deepEqual(errors.map(error => String(error)), []);
    dom.window.close();
  });
}
