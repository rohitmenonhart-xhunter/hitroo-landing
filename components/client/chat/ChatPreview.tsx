import type { Project } from '@/lib/client/types';
import { ago } from '@/lib/client/format';
import { ActionLink, Card } from '../ui';
import Markdown from './Markdown';
import { LeadAvatar } from './bits';

/** The latest of the conversation on a project's overview, and the way into the chat. */
export default function ChatPreview({ base, lead, messages }: { base: string; lead: string; messages: Project['messages'] }) {
  const last = messages.slice(-3);
  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-3">
        <LeadAvatar name={lead} online />
        <div>
          <h2 className="font-display text-[19px] font-bold tracking-[-0.025em]">{lead}</h2>
          <p className="text-[13px] font-medium text-stone">Your project lead</p>
        </div>
      </div>
      {last.length ? (
        <ol className="mt-5 space-y-3">
          {last.map((m) => (
            <li key={m.id} className={m.from === 'you' ? 'flex justify-end' : ''}>
              {m.from === 'you' ? (
                <p className="line-clamp-3 max-w-[85%] whitespace-pre-wrap rounded-[18px] rounded-br-[6px] bg-char px-3.5 py-2 text-[14px] font-medium text-white">{m.text}</p>
              ) : (
                <div className="rounded-[18px] rounded-bl-[6px] bg-paper px-3.5 py-2.5 ring-1 ring-char/5">
                  <Markdown className="line-clamp-5 text-[14px] leading-[1.55]">{m.text}</Markdown>
                  <p className="mt-1 text-[11.5px] font-semibold text-stone">{ago(m.at)}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-[14.5px] font-medium leading-relaxed text-char/70">Ask {lead} anything: how it&apos;s going, a change you&apos;d like, or something that isn&apos;t working.</p>
      )}
      <div className="mt-5">
        <ActionLink href={`${base}/messages`} dark>
          {last.length ? 'Open the chat' : `Chat with ${lead}`}
        </ActionLink>
      </div>
    </Card>
  );
}
