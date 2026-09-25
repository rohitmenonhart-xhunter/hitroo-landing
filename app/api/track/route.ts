import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { recordPageView } from '@/lib/data/analytics';
import { hasDatabase } from '@/lib/db';
import { rateLimited } from '@/lib/rate-limit';
import { getClientIp, isSameOrigin, readLimitedJson } from '@/lib/request-security';
import { CONSENT_COOKIE, edgeGeo, isBot, parseUserAgent } from '@/lib/visitor';

const schema = z
  .object({
    path: z.string().max(300).regex(/^\//),
    referrer: z.string().max(600).optional(),
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(150).optional(),
    language: z.string().max(35).optional(),
    visitorId: z.string().uuid().optional(),
    sessionId: z.string().uuid().optional(),
  })
  .strict();

const done = () => new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

/** First-party page view. Anonymous unless the visitor accepted analytics cookies. */
export async function POST(request: NextRequest) {
  if (!hasDatabase() || !isSameOrigin(request)) return done();
  const ua = request.headers.get('user-agent') || '';
  if (isBot(ua)) return done();
  if (rateLimited(`track:${getClientIp(request) ?? 'unknown'}`, 120, 60_000)) return done();

  let raw: unknown;
  try {
    raw = await readLimitedJson(request, 4 * 1024);
  } catch {
    return done();
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return done();
  const d = parsed.data;

  const consented = request.cookies.get(CONSENT_COOKIE)?.value === 'granted';
  let referrerHost: string | null = null;
  if (d.referrer) {
    try {
      const host = new URL(d.referrer).host;
      if (host && host !== request.nextUrl.host) referrerHost = host.replace(/^www\./, '');
    } catch {
      /* ignore malformed referrers */
    }
  }
  const geo = edgeGeo(request.headers);
  const { device, browser, os } = parseUserAgent(ua);

  try {
    await recordPageView({
      path: d.path.split('?')[0].slice(0, 300),
      referrerHost,
      utmSource: d.utm_source ?? null,
      utmMedium: d.utm_medium ?? null,
      utmCampaign: d.utm_campaign ?? null,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      device,
      browser,
      os,
      language: d.language ?? null,
      visitorId: consented ? d.visitorId ?? null : null,
      sessionId: consented ? d.sessionId ?? null : null,
    });
  } catch (err) {
    console.error('track failed:', (err as Error).message);
  }
  return done();
}
