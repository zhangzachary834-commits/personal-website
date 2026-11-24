const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const drawJs = fs.readFileSync(path.join(root, "studio-draw.js"), "utf8");
const studioHtml = fs.readFileSync(path.join(root, "studio.html"), "utf8");

test("2D Art Studio script remains syntactically valid", () => {
    assert.doesNotThrow(() => new vm.Script(drawJs));
});

test("2D Art Studio exposes shape and color sampling tools", () => {
    for (const tool of ["line", "rectangle", "ellipse", "eyedropper"]) {
        assert.match(studioHtml, new RegExp('data-draw-tool="' + tool + '"'));
        assert.ok(drawJs.includes('"' + tool + '"'), tool + " should be wired in studio-draw.js");
    }
});

test("2D Art Studio keeps editor affordances for constrained shapes and sampling", () => {
    assert.ok(drawJs.includes("e.shiftKey"), "shape tools should support Shift constraints");
    assert.ok(drawJs.includes("e.altKey"), "drawing tools should support temporary Alt/Option sampling");
    assert.ok(drawJs.includes("getImageData"), "eyedropper should sample rendered canvas pixels");
    assert.ok(drawJs.includes("DRAWABLE_TOOLS.has(stroke.tool)"), "new drawable tools should survive restore");
});
