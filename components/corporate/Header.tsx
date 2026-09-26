import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RESOURCES, SERVICE_GROUPS, services, type NavItem } from '@/lib/site-data';
import BrandIcon from './BrandIcon';
import HeaderShell, { type HeaderMenu } from './HeaderShell';
import { ArrowLink } from './ui';

/** Support sits with managed services in the "Run" column: we keep your software running. */
const SUPPORT_ITEM = { href: '/support', label: 'Support app', line: 'First reply in 24 hours, most fixes in 48.', icon: '/icons/support.png' };

const EYEBROW = 'px-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-cobalt';

function MenuLink({ href, title, line, icon }: { href: string; title: string; line: string; icon: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-mist">
      <BrandIcon src={icon} size={40} eager />
      <span className="min-w-0">
        <span className="block text-[15px] font-medium text-ink group-hover:text-cobalt">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">{line}</span>
      </span>
    </Link>
  );
}

/** Server wrapper: renders the menu contents from site data; HeaderShell adds the behaviour. */
export default function Header() {
  const servicesPanel = (
    <div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9 grid grid-cols-3 gap-6">
          {SERVICE_GROUPS.map((g) => (
            <div key={g.id}>
              <p className={EYEBROW}>{g.label}</p>
              <p className="mt-1 px-3 text-[13px] text-slate-500">{g.line}</p>
              <ul className="mt-3 grid gap-1">
                {services
                  .filter((s) => s.group === g.id)
                  .map((s) => (
                    <li key={s.slug}>
                      <MenuLink href={`/services/${s.slug}`} title={s.label} line={s.short} icon={s.icon} />
                    </li>
                  ))}
                {g.id === 'run' && (
                  <li>
                    <MenuLink {...SUPPORT_ITEM} title={SUPPORT_ITEM.label} />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/ai-perspective" className="group col-span-3 flex flex-col overflow-hidden rounded-2xl bg-navy">
          <div className="relative aspect-[16/10]">
            <Image src="/photos/story-ai.webp" alt="" fill sizes="300px" loading="eager" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col px-5 pb-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cobalt-light">✦ Our view</p>
            <p className="mt-2 font-serif text-[21px] leading-snug text-cream">Is AI a threat to software firms?</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-medium text-cobalt-light transition-colors group-hover:text-white">
              Read our view
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>
      <div className="mt-6 flex items-center justify-between rounded-xl bg-mist px-5 py-4">
        <p className="text-[14px] text-slate-600">
          Not sure what you need?{' '}
          <Link href="/contact" className="font-medium text-cobalt hover:text-cobalt-dark">
            Talk to us
          </Link>
        </p>
        <ArrowLink href="/services">All services</ArrowLink>
      </div>
    </div>
  );

  const resourceColumn = (title: string, items: NavItem[]) => (
    <div>
      <p className={EYEBROW}>{title}</p>
      <ul className="mt-3 grid gap-1">
        {items.map((it) => (
          <li key={it.href}>
            <MenuLink href={it.href} title={it.label} line={it.line} icon={it.icon} />
          </li>
        ))}
      </ul>
    </div>
  );

  const resourcesPanel = (
    <div className="grid w-[600px] grid-cols-2 gap-4">
      {resourceColumn('Learn', RESOURCES.learn)}
      <div className="grid content-start gap-6">
        {resourceColumn('Company', RESOURCES.company)}
        {resourceColumn('Support', RESOURCES.support)}
      </div>
    </div>
  );

  const mobileGroup = (title: string, items: { href: string; label: string; icon: string }[]) => (
    <div key={title}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cobalt">{title}</p>
      <ul className="mt-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="flex items-center gap-3 py-2 text-[16px] text-slate-700">
              <BrandIcon src={it.icon} size={32} eager />
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const mobileServices = (
    <div className="grid gap-6 pb-5">
      {SERVICE_GROUPS.map((g) =>
        mobileGroup(
          g.label,
          services.filter((s) => s.group === g.id).map((s) => ({ href: `/services/${s.slug}`, label: s.label, icon: s.icon }))
        )
      )}
      <ArrowLink href="/services">All services</ArrowLink>
    </div>
  );

  const mobileResources = (
    <div className="grid gap-6 pb-5">
      {mobileGroup('Learn', RESOURCES.learn)}
      {mobileGroup('Company', RESOURCES.company)}
      {mobileGroup('Support', RESOURCES.support)}
    </div>
  );

  const menus: HeaderMenu[] = [
    { id: 'services', label: 'Services', panel: servicesPanel, wide: true, match: ['/services'] },
    { id: 'resources', label: 'Resources', panel: resourcesPanel, match: ['/insights', '/blog', '/articles', '/research', '/ai-perspective', '/news', '/brand'] },
  ];

  return (
    <HeaderShell
      menus={menus}
      mobile={[
        { id: 'services', label: 'Services', content: mobileServices },
        { id: 'resources', label: 'Resources', content: mobileResources },
      ]}
    />
  );
}
