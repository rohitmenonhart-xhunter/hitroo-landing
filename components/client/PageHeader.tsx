import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A dashboard page's opening: the small caption with the ember mark, the title, and actions on the right. */
export default function PageHeader({ caption, title, children, aside, className }: { caption: string; title: string; children?: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <header className={cn('mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between', className)}>
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.05em] text-char/70">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-ember" />
          {caption}
        </p>
        <h1 className="mt-3 font-display text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.045em] text-char [text-wrap:balance]">{title}</h1>
        {children && <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
      {aside && <div className="flex shrink-0 flex-wrap gap-3">{aside}</div>}
    </header>
  );
}
