import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { DuePayments } from '@/components/client/Billing';
import { Notice, one } from '@/components/client/Notice';
import PageHeader from '@/components/client/PageHeader';
import Ring from '@/components/client/Ring';
import { ActionLink, Card, CardHead, Empty, Pill, RING } from '@/components/client/ui';
import { firstName, greeting, host, inr } from '@/lib/client/format';
import { loadOverview } from '@/lib/client/load';
import { cn } from '@/lib/utils';

/** Home: a greeting, what needs the client, and every project at a glance. */
export default async function Overview({ params, searchParams }: { params: { token: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const o = await loadOverview(params.token);
  const home = `/d/${params.token}`;
  const needs = o.due.length + o.quotesWaiting.length + o.projects.reduce((n, p) => n + p.asks, 0);
  return (
    <>
      <PageHeader caption="Your dashboard" title={`${greeting()}, ${firstName(o.name)}`} aside={<ActionLink href={`${home}/new`} dark>Start a new project</ActionLink>}>
        <p className="text-[17px] font-medium text-char/70">{needs ? `${needs} thing${needs === 1 ? '' : 's'} need${needs === 1 ? 's' : ''} you. Everything else is in hand.` : 'Nothing needs you right now. Everything is in hand.'}</p>
      </PageHeader>
      <Notice sent={one(searchParams.sent)} error={one(searchParams.error)} className="mb-6" />

      <div className="space-y-6">
        <DuePayments due={o.due} />
        {o.quotesWaiting.length > 0 && (
          <Card>
            <CardHead title={o.quotesWaiting.length === 1 ? 'A quote is waiting for you' : `${o.quotesWaiting.length} quotes are waiting for you`} />
            <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {o.quotesWaiting.map((q) => (
                <li key={q.path}>
                  <Link href={q.path} className={cn('group flex items-center justify-between gap-4 rounded-[18px] bg-paper p-4 ring-1 ring-transparent hover:ring-char/15', RING)}>
                    <span className="min-w-0">
                      <span className="block truncate text-[15.5px] font-semibold">{q.name}</span>
                      <span className="block text-[13.5px] font-medium text-stone">{inr(q.price)} · review and accept</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ember transition-transform group-hover:rotate-45" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <section aria-labelledby="projects">
          <h2 id="projects" className="mb-4 font-display text-[22px] font-bold tracking-[-0.03em]">
            Your projects
          </h2>
          {o.projects.length ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {o.projects.map((p) => (
                <li key={p.id}>
                  <Link href={`${home}/p/${p.id}`} className={cn('group flex h-full flex-col rounded-[24px] bg-white p-6 ring-1 ring-char/5 transition-shadow hover:shadow-[0_12px_40px_rgba(18,17,11,0.08)]', RING)}>
                    <div className="flex items-start justify-between gap-3">
                      <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-char font-display text-[20px] font-extrabold text-white">
                        {p.name.trim()[0]?.toUpperCase()}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-[22px] font-extrabold leading-tight tracking-[-0.035em]">{p.name}</h3>
                    <div className="mt-2.5">
                      <Pill tone={p.asks || p.quotesWaiting ? 'waiting' : p.live ? 'live' : 'neutral'}>{p.stage}</Pill>
                    </div>
                    <div className="mt-auto flex items-center gap-4 pt-7">
                      <Ring value={p.total ? p.done / p.total : 0} size={46} stroke={5} label={`${p.done} of ${p.total} done`}>
                        <span className="text-[11.5px] font-bold tabular-nums">{p.total ? Math.round((100 * p.done) / p.total) : 0}%</span>
                      </Ring>
                      <div className="min-w-0 text-[13.5px] font-medium text-stone">
                        <p className="text-char/80">
                          {p.done} of {p.total} done
                        </p>
                        <p className="truncate">{p.live ? host(p.live) : p.plan ? `${p.plan} plan` : 'Not live yet'}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${home}/new`} className={cn('flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-char/10 p-6 text-center text-char/70 transition-colors hover:border-ember/40 hover:text-char', RING)}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-char/10">
                    <Plus aria-hidden="true" className="h-5 w-5 text-ember" />
                  </span>
                  <span className="font-display text-[18px] font-bold tracking-[-0.02em]">Start a new project</span>
                  <span className="max-w-[240px] text-[13.5px] font-medium text-stone">Tell us what you need, and the quote comes here.</span>
                </Link>
              </li>
            </ul>
          ) : (
            <Empty>Your projects appear here once your first quote is accepted.</Empty>
          )}
        </section>
      </div>
    </>
  );
}
