import type { ReactNode } from 'react';
import Link from 'next/link';
import Wordmark from '@/components/brand/Wordmark';
import type { Overview } from '@/lib/client/types';
import { initials } from '@/lib/client/format';
import ClientNav, { type NavProject } from './ClientNav';
import { RING } from './ui';

/** Every dashboard page's frame: the navigation on the left (a top bar on phones), the page on the right. */
export default function ClientShell({ token, overview, children }: { token: string; overview: Overview; children: ReactNode }) {
  const projects: NavProject[] = overview.projects.map((p) => ({ id: p.id, name: p.name, live: Boolean(p.live), attention: p.asks > 0 || p.quotesWaiting > 0 || overview.due.some((d) => d.project === p.id), lastLeadAt: p.lastLeadAt }));
  const home = `/d/${token}`;
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[288px_minmax(0,1fr)]">
      <a href="#main" className="sr-only z-[70] rounded-full bg-char px-5 py-3 text-[15px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-char/5 px-4 pb-5 pt-7 print:hidden lg:flex">
        <Link href={home} aria-label="Your dashboard" className={`mb-8 flex items-baseline gap-2.5 rounded-sm px-3 ${RING}`}>
          <Wordmark className="text-[26px] text-char" />
          <span className="text-[13px] font-semibold text-stone">dashboard</span>
        </Link>
        <ClientNav token={token} projects={projects} variant="side" />
        <div className="mt-auto pt-8">
          <LeadCard lead={overview.lead} chat={overview.projects[0] ? `${home}/p/${overview.projects[0].id}/messages` : null} />
          <p className="mt-4 px-3 text-[12.5px] font-medium leading-relaxed text-stone">
            Signed in as {overview.name}. This private link is yours; please don&apos;t share it.
          </p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-char/5 bg-paper/90 px-5 pb-3 pt-4 backdrop-blur-md print:hidden lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Link href={home} aria-label="Your dashboard" className={`rounded-sm ${RING}`}>
              <Wordmark className="text-[24px] text-char" />
            </Link>
            <span aria-label={`Signed in as ${overview.name}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-char text-[13px] font-bold text-white">
              {initials(overview.name)}
            </span>
          </div>
          <ClientNav token={token} projects={projects} variant="top" />
        </header>
        <main id="main" className="mx-auto w-full max-w-[1200px] px-5 pb-20 pt-7 sm:px-8 lg:px-12 lg:pt-10 print:max-w-none print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Who looks after them: their Project Lead, one message away. */
function LeadCard({ lead, chat }: { lead: string; chat: string | null }) {
  return (
    <div className="rounded-[18px] bg-white p-4 ring-1 ring-char/5">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ember font-display text-[15px] font-extrabold text-white">
          {initials(lead)}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#2F9E5B] ring-2 ring-white" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-char">{lead}</p>
          <p className="text-[13px] font-medium text-stone">Your project lead</p>
        </div>
      </div>
      <p className="mt-3 text-[13px] font-medium leading-relaxed text-char/70">Ask {lead} anything, any time.</p>
      {chat && (
        <Link href={chat} className={`mt-3 inline-flex h-9 items-center rounded-full bg-char px-4 text-[13.5px] font-semibold text-white hover:bg-char/90 ${RING}`}>
          Chat with {lead}
        </Link>
      )}
    </div>
  );
}
