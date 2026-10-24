# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing site for HITROO — a software company building custom software, mobile and desktop apps, AI models, automation and vision systems. Next.js 13 App Router, TypeScript, Tailwind (+ shadcn/ui primitives). Hosted on **Vercel** (functions in `sin1`); data in the shared **Postgres on Fly.io** (`hitroo-db`), page images and video in **Tigris** object storage (bucket `hitroo-media`). Lives in `hitroo/hitroo_landing`; the admin (leads, applications, posts, page content and media, analytics) is a separate app, [`../hitroo_admin_page`](../hitroo_admin_page). See [ARCHITECTURE.md](ARCHITECTURE.md) for the full system, [KT.md](KT.md) for what's built and [CHANGELOG.md](CHANGELOG.md) for history — update all three when you change something significant.

## Commands

```bash
npm install        # plain install works (the old React-three peer conflict is gone)
npm run dev        # local dev server (localhost:3000)
npm run build      # production build
npm run start      # serve production build
npm run lint       # next lint (also ignored during builds, see below)
npm run typecheck  # tsc --noEmit — the type gate
npm test           # node:test suites in tests/ (request security, lead protection, visitor and tracking helpers, content fallback, revalidate)
npm run db:migrate     # apply db/migrations/*.sql (uses DATABASE_ADMIN_URL from .env.local)
npm run db:seed-posts  # import data/content.json posts into web.posts (idempotent)
npm run media:upload   # upload the editable images and the Creatives video to Tigris + web.media (idempotent by hash; writes db/seeds/media-map.json)
npm run content:seed   # write the built-in page content into web.content (keeps saved keys; `-- --force` overwrites, `-- --dry-run` checks)
npm run indexnow       # after a production deploy: push sitemap URLs to Bing & co.
npm run warm-images    # after a production deploy: pre-encode the images every page uses (AVIF is slow to encode first time)
```

Run `npm run typecheck`, `npm run lint` and `npm test` after changes.

ESLint is **disabled during builds** (`next.config.js` → `eslint.ignoreDuringBuilds: true`), so `npm run build` will not catch lint errors. Run `npm run lint` explicitly.

## Environment variables

Required for API routes to function (set in Vercel / `.env.local`, never committed):

- `REVALIDATE_SECRET` — shared with the admin app; lets it refresh post pages the moment a post changes (`/api/revalidate`)
- `GMAIL_USER`, `GMAIL_APP_PASSWORD` — Gmail SMTP (via `nodemailer`) for lead/careers emails
- `LEAD_EMAIL_RECIPIENT` — inbox that receives lead and job-application emails
- `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` — optional Cloudflare Turnstile
  pair for the contact and careers forms; set both or neither (see
  [docs/contact-form-protection.md](docs/contact-form-protection.md))
- `DATABASE_URL` — Postgres URL for the least-privilege `web_app` role (`…@hitroo-db.fly.dev:5432/hitroo?sslmode=verify-full`). Without it the site still renders with its built-in copy and local images; forms fall back to email only and Insights are empty.
- `DATABASE_ADMIN_URL` — **local only**, for migrations and the content/media scripts. Never set on Vercel.
- `NEXT_PUBLIC_SITE_URL` — canonical origin (default `https://www.hitroo.com`, the primary domain; `hitroo.com` redirects there); set for preview deployments.
- `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` — optional search-console verification tokens.

All database credentials live outside the repo in `Hitroo_internal_Apps/_secrets/hitroo-db.env`; the Tigris keys (only `npm run media:upload` needs them; the site reads public URLs) in `_secrets/hitroo-media.env`.

`.env.local` holds real SMTP and database credentials: a valid form submission sends real email and writes real rows. To test without emailing, run a server with `GMAIL_USER= GMAIL_APP_PASSWORD=` (it stores, skips email), or fill the hidden `website` honeypot (validated, then discarded). Delete test rows afterwards.

## Architecture

