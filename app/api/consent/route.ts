import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { recordConsent } from '@/lib/data/analytics';
import { hasDatabase } from '@/lib/db';
import { rateLimited } from '@/lib/rate-limit';
import { getClientIp, isSameOrigin, readLimitedJson } from '@/lib/request-security';
import { CONSENT_POLICY_VERSION, edgeGeo } from '@/lib/visitor';

const schema = z.object({ choice: z.enum(['granted', 'denied']), visitorId: z.string().uuid().optional() }).strict();

/** Records the visitor's cookie choice (proof of consent). */
export async function POST(request: NextRequest) {
  const ok = new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  if (!hasDatabase() || !isSameOrigin(request)) return ok;
  if (rateLimited(`consent:${getClientIp(request) ?? 'unknown'}`, 20, 60_000)) return ok;
  try {
    const parsed = schema.safeParse(await readLimitedJson(request, 1024));
    if (!parsed.success) return ok;
    await recordConsent({
      visitorId: parsed.data.choice === 'granted' ? parsed.data.visitorId ?? null : null,
      choice: parsed.data.choice,
      policyVersion: CONSENT_POLICY_VERSION,
      country: edgeGeo(request.headers).country,
    });
  } catch (err) {
    console.error('consent failed:', (err as Error).message);
  }
  return ok;
}
