const test = require('node:test');
const assert = require('node:assert/strict');
const { cacheKey } = require('../build-pulse.js');

test('cacheKey function tests', async (t) => {
    await t.test('generates correct key for a valid source object', () => {
        const source = { id: 'earthcall' };
        const result = cacheKey(source);
        assert.equal(result, 'dimension-build-pulse-v1:earthcall');
    });

    await t.test('generates correct key for a different source object', () => {
        const source = { id: 'site' };
        const result = cacheKey(source);
        assert.equal(result, 'dimension-build-pulse-v1:site');
    });

    await t.test('handles empty id', () => {
        const source = { id: '' };
        const result = cacheKey(source);
        assert.equal(result, 'dimension-build-pulse-v1:');
    });

    await t.test('handles numeric id', () => {
        const source = { id: 123 };
        const result = cacheKey(source);
        assert.equal(result, 'dimension-build-pulse-v1:123');
    });
});
