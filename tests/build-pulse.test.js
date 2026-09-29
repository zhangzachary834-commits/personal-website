const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'story.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'build-pulse.js'), 'utf8');

test('Build Pulse turns the build-in-public promise into live, filterable commit history', async () => {
  const dom = new JSDOM(html, {
    url: 'https://example.test/story.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  const payloads = {
    Earthcall: [{
      sha: 'abcdef0123456789',
      html_url: 'https://github.com/example/earthcall/commit/abcdef0',
      commit: {
        message: '<img src=x onerror="window.__pwned=true"> Prophetic rendering pass',
        author: { date: '2026-09-25T20:00:00Z' }
      }
    }],
    'personal-website': [{
      sha: '1234567890abcdef',
      html_url: 'https://github.com/example/site/commit/1234567',
      commit: {
        message: 'Make Build Pulse real',
        author: { date: '2026-09-25T21:00:00Z' }
      }
    }]
  };

  dom.window.fetch = async url => {
    const repo = String(url).includes('/Earthcall/') ? 'Earthcall' : 'personal-website';
    return {
      ok: true,
      status: 200,
      async json() { return payloads[repo]; }
    };
  };

  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));

  const shell = dom.window.document.querySelector('[data-build-pulse]');
  assert.ok(shell);
  assert.equal(shell.querySelectorAll('.build-pulse-item').length, 2);
  assert.match(shell.textContent, /Make Build Pulse real/);
  assert.match(shell.textContent, /Prophetic rendering pass/);
  assert.equal(shell.querySelector('.build-pulse-message img'), null);
  assert.equal(dom.window.__pwned, undefined);

  const siteFilter = shell.querySelector('[data-build-filter="site"]');
  siteFilter.click();
  assert.equal(shell.querySelectorAll('.build-pulse-item').length, 1);
  assert.match(shell.textContent, /Make Build Pulse real/);
  assert.doesNotMatch(shell.textContent, /Prophetic rendering pass/);

  dom.window.close();
});

test('Build Pulse displays fallback UI when GitHub API fails and cache is empty', async () => {
  const dom = new JSDOM(html, {
    url: 'https://example.test/story.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  // Mock fetch to simulate an API error
  dom.window.fetch = async () => {
    return { ok: false, status: 500 };
  };

  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
  // Give promises time to settle
  await new Promise(resolve => setTimeout(resolve, 0));

  const shell = dom.window.document.querySelector('[data-build-pulse]');
  assert.ok(shell);

  const status = shell.querySelector('[data-build-pulse-status]');
  assert.equal(status.textContent, 'Live GitHub pulse unavailable right now · repositories remain public');

  const fallbackCards = shell.querySelectorAll('.build-pulse-fallback-card');
  assert.ok(fallbackCards.length > 0);

  dom.window.close();
});

test('Build Pulse displays stale cached data when API fails but cache exists', async () => {
  const dom = new JSDOM(html, {
    url: 'https://example.test/story.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });

  // Pre-populate sessionStorage with a stale cache
  const staleData = {
    savedAt: Date.now() - (10 * 60 * 1000), // 10 minutes ago, making it stale (> 5 min TTL)
    items: [{
      repoId: 'Earthcall',
      repoLabel: 'Earthcall',
      repoUrl: 'https://github.com/example/earthcall',
      sha: 'abcdef0123456789',
      shortSha: 'abcdef0',
      message: 'Old cached commit',
      date: '2026-09-20T20:00:00Z',
      url: 'https://github.com/example/earthcall/commit/abcdef0'
    }]
  };

  // Set cache for one of the repositories (Earthcall)
  dom.window.sessionStorage.setItem('dimension-build-pulse-v1:earthcall', JSON.stringify(staleData));

  // Mock fetch to simulate an API error
  dom.window.fetch = async () => {
    return { ok: false, status: 500 };
  };

  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
  // Give promises time to settle
  await new Promise(resolve => setTimeout(resolve, 0));

  const shell = dom.window.document.querySelector('[data-build-pulse]');
  assert.ok(shell);

  const status = shell.querySelector('[data-build-pulse-status]');
  assert.match(status.textContent, /cached fallback/);

  const items = shell.querySelectorAll('.build-pulse-item');
  // It should show the 1 stale item we injected
  assert.equal(items.length, 1);
  assert.match(shell.textContent, /Old cached commit/);

  dom.window.close();
});
