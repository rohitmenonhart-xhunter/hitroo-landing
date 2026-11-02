import { cn } from '@/lib/utils';

/** A grey placeholder in the shape of what's coming, shown the instant a page is opened. */
export function Bone({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn('block animate-pulse rounded-[10px] bg-char/[0.06]', className)} />;
}

/** A card-shaped placeholder. */
export function BoneCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div aria-hidden="true" className={cn('rounded-[24px] bg-white p-6 ring-1 ring-char/5 sm:p-7', className)}>
      <Bone className="h-5 w-40" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <Bone key={i} className={cn('h-4', i % 3 === 2 ? 'w-2/3' : 'w-full')} />
        ))}
      </div>
    </div>
  );
}

/** A page's opening (caption, title, a line), as a placeholder. */
export function BoneHeader() {
  return (
    <div aria-hidden="true" className="mb-8">
      <Bone className="h-3.5 w-36" />
      <Bone className="mt-4 h-11 w-[min(520px,80%)]" />
      <Bone className="mt-4 h-6 w-48 rounded-full" />
    </div>
  );
}

/** Screen readers hear that the page is loading. */
export const Loading = () => <p className="sr-only" role="status">Loading…</p>;
