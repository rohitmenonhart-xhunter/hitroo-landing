import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import AutoRefresh from '@/components/client/AutoRefresh';
import { ActionLink, Card, QuietLink } from '@/components/client/ui';
import { api, isQuoteToken, orNull } from '@/lib/client/api';
import { inr, longDate } from '@/lib/client/format';
import { paymentNumber } from '@/lib/client/load';

export const metadata: Metadata = { title: 'Payment received' };

/**
 * Where Razorpay sends the client after paying. The payment is confirmed with Razorpay itself, never from the
 * address (which anyone can type); until then the page checks again every few seconds.
 */
export default async function PaidPage({ params }: { params: { token: string; n: string } }) {
  if (!isQuoteToken(params.token)) notFound();
  const n = paymentNumber(params.n);
  const p = (await orNull(api.paid(params.token, n))) ?? notFound();
  if (!p.confirmed)
    return (
      <div className="mx-auto max-w-[680px] py-10 text-center">
        <span aria-hidden="true" className="mx-auto block h-12 w-12 animate-spin rounded-full border-4 border-sand border-t-ember" />
        <h1 className="mt-8 font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.045em]">Confirming your payment…</h1>
        <p className="mt-4 text-[17px] font-medium leading-relaxed text-char/75">We&apos;re checking with the bank. This usually takes a few seconds, and this page updates by itself.</p>
        <p className="mt-6 text-[14.5px] font-medium text-stone">If it doesn&apos;t update within a few minutes, please don&apos;t pay again: message {p.lead} and we&apos;ll sort it out.</p>
        <AutoRefresh every={4000} />
      </div>
    );
  return (
    <div className="mx-auto max-w-[760px] py-6">
      <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2F9E5B]/12">
        <CheckCircle2 className="h-8 w-8 text-[#23794A]" />
      </span>
      <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.06em] text-char/60">{p.client}</p>
      <h1 className="mt-3 font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-[1] tracking-[-0.05em]">Payment received. Thank you!</h1>
      <p className="mt-5 text-[19px] font-medium leading-relaxed text-char/80">{p.next}</p>
      <Card className="mt-8">
        <dl className="grid gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-[13px] font-semibold uppercase tracking-[0.05em] text-stone">{p.label}</dt>
            <dd className="mt-1.5 font-display text-[28px] font-extrabold tracking-[-0.035em] tabular-nums">{inr(p.amount)}</dd>
            <dd className="text-[13.5px] font-medium text-stone">{p.what}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold uppercase tracking-[0.05em] text-stone">Paid on</dt>
            <dd className="mt-1.5 text-[17px] font-bold">{longDate(p.paidAt)}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-semibold uppercase tracking-[0.05em] text-stone">Payment ID</dt>
            <dd className="mt-1.5 break-all font-mono text-[14px] font-semibold">{p.paymentId}</dd>
          </div>
        </dl>
      </Card>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        {p.invoice && (
          <ActionLink href={`/q/${params.token}/invoice/${n}`} dark>
            Your invoice {p.invoice}
          </ActionLink>
        )}
        <QuietLink href={p.quotePath}>Your quote and every payment</QuietLink>
      </div>
    </div>
  );
}
