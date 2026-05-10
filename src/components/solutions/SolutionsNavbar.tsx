import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { aiSolutions } from '../../content/aiSolutions';
import MobileMenuDrawer from '../MobileMenuDrawer';

type SolutionsNavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

type ActiveClaraCta = 'header' | 'page' | null;

function SolutionsLockup({ isLogoAnimated = false }: { isLogoAnimated?: boolean }) {
  return (
    <Link to="/clara" aria-label="Clara" className="relative z-[110] inline-flex items-center gap-3 overflow-visible text-white">
      <span className={`clara-logo-mark ${isLogoAnimated ? 'is-breathing' : ''}`} aria-hidden="true">
        <img src="/brand/clara-logo-solid.png" alt="" className="clara-logo-image" />
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
  const [activeCta, setActiveCta] = useState<ActiveClaraCta>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const isCtaHovered = activeCta !== null;
  const dimmedHeaderClasses = isCtaHovered ? 'blur-sm opacity-35' : 'blur-0 opacity-100';
  const headerCtaClasses = activeCta === 'page' ? 'blur-sm opacity-35' : 'blur-0 opacity-100';
  const ctaIsExternal = ctaHref.startsWith('http');

  useEffect(() => {
    const revealHeader = () => setIsRevealed(true);
    const revealTimer = window.setTimeout(revealHeader, 5000);

    const handleScroll = () => {
      if (window.scrollY > 8) {
        revealHeader();
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(revealTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEnter = (event: MouseEvent | FocusEvent) => {
      const target = event.target;
      if (target instanceof Element) {
        const cta = target.closest<HTMLElement>('.clara-cta');
        if (cta) {
          setActiveCta(cta.dataset.claraCta === 'header' ? 'header' : 'page');
        }
      }
    };

    const handleLeave = (event: MouseEvent | FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const cta = target.closest('.clara-cta');
      if (!cta) {
        return;
      }

      const relatedTarget = event instanceof MouseEvent || event instanceof FocusEvent ? event.relatedTarget : null;
      if (relatedTarget instanceof Node && cta.contains(relatedTarget)) {
        return;
      }

      setActiveCta(null);
    };

    document.addEventListener('mouseover', handleEnter);
    document.addEventListener('mouseout', handleLeave);
    document.addEventListener('focusin', handleEnter);
    document.addEventListener('focusout', handleLeave);

    return () => {
      document.removeEventListener('mouseover', handleEnter);
      document.removeEventListener('mouseout', handleLeave);
      document.removeEventListener('focusin', handleEnter);
      document.removeEventListener('focusout', handleLeave);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[90] bg-[#080a0f]/10 backdrop-blur-[6px] transition-opacity duration-200 ${
          activeCta === 'header' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <header className="fixed inset-x-0 top-4 z-[100] px-4">
        <div className="relative mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-[#080a0f]/82 px-6 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isRevealed
                ? 'relative left-0 translate-x-0'
                : 'pointer-events-auto absolute left-1/2 -translate-x-1/2'
            }`}
          >
            <SolutionsLockup isLogoAnimated={isCtaHovered} />
          </div>

          <nav
            className={`hidden transition-[filter,opacity,transform] duration-500 md:flex md:items-center md:gap-3 md:text-xs lg:gap-5 lg:text-sm ${
              isRevealed
                ? `pointer-events-auto translate-y-0 ${dimmedHeaderClasses}`
                : 'pointer-events-none translate-y-1 opacity-0'
            }`}
          >
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

          <div
            className={`hidden items-center gap-3 transition-[filter,opacity,transform] duration-500 md:flex ${
              isRevealed
                ? `pointer-events-auto translate-y-0 ${headerCtaClasses}`
                : 'pointer-events-none translate-y-1 opacity-0'
            }`}
          >
            <a
              href={ctaHref}
              target={ctaIsExternal ? '_blank' : undefined}
              rel={ctaIsExternal ? 'noreferrer' : undefined}
              data-clara-cta="header"
              className="clara-cta relative z-[110] inline-flex overflow-hidden rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] transition-[box-shadow,opacity] duration-200 hover:opacity-95 hover:shadow-[0_14px_38px_rgba(255,255,255,0.14)] focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <span className="relative z-10">{ctaLabel}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className={`inline-flex items-center justify-center p-1 text-white transition-[opacity,transform,color] duration-500 hover:text-white md:hidden ${
              isRevealed ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
            }`}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <MobileMenuDrawer
          isOpen={isMobileMenuOpen}
          theme="dark"
          list={
            <div className="py-2">
              <Link
                to="/clara"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between gap-4 py-4 text-[17px] font-medium ${mobileNavLinkClasses(location.pathname === '/clara')}`}
              >
                <span>Clara</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500" />
              </Link>
              {aiSolutions.map((solution) => {
                const target = `/clara/${solution.slug}`;
                return (
                  <Link
                    key={solution.slug}
                    to={target}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between gap-4 py-4 text-[17px] font-medium ${mobileNavLinkClasses(location.pathname === target)}`}
                  >
                    <span>{solution.navLabel}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500" />
                  </Link>
                );
              })}
            </div>
          }
          cta={
            <a
              href={ctaHref}
              target={ctaIsExternal ? '_blank' : undefined}
              rel={ctaIsExternal ? 'noreferrer' : undefined}
              data-clara-cta="header"
              className="clara-cta relative inline-flex min-h-12 overflow-hidden rounded-full bg-white px-5 py-3 text-base font-semibold text-black transition-[box-shadow,opacity] duration-200 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <span className="relative z-10">{ctaLabel}</span>
            </a>
          }
        />
      </header>
    </>
  );
}
