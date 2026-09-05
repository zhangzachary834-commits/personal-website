const fs = require('fs');
const jsdom = require('jsdom');
const assert = require('assert');
const { JSDOM } = jsdom;

let studioHtml = fs.readFileSync('./studio.html', 'utf8');
studioHtml = studioHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

const xssPayloadTitle = '<img src=x onerror=alert("XSS_TITLE")><script>window.xssTitleExecuted=true</script>';
const xssPayloadCategory = '<script>window.xssCategoryExecuted=true</script>';

const testDrafts = [
    {
        id: 'draft_xss_test',
        title: xssPayloadTitle,
        category: xssPayloadCategory,
        updatedAt: Date.now(),
        isPublished: false,
        content: 'Test content'
    }
];

const dom = new JSDOM(studioHtml, {
    url: 'http://localhost/studio.html',
    runScripts: 'dangerously',
    beforeParse(win) {
        win.matchMedia = win.matchMedia || function() {
            return {
                matches: false,
                addListener: function() {},
                removeListener: function() {},
                addEventListener: function() {},
                removeEventListener: function() {}
            };
        };

        win.HTMLCanvasElement.prototype.getContext = function() {
            return null;
        };

        win.localStorage.setItem('dimension_drafts_v1', JSON.stringify(testDrafts));
        win.localStorage.setItem('dimension_active_draft_id', 'draft_xss_test');
    }
});

const { window } = dom;
const { document } = window;

const scriptCode = fs.readFileSync('./script.js', 'utf8');
const scriptEl = document.createElement('script');
scriptEl.textContent = scriptCode;
document.body.appendChild(scriptEl);

document.dispatchEvent(new window.Event('DOMContentLoaded'));

const draftsList = document.getElementById('drafts-list-container');
assert.ok(draftsList, 'drafts-list-container should exist');

const titleEl = draftsList.querySelector('.draft-card-title');
assert.ok(titleEl, '.draft-card-title should exist in draft list');

const categorySpan = draftsList.querySelector('.draft-meta-row span:first-child');
assert.ok(categorySpan, 'category span should exist in draft list');

assert.strictEqual(window.xssTitleExecuted, undefined, 'XSS in title was executed!');
assert.strictEqual(window.xssCategoryExecuted, undefined, 'XSS in category was executed!');
assert.strictEqual(titleEl.querySelectorAll('img, script').length, 0, 'Title rendered raw HTML elements!');
assert.strictEqual(categorySpan.querySelectorAll('script').length, 0, 'Category rendered raw HTML elements!');

assert.strictEqual(
    titleEl.innerHTML,
    '&lt;img src=x onerror=alert("XSS_TITLE")&gt;&lt;script&gt;window.xssTitleExecuted=true&lt;/script&gt;',
    'Title HTML escaped correctly'
);
assert.strictEqual(
    categorySpan.innerHTML,
    '&lt;script&gt;window.xssCategoryExecuted=true&lt;/script&gt;',
    'Category HTML escaped correctly'
);

console.log('✅ ALL XSS FIX TESTS PASSED SUCCESSFULLY!');
