import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MobileMenuDrawer from '../MobileMenuDrawer';

type SolutionsNavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

type ActiveClaraCta = 'header' | 'page' | null;

function SolutionsLockup({ isLogoAnimated = false }: { isLogoAnimated?: boolean }) {
  return (
    <div aria-label="Clara" className="relative z-[110] inline-flex items-center gap-3 overflow-visible text-white">
      <span className={`clara-logo-mark ${isLogoAnimated ? 'is-breathing' : ''}`} aria-hidden="true">
        <img src="/brand/clara-logo-solid.png" alt="" className="clara-logo-image" />
      </span>
      <span className="text-lg font-medium tracking-[-0.03em] md:text-xl">Clara</span>
    </div>
  );
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
  const headerCtaClasses = activeCta === 'page' ? 'blur-sm opacity-35' : 'blur-0 opacity-100';
  const ctaIsExternal = ctaHref.startsWith('http');

  useEffect(() => {
    const handleScroll = () => {
      setIsRevealed(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
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
        className={`pointer-events-none fixed inset-0 z-[90] bg-[#2b1724]/10 backdrop-blur-[6px] transition-opacity duration-200 ${
          activeCta === 'header' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <header className="fixed inset-x-0 top-4 z-[100] px-4">
        <div className="relative mx-auto flex min-h-[4.25rem] max-w-7xl items-center justify-between gap-4 rounded-full border border-[#e8cbd9]/14 bg-[#160f15]/84 px-6 py-3 shadow-[0_18px_70px_rgba(43,23,36,0.32)] backdrop-blur-xl">
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isRevealed
                ? 'relative left-0 translate-x-0'
                : 'pointer-events-auto absolute left-1/2 -translate-x-1/2'
            }`}
          >
            <SolutionsLockup isLogoAnimated={isCtaHovered} />
          </div>

          <div id="solutions-navbar-center-portal" className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[120]" />

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
              className="clara-cta relative z-[110] inline-flex overflow-hidden rounded-full bg-[#f5dce8] px-4 py-2 text-[13px] font-medium text-[#2b1724] shadow-[0_0_0_1px_rgba(245,220,232,0.22)] transition-[box-shadow,opacity] duration-200 hover:opacity-95 hover:shadow-[0_14px_38px_rgba(184,137,161,0.22)] focus:outline-none focus:ring-2 focus:ring-[#e8cbd9]/60"
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
            <div className="py-2" aria-hidden="true" />
          }
          cta={
            <a
              href={ctaHref}
              target={ctaIsExternal ? '_blank' : undefined}
              rel={ctaIsExternal ? 'noreferrer' : undefined}
              data-clara-cta="header"
              className="clara-cta relative inline-flex min-h-12 overflow-hidden rounded-full bg-[#f5dce8] px-5 py-3 text-base font-semibold text-[#2b1724] transition-[box-shadow,opacity] duration-200 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#e8cbd9]/60"
            >
              <span className="relative z-10">{ctaLabel}</span>
            </a>
          }
        />
      </header>
    </>
  );
}
