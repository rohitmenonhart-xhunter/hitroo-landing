'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LayoutGrid, MessageCircle, Plus, Receipt, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RING } from './ui';

export interface NavProject {
  id: string;
  name: string;
  live: boolean;
  attention: boolean;
}

const SECTIONS = [
  { href: '', label: 'Overview', icon: Sparkles },
  { href: '/site', label: 'Your site', icon: Globe },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
] as const;

/** The client area's navigation: home, each project (with its sections when open) and "new project". */
export default function ClientNav({ token, projects, variant }: { token: string; projects: NavProject[]; variant: 'side' | 'top' }) {
  const path = usePathname() ?? '';
  const home = `/d/${token}`;
  const open = projects.find((p) => path === `${home}/p/${p.id}` || path.startsWith(`${home}/p/${p.id}/`));
  const at = (href: string, exact = false) => (exact ? path === href : path === href || path.startsWith(href + '/'));

  if (variant === 'top') {
    const base = open ? `${home}/p/${open.id}` : '';
    return (
      <nav aria-label="Client area" className="space-y-2">
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          <TopItem href={home} active={at(home, true)}>
            Home
          </TopItem>
          {projects.map((p) => (
            <TopItem key={p.id} href={`${home}/p/${p.id}`} active={open?.id === p.id} dot={p.attention}>
              {p.name}
            </TopItem>
          ))}
          <TopItem href={`${home}/new`} active={at(`${home}/new`)}>
            + New project
          </TopItem>
        </ul>
        {open && (
          <ul className="-mx-5 flex gap-5 overflow-x-auto border-b border-char/5 px-5 [scrollbar-width:none]">
            {SECTIONS.map((s) => {
              const href = base + s.href;
              const active = s.href ? at(href) : path === href || at(`${href}/request`);
              return (
                <li key={s.label}>
                  <Link href={href} aria-current={active ? 'page' : undefined} className={cn('block whitespace-nowrap border-b-2 pb-2.5 pt-1 text-[14.5px] font-semibold', active ? 'border-ember text-char' : 'border-transparent text-stone', RING)}>
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="Client area" className="flex flex-col gap-1">
      <SideItem href={home} active={at(home, true)} icon={<LayoutGrid className="h-[18px] w-[18px]" />}>
        Home
      </SideItem>
      <p className="mb-1 mt-6 px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-stone">Your projects</p>
      {projects.map((p) => {
        const base = `${home}/p/${p.id}`;
        const isOpen = open?.id === p.id;
        return (
          <div key={p.id}>
            <Link
              href={base}
              aria-current={isOpen && path === base ? 'page' : undefined}
              className={cn('flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold transition-colors', isOpen ? 'text-char' : 'text-char/70 hover:bg-white hover:text-char', RING)}
            >
              <span aria-hidden="true" className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] font-display text-[13px] font-extrabold', isOpen ? 'bg-char text-white' : 'bg-sand text-char/70')}>
                {p.name.trim()[0]?.toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
              {p.attention && <span aria-label="Needs you" className="h-2 w-2 shrink-0 rounded-full bg-ember" />}
              {!p.attention && p.live && <span aria-label="Live" className="h-2 w-2 shrink-0 rounded-full bg-[#2F9E5B]" />}
            </Link>
            {isOpen && (
              <ul className="mb-2 ml-[26px] mt-1 space-y-0.5 border-l border-char/10 pl-3">
                {SECTIONS.map((s) => {
                  const href = base + s.href;
                  const active = s.href ? at(href) : path === href || at(`${href}/request`);
                  const Icon = s.icon;
                  return (
                    <li key={s.label}>
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={cn('flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[14.5px] font-medium transition-colors', active ? 'bg-white text-char shadow-[0_1px_2px_rgba(18,17,11,0.06)] ring-1 ring-char/5' : 'text-char/65 hover:text-char', RING)}
                      >
                        <Icon aria-hidden="true" className={cn('h-4 w-4', active ? 'text-ember' : 'text-stone')} />
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
      <SideItem href={`${home}/new`} active={at(`${home}/new`)} icon={<Plus className="h-[18px] w-[18px]" />}>
        Start a new project
      </SideItem>
    </nav>
  );
}

function SideItem({ href, active, icon, children }: { href: string; active: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn('flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold transition-colors', active ? 'bg-white text-char ring-1 ring-char/5' : 'text-char/70 hover:bg-white hover:text-char', RING)}
    >
      <span aria-hidden="true" className={active ? 'text-ember' : 'text-stone'}>
        {icon}
      </span>
      {children}
    </Link>
  );
}

function TopItem({ href, active, dot, children }: { href: string; active: boolean; dot?: boolean; children: React.ReactNode }) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn('flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold', active ? 'bg-char text-white' : 'bg-white text-char/75 ring-1 ring-char/10', RING)}
      >
        {children}
        {dot && <span aria-label="Needs you" className="h-1.5 w-1.5 rounded-full bg-ember" />}
      </Link>
    </li>
  );
}
