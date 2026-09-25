import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hasDatabase } from '@/lib/db';
import { rateLimited } from '@/lib/rate-limit';
import { getClientIp, isSameOrigin } from '@/lib/request-security';

const deny = (error: string, status: number) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });

/** Returns an error response unless the request carries the admin password (x-admin-password). */
export function requireAdmin(request: NextRequest): NextResponse | null {
  if (!isSameOrigin(request)) return deny('Cross-origin requests are not allowed', 403);
  if (!passwordOk(request)) {
    const ip = getClientIp(request) ?? 'unknown';
    // Only failed attempts count toward the brute-force limit.
    if (rateLimited(`admin-fail:${ip}`, 10, 15 * 60_000)) return deny('Too many attempts. Try again later.', 429);
    return deny('Unauthorized', 401);
  }
  if (!hasDatabase()) return deny('Database is not configured', 503);
  return null;
}

function passwordOk(request: NextRequest) {
  const configured = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get('x-admin-password') ?? '';
  if (!configured) return false;
  const a = Buffer.from(configured);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const noStore = { headers: { 'Cache-Control': 'no-store' } };
