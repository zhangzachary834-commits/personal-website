const test = require("node:test");
const assert = require("node:assert/strict");

const {
    normalizePersonClaims,
    emptyWorkspace,
    normalizeWorkspace,
    applyLegacyPayload
} = require("../studio-person.js");

test("Google identity is represented as a provider relation to a Person", () => {
    const person = normalizePersonClaims({
        sub: "123456789",
        name: "Zachary Zhang",
        email: "z@example.com",
        picture: "https://example.test/avatar.png"
    });

    assert.equal(person.id, "google:123456789");
    assert.equal(person.displayName, "Zachary Zhang");
    assert.equal(person.providerIdentity.provider, "google");
    assert.equal(person.providerIdentity.subject, "123456789");
});

test("private workspace rejects a different Person identity", () => {
    const person = normalizePersonClaims({ sub: "person-a", name: "A" });
    assert.throws(() => normalizeWorkspace({
        person: { id: "google:person-b" },
        drafts: []
    }, person), /different Person/);
});

test("legacy browser work can be migrated into a Person Workspace", () => {
    const person = normalizePersonClaims({ sub: "person-a", name: "A" });
    const workspace = emptyWorkspace(person);
    applyLegacyPayload(workspace, {
        drafts: [{ id: "draft-1", title: "Private Draft" }],
        activeDraftId: "draft-1",
        artwork: { version: 1, strokes: [] },
        studioMode: "draw"
    });

    assert.equal(workspace.drafts.length, 1);
    assert.equal(workspace.activeDraftId, "draft-1");
    assert.equal(workspace.artwork.version, 1);
    assert.equal(workspace.studioMode, "draw");
});
