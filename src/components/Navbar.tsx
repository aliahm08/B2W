import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';
import B2WLogoMark from './B2WLogoMark';
import OfferBanner from './OfferBanner';
import { scrollToHashTarget } from '../lib/hashNavigation';
import { capabilityLanes } from '../content/capabilities';

type NavItem = {
  label: string;
  to: string;
  children?: NavItem[];
};

type SearchEntry = {
  label: string;
  description: string;
  group: string;
  to: string;
};

function buildNavItems(basePath: string): NavItem[] {
  return [
    {
      label: 'Growth',
      to: '/capabilities/marketing-data',
    },
    {
      label: 'Optimization',
      to: '/capabilities/operational-performance',
    },
    {
      label: 'Diligence',
      to: '/capabilities/financials',
    },
    {
      label: 'About',
      to: '/about',
    },
  ];
}

function getHashTarget(path: string): string {
  const hashIndex = path.indexOf('#');
  return hashIndex >= 0 ? path.slice(hashIndex) : '';
}

function parseTarget(target: string) {
  const hash = getHashTarget(target);
  const pathname = hash ? target.slice(0, target.indexOf('#')) || '/' : target;
  return { pathname, hash };
}

type NavbarProps = {
  basePath?: string;
  showOfferBanner?: boolean;
  transparentAtTop?: boolean;
  onOfferClick?: () => void;
  onOfferClose?: () => void;
};

