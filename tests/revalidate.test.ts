import assert from 'node:assert/strict';
import test from 'node:test';
import { ALWAYS, MARKETING_PATHS, pathsToRevalidate, revalidateSchema } from '../lib/revalidate.ts';

const parse = (body: unknown) => revalidateSchema.safeParse(body);

test('post paths work as before, and the post listings always refresh', () => {
  const r = parse({ paths: ['/blog/a-post', '/news/launch-day'] });
  assert.equal(r.success, true);
  if (!r.success) return;
  assert.deepEqual(r.data.content, []);
  const { paths, tags, all } = pathsToRevalidate(r.data, []);
  assert.deepEqual(tags, []);
  assert.equal(all, false);
  for (const p of [...ALWAYS, '/blog/a-post', '/news/launch-day']) assert.ok(paths.includes(p), p);
});

test('an empty body is fine', () => {
  const r = parse({});
  assert.equal(r.success, true);
  if (r.success) assert.deepEqual(pathsToRevalidate(r.data, []).paths.sort(), [...ALWAYS].sort());
});

test('content keys must match the database key rule', () => {
  for (const key of ['division:ai', 'page:support', 'company', 'faq:general', 'video:creatives']) assert.equal(parse({ content: [key] }).success, true, key);
  for (const key of ['Division:AI', 'a:b:c', '../etc', 'page:', ':ai', 'page support', '', 'x'.repeat(65)]) assert.equal(parse({ content: [key] }).success, false, key);
  assert.equal(parse({ content: 'division:ai' }).success, false, 'a list, not a string');
  assert.equal(parse({ content: Array.from({ length: 41 }, (_, i) => `key${i}`) }).success, false, 'at most 40 keys');
});

test('unknown fields and bad post paths are still refused', () => {
  assert.equal(parse({ content: ['home'], extra: true }).success, false);
  assert.equal(parse({ paths: ['/services/custom-software'] }).success, false);
  assert.equal(parse({ paths: ['/blog/../admin'] }).success, false);
});

test('a page key refreshes only its pages, and tags its cache entry', () => {
  const r = parse({ content: ['page:support'] });
  assert.equal(r.success, true);
  if (!r.success) return;
  const { paths, tags, all } = pathsToRevalidate(r.data, ['custom-software']);
  assert.equal(all, false);
  assert.deepEqual(tags, ['content:page:support']);
  assert.ok(paths.includes('/support'));
  assert.ok(!paths.includes('/about'));
  assert.ok(!paths.includes('/services/custom-software'));
});

test('a shared key refreshes every marketing page, service pages included', () => {
  for (const key of ['company', 'divisions', 'services', 'showcase', 'division:ai', 'engagements']) {
    const r = parse({ content: [key, 'home'] });
    assert.equal(r.success, true);
    if (!r.success) continue;
    const { paths, tags, all } = pathsToRevalidate(r.data, ['custom-software', 'vision-systems']);
    assert.equal(all, true, key);
    assert.deepEqual(tags, [`content:${key}`, 'content:home']);
    for (const p of [...MARKETING_PATHS, '/services/custom-software', '/services/vision-systems']) assert.ok(paths.includes(p), `${key}: ${p}`);
  }
});
