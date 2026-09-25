'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPANY } from '@/lib/site-data';
import Turnstile from './Turnstile';
import { FIELD, LABEL, SUBMIT } from './form';

const POSITIONS = [
  { id: 'fullstack', title: 'Full Stack Developer' },
  { id: 'frontend', title: 'Frontend Developer' },
  { id: 'backend', title: 'Backend Developer' },
  { id: 'hardware-mech', title: 'Hardware — Mechanical' },
  { id: 'hardware-elec', title: 'Hardware — Electronics' },
  { id: 'ml-ai', title: 'ML / AI Engineer' },
];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const EMPTY = { name: '', email: '', phone: '', linkedin: '', portfolio: '', whyHitroo: '', whyPosition: '', experience: '', availability: '' };

/** Role picker + application → /api/careers (same payload and protections as before). */
export default function CareersForm() {
  const [position, setPosition] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [resume, setResume] = useState<File | null>(null);
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [checkingVerification, setCheckingVerification] = useState(true);
  const formStartedAt = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    fetch('/api/lead/config', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<{ turnstileSiteKey?: string | null }>;
      })
      .then((configuration) => {
        if (!cancelled) setTurnstileSiteKey(configuration.turnstileSiteKey || '');
      })
      .catch(() => {
        if (!cancelled) setError(`Verification could not load. Please refresh, or email ${COMPANY.email}.`);
      })
      .finally(() => {
        if (!cancelled) setCheckingVerification(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= MAX_RESUME_BYTES) {
      setResume(file);
      setError('');
    } else {
      setResume(null);
      setError('Please choose a PDF resume no larger than 5 MB.');
    }
  };

  const resetVerification = () => {
    if (turnstileSiteKey) setTurnstileResetSignal((signal) => signal + 1);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!position || !form.name || !form.email) return;
    if (turnstileSiteKey && !turnstileToken) {
      setError('Please complete the verification and try again.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let resumeData = '';
      if (resume) {
        const reader = new FileReader();
        resumeData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(resume);
        });
      }
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          position,
          resumeName: resume?.name,
          resumeData,
          website,
          formDurationMs: Date.now() - formStartedAt.current,
          turnstileToken,
        }),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Could not submit. Please email ${COMPANY.email}.`);
        resetVerification();
      }
    } catch {
      setError(`Could not connect. Please email ${COMPANY.email}.`);
      resetVerification();
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div role="status" className="flex flex-col items-start gap-5 py-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
          <Check aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="text-[22px] font-light tracking-[-0.02em] text-ink">Application received. We’ll be in touch within 7 days.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <fieldset className="lg:col-span-4">
        <legend className="mb-4 text-[13px] font-medium text-slate-500">Choose a role</legend>
        <div className="grid gap-2">
          {POSITIONS.map((p) => (
            <label
              key={p.id}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 text-[15px] transition-colors',
                position === p.id ? 'border-cobalt bg-cobalt-soft/60 text-ink' : 'border-line text-slate-700 hover:border-slate-400'
              )}
            >
              <input type="radio" name="position" value={p.id} checked={position === p.id} onChange={() => setPosition(p.id)} className="sr-only" />
              {p.title}
              {position === p.id && <Check aria-hidden="true" className="h-4 w-4 text-cobalt" />}
            </label>
          ))}
        </div>
      </fieldset>

      <form onSubmit={submit} className="grid gap-5 lg:col-span-8">
        <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="careers-website">Leave this field empty</label>
          <input id="careers-website" name="website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" data-1p-ignore="true" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="careers-name" className={LABEL}>
              Name
            </label>
            <input id="careers-name" type="text" name="name" value={form.name} onChange={onChange} required className={FIELD} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="careers-email" className={LABEL}>
              Email
            </label>
            <input id="careers-email" type="email" name="email" value={form.email} onChange={onChange} required className={FIELD} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="careers-phone" className={LABEL}>
              Phone
            </label>
            <input id="careers-phone" type="tel" name="phone" value={form.phone} onChange={onChange} required className={FIELD} autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="careers-linkedin" className={LABEL}>
              LinkedIn
            </label>
            <input id="careers-linkedin" type="url" name="linkedin" value={form.linkedin} onChange={onChange} className={FIELD} placeholder="linkedin.com/in/you" />
          </div>
          <div>
            <label htmlFor="careers-portfolio" className={LABEL}>
              Portfolio or GitHub
            </label>
            <input id="careers-portfolio" type="url" name="portfolio" value={form.portfolio} onChange={onChange} className={FIELD} placeholder="github.com/you" />
          </div>
          <div>
            <label htmlFor="careers-experience" className={LABEL}>
              Experience
            </label>
            <select id="careers-experience" name="experience" value={form.experience} onChange={onChange} className={FIELD}>
              <option value="">Choose one</option>
              <option value="student">Student / fresh graduate</option>
              <option value="0-1">0–1 years</option>
              <option value="1-3">1–3 years</option>
              <option value="3+">3+ years</option>
            </select>
          </div>
        </div>
        <div>
          <span className={LABEL}>Resume (PDF, up to 5 MB)</span>
          <label
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-md border border-dashed px-4 py-4 text-[15px] transition-colors',
              resume ? 'border-cobalt text-ink' : 'border-line text-slate-500 hover:border-slate-400'
            )}
          >
            {resume ? <Check aria-hidden="true" className="h-5 w-5 text-cobalt" /> : <Upload aria-hidden="true" className="h-5 w-5" />}
            {resume ? resume.name : 'Upload your resume'}
            <input type="file" accept="application/pdf,.pdf" onChange={onFile} className="sr-only" />
          </label>
        </div>
        <div>
          <label htmlFor="careers-why" className={LABEL}>
            Why HITROO?
          </label>
          <textarea id="careers-why" name="whyHitroo" value={form.whyHitroo} onChange={onChange} required rows={3} className={`${FIELD} resize-none`} />
        </div>
        <div>
          <label htmlFor="careers-why-role" className={LABEL}>
            Why this role?
          </label>
          <textarea id="careers-why-role" name="whyPosition" value={form.whyPosition} onChange={onChange} required rows={3} className={`${FIELD} resize-none`} />
        </div>
        <div className="sm:max-w-xs">
          <label htmlFor="careers-availability" className={LABEL}>
            Availability
          </label>
          <select id="careers-availability" name="availability" value={form.availability} onChange={onChange} className={FIELD}>
            <option value="">Choose one</option>
            <option value="immediate">Immediately</option>
            <option value="2weeks">Within 2 weeks</option>
            <option value="1month">Within a month</option>
            <option value="later">Later</option>
          </select>
        </div>
        {turnstileSiteKey && (
          <Turnstile
            siteKey={turnstileSiteKey}
            resetSignal={turnstileResetSignal}
            onToken={setTurnstileToken}
            onError={() => setError('Verification expired or could not load. Please try again.')}
          />
        )}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="submit"
            className={SUBMIT}
            disabled={
              checkingVerification ||
              !position ||
              !form.name ||
              !form.email ||
              !form.phone ||
              !resume ||
              Boolean(turnstileSiteKey && !turnstileToken) ||
              submitting
            }
          >
            {submitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              'Apply'
            )}
          </button>
          <p className="text-[13px] text-slate-500">{position ? `Applying for ${POSITIONS.find((p) => p.id === position)?.title}.` : 'Choose a role first.'}</p>
        </div>
        {error && (
          <p role="alert" className="text-[14px] text-red-600">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
