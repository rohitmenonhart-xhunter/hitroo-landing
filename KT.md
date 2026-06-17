# HITROO Website — Knowledge Transfer (KT)

Living record of **what we have built**. Update this at the end of every working session. Pairs with [designs.md](designs.md) (the design language).

## What HITROO is
A Chennai-based technology studio. It builds **custom software, mobile apps, desktop apps, AI models (incl. custom training & in-house models), AI automation, software/process audits + AI modernization, and managed/custom services** — and runs active R&D. Clients get ongoing support through the **HITROO app** (cross-platform: iOS/Android/Windows/macOS) with a 24h first-response / 48h typical-resolution SLA. Tagline: *Intelligence, Unbound.*

## Stack & ops
- **Next.js 13 App Router**, TypeScript, Tailwind, shadcn/ui primitives. All page components are `'use client'`.
- Deploy: Netlify (`@netlify/plugin-nextjs`), `images.unoptimized: true`.
- Build: `npm run build`. Type gate: `npm run typecheck`. **Install needs `--legacy-peer-deps`** (React 18 vs an unused `@react-three/*` peer wanting React 19).
- Contact = info@hitroo.com · +91 7550000805 (in `lib/site-data.ts` COMPANY + JSON-LD).
- **Messaging:** the Contact form and Careers form POST to `/api/lead` and `/api/careers`, which email via Gmail/Workspace SMTP (nodemailer). `/api/lead` sends TWO emails: (1) a notification to `LEAD_EMAIL_RECIPIENT` (default `info@hitroo.com`, `replyTo` = sender) and (2) a branded acknowledgment to the visitor's email (best-effort). Env: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (Google App Password), `LEAD_EMAIL_RECIPIENT`. Configured locally in `.env.local` (gitignored, info@hitroo.com Workspace) and verified end-to-end (POST → 200, real send). **Action:** set the same three vars in Netlify env for production. See `.env.example`.
- Other env: `ADMIN_PASSWORD` (/admin), `GROQ_API_KEY` (legacy chat, unused by UI).

## Site structure (current) — ALL pages now use the homepage design language
- `/` Home — box-free editorial: Hero (bg.png) → Positioning → Services (list) → AI (image) → HITROO app/support (`#support`, phone mock) → How we work (image + numbered) → Quality & Security (image) → Research (`#research`, image) → Who we serve → Why HITROO → CTA → Footer.
- `/services` hub (image + editorial list) + `/services/[slug]` — one **storytelling** template → all 7: Hero → The problem → Our approach (3 steps + solution image) → What we deliver → Capabilities + Outcomes + Tech → Related → CTA. Each service has TWO images (`image` hero + `solutionImage`) and per-service `problem`/`approach`/`outcomes` copy in `lib/site-data.ts`.
- `/about`, `/contact` (form → `/api/lead`), `/careers` (form → `/api/careers`, positions as hairline list) — all redesigned with a faded colorful image + Reveal.
- **NEW pages:** `/support` (HITROO app, phone mock + SLA + steps) and `/research` (focus areas + approach). Nav/Footer link to these (no longer `#` anchors).
- `/articles/[id]`, `/news/[id]` — clean readers (shared Nav/Footer). `/admin` — internal CMS (`data/content.json`), left functional.
- API: `/api/lead`, `/api/careers`, `/api/content`, `/api/chat` (unused by UI).
- `sitemap.ts`: home, services (+7), support, research, about, careers, contact.

## ⚠️ Gotcha fixed (App Router)
`app/services/layout.tsx`, `app/about/layout.tsx`, `app/careers/layout.tsx` originally did `export { default } from './page'` — which makes the **layout render the page and swallow `{children}`**, so every `/services/*` route showed the hub. Fixed: layouts now export a proper `({children}) => children` component (metadata stays). If a nested route ever renders its parent's page, check the layout for this.

## Shared components & motion
`components/site/Nav.tsx`, `Footer.tsx`, and `Reveal.tsx` (scroll-reveal: fade+rise on view). Logo `/public/new_logo/logo_transparent.png` everywhere; no intro video.

## The 7 services (`lib/site-data.ts`)
Custom Software Development · Mobile App Development · Desktop App Development · AI Model Development & Training · AI Automation · Audit & AI Modernization · Managed & Custom Services. Each has `slug, title, short, tagline, icon, color, overview, capabilities[], features[], stack[]`.

## Key decisions made
- **Theme:** white + Google's four colors + SF Pro (replaced old black/pink + Comfortaa). See [designs.md](designs.md).
- **No boxes** — editorial layout with hairlines, big type, big numerals, bare icons.
- **Products removed entirely** — Capsona/Attyn/Belecure/Mockello/AI-Marketing and all `/products` pages deleted; products stripped from nav, footer, sitemap, JSON-LD, `site-data`.
- **Support app named "HITROO"** (not "Retro" — that was a typo).
- **Intro/splash video removed.**
- **New logo** `/public/new_logo/logo_transparent.png` used in Nav, Footer, app mock.

## Assets
- `/public/hero/bg.png` — hero background (wavy lines).
- `/public/img/` — 21 colorful Higgsfield glass-3D images. Section/hero: `ai, craft, secure, research, services-hub, mobile, desktop, automation, audit, managed, about, contact, careers, support`. Per-service solution visuals: `sol-software, sol-mobile, sol-desktop, sol-ai, sol-automation, sol-audit, sol-managed`. NOTE: regenerate any image that reads like a brand logo — the first `services-hub` looked like Google's logo and was regenerated as an abstract node-constellation. On the homepage they use **high rounding (`rounded-[2.75rem]`) + an inset edge-feather** (`box-shadow: inset … <section-bg>`) so edges blur into the page while keeping rounded corners (preferred over `.img-fade` mask, which erases corners). Match the inset color to the section bg (`#ffffff` or `#fafafa`).
- `/public/hero/tile-*.png`, `toggle/plane/orbs.png` — earlier generated chips, currently **unused** (some also copied to `/public/3d_assets/`; safe to delete).
- **Favicons:** a full favicon package lives in `/public/favicon/` (16/32/96, apple-icon-180, android-icon-*, ms-icon-*, `manifest.json`, `browserconfig.xml`) plus a real `/public/favicon.ico` at root for the default browser request. Wired site-wide via `metadata.icons` + `manifest` in [app/layout.tsx](app/layout.tsx). (The package arrived misnamed as a `favicon.ico/` **folder** with root-relative paths — it was renamed to `favicon/` and its manifest/browserconfig paths re-prefixed to `/favicon/`.)

## Open / next
- `/articles/[id]` & `/news/[id]` are clean readers but could get the full editorial polish + a header image.
- `/admin` still uses the old card UI (internal tool — low priority).
- Optionally delete unused hero chips (`/public/hero/tile-*`, `toggle/plane/orbs`) + unused `card-soft`/`icon-chip` helpers + `@react-three/*`/`three` deps (clears the `--legacy-peer-deps` requirement).
- Consider legal pages (`/privacy`, `/terms`).
