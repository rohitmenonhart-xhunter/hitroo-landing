/** Small fixed-window rate limiter (per server instance; enough to blunt floods and brute force). */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5_000) {
      buckets.forEach((v, k) => {
        if (v.reset <= now) buckets.delete(k);
      });
    }
    return false;
  }
  b.count += 1;
  return b.count > limit;
}
