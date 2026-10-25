/*
 * Page content keys and the fallback rule, kept free of Next and the database so they can be tested on their own.
 * The admin app (hitroo_admin_page) writes these keys to web.content; never rename one.
 */

/** Same rule as the CHECK on web.content.key (migration 005). */
export const CONTENT_KEY_RE = /^[a-z0-9]+(:[a-z0-9-]+)?$/;

export const CONTENT_KEYS = [
  'company',
  'home',
  'quote',
  'founder',
  'divisions',
  'showcase',
  'services',
  'audience',
  'engagements',
  'promises',
  'steps',
  'faq:general',
  'division:software',
  'division:automation',
  'division:ai',
  'division:creatives',
  'page:creatives',
  'page:about',
  'page:support',
  'page:contact',
  'page:careers',
  'video:creatives',
  'film:home',
  'film:software',
  'film:automation',
  'film:ai',
  'film:creatives',
] as const;

export type ContentKey = (typeof CONTENT_KEYS)[number];

export const isContentKey = (key: string): key is ContentKey => (CONTENT_KEYS as readonly string[]).includes(key);

export type ContentSource = 'database' | 'default';
export type FallbackReason = 'no-database' | 'error' | 'missing' | 'invalid';

export interface Resolved<T> {
  data: T;
  source: ContentSource;
  reason?: FallbackReason;
  detail?: string;
}

/**
 * The database's copy of a key when it can be read and has the right shape; otherwise the built-in default.
 * `load` returns the row's data, or null when there is no row; it may throw (unreachable, timeout, no rights).
 * The site never breaks or goes blank because of content: every failure ends in the default.
 */
export async function resolveContent<T>({
  enabled,
  load,
  fallback,
  check,
}: {
  /** False when the site has no database configured. */
  enabled: boolean;
  load: () => Promise<unknown>;
  fallback: T;
  /** Returns null when the data has the right shape, or what is wrong with it. */
  check: (data: unknown) => string | null;
}): Promise<Resolved<T>> {
  if (!enabled) return { data: fallback, source: 'default', reason: 'no-database' };
  let data: unknown;
  try {
    data = await load();
  } catch (err) {
    return { data: fallback, source: 'default', reason: 'error', detail: err instanceof Error ? err.message : String(err) };
  }
  if (data === null || data === undefined) return { data: fallback, source: 'default', reason: 'missing' };
  const problem = check(data);
  if (problem) return { data: fallback, source: 'default', reason: 'invalid', detail: problem };
  return { data: data as T, source: 'database' };
}

/** Walks content JSON and calls `visit` on every media slot (any object with a string `src`), depth first. */
export function forEachMedia(value: unknown, visit: (slot: Record<string, unknown> & { src: string }) => void): void {
  if (Array.isArray(value)) {
    for (const v of value) forEachMedia(v, visit);
  } else if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.src === 'string') visit(obj as Record<string, unknown> & { src: string });
    for (const v of Object.values(obj)) forEachMedia(v, visit);
  }
}
