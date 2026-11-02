import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InvoiceDoc from '@/components/client/InvoiceDoc';
import { api, isQuoteToken, orNull } from '@/lib/client/api';
import { paymentNumber } from '@/lib/client/load';

export const metadata: Metadata = { title: 'Invoice' };

export default async function QuoteInvoice({ params }: { params: { token: string; n: string } }) {
  if (!isQuoteToken(params.token)) notFound();
  const invoice = (await orNull(api.quoteInvoice(params.token, paymentNumber(params.n)))) ?? notFound();
  return <InvoiceDoc invoice={invoice} />;
}
