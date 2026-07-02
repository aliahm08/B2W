import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MobileMenuDrawer from '../MobileMenuDrawer';

type SolutionsNavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

type ActiveClaraCta = 'header' | 'page' | null;

function SolutionsLockup({ isLogoAnimated = false }: { isLogoAnimated?: boolean }) {
  return (
    <div aria-label="Clara" className="relative z-[110] inline-flex items-center gap-2 overflow-visible text-white">
      <button 
        onClick={() => document.dispatchEvent(new CustomEvent('solutions-navigate-to-step', { detail: 0 }))}
        className="inline-flex items-center gap-3 hover:opacity-85 transition-opacity focus:outline-none"
      >
        <span className={`clara-logo-mark ${isLogoAnimated ? 'is-breathing' : ''}`} aria-hidden="true">
          <img src="/brand/clara-logo-solid.png" alt="" className="clara-logo-image" />
        </span>
        <span className="text-lg font-medium tracking-[-0.03em] md:text-xl">Clara</span>
      </button>
      <span className="text-xs text-neutral-600 font-mono select-none">/</span>
      <Link to="/" className="text-[10px] font-bold tracking-wider text-neutral-400 hover:text-white transition-colors bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
        B2W
      </Link>
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
  const [activeStep, setActiveStep] = useState<string>('Capture');
  const isCtaHovered = activeCta !== null;
  const headerCtaClasses = activeCta === 'page' ? 'blur-sm opacity-35' : 'blur-0 opacity-100';
  const ctaIsExternal = ctaHref.startsWith('http');

  const navItems = [
    { label: 'Capture', step: 1 },
    { label: 'Scope', step: 2 },
    { label: 'Estimate', step: 3 }
  ];

  useEffect(() => {
    const handleStepChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setActiveStep(customEvent.detail || '');
    };
    document.addEventListener('solutions-active-step-change', handleStepChange);
    return () => {
      document.removeEventListener('solutions-active-step-change', handleStepChange);
    };
  }, []);

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
    const handleCloseMenu = () => {
      setIsMobileMenuOpen(false);
    };
    document.addEventListener('close-solutions-mobile-menu', handleCloseMenu);
    return () => {
      document.removeEventListener('close-solutions-mobile-menu', handleCloseMenu);
    };
  }, []);

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
            <div className="py-2 flex flex-col gap-4 text-left px-2 w-full">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-white/10 pb-2">Sections</p>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.step}
                    onClick={() => {
                      document.dispatchEvent(new CustomEvent('solutions-navigate-to-step', { detail: item.step }));
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-base font-semibold py-2 px-3 rounded-lg transition-colors ${
                      activeStep === item.label
                        ? 'bg-[#f5dce8]/15 text-[#f5dce8]'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* B2W Back Link */}
              <div className="mt-2 border-t border-white/10 pt-4 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Back</p>
                <Link 
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left text-base font-semibold py-2 px-3 rounded-lg text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  B2W Homepage
                </Link>
              </div>
            </div>
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
