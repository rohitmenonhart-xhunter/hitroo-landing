import Link from 'next/link';
import type { ReactNode } from 'react';

/** Inline formatting: **bold**, [label](https://… or /path), `code`. Rendered as React nodes, never raw HTML. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)|`([^`]+)`/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={key++} className="font-semibold text-ink">{m[1]}</strong>);
    else if (m[2]) {
      const href = m[3];
      out.push(
        href.startsWith('/') ? (
          <Link key={key++} href={href} className="text-cobalt underline underline-offset-4">
            {m[2]}
          </Link>
        ) : (
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-cobalt underline underline-offset-4">
            {m[2]}
          </a>
        )
      );
    } else if (m[4]) out.push(<code key={key++} className="rounded bg-mist px-1.5 py-0.5 text-[0.9em]">{m[4]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Post body: one paragraph per line; `## ` and `### ` headings, `- ` lists, `> ` quotes.
 */
export default function PostBody({ body }: { body: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;
  const flush = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={key++} className="grid list-disc gap-2 pl-6 marker:text-cobalt">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>
    );
    list = [];
  };
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (/^[-*] /.test(line)) {
      list.push(line.slice(2));
      continue;
    }
    flush();
    if (line.startsWith('### ')) blocks.push(<h3 key={key++} className="mt-6 text-[22px] font-medium tracking-[-0.015em] text-ink">{inline(line.slice(4))}</h3>);
    else if (line.startsWith('## ')) blocks.push(<h2 key={key++} className="mt-8 text-[28px] font-light tracking-[-0.025em] text-ink">{inline(line.slice(3))}</h2>);
    else if (line.startsWith('> ')) blocks.push(<blockquote key={key++} className="pl-6 text-[22px] font-light italic text-ink">{inline(line.slice(2))}</blockquote>);
    else blocks.push(<p key={key++}>{inline(line)}</p>);
  }
  flush();
  return <div className="grid gap-6 text-[18px] leading-[1.75] text-slate-700">{blocks}</div>;
}
