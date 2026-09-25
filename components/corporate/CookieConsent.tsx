'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readCookie, writeCookie } from '@/lib/cookies-client';

const CONSENT = 'hitroo_consent';
const VISITOR = 'hitroo_vid';
const YEAR = 60 * 60 * 24 * 365;

/** Bottom-left cookie choice. Analytics identifiers are only set after "Accept". */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readCookie(CONSENT)) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener('hitroo:cookie-settings', reopen);
    return () => window.removeEventListener('hitroo:cookie-settings', reopen);
  }, []);

  const decide = (choice: 'granted' | 'denied') => {
    let visitorId: string | undefined;
    if (choice === 'granted') {
      visitorId = readCookie(VISITOR) ?? crypto.randomUUID();
      writeCookie(VISITOR, visitorId, YEAR);
    } else {
      writeCookie(VISITOR, '', 0);
    }
    writeCookie(CONSENT, choice, YEAR);
    setOpen(false);
    fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice, visitorId }),
      keepalive: true,
    }).catch(() => {});
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className="fixed inset-x-4 bottom-4 z-[60] max-w-[380px] rounded-xl bg-white p-6 shadow-[0_24px_64px_-16px_rgba(10,22,51,0.32)] animate-in fade-in-0 slide-in-from-bottom-2 duration-300 sm:bottom-6 sm:left-6 sm:right-auto"
    >
      <p id="cookie-title" className="text-[15px] font-medium text-ink">
        Cookies
      </p>
      <p id="cookie-text" className="mt-2 text-[14px] leading-relaxed text-slate-600">
        We use cookies to understand how our site is used and to improve it. Read our{' '}
        <Link href="/privacy" className="text-cobalt underline-offset-4 hover:underline">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => decide('denied')}
          className="h-10 rounded-full bg-mist text-[14px] font-medium text-ink transition-colors hover:bg-cobalt-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => decide('granted')}
          className="h-10 rounded-full bg-cobalt text-[14px] font-medium text-white transition-colors hover:bg-cobalt-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
