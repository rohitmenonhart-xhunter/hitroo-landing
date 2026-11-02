import type { Metadata } from 'next';
import { Notice, one } from '@/components/client/Notice';
import PageHeader from '@/components/client/PageHeader';
import RequestForm from '@/components/client/RequestForm';
import HowItWorks from '@/components/client/HowItWorks';

export const metadata: Metadata = { title: 'Start a new project' };

export default function NewProject({ params, searchParams }: { params: { token: string }; searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <>
      <PageHeader caption="New project" title="What shall we build next?" />
      <Notice error={one(searchParams.error)} className="mb-6" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <RequestForm token={params.token} kind="new" />
        <HowItWorks />
      </div>
    </>
  );
}
