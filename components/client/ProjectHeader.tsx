import type { Project } from '@/lib/client/types';
import { host } from '@/lib/client/format';
import PageHeader from './PageHeader';
import { ActionLink, Pill } from './ui';

/** A project page's opening: the client, the project, where it stands, its live address and the main action. */
export default function ProjectHeader({ p, base, title }: { p: Project; base: string; title?: string }) {
  const waiting = p.asks.length > 0 || p.quotes.some((q) => q.status === 'Waiting for you') || p.due.length > 0;
  return (
    <PageHeader caption={p.client} title={title ?? p.name} aside={<ActionLink href={`${base}/request?kind=change`} dark>Ask for a change</ActionLink>}>
      <Pill tone={waiting ? 'waiting' : p.live ? 'live' : 'neutral'}>{p.stage}</Pill>
      {p.live && (
        <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-[14.5px] font-semibold text-char underline decoration-char/25 underline-offset-4 hover:decoration-char">
          {host(p.live)} ↗
        </a>
      )}
    </PageHeader>
  );
}
