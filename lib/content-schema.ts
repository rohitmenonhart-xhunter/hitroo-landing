import { z } from 'zod';
import type { ContentKey } from './content-core';

/*
 * The shape each content key must have before the site uses the database's copy (otherwise it falls back to the
 * built-in default; see lib/content.ts). Deliberately lenient: extra fields pass, optional fields may be null, and
 * free-text choices (chip colours, caption looks) are any string. What is checked is what would break a page.
 */

const str = z.string();
const num = z.number();
const strs = z.array(str);
const pair = z.tuple([str, str]);
const point = z.object({ title: str, text: str }).passthrough();
const qa = z.object({ q: str, a: str }).passthrough();
const link = z.object({ href: str, title: str, text: str }).passthrough();
const meta = z.object({ title: str, description: str }).passthrough();
const heading = { caption: str, title: str };
const divisionSlug = z.enum(['software', 'automation', 'ai', 'creatives']);
const serviceSlug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

/** Any media slot: a file in public/ or in object storage (lib/media.ts). */
export const imageSchema = z
  .object({
    src: z.string().min(1),
    alt: str,
    width: num.nullish(),
    height: num.nullish(),
    tone: str.nullish(),
    variants: z.array(z.object({ w: num, url: z.string().min(1) }).passthrough()).nullish(),
    position: str.nullish(),
  })
  .passthrough();

const divisionImage = imageSchema.extend({ dim: num.nullish() });
const heroImage = divisionImage.extend({ theme: z.enum(['light', 'dark']), flip: z.boolean().nullish() });
const reel = divisionImage.extend({ format: str, tint: str.nullish(), caption: str.nullish(), captionStyle: str.nullish(), captionTint: str.nullish() });

const company = z.object({ name: str, email: str, phone: str, phoneHref: str, location: str, oneLiner: str, about: str, linkedin: str }).passthrough();

const service = z
  .object({
    slug: serviceSlug,
    title: str,
    label: str,
    division: divisionSlug,
    short: str,
    tagline: str,
    pain: str,
    overview: str,
    approach: strs,
    capabilities: strs,
    outcomes: strs,
    stack: strs,
  })
  .passthrough();

const division = z
  .object({
    slug: divisionSlug,
    name: str,
    line: str,
    overview: str,
    statement: pair,
    offers: z.array(z.object({ title: str, text: str, href: str.nullish() }).passthrough()),
    outcomes: strs,
    forWho: z.array(point),
    steps: z.array(point),
    tools: strs,
    faq: z.array(qa),
    isNew: z.boolean().nullish(),
  })
  .passthrough();

const showcase = z.object({ slug: divisionSlug, name: str, title: str, text: str, capabilities: z.array(point), standards: strs }).passthrough();

const divisionPage = z
  .object({
    slug: divisionSlug,
    hero: heroImage.nullish(),
    visual: divisionImage.nullish(),
    gallery: z.array(divisionImage).nullish(),
    standardsImage: divisionImage.nullish(),
    metaTitle: str,
    description: str,
    title: str,
    lede: str,
    signs: z.object({ title: str, lede: str, items: z.array(point) }).passthrough(),
    build: z.object({ title: str, items: z.array(z.object({ title: str, text: str, included: strs, href: str.nullish() }).passthrough()) }).passthrough(),
    flow: z.object({ caption: str, title: str, steps: z.array(point) }).passthrough().nullish(),
    split: z
      .object({
        caption: str,
        title: str,
        left: z.object({ label: str, items: strs }).passthrough(),
        right: z.object({ label: str, items: strs }).passthrough(),
      })
      .passthrough()
      .nullish(),
    commitments: z.array(point),
    steps: z.object({ title: str, items: z.array(pair) }).passthrough().nullish(),
    engagements: z.array(z.object({ title: str, text: str, fit: str }).passthrough()).nullish(),
    faq: z.array(qa),
    closing: z.object({ title: str, line: str }).passthrough(),
  })
  .passthrough();

const home = z
  .object({
    meta,
    hero: z.object({ title: str, lede: str, action: str, tags: strs }).passthrough(),
    why: z.object({ caption: str, text: str }).passthrough(),
    divisions: z
      .object({ ...heading, explore: str, discuss: str, standards: str, partner: z.object({ caption: str, title: str, text: str, action: str }).passthrough() })
      .passthrough(),
    marquee: z.object({ label: str, items: strs }).passthrough(),
    steps: z.object(heading).passthrough(),
    promises: z.object(heading).passthrough(),
    need: z.object({ ...heading, lede: str, prompt: str, placeholder: str, items: strs }).passthrough(),
    posts: z.object({ title: str }).passthrough(),
    faq: z.object({ title: str }).passthrough(),
    contact: z.object({ title: str, text: str, link: str }).passthrough(),
  })
  .passthrough();

