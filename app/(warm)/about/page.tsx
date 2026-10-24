import Link from 'next/link';
import { ArrowRight, Eye, Globe2, Languages, Layers, LifeBuoy, Lightbulb, MapPin, Palette, ShieldCheck, Users } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import FounderBlock from '@/components/warm/FounderBlock';
import OtherDivisions from '@/components/warm/OtherDivisions';
import PageIntro from '@/components/warm/PageIntro';
import StepCards from '@/components/warm/StepCards';
import { StandardsCard } from '@/components/warm/blocks';
import { LinkCards, PointCards, Statement, TEXT_LINK, WSection } from '@/components/warm/ui';
import { getContent } from '@/lib/content';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

/** About: its own copy is `page:about`; the founder, steps and promises are shared keys. */
export default async function AboutPage() {
  const [c, founder, steps, promises] = await Promise.all([getContent('page:about'), getContent('founder'), getContent('steps'), getContent('promises')]);
  return (
    <>
      <JsonLd data={webPageLd('AboutPage', 'About HITROO', '/about', 'HITROO is one foundation for software, automation, AI and creative growth.')} />
      <JsonLd data={breadcrumbLd([{ name: 'About', path: '/about' }])} />
      <PageIntro word="about" caption={c.intro.caption} title={c.intro.title} lede={c.intro.lede} />

      <Statement id="story-title" caption={c.story.caption} lines={c.story.lines} />

      <OtherDivisions caption={c.divisions.caption} title={c.divisions.title} />

      <WSection id="beliefs-title" caption={c.beliefs.caption} title={c.beliefs.title}>
        <PointCards items={c.beliefs.items} icons={[Users, Palette, Lightbulb, LifeBuoy]} columns={4} />
      </WSection>

      <FounderBlock founder={founder} link={false} />

      <WSection id="how-title" caption={c.how.caption} title={c.how.title}>
        <StepCards steps={steps} />
      </WSection>

      <StandardsCard id="count-title" caption={c.promises.caption} title={c.promises.title} items={promises} icons={[Users, Layers, ShieldCheck, Eye]} />

      <WSection id="where-title" caption={c.where.caption} title={c.where.title}>
        <PointCards items={c.where.items} icons={[MapPin, Globe2, Languages]} />
      </WSection>

      <Statement
        id="ai-view-title"
        caption={c.view.caption}
        lines={c.view.lines}
        action={
          <Link href={c.view.link.href} className={TEXT_LINK}>
            {c.view.link.label}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />

      <WSection id="next-title" caption={c.explore.caption} title={c.explore.title}>
        <LinkCards items={c.explore.links} />
      </WSection>

      <ClosingCta title={c.closing.title} line={c.closing.line} />
    </>
  );
}
