'use client';

import { useEffect, type ReactNode } from 'react';
import { Mic, MicOff, Phone, PhoneOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadAvatar } from './bits';
import { useCall } from './call';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * The chat's header, with a call button when calls are on. During a call it becomes the call: who's talking,
 * the words as they're said, the clock, mute and hang up. The thread below fills in with what's said.
 */
export default function CallHeader({ endpoint, lead, available, onActive, onActivity, children }: { endpoint: string; lead: string; available: boolean; onActive: (on: boolean) => void; onActivity: () => void; children: ReactNode }) {
  const call = useCall(endpoint, onActivity);
  const on = call.state === 'starting' || call.state === 'live';
  useEffect(() => onActive(on), [on, onActive]);
  // A finished call's note goes away by itself.
  useEffect(() => {
    if (call.state !== 'ended') return;
    const id = window.setTimeout(call.dismiss, 5000);
    return () => window.clearTimeout(id);
  }, [call.state, call.dismiss]);

  if (call.state === 'idle') {
    return (
      <header className="flex items-center gap-3 border-b border-char/[0.06] px-4 py-3.5 sm:px-6">
        {children}
        {available && (
          <button
            type="button"
            onClick={call.start}
            className="ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-char px-4 text-[14px] font-semibold text-white transition-colors hover:bg-char/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            <span>
              Call <span className="hidden sm:inline">{lead}</span>
            </span>
          </button>
        )}
      </header>
    );
  }

  if (call.state === 'ended' || call.state === 'failed') {
    return (
      <header className={cn('flex items-center gap-3 border-b px-4 py-3.5 sm:px-6', call.state === 'failed' ? 'border-ember/20 bg-ember/[0.07]' : 'border-char/[0.06] bg-paper')} role="status">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', call.state === 'failed' ? 'bg-ember/15 text-ember-dark' : 'bg-char/[0.06] text-char')}>
          <PhoneOff aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[16px] font-bold leading-tight tracking-[-0.02em]">{call.state === 'failed' ? 'The call didn’t connect' : `Call ended${call.seconds ? ` · ${clock(call.seconds)}` : ''}`}</p>
          <p className="text-[13.5px] font-medium text-char/70">{call.message || `What you both said is in the chat below. ${lead} follows up here.`}</p>
        </div>
        <button type="button" onClick={call.dismiss} aria-label="Close" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone hover:bg-char/[0.06] hover:text-char focus-visible:outline focus-visible:outline-2 focus-visible:outline-char">
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </header>
    );
  }

  const status = call.state === 'starting' ? 'Connecting…' : call.muted ? 'You’re muted' : call.speaking ? 'Speaking' : 'Listening';
  return (
    <header className="flex items-center gap-3 border-b border-char bg-char px-4 py-3 text-white sm:px-6" aria-label={`On a call with ${lead}`}>
      <span className="relative shrink-0">
        {/* Rings: the Lead's voice pulses, the client's level grows. */}
        <span aria-hidden="true" className={cn('absolute inset-0 rounded-full bg-ember/50', call.speaking && 'animate-ping')} />
        <span aria-hidden="true" className="absolute -inset-1 rounded-full bg-white/15 transition-transform duration-100" style={{ transform: `scale(${1 + call.level * 0.35})` }} />
        <span className="relative">
          <LeadAvatar name={lead} />
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2 font-display text-[16px] font-bold leading-tight tracking-[-0.02em]">
          {lead}
          <span className="font-body text-[13px] font-semibold text-white/60" aria-live="polite">
            {status}
            {call.state === 'live' && ` · ${clock(call.seconds)}`}
          </span>
        </p>
        <p className="mt-0.5 truncate text-[13.5px] font-medium text-white/85" aria-live="off" title={call.caption?.text}>
          {call.caption ? (
            <>
              <span className="text-white/50">{call.caption.who === 'lead' ? lead : 'You'}: </span>
              {call.caption.text.length > 140 ? `…${call.caption.text.slice(-140)}` : call.caption.text}
            </>
          ) : call.state === 'starting' ? (
            'Allow the microphone if your browser asks.'
          ) : (
            `Go ahead, ${lead} is listening.`
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={call.toggleMute}
        disabled={call.state !== 'live'}
        aria-pressed={call.muted}
        aria-label={call.muted ? 'Unmute' : 'Mute'}
        className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40', call.muted ? 'bg-white text-char' : 'bg-white/10 text-white hover:bg-white/20')}
      >
        {call.muted ? <MicOff aria-hidden="true" className="h-4 w-4" /> : <Mic aria-hidden="true" className="h-4 w-4" />}
      </button>
      <button type="button" onClick={call.end} aria-label="End the call" className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-ember px-4 text-[14px] font-semibold text-white transition-colors hover:bg-ember-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <PhoneOff aria-hidden="true" className="h-4 w-4" />
        <span className="hidden sm:inline">End</span>
      </button>
    </header>
  );
}