const quote = z
  .object({
    caption: str,
    quote: str,
    name: str,
    role: str,
    source: z.object({ label: str, href: str }).passthrough(),
    photo: imageSchema.extend({ credit: str, creditHref: str, license: str, licenseHref: str, changes: str }),
  })
  .passthrough();

const founder = z.object({ caption: str, lines: pair, text: str, name: str, role: str, photo: imageSchema }).passthrough();

const sectionWith = <T extends z.ZodRawShape>(shape: T) => z.object({ ...heading, ...shape }).passthrough();

const about = z
  .object({
    meta,
    intro: sectionWith({ lede: str }),
    story: z.object({ caption: str, lines: pair }).passthrough(),
    divisions: sectionWith({}),
    beliefs: sectionWith({ items: z.array(point) }),
    how: sectionWith({}),
    promises: sectionWith({}),
    where: sectionWith({ items: z.array(point) }),
    view: z.object({ caption: str, lines: pair, link: z.object({ href: str, label: str }).passthrough() }).passthrough(),
    explore: sectionWith({ links: z.array(link) }),
    closing: z.object({ title: str, line: str }).passthrough(),
  })
  .passthrough();

const support = z
  .object({
    meta,
    intro: sectionWith({ lede: str, action: str }),
    manifesto: z.object({ caption: str, text: str }).passthrough(),
    stages: sectionWith({ items: z.array(pair) }),
    topics: sectionWith({ lede: str, items: z.array(point) }),
    platforms: sectionWith({ items: strs }),
    promises: sectionWith({}),
    faq: z.object({ title: str, items: z.array(qa) }).passthrough(),
    next: sectionWith({ links: z.array(link) }),
    closing: z.object({ title: str, line: str, action: str }).passthrough(),
  })
  .passthrough();

const contact = z
  .object({
    meta,
    intro: sectionWith({ lede: str }),
    panel: z.object({ title: str, text: str }).passthrough(),
    next: sectionWith({ lede: str, items: z.array(pair) }),
    faq: z.object({ title: str, items: z.array(qa) }).passthrough(),
    explore: sectionWith({ links: z.array(link) }),
  })
  .passthrough();

const careers = z
  .object({
    meta,
    intro: sectionWith({ lede: str }),
    expect: sectionWith({ items: z.array(point) }),
    steps: sectionWith({ items: z.array(pair) }),
    apply: sectionWith({ note: str }),
  })
  .passthrough();

const creatives = z
  .object({
    action: str,
    fan: z.array(reel),
    showcase: sectionWith({ text: str }),
    winner: sectionWith({ lede: str, reel, notes: strs }),
    kinetic: pair,
    standards: sectionWith({}),
  })
  .passthrough();

const video = z
  .object({
    src: z.string().min(1),
    poster: z.string().min(1),
    width: num,
    height: num,
    seconds: num,
    title: str,
    description: str,
    uploadDate: str,
    transcript: str,
    sources: z.array(z.object({ label: str, href: str }).passthrough()),
    credits: str,
  })
  .passthrough();

const uniqueSlugs = (items: { slug: string }[]) => new Set(items.map((i) => i.slug)).size === items.length;

export const CONTENT_SCHEMAS: Record<ContentKey, z.ZodTypeAny> = {
  company,
  home,
  quote,
  founder,
  // Every division has its own route, so all four must be there.
  divisions: z.array(division).refine((ds) => uniqueSlugs(ds) && divisionSlug.options.every((s) => ds.some((d) => d.slug === s)), 'needs each of the four divisions once'),
  showcase: z.array(showcase).refine(uniqueSlugs, 'division slugs must be unique'),
  services: z.array(service).min(1).refine(uniqueSlugs, 'service slugs must be unique'),
  audience: z.array(point),
  engagements: z.array(point),
  promises: z.array(point),
  steps: z.array(pair),
  'faq:general': z.array(qa),
  'division:software': divisionPage.refine((p) => p.slug === 'software', 'slug must be software'),
  'division:automation': divisionPage.refine((p) => p.slug === 'automation', 'slug must be automation'),
  'division:ai': divisionPage.refine((p) => p.slug === 'ai', 'slug must be ai'),
  'division:creatives': divisionPage.refine((p) => p.slug === 'creatives', 'slug must be creatives'),
  'page:creatives': creatives,
  'page:about': about,
  'page:support': support,
  'page:contact': contact,
  'page:careers': careers,
  'video:creatives': video,
};

/** Null when `data` has the shape `key` needs, otherwise a short description of the first problems. */
export function checkContent(key: ContentKey, data: unknown): string | null {
  const result = CONTENT_SCHEMAS[key].safeParse(data);
  if (result.success) return null;
  return result.error.issues
    .slice(0, 3)
    .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('; ');
}
