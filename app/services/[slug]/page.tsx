'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';
import { getService, services } from '@/lib/site-data';

export default function ServiceDetail() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const service = getService(slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Nav />
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#0a0a0a] mb-2">Service not found</h1>
            <Link href="/services" className="text-sm font-semibold text-[#0a0a0a] inline-flex items-center gap-2 mt-4">
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const c = service.color;
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <Link href="/services" className="inline-flex items-center gap-2 text-xs font-medium text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> All services
            </Link>
            <span className="block eyebrow mt-6" style={{ color: c }}>{service.tagline}</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.02]">{service.title}</h1>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-lg">{service.overview}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-7 py-3.5 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-8">
              Discuss your project <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src={service.image} alt={service.title} fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" priority />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* The problem */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <span className="eyebrow" style={{ color: c }}>The problem</span>
            <p className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] text-[#0a0a0a] mt-5 leading-[1.15]">
              {service.problem}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our approach + solution image */}
      <section className="px-6 py-24 md:py-32 border-t border-[#e5e5e5] overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow" style={{ color: c }}>How we solve it</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.02]">Our approach.</h2>
            <div className="mt-10 space-y-9">
              {service.approach.map((step, i) => (
                <div key={step.title} className="flex gap-5">
                  <span className="text-2xl font-bold tabular-nums shrink-0" style={{ color: c }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0a0a0a]">{step.title}</h3>
                    <p className="text-base text-[#4a4a4a] mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src={service.solutionImage} alt={`${service.title} — our solution`} fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we deliver */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#6b6b6b]">What we deliver</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.02]">Built to a higher bar.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 border-t border-[#e5e5e5] pt-12">
              {service.features.map((f) => (
                <div key={f.title}>
                  <span className="block w-8 h-1 rounded-full mb-4" style={{ backgroundColor: c }} />
                  <h3 className="text-lg font-semibold text-[#0a0a0a]">{f.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-1.5 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities + Outcomes */}
      <section className="px-6 py-24 md:py-32 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.05]">What&apos;s included.</h2>
            <div className="mt-8 divide-y divide-[#e5e5e5] border-t border-[#e5e5e5]">
              {service.capabilities.map((cap) => (
                <div key={cap} className="py-4 flex items-center gap-4">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c }} />
                  <span className="text-base text-[#2a2a2a]">{cap}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow text-[#0a0a0a]">The outcome</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.05]">What you get.</h2>
            <div className="mt-8 space-y-8">
              {service.outcomes.map((o, i) => (
                <div key={o} className="flex items-baseline gap-4">
                  <span className="text-xl font-bold tabular-nums" style={{ color: ['#0a0a0a', '#0a0a0a', '#0a0a0a'][i % 3] }}>{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-xl md:text-2xl font-semibold tracking-[-0.01em] text-[#0a0a0a]">{o}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              <span className="eyebrow text-[#6b6b6b] w-full">Technology</span>
              {service.stack.map((t) => (<span key={t} className="text-base font-semibold text-[#2a2a2a]">{t}</span>))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal><h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#0a0a0a] leading-[1.02]">Explore more.</h2></Reveal>
          <div className="border-t border-[#e5e5e5] mt-12">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 40} y={14}>
                <Link href={`/services/${s.slug}`} className="group block border-b border-[#e5e5e5]" style={{ ['--c' as string]: s.color }}>
                  <div className="py-6 flex items-center justify-between gap-6">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-[#0a0a0a] transition-transform duration-300 group-hover:translate-x-1.5">{s.title}</h3>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#b0b0b0] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[color:var(--c)]" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-40 border-t border-[#e5e5e5] text-center">
        <Reveal className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] leading-[1.0]">Ready to start?</h2>
          <p className="text-lg text-[#4a4a4a] mt-6">Let&apos;s talk about your {service.title.toLowerCase()} needs.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-9">
            Start a Project <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
