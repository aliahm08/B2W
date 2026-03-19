import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  navItems 
}: { 
  clientName?: string;
  clientLink?: string;
  navItems?: ClientNavAction[];
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeDropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const getCurrentPageMeta = () => {
    const pathname = location.pathname.replace(/\/+$/, '') || '/';

    if (pathname === '/client/uyghur-eats' || pathname === '/portal/uyghur-eats') {
      return null;
    }

    const routeMap: Record<string, string> = {
      '/client/uyghur-eats/profile': 'Profile',
      '/client/uyghur-eats/valuation': 'Valuation',
      '/client/uyghur-eats/data-room': 'Data Room',
      '/client/uyghur-eats/terms': 'Terms',
      '/portal/uyghur-eats/profile': 'Profile',
      '/portal/uyghur-eats/valuation': 'Valuation',
      '/portal/uyghur-eats/data-room': 'Data Room',
      '/portal/uyghur-eats/terms': 'Terms',
    };

    const label = routeMap[pathname];
    if (!label) {
      return null;
    }

    return { label, to: pathname };
  };

  const currentPageMeta = getCurrentPageMeta();
  const clientSubpages = navItems?.filter((item) => item.type !== 'cta') ?? [];
  const nestedDeliverableLabels = new Set(['Profile', 'Valuation', 'Documentation']);

  const breadcrumbLinkClassName =
    'group inline-flex items-center text-sm font-medium tracking-tight text-neutral-600 transition-colors hover:text-black';
  const breadcrumbArrowClassName =
    'ml-0 inline-flex w-0 overflow-hidden opacity-0 transition-all duration-200 ease-out group-hover:ml-1.5 group-hover:w-3.5 group-hover:opacity-100';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeDropdownTimeoutRef.current) {
        clearTimeout(closeDropdownTimeoutRef.current);
      }
    };
  }, []);

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center text-xl font-medium tracking-tight text-black transition-all duration-200 ease-out hover:font-semibold"
          >
            <span>B2W</span>
          </Link>
          {clientName && (
            <>
              <span className="text-neutral-300">/</span>
              {clientLink ? (
                <div
                  className="relative"
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
                      className={`absolute top-full left-0 mt-2 min-w-56 border border-neutral-200 bg-white py-2 shadow-xl transition-all duration-200 ${
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
                            className={`group flex items-center justify-between px-4 py-2 text-sm text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:font-semibold hover:text-black ${
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
                            className={`group flex w-full items-center justify-between px-4 py-2 text-left text-sm text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:font-semibold hover:text-black ${
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
              ) : (
                <span className="text-sm font-medium tracking-tight text-neutral-600">{clientName}</span>
              )}
            </>
          )}
          {currentPageMeta ? (
            <>
              <span className="text-neutral-300">/</span>
              <Link to={currentPageMeta.to} className={breadcrumbLinkClassName}>
                <span>{currentPageMeta.label}</span>
                <span className={breadcrumbArrowClassName}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="md:hidden inline-flex items-center justify-center p-1 text-neutral-700 transition-colors hover:text-black"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {navItems?.map((item) => {
            if (item.type !== 'cta') {
              return null;
            }

            if (item.items) {
              return (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1 hover:text-black transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-100 shadow-xl py-2">
                      {item.items.map((subItem) => (
                        <button
                          key={subItem.label}
                          onClick={() => {
                            subItem.onClick?.();
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-600 hover:text-black transition-colors"
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
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all text-xs uppercase tracking-widest font-semibold"
                >
                  {item.label}
                </button>
              );
            }

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="hover:text-black transition-colors"
                >
                  {item.label}
                </button>
              );
            }

            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              );
            }

            return <span key={item.label}>{item.label}</span>;
          })}
          
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-neutral-100 bg-white/95 px-4 pb-4 pt-3 shadow-sm backdrop-blur-md md:hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="mx-auto flex max-w-7xl flex-col gap-1"
            >
              {navItems?.map((item) => {
                const itemVariants = {
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -8 },
                };

                if (item.type === 'cta') {
                  return (
                    <motion.button
                      key={item.label}
                      variants={itemVariants}
                      type="button"
                      onClick={() => {
                        item.onClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="inline-flex min-h-11 items-center justify-between py-3 text-left text-sm font-semibold uppercase tracking-widest text-black"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  );
                }

                if (item.to) {
                  return (
                    <motion.div key={item.label} variants={itemVariants}>
                      <Link
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`inline-flex min-h-11 items-center justify-between py-3 text-sm font-medium text-neutral-700 transition-colors hover:text-black ${
                          nestedDeliverableLabels.has(item.label) ? 'pl-4' : ''
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.button
                    key={item.label}
                    variants={itemVariants}
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="inline-flex min-h-11 items-center justify-between py-3 text-left text-sm font-medium text-neutral-700 transition-colors hover:text-black"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
