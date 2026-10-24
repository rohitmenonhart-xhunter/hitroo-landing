import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { rateLimited } from '@/lib/rate-limit';
import { getClientIp, readLimitedJson } from '@/lib/request-security';
import { pathsToRevalidate, revalidateSchema } from '@/lib/revalidate';
import { sameSecret } from '@/lib/secret';

const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

function secretOk(provided: string) {
  return sameSecret(process.env.REVALIDATE_SECRET ?? '', provided);
}

/**
 * Called by the admin app (hitroo_admin_page) after a post or page content changes, so the site shows it at once:
 * { "paths": ["/blog/a-post"] } for posts, { "content": ["division:ai"] } for content keys (lib/revalidate.ts).
 */
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
  const parsed = revalidateSchema.safeParse(raw ?? {});
  if (!parsed.success) return reply({ error: 'Invalid paths or content keys' }, 400);

  const body = parsed.data;
  const slugs = body.content.length ? (await getContent('services')).map((s) => s.slug) : [];
  const { paths, tags, all } = pathsToRevalidate(body, slugs);
  for (const tag of tags) revalidateTag(tag);
  // A shared key: every page, through the root layout's implicit tag, as well as each path by name.
  if (all) revalidatePath('/', 'layout');
  for (const path of paths) revalidatePath(path);
  return reply({ revalidated: paths, tags });
}
