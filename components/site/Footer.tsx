import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { COMPANY, services } from '@/lib/site-data';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e5e5e5]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/new_logo/new_logo.png" alt="HITROO" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold text-[#0a0a0a]">HITROO</span>
            </Link>
            <p className="text-sm text-[#4a4a4a] leading-relaxed max-w-xs">{COMPANY.blurb}</p>
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
                <MapPin className="h-4 w-4 text-[#6b6b6b]" /> {COMPANY.location}
              </div>
              <a href={`mailto:${COMPANY.email}`} className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">{COMPANY.email}</a>
              <a href={COMPANY.phoneHref} className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">{COMPANY.phone}</a>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#0a0a0a] mb-4">Services</h4>
            <div className="space-y-2.5">
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">
                  {s.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#0a0a0a] mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">About</Link>
              <Link href="/research" className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">Research</Link>
              <Link href="/support" className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">Support</Link>
              <Link href="/careers" className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">Careers</Link>
              <Link href="/contact" className="block text-sm text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#e5e5e5] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6b6b6b]">© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
            <span className="text-xs text-[#6b6b6b] ml-2">{COMPANY.slogan}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
