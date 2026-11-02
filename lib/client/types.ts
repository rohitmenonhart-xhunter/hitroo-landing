/**
 * The client area's data, as the delivery API returns it (the Software Factory's src/clientapi/data.ts).
 * Every label is already in the client's words.
 */

export type Tone = 'neutral' | 'waiting' | 'live';

export interface Overview {
  name: string;
  lead: string;
  projects: Array<{
    id: string;
    name: string;
    client: string;
    stage: string;
    live: string | null;
    plan: string | null;
    done: number;
    total: number;
    asks: number;
    quotesWaiting: number;
    /** When the Lead last wrote, for the unread mark. */
    lastLeadAt: string | null;
  }>;
  due: Due[];
  quotesWaiting: Array<{ project: string; name: string; price: number; path: string }>;
}

export interface Due {
  project: string;
  quote: string;
  label: string;
  amount: number;
  path: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: string;
  tone: Tone;
  kind: 'fix' | 'design' | 'feature';
  updatedAt: string;
}

export interface SiteStats {
  visitors: number;
  pageviews: number;
  visits: number;
  topPages: Array<{ path: string; views: number }>;
  sources: Array<{ source: string; visits: number }>;
  daily?: Array<{ date: string; visitors: number; views: number }>;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  lead: string;
  stage: string;
  live: string | null;
  progress: { done: number; total: number };
  inProgress: TaskItem[];
  done: TaskItem[];
  asks: Array<{ task: string; title: string; question: string }>;
  toReview: Array<{ title: string; note: string; url: string; kind: 'preview' | 'design'; openComments: number }>;
  activity: Array<{ at: string; title: string; status: string; tone: Tone }>;
  quotes: Array<{ id: string; name: string; price: number; status: string; paid: number; payments: number; due: { label: string; amount: number } | null; path: string }>;
  due: Due[];
  hosting: { plan: string; price: number; memory: number; storage: number; status: string; ok: boolean; payUrl: string | null; since: string | null } | null;
  domains: { current: string; list: Array<{ name: string; status: 'pending' | 'connected' | 'expired' }>; record: { domain: string; type: 'A'; host: string; value: string } | null } | null;
  site: {
    stats: SiteStats | null;
    seo: { score: number; at: string; seconds: number; checks: Array<{ label: string; ok: boolean }> } | null;
    uptime: { pct: number | null; days: Array<{ date: string; pct: number | null }>; down: boolean; incidents: Array<{ start: string; end: string; minutes: number }> };
  } | null;
  invoices: Array<{ number: string; at: string; description: string; total: number; kind: 'Hosting' | 'Project' }>;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  from: 'lead' | 'you';
  /** Markdown. */
  text: string;
  at: string;
  files: ChatFile[];
  /** Said on a voice call with the Lead, not written. */
  call?: boolean;
}

/** A file sent in the chat, with a signed link to view it (null once it has expired). */
export interface ChatFile {
  id: string;
  name: string;
  type: string;
  size: number;
  kind: 'image' | 'video' | 'pdf' | 'file';
  url: string | null;
}

/** The chat with the Project Lead: its messages, those waiting for the current reply, and its state. */
export interface Chat {
  name: string;
  lead: string;
  project: string;
  messages: ChatMessage[];
  waiting: Array<{ text: string; at: string; files: ChatFile[] }>;
  replying: boolean;
  failed: boolean;
  /** Whether the client can call the Lead from the chat. */
  calls?: boolean;
}

export type Quote =
  | { ready: false; client: string }
  | {
      ready: true;
      id: string;
      client: string;
      lead: string;
      title: string;
      summary: string;
      assumptions: string[];
      exclusions: string[];
      status: 'sent' | 'accepted' | 'paid' | 'expired';
      price: number;
      marketValue: number;
      supportPerMonth: number;
      validUntil: string | null;
      chargePct: number;
      milestones: Array<{ n: number; label: string; pct: number; amount: number; charge: number; status: 'not_due' | 'due' | 'paid'; when: string; paidAt: string | null; invoice: string | null }>;
      agreementHtml: string;
      accepted: { name: string; at: string; version: string; fingerprint: string } | null;
    };

export type Paid =
  | { confirmed: false; client: string; lead: string; what: string; label: string; amount: number; quotePath: string }
  | { confirmed: true; client: string; lead: string; what: string; label: string; amount: number; quotePath: string; next: string; paidAt: string; paymentId: string; invoice: string | null };

export interface Invoice {
  number: string;
  at: string;
  client: string;
  description: string;
  line: string;
  amount: number;
  gst: number;
  gstPct: number;
  charge: number;
  total: number;
  payment: { id: string; via: string };
  from: { name: string; trade: string | null; address: string; gstin: string | null; pan: string | null; email: string | null };
}

export type Sent = 'new' | 'change' | 'problem' | 'newwork' | 'answer' | 'domain' | 'message';
