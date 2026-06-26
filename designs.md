# HITROO — Design Language

The single source of truth for how the HITROO website looks and feels. Follow this for **any** new page, section, or component so the whole site stays consistent. Keep it updated when the language evolves.

## North star
Design like the best in the world — **Apple / Google / Stripe / Linear** caliber. Calm, confident, editorial, premium. When in doubt: more whitespace, bigger type, fewer elements.

## Theme
- **Light, white-primary.** Page background `#ffffff`; alternating sections use `#fafafa` for rhythm.
- **Brand = Google's four colors**, used as *accents only* (icons, tiny dots, gradient words, top-ticks): blue `#4285F4`, red `#EA4335`, yellow `#FBBC05`, green `#34A853`.
- **Ink:** `#202124` headings, `#3c4043` body-strong, `#5f6368` body, `#80868b` muted, hairlines `#e8eaed` / `#e0e2e6`.
- **Type:** SF Pro Display (self-hosted, `/public/fonts/sf-pro-display`). Headings `font-bold tracking-[-0.03em]`, tight `leading-[1.0–1.02]`, fluid sizing via `clamp()`. Section headers ~`text-4xl md:text-6xl`.

## The #1 rule: NO BOXES
The user hates boxes. **Do not** use bordered/shadowed cards, chip-backgrounds behind icons, or pills as containers. Instead:
- **Hairline dividers** (`border-t`/`divide-y` in `#e0e2e6`) to structure lists — e.g. the services list.
- **Bare content on the section background**: icon/number + title + text with generous spacing.
- **Big numerals** (`01–06`) for sequences (process), with a short colored top-tick (`w-9 h-1 rounded-full`).
- **Full-bleed bands** with alternating bg colors do the separating, not inner cards.
- Editorial list rows: index + big title (left) + description (right) + arrow, hover slides + colors via `--c` var.

## Imagery
- Use **real, vivid, multi-color images** (generated with the Higgsfield CLI — see core memory `higgsfield-and-visual-verify`). Never monochrome/single-color. Style: glossy translucent 3D glass, Google palette + more, soft light gradient background, "no text".
- **Professional, not childish.** Always prompt for "premium, sophisticated, refined, cinematic studio render, NOT toy-like, NOT childish". Avoid literal/uncanny imagery (e.g. a realistic human eye) — favour clean abstract or industrial-product scenes. Keep images meaningful to the section.
- Budget: `gpt_image_2 --resolution 1k --aspect_ratio 4:3 --wait --json` → download to `/public/img`. Use `--quality medium` for volume, `--quality high` for hero/marquee visuals.
- **Edge treatment (current canonical):** wrap the image in `rounded-[2.75rem] overflow-hidden` and overlay an inset feather that matches the section bg — `<div className="absolute inset-0 rounded-[2.75rem]" style={{ boxShadow: 'inset 0 0 80px 34px <section-bg>' }} />` (use `#ffffff` on white sections, `#fafafa` on grey). This keeps high rounded corners AND blends the edges into the page. (`.img-fade` radial-mask exists but erases corners — prefer the feather.)
- Place colorful images on **light** sections. Service pages carry two images: `image` (hero) + `solutionImage` (in the "approach" section), both from `lib/site-data.ts`.

## Icons
- **Minimize.** Prefer numerals, color dots/ticks, and images over icon clusters. Lucide only where it genuinely aids scanning (e.g. inside the phone-app mock, CTA arrows). Bare colored icons, never in a chip-box.

## Motion
- **Scroll reveal** via `components/site/Reveal.tsx` (IntersectionObserver, fade + rise, fires once). Wrap section headers, images, and item grids; stagger with `delay`.
- Subtle hover: title `translate-x`, arrow slide, link `gap` grow. Hero text uses `.animate-fade-in`.
- Helpers in `globals.css`: `.text-brand` (4-color gradient text), `.brand-bar-smooth`, `.eyebrow`, `.img-fade` / `.img-fade-soft`, `.animate-fade-in`, `float-slow`.

## Brand assets
- Logo: `/public/new_logo/logo_transparent.png` (colorful Google-palette "H" + `</>`). Use in Nav, Footer, and the app mock. No intro/splash video.
- Hero background: `/public/hero/bg.png` (subtle wavy lines), hero-only, `object-cover` + white wash gradient.

## Shared components
- `components/site/Nav.tsx` — frosted, scroll-aware, mobile menu, active-link.
- `components/site/Footer.tsx` — services + company columns, Chennai address, four-dot motif.
- `components/site/Reveal.tsx` — scroll-reveal wrapper.

## CTAs
- Primary: solid `#202124` pill (`Start a Project`) with soft shadow + hover lift. Secondary: plain text link that colors to blue on hover. Avoid blue-filled buttons except the nav "Start a Project".

## Layout rhythm
Generous vertical padding (`py-28 md:py-36`, hero/CTA larger). `max-w-6xl` content, `max-w-2xl/5xl` for headings/intros. Two-column image+text sections alternate the image side for rhythm.
