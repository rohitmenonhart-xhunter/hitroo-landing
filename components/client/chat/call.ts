'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A voice call with the Project Lead (the factory's D40). The page asks for a one-use address, opens it, sends
 * the microphone as 16 kHz 16-bit PCM in 20 ms pieces, and plays the Lead's voice as it arrives. What's said
 * goes into the chat by itself (the factory writes it there), so the thread fills in as the call goes on.
 *
 *   page → factory   {type:"audio", audio}  {type:"end"}
 *   factory → page   {type:"ready"} {type:"audio", audio, text} {type:"you", text} {type:"maya", text}
 *                    {type:"listening"} {type:"interrupted"} {type:"ended", reason} {type:"error", message}
 */

export type CallState = 'idle' | 'starting' | 'live' | 'ended' | 'failed';

export interface Call {
  state: CallState;
  /** The Lead is talking now. */
  speaking: boolean;
  muted: boolean;
  /** Seconds since the line opened. */
  seconds: number;
  /** What's being said right now, and by whom. */
  caption: { who: 'lead' | 'you'; text: string } | null;
  /** Why the call ended or couldn't start, in the client's words. */
  message: string;
  /** The microphone's level, 0 to 1, for the meter. */
  level: number;
  start: () => void;
  end: () => void;
  toggleMute: () => void;
  dismiss: () => void;
}

const RATE = 16_000;

// Runs in the audio thread: averages the microphone down to 16 kHz and posts 20 ms (320-sample) pieces.
const CAPTURE = `
class Capture extends AudioWorkletProcessor {
  constructor() { super(); this.ratio = sampleRate / ${RATE}; this.pos = 0; this.sum = 0; this.cnt = 0; this.buf = new Int16Array(320); this.n = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      this.sum += ch[i]; this.cnt++; this.pos += 1;
      if (this.pos >= this.ratio) {
        this.pos -= this.ratio;
        const v = Math.max(-1, Math.min(1, this.sum / this.cnt));
        this.sum = 0; this.cnt = 0;
        this.buf[this.n++] = v < 0 ? v * 0x8000 : v * 0x7fff;
        if (this.n === 320) { this.port.postMessage(this.buf.buffer, [this.buf.buffer]); this.buf = new Int16Array(320); this.n = 0; }
      }
    }
    return true;
  }
}
registerProcessor('hf-capture', Capture);
`;

function toBase64(buf: ArrayBuffer): string {
  const u = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]!);
  return btoa(s);
}

function fromBase64Pcm(b64: string): Float32Array {
  const bin = atob(b64);
  const n = bin.length >> 1;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8);
    out[i] = (v >= 0x8000 ? v - 0x10000 : v) / 0x8000;
  }
  return out;
}

const SORRY = 'The call couldn’t start just now. Please try again in a minute, or write here.';

