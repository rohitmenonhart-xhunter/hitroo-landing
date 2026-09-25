import ContactBlock from '@/components/corporate/ContactBlock';
import PageHero from '@/components/corporate/PageHero';
import { Section } from '@/components/corporate/ui';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbLd, webPageLd } from '@/lib/seo';

export default function ContactPage() {
  return (
    <>
      <JsonLd data={webPageLd('ContactPage', 'Contact HITROO', '/contact', 'Tell us what you need. We reply within a day.')} />
      <JsonLd data={breadcrumbLd([{ name: 'Contact', path: '/contact' }])} />
      <PageHero eyebrow="Contact" title="Let’s talk." lede="Tell us what you need. We reply within a day." />
      <Section labelledBy="page-title" className="pt-12 lg:pt-16">
        <ContactBlock idPrefix="contact" />
      </Section>
    </>
  );
}
