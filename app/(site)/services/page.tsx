import Image from 'next/image';
import Link from 'next/link';
import CtaBand from '@/components/corporate/CtaBand';
import FaqList from '@/components/corporate/FaqList';
import PageHero from '@/components/corporate/PageHero';
import { Button, Section, SectionHeader } from '@/components/corporate/ui';
import { generalFaq } from '@/lib/faq';
import { COMPANY, services } from '@/lib/site-data';
import JsonLd from '@/components/seo/JsonLd';
import { abs, breadcrumbLd, faqLd, pageMetadata, webPageLd } from '@/lib/seo';

const FAQ = generalFaq(COMPANY.email, 'www.hitroo.com/contact');

export const metadata = pageMetadata({
  title: 'Services — software, apps, automation and AI',
  description:
    'Custom software, mobile and desktop apps, AI models, AI automation, computer vision and managed services — designed, built, secured and supported by one team.',
  path: '/services',
  keywords: ['software development services', 'app development', 'AI development services', 'AI automation services', 'computer vision services', 'managed services'],
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={webPageLd('CollectionPage', 'Services', '/services', 'Custom software, apps, automation and AI services from HITROO.')} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.title, url: abs(`/services/${s.slug}`) })),
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: 'Services', path: '/services' }])} />
      <JsonLd data={faqLd(FAQ)} />
      <PageHero
        eyebrow="Services"
        title="What we build."
        lede="Software, automation and AI, built and supported by one team."
        actions={<Button href="/contact">Start a project</Button>}
      />

      <Section labelledBy="services-list" className="pt-12 lg:pt-20">
        <h2 id="services-list" className="sr-only">
          All services
        </h2>
        <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-mist">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 1240px) 275px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-5 text-[20px] font-medium tracking-[-0.015em] text-ink group-hover:text-cobalt">{s.label}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-slate-600">{s.short}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" title="Questions" />
        <div className="mt-10 lg:mt-14">
          <FaqList items={FAQ} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
