import Link from 'next/link';
import { Check, CircleDashed, Minus, Plus } from 'lucide-react';
import type { Quote } from '@/lib/client/types';
import { inr, longDate } from '@/lib/client/format';
import { cn } from '@/lib/utils';
import { Card, CardHead, Field, INPUT, Pill, RING, SubmitButton } from './ui';

type Ready = Extract<Quote, { ready: true }>;

export const PROSE =
  '[&>:first-child]:mt-0 text-[15px] font-medium leading-relaxed text-char/80 [&_h1]:font-display [&_h1]:text-[22px] [&_h1]:font-extrabold [&_h1]:tracking-[-0.03em] [&_h1]:text-char [&_h2]:mt-7 [&_h2]:font-display [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h2]:text-char [&_h3]:mt-5 [&_h3]:font-bold [&_h3]:text-char [&_li]:mt-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-3 [&_strong]:font-bold [&_strong]:text-char [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5';

/** The price, against what a typical agency charges for the same work. */
export function PriceCard({ q }: { q: Ready }) {
  const saved = q.marketValue - q.price;
  return (
    <section aria-label="Price" className="grid overflow-hidden rounded-[28px] bg-char text-white md:grid-cols-[1.3fr_1fr]">
      <div className="p-7 sm:p-9">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/55">Fixed price</p>
        <p className="mt-3 font-display text-[clamp(44px,6vw,72px)] font-extrabold leading-none tracking-[-0.05em] tabular-nums">{inr(q.price)}</p>
        <p className="mt-4 max-w-[420px] text-[14.5px] font-medium leading-relaxed text-white/70">
          For everything in this quote, paid in {q.milestones.length === 1 ? 'one payment' : `${q.milestones.length} stages`}.
          {q.chargePct ? ` Each online payment includes the gateway's ${q.chargePct}% charge, shown below.` : ''}
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4 border-t border-white/10 bg-white/[0.04] p-7 sm:p-9 md:border-l md:border-t-0">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/55">A typical agency</p>
          <p className="mt-2 font-display text-[28px] font-bold tracking-[-0.03em] text-white/50 line-through decoration-ember decoration-2 tabular-nums">{inr(q.marketValue)}</p>
        </div>
        {saved > 0 && <p className="inline-flex w-fit items-center rounded-full bg-ember px-3.5 py-1.5 text-[14px] font-bold">You save {inr(saved)}</p>}
      </div>
    </section>
  );
}

/** What the price includes and leaves out, in two columns. */
export function Scope({ q }: { q: Ready }) {
  if (!q.assumptions.length && !q.exclusions.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {q.assumptions.length > 0 && (
        <Card>
          <CardHead title="Good to know" />
          <ul className="mt-4 space-y-2.5">
            {q.assumptions.map((a) => (
              <li key={a} className="flex gap-3 text-[15px] font-medium leading-snug text-char/80">
                <Plus aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
      )}
      {q.exclusions.length > 0 && (
        <Card>
          <CardHead title="Not included" />
          <ul className="mt-4 space-y-2.5">
            {q.exclusions.map((a) => (
              <li key={a} className="flex gap-3 text-[15px] font-medium leading-snug text-char/80">
                <Minus aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-stone" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/** The payments, in order: paid (with the invoice), due (with the button) or later (when). */
export function PaymentPlan({ q, token }: { q: Ready; token: string }) {
  const canPay = q.status === 'accepted';
  return (
    <Card>
      <CardHead title="Payments" aside={q.status === 'paid' ? <Pill tone="live">All paid</Pill> : undefined} />
      <ol className="mt-5 space-y-3">
        {q.milestones.map((m) => (
          <li key={m.n} className={cn('flex flex-col gap-4 rounded-[20px] p-5 sm:flex-row sm:items-center', m.status === 'due' && canPay ? 'bg-ember/[0.07] ring-1 ring-ember/25' : 'bg-paper')}>
            <span aria-hidden="true" className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', m.status === 'paid' ? 'bg-[#2F9E5B] text-white' : m.status === 'due' && canPay ? 'bg-ember text-white' : 'bg-white text-stone ring-1 ring-char/10')}>
              {m.status === 'paid' ? <Check className="h-5 w-5" strokeWidth={2.5} /> : m.status === 'due' && canPay ? <span className="font-display text-[15px] font-extrabold">{m.n}</span> : <CircleDashed className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold">
                {m.label} <span className="font-medium text-stone">· {m.pct}%</span>
              </p>
              <p className="text-[13.5px] font-medium text-stone">
                {m.status === 'paid' && m.paidAt ? `Paid ${longDate(m.paidAt)}` : m.when}
                {m.charge > 0 ? ` · includes ${inr(m.charge)} payment charges` : ''}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:justify-end">
              <span className="font-display text-[20px] font-extrabold tracking-[-0.03em] tabular-nums">{inr(m.amount)}</span>
              {m.status === 'paid' && m.invoice ? (
                <Link href={`/q/${token}/invoice/${m.n}`} className={cn('text-[14px] font-semibold underline decoration-char/25 underline-offset-4 hover:decoration-char', RING)}>
                  Invoice
                </Link>
              ) : m.status === 'due' && canPay ? (
                <form method="post" action={`/q/${token}/pay/${m.n}`}>
                  <SubmitButton>Pay {inr(m.amount)}</SubmitButton>
                </form>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {canPay && <p className="mt-4 text-[13.5px] font-medium text-stone">You&apos;ll pay on Razorpay&apos;s secure page, by UPI, card, net banking or wallet, and come straight back here.</p>}
    </Card>
  );
}

/** The agreement, and the box to accept it (typed name and a tick), or the record of acceptance. */
export function Agreement({ q, token }: { q: Ready; token: string }) {
  return (
    <Card id="agreement">
      <CardHead title={q.accepted ? 'The agreement you accepted' : 'The agreement'} />
      <div className="relative mt-4">
        <article className={cn(PROSE, 'max-h-[440px] overflow-y-auto rounded-[18px] bg-paper p-6 ring-1 ring-char/5')} dangerouslySetInnerHTML={{ __html: q.agreementHtml }} />
      </div>
      {q.accepted ? (
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-medium text-char/75">
          <Pill tone="live">Accepted</Pill>
          by {q.accepted.name} on {longDate(q.accepted.at)} · version {q.accepted.version} · fingerprint <code className="rounded bg-paper px-1.5 py-0.5 text-[13px]">{q.accepted.fingerprint}</code>
        </p>
      ) : q.status === 'sent' ? (
        <form method="post" action={`/q/${token}/accept`} className="mt-6 space-y-5">
          <Field label="Your full name">
            <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={cn(INPUT, 'max-w-[440px]')} />
          </Field>
          <label className="flex max-w-[640px] items-start gap-3 text-[15px] font-medium leading-snug text-char/85">
            <input type="checkbox" name="agree" value="yes" required className="mt-0.5 h-5 w-5 shrink-0 rounded accent-ember" />
            I accept this quote and the agreement above on behalf of {q.client}.
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton>Accept and continue to payment</SubmitButton>
            {q.validUntil && <span className="text-[13.5px] font-medium text-stone">Valid until {longDate(q.validUntil)}</span>}
          </div>
        </form>
      ) : null}
    </Card>
  );
}
