import { cn } from '@/lib/utils';

/** The HITROO logo: the name in Plus Jakarta Sans ExtraBold, with "hi" in ember. Size and colour of "troo" come from `className`. */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-jakarta font-extrabold leading-none tracking-[-0.045em]', className)}>
      <span className="text-ember">hi</span>troo
    </span>
  );
}
