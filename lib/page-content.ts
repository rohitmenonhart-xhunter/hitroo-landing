import { REEL_STYLES } from './creatives-library.ts';
import type { Reel } from './division-pages';
import { asReel } from './reels.ts';
import type { Qa } from './faq';
import type { Point } from './site-data';

export type { Qa };

/*
 * Each page's own copy (what used to be written inline in its page component). Like lib/site-data.ts these are the
 * built-in defaults: the live copy is in web.content under the keys noted below, edited in the admin.
 * Section shape throughout: { caption, title, lede?, items? }; links are { href, title, text }.
 */

export interface PageMeta {
  title: string;
  description: string;
}
export interface LinkItem {
  href: string;
  title: string;
  text: string;
}
interface Heading {
  caption: string;
  title: string;
}

/* ------------------------------------------------------------------
   Home (key `home`)
   ------------------------------------------------------------------ */

export interface HomeContent {
  meta: PageMeta;
  /** Under the live glass wordmark; each tag keeps its icon by position. */
  hero: { title: string; lede: string; action: string; tags: string[] };
  why: { caption: string; text: string };
  divisions: Heading & { explore: string; discuss: string; standards: string; partner: { caption: string; title: string; text: string; action: string } };
  marquee: { label: string; items: string[] };
  steps: Heading;
  promises: Heading;
  need: Heading & { lede: string; prompt: string; placeholder: string; items: string[] };
  posts: { title: string };
  faq: { title: string };
  contact: { title: string; text: string; link: string };
}

export const HOME: HomeContent = {
  meta: {
    title: 'hitroo | Software, Automation, AI & Social Media',
    description:
      'HITROO engineers custom software, automation and AI around how your business actually works, and runs your social media for you. We design it, build it and keep it running.',
  },
  hero: {
    title: 'The quiet machinery behind ambitious businesses.',
    lede: 'Software, automation and AI engineered around how you actually work, and kept running by the people who built it.',
    action: 'Book a free call',
    tags: ['Custom software', 'Mobile apps', 'Desktop apps', 'Automation', 'AI models', 'Vision systems', 'Social media', 'Support'],
  },
  why: {
    caption: 'Why HITROO',
    text: 'Most software is built to be delivered. Ours is built to be depended on: designed with your team, proven in production and kept running by the people who wrote it.',
  },
  divisions: {
    caption: 'The foundation',
    title: 'Four divisions. One standard.',
    explore: 'Explore',
    discuss: 'Discuss a project',
    standards: 'Standards',
    partner: {
      caption: 'One partner',
      title: 'Start with one division. Grow into the rest.',
      text: 'Every division shares one standard and one support line, so your second project starts where the first one ended.',
      action: 'Book a free call',
    },
  },
  marquee: {
    label: 'What we build',
    items: ['Web platforms', 'Mobile apps', 'Desktop apps', 'Workflow automation', 'AI agents', 'Custom models', 'Vision systems', 'Social media'],
  },
  steps: { caption: 'How we deliver', title: 'Built in the open, one release at a time.' },
  promises: { caption: 'What you can count on', title: 'Promises you can hold us to.' },
  need: {
    caption: 'Get started',
    title: 'What should we build first?',
    lede: 'Pick everything that applies. We’ll come back within a day to plan it with you.',
    prompt: 'I need',
    placeholder: '…select one or more below',
    items: [
      'A web platform or portal',
      'A mobile application',
      'A desktop application',
      'An internal business system',
      'Workflow automation',
      'A custom AI model',
      'A vision inspection system',
      'Social media management',
      'Support for existing software',
    ],
  },
  posts: { title: 'Field notes' },
  faq: { title: 'Questions we hear first' },
  contact: {
    title: 'Tell us what’s slowing you down.',
    text: 'Answered within a day by the people who would build it. The first call is free.',
    link: 'More ways to reach us',
  },
};

/* ------------------------------------------------------------------
   About (key `page:about`)
   ------------------------------------------------------------------ */

