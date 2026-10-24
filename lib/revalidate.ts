import { z } from 'zod';
import { CONTENT_KEY_RE } from './content-core.ts';

/*
 * What /api/revalidate accepts and which pages each content key touches. Kept free of Next so it can be tested.
 * The admin posts { paths: ["/blog/a-post"] } after a post changes and { content: ["division:ai"] } after it saves
 * page content.
 */

/** Pages that list posts, plus the discovery files (which also refresh on their own every 10 minutes). */
export const ALWAYS = ['/insights', '/articles', '/blog', '/news', '/sitemap.xml', '/llms.txt'];

/** Every marketing page that reads content; service pages are added from the services list. */
export const MARKETING_PATHS = [
  '/',
  '/software',
  '/automation',
  '/ai',
  '/creatives',
  '/services',
  '/about',
  '/support',
  '/contact',
  '/careers',
  '/insights',
  '/articles',
  '/blog',
  '/news',
  '/research',
  '/ai-perspective',
  '/brand',
  '/site-map',
  '/privacy',
  '/terms',
  '/cookies',
  '/accessibility',
  '/security',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
];

/** Keys shown on one or a few pages. Any other key (the shared ones: company and divisions are in the footer) refreshes every page. */
const PAGES: Record<string, string[]> = {
  home: ['/'],
  quote: ['/'],
  founder: ['/about'],
  audience: ['/services'],
  promises: ['/', '/services', '/about', '/support'],
  steps: ['/', '/services', '/about', '/llms.txt', '/llms-full.txt'],
  'faq:general': ['/', '/services', '/llms-full.txt'],
  'page:creatives': ['/creatives'],
  'video:creatives': ['/creatives'],
  'page:about': ['/about'],
  'page:support': ['/support', '/llms-full.txt'],
  'page:contact': ['/contact'],
  'page:careers': ['/careers'],
};

export const revalidateSchema = z
  .object({
    paths: z.array(z.string().regex(/^\/(articles|blog|news)\/[a-z0-9]+(-[a-z0-9]+)*$/)).max(10).optional().default([]),
    content: z.array(z.string().max(64).regex(CONTENT_KEY_RE)).max(40).optional().default([]),
  })
  .strict();

export type RevalidateBody = z.infer<typeof revalidateSchema>;

/**
 * The paths to refresh for a request: the post listings always, the posts named, and every page showing the content
 * keys named. `all` is true when a key is shared across the site (then every page is refreshed).
 */
export function pathsToRevalidate(body: RevalidateBody, serviceSlugs: string[]): { paths: string[]; tags: string[]; all: boolean } {
  const all = body.content.some((key) => !(key in PAGES));
  const paths = new Set([...ALWAYS, ...body.paths]);
  if (all) {
    for (const p of MARKETING_PATHS) paths.add(p);
    for (const s of serviceSlugs) paths.add(`/services/${s}`);
  } else {
    for (const key of body.content) for (const p of PAGES[key]) paths.add(p);
  }
  const tags = body.content.map((key) => `content:${key}`);
  return { paths: [...paths], tags: [...new Set(tags)], all };
}
