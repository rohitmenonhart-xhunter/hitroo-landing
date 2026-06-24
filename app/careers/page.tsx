'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Upload, Check, ArrowRight } from 'lucide-react';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import Reveal from '@/components/site/Reveal';

const POSITIONS = [
  { id: 'fullstack', title: 'Full Stack Developer', description: 'End-to-end web & mobile with modern frameworks', color: '#0a0a0a' },
  { id: 'frontend', title: 'Frontend Developer', description: 'Beautiful, responsive, performant interfaces', color: '#0a0a0a' },
  { id: 'backend', title: 'Backend Developer', description: 'Scalable APIs, databases, and infrastructure', color: '#0a0a0a' },
  { id: 'hardware-mech', title: 'Hardware — Mechanical', description: 'Chassis design, 3D modeling, mechanical systems', color: '#0a0a0a' },
  { id: 'hardware-elec', title: 'Hardware — Electronics', description: 'STM-level embedded systems, PCB design, firmware', color: '#0a0a0a' },
  { id: 'ml-ai', title: 'ML / AI Engineer', description: 'Model training, testing, fine-tuning, deployment', color: '#0a0a0a' },
];

const FIELD = 'w-full px-4 py-3 bg-white border border-[#dcdcdc] rounded-xl text-sm text-[#0a0a0a] placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#0a0a0a] focus:ring-4 focus:ring-[#0a0a0a]/10 transition-all';
const LABEL = 'block text-xs font-semibold uppercase tracking-widest text-[#4a4a4a] mb-2';

