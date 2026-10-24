import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { hasDatabase, sql } from '@/lib/db';
import { resolveContent, type ContentKey } from './content-core';
import { CONTENT_DEFAULTS, type ContentMap } from './content-defaults';
import { checkContent } from './content-schema';
import type { DivisionImage, DivisionPageContent } from './division-pages';
import { DIVISION_SLUGS, type Division, type DivisionSlug, type Service } from './site-data';

/*
 * Page content, edited in the admin app and stored in web.content (migration 005). Reads are cached in Next's data
 * cache for five minutes under the tags `content` and `content:<key>`; the admin calls /api/revalidate with the keys
 * it saved, so edits show at once. Pages are static (ISR), so visitors never wait on the database.
 *
 * The site never depends on the database for its copy: without DATABASE_URL, when the query fails, when the row is
 * missing or when its shape is wrong, getContent() returns the built-in default (lib/content-defaults.ts).
 */

export const CONTENT_REVALIDATE = 300;

/** After a failed query, skip the database for a while instead of waiting on every key (builds, outages). */
const BACKOFF_MS = 30_000;
const state = globalThis as unknown as { hitrooContentDownUntil?: number };

const readRow = (key: ContentKey) =>
  unstable_cache(
    async () => {
      const rows = await sql<{ data: unknown }>('SELECT data FROM web.content WHERE key = $1', [key]);
      return rows[0]?.data ?? null;
    },
    ['web.content', key],
    { tags: ['content', `content:${key}`], revalidate: CONTENT_REVALIDATE }
  )();

async function load<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const fallback = CONTENT_DEFAULTS[key] as ContentMap[K];
  const resolved = await resolveContent<ContentMap[K]>({
    enabled: hasDatabase() && Date.now() >= (state.hitrooContentDownUntil ?? 0),
    load: () => readRow(key),
    fallback,
    check: (data) => checkContent(key, data),
  });
  if (resolved.reason === 'error') {
    state.hitrooContentDownUntil = Date.now() + BACKOFF_MS;
    console.error(`content ${key}: database read failed, using the built-in copy (${resolved.detail})`);
  } else if (resolved.reason === 'invalid') {
    console.error(`content ${key}: saved copy has the wrong shape, using the built-in copy (${resolved.detail})`);
  }
  return resolved.data;
}

/** One content key: the database's copy, or the built-in default. Deduplicated within a render. */
export const getContent = cache(load) as <K extends ContentKey>(key: K) => Promise<ContentMap[K]>;

/** A division's page content (`division:<slug>`). */
export const getDivisionPage = (slug: DivisionSlug): Promise<DivisionPageContent> => getContent(`division:${slug}`);

/** Each division's card image (from its page content), for the cards on home, What we do, About and the other divisions. */
export async function getDivisionVisuals(): Promise<Partial<Record<DivisionSlug, DivisionImage>>> {
  const pages = await Promise.all(DIVISION_SLUGS.map((s) => getDivisionPage(s)));
  return Object.fromEntries(pages.flatMap((p) => (p.visual ? [[p.slug, p.visual]] : [])));
}

export const findDivision = (divisions: Division[], slug: string) => divisions.find((d) => d.slug === slug);
export const findService = (services: Service[], slug: string) => services.find((s) => s.slug === slug);
