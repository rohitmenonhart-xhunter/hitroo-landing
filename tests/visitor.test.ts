import assert from 'node:assert/strict';
import test from 'node:test';
import { edgeGeo, isBot, parseUserAgent } from '../lib/visitor.ts';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const MAC_CHROME = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const WIN_EDGE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0';

test('classifies device, browser and OS', () => {
  assert.deepEqual(parseUserAgent(IPHONE), { device: 'mobile', browser: 'Safari', os: 'iOS' });
  assert.deepEqual(parseUserAgent(MAC_CHROME), { device: 'desktop', browser: 'Chrome', os: 'macOS' });
  assert.deepEqual(parseUserAgent(WIN_EDGE), { device: 'desktop', browser: 'Edge', os: 'Windows' });
});

test('filters crawlers and scripts out of analytics', () => {
  assert.equal(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'), true);
  assert.equal(isBot('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)'), true);
  assert.equal(isBot('curl/8.7.1'), true);
  assert.equal(isBot(''), true);
  assert.equal(isBot(MAC_CHROME), false);
});

test('reads Vercel edge geolocation headers and decodes the city', () => {
  const headers = new Headers({ 'x-vercel-ip-country': 'IN', 'x-vercel-ip-country-region': 'TN', 'x-vercel-ip-city': 'Chennai%20City' });
  assert.deepEqual(edgeGeo(headers), { country: 'IN', region: 'TN', city: 'Chennai City' });
  assert.deepEqual(edgeGeo(new Headers()), { country: null, region: null, city: null });
});
