import { FormEvent, ReactNode, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import B2WIcon from '../../components/logo/B2WIcon';
import Seo from '../../components/Seo';

type AuthState = 'checking' | 'locked' | 'authenticated';

function InternalAccessScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/b2w-executive-strategy?action=login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const result = await response.json() as { authenticated?: boolean; error?: string };

      if (!response.ok || !result.authenticated) {
        setError(result.error ?? 'That password is not correct.');
        return;
      }

      setPassword('');
      onAuthenticated();
    } catch {
      setError('Internal access is temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F1E8] text-[#17221E]">
      <Seo
        title="B2W Internal Access"
        description="Private B2W internal workspace."
        robots="noindex, nofollow"
        canonicalPath="/internal"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,60,51,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,60,51,0.08) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div aria-hidden="true" className="absolute -left-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-[#D8B56A]/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-56 -right-36 h-[42rem] w-[42rem] rounded-full bg-[#6F9A86]/22 blur-3xl" />

      <Link
        to="/"
        className="absolute left-5 top-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/65 px-4 text-xs font-semibold text-[#223C33] backdrop-blur transition hover:bg-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        B2W home
      </Link>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-24 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#223C33]/15 bg-[#F8F5EE]/92 shadow-[0_45px_120px_rgba(34,60,51,0.18)] backdrop-blur lg:grid-cols-[minmax(0,1fr)_430px]">
          <section className="hidden min-h-[650px] border-r border-[#223C33]/12 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <B2WIcon title="" className="h-10 w-11 text-[#223C33]" />
                <div>
                  <p className="b2w-wordmark text-sm font-semibold tracking-[0.18em]">B2W</p>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#223C33]/45">Internal workspace</p>
                </div>
              </div>
              <p className="mt-28 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-0.05em]">
                One secure entry point for planning, tracking, and execution.
              </p>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#223C33]/62">
                Review the Operating Map, track Executive Strategy through Gurge, or open the source Business Plan.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ['Operating map', 'Direction + execution'],
                ['Executive strategy', 'Tracking tool'],
                ['Business plan', 'Source document'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#223C33]/12 bg-white/55 p-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#223C33]/40">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#223C33]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-[650px] flex-col justify-center p-7 sm:p-10">
            <B2WIcon title="" className="h-10 w-11 text-[#223C33] lg:hidden" />
            <div className="mt-10 grid h-12 w-12 place-items-center rounded-2xl border border-[#223C33]/12 bg-white lg:mt-0">
              <LockKeyhole className="h-5 w-5 text-[#B68124]" />
            </div>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#997022]">
              Protected workspace
            </p>
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">Internal access</h1>
            <p className="mt-4 text-sm leading-6 text-[#223C33]/58">
              Enter the internal password to open B2W&apos;s planning, strategy-tracking, and execution workspace.
            </p>

            <form className="mt-9" onSubmit={handleSubmit}>
              <label htmlFor="b2w-internal-password" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#223C33]/50">
                Internal password
              </label>
              <div className="relative mt-3">
                <input
                  id="b2w-internal-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  autoComplete="current-password"
                  className="h-14 w-full rounded-2xl border border-[#B68124]/75 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-[#223C33]/35 focus:border-[#223C33]"
                  placeholder="Enter password"
                  aria-invalid={Boolean(error)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#223C33]/45 transition hover:text-[#223C33]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error ? <p className="mt-3 text-xs text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={!password || isSubmitting}
                className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#223C33] px-5 text-sm font-semibold text-white transition hover:bg-[#172B24] disabled:cursor-not-allowed disabled:bg-[#223C33]/35"
              >
                <ShieldCheck className="h-4 w-4" />
                {isSubmitting ? 'Verifying' : 'Open internal workspace'}
              </button>
            </form>

            <p className="mt-8 flex items-center gap-2 text-[11px] text-[#223C33]/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private · no search indexing · secure session
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function InternalHub({ onLock }: { onLock: () => void }) {
  const destinations = [
    {
      title: 'Operating Map',
      description:
        'Review B2W’s strategy, priorities, ownership, and progress.',
      to: '/internal/services',
      Icon: LayoutDashboard,
      tone: 'bg-[#223C33] text-white',
      iconTone: 'text-[#D8B56A]',
    },
    {
      title: 'Tracking Tool',
      description:
        'Track products, clients, metrics, and executive updates.',
      to: '/internal/portal',
      Icon: ListChecks,
      tone: 'bg-white text-[#17221E]',
      iconTone: 'text-[#997022]',
      portal: true,
    },
    {
      title: 'Business Plan',
      description:
        'Review the source business plan and supporting decisions.',
      to: 'https://drive.google.com/file/d/1o3PUriSophwFozltUmJHx6sim9AxT7z5/view?usp=share_link',
      Icon: BriefcaseBusiness,
      tone: 'bg-[#EDE4D1] text-[#17221E]',
      iconTone: 'text-[#997022]',
      external: true,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#17221E]">
      <Seo
        title="B2W Internal Workspace"
        description="Private B2W operating map, executive-strategy tracking tool, and business-plan workspace."
        robots="noindex, nofollow"
        canonicalPath="/internal"
      />
      <header className="border-b border-[#223C33]/12 bg-[#F8F5EE]/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <B2WIcon title="" className="h-9 w-10 text-[#223C33]" />
            <div>
              <p className="b2w-wordmark text-xs font-semibold tracking-[0.17em]">B2W</p>
              <p className="mt-0.5 text-[8px] uppercase tracking-[0.2em] text-[#223C33]/42">Internal workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLock}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/65 px-4 text-xs font-semibold transition hover:bg-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#997022]">Executive Summary</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-7xl">
          Our mission is to improve communication and optimize actionable insights.
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-[#223C33]/62 sm:text-lg">
          We help small and midsize business owners by providing a WhatsApp-based AI assistant that can summarize, search, and act.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {destinations.map(({ title, description, to, Icon, tone, iconTone, external, portal }) => {
            const content = (
              <>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-current/15 bg-current/5">
                  <Icon className={`h-5 w-5 ${iconTone}`} />
                </span>
                {portal ? (
                  <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                ) : external ? (
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                ) : (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-medium tracking-[-0.04em]">{title}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 opacity-60">{description}</p>
              </div>
              </>
            );
            const className = `group flex min-h-72 flex-col justify-between rounded-[2rem] border border-[#223C33]/12 p-7 shadow-[0_24px_70px_rgba(34,60,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_85px_rgba(34,60,51,0.14)] sm:p-8 ${tone}`;

            return external ? (
              <a key={to} href={to} target="_blank" rel="noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <Link key={to} to={to} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default function InternalAccessGate({ children }: { children?: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('checking');

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const response = await fetch('/api/b2w-executive-strategy?action=status', {
          method: 'GET',
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        });
        const result = await response.json() as { authenticated?: boolean };
        if (active) setAuthState(result.authenticated ? 'authenticated' : 'locked');
      } catch {
        if (active) setAuthState('locked');
      }
    };

    void verifySession();
    window.addEventListener('pageshow', verifySession);

    return () => {
      active = false;
      window.removeEventListener('pageshow', verifySession);
    };
  }, []);

  const handleLock = async () => {
    try {
      await fetch('/api/b2w-executive-strategy?action=logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
    } finally {
      setAuthState('locked');
    }
  };

  if (authState === 'checking') {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F5F1E8] text-[#223C33]">
        <Seo
          title="B2W Internal Access"
          description="Private B2W internal workspace."
          robots="noindex, nofollow"
          canonicalPath="/internal"
        />
        <div className="flex items-center gap-3 text-sm text-[#223C33]/55">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#B68124]" />
          Checking internal access
        </div>
      </main>
    );
  }

  if (authState === 'locked') {
    return <InternalAccessScreen onAuthenticated={() => setAuthState('authenticated')} />;
  }

  return children ?? <InternalHub onLock={() => void handleLock()} />;
}
