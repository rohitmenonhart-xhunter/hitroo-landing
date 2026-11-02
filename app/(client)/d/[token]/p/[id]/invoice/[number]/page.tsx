import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import InvoiceDoc from '@/components/client/InvoiceDoc';
import { api, isAccessToken, isProjectId, orNull } from '@/lib/client/api';

export const metadata: Metadata = { title: 'Invoice' };

export default async function ProjectInvoice({ params }: { params: { token: string; id: string; number: string } }) {
  const n = decodeURIComponent(params.number);
  if (!isAccessToken(params.token) || !isProjectId(params.id) || !/^[A-Z]+\/\d{4}-\d{2}\/\d{4}$/.test(n)) notFound();
  const invoice = (await orNull(api.projectInvoice(params.token, params.id, n))) ?? notFound();
  return <InvoiceDoc invoice={invoice} />;
}
