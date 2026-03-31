import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MobileMenuDrawer from './MobileMenuDrawer';
import B2WLogoMark from './B2WLogoMark';
import FieldBossIcon from './uyghur-eats/FieldBossIcon';
import FieldBossChatTray from './uyghur-eats/FieldBossChatTray';

export type ClientNavAction = {
  label: string;
  onClick?: () => void;
  to?: string;
  type?: 'link' | 'button' | 'cta';
  items?: ClientNavAction[]; // For dropdowns
};

export default function ClientNavbar({ 
  clientName, 
  clientLink,
  navItems,
  theme = 'light',
  hasFieldBoss = false,
}: { 
  clientName?: string;
  clientLink?: string;
  navItems?: ClientNavAction[];
  theme?: 'light' | 'dark';
  hasFieldBoss?: boolean;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFieldBossOpen, setIsFieldBossOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeDropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const getCurrentPageMeta = () => {
    const pathname = location.pathname.replace(/\/+$/, '') || '/';
    const pathWithHash = `${pathname}${location.hash}`;

    if (
      pathname === '/client/uyghur-eats' ||
      pathname === '/portal/uyghur-eats' ||
      pathname === '/client/foster-partners'
    ) {
      return null;
    }

    const routeMap: Record<string, string> = {
      '/client/uyghur-eats/profile': 'Profile',
      '/client/uyghur-eats/valuation': 'Valuation',
      '/client/uyghur-eats/valuation#revenue': 'Valuation',
      '/client/uyghur-eats/valuation#earnings': 'Valuation',
      '/client/uyghur-eats/valuation#comparables': 'Valuation',
      '/client/uyghur-eats/valuation#range': 'Valuation',
      '/client/uyghur-eats/data-room': 'Data Room',
      '/client/uyghur-eats/terms': 'Terms',
      '/client/uyghur-eats/fieldboss-chatbot': 'Summarize Proposal',
      '/client/uyghur-eats/fieldboss-agent-manager': 'Communication Notes',
      '/client/uyghur-eats/fieldboss-dashboard': 'Project Snapshot',
      '/client/foster-partners/development-dashboard': 'Development Dashboard',
      '/client/foster-partners/development-dashboard/design': 'Design Lifecycle',
      '/client/foster-partners/development-dashboard/build': 'Build Lifecycle',
      '/client/foster-partners/development-dashboard/development': 'Development Lifecycle',
      '/client/foster-partners/scope': 'Scope',
      '/client/foster-partners/operating-model': 'Operating Model',
      '/client/foster-partners/governance': 'Governance',
      '/client/foster-partners/terms': 'Terms',
    };

    const label = routeMap[pathWithHash] ?? routeMap[pathname];
    if (!label) {
      return null;
    }

    return { label, to: pathWithHash };
  };

  const currentPageMeta = getCurrentPageMeta();
  const clientSubpages = navItems?.filter((item) => item.type !== 'cta') ?? [];
  const nestedDeliverableLabels = new Set(['Profile', 'Valuation', 'Documentation']);
  const isDarkTheme = theme === 'dark' || isFieldBossOpen || isMobileMenuOpen;

  const breadcrumbLinkClassName =
    `group inline-flex items-center text-sm font-medium tracking-tight transition-colors ${isDarkTheme ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'}`;
  const breadcrumbArrowClassName =
    'ml-0 inline-flex w-0 overflow-hidden opacity-0 transition-all duration-200 ease-out group-hover:ml-1.5 group-hover:w-3.5 group-hover:opacity-100';
  const mobileMenuLinkClassName =
    'flex min-h-0 items-center gap-2 py-3 text-left text-[17px] font-medium text-stone-100 transition-colors hover:text-white';
  
  const navClassName = isFieldBossOpen
    ? 'fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#08131b] text-white transition-colors duration-150'
    : isDarkTheme
      ? `fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-150 ${
          isMobileMenuOpen ? 'border-white/10 bg-black/92 text-white' : 'border-white/10 bg-[#071019]/88 text-white'
        }`
      : `fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-150 ${
          isMobileMenuOpen ? 'border-white/10 bg-[#050b10]/96 text-white' : 'border-neutral-100 bg-white/80 text-black'
        }`;

  const dropdownClassName = isDarkTheme
    ? 'absolute top-full left-0 mt-2 min-w-56 border border-white/10 bg-[#08131b] py-2 shadow-xl'
    : 'absolute top-full left-0 mt-2 min-w-56 border border-neutral-200 bg-white py-2 shadow-xl';
  const desktopNavClassName = isDarkTheme
    ? 'hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300'
    : 'hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600';
  const desktopLinkClassName = isDarkTheme ? 'hover:text-white transition-colors' : 'hover:text-black transition-colors';
  const ctaClassName = isDarkTheme
    ? 'bg-white text-black px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest font-semibold'
    : 'bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all text-xs uppercase tracking-widest font-semibold';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    // Watch for hash change to open FieldBoss
    const currentHash = window.location.hash;
    if (currentHash === '#fieldboss') {
      setIsFieldBossOpen(true);
      // Optional: remove hash without scroll jump
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeDropdownTimeoutRef.current) {
        clearTimeout(closeDropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (location.hash === '#fieldboss') {
      setIsFieldBossOpen(true);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [location.hash, location.pathname]);

  const openClientDropdown = () => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
      closeDropdownTimeoutRef.current = null;
    }
    setOpenDropdown('client-pages');
  };

  const closeClientDropdownWithDelay = () => {
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown((current) => (current === 'client-pages' ? null : current));
      closeDropdownTimeoutRef.current = null;
    }, 180);
  };

  const renderNavItem = (item: ClientNavAction) => {
    if (item.type === 'link' && item.to) {
      return (
        <Link key={item.label} to={item.to} className={desktopLinkClassName}>
          {item.label}
        </Link>
      );
    }

    if (item.items) {
      return (
        <div key={item.label} className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
            className={`flex items-center gap-1 transition-colors ${isDarkTheme ? 'hover:text-white' : 'hover:text-black'}`}
          >
            {item.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === item.label && (
            <div className={isDarkTheme ? 'absolute top-full left-0 mt-2 w-56 bg-[#08131b] border border-white/10 shadow-xl py-2' : 'absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-100 shadow-xl py-2'}>
              {item.items.map((subItem) => (
                <button
                  key={subItem.label}
                  onClick={() => {
                    subItem.onClick?.();
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 transition-colors ${isDarkTheme ? 'text-neutral-300 hover:bg-white/5 hover:text-white' : 'hover:bg-neutral-50 text-neutral-600 hover:text-black'}`}
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (item.type === 'cta') {
      return (
        <button key={item.label} onClick={item.onClick} className={ctaClassName}>
          {item.label}
        </button>
      );
    }

    if (item.onClick) {
      return (
        <button key={item.label} onClick={item.onClick} className={desktopLinkClassName}>
          {item.label}
        </button>
      );
    }

    if (item.to) {
      return (
        <Link key={item.label} to={item.to} className={desktopLinkClassName}>
          {item.label}
        </Link>
      );
    }

    return <span key={item.label}>{item.label}</span>;
  };

  return (
    <nav className={navClassName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <B2WLogoMark className={`shrink-0 ${isDarkTheme ? 'text-white' : isMobileMenuOpen ? 'text-white md:text-black' : 'text-black'}`} />
          {clientName && (
            <>
              <span className={isDarkTheme ? 'text-white/20' : isMobileMenuOpen ? 'text-white/30 md:text-neutral-300' : 'text-neutral-300'}>/</span>
              {clientLink ? (
                <>
                  <div
                    className="relative hidden md:block"
                    ref={dropdownRef}
                    onMouseEnter={openClientDropdown}
                    onMouseLeave={closeClientDropdownWithDelay}
                  >
                    <Link 
                      to={clientLink} 
                      className={breadcrumbLinkClassName}
                    >
                      <span>{clientName}</span>
                      <ChevronDown
                        className={`ml-1 h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === 'client-pages' ? 'rotate-180' : ''}`}
                      />
                    </Link>
                    {clientSubpages.length > 0 ? (
                      <div
                        className={`${dropdownClassName} transition-all duration-200 ${
                          openDropdown === 'client-pages'
                            ? 'pointer-events-auto translate-y-0 opacity-100'
                            : 'pointer-events-none -translate-y-1 opacity-0'
                        }`}
                      >
                        {clientSubpages.map((subItem) =>
                          subItem.to ? (
                            <Link
                              key={subItem.label}
                              to={subItem.to}
                              className={`group flex items-center justify-between px-4 py-2 text-sm transition-all duration-200 ${
                                isDarkTheme
                                  ? 'text-neutral-300 hover:bg-white/5 hover:font-semibold hover:text-white'
                                  : 'text-neutral-600 hover:bg-neutral-50 hover:font-semibold hover:text-black'
                              } ${
                                nestedDeliverableLabels.has(subItem.label) ? 'pl-7' : ''
                              }`}
                            >
                              <span>{subItem.label}</span>
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                          ) : (
                            <button
                              key={subItem.label}
                              type="button"
                              onClick={subItem.onClick}
                              className={`group flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-all duration-200 ${
                                isDarkTheme
                                  ? 'text-neutral-300 hover:bg-white/5 hover:font-semibold hover:text-white'
                                  : 'text-neutral-600 hover:bg-neutral-50 hover:font-semibold hover:text-black'
                              } ${
                                nestedDeliverableLabels.has(subItem.label) ? 'pl-7' : ''
                              }`}
                            >
                              <span>{subItem.label}</span>
                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                          )
                        )}
                      </div>
                    ) : null}
                  </div>
                  <Link to={clientLink} className={`${breadcrumbLinkClassName} md:hidden ${isDarkTheme ? '!text-white/80 hover:!text-white' : isMobileMenuOpen ? '!text-white/80 hover:!text-white' : ''}`}>
                    <span>{clientName}</span>
                  </Link>
                </>
              ) : (
                <span className={`text-sm font-medium tracking-tight ${isDarkTheme ? 'text-white/80' : isMobileMenuOpen ? 'text-white/80 md:text-neutral-600' : 'text-neutral-600'}`}>{clientName}</span>
              )}
            </>
          )}
          {currentPageMeta ? (
            <>
              <span className={isDarkTheme ? 'text-white/20' : isMobileMenuOpen ? 'text-white/30 md:text-neutral-300' : 'text-neutral-300'}>/</span>
              <Link to={currentPageMeta.to} className={`${breadcrumbLinkClassName} ${isDarkTheme ? '!text-white/80 hover:!text-white' : isMobileMenuOpen ? '!text-white/80 hover:!text-white md:!text-neutral-600 md:hover:!text-black' : ''}`}>
                <span>{currentPageMeta.label}</span>
                <span className={breadcrumbArrowClassName}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {hasFieldBoss ? (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsFieldBossOpen((current) => !current);
              }}
              aria-label="Summarize"
              aria-expanded={isFieldBossOpen}
              title="Summarize"
              className={`group inline-flex h-10 min-w-[40px] items-center justify-center overflow-hidden rounded-full border px-2.5 transition-all duration-300 ease-in-out ${
                isFieldBossOpen
                  ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
                  : isDarkTheme
                    ? 'border-white/10 text-white hover:border-cyan-300/40 hover:bg-cyan-300/10'
                    : 'border-neutral-200 text-neutral-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700'
              }`}
            >
              <FieldBossIcon size={16} className="shrink-0" />
              <span
                className={`whitespace-nowrap font-medium text-[13px] tracking-wide transition-all duration-300 ease-in-out ${
                  isFieldBossOpen
                    ? 'ml-2 max-w-[100px] opacity-100'
                    : 'max-w-0 opacity-0 group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100'
                }`}
              >
                Summarize
              </span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className={`inline-flex items-center justify-center p-1 transition-colors ${isDarkTheme ? 'text-white hover:text-white' : isMobileMenuOpen ? 'text-white hover:text-white' : 'text-neutral-700 hover:text-black'}`}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className={desktopNavClassName}>
          {hasFieldBoss && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.14 }}
              onClick={() => setIsFieldBossOpen((current) => !current)}
              aria-label="Summarize"
              aria-expanded={isFieldBossOpen}
              title="Summarize"
              className={`group inline-flex h-10 min-w-[40px] items-center justify-center overflow-hidden rounded-full border px-2.5 transition-all duration-300 ease-in-out active:scale-95 ${
                isFieldBossOpen
                  ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-200'
                  : isDarkTheme
                    ? 'border-white/10 text-neutral-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200'
                    : 'border-neutral-200 text-neutral-600 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600'
              }`}
            >
              <FieldBossIcon size={18} className="shrink-0" />
              <span
                className={`whitespace-nowrap font-medium text-[13px] tracking-wide transition-all duration-300 ease-in-out ${
                  isFieldBossOpen
                    ? 'ml-2 max-w-[100px] opacity-100'
                    : 'max-w-0 opacity-0 group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100'
                }`}
              >
                Summarize
              </span>
            </motion.button>
          )}

          {navItems?.filter(item => item.type === 'cta').map(renderNavItem)}
        </div>
      </div>

      <AnimatePresence>
        {isFieldBossOpen && hasFieldBoss ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={() => setIsFieldBossOpen(false)}
              className="fixed inset-x-0 bottom-0 top-20 cursor-pointer bg-black/50 backdrop-blur-md"
              style={{ zIndex: 40 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto border-t border-white/10 bg-[#08131b] shadow-2xl pointer-events-auto md:absolute md:left-0 md:right-0 md:top-full md:bottom-auto md:max-h-[calc(100vh-5rem)]"
              style={{ zIndex: 50 }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#08131b]/95 px-4 py-3 backdrop-blur md:hidden">
                <div className="flex items-center gap-2 text-white">
                  <FieldBossIcon size={16} className="text-cyan-200" />
                  <span className="text-sm font-medium">Summarize Proposal</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFieldBossOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close proposal summary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FieldBossChatTray onClose={() => setIsFieldBossOpen(false)} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        theme="dark"
        list={
          clientSubpages.length > 0 ? (
            <>
              {clientSubpages.map((item) =>
                item.to ? (
                  <motion.div key={item.label} whileTap={{ scale: 0.985, x: 4 }} transition={{ duration: 0.14 }}>
                    <Link
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`${mobileMenuLinkClassName} min-h-0 flex-1 ${currentPageMeta?.to === item.to ? 'font-semibold text-white' : ''}`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={item.label} whileTap={{ scale: 0.985, x: 4 }} transition={{ duration: 0.14 }}>
                    <button
                      type="button"
                      onClick={() => {
                        item.onClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`${mobileMenuLinkClassName} min-h-0 flex-1`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                  </motion.div>
                ),
              )}
            </>
          ) : null
        }
        cta={
          navItems?.find((item) => item.type === 'cta') ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.14 }}
              type="button"
              onClick={() => {
                navItems.find((item) => item.type === 'cta')?.onClick?.();
                setIsMobileMenuOpen(false);
              }}
              className="inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-left text-base font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:bg-neutral-200"
            >
              <span>{navItems.find((item) => item.type === 'cta')?.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </motion.button>
          ) : null
        }
        footer={
          <div className="text-sm text-white/70">
            <p className="text-base font-medium text-white">
              <span className="b2w-wordmark">B2W LLC</span>
            </p>
            <p className="mt-2 text-sm text-white/50">© {new Date().getFullYear()} All rights reserved.</p>
            <a
              href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry"
              className="mt-3 inline-block text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        }
      />
    </nav>
  );
}
