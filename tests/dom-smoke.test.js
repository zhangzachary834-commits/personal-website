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
  'posts/ai-training-data-discipleship.html',
  'posts/trollability-car-wash-invariant.html',
  'posts/trollability-cosmic-dom-tree.html',
  'posts/trollability-keter-key-incident.html'
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


test('locally saved article metadata is rendered as text and reopens the Studio draft', () => {
  const html = fs.readFileSync(path.join(root, 'library.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://example.test/library.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  installBrowserMocks(dom.window);

  const maliciousTitle = '<img src=x onerror="window.__pwned=true">';
  dom.window.localStorage.setItem('dimension_custom_articles', JSON.stringify([{
    id: 'draft_malicious',
    title: maliciousTitle,
    subtitle: '<script>window.__pwned=true</script>',
    excerpt: '<b>not markup</b>',
    author: '<svg onload="window.__pwned=true"></svg>',
    category: 'ontology',
    content: 'safe body',
    isPublished: true
  }]));

  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));

  const card = dom.window.document.querySelector('[data-essay-id="draft_malicious"]');
  assert.ok(card);
  assert.equal(card.querySelector('.essay-title a').textContent, maliciousTitle);
  assert.equal(card.querySelector('.essay-title img'), null);
  assert.equal(dom.window.__pwned, undefined);
  assert.equal(card.querySelector('.essay-title a').getAttribute('href'), 'studio.html?load=draft_malicious');
  assert.match(card.querySelector('.essay-excerpt').textContent, /<b>not markup<\/b>/);
  dom.window.close();
});


test('Trollability Suite is modeled as writing pieces in a shared series', () => {
  const html = fs.readFileSync(path.join(root, 'library.html'), 'utf8');
  const dom = new JSDOM(html);

  const cards = [...dom.window.document.querySelectorAll('.essay-card[data-series="trollability-suite"]')];
  assert.equal(cards.length, 3);
  assert.ok(cards.every(card => card.getAttribute('data-series-label') === 'Trollability Suite'));
  assert.deepEqual(
    cards.map(card => card.getAttribute('data-category')),
    ['ai', 'ai', 'ai']
  );

  assert.ok(dom.window.document.querySelector('.essay-filter-btn[data-filter="ai"]'));
  assert.ok(dom.window.document.querySelector('.c-filter-chip[data-cluster="ai"]'));
  dom.window.close();
});

function openDiscoveryPage(page, query = '', drafts = []) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, page), 'utf8'), {
    url: `https://example.test/${page}${query}`, runScripts: 'outside-only', pretendToBeVisual: true
  });
  installBrowserMocks(dom.window);
  dom.window.localStorage.setItem('dimension_custom_articles', JSON.stringify(drafts));
  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}

test('Library combines URL search and categories, resets, and restores browser history', () => {
  const dom = openDiscoveryPage('library.html', '?q=cosmic&category=ai&mode=dimension#essays-grid');
  try {
    const { document } = dom.window;
    const visible = () => [...document.querySelectorAll('.essay-card')].filter(card => card.style.display !== 'none');
    const search = document.getElementById('library-search');
    assert.equal(visible().length, 1);
    assert.equal(visible()[0].dataset.essayId, 'trollability-cosmic-dom-tree');
    assert.equal(document.querySelector('[data-filter="ai"]').getAttribute('aria-pressed'), 'true');
    document.querySelector('[data-filter="ontology"]').click();
    assert.equal(visible().length, 0);
    assert.equal(document.getElementById('library-empty-state').hidden, false);
    document.getElementById('library-search-reset').click();
    assert.equal(visible().length, 12);
    assert.equal(dom.window.location.search, '?mode=dimension');
    assert.equal(dom.window.location.hash, '#essays-grid');
    assert.equal(document.activeElement, search);
    search.value = 'causal invariants';
    search.dispatchEvent(new dom.window.Event('input'));
    assert.equal(visible()[0].dataset.essayId, 'trollability-car-wash-invariant');
    document.querySelector('[data-library-layout="observatory"]').click();
    assert.equal(visible()[0].classList.contains('observatory-featured'), true);
    dom.window.history.replaceState(null, '', '?category=ai&q=cosmic');
    dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate'));
    assert.equal(search.value, 'cosmic');
    assert.equal(visible()[0].dataset.essayId, 'trollability-cosmic-dom-tree');
    assert.equal(visible()[0].classList.contains('observatory-featured'), true);
  } finally { dom.window.close(); }
});

test('Library searches local drafts and treats markup-shaped queries as plain text', () => {
  const dom = openDiscoveryPage('library.html', '?category=invalid&q=uniquedraft', [{
    id: 'local-search-test', title: 'UniqueDraft idea', category: 'reflections', content: 'A local thought.'
  }]);
  try {
    const { document } = dom.window;
    assert.equal(document.getElementById('library-result-count').textContent, '1 of 13 writings');
    const search = document.getElementById('library-search');
    search.value = '<img src=x onerror=alert(1)>';
    search.dispatchEvent(new dom.window.Event('input'));
    assert.equal(document.getElementById('library-result-count').textContent, '0 of 13 writings');
    assert.equal(document.getElementById('library-empty-state').hidden, false);
    assert.equal(document.querySelector('img[src="x"]'), null);
  } finally { dom.window.close(); }
});

test('Homepage mobile menu closes on Escape, selection, and outside interaction', () => {
  const dom = openDiscoveryPage('index.html');
  try {
    const { document } = dom.window;
    const menu = document.querySelector('.home-mobile-menu');
    menu.open = true;
    document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(menu.open, false);
    assert.equal(document.activeElement, menu.querySelector('summary'));
    menu.open = true;
    menu.querySelector('a').click();
    assert.equal(menu.open, false);
    menu.open = true;
    document.querySelector('h1').click();
    assert.equal(menu.open, false);
    assert.equal(menu.querySelectorAll('nav a').length, 7);
  } finally { dom.window.close(); }
});
