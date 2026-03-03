import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const primaryNav = [
  { to: '/individuals', label: 'Individuals' },
  { to: '/enterprises', label: 'Enterprises' },
  { to: '/government-solutions', label: 'Government' }
];

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem('b2w-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return 'light';
}

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    window.localStorage.setItem('b2w-theme', theme);
  }, [theme]);

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="site-header">
        <Link to="/" className="brandmark" aria-label="B2W home">
          <span className="brandmark-dot" />
          B2W
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`nav-container ${menuOpen ? 'is-open' : ''}`}>
          <nav id="primary-navigation" className="site-nav" aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <a className="btn btn-compact header-cta" href="mailto:team@b2w-ai.com?subject=B2W%20Intro%20Call">
            Book Intro Call
            <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-title">B2W AI</p>
          <p className="footer-copy">
            AI systems that improve communication and optimize actionable insights for individuals, enterprises, and
            public sector teams.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/individuals">Individuals</Link>
          <Link to="/enterprises">Enterprises</Link>
          <Link to="/government-solutions">Government</Link>
          <a href="mailto:team@b2w-ai.com">team@b2w-ai.com</a>
        </div>
      </footer>
    </div>
  );
}