export function useCall(endpoint: string, onActivity: () => void): Call {
  const [state, setState] = useState<CallState>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [caption, setCaption] = useState<Call['caption']>(null);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(0);
  const live = useRef<{ ctx: AudioContext; stream?: MediaStream; ws?: WebSocket; worklet?: string; sources: Set<AudioBufferSourceNode>; next: number; ready: boolean; started: number; muted: boolean; ended: boolean } | null>(null);
  const activity = useRef(onActivity);
  activity.current = onActivity;

  const flush = useCallback(() => {
    const c = live.current;
    if (!c) return;
    for (const s of c.sources) {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
    }
    c.sources.clear();
    c.next = 0;
    setSpeaking(false);
  }, []);

  const finish = useCallback(
    (outcome: 'ended' | 'failed', why: string) => {
      const c = live.current;
      if (!c || c.ended) return;
      c.ended = true;
      flush();
      try {
        if (c.ws && c.ws.readyState <= 1) {
          if (c.ws.readyState === 1) c.ws.send(JSON.stringify({ type: 'end' }));
          c.ws.close(1000);
        }
      } catch {
        /* closed */
      }
      c.stream?.getTracks().forEach((t) => t.stop());
      void c.ctx.close().catch(() => undefined);
      if (c.worklet) URL.revokeObjectURL(c.worklet);
      setLevel(0);
      setMessage(why);
      setState(outcome);
      activity.current();
    },
    [flush]
  );

  const start = useCallback(() => {
    if (live.current && !live.current.ended) return;
    // Made in the tap itself, so the browser lets it play.
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx || !navigator.mediaDevices?.getUserMedia || typeof AudioWorkletNode === 'undefined') {
      setMessage('This browser can’t make calls. Try Chrome, Safari or Edge, or write here.');
      setState('failed');
      return;
    }
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session) session.type = 'play-and-record';
    const ctx = new Ctx();
    void ctx.resume();
    const c = { ctx, sources: new Set<AudioBufferSourceNode>(), next: 0, ready: false, started: 0, muted: false, ended: false } as NonNullable<typeof live.current>;
    live.current = c;
    setState('starting');
    setMessage('');
    setCaption(null);
    setSeconds(0);
    setMuted(false);

    void (async () => {
      try {
        c.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } });
      } catch {
        return finish('failed', 'Your microphone is blocked for this page. Allow it in the browser’s address bar, then try again, or write here.');
      }
      if (c.ended) return;
      const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }).catch(() => null);
      const body = (await res?.json().catch(() => ({}))) as { url?: string; message?: string } | undefined;
      if (!res?.ok || !body?.url) return finish('failed', body?.message || SORRY);
      if (c.ended) return;

      c.worklet = URL.createObjectURL(new Blob([CAPTURE], { type: 'application/javascript' }));
      await ctx.audioWorklet.addModule(c.worklet);
      const mic = ctx.createMediaStreamSource(c.stream);
      const capture = new AudioWorkletNode(ctx, 'hf-capture');
      const silent = ctx.createGain();
      silent.gain.value = 0;
      mic.connect(capture).connect(silent).connect(ctx.destination);

      const ws = new WebSocket(body.url);
      c.ws = ws;
      let lastLevel = 0;
      capture.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
        if (!c.ready || ws.readyState !== 1) return;
        const pcm = new Int16Array(e.data);
        if (c.muted) pcm.fill(0);
        ws.send(JSON.stringify({ type: 'audio', audio: toBase64(pcm.buffer) }));
        let sum = 0;
        for (let i = 0; i < pcm.length; i += 4) sum += Math.abs(pcm[i]!);
        const l = Math.min(1, (sum / (pcm.length / 4) / 0x8000) * 6);
        if (Math.abs(l - lastLevel) > 0.05) setLevel((lastLevel = l));
      };
      ws.onmessage = (e) => {
        let m: { type?: string; audio?: string; text?: string; message?: string; reason?: string };
        try {
          m = JSON.parse(String(e.data));
        } catch {
          return;
        }
        if (m.type === 'ready') {
          c.ready = true;
          c.started = Date.now();
          setState('live');
          activity.current();
        } else if (m.type === 'audio' && m.audio) {
          const samples = fromBase64Pcm(m.audio);
          if (samples.length) {
            const buf = ctx.createBuffer(1, samples.length, RATE);
            buf.copyToChannel(samples, 0);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            const at = Math.max(ctx.currentTime + 0.04, c.next);
            src.start(at);
            c.next = at + buf.duration;
            c.sources.add(src);
            setSpeaking(true);
            src.onended = () => {
              c.sources.delete(src);
              if (!c.sources.size) setSpeaking(false);
            };
          }
          const text = m.text ?? '';
          if (text.trim()) setCaption((cap) => (cap?.who === 'lead' ? { who: 'lead', text: `${cap.text}${/\s$/.test(cap.text) || /^\s/.test(text) ? '' : ' '}${text}` } : { who: 'lead', text: text.trim() }));
        } else if (m.type === 'you' && m.text) {
          const text = m.text;
          setCaption((cap) => (cap?.who === 'you' ? { who: 'you', text: `${cap.text} ${text}` } : { who: 'you', text }));
        } else if (m.type === 'maya') {
          activity.current();
        } else if (m.type === 'interrupted' || m.type === 'listening') {
          flush();
        } else if (m.type === 'error') {
          finish('failed', m.message || 'The line had a problem. Please try again in a minute, or write here.');
        } else if (m.type === 'ended') {
          finish('ended', '');
        }
      };
      ws.onerror = () => finish(c.ready ? 'ended' : 'failed', c.ready ? '' : SORRY);
      ws.onclose = () => finish(c.ready ? 'ended' : 'failed', c.ready ? '' : SORRY);
    })().catch(() => finish('failed', SORRY));
  }, [endpoint, finish, flush]);

  const dismiss = useCallback(() => {
    setState('idle');
    setMessage('');
    setCaption(null);
  }, []);

  // The clock, while the line is open.
  useEffect(() => {
    if (state !== 'live') return;
    const id = window.setInterval(() => setSeconds(Math.round((Date.now() - (live.current?.started ?? Date.now())) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [state]);

  // Leaving the page hangs up.
  useEffect(() => () => finish('ended', ''), [finish]);

  return {
    state,
    speaking,
    muted,
    seconds,
    caption,
    message,
    level,
    start,
    end: () => finish('ended', ''),
    toggleMute: () => {
      if (!live.current) return;
      live.current.muted = !live.current.muted;
      setMuted(live.current.muted);
      setLevel(0);
    },
    dismiss,
  };
}
