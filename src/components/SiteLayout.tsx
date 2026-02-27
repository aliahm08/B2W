import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/individuals', label: 'Individuals' },
  { to: '/enterprises', label: 'Enterprises' },
  { to: '/government-solutions', label: 'Government' }
];

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
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
          <span />
          <span />
          <span />
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
          <a className="btn btn-compact" href="mailto:team@b2w-ai.com">
            Talk to B2W
          </a>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-title">B2W AI Consulting</p>
          <p className="footer-copy">AI systems that improve communication and optimize actionable insights.</p>
        </div>
        <div className="footer-links">
          <Link to="/individuals">Individuals</Link>
          <Link to="/enterprises">Enterprises</Link>
          <Link to="/government-solutions">Government</Link>
          <a href="https://b2w-ai.com" target="_blank" rel="noreferrer">
            b2w-ai.com
          </a>
        </div>
      </footer>
    </div>
  );
}
