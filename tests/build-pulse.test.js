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