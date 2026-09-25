# Changelog

All notable changes to the HITROO website and its infrastructure. Newest first. Dates are IST.

## 2026-09-25 — Data platform, Insights, SEO/GEO (not yet deployed or committed)

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
