import type { MediaVideo } from './media';

/** A HITROO film, shown in the section under a page's opening. Content keys `film:home` and `film:<division>`. */
export interface FilmContent extends MediaVideo {
  seconds: number;
  /** Small label above the section heading. */
  caption: string;
  /** The section heading. */
  heading: string;
  /** The film's name (player label, search engines). */
  title: string;
  /** For search engines (the VideoObject's description). */
  description: string;
  /** YYYY-MM-DD. */
  uploadDate: string;
  transcript: string;
  credits: string;
}

/**
 * The films made in-house with the rg video pipeline (projects hitroo-intro and hitroo-<division> in Desktop/rg/projects),
 * approved by the owner on 2026-10-25. Web copies (H.264, faststart) and posters live in object storage, uploaded with
 * `scripts/media-upload.mjs --video`; videos stream straight from the bucket (see lib/media.ts).
 */
const MEDIA = 'https://hitroo-media.fly.storage.tigris.dev';
const CREDITS = 'Made by HITROO. Narration: an AI voice (ElevenLabs). Music: Epidemic Sound.';
const film = (f: Omit<FilmContent, 'width' | 'height' | 'caption' | 'uploadDate' | 'credits'>): FilmContent => ({
  width: 1920,
  height: 1080,
  caption: 'Watch',
  uploadDate: '2026-10-25',
  credits: CREDITS,
  ...f,
});

export const FILMS = {
  home: film({
    src: `${MEDIA}/vid/60452fb6-hitroo-film.mp4`,
    poster: `${MEDIA}/img/6486176e-hitroo-film-poster-1920.webp`,
    seconds: 46,
    heading: 'HITROO in 46 seconds.',
    title: 'HITROO in 46 seconds',
    description: 'Software, AI, automation and creatives: how HITROO takes the work that costs your business time and money off your plate.',
    transcript:
      'Every business hits the same wall. Work that eats your time. Costs that eat your money. And problems that hold the whole business back. Meet HITROO. Tell us what’s slowing you down. Software, built around how you work. AI that learns your business. Automation that clears the busywork, all day, all night. And with Creatives, we grow your social presence. Content made and posted for you, with the results in your dashboard. It starts with a free call. Then we plan it, build it, and keep it running. Book yours at hitroo.com.',
  }),
  software: film({
    src: `${MEDIA}/vid/daa385e6-hitroo-software-film.mp4`,
    poster: `${MEDIA}/img/de332c2c-hitroo-software-film-poster-1920.webp`,
    seconds: 32,
    heading: 'HITROO Software in 32 seconds.',
    title: 'HITROO Software in 32 seconds',
    description: 'Custom platforms, mobile and desktop apps: one system instead of ten tools, built your way and supported after launch.',
    transcript:
      'Off-the-shelf tools make you work their way. Ten tools. Ten logins. And the real work still lives in spreadsheets. Meet HITROO Software. Custom platforms, mobile apps and desktop apps: one system instead of ten tools. You click through the screens before we build, and you see working software early. After launch, the engineers who built it stay on it. Book a free call at hitroo.com.',
  }),
  ai: film({
    src: `${MEDIA}/vid/82db3421-hitroo-ai-film.mp4`,
    poster: `${MEDIA}/img/5c4acc8c-hitroo-ai-film-poster-1920.webp`,
    seconds: 32,
    heading: 'HITROO AI in 32 seconds.',
    title: 'HITROO AI in 32 seconds',
    description: 'Custom models trained on your data, private language models on your own servers, and vision systems that check quality on the line.',
    transcript:
      'Generic AI doesn’t know your business. It hasn’t read your documents, seen your products, or learned how you work. Meet HITROO AI. Custom models, trained on your own data. Private language models, on your own servers. And vision systems that check quality on the line, day and night. We test on your real cases before launch, and your data stays yours. Book a free call at hitroo.com.',
  }),
  automation: film({
    src: `${MEDIA}/vid/d0932d08-hitroo-automation-film.mp4`,
    poster: `${MEDIA}/img/78b12fec-hitroo-automation-film-poster-1920.webp`,
    seconds: 34,
    heading: 'HITROO Automation in 34 seconds.',
    title: 'HITROO Automation in 34 seconds',
    description: 'Workflows that run themselves, AI agents inside your tools, and invoices, forms and emails read and filed, with people in the loop.',
    transcript:
      'Repetitive work quietly eats your team’s week. Copying data. Chasing approvals. Typing the same invoice, again. Meet HITROO Automation. Workflows that run themselves. AI agents that work inside your tools. Invoices, forms and emails, read and filed. Sensitive steps still wait for a person’s approval, and it all runs on our own platform. Book a free call at hitroo.com.',
  }),
  creatives: film({
    src: `${MEDIA}/vid/d72a1cdf-hitroo-creatives-film.mp4`,
    poster: `${MEDIA}/img/a89d8cdc-hitroo-creatives-film-poster-1920.webp`,
    seconds: 33,
    heading: 'HITROO Creatives in 33 seconds.',
    title: 'HITROO Creatives in 33 seconds',
    description: 'Posts, reels and carousels made for your brand and posted across your channels, with every result in your dashboard.',
    transcript:
      'Posting every day is a full-time job. Ideas. Shoots. Edits. Captions. Every single day. Meet HITROO Creatives. Posts, reels and carousels, made for your brand, and posted across your channels. Every post teaches the next one, and you see every result in your dashboard. Book a free call at hitroo.com.',
  }),
} satisfies Record<string, FilmContent>;
