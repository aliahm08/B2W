import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-medium tracking-tight">B2W</Link>
          {clientName && (
            <>
              <span className="text-neutral-300">/</span>
              {clientLink ? (
                <Link 
                  to={clientLink} 
                  className="group relative flex items-center gap-1.5 text-sm font-medium tracking-tight text-neutral-600 hover:text-black transition-colors"
                >
                  <span>{clientName}</span>
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="inline-flex"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              ) : (
                <span className="text-sm font-medium tracking-tight text-neutral-600">{clientName}</span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          className="md:hidden inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white p-2.5 text-neutral-700 transition-colors hover:border-neutral-300 hover:text-black"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          {navItems?.map((item) => {
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

      {isMobileMenuOpen ? (
        <div className="border-t border-neutral-100 bg-white/95 px-4 pb-4 pt-3 shadow-sm backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-7xl rounded-2xl border border-neutral-200 bg-white p-3">
            <div className="flex flex-col gap-2">
              {navItems?.map((item) => {
                if (item.type === 'cta') {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        item.onClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
                    >
                      {item.label}
                    </button>
                  );
                }

                if (item.items) {
                  return (
                    <div key={item.label} className="rounded-xl border border-neutral-200 p-2">
                      <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                        {item.label}
                      </p>
                      <div className="mt-1 flex flex-col">
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.label}
                            type="button"
                            onClick={() => {
                              subItem.onClick?.();
                              setIsMobileMenuOpen(false);
                            }}
                            className="rounded-lg px-2 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-black"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (item.to) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex min-h-11 items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-black"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="inline-flex min-h-11 items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-black"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
