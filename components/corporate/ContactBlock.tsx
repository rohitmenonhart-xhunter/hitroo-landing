import { COMPANY } from '@/lib/site-data';
import LeadForm from './LeadForm';

/** Direct contact details beside the enquiry form. */
export default function ContactBlock({ idPrefix }: { idPrefix?: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <dl className="grid content-start gap-6 text-[16px] lg:col-span-4">
        <div>
          <dt className="text-[13px] font-medium text-slate-500">Email</dt>
          <dd className="mt-1">
            <a href={`mailto:${COMPANY.email}`} className="text-ink transition-colors hover:text-cobalt">
              {COMPANY.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-[13px] font-medium text-slate-500">Phone</dt>
          <dd className="mt-1">
            <a href={COMPANY.phoneHref} className="text-ink transition-colors hover:text-cobalt">
              {COMPANY.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-[13px] font-medium text-slate-500">Office</dt>
          <dd className="mt-1 text-ink">{COMPANY.location}</dd>
        </div>
      </dl>
      <div className="lg:col-span-8">
        <LeadForm idPrefix={idPrefix} />
      </div>
    </div>
  );
}
