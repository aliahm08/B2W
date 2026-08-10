import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const serviceAreas = [
  {
    label: 'Strategy',
    description: 'Company direction, customer problem, product architecture, and the current operating position.',
    to: '/internal/business-plan#company',
  },
  {
    label: 'Systems',
    description: 'Revenue model, stage progression, commercial gates, and the systems to build next.',
    to: '/internal/business-plan#revenue',
  },
  {
    label: 'Implementation',
    description: 'Ownership, financial progression, phase plan, and the execution tracker.',
    to: '/internal/business-plan#ownership',
  },
];

const products = [
  {
    label: 'JasonAI',
    status: 'Pre-launch',
    description: 'The productization workspace, phases, measures, and supporting documentation.',
    to: '/internal/portal/product',
  },
  {
    label: 'Clara',
    status: 'Concept phase',
    description: 'A future product concept held outside the current JasonAI productization sequence.',
    to: '/internal/products/clara',
  },
];

function MenuPanel({ items }: { items: Array<{ label: string; description: string; to: string; status?: string }> }) {
  return (
    <div className="invisible absolute left-0 top-[calc(100%+.65rem)] z-50 w-[min(20rem,calc(100vw-2rem))] translate-y-1 rounded-2xl border border-[#223C33]/12 bg-white p-2 opacity-0 shadow-[0_24px_70px_rgba(23,34,30,.14)] transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-open:visible group-open:translate-y-0 group-open:opacity-100">
      {items.map((item) => (
        <Link key={item.to} to={item.to} className="flex items-center justify-between gap-4 rounded-xl p-4 transition hover:bg-[#F6F3EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B38B39]">
          <span>
            <span className="flex items-center gap-2 text-sm font-semibold text-[#17221E]">
              {item.label}
              {item.status ? <span className="rounded-full bg-[#EDE4D1] px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[#7A5A1E]">{item.status}</span> : null}
            </span>
            <span className="mt-1 block text-xs leading-5 text-[#223C33]/55">{item.description}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#223C33]/35" />
        </Link>
      ))}
    </div>
  );
}

export default function InternalDocumentNav({ className = '' }: { className?: string }) {
  const { pathname } = useLocation();
  const servicesActive = pathname.startsWith('/internal/business-plan');
  const productsActive = pathname.startsWith('/internal/portal') || pathname.startsWith('/internal/products');
  const resourcesActive = pathname.startsWith('/internal/resources');
  const baseClass = 'inline-flex min-h-10 items-center rounded-full px-4 text-xs font-semibold transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B38B39]';

  return (
    <nav aria-label="Internal website" className={`border-t border-[#223C33]/10 bg-[#F8F5EE]/94 backdrop-blur-xl ${className}`}>
      <div className="mx-auto flex min-h-14 max-w-[1600px] items-center justify-between gap-4 overflow-visible px-4 sm:px-6">
        <div className="flex items-center gap-1">
          <details className="group relative">
            <summary className={`${baseClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden ${servicesActive ? 'bg-[#223C33] text-white hover:bg-[#223C33]' : 'text-[#223C33]/65'}`}>
              Services <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
            </summary>
            <MenuPanel items={serviceAreas} />
          </details>
          <details className="group relative">
            <summary className={`${baseClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden ${productsActive ? 'bg-[#223C33] text-white hover:bg-[#223C33]' : 'text-[#223C33]/65'}`}>
              Products <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
            </summary>
            <MenuPanel items={products} />
          </details>
          <Link to="/internal/resources" className={`${baseClass} ${resourcesActive ? 'bg-[#223C33] text-white hover:bg-[#223C33]' : 'text-[#223C33]/65'}`}>
            Resources
          </Link>
        </div>
        <Link to="/" className="hidden min-h-9 items-center rounded-full border border-[#223C33]/12 bg-white/60 px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#223C33]/55 transition hover:bg-white hover:text-[#223C33] sm:inline-flex">
          Live website <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Link>
      </div>
    </nav>
  );
}
