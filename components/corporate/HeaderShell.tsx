'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Wordmark from './Wordmark';

const LINKS = [
  { href: '/insights', label: 'Insights' },
  { href: '/research', label: 'Research' },
  { href: '/support', label: 'Support' },
  { href: '/about', label: 'About' },
];

const NAV_ITEM =
  'inline-flex h-10 items-center gap-1 rounded-md px-3 text-[15px] text-ink/80 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt';

/**
 * Sticky white header: a services mega menu on desktop, a full-height panel on mobile.
 * The menu contents are rendered on the server and passed in, so no content ships as JS.
 */
export default function HeaderShell({ servicesMenu, mobileServices }: { servicesMenu: ReactNode; mobileServices: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileSvc, setMobileSvc] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const megaBtnRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mega && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mega) {
        setMega(false);
        megaBtnRef.current?.focus();
      }
      if (mobile) {
        setMobile(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [mega, mobile]);

  useEffect(() => {
    if (!mobile) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = () => desktop.matches && setMobile(false);
    desktop.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = overflow;
      desktop.removeEventListener('change', onChange);
    };
  }, [mobile]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const hoverOpen = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 160);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        (scrolled || mega || mobile) && 'shadow-[0_10px_30px_-18px_rgba(10,22,51,0.22)]'
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[72px] w-full max-w-[1240px] items-center px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="HITROO home" className="rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="ml-10 hidden lg:block xl:ml-14">
          <ul className="flex items-center gap-1">
            <li onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
              <button
                ref={megaBtnRef}
                type="button"
                className={cn(NAV_ITEM, (mega || pathname.startsWith('/services')) && 'text-ink')}
                aria-expanded={mega}
                aria-controls="services-menu"
                onClick={() => setMega((v) => !v)}
              >
                Services
                <ChevronDown aria-hidden="true" className={cn('h-4 w-4 transition-transform duration-200', mega && 'rotate-180')} />
              </button>
            </li>
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} className={cn(NAV_ITEM, active && 'text-ink')} aria-current={active ? 'page' : undefined}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-full bg-cobalt px-5 text-[14px] font-medium text-white transition-colors hover:bg-cobalt-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt sm:inline-flex"
          >
            Contact us
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt lg:hidden"
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Desktop services menu */}
      <div
        id="services-menu"
        onPointerEnter={hoverOpen}
        onPointerLeave={hoverClose}
        className={cn(
          'absolute inset-x-0 top-full bg-white shadow-[0_28px_48px_-28px_rgba(10,22,51,0.28)]',
          mega ? 'hidden animate-in fade-in-0 slide-in-from-top-1 duration-200 lg:block' : 'hidden'
        )}
      >
        <div className="mx-auto w-full max-w-[1240px] px-10 py-6">{servicesMenu}</div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn('fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-white lg:hidden', mobile ? 'block' : 'hidden')}
      >
        <nav aria-label="Mobile" className="mx-auto w-full max-w-[1240px] px-5 pb-10 sm:px-8">
          <ul>
            <li>
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-[18px] text-ink"
                aria-expanded={mobileSvc}
                aria-controls="mobile-services"
                onClick={() => setMobileSvc((v) => !v)}
              >
                Services
                <ChevronDown aria-hidden="true" className={cn('h-5 w-5 transition-transform duration-200', mobileSvc && 'rotate-180')} />
              </button>
              <div id="mobile-services" className={mobileSvc ? 'block' : 'hidden'}>
                {mobileServices}
              </div>
            </li>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-4 text-[18px] text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-8 flex h-12 items-center justify-center rounded-full bg-cobalt text-[15px] font-medium text-white hover:bg-cobalt-dark"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
