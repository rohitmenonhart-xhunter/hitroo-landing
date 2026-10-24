// Uploads the site's editable images and the Creatives video to object storage (Tigris bucket hitroo-media) and records
// each one in web.media, so page content can point at them and the admin's media library lists them.
//   npm run media:upload              (node --env-file=.env.local scripts/media-upload.mjs)
//
// - Storage keys: img/<sha256 first 8>-<slug>-<w>.webp and vid/<sha8>-<slug>.mp4, cached for a year (immutable).
// - Images become WebP (quality 80) at 480, 960, 1600 and 2400 px wide: only widths up to the original, plus the
//   original width when it is under 2400. The row's url is the largest variant; `tone` is the average colour.
// - Idempotent by content hash: files already in the bucket are not sent again, rows already in web.media are reused.
// - Writes db/seeds/media-map.json (public/ path → storage object) for `npm run content:seed`.
// Credentials: Hitroo_internal_Apps/_secrets/hitroo-media.env (never printed or copied); rows via DATABASE_ADMIN_URL.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import pg from 'pg';
import sharp from 'sharp';

const ROOT = process.cwd();
const SECRETS = process.env.MEDIA_SECRETS_FILE || path.resolve(ROOT, '../../_secrets/hitroo-media.env');
const MAP_FILE = path.join(ROOT, 'db', 'seeds', 'media-map.json');
const WIDTHS = [480, 960, 1600, 2400];
const MAX_WIDTH = 2400;
const CACHE = 'public, max-age=31536000, immutable';

/** What gets uploaded: every media file the built-in page content uses (lib/content-defaults.ts). */
const IMAGES = [
  ...['software-code', 'software-night', 'automation-wave', 'automation-ribbons', 'ai-glass', 'ai-glass-tall', 'creatives-leap'].map((n) => ({
    file: `public/photos/divisions/${n}.webp`,
    slug: n,
    tags: ['site', 'divisions'],
  })),
  { file: 'public/people/jensen-huang.webp', slug: 'jensen-huang', tags: ['site', 'people'] },
  { file: 'public/people/rohit.webp', slug: 'rohit', tags: ['site', 'people'] },
  // The Creatives fan (trends, faceless, ads, characters, stop-motion) and the best performer (ads).
  ...['trends/s1', 'faceless/s1', 'ads/s1', 'characters/s2', 'animation/s1', 'ads/s2'].map((r) => ({
    file: `public/photos/library/${r}.webp`,
    name: `${r.replace('/', '-')}.webp`,
    slug: `reel-${r.replace('/', '-')}`,
    tags: ['site', 'creatives', 'reel'],
  })),
];
const VIDEOS = [{ file: 'public/video/myth-attention.mp4', slug: 'myth-attention', poster: 'public/video/myth-attention-poster.webp', tags: ['site', 'creatives', 'video'] }];

function readEnvFile(file) {
  const env = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

const secrets = readEnvFile(SECRETS);
for (const k of ['TIGRIS_ACCESS_KEY_ID', 'TIGRIS_SECRET_ACCESS_KEY', 'TIGRIS_ENDPOINT', 'TIGRIS_BUCKET', 'MEDIA_PUBLIC_BASE']) {
  if (!secrets[k]) throw new Error(`${k} is missing from ${SECRETS}`);
}
if (!process.env.DATABASE_ADMIN_URL) throw new Error('DATABASE_ADMIN_URL is not set (run with --env-file=.env.local).');

const BUCKET = secrets.TIGRIS_BUCKET;
const BASE = secrets.MEDIA_PUBLIC_BASE.replace(/\/$/, '');
const s3 = new S3Client({
  region: secrets.TIGRIS_REGION || 'auto',
  endpoint: secrets.TIGRIS_ENDPOINT,
  credentials: { accessKeyId: secrets.TIGRIS_ACCESS_KEY_ID, secretAccessKey: secrets.TIGRIS_SECRET_ACCESS_KEY },
});
const db = new pg.Client({ connectionString: process.env.DATABASE_ADMIN_URL });

const sha8 = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);
const hex = (n) => Math.round(n).toString(16).padStart(2, '0');

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === 'NotFound') return false;
    throw err;
  }
}

let sent = 0;
let kept = 0;
async function put(key, body, contentType) {
  if (await exists(key)) {
    kept++;
    return;
  }
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType, CacheControl: CACHE }));
  sent++;
}

