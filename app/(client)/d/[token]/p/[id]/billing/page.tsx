import type { Metadata } from 'next';
import { DuePayments, Hosting, Invoices, Quotes } from '@/components/client/Billing';
import ProjectHeader from '@/components/client/ProjectHeader';
import { loadProject } from '@/lib/client/load';

export const metadata: Metadata = { title: 'Billing' };

/** Payments due, the hosting plan, quotes and every invoice. */
export default async function BillingPage({ params }: { params: { token: string; id: string } }) {
  const p = await loadProject(params.token, params.id);
  return (
    <>
      <ProjectHeader p={p} base={`/d/${params.token}/p/${p.id}`} title="Billing" />
      <div className="space-y-6">
        <DuePayments due={p.due} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Hosting hosting={p.hosting} />
          <Quotes quotes={p.quotes} />
        </div>
        <Invoices token={params.token} project={p.id} invoices={p.invoices} />
      </div>
    </>
  );
}
