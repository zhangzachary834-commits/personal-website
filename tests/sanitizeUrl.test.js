const test = require("node:test");
const assert = require("node:assert/strict");
const { sanitizeUrl } = require("../script.js");

test("sanitizeUrl function tests", async (t) => {
    await t.test("allows normal HTTP and HTTPS URLs", () => {
        assert.equal(sanitizeUrl("http://example.com"), "http://example.com");
        assert.equal(sanitizeUrl("https://example.com/path?query=1"), "https://example.com/path?query=1");
    });

    await t.test("allows relative URLs and hash fragments", () => {
        assert.equal(sanitizeUrl("/about"), "/about");
        assert.equal(sanitizeUrl("index.html"), "index.html");
        assert.equal(sanitizeUrl("#section"), "#section");
        assert.equal(sanitizeUrl("?param=value"), "?param=value");
    });

    await t.test("allows mailto URLs", () => {
        assert.equal(sanitizeUrl("mailto:user@example.com"), "mailto:user@example.com");
    });

    await t.test("rejects executable schemes like javascript, vbscript, data", () => {
        assert.equal(sanitizeUrl("javascript:alert(1)"), "#");
        assert.equal(sanitizeUrl("JaVaScRiPt:alert(1)"), "#");
        assert.equal(sanitizeUrl("vbscript:msgbox(1)"), "#");
        assert.equal(sanitizeUrl("data:text/html,<script>alert(1)</script>"), "#");
        assert.equal(sanitizeUrl("  javascript:alert(1)  "), "#");
    });

    await t.test("rejects unsupported schemes", () => {
        assert.equal(sanitizeUrl("ftp://example.com/file.zip"), "#");
        assert.equal(sanitizeUrl("file:///etc/passwd"), "#");
        assert.equal(sanitizeUrl("smb://server/share"), "#");
        assert.equal(sanitizeUrl("unknown:abc"), "#");
    });

    await t.test("handles edge cases and invalid inputs gracefully", () => {
        assert.equal(sanitizeUrl(null), "#");
        assert.equal(sanitizeUrl(undefined), "#");
        assert.equal(sanitizeUrl(""), "#");
        assert.equal(sanitizeUrl("   "), "#");
    });

    await t.test("escapes HTML special characters in the URL", () => {
        assert.equal(sanitizeUrl("https://example.com/?a=1&b=2"), "https://example.com/?a=1&amp;b=2");
        assert.equal(sanitizeUrl("https://example.com/<script>"), "https://example.com/&lt;script&gt;");
        assert.equal(sanitizeUrl("https://example.com/?q=\"test'"), "https://example.com/?q=&quot;test&#39;");
    });
});
