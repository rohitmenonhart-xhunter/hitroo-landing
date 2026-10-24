# HITROO — Design Language

How the HITROO site looks, reads and behaves (since 2026-10-24, modelled on weichie.com's type, colour and layout). Follow it for every new page, section or component.

## North star
One foundation with four divisions: Software, Automation, AI and Creatives. A visitor should feel, in seconds, that an experienced firm is speaking: **professional** (calm, precise, honest), **crafted** (clear glass, warm paper, one ember accent) and **innovative** (real WebGL glass in the hero, never stock effects or anything that reads as AI-made).

## Rules
1. **One background.** Every page is warm paper (`paper`). Sections never switch background; white cards, frosted glass cards and one dark card per page sit on it.
2. **Symmetry.** Cards in a row are always the same size (equal columns, equal heights); an odd last card spans the row. No lopsided grids.
3. **No shadows, no glows.** Cards are separated by hairline rings or frosted glass; nothing floats on a drop shadow and nothing glows.
4. **Glass is the brand.** Each page opens with its name in clear glass; numerals, the "?" and the "hi" are glass too. Glass stays clear: no tint, no glow.
5. **Minimal, professional words.** A caption, a heading, at most one line, then the content; one action per block. Experienced-firm tone, never "newbie" phrasing or filler ("since 2024"). Never "wings": they are divisions.
6. **Honest claims only.** No invented clients, products, numbers or case studies. Facts the owner confirmed are listed at the top of `lib/division-pages.ts`.
7. **Only the home hero is live.** The WebGL glass runs only in the home hero; every other glass element is a still image, so pages stay light and never stutter.

## Voice
Every line should sound like a studio that has done this many times: confident, specific, a little unexpected, never basic.
- **Make a point, then prove it.** A heading carries an idea ("Built for the day after launch."), the line under it backs it with a fact. Never a label dressed as a heading ("Our services", "Support in one app").
- **Two beats.** The tension, then the turn: "Nothing gets lost between hand-offs, because there aren't any." "No call centre, no scripts, no hand-offs. The people who built it fix it."
- **Show the way we work as a point of view, not a checklist or a service-level table.** "You steer with real software, not status reports." beats "Working releases in short iterations." Plain metrics (response hours, counts) only when they impress against the best firms.
- **Name real things:** spreadsheets, approvals, invoices, releases, the parts nobody wrote down. Never "solutions", "seamless", "cutting-edge", "leverage", "empower", "unlock", "journey", "next-level".
- **Calm, never cute:** no slang, puns, exclamation marks or em-dash flourishes; no casual phrasing ("busywork", "look after", "finally talking to each other").
- **True today:** every claim must already be true (confirmed facts are listed in `lib/division-pages.ts`). Creativity is in the framing, never in invented capabilities.
- **Actions stay plain:** "Book a free call", "Get in touch", "Explore Software".

## Division signatures
HITROO.com is the standard foundation; each division page keeps every rule above (paper, char, ember, Plus Jakarta Sans, glass, equal cards, no shadows or glows) and adds one signature of its own (owner, 2026-10-24):
- **Software** (after the Cleary and topdevs Dribbble shots): the code symbol in clear glass, wrapped in vines, as the background of the opening card; the night studio behind the standards.
- **Automation** (after the Puls AI shot): twisted ribbons of fine ember lines (drawn in code by `scripts/art/ribbons.py`) behind the opening.
- **AI** (after the Creative AI website shot): light bent through fluted glass, behind the opening with white type, and behind the standards' glass tiles.
- **Creatives** (after usefastlane.ai and Higgsfield): the funky, colourful one, built around reels. Its content is deliberately colourful and varied (owner, 2026-10-24: "should be colorful, not only one style"): a reel library of nine styles (Vox-style explainers, faceless videos, product ads, characters, trends, stop-motion, podcast clips, local businesses, campaigns), 20+ unique reels per style so a strip runs over a minute before repeating, each with an on-screen caption (subtitles, or a Vox-style highlighted title) and a coloured format chip; style pills switch the library. Also a fan of reels in the opening, a strip of posts (illustration, flat lay, 3D, before-and-after), the monthly cycle as a loop, the best performer and its colourway variations, and a huge line that slides with the scroll. The page frame (paper, type, cards) stays HITROO; the colour lives in the content and the chips. Library data: `lib/creatives-library.ts` (generated).

The shared pieces are `SignatureIntro` (image card with the headline over it) and the `image` option of `StandardsCard`; Creatives' are in `components/warm/reels/`. Reels never show usernames, likes or view counts.

## Tokens (tailwind.config.ts)
| Token | Value | Use |
| --- | --- | --- |
| `paper` | #FCF8F6 | The page |
| `char` | #12110B | Text, the dark card, the footer wordmark's "troo" |
| `ember` | #F5502F | The "hi", caption marks, the action circle, icons, numbers |
| `sand` | #F3EEE8 | Icon circles, cover placeholders, quiet fills |
| `stone` | #6F6A61 | Secondary text, the second line of a statement |
| white | #FFFFFF | Cards |

Surfaces in `app/globals.css`: `.glass-warm` (frosted card on paper), `.glass-ink` (frosted tile on the dark card), `.duotone-warm` (post covers in warm monochrome, via the SVG filter in `WarmShell`).

## Type
- **Plus Jakarta Sans** (`font-display`, `font-jakarta`): headlines ExtraBold/Bold with tight tracking (`H_PAGE`, `H_L`, `H_M`, `H_S` in `components/warm/ui.tsx`) and the wordmark. Wrap headline strings in `<Tight>`: it pulls in Jakarta's wide punctuation.
- **Fustat** (`font-body`, self-hosted): text and interface, Medium for reading (`P`).
- Captions: 13px uppercase with a small ember diamond (`Caption`).

## Building blocks (components/warm/)
- Frame: `WarmShell` (skip link, `WarmHeader`, page, `WarmFooter`, analytics, cookie choice, the duotone filter). `WarmHeader`: wordmark left, plain links and the "Get in touch" `TouchPill` right; hides on scroll down, returns as a frosted bar on scroll up.
- Openings: `WarmHero` (home: the live glass "hitroo"), `PageIntro` (every other page: `GlassWord`, caption, h1 left, line and action right).
- Sections: `WSection` (caption, heading, line, content), `Statement` (two lines, the second in stone), `PointCards` (equal white cards with an icon or number), `LinkCards`, `StepCards` (glass numerals 01–04), `StandardsCard` (the dark card with six glass tiles), `Engagements` (one frosted card in equal columns), `FlowCard` (one process in five stops), `SplitCards` (frosted and dark lists side by side), `CapabilityExplorer` (list and glass panel; swipe on phones), `DivisionsScroller` (home: pinned, sideways-moving division cards), `OtherDivisions`, `FaqSection` (with the glass "?"), `ContactPanel`, `FounderBlock`, `RecentPosts`, `PostGrid`, `PostPage`, `ClosingCta` (frosted card with the glass "hi").
- Templates: `DivisionPage` renders `/software`, `/automation`, `/ai`, `/creatives` from their `division:<slug>` content (edited in the admin; built-in copy in `lib/division-pages.ts`).
- Images in content go through `Media` (next/image for `public/` files, pre-sized WebP from storage for uploads); never add a raw `next/image` for content images.

## Glass
- **Live:** `components/clear/GlassWordmark` (WebGL2: distance-field bevel, Snell refraction with RGB dispersion, Fresnel reflections, cursor ripples; `plain` on the paper colour). Used only by the home hero. Style: `WORDMARK_GLASS` in `components/warm/glass-style.ts`.
- **Still:** `public/glass/*.webp`, rendered at 2× by `/preview/glass-render` and keyed to transparent WebP; sizes in `components/warm/glass-sizes.ts`; shown with `Glass` / `GlassWord`. Words use `fontFit`, so every word has one letter size and baseline. To add one: add it to `WORDS` or `ITEMS` in `app/preview/glass-render/page.tsx`, capture (`?batch=N` or `?only=id`; browsers allow about 16 WebGL contexts per page), key it, copy it to `public/glass/` and regenerate `glass-sizes.ts`.

## Logo
The wordmark "hitroo", lowercase, Plus Jakarta Sans ExtraBold, with "hi" in Ember and "troo" in Char (Paper on dark). `components/brand/Wordmark.tsx` on screen; files in `public/brand/` (SVG, PNG, on-dark, glass wordmark, app icon "hi"); favicons are the "hi" on paper. Rules and downloads: `/brand`.

## Motion
Quiet and purposeful: the hero's glass ripples, the pinned division cards sliding sideways, the header tucking away, arrows that turn on hover. Respect `prefers-reduced-motion` (the division cards stack instead of pinning).

## Imagery
- **Photography is art-directed from references.** For each division, study the most creative players in that vertical (Awwwards, Dribbble, Behance) and recreate their direction in our style; never copy or edit their images. Briefs name the camera, lens, aperture, angle, light and film look; no people presented as our team, no readable text, no fake UI mocks, cursors, gradients or glows.
- **The owner reviews every generated image before it goes on the site.**
- The founder's own photo is `public/people/rohit.webp`; post covers always show in warm monochrome (`.duotone-warm`).
