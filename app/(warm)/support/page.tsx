import { Bug, Eye, HelpCircle, Laptop, Layers, Lightbulb, Monitor, MonitorSmartphone, Settings2, ShieldCheck, Smartphone, Users, type LucideIcon } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ClosingCta from '@/components/warm/ClosingCta';
import FaqSection from '@/components/warm/FaqSection';
import PageIntro from '@/components/warm/PageIntro';
import ScrollStatement from '@/components/warm/ScrollStatement';
import StickySteps from '@/components/warm/StickySteps';
import { TouchPill } from '@/components/warm/WarmHeader';
import { StandardsCard } from '@/components/warm/blocks';
import { LinkCards, PointCards, WSection } from '@/components/warm/ui';
import { getContent } from '@/lib/content';
import { breadcrumbLd, faqLd, webPageLd } from '@/lib/seo';

const PLATFORM_ICONS: Record<string, LucideIcon> = { iOS: Smartphone, Android: Smartphone, Windows: Monitor, macOS: Laptop };

/** Support (the HITROO app): its copy is `page:support`; the promises are shared. */
export default async function SupportPage() {
  const [c, promises] = await Promise.all([getContent('page:support'), getContent('promises')]);
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Support', '/support', 'Support from the engineers who built your software, followed from report to release in the HITROO app.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Support', path: '/support' }])} />
      <JsonLd data={faqLd(c.faq.items)} />
      <PageIntro word="support" caption={c.intro.caption} title={c.intro.title} lede={c.intro.lede} action={<TouchPill label={c.intro.action} />} />

      <ScrollStatement id="promise-title" caption={c.manifesto.caption} text={c.manifesto.text} />

      <WSection id="steps-title" caption={c.stages.caption} title={c.stages.title}>
        <StickySteps steps={c.stages.items} />
      </WSection>

      <WSection id="topics-title" caption={c.topics.caption} title={c.topics.title} lede={c.topics.lede}>
        <PointCards items={c.topics.items} icons={[Bug, Settings2, HelpCircle, Lightbulb]} columns={4} />
      </WSection>

      <WSection id="platforms-title" caption={c.platforms.caption} title={c.platforms.title}>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {c.platforms.items.map((p) => {
            const Icon = PLATFORM_ICONS[p] ?? MonitorSmartphone;
            return (
              <li key={p} className="glass-warm flex h-40 flex-col justify-between rounded-[24px] p-6">
                <Icon aria-hidden="true" className="h-6 w-6 text-ember" strokeWidth={1.75} />
                <span className="font-display text-[clamp(22px,1.9vw,28px)] font-bold tracking-[-0.03em] text-char">{p}</span>
              </li>
            );
          })}
        </ul>
      </WSection>

      <StandardsCard id="count-title" caption={c.promises.caption} title={c.promises.title} items={promises} icons={[Users, Layers, ShieldCheck, Eye]} />

      <FaqSection items={c.faq.items} title={c.faq.title} />

      <WSection id="next-title" caption={c.next.caption} title={c.next.title}>
        <LinkCards items={c.next.links} />
      </WSection>

      <ClosingCta title={c.closing.title} line={c.closing.line} label={c.closing.action} />
    </>
  );
}
