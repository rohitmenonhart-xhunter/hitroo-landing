# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing site for HITROO — a software company building custom software, mobile and desktop apps, AI models, automation and vision systems. Next.js 13 App Router, TypeScript, Tailwind (+ shadcn/ui primitives). Hosted on **Vercel** (functions in `sin1`); data in the shared **Postgres on Fly.io** (`hitroo-db`). Lives in `hitroo/hitroo_landing`; the admin (leads, applications, posts, analytics) is a separate app, [`../hitroo_admin_page`](../hitroo_admin_page). See [ARCHITECTURE.md](ARCHITECTURE.md) for the full system, [KT.md](KT.md) for what's built and [CHANGELOG.md](CHANGELOG.md) for history — update all three when you change something significant.

## Commands

```bash
npm install        # plain install works (the old React-three peer conflict is gone)
npm run dev        # local dev server (localhost:3000)
npm run build      # production build
npm run start      # serve production build
npm run lint       # next lint (also ignored during builds, see below)
npm run typecheck  # tsc --noEmit — the type gate
npm test           # node:test suites in tests/ (request security, lead protection, visitor and tracking helpers)
npm run db:migrate     # apply db/migrations/*.sql (uses DATABASE_ADMIN_URL from .env.local)
npm run db:seed-posts  # import data/content.json posts into web.posts (idempotent)
npm run indexnow       # after a production deploy: push sitemap URLs to Bing & co.
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
- `DATABASE_URL` — Postgres URL for the least-privilege `web_app` role (`…@hitroo-db.fly.dev:5432/hitroo?sslmode=verify-full`). Without it the site still renders; forms fall back to email only and Insights are empty.
- `DATABASE_ADMIN_URL` — **local only**, for migrations. Never set on Vercel.
- `NEXT_PUBLIC_SITE_URL` — canonical origin (default `https://www.hitroo.com`, the primary domain; `hitroo.com` redirects there); set for preview deployments.
- `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` — optional search-console verification tokens.

All database credentials live outside the repo in `Hitroo_internal_Apps/_secrets/hitroo-db.env`.

`.env.local` holds real SMTP and database credentials: a valid form submission sends real email and writes real rows. To test without emailing, run a server with `GMAIL_USER= GMAIL_APP_PASSWORD=` (it stores, skips email), or fill the hidden `website` honeypot (validated, then discarded). Delete test rows afterwards.

## Architecture

### Design system (corporate white)
- **White everywhere, no divider lines** — no tinted section backgrounds and no hairlines between sections, list items or grid cells; generous whitespace does the separating (`Section` = `py-24 sm:py-32 lg:py-40`, `Statement`/`CtaBand` larger). `line` is only for form-field borders; `mist` only for image placeholders.
- **Tokens** in [tailwind.config.ts](tailwind.config.ts): `ink` #0A1633 (text), `cobalt` #2451FF (+ `dark`, `soft`; links, buttons), `navy` #0A1B4A, `mist` #F4F6FA, `line` #E3E7EE. shadcn CSS variables in [app/globals.css](app/globals.css) are re-pointed to the same palette.
- **Type**: Inter via `next/font` ([components/corporate/fonts.ts](components/corporate/fonts.ts)), applied on `<html>`/`<body>` in [app/layout.tsx](app/layout.tsx) as `font-corp`. Large light (300) headlines with tight tracking and `text-wrap: balance`.
- **Logo**: two linked rings (cobalt + navy, rising 10°) — exact arc paths in [components/brand/Logo.tsx](components/brand/Logo.tsx), also `public/brand/hitroo-mark(-light).svg`, `public/favicon.svg` (switches colours in dark mode) and the PNG/ICO favicon set. Always shown with the HITROO name except as favicon/app icon; keep the rings open and never red/yellow/orange (trademark distance from Mastercard-style marks).
- **Copy**: very minimal and business-first — one-line ledes, two-line statements, short labels (`service.label`), one CTA per block. Don't promote careers on marketing pages.
- **Imagery**: realistic, professional corporate-style photos generated with Codex (clean, bright, modern: the "Professional photo set" style line in [docs/art/photos-briefs.md](docs/art/photos-briefs.md)), in `public/photos/*.webp`. No people, no readable text, no brand-colour grading.

