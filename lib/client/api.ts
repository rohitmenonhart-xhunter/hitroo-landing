/**
 * The client area's only data source: the delivery API (the Software Factory's src/clientapi/api.ts), called
 * from the server with a shared secret. Browsers never see the API, its address or the secret; they see only
 * my.hitroo.com. Server code only: never import this from a client component.
 *
 *   FACTORY_API_URL      the API's base, e.g. https://console.factory.hitroo.com/api/client/v1
 *   FACTORY_API_SECRET   the shared secret (CLIENT_API_SECRET on the factory)
 */
import { headers } from 'next/headers';
import type { Chat, Invoice, Overview, Paid, Project, Quote, Sent } from './types';

const BASE = (process.env.FACTORY_API_URL || 'https://console.factory.hitroo.com/api/client/v1').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message || code);
  }
}

/** The client's own address and browser, passed on for rate limits and the acceptance record. */
function client(): { ip: string; ua: string } {
  const h = headers();
  return { ip: (h.get('x-forwarded-for') ?? '').split(',')[0]!.trim() || h.get('x-real-ip') || '', ua: h.get('user-agent') ?? '' };
}

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const secret = process.env.FACTORY_API_SECRET;
  if (!secret) throw new ApiError(503, 'not_set_up', 'FACTORY_API_SECRET is not set');
  const c = client();
  const res = await fetch(BASE + path, {
    method,
    headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json', 'x-client-ip': c.ip, 'x-client-ua': c.ua },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(25_000),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'error', data.message ?? '');
  return data as T;
}

/** The address parts are checked here first, so nothing odd is ever passed on. */
export const isAccessToken = (t: string) => /^[0-9a-f]{40}$/.test(t);
export const isQuoteToken = (t: string) => /^[0-9a-f]{32}$/.test(t);
export const isProjectId = (id: string) => /^[a-z0-9][a-z0-9-]{0,62}$/.test(id);

const d = (t: string) => `/d/${t}`;
const p = (t: string, id: string) => `/d/${t}/p/${encodeURIComponent(id)}`;

export const api = {
  overview: (t: string) => call<Overview>('GET', d(t)),
  project: (t: string, id: string) => call<Project>('GET', p(t, id)),
  projectInvoice: (t: string, id: string, n: string) => call<Invoice>('GET', `${p(t, id)}/invoice/${encodeURIComponent(n)}`),
  newProject: (t: string, text: string) => call<{ sent: Sent; project: string }>('POST', `${d(t)}/new`, { text }),
  request: (t: string, id: string, kind: 'change' | 'problem', text: string) => call<{ sent: Sent }>('POST', `${p(t, id)}/request`, { kind, text }),
  answer: (t: string, id: string, task: string, text: string) => call<{ sent: Sent }>('POST', `${p(t, id)}/answer`, { task, text }),
  chat: (t: string, id: string, after?: string) => call<Chat>('GET', `${p(t, id)}/messages${after ? `?after=${encodeURIComponent(after)}` : ''}`),
  message: (t: string, id: string, text: string, files: string[] = []) => call<{ sent: Sent }>('POST', `${p(t, id)}/message`, { text, files }),
  upload: (t: string, id: string, file: { name: string; type: string; size: number }) => call<{ id: string; url: string; headers: Record<string, string> }>('POST', `${p(t, id)}/uploads`, file),
  /** A one-use address (60 s) to open a voice call with the Lead from this page. */
  voice: (t: string, id: string) => call<{ url: string; expiresInSeconds: number }>('POST', `${p(t, id)}/voice`),
  domain: (t: string, id: string, domain: string) => call<{ sent: Sent }>('POST', `${p(t, id)}/domain`, { domain }),
  quote: (q: string) => call<Quote>('GET', `/q/${q}`),
  accept: (q: string, name: string, agree: boolean) => call<Quote>('POST', `/q/${q}/accept`, { name, agree }),
  pay: (q: string, n: number) => call<{ url: string }>('POST', `/q/${q}/pay/${n}`),
  paid: (q: string, n: number) => call<Paid>('GET', `/q/${q}/paid/${n}`),
  quoteInvoice: (q: string, n: number) => call<Invoice>('GET', `/q/${q}/invoice/${n}`),
};

/** Runs an API read; a missing or foreign link becomes null (the page shows "not found"), anything else throws. */
export async function orNull<T>(load: Promise<T>): Promise<T | null> {
  try {
    return await load;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
