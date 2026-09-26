// Question-and-answer content for pages and for FAQPage structured data (search and AI answer engines).
// Pure functions only: facts come in as arguments, so this file stays testable without the app's aliases.

export interface Qa {
  q: string;
  a: string;
}

/** Post-body inline markup (**bold**, [label](url), `code`) as plain text. */
export function plainText(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

/**
 * The questions in a post's "## Questions" (or "## FAQ") section: each "### question" with the paragraphs
 * after it as the answer, up to the next "## " heading.
 */
export function postFaq(body: string): Qa[] {
  const lines = body.split('\n').map((l) => l.trim());
  const start = lines.findIndex((l) => /^## (questions|faqs?|frequently asked questions)\s*$/i.test(l));
  if (start < 0) return [];
  const out: Qa[] = [];
  let q: string | null = null;
  let a: string[] = [];
  const push = () => {
    if (q && a.length) out.push({ q: plainText(q), a: a.join(' ') });
  };
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break;
    if (line.startsWith('### ')) {
      push();
      q = line.slice(4);
      a = [];
    } else if (line && q) {
      a.push(plainText(line.replace(/^[-*] /, '')));
    }
  }
  push();
  return out;
}

/** "Custom Software Development" → "custom software development"; acronyms such as AI stay as they are. */
export const midSentence = (title: string) => title.replace(/\b([A-Z])([a-z])/g, (_, a: string, b: string) => a.toLowerCase() + b);

const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
/** "a and b"; "a, b, and c" — the last comma keeps items that contain "and" readable. */
const list = (items: string[]) =>
  items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;

/** Five questions a buyer asks about one service, answered only from the service's own facts. */
export function serviceFaq(s: { title: string; approach: string[]; capabilities: string[]; outcomes: string[]; stack: string[] }): Qa[] {
  const t = midSentence(s.title);
  return [
    { q: `What does HITROO’s ${t} include?`, a: `${list(s.capabilities.map((c, i) => (i ? lowerFirst(c) : c)))}.` },
    {
      q: `How does HITROO deliver ${t}?`,
      a: `${s.approach.map((step, i) => (i ? lowerFirst(step) : step)).join(', then ')}. You see working software early, and every change is tested before it ships.`,
    },
    { q: `What does ${t} change for a business?`, a: `${list(s.outcomes.map((o, i) => (i ? lowerFirst(o) : o)))}.` },
    { q: `Which technology does HITROO use for ${t}?`, a: `Usually ${list(s.stack)}, chosen to fit your business and your team.` },
    { q: `Is ${t} supported after launch?`, a: 'Yes. Support runs through the HITROO app, with a first reply within 24 hours and most fixes within 48.' },
  ];
}

/** The questions most people ask before they contact us. */
export function generalFaq(email: string, contactUrl: string): Qa[] {
  return [
    { q: 'What does HITROO build?', a: 'Custom software, mobile and desktop apps, AI models, AI automation, computer-vision systems and managed services.' },
    { q: 'How does HITROO work?', a: 'In short iterations, with working software early: Discover, Design, Build, Test & secure, Launch and Support.' },
    { q: 'Does HITROO support software after launch?', a: 'Yes. Through the HITROO app, with a first reply within 24 hours and most fixes within 48.' },
    { q: 'Who does HITROO work with?', a: 'Enterprises, growing businesses, and founders and startups, worldwide.' },
    { q: 'How do I start a project?', a: `Tell us what you need at ${contactUrl} or ${email}. We reply within a day.` },
  ];
}
