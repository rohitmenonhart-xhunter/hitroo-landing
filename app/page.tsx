'use client';

import { ArrowRight, Check, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';
import { services, COMPANY } from '@/lib/site-data';

export default function Home() {
  const process = [
    { title: 'Discover', description: 'Your goals, constraints, and users.', color: '#0a0a0a' },
    { title: 'Design', description: 'Architecture mapped before code.', color: '#0a0a0a' },
    { title: 'Build', description: 'Production-grade, in iterations.', color: '#0a0a0a' },
    { title: 'Test & Secure', description: 'Full QA and threat testing.', color: '#0a0a0a' },
    { title: 'Launch', description: 'Reliable delivery, monitored.', color: '#0a0a0a' },
    { title: 'Support', description: 'Ongoing, via the HITROO app.', color: '#0a0a0a' },
  ];

  const audience = [
    { title: 'Companies', description: 'Enterprise platforms, modernization, and AI at scale.', color: '#0a0a0a' },
    { title: 'Businesses', description: 'Custom tools and automation that remove daily friction.', color: '#0a0a0a' },
    { title: 'Individuals', description: 'Founders turning an idea into real software.', color: '#0a0a0a' },
  ];

  const platforms = ['iOS', 'Android', 'Windows', 'macOS'];

  const why = [
    { title: 'Research-driven', description: 'We solve hard problems others avoid.', color: '#0a0a0a' },
    { title: 'Extreme quality', description: 'Crafted, reviewed, held to a high bar.', color: '#0a0a0a' },
    { title: 'Security-first', description: 'Threat-tested before anything ships.', color: '#0a0a0a' },
    { title: 'Effortless support', description: 'Help in one app, 24h response.', color: '#0a0a0a' },
    { title: 'AI-first', description: 'Custom models and AI-ready modernization.', color: '#0a0a0a' },
    { title: 'Built in Chennai', description: 'A dedicated team, end to end.', color: '#0a0a0a' },
  ];

  const aiPillars = [
    { title: 'Custom AI models', desc: 'Built and trained on your data — plus ready-to-use in-house models.' },
    { title: 'AI automation', desc: 'Agents and workflows that run the busywork for you.' },
    { title: 'AI modernization', desc: 'Audit and AI-enable the software you already run.' },
  ];

  const security = [
    { title: 'Security testing', desc: 'Tested against real threats.', color: '#0a0a0a' },
    { title: 'Deep QA', desc: 'Every path verified before launch.', color: '#0a0a0a' },
    { title: 'Extreme quality', desc: 'Held to a high engineering bar.', color: '#0a0a0a' },
    { title: 'Built to scale', desc: 'Reliable under real load.', color: '#0a0a0a' },
  ];

  const research = [
    { title: 'Applied research', desc: 'Software and AI, focused on real outcomes.', color: '#0a0a0a' },
    { title: 'Hard problems', desc: 'The work other shops walk away from.', color: '#0a0a0a' },
    { title: 'Into production', desc: 'Research that ships, not papers.', color: '#0a0a0a' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 bg-white">
        <Image src="/hero/bg.png" alt="" fill priority className="object-cover object-center z-0" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-transparent to-white/70" />

        <div className="relative z-10 w-full max-w-6xl mx-auto text-center pt-28 pb-16 flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-[#0a0a0a]" />
            <span className="h-2 w-2 rounded-full bg-[#0a0a0a]" />
            <span className="h-2 w-2 rounded-full bg-[#0a0a0a]" />
            <span className="h-2 w-2 rounded-full bg-[#0a0a0a]" />
          </div>
          <h1 className="font-bold tracking-[-0.03em] text-[#0a0a0a] max-w-5xl animate-fade-in" style={{ fontSize: 'clamp(2.75rem, 9vw, 6.5rem)', lineHeight: 1.0 }}>
            We build <span className="text-brand">intelligent</span> systems<span className="text-[#0a0a0a]">.</span>
          </h1>
          <p className="text-base md:text-lg text-[#4a4a4a] leading-relaxed mt-8 max-w-2xl animate-fade-in">
            A technology studio building software, mobile and desktop apps,
            AI models, and automation — plus our own products.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-9 animate-fade-in">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-7 py-3.5 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all">
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="text-sm font-semibold text-[#2a2a2a] hover:text-[#0a0a0a] px-4 py-3.5 transition-colors">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== POSITIONING ===================== */}
      <section className="px-6 py-32 md:py-44 border-t border-[#e5e5e5]">
        <Reveal className="max-w-5xl mx-auto text-center">
          <span className="block h-1 w-12 rounded-full brand-bar-smooth mx-auto mb-10" />
          <p className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#0a0a0a] leading-[1.12] tracking-[-0.025em]">
            We build <span className="text-brand">intelligent software</span> for businesses
            <span className="text-[#8a8a8a]"> — and stay with them long after launch.</span>
          </p>
        </Reveal>
      </section>

      {/* ===================== SERVICES (editorial list) ===================== */}
      <section className="px-6 py-28 md:py-36 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#0a0a0a]">What we do</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">
              Software, apps,<br />and AI — end to end.
            </h2>
          </Reveal>

          <div className="border-t border-[#e5e5e5]">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 40} y={14}>
                <Link href={`/services/${s.slug}`} className="group block border-b border-[#e5e5e5]" style={{ ['--c' as string]: s.color }}>
                  <div className="py-7 md:py-8 flex items-center gap-5 md:gap-8">
                    <span className="hidden sm:block text-sm font-semibold tabular-nums w-7 text-[#b0b0b0] transition-colors group-hover:text-[color:var(--c)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0 md:flex md:items-baseline md:justify-between md:gap-10">
                      <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#0a0a0a] transition-transform duration-300 group-hover:translate-x-1.5">
                        {s.title}
                      </h3>
                      <p className="text-sm md:text-base text-[#4a4a4a] mt-1.5 md:mt-0 md:max-w-md md:text-right">{s.short}</p>
                    </div>
                    <ArrowRight className="hidden md:block h-5 w-5 shrink-0 text-[#b0b0b0] transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[color:var(--c)]" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AI ===================== */}
      <section className="px-6 py-28 md:py-36 border-t border-[#e5e5e5] overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">The AI era</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">
              Build new AI — or make it <span className="text-brand">AI-ready</span>.
            </h2>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-lg">
              We develop and custom-train models on your data, deploy our in-house models, automate your
              workflows, and upgrade legacy systems for the AI era.
            </p>
            <div className="mt-8 divide-y divide-[#e5e5e5] border-t border-[#e5e5e5]">
              {aiPillars.map((c) => (
                <div key={c.title} className="py-4">
                  <h3 className="text-lg font-semibold text-[#0a0a0a]">{c.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/services/ai-models" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a0a0a] mt-8 hover:gap-3 transition-all">
              Explore our AI work <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/ai.png" alt="Colorful abstract representing artificial intelligence" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== HITROO APP / SUPPORT ===================== */}
      <section id="support" className="px-6 py-28 md:py-36 scroll-mt-20 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Support, built in</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">The HITROO app.</h2>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-lg">
              No customer-care runaround. Raise a ticket the moment you need help and talk to the team
              that built your software — from any device you use.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-7 text-sm font-medium text-[#2a2a2a]">
              {platforms.map((p) => (<span key={p}>{p}</span>))}
            </div>
            <div className="flex items-center gap-12 mt-10">
              <div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">24<span className="text-[#0a0a0a]">h</span></div>
                <div className="text-xs uppercase tracking-[0.12em] text-[#6b6b6b] mt-2">First response</div>
              </div>
              <div className="h-12 w-px bg-[#e5e5e5]" />
              <div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">48<span className="text-[#0a0a0a]">h</span></div>
                <div className="text-xs uppercase tracking-[0.12em] text-[#6b6b6b] mt-2">Typical resolution</div>
              </div>
            </div>
          </Reveal>

          {/* Phone product visual */}
          <Reveal delay={120} className="relative flex justify-center">
            <div className="absolute inset-0 -z-0 m-auto w-[22rem] h-[22rem] rounded-full bg-gradient-to-br from-[#0a0a0a]/12 via-[#0a0a0a]/8 to-[#0a0a0a]/12 blur-3xl" />
            <div className="relative w-[280px] rounded-[2.75rem] bg-[#0a0a0a] p-2.5 shadow-[0_50px_90px_-30px_rgba(60,64,67,0.5)]">
              <div className="rounded-[2.25rem] overflow-hidden bg-white">
                <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] font-semibold text-[#0a0a0a]">
                  <span>9:41</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#0a0a0a]" /> Online</span>
                </div>
                <div className="px-6 py-4 flex items-center gap-2.5 border-b border-[#f1f1f1]">
                  <Image src="/new_logo/new_logo.png" alt="HITROO" width={26} height={26} className="rounded-md" />
                  <span className="text-sm font-semibold text-[#0a0a0a]">Support</span>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6b6b6b]">Ticket #2041</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0a0a0a]"><Check className="h-3 w-3" /> Resolved</span>
                    </div>
                    <p className="text-sm font-medium text-[#0a0a0a] mt-2">Add SSO to the admin dashboard</p>
                    <p className="text-xs text-[#4a4a4a] mt-1.5">Picked up in 3h · shipped in 41h.</p>
                  </div>
                  <div className="h-px bg-[#f1f1f1]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6b6b6b]">Ticket #2042</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0a0a0a]"><Clock className="h-3 w-3" /> In progress</span>
                  </div>
                  <button className="w-full rounded-full bg-[#0a0a0a] text-white text-xs font-medium py-3 mt-1">New ticket</button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="px-6 py-28 md:py-36 border-t border-[#e5e5e5] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#0a0a0a]">How we work</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">From idea to ongoing support.</h2>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
                <Image src="/img/craft.png" alt="Colorful abstract of software being engineered" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
                <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                {process.map((step, i) => (
                  <div key={step.title}>
                    <span className="block w-9 h-1 rounded-full mb-4" style={{ backgroundColor: step.color }} />
                    <span className="text-2xl font-bold text-[#0a0a0a]">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-base font-semibold text-[#0a0a0a] mt-2">{step.title}</h3>
                    <p className="text-sm text-[#4a4a4a] mt-1 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== QUALITY & SECURITY ===================== */}
      <section className="px-6 py-28 md:py-36 bg-[#fafafa] border-t border-[#e5e5e5] overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Quality & Security</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">Nothing ships<br />until it&apos;s solid.</h2>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-lg">
              We hold our software to an extreme quality bar and run dedicated security-threat testing on
              everything we build — so what you launch is fast, reliable, and safe.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {security.map((c) => (
                <div key={c.title}>
                  <span className="block w-8 h-1 rounded-full mb-3" style={{ backgroundColor: c.color }} />
                  <h3 className="text-base font-semibold text-[#0a0a0a]">{c.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/secure.png" alt="Colorful abstract of security and quality" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #fafafa' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== RESEARCH ===================== */}
      <section id="research" className="px-6 py-28 md:py-36 scroll-mt-20 border-t border-[#e5e5e5] overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Research</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">We research the hard problems.</h2>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-2xl mx-auto">
              We actively research in software and AI, and turn that work into solutions for the hard
              problems businesses actually face — not just the easy ones.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[16/9] w-full max-w-3xl mx-auto mt-12 rounded-[2.75rem] overflow-hidden">
              <Image src="/img/research.png" alt="Colorful abstract of research and discovery" fill className="object-cover" sizes="(max-width:1024px) 90vw, 760px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 90px 38px #ffffff' }} />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="grid sm:grid-cols-3 gap-x-10 gap-y-10 mt-12 text-left">
              {research.map((c) => (
                <div key={c.title}>
                  <span className="block w-8 h-1 rounded-full mb-3" style={{ backgroundColor: c.color }} />
                  <h3 className="text-lg font-semibold text-[#0a0a0a]">{c.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-1.5 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHO WE SERVE ===================== */}
      <section className="px-6 py-28 md:py-36 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] leading-[1.02] max-w-3xl">
              For companies, businesses<span className="text-[#0a0a0a]">,</span> and individuals.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid sm:grid-cols-3 gap-x-10 gap-y-12 mt-16 border-t border-[#e5e5e5] pt-12">
              {audience.map((a) => (
                <div key={a.title}>
                  <span className="block w-9 h-1 rounded-full mb-4" style={{ backgroundColor: a.color }} />
                  <h3 className="text-xl font-semibold text-[#0a0a0a]">{a.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-2 leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHY HITROO ===================== */}
      <section className="px-6 py-28 md:py-36 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#0a0a0a]">Why HITROO</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.02]">A partner, not<br />just a vendor.</h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 border-t border-[#e5e5e5] pt-12">
              {why.map((w) => (
                <div key={w.title}>
                  <span className="block w-8 h-1 rounded-full mb-3" style={{ backgroundColor: w.color }} />
                  <h3 className="text-xl font-semibold text-[#0a0a0a]">{w.title}</h3>
                  <p className="text-sm text-[#4a4a4a] mt-2 leading-relaxed">{w.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="px-6 py-36 md:py-44 bg-[#fafafa] border-t border-[#e5e5e5] text-center">
        <Reveal className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#0a0a0a] leading-[1.0]">
            Let&apos;s build something <span className="text-brand">intelligent</span>.
          </h2>
          <p className="text-lg text-[#4a4a4a] mt-7">Start a project, modernize what you have, or get support — we&apos;re in {COMPANY.location}.</p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all">
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#support" className="text-sm font-semibold text-[#4a4a4a] hover:text-[#0a0a0a] transition-colors">Get support</a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
