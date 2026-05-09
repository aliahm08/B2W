import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { aiSolutions } from '../../content/aiSolutions';

type SolutionsNavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

function SolutionsLockup({ isLogoAnimated = false }: { isLogoAnimated?: boolean }) {
  return (
    <Link to="/clara" aria-label="Clara" className="relative z-[110] inline-flex items-center gap-3 overflow-visible text-white">
      <span className={`clara-logo-mark ${isLogoAnimated ? 'is-breathing' : ''}`} aria-hidden="true">
        <svg className="clara-logo-interior" viewBox="0 0 100 100" focusable="false">
          <path
            className="clara-logo-organic clara-logo-organic-1"
            d="M37 47 C43 34 61 33 67 45 C75 60 64 76 48 72 C35 69 30 58 37 47 Z"
          >
            <animate
              attributeName="d"
              dur="3.6s"
              repeatCount="indefinite"
              values="
                M37 47 C43 34 61 33 67 45 C75 60 64 76 48 72 C35 69 30 58 37 47 Z;
                M34 48 C42 31 64 36 70 50 C76 65 60 78 45 72 C31 67 28 58 34 48 Z;
                M38 43 C49 31 67 39 68 55 C69 71 52 78 40 68 C29 58 30 49 38 43 Z;
                M37 47 C43 34 61 33 67 45 C75 60 64 76 48 72 C35 69 30 58 37 47 Z
              "
            />
          </path>
          <path
            className="clara-logo-organic clara-logo-organic-2"
            d="M42 50 C48 41 61 42 64 52 C68 64 57 72 47 68 C38 64 36 57 42 50 Z"
          >
            <animate
              attributeName="d"
              dur="3.6s"
              begin="-1.2s"
              repeatCount="indefinite"
              values="
                M42 50 C48 41 61 42 64 52 C68 64 57 72 47 68 C38 64 36 57 42 50 Z;
                M39 50 C47 38 62 43 66 54 C69 66 55 72 45 67 C36 62 35 56 39 50 Z;
                M43 47 C51 39 63 45 63 57 C63 68 50 73 42 65 C36 59 37 52 43 47 Z;
                M42 50 C48 41 61 42 64 52 C68 64 57 72 47 68 C38 64 36 57 42 50 Z
              "
            />
          </path>
        </svg>
        <img src="/brand/clara-logo.png" alt="" className="relative z-10 h-7 w-7 object-contain invert md:h-8 md:w-8" />
      </span>
      <span className="text-lg font-medium tracking-[-0.03em] md:text-xl">Clara</span>
    </Link>
  );
}

function desktopNavLinkClasses(isActive: boolean) {
  return isActive
    ? 'font-semibold text-white'
    : 'font-medium text-neutral-400 hover:text-white';
}

function mobileNavLinkClasses(isActive: boolean) {
  return isActive
    ? 'text-white'
    : 'text-neutral-400 hover:text-white';
}

export default function SolutionsNavbar({
  ctaHref = 'https://chat.b2w-ai.com',
  ctaLabel = 'Talk to Clara',
}: SolutionsNavbarProps) {
  const location = useLocation();
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const dimmedHeaderClasses = isCtaHovered ? 'blur-sm opacity-35' : 'blur-0 opacity-100';

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[90] bg-[#080a0f]/10 backdrop-blur-[6px] transition-opacity duration-200 ${
          isCtaHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#080a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
          <SolutionsLockup isLogoAnimated={isCtaHovered} />

        <nav className={`hidden transition-[filter,opacity] duration-200 xl:flex xl:items-center xl:gap-5 xl:text-sm ${dimmedHeaderClasses}`}>
          <Link
            to="/clara"
            className={`transition-colors ${desktopNavLinkClasses(location.pathname === '/clara')}`}
          >
            Clara
          </Link>
          {aiSolutions.map((solution) => {
            const target = `/clara/${solution.slug}`;
            return (
              <Link
                key={solution.slug}
                to={target}
                className={`transition-colors ${desktopNavLinkClasses(location.pathname === target)}`}
              >
                {solution.navLabel}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={ctaHref}
            target={ctaHref.startsWith('http') ? '_blank' : undefined}
            rel={ctaHref.startsWith('http') ? 'noreferrer' : undefined}
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => setIsCtaHovered(false)}
            onFocus={() => setIsCtaHovered(true)}
            onBlur={() => setIsCtaHovered(false)}
            className="clara-cta relative z-[110] inline-flex overflow-hidden rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] transition-[box-shadow,opacity] duration-200 hover:opacity-95 hover:shadow-[0_14px_38px_rgba(255,255,255,0.14)] focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span className="relative z-10">{ctaLabel}</span>
          </a>
        </div>
      </div>

      <div className={`overflow-x-auto border-t border-white/6 transition-[filter,opacity] duration-200 xl:hidden ${dimmedHeaderClasses}`}>
        <div className="mx-auto flex max-w-7xl gap-5 px-6 py-3 text-sm">
          <Link
            to="/clara"
            className={`whitespace-nowrap transition-colors ${mobileNavLinkClasses(location.pathname === '/clara')}`}
          >
            Clara
          </Link>
          {aiSolutions.map((solution) => {
            const target = `/clara/${solution.slug}`;
            return (
              <Link
                key={solution.slug}
                to={target}
                className={`whitespace-nowrap transition-colors ${mobileNavLinkClasses(location.pathname === target)}`}
              >
                {solution.navLabel}
              </Link>
            );
          })}
        </div>
      </div>
      </header>
    </>
  );
}
