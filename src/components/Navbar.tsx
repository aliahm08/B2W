import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Menu, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-medium tracking-tight">
          <span className="b2w-wordmark">B2W</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link to="/#capabilities" className="hover:text-black transition-colors">Capabilities</Link>
          <Link to="/#expertise" className="hover:text-black transition-colors">Expertise</Link>
          <Link to="/#projects" className="hover:text-black transition-colors">Projects</Link>
          <Link to="/#process" className="hover:text-black transition-colors">Process</Link>
          <Link to="/#team" className="hover:text-black transition-colors">Team</Link>
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
            <p className="mt-2 text-sm text-neutral-600">Explore the public site without entering the client portal.</p>

            <div className="mobile-menu-search-shell mt-4">
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
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex min-h-0 flex-1 items-center justify-between gap-3 py-3 text-left"
                >
                  <div>
                    <span className="block text-[17px] font-medium text-neutral-900">{item.label}</span>
                    <span className="mt-1 block text-sm text-neutral-500">{item.note}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-400" />
                </Link>
              ))}
            </>
          ) : (
            <div className="pt-4 text-sm text-neutral-500">No matching home sections.</div>
          )
        }
        cta={
          <a
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
            className="inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-black px-5 py-3 text-left text-base font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-800"
          >
            <span>Contact</span>
          </a>
        }
        footer={
          <div className="text-sm text-neutral-600">
            <p className="text-base font-medium text-black">
              <span className="b2w-wordmark">B2W LLC</span>
            </p>
            <p className="mt-2 text-sm text-neutral-500">© {new Date().getFullYear()} All rights reserved.</p>
            <p className="mt-3 text-sm text-neutral-500">Public site menu. Client navigation remains separate.</p>
          </div>
        }
      />
    </nav>
  );
}
