import { useEffect, useState, type ReactNode, type CSSProperties } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import B2WLogoMark from '../B2WLogoMark';
import { unifiedPrototype } from '../../content/unifiedPrototype';
import { workspaceCssVariables } from '../../content/workspaceBrandSystem';

type UnifiedSiteShellProps = {
  children: ReactNode;
  theme?: 'light' | 'dark';
};

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
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dark = theme === 'dark';

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${dark ? 'border-white/10 bg-neutral-950/88' : 'border-neutral-200 bg-[#FAFAF8]/90'}`}>
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <B2WLogoMark
          to="/prototype"
          wordmark="B2W"
          label="B2W prototype home"
          className={dark ? 'text-white' : 'text-black'}
        />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Prototype navigation">
          {unifiedPrototype.navigation.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-xs font-medium transition ${
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

        <div className="flex items-center gap-3">
          <Link
            to="/prototype/jasonai"
            className={`hidden min-h-10 items-center gap-2 border px-4 text-xs font-semibold transition sm:inline-flex ${
              dark
                ? 'border-white/20 bg-white text-black hover:bg-neutral-200'
                : 'border-black bg-black text-white hover:bg-neutral-800'
            }`}
          >
            Get JasonAI
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className={`inline-flex h-10 w-10 items-center justify-center border md:hidden ${dark ? 'border-white/20' : 'border-neutral-300 bg-white'}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className={`border-t px-5 py-5 md:hidden ${dark ? 'border-white/10 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {unifiedPrototype.navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-3 text-base font-medium ${
                  location.pathname === item.to
                    ? dark ? 'bg-white/10 text-white' : 'bg-neutral-100 text-black'
                    : dark ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/prototype/jasonai"
              className={`mt-3 inline-flex min-h-12 items-center justify-center gap-2 border px-5 text-sm font-semibold ${
                dark ? 'border-white bg-white text-black' : 'border-black bg-black text-white'
              }`}
            >
              Get JasonAI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function UnifiedFooter({ theme }: { theme: 'light' | 'dark' }) {
  const dark = theme === 'dark';

  return (
    <footer className={`border-t ${dark ? 'border-white/10 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className={`text-[10px] font-mono uppercase tracking-[0.2em] ${dark ? 'text-neutral-500' : 'text-neutral-400'}`}>B2W LLC</p>
          <p className={`mt-4 max-w-2xl text-2xl font-medium tracking-[-0.035em] ${dark ? 'text-white' : 'text-black'}`}>
            {unifiedPrototype.promise}
          </p>
          <p className={`mt-4 max-w-xl text-sm leading-6 ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Consulting, operational systems, JasonAI, and practical resources for businesses that need clearer decisions and follow-through.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
          {unifiedPrototype.navigation.slice(0, 3).map((item) => (
            <Link key={item.to} to={item.to} className={dark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'}>
              {item.label}
            </Link>
          ))}
          <a href="mailto:info@b2w-ai.com" className={dark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'}>
            Contact
          </a>
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

export function PrototypeButton({ children, to, tone = 'primary' }: { children: ReactNode; to: string; tone?: 'primary' | 'secondary' | 'jason' | 'clara' }) {
  const tones = {
    primary: 'border-black bg-black text-white hover:bg-neutral-800',
    secondary: 'border-neutral-300 bg-white text-black hover:border-black',
    jason: 'border-[#B24A24] bg-[#B24A24] text-white hover:bg-[#913B1D]',
    clara: 'border-[#A66589] bg-[#3D1F33] text-white hover:bg-[#5A2F49]',
  } as const;
  const className = `inline-flex min-h-12 items-center justify-center gap-2 border px-5 text-sm font-semibold transition ${tones[tone]}`;
  const isExternalAction = to.startsWith('mailto:') || to.startsWith('https://') || to.startsWith('http://');

  if (isExternalAction) {
    return (
      <a href={to} className={className}>
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