export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', linkedin: '', portfolio: '', whyHitroo: '', whyPosition: '', experience: '', availability: '' });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') setResume(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition || !formData.name || !formData.email) return;
    setIsSubmitting(true);
    try {
      let resumeData = '';
      if (resume) {
        const reader = new FileReader();
        resumeData = await new Promise((resolve) => { reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(resume); });
      }
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, position: selectedPosition, positionTitle: POSITIONS.find((p) => p.id === selectedPosition)?.title, resumeName: resume?.name, resumeData }),
      });
      if (response.ok) setSubmitted(true);
    } catch {
      // silent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-36 md:pt-44 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">Careers</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-4 leading-[1.0]">
              Join the <span className="text-brand">revolution</span>.
            </h1>
            <p className="text-lg text-[#4a4a4a] mt-6 leading-relaxed max-w-md">
              We&apos;re looking for builders who want to craft something extraordinary — not just take a job.
            </p>
          </Reveal>
          <Reveal delay={120} className="order-first lg:order-last">
            <div className="relative aspect-[4/3] w-full rounded-[2.75rem] overflow-hidden">
              <Image src="/img/careers.png" alt="Careers at HITROO" fill className="object-cover" sizes="(max-width:1024px) 90vw, 560px" />
              <div className="absolute inset-0 pointer-events-none rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px #ffffff' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Program */}
      <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <Reveal>
            <span className="eyebrow text-[#0a0a0a]">The program</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.05]">Internship to full-time.</h2>
            <p className="text-base text-[#4a4a4a] mt-5 leading-relaxed">
              Every role starts with a 3-month probation. Learn world-class skills, work on real projects, and
              earn a full-time role if your expertise aligns. Even if it doesn&apos;t, you leave with serious experience.
            </p>
            <p className="text-sm text-[#6b6b6b] mt-4">85% remote · communication via Gather and Slack · occasional in-person sessions.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="divide-y divide-[#e5e5e5] border-t border-[#e5e5e5]">
              {['Hands-on experience with real projects', 'Access to world-class hardware and ML models — free', 'Structured mentorship: from stone to statue', 'A path to a full-time role'].map((b, i) => (
                <div key={b} className="py-4 flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: ['#0a0a0a', '#0a0a0a', '#0a0a0a', '#0a0a0a'][i] }} />
                  <span className="text-base text-[#2a2a2a]">{b}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Positions (hairline list, selectable) */}
      <section className="px-6 py-24 md:py-32 border-t border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-12">
            <span className="eyebrow text-[#0a0a0a]">Open positions</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#0a0a0a] mt-3 leading-[1.02]">Pick your role.</h2>
          </Reveal>
          <div className="border-t border-[#e5e5e5]">
            {POSITIONS.map((p, i) => {
              const isSel = selectedPosition === p.id;
              return (
                <Reveal key={p.id} delay={i * 30} y={12}>
                  <button onClick={() => setSelectedPosition(p.id)} className="group w-full text-left border-b border-[#e5e5e5]">
                    <div className="py-6 flex items-center gap-5">
                      <span className="h-3 w-3 rounded-full shrink-0 transition-all" style={{ backgroundColor: isSel ? p.color : '#dcdcdc' }} />
                      <div className="flex-1 min-w-0 md:flex md:items-baseline md:justify-between md:gap-8">
                        <h3 className={`text-xl md:text-2xl font-semibold tracking-[-0.02em] transition-colors ${isSel ? 'text-[#0a0a0a]' : 'text-[#2a2a2a] group-hover:text-[#0a0a0a]'}`}>{p.title}</h3>
                        <p className="text-sm text-[#4a4a4a] mt-1 md:mt-0 md:text-right md:max-w-sm">{p.description}</p>
                      </div>
                      {isSel ? <Check className="h-5 w-5 shrink-0" style={{ color: p.color }} /> : <ArrowRight className="h-5 w-5 shrink-0 text-[#b0b0b0] group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application */}
      {submitted ? (
        <section className="px-6 py-28 bg-[#fafafa] border-t border-[#e5e5e5]">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0a0a0a]/10 flex items-center justify-center"><Check className="h-8 w-8 text-[#0a0a0a]" /></div>
            <h2 className="text-3xl font-bold text-[#0a0a0a] mb-2">Application submitted.</h2>
            <p className="text-base text-[#4a4a4a]">Thanks for your interest in HITROO. We&apos;ll review and get back to you soon.</p>
          </div>
        </section>
      ) : (
        <section className="px-6 py-24 md:py-32 bg-[#fafafa] border-t border-[#e5e5e5]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#0a0a0a] mb-2">Apply now.</h2>
            <p className="text-sm text-[#4a4a4a] mb-10">{selectedPosition ? `Applying for: ${POSITIONS.find((p) => p.id === selectedPosition)?.title}` : 'Select a position above to continue.'}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={LABEL}>Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={FIELD} placeholder="Your full name" /></div>
                <div><label className={LABEL}>Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={FIELD} placeholder="you@email.com" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={LABEL}>Phone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className={FIELD} placeholder="+91 XXXXX XXXXX" /></div>
                <div><label className={LABEL}>LinkedIn</label><input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className={FIELD} placeholder="linkedin.com/in/you" /></div>
              </div>
              <div><label className={LABEL}>Portfolio / GitHub</label><input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className={FIELD} placeholder="github.com/you" /></div>
              <div>
                <label className={LABEL}>Resume (PDF) *</label>
                <label className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${resume ? 'border-[#0a0a0a]/50 bg-[#0a0a0a]/5' : 'border-[#dcdcdc] hover:border-[#0a0a0a]/50'}`}>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  {resume ? (<><Check className="h-4 w-4 text-[#0a0a0a]" /><span className="text-sm text-[#0a0a0a] font-medium">{resume.name}</span></>) : (<><Upload className="h-4 w-4 text-[#6b6b6b]" /><span className="text-sm text-[#4a4a4a]">Click to upload PDF resume</span></>)}
                </label>
              </div>
              <div><label className={LABEL}>Why HITROO? *</label><textarea name="whyHitroo" value={formData.whyHitroo} onChange={handleInputChange} required rows={3} className={`${FIELD} resize-none`} placeholder="What excites you about HITROO?" /></div>
              <div><label className={LABEL}>Why this position? *</label><textarea name="whyPosition" value={formData.whyPosition} onChange={handleInputChange} required rows={3} className={`${FIELD} resize-none`} placeholder="Why are you the right fit?" /></div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={LABEL}>Experience</label>
                  <select name="experience" value={formData.experience} onChange={handleInputChange} className={FIELD}>
                    <option value="">Select...</option><option value="student">Student / Fresh Graduate</option><option value="0-1">0-1 years</option><option value="1-3">1-3 years</option><option value="3+">3+ years</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Availability</label>
                  <select name="availability" value={formData.availability} onChange={handleInputChange} className={FIELD}>
                    <option value="">Select...</option><option value="immediate">Immediate</option><option value="2weeks">Within 2 weeks</option><option value="1month">Within 1 month</option><option value="later">Later</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={!selectedPosition || !formData.name || !formData.email || !formData.phone || !resume || isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-sm font-medium px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(32,33,36,0.25)] hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0">
                {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" />Submitting</>) : (<>Submit application <ArrowRight className="h-4 w-4" /></>)}
              </button>
              <p className="text-xs text-[#6b6b6b]">By submitting, you agree to our internship terms. Applications are processed within 7 days.</p>
            </form>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
