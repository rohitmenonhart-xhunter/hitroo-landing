import type { Metadata } from 'next';
import { Eye, Layers, ShieldCheck, Users } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ContactPanel from '@/components/warm/ContactPanel';
import DivisionsScroller from '@/components/warm/DivisionsScroller';
import FaqSection from '@/components/warm/FaqSection';
import FilmSection from '@/components/warm/FilmSection';
import QuoteBlock from '@/components/warm/QuoteBlock';
import Glass from '@/components/warm/Glass';
import Marquee from '@/components/warm/Marquee';
import NeedPicker from '@/components/warm/NeedPicker';
import RecentPosts from '@/components/warm/RecentPosts';
import ScrollStatement from '@/components/warm/ScrollStatement';
import StickySteps from '@/components/warm/StickySteps';
import WarmHero from '@/components/warm/WarmHero';
import { TouchPill } from '@/components/warm/WarmHeader';
import { StandardsCard } from '@/components/warm/blocks';
import { Caption, H_L, P, Tight, WContainer, WSection } from '@/components/warm/ui';
import { findDivision, getContent, getDivisionVisuals } from '@/lib/content';
import { listPosts } from '@/lib/data/posts';
import { faqLd, pageMetadata, webPageLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent('home');
  return { ...pageMetadata({ title: meta.title, description: meta.description, path: '/' }), title: { absolute: meta.title } };
}

/** The home page: its own copy is the `home` key; the divisions, steps, promises, quote and questions are shared keys. */
export default async function Home() {
  const [home, posts, showcase, divisions, visuals, steps, promises, quote, faq, film] = await Promise.all([
    getContent('home'),
    listPosts(undefined, 4),
    getContent('showcase'),
    getContent('divisions'),
    getDivisionVisuals(),
    getContent('steps'),
    getContent('promises'),
    getContent('quote'),
    getContent('faq:general'),
    getContent('film:home'),
  ]);
  const cards = showcase.map((s) => ({ ...s, isNew: findDivision(divisions, s.slug)?.isNew, visual: visuals[s.slug] }));
  return (
    <>
      <JsonLd data={webPageLd('WebPage', home.meta.title, '/', home.meta.description)} />
      <JsonLd data={faqLd(faq)} />
      <WarmHero title={home.hero.title} lede={home.hero.lede} action={home.hero.action} tags={home.hero.tags} />

      {/* The HITROO film, right under the opening */}
      <FilmSection film={film} className="pt-20 lg:pt-28" />

      <ScrollStatement id="why-title" caption={home.why.caption} text={home.why.text} />

      {/* The four divisions, as large cards that move with the scroll */}
      <DivisionsScroller items={cards} names={divisions.map((d) => d.name)} copy={home.divisions} />

      <Marquee items={home.marquee.items} label={home.marquee.label} />

      <WSection id="steps-title" caption={home.steps.caption} title={home.steps.title}>
        <StickySteps steps={steps} />
      </WSection>

      <StandardsCard id="promises-title" caption={home.promises.caption} title={home.promises.title} items={promises} icons={[Users, Layers, ShieldCheck, Eye]} />

      <QuoteBlock quote={quote} />

      {/* I need… */}
      <section aria-labelledby="need-title" className="pb-20 lg:pb-28">
        <WContainer>
          <div className="flex items-end justify-between gap-8">
            <div>
              <Caption>{home.need.caption}</Caption>
              <h2 id="need-title" className={cn(H_L, 'mt-6')}>
                <Tight>{home.need.title}</Tight>
              </h2>
              <p className={cn(P, 'mt-4 max-w-[640px]')}>{home.need.lede}</p>
            </div>
            <Glass name="hi" className="hidden h-[200px] w-auto shrink-0 md:block lg:h-[240px]" />
          </div>
          <div className="mt-10">
            <NeedPicker items={home.need.items} prompt={home.need.prompt} placeholder={home.need.placeholder} />
          </div>
        </WContainer>
      </section>

      <RecentPosts posts={posts} title={home.posts.title} />

      <FaqSection items={faq} title={home.faq.title} />

      {/* Contact */}
      <section aria-labelledby="home-contact-title" className="pb-20 lg:pb-28">
        <ContactPanel idPrefix="home" title={home.contact.title} text={home.contact.text} />
        <WContainer className="mt-14 flex justify-center">
          <TouchPill href="/contact" label={home.contact.link} />
        </WContainer>
      </section>
    </>
  );
}
