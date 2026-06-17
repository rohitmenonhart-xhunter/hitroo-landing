'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';
import { services } from '@/lib/site-data';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#4285F4]">Services</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#202124] mt-4 leading-[1.0]">
              Everything you need to <span className="text-brand">ship</span>.
            </h1>
            <p className="text-lg text-[#5f6368] mt-6 leading-relaxed max-w-lg">
              From custom software and applications to AI models and automation — one team across the full
              stack, engineering from concept to production and beyond.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#202124] text-white text-sm font-medium px-7 py-3.5 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-8">
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/services-hub.png" alt="HITROO services" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* The list */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e8eaed]">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-[#e0e2e6]">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 40} y={14}>
                <Link href={`/services/${s.slug}`} className="group block border-b border-[#e0e2e6]" style={{ ['--c' as string]: s.color }}>
                  <div className="py-7 md:py-8 flex items-center gap-5 md:gap-8">
                    <span className="hidden sm:block text-sm font-semibold tabular-nums w-7 text-[#bdc1c6] transition-colors group-hover:text-[color:var(--c)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0 md:flex md:items-baseline md:justify-between md:gap-10">
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#202124] transition-transform duration-300 group-hover:translate-x-1.5">{s.title}</h2>
                      <p className="text-sm md:text-base text-[#5f6368] mt-1.5 md:mt-0 md:max-w-md md:text-right">{s.short}</p>
                    </div>
                    <ArrowRight className="hidden md:block h-5 w-5 shrink-0 text-[#bdc1c6] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[color:var(--c)]" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-40 text-center border-t border-[#e8eaed]">
        <Reveal className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#202124] leading-[1.0]">Have a project in mind?</h2>
          <p className="text-lg text-[#5f6368] mt-6">Tell us what you&apos;re building and we&apos;ll map the path to ship it.</p>
          <div className="flex items-center justify-center gap-4 mt-9">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#202124] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all">Start a Project <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/support" className="text-sm font-semibold text-[#5f6368] hover:text-[#4285F4] transition-colors">Get support</Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
