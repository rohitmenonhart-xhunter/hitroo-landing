import assert from 'node:assert/strict';
import test from 'node:test';
import { isSameOrigin } from '../lib/request-security.ts';

function requestWith({
  origin,
  host,
  forwardedHost,
  nextHost = host,
}: {
  origin?: string;
  host: string;
  forwardedHost?: string;
  nextHost?: string;
}) {
  const headers = new Headers();
  if (origin) headers.set('origin', origin);
  headers.set('host', host);
  if (forwardedHost) headers.set('x-forwarded-host', forwardedHost);

  return {
    headers,
    nextUrl: new URL(`http://${nextHost}/api/lead`),
  };
}

test('allows requests without an Origin header', () => {
  assert.equal(isSameOrigin(requestWith({ host: 'hitroo.com' }) as never), true);
});

test('allows exact same-origin requests', () => {
  assert.equal(
    isSameOrigin(requestWith({ origin: 'https://hitroo.com', host: 'hitroo.com' }) as never),
    true
  );
});

test('uses the actual Host header when Next normalizes nextUrl in local dev', () => {
  assert.equal(
    isSameOrigin(
      requestWith({
        origin: 'http://127.0.0.1:3000',
        host: '127.0.0.1:3000',
        nextHost: 'localhost:3000',
      }) as never
    ),
    true
  );
});

test('treats localhost and 127.0.0.1 as equivalent on the same port', () => {
  assert.equal(
    isSameOrigin(
      requestWith({
        origin: 'http://127.0.0.1:3000',
        host: 'localhost:3000',
      }) as never
    ),
    true
  );
});

test('rejects cross-origin requests and loopback requests on a different port', () => {
  assert.equal(
    isSameOrigin(requestWith({ origin: 'https://evil.test', host: 'hitroo.com' }) as never),
    false
  );
  assert.equal(
    isSameOrigin(
      requestWith({
        origin: 'http://127.0.0.1:3001',
        host: 'localhost:3000',
      }) as never
    ),
    false
  );
});

test('does not let a forwarded host override the actual Host header', () => {
  assert.equal(
    isSameOrigin(
      requestWith({
        origin: 'https://evil.test',
        host: 'hitroo.com',
        forwardedHost: 'evil.test',
      }) as never
    ),
    false
  );
});
