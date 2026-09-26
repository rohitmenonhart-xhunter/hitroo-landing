'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Wordmark from './Wordmark';

export interface HeaderMenu {
  id: string;
  label: string;
  /** Rendered on the server and passed in, so no menu content ships as JS. */
  panel: ReactNode;
  /** Full-width panel with the page dimmed behind it; otherwise a dropdown under its button. */
  wide?: boolean;
  /** Path prefixes that make the item look active. */
  match: string[];
}

const LINKS = [
  { href: '/support', label: 'Support' },
  { href: '/about', label: 'About' },
];

const NAV_ITEM =
  'inline-flex h-10 items-center gap-1 rounded-md px-3 text-[15px] text-ink/80 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt';

const PANEL_IN = 'animate-in fade-in-0 slide-in-from-top-1 duration-200';

/**
 * Sticky white header. Desktop: menus open on hover or click (Services as a full-width panel over a
 * dimmed page, others as dropdowns); Escape, an outside click or navigating closes them.
 * Mobile: a full-height panel with expandable sections.
 */
export default function HeaderShell({ menus, mobile: sections }: { menus: HeaderMenu[]; mobile: { id: string; label: string; content: ReactNode }[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef(0);
  // The menu the mouse is over: clicking it then keeps it open instead of toggling it shut.
  const hovered = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (open) {
        triggers.current[open]?.focus();
        setOpen(null);
      }
      if (mobile) {
        setMobile(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, mobile]);

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

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const hoverOpen = (id: string) => (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    hovered.current = id;
    cancelClose();
    setOpen(id);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };
  const leaveItem = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') hovered.current = null;
    hoverClose(e);
  };
  const hoverKeep = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') cancelClose();
  };

  const wideOpen = menus.some((m) => m.wide && m.id === open);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        (scrolled || open || mobile) && 'shadow-[0_10px_30px_-18px_rgba(10,22,51,0.22)]'
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
            {menus.map((m) => {
              const isOpen = open === m.id;
              const active = m.match.some((p) => pathname.startsWith(p));
              return (
                <li key={m.id} className={m.wide ? undefined : 'relative'} onPointerEnter={hoverOpen(m.id)} onPointerLeave={leaveItem}>
                  <button
                    ref={(el) => {
                      triggers.current[m.id] = el;
                    }}
                    type="button"
                    className={cn(NAV_ITEM, (isOpen || active) && 'text-ink')}
                    aria-expanded={isOpen}
                    aria-controls={`${m.id}-menu`}
                    onClick={() => setOpen((v) => (v === m.id && hovered.current !== m.id ? null : m.id))}
                  >
                    {m.label}
                    <ChevronDown aria-hidden="true" className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
                  </button>
                  {!m.wide && (
                    <div id={`${m.id}-menu`} className={cn('absolute left-0 top-full pt-4', isOpen ? 'block' : 'hidden')}>
                      <div className={cn('rounded-2xl bg-white p-4 shadow-[0_24px_60px_-20px_rgba(10,22,51,0.3)] ring-1 ring-ink/5', PANEL_IN)}>{m.panel}</div>
                    </div>
                  )}
                </li>
              );
            })}
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

      {/* Full-width desktop panels */}
      {menus
        .filter((m) => m.wide)
        .map((m) => (
          <div
            key={m.id}
            id={`${m.id}-menu`}
            onPointerEnter={hoverKeep}
            onPointerLeave={hoverClose}
            className={cn(
              'absolute inset-x-0 top-full bg-white shadow-[0_28px_48px_-28px_rgba(10,22,51,0.28)]',
              open === m.id ? cn('hidden lg:block', PANEL_IN) : 'hidden'
            )}
          >
            <div className="mx-auto w-full max-w-[1240px] px-10 pb-8 pt-7">{m.panel}</div>
          </div>
        ))}
      {/* Dims the page under a full-width panel; a click closes it. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(null)}
        className={cn('fixed inset-x-0 bottom-0 top-[72px] -z-10 bg-ink/25', wideOpen ? 'hidden animate-in fade-in-0 duration-200 lg:block' : 'hidden')}
      />

      {/* Mobile menu */}
      <div id="mobile-menu" className={cn('fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-white lg:hidden', mobile ? 'block' : 'hidden')}>
        <nav aria-label="Mobile" className="mx-auto w-full max-w-[1240px] px-5 pb-10 sm:px-8">
          <ul>
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left text-[18px] text-ink"
                  aria-expanded={section === s.id}
                  aria-controls={`mobile-${s.id}`}
                  onClick={() => setSection((v) => (v === s.id ? null : s.id))}
                >
                  {s.label}
                  <ChevronDown aria-hidden="true" className={cn('h-5 w-5 transition-transform duration-200', section === s.id && 'rotate-180')} />
                </button>
                <div id={`mobile-${s.id}`} className={section === s.id ? 'block' : 'hidden'}>
                  {s.content}
                </div>
              </li>
            ))}
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-4 text-[18px] text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="mt-8 flex h-12 items-center justify-center rounded-full bg-cobalt text-[15px] font-medium text-white hover:bg-cobalt-dark">
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
