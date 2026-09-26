import assert from 'node:assert/strict';
import test from 'node:test';
import { midSentence, plainText, postFaq, serviceFaq } from '../lib/faq.ts';

test('reads the questions section of a post, answers as plain text', () => {
  const body = [
    'Intro paragraph.',
    '## Questions',
    '### Is **Supabase** insecure?',
    'No. See [their docs](https://supabase.com) for `RLS`.',
    'A second paragraph.',
    '### What is row-level security?',
    '- A rule per row.',
    '## After',
    '### Not a question',
    'Ignored.',
  ].join('\n');
  assert.deepEqual(postFaq(body), [
    { q: 'Is Supabase insecure?', a: 'No. See their docs for RLS. A second paragraph.' },
    { q: 'What is row-level security?', a: 'A rule per row.' },
  ]);
});

test('no questions section, no questions', () => {
  assert.deepEqual(postFaq('## Heading\n### Q?\nA.'), []);
  assert.deepEqual(postFaq('## Questions\n### Unanswered?'), []);
});

test('plain text keeps link labels and drops markup', () => {
  assert.equal(plainText('**Bold** and [a link](/contact) and `code`'), 'Bold and a link and code');
});

test('service titles read naturally mid-sentence', () => {
  assert.equal(midSentence('Custom Software Development'), 'custom software development');
  assert.equal(midSentence('AI Model Development'), 'AI model development');
});

test('service questions come only from the service facts', () => {
  const qa = serviceFaq({
    title: 'Custom Software Development',
    approach: ['Map the workflow', 'Architect for scale', 'Ship in iterations'],
    capabilities: ['Web platforms', 'APIs and integrations'],
    outcomes: ['Hours saved every week', 'One source of truth'],
    stack: ['TypeScript', 'PostgreSQL'],
  });
  assert.equal(qa.length, 5);
  assert.equal(qa[0].q, 'What does HITROO’s custom software development include?');
  assert.equal(qa[0].a, 'Web platforms and APIs and integrations.');
  assert.equal(qa[1].a.startsWith('Map the workflow, then architect for scale, then ship in iterations.'), true);
  assert.equal(qa[2].a, 'Hours saved every week and one source of truth.');
  assert.equal(qa[3].a, 'Usually TypeScript and PostgreSQL, chosen to fit your business and your team.');
  const three = serviceFaq({ title: 'X', approach: ['A'], capabilities: ['Data modeling and databases', 'Dashboards', 'Cloud and hosting'], outcomes: ['O'], stack: ['S'] });
  assert.equal(three[0].a, 'Data modeling and databases, dashboards, and cloud and hosting.');
});
