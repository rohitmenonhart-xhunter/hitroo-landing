'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Wordmark from '@/components/brand/Wordmark';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/services', label: 'What we do' },
  { href: '/about', label: 'About' },
  { href: '/insights', label: 'Insights' },
  { href: '/support', label: 'Support' },
];

const RING = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char';

/** "Get in touch": a white pill with the ember circle, as in the header and closing blocks. */
export function TouchPill({ className, label = 'Get in touch', href = '/contact' }: { className?: string; label?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-12 items-center gap-3 rounded-full bg-white pl-5 pr-1.5 text-[16px] font-medium text-char ring-1 ring-char/10 transition-colors hover:bg-[#FFF8F5]',
        RING,
        className
      )}
    >
      {label}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </span>
    </Link>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label="HITROO home" className={cn('rounded-sm', RING)}>
      <Wordmark className="text-[27px] text-char" />
    </Link>
  );
}

/**
 * Header: clear at the top of the page; scrolling down tucks it away, scrolling up brings it back as a floating
 * glass bar. The logo sits left, plain links and "Get in touch" right; phones get a full-screen menu.
 */
export default function WarmHeader() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setFloating(y > 24);
      // Small movements (trackpad jitter) change nothing; a real scroll down hides, any scroll up shows.
      if (y > last + 6 && y > 160) setHidden(true);
      else if (y < last - 6 || y <= 160) setHidden(false);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Holds the header's place, so the page doesn't jump under the fixed bar. */}
      <div aria-hidden="true" className="h-[76px]" />
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
          hidden && !open ? '-translate-y-[120%]' : 'translate-y-0'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between transition-[max-width,margin,padding,border-radius,background-color] duration-500 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)]',
            floating && !open
              ? 'glass-warm mt-3 h-[64px] max-w-[min(1360px,calc(100%-24px))] rounded-[20px] px-5 sm:px-6'
              : 'h-[76px] max-w-[1440px] rounded-none border border-transparent px-5 sm:px-8 lg:px-10',
            open && 'bg-paper'
          )}
        >
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname.startsWith(l.href) ? 'page' : undefined}
                className={cn('text-[16px] font-medium text-char/80 transition-colors hover:text-char', RING)}
              >
                {l.label}
              </Link>
            ))}
            <TouchPill />
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={cn('inline-flex h-11 items-center rounded-full bg-white px-5 text-[15px] font-medium text-char ring-1 ring-char/10 md:hidden', RING)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
        {open && (
          <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto bg-paper px-5 pb-10 pt-6 md:hidden">
            <ul>
              {NAV.map((l) => (
                <li key={l.href} className="border-b border-char/10">
                  <Link href={l.href} className="flex items-center justify-between py-5 font-display text-[32px] font-extrabold tracking-[-0.04em] text-char">
                    {l.label}
                    <ArrowUpRight aria-hidden="true" className="h-6 w-6 text-stone" />
                  </Link>
                </li>
              ))}
            </ul>
            <TouchPill className="mt-8" />
          </div>
        )}
      </header>
    </>
  );
}
