import { listPosts, postUrl } from '@/lib/data/posts';
import { generalFaq } from '@/lib/faq';
import { COMPANY, PROCESS, services, SUPPORT, WHY_HITROO_STATEMENT } from '@/lib/site-data';
import { abs } from '@/lib/seo';

const SUMMARY =
  'HITROO is a software company that builds custom software, mobile and desktop apps, AI models, AI automation and computer-vision systems for businesses worldwide. One team designs, builds, security-tests and supports every project. Support runs through the HITROO app, with a first reply within 24 hours and most fixes within 48.';

const FACTS = [
  `What HITROO does: ${services.map((s) => s.title).join('; ')}.`,
  `Why HITROO: “${WHY_HITROO_STATEMENT.join(' ')}”`,
  `How HITROO works: ${PROCESS.join(' → ')}.`,
  'Who HITROO works with: enterprises, growing businesses, and founders and startups.',
  'Where: headquartered in Chennai, India; serves clients worldwide, in English.',
  `Contact: ${COMPANY.email} · ${COMPANY.phone} · ${abs('/contact')}`,
];

const text = (s: string) =>
  new Response(s, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });

/** /llms.txt — the llmstxt.org summary for AI assistants and answer engines. */
export async function llmsTxt() {
  const posts = await listPosts(undefined, 20);
  const lines = [
    '# HITROO',
    '',
    `> ${SUMMARY}`,
    '',
    ...FACTS.map((f) => `- ${f}`),
    '',
    '## Services',
    ...services.map((s) => `- [${s.title}](${abs(`/services/${s.slug}`)}): ${s.overview}`),
    '',
    '## Company',
    `- [About HITROO](${abs('/about')}): Powerful software, without the complexity.`,
    `- [Our view on AI](${abs('/ai-perspective')}): Is AI a threat to software firms? No — AI makes us faster; software a business runs on still takes a team.`,
    `- [Support — the HITROO app](${abs('/support')}): First reply in 24 hours, most fixes in 48; iOS, Android, Windows and macOS.`,
    `- [Research](${abs('/research')}): Applied AI, computer vision, automation and systems.`,
    `- [Contact](${abs('/contact')}): Tell us what you need; we reply within a day.`,
    `- [Careers](${abs('/careers')}): Software, AI/ML and hardware roles.`,
    `- [Newsroom](${abs('/news')}): Company news, press contact and brand kit.`,
    `- [Brand kit](${abs('/brand')}): Logo (SVG, PNG), colours and type.`,
    '',
    '## Insights',
    `- [Articles](${abs('/articles')}), [Blog](${abs('/blog')}) and [Newsroom](${abs('/news')})`,
    ...posts.map((p) => `- [${p.title}](${abs(postUrl(p))})${p.excerpt ? `: ${p.excerpt}` : ''}`),
    '',
    '## Optional',
    `- [Full details for AI assistants](${abs('/llms-full.txt')})`,
    '',
  ];
  return text(lines.join('\n'));
}

/** /llms-full.txt — full service details and common questions, in plain text. */
export async function llmsFullTxt() {
  const lines = [
    '# HITROO — full details',
    '',
    `> ${SUMMARY}`,
    '',
    ...FACTS.map((f) => `- ${f}`),
    '',
    ...services.flatMap((s) => [
      `## ${s.title}`,
      `URL: ${abs(`/services/${s.slug}`)}`,
      '',
      s.overview,
      '',
      `The problem it solves: ${s.pain}`,
      `How we work: ${s.approach.join(' → ')}.`,
      `What you get: ${s.capabilities.join('; ')}.`,
      `Results: ${s.outcomes.join('; ')}.`,
      `Technology: ${s.stack.join(', ')}.`,
      '',
    ]),
    '## Support',
    `Every project ships with the HITROO app. Steps: ${SUPPORT.steps.join(' → ')}. First reply within 24 hours, most fixes within 48. Available on ${SUPPORT.platforms.join(', ')}.`,
    '',
    '## Our view on AI',
    'AI can draft a prototype in hours; software a business runs on still takes a team that understands the business, designs the architecture and security, and tests, launches and supports it for years. HITROO uses AI inside an architecture it designs and controls, for faster iterations, behind layers of tests — so speed never costs quality. Smartphones didn’t replace the computer; they multiplied the software the world needs. AI will do the same.',
    '',
    '## Common questions',
    ...generalFaq(COMPANY.email, abs('/contact')).map((f) => `Q: ${f.q} A: ${f.a}`),
    '',
  ];
  return text(lines.join('\n'));
}
