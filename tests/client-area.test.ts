import assert from 'node:assert/strict';
import test from 'node:test';
import { errorCode, fromOurPage } from '../lib/client/forms.ts';
import { ago, greeting, inr } from '../lib/client/format.ts';

const post = (headers: Record<string, string>) => new Request('https://my.hitroo.com/d/x/send', { method: 'POST', headers: { host: 'my.hitroo.com', ...headers } });

test('client-area forms are accepted only from our own pages', () => {
  assert.equal(fromOurPage(post({ origin: 'https://my.hitroo.com', 'sec-fetch-site': 'same-origin' })), true);
  assert.equal(fromOurPage(post({ origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' })), false);
  assert.equal(fromOurPage(post({ origin: 'https://www.hitroo.com', 'sec-fetch-site': 'same-site' })), false, 'another hitroo.com site is not our page');
  assert.equal(fromOurPage(post({ origin: 'https://evil.example' })), false, 'old browsers: the origin decides');
  assert.equal(fromOurPage(post({ origin: 'https://my.hitroo.com', 'x-forwarded-host': 'my.hitroo.com' })), true);
});

test('only fixed codes travel in the address, never the API\'s own words', () => {
  assert.equal(errorCode({ status: 400, code: 'invalid', message: 'Call this number…' }, 'short'), 'short');
  assert.equal(errorCode({ status: 400, code: 'refused', message: '3 quotes are already open (Q-0001…)' }, 'short'), 'refused');
  assert.equal(errorCode({ status: 429, code: 'rate_limited', message: '' }, 'short'), 'busy');
  const quiet = console.error;
  console.error = () => {};
  assert.equal(errorCode(new Error('socket hang up'), 'short'), 'failed');
  console.error = quiet;
});

test('money and times read the Indian way', () => {
  assert.equal(inr(106000), '₹1,06,000');
  assert.equal(inr(54282.5), '₹54,282.5');
  const now = Date.parse('2026-11-02T12:00:00Z');
  assert.equal(ago('2026-11-02T11:59:30Z', now), 'just now');
  assert.equal(ago('2026-11-02T09:00:00Z', now), '3 hours ago');
  assert.equal(ago('2026-11-01T10:00:00Z', now), 'yesterday');
  assert.equal(greeting(new Date('2026-11-02T03:00:00Z')), 'Good morning', '8:30 in India');
  assert.equal(greeting(new Date('2026-11-02T13:00:00Z')), 'Good evening', '18:30 in India');
});
