'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { readCookie } from '@/lib/cookies-client';

/**
 * First-party page views → /api/track. Anonymous by default (path, referrer, UTM, language);
 * visitor and session ids are only attached after the visitor accepts cookies.
 */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const consented = readCookie('hitroo_consent') === 'granted';
    let sessionId: string | undefined;
    if (consented) {
      try {
        sessionId = sessionStorage.getItem('hitroo_sid') ?? undefined;
        if (!sessionId) {
          sessionId = crypto.randomUUID();
          sessionStorage.setItem('hitroo_sid', sessionId);
        }
      } catch {
        sessionId = undefined;
      }
    }
    const params = new URLSearchParams(window.location.search);
    const payload = {
      path: pathname,
      referrer: first.current ? document.referrer || undefined : undefined,
      utm_source: params.get('utm_source') ?? undefined,
      utm_medium: params.get('utm_medium') ?? undefined,
      utm_campaign: params.get('utm_campaign') ?? undefined,
      language: navigator.language?.slice(0, 35) || undefined,
      visitorId: consented ? readCookie('hitroo_vid') ?? undefined : undefined,
      sessionId,
    };
    first.current = false;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
