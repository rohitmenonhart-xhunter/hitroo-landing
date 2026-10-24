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
      className="glass-warm fixed inset-x-4 bottom-4 z-[60] max-w-[380px] rounded-[24px] p-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 sm:bottom-6 sm:left-6 sm:right-auto"
    >
      <p id="cookie-title" className="font-display text-[18px] font-bold tracking-[-0.02em] text-char">
        Cookies
      </p>
      <p id="cookie-text" className="mt-2 text-[15px] font-medium leading-relaxed text-char/75">
        We use cookies to understand how our site is used and to improve it. Read our{' '}
        <Link href="/privacy" className="text-char underline decoration-char/30 underline-offset-4 hover:decoration-char">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => decide('denied')}
          className="h-11 rounded-full bg-white text-[15px] font-medium text-char ring-1 ring-char/10 transition-colors hover:bg-[#FFF8F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => decide('granted')}
          className="h-11 rounded-full bg-char text-[15px] font-medium text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
