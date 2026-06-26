import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { COMPANY, services } from '@/lib/site-data';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8eaed]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/new_logo/logo_transparent.png" alt="HITROO" width={32} height={32} />
              <span className="text-lg font-bold text-[#202124]">HITROO</span>
            </Link>
            <p className="text-sm text-[#5f6368] leading-relaxed max-w-xs">{COMPANY.blurb}</p>
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-[#5f6368]">
                <MapPin className="h-4 w-4 text-[#80868b]" /> {COMPANY.location}
              </div>
              <a href={`mailto:${COMPANY.email}`} className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">{COMPANY.email}</a>
              <a href={COMPANY.phoneHref} className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">{COMPANY.phone}</a>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#202124] mb-4">Services</h4>
            <div className="space-y-2.5">
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">
                  {s.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#202124] mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">About</Link>
              <Link href="/research" className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">Research</Link>
              <Link href="/support" className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">Support</Link>
              <Link href="/careers" className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">Careers</Link>
              <Link href="/contact" className="block text-sm text-[#5f6368] hover:text-[#4285F4] transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#e8eaed] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#80868b]">© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBC05]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
            <span className="text-xs text-[#80868b] ml-2">{COMPANY.slogan}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
