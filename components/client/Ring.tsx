import type { ReactNode } from 'react';

/** A progress ring: ember on sand, the value in the middle. `value` is 0 to 1. */
export default function Ring({ value, size = 64, stroke = 7, children, label }: { value: number; size?: number; stroke?: number; children?: ReactNode; label: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3EEE8" strokeWidth={stroke} />
        {v > 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F5502F" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${c * v} ${c}`} />}
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  );
}
