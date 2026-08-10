import { AnimatePresence, motion } from 'motion/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronDown, Menu, X } from 'lucide-react';
import B2WIcon from './logo/B2WIcon';
import DescrambleText from './DescrambleText';

const v2Menus = [
  {
    label: 'Products',
    items: [
      { label: 'JasonAI', status: 'Pre-Launch Discount', colorway: 'jasonai', description: 'An intelligent assistant that works through your existing communication channels.', to: '/v2/products/jasonai', liveTo: '/jasonai' },
      { label: 'Clara', colorway: 'clara', description: 'Turn field notes into structured scopes and estimates.', to: '/v2/products/clara', liveTo: '/clara' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { label: 'General Contractors', description: 'Connect field communication, job context, estimates, and follow-up.', to: '/v2/solutions/general-contractors', liveTo: '/workflows' },
      { label: 'Engineering Firms', description: 'Organize technical context, project decisions, reporting, and review.', to: '/v2/solutions/engineering-firms', liveTo: '/contact?type=engineering-firm' },
    ],
  },
] as const;

const liveMenus = [
  v2Menus[0],
  {
    label: 'Solutions',
    items: [
      { label: 'General Contractor', description: 'Switch between solutions for owners, project coordinators, and operations teams.', to: '/general-contractors', liveTo: '/general-contractors' },
      { label: 'Use Cases', description: 'Explore the communication, document, and operating problems B2W can help solve.', to: '/solutions/business-use-cases', liveTo: '/solutions/business-use-cases' },
      { label: 'How B2W Works', description: 'Follow the five-step guide from one scoped problem to governed daily use.', to: '/solutions/ai-workflows', liveTo: '/solutions/ai-workflows' },
    ],
  },
] as const;

const demoUrl = 'https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=b24a24';

type V2SiteHeaderProps = {
  theme?: 'light' | 'dark';
  live?: boolean;
  followPageTheme?: boolean;
};

export function V2SiteHeader({ theme = 'light', live = false, followPageTheme = false }: V2SiteHeaderProps) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>(theme);
  const [pageSurface, setPageSurface] = useState(theme === 'dark' ? 'rgba(16, 26, 19, .58)' : 'rgba(251, 250, 246, .62)');
  const [productColorway, setProductColorway] = useState<'jasonai' | 'clara' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const pinnedMenuRef = useRef<string | null>(null);

  const cancelScheduledClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenuOnHover = (label: string) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (pinnedMenuRef.current) return;
    cancelScheduledClose();
    if (label !== 'Products') setProductColorway(null);
    setOpenMenu(label);
  };

  const scheduleMenuClose = (label: string) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (pinnedMenuRef.current) return;
    cancelScheduledClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenu((current) => current === label ? null : current);
      setProductColorway(null);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 20);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => () => cancelScheduledClose(), []);

  useEffect(() => {
    cancelScheduledClose();
    pinnedMenuRef.current = null;
    setOpenMenu(null);
    setProductColorway(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeAtDesktop = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setMobileMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('resize', closeAtDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('resize', closeAtDesktop);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!live) return undefined;
    window.dispatchEvent(new CustomEvent('b2w:product-colorway', { detail: productColorway }));
    return () => {
      window.dispatchEvent(new CustomEvent('b2w:product-colorway', { detail: null }));
    };
  }, [live, productColorway]);

  useEffect(() => {
    if (!followPageTheme) {
      setPageTheme(theme);
      setPageSurface(theme === 'dark' ? 'rgba(16, 26, 19, .58)' : 'rgba(251, 250, 246, .62)');
      return undefined;
    }

    let frame = 0;
    const translucentSurface = (element: HTMLElement | null, nextTheme: 'light' | 'dark') => {
      let current = element;
      while (current) {
        const color = window.getComputedStyle(current).backgroundColor;
        const channels = color.match(/[\d.]+/g)?.map(Number);
        if (channels && channels.length >= 3 && (channels.length < 4 || channels[3] > 0)) {
          const [red, green, blue] = channels;
          return `rgba(${red}, ${green}, ${blue}, ${nextTheme === 'dark' ? '.58' : '.62'})`;
        }
        current = current.parentElement;
      }
      return nextTheme === 'dark' ? 'rgba(16, 26, 19, .58)' : 'rgba(251, 250, 246, .62)';
    };
    const updateTheme = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sampleY = 48;
        const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'));
        const activeSection = sections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= sampleY && bounds.bottom > sampleY;
        });
        const nextTheme = activeSection?.dataset.headerTheme === 'dark' ? 'dark' : 'light';
        const sampledElement = activeSection ?? document.elementFromPoint(window.innerWidth / 2, Math.min(96, window.innerHeight / 3)) as HTMLElement | null;
        setPageTheme((current) => current === nextTheme ? current : nextTheme);
        const nextSurface = translucentSurface(sampledElement, nextTheme);
        setPageSurface((current) => current === nextSurface ? current : nextSurface);
      });
    };

    updateTheme();
    window.addEventListener('scroll', updateTheme, { passive: true });
    window.addEventListener('resize', updateTheme);
    window.addEventListener('b2w:product-colorway', updateTheme);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateTheme);
      window.removeEventListener('resize', updateTheme);
      window.removeEventListener('b2w:product-colorway', updateTheme);
    };
  }, [followPageTheme, theme]);

  const dark = pageTheme === 'dark';
  const menus = live ? liveMenus : v2Menus;

  return (
    <>
      <div
        aria-hidden="true"
        style={{ backgroundColor: isScrolled ? pageSurface : 'transparent' }}
        className={`pointer-events-none fixed left-0 right-0 z-40 mx-auto border bg-transparent transition-all duration-300 ${
          isScrolled
            ? `top-3 h-[4.125rem] w-[calc(100%-1.5rem)] max-w-[calc(80rem-1.5rem)] rounded-full backdrop-blur-2xl ${dark ? 'border-white/22' : 'border-black/16'}`
            : 'top-0 h-[4.5rem] w-full max-w-7xl border-transparent backdrop-blur-none sm:h-20'
        }`}
      />
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return;
          cancelScheduledClose();
          pinnedMenuRef.current = null;
          setOpenMenu(null);
          setProductColorway(null);
          setMobileMenuOpen(false);
        }}
        className={`fixed left-0 right-0 z-50 mx-auto grid grid-cols-[1fr_auto] items-center bg-transparent transition-all duration-300 md:grid-cols-[1fr_auto_1fr] ${openMenu || mobileMenuOpen ? (dark ? 'text-white mix-blend-normal' : 'text-[#141714] mix-blend-normal') : 'text-white mix-blend-difference'} ${
          isScrolled
            ? 'top-3 w-[calc(100%-1.5rem)] max-w-[calc(80rem-1.5rem)] rounded-full px-4 py-3 sm:px-6'
            : 'top-0 w-full max-w-7xl px-5 py-4 sm:px-8 sm:py-5 lg:px-10'
        }`}
      >
        <Link to={live ? '/' : '/v2'} aria-label={live ? 'B2W home' : 'B2W V2 home'} className="col-start-1 row-start-1 inline-flex min-h-11 min-w-11 items-center justify-start justify-self-start">
          <B2WIcon title="" className="h-8 w-9 overflow-visible sm:h-9 sm:w-10" />
        </Link>

        <nav aria-label={live ? 'Site navigation' : 'V2 site navigation'} className="hidden items-center justify-center gap-2 md:col-start-2 md:row-start-1 md:flex">
          {menus.map((menu, index) => {
            const isOpen = openMenu === menu.label;
            return (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => openMenuOnHover(menu.label)}
                onMouseLeave={() => scheduleMenuClose(menu.label)}
                onBlur={(event) => {
                  if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
                  cancelScheduledClose();
                  pinnedMenuRef.current = null;
                  setOpenMenu((current) => current === menu.label ? null : current);
                  setProductColorway(null);
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => {
                    cancelScheduledClose();
                    setProductColorway(null);
                    const isPinned = pinnedMenuRef.current === menu.label;
                    pinnedMenuRef.current = isPinned ? null : menu.label;
                    setOpenMenu(isPinned ? null : menu.label);
                  }}
                  className={`inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold transition sm:text-sm ${isOpen ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                >
                  <DescrambleText text={menu.label} animateOnMount delay={120 + index * 90} />
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen ? (
                    <motion.div
                      role="menu"
                      aria-label={`${menu.label} menu`}
                      initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                      onMouseEnter={cancelScheduledClose}
                      onMouseLeave={() => scheduleMenuClose(menu.label)}
                      className="fixed left-1/2 top-28 w-[min(88vw,25rem)] -translate-x-1/2 pt-2 text-black md:absolute md:top-full"
                    >
                      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/96 p-2 shadow-[0_28px_90px_rgba(15,23,42,.22)] backdrop-blur-xl">
                        {menu.items.map((item, itemIndex) => {
                          const itemSection = 'section' in item ? item.section : null;
                          const previousItem = itemIndex > 0 ? menu.items[itemIndex - 1] : null;
                          const previousSection = previousItem && 'section' in previousItem ? previousItem.section : null;

                          return (
                          <Fragment key={item.label}>
                            {itemSection && itemSection !== previousSection ? (
                              <p className="px-4 pb-1 pt-3 font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-slate-400 first:pt-1">{itemSection}</p>
                            ) : null}
                            <Link
                            key={item.label}
                            role="menuitem"
                            to={live ? item.liveTo : item.to}
                            onMouseEnter={() => setProductColorway('colorway' in item ? item.colorway : null)}
                            onFocus={() => setProductColorway('colorway' in item ? item.colorway : null)}
                            onMouseLeave={() => setProductColorway(null)}
                            onBlur={() => setProductColorway(null)}
                            onClick={() => { pinnedMenuRef.current = null; setOpenMenu(null); setProductColorway(null); }}
                            className={`group flex items-center justify-between gap-5 rounded-2xl p-4 transition ${'colorway' in item && item.colorway === 'jasonai' ? 'hover:bg-[#21120f] hover:text-white focus-visible:bg-[#21120f] focus-visible:text-white' : 'colorway' in item && item.colorway === 'clara' ? 'hover:bg-[#fff1f8] focus-visible:bg-[#fff1f8]' : 'hover:bg-[#f2f4ed] focus-visible:bg-[#f2f4ed]'}`}
                          >
                            <span>
                              <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                                <DescrambleText text={item.label} animateOnMount delay={60} />
                                {'status' in item ? <span className="rounded-full bg-[#f4b28c] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[.11em] text-[#51200f]">{item.status}</span> : null}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-slate-500 transition-colors group-hover:text-current/65 group-focus-visible:text-current/65">{item.description}</span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-current" />
                          </Link>
                          </Fragment>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          <Link to={live ? '/pricing' : '/v2/pricing'} className="inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold transition hover:bg-white hover:text-black sm:text-sm">
            <DescrambleText text="Pricing" animateOnMount delay={300} />
          </Link>
        </nav>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-1.5 justify-self-end md:col-start-3 md:gap-2">
          <Link to="/about" className="hidden min-h-10 items-center rounded-full px-3 text-sm font-semibold transition hover:bg-white hover:text-black md:inline-flex">
            <DescrambleText text="About" animateOnMount delay={390} />
          </Link>
          <a href={demoUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-current/25 px-3 text-sm font-semibold transition hover:bg-white hover:text-black sm:min-h-10 sm:px-4">
            <span className="md:hidden">Demo</span>
            <span className="hidden md:inline"><DescrambleText text="Book a demo" animateOnMount delay={450} /></span>
            <CalendarDays className="h-4 w-4" />
          </a>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-site-navigation"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/25 transition hover:bg-white hover:text-black md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              id="mobile-site-navigation"
              aria-label={live ? 'Mobile site navigation' : 'Mobile V2 site navigation'}
              className="fixed inset-x-3 top-[5.25rem] z-[45] max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] border border-black/10 bg-[#fbfaf6] p-3 text-[#141714] shadow-[0_28px_90px_rgba(15,23,42,.28)] md:hidden"
              initial={{ opacity: 0, y: -10, scale: .985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: .985 }}
              transition={{ duration: .22, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="grid gap-2" aria-label="Mobile navigation links">
                {menus.map((menu) => (
                  <section key={menu.label} className="rounded-[1.25rem] bg-white p-2">
                    <p className="px-3 pb-2 pt-1 font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-slate-400">{menu.label}</p>
                    <div className="grid gap-1">
                      {menu.items.map((item) => (
                        <Link
                          key={item.label}
                          to={live ? item.liveTo : item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex min-h-12 items-center justify-between gap-4 rounded-2xl px-3 py-2 text-sm font-semibold transition hover:bg-[#f2f4ed] focus-visible:bg-[#f2f4ed]"
                        >
                          <span>{item.label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
                <div className="grid grid-cols-2 gap-2 px-1 pb-1 pt-1">
                  <Link to={live ? '/pricing' : '/v2/pricing'} onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#141714] px-4 text-sm font-semibold text-white">Pricing</Link>
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-4 text-sm font-semibold">About</Link>
                </div>
              </nav>
            </motion.aside>
          </>
        ) : null}
        {live && productColorway && location.pathname !== '/' ? (
          <motion.div
            key={productColorway}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.82 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              mixBlendMode: 'color',
              background: productColorway === 'jasonai'
                ? 'radial-gradient(circle at 18% 18%,#b24a24,transparent 34%),radial-gradient(circle at 82% 18%,#25d366,transparent 30%),#2a1710'
                : 'radial-gradient(circle at 16% 18%,#a66589,transparent 34%),radial-gradient(circle at 84% 20%,#e8cbda,transparent 32%),#fbf0f5',
            }}
          />
        ) : null}
        {openMenu ? <motion.button type="button" aria-label="Close navigation menu" className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[10px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { cancelScheduledClose(); pinnedMenuRef.current = null; setOpenMenu(null); setProductColorway(null); }} /> : null}
      </AnimatePresence>
    </>
  );
}

export function LiveSiteHeader({ theme = 'light', followPageTheme = false }: Omit<V2SiteHeaderProps, 'live'>) {
  return <V2SiteHeader live theme={theme} followPageTheme={followPageTheme} />;
}

export function V2SiteFooter({ dark = false }: { dark?: boolean }) {
  return (
    <footer className={`border-t px-5 py-12 sm:px-8 ${dark ? 'border-white/10 bg-[#111714] text-white/70' : 'border-black/10 bg-[#f6f3eb] text-[#49504a]'}`}>
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-[1fr_auto_auto_auto]">
        <div><p className="font-semibold">B2W LLC</p><p className="mt-2 max-w-sm text-sm opacity-75">Practical AI products and workflows built around how operating teams already work.</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-[.16em]">Products</p><div className="mt-3 grid gap-2 text-sm"><Link to="/v2/products/jasonai">JasonAI</Link><Link to="/v2/products/clara">Clara</Link></div></div>
        <div><p className="text-xs font-semibold uppercase tracking-[.16em]">Solutions</p><div className="mt-3 grid gap-2 text-sm"><Link to="/v2/solutions/general-contractors">General Contractors</Link><Link to="/v2/solutions/engineering-firms">Engineering Firms</Link></div></div>
        <div><p className="text-xs font-semibold uppercase tracking-[.16em]">Plan</p><div className="mt-3 grid gap-2 text-sm"><Link to="/v2/pricing">Pricing &amp; ROI</Link><a href="mailto:info@b2w-ai.com">Contact</a></div></div>
      </div>
    </footer>
  );
}
