# HITROO Website — Knowledge Transfer (KT)

Living record of **what we have built**. Update it at the end of every working session. Pairs with [ARCHITECTURE.md](ARCHITECTURE.md) (how it fits together), [CHANGELOG.md](CHANGELOG.md) (what changed) and [designs.md](designs.md) (the design language).

## What HITROO is
A software company (headquartered in Chennai, India; clients worldwide). It builds **custom software, mobile apps, desktop apps, AI models (custom training and in-house models), AI automation, vision systems and managed services**, and supports clients after launch through the HITROO app (24h first response, 48h typical resolution). Contact: info@hitroo.com · +91 7550000805.

## Stack & ops
- **Next.js 13 App Router**, TypeScript, Tailwind; shadcn/ui primitives remain available. Marketing pages are **server components** with small client islands.
- **Hosting:** Vercel (functions in `sin1`, see `vercel.json`); `next/image` optimization on. `netlify.toml` remains only until DNS moves off Netlify.
- **Database:** shared Postgres on Fly.io, app `hitroo-db` (PostgreSQL 18, region `sin`, public TLS endpoint `hitroo-db.fly.dev:5432`). Database `hitroo`: schema `web` for this site (role `web_app`), schema `internal` for internal apps (role `internal_app`). Credentials: `Hitroo_internal_Apps/_secrets/hitroo-db.env`. Details: [ARCHITECTURE.md](ARCHITECTURE.md).
- **Commands:** `npm install` (no flags), `npm run typecheck`, `npm run lint`, `npm test` (17 node:test tests), `npm run db:migrate`, `npm run db:seed-posts`, `npm run indexnow` (after production deploys).
- **Forms:** `LeadForm` → `/api/lead`, `CareersForm` → `/api/careers`. Both store to Postgres first, then email; honeypot, timing and optional Turnstile. `.env.local` has real SMTP credentials — test with `GMAIL_USER= GMAIL_APP_PASSWORD= npx next start` (stores without emailing) or via the honeypot (validated, then discarded), and delete test rows afterwards.

## Site structure
- `app/(site)/layout.tsx` renders Header + `<main id="main">` + Footer + Analytics + CookieConsent for every marketing page; `/admin` sits outside it.
- `/` Home: hero (photo) → "Why HITROO" two-line statement (+ link to our AI view) → "Why your business needs it" (Software / Automation / AI) → "What we build" → "Fast, by design" → "Support in one app" → "Who we work with" → enquiry form.
- `/services` (photo cards) and `/services/[slug]` (hero photo → the problem → what you get → how we work + results → other services → CTA).
- `/insights` (latest articles and blog posts), `/articles`, `/blog`, `/articles/[slug]`, `/blog/[slug]` — content from `web.posts`, managed in `/admin`.
- `/about`, `/research`, `/support`, `/careers` (role picker + application), `/contact` (details + form), `/ai-perspective` ("Is AI a threat to HITROO?"), `/privacy`, `app/not-found.tsx`.
- `/admin` (noindex): Insights, Leads, Applications (resume download), Posts.
- API: `/api/lead`, `/api/careers`, `/api/track`, `/api/consent`, `/api/admin/*`, `/api/chat` (no UI).
- Discovery: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, IndexNow key file in `public/`.

## Data we collect
- Enquiries and job applications (with resumes) in `web.leads` / `web.job_applications`.
- Page views in `web.page_views`: anonymous by default (path, referrer host, UTM, country/region/city from Vercel's edge, device/browser/OS, language); visitor and session IDs only after cookie consent. No IP addresses are stored.
- Cookie decisions in `web.consents` (policy version `2026-09`). The policy text is `/privacy` — have it reviewed by a lawyer before launch (it commits to 24-month analytics retention and 30-day responses to data requests).

## Key decisions
- **Theme:** corporate white — no coloured section bands and no divider lines (whitespace only), Inter, cobalt/navy accents. Replaced the Google-colour + SF Pro theme (SF Pro isn't licensed for web use).
- **Copy:** minimal and business-first; "Why HITROO" is one two-line statement, not a list of reasons. No careers promotion on the home page; no "Chennai" in marketing copy.
- **Logo:** linked rings, chosen from eight options. Trademark screening (WIPO Global Brand Database): no registered brand containing "HITROO"; two linked rings is a crowded motif, and the nearest marks in India classes 9/42 are Mastercard's interlocking-circles family. Keep the rings open, blue/navy only, and paired with the name. **Before public launch:** get an Indian trademark attorney's clearance and file "HITROO" (word) and the logo in classes 9 and 42; use ™ until registered.
- **Database:** unmanaged Fly Postgres (we own backups and upgrades) reusing the slot of the destroyed `decern-hitroo` server; public TLS endpoint so Vercel can reach it; least-privilege roles per consumer.
- **Analytics:** first-party and privacy-first (no Google Analytics, no third-party cookies).
- **Products removed** earlier (Capsona, Attyn, Belecure, Mockello, AI Marketing Agent) — don't reintroduce.
- **Photos:** realistic Codex photos only (glossy 3D sets and staged "notebook diagram" shots looked fake).

## Assets
- `public/photos/` — realistic WebP photos (hero, why-*, svc-*, audience, support, research, about, ai-view). Briefs: `docs/art/photos-briefs.md`.
- `public/brand/` — logo SVGs; `public/favicon.svg` + `public/favicon/*` + `public/favicon.ico` — rings favicon set.
- `public/og-image.png` — 1200×675 social card; `public/new_logo/logo_whitebg.png` — square logo for the Organization JSON-LD.

## SEO / GEO
- `pageMetadata()` in `lib/seo.ts` gives every page a title, description, canonical, hreflang and social tags; JSON-LD per page type (see ARCHITECTURE.md).
- No canonical in the root layout (it would be inherited by every page).
- Every page renders the same set of meta tags — only pass `keywords` when a page needs its own.
- `llms.txt` / `llms-full.txt` are generated from `lib/site-data.ts` and the latest posts; keep facts there current.

## ⚠️ Gotchas
- A section `layout.tsx` must render `{children}` — re-exporting the page as the layout swallows the page.
- A layout that sets a plain-string `title` stops the root title template for pages below it — put metadata in the page instead (see `/services`).
- `permanentRedirect()` inside ISR pages caches a 308 with no Location in Next 13.5 — use `next.config.js` redirects.
- `revalidatePath` refreshes pages but not route handlers (sitemap, llms.txt) in Next 13.5 — those use a 10-minute `revalidate`.
- Sticky headers show up mid-page in Playwright full-page screenshots; check sections with viewport screenshots instead.

## Open / next
- Deploy to Vercel and set the env vars (ARCHITECTURE.md → Vercel environment variables), then move DNS, verify Google Search Console and Bing Webmaster Tools, submit the sitemap and run `npm run indexnow`.
- Enable continuous database backups (Tigris) or a scheduled `pg_dump`.
- Publish regularly to `/blog` and `/articles` (the Blog is empty; Articles has one post).
- Real proof: 2–3 client stories, logos (with permission) and a testimonial — add after "Why HITROO" once provided.
- `/terms` page; legal review of `/privacy`.
- `@supabase/supabase-js` is installed but unused.
