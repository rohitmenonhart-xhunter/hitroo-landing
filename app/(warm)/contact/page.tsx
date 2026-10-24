import JsonLd from '@/components/seo/JsonLd';
import ContactPanel from '@/components/warm/ContactPanel';
import FaqSection from '@/components/warm/FaqSection';
import PageIntro from '@/components/warm/PageIntro';
import StepCards from '@/components/warm/StepCards';
import { LinkCards, WSection } from '@/components/warm/ui';
import { getContent } from '@/lib/content';
import { breadcrumbLd, faqLd, webPageLd } from '@/lib/seo';

/** Contact: its copy is `page:contact`; the phone, email and office come from `company`. */
export default async function ContactPage() {
  const c = await getContent('page:contact');
  return (
    <>
      <JsonLd data={webPageLd('ContactPage', 'Contact HITROO', '/contact', 'Tell us what you need. We reply within a day.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Contact', path: '/contact' }])} />
      <JsonLd data={faqLd(c.faq.items)} />
      <PageIntro word="contact" caption={c.intro.caption} title={c.intro.title} lede={c.intro.lede} />

      <section aria-labelledby="contact-contact-title" className="pb-20 lg:pb-28">
        <ContactPanel idPrefix="contact" title={c.panel.title} text={c.panel.text} />
      </section>

      <WSection id="next-steps-title" caption={c.next.caption} title={c.next.title} lede={c.next.lede}>
        <StepCards steps={c.next.items} />
      </WSection>

      <FaqSection items={c.faq.items} title={c.faq.title} />

      <WSection id="explore-title" caption={c.explore.caption} title={c.explore.title}>
        <LinkCards items={c.explore.links} />
      </WSection>
    </>
  );
}
