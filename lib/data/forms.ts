import { hasDatabase, sql } from '@/lib/db';

type Geo = { country: string | null; region: string | null; city: string | null };

/** Stores a project enquiry. Returns its id, or null when the database is unavailable. */
export async function saveLead(lead: {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  leadType: string;
  page?: string | null;
  userAgent?: string | null;
  geo: Geo;
}): Promise<string | null> {
  if (!hasDatabase()) return null;
  try {
    const rows = await sql<{ id: string }>(
      `INSERT INTO web.leads (name, email, phone, interest, message, lead_type, page, country, region, city, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        lead.name || null,
        lead.email || null,
        lead.phone || null,
        lead.interest || null,
        lead.message || null,
        lead.leadType,
        lead.page ?? null,
        lead.geo.country,
        lead.geo.region,
        lead.geo.city,
        lead.userAgent?.slice(0, 400) ?? null,
      ]
    );
    return rows[0]?.id ?? null;
  } catch (err) {
    console.error('saveLead failed:', (err as Error).message);
    return null;
  }
}

export async function markLeadEmailed(id: string) {
  try {
    await sql('UPDATE web.leads SET emailed = true WHERE id = $1', [id]);
  } catch (err) {
    console.error('markLeadEmailed failed:', (err as Error).message);
  }
}

/** Stores a job application, including the PDF resume. Returns its id, or null. */
export async function saveApplication(app: {
  position: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  experience?: string;
  availability?: string;
  whyHitroo?: string;
  whyPosition?: string;
  resumeName?: string;
  resume?: Buffer | null;
  country: string | null;
}): Promise<string | null> {
  if (!hasDatabase()) return null;
  try {
    const rows = await sql<{ id: string }>(
      `INSERT INTO web.job_applications
         (position, name, email, phone, linkedin, portfolio, experience, availability, why_hitroo, why_position,
          resume_name, resume_type, resume, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
      [
        app.position,
        app.name,
        app.email,
        app.phone || null,
        app.linkedin || null,
        app.portfolio || null,
        app.experience || null,
        app.availability || null,
        app.whyHitroo || null,
        app.whyPosition || null,
        app.resumeName || null,
        app.resume ? 'application/pdf' : null,
        app.resume ?? null,
        app.country,
      ]
    );
    return rows[0]?.id ?? null;
  } catch (err) {
    console.error('saveApplication failed:', (err as Error).message);
    return null;
  }
}

export async function markApplicationEmailed(id: string) {
  try {
    await sql('UPDATE web.job_applications SET emailed = true WHERE id = $1', [id]);
  } catch (err) {
    console.error('markApplicationEmailed failed:', (err as Error).message);
  }
}
