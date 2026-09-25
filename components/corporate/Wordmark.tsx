import Logo from '@/components/brand/Logo';
import { cn } from '@/lib/utils';

export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Logo className="h-[26px] w-auto" />
      <span className="text-[19px] font-semibold tracking-[0.08em] text-ink">HITROO</span>
    </span>
  );
}
