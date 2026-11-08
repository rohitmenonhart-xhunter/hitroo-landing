# media

Social posts for hitroo's Instagram ([@hitroodotcom](https://instagram.com/hitroodotcom)) and LinkedIn page ([hitroo](https://www.linkedin.com/company/hitroo)), made in the site's design language ([designs.md](../designs.md)) and published through the [Zernio API](https://docs.zernio.com).

- [strategy.md](strategy.md): what our audience and our competitors' audiences respond to, and the rules every post follows.
- `_brand/`: the site's tokens, type and marks for a 1080 px canvas (`brand.css`), with Plus Jakarta Sans and Fustat (both SIL OFL).
- `tools/`: `flatten.py` (evens a photo's backdrop to paper), `render.mjs` (exports still frames with the system Chrome), `zernio.mjs` (accounts, uploads, posts).
- `profile/`: the profile picture (the "hi" in ember on paper), 1080 and 400 px, for Instagram and the LinkedIn page.
- One folder per post, named by date: `art/` (generated photos, with the briefs in `art/PROMPTS.md`), `posts.html` (the frames), `export/` (PNGs, and `upload/` with the JPEGs and PDF that get posted), `post.json` (the request), `captions.md`.

## Making a post

1. Read [strategy.md](strategy.md) and [designs.md](../designs.md).
2. Generate the photos: Codex (`codex-imagegen`) for still life and objects, Gemini (`agy`) for photo scenes. Name camera, lens, light and film look, and ask for a warm paper backdrop and empty space for type. Keep the briefs in `art/PROMPTS.md`.
3. `python3 media/tools/flatten.py art/<photo>.png art/flat/<photo>.png`: the backdrop becomes exact paper (#FCF8F6), so photos sit on the page without seams.
4. Lay out the frames in `posts.html` with `_brand/brand.css`: caption, a two-beat headline (the second beat in stone), the photo, the wordmark.
5. `node media/tools/render.mjs media/<post>/posts.html slide-1=1080x1350 story=1080x1920` and look at every frame.
6. **Reels** are HyperFrames projects (`<post>/reel/`, see `2026-11-08-diwali/reel/`), paced by the rg viral-shorts recipe (`~/Desktop/rg/viral-shorts/RECIPE.md`). For sound:
   - Music comes from Epidemic Sound (`rg/viral-shorts/skills/shorts-sound-design/scripts/epidemic.py`).
   - Effects come from `rg/viral-shorts/assets/sfx-library` or ElevenLabs.
   - Mix to −14 LUFS (`reel/work/mix.py`), render, then mux the master.

   Don't fake a Reel with slow zooms on stills: it reads as a slideshow, and ffmpeg's zoompan shakes.
7. Show the owner the frames and captions. Nothing is posted before they approve.
8. `node media/tools/zernio.mjs post media/<post>/post.json --dry`, then without `--dry`. Check with `zernio.mjs get <postId>`.

## Sizes

| Where | Size | Notes |
| --- | --- | --- |
| Instagram feed and carousel | 1080 × 1350 (4:5) | The API accepts 4:5 to 1.91:1. The profile grid crops to 3:4 (about 34 px off each side). All carousel slides share the first slide's ratio. |
| Instagram Story | 1080 × 1920 | Keep text out of the top 250 px and the bottom third. No caption or link sticker via the API. |
| LinkedIn page | 1080 × 1350 images, or a PDF of the same slides (a swipeable document; needs a `documentTitle`) | No links in the text: LinkedIn suppresses them. Put one in `firstComment` if needed. |

## The API key

Zernio's key is in the macOS keychain (service `zernio-api-key`, account `hitroo`, with a note). `zernio.mjs` reads it from there; it is never written to a file. To rotate it: `security add-generic-password -U -a hitroo -s zernio-api-key -w <new key>`.
