const test = require("node:test");
const assert = require("node:assert/strict");
const { sanitizeUrl } = require("../script.js");

test("sanitizeUrl function tests", async (t) => {
    await t.test("allows valid web URLs", () => {
        assert.equal(sanitizeUrl("https://example.com"), "https://example.com");
        assert.equal(sanitizeUrl("http://example.com"), "http://example.com");
    });

    await t.test("allows mailto URLs", () => {
        assert.equal(sanitizeUrl("mailto:test@example.com"), "mailto:test@example.com");
    });

    await t.test("allows relative and hash URLs", () => {
        assert.equal(sanitizeUrl("#section-1"), "#section-1");
        assert.equal(sanitizeUrl("/path/to/page.html"), "/path/to/page.html");
        assert.equal(sanitizeUrl("page.html"), "page.html");
        assert.equal(sanitizeUrl("?query=1"), "?query=1");
    });

    await t.test("rejects malicious executable schemes", () => {
        assert.equal(sanitizeUrl("javascript:alert(1)"), "#");
        assert.equal(sanitizeUrl("vbscript:msgbox(1)"), "#");
        assert.equal(sanitizeUrl("data:text/html,<script>alert(1)</script>"), "#");
    });

    await t.test("rejects malicious schemes case-insensitively and with leading spaces", () => {
        assert.equal(sanitizeUrl("JaVaScRiPt:alert(1)"), "#");
        assert.equal(sanitizeUrl("   javascript:alert(1)"), "#");
    });

    await t.test("rejects unknown opaque schemes", () => {
        assert.equal(sanitizeUrl("ftp://example.com"), "#");
        assert.equal(sanitizeUrl("file:///etc/passwd"), "#");
        assert.equal(sanitizeUrl("gopher://gopher.example.com"), "#");
        assert.equal(sanitizeUrl("custom-app://open"), "#");
    });

    await t.test("escapes HTML attributes in otherwise valid URLs", () => {
        assert.equal(sanitizeUrl("https://example.com?a=1&b=2"), "https://example.com?a=1&amp;b=2");
        assert.equal(sanitizeUrl("https://example.com?q=\"test\""), "https://example.com?q=&quot;test&quot;");
        assert.equal(sanitizeUrl("https://example.com?q='test'"), "https://example.com?q=&#39;test&#39;");
        assert.equal(sanitizeUrl("https://example.com?q=<script>"), "https://example.com?q=&lt;script&gt;");
    });

    await t.test("handles edge cases: null, undefined, empty strings", () => {
        assert.equal(sanitizeUrl(null), "#");
        assert.equal(sanitizeUrl(undefined), "#");
        assert.equal(sanitizeUrl(""), "#");
        assert.equal(sanitizeUrl("   "), "#");
    });

    await t.test("handles non-string types", () => {
        assert.equal(sanitizeUrl(123), "#");
        assert.equal(sanitizeUrl(true), "#");
        assert.equal(sanitizeUrl(false), "#");
    });
});
