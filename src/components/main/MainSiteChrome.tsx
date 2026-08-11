import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import B2WIcon from '../logo/B2WIcon';

export const mainPageWidth = 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10';

const navGroups = [
  {
    label: 'JasonAI',
    items: [
      ['JasonAI Overview', '/jasonai'],
      ['How It Works', '/jasonai/how-it-works'],
      ['Integrations', '/jasonai/integrations'],
      ['Security & Privacy', '/jasonai/security'],
    ],
  },
  {
    label: 'Contractors',
    items: [
      ['For Contractors', '/contractors'],
      ['General Contractors', '/contractors/general-contractors'],
      ['Design-Build Firms', '/contractors/design-build'],
      ['Specialty Contractors', '/contractors/specialty-contractors'],
    ],
  },
] as const;

function NavDropdown({ group }: { group: (typeof navGroups)[number] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={detailsRef} className="group relative">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#18201b] transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f79] [&::-webkit-details-marker]:hidden">
        {group.label}<ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
      </summary>
      <div className="absolute left-0 top-[calc(100%+.65rem)] z-50 w-72 rounded-2xl border border-black/10 bg-[#fffefa] p-2 shadow-[0_22px_70px_rgba(17,19,21,.16)]">
        {group.items.map(([label, to]) => (
          <Link key={to} to={to} onClick={() => detailsRef.current?.removeAttribute('open')} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#18201b] transition hover:bg-[#e7eef1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f79]">
            {label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export function MainSiteHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f7f5ef]/94 text-[#18201b] backdrop-blur-xl">
      <div className={`${mainPageWidth} flex min-h-20 items-center justify-between gap-5`}>
        <Link to="/" aria-label="B2W home" className="inline-flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f79]">
          <B2WIcon title="" className="h-8 w-9 overflow-visible" />
          <span className="text-sm font-bold tracking-[-.02em]">B2W</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => <NavDropdown key={group.label} group={group} />)}
          <Link to="/pricing" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition hover:bg-black/5">Pricing</Link>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/get-started" className="inline-flex min-h-11 items-center rounded-full bg-[#18201b] px-5 text-sm font-semibold text-white transition hover:bg-[#315f79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315f79] focus-visible:ring-offset-2">Try JasonAI</Link>
        </div>
        <button type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 lg:hidden">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen ? (
        <nav aria-label="Mobile navigation" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-black/10 bg-[#f7f5ef] px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-2xl gap-5">
            {navGroups.map((group) => (
              <section key={group.label}>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#315f79]">{group.label}</p>
                <div className="mt-2 grid border-l border-black/15 pl-3">
                  {group.items.map(([label, to]) => <Link key={to} to={to} className="flex min-h-11 items-center text-sm font-medium">{label}</Link>)}
                </div>
              </section>
            ))}
            <Link to="/pricing" className="flex min-h-11 items-center text-sm font-bold">Pricing</Link>
            <div className="border-t border-black/10 pt-5">
              <Link to="/get-started" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#18201b] px-5 text-sm font-semibold text-white">Try JasonAI</Link>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

const footerGroups = [
  { title: 'Product', items: [['JasonAI', '/jasonai'], ['How It Works', '/jasonai/how-it-works'], ['Integrations', '/jasonai/integrations'], ['Security', '/jasonai/security'], ['Pricing', '/pricing']] },
  { title: 'Contractors', items: [['Contractors', '/contractors'], ['General Contractors', '/contractors/general-contractors'], ['Design-Build', '/contractors/design-build'], ['Specialty Contractors', '/contractors/specialty-contractors']] },
  { title: 'Company', items: [['About', '/about'], ['Contact', 'mailto:info@b2w-ai.com'], ['Privacy', '/legal/privacy'], ['Terms', '/legal/terms']] },
] as const;

export function MainSiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#111614] text-white">
      <div className={`${mainPageWidth} py-14 sm:py-20`}>
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.5fr]">
          <div><B2WIcon title="B2W" className="h-10 w-11 overflow-visible" /><p className="mt-5 max-w-xs text-sm leading-7 text-white/58">Practical AI for contractors who need job information without another workflow.</p><a href="mailto:info@b2w-ai.com" className="mt-5 inline-flex text-sm font-semibold text-[#a9c7d4]">info@b2w-ai.com</a></div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {footerGroups.map((group) => <section key={group.title}><h2 className="text-xs font-bold uppercase tracking-[.14em] text-white/42">{group.title}</h2><ul className="mt-4 space-y-1">{group.items.map(([label, to]) => <li key={to}>{to.startsWith('mailto:') ? <a href={to} className="inline-flex min-h-9 items-center text-sm text-white/68 transition hover:text-white">{label}</a> : <Link to={to} className="inline-flex min-h-9 items-center text-sm text-white/68 transition hover:text-white">{label}</Link>}</li>)}</ul></section>)}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/42 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} B2W LLC</p><p>Keep the workflow. Add the assistant.</p></div>
      </div>
    </footer>
  );
}

export function MainSiteShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f7f5ef] text-[#18201b]"><MainSiteHeader /><main>{children}</main><MainSiteFooter /></div>;
}

export type Crumb = { label: string; to?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <nav aria-label="Breadcrumb" className={`${mainPageWidth} pt-28`}><ol className="flex flex-wrap items-center gap-2 text-xs text-[#18201b]/52"><li><Link to="/" className="underline-offset-4 hover:underline">Home</Link></li>{items.map((item) => <li key={item.label} className="flex items-center gap-2"><span aria-hidden="true">/</span>{item.to ? <Link to={item.to} className="underline-offset-4 hover:underline">{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}
