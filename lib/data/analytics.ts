import { hasDatabase, sql } from '@/lib/db';

export async function recordPageView(v: {
  path: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string;
  browser: string;
  os: string;
  language: string | null;
  visitorId: string | null;
  sessionId: string | null;
}) {
  if (!hasDatabase()) return;
  await sql(
    `INSERT INTO web.page_views (path, referrer_host, utm_source, utm_medium, utm_campaign, country, region, city,
                                 device, browser, os, language, visitor_id, session_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      v.path,
      v.referrerHost,
      v.utmSource,
      v.utmMedium,
      v.utmCampaign,
      v.country,
      v.region,
      v.city,
      v.device,
      v.browser,
      v.os,
      v.language,
      v.visitorId,
      v.sessionId,
    ]
  );
}

export async function recordConsent(c: { visitorId: string | null; choice: 'granted' | 'denied'; policyVersion: string; country: string | null }) {
  if (!hasDatabase()) return;
  await sql('INSERT INTO web.consents (visitor_id, choice, policy_version, country) VALUES ($1, $2, $3, $4)', [
    c.visitorId,
    c.choice,
    c.policyVersion,
    c.country,
  ]);
}

type Count = { label: string | null; n: number };

/** Admin insights for the last `days` days. */
export async function getInsights(days = 30) {
  const since = `now() - make_interval(days => ${Math.max(1, Math.min(365, Math.floor(days)))})`;
  const [totals] = await sql<{ views: number; visitors: number; leads: number; applications: number }>(
    `SELECT
       (SELECT count(*)::int FROM web.page_views WHERE ts >= ${since}) AS views,
       (SELECT count(DISTINCT visitor_id)::int FROM web.page_views WHERE ts >= ${since} AND visitor_id IS NOT NULL) AS visitors,
       (SELECT count(*)::int FROM web.leads WHERE created_at >= ${since}) AS leads,
       (SELECT count(*)::int FROM web.job_applications WHERE created_at >= ${since}) AS applications`
  );
  const top = (col: string, limit = 8) =>
    sql<Count>(
      `SELECT ${col} AS label, count(*)::int AS n FROM web.page_views WHERE ts >= ${since} GROUP BY 1 ORDER BY n DESC LIMIT ${limit}`
    );
  const [pages, countries, referrers, devices, daily] = await Promise.all([
    top('path'),
    top('country'),
    top('referrer_host'),
    top('device', 3),
    sql<{ day: string; n: number }>(
      `SELECT to_char(date_trunc('day', ts), 'YYYY-MM-DD') AS day, count(*)::int AS n
       FROM web.page_views WHERE ts >= ${since} GROUP BY 1 ORDER BY 1`
    ),
  ]);
  return { days, totals, pages, countries, referrers, devices, daily };
}

export async function recentLeads(limit = 50) {
  return sql(
    `SELECT id, created_at, name, email, phone, interest, message, page, country, emailed, status
     FROM web.leads ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
}

export async function recentApplications(limit = 50) {
  return sql(
    `SELECT id, created_at, position, name, email, phone, linkedin, portfolio, experience, availability, resume_name, country, status
     FROM web.job_applications ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
}

export async function applicationResume(id: string) {
  const rows = await sql<{ resume_name: string | null; resume: Buffer | null }>(
    'SELECT resume_name, resume FROM web.job_applications WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
}
