import { NextRequest, NextResponse } from 'next/server';
import { recordEvent, recordPageView } from '@/lib/data/analytics';
import { hasDatabase } from '@/lib/db';
import { rateLimited } from '@/lib/rate-limit';
import { getClientIp, isSameOrigin, readLimitedJson } from '@/lib/request-security';
import { trackPayloadSchema } from '@/lib/track-schema';
import { CONSENT_COOKIE, edgeGeo, isBot, parseUserAgent } from '@/lib/visitor';

const done = () => new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

/** First-party page views, clicks and engagement. Anonymous unless the visitor accepted analytics cookies. */
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
  const parsed = trackPayloadSchema.safeParse(raw);
  if (!parsed.success) return done();
  const d = parsed.data;

  const consented = request.cookies.get(CONSENT_COOKIE)?.value === 'granted';
  const geo = edgeGeo(request.headers);
  const path = d.path.split('?')[0].slice(0, 300);
  const ids = { visitId: d.visitId ?? null, viewId: d.viewId ?? null, visitorId: consented ? d.visitorId ?? null : null };

  try {
    if (d.type === 'click') {
      await recordEvent({ type: 'click', path, ...ids, label: d.label ?? null, href: d.href ?? null, seconds: null, depth: null, country: geo.country });
    } else if (d.type === 'engage') {
      await recordEvent({ type: 'engage', path, ...ids, label: null, href: null, seconds: d.seconds, depth: d.depth, country: geo.country });
    } else {
      let referrerHost: string | null = null;
      if (d.referrer) {
        try {
          const host = new URL(d.referrer).host;
          if (host && host !== request.nextUrl.host) referrerHost = host.replace(/^www\./, '');
        } catch {
          /* ignore malformed referrers */
        }
      }
      const { device, browser, os } = parseUserAgent(ua);
      await recordPageView({
        path,
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
        ...ids,
        sessionId: consented ? d.sessionId ?? null : null,
      });
    }
  } catch (err) {
    console.error('track failed:', (err as Error).message);
  }
  return done();
}
