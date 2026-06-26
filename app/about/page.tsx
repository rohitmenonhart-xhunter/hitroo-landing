'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';
import { COMPANY } from '@/lib/site-data';

const ACCENTS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#4285F4', '#EA4335'];

export default function About() {
  const capabilities = [
    { title: 'Custom software', desc: 'Platforms, tools, and systems you own.' },
    { title: 'Apps', desc: 'Mobile and desktop, every platform.' },
    { title: 'AI & automation', desc: 'Models, agents, and AI-ready upgrades.' },
    { title: 'Audits', desc: 'Find what slows you down, then fix it.' },
    { title: 'Quality & security', desc: 'Threat-tested before it ships.' },
    { title: 'Ongoing support', desc: 'The HITROO app, after launch.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#4285F4]">About</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#202124] mt-4 leading-[1.0]">
              Engineering the <span className="text-brand">future</span>.
            </h1>
            <p className="text-lg text-[#5f6368] mt-6 leading-relaxed max-w-lg">
              HITROO builds intelligent machines and software systems that integrate seamlessly with the real
              world — owned end to end, from the first diagram to production traffic. We&apos;re based in {COMPANY.location}.
            </p>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/about.png" alt="HITROO — a team that builds" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / Mission as big statements */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e8eaed]">
        <div className="max-w-5xl mx-auto space-y-16">
          <Reveal>
            <span className="eyebrow text-[#4285F4]">Vision</span>
            <p className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] text-[#202124] mt-4 leading-[1.12]">
              A future where intelligence is <span className="text-brand">universal</span> — distributed, adaptable, and deployable everywhere.
            </p>
          </Reveal>
          <Reveal>
            <span className="eyebrow text-[#EA4335]">Mission</span>
            <p className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] text-[#202124] mt-4 leading-[1.12]">
              Design, engineer, and deploy high-performance software and AI — <span className="text-[#9aa0a6]">without the cost and complexity that locks others out.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 py-24 md:py-32 border-t border-[#e8eaed]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#80868b]">Capabilities</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#202124] mt-3 leading-[1.02]">Full-spectrum engineering.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 border-t border-[#e8eaed] pt-12">
              {capabilities.map((c, i) => (
                <div key={c.title}>
                  <span className="block w-8 h-1 rounded-full mb-4" style={{ backgroundColor: ACCENTS[i] }} />
                  <h3 className="text-xl font-semibold text-[#202124]">{c.title}</h3>
                  <p className="text-sm text-[#5f6368] mt-2 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e8eaed]">
        <Reveal className="max-w-4xl mx-auto text-center">
          <span className="eyebrow text-[#34A853]">Story</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#202124] mt-3 leading-[1.05]">Born from frustration.</h2>
          <p className="text-lg text-[#5f6368] mt-6 leading-relaxed max-w-2xl mx-auto">
            Advanced technology was becoming inaccessible — too costly, too complex, too closed. HITROO was
            created to challenge that: powerful, modern software and AI that any business can actually use.
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-40 border-t border-[#e8eaed] text-center">
        <Reveal className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#202124] leading-[1.0]">Build with us.</h2>
          <div className="flex items-center justify-center gap-4 mt-9">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#202124] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all">Get in Touch <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/services" className="text-sm font-semibold text-[#5f6368] hover:text-[#4285F4] transition-colors">View services</Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
