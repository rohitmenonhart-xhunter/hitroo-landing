// Warms the image optimizer's cache after a deploy, so the first visitors don't wait for AVIF encoding (8–20× slower
// than WebP to encode, 25–45% smaller). Requests every /_next/image variant in each sitemap page's HTML at the widths
// devices really ask for. The Creatives library is static (no optimizer), so it needs no warming. Each variant warmed
// for the first time is one image transformation (Hobby allows 5,000 a month; cached ones cost nothing for 31 days).
// Run after each production deploy, next to IndexNow:
//   node scripts/warm-images.mjs            (defaults to https://www.hitroo.com)
//   SITE_URL=http://localhost:3100 node scripts/warm-images.mjs
const site = (process.env.SITE_URL || 'https://www.hitroo.com').replace(/\/$/, '');
const ACCEPT = 'image/avif,image/webp,image/*';

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

// srcset lists every width Next can make (16 to 3840 px); phones and laptops at 1x to 3x only ever ask for these.
const WIDTHS = new Set([384, 640, 828, 1080, 1920]);
const urls = new Set();
for (const path of pages) {
  const html = await (await fetch(site + path)).text();
  for (const m of html.matchAll(/\/_next\/image\?url=[^"'\s,]+/g)) {
    const u = m[0].replace(/&amp;/g, '&');
    if (WIDTHS.has(Number(new URLSearchParams(u.split('?')[1]).get('w')))) urls.add(u);
  }
}
const list = [...urls];
let done = 0;
let failed = 0;
const started = Date.now();
async function worker() {
  while (list.length) {
    const u = list.pop();
    try {
      const res = await fetch(site + u, { headers: { Accept: ACCEPT } });
      await res.arrayBuffer();
      if (!res.ok) failed++;
    } catch {
      failed++;
    }
    done++;
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Warmed ${done} image variants from ${pages.length} pages in ${Math.round((Date.now() - started) / 1000)} s (${failed} failed).`);