### Pages (App Router)
Marketing pages live in the route group `app/(site)/` whose [layout](app/(site)/layout.tsx) renders the shared Header + `<main id="main">` + Footer once. Pages are **server components**; interactivity is isolated in client islands. Routes: `/`, `/services`, `/services/[slug]`, `/insights`, `/articles`, `/blog`, `/articles/[slug]`, `/blog/[slug]`, `/ai-perspective`, `/about`, `/research`, `/support`, `/careers`, `/contact`, `/privacy`. The group layout also mounts `Analytics` (first-party page views, clicks and reading) and `CookieConsent`. There is no admin here any more; [app/not-found.tsx](app/not-found.tsx) renders its own Header/Footer. Metadata comes from `pageMetadata()` in [lib/seo.ts](lib/seo.ts) (per-page canonical — never set one in the root layout) and JSON-LD from the builders there, rendered with `components/seo/JsonLd`. Discovery: [app/sitemap.ts](app/sitemap.ts), [app/robots.ts](app/robots.ts), `app/llms.txt` and `app/llms-full.txt` (generated from site data and posts).

### Components ([components/corporate/](components/corporate/))
- `ui.tsx` — `Container`, `Button` (pill, arrow), `ArrowLink`, `Eyebrow`, `SectionHeader`, `Section`, `Statement` (large 1–2 line statement).
- `PageHero`, `CtaBand`, `ServiceGrid` (open grid of service icons + short names), `ContactBlock`.
- `Header` (server; builds the services mega menu) + `HeaderShell` (client; sticky white header, mega menu, mobile panel, active link), `Footer`, `Wordmark`.
- Client islands: `LeadForm` (→ `/api/lead`), `CareersForm` (→ `/api/careers`), `Analytics` (→ `/api/track`), `CookieConsent` + `CookieSettingsLink` (→ `/api/consent`), `Turnstile`. Shared form classes in `form.ts`.
- Insights: `PostList`, `PostPage` (article/blog page + JSON-LD), `PostBody` (safe markdown-lite renderer), `CoverImage`.

### Content data ([lib/site-data.ts](lib/site-data.ts))
Single source of truth: `services` (title, short `label`, `short`, `pain`, icon, photo, `overview` for metadata, approach/capabilities/outcomes/stack), `COMPANY`, and home/support content (`WHY_HITROO_STATEMENT`, `WHY_NEED`, `PROCESS`, `AUDIENCE`, `SUPPORT`). Edit content here, not in page components.

### Data (Postgres on Fly.io)
[lib/db.ts](lib/db.ts) is a small `pg` pool on `DATABASE_URL` (role `web_app`, schema `web`); data access lives in [lib/data/](lib/data/) (`posts`, `forms`, `analytics`). Tables: `leads`, `job_applications`, `page_views`, `events`, `consents`, `posts` — see [db/migrations/](db/migrations/) and [ARCHITECTURE.md](ARCHITECTURE.md). The site's role is **write-only** except for posts: it can add form and analytics rows and read posts, but cannot read leads, applications or analytics back (migration 003). Posts (articles and blog) are managed in the admin app and served with ISR (5 minutes; admin edits refresh immediately through `/api/revalidate`). This repo's `db/` folder is the home of the shared database's schema (bootstrap, roles, migrations) for every HITROO app. `data/content.json` is only the seed for `npm run db:seed-posts`. The site never runs DDL; schema changes go in a new migration file.

### API routes (`app/api/*/route.ts`)
- `lead` — per-visitor rate limit (5/min, 20/h), strict schema, same-origin, honeypot, timing, optional Turnstile → stores in `web.leads`, then emails (a failed email still returns success once stored). The acknowledgment goes to each address at most once an hour (30/h in all); team emails stop at 60/h, and the admin still shows everything. Requires phone OR email.
- `careers` — same protections (3/min, 10/h per visitor); verified PDF resume up to 3 MB → `web.job_applications` (resume included), then email with attachment.
- `track` — first-party page views, clicks and engagement (visible time, scroll/read depth); bot filter, rate limit, no IPs; a random in-memory visit ID groups one visit's pages; visitor/session IDs only with consent.
- `consent` — records cookie decisions.
- `revalidate` — refreshes post listings and pages; `x-revalidate-secret` header (constant-time compare, failed-attempt rate limit). Called by the admin app.

### UI conventions
- Import aliases (tsconfig `@/*` → repo root): `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.
- `cn()` from [lib/utils.ts](lib/utils.ts) (clsx + tailwind-merge) is the standard class-composition helper.
- shadcn/ui primitives in [components/ui/](components/ui/) are generated — don't hand-edit unless intentional. Config in [components.json](components.json).

## Deployment

Vercel: `vercel.json` pins functions to `sin1` (next to the database). Set the env vars listed in [ARCHITECTURE.md](ARCHITECTURE.md#vercel-environment-variables); run `npm run indexnow` after production deploys. Live at www.hitroo.com since 2026-09-25; pushing to `main` deploys to production. `@netlify/plugin-nextjs` is an unused leftover from the Netlify days. Vercel never ran the old `netlify.toml` rate limits, so every limit lives in code ([docs/contact-form-protection.md](docs/contact-form-protection.md)).
