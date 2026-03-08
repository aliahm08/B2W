import { Button, Flex, Text } from '@radix-ui/themes';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  brandName,
  missionStatement,
  navItems,
  primaryCtaLabel,
  primaryCtaPath,
  productName
} from '../content/mission';

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [location.pathname, prefersReducedMotion]);

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="site-header" aria-label="Primary">
        <Flex align="center" justify="between" gap="3" className="header-grid">
          <Link to="/" className="brand-lockup" aria-label="B2W home">
            <span className="brand-name">{brandName}</span>
            <span className="brand-product">{productName}</span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <nav
            id="primary-navigation"
            className={menuOpen ? 'site-nav is-open' : 'site-nav'}
            aria-label="Website"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Button asChild size="2" className="header-cta">
            <Link to={primaryCtaPath}>{primaryCtaLabel}</Link>
          </Button>
        </Flex>
      </header>

      <main id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: 'easeOut' }
            }
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <Text size="2">{missionStatement}</Text>
      </footer>
    </div>
  );
}
