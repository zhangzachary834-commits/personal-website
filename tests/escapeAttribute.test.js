const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeAttribute } = require("../script.js");

test("escapeAttribute function tests", async (t) => {
    await t.test("replaces double quotes", () => {
        assert.equal(escapeAttribute('hello "world"'), "hello &quot;world&quot;");
    });

    await t.test("replaces single quotes", () => {
        assert.equal(escapeAttribute("it's a test"), "it&#39;s a test");
    });

    await t.test("replaces HTML characters (via escapeHtml)", () => {
        assert.equal(escapeAttribute("<script>alert(1 & 2)</script>"), "&lt;script&gt;alert(1 &amp; 2)&lt;/script&gt;");
    });

    await t.test("handles a combination of special characters", () => {
        assert.equal(escapeAttribute(`<a href="?id=1&name='test'">`), "&lt;a href=&quot;?id=1&amp;name=&#39;test&#39;&quot;&gt;");
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
        assert.equal(escapeAttribute({}), "[object Object]");
        assert.equal(escapeAttribute([1, 2, 3]), "1,2,3");
    });
});
