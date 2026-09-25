'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Download, Loader2, LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import Wordmark from '@/components/corporate/Wordmark';
import { FIELD, LABEL, SUBMIT } from '@/components/corporate/form';
import { cn } from '@/lib/utils';

type Tab = 'insights' | 'leads' | 'applications' | 'posts';
type Count = { label: string | null; n: number };
interface Insights {
  days: number;
  totals: { views: number; visitors: number; leads: number; applications: number };
  pages: Count[];
  countries: Count[];
  referrers: Count[];
  devices: Count[];
  daily: { day: string; n: number }[];
}
interface Lead {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  page: string | null;
  country: string | null;
}
interface Application {
  id: string;
  created_at: string;
  position: string;
  name: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  portfolio: string | null;
  experience: string | null;
  availability: string | null;
  resume_name: string | null;
  country: string | null;
}
interface Post {
  id: string;
  kind: 'article' | 'blog';
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string | null;
  cover_image: string | null;
  status: 'draft' | 'published';
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
}

const EMPTY_POST = {
  kind: 'blog' as 'article' | 'blog',
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  body: '',
  cover_image: '',
  status: 'published' as 'draft' | 'published',
  published_at: '',
  seo_title: '',
  seo_description: '',
};

const when = (d: string) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>('insights');

  const api = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const res = await fetch(path, {
        ...init,
        headers: { 'x-admin-password': password, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
      });
      if (res.status === 401) {
        setAuthed(false);
        throw new Error('Wrong password');
      }
      return res;
    },
    [password]
  );

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('hitroo_admin');
      if (saved) setPassword(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const login = async (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await api('/api/admin/insights?days=1');
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not sign in');
      setAuthed(true);
      try {
        sessionStorage.setItem('hitroo_admin', password);
      } catch {
        /* ignore */
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    setAuthed(false);
    setPassword('');
    try {
      sessionStorage.removeItem('hitroo_admin');
    } catch {
      /* ignore */
    }
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5">
        <form onSubmit={login} className="w-full max-w-sm">
          <Link href="/" aria-label="HITROO home">
            <Wordmark />
          </Link>
          <h1 className="mt-10 text-[32px] font-light tracking-[-0.03em] text-ink">Admin</h1>
          <label htmlFor="admin-password" className={`${LABEL} mt-8`}>
            Password
          </label>
          <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={FIELD} autoFocus />
          <button type="submit" className={`${SUBMIT} mt-6 w-full`} disabled={!password || busy}>
            {busy ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : 'Sign in'}
          </button>
          {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="HITROO home">
            <Wordmark />
          </Link>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-[14px] text-slate-500 hover:text-ink">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </button>
        </div>
        <nav className="mt-12 flex flex-wrap gap-2" aria-label="Admin sections">
          {(['insights', 'leads', 'applications', 'posts'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn('h-10 rounded-full px-5 text-[14px] font-medium capitalize transition-colors', tab === t ? 'bg-cobalt text-white' : 'bg-mist text-ink hover:bg-cobalt-soft')}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="mt-12">
          {tab === 'insights' && <InsightsView api={api} />}
          {tab === 'leads' && <LeadsView api={api} kind="leads" />}
          {tab === 'applications' && <LeadsView api={api} kind="applications" />}
          {tab === 'posts' && <PostsView api={api} />}
        </div>
      </div>
    </main>
  );
}

type Api = (path: string, init?: RequestInit) => Promise<Response>;

function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const refresh = useCallback(() => {
    setError('');
    load()
      .then(setData)
      .catch((e) => setError((e as Error).message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(refresh, [refresh]);
  return { data, error, refresh };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[44px] font-light leading-none tracking-[-0.03em] text-ink tabular-nums">{value.toLocaleString()}</p>
      <p className="mt-3 text-[14px] text-slate-500">{label}</p>
    </div>
  );
}

function TopList({ title, rows }: { title: string; rows: Count[] }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div>
      <h3 className="text-[18px] font-medium text-ink">{title}</h3>
      {!rows.length && <p className="mt-4 text-[14px] text-slate-500">No data yet.</p>}
      <ul className="mt-4 grid gap-3">
        {rows.map((r) => (
          <li key={r.label ?? '—'} className="grid gap-1">
            <div className="flex justify-between text-[14px]">
              <span className="truncate text-ink">{r.label ?? 'Direct / unknown'}</span>
              <span className="tabular-nums text-slate-500">{r.n}</span>
            </div>
            <div className="h-1.5 rounded-full bg-mist">
              <div className="h-1.5 rounded-full bg-cobalt" style={{ width: `${(r.n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightsView({ api }: { api: Api }) {
  const [days, setDays] = useState(30);
  const { data, error } = useLoad<Insights>(async () => (await api(`/api/admin/insights?days=${days}`)).json(), [days]);
  const max = Math.max(1, ...(data?.daily.map((d) => d.n) ?? [1]));
  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays(d)}
            className={cn('h-9 rounded-full px-4 text-[13px] font-medium', days === d ? 'bg-ink text-white' : 'bg-mist text-ink')}
          >
            {d} days
          </button>
        ))}
      </div>
      {error && <p className="mt-6 text-red-600">{error}</p>}
      {!data && !error && <Loader2 aria-label="Loading" className="mt-10 h-6 w-6 animate-spin text-cobalt" />}
      {data && (
        <>
          <div className="mt-12 grid grid-cols-2 gap-10 lg:grid-cols-4">
            <Stat label="Page views" value={data.totals.views} />
            <Stat label="Visitors (with consent)" value={data.totals.visitors} />
            <Stat label="Leads" value={data.totals.leads} />
            <Stat label="Applications" value={data.totals.applications} />
          </div>
          <div className="mt-16">
            <h3 className="text-[18px] font-medium text-ink">Daily page views</h3>
            <div className="mt-6 flex h-40 items-end gap-1" aria-label="Daily page views chart">
              {data.daily.map((d) => (
                <div key={d.day} title={`${d.day}: ${d.n}`} className="flex-1 rounded-t bg-cobalt/80" style={{ height: `${Math.max(3, (d.n / max) * 100)}%` }} />
              ))}
              {!data.daily.length && <p className="text-[14px] text-slate-500">No page views yet.</p>}
            </div>
          </div>
          <div className="mt-16 grid gap-14 md:grid-cols-2 lg:grid-cols-4">
            <TopList title="Top pages" rows={data.pages} />
            <TopList title="Countries" rows={data.countries} />
            <TopList title="Referrers" rows={data.referrers} />
            <TopList title="Devices" rows={data.devices} />
          </div>
        </>
      )}
    </section>
  );
}

function LeadsView({ api, kind }: { api: Api; kind: 'leads' | 'applications' }) {
  const { data, error } = useLoad<{ leads: Lead[]; applications: Application[] }>(async () => (await api('/api/admin/leads')).json(), []);

  const download = async (a: Application) => {
    const res = await api(`/api/admin/applications/${a.id}/resume`);
    if (!res.ok) return;
    const url = URL.createObjectURL(await res.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = a.resume_name || 'resume.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <Loader2 aria-label="Loading" className="h-6 w-6 animate-spin text-cobalt" />;

  if (kind === 'leads') {
    if (!data.leads.length) return <p className="text-slate-500">No enquiries yet.</p>;
    return (
      <ul className="grid gap-10">
        {data.leads.map((l) => (
          <li key={l.id} className="grid gap-2">
            <p className="text-[13px] text-slate-500">{[when(l.created_at), l.country, l.page].filter(Boolean).join(' · ')}</p>
            <p className="text-[19px] font-medium text-ink">{l.name || 'No name'}{l.interest ? ` — ${l.interest}` : ''}</p>
            <p className="text-[15px] text-slate-600">{[l.email, l.phone].filter(Boolean).join(' · ')}</p>
            {l.message && <p className="max-w-3xl whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">{l.message}</p>}
          </li>
        ))}
      </ul>
    );
  }

  if (!data.applications.length) return <p className="text-slate-500">No applications yet.</p>;
  return (
    <ul className="grid gap-10">
      {data.applications.map((a) => (
        <li key={a.id} className="grid gap-2">
          <p className="text-[13px] text-slate-500">{[when(a.created_at), a.country, a.experience, a.availability].filter(Boolean).join(' · ')}</p>
          <p className="text-[19px] font-medium text-ink">
            {a.name} — {a.position}
          </p>
          <p className="text-[15px] text-slate-600">{[a.email, a.phone, a.linkedin, a.portfolio].filter(Boolean).join(' · ')}</p>
          {a.resume_name && (
            <button type="button" onClick={() => download(a)} className="inline-flex w-fit items-center gap-2 text-[14px] font-medium text-cobalt hover:text-cobalt-dark">
              <Download aria-hidden="true" className="h-4 w-4" />
              {a.resume_name}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

function PostsView({ api }: { api: Api }) {
  const { data, error, refresh } = useLoad<{ posts: Post[] }>(async () => (await api('/api/admin/posts')).json(), []);
  const [form, setForm] = useState(EMPTY_POST);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const set = (k: keyof typeof EMPTY_POST, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const edit = (p: Post) => {
    setEditing(p.id);
    setForm({
      kind: p.kind,
      title: p.title,
      slug: p.slug,
      category: p.category ?? '',
      excerpt: p.excerpt,
      body: p.body,
      cover_image: p.cover_image ?? '',
      status: p.status,
      published_at: p.published_at.slice(0, 16),
      seo_title: p.seo_title ?? '',
      seo_description: p.seo_description ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form, published_at: form.published_at ? new Date(form.published_at).toISOString() : '' };
      const res = await api('/api/admin/posts', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(editing ? { id: editing, ...payload } : payload),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || 'Could not save');
      setMessage(editing ? 'Saved.' : 'Published.');
      setEditing(null);
      setForm(EMPTY_POST);
      refresh();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Delete “${p.title}”?`)) return;
    await api(`/api/admin/posts?id=${p.id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <section className="grid gap-20">
      <form onSubmit={save} className="grid max-w-3xl gap-5">
        <h2 className="text-[28px] font-light tracking-[-0.02em] text-ink">{editing ? 'Edit post' : 'New post'}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="post-kind" className={LABEL}>
              Section
            </label>
            <select id="post-kind" value={form.kind} onChange={(e) => set('kind', e.target.value)} className={FIELD}>
              <option value="blog">Blog</option>
              <option value="article">Article</option>
            </select>
          </div>
          <div>
            <label htmlFor="post-status" className={LABEL}>
              Status
            </label>
            <select id="post-status" value={form.status} onChange={(e) => set('status', e.target.value)} className={FIELD}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label htmlFor="post-date" className={LABEL}>
              Publish date (optional)
            </label>
            <input id="post-date" type="datetime-local" value={form.published_at} onChange={(e) => set('published_at', e.target.value)} className={FIELD} />
          </div>
        </div>
        <div>
          <label htmlFor="post-title" className={LABEL}>
            Title
          </label>
          <input id="post-title" value={form.title} onChange={(e) => set('title', e.target.value)} className={FIELD} required maxLength={200} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="post-slug" className={LABEL}>
              URL slug (optional)
            </label>
            <input id="post-slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} className={FIELD} placeholder="made-from-the-title" maxLength={90} />
          </div>
          <div>
            <label htmlFor="post-category" className={LABEL}>
              Category
            </label>
            <input id="post-category" value={form.category} onChange={(e) => set('category', e.target.value)} className={FIELD} placeholder="AI, Software, Business…" maxLength={60} />
          </div>
        </div>
        <div>
          <label htmlFor="post-excerpt" className={LABEL}>
            Summary (one or two lines)
          </label>
          <textarea id="post-excerpt" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} className={`${FIELD} resize-none`} maxLength={400} />
        </div>
        <div>
          <label htmlFor="post-body" className={LABEL}>
            Body — one paragraph per line; ## heading, - list, **bold**, [link](https://…)
          </label>
          <textarea id="post-body" value={form.body} onChange={(e) => set('body', e.target.value)} rows={14} className={FIELD} />
        </div>
        <div>
          <label htmlFor="post-cover" className={LABEL}>
            Cover image URL (optional)
          </label>
          <input id="post-cover" value={form.cover_image} onChange={(e) => set('cover_image', e.target.value)} className={FIELD} placeholder="/photos/… or https://…" maxLength={500} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="post-seo-title" className={LABEL}>
              Search title (optional)
            </label>
            <input id="post-seo-title" value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} className={FIELD} maxLength={120} />
          </div>
          <div>
            <label htmlFor="post-seo-desc" className={LABEL}>
              Search description (optional)
            </label>
            <input id="post-seo-desc" value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} className={FIELD} maxLength={200} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className={SUBMIT} disabled={saving || !form.title}>
            {saving ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : editing ? 'Save changes' : (
              <>
                <Plus aria-hidden="true" className="h-4 w-4" />
                Publish
              </>
            )}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY_POST); }} className="text-[14px] text-slate-500 hover:text-ink">
              Cancel
            </button>
          )}
          {message && <p className="text-[14px] text-slate-600">{message}</p>}
        </div>
      </form>

      <div>
        <h2 className="text-[28px] font-light tracking-[-0.02em] text-ink">All posts</h2>
        {error && <p className="mt-6 text-red-600">{error}</p>}
        {!data && !error && <Loader2 aria-label="Loading" className="mt-6 h-6 w-6 animate-spin text-cobalt" />}
        {data && !data.posts.length && <p className="mt-6 text-slate-500">No posts yet.</p>}
        <ul className="mt-8 grid gap-8">
          {data?.posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[13px] text-slate-500">
                  {[p.kind === 'blog' ? 'Blog' : 'Article', p.status === 'draft' ? 'Draft' : 'Published', when(p.published_at)].join(' · ')}
                </p>
                <a href={`/${p.kind === 'blog' ? 'blog' : 'articles'}/${p.slug}`} target="_blank" rel="noreferrer" className="mt-1 block text-[19px] text-ink hover:text-cobalt">
                  {p.title}
                </a>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => edit(p)} aria-label={`Edit ${p.title}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink hover:bg-cobalt-soft">
                  <Pencil aria-hidden="true" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => remove(p)} aria-label={`Delete ${p.title}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink hover:bg-red-50 hover:text-red-600">
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
