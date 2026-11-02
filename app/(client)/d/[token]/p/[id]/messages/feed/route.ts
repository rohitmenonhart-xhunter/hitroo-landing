import { ApiError, api, isAccessToken, isProjectId } from '@/lib/client/api';
import { errorCode, fromOurPage, refused } from '@/lib/client/forms';

export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

type Ctx = { params: { token: string; id: string } };
const json = (status: number, body: unknown) => Response.json(body, { status, headers: { 'cache-control': 'private, no-store' } });
const valid = ({ params }: Ctx) => isAccessToken(params.token) && isProjectId(params.id);

/** The chat's live feed: messages after `after`, and whether the Lead is replying. */
export async function GET(req: Request, ctx: Ctx) {
  if (!valid(ctx)) return json(404, { error: 'not_found' });
  const after = new URL(req.url).searchParams.get('after') ?? undefined;
  try {
    return json(200, await api.chat(ctx.params.token, ctx.params.id, after && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(after) ? after : undefined));
  } catch (err) {
    return json(err instanceof ApiError ? err.status : 502, { error: errorCode(err, 'invalid') });
  }
}

/** A message from the chat (JSON {text, files}); the reply arrives through the feed. */
export async function POST(req: Request, ctx: Ctx) {
  if (!valid(ctx)) return json(404, { error: 'not_found' });
  if (!fromOurPage(req)) return refused();
  const body = (await req.json().catch(() => ({}))) as { text?: unknown; files?: unknown };
  const text = typeof body.text === 'string' ? body.text.slice(0, 2000) : '';
  const files = Array.isArray(body.files) ? body.files.filter((f): f is string => typeof f === 'string' && /^[0-9a-f]{20}$/.test(f)).slice(0, 10) : [];
  if (!text.trim() && !files.length) return json(400, { error: 'empty' });
  try {
    await api.message(ctx.params.token, ctx.params.id, text, files);
    return json(200, { ok: true });
  } catch (err) {
    return json(err instanceof ApiError ? err.status : 502, { error: errorCode(err, 'empty'), message: err instanceof ApiError && err.status === 400 ? err.message : undefined });
  }
}