export interface AboutContent {
  meta: PageMeta;
  intro: Heading & { lede: string };
  story: { caption: string; lines: [string, string] };
  divisions: Heading;
  beliefs: Heading & { items: Point[] };
  how: Heading;
  promises: Heading;
  where: Heading & { items: Point[] };
  view: { caption: string; lines: [string, string]; link: { href: string; label: string } };
  explore: Heading & { links: LinkItem[] };
  closing: { title: string; line: string };
}

export const ABOUT_PAGE: AboutContent = {
  meta: {
    title: 'About us',
    description: 'HITROO is a software company building custom software, automation and AI for businesses of every size — fast delivery and support long after launch.',
  },
  intro: {
    caption: 'About HITROO',
    title: 'One foundation. Many ways forward.',
    lede: 'HITROO is where software, automation, AI and creatives are built under one roof, to one standard.',
  },
  story: { caption: 'Why we started', lines: ['Advanced technology became too costly and too complex.', 'We make it simple, and within reach.'] },
  divisions: { caption: 'Our divisions', title: 'Four divisions, one standard.' },
  beliefs: {
    caption: 'What we believe',
    title: 'Four things we won’t compromise on.',
    items: [
      { title: 'End to end', text: 'The people who build your software also support it.' },
      { title: 'Made with taste', text: 'Software people enjoy using. Brands people remember.' },
      { title: 'Curious by default', text: 'We study hard problems, then ship the answers.' },
      { title: 'We stay after launch', text: 'Support in one app, long after go-live.' },
    ],
  },
  how: { caption: 'How we work', title: 'Working software early, tested at every step.' },
  promises: { caption: 'What you can count on', title: 'Promises we keep.' },
  where: {
    caption: 'Where we are',
    title: 'Based in India. Working with the world.',
    items: [
      { title: 'Headquarters', text: 'Chennai, Tamil Nadu, India.' },
      { title: 'Clients', text: 'Businesses around the world.' },
      { title: 'Language', text: 'We work in English.' },
    ],
  },
  view: {
    caption: 'Our view',
    lines: ['Is AI a threat to software firms?', 'No. It makes the good ones faster.'],
    link: { href: '/ai-perspective', label: 'Read our view' },
  },
  explore: {
    caption: 'Explore',
    title: 'See more of HITROO.',
    links: [
      { href: '/research', title: 'Research', text: 'The hard problems we study, and ship.' },
      { href: '/support', title: 'Support', text: 'How we look after what we build.' },
      { href: '/news', title: 'Newsroom', text: 'Company news and announcements.' },
      { href: '/brand', title: 'Brand kit', text: 'Our logo, colours and type.' },
    ],
  },
  closing: { title: 'Let’s build what’s next.', line: 'Tell us where you want to go. We reply within a day.' },
};

/* ------------------------------------------------------------------
   Support: the HITROO app (key `page:support`)
   ------------------------------------------------------------------ */

export interface SupportContent {
  meta: PageMeta;
  intro: Heading & { lede: string; action: string };
  manifesto: { caption: string; text: string };
  /** Every request's stages, as the app shows them. */
  stages: Heading & { items: [string, string][] };
  /** What clients can raise. */
  topics: Heading & { lede: string; items: Point[] };
  /** Where the app runs; each name keeps its device icon (iOS, Android, Windows, macOS). */
  platforms: Heading & { items: string[] };
  promises: Heading;
  faq: { title: string; items: Qa[] };
  next: Heading & { links: LinkItem[] };
  closing: { title: string; line: string; action: string };
}

