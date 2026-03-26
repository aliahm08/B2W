import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';
import B2WLogoMark from './B2WLogoMark';
import { scrollToHashTarget } from '../lib/hashNavigation';
import { showcaseProjects } from '../content/projectShowcaseCards';

type NavChild = {
  label: string;
  to: string;
};

type NavItem = {
  label: string;
  to: string;
  children: NavChild[];
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
  const [activeSection, setActiveSection] = useState('capabilities');
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavigation = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const hash = getHashTarget(target);
    const hasHashOnlyTarget = hash.length > 0;

    if (!hasHashOnlyTarget) {
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    setIsOpen(false);

    const performScroll = () => {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash);
      });
    };

    if (location.pathname === '/') {
      if (location.hash !== hash) {
        navigate({ pathname: '/', hash }, { replace: false });
      }
      performScroll();
      return;
    }

    navigate({ pathname: '/', hash }, { replace: false });
    window.setTimeout(performScroll, 180);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-neutral-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <B2WLogoMark className="shrink-0" />

        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
          {navItems.map((item) => {
            const isActive = activeDesktopLink === item.to;
            const usesHashNavigation = item.to.includes('#');

            return (
              <div key={item.label} className="group relative">
                <Link
                  to={item.to}
                  onClick={usesHashNavigation ? handleNavigation(item.to) : undefined}
                  className={`transition-colors ${isActive ? 'font-semibold text-black' : 'font-medium hover:text-black'}`}
                >
                  {item.label}
                </Link>

                <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="min-w-56 border border-neutral-200 bg-white py-3 shadow-sm">
                    {item.children.map((child) => {
                      const childUsesHashNavigation = child.to.includes('#');
                      return (
                        <Link
                          key={child.label}
                          to={child.to}
                          onClick={childUsesHashNavigation ? handleNavigation(child.to) : () => setIsOpen(false)}
                          className="flex items-center justify-between gap-4 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-black"
                        >
                          <span>{child.label}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-neutral-300" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <a
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            className="rounded-full border border-black bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Contact
          </a>
        </div>

        <button
          className="md:hidden p-2"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <MobileMenuDrawer
        isOpen={isOpen}
        theme="light"
        list={
          <div className="py-2">
            {navItems.map((item) => {
              const isActive = activeDesktopLink === item.to;
              return (
                <div key={item.label} className="border-b border-black/8 py-3 last:border-b-0">
                  <Link
                    to={item.to}
                    onClick={item.to.includes('#') ? handleNavigation(item.to) : () => setIsOpen(false)}
                    className={`block text-[17px] ${isActive ? 'font-semibold text-black' : 'font-medium text-neutral-900'}`}
                  >
                    {item.label}
                  </Link>

                  {item.children.length > 0 ? (
                    <div className="mt-3 space-y-2 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          onClick={child.to.includes('#') ? handleNavigation(child.to) : () => setIsOpen(false)}
                          className="block text-sm font-medium text-neutral-500 transition-colors hover:text-black"
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
        cta={
          <motion.a
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            onClick={() => setIsOpen(false)}
            className="inline-flex min-h-12 items-center self-start rounded-full bg-black px-5 py-3 text-base font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Contact
          </motion.a>
        }
      />
    </nav>
  );
}
