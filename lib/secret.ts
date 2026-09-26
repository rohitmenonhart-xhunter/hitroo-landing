import { timingSafeEqual } from 'crypto';

/**
 * Constant-time check of a secret (API keys, cron tokens), so response timing can't reveal how much of a
 * guess was right. Compares UTF-8 bytes; an empty expected value never matches.
 */
export function sameSecret(expected: string, provided: string): boolean {
  if (!expected) return false;
  const enc = new TextEncoder();
  const a = enc.encode(expected);
  const b = enc.encode(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