export const SUPPORT_PAGE: SupportContent = {
  meta: {
    title: 'Support',
    description: 'Support from the engineers who built your software: raise a request from any device and follow it from report to release in the HITROO app.',
  },
  intro: {
    caption: 'Support',
    title: 'The people who built it are one tap away.',
    lede: 'Every request goes straight to the engineers who wrote your software. Follow it from report to release in the HITROO app.',
    action: 'Start a project',
  },
  manifesto: {
    caption: 'How support works here',
    text: 'No call centre, no scripts, no hand-offs. The people who built your software are the people who fix it, and they already know where to look.',
  },
  stages: {
    caption: 'From report to release',
    title: 'Every request, in plain sight.',
    items: [
      ['Report', 'Raise it from any device, in your own words. Bug, change, question or idea.'],
      ['Triage', 'It lands with the engineers who know your system, not a queue that has to learn it.'],
      ['Fix', 'Built, tested and released like any other change, never patched in a hurry.'],
      ['Follow', 'Every stage shows in the app as it happens, so you never have to ask for an update.'],
    ],
  },
  topics: {
    caption: 'What you can raise',
    title: 'Bugs, changes, questions, ideas.',
    lede: 'One place for everything about your software.',
    items: [
      { title: 'Something broke', text: 'We trace the cause, fix it and tell you why it happened.' },
      { title: 'A change', text: 'New fields, reports and rules, shipped like any release.' },
      { title: 'A question', text: 'Answered by someone who knows how it was built.' },
      { title: 'A new idea', text: 'Your next feature, scoped with you.' },
    ],
  },
  platforms: { caption: 'Where', title: 'On every screen your team uses.', items: ['iOS', 'Android', 'Windows', 'macOS'] },
  promises: { caption: 'What you can count on', title: 'Promises you can hold us to.' },
  faq: {
    title: 'Questions about support',
    items: [
      { q: 'Who answers our requests?', a: 'The engineers who built your software. There is no call centre in between.' },
      { q: 'Is support only for bugs?', a: 'No. Changes, questions and new ideas go through the same app, to the same team.' },
      { q: 'Where do we raise a request?', a: 'In the HITROO app, on iOS, Android, Windows or macOS.' },
      { q: 'Can we see what’s happening?', a: 'Yes. Every request shows where it stands, from report to release.' },
    ],
  },
  next: {
    caption: 'Not a client yet?',
    title: 'Want support like this?',
    links: [
      { href: '/services', title: 'Everything we do', text: 'Four divisions, one standard.' },
      { href: '/contact', title: 'Book a free call', text: 'Bring the problem. Leave with a clear next step.' },
    ],
  },
  closing: { title: 'Build with the team that stays.', line: 'Every project ships with the HITROO app, and the engineers behind it.', action: 'Book a free call' },
};

/* ------------------------------------------------------------------
   Contact (key `page:contact`)
   ------------------------------------------------------------------ */

export interface ContactContent {
  meta: PageMeta;
  intro: Heading & { lede: string };
  /** The card beside the enquiry form. */
  panel: { title: string; text: string };
  next: Heading & { lede: string; items: [string, string][] };
  faq: { title: string; items: Qa[] };
  explore: Heading & { links: LinkItem[] };
}

export const CONTACT_PAGE: ContactContent = {
  meta: { title: 'Contact us', description: 'Tell us what you need — custom software, apps, automation or AI. We reply within a day.' },
  intro: { caption: 'Contact', title: 'Let’s talk.', lede: 'Tell us where you want to go. We reply within a day.' },
  panel: { title: 'Tell us about your project.', text: 'Answered within a day by the people who would build it. The first call is free.' },
  next: {
    caption: 'What happens next',
    title: 'From hello to a plan.',
    lede: 'No pressure and no jargon. Just a clear next step.',
    items: [
      ['You tell us', 'What you need, in your own words.'],
      ['We reply', 'Within a day, from the people who would do the work.'],
      ['A free call', 'Your goals, constraints and timeline, mapped together.'],
      ['You get a plan', 'A clear scope and estimate, in writing.'],
    ],
  },
  faq: {
    title: 'Before you write',
    items: [
      { q: 'Do I need a detailed brief?', a: 'No. A few lines about what you want is enough. We’ll ask the rest.' },
      { q: 'Can I just call?', a: 'Yes. The number is beside the form, and email works too.' },
      { q: 'How fast will you reply?', a: 'Within a day, by email or phone, whichever you prefer.' },
      { q: 'I’m a client and something’s wrong.', a: 'Raise a ticket in the HITROO app for the fastest reply.' },
    ],
  },
  explore: {
    caption: 'Explore',
    title: 'Not sure what you need yet?',
    links: [
      { href: '/services', title: 'Everything we do', text: 'Every division and every service on one page.' },
      { href: '/insights', title: 'Insights', text: 'Short reads that help you decide.' },
    ],
  },
};

