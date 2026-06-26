'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/support', label: 'Support' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={`transition-all duration-300 ${scrolled || open ? 'glass' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/new_logo/logo_transparent.png" alt="HITROO" width={32} height={32} />
            <span className="text-lg font-bold tracking-tight text-[#202124]">HITROO</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${isActive(l.href) ? 'text-[#4285F4]' : 'text-[#5f6368] hover:text-[#4285F4]'}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary text-sm font-medium h-10 px-5 rounded-full flex items-center">
              Start a Project
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-[#202124]"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-[#e8eaed]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`py-3 text-base font-medium border-b border-[#f1f3f4] ${isActive(l.href) ? 'text-[#4285F4]' : 'text-[#3c4043]'}`}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary text-sm font-medium h-11 mt-4 rounded-full flex items-center justify-center">
                Start a Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
