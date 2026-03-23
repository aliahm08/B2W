import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Menu, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';
import { scrollToHashTarget } from '../lib/hashNavigation';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Capabilities', to: '/#capabilities', note: 'Systems, workflows, and use cases' },
    { label: 'Expertise', to: '/#expertise', note: 'Advisory lanes and engagement areas' },
    { label: 'Projects', to: '/#projects', note: 'Selected work and live initiatives' },
    { label: 'Process', to: '/#process', note: 'How B2W scopes and executes' },
    { label: 'Team', to: '/#team', note: 'Who is building and operating the work' },
  ] as const;

  const filteredMenuItems = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) {
      return menuItems;
    }

    return menuItems.filter((item) =>
      `${item.label} ${item.note}`.toLowerCase().includes(normalized),
    );
  }, [menuItems, searchQuery]);

  const handleSectionNavigation = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = target.indexOf('#');
    const hash = hashIndex >= 0 ? target.slice(hashIndex) : '';
    if (!hash) {
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    setSearchQuery('');

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-medium tracking-tight">
          <span className="b2w-wordmark">B2W</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-600">
          <Link to="/#capabilities" onClick={handleSectionNavigation('/#capabilities')} className="hover:text-black transition-colors">Capabilities</Link>
          <Link to="/#expertise" onClick={handleSectionNavigation('/#expertise')} className="hover:text-black transition-colors">Expertise</Link>
          <Link to="/#projects" onClick={handleSectionNavigation('/#projects')} className="hover:text-black transition-colors">Projects</Link>
          <Link to="/#process" onClick={handleSectionNavigation('/#process')} className="hover:text-black transition-colors">Process</Link>
          <Link to="/#team" onClick={handleSectionNavigation('/#team')} className="hover:text-black transition-colors">Team</Link>
          <a href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call" className="rounded-full border border-black bg-black px-4 py-2 text-white hover:bg-neutral-800 transition-colors">Contact</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
              setSearchQuery('');
            }
          }}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <MobileMenuDrawer
        isOpen={isOpen}
        theme="light"
        header={
          <>
            <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500">Home Navigation</p>
            <div className="mobile-menu-search-shell mt-3">
              <div className="mobile-menu-search">
                <Search className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search sections"
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>
          </>
        }
        list={
          filteredMenuItems.length > 0 ? (
            <>
              {filteredMenuItems.map((item) => (
                <motion.div key={item.label} whileTap={{ scale: 0.985, x: 4 }} transition={{ duration: 0.14 }}>
                  <Link
                    to={item.to}
                    onClick={handleSectionNavigation(item.to)}
                    className="flex min-h-0 flex-1 items-center justify-between gap-3 py-3 text-left"
                  >
                    <div>
                      <span className="block text-[17px] font-medium text-neutral-900">{item.label}</span>
                      <span className="mt-1 block text-sm text-neutral-500">{item.note}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
                  </Link>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="pt-4 text-sm text-neutral-500">No matching home sections.</div>
          )
        }
        cta={
          <motion.a
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-black px-5 py-3 text-left text-base font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-800"
          >
            <span>Contact</span>
          </motion.a>
        }
        footer={
          <div className="text-sm text-neutral-600">
            <p className="text-base font-medium text-black">
              <span className="b2w-wordmark">B2W LLC</span>
            </p>
            <p className="mt-2 text-sm text-neutral-500">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        }
      />
    </nav>
  );
}
