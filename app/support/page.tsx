'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';

const steps = [
  { title: 'Raise a ticket', desc: 'From the app, on any device, the moment you need help.', color: '#4285F4' },
  { title: 'We pick it up', desc: 'A first response within 24 hours — from the team that built it.', color: '#EA4335' },
  { title: 'We ship the fix', desc: 'Most tickets resolved and verified within 48 hours.', color: '#FBBC05' },
  { title: 'You stay updated', desc: 'Live status, start to finish. No chasing customer care.', color: '#34A853' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#34A853]">Support, built in</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#202124] mt-4 leading-[1.0]">
              Support in <span className="text-brand">one app</span>.
            </h1>
            <p className="text-lg text-[#5f6368] mt-6 leading-relaxed max-w-md">
              The HITROO app is your direct line to us — raise a ticket and talk to the people who built your
              software, from any device. No customer-care runaround.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-7 text-sm font-medium text-[#3c4043]">
              {['iOS', 'Android', 'Windows', 'macOS'].map((p) => (<span key={p}>{p}</span>))}
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#202124] text-white text-sm font-medium px-7 py-3.5 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-8">
              Become a client <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/support.png" alt="HITROO support" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Phone + SLA */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e8eaed]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="flex justify-center">
            <div className="relative w-[280px] rounded-[2.75rem] bg-[#0d0d0f] p-2.5 shadow-[0_50px_90px_-30px_rgba(60,64,67,0.5)]">
              <div className="rounded-[2.25rem] overflow-hidden bg-white">
                <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] font-semibold text-[#202124]">
                  <span>9:41</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#34A853]" /> Online</span>
                </div>
                <div className="px-6 py-4 flex items-center gap-2.5 border-b border-[#f1f3f4]">
                  <Image src="/new_logo/logo_transparent.png" alt="HITROO" width={26} height={26} />
                  <span className="text-sm font-semibold text-[#202124]">Support</span>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#80868b]">Ticket #2041</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#34A853]"><Check className="h-3 w-3" /> Resolved</span>
                    </div>
                    <p className="text-sm font-medium text-[#202124] mt-2">Add SSO to the admin dashboard</p>
                    <p className="text-xs text-[#5f6368] mt-1.5">Picked up in 3h · shipped in 41h.</p>
                  </div>
                  <div className="h-px bg-[#f1f3f4]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#80868b]">Ticket #2042</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4285F4]"><Clock className="h-3 w-3" /> In progress</span>
                  </div>
                  <button className="w-full rounded-full bg-[#202124] text-white text-xs font-medium py-3 mt-1">New ticket</button>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow text-[#4285F4]">Service level</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#202124] mt-3 leading-[1.05]">Fast, by default.</h2>
            <div className="flex items-center gap-12 mt-10">
              <div>
                <div className="text-5xl md:text-6xl font-bold tracking-tight text-[#202124]">24<span className="text-[#34A853]">h</span></div>
                <div className="text-xs uppercase tracking-[0.12em] text-[#80868b] mt-2">First response</div>
              </div>
              <div className="h-14 w-px bg-[#e0e2e6]" />
              <div>
                <div className="text-5xl md:text-6xl font-bold tracking-tight text-[#202124]">48<span className="text-[#34A853]">h</span></div>
                <div className="text-xs uppercase tracking-[0.12em] text-[#80868b] mt-2">Typical resolution</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 md:py-32 border-t border-[#e8eaed]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-2xl mb-14">
            <span className="eyebrow text-[#EA4335]">How it works</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#202124] mt-3 leading-[1.02]">Four steps, every time.</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 border-t border-[#e8eaed] pt-12">
              {steps.map((s, i) => (
                <div key={s.title}>
                  <span className="block w-9 h-1 rounded-full mb-4" style={{ backgroundColor: s.color }} />
                  <span className="text-2xl font-bold text-[#202124]">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg font-semibold text-[#202124] mt-2">{s.title}</h3>
                  <p className="text-sm text-[#5f6368] mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 md:py-40 bg-[#fafafa] border-t border-[#e8eaed] text-center">
        <Reveal className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.03em] text-[#202124] leading-[1.0]">Build with a team that stays.</h2>
          <p className="text-lg text-[#5f6368] mt-6">Every project ships with the HITROO app and our support SLA.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#202124] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all mt-9">Start a Project <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
