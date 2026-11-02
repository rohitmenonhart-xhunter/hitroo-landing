import { CircleAlert, Clock, RotateCw } from 'lucide-react';
import type { ChatFile, ChatMessage } from '@/lib/client/types';
import { cn } from '@/lib/utils';
import Files, { type ShownFile } from './Files';
import Markdown from './Markdown';
import { CopyButton, DaySeparator, LeadAvatar, sameDay, timeOf, Typing } from './bits';

/** A message the client sent from this page that isn't in the conversation yet. */
export interface Outgoing {
  key: string;
  text: string;
  at: string;
  state: 'sending' | 'sent' | 'failed';
  /** Its files: ids to send, and local previews to show meanwhile. */
  files: Array<ShownFile & { id: string }>;
}

type Item = { kind: 'message'; m: ChatMessage } | { kind: 'waiting'; text: string; at: string; files: ChatFile[] } | { kind: 'out'; o: Outgoing };
const shown = (files: ChatFile[]): ShownFile[] => files.map((f) => ({ ...f, key: f.id }));
const atOf = (i: Item) => (i.kind === 'message' ? i.m.at : i.kind === 'waiting' ? i.at : i.o.at);
const fromOf = (i: Item) => (i.kind === 'message' ? i.m.from : 'you');

/** The conversation: day by day, the Lead's messages in Markdown with its avatar, the client's on the right. */
export default function Thread({ lead, messages, waiting, outbox, replying, failed, onRetry }: { lead: string; messages: ChatMessage[]; waiting: Array<{ text: string; at: string; files: ChatFile[] }>; outbox: Outgoing[]; replying: boolean; failed: boolean; onRetry: (o: Outgoing) => void }) {
  const items: Item[] = [...messages.map((m) => ({ kind: 'message' as const, m })), ...waiting.map((w) => ({ kind: 'waiting' as const, ...w })), ...outbox.map((o) => ({ kind: 'out' as const, o }))];
  return (
    <ol className="flex flex-col gap-1.5" aria-label={`Conversation with ${lead}`}>
      {items.map((it, i) => {
        const prev = items[i - 1];
        const at = atOf(it);
        const newDay = !prev || !sameDay(atOf(prev), at);
        const run = !newDay && prev && fromOf(prev) === fromOf(it) && Date.parse(at) - Date.parse(atOf(prev)) < 10 * 60_000;
        const key = it.kind === 'message' ? it.m.id : it.kind === 'waiting' ? `w-${it.at}` : it.o.key;
        return (
          <li key={key} className={cn(!run && 'mt-4 first:mt-0')}>
            {newDay && (
              <div className="mb-4">
                <DaySeparator iso={at} />
              </div>
            )}
            {it.kind === 'message' && it.m.from === 'lead' ? (
              <div className="group flex gap-3">
                {run ? <span className="w-8 shrink-0" /> : <LeadAvatar name={lead} size="sm" />}
                <div className="min-w-0 flex-1 pt-0.5">
                  {!run && (
                    <p className="mb-1 text-[13.5px] font-bold text-char">
                      {lead} <span className="font-medium text-stone">· {timeOf(at)}</span>
                    </p>
                  )}
                  <Markdown>{it.m.text}</Markdown>
                  <div className="mt-1 h-7 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                    <CopyButton text={it.m.text} />
                  </div>
                </div>
              </div>
            ) : (
              <Mine
                text={it.kind === 'message' ? it.m.text : it.kind === 'waiting' ? it.text : it.o.text}
                files={it.kind === 'message' ? shown(it.m.files) : it.kind === 'waiting' ? shown(it.files) : it.o.files}
                at={at}
                state={it.kind === 'out' ? it.o.state : 'sent'}
                onRetry={it.kind === 'out' ? () => onRetry(it.o) : undefined}
              />
            )}
          </li>
        );
      })}
      {replying && (
        <li className="mt-4">
          <Typing lead={lead} />
        </li>
      )}
      {failed && !replying && (
        <li className="mt-4 flex items-start gap-2.5 rounded-[16px] bg-ember/[0.07] px-4 py-3 text-[14px] font-medium text-ember-dark">
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {lead} couldn&apos;t reply just now. Your message is saved, and the team will get back to you shortly.
        </li>
      )}
    </ol>
  );
}

/** The client's own message: a dark bubble on the right, with its time or its sending state. */
function Mine({ text, files, at, state, onRetry }: { text: string; files: ShownFile[]; at: string; state: Outgoing['state']; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <Files files={files} mine />
      {text && <p className={cn('max-w-[min(85%,560px)] whitespace-pre-wrap break-words rounded-[20px] rounded-br-[6px] bg-char px-4 py-2.5 text-[15.5px] font-medium leading-[1.55] text-white', state === 'failed' && 'bg-char/60')}>{text}</p>}
      <p className="mt-1 flex items-center gap-1.5 pr-1 text-[12px] font-semibold text-stone">
        {state === 'sending' ? (
          <>
            <Clock aria-hidden="true" className="h-3 w-3" /> Sending…
          </>
        ) : state === 'failed' ? (
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 text-ember-dark hover:underline">
            <RotateCw aria-hidden="true" className="h-3 w-3" /> Not sent. Tap to try again
          </button>
        ) : (
          timeOf(at)
        )}
      </p>
    </div>
  );
}
