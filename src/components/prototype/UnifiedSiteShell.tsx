import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { unifiedPrototype } from '../../content/unifiedPrototype';
import { workspaceCssVariables } from '../../content/workspaceBrandSystem';

type UnifiedSiteShellProps = {
  children: ReactNode;
  theme?: 'light' | 'dark';
};

function PrototypeBrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/prototype" aria-label="B2W prototype home" className="inline-flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center overflow-visible">
        <img src="/brand/clara-logo-solid.png" alt="" className="h-full w-full object-contain" />
      </span>
      <span className={`text-xl font-medium tracking-[-0.075em] ${dark ? 'text-white' : 'text-black'}`}>B2W</span>
    </Link>
  );
}

export function UnifiedSiteShell({ children, theme = 'light' }: UnifiedSiteShellProps) {
  return (
    <div
      className={theme === 'dark' ? 'min-h-screen bg-neutral-950 text-white' : 'min-h-screen bg-[var(--b2w-canvas)] text-[var(--b2w-ink)]'}
      style={workspaceCssVariables as CSSProperties}
    >
      <UnifiedHeader theme={theme} />
      {children}
      <UnifiedFooter theme={theme} />
    </div>
  );
}

function UnifiedHeader({ theme }: { theme: 'light' | 'dark' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dark = theme === 'dark';
  const productNavigation = unifiedPrototype.navigation.find((item) => item.label === 'Products');
  const primaryNavigation = unifiedPrototype.navigation.filter((item) => item.label !== 'Contact');

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setProductsOpen(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [searchOpen]);

  const filteredSearchEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return unifiedPrototype.searchEntries.slice(0, 7);
    return unifiedPrototype.searchEntries
      .filter((entry) => `${entry.label} ${entry.group} ${entry.description}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [searchQuery]);

  const goTo = (to: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(to);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${dark ? 'border-white/10 bg-neutral-950/90' : 'border-neutral-200 bg-[#FAFAF8]/92'}`}>
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
          <PrototypeBrandMark dark={dark} />

          <nav className="hidden items-center gap-7 md:flex" aria-label="Prototype navigation">
            {primaryNavigation.map((item) => {
              const active = location.pathname === item.to || ('children' in item && item.children?.some((child) => location.pathname === child.to));

              if ('children' in item && item.children) {
                return (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setProductsOpen((current) => !current)}
                      className={`inline-flex min-h-10 items-center gap-1.5 text-xs font-medium transition ${
                        active
                          ? dark ? 'text-white' : 'text-black'
                          : dark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
                      }`}
                      aria-expanded={productsOpen}
                    >
                      {item.label}
                      <ChevronDown className={`h-3.5 w-3.5 transition ${productsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {productsOpen ? (
                      <div className="absolute left-1/2 top-full w-[25rem] -translate-x-1/2 pt-3">
                        <div className={`border p-2 shadow-[0_24px_80px_rgba(0,0,0,.16)] ${dark ? 'border-white/10 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
                          <Link
                            to={item.to}
                            className={`block border-b px-4 py-4 ${dark ? 'border-white/10 hover:bg-white/5' : 'border-neutral-100 hover:bg-neutral-50'}`}
                          >
                            <p className="text-sm font-semibold">All products</p>
                            <p className={`mt-1 text-xs ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>Agents, workflows, and commercial packages.</p>
                          </Link>
                          {item.children.map((child) => (
                            <Link key={child.to} to={child.to} className={`block px-4 py-4 ${dark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}>
                              <p className="text-sm font-semibold">{child.label}</p>
                              <p className={`mt-1 text-xs leading-5 ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>{child.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex min-h-10 items-center text-xs font-medium transition ${
                    active
                      ? dark ? 'text-white' : 'text-black'
                      : dark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`inline-flex h-10 items-center gap-2 border px-3 text-xs font-medium transition ${
                dark ? 'border-white/15 text-neutral-300 hover:border-white/35 hover:text-white' : 'border-neutral-300 bg-white text-neutral-600 hover:border-black hover:text-black'
              }`}
              aria-label="Search website"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search</span>
              <span className={`hidden border-l pl-2 font-mono text-[9px] xl:inline ${dark ? 'border-white/15 text-neutral-500' : 'border-neutral-200 text-neutral-400'}`}>⌘K</span>
            </button>
            <Link
              to="/prototype/contact"
              className={`hidden min-h-10 items-center gap-2 border px-4 text-xs font-semibold transition sm:inline-flex ${
                dark
                  ? 'border-white bg-white text-black hover:bg-neutral-200'
                  : 'border-black bg-black text-white hover:bg-neutral-800'
              }`}
            >
              Contact
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              className={`inline-flex h-10 w-10 items-center justify-center border md:hidden ${dark ? 'border-white/20' : 'border-neutral-300 bg-white'}`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className={`border-t px-5 py-5 md:hidden ${dark ? 'border-white/10 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {unifiedPrototype.navigation.map((item) => (
                <div key={item.to}>
                  <Link
                    to={item.to}
                    className={`block px-3 py-3 text-base font-medium ${location.pathname === item.to ? dark ? 'bg-white/5' : 'bg-neutral-100' : ''}`}
                  >
                    {item.label}
                  </Link>
                  {'children' in item && item.children ? (
                    <div className={`ml-3 border-l pl-3 ${dark ? 'border-white/10' : 'border-neutral-200'}`}>
                      {item.children.map((child) => (
                        <Link key={child.to} to={child.to} className={`block px-3 py-2.5 text-sm ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      {searchOpen ? (
        <div className="fixed inset-0 z-[100] bg-black/55 px-4 pt-[10vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search B2W">
          <button type="button" className="absolute inset-0 h-full w-full cursor-default" onClick={() => setSearchOpen(false)} aria-label="Close search" />
          <div className="relative mx-auto max-w-2xl border border-neutral-700 bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,.45)]">
            <div className="flex items-center gap-3 border-b border-white/10 px-5">
              <Search className="h-5 w-5 text-neutral-500" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search services, products, workflows, resources..."
                className="h-16 min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-neutral-600"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-neutral-500 transition hover:text-white" aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredSearchEntries.length ? filteredSearchEntries.map((entry) => (
                <button
                  key={`${entry.group}-${entry.to}`}
                  type="button"
                  onClick={() => goTo(entry.to)}
                  className="flex w-full items-center justify-between gap-5 px-4 py-4 text-left transition hover:bg-white/5"
                >
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-600">{entry.group}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{entry.label}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-400">{entry.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-neutral-600" />
                </button>
              )) : (
                <p className="px-4 py-10 text-center text-sm text-neutral-500">No matching pages or resources.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function UnifiedFooter({ theme }: { theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';
  const productNavigation = unifiedPrototype.navigation.find((item) => item.label === 'Products');

  return (
    <footer className={`border-t ${dark ? 'border-white/10 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <PrototypeBrandMark dark={dark} />
            <p className={`mt-5 max-w-sm text-sm leading-6 ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>{unifiedPrototype.promise}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <PrototypeEyebrow>Company</PrototypeEyebrow>
              <div className="mt-4 space-y-3 text-sm">
                <Link to="/prototype/services" className={dark ? 'block text-neutral-400 hover:text-white' : 'block text-neutral-500 hover:text-black'}>Services</Link>
                <Link to="/prototype/about" className={dark ? 'block text-neutral-400 hover:text-white' : 'block text-neutral-500 hover:text-black'}>About</Link>
                <Link to="/prototype/contact" className={dark ? 'block text-neutral-400 hover:text-white' : 'block text-neutral-500 hover:text-black'}>Contact</Link>
              </div>
            </div>
            <div>
              <PrototypeEyebrow>Products</PrototypeEyebrow>
              <div className="mt-4 space-y-3 text-sm">
                {productNavigation && 'children' in productNavigation ? productNavigation.children?.map((item) => (
                  <Link key={item.to} to={item.to} className={dark ? 'block text-neutral-400 hover:text-white' : 'block text-neutral-500 hover:text-black'}>{item.label}</Link>
                )) : null}
              </div>
            </div>
            <div>
              <PrototypeEyebrow>Explore</PrototypeEyebrow>
              <div className="mt-4 space-y-3 text-sm">
                <Link to="/prototype/resources" className={dark ? 'block text-neutral-400 hover:text-white' : 'block text-neutral-500 hover:text-black'}>Resources</Link>
                <Link to="/prototype/guide" className={dark ? 'block text-neutral-400 hover:text-white' : 'block text-neutral-500 hover:text-black'}>Operator guide</Link>
                <button type="button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} className={dark ? 'block text-left text-neutral-400 hover:text-white' : 'block text-left text-neutral-500 hover:text-black'}>Search</button>
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-10 flex flex-col gap-3 border-t pt-5 text-[10px] font-mono uppercase tracking-[0.16em] sm:flex-row sm:items-center sm:justify-between ${dark ? 'border-white/10 text-neutral-600' : 'border-neutral-200 text-neutral-400'}`}>
          <span>© {new Date().getFullYear()} B2W LLC</span>
          <span>Services · Products · Resources</span>
        </div>
      </div>
    </footer>
  );
}

export function PrototypeEyebrow({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'jason' | 'clara' | 'active' }) {
  const tones = {
    neutral: 'text-neutral-500',
    jason: 'text-[#B24A24]',
    clara: 'text-[#A66589]',
    active: 'text-[#4F7F52]',
  } as const;

  return <p className={`text-[10px] font-mono uppercase tracking-[0.2em] ${tones[tone]}`}>{children}</p>;
}

export function PrototypeButton({
  children,
  to,
  tone = 'primary',
  size = 'default',
}: {
  children: ReactNode;
  to: string;
  tone?: 'primary' | 'secondary' | 'jason' | 'clara';
  size?: 'compact' | 'default' | 'large';
}) {
  const tones = {
    primary: 'border-black bg-black text-white hover:bg-neutral-800',
    secondary: 'border-neutral-300 bg-white text-black hover:border-black',
    jason: 'border-[#B24A24] bg-[#B24A24] text-white hover:bg-[#913B1D]',
    clara: 'border-[#A66589] bg-[#3D1F33] text-white hover:bg-[#5A2F49]',
  } as const;
  const sizes = {
    compact: 'min-h-10 px-4 text-xs',
    default: 'min-h-12 px-5 text-sm',
    large: 'min-h-14 px-6 text-base',
  } as const;
  const className = `inline-flex items-center justify-center gap-2 border font-semibold transition ${tones[tone]} ${sizes[size]}`;
  const isExternal = to.startsWith('mailto:') || to.startsWith('http://') || to.startsWith('https://') || to.startsWith('#');

  if (isExternal) {
    return (
      <a href={to} className={className} target={to.startsWith('http') ? '_blank' : undefined} rel={to.startsWith('http') ? 'noreferrer' : undefined}>
        {children}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
