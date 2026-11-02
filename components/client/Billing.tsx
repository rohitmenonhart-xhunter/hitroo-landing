import Link from 'next/link';
import { FileText, Server } from 'lucide-react';
import type { Due, Project } from '@/lib/client/types';
import { inr, longDate, shortDate } from '@/lib/client/format';
import { cn } from '@/lib/utils';
import { ActionLink, Card, CardHead, Empty, Pill, RING } from './ui';

/** Payments the client can make now. */
export function DuePayments({ due }: { due: Due[] }) {
  if (!due.length) return null;
  return (
    <Card className="ring-2 ring-ember/30">
      <CardHead title={due.length === 1 ? 'A payment is due' : `${due.length} payments are due`} />
      <ul className="mt-4 space-y-3">
        {due.map((d) => (
          <li key={`${d.path}-${d.label}`} className="flex flex-col gap-3 rounded-[18px] bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15.5px] font-semibold">{d.quote}</p>
              <p className="text-[13.5px] font-medium text-stone">{d.label}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-[22px] font-extrabold tracking-[-0.03em] tabular-nums">{inr(d.amount)}</span>
              <ActionLink href={d.path} dark>
                Pay now
              </ActionLink>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Quotes, each with how many of its payments are made. */
export function Quotes({ quotes }: { quotes: Project['quotes'] }) {
  return (
    <Card>
      <CardHead title="Quotes" />
      <div className="mt-4">
        {quotes.length ? (
          <ul className="space-y-3">
            {quotes.map((q) => (
              <li key={q.id}>
                <Link href={q.path} className={cn('group block rounded-[18px] bg-paper p-4 ring-1 ring-transparent transition-colors hover:ring-char/15', RING)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-[15.5px] font-semibold">{q.name}</p>
                      <p className="text-[13px] font-medium text-stone">
                        {q.id} · {inr(q.price)}
                      </p>
                    </div>
                    <Pill tone={q.status === 'Waiting for you' || q.due ? 'waiting' : q.status === 'Paid' ? 'live' : 'neutral'}>{q.due ? `${inr(q.due.amount)} due` : q.status}</Pill>
                  </div>
                  {q.payments > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex flex-1 gap-1" aria-hidden="true">
                        {Array.from({ length: q.payments }, (_, i) => (
                          <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < q.paid ? 'bg-ember' : 'bg-char/10')} />
                        ))}
                      </div>
                      <span className="text-[12.5px] font-semibold text-stone">
                        {q.paid} of {q.payments} paid
                      </span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No quotes yet. Ask for a change and its quote appears here.</Empty>
        )}
      </div>
    </Card>
  );
}

/** The monthly hosting plan and its state. */
export function Hosting({ hosting }: { hosting: Project['hosting'] }) {
  return (
    <Card>
      <CardHead title="Hosting plan" aside={hosting ? <Pill tone={hosting.ok ? 'live' : 'waiting'}>{hosting.status}</Pill> : undefined} />
      {hosting ? (
        <>
          <div className="mt-5 flex items-center gap-4">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-sand">
              <Server className="h-5 w-5 text-ember" />
            </span>
            <div>
              <p className="font-display text-[24px] font-extrabold tracking-[-0.035em]">
                {hosting.plan} <span className="text-[16px] font-bold text-stone">· {inr(hosting.price)} a month</span>
              </p>
              <p className="text-[13.5px] font-medium text-stone">
                {hosting.memory >= 1024 ? `${hosting.memory / 1024} GB` : `${hosting.memory} MB`} memory · {hosting.storage} GB storage{hosting.since ? ` · since ${longDate(hosting.since)}` : ''}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[14px] font-medium leading-relaxed text-char/70">Includes HTTPS, your own domain, daily backups, uptime checks, visitor numbers and a monthly search-engine check with fixes.</p>
          {hosting.payUrl && (
            <div className="mt-5">
              <ActionLink href={hosting.payUrl} external dark>
                Set up the monthly payment
              </ActionLink>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4">
          <Empty>Hosting starts when your project goes live.</Empty>
        </div>
      )}
    </Card>
  );
}

/** Every invoice, newest first. */
export function Invoices({ token, project, invoices }: { token: string; project: string; invoices: Project['invoices'] }) {
  return (
    <Card>
      <CardHead title="Invoices" aside={invoices.length ? `${invoices.length}` : undefined} />
      <div className="mt-4">
        {invoices.length ? (
          <ul className="divide-y divide-char/5">
            {invoices.map((i) => (
              <li key={i.number}>
                <Link href={`/d/${token}/p/${project}/invoice/${encodeURIComponent(i.number)}`} className={cn('flex items-center gap-4 py-3 hover:bg-paper/60', RING)}>
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper">
                    <FileText className="h-4 w-4 text-stone" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">{i.description}</span>
                    <span className="block text-[13px] font-medium text-stone">
                      {i.number} · {shortDate(i.at)} · {i.kind}
                    </span>
                  </span>
                  <span className="font-display text-[16px] font-extrabold tracking-[-0.02em]">{inr(i.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Invoices appear here after each payment.</Empty>
        )}
      </div>
    </Card>
  );
}
