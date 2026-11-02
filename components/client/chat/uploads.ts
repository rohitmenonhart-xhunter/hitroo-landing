'use client';

import { useCallback, useState } from 'react';

/** What the chat accepts, as the delivery system does (src/clientapi/attachments.ts). */
const TYPES: Record<string, { kind: 'image' | 'video' | 'pdf'; maxMb: number }> = {
  'image/png': { kind: 'image', maxMb: 25 },
  'image/jpeg': { kind: 'image', maxMb: 25 },
  'image/webp': { kind: 'image', maxMb: 25 },
  'image/gif': { kind: 'image', maxMb: 25 },
  'image/heic': { kind: 'image', maxMb: 25 },
  'video/mp4': { kind: 'video', maxMb: 300 },
  'video/quicktime': { kind: 'video', maxMb: 300 },
  'video/webm': { kind: 'video', maxMb: 300 },
  'application/pdf': { kind: 'pdf', maxMb: 25 },
};
export const ACCEPT = Object.keys(TYPES).join(',');
const BY_EXTENSION: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', heic: 'image/heic', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', pdf: 'application/pdf' };

/** A file being attached: its local preview, upload progress, and its id once storage has it. */
export interface Pending {
  key: string;
  name: string;
  type: string;
  size: number;
  kind: 'image' | 'video' | 'pdf';
  /** A local link to show it before it's sent (images and videos). */
  preview: string | null;
  progress: number;
  id?: string;
  error?: string;
}

export const sizeText = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(n >= 10 * 1024 * 1024 ? 0 : 1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/**
 * Attaching files: each one is checked here, given a signed link by the server, and sent straight to storage
 * with its progress shown. A message names the files that finished.
 */
export function useUploads(feed: string) {
  const [items, setItems] = useState<Pending[]>([]);
  const update = useCallback((key: string, patch: Partial<Pending>) => setItems((l) => l.map((x) => (x.key === key ? { ...x, ...patch } : x))), []);

  const upload = useCallback(
    async (p: Pending, file: File) => {
      const res = await fetch(`${feed.replace(/\/feed$/, '')}/upload`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: p.name, type: p.type, size: p.size }) }).catch(() => null);
      const d = (await res?.json().catch(() => ({}))) as { id?: string; url?: string; headers?: Record<string, string>; message?: string };
      if (!res?.ok || !d.url || !d.id) return update(p.key, { error: d.message ?? "Couldn't upload. Please try again." });
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', d.url);
      for (const [k, v] of Object.entries(d.headers ?? {})) xhr.setRequestHeader(k, v);
      xhr.upload.onprogress = (e) => e.lengthComputable && update(p.key, { progress: e.loaded / e.total });
      xhr.onload = () => update(p.key, xhr.status < 300 ? { progress: 1, id: d.id } : { error: "Couldn't upload. Please try again." });
      xhr.onerror = () => update(p.key, { error: 'The connection dropped. Please try again.' });
      xhr.send(file);
    },
    [feed, update]
  );

  const add = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files).slice(0, 10);
      const next: Pending[] = list.map((f, i) => {
        const type = f.type || BY_EXTENSION[f.name.split('.').pop()?.toLowerCase() ?? ''] || '';
        const t = TYPES[type];
        const p: Pending = { key: `${Date.now()}-${i}-${f.name}`, name: f.name || 'pasted-image.png', type, size: f.size, kind: t?.kind ?? 'pdf', preview: t && t.kind !== 'pdf' && type !== 'image/heic' ? URL.createObjectURL(f) : null, progress: 0 };
        if (!t) p.error = 'Send screenshots, photos, screen recordings or PDFs.';
        else if (f.size > t.maxMb * 1024 * 1024) p.error = `Over ${t.maxMb} MB${t.kind === 'video' ? ': a shorter recording works best' : ''}.`;
        return p;
      });
      setItems((l) => [...l, ...next].slice(-10));
      next.forEach((p, i) => !p.error && void upload(p, list[i]!));
    },
    [upload]
  );

  const remove = useCallback((key: string) => setItems((l) => l.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  return { items, add, remove, clear, ready: items.filter((x) => x.id && !x.error), busy: items.some((x) => !x.id && !x.error) };
}
