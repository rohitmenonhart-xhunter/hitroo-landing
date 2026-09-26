import { timingSafeEqual } from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimited } from '@/lib/rate-limit';
import { getClientIp, readLimitedJson } from '@/lib/request-security';

// Pages that list posts, plus the discovery files (which also refresh on their own every 10 minutes).
const ALWAYS = ['/insights', '/articles', '/blog', '/news', '/sitemap.xml', '/llms.txt'];

const schema = z
  .object({ paths: z.array(z.string().regex(/^\/(articles|blog|news)\/[a-z0-9]+(-[a-z0-9]+)*$/)).max(10).optional().default([]) })
  .strict();

const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function secretOk(provided: string) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const a = Buffer.from(secret);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Called by the admin app (hitroo_admin_page) after a post changes, so the site shows it at once. */
export async function POST(request: NextRequest) {
  if (!secretOk(request.headers.get('x-revalidate-secret') ?? '')) {
    console.warn('revalidate: rejected a request without the right secret');
    if (rateLimited(`revalidate-fail:${getClientIp(request) ?? 'unknown'}`, 10, 15 * 60_000)) return reply({ error: 'Too many attempts' }, 429);
    return reply({ error: 'Unauthorized' }, 401);
  }
  let raw: unknown;
  try {
    raw = await readLimitedJson(request, 4 * 1024);
  } catch {
    return reply({ error: 'Invalid body' }, 400);
  }
  const parsed = schema.safeParse(raw ?? {});
  if (!parsed.success) return reply({ error: 'Invalid paths' }, 400);
  const paths = [...ALWAYS, ...parsed.data.paths];
  for (const path of paths) revalidatePath(path);
  return reply({ revalidated: paths });
}
