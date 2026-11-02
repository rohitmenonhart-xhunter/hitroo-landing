import { api, isAccessToken, isProjectId } from '@/lib/client/api';
import { back, errorCode, field, fromOurPage, refused } from '@/lib/client/forms';

export const dynamic = 'force-dynamic';

/**
 * Every dashboard form posts here (`do` says which), and the client lands back on the page they were on:
 *   new | change | problem   a request (text)            answer   the team's question (task, text)
 *   message                  to the Project Lead (text)   domain   connect their own domain (domain)
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
      const { sent } = await api.newProject(t, text);
      return back(`${home}?sent=${sent}`);
    } catch (err) {
      return back(`${home}/new?error=${errorCode(err, 'short')}`);
    }
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
