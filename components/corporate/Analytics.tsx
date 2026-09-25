'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { readCookie } from '@/lib/cookies-client';
import { clickHref, clickLabel, scrollDepth } from '@/lib/track';

/**
 * First-party analytics → /api/track: page views, clicks on links and buttons, and engagement
 * (visible time, and how far the page — on posts, the article — was scrolled). Anonymous by
 * default: a random visit id held in memory groups one visit's pages (a reload starts a new
 * visit). Visitor and session ids are attached only after the visitor accepts cookies.
 */

type View = { id: string; path: string; visibleSince: number | null; ms: number; depth: number; sentDepth: number };

let visitId: string | undefined;
let current: View | null = null;
let referrerSent = false;

const uuid = (): string =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (+c ^ ((Math.random() * 16) >> (+c / 4))).toString(16));

const consented = () => readCookie('hitroo_consent') === 'granted';

function send(body: Record<string, unknown>) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, visitId, visitorId: consented() ? readCookie('hitroo_vid') ?? undefined : undefined }),
    keepalive: true,
  }).catch(() => {});
}

/** How far the reader has got: through the article on post pages, otherwise through the page. */
function depthNow() {
  const vh = window.innerHeight;
  const article = document.querySelector('[data-article]');
  if (article) {
    const r = article.getBoundingClientRect();
    return scrollDepth(vh - r.top, r.height);
  }
  return scrollDepth(window.scrollY + vh, document.documentElement.scrollHeight);
}

/** Sends visible time since the last report and the furthest scroll so far. */
function report(view: View) {
  if (view.visibleSince !== null) {
    view.ms += Date.now() - view.visibleSince;
    view.visibleSince = null;
  }
  const seconds = Math.min(86_400, Math.floor(view.ms / 1000));
  if (seconds === 0 && view.depth === view.sentDepth) return;
  view.ms -= seconds * 1000;
  view.sentDepth = view.depth;
  send({ type: 'engage', path: view.path, viewId: view.id, seconds, depth: view.depth });
}

function sessionId() {
  if (!consented()) return undefined;
  try {
    let sid = sessionStorage.getItem('hitroo_sid');
    if (!sid) {
      sid = uuid();
      sessionStorage.setItem('hitroo_sid', sid);
    }
    return sid;
  } catch {
    return undefined;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking || !current) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (current) current.depth = Math.max(current.depth, depthNow());
      });
    };
    const onVisibility = () => {
      if (!current) return;
      if (document.visibilityState === 'hidden') report(current);
      else current.visibleSince = Date.now();
    };
    const onHide = () => current && report(current);
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>('a[href], button, [role="button"]');
      if (!el || !current) return;
      // Cards wrap a heading plus other text; the heading names them best.
      const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
      send({
        type: 'click',
        path: current.path,
        viewId: current.id,
        label: clickLabel(el.getAttribute('data-track') ?? el.getAttribute('aria-label') ?? heading?.textContent ?? el.innerText),
        href: el instanceof HTMLAnchorElement ? clickHref(el.getAttribute('href'), window.location.origin) : undefined,
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onHide);
    document.addEventListener('click', onClick, { capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('click', onClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (current) report(current);
    visitId ??= uuid();
    const view: View = {
      id: uuid(),
      path: pathname,
      visibleSince: document.visibilityState === 'visible' ? Date.now() : null,
      ms: 0,
      depth: 0,
      sentDepth: 0,
    };
    current = view;
    requestAnimationFrame(() => {
      if (current === view) view.depth = Math.max(view.depth, depthNow());
    });

    const params = new URLSearchParams(window.location.search);
    send({
      type: 'view',
      path: pathname,
      viewId: view.id,
      referrer: referrerSent ? undefined : document.referrer || undefined,
      utm_source: params.get('utm_source') ?? undefined,
      utm_medium: params.get('utm_medium') ?? undefined,
      utm_campaign: params.get('utm_campaign') ?? undefined,
      language: navigator.language?.slice(0, 35) || undefined,
      sessionId: sessionId(),
    });
    referrerSent = true;
  }, [pathname]);

  return null;
}
