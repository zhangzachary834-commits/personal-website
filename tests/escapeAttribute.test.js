const test = require("node:test");
const assert = require("node:assert/strict");
const { escapeAttribute } = require("../script.js");

test("escapeAttribute function tests", async (t) => {
    await t.test("replaces double quotes", () => {
        assert.equal(escapeAttribute('He said "hello"'), 'He said &quot;hello&quot;');
        assert.equal(escapeAttribute('"test"'), '&quot;test&quot;');
    });

    await t.test("replaces single quotes", () => {
        assert.equal(escapeAttribute("It's a test"), "It&#39;s a test");
        assert.equal(escapeAttribute("'test'"), "&#39;test&#39;");
    });

    await t.test("escapes HTML characters (&, <, >)", () => {
        assert.equal(escapeAttribute("A & B < C > D"), "A &amp; B &lt; C &gt; D");
        assert.equal(escapeAttribute('<div id="test">'), '&lt;div id=&quot;test&quot;&gt;');
    });

    await t.test("handles a combination of special characters", () => {
        assert.equal(
            escapeAttribute("<script>alert('XSS & more')</script>"),
            "&lt;script&gt;alert(&#39;XSS &amp; more&#39;)&lt;/script&gt;"
        );
        assert.equal(
            escapeAttribute(`"title" & 'subtitle' <tag>`),
            `&quot;title&quot; &amp; &#39;subtitle&#39; &lt;tag&gt;`
        );
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
