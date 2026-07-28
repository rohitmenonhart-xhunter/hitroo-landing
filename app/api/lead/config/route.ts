import { NextResponse } from 'next/server';
import { getTurnstileConfiguration } from '@/lib/lead-protection';

export const dynamic = 'force-dynamic';

export function GET() {
  const configuration = getTurnstileConfiguration();

  if (configuration.state === 'incomplete') {
    console.error(
      'Turnstile is disabled: set both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY'
    );
  }

  return NextResponse.json(
    {
      turnstileSiteKey:
        configuration.state === 'enabled' ? configuration.siteKey : null,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
