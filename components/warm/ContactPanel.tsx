import LeadForm, { type InterestGroup } from '@/components/corporate/LeadForm';
import { getContent } from '@/lib/content';
import { cn } from '@/lib/utils';
import LocalTime from './LocalTime';
import { Caption, H_M, P, Tight, WContainer } from './ui';

/** The form's "Interested in" choices: each division's services (Creatives as one choice). */
async function interestGroups(): Promise<InterestGroup[]> {
  const [divisions, services] = await Promise.all([getContent('divisions'), getContent('services')]);
  return divisions.map((d) => ({
    label: d.name,
    options: d.slug === 'creatives' ? ['Social media, done for you'] : services.filter((s) => s.division === d.slug).map((s) => s.label),
  }));
}

/** Two frosted cards: how to reach us (with our local time) and the enquiry form. */
export default async function ContactPanel({ idPrefix, title, text }: { idPrefix: string; title: string; text: string }) {
  const [COMPANY, groups] = await Promise.all([getContent('company'), interestGroups()]);
  return (
    <WContainer className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
      <div className="glass-warm flex flex-col rounded-[28px] p-8 sm:p-10">
        <Caption>Contact</Caption>
        <h2 id={`${idPrefix}-contact-title`} className={cn(H_M, 'mt-6')}>
          <Tight>{title}</Tight>
        </h2>
        <p className={cn(P, 'mt-4')}>{text}</p>
        <dl className="mt-10 grid gap-5 text-[17px] font-medium">
          <div>
            <dt className="text-[14px] text-stone">Phone</dt>
            <dd>
              <a href={COMPANY.phoneHref} className="text-char hover:text-ember">
                {COMPANY.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-stone">Email</dt>
            <dd>
              <a href={`mailto:${COMPANY.email}`} className="text-char hover:text-ember">
                {COMPANY.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[14px] text-stone">Office</dt>
            <dd className="text-char">{COMPANY.location}</dd>
          </div>
        </dl>
        <p className="mt-auto flex items-center gap-2 pt-10 text-[15px] font-medium text-stone">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ember" />
          <LocalTime />
        </p>
      </div>
      <div className="glass-warm rounded-[28px] p-8 sm:p-10">
        <LeadForm idPrefix={idPrefix} companyEmail={COMPANY.email} groups={groups} />
      </div>
    </WContainer>
  );
}
