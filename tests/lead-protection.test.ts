import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAutomationSignal,
  getTurnstileConfiguration,
  leadPayloadSchema,
  mayAcknowledge,
  mayNotify,
  submissionLimited,
  verifyTurnstileToken,
} from '../lib/lead-protection.ts';

const HOUR = 60 * 60_000;

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

test('discards submissions containing a second bare phone number as the message', () => {
  const parsed = leadPayloadSchema.parse({
    ...validPayload,
    name: 'Sample Visitor',
    phone: '5386024367',
    message: '7071832801',
  });

  assert.equal(getAutomationSignal(parsed), 'phone-only-message');
});

test('allows phone numbers in legitimate prose and repeated contact details', () => {
  assert.equal(
    getAutomationSignal(
      leadPayloadSchema.parse({
        ...validPayload,
        phone: '+91 75500 00805',
        message: 'Please call our office on +91 75500 00806 after 3 PM.',
      })
    ),
    null
  );

  assert.equal(
    getAutomationSignal(
      leadPayloadSchema.parse({
        ...validPayload,
        phone: '+91 75500 00805',
        message: '+91 75500 00805',
      })
    ),
    null
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

test('limits enquiries per visitor: 5 a minute, 20 an hour', () => {
  const start = Date.UTC(2030, 0, 1);
  const ip = '203.0.113.1';
  for (let minute = 0; minute < 4; minute++) {
    const t = start + minute * 61_000;
    for (let i = 0; i < 5; i++) assert.equal(submissionLimited('lead', ip, t), false);
    assert.equal(submissionLimited('lead', ip, t), true, 'sixth in a minute');
  }
  assert.equal(submissionLimited('lead', ip, start + 4 * 61_000), true, '21st in an hour');
  assert.equal(submissionLimited('lead', '203.0.113.2', start), false, 'other visitors are unaffected');
  assert.equal(submissionLimited('lead', ip, start + HOUR + 5 * 61_000), false, 'allowed again after the hour');
});

test('limits applications per visitor: 3 a minute', () => {
  const t = Date.UTC(2030, 1, 1);
  for (let i = 0; i < 3; i++) assert.equal(submissionLimited('careers', '198.51.100.7', t), false);
  assert.equal(submissionLimited('careers', '198.51.100.7', t), true);
});

test('acknowledges each address at most once an hour, and 30 an hour in all', () => {
  const t = Date.UTC(2030, 2, 1);
  assert.equal(mayAcknowledge('Asha@Example.com', t), true);
  assert.equal(mayAcknowledge(' asha@example.com ', t + 1_000), false, 'same address, any case');
  assert.equal(mayAcknowledge('asha@example.com', t + HOUR + 1_000), true, 'again after an hour');

  const t2 = Date.UTC(2030, 3, 1);
  for (let i = 0; i < 30; i++) assert.equal(mayAcknowledge(`person${i}@example.com`, t2), true);
  assert.equal(mayAcknowledge('person30@example.com', t2), false, 'the 31st in an hour');
});

test('emails the team about at most 60 submissions an hour', () => {
  const t = Date.UTC(2030, 4, 1);
  for (let i = 0; i < 60; i++) assert.equal(mayNotify(t), true);
  assert.equal(mayNotify(t), false);
  assert.equal(mayNotify(t + HOUR), true, 'a new hour');
});
