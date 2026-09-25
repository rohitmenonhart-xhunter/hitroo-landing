// Imports articles/news from the old file CMS (data/content.json) into web.posts. Safe to re-run.
//   node --env-file=.env.local scripts/db-seed-posts.mjs
import { readFile } from 'node:fs/promises';
import pg from 'pg';

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const data = JSON.parse(await readFile('data/content.json', 'utf8'));
const items = [
  ...(data.articles ?? []).map((a) => ({ ...a, kind: 'article' })),
  ...(data.news ?? []).map((n) => ({ ...n, kind: 'blog' })),
];

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  for (const it of items) {
    const body = String(it.body ?? '').trim();
    const excerpt = body.split('\n').map((l) => l.trim()).find(Boolean)?.slice(0, 220) ?? '';
    const published = it.createdAt ? new Date(it.createdAt) : new Date();
    const res = await client.query(
      `INSERT INTO web.posts (kind, slug, legacy_id, title, excerpt, body, category, published_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
       ON CONFLICT (legacy_id) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, excerpt = EXCLUDED.excerpt
       RETURNING slug`,
      [it.kind, slugify(it.title), String(it.id), it.title, excerpt, body, it.category ?? null, published]
    );
    console.log(`${it.kind}: ${res.rows[0].slug}`);
  }
} finally {
  await client.end();
}
