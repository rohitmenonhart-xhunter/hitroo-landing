/**
 * The HITROO mark: two linked rings — the OO of HITROO — rising to the right.
 * Open rings with a real over/under weave, cobalt and navy; always shown with the HITROO name
 * except where space forces the mark alone (favicons, app icons).
 */
const COLORS = {
  color: { a: '#2451FF', b: '#0A1B4A' },
  light: { a: '#6F8DFF', b: '#FFFFFF' },
};

const RING_A = 'M10.852 -28.449A50 50 0 1 1 -10.953 -42.804A53.5 53.5 0 0 0 -22.042 -26.987A32 32 0 1 0 -0.433 -13.745A28.5 28.5 0 0 1 10.852 -28.449Z';
const RING_B = 'M-10.852 28.449A50 50 0 1 1 10.953 42.804A53.5 53.5 0 0 0 22.042 26.987A32 32 0 1 0 0.433 13.745A28.5 28.5 0 0 1 -10.852 28.449Z';

export default function Logo({ variant = 'color', className, title }: { variant?: 'color' | 'light'; className?: string; title?: string }) {
  const c = COLORS[variant];
  return (
    <svg className={className} viewBox="-76.59 -54.689 153.18 109.377" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path fill={c.a} d={RING_A} />
      <path fill={c.b} d={RING_B} />
    </svg>
  );
}
