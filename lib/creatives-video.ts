import type { MediaVideo } from './media';

export interface ShowcaseVideoContent extends MediaVideo {
  seconds: number;
  title: string;
  /** For search engines (the VideoObject's description). */
  description: string;
  /** YYYY-MM-DD. */
  uploadDate: string;
  transcript: string;
  sources: { label: string; href: string }[];
  credits: string;
}

/**
 * The Creatives showcase video: a Vox-style myth-buster made in-house with the rg video pipeline
 * (project: Desktop/rg/projects/hitroo-myth-attention; facts in its work/facts.md). Approved by the owner 2026-10-24.
 * Files carry content fingerprints (?v=) so they can be cached for a year; the live copy plays from object storage.
 */
export const MYTH_VIDEO: ShowcaseVideoContent = {
  src: '/video/myth-attention.mp4?v=daf29ad0',
  poster: '/video/myth-attention-poster.webp?v=c5237bfc',
  width: 720,
  height: 1280,
  seconds: 32,
  title: 'The goldfish attention span, busted',
  description: 'A 30-second myth-buster made by hitroo Creatives: where the “goldfish attention span” claim came from, and why it doesn’t hold up.',
  uploadDate: '2026-10-24',
  transcript:
    'You’ve heard we have the attention span of a goldfish. Eight seconds. It traces back to a 2015 Microsoft Canada report that credited a website called Statistic Brain. When reporters checked, no one could find the study behind it. Attention researchers say there’s no evidence ours is shrinking. And goldfish? Scientists use them to study memory. People don’t stop paying attention. They stop paying attention to things that aren’t worth it. So the fix isn’t shorter. It’s better.',
  sources: [
    { label: 'BBC, “Busting the attention span myth”, 10 March 2017', href: 'https://www.bbc.com/news/health-38896790' },
    { label: 'The Wall Street Journal, “Is Your Attention Span Shorter Than a Goldfish’s?”, 17 February 2017', href: 'https://www.wsj.com/articles/is-your-attention-span-shorter-than-a-goldfishs-1487340000' },
    { label: 'TIME, “You Now Have a Shorter Attention Span Than a Goldfish”, 14 May 2015 (how the claim spread)', href: 'https://time.com/3858309/attention-spans-goldfish/' },
    { label: 'Live Science, “Do goldfish really have a 3-second memory?”, 22 May 2021', href: 'https://www.livescience.com/goldfish-memory.html' },
  ],
  credits: 'Narration: an AI voice (ElevenLabs). Music: Epidemic Sound. Illustrations made for this video.',
};