### Design system (2026-10-24: warm paper + clear glass)
Full rules in [designs.md](designs.md).
- **One background, symmetric cards, no shadows or glows.** Every page is warm paper; white cards, frosted `.glass-warm` cards and one dark `char` card per page sit on it. Cards in a row are equal size; an odd last card spans the row.
- **Tokens** in [tailwind.config.ts](tailwind.config.ts): `paper` #FCF8F6 (page), `char` #12110B (text, dark card), `ember` #F5502F (the "hi", accents, action circle), `sand` #F3EEE8, `stone` #6F6A61. shadcn CSS variables in [app/globals.css](app/globals.css) point at the same palette.
- **Type**: Plus Jakarta Sans for headlines and the wordmark (`font-display`/`font-jakarta`), Fustat for text (`font-body`, self-hosted) — [components/warm/fonts.ts](components/warm/fonts.ts), set on `<html>`/`<body>` in [app/layout.tsx](app/layout.tsx). Wrap headline strings in `<Tight>` (Jakarta's punctuation is wide).
- **Logo**: the wordmark "hitroo", lowercase, with "hi" in Ember ([components/brand/Wordmark.tsx](components/brand/Wordmark.tsx)); files in `public/brand/`, favicons are "hi" on paper; `/brand` shows the rules.
- **Glass**: each page opens with its name in clear glass (`GlassWord`); numerals, "?" and "hi" are glass too. Only the home hero runs live WebGL (`components/clear/GlassWordmark`); everything else is a still image in `public/glass/` rendered at 2× by `/preview/glass-render` (sizes in `components/warm/glass-sizes.ts`).
- **Copy**: professional and minimal — caption, heading, at most one line, one action per block; every section has a plain heading. Never "wings"; don't promote careers on marketing pages; never invent clients, products or numbers (confirmed facts are listed in [lib/division-pages.ts](lib/division-pages.ts)).
- **Imagery**: art-directed photography, made with Codex from references to the most creative players in each vertical (never their images); the owner reviews every image before it goes on the site. Editable images (division photos, people, the Creatives reels and video) are served from object storage once uploaded (see Content). Post covers always render in warm monochrome (`.duotone-warm`, SVG filter in `WarmShell`).

### Pages (App Router)
Marketing pages live in the route group `app/(warm)/` whose [layout](app/(warm)/layout.tsx) renders `WarmShell` (skip link, `WarmHeader`, `<main id="main">`, `WarmFooter`, `Analytics`, `CookieConsent`). Pages are **server components**; interactivity is isolated in client islands. Routes: `/`, `/software`, `/automation`, `/ai`, `/creatives` (divisions, one template `components/warm/DivisionPage`), `/services` ("What we do"), `/services/[slug]`, `/insights`, `/articles`, `/blog`, `/articles/[slug]`, `/blog/[slug]`, `/news`, `/news/[slug]`, `/ai-perspective`, `/about`, `/research`, `/support`, `/careers`, `/contact`, `/brand`, `/privacy`, `/cookies`, `/terms`, `/accessibility`, `/security`, `/site-map` (plus `public/.well-known/security.txt` and `app/feed.xml`). [app/not-found.tsx](app/not-found.tsx) uses `WarmShell` too. `app/preview/glass-render` (glass stills) and `app/preview/og` (the social card, `public/og-image.png`) are internal tools (robots-disallowed). Metadata comes from `pageMetadata()` in [lib/seo.ts](lib/seo.ts) (per-page canonical — never set one in the root layout) and JSON-LD from the builders there. Discovery: [app/sitemap.ts](app/sitemap.ts), [app/robots.ts](app/robots.ts), `app/llms.txt` and `app/llms-full.txt`.

### Components
- [components/warm/](components/warm/) — the site: `ui.tsx` (`WContainer`, `Caption`, `H_*`/`P`/`CARD` classes, `Tight`, `WSection`, `Statement`, `PointCards`, `LinkCards`), `blocks.tsx` (`StandardsCard`, `Engagements`, `FlowCard`, `SplitCards`), `PageIntro`, `Glass`/`GlassWord`, `StepCards`, `CapabilityExplorer`, `DivisionPage`, `DivisionsScroller` + `GlassNumeral` (home), `Media` (any content image: next/image for `public/` files, plain `<img srcset>` for storage files), `WarmHero`, `OtherDivisions`, `FaqSection`, `ContactPanel`, `FounderBlock`, `RecentPosts`, `PostGrid`, `PostPage`, `ClosingCta`, `NeedPicker`, `LocalTime`, `ColorSwatch`, `WarmHeader` (+ `TouchPill`), `WarmFooter`, `WarmShell`.
- [components/corporate/](components/corporate/) — client islands and shared pieces: `LeadForm` (→ `/api/lead`; "Interested in" grouped by division), `CareersForm`, `Analytics`, `CookieConsent` + `CookieSettingsLink`, `Turnstile`, `PostBody`, `CoverImage`, `LegalSections`, form classes in `form.ts`.
- [components/clear/](components/clear/) — the WebGL glass engine: `GlassWordmark`, `gl.ts`, `field.ts`.

### Content (Postgres, edited in the admin)
Page copy and editable media live in `web.content` (migration 005): one JSON row per key, edited in the admin app, every save kept in `web.content_history`. Keys (never rename one; the admin depends on them): `company`, `home`, `quote`, `founder`, `divisions`, `showcase`, `services`, `audience`, `engagements`, `promises`, `steps`, `faq:general`, `division:software|automation|ai|creatives`, `page:creatives|about|support|contact|careers`, `video:creatives` (list and rules in [lib/content-core.ts](lib/content-core.ts)). Legal pages, the brand page, the site map and glass/brand assets stay in code.
- Read with `getContent(key)` ([lib/content.ts](lib/content.ts)) in server components only; pass the data to client islands as props. Reads are cached 5 minutes (tags `content`, `content:<key>`); the admin posts `{ "content": [keys] }` to `/api/revalidate`, which refreshes the pages showing them ([lib/revalidate.ts](lib/revalidate.ts)). Every marketing page is ISR (`revalidate = 300` in the `(warm)` layout).
- **Fallback:** without `DATABASE_URL`, when the query fails (then the database is skipped for 30 s), when the row is missing or when it fails its schema ([lib/content-schema.ts](lib/content-schema.ts)), a page uses the built-in copy. Nothing ever goes blank.
- **Built-in copy** = the defaults: [lib/site-data.ts](lib/site-data.ts) (company, divisions, showcase, services, shared blocks, quote, founder), [lib/division-pages.ts](lib/division-pages.ts), [lib/page-content.ts](lib/page-content.ts) (each page's own lines), [lib/creatives-video.ts](lib/creatives-video.ts), assembled per key in [lib/content-defaults.ts](lib/content-defaults.ts). Plain JSON only. Change a shape in the type, its schema and the default together (tests check every default against its schema). Once a key is in the database the database wins: a code edit to copy reaches the site through the admin or `npm run content:seed -- --force`.
- **Media slots:** any object with a string `src` — images `{ src, alt, width?, height?, tone?, variants?: [{ w, url }], position? }` (`tone` is the average colour; a division hero's text colour is `theme`), videos `{ src, poster, width, height }`. Local `/…` files go through next/image as before; storage files (`https://hitroo-media.fly.storage.tigris.dev/img/<sha8>-<slug>-<w>.webp`, WebP at 480/960/1600/2400 px, cached a year) render as plain `<img srcset>` and never use Vercel's image optimizer. Uploads are `web.media` rows.
- Questions: [lib/faq.ts](lib/faq.ts) (service pages build theirs from the service's facts).

### Data (Postgres on Fly.io)
[lib/db.ts](lib/db.ts) is a small `pg` pool on `DATABASE_URL` (role `web_app`, schema `web`); data access lives in [lib/data/](lib/data/) (`posts`, `forms`, `analytics`). Tables: `leads`, `job_applications`, `page_views`, `events`, `consents`, `posts`, `content`, `content_history`, `media` — see [db/migrations/](db/migrations/) and [ARCHITECTURE.md](ARCHITECTURE.md). The site's role is **write-only** except for posts, content and media: it can add form and analytics rows and read posts, content and media, but cannot read leads, applications or analytics back (migration 003) and never writes content (migration 005). Posts (articles, blog and news — news since migration 004) are managed in the admin app and served with ISR (5 minutes; admin edits refresh immediately through `/api/revalidate`). This repo's `db/` folder is the home of the shared database's schema (bootstrap, roles, migrations) for every HITROO app. `data/content.json` is only the seed for `npm run db:seed-posts`. The site never runs DDL; schema changes go in a new migration file.

### API routes (`app/api/*/route.ts`)
- `lead` — per-visitor rate limit (5/min, 20/h), strict schema, same-origin, honeypot, timing, optional Turnstile → stores in `web.leads`, then emails (a failed email still returns success once stored). The acknowledgment goes to each address at most once an hour (30/h in all); team emails stop at 60/h, and the admin still shows everything. Requires phone OR email.
- `careers` — same protections (3/min, 10/h per visitor); verified PDF resume up to 3 MB → `web.job_applications` (resume included), then email with attachment.
- `track` — first-party page views, clicks and engagement (visible time, scroll/read depth); bot filter, rate limit, no IPs; a random in-memory visit ID groups one visit's pages; visitor/session IDs only with consent.
- `consent` — records cookie decisions.
- `revalidate` — refreshes post listings and pages (`paths`) and content keys (`content`: tag `content:<key>` plus every page showing it; a shared key such as `company` refreshes every page); `x-revalidate-secret` header (constant-time compare, failed-attempt rate limit). Called by the admin app.
- `indexnow` — Vercel Cron, daily 09:10 IST (`vercel.json`): submits posts that went live in the last day (scheduled posts appear at 09:00) to IndexNow. Needs `CRON_SECRET` (Vercel sends it as a bearer token); the value is in `_secrets/hitroo-web.env`.

### UI conventions
- Import aliases (tsconfig `@/*` → repo root): `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.
- `cn()` from [lib/utils.ts](lib/utils.ts) (clsx + tailwind-merge) is the standard class-composition helper.
- shadcn/ui primitives in [components/ui/](components/ui/) are generated — don't hand-edit unless intentional. Config in [components.json](components.json).

## Deployment

Vercel: `vercel.json` pins functions to `sin1` (next to the database). Set the env vars listed in [ARCHITECTURE.md](ARCHITECTURE.md#vercel-environment-variables); run `npm run indexnow` and `npm run warm-images` after production deploys. Encoded images are cached for 30 days (`minimumCacheTTL`): glass images carry a content fingerprint in their URL; replace any other image under a new file name. Storage images (from the admin or `npm run media:upload`) need no warming and use no transformations. Live at www.hitroo.com since 2026-09-25; pushing to `main` deploys to production. `@netlify/plugin-nextjs` is an unused leftover from the Netlify days. Vercel never ran the old `netlify.toml` rate limits, so every limit lives in code ([docs/contact-form-protection.md](docs/contact-form-protection.md)).
