// Writes every content key's built-in copy (lib/content-defaults.ts) into web.content, with its images and video
// pointing at the files in object storage (db/seeds/media-map.json, from `npm run media:upload`).
//   npm run content:seed                 keys that already have a row are left alone (the admin's edits win)
//   npm run content:seed -- --force      overwrite every key with the built-in copy
//   npm run content:seed -- --dry-run    check and show what would be written, write nothing
// Each write also adds a web.content_history row, so it can be undone from the admin. Uses DATABASE_ADMIN_URL.
// Runs on Node's built-in TypeScript support (Node 22.18+ / 24), like the tests.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { CONTENT_KEYS, forEachMedia, type ContentKey } from '../lib/content-core.ts';
import { CONTENT_DEFAULTS } from '../lib/content-defaults.ts';
import { checkContent } from '../lib/content-schema.ts';

interface Stored {
  id?: string;
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  tone?: string;
  variants?: { w: number; url: string }[];
}

const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');
const MAP_FILE = path.join(process.cwd(), 'db', 'seeds', 'media-map.json');
const SAVED_BY = 'content-seed';

/** A key's built-in copy with every public/ file swapped for its storage object; also the alt text each file is used with. */
function withStorage(key: ContentKey, map: Record<string, Stored>) {
  const data = structuredClone(CONTENT_DEFAULTS[key]) as unknown;
  const missing: string[] = [];
  const alts: { id: string; alt: string }[] = [];
  forEachMedia(data, (slot) => {
    const local = slot.src.split('?')[0];
    const m = map[local];
    if (!m) {
      if (!/^https?:\/\//.test(slot.src)) missing.push(local);
      return;
    }
    slot.src = m.src;
    if (m.width) slot.width = m.width;
    if (m.height) slot.height = m.height;
    if (typeof slot.poster === 'string') {
      // A video: its poster is a still in storage too.
      slot.poster = m.poster ?? map[slot.poster.split('?')[0]]?.src ?? slot.poster;
      if (m.id && typeof slot.title === 'string') alts.push({ id: m.id, alt: slot.title });
    } else {
      if (m.tone && !slot.tone) slot.tone = m.tone;
      if (m.variants?.length) slot.variants = m.variants;
      if (m.id && typeof slot.alt === 'string' && slot.alt) alts.push({ id: m.id, alt: slot.alt });
    }
  });
  return { data, missing, alts };
}

async function main() {
  if (!existsSync(MAP_FILE)) throw new Error(`${path.relative(process.cwd(), MAP_FILE)} is missing: run npm run media:upload first.`);
  const map = JSON.parse(readFileSync(MAP_FILE, 'utf8')) as Record<string, Stored>;

  const rows = CONTENT_KEYS.map((key) => ({ key, ...withStorage(key, map) }));
  for (const r of rows) {
    if (r.missing.length) throw new Error(`${r.key}: no storage object for ${r.missing.join(', ')} (add it to scripts/media-upload.mjs)`);
    const problem = checkContent(r.key, r.data);
    if (problem) throw new Error(`${r.key}: ${problem}`);
  }
  if (dryRun) {
    for (const r of rows) console.log(`${r.key}: ${JSON.stringify(r.data).length} bytes`);
    console.log(`Dry run: ${rows.length} keys checked, nothing written.`);
    return;
  }

  const url = process.env.DATABASE_ADMIN_URL;
  if (!url) throw new Error('DATABASE_ADMIN_URL is not set (run with --env-file=.env.local).');
  const db = new pg.Client({ connectionString: url });
  await db.connect();
  let written = 0;
  try {
    await db.query('BEGIN');
    for (const r of rows) {
      const json = JSON.stringify(r.data);
      const res = await db.query(
        force
          ? `INSERT INTO web.content (key, data, updated_by) VALUES ($1, $2, $3)
             ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now(), updated_by = EXCLUDED.updated_by
             RETURNING key`
          : `INSERT INTO web.content (key, data, updated_by) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING RETURNING key`,
        [r.key, json, SAVED_BY]
      );
      if (res.rowCount) {
        await db.query('INSERT INTO web.content_history (key, data, saved_by) VALUES ($1, $2, $3)', [r.key, json, SAVED_BY]);
        written++;
        console.log(`wrote ${r.key}`);
      } else {
        console.log(`kept ${r.key} (already saved; --force overwrites)`);
      }
      // The media library shows each file with the alt text the site uses it with.
      for (const a of r.alts) await db.query(`UPDATE web.media SET alt = $2 WHERE id = $1 AND alt = ''`, [a.id, a.alt]);
    }
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  } finally {
    await db.end();
  }
  console.log(`${written} of ${rows.length} keys written.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
