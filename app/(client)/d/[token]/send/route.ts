import { api, isAccessToken, isProjectId } from '@/lib/client/api';
import { back, errorCode, field, fromOurPage, refused } from '@/lib/client/forms';

const PHONE_ERRORS = new Set(['phone_number', 'phone_limit', 'phone_off', 'code_wrong', 'code_expired', 'code_tries']);

export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

/**
 * Every dashboard form posts here (`do` says which), and the client lands back on the page they were on:
 *   new | change | problem   a request (text)            answer   the team's question (task, text)
 *   message                  to the Project Lead (text)   domain   connect their own domain (domain)
 *   phone-start | phone-confirm | phone-calls | phone-remove   phone calls with the Lead (phone, code, on)
 */
export async function POST(req: Request, { params }: { params: { token: string } }) {
  if (!isAccessToken(params.token)) return new Response('Not found\n', { status: 404 });
  if (!fromOurPage(req)) return refused();
  const t = params.token;
  const form = await req.formData();
  const action = field(form, 'do', 20);
  const project = field(form, 'project', 64);
  const text = field(form, 'text');
  const home = `/d/${t}`;
  if (action === 'new') {
    try {
      // The new project is there at once: straight into its chat, where its lead is already writing.
      const { project } = await api.newProject(t, text);
      return back(`${home}/p/${project}/messages`);
    } catch (err) {
      return back(`${home}/new?error=${errorCode(err, 'short')}`);
    }
  }
  if (action.startsWith('phone-')) {
    const done = (sent: string) => back(`${home}?sent=${sent}#phone`);
    try {
      if (action === 'phone-start') {
        await api.phone(t, { do: 'start', phone: field(form, 'phone', 30) });
        return done('phone-code');
      }
      if (action === 'phone-confirm') {
        await api.phone(t, { do: 'confirm', code: field(form, 'code', 12) });
        return done('phone-verified');
      }
      if (action === 'phone-calls') {
        const on = field(form, 'on', 5) === 'yes';
        await api.phone(t, { do: 'calls', on });
        return done(on ? 'phone-on' : 'phone-off');
      }
      if (action === 'phone-remove') {
        await api.phone(t, { do: 'remove' });
        return done('phone-removed');
      }
    } catch (err) {
      // The factory's own reasons, as codes the page turns into fixed text.
      const code = err && typeof err === 'object' && 'code' in err && typeof err.code === 'string' && PHONE_ERRORS.has(err.code) ? err.code : errorCode(err, 'phone_number');
      return back(`${home}?error=${code}#phone`);
    }
    return back(home);
  }
  if (!isProjectId(project)) return back(home);
  const page = `${home}/p/${project}`;
  try {
    if (action === 'change' || action === 'problem') {
      try {
        const { sent } = await api.request(t, project, action, text);
        return back(`${page}?sent=${sent}`);
      } catch (err) {
        return back(`${page}/request?kind=${action}&error=${errorCode(err, 'short')}`);
      }
    }
    if (action === 'answer') {
      await api.answer(t, project, field(form, 'task', 40), text);
      return back(`${page}?sent=answer`);
    }
    if (action === 'message') {
      await api.message(t, project, text);
      return back(`${page}/messages`);
    }
    if (action === 'domain') {
      try {
        await api.domain(t, project, field(form, 'domain', 253));
        return back(`${page}/site?sent=domain#domain`);
      } catch (err) {
        return back(`${page}/site?error=${errorCode(err, 'domain')}#domain`);
      }
    }
  } catch (err) {
    return back(`${page}?error=${errorCode(err, action === 'answer' ? 'answered' : 'empty')}`);
  }
  return back(page);
}
