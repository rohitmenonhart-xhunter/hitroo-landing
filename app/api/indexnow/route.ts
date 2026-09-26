import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { listPosts, postUrl } from '@/lib/data/posts';
import { abs, SITE_URL } from '@/lib/seo';

// The IndexNow key is public by design (served at /<key>.txt); see scripts/indexnow.mjs.
const KEY = 'f00de9d583f30b0850ec9dc316622abd';
const DAY_MS = 26 * 60 * 60 * 1000;

export const dynamic = 'force-dynamic';

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const a = Buffer.from(`Bearer ${secret}`);
  const b = Buffer.from(request.headers.get('authorization') ?? '');
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Vercel Cron, daily at 09:10 IST (vercel.json): tells Bing, Yandex, Seznam, Naver and other IndexNow
 * engines about posts that went live in the last day — scheduled posts appear on their own at 09:00.
 */
export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const since = Date.now() - DAY_MS;
  const fresh = (await listPosts(undefined, 50)).filter((p) => new Date(p.published_at).getTime() >= since);
  if (!fresh.length) return NextResponse.json({ submitted: 0 });
  const urlList = [...fresh.map((p) => abs(postUrl(p))), abs('/insights'), abs('/blog'), abs('/articles'), abs('/news')];
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key: KEY, keyLocation: abs(`/${KEY}.txt`), urlList }),
  });
  return NextResponse.json({ submitted: urlList.length, status: res.status });
}
