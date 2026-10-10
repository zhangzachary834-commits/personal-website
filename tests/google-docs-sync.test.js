const test = require("node:test");
const assert = require("node:assert/strict");

const {
    extractDocumentId,
    extractDocumentText,
    getDocumentEndIndex
} = require("../studio-google-docs.js");

test("extractDocumentId accepts Docs URLs and bare IDs", () => {
    const id = "1AbCdEfGhIjKlMnOpQrStUvWxYz_12345";
    assert.equal(
        extractDocumentId("https://docs.google.com/document/d/" + id + "/edit?tab=t.0"),
        id
    );
    assert.equal(extractDocumentId(id), id);
    assert.equal(extractDocumentId("not a doc"), "");
});

test("extractDocumentText removes only the Google-owned terminal newline", () => {
    const resource = {
        body: {
            content: [
                {
                    endIndex: 8,
                    paragraph: {
                        elements: [{ textRun: { content: "hello\n\n" } }]
                    }
                }
            ]
        }
    };

    assert.equal(extractDocumentText(resource), "hello\n");
    assert.equal(getDocumentEndIndex(resource), 8);
});

test("extractDocumentText supports tabbed Docs responses", () => {
    const resource = {
        tabs: [{
            tabProperties: { tabId: "t.abc" },
            documentTab: {
                body: {
                    content: [{
                        endIndex: 7,
                        paragraph: {
                            elements: [{ textRun: { content: "hello\n" } }]
                        }
                    }]
                }
            }
        }]
    };

    assert.equal(extractDocumentText(resource), "hello");
    assert.equal(getDocumentEndIndex(resource), 7);
});
