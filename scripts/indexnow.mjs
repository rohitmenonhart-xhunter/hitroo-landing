// Tells Bing, Yandex, Seznam, Naver and other IndexNow engines about every URL in the sitemap.
// Bing's index also feeds ChatGPT search and Copilot. Run after each production deploy:
//   node scripts/indexnow.mjs            (defaults to https://www.hitroo.com)
//   SITE_URL=https://example.vercel.app node scripts/indexnow.mjs
const KEY = 'f00de9d583f30b0850ec9dc316622abd'; // public by design; served at /f00de9d583f30b0850ec9dc316622abd.txt
const site = (process.env.SITE_URL || 'https://www.hitroo.com').replace(/\/$/, '');

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('No URLs found in the sitemap');

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs → HTTP ${res.status}`);
