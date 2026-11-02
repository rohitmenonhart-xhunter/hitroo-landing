'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

const TZ = 'Asia/Kolkata';
const dayKey = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ });
export const timeOf = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
export const sameDay = (a: string, b: string) => dayKey(a) === dayKey(b);

/** "Today", "Yesterday" or the date, in India time. */
export function dayLabel(iso: string, now = new Date()): string {
  const d = dayKey(iso);
  if (d === dayKey(now.toISOString())) return 'Today';
  if (d === dayKey(new Date(now.getTime() - 86_400_000).toISOString())) return 'Yesterday';
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
}

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

/** The Project Lead's avatar: ember, with a green "here" dot when `online`. */
export function LeadAvatar({ name, size = 'md', online }: { name: string; size?: 'sm' | 'md' | 'lg'; online?: boolean }) {
  const s = { sm: 'h-8 w-8 text-[12px]', md: 'h-10 w-10 text-[14px]', lg: 'h-16 w-16 text-[22px]' }[size];
  return (
    <span aria-hidden="true" className={cn('relative flex shrink-0 items-center justify-center rounded-full bg-ember font-display font-extrabold text-white', s)}>
      {initialsOf(name)}
      {online && <span className={cn('absolute rounded-full bg-[#2F9E5B] ring-2 ring-white', size === 'lg' ? 'bottom-0.5 right-0.5 h-4 w-4' : '-bottom-0.5 -right-0.5 h-3 w-3')} />}
    </span>
  );
}

export function DaySeparator({ iso }: { iso: string }) {
  return (
    <div className="my-2 flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-char/[0.07]" />
      <span className="text-[12px] font-semibold text-stone">{dayLabel(iso)}</span>
      <span className="h-px flex-1 bg-char/[0.07]" />
    </div>
  );
}

/** Three dots while the Lead writes. */
export function Typing({ lead }: { lead: string }) {
  return (
    <div className="flex items-center gap-3" role="status" aria-label={`${lead} is writing`}>
      <LeadAvatar name={lead} size="sm" />
      <span className="flex items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-paper px-4 py-3 ring-1 ring-char/5">
        {[0, 160, 320].map((d) => (
          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-stone/60" style={{ animationDelay: `${d}ms` }} />
        ))}
      </span>
      <span className="text-[13px] font-medium text-stone">{lead} is writing…</span>
    </div>
  );
}

/** Copies a message's text. */
export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => void navigator.clipboard?.writeText(text).then(() => (setDone(true), setTimeout(() => setDone(false), 1500)))}
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-semibold text-stone hover:bg-paper hover:text-char focus-visible:outline focus-visible:outline-2 focus-visible:outline-char"
      aria-label="Copy message"
    >
      {done ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}
