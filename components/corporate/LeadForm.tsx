'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { COMPANY, services } from '@/lib/site-data';
import Turnstile from './Turnstile';
import { FIELD, LABEL, SUBMIT } from './form';

/** Project enquiry → /api/lead (honeypot, timing and optional Turnstile, as the API expects). */
export default function LeadForm({ idPrefix = 'lead' }: { idPrefix?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
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
        if (!response.ok) throw new Error('Verification configuration failed to load');
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

  const resetVerification = () => {
    if (turnstileSiteKey) setTurnstileResetSignal((signal) => signal + 1);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;
    if (turnstileSiteKey && !turnstileToken) {
      setError('Please complete the verification and try again.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          interest,
          message,
          leadType: 'contact',
          website,
          formDurationMs: Date.now() - formStartedAt.current,
          turnstileToken,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Something went wrong. Please email ${COMPANY.email}.`);
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
        <p className="text-[22px] font-light tracking-[-0.02em] text-ink">Thanks. We’ll reply within a day.</p>
      </div>
    );
  }

  const id = (field: string) => `${idPrefix}-${field}`;
  return (
    <form onSubmit={submit} className="grid gap-5" noValidate={false}>
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>Leave this field empty</label>
        <input
          id={id('website')}
          name="website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore="true"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className={LABEL}>
            Name
          </label>
          <input id={id('name')} name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={FIELD} autoComplete="name" maxLength={100} />
        </div>
        <div>
          <label htmlFor={id('interest')} className={LABEL}>
            Interested in
          </label>
          <select id={id('interest')} name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={FIELD}>
            <option value="">Choose one</option>
            {services.map((s) => (
              <option key={s.slug} value={s.label}>
                {s.label}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div>
          <label htmlFor={id('email')} className={LABEL}>
            Email
          </label>
          <input id={id('email')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} autoComplete="email" maxLength={254} />
        </div>
        <div>
          <label htmlFor={id('phone')} className={LABEL}>
            Phone
          </label>
          <input id={id('phone')} name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={FIELD} autoComplete="tel" maxLength={30} />
        </div>
      </div>
      <div>
        <label htmlFor={id('message')} className={LABEL}>
          What do you need?
        </label>
        <textarea id={id('message')} name="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className={`${FIELD} resize-none`} maxLength={4000} />
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
          disabled={checkingVerification || (!email.trim() && !phone.trim()) || Boolean(turnstileSiteKey && !turnstileToken) || submitting}
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            'Send'
          )}
        </button>
        <p className="text-[13px] text-slate-500">Email or phone, either works.</p>
      </div>
      {error && (
        <p role="alert" className="text-[14px] text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
