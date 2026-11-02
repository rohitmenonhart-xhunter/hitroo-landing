import { ApiError, api, isQuoteToken } from '@/lib/client/api';
import { back, errorCode, field, fromOurPage, refused } from '@/lib/client/forms';

export const dynamic = 'force-dynamic';

/** Accepting a quote: the typed name and the tick, recorded with the client's address and browser. */
export async function POST(req: Request, { params }: { params: { token: string } }) {
  if (!isQuoteToken(params.token)) return new Response('Not found\n', { status: 404 });
  if (!fromOurPage(req)) return refused();
  const form = await req.formData();
  const page = `/q/${params.token}`;
  try {
    await api.accept(params.token, field(form, 'name', 120), form.get('agree') === 'yes');
    return back(`${page}?sent=accepted#payments`);
  } catch (err) {
    const code = err instanceof ApiError && /expired/i.test(err.message) ? 'expired' : errorCode(err, 'accept');
    return back(`${page}?error=${code === 'refused' ? 'accept' : code}#agreement`);
  }
}
