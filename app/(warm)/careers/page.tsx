import { CalendarDays, Globe2, TrendingUp } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import CareersForm from '@/components/corporate/CareersForm';
import PageIntro from '@/components/warm/PageIntro';
import StepCards from '@/components/warm/StepCards';
import { PointCards, WSection } from '@/components/warm/ui';
import { getContent } from '@/lib/content';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

/** Careers: its copy is `page:careers`; "{email}" in the note becomes the company email as a link. */
export default async function CareersPage() {
  const [c, company] = await Promise.all([getContent('page:careers'), getContent('company')]);
  const [before, after = ''] = c.apply.note.split('{email}');
  return (
    <>
      <JsonLd data={webPageLd('WebPage', 'Careers', '/careers', 'Roles in software, AI/ML and hardware engineering at hitroo.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Careers', path: '/careers' }])} />
      <PageIntro word="careers" caption={c.intro.caption} title={c.intro.title} lede={c.intro.lede} />

      <WSection id="expect-title" caption={c.expect.caption} title={c.expect.title}>
        <PointCards icons={[CalendarDays, TrendingUp, Globe2]} items={c.expect.items} />
      </WSection>

      <WSection id="steps-title" caption={c.steps.caption} title={c.steps.title}>
        <StepCards steps={c.steps.items} />
      </WSection>

      <WSection id="apply-title" caption={c.apply.caption} title={c.apply.title}>
        <div className="glass-warm rounded-[32px] p-8 sm:p-10 lg:p-12">
          <CareersForm email={company.email} />
        </div>
        <p className="mt-10 max-w-2xl text-[16px] font-medium leading-relaxed text-stone">
          {before}
          {c.apply.note.includes('{email}') && (
            <a href={`mailto:${company.email}`} className="text-char underline decoration-char/30 underline-offset-4 hover:decoration-char">
              {company.email}
            </a>
          )}
          {after}
        </p>
      </WSection>
    </>
  );
}
