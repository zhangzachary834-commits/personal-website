const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeHtml } = require("../script.js");

test("escapeHtml function tests", async (t) => {
    await t.test("replaces ampersands", () => {
        assert.equal(escapeHtml("Tom & Jerry"), "Tom &amp; Jerry");
        assert.equal(escapeHtml("A & B & C"), "A &amp; B &amp; C");
    });

    await t.test("replaces less-than signs", () => {
        assert.equal(escapeHtml("5 < 10"), "5 &lt; 10");
        assert.equal(escapeHtml("<div>"), "&lt;div&gt;");
    });

    await t.test("replaces greater-than signs", () => {
        assert.equal(escapeHtml("10 > 5"), "10 &gt; 5");
        assert.equal(escapeHtml("</div>"), "&lt;/div&gt;");
    });

    await t.test("handles a combination of special characters", () => {
        assert.equal(escapeHtml("<script>alert('XSS & more')</script>"), "&lt;script&gt;alert('XSS &amp; more')&lt;/script&gt;");
    });

    await t.test("returns the same string if no special characters exist", () => {
        assert.equal(escapeHtml("Hello World!"), "Hello World!");
        assert.equal(escapeHtml("Just standard text."), "Just standard text.");
    });

    await t.test("handles edge cases: null and undefined", () => {
        assert.equal(escapeHtml(null), "");
        assert.equal(escapeHtml(undefined), "");
    });

    await t.test("handles edge cases: empty strings", () => {
        assert.equal(escapeHtml(""), "");
    });

    await t.test("handles non-string types", () => {
        assert.equal(escapeHtml(123), "123");
        assert.equal(escapeHtml(true), "true");
        assert.equal(escapeHtml(false), "false");
        // For objects and arrays, String() conversion kicks in.
        assert.equal(escapeHtml({}), "[object Object]");
        assert.equal(escapeHtml([1, 2, 3]), "1,2,3");
    });
});
