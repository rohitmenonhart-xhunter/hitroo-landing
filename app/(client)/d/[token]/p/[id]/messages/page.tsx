import type { Metadata } from 'next';
import Messages from '@/components/client/Messages';
import ProjectHeader from '@/components/client/ProjectHeader';
import { loadProject } from '@/lib/client/load';

export const metadata: Metadata = { title: 'Messages' };

/** The conversation with the Project Lead: the same one as on WhatsApp. */
export default async function MessagesPage({ params }: { params: { token: string; id: string } }) {
  const p = await loadProject(params.token, params.id);
  return (
    <>
      <ProjectHeader p={p} base={`/d/${params.token}/p/${p.id}`} title="Messages" />
      <div className="max-w-[860px]">
        <Messages token={params.token} project={p.id} lead={p.lead} messages={p.messages} />
      </div>
    </>
  );
}
