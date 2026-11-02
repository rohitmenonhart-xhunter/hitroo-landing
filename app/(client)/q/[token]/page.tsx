import type { Metadata } from 'next';
import { Notice, one } from '@/components/client/Notice';
import PageHeader from '@/components/client/PageHeader';
import { Agreement, PaymentPlan, PriceCard, Scope } from '@/components/client/QuoteView';
import { Pill } from '@/components/client/ui';
import { longDate } from '@/lib/client/format';
import { loadQuote } from '@/lib/client/load';

export const metadata: Metadata = { title: 'Your quote' };

const STATUS = { sent: ['Waiting for you', 'waiting'], accepted: ['Accepted', 'live'], paid: ['Paid in full', 'live'], expired: ['Expired', 'neutral'] } as const;

/** A quote: what's included, the price, the payments and the agreement to accept. */
export default async function QuotePage({ params, searchParams }: { params: { token: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const q = await loadQuote(params.token);
  if (!q.ready)
    return (
      <PageHeader caption={`Quote for ${q.client}`} title="Your quote is being prepared">
        <p className="text-[17px] font-medium text-char/70">You&apos;ll get a message as soon as it&apos;s ready.</p>
      </PageHeader>
    );
  const [label, tone] = STATUS[q.status];
  return (
    <>
      <PageHeader caption={`Quote ${q.id} for ${q.client}`} title={q.title}>
        <Pill tone={tone}>{label}</Pill>
        {q.status === 'sent' && q.validUntil && <span className="text-[14px] font-medium text-stone">Valid until {longDate(q.validUntil)}</span>}
      </PageHeader>
      <Notice sent={one(searchParams.sent)} error={one(searchParams.error) ?? (q.status === 'expired' ? 'expired' : undefined)} className="mb-6" />
      <div className="space-y-6">
        {q.summary && <p className="max-w-[820px] text-[18px] font-medium leading-relaxed text-char/80 sm:text-[20px]">{q.summary}</p>}
        <PriceCard q={q} />
        <Scope q={q} />
        <div id="payments">
          <PaymentPlan q={q} token={params.token} />
        </div>
        <Agreement q={q} token={params.token} />
        <p className="text-[13.5px] font-medium text-stone">Keep this link: your quote, the agreement and every payment and invoice stay here. {q.lead}, your project lead, is one WhatsApp message away.</p>
      </div>
    </>
  );
}
