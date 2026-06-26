# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Marketing landing site for HITROO ("Intelligence, Unbound" — an AI/robotics/automation company). Next.js 13 App Router, TypeScript, Tailwind + shadcn/ui. Deployed on Netlify (`@netlify/plugin-nextjs`). Despite the Netlify config, `images.unoptimized` and `output` are tuned for static-friendly hosting.

## Commands

```bash
npm run dev        # local dev server (localhost:3000)
npm run build      # production build
npm run start      # serve production build
npm run lint       # next lint (note: also ignored during builds, see below)
npm run typecheck  # tsc --noEmit — the real type gate
```

There is no test suite. `npm run typecheck` is the only automated correctness check — run it after changes.

ESLint is **disabled during builds** (`next.config.js` → `eslint.ignoreDuringBuilds: true`), so `npm run build` will not catch lint errors. Run `npm run lint` explicitly.

## Environment variables

Required for API routes to function (set in Netlify env / `.env`, never committed):

- `GROQ_API_KEY` — Groq API for the AI chat ([app/api/chat/route.ts](app/api/chat/route.ts), model `openai/gpt-oss-120b`)
- `ADMIN_PASSWORD` — gates content mutations in [app/api/content/route.ts](app/api/content/route.ts)
- `GMAIL_USER`, `GMAIL_APP_PASSWORD` — Gmail SMTP (via `nodemailer`) for lead/careers emails
- `LEAD_EMAIL_RECIPIENT` — inbox that receives lead and job-application emails

## Architecture

### Design system
White-primary theme using Google's four brand colors (`#4285F4` blue, `#EA4335` red, `#FBBC05` yellow, `#34A853` green) with **SF Pro Display** (self-hosted from [public/fonts/sf-pro-display/](public/fonts/sf-pro-display/) via `@font-face`). Tokens and reusable helpers live in [app/globals.css](app/globals.css): `.text-brand` (4-color gradient text), `.brand-bar-smooth`, `.card-soft`, `.glass`, `.btn-primary`, `.eyebrow`, `.bg-dots`/`.bg-grid`, `.icon-chip`, plus float/sheen/rise animations. The white theme is wired through `--primary` etc. so shadcn UI primitives recolor automatically.

### Pages (App Router, `app/`)
All page components are client components (`'use client'`). Marketing routes share [components/site/Nav.tsx](components/site/Nav.tsx) (scroll-aware, active-link, mobile menu) and [components/site/Footer.tsx](components/site/Footer.tsx). Routes: `/` (landing with the AI assistant), `/services` + dynamic `/services/[slug]`, `/products` + dynamic `/products/[slug]`, `/about`, `/careers`, `/contact`, `/admin`, plus dynamic `/articles/[id]` and `/news/[id]`. Some routes have a sibling `layout.tsx` for per-route `metadata`; the root [app/layout.tsx](app/layout.tsx) holds global SEO/OpenGraph and the SF Pro body font. [app/sitemap.ts](app/sitemap.ts) derives its entries from the data file; `baseUrl` is hardcoded to `https://hitroo.com`.

### Services & products data ([lib/site-data.ts](lib/site-data.ts))
Single source of truth for the six service disciplines (software, app, desktop, AI models, AI automation, robotics) and the in-house products (Capsona, Attyn, Belecure, Mockello, AI Marketing Agent). The hub pages, dynamic `[slug]` detail pages, home page, footer, and sitemap all read from it — edit content here, not in the page components. Each entry carries its lucide `icon`, brand `color`, and feature list.

### Content system (file-backed CMS)
Articles and news are stored in [data/content.json](data/content.json) (NOT a database). [app/api/content/route.ts](app/api/content/route.ts) reads/writes this file with `fs`:
- `GET` is public — returns all content.
- `POST`/`DELETE` require `password === ADMIN_PASSWORD` in the request body.

The [/admin](app/admin/page.tsx) page is the editor UI; article/news detail pages fetch `/api/content` client-side and filter by `id`. **Caveat:** writing to a JSON file at runtime does not persist on most serverless/static hosts (Netlify) — content added via `/admin` in production is ephemeral. Treat `content.json` as the source of truth and commit changes for permanence.

### API routes (`app/api/*/route.ts`)
- `chat` — proxies to Groq; `detectIntent()` keyword-matches the message to decide whether to surface a lead-capture prompt. System prompt with HITROO product context is inline in the route.
- `lead` — sends a lead/early-access email via Gmail SMTP. Requires phone OR email.
- `careers` — job application email; accepts a base64-encoded PDF resume as a `nodemailer` attachment.
- `content` — see content system above.

### UI conventions
- shadcn/ui ("default" style, neutral base) in [components/ui/](components/ui/) — generated primitives, don't hand-edit unless intentional. Config in [components.json](components.json).
- Import aliases (tsconfig `@/*` → repo root): `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.
- `cn()` from [lib/utils.ts](lib/utils.ts) (clsx + tailwind-merge) is the standard class-composition helper.
- Theming via CSS variables / HSL tokens in [app/globals.css](app/globals.css), wired through [tailwind.config.ts](tailwind.config.ts). Dark mode is class-based.
- [components/LaserFlow.tsx](components/LaserFlow.tsx) and [components/FluidGlass.tsx](components/FluidGlass.tsx) (Three.js / `@react-three/fiber` + `drei`) are **no longer used** after the redesign. They — and the `three`/`@react-three/*` deps — can be removed; doing so also resolves the React 18 vs `drei`-React-19 peer conflict that currently forces `npm install --legacy-peer-deps`.
- The landing page plays a one-time intro video gated by `sessionStorage` key `hitroo-intro-seen`.

## Deployment

Netlify ([netlify.toml](netlify.toml)): `npx next build`, publish `.next`, `@netlify/plugin-nextjs`. Images are unoptimized (`next.config.js`) so `next/image` works without an optimization backend.
