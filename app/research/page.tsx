'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';

const focus = [
  { title: 'Applied AI', desc: 'Models, fine-tuning, and inference that hold up in production.', color: '#0a0a0a' },
  { title: 'Systems & performance', desc: 'Making hard, slow, or fragile software fast and reliable.', color: '#0a0a0a' },
  { title: 'Automation', desc: 'Agents and workflows that take real work off people.', color: '#0a0a0a' },
  { title: 'Modernization', desc: 'Bringing legacy software into the AI era safely.', color: '#0a0a0a' },
];

const approach = [
  { title: 'Real problems', desc: 'We research what businesses actually struggle with.', color: '#0a0a0a' },
  { title: 'Hard problems', desc: 'The work other shops walk away from.', color: '#0a0a0a' },
  { title: 'Into production', desc: 'Research that ships as product — not papers.', color: '#0a0a0a' },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Research</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.0]">
              We research the <span className="text-brand">hard</span> problems.
            </h1>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-md">
              We actively research in software and AI, and turn that work into solutions for the problems
              businesses actually face — not just the easy ones.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-7 py-3.5 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-8">
              Bring us a hard one <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/research.png" alt="HITROO research" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Focus areas */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#0a0a0a]">Focus areas</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.02]">Where we go deep.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 border-t border-[#e5e5e5] pt-12">
              {focus.map((c) => (
                <div key={c.title}>
                  <span className="block w-8 h-1 rounded-full mb-4" style={{ backgroundColor: c.color }} />
                  <h3 className="text-lg font-semibold text-[#0a0a0a]">{c.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-1.5 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      <section className="px-6 py-24 md:py-32 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#0a0a0a]">Our approach</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.02]">Research that ships.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-3 gap-x-10 gap-y-12 border-t border-[#e5e5e5] pt-12">
              {approach.map((c) => (
                <div key={c.title}>
                  <span className="block w-8 h-1 rounded-full mb-4" style={{ backgroundColor: c.color }} />
                  <h3 className="text-xl font-semibold text-[#0a0a0a]">{c.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-2 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-40 bg-[#fafafa] border-t border-[#e5e5e5] text-center">
        <Reveal className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] leading-[1.0]">Got a problem worth solving?</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-9">Talk to us <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
