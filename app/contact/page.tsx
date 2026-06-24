'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Check, ArrowRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';
import { services, COMPANY } from '@/lib/site-data';

const FIELD = 'w-full px-4 py-3 bg-white border border-[#dcdcdc] rounded-xl text-sm text-[#0a0a0a] placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#0a0a0a] focus:ring-4 focus:ring-[#0a0a0a]/10 transition-all';
const LABEL = 'block text-xs font-semibold uppercase tracking-widest text-[#4a4a4a] mb-2';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const context = `${interest ? `Interested in: ${interest}\n` : ''}${message}`.trim();
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, context, leadType: 'contact' }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName(''); setEmail(''); setPhone(''); setInterest(''); setMessage('');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please email us at info@hitroo.com.');
      }
    } catch {
      setError('Could not connect. Please email us at info@hitroo.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Contact</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.0]">
              Let&apos;s build it <span className="text-brand">together</span>.
            </h1>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-md">
              Tell us about your project. We usually respond within a day — from {COMPANY.location}.
            </p>
            <div className="mt-8 space-y-2">
              <a href={`mailto:${COMPANY.email}`} className="block text-lg font-semibold text-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">{COMPANY.email}</a>
              <a href={COMPANY.phoneHref} className="block text-lg font-semibold text-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">{COMPANY.phone}</a>
            </div>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/contact.png" alt="Get in touch with HITROO" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 py-20 md:py-28 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <Reveal className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0a0a0a]/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-[#0a0a0a]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0a0a0a] mb-2">Message sent.</h2>
              <p className="text-base text-[#4a4a4a]">Thank you for reaching out — our team will get back to you shortly.</p>
            </Reveal>
          ) : (
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#0a0a0a] mb-10">Start a conversation.</h2>
              <form onSubmit={submit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL}>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={FIELD} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={LABEL}>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL}>Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={FIELD} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className={LABEL}>I&apos;m interested in</label>
                    <select value={interest} onChange={(e) => setInterest(e.target.value)} className={FIELD}>
                      <option value="">Select a service...</option>
                      {services.map((s) => (<option key={s.slug} value={s.title}>{s.title}</option>))}
                      <option value="Something else">Something else</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Project details</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={`${FIELD} resize-none`} placeholder="Tell us what you'd like to build..." />
                </div>
                <button type="submit" disabled={(!email.trim() && !phone.trim()) || submitting} className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0">
                  {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" />Sending</>) : (<>Send message <ArrowRight className="h-4 w-4" /></>)}
                </button>
                {error && <p className="text-sm text-[#0a0a0a]">{error}</p>}
                <p className="text-xs text-[#6b6b6b]">Provide an email or phone number so we can reach you back.</p>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      {/* Careers nudge */}
      <section className="px-6 py-20 border-t border-[#e5e5e5] text-center">
        <Reveal className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-[#0a0a0a]">Looking to join us instead?</h2>
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a0a0a] mt-4 hover:gap-2.5 transition-all">View open roles <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
