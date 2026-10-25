import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTENT_KEY_RE, CONTENT_KEYS, forEachMedia, isContentKey, resolveContent } from '../lib/content-core.ts';
import { CONTENT_DEFAULTS } from '../lib/content-defaults.ts';
import { CONTENT_SCHEMAS, checkContent } from '../lib/content-schema.ts';
import { MEDIA_ORIGIN, mediaUrl } from '../lib/media.ts';

const FALLBACK = { title: 'Built-in' };
const check = (data: unknown) => (data && typeof (data as { title?: unknown }).title === 'string' ? null : 'title: required');

test('without a database the built-in copy is used, and the database is never asked', async () => {
  let asked = false;
  const r = await resolveContent({ enabled: false, load: async () => ((asked = true), { title: 'DB' }), fallback: FALLBACK, check });
  assert.equal(asked, false);
  assert.deepEqual(r, { data: FALLBACK, source: 'default', reason: 'no-database' });
});

test('a failing query falls back to the built-in copy', async () => {
  const r = await resolveContent({
    enabled: true,
    load: async () => {
      throw new Error('connect ETIMEDOUT');
    },
    fallback: FALLBACK,
    check,
  });
  assert.equal(r.data, FALLBACK);
  assert.equal(r.reason, 'error');
  assert.match(r.detail ?? '', /ETIMEDOUT/);
});

test('a missing row falls back to the built-in copy', async () => {
  for (const missing of [null, undefined]) {
    const r = await resolveContent({ enabled: true, load: async () => missing, fallback: FALLBACK, check });
    assert.equal(r.data, FALLBACK);
    assert.equal(r.reason, 'missing');
  }
});

test('a saved copy with the wrong shape falls back to the built-in copy', async () => {
  const r = await resolveContent({ enabled: true, load: async () => ({ heading: 'no title' }), fallback: FALLBACK, check });
  assert.equal(r.data, FALLBACK);
  assert.equal(r.reason, 'invalid');
});

test('a good saved copy is used as it is', async () => {
  const saved = { title: 'From the admin', extra: [1, 2] };
  const r = await resolveContent({ enabled: true, load: async () => saved, fallback: FALLBACK, check });
  assert.equal(r.source, 'database');
  assert.equal(r.data, saved);
});

test('every key is valid for the database and has a schema and a default', () => {
  assert.equal(new Set(CONTENT_KEYS).size, CONTENT_KEYS.length);
  for (const key of CONTENT_KEYS) {
    assert.match(key, CONTENT_KEY_RE, key);
    assert.ok(CONTENT_SCHEMAS[key], `schema for ${key}`);
    assert.ok(CONTENT_DEFAULTS[key], `default for ${key}`);
  }
  assert.deepEqual(Object.keys(CONTENT_DEFAULTS).sort(), [...CONTENT_KEYS].sort());
  assert.equal(isContentKey('division:ai'), true);
  assert.equal(isContentKey('division:web'), false);
});

test('every built-in default passes its own schema and is plain JSON', () => {
  for (const key of CONTENT_KEYS) {
    const data = CONTENT_DEFAULTS[key];
    assert.equal(checkContent(key, data), null, key);
    assert.deepEqual(JSON.parse(JSON.stringify(data)), data, `${key} survives JSON`);
  }
});

test('the schemas catch what would break a page', () => {
  const divisions = structuredClone(CONTENT_DEFAULTS.divisions);
  assert.match(checkContent('divisions', divisions.slice(1)) ?? '', /four divisions/);

  const ai = structuredClone(CONTENT_DEFAULTS['division:ai']);
  assert.match(checkContent('division:ai', { ...ai, slug: 'software' }) ?? '', /slug must be ai/);
  assert.notEqual(checkContent('division:ai', { ...ai, faq: 'none' }), null);

  const services = structuredClone(CONTENT_DEFAULTS.services);
  assert.notEqual(checkContent('services', [{ ...services[0], title: undefined }]), null);
  assert.notEqual(checkContent('services', [services[0], services[0]]), null, 'duplicate slugs');
  assert.notEqual(checkContent('services', [{ ...services[0], slug: 'Not A Slug' }]), null);

  const quote = structuredClone(CONTENT_DEFAULTS.quote);
  assert.notEqual(checkContent('quote', { ...quote, photo: { alt: 'no src' } }), null);
});

test('the schemas allow what the admin may save: extra fields, nulls, storage images', () => {
  const page = structuredClone(CONTENT_DEFAULTS['division:software']);
  const stored = {
    ...page,
    note: 'an extra field',
    flow: null,
    visual: {
      src: 'https://hitroo-media.fly.storage.tigris.dev/img/0123abcd-software-code-1536.webp',
      alt: 'The code symbol in clear glass',
      width: 1536,
      height: 1024,
      tone: '#8a8f7a',
      position: null,
      variants: [
        { w: 480, url: 'https://hitroo-media.fly.storage.tigris.dev/img/0123abcd-software-code-480.webp' },
        { w: 1536, url: 'https://hitroo-media.fly.storage.tigris.dev/img/0123abcd-software-code-1536.webp' },
      ],
    },
  };
  assert.equal(checkContent('division:software', stored), null);
  const fan = structuredClone(CONTENT_DEFAULTS['page:creatives']);
  fan.fan[0] = { ...fan.fan[0], tint: 'a colour we have never heard of' as never };
  assert.equal(checkContent('page:creatives', fan), null);
});

test('media slots are found anywhere in the content', () => {
  const found: string[] = [];
  forEachMedia(CONTENT_DEFAULTS['page:creatives'], (slot) => found.push(slot.src));
  assert.equal(found.length, 6, 'five fan reels and the winner');
  const all = new Set<string>();
  for (const key of CONTENT_KEYS) forEachMedia(CONTENT_DEFAULTS[key], (slot) => all.add(slot.src.split('?')[0]));
  for (const src of all) assert.match(src, /^(\/(photos|people|video)\/|https:\/\/hitroo-media\.fly\.storage\.tigris\.dev\/vid\/)/, src);
});

test('storage images load from our origin; videos and other files load as they are', () => {
  assert.equal(mediaUrl(`${MEDIA_ORIGIN}/img/abc-hero-960.webp`), '/media/img/abc-hero-960.webp');
  // Videos are fetched in byte ranges, which Vercel's cache would store as the whole file.
  assert.equal(mediaUrl(`${MEDIA_ORIGIN}/vid/abc-myth.mp4`), `${MEDIA_ORIGIN}/vid/abc-myth.mp4`);
  assert.equal(mediaUrl(`${MEDIA_ORIGIN}/orig/abc.png`), `${MEDIA_ORIGIN}/orig/abc.png`);
  assert.equal(mediaUrl('/photos/home.webp?v=1'), '/photos/home.webp?v=1');
});
