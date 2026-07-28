import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAutomationSignal,
  getTurnstileConfiguration,
  leadPayloadSchema,
  verifyTurnstileToken,
} from '../lib/lead-protection.ts';

const validPayload = {
  name: 'Asha Raman',
  email: 'asha@example.com',
  phone: '',
  interest: 'Custom Software Development',
  message: 'We need an internal operations dashboard.',
  leadType: 'contact' as const,
  website: '',
  formDurationMs: 8_000,
  turnstileToken: '',
};

test('accepts a legitimate email-based enquiry', () => {
  const parsed = leadPayloadSchema.parse(validPayload);
  assert.equal(parsed.email, 'asha@example.com');
  assert.equal(getAutomationSignal(parsed), null);
});

test('accepts common international phone formatting', () => {
  const parsed = leadPayloadSchema.parse({
    ...validPayload,
    email: '',
    phone: '+91 (75500) 00805',
  });
  assert.equal(parsed.phone, '+91 (75500) 00805');
});

test('rejects malformed contact details and unexpected fields', () => {
  assert.equal(
    leadPayloadSchema.safeParse({ ...validPayload, email: 'not-an-email' }).success,
    false
  );
  assert.equal(
    leadPayloadSchema.safeParse({
      ...validPayload,
      email: '',
      phone: 'vpnCriYZipKYLEaLNnlXgF',
    }).success,
    false
  );
  assert.equal(
    leadPayloadSchema.safeParse({ ...validPayload, injected: true }).success,
    false
  );
});

test('identifies the honeypot, missing timing, and implausibly fast submissions', () => {
  assert.equal(
    getAutomationSignal(leadPayloadSchema.parse({ ...validPayload, website: 'spam.test' })),
    'honeypot'
  );

  const { formDurationMs: _duration, ...withoutTiming } = validPayload;
  assert.equal(
    getAutomationSignal(leadPayloadSchema.parse(withoutTiming)),
    'missing-timing'
  );

  assert.equal(
    getAutomationSignal(leadPayloadSchema.parse({ ...validPayload, formDurationMs: 50 })),
    'too-fast'
  );
});

test('enables Turnstile only when both deployment keys are present', () => {
  assert.deepEqual(getTurnstileConfiguration({}), { state: 'disabled' });
  assert.deepEqual(
    getTurnstileConfiguration({ TURNSTILE_SITE_KEY: 'site' }),
    { state: 'incomplete' }
  );
  assert.deepEqual(
    getTurnstileConfiguration({
      TURNSTILE_SITE_KEY: 'site',
      TURNSTILE_SECRET_KEY: 'secret',
    }),
    { state: 'enabled', siteKey: 'site', secretKey: 'secret' }
  );
});

test('requires a successful Turnstile response for the contact action', async () => {
  const fetchImpl = async () =>
    new Response(JSON.stringify({ success: true, action: 'contact' }), { status: 200 });

  assert.deepEqual(
    await verifyTurnstileToken({
      token: 'valid-token',
      secretKey: 'secret',
      fetchImpl,
    }),
    { status: 'verified' }
  );

  const wrongActionFetch = async () =>
    new Response(JSON.stringify({ success: true, action: 'login' }), { status: 200 });

  assert.deepEqual(
    await verifyTurnstileToken({
      token: 'valid-token',
      secretKey: 'secret',
      fetchImpl: wrongActionFetch,
    }),
    { status: 'rejected', errorCodes: ['invalid-action-or-response'] }
  );
});
