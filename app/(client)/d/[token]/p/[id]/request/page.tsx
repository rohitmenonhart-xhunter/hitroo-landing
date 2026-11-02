import type { Metadata } from 'next';
import HowItWorks from '@/components/client/HowItWorks';
import { Notice, one } from '@/components/client/Notice';
import ProjectHeader from '@/components/client/ProjectHeader';
import RequestForm from '@/components/client/RequestForm';
import { loadProject } from '@/lib/client/load';

export const metadata: Metadata = { title: 'A request' };

/** Ask for a change (a quote) or report a problem (a free fix). */
export default async function RequestPage({ params, searchParams }: { params: { token: string; id: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const p = await loadProject(params.token, params.id);
  const kind = one(searchParams.kind) === 'problem' ? 'problem' : 'change';
  return (
    <>
      <ProjectHeader p={p} base={`/d/${params.token}/p/${p.id}`} />
      <Notice error={one(searchParams.error)} className="mb-6" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <RequestForm token={params.token} project={p.id} kind={kind} />
        {kind === 'change' && <HowItWorks />}
      </div>
    </>
  );
}
