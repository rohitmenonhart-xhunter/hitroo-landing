import type { Project } from '@/lib/client/types';
import { initials, time, shortDate } from '@/lib/client/format';
import { cn } from '@/lib/utils';
import AutoRefresh from './AutoRefresh';
import { Card, INPUT, SubmitButton } from './ui';

/** The conversation with the Project Lead (the same one as on WhatsApp), and a box to write. */
export default function Messages({ token, project, lead, messages, compact }: { token: string; project: string; lead: string; messages: Project['messages']; compact?: boolean }) {
  const shown = compact ? messages.slice(-4) : messages;
  const last = messages.at(-1);
  // Waiting for a reply: refresh until it arrives (for up to two minutes after the client wrote).
  const waiting = Boolean(last && last.from === 'you' && Date.now() - Date.parse(last.at) < 120_000);
  return (
    <Card id="messages" className="flex flex-col">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ember font-display text-[14px] font-extrabold text-white">
          {initials(lead)}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#2F9E5B] ring-2 ring-white" />
        </span>
        <div>
          <h2 className="font-display text-[19px] font-bold tracking-[-0.025em]">{lead}</h2>
          <p className="text-[13px] font-medium text-stone">Your project lead · here and on WhatsApp</p>
        </div>
      </div>
      <ol className={cn('mt-5 flex flex-col gap-3', !compact && 'min-h-[240px]')} aria-live="polite">
        {shown.length === 0 && <li className="my-auto text-center text-[14.5px] font-medium text-stone">Write to {lead} about anything: a question, an idea, a change.</li>}
        {shown.map((m, i) => {
          const prev = shown[i - 1];
          const newDay = !prev || shortDate(prev.at) !== shortDate(m.at);
          return (
            <li key={`${m.at}-${i}`} className="flex flex-col">
              {newDay && !compact && <span className="mx-auto my-2 rounded-full bg-paper px-3 py-1 text-[12px] font-semibold text-stone">{shortDate(m.at)}</span>}
              <div className={cn('max-w-[85%] rounded-[20px] px-4 py-2.5 text-[15px] font-medium leading-relaxed', m.from === 'you' ? 'self-end rounded-br-[6px] bg-char text-white' : 'self-start rounded-bl-[6px] bg-paper text-char ring-1 ring-char/5')}>
                <p className="whitespace-pre-line break-words">{m.text}</p>
                <p className={cn('mt-1 text-right text-[11.5px] font-semibold', m.from === 'you' ? 'text-white/50' : 'text-stone')}>{time(m.at)}</p>
              </div>
            </li>
          );
        })}
        {waiting && (
          <li className="self-start rounded-[20px] rounded-bl-[6px] bg-paper px-4 py-3 ring-1 ring-char/5" aria-label={`${lead} is replying`}>
            <span className="flex gap-1">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-stone/60" style={{ animationDelay: `${d}ms` }} />
              ))}
            </span>
          </li>
        )}
      </ol>
      <form method="post" action={`/d/${token}/send`} className="mt-5 flex items-end gap-3">
        <input type="hidden" name="do" value="message" />
        <input type="hidden" name="project" value={project} />
        <textarea name="text" required maxLength={2000} rows={compact ? 1 : 2} placeholder={`Message ${lead}`} aria-label={`Message ${lead}`} className={cn(INPUT, 'resize-none')} />
        <SubmitButton className="shrink-0">Send</SubmitButton>
      </form>
      {waiting && <AutoRefresh every={4000} />}
    </Card>
  );
}
