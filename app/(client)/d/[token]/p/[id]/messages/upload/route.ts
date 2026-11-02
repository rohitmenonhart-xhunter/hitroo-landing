import { ApiError, api, isAccessToken, isProjectId } from '@/lib/client/api';
import { fromOurPage, refused } from '@/lib/client/forms';

export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

/**
 * A signed link to upload one file (JSON {name, type, size}) straight to storage. The file never passes
 * through here: the browser sends it to the link, then names it in its message.
 */
export async function POST(req: Request, { params }: { params: { token: string; id: string } }) {
  const json = (status: number, body: unknown) => Response.json(body, { status, headers: { 'cache-control': 'private, no-store' } });
  if (!isAccessToken(params.token) || !isProjectId(params.id)) return json(404, { error: 'not_found' });
  if (!fromOurPage(req)) return refused();
  const b = (await req.json().catch(() => ({}))) as { name?: unknown; type?: unknown; size?: unknown };
  if (typeof b.name !== 'string' || typeof b.type !== 'string' || typeof b.size !== 'number') return json(400, { error: 'invalid', message: 'That file could not be read.' });
  try {
    return json(200, await api.upload(params.token, params.id, { name: b.name.slice(0, 200), type: b.type, size: b.size }));
  } catch (err) {
    if (err instanceof ApiError) return json(err.status, { error: err.code, message: err.status === 400 || err.status === 429 ? err.message : 'Something went wrong on our side. Please try again in a minute.' });
    console.error('[client area] upload', err);
    return json(502, { error: 'failed', message: 'Something went wrong on our side. Please try again in a minute.' });
  }
}
