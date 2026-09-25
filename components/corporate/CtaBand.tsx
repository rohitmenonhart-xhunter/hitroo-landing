import { Button, Container } from './ui';

/** The closing call to action on every page. */
export default function CtaBand({
  title = 'Let’s build what your business needs.',
  line = 'We reply within a day.',
  label = 'Start a project',
  href = '/contact',
}: {
  title?: string;
  line?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="py-28 sm:py-36 lg:py-48">
      <Container className="text-center">
        <h2
          id="cta-title"
          className="mx-auto max-w-3xl text-[34px] font-light leading-[1.08] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[44px] lg:text-[52px]"
        >
          {title}
        </h2>
        {line && <p className="mt-5 text-[17px] text-slate-600">{line}</p>}
        <div className="mt-10 flex justify-center">
          <Button href={href}>{label}</Button>
        </div>
      </Container>
    </section>
  );
}
