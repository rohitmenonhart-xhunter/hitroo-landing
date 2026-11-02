import type { Metadata } from 'next';
import { Bug, Sparkles } from 'lucide-react';
import { DuePayments } from '@/components/client/Billing';
import ChatPreview from '@/components/client/chat/ChatPreview';
import { Notice, one } from '@/components/client/Notice';
import ProjectHeader from '@/components/client/ProjectHeader';
import Ring from '@/components/client/Ring';
import { Card, CardHead, QuietLink, Stat } from '@/components/client/ui';
import { Activity, Asks, TaskList, ToReview } from '@/components/client/Work';
import { compact, inr } from '@/lib/client/format';
import { loadProject } from '@/lib/client/load';

type Props = { params: { token: string; id: string }; searchParams: Record<string, string | string[] | undefined> };

export const metadata: Metadata = { title: 'Your project' };

/** One project at a glance: what needs the client, the numbers, the work, what moved lately and the conversation. */
export default async function ProjectOverview({ params, searchParams }: Props) {
  const p = await loadProject(params.token, params.id);
  const base = `/d/${params.token}/p/${p.id}`;
  const site = p.site;
  const paid = p.quotes.reduce((n, q) => n + q.paid, 0);
  const payments = p.quotes.reduce((n, q) => n + q.payments, 0);
  return (
    <>
      <ProjectHeader p={p} base={base} />
      <Notice sent={one(searchParams.sent)} error={one(searchParams.error)} className="mb-6" />
      <div className="space-y-6">
        <Asks token={params.token} project={p.id} asks={p.asks} />
        <DuePayments due={p.due} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Progress" value={`${p.progress.total ? Math.round((100 * p.progress.done) / p.progress.total) : 0}%`} note={`${p.progress.done} of ${p.progress.total} pieces of work done`}>
            <Ring value={p.progress.total ? p.progress.done / p.progress.total : 0} size={40} stroke={5} label="Progress" />
          </Stat>
          {site ? (
            <>
              <Stat label="Visitors" value={site.stats ? compact(site.stats.visitors) : '—'} note="Last 30 days" />
              <Stat label="Uptime" value={site.uptime.pct === null ? '—' : `${site.uptime.pct}%`} note={site.uptime.down ? 'Down right now: the team is on it' : 'Last 30 days, checked every 5 minutes'} />
              <Stat label="Search engines" value={site.seo ? `${site.seo.score}` : '—'} note={site.seo ? 'Score out of 100, checked monthly' : 'First check after launch'} />
            </>
          ) : (
            <>
              <Stat label="Being worked on" value={p.inProgress.length} note={p.inProgress.length ? 'Pieces of work in progress' : 'Nothing open right now'} />
              <Stat label="Payments made" value={`${paid} of ${payments}`} note={payments ? 'Across your quotes' : 'No quotes yet'} />
              <Stat label="Next payment" value={p.due[0] ? inr(p.due[0].amount) : '—'} note={p.due[0] ? p.due[0].label : 'Nothing due'} />
            </>
          )}
        </div>

        <ToReview items={p.toReview} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card>
              <CardHead title="In progress" aside={p.inProgress.length ? `${p.inProgress.length}` : undefined} />
              <div className="mt-4">
                <TaskList tasks={p.inProgress} empty="Nothing in progress. Ask for a change any time." />
              </div>
            </Card>
            <Card>
              <CardHead title="Done lately" />
              <div className="mt-4">
                <TaskList tasks={p.done} empty="Finished work appears here." />
              </div>
            </Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <QuickAction href={`${base}/request?kind=change`} icon={<Sparkles className="h-5 w-5 text-ember" />} title="Ask for a change" text="Something new or different. It comes as a quote first." />
              <QuickAction href={`${base}/request?kind=problem`} icon={<Bug className="h-5 w-5 text-ember" />} title="Report a problem" text="Something not working as it should. Fixed free." />
            </div>
          </div>
          <div className="space-y-6">
            <ChatPreview base={base} lead={p.lead} messages={p.messages} />
            <Card>
              <CardHead title="Latest updates" />
              <div className="mt-5">
                <Activity items={p.activity.slice(0, 8)} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function QuickAction({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="flex flex-col gap-3">
      <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-sand">
        {icon}
      </span>
      <h3 className="font-display text-[18px] font-bold tracking-[-0.025em]">{title}</h3>
      <p className="text-[14px] font-medium leading-relaxed text-char/70">{text}</p>
      <QuietLink href={href} className="mt-auto w-fit">
        {title} →
      </QuietLink>
    </Card>
  );
}
