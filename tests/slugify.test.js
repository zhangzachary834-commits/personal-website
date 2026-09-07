const test = require("node:test");
const assert = require("node:assert/strict");
const { slugify } = require("../script.js");

test("slugify function tests", async (t) => {
    await t.test("converts standard text to lowercase hyphenated slug", () => {
        assert.equal(slugify("Hello World"), "hello-world");
        assert.equal(slugify("Dimension of Thought"), "dimension-of-thought");
    });

    await t.test("strips special characters and punctuation", () => {
        assert.equal(slugify("Hello World!"), "hello-world");
        assert.equal(slugify("What's up @2026? #awesome!"), "whats-up-2026-awesome");
        assert.equal(slugify("c++20 & WebGPU: systems programming"), "c20-webgpu-systems-programming");
    });

    await t.test("trims leading and trailing whitespace and condenses multiple spaces", () => {
        assert.equal(slugify("   leading and trailing spaces   "), "leading-and-trailing-spaces");
        assert.equal(slugify("multiple    spaces    between    words"), "multiple-spaces-between-words");
        assert.equal(slugify(" \t\n newlines  and  tabs \n "), "newlines-and-tabs");
    });

    await t.test("preserves existing hyphens and numbers", () => {
        assert.equal(slugify("post-123-version-2"), "post-123-version-2");
        assert.equal(slugify("part 1 - introduction"), "part-1---introduction");
    });

    await t.test("handles null, undefined, and empty string inputs with default fallback", () => {
        assert.equal(slugify(""), "my-essay");
        assert.equal(slugify(null), "my-essay");
        assert.equal(slugify(undefined), "my-essay");
    });

    await t.test("handles inputs containing only special characters or spaces with default fallback", () => {
        assert.equal(slugify("!!!"), "my-essay");
        assert.equal(slugify("   "), "my-essay");
        assert.equal(slugify("   #$%^&*   "), "my-essay");
    });
});
