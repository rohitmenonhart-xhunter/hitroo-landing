// Applies db/migrations/*.sql in order, once each, using DATABASE_ADMIN_URL (never the site's role).
//   node --env-file=.env.local scripts/db-migrate.mjs
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const url = process.env.DATABASE_ADMIN_URL;
if (!url) {
  console.error('DATABASE_ADMIN_URL is not set.');
  process.exit(1);
}

const dir = path.join(process.cwd(), 'db', 'migrations');
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  const done = new Set((await client.query('SELECT filename FROM public.schema_migrations')).rows.map((r) => r.filename));
  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
  let applied = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(path.join(dir, file), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO public.schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`applied ${file}`);
      applied++;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`failed ${file}: ${err.message}`);
      process.exit(1);
    }
  }
  console.log(applied ? `${applied} migration(s) applied.` : 'Database is up to date.');
} finally {
  await client.end();
}
