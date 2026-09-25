/** Client-safe helpers for first-party analytics (no dependencies; also used in tests). */

/** The text we record for a clicked link or button: collapsed whitespace, at most 80 characters. */
export function clickLabel(raw: string | null | undefined): string | undefined {
  const text = (raw ?? '').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 80) : undefined;
}

/**
 * Where a clicked link points: a path for this site, origin + path for other sites.
 * Query strings are dropped (they can carry personal details); mailto:/tel: links are ours.
 */
export function clickHref(raw: string | null | undefined, origin: string): string | undefined {
  if (!raw) return undefined;
  if (/^(mailto|tel):/i.test(raw) || raw.startsWith('#')) return raw.slice(0, 300);
  try {
    const url = new URL(raw, origin);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return (url.origin === origin ? url.pathname + url.hash : url.origin + url.pathname).slice(0, 300);
  } catch {
    return undefined;
  }
}

/** How far through `height` pixels the viewport has reached, 0–100. */
export function scrollDepth(seen: number, height: number): number {
  if (!(height > 0)) return 100;
  return Math.max(0, Math.min(100, Math.round((seen / height) * 100)));
}
