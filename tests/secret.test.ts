import assert from 'node:assert/strict';
import test from 'node:test';
import { sameSecret } from '../lib/secret.ts';

test('accepts only the exact secret', () => {
  assert.equal(sameSecret('s3cret-key', 's3cret-key'), true);
  assert.equal(sameSecret('s3cret-key', 's3cret-kez'), false);
  assert.equal(sameSecret('s3cret-key', 's3cret-key '), false);
  assert.equal(sameSecret('s3cret-key', ''), false);
});

test('an unset secret never matches, not even an empty guess', () => {
  assert.equal(sameSecret('', ''), false);
});

test('compares bytes, so non-ASCII keys work', () => {
  assert.equal(sameSecret('clé-ü', 'clé-ü'), true);
  assert.equal(sameSecret('clé-ü', 'cle-u'), false);
});
