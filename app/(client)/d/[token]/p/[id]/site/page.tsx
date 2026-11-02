import type { Metadata } from 'next';
import { Notice, one } from '@/components/client/Notice';
import ProjectHeader from '@/components/client/ProjectHeader';
import { Domains, Seo, Uptime, Visitors } from '@/components/client/Site';
import { Card, Empty } from '@/components/client/ui';
import { loadProject } from '@/lib/client/load';

export const metadata: Metadata = { title: 'Your site' };

/** The live site: visitors, uptime, the search-engine check and its address. */
export default async function SitePage({ params, searchParams }: { params: { token: string; id: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const p = await loadProject(params.token, params.id);
  return (
    <>
      <ProjectHeader p={p} base={`/d/${params.token}/p/${p.id}`} title="Your site" />
      <Notice sent={one(searchParams.sent)} error={one(searchParams.error)} className="mb-6" />
      {p.site ? (
        <div className="space-y-6">
          <Visitors stats={p.site.stats} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Uptime uptime={p.site.uptime} />
            <Seo seo={p.site.seo} />
          </div>
          {p.domains && <Domains token={params.token} project={p.id} domains={p.domains} />}
        </div>
      ) : (
        <Card>
          <Empty>Your site&apos;s visitors, uptime and search-engine check appear here once it&apos;s live.</Empty>
        </Card>
      )}
    </>
  );
}
