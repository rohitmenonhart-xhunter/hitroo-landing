/**
 * Form posts in the client area: from our own pages only, answered with a redirect back (303), so every form
 * works without JavaScript. Outcomes travel as short codes (?sent=, ?error=) the page turns into fixed text.
 */

/** Refuses posts from other sites: the browser says where a form came from. */
export function fromOurPage(req: Request): boolean {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin') return false;
  const origin = req.headers.get('origin');
  if (!origin || origin === 'null') return site === 'same-origin' || !site;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const back = (location: string) => new Response(null, { status: 303, headers: { location, 'cache-control': 'no-store' } });
export const refused = () => new Response('Cross-site request refused\n', { status: 403 });

/** An API failure as one of the pages' error codes. */
export function errorCode(err: unknown, invalid: string): string {
  // An ApiError (./api), checked by shape so this file stands alone (and is testable without Next).
  if (err && typeof err === 'object' && 'status' in err && 'code' in err) {
    if (err.status === 400 && err.code === 'refused') return 'refused';
    if (err.status === 400) return invalid;
    if (err.status === 429) return 'busy';
  }
  console.error('[client area]', err);
  return 'failed';
}

export const field = (form: FormData, name: string, max = 4000) => String(form.get(name) ?? '').slice(0, max);
