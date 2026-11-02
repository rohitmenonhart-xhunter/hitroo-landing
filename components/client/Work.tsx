import { ArrowUpRight, Bug, MessageSquareText, Palette, Sparkles } from 'lucide-react';
import type { Project, TaskItem } from '@/lib/client/types';
import { ago } from '@/lib/client/format';
import { cn } from '@/lib/utils';
import { Card, CardHead, Empty, INPUT, Pill, RING, SubmitButton } from './ui';

const KIND = { fix: Bug, design: Palette, feature: Sparkles } as const;

/** The work, one row a task: what it is, where it stands, when it last moved. */
export function TaskList({ tasks, empty }: { tasks: TaskItem[]; empty: string }) {
  if (!tasks.length) return <Empty>{empty}</Empty>;
  return (
    <ul className="divide-y divide-char/5">
      {tasks.map((t) => {
        const Icon = KIND[t.kind];
        return (
          <li key={t.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper">
              <Icon className="h-4 w-4 text-stone" strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15.5px] font-semibold text-char">{t.title}</p>
              <p className="text-[13px] font-medium text-stone">{ago(t.updatedAt)}</p>
            </div>
            <Pill tone={t.tone}>{t.status}</Pill>
          </li>
        );
      })}
    </ul>
  );
}

/** What moved lately, newest first. */
export function Activity({ items }: { items: Project['activity'] }) {
  if (!items.length) return <Empty>The first updates appear here as soon as work starts.</Empty>;
  return (
    <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-char/10">
      {items.map((a, i) => (
        <li key={`${a.at}-${i}`} className="relative pl-7">
          <span aria-hidden="true" className={cn('absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full ring-[3px] ring-white', a.tone === 'live' ? 'bg-[#2F9E5B]' : a.tone === 'waiting' ? 'bg-ember' : 'bg-stone/50')} />
          <p className="text-[14.5px] font-semibold leading-snug text-char">{a.title}</p>
          <p className="mt-0.5 text-[13px] font-medium text-stone">
            {a.status} · {ago(a.at)}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** The team's questions for the client, each with its own answer box. */
export function Asks({ token, project, asks }: { token: string; project: string; asks: Project['asks'] }) {
  if (!asks.length) return null;
  return (
    <Card className="bg-char text-white ring-0">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-ember">
          <MessageSquareText className="h-4 w-4 text-white" />
        </span>
        <h2 className="font-display text-[19px] font-bold tracking-[-0.025em]">The team has {asks.length === 1 ? 'a question' : `${asks.length} questions`} for you</h2>
      </div>
      <ul className="mt-5 space-y-4">
        {asks.map((a) => (
          <li key={`${a.task}-${a.question}`} className="rounded-[18px] bg-white/[0.06] p-5 ring-1 ring-white/10">
            <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/55">{a.title}</p>
            <p className="mt-2 text-[16.5px] font-semibold leading-snug">{a.question}</p>
            <form method="post" action={`/d/${token}/send`} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="do" value="answer" />
              <input type="hidden" name="project" value={project} />
              <input type="hidden" name="task" value={a.task} />
              <input name="text" required maxLength={2000} placeholder="Your answer" aria-label={`Your answer to: ${a.question}`} className={cn(INPUT, 'bg-white text-char ring-0')} />
              <SubmitButton dark={false} className="shrink-0">
                Send
              </SubmitButton>
            </form>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Designs and previews to look at. */
export function ToReview({ items }: { items: Project['toReview'] }) {
  if (!items.length) return null;
  return (
    <Card>
      <CardHead title="Ready for you to look at" />
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('group flex h-full items-center gap-4 rounded-[18px] bg-paper p-4 ring-1 ring-char/5 transition-colors hover:ring-char/20', RING)}
            >
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white ring-1 ring-char/5">
                {r.kind === 'design' ? <Palette className="h-5 w-5 text-ember" /> : <Sparkles className="h-5 w-5 text-ember" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-char">{r.title}</span>
                <span className="block text-[13px] font-medium text-stone">
                  {r.note}
                  {r.openComments ? ` · ${r.openComments} open comment${r.openComments === 1 ? '' : 's'}` : ''}
                </span>
              </span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-stone transition-transform group-hover:rotate-45" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
