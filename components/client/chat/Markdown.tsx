import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

/** How each Markdown element looks in a chat message: the site's type, compact spacing. */
const COMPONENTS: Components = {
  p: ({ node: _n, ...p }) => <p className="mt-2.5 first:mt-0" {...p} />,
  strong: ({ node: _n, ...p }) => <strong className="font-bold text-char" {...p} />,
  em: ({ node: _n, ...p }) => <em className="italic" {...p} />,
  a: ({ node: _n, href, ...p }) => <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-char underline decoration-ember/50 underline-offset-[3px] hover:decoration-ember" {...p} />,
  ul: ({ node: _n, ...p }) => <ul className="mt-2.5 list-disc space-y-1.5 pl-5 marker:text-ember first:mt-0" {...p} />,
  ol: ({ node: _n, ...p }) => <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-stone first:mt-0" {...p} />,
  li: ({ node: _n, ...p }) => <li className="pl-1" {...p} />,
  h1: ({ node: _n, ...p }) => <p className="mt-4 font-display text-[17px] font-bold tracking-[-0.02em] text-char first:mt-0" {...p} />,
  h2: ({ node: _n, ...p }) => <p className="mt-4 font-display text-[16px] font-bold tracking-[-0.02em] text-char first:mt-0" {...p} />,
  h3: ({ node: _n, ...p }) => <p className="mt-3 font-bold text-char first:mt-0" {...p} />,
  blockquote: ({ node: _n, ...p }) => <blockquote className="mt-2.5 border-l-[3px] border-ember/40 pl-3 text-char/70 first:mt-0" {...p} />,
  code: ({ node: _n, className, ...p }) => <code className={cn('rounded-md bg-sand px-1.5 py-0.5 font-mono text-[0.88em]', className)} {...p} />,
  pre: ({ node: _n, ...p }) => <pre className="mt-2.5 overflow-x-auto rounded-[14px] bg-char p-4 text-[13px] leading-relaxed text-white first:mt-0 [&_code]:bg-transparent [&_code]:p-0" {...p} />,
  hr: () => <hr className="my-4 border-char/10" />,
  table: ({ node: _n, ...p }) => (
    <div className="mt-2.5 overflow-x-auto first:mt-0">
      <table className="w-full border-collapse text-[14px]" {...p} />
    </div>
  ),
  th: ({ node: _n, ...p }) => <th className="border-b border-char/15 px-2 py-1.5 text-left font-semibold" {...p} />,
  td: ({ node: _n, ...p }) => <td className="border-b border-char/5 px-2 py-1.5" {...p} />,
};

/**
 * A chat message written in Markdown (bold, lists, links, tables). Raw HTML is never rendered and images are
 * left out, so a message can't load anything or inject markup.
 */
export default function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('break-words text-[15.5px] font-medium leading-[1.65] text-char/90', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS} skipHtml disallowedElements={['img']} unwrapDisallowed>
        {children}
      </ReactMarkdown>
    </div>
  );
}
