import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { publicNavigation, searchEntries } from '../content/unifiedSite';
import { trackSiteEvent } from '../lib/siteAnalytics';
import B2WLogoMark from './PreviewB2WLogoMark';
import DescrambleText from './DescrambleText';

type NavbarProps = {
  basePath?: string;
  showOfferBanner?: boolean;
  transparentAtTop?: boolean;
  onOfferClick?: () => void;
  onOfferClose?: () => void;
};

export default function Navbar({ basePath = '' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const routeTo = (to: string) => to.startsWith('mailto:') ? to : (`${basePath}${to === '/' ? '' : to}` || '/');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchEntries.slice(0, 8);
    return searchEntries.filter((entry) =>
      `${entry.label} ${entry.description} ${entry.group}`.toLowerCase().includes(normalized),
    ).slice(0, 10);
  }, [query]);

  const groupedResults = useMemo(() => {
    return results.reduce<Record<string, typeof results>>((groups, entry) => {
      groups[entry.group] = [...(groups[entry.group] ?? []), entry];
      return groups;
    }, {});
  }, [results]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setSearchOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => {
          if (!current) trackSiteEvent('site_search_opened', { source: 'keyboard' });
          return !current;
        });
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [searchOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (navigationRef.current && !navigationRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => setActiveResult(0), [query]);

  const selectResult = (to: string, label: string) => {
    trackSiteEvent('site_search_result_selected', { label, query });
    setSearchOpen(false);
    setQuery('');
    if (to.startsWith('mailto:')) window.location.href = to;
    else navigate(routeTo(to));
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult((current) => Math.min(current + 1, results.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult((current) => Math.max(current - 1, 0));
    }
    if (event.key === 'Enter' && results[activeResult]) {
      event.preventDefault();
      selectResult(results[activeResult].to, results[activeResult].label);
    }
  };

  let resultIndex = -1;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--b2w-line)] bg-[color:rgba(243,240,232,.94)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-5 xl:gap-8">
          <B2WLogoMark to={routeTo('/')} className="group shrink-0" revealWordmark />
          <nav ref={navigationRef} aria-label="Primary navigation" className="hidden items-center gap-0 lg:flex">
            {publicNavigation.slice(0, 3).map((item) => {
              if ('children' in item) {
                const menuOpen = openMenu === item.label;
                return (
                  <div key={item.label} className="relative">
                    <div className="flex items-center">
                      <Link
                        to={routeTo(item.to)}
                        onClick={() => trackSiteEvent('navigation_selected', { label: item.label })}
                        className="rounded-full px-3 py-2.5 text-[15px] font-medium text-[var(--b2w-ink)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] xl:px-4"
                      >
                        <DescrambleText text={item.label} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenMenu((current) => current === item.label ? null : item.label)}
                        aria-expanded={menuOpen}
                        aria-label={`Open ${item.label} menu`}
                        className="-ml-2 grid h-9 w-8 place-items-center rounded-full text-[var(--b2w-ink-faint)] transition hover:bg-white hover:text-[var(--b2w-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)]"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {menuOpen ? (
                        <motion.div
                          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute left-0 top-[calc(100%+1rem)] w-80 overflow-hidden rounded-2xl border border-[var(--b2w-line)] bg-white p-2 shadow-[0_24px_70px_rgba(23,34,30,.14)]"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.to}
                              to={routeTo(child.to)}
                              className="group flex items-center justify-between gap-4 rounded-xl p-4 transition hover:bg-[var(--b2w-canvas)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)]"
                            >
                              <span>
                                <DescrambleText text={child.label} className="block text-sm font-semibold text-[var(--b2w-ink)]" />
                                <span className="mt-1 block text-xs leading-5 text-[var(--b2w-ink-faint)]">{child.description}</span>
                              </span>
                              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--b2w-ink-faint)] transition group-hover:translate-x-0.5" />
                            </Link>
                          ))}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={routeTo(item.to)}
                  onClick={() => trackSiteEvent('navigation_selected', { label: item.label })}
                  className="rounded-full px-3 py-2.5 text-[15px] font-medium text-[var(--b2w-ink)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] xl:px-4"
                >
                  <DescrambleText text={item.label} />
                </Link>
              );
            })}
          </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                trackSiteEvent('site_search_opened', { source: 'header' });
              }}
              className="grid h-11 w-11 place-items-center rounded-full text-[var(--b2w-ink)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)]"
              aria-label="Search B2W"
            >
              <Search className="h-4 w-4" />
            </button>
            {publicNavigation.slice(3).map((item) => item.to.startsWith('mailto:') ? (
              <a key={item.to} href={item.to} onClick={() => trackSiteEvent('navigation_selected', { label: item.label })} className="hidden min-h-10 items-center rounded-full px-3 text-[15px] font-medium text-[var(--b2w-ink)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] lg:inline-flex xl:px-4"><DescrambleText text={item.label} /></a>
            ) : (
              <Link key={item.to} to={routeTo(item.to)} onClick={() => trackSiteEvent('navigation_selected', { label: item.label })} className="hidden min-h-10 items-center rounded-full px-3 text-[15px] font-medium text-[var(--b2w-ink)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] lg:inline-flex xl:px-4"><DescrambleText text={item.label} /></Link>
            ))}
            <a
              href="mailto:info@b2w-ai.com"
              onClick={() => trackSiteEvent('navigation_selected', { label: 'Contact' })}
              className="hidden min-h-11 items-center rounded-full bg-[var(--b2w-rust-dark)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--b2w-rust)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-rust)] focus-visible:ring-offset-2 sm:inline-flex"
            >
              <DescrambleText text="Contact" />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--b2w-line)] bg-white/60 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.nav
              aria-label="Mobile navigation"
              initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-[var(--b2w-line)] bg-[var(--b2w-canvas)] lg:hidden"
            >
              <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8">
                {publicNavigation.map((item) => (
                  <div key={item.label} className="border-b border-[var(--b2w-line)] last:border-b-0">
                    {item.to.startsWith('mailto:') ? <a href={item.to} className="flex min-h-12 items-center justify-between text-base font-semibold">
                      <DescrambleText text={item.label} /><ArrowRight className="h-4 w-4 text-[var(--b2w-ink-faint)]" />
                    </a> : <Link to={routeTo(item.to)} className="flex min-h-12 items-center justify-between text-base font-semibold">
                      <DescrambleText text={item.label} /><ArrowRight className="h-4 w-4 text-[var(--b2w-ink-faint)]" />
                    </Link>}
                    {'children' in item ? (
                      <div className="grid gap-2 pb-4 pl-4">
                        {item.children.map((child) => <Link key={child.to} to={routeTo(child.to)} className="text-sm text-[var(--b2w-ink-muted)]"><DescrambleText text={child.label} /></Link>)}
                      </div>
                    ) : null}
                  </div>
                ))}
                <a href="mailto:info@b2w-ai.com" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--b2w-forest)] px-5 text-sm font-semibold text-white"><DescrambleText text="Contact B2W" /></a>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search B2W"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[var(--b2w-forest-deep)]/75 p-4 pt-20 backdrop-blur-md sm:p-8 sm:pt-24"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10, scale: .985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: .985 }}
              className="mx-auto max-h-[calc(100svh-7rem)] max-w-3xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-[var(--b2w-canvas)] shadow-[0_30px_100px_rgba(0,0,0,.35)]"
            >
              <div className="flex items-center gap-3 border-b border-[var(--b2w-line)] px-5 py-4">
                <Search className="h-5 w-5 text-[var(--b2w-ink-faint)]" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    if (event.target.value.trim().length === 2) trackSiteEvent('site_search_query', { length: event.target.value.length });
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search services, products, workflows, and company"
                  aria-label="Search site"
                  aria-controls="site-search-results"
                  className="min-w-0 flex-1 bg-transparent text-base text-[var(--b2w-ink)] outline-none placeholder:text-[var(--b2w-ink-faint)]"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white"><X className="h-4 w-4" /></button>
              </div>
              <div id="site-search-results" className="max-h-[60svh] overflow-y-auto p-3">
                {results.length ? Object.entries(groupedResults).map(([group, entries]) => (
                  <section key={group} className="mb-4 last:mb-0">
                    <p className="px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold-dark)]">{group}</p>
                    {entries.map((entry) => {
                      resultIndex += 1;
                      const index = resultIndex;
                      return (
                        <button
                          key={`${entry.group}-${entry.label}-${entry.to}`}
                          type="button"
                          onMouseEnter={() => setActiveResult(index)}
                          onClick={() => selectResult(entry.to, entry.label)}
                          className={`flex w-full items-center justify-between gap-5 rounded-xl px-3 py-3 text-left transition ${activeResult === index ? 'bg-white shadow-sm' : 'hover:bg-white/65'}`}
                        >
                          <span>
                            <span className="block text-sm font-semibold text-[var(--b2w-ink)]">{entry.label}</span>
                            <span className="mt-1 block text-xs leading-5 text-[var(--b2w-ink-muted)]">{entry.description}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--b2w-ink-faint)]" />
                        </button>
                      );
                    })}
                  </section>
                )) : (
                  <div className="px-4 py-14 text-center">
                    <p className="text-lg font-semibold">No results for “{query}”</p>
                    <p className="mt-2 text-sm text-[var(--b2w-ink-muted)]">Try a service, product, workflow, or resource name.</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-[var(--b2w-line)] px-5 py-3 text-[10px] text-[var(--b2w-ink-faint)]">
                <span>↑↓ to move · Enter to open</span><span>Esc to close</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