export default function Navbar({
  basePath = '/',
  showOfferBanner = false,
  transparentAtTop = false,
  onOfferClick,
  onOfferClose,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('capabilities');
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
  const navRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHeaderDark = isSearchOpen || isOpen;
  const isTransparent = transparentAtTop && !isScrolled && !isHeaderDark;
  const navItems = useMemo(() => buildNavItems(basePath), [basePath]);
  const featuredNavItems = navItems.slice(0, 3);
  const aboutNavItem = navItems[3];

  useEffect(() => {
    if (!transparentAtTop) {
      setIsScrolled(false);
      return;
    }

    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 0);
    };

    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    return () => window.removeEventListener('scroll', updateScrolled);
  }, [transparentAtTop]);

  useEffect(() => {
    if (location.pathname !== basePath) {
      return;
    }

    const sectionIds = navItems.map((item) => getHashTarget(item.to).replace('#', '')).filter(Boolean);
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sectionElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0.25, 0.45, 0.65] },
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [basePath, location.pathname, navItems]);

  const activeDesktopLink = useMemo(() => {
    if (location.pathname === basePath) {
      return `${basePath}#${activeSection}`;
    }

    const matchingParent = navItems.find((item) => {
      const itemTarget = parseTarget(item.to);
      if (location.pathname === itemTarget.pathname && (!itemTarget.hash || location.hash === itemTarget.hash)) {
        return true;
      }

      return item.children?.some((child) => {
        const childTarget = parseTarget(child.to);
        return location.pathname === childTarget.pathname && (!childTarget.hash || location.hash === childTarget.hash);
      }) ?? false;
    });

    return matchingParent?.to ?? '';
  }, [activeSection, basePath, location.hash, location.pathname, navItems]);

  const searchEntries = useMemo<SearchEntry[]>(() => {
    const sectionEntries = navItems.map((item) => ({
      label: item.label,
      description: 'Navigation',
      group: 'Sections',
      to: item.to,
    }));

    const capabilityEntries = capabilityLanes.flatMap((lane) =>
      lane.capabilities.map((capability) => ({
        label: capability.title,
        description: capability.summary,
        group: 'Capabilities',
        to: `/capabilities/${capability.slug}`,
      })),
    );

    return [...sectionEntries, ...capabilityEntries];
  }, [navItems]);

  const filteredSearchEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return searchEntries.slice(0, 8);
    }

    return searchEntries
      .filter((entry) => {
        const haystack = `${entry.label} ${entry.description} ${entry.group}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [searchEntries, searchQuery]);

  const mobileSearchEntries = useMemo(
    () => filteredSearchEntries.filter((entry) => entry.group !== 'Sections'),
    [filteredSearchEntries],
  );
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasMobileSearchQuery = searchQuery.trim().length > 0;

  const navigateToTarget = (target: string) => {
    const { pathname, hash } = parseTarget(target);
    const hasHashTarget = hash.length > 0;

    if (!hasHashTarget) {
      setIsOpen(false);
      setIsSearchOpen(false);
      setSearchQuery('');
      navigate(target);
      return;
    }

    setIsOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');

    if (location.pathname !== pathname || location.hash !== hash) {
      navigate({ pathname, hash }, { replace: false });
    }

    const performScroll = () => {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash);
      });
    };

    if (location.pathname === pathname) {
      performScroll();
      return;
    }

    window.setTimeout(performScroll, 180);
  };

  const handleNavigation = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const { hash } = parseTarget(target);
    const hasHashTarget = hash.length > 0;

    if (!hasHashTarget) {
      setIsOpen(false);
      setIsSearchOpen(false);
      setSearchQuery('');
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    navigateToTarget(target);
  };

  const toggleMobileSection = (label: string) => {
    setExpandedMobileSections((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen((current) => !current);
        return;
      }

      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (navRef.current?.contains(target)) {
        return;
      }

      setIsSearchOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isOpen) {
      setExpandedMobileSections({});
    }
  }, [activeDesktopLink, isOpen, location.hash, location.pathname]);

  const searchResultsContent =
    hasSearchQuery && filteredSearchEntries.length > 0 ? (
      <div className="space-y-1">
        {filteredSearchEntries.map((entry) => (
          <button
            key={`${entry.group}-${entry.label}-${entry.to}`}
            type="button"
            onClick={() => navigateToTarget(entry.to)}
            className="flex w-full items-center justify-between gap-5 rounded-[1.1rem] px-4 py-3 text-left transition-colors hover:bg-white/6"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                <span>{entry.group}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-white">{entry.label}</p>
              <p className="mt-1 truncate text-sm text-neutral-400">{entry.description}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500" />
          </button>
        ))}
      </div>
    ) : hasSearchQuery ? (
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-medium text-white">No results found.</p>
        <p className="mt-1 text-sm text-neutral-400">Try a project type, service, or section name.</p>
      </div>
    ) : (
      <div className="px-4 py-8 text-center">
        <p className="text-sm font-medium text-white">Start typing to search.</p>
        <p className="mt-1 text-sm text-neutral-400">Search pages, projects, services, and capabilities.</p>
      </div>
    );

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 top-0 z-50 overflow-visible border-b transition-colors duration-150 ${
        isHeaderDark
          ? 'border-neutral-800 bg-neutral-950'
          : isTransparent
            ? 'border-transparent bg-transparent'
            : 'border-neutral-100 bg-white'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <B2WLogoMark
            to={basePath}
            className={`shrink-0 transition-colors duration-150 ${isHeaderDark ? 'text-white' : 'text-black'}`}
          />
          <div className={`hidden items-center gap-5 text-sm md:flex ${isSearchOpen ? 'text-neutral-300' : 'text-neutral-600'}`}>
            {featuredNavItems.map((item) => {
              const isActive = activeDesktopLink === item.to;
              const usesHashNavigation = item.to.includes('#');

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={usesHashNavigation ? handleNavigation(item.to) : undefined}
                  className={`transition-colors ${
                    isSearchOpen
                      ? isActive
                        ? 'font-semibold text-white'
                        : 'font-medium hover:text-white'
                      : isActive
                        ? 'font-semibold text-black'
                        : 'font-medium hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence initial={false}>
            {showOfferBanner && !isHeaderDark ? (
              <motion.div
                key="header-offer-banner"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <OfferBanner compact onClick={onOfferClick} onClose={onOfferClose} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className={`hidden items-center gap-6 text-sm md:flex ${isSearchOpen ? 'text-neutral-300' : 'text-neutral-600'}`}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.14 }}
            onClick={() => setIsSearchOpen((current) => !current)}
            aria-label="Search"
            aria-expanded={isSearchOpen}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-150 active:bg-neutral-100 ${
              isSearchOpen
                ? 'border-white/10 bg-white/6 text-white'
                : 'border-neutral-200 text-neutral-600 hover:border-black hover:bg-neutral-50 hover:text-black'
            }`}
          >
            <Search className="h-4.5 w-4.5" />
          </motion.button>
          {aboutNavItem ? (
            <Link
              to={aboutNavItem.to}
              className={`font-medium transition-colors ${isSearchOpen ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
            >
              {aboutNavItem.label}
            </Link>
          ) : null}
          <Link
            to={`${basePath}#contact`}
            onClick={handleNavigation(`${basePath}#contact`)}
            className={`font-medium transition-colors ${isSearchOpen ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'}`}
          >
            Contact
          </Link>
          <Link
            to="/?project-builder=open"
            className="rounded-full border border-black bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Start
          </Link>
        </div>

        <button
          className={`p-2 md:hidden ${isHeaderDark ? 'text-white' : 'text-black'}`}
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isSearchOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="pointer-events-none fixed inset-x-0 bottom-0 top-20 hidden bg-neutral-950/30 backdrop-blur-md md:block"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full hidden border-t border-neutral-800 bg-neutral-950 md:block"
            >
              <div className="mx-auto max-w-4xl px-6 py-5">
                <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-neutral-900 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    <Search className="h-4.5 w-4.5 text-neutral-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search pages, projects, capabilities..."
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-white/8 hover:text-white"
                      aria-label="Close search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="px-3 py-3">
                    {searchResultsContent}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-neutral-500">
                    <span>Desktop search</span>
                    <span>Press Ctrl/Cmd + K</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <MobileMenuDrawer
        isOpen={isOpen}
        theme="dark"
        list={
          <div className="py-2">
            <div className="border-b border-white/10 py-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-neutral-900 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 shrink-0 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search pages, projects, capabilities..."
                    className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {hasMobileSearchQuery
                  ? mobileSearchEntries.slice(0, 5).map((entry) => (
                      <button
                        key={`mobile-${entry.group}-${entry.label}-${entry.to}`}
                        type="button"
                    onClick={() => navigateToTarget(entry.to)}
                        className="flex w-full items-center justify-between gap-4 rounded-[1rem] bg-neutral-900 px-3 py-3 text-left transition-colors hover:bg-neutral-800"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{entry.group}</p>
                          <p className="mt-1 text-sm font-medium text-white">{entry.label}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500" />
                      </button>
                    ))
                  : null}

                {hasMobileSearchQuery && mobileSearchEntries.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-neutral-500">No results found.</p>
                ) : null}
              </div>
            </div>

            {navItems.map((item) => {
              const isActive = activeDesktopLink === item.to;
              return (
                <div key={item.label} className="border-b border-white/10 py-3 last:border-b-0">
                  <Link
                    to={item.to}
                    onClick={item.to.includes('#') ? handleNavigation(item.to) : () => setIsOpen(false)}
                    className={`flex items-center justify-between gap-4 text-[17px] ${
                      isActive ? 'font-semibold text-white' : 'font-medium text-neutral-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500" />
                  </Link>
                </div>
              );
            })}
          </div>
        }
        cta={
          <motion.a
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            onClick={() => setIsOpen(false)}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/10 bg-white px-5 py-3 text-base font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Contact
          </motion.a>
        }
      />
    </nav>
  );
}
