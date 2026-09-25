import { Pool, type QueryResultRow } from 'pg';

/**
 * Shared Postgres pool for the website (Fly app `hitroo-db`, database `hitroo`, schema `web`).
 * Connects as the least-privilege `web_app` role via DATABASE_URL (TLS, verify-full).
 * Serverless-friendly: a small pool per instance, reused across invocations.
 */
const globalForDb = globalThis as unknown as { hitrooPool?: Pool };

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

function pool() {
  if (!globalForDb.hitrooPool) {
    const p = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 6_000,
    });
    p.on('error', (err) => console.error('Postgres pool error:', err.message));
    globalForDb.hitrooPool = p;
  }
  return globalForDb.hitrooPool;
}

export async function sql<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []): Promise<T[]> {
  const res = await pool().query<T>(text, values);
  return res.rows;
}
