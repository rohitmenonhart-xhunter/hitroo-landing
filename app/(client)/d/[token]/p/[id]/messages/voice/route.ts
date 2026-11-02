import { ApiError, api, isAccessToken, isProjectId } from '@/lib/client/api';
import { fromOurPage, refused } from '@/lib/client/forms';

export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

/**
 * A one-use address to open a voice call with the Project Lead (the factory's D40). The browser connects to it
 * straight away; the call's audio never passes through here.
 */
export async function POST(req: Request, { params }: { params: { token: string; id: string } }) {
  const json = (status: number, body: unknown) => Response.json(body, { status, headers: { 'cache-control': 'private, no-store' } });
  if (!isAccessToken(params.token) || !isProjectId(params.id)) return json(404, { error: 'not_found' });
  if (!fromOurPage(req)) return refused();
  try {
    return json(200, await api.voice(params.token, params.id));
  } catch (err) {
    if (err instanceof ApiError) return json(err.status, { error: err.code, message: err.status === 409 || err.status === 503 ? err.message : 'The call couldn’t start just now. Please try again in a minute, or write here.' });
    console.error('[client area] voice', err);
    return json(502, { error: 'failed', message: 'The call couldn’t start just now. Please try again in a minute, or write here.' });
  }
}