/* ------------------------------------------------------------------
   Careers (key `page:careers`)
   ------------------------------------------------------------------ */

export interface CareersContent {
  meta: PageMeta;
  intro: Heading & { lede: string };
  expect: Heading & { items: Point[] };
  steps: Heading & { items: [string, string][] };
  /** `note`: "{email}" becomes a link to the company email. */
  apply: Heading & { note: string };
}

export const CAREERS_PAGE: CareersContent = {
  meta: {
    title: 'Careers',
    description: 'Roles in software, AI/ML and hardware engineering: a 3-month internship, real projects and a path to full-time. Mostly remote.',
  },
  intro: { caption: 'Careers', title: 'Build with us.', lede: 'A 3-month internship, real projects and a path to full-time. Mostly remote.' },
  expect: {
    caption: 'What to expect',
    title: 'Real work from day one.',
    items: [
      { title: '3 months', text: 'An internship on real client projects.' },
      { title: 'A path', text: 'Do well, and it leads to a full-time role.' },
      { title: 'Mostly remote', text: 'Work from where you do your best work.' },
    ],
  },
  steps: {
    caption: 'How it works',
    title: 'From application to first day.',
    items: [
      ['Apply', 'Pick a role and send your résumé below.'],
      ['We review', 'We reply within 7 days.'],
      ['Meet the team', 'A conversation about your work.'],
      ['Start', 'Your first project, with a team behind you.'],
    ],
  },
  apply: {
    caption: 'Apply',
    title: 'Apply now.',
    note: 'Beware of fake offers. We never ask for money, and we only write from an @hitroo.com address. Unsure? Email {email}.',
  },
};

/* ------------------------------------------------------------------
   Creatives (key `page:creatives`; its division copy is `division:creatives`, the video `video:creatives`)
   ------------------------------------------------------------------ */

export interface CreativesContent {
  action: string;
  /** The fan in the opening: five reels, the middle one plays. */
  fan: Reel[];
  showcase: Heading & { text: string };
  /** The best performer and its variations. */
  winner: Heading & { lede: string; reel: Reel; notes: string[] };
  /** Two huge lines that slide with the scroll. */
  kinetic: [string, string];
  standards: Heading;
}

/** A reel from the library by style and position (the first reels of each style are the high-resolution singles). */
const pick = (style: string, i = 0): Reel => {
  const s = REEL_STYLES.find((x) => x.key === style);
  if (!s || !s.reels[i]) throw new Error(`No reel ${style}[${i}] in the Creatives library`);
  return asReel(s, i);
};

export const CREATIVES_PAGE: CreativesContent = {
  action: 'Book a free call',
  fan: [pick('trends', 0), pick('faceless', 0), pick('ads', 0), pick('characters', 1), pick('animation', 0)],
  showcase: {
    caption: 'Made by HITROO Creatives',
    title: 'Thirty seconds. One myth, busted.',
    text: 'Researched, scripted and edited by our team, with every claim checked against two sources. The kind of video that makes people stop, and trust you for it.',
  },
  winner: {
    caption: 'In your dashboard',
    title: 'Find the winner. Ride the trend.',
    lede: 'Every post is measured. The best one becomes the brief for the next batch, in fresh variations.',
    reel: pick('ads', 1),
    notes: ['Best performer studied: hook, format and timing.', 'Trending variations made on the same idea.', 'Next batch planned around what works.'],
  },
  kinetic: ['You run the business.', 'We run the feed.'],
  standards: { caption: 'How we deliver', title: 'Standards we keep on every account.' },
};
