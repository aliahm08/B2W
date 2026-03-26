import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronRight, Menu, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';
import B2WLogoMark from './B2WLogoMark';
import { scrollToHashTarget } from '../lib/hashNavigation';
import { showcaseProjects } from '../content/projectShowcaseCards';
import { capabilityLanes } from '../content/capabilities';

type NavChild = {
  label: string;
  to: string;
};

type NavItem = {
  label: string;
  to: string;
  children: NavChild[];
};

type SearchEntry = {
  label: string;
  description: string;
  group: string;
  to: string;
};

const projectDropdownLabels: Record<string, string> = {
  Marketing: 'Marketing Audit',
  Financials: 'Financial Review',
  Operations: 'Operations Support',
  'Business Revamp': 'Business Revamp',
};

const navItems: NavItem[] = [
  {
    label: 'Capabilities',
    to: '/#capabilities',
    children: [
      { label: 'Marketing Data', to: '/capabilities/marketing-data' },
      { label: 'Financials', to: '/capabilities/financials' },
      { label: 'Operational Performance', to: '/capabilities/operational-performance' },
      { label: 'Kitchen', to: '/capabilities' },
    ],
  },
  {
    label: 'Expertise',
    to: '/#expertise',
    children: [
      { label: 'Growth', to: '/services/marketing-advisory' },
      { label: 'Optimization', to: '/services/operations-implementation' },
      { label: 'M&A', to: '/services/financial-review' },
    ],
  },
  {
    label: 'Projects',
    to: '/#projects',
    children: showcaseProjects.map((project) => ({
      label: projectDropdownLabels[project.category] ?? project.category,
      to: project.link,
    })),
  },
  {
    label: 'Process',
    to: '/#process',
    children: [],
  },
  {
    label: 'Team',
    to: '/#team',
    children: [],
  },
];

function getHashTarget(path: string): string {
  const hashIndex = path.indexOf('#');
  return hashIndex >= 0 ? path.slice(hashIndex) : '';
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('capabilities');
  const navRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHeaderDark = isSearchOpen || isOpen;

  useEffect(() => {
    if (location.pathname !== '/') {
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
  }, [location.pathname]);

  const activeDesktopLink = useMemo(() => {
    if (location.pathname === '/') {
      return `/#${activeSection}`;
    }

    const matchingParent = navItems.find((item) => {
      if (location.pathname === item.to) {
        return true;
      }

      return item.children.some((child) => child.to === location.pathname);
    });

    return matchingParent?.to ?? '';
  }, [activeSection, location.pathname]);

  const searchEntries = useMemo<SearchEntry[]>(() => {
    const sectionEntries = navItems.map((item) => ({
      label: item.label,
      description: item.children.length > 0 ? `${item.children.length} related pages` : 'Landing page section',
      group: 'Sections',
      to: item.to,
    }));

    const childEntries = navItems.flatMap((item) =>
      item.children.map((child) => ({
        label: child.label,
        description: item.label,
        group: 'Navigation',
        to: child.to,
      })),
    );

    const projectEntries = showcaseProjects.map((project) => ({
      label: project.title,
      description: project.clientDescription,
      group: 'Projects',
      to: project.link,
    }));

    const capabilityEntries = capabilityLanes.flatMap((lane) =>
      lane.capabilities.map((capability) => ({
        label: capability.title,
        description: capability.summary,
        group: 'Capabilities',
        to: `/capabilities/${capability.slug}`,
      })),
    );

    return [...sectionEntries, ...childEntries, ...projectEntries, ...capabilityEntries];
  }, []);

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
    const hash = getHashTarget(target);
    const hasHashOnlyTarget = hash.length > 0;

    if (!hasHashOnlyTarget) {
      setIsOpen(false);
      setIsSearchOpen(false);
      setSearchQuery('');
      navigate(target);
      return;
    }

    setIsOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');

    if (location.pathname !== '/' || location.hash !== hash) {
      navigate({ pathname: '/', hash }, { replace: false });
    }

    const performScroll = () => {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash);
      });
    };

    if (location.pathname === '/') {
      performScroll();
      return;
    }

    window.setTimeout(performScroll, 180);
  };

  const handleNavigation = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = getHashTarget(target);
    const hasHashOnlyTarget = hash.length > 0;

    if (!hasHashOnlyTarget) {
      setIsOpen(false);
      setIsSearchOpen(false);
      setSearchQuery('');
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    navigateToTarget(target);
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
        isHeaderDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-100 bg-white'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <B2WLogoMark className={`shrink-0 transition-colors duration-150 ${isHeaderDark ? 'text-white' : 'text-black'}`} />

        <div className={`hidden items-center gap-6 text-sm md:flex ${isSearchOpen ? 'text-neutral-300' : 'text-neutral-600'}`}>
          {navItems.map((item) => {
            const isActive = activeDesktopLink === item.to;
            const usesHashNavigation = item.to.includes('#');
            const hasChildren = item.children.length > 0;

            return (
              <div key={item.label} className="group relative">
                <Link
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

                {hasChildren ? (
                  <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <div
                      className={`min-w-56 py-3 shadow-sm ${
                        isSearchOpen ? 'border border-white/10 bg-neutral-900' : 'border border-neutral-200 bg-white'
                      }`}
                    >
                      {item.children.map((child) => {
                        const childUsesHashNavigation = child.to.includes('#');
                        return (
                          <Link
                            key={child.label}
                            to={child.to}
                            onClick={childUsesHashNavigation ? handleNavigation(child.to) : () => setIsOpen(false)}
                            className={`flex items-center justify-between gap-4 px-4 py-2 text-sm font-medium transition-colors ${
                              isSearchOpen ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-black'
                            }`}
                          >
                            <span>{child.label}</span>
                            <ChevronRight
                              className={`h-3.5 w-3.5 ${isSearchOpen ? 'text-neutral-600' : 'text-neutral-300'}`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
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
          <a
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            className="rounded-full border border-black bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Contact
          </a>
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
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Quick Actions</p>
                  <motion.a
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                  >
                    Contact
                  </motion.a>
                </div>

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
                    className={`inline-flex items-center gap-2 text-[17px] ${isActive ? 'font-semibold text-white' : 'font-medium text-neutral-100'}`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-neutral-500" />
                  </Link>

                  {item.children.length > 0 ? (
                    <div className="mt-3 space-y-2 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          onClick={child.to.includes('#') ? handleNavigation(child.to) : () => setIsOpen(false)}
                          className="block text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        }
      />
    </nav>
  );
}
