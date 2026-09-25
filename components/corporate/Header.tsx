import Link from 'next/link';
import { services } from '@/lib/site-data';
import HeaderShell from './HeaderShell';
import { ArrowLink } from './ui';

/** Server wrapper: renders the menu contents from site data, the shell adds the behaviour. */
export default function Header() {
  const servicesMenu = (
    <div className="flex items-start justify-between gap-10">
      <ul className="grid flex-1 grid-cols-4 gap-2">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-mist">
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-cobalt" strokeWidth={1.6} />
                <span className="text-[15px] font-medium text-ink group-hover:text-cobalt">{s.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ArrowLink href="/services" className="mt-3 shrink-0">
        All services
      </ArrowLink>
    </div>
  );

  const mobileServices = (
    <ul className="pb-3">
      <li>
        <Link href="/services" className="block py-2.5 pl-4 text-[16px] font-medium text-cobalt">
          All services
        </Link>
      </li>
      {services.map((s) => (
        <li key={s.slug}>
          <Link href={`/services/${s.slug}`} className="block py-2.5 pl-4 text-[16px] text-slate-700">
            {s.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return <HeaderShell servicesMenu={servicesMenu} mobileServices={mobileServices} />;
}
