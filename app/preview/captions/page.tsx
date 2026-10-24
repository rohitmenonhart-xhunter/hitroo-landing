import Reel from '@/components/warm/reels/Reel';
import { REEL_STYLES } from '@/lib/creatives-library';
import { asReel } from '@/lib/reels';

/** Internal: every library style's first reels, to review the caption looks side by side. Not linked, not indexed. */
export default function CaptionPreview() {
  return (
    <div className="grid gap-8 bg-paper p-6">
      {REEL_STYLES.map((s) => (
        <section key={s.key} data-style={s.key}>
          <p className="mb-3 font-display text-[18px] font-extrabold text-char">{s.name}</p>
          <div className="grid grid-cols-6 gap-3">
            {s.reels.slice(0, 6).map((_, i) => (
              <Reel key={i} reel={asReel(s, i)} sizes="240px" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
