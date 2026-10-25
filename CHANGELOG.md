# Changelog

All notable changes to the HITROO website and its infrastructure. Newest first. Dates are IST.

## 2026-10-25 — lowercase hitroo, Head of Technology, "based in"

### Changed
- **The brand is written in lowercase everywhere:** every visible "HITROO" on the site, in emails, structured data names, llms.txt and the admin now reads "hitroo" (178 places on the site); "HITROO" stays only as an `alternateName`.
- **Rohit is Head of Technology** on the About page's block and in structured data (`employee`, `jobTitle`), not Founder.
- **"Based in Chennai, India"** replaces "Headquarters" (About page, llms.txt). Email subjects use " | hitroo" (no long dash).
- **Link previews (WhatsApp & co.):** the card is now `public/og-hitroo.jpg` (45 KB JPEG made from `og-image.png`) under a new name, with `og:image:type` and `og:image:secure_url`; hitroo.com → www is a permanent 308 (was a 307), set on the Vercel domain.
- **Phone menu fixed:** it opened inside the header, whose slide-away transform made the fixed menu only as tall as the bar, so the page showed through; it now sits outside the header and covers the screen.

## 2026-10-25 — HITROO films, the new acknowledgment email

### Added
- **Films under the opening of five pages:** the HITROO film (46 s) on the home page and one film per division (Software 32 s, AI 32 s, Automation 34 s, Creatives 33 s), made in-house (HyperFrames, ElevenLabs voice, Epidemic music; projects in `Desktop/rg/projects/hitroo-*`). `components/warm/FilmSection.tsx` shows each right after the hero: it loads only near the screen, plays muted while on screen, "Sound on" restarts it with sound, and the transcript sits under it (no credits line, at the owner's request); VideoObject structured data. New content keys `film:home`, `film:software`, `film:automation`, `film:ai`, `film:creatives` (editable in the admin; built-in copies in `lib/films.ts`). Web copies (H.264, faststart, 8–15 MB) and posters are in Tigris, uploaded with the new single-video mode `scripts/media-upload.mjs --video <file> --poster <image> --slug <slug>`.

### Changed
- **Acknowledgment email** (contact and careers forms) rebuilt in the site's look: warm paper, the glass wordmark with the ember "hi" (`public/email/hero.jpg`, rendered by the films' glass engine), Plus Jakarta Sans headlines, "What happens next" steps, a sand copy of the message, an ember button and the four divisions as photo cards (`public/email/*.jpg`; JPEG because Outlook shows no WebP). The old blue/red/yellow stripes and the "Intelligence, Unbound" line are gone.
- The quote portrait's name pill has no ember dot.
- **No "one team":** the owner felt it made HITROO sound small. Every "one team" line is rewritten (company summary, Software copy, FAQ, home and services headings, standards cards, structured data, llms.txt), and the HITROO film drops "All through one team." (v4: the reel wall holds through the music's peak instead). Database copy refreshed with `content:seed --force` (no admin edits existed).
- **Tab titles and site name in lowercase:** "hitroo — …" and "… | hitroo"; WebSite structured data `name: hitroo` (alternate "HITROO"). Favicons get new addresses (`?v=hi`) so browsers that remember the old rings icon fetch the "hi".
- **llms-full.txt** lists the five films with their transcripts. No credits line under the films or the Creatives video.

## 2026-10-25 — Page content and media in the database

### Deployed
- Live on www.hitroo.com, with the admin revamp on admin.hitroo.com. **Division subdomains:** software., automation., ai. and creatives.hitroo.com are on the site project and redirect (307) to their page on www (`next.config.js`, by host); any other path goes to the same path on www.
- **Fast media on the free plan:** uploaded images load from `/media/img/*` (a rewrite to Tigris, cached on Vercel's CDN for a year; requests with a `Range` header are passed through uncached so a partial response can never be stored as the image). The Creatives video streams from Tigris directly: on the first deploy the CDN had cached a 1 KB range of it and served that to everyone.
- Next.js 13.5.11 (patch release; the remaining advisories need a major upgrade).

### Changed
- **Content is edited in the admin, no deploy needed:** every marketing page's copy (except the legal pages, brand page and site map) now comes from `web.content` (migration 005), 22 keys from `company` to `division:ai` and `page:support`; images and the Creatives video come from object storage (Tigris bucket `hitroo-media`, each file a `web.media` row). The site reads them through `getContent()` (`lib/content.ts`), cached five minutes; `/api/revalidate` also accepts `{ "content": [keys] }` and refreshes every page showing them. Marketing pages are ISR (`revalidate = 300` in the `(warm)` layout).
- **Never blank:** without `DATABASE_URL`, when the database can't be read, when a key is missing or when its shape is wrong, pages use the built-in copy (the old data modules, now the defaults in `lib/content-defaults.ts`; each page's own lines moved to `lib/page-content.ts`). Checked with a build against an unreachable database: every content page matched the old site exactly.
- **Media:** `components/warm/Media.tsx` renders a `public/` file through next/image as before, and a storage file as a plain `<img srcset>` of pre-sized WebP (480/960/1600/2400 px, average colour while it loads, lazy unless it's the main image), so uploads never use Vercel's image transformations. The root layout preconnects to the bucket. Client islands (division cards, need picker, forms, hero) get their content as props, so no copy ships in JavaScript any more.
- **Scripts:** `npm run media:upload` (16 files → Tigris + `web.media`, idempotent by content hash, writes `db/seeds/media-map.json`) and `npm run content:seed` (built-in copy → `web.content` with history rows; `--force`, `--dry-run`). Both ran against the live database on 2026-10-25.
- Same look: before/after captures of all 30 routes at 1440 and 390 px have identical text, metadata, structured data (apart from media URLs), page heights and image boxes; pixels differ only inside photos (WebP from storage instead of AVIF). Tests for the fallback, the schemas and the revalidate body (50 in all).

## 2026-10-24 — One foundation, four divisions; the new look and logo

### Changed
- **Positioning:** HITROO is now one foundation with four divisions (never "wings" on the site): Software (our products, custom software, mobile and desktop apps, managed services), Automation (workflows and AI agents on HITROO's own automation platform), AI (custom and in-house models, private language models, vision systems) and the new Creatives (social media done for you, with results in the client's dashboard). New pages `/software`, `/automation`, `/ai`, `/creatives`; `/services` became "What we do"; each service belongs to a division.
- **Design (every page):** modelled on weichie.com's type, colour and layout. Warm paper page, Plus Jakarta Sans headlines, Fustat text, one ember accent, white and frosted-glass cards and one dark card per page; one background colour, equal cards in every row, no shadows or glows. Rules: [designs.md](designs.md).
- **Glass across the site:** the home hero is "hitroo" in live refractive glass (WebGL, the cursor ripples it). Every other page opens with its name in glass, and the numerals, "?" and "hi" are glass too. These are still images rendered at 2× (`public/glass/`, `/preview/glass-render`), so only the home hero runs WebGL.
- **Home:** the four divisions as large cards that slide sideways as you scroll, how we deliver, the founder, a need picker, recent articles, questions and the contact form.
- **Division pages,** built from a study of the best agencies per vertical: when to call us, what we build (a list with a glass detail panel), one workflow start to finish and who does what, the standards, the process, ways to engage, questions and the other divisions. Facts confirmed by the owner: clients own the code and models, no client data is retained, automation runs on HITROO's own platform, every engagement starts with a free call.
- **Logo:** the rings are gone. The logo is the wordmark "hitroo" with "hi" in Ember; the app icon and favicons are the "hi" on paper. New brand page, brand kit (wordmark, on-dark, glass wordmark, app icon, brand note), social card (`og-image.png`) and Organization logo.
- **Imagery:** no page photography. Post covers keep their database paths and render in warm monochrome on the site. Removed the page photos, the division renders and the home quote card (Jensen Huang) with its portrait.
- **Division images**, art-directed from references the owner chose: Creatives as a bold fashion campaign (ember wardrobe, cobalt sky, a glass prism), AI as light bent through fluted glass, Automation as twisted ribbons of fine ember lines drawn in code. They show on the home division cards, What we do, the other-division cards and in a gallery under each division page's opening (three panels swipe on phones). Briefs and tools: `docs/art/photos-briefs.md`, `scripts/art/`.
- **Division signatures:** HITROO.com stays the standard; each division adds its own look within the brand rules. Software, Automation and AI open on one large card with their image as the background (vine-wrapped glass code, ember ribbons, fluted glass) and AI and Software carry an image behind the standards' glass tiles. Creatives is rebuilt around reels after usefastlane.ai: a fan of reels in the opening, two drifting strips of formats, the monthly cycle as a loop with a marker running round it, the best performer and its variations, and a line that slides with the scroll. Eleven reel stills in one campaign series (`public/photos/reels/`).
- **Creatives showcase video:** "Thirty seconds. One myth, busted." A 32-second Vox-style explainer on the goldfish attention-span myth, made in-house with the rg video pipeline (ElevenLabs narration and sound effects, Epidemic music, illustrations made for the video), every claim checked against two dated sources. It replaces the reel library and the posts strip (owner, 2026-10-24: "not needed"; the opening fan and the winner reels stay): loads only when near the screen, plays muted while in view, pauses when it leaves, "Sound on" restarts it with sound, never autoplays for reduced motion; transcript, sources and credits on the page, and VideoObject structured data. Files in `public/video/` with fingerprinted URLs and a one-year cache.
- **Home:** Jensen Huang's quote ("AI is no longer a single breakthrough or application — it is essential infrastructure. Every company will use it.", NVIDIA, March 2026) replaces the founder block, with his licensed portrait and the photo credit; the founder block stays on About. **Creatives:** the library is cut to six styles (Vox-style explainers, faceless, ads, characters, trends, stop-motion; 155 reels), owner's call: "not too wide".
- **Fixes:** every glass page word re-rendered (the corner rounding had erased the crossbar of "e" and split "a"). Images load faster and fit Vercel's free plan: the Creatives library (251 files) is served as static, display-sized WebPs with fingerprinted URLs and a one-year cache, using none of the 5,000 monthly image transformations; the other ~90 images are cached for 30 days and pre-encoded after each deploy by the new `npm run warm-images`; every reel and post shows its own colour while it loads.
- **Creatives library:** 215 reels in nine styles (Vox-style explainers, faceless, product ads, characters, trends, stop-motion, podcast clips, local businesses, campaigns) and 36 posts, each reel with its own caption in one of a dozen trending caption looks; style pills switch the library, two long rows drift past, and the winner section shows trending variations with new hooks. The page frame stays HITROO; the colour lives in the content.
- **Copy rewritten to inspire:** every line in the voice set out in designs.md (a point, then the proof); the 24 h / 48 h support line became "the people who built it fix it". Home gained a manifesto that lights up on scroll, a sticky process story and a marquee; Support was rebuilt the same way.
- New header (hides on scroll down, returns as a frosted bar), footer with the big wordmark, forms, cookie banner, post pages, policy pages, site map and a glass "404". The skip link is back on every page.
- Removed the old theme's components (SiteHeader, SiteFooter, PageHero, CtaBand, FaqList, ProcessAccordion, the gradient and grain layers, the glass rings) and its fonts (Inter Tight, Chivo Mono). `robots.txt` disallows `/preview`.

## 2026-09-30 — Turnstile on

### Changed
- Cloudflare Turnstile now guards the enquiry and careers forms: widget "HITROO website forms" (`hitroo.com`, `www.hitroo.com`, Managed mode). `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set for Production on Vercel (secret marked sensitive, values in `_secrets/hitroo-web.env`), and production was redeployed. No code change. Why: from 29 September a script driving a real Chrome sent the home-page form every hour or two. It used fake names, one Latin word as the message, and real people's email addresses, and it got past the honeypot, the timing check and the per-IP limits, so the site emailed those people.
- Checked live: `/api/lead/config` serves the site key. An enquiry without a token, or with a forged one, gets a 400 and nothing is stored. Cloudflare accepts the secret, and a headless automated Chrome is shown the checkbox and fails it.

## 2026-09-28 — Home quote: Jensen Huang

### Changed
- The home quote card now shows Jensen Huang, founder and CEO of NVIDIA: "AI is no longer a single breakthrough or application — it is essential infrastructure. Every company will use it." (NVIDIA's GTC 2026 announcement, 3 March 2026), with a black-and-white portrait from Stanford, April 2026 (Wikimedia Commons, Anderseidesvik, CC BY-SA 4.0, credit shown). Chosen by the owner from three verified options. It replaces Sundar Pichai's "every employee in every organization can become a builder", which read as a case against hiring a software company.
- A dash in a quote never starts a line on phones.

## 2026-09-27 — New Software and Automation photos

### Changed
- "Why your business needs it": Software is now a long, bright open-plan office where every desk runs the same app, and Automation a bright metro platform with a driverless train gliding in (a parcel sorting hub tried first read as AI-made, so automation is now shown as movement in a real space, the way top firms picture services). Both match the AI card's straight-down-the-aisle look, so the three read as one series. They replace a stock-looking desk with a chart-filled monitor and two identical robot arms. Briefs are in `docs/art/photos-briefs.md`.

## 2026-09-26 — Clean under VS Code's TypeScript 6

### Fixed
- `tsconfig.json` no longer uses the deprecated `target: es5` (now `ES2017`); VS Code's bundled TypeScript 6 flagged it. Builds were unaffected: Next.js compiles with its own settings.
- The two secret checks (`/api/revalidate`, `/api/indexnow`) share one constant-time `sameSecret()` in `lib/secret.ts`, with tests; `types/css.d.ts` declares the global stylesheet import. No errors under TypeScript 5.2 or 6.0.

## 2026-09-26 — Home quote; founder on About

### Changed
- The home page quote is Sundar Pichai at Google Cloud Next (22 April 2026): "We’ve seen how every employee in every organization can become a builder." It sits on an ink card with his portrait (Wikimedia Commons, CC BY 4.0, credit shown) and links to Google's post. It replaced a first try with Marc Andreessen's 2011 "Software is eating the world.", which the owner found dated.
- Rohit's quote and small photo moved to the About page, after "What we believe".

### Decided
- Page images stay on Vercel's image optimization. Cloudinary's Free plan serves WebP or JPEG XL instead of AVIF, which measured 43–105% heavier on the home page, so it wasn't adopted; the test uploads were removed from the Cloudinary account.

## 2026-09-26 — Newsroom, brand kit, policy pages, SEO and a richer home

### SEO and answer engines
- FAQPage data everywhere it's honest: five questions on each service page (built from that service's own facts, shown as an open-in-place list), five on `/services`, and on any post with a `## Questions` section.
- RSS feed at `/feed.xml` (all posts), linked from every page's head. Article data now carries word count and topic; the Organization's founder has a name, role and photo.
- New posts: a trending blog post (Supabase data exposures and the AI-agent breach at Hugging Face, with a security checklist), an article on modernizing legacy software (from this week's Hacker News thread), the first news item (the new website), and five more blog posts scheduled daily at 09:00 IST through 1 October.

### Home
- A word from Rohit, the founder: the quote large, signed with a small round photo (`public/people/rohit.webp`).
- The Research story card has a new photo (a robot arm with a wrist camera in a lab at night).

### Added
- **Newsroom** at `/news` and `/news/[slug]`: company news written in the admin (a third post kind, `news`), a press contact, the standard "About HITROO" paragraph and a link to the brand kit. Each news item ends with that paragraph and the press email. Old `/news/<numeric id>` links still redirect to `/blog`.
- **Brand kit** at `/brand`: logo and mark downloads (SVG with the name as outlines, PNG, and a ZIP with a notes file), clear space and minimum size, colours with copyable hex and RGB, type, and don'ts.
- **Policy pages**: `/terms`, `/cookies` (lists all three stored items, including the consented session ID), `/accessibility`, `/security` with `/.well-known/security.txt`, and an HTML `/site-map`. All sit in the footer's legal row and the sitemap.
- **Careers**: a note on fake job offers.
- Menus: a Resources menu with Learn, Company (Newsroom, Brand kit) and Support; a Services mega menu grouped Build / AI / Run with a featured story. All menu and service icons are a Codex duotone set (`public/icons/`).
- Home: story cards (Our story, Our view on AI, Research) as cinematic full-bleed photos, and "Fast, by design" as six photo panels (`process-*.webp`).

### Changed
- The footer's navy strip with a reversed logo is gone; the footer ends with the © line and the legal links, with the blue-and-black logo at its top. The footer lists every company and policy page, and LinkedIn is the only social link.
- Inner pages sit closer under the header (their opener lost about 64 px of top space and no longer drops when its right column is taller); the home page keeps its spacing.
- One brand blue across menus and icons (no multi-colour groups).
- `/privacy` now names the consented session ID and links to the cookie policy (last updated 26 September 2026).

### Database
- Migration `004_news_posts.sql` widens `web.posts.kind` to `article`, `blog` and `news`. Apply it before the admin's News option is used.

### Admin (hitroo_admin_page)
- Posts can be News (form, list, validation); site paths, the refresh call and read analytics know `/news/…`.

## 2026-09-26 — Professional photos for "Why your business needs it"

### Changed
- The Software, Automation and AI photos on the home page are now clean, professional Codex photos (a bright office with the business app on a laptop and a monitor, robotic arms placing boxes on a conveyor, a data-centre aisle) instead of the gritty documentary set. Briefs and the new style line are in `docs/art/photos-briefs.md`.
- The Vision Systems service keeps its factory-inspection photo, now in its own file (`svc-vision.webp`).

## 2026-09-26 — Form rate limits; AI chat route removed

### Security
- The enquiry and careers forms limit each visitor again: 5 a minute and 20 an hour for enquiries, 3 and 10 for applications. The old limits were Netlify edge rules, which Vercel never ran.
- The acknowledgment email goes to each address at most once an hour and 30 an hour in all, so the forms can't be used to send HITROO emails to other people; team notifications stop at 60 an hour, and later submissions still show in the admin.
- Removed `/api/chat`: no page used it, it had no limit, and anyone could run the Groq model on HITROO's key. `GROQ_API_KEY` is removed from Vercel.
- Removed `netlify.toml`.

### Fixed
- The careers form now sends its Turnstile token with the `careers` action the API checks; with Turnstile on, every application would have been rejected.

## 2026-09-26 — Admin live at admin.hitroo.com

### Deployed
- The admin app runs on Vercel (project `hitroo_admin`) at https://admin.hitroo.com, with its own database role `admin_app` (`db/roles/admin_app.sql`).
- Migration 003 applied: the website's database role is now write-only. It adds form, analytics and consent rows, reads posts and marks emails sent, but can no longer read anyone's details.
- Environment variables: the admin's `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SITE_URL` and `REVALIDATE_SECRET`; the website gained the same `REVALIDATE_SECRET` and lost the unused `ADMIN_PASSWORD`. Values are kept in `_secrets/hitroo-db.env` and `_secrets/hitroo-admin.env`.
- Checked live: signing in works; the dashboard, leads, applications and posts load from production; the website's `/api/revalidate` accepts only the admin's key.

## 2026-09-25 — Admin moves to its own app; clicks and reading analytics

### Deployed (2026-09-26)
- Commit `3789408` is live on production. Migration 002 was applied to the production database first, on its own, so analytics never paused; migration 003 and the `admin_app` role are still to apply.
- The admin app is on GitHub (private repo `hitroo_admin`) but not on Vercel yet; until it is, leads and applications arrive by email only.
- Checked live: `/admin` is gone, `/api/revalidate` answers, and a labelled test page view and engagement event reached the database (deleted afterwards).

### Changed
- Folders: the website now lives in `Hitroo_internal_Apps/hitroo/hitroo_landing`, next to the new admin, `hitroo/hitroo_admin_page`. Later internal apps go in `hitroo/` too.
- The admin moved out of the website into its own Next.js 16 app, `hitroo_admin_page`: analytics, leads, applications and posts behind one owner password. The website no longer has `/admin` or `/api/admin/*`.
- The website's database role is now write-only (migration 003): it can add form, analytics and consent rows and read posts, but can no longer read leads, applications or analytics. The admin uses a new `admin_app` role (`db/roles/admin_app.sql`).
- The privacy policy now covers click, scroll and time-on-page analytics and the in-memory visit number.

### Added
- Analytics: clicks on links and buttons; engagement (visible time and scroll depth — article depth on posts); visits, grouped by a random visit id held only in the page's memory. New table `web.events`, new columns `page_views.visit_id` / `view_id` (migration 002).
- `/api/revalidate` (secret-protected), so post changes made in the admin appear on the site at once.
- Notes on leads and applications.
- Tests for the tracking helpers and payload schema (22 tests in total).

### Fixed
- Client navigation to and from posts logged "Failed to set referrer policy": Next 13.5 briefly wrote other tags' values into the referrer meta tag. The tag is gone; the stricter `Referrer-Policy` header now sets the policy.

### Removed
- `app/admin`, `app/api/admin/*`, the admin reads and writes in `lib/data/`, and the website's use of `ADMIN_PASSWORD`.

## 2026-09-25 — Live on Vercel

### Deployed
- Commit `70ecec0` is live on Vercel production at `www.hitroo.com` (`hitroo.com` redirects to it). `DATABASE_URL` is set for Production only.
- Checked on the live site: page titles, canonicals and JSON-LD; `/robots.txt`, `/sitemap.xml` (20 URLs), `/llms.txt`, the IndexNow key file; 308 redirects for the old URLs; security headers.
- Checked end to end with one labelled test enquiry: stored in `web.leads` with country, region and city from Vercel's edge, and Gmail accepted the notification (`emailed = true`). Page views and the consent choice were recorded, with visitor and session IDs only after consent. Test data is removed after checking.

### Fixed (deployed 2026-09-26 in `3789408`)
- Résumé uploads over about 3.3 MB failed on Vercel: functions reject request bodies over 4.5 MB (`413 FUNCTION_PAYLOAD_TOO_LARGE`), and the PDF travels base64-encoded inside JSON. The limit is now 3 MB in the form, the API and the docs.

## 2026-09-25 — Data platform, Insights, SEO/GEO (commit `70ecec0`)

### Infrastructure
- Destroyed the Fly.io app `decern-hitroo` (Singapore) at the owner's request, after backing up its 892 KB data volume to `Hitroo_internal_Apps/_backups/decern-data-backup-2026-09-25.tgz`. Its secrets (OpenRouter, RunPod, access codes) were not copied; regenerate them at their providers if needed.
- Created the shared Postgres cluster `hitroo-db` on Fly.io: Fly Postgres (flex) 18, `sin`, 1 GB RAM, 10 GB volume; public TLS endpoint `hitroo-db.fly.dev:5432` on a dedicated IPv4 ($2/month) with the `pg_tls` handler.
- Database `hitroo` with segments: schema `web` (website, role `web_app`, row access only) and schema `internal` (internal apps, owned by role `internal_app`). Credentials in `_secrets/hitroo-db.env`; the site gets only `DATABASE_URL`.
- Continuous backups to Tigris were not enabled (they need the owner to accept Tigris's terms); daily Fly volume snapshots apply.
- Vercel prepared as the host: `vercel.json` pins functions to `sin1`; `next/image` optimization enabled (AVIF/WebP).

### Added
- Migrations (`db/migrations/001_web_init.sql`) for leads, job applications, page views, consents and posts; `npm run db:migrate`, `npm run db:seed-posts`.
- Enquiries and job applications are stored in Postgres before email is sent; a failed email no longer loses a lead.
- First-party analytics (`/api/track`): anonymous page views by default, visitor/session IDs only with consent; no IP addresses stored.
- Professional cookie consent card (bottom-left; Accept and Decline side by side), "Cookie settings" and "Privacy" in the footer, `/privacy` policy page, `/api/consent` records choices.
- Insights: `/insights`, `/articles`, `/blog` and post pages (`/articles/[slug]`, `/blog/[slug]`) from `web.posts`, with ISR and on-demand refresh.
- New `/admin`: Insights (views, consented visitors, leads, applications, daily chart, top pages/countries/referrers/devices), Leads, Applications (resume download) and Posts (create, edit, publish, delete).
- SEO/GEO: per-page metadata with canonicals and hreflang; JSON-LD (Organization with service catalog, WebSite, WebPage types, Service, Article/BlogPosting, FAQPage, BreadcrumbList); dynamic `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`; IndexNow key and `npm run indexnow`; Search Console and Bing verification via env vars; security headers.
- "Insights" in the main menu; "Our view on AI" and "Insights" in the footer.
- Tests for visitor helpers (17 tests in total).
- `ARCHITECTURE.md`, this changelog.

### Changed
- Old JSON-CMS article `/articles/1766601625775` now redirects to `/articles/a-subtle-shift-a-big-impact`; `/news/*` redirects to `/blog`; `/llm.txt` to `/llms.txt`.
- Page titles no longer repeat the brand ("About us | HITROO"); service pages now get the `| HITROO` suffix.
- Email templates use the brand cobalt instead of the old Google colours.

### Fixed
- The root layout's canonical URL (`/`) was inherited by pages without their own — search engines were told those pages duplicated the home page. Canonicals are now per page.
- `robots.txt` gave AI crawlers their own groups without the `/admin` and `/api/` rules, so those paths were open to them. Every group now carries the rules.
- Client navigation briefly assigned wrong values to meta tags (Next 13.5 reuses head tags by position); every page now renders the same set of tags.

### Removed
- `/api/content` and the file-based CMS reader pages; `data/content.json` remains only as the seed for `npm run db:seed-posts`.
- Static `public/robots.txt`, `public/llms.txt` and `public/llm.txt` (now generated).

## 2026-09-25 — Corporate redesign

### Changed
- Whole site rebuilt in a minimal, white, enterprise style (Inter, cobalt and navy, no section tints, no divider lines, generous spacing) with business-first, very short copy.
- New logo (two linked rings, rising 10°) across the header, footer, favicons and social image; trademark screening via WIPO (see KT.md).
- Realistic Codex-generated photography for every page (`public/photos/`).
- Marketing pages moved into the `app/(site)` route group with one shared layout; pages are server components.
- Home: "Why HITROO" two-line statement, "Why your business needs it", services, process, support, who we work with, enquiry form.
- New pages: `/ai-perspective` ("Is AI a threat to HITROO?"), refreshed About, Research, Support, Careers, Contact and a 404 page.

### Removed
- Three earlier design experiments, the old Google-colour theme, `components/site`, Three.js components and dependencies (`npm install` no longer needs `--legacy-peer-deps`), about 47 MB of unused images, fonts and video, and the ContextJoin agent tooling.
