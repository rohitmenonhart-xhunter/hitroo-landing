'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import type { Chat, ChatMessage } from '@/lib/client/types';
import { cn } from '@/lib/utils';
import Composer from './Composer';
import Thread, { type Outgoing } from './Thread';
import { useUploads } from './uploads';
import { LeadAvatar } from './bits';
import CallHeader from './CallHeader';

const SUGGESTIONS = ["How's my project going?", "I'd like to change something", "Something isn't working right", "What's next, and what do you need from me?"];

/** The key under which this browser remembers the last message from the Lead it has seen (the unread mark). */
export const readKey = (project: string) => `hf-read:${project}`;

/**
 * The chat with the Project Lead. Messages appear at once and are confirmed by the feed; the Lead's reply
 * arrives by itself (the feed is checked every 2 s while it writes, every 8 s otherwise, and when the tab comes
 * back). It stays at the newest message unless the client has scrolled up.
 */
export default function ChatApp({ token, project, initial }: { token: string; project: string; initial: Chat }) {
  const feed = `/d/${token}/p/${project}/messages/feed`;
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages);
  const [waiting, setWaiting] = useState(initial.waiting);
  const [replying, setReplying] = useState(initial.replying);
  const [failed, setFailed] = useState(initial.failed);
  const [outbox, setOutbox] = useState<Outgoing[]>([]);
  const [draft, setDraft] = useState('');
  const [unseen, setUnseen] = useState(0);
  const [atBottom, setAtBottom] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [calls, setCalls] = useState(Boolean(initial.calls));
  const [onCall, setOnCall] = useState(false);
  const uploads = useUploads(feed);
  const scroller = useRef<HTMLDivElement>(null);
  const bottom = useRef(true);
  const latest = useRef(initial.messages.at(-1)?.at ?? '');

  const toEnd = useCallback((smooth = false) => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    setUnseen(0);
  }, []);

  const poll = useCallback(async () => {
    const after = latest.current;
    const res = await fetch(after ? `${feed}?after=${encodeURIComponent(after)}` : feed, { cache: 'no-store' }).catch(() => null);
    if (!res?.ok) return;
    const c = (await res.json()) as Chat;
    if (c.messages.length) {
      latest.current = c.messages.at(-1)!.at;
      setMessages((m) => {
        const seen = new Set(m.map((x) => x.id));
        const fresh = c.messages.filter((x) => !seen.has(x.id));
        return fresh.length ? [...m, ...fresh] : m;
      });
      if (!bottom.current) setUnseen((n) => n + c.messages.filter((x) => x.from === 'lead').length);
    }
    // A sent message leaves the outbox once the conversation (or the queue behind the current reply) has it.
    const mine = [...c.messages.filter((x) => x.from === 'you'), ...c.waiting];
    const onRecord = (x: Outgoing) => mine.some((m) => (x.text ? m.text === x.text || m.text.includes(x.text) : x.files.every((f) => m.files.some((g) => g.id === f.id))));
    setOutbox((o) => o.filter((x) => !(x.state === 'sent' && onRecord(x))));
    setWaiting(c.waiting);
    setReplying(c.replying);
    setFailed(c.failed);
    setCalls(Boolean(c.calls));
  }, [feed]);

  const send = useCallback(
    async (text: string, files: Outgoing['files'] = [], retry?: Outgoing) => {
      const t = text.trim();
      if (!t && !files.length) return;
      const key = retry?.key ?? `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      setOutbox((o) => (retry ? o.map((x) => (x.key === key ? { ...x, state: 'sending' } : x)) : [...o, { key, text: t, at: new Date().toISOString(), state: 'sending', files }]));
      setFailed(false);
      bottom.current = true;
      const res = await fetch(feed, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: t, files: files.map((f) => f.id) }) }).catch(() => null);
      setOutbox((o) => o.map((x) => (x.key === key ? { ...x, state: res?.ok ? 'sent' : 'failed' } : x)));
      if (res?.ok) {
        setReplying(true);
        void poll();
      }
    },
    [feed, poll]
  );

  // The feed: quick while a reply is on its way or a call is on (its words arrive as they're said), slow
  // otherwise, and at once when the tab is back.
  const busy = onCall || replying || waiting.length > 0 || outbox.some((x) => x.state !== 'failed');
  const activity = useCallback(() => {
    bottom.current = true;
    void poll();
  }, [poll]);
  const sendDraft = () => {
    const files = uploads.ready.map((u) => ({ key: u.key, id: u.id!, name: u.name, type: u.type, size: u.size, kind: u.kind, url: u.preview }));
    void send(draft, files);
    setDraft('');
    uploads.clear();
  };
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') void poll();
    };
    const id = window.setInterval(tick, busy ? 2000 : 8000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [busy, poll]);

  // Stay at the newest message, unless the client scrolled up to read.
  useLayoutEffect(() => {
    if (bottom.current) toEnd();
  }, [messages.length, waiting.length, outbox.length, replying, failed, toEnd]);

  // Seen: remember the Lead's last message, so the navigation's unread mark clears.
  useEffect(() => {
    const last = messages.filter((m) => m.from === 'lead').at(-1)?.at;
    if (!last) return;
    try {
      localStorage.setItem(readKey(project), last);
      window.dispatchEvent(new Event('hf-read'));
    } catch {
      /* private mode: no unread marks */
    }
  }, [messages, project]);

  const empty = messages.length === 0 && waiting.length === 0 && outbox.length === 0;
  const first = initial.name.trim().split(/\s+/)[0];
  return (
    <div
      className="relative flex h-[calc(100dvh-12.5rem)] min-h-[460px] flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-char/5 lg:h-[calc(100dvh-5.5rem)]"
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes('Files')) return;
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.files.length) return;
        e.preventDefault();
        setDragging(false);
        uploads.add(e.dataTransfer.files);
      }}
    >
      {dragging && (
        <div className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-[22px] border-2 border-dashed border-ember bg-white/90 text-center">
          <p className="font-display text-[20px] font-bold tracking-[-0.02em]">
            Drop to send to {initial.lead}
            <span className="mt-1 block font-body text-[14px] font-medium text-stone">Screenshots, screen recordings or PDFs</span>
          </p>
        </div>
      )}
      <CallHeader endpoint={`/d/${token}/p/${project}/messages/voice`} lead={initial.lead} available={calls} onActive={setOnCall} onActivity={activity}>
        <LeadAvatar name={initial.lead} online />
        <div className="min-w-0">
          <h1 className="font-display text-[18px] font-bold leading-tight tracking-[-0.025em]">{initial.lead}</h1>
          <p className="truncate text-[13px] font-medium text-stone" aria-live="polite">
            {replying ? <span className="text-ember-dark">Writing…</span> : `Your project lead · ${initial.project}`}
          </p>
        </div>
      </CallHeader>

      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          const at = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          bottom.current = at;
          setAtBottom(at);
          if (at) setUnseen(0);
        }}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto w-full max-w-[780px] px-4 py-6 sm:px-6">
          {empty ? (
            <div className="flex flex-col items-center pt-8 text-center sm:pt-14">
              <LeadAvatar name={initial.lead} size="lg" online />
              <h2 className="mt-5 font-display text-[26px] font-extrabold tracking-[-0.035em]">
                Hi {first}, I&apos;m {initial.lead}
              </h2>
              <p className="mt-2 max-w-[460px] text-[15.5px] font-medium leading-relaxed text-char/70">I look after {initial.project}. Ask me anything: how it&apos;s going, a change you&apos;d like, or something that isn&apos;t working.</p>
              <div className="mt-7 grid w-full max-w-[560px] grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => void send(s)} className="rounded-[16px] bg-paper px-4 py-3 text-left text-[14.5px] font-semibold text-char ring-1 ring-char/5 transition-colors hover:bg-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-char">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <Thread lead={initial.lead} messages={messages} waiting={waiting} outbox={outbox} replying={replying} failed={failed} onRetry={(o) => void send(o.text, o.files, o)} />
          )}
        </div>
      </div>

      {!atBottom && (
        <button
          type="button"
          onClick={() => {
            bottom.current = true;
            toEnd(true);
          }}
          className={cn('absolute bottom-[104px] left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-[0_6px_20px_rgba(18,17,11,0.15)] transition-colors', unseen ? 'bg-ember text-white' : 'bg-white text-char ring-1 ring-char/10')}
        >
          <ArrowDown aria-hidden="true" className="h-4 w-4" />
          {unseen ? `${unseen} new message${unseen === 1 ? '' : 's'}` : 'Latest'}
        </button>
      )}

      <footer className="border-t border-char/[0.06] px-3 pb-3 pt-3 sm:px-6 sm:pb-4">
        <div className="mx-auto w-full max-w-[780px]">
          <Composer token={token} project={project} lead={initial.lead} value={draft} onChange={setDraft} onSend={sendDraft} uploads={uploads.items} onAttach={uploads.add} onRemove={uploads.remove} />
          <p className="mt-2 hidden text-center text-[12px] font-medium text-stone sm:block">Enter to send · Shift + Enter for a new line · drop or paste screenshots and recordings</p>
        </div>
      </footer>
    </div>
  );
}
