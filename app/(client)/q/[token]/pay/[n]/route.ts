import { ApiError, api, isQuoteToken } from '@/lib/client/api';
import { back, fromOurPage, refused } from '@/lib/client/forms';

export const dynamic = 'force-dynamic';

/** On to Razorpay for a due payment (a fresh link if the last one expired). Only Razorpay's own addresses. */
export async function POST(req: Request, { params }: { params: { token: string; n: string } }) {
  if (!isQuoteToken(params.token) || !/^[1-9]\d?$/.test(params.n)) return new Response('Not found\n', { status: 404 });
  if (!fromOurPage(req)) return refused();
  const page = `/q/${params.token}`;
  try {
    const { url } = await api.pay(params.token, Number(params.n));
    const to = new URL(url);
    if (to.protocol !== 'https:' || !/(^|\.)(rzp\.io|razorpay\.com)$/.test(to.hostname)) throw new Error(`unexpected payment address ${to.hostname}`);
    return back(to.toString());
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 409)) console.error('[client area] payment link', err);
    return back(`${page}${err instanceof ApiError && err.status === 409 ? '' : '?error=failed'}#payments`);
  }
}
