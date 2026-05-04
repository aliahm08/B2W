import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { aiSolutions } from '../../content/aiSolutions';

type SolutionsNavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const logoPath = 'M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z';
const logoRotations = [-28, -20, -12, -5, 6, 14, 22];
const logoOpacities = [0.12, 0.18, 0.26, 0.35, 0.47, 0.61, 0.74];

function SolutionsLockup() {
  return (
    <Link to="/solutions" aria-label="B2W" className="inline-flex items-center overflow-visible text-white">
      <svg viewBox="0 0 96 96" className="h-10 w-12 shrink-0 overflow-visible md:h-12 md:w-14">
        <path d={logoPath} fill="currentColor" fillOpacity="0.93" />
        {logoRotations.map((rotation, index) => (
          <path
            key={rotation}
            d={logoPath}
            fill="currentColor"
            fillOpacity={logoOpacities[index]}
            className="b2w-logo-layer"
            style={{ animationDelay: `${index * 0.34}s`, animationDuration: '7.2s' } as CSSProperties}
            transform={`rotate(${rotation} 48 48)`}
          />
        ))}
      </svg>
      <span aria-hidden="true" className="b2w-logo-wordmark-shell pr-1">
        <span className="b2w-wordmark inline-block text-xl font-medium tracking-[-0.09em] [transform:scaleY(0.94)] md:text-2xl">
          B2W
        </span>
      </span>
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
  ctaHref = '#ai-intake',
  ctaLabel = 'Talk to B2W AI',
}: SolutionsNavbarProps) {
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/8 bg-[#080a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        <SolutionsLockup />

        <nav className="hidden xl:flex xl:items-center xl:gap-5 xl:text-sm">
          <Link
            to="/solutions"
            className={`transition-colors ${desktopNavLinkClasses(location.pathname === '/solutions')}`}
          >
            Clara
          </Link>
          {aiSolutions.map((solution) => {
            const target = `/solutions/${solution.slug}`;
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
            href="https://chat.b2w-ai.com"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm font-medium text-neutral-400 transition-colors hover:text-white md:inline-flex"
          >
            Live Demo
          </a>
          <a
            href={ctaHref}
            className="inline-flex rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
          >
            {ctaLabel}
          </a>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-white/6 xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-5 px-6 py-3 text-sm">
          <Link
            to="/solutions"
            className={`whitespace-nowrap transition-colors ${mobileNavLinkClasses(location.pathname === '/solutions')}`}
          >
            Clara
          </Link>
          {aiSolutions.map((solution) => {
            const target = `/solutions/${solution.slug}`;
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
  );
}
