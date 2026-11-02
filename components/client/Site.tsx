import { Check, X } from 'lucide-react';
import type { Project } from '@/lib/client/types';
import { ago, compact, host, longDate } from '@/lib/client/format';
import { cn } from '@/lib/utils';
import Ring from './Ring';
import UptimeBars from './UptimeBars';
import VisitorsChart from './VisitorsChart';
import { Card, CardHead, Empty, Field, INPUT, Pill, SubmitButton } from './ui';

type Site = NonNullable<Project['site']>;

/** Visitors over 30 days, top pages and where visitors come from. */
export function Visitors({ stats }: { stats: Site['stats'] }) {
  if (!stats) return (
    <Card>
      <CardHead title="Visitors" />
      <div className="mt-4">
        <Empty>Visitor numbers appear here once the counter is on the site, usually within a day of launch.</Empty>
      </div>
    </Card>
  );
  const max = Math.max(1, ...stats.topPages.map((p) => p.views));
  const maxSrc = Math.max(1, ...stats.sources.map((s) => s.visits));
  return (
    <Card>
      <CardHead title="Visitors" aside="Last 30 days" />
      <dl className="mt-5 grid grid-cols-3 gap-4">
        {[
          ['Visitors', stats.visitors],
          ['Visits', stats.visits],
          ['Page views', stats.pageviews],
        ].map(([k, v]) => (
          <div key={k as string}>
            <dt className="text-[13.5px] font-medium text-stone">{k}</dt>
            <dd className="mt-1 font-display text-[30px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{compact(v as number)}</dd>
          </div>
        ))}
      </dl>
      {stats.daily && stats.daily.length > 1 && (
        <div className="mt-6">
          <VisitorsChart daily={stats.daily} />
        </div>
      )}
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Bars title="Top pages" rows={stats.topPages.map((p) => ({ label: p.path, value: p.views }))} max={max} empty="No page views yet." />
        <Bars title="Where visitors come from" rows={stats.sources.map((s) => ({ label: s.source, value: s.visits }))} max={maxSrc} empty="No visits from other sites yet." />
      </div>
    </Card>
  );
}

function Bars({ title, rows, max, empty }: { title: string; rows: Array<{ label: string; value: number }>; max: number; empty: string }) {
  return (
    <div>
      <h3 className="text-[14px] font-semibold text-char">{title}</h3>
      {rows.length ? (
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="relative overflow-hidden rounded-[10px] bg-paper px-3 py-2">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-ember/10" style={{ width: `${(100 * r.value) / max}%` }} />
              <span className="relative flex justify-between gap-3 text-[14px] font-medium">
                <span className="truncate text-char">{r.label}</span>
                <span className="tabular-nums text-stone">{r.value}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[14px] font-medium text-stone">{empty}</p>
      )}
    </div>
  );
}

/** Up or down now, the last 30 days as bars, and any recent outage. */
export function Uptime({ uptime }: { uptime: Site['uptime'] }) {
  return (
    <Card>
      <CardHead
        title="Uptime"
        aside={uptime.down ? <Pill tone="bad">Down right now</Pill> : uptime.pct === null ? <Pill>Checks starting</Pill> : <Pill tone="live">Online</Pill>}
      />
      <p className="mt-4 font-display text-[34px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{uptime.pct === null ? '—' : `${uptime.pct}%`}</p>
      <p className="mt-1.5 text-[13.5px] font-medium text-stone">Checked every 5 minutes. If it ever stops answering, the team is alerted and it&apos;s restarted.</p>
      <div className="mt-5">
        <UptimeBars days={uptime.days} />
      </div>
      {uptime.incidents.length > 0 && (
        <ul className="mt-5 space-y-1.5 text-[13.5px] font-medium text-char/75">
          {uptime.incidents.map((i) => (
            <li key={i.start}>
              Down for {i.minutes} minute{i.minutes === 1 ? '' : 's'}, {ago(i.start)}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** The monthly search-engine check: the score, and each check passed or being fixed. */
export function Seo({ seo }: { seo: Site['seo'] }) {
  return (
    <Card>
      <CardHead title="Search engines" aside={seo ? `Checked ${longDate(seo.at)}` : undefined} />
      {seo ? (
        <>
          <div className="mt-5 flex items-center gap-5">
            <Ring value={seo.score / 100} size={84} stroke={8} label={`Score ${seo.score} out of 100`}>
              <span className="font-display text-[24px] font-extrabold tracking-[-0.04em]">{seo.score}</span>
            </Ring>
            <p className="text-[14.5px] font-medium leading-relaxed text-char/75">
              Your site is checked once a month, the way search engines and social apps see it. Anything to improve is fixed by the team as part of your plan. The home page loaded in {seo.seconds} s.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {seo.checks.map((c) => (
              <li key={c.label} className="flex items-start gap-2.5 text-[14px] font-medium leading-snug">
                <span aria-hidden="true" className={cn('mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full', c.ok ? 'bg-[#2F9E5B]/12 text-[#23794A]' : 'bg-ember/10 text-ember-dark')}>
                  {c.ok ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className={c.ok ? 'text-char/80' : 'text-char'}>
                  {c.label}
                  {!c.ok && <span className="text-stone"> · being fixed</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-4">
          <Empty>The first check runs in the days after launch.</Empty>
        </div>
      )}
    </Card>
  );
}

/** The site's address, and connecting the client's own domain with the exact record to add. */
export function Domains({ token, project, domains }: { token: string; project: string; domains: NonNullable<Project['domains']> }) {
  return (
    <Card id="domain">
      <CardHead title="Your address" />
      <ul className="mt-4 space-y-2">
        <li className="flex items-center justify-between gap-3 rounded-[14px] bg-paper px-4 py-3">
          <a href={domains.current} target="_blank" rel="noopener noreferrer" className="truncate text-[15px] font-semibold text-char underline decoration-char/20 underline-offset-4">
            {host(domains.current)}
          </a>
          <Pill tone="live">Live</Pill>
        </li>
        {domains.list.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3 rounded-[14px] bg-paper px-4 py-3">
            <span className="truncate text-[15px] font-semibold">{d.name}</span>
            <Pill tone={d.status === 'connected' ? 'live' : d.status === 'pending' ? 'waiting' : 'neutral'}>{d.status === 'connected' ? 'Connected' : d.status === 'pending' ? 'Waiting for the DNS record' : 'Not connected'}</Pill>
          </li>
        ))}
      </ul>
      {domains.record && (
        <div className="mt-5 rounded-[18px] bg-char p-5 text-white">
          <p className="text-[14.5px] font-semibold">Add this record at the company where you bought {domains.record.domain}:</p>
          <dl className="mt-4 grid grid-cols-3 gap-3 font-mono text-[14px]">
            {[
              ['Type', domains.record.type],
              ['Name / host', domains.record.host],
              ['Value / points to', domains.record.value],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-body text-[12px] font-semibold uppercase tracking-[0.05em] text-white/55">{k}</dt>
                <dd className="mt-1 break-all">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13.5px] font-medium text-white/70">It connects by itself once the record appears, usually within the hour, with HTTPS included.</p>
        </div>
      )}
      <form method="post" action={`/d/${token}/send`} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="do" value="domain" />
        <input type="hidden" name="project" value={project} />
        <div className="flex-1">
          <Field label="Connect your own domain">
            <input name="domain" required maxLength={253} placeholder="yourbusiness.in" autoComplete="off" spellCheck={false} className={INPUT} />
          </Field>
        </div>
        <SubmitButton className="shrink-0">Connect</SubmitButton>
      </form>
    </Card>
  );
}