/** Widths to make: the standard ones up to the original, plus the original when it is under the cap. */
function variantWidths(original) {
  const top = Math.min(original, MAX_WIDTH);
  const ws = WIDTHS.filter((w) => w <= top);
  if (!ws.includes(top)) ws.push(top);
  return ws.sort((a, b) => a - b);
}

/** Encodes and uploads an image's variants; returns its storage object. */
async function storeImage(file, slug) {
  const buf = readFileSync(path.join(ROOT, file));
  const hash = sha8(buf);
  const meta = await sharp(buf).metadata();
  const variants = [];
  for (const w of variantWidths(meta.width)) {
    const out = await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
    const key = `img/${hash}-${slug}-${w}.webp`;
    await put(key, out.data, 'image/webp');
    variants.push({ w, url: `${BASE}/${key}`, bytes: out.data.length, h: out.info.height });
  }
  const { channels } = await sharp(buf).stats();
  const tone = `#${channels.slice(0, 3).map((c) => hex(c.mean)).join('')}`;
  const top = variants[variants.length - 1];
  return { hash, tone, url: top.url, width: top.w, height: top.h, bytes: top.bytes, variants: variants.map(({ w, url, bytes }) => ({ w, url, bytes })) };
}

/** The row already recorded for this file (same hash and slug), if any. */
async function existingRow(kind, hash, slug) {
  const prefix = kind === 'image' ? `%/img/${hash}-${slug}-%` : `%/vid/${hash}-${slug}.mp4`;
  const { rows } = await db.query('SELECT * FROM web.media WHERE kind = $1 AND url LIKE $2 ORDER BY created_at LIMIT 1', [kind, prefix]);
  return rows[0] ?? null;
}

function probe(file) {
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', file], { encoding: 'utf8' });
    const s = JSON.parse(out).streams?.[0];
    return s ? { width: s.width, height: s.height } : null;
  } catch {
    return null;
  }
}

await db.connect();
const map = {};
try {
  for (const img of IMAGES) {
    const stored = await storeImage(img.file, img.slug);
    let row = await existingRow('image', stored.hash, img.slug);
    if (!row) {
      ({ rows: [row] } = await db.query(
        `INSERT INTO web.media (kind, name, url, width, height, bytes, tone, variants, tags)
         VALUES ('image', $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [img.name ?? path.basename(img.file), stored.url, stored.width, stored.height, stored.bytes, stored.tone, JSON.stringify(stored.variants), img.tags]
      ));
      console.log(`recorded ${img.file} → ${stored.url}`);
    } else {
      console.log(`already recorded ${img.file}`);
    }
    map['/' + img.file.replace(/^public\//, '')] = {
      id: row.id,
      src: row.url,
      width: row.width,
      height: row.height,
      tone: row.tone,
      variants: row.variants.map(({ w, url }) => ({ w, url })),
    };
  }

  for (const v of VIDEOS) {
    const buf = readFileSync(path.join(ROOT, v.file));
    const hash = sha8(buf);
    const key = `vid/${hash}-${v.slug}.mp4`;
    await put(key, buf, 'video/mp4');
    const poster = await storeImage(v.poster, `${v.slug}-poster`);
    const size = probe(path.join(ROOT, v.file)) ?? { width: poster.width, height: poster.height };
    let row = await existingRow('video', hash, v.slug);
    if (!row) {
      ({ rows: [row] } = await db.query(
        `INSERT INTO web.media (kind, name, url, width, height, bytes, tone, poster_url, tags)
         VALUES ('video', $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [path.basename(v.file), `${BASE}/${key}`, size.width, size.height, buf.length, poster.tone, poster.url, v.tags]
      ));
      console.log(`recorded ${v.file} → ${row.url}`);
    } else {
      console.log(`already recorded ${v.file}`);
    }
    map['/' + v.file.replace(/^public\//, '')] = { id: row.id, src: row.url, poster: row.poster_url, width: row.width, height: row.height };
    map['/' + v.poster.replace(/^public\//, '')] = { src: poster.url, width: poster.width, height: poster.height, tone: poster.tone, variants: poster.variants.map(({ w, url }) => ({ w, url })) };
  }
} finally {
  await db.end();
}

mkdirSync(path.dirname(MAP_FILE), { recursive: true });
writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n');
console.log(`${Object.keys(map).length} files mapped in ${path.relative(ROOT, MAP_FILE)}; ${sent} objects uploaded, ${kept} already in the bucket.`);
