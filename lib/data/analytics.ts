import { hasDatabase, sql } from '@/lib/db';

/** Write-only: the site records analytics; reading them back is the admin app's job. */

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
  visitId: string | null;
  viewId: string | null;
  visitorId: string | null;
  sessionId: string | null;
}) {
  if (!hasDatabase()) return;
  await sql(
    `INSERT INTO web.page_views (path, referrer_host, utm_source, utm_medium, utm_campaign, country, region, city,
                                 device, browser, os, language, visit_id, view_id, visitor_id, session_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
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
      v.visitId,
      v.viewId,
      v.visitorId,
      v.sessionId,
    ]
  );
}

export async function recordEvent(e: {
  type: 'click' | 'engage';
  path: string;
  visitId: string | null;
  viewId: string | null;
  visitorId: string | null;
  label: string | null;
  href: string | null;
  seconds: number | null;
  depth: number | null;
  country: string | null;
}) {
  if (!hasDatabase()) return;
  await sql(
    `INSERT INTO web.events (type, path, visit_id, view_id, visitor_id, label, href, seconds, depth, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [e.type, e.path, e.visitId, e.viewId, e.visitorId, e.label, e.href, e.seconds, e.depth, e.country]
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
