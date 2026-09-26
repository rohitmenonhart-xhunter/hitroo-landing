# HITROO — Design Language

How the HITROO site looks, reads and behaves. Follow it for every new page, section or component.

## North star
A global enterprise software firm (think Capgemini, Cognizant, Zoho) — professional, calm, to the point. Business buyers should see in seconds what we build, why they need it, and why HITROO.

## Rules
1. **White everywhere, no lines.** No tinted or dark section bands and no divider lines (between sections, list items or grid cells). Separate everything with generous whitespace; interior pages should feel spacious and complete.
2. **Minimal words.** One-line ledes, two-line statements, short labels. Draft, then cut it in half again. No lists of reasons — one strong statement instead.
3. **Business first.** Lead with the business problem and outcome; every block ends in one step forward (a link or button). Careers stay in the footer.
4. **Professional, real-looking photos.** Clean, bright, modern corporate photography that shows the outcome (a tidy office, automation, a data centre), like a global consultancy's site — never gritty or cluttered, never 3D or CGI, never brand-colour graded. No people, no readable text.
5. **Honest claims only.** No invented clients, numbers or case studies.

## Tokens (tailwind.config.ts)
| Token | Hex | Use |
| --- | --- | --- |
| `ink` | #0A1633 | Headings and body text |
| `cobalt` | #2451FF | Links, buttons, the accent line of a statement |
| `cobalt-dark` / `cobalt-soft` | #1A3ED9 / #EEF2FF | Hover states |
| `navy` | #0A1B4A | Logo second ring |
| `line` | #E3E7EE | Form-field borders only |
| `mist` | #F4F6FA | Footer, image placeholders, brand-kit tiles |

Body copy uses Tailwind `slate-600`, meta text `slate-500`.

## Type
Inter (`font-corp`). Headlines `font-light`, tight tracking (-0.03 to -0.035em), `text-wrap: balance`:
- Page title 40 / 54 / 64px · Section title 32 / 40 / 44px · Statement 32 / 44 / 56px · Lede 18px · Body 16–17px · Labels 13–15px.
- Eyebrows: 12px, semibold, uppercase, 0.16em tracking, cobalt.

## Building blocks (components/corporate)
- `PageHero` — title left, one line + actions right, optional 21:9 photo.
- `Statement` — one or two big lines; the second line in cobalt; `py-28 sm:py-36 lg:py-48`.
- `Section` + `SectionHeader` — standard spacing (`py-24 sm:py-32 lg:py-40`); content starts `mt-14 lg:mt-20` below the header.
- `ServiceGrid` — open grid of service icons and short names (4×2 with a "Talk to us" item; 3×2 when one service is excluded).
- `CtaBand` — closing title, one line, one button.
- `StoryCarousel` — full-bleed cinematic photo cards on navy with a serif (Newsreader) headline; arrows and dots, no autoplay.
- `ProcessAccordion` — the six delivery steps as photo panels in a row; the open one is wide with number, name and line on a navy shade, the others fold to tinted strips with upright names.
- `LegalSections` — policy pages: short titled sections in one column.
- `LeaderQuote` — a big light statement (last line cobalt) signed with a small round photo, name and role. The photo stays small.
- `FaqList` — questions that open in place, cobalt plus that turns into a cross; no lines.
- `ContactBlock` / `LeadForm`, `CareersForm` — forms with the API's anti-spam fields.
- Buttons: cobalt pill with arrow (primary); `ArrowLink` for secondary actions (no outlined buttons). Step numbers are large cobalt numerals, not circles.

## Logo
Two linked rings, cobalt and navy, rising 10° (`components/brand/Logo.tsx`). Always paired with the HITROO wordmark (Inter 600, 0.08em tracking) except as favicon or app icon. Always blue and black on white or a light background — never on dark colours or busy photos, never a reversed version. Keep the rings open; never red, yellow or orange. Downloads and rules: `/brand`.

## Motion
Restrained: colour and arrow nudges on hover, a gentle photo zoom on cards, process panels that widen smoothly, story cards that cross-fade with a slow zoom. Nothing loops, bounces, pulses or glows, and no drawn-in-code demo scenes (fake app windows, cursors, dotted grids) — they read as templates or AI output. Respect `prefers-reduced-motion`.

## Imagery
Codex-generated at 1536×1024, converted to 1200×800 WebP with `cwebp -q 84 -m 6 -sharp_yuv -resize 1200 800`. Briefs are in `docs/art/photos-briefs.md`; reuse the "Professional photo set" style line for any new photo so the set stays consistent. Older photos (hero, support, audience, research, about) still use the documentary style. The home story cards use the cinematic night set (its own style line in the briefs). Icons: the Codex duotone set in `public/icons/` (navy outlines, cobalt and periwinkle fills); new icons are generated with an existing sheet as the style reference.
