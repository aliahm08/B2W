import { Link } from 'react-router-dom';
import B2WIcon from './logo/B2WIcon';

const groups = [
  { title: 'Products', links: [['JasonAI', '/jasonai'], ['Clara', '/clara'], ['Pricing', '/pricing']] },
  { title: 'Solutions', links: [['General contractors', '/general-contractors'], ['Use cases', '/solutions/business-use-cases'], ['How B2W works', '/solutions/ai-workflows']] },
  { title: 'JasonAI', links: [['How it works', '/jasonai/how-it-works'], ['Questions', '/jasonai/questions'], ['Privacy', '/jasonai/privacy']] },
  { title: 'Resources', links: [['Guides', '/resources/guides'], ['Tools', '/resources/tools'], ['Demonstrations', '/resources/demonstrations'], ['Case studies', '/resources/case-studies']] },
  { title: 'Company', links: [['About', '/about'], ['Contact', '/contact'], ['Internal workspace', '/internal']] },
] as const;

export default function Footer({ basePath = '' }: { basePath?: string }) {
  const routeTo = (to: string) => to.startsWith('/internal') ? to : (`${basePath}${to === '/' ? '' : to}` || '/');

  return (
    <footer className="border-t border-white/10 bg-[var(--b2w-forest-deep)] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(250px,.8fr)_minmax(0,1.6fr)]">
          <div>
            <Link to={routeTo('/')} aria-label="B2W home" className="group inline-flex items-center gap-3">
              <B2WIcon title="" className="h-10 w-11 overflow-visible text-white transition-transform duration-300 group-hover:scale-105" />
              <span className="text-lg font-semibold tracking-[-0.02em]">B2W</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
              B2W builds practical AI tools that help contractors find job context, create clearer outputs, and keep work moving.
            </p>
            <a href="mailto:info@b2w-ai.com" className="mt-4 inline-flex text-sm font-semibold text-[var(--b2w-gold)] transition hover:text-white">info@b2w-ai.com</a>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 min-[360px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">{group.title}</p>
                <ul className="mt-2.5 space-y-0.5">
                  {group.links.map(([label, to]) => (
                    <li key={to}><Link to={routeTo(to)} className="inline-flex min-h-8 items-center text-[13px] text-white/65 transition hover:text-white">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} B2W LLC. All rights reserved.</p>
          <p>Ask clearly · Find context · Move work forward</p>
        </div>
      </div>
    </footer>
  );
}
