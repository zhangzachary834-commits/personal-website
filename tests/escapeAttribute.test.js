const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeAttribute } = require("../script.js");

test("escapeAttribute function tests", async (t) => {
    await t.test("replaces ampersands", () => {
        assert.equal(escapeAttribute("Tom & Jerry"), "Tom &amp; Jerry");
        assert.equal(escapeAttribute("A & B & C"), "A &amp; B &amp; C");
    });

    await t.test("replaces double quotes", () => {
        assert.equal(escapeAttribute('He said "hello"'), 'He said &quot;hello&quot;');
    });

    await t.test("replaces single quotes", () => {
        assert.equal(escapeAttribute("It's fine"), "It&#39;s fine");
    });

    await t.test("replaces less-than signs", () => {
        assert.equal(escapeAttribute("5 < 10"), "5 &lt; 10");
        assert.equal(escapeAttribute("<div>"), "&lt;div&gt;");
    });

    await t.test("replaces greater-than signs", () => {
        assert.equal(escapeAttribute("10 > 5"), "10 &gt; 5");
        assert.equal(escapeAttribute("</div>"), "&lt;/div&gt;");
    });

    await t.test("handles a combination of special characters", () => {
        assert.equal(escapeAttribute('<div class="test" data-val=\'a&b\'>'), "&lt;div class=&quot;test&quot; data-val=&#39;a&amp;b&#39;&gt;");
    });

    await t.test("returns the same string if no special characters exist", () => {
        assert.equal(escapeAttribute("Hello World!"), "Hello World!");
        assert.equal(escapeAttribute("Just standard text."), "Just standard text.");
    });

    await t.test("handles edge cases: null and undefined", () => {
        assert.equal(escapeAttribute(null), "");
        assert.equal(escapeAttribute(undefined), "");
    });

    await t.test("handles edge cases: empty strings", () => {
        assert.equal(escapeAttribute(""), "");
    });

    await t.test("handles non-string types", () => {
        assert.equal(escapeAttribute(123), "123");
        assert.equal(escapeAttribute(true), "true");
        assert.equal(escapeAttribute(false), "false");
        // For objects and arrays, String() conversion kicks in.
        assert.equal(escapeAttribute({}), "[object Object]");
        assert.equal(escapeAttribute([1, 2, 3]), "1,2,3");
    });
});
