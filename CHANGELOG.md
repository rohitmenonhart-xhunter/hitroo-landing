# Changelog

All notable changes to the HITROO website and its infrastructure. Newest first. Dates are IST.

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
