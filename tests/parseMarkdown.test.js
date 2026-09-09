const test = require("node:test");
const assert = require("node:assert/strict");
const { parseMarkdown } = require("../script.js");

test("parseMarkdown function tests", async (t) => {
    await t.test("handles empty input", () => {
        const result = parseMarkdown("");
        assert.match(result, /Start typing in the editor/);
    });

    await t.test("parses headings", () => {
        assert.equal(parseMarkdown("# Heading 1"), "<h2>Heading 1</h2>");
        assert.equal(parseMarkdown("## Heading 2"), "<h3>Heading 2</h3>");
        assert.equal(parseMarkdown("### Heading 3"), "<h4>Heading 3</h4>");
        assert.equal(parseMarkdown("#### Heading 4"), "<h5>Heading 4</h5>");
    });

    await t.test("parses bold and italic text", () => {
        assert.equal(parseMarkdown("**bold text**"), "<p><strong>bold text</strong></p>");
        assert.equal(parseMarkdown("*italic text*"), "<p><em>italic text</em></p>");
        assert.equal(parseMarkdown("~~strikethrough~~"), "<p><del>strikethrough</del></p>");
    });

    await t.test("parses code blocks and inline code", () => {
        assert.equal(parseMarkdown("`inline code`"), "<p><code>inline code</code></p>");
        const NL = String.fromCharCode(10);
        const codeBlock = "```javascript" + NL + "const a = 1;" + NL + "```";
        assert.equal(parseMarkdown(codeBlock), "<pre><code>const a = 1;</code></pre>");
    });

    await t.test("parses blockquotes", () => {
        assert.equal(parseMarkdown("> This is a quote"), "<blockquote><p>This is a quote</p></blockquote>");
    });

    await t.test("parses links and images", () => {
        const linkHTML = parseMarkdown("[Link](https://example.com)");
        assert.match(linkHTML, /<a href="https:\/\/example.com" class="inline-link" target="_blank" rel="noopener noreferrer">Link<\/a>/);

        const imageHTML = parseMarkdown("![Alt text](image.png)");
        assert.match(imageHTML, /<img src="image.png" alt="Alt text"/);
    });

    await t.test("parses lists", () => {
        const unordered = parseMarkdown("- Item 1\n- Item 2");
        assert.equal(unordered, "<ul><li>Item 1</li><li>Item 2</li></ul>");

        const ordered = parseMarkdown("1. First\n2. Second");
        assert.equal(ordered, "<ol><li>First</li><li>Second</li></ol>");
    });

    await t.test("parses dividers", () => {
        assert.equal(parseMarkdown("---"), "<hr class='essay-divider'>");
        assert.equal(parseMarkdown("***"), "<hr class='essay-divider'>");
    });

    await t.test("parses tables", () => {
        const tableMD = "| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |";
        const tableHTML = parseMarkdown(tableMD);
        assert.match(tableHTML, /<table/);
        assert.match(tableHTML, /Header 1/);
        assert.match(tableHTML, /Cell 1/);
    });

    await t.test("parses checkboxes", () => {
        assert.equal(parseMarkdown("[ ] unchecked"), '<p><input type="checkbox" disabled style="margin-right:8px;"> unchecked</p>');
        assert.equal(parseMarkdown("[x] checked"), '<p><input type="checkbox" checked disabled style="margin-right:8px;"> checked</p>');
    });

    await t.test("parses wiki links", () => {
        const wiki = parseMarkdown("[[Concept]]");
        assert.match(wiki, /<a href="#" class="wiki-link" data-concept="Concept" title="Concept Node: Concept">\[\[ Concept \]\]<\/a>/);
    });

    await t.test("preserves drop caps", () => {
        const dropcap = parseMarkdown('<span class="drop-cap">A</span>bc');
        assert.equal(dropcap, '<p><span class="drop-cap">A</span>bc</p>');
    });
});
