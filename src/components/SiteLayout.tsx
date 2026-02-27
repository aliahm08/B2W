import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/individuals', label: 'Individuals' },
  { to: '/enterprises', label: 'Enterprises' },
  { to: '/government-solutions', label: 'Government' }
];

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brandmark" aria-label="B2W home">
          <span className="brandmark-dot" />
          B2W
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
          <a className="btn btn-compact" href="mailto:team@b2w-ai.com" style={{ marginLeft: '1rem' }}>
            Book Consultation
          </a>
        </nav>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <p className="brandmark" style={{ fontSize: '1rem' }}>
            <span className="brandmark-dot" style={{ background: 'var(--muted)', boxShadow: 'none' }} />
            B2W AI
          </p>
          <p>Architecting systems for operational clarity.</p>
        </div>
        <div className="footer-links">
          <Link to="/individuals">Individuals</Link>
          <Link to="/enterprises">Enterprises</Link>
          <Link to="/government-solutions">Government</Link>
          <a href="https://b2w-ai.com" target="_blank" rel="noreferrer" className="mono-font" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            b2w-ai.com
          </a>
        </div>
      </footer>
    </div>
  );
}
