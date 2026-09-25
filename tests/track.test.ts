import assert from 'node:assert/strict';
import test from 'node:test';
import { clickHref, clickLabel, scrollDepth } from '../lib/track.ts';
import { trackPayloadSchema } from '../lib/track-schema.ts';

const ORIGIN = 'https://www.hitroo.com';
const ID = '3f2b8c1e-7a4d-4e5f-9b6a-1c2d3e4f5a6b';

test('click labels collapse whitespace and are capped', () => {
  assert.equal(clickLabel('  Start a\n   project  '), 'Start a project');
  assert.equal(clickLabel(''), undefined);
  assert.equal(clickLabel(null), undefined);
  assert.equal(clickLabel('x'.repeat(200))?.length, 80);
});

test('click targets keep paths for this site and drop query strings', () => {
  assert.equal(clickHref('/contact?email=someone@example.com', ORIGIN), '/contact');
  assert.equal(clickHref('https://www.hitroo.com/services/ai-automation#faq', ORIGIN), '/services/ai-automation#faq');
  assert.equal(clickHref('https://www.linkedin.com/company/hitroo?trk=x', ORIGIN), 'https://www.linkedin.com/company/hitroo');
  assert.equal(clickHref('mailto:info@hitroo.com', ORIGIN), 'mailto:info@hitroo.com');
  assert.equal(clickHref('javascript:alert(1)', ORIGIN), undefined);
  assert.equal(clickHref(null, ORIGIN), undefined);
});

test('scroll depth is a whole percentage between 0 and 100', () => {
  assert.equal(scrollDepth(450, 900), 50);
  assert.equal(scrollDepth(-20, 900), 0);
  assert.equal(scrollDepth(2000, 900), 100);
  assert.equal(scrollDepth(10, 0), 100);
});

test('track payloads: legacy page views, clicks and engagement', () => {
  assert.equal(trackPayloadSchema.safeParse({ path: '/', language: 'en-IN' }).success, true);
  assert.equal(trackPayloadSchema.safeParse({ type: 'view', path: '/about', visitId: ID, viewId: ID }).success, true);
  assert.equal(trackPayloadSchema.safeParse({ type: 'click', path: '/', label: 'Contact us', href: '/contact', visitId: ID }).success, true);
  assert.equal(trackPayloadSchema.safeParse({ type: 'engage', path: '/blog/x', seconds: 42, depth: 80, viewId: ID }).success, true);
});

test('track payloads reject unknown fields and out-of-range values', () => {
  assert.equal(trackPayloadSchema.safeParse({ type: 'engage', path: '/', seconds: -1, depth: 10 }).success, false);
  assert.equal(trackPayloadSchema.safeParse({ type: 'engage', path: '/', seconds: 5, depth: 101 }).success, false);
  assert.equal(trackPayloadSchema.safeParse({ type: 'click', path: '/', email: 'someone@example.com' }).success, false);
  assert.equal(trackPayloadSchema.safeParse({ type: 'view', path: 'https://evil.example/' }).success, false);
  assert.equal(trackPayloadSchema.safeParse({ type: 'click', path: '/', visitId: 'not-a-uuid' }).success, false);
});
