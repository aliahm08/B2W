import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
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

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 border-b border-neutral-200 bg-[#faf8f2]/95 px-5 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500">Home Navigation</p>
              <p className="mt-1 text-sm text-neutral-600">Explore the public site without entering the client portal.</p>
            </div>
          </div>

          <div className="mobile-menu-search-shell">
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

          <div className="mt-5 flex flex-col gap-2">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-[1.4rem] border border-black/8 bg-white/90 px-4 py-3 transition-all hover:border-black/20 hover:bg-white"
                  onClick={() => {
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <span className="block text-base font-medium text-neutral-900">{item.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-neutral-500">{item.note}</span>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-black/10 bg-white/70 px-4 py-4 text-sm text-neutral-500">
                No matching home sections.
              </div>
            )}
          </div>

          <a
            href="mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
          >
            Contact
          </a>
        </motion.div>
      )}
    </nav>
  );
}
