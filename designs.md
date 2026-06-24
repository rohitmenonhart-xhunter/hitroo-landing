# HITROO — Design Language

The single source of truth for how the HITROO website looks and feels. Follow this for **any** new page, section, or component so the whole site stays consistent. Keep it updated when the language evolves.

## North star
Design like the best in the world — **Apple / Google / Stripe / Linear** caliber. Calm, confident, editorial, premium. When in doubt: more whitespace, bigger type, fewer elements.

## Theme — Monochrome (black & white)
- **White-primary, near-black secondary. NO hue anywhere** — the entire site is black, white, and greys only. Do not introduce any colored value.
- Page background `#ffffff`; alternating sections use `#fafafa` (and occasionally `#f5f5f5`) for rhythm.
- **Accent = near-black `#0a0a0a`**, used for icons, tiny dots, gradient words, top-ticks, and CTAs. Where a *four-tone* motif is wanted (segmented `.brand-bar`, four-dot clusters, the email top bar), use the greyscale ramp `#0a0a0a → #2a2a2a → #5a5a5a → #8a8a8a` so the four-part identity survives without color.
- **Ink ramp (greyscale):** `#0a0a0a` headings & strong text, `#2a2a2a` body-strong, `#4a4a4a` body, `#6b6b6b` muted, hairlines `#e5e5e5`. Surfaces `#fafafa` / `#f5f5f5`.
- The legacy CSS vars `--g-blue` / `--g-red` / `--g-yellow` / `--g-green` still exist but now all resolve to greys — kept only so older references don't break. `.text-brand` / `.text-kinetic` are now subtle **greyscale** gradients (silver sheen), not color.
- **Type:** SF Pro Display (self-hosted, `/public/fonts/sf-pro-display`). Headings `font-bold tracking-[-0.03em]`, tight `leading-[1.0–1.02]`, fluid sizing via `clamp()`. Section headers ~`text-4xl md:text-6xl`.

## The #1 rule: NO BOXES
The user hates boxes. **Do not** use bordered/shadowed cards, chip-backgrounds behind icons, or pills as containers. Instead:
- **Hairline dividers** (`border-t`/`divide-y` in `#e0e2e6`) to structure lists — e.g. the services list.
- **Bare content on the section background**: icon/number + title + text with generous spacing.
- **Big numerals** (`01–06`) for sequences (process), with a short colored top-tick (`w-9 h-1 rounded-full`).
- **Full-bleed bands** with alternating bg colors do the separating, not inner cards.
- Editorial list rows: index + big title (left) + description (right) + arrow, hover slides + colors via `--c` var.

## Imagery
- **All imagery renders in greyscale.** A global rule in `globals.css` — `img:not(.keep-color) { filter: grayscale(1) contrast(1.02); }` — desaturates every image site-wide, so the existing glass-3D renders appear black & white automatically (no need to regenerate them). New images may be generated in color but will be desaturated on the page; prefer compositions that read well in B&W — strong tonal contrast, clear silhouettes, full range from near-black to white. Style: glossy translucent 3D glass, soft light gradient background, "no text". (Add `.keep-color` to an `<img>` only in the rare case an image must stay colored — avoid it; the theme is strictly monochrome.)
- **Professional, not childish.** Always prompt for "premium, sophisticated, refined, cinematic studio render, NOT toy-like, NOT childish". Avoid literal/uncanny imagery (e.g. a realistic human eye) — favour clean abstract or industrial-product scenes. Keep images meaningful to the section.
- Budget: `gpt_image_2 --resolution 1k --aspect_ratio 4:3 --wait --json` → download to `/public/img`. Use `--quality medium` for volume, `--quality high` for hero/marquee visuals.
- **Edge treatment (current canonical):** wrap the image in `rounded-[2.75rem] overflow-hidden` and overlay an inset feather that matches the section bg — `<div className="absolute inset-0 rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px <section-bg>' }} />` (use `#ffffff` on white sections, `#fafafa` on grey). This keeps high rounded corners AND blends the edges into the page. (`.img-fade` radial-mask exists but erases corners — prefer the feather.)
- Place colorful images on **light** sections. Service pages carry two images: `image` (hero) + `solutionImage` (in the "approach" section), both from `lib/site-data.ts`.

## Icons
- **Minimize.** Prefer numerals, color dots/ticks, and images over icon clusters. Lucide only where it genuinely aids scanning (e.g. inside the phone-app mock, CTA arrows). Bare colored icons, never in a chip-box.

## Motion
- **Scroll reveal** via `components/site/Reveal.tsx` (IntersectionObserver, fade + rise, fires once). Wrap section headers, images, and item grids; stagger with `delay`.
- Subtle hover: title `translate-x`, arrow slide, link `gap` grow. Hero text uses `.animate-fade-in`.
- Helpers in `globals.css`: `.text-brand` (greyscale gradient text — silver sheen), `.brand-bar-smooth` (greyscale bar), `.eyebrow`, `.img-fade` / `.img-fade-soft`, `.animate-fade-in`, `float-slow`.

## Brand assets
- Logo: a **monochrome "H" mark**. `/public/new_logo/new_logo.png` = white "H" on a solid **black tile** — use this on light surfaces with `rounded-lg` (Nav, Footer, app mock) so the white H stays visible. `/public/new_logo/new_logo_transparent.png` = white "H" on transparent — use only on dark backgrounds. No intro/splash video.
- Hero background: `/public/hero/bg.png` (subtle wavy lines), hero-only, `object-cover` + white wash gradient.

## Shared components
- `components/site/Nav.tsx` — frosted, scroll-aware, mobile menu, active-link.
- `components/site/Footer.tsx` — services + company columns, Chennai address, four-dot motif.
- `components/site/Reveal.tsx` — scroll-reveal wrapper.

## CTAs
- Primary: solid near-black `#0a0a0a` pill (`Start a Project`) via `.btn-primary`, soft shadow + hover lift (hover darkens to `#2a2a2a`). Secondary: plain text link that darkens to `#0a0a0a` on hover. No colored/filled buttons — everything is black on white.

## Layout rhythm
Generous vertical padding (`py-28 md:py-36`, hero/CTA larger). `max-w-6xl` content, `max-w-2xl/5xl` for headings/intros. Two-column image+text sections alternate the image side for rhythm.
