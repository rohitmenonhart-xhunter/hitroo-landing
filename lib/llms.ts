import { getContent } from '@/lib/content';
import { listPosts, postUrl } from '@/lib/data/posts';
import { WHY_HITROO_STATEMENT, type Company, type Division, type Service } from '@/lib/site-data';
import { abs } from '@/lib/seo';

const SUMMARY =
  'HITROO is one foundation for software, automation, AI and creative growth, with four divisions: Software (our own products, custom software, mobile and desktop apps, managed services), Automation (workflow automation and AI agents), AI (custom and in-house models, private LLMs, computer vision) and Creatives (social media, done for you: content, posting and analysis, with results in your dashboard). One team designs, builds, secures and supports everything it ships. Support comes from the engineers who built the software, through the HITROO app, where every request is followed from report to release.';

/** The facts every summary opens with, from the live content. */
async function content() {
  const [COMPANY, DIVISIONS, services, steps, support, faq] = await Promise.all([
    getContent('company'),
    getContent('divisions'),
    getContent('services'),
    getContent('steps'),
    getContent('page:support'),
    getContent('faq:general'),
  ]);
  return { COMPANY, DIVISIONS, services, support, faq, FACTS: facts(COMPANY, DIVISIONS, services, steps) };
}

const facts = (COMPANY: Company, DIVISIONS: Division[], services: Service[], steps: [string, string][]) => [
  `Divisions: ${DIVISIONS.map((d) => `${d.name} (${d.line.replace(/\.$/, '')})`).join('; ')}.`,
  `Services: ${services.map((s) => s.title).join('; ')}.`,
  `Why HITROO: “${WHY_HITROO_STATEMENT.join(' ')}”`,
  `How HITROO works: ${steps.map(([step]) => step).join(' → ')}.`,
  'Who HITROO works with: enterprises, growing businesses, and founders and startups.',
  'Where: headquartered in Chennai, India; serves clients worldwide, in English.',
  `Contact: ${COMPANY.email} · ${COMPANY.phone} · ${abs('/contact')}`,
];

const text = (s: string) =>
  new Response(s, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });

/** /llms.txt — the llmstxt.org summary for AI assistants and answer engines. */
export async function llmsTxt() {
  const [posts, { DIVISIONS, services, FACTS }] = await Promise.all([listPosts(undefined, 20), content()]);
  const lines = [
    '# HITROO',
    '',
    `> ${SUMMARY}`,
    '',
    ...FACTS.map((f) => `- ${f}`),
    '',
    '## Divisions',
    ...DIVISIONS.map((d) => `- [HITROO ${d.name}](${abs(`/${d.slug}`)}): ${d.overview}`),
    '',
    '## Services',
    ...services.map((s) => `- [${s.title}](${abs(`/services/${s.slug}`)}): ${s.overview}`),
    '',
    '## Company',
    `- [About HITROO](${abs('/about')}): One foundation, many ways forward: four divisions under one roof, to one standard.`,
    `- [Our view on AI](${abs('/ai-perspective')}): Is AI a threat to software firms? No — AI makes us faster; software a business runs on still takes a team.`,
    `- [Support — the HITROO app](${abs('/support')}): Support from the engineers who built the software; every request followed from report to release; iOS, Android, Windows and macOS.`,
    `- [Research](${abs('/research')}): Applied AI, computer vision, automation and systems.`,
    `- [Contact](${abs('/contact')}): Tell us what you need; we reply within a day.`,
    `- [Careers](${abs('/careers')}): Software, AI/ML and hardware roles.`,
    `- [Newsroom](${abs('/news')}): Company news, press contact and brand kit.`,
    `- [Brand kit](${abs('/brand')}): The wordmark (SVG, PNG), the glass wordmark, the app icon, colours and type.`,
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
  const { DIVISIONS, services, support, faq, FACTS } = await content();
  const lines = [
    '# HITROO — full details',
    '',
    `> ${SUMMARY}`,
    '',
    ...FACTS.map((f) => `- ${f}`),
    '',
    ...DIVISIONS.flatMap((d) => [
      `## HITROO ${d.name}`,
      `URL: ${abs(`/${d.slug}`)}`,
      '',
      d.overview,
      '',
      `Why it matters: ${d.statement.join(' ')}`,
      `What it does: ${d.offers.map((o) => `${o.title} (${o.text.replace(/\.$/, '')})`).join('; ')}.`,
      `What changes: ${d.outcomes.join(' ')}`,
      '',
    ]),
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
    `Every project ships with the HITROO app. Requests go straight to the engineers who built the software. Stages: ${support.stages.items.map(([stage]) => stage).join(' → ')}. Available on ${support.platforms.items.join(', ')}.`,
    '',
    '## Our view on AI',
    'AI can draft a prototype in hours; software a business runs on still takes a team that understands the business, designs the architecture and security, and tests, launches and supports it for years. HITROO uses AI inside an architecture it designs and controls, for faster iterations, behind layers of tests — so speed never costs quality. Smartphones didn’t replace the computer; they multiplied the software the world needs. AI will do the same.',
    '',
    '## Common questions',
    ...faq.map((f) => `Q: ${f.q} A: ${f.a}`),
    '',
  ];
  return text(lines.join('\n'));
}
