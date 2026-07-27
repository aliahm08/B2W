import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleAlert,
  Code2,
  Compass,
  Eye,
  EyeOff,
  Gauge,
  KeyRound,
  Layers3,
  LockKeyhole,
  LogOut,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

type DashboardData = {
  generatedAt: string;
  metrics: {
    leads7d: number;
    leads30d: number;
    leads90d: number;
    commits7d: number;
    commits30d: number;
    commits90d: number;
  };
  series: {
    leads30d: Array<{ date: string; value: number }>;
    commits30d: Array<{ date: string; value: number }>;
  };
  leadSources: Array<{ label: string; value: number }>;
  activity: Array<{
    id: string;
    type: 'demand' | 'delivery';
    title: string;
    detail: string;
    timestamp: string;
  }>;
  connections: Array<{
    id: string;
    label: string;
    connected: boolean;
    detail: string;
  }>;
};

type ViewId = 'overview' | 'execution' | 'market' | 'product' | 'signals';
type TimeWindow = 7 | 30 | 90;

const views: Array<{ id: ViewId; label: string; icon: typeof Compass }> = [
  { id: 'overview', label: 'Command view', icon: Compass },
  { id: 'execution', label: 'Execution', icon: Target },
  { id: 'market', label: 'Go-to-market', icon: TrendingUp },
  { id: 'product', label: 'Product', icon: Layers3 },
  { id: 'signals', label: 'Live signals', icon: Activity },
];

const strategicPriorities = [
  {
    id: 'pilot',
    label: 'Founding customer motion',
    owner: 'Commercial',
    status: 'In market',
    progress: 64,
    outcome: 'Turn contractor discovery into 3 design-partner pilots with clear baseline metrics.',
    next: 'Package the pilot offer and lock weekly operator feedback.',
    tone: '#36d399',
  },
  {
    id: 'workflow',
    label: 'Workflow intelligence core',
    owner: 'Product',
    status: 'Building',
    progress: 72,
    outcome: 'Capture job context, scope drift, commitments, and follow-ups from daily communication.',
    next: 'Validate the signal model against real job threads and field notes.',
    tone: '#65a8ff',
  },
  {
    id: 'proof',
    label: 'Proof and measurement',
    owner: 'Strategy',
    status: 'Designing',
    progress: 43,
    outcome: 'Show recovered revenue, avoided misses, and time returned to managers in one scorecard.',
    next: 'Finalize the pre-pilot baseline and value-event taxonomy.',
    tone: '#d8a9ff',
  },
] as const;

const roadmap = [
  {
    horizon: 'Now',
    date: '0–30 days',
    items: ['Pilot offer and success criteria', 'Signal taxonomy v1', 'Job-level executive scorecard'],
    color: '#36d399',
  },
  {
    horizon: 'Next',
    date: '31–60 days',
    items: ['Design-partner onboarding', 'Manager review loop', 'Value-event instrumentation'],
    color: '#65a8ff',
  },
  {
    horizon: 'Later',
    date: '61–90 days',
    items: ['Repeatable implementation kit', 'Pricing validation', 'Operator referral motion'],
    color: '#d8a9ff',
  },
] as const;

const risks = [
  { title: 'Signal quality varies by crew', level: 'High', response: 'Start with manager-visible channels and add capture patterns by workflow.' },
  { title: 'Value story becomes too broad', level: 'Medium', response: 'Anchor every pilot to 2–3 measurable loss or follow-up events.' },
  { title: 'Integration scope slows learning', level: 'Medium', response: 'Keep the first deployment read-first and approve actions manually.' },
] as const;

function formatRelativeTime(value?: string) {
  if (!value) return 'Not synced';
  const delta = Date.now() - new Date(value).getTime();
  if (delta < 60_000) return 'Just now';
  if (delta < 3_600_000) return `${Math.max(1, Math.floor(delta / 60_000))}m ago`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)}h ago`;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function MiniBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden="true">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="min-w-1 flex-1 rounded-t-sm transition-all duration-500"
          style={{
            height: `${Math.max(9, (value / max) * 100)}%`,
            background: value ? color : 'rgba(255,255,255,0.07)',
            opacity: 0.55 + (index / Math.max(1, values.length - 1)) * 0.45,
          }}
        />
      ))}
    </div>
  );
}

export function JasonAIExecutiveAccessScreen({
  configured,
  onAuthenticated,
}: {
  configured: boolean;
  onAuthenticated: () => void;
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/jasonai-executive-strategy?action=login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok || !result.authenticated) {
        setError(result.error || 'Access could not be verified.');
        return;
      }
      setPassword('');
      onAuthenticated();
    } catch {
      setError('The secure access service is not responding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090d] text-white">
      <Seo
        title="JasonAI Executive Strategy"
        description="Private JasonAI executive strategy dashboard."
        robots="noindex, nofollow"
      />
      <Link
        to="/internal/jason-ai"
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-medium text-white/55 backdrop-blur transition hover:border-white/20 hover:text-white md:left-8 md:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Internal Portal
      </Link>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(54,211,153,.13), transparent 32%), radial-gradient(circle at 80% 12%, rgba(101,168,255,.1), transparent 28%), linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.025) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 52px 52px, 52px 52px',
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 md:px-8">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0d12]/94 shadow-[0_50px_140px_rgba(0,0,0,.55)] backdrop-blur-xl lg:grid-cols-[minmax(0,1.15fr)_440px]">
          <section className="relative hidden min-h-[650px] overflow-hidden border-r border-white/10 p-10 lg:block xl:p-14">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#36d399] text-[#07110d]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.24em] text-white">JASONAI</p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Executive Strategy</p>
                </div>
              </div>

              <h1 className="mt-24 max-w-xl text-5xl font-medium leading-[1.04] tracking-[-0.045em] xl:text-6xl">
                One operating view for the decisions that move JasonAI forward.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/48">
                Live demand, delivery activity, strategic priorities, product direction, and the next 90 days—connected in one private workspace.
              </p>
            </div>

            <div className="absolute inset-x-10 bottom-10 grid grid-cols-3 gap-3 xl:inset-x-14">
              {[
                ['Demand', 'Live pipeline'],
                ['Delivery', 'Repo activity'],
                ['Strategy', '90-day view'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{label}</p>
                  <p className="mt-2 text-sm font-medium text-white/80">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-[650px] flex-col justify-center p-7 sm:p-10">
            <div className="lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#36d399] text-[#07110d]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] lg:mt-0">
              <LockKeyhole className="h-5 w-5 text-[#36d399]" />
            </div>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#36d399]">Restricted workspace</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em]">Executive access</h2>
            <p className="mt-4 text-sm leading-6 text-white/45">
              Enter the internal access key. Sessions expire automatically and dashboard data is never included in the public page.
            </p>

            <form className="mt-9" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value="JasonAI Executive"
                autoComplete="username"
                readOnly
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <label htmlFor="executive-access-key" className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                Access key
              </label>
              <div className="relative mt-3">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/28" />
                <input
                  id="executive-access-key"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition focus:border-[#36d399]/60 focus:bg-white/[0.055]"
                  placeholder="Enter internal key"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/28 transition hover:text-white"
                  aria-label={showPassword ? 'Hide access key' : 'Show access key'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error ? (
                <p className="mt-3 flex items-center gap-2 text-xs text-red-300">
                  <CircleAlert className="h-4 w-4" />
                  {error}
                </p>
              ) : null}
              {!configured ? (
                <p className="mt-3 text-xs leading-5 text-amber-200/75">
                  Portal credentials must be configured in the production environment before access can be granted.
                </p>
              ) : null}
              <button
                type="submit"
                disabled={!password || isSubmitting}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#36d399] px-5 text-sm font-semibold text-[#07110d] transition hover:bg-[#48e3a9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {isSubmitting ? 'Verifying' : 'Open strategy dashboard'}
              </button>
            </form>

            <p className="mt-8 flex items-center gap-2 text-[11px] text-white/28">
              <ShieldCheck className="h-3.5 w-3.5" />
              No customer names or contact details are exposed in this view.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function Dashboard({
  data,
  isRefreshing,
  onRefresh,
  onLogout,
}: {
  data: DashboardData;
  isRefreshing: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [window, setWindow] = useState<TimeWindow>(30);
  const [expandedPriority, setExpandedPriority] = useState<string | null>('pilot');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const metricSuffix = window === 7 ? '7d' : window === 30 ? '30d' : '90d';
  const leads = data.metrics[`leads${metricSuffix}` as keyof DashboardData['metrics']];
  const commits = data.metrics[`commits${metricSuffix}` as keyof DashboardData['metrics']];
  const connectedCount = data.connections.filter((connection) => connection.connected).length;
  const maxSource = Math.max(1, ...data.leadSources.map((source) => source.value));

  const sectionTitle = views.find((view) => view.id === activeView)?.label ?? 'Command view';

  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <Seo
        title="JasonAI Executive Strategy"
        description="Private JasonAI executive strategy dashboard."
        robots="noindex, nofollow"
      />
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#07090d]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/internal/jason-ai"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/45 transition hover:border-white/20 hover:text-white"
              aria-label="Return to JasonAI internal portal"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#36d399] text-[#07110d]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold tracking-[0.2em]">JASONAI</p>
              <p className="truncate text-[9px] uppercase tracking-[0.18em] text-white/32">Executive Strategy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-[10px] text-white/45 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#36d399] shadow-[0_0_12px_#36d399]" />
              Live · {formatRelativeTime(data.generatedAt)}
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/50 transition hover:border-white/20 hover:text-white"
              aria-label="Refresh live data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-white/[0.03] text-white/50 transition hover:border-white/20 hover:text-white"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[228px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-4rem)] border-r border-white/8 px-4 py-6 lg:block">
          <nav className="space-y-1">
            {views.map((view) => {
              const Icon = view.icon;
              const active = activeView === view.id;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs transition ${
                    active ? 'bg-white/[0.07] text-white' : 'text-white/38 hover:bg-white/[0.035] hover:text-white/70'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-[#36d399]' : ''}`} />
                  {view.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/8 bg-white/[0.025] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/28">Connections</p>
              <span className="text-[10px] text-[#36d399]">{connectedCount}/{data.connections.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {data.connections.map((connection) => (
                <div key={connection.id} className="flex items-center gap-2 text-[11px] text-white/48">
                  <span className={`h-1.5 w-1.5 rounded-full ${connection.connected ? 'bg-[#36d399]' : 'bg-amber-300'}`} />
                  <span className="truncate">{connection.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 flex items-center gap-2 px-3 text-[9px] uppercase tracking-[0.18em] text-white/22">
            <LockKeyhole className="h-3 w-3" />
            Internal only
          </p>
        </aside>

        <section className="min-w-0 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
          <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen((value) => !value)}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/65"
            >
              {sectionTitle}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="flex rounded-xl border border-white/8 bg-white/[0.025] p-1">
              {[7, 30, 90].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWindow(value as TimeWindow)}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] ${window === value ? 'bg-white/10 text-white' : 'text-white/30'}`}
                >
                  {value}d
                </button>
              ))}
            </div>
          </div>

          {mobileNavOpen ? (
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-[#0d1117] p-3 lg:hidden">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => {
                      setActiveView(view.id);
                      setMobileNavOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left text-[11px] ${
                      activeView === view.id ? 'bg-white/[0.07] text-white' : 'text-white/40'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {view.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#36d399]">Strategy operating system</p>
              <h1 className="mt-2 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{sectionTitle}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/38">
                The live executive view of demand, product delivery, strategic focus, and the next decisions for JasonAI.
              </p>
            </div>
            <div className="hidden rounded-xl border border-white/8 bg-white/[0.025] p-1 lg:flex">
              {[7, 30, 90].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWindow(value as TimeWindow)}
                  className={`rounded-lg px-3 py-2 text-[10px] transition ${
                    window === value ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {value} days
                </button>
              ))}
            </div>
          </div>

          {activeView === 'overview' ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: 'Inbound demand',
                    value: leads,
                    suffix: `last ${window}d`,
                    icon: UsersRound,
                    color: '#36d399',
                    bars: data.series.leads30d.map((point) => point.value),
                  },
                  {
                    label: 'Build velocity',
                    value: commits,
                    suffix: `commits / ${window}d`,
                    icon: Code2,
                    color: '#65a8ff',
                    bars: data.series.commits30d.map((point) => point.value),
                  },
                  {
                    label: 'Strategic progress',
                    value: '60%',
                    suffix: 'weighted priorities',
                    icon: Target,
                    color: '#d8a9ff',
                    bars: strategicPriorities.map((priority) => priority.progress),
                  },
                  {
                    label: 'Source health',
                    value: `${connectedCount}/${data.connections.length}`,
                    suffix: 'live connections',
                    icon: Wifi,
                    color: '#ffc765',
                    bars: data.connections.map((connection) => (connection.connected ? 1 : 0)),
                  },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <article key={metric.label} className="rounded-2xl border border-white/8 bg-[#0c1016] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/32">{metric.label}</p>
                        <Icon className="h-4 w-4" style={{ color: metric.color }} />
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-3xl font-medium tracking-[-0.04em]">{metric.value}</p>
                          <p className="mt-1 text-[10px] text-white/28">{metric.suffix}</p>
                        </div>
                        <div className="w-20">
                          <MiniBars values={metric.bars.slice(-14)} color={metric.color} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(310px,.65fr)]">
                <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Executive focus</p>
                      <h2 className="mt-2 text-xl font-medium tracking-[-0.025em]">Strategic priorities</h2>
                    </div>
                    <span className="rounded-full border border-white/8 px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-white/34">
                      Q3
                    </span>
                  </div>
                  <div className="mt-5 space-y-2">
                    {strategicPriorities.map((priority) => {
                      const expanded = expandedPriority === priority.id;
                      return (
                        <div key={priority.id} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
                          <button
                            type="button"
                            onClick={() => setExpandedPriority(expanded ? null : priority.id)}
                            className="w-full p-4 text-left sm:p-5"
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: priority.tone }} />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-medium">{priority.label}</p>
                                  <p className="text-[10px] text-white/35">{priority.progress}%</p>
                                </div>
                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7">
                                  <div className="h-full rounded-full" style={{ width: `${priority.progress}%`, background: priority.tone }} />
                                </div>
                              </div>
                              <ChevronDown className={`mt-0.5 h-4 w-4 text-white/28 transition ${expanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                          {expanded ? (
                            <div className="grid gap-4 border-t border-white/8 px-5 py-4 sm:grid-cols-2 sm:pl-11">
                              <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-white/24">Outcome</p>
                                <p className="mt-2 text-xs leading-5 text-white/55">{priority.outcome}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-white/24">Next move</p>
                                <p className="mt-2 text-xs leading-5 text-white/55">{priority.next}</p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Latest movement</p>
                      <h2 className="mt-2 text-xl font-medium tracking-[-0.025em]">Live activity</h2>
                    </div>
                    <Activity className="h-4 w-4 text-[#36d399]" />
                  </div>
                  <div className="mt-5 space-y-1">
                    {data.activity.slice(0, 6).map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-xl px-1 py-3">
                        <div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                          item.type === 'demand' ? 'bg-[#36d399]/10 text-[#36d399]' : 'bg-[#65a8ff]/10 text-[#65a8ff]'
                        }`}>
                          {item.type === 'demand' ? <TrendingUp className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-xs font-medium leading-5 text-white/76">{item.title}</p>
                          <p className="mt-1 truncate text-[10px] text-white/28">{formatRelativeTime(item.timestamp)} · {item.detail}</p>
                        </div>
                      </div>
                    ))}
                    {data.activity.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-white/10 p-5 text-xs leading-5 text-white/35">
                        Connected sources have no recent activity to show.
                      </p>
                    ) : null}
                  </div>
                </article>
              </div>

              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">90-day operating path</p>
                    <h2 className="mt-2 text-xl font-medium tracking-[-0.025em]">From proof to repeatability</h2>
                  </div>
                  <p className="max-w-md text-xs leading-5 text-white/32">
                    Keep the strategy narrow: prove the value event, tighten the operator loop, then turn the learning into a repeatable deployment.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 lg:grid-cols-3">
                  {roadmap.map((phase) => (
                    <div key={phase.horizon} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium" style={{ color: phase.color }}>{phase.horizon}</p>
                        <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">{phase.date}</p>
                      </div>
                      <div className="mt-5 space-y-3">
                        {phase.items.map((item) => (
                          <div key={item} className="flex items-start gap-2 text-xs leading-5 text-white/52">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: phase.color }} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : null}

          {activeView === 'execution' ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Priority execution</p>
                <h2 className="mt-2 text-xl font-medium">What must move now</h2>
                <div className="mt-6 space-y-4">
                  {strategicPriorities.map((priority, index) => (
                    <div key={priority.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">Workstream {index + 1}</p>
                          <h3 className="mt-2 text-base font-medium">{priority.label}</h3>
                        </div>
                        <span className="rounded-full border border-white/8 px-2.5 py-1 text-[9px] text-white/38">{priority.owner}</span>
                      </div>
                      <p className="mt-4 text-xs leading-5 text-white/48">{priority.next}</p>
                      <div className="mt-5 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/7">
                          <div className="h-full rounded-full" style={{ width: `${priority.progress}%`, background: priority.tone }} />
                        </div>
                        <span className="text-[10px] text-white/30">{priority.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Risk register</p>
                <h2 className="mt-2 text-xl font-medium">Constraints to manage</h2>
                <div className="mt-6 space-y-3">
                  {risks.map((risk) => (
                    <div key={risk.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{risk.title}</p>
                        <span className={`rounded-full px-2 py-1 text-[9px] ${
                          risk.level === 'High' ? 'bg-red-400/10 text-red-300' : 'bg-amber-300/10 text-amber-200'
                        }`}>
                          {risk.level}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-white/42">{risk.response}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : null}

          {activeView === 'market' ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Connected demand</p>
                    <h2 className="mt-2 text-xl font-medium">Inbound source mix</h2>
                  </div>
                  <TrendingUp className="h-4 w-4 text-[#36d399]" />
                </div>
                <div className="mt-7 space-y-5">
                  {data.leadSources.map((source) => (
                    <div key={source.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/62">{source.label}</span>
                        <span className="text-white/34">{source.value}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/7">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#36d399,#65a8ff)]"
                          style={{ width: `${(source.value / maxSource) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {data.leadSources.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 p-6 text-xs leading-5 text-white/35">
                      No inquiry records were returned by the live pipeline.
                    </p>
                  ) : null}
                </div>
              </article>
              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Commercial thesis</p>
                <h2 className="mt-2 text-xl font-medium">Sell the recovered moment</h2>
                <p className="mt-4 text-sm leading-6 text-white/46">
                  JasonAI wins when it makes one expensive operational miss visible and recoverable—not when it promises generic AI productivity.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    ['Ideal entry', 'Owner-led contractors with 5–30 field staff'],
                    ['Primary trigger', 'Scope changes and follow-ups slipping through'],
                    ['Proof point', 'Recovered revenue or management hours within 30 days'],
                    ['Motion', 'Discovery → baseline → design partner pilot'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-white/24">{label}</p>
                      <p className="mt-2 text-xs leading-5 text-white/62">{value}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : null}

          {activeView === 'product' ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                {
                  icon: Activity,
                  title: 'Capture',
                  body: 'Listen across the work communication already happening and preserve job context without forcing a second workflow.',
                  bullets: ['Messages and voice notes', 'Job context resolution', 'Commitment extraction'],
                  color: '#36d399',
                },
                {
                  icon: Gauge,
                  title: 'Understand',
                  body: 'Turn communication into a small set of operator-relevant signals tied to risk, action, and commercial value.',
                  bullets: ['Scope drift', 'Missed follow-up', 'Unbilled extra'],
                  color: '#65a8ff',
                },
                {
                  icon: Zap,
                  title: 'Act',
                  body: 'Put the signal into the manager’s daily review with evidence, a recommended response, and an approval path.',
                  bullets: ['Manager review', 'Drafted response', 'Measured outcome'],
                  color: '#d8a9ff',
                },
              ].map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <article key={layer.title} className="relative rounded-2xl border border-white/8 bg-[#0c1016] p-6">
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.045]" style={{ color: layer.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-white/22">Layer 0{index + 1}</span>
                    </div>
                    <h2 className="mt-6 text-xl font-medium">{layer.title}</h2>
                    <p className="mt-3 text-xs leading-5 text-white/42">{layer.body}</p>
                    <div className="mt-6 space-y-3">
                      {layer.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-center gap-2 text-xs text-white/55">
                          <Check className="h-3.5 w-3.5" style={{ color: layer.color }} />
                          {bullet}
                        </div>
                      ))}
                    </div>
                    {index < 2 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 text-white/15 lg:block" /> : null}
                  </article>
                );
              })}
            </div>
          ) : null}

          {activeView === 'signals' ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Live feed</p>
                    <h2 className="mt-2 text-xl font-medium">Demand and delivery events</h2>
                  </div>
                  <RefreshCw className={`h-4 w-4 text-[#36d399] ${isRefreshing ? 'animate-spin' : ''}`} />
                </div>
                <div className="mt-6 divide-y divide-white/8">
                  {data.activity.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0">
                      <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                        item.type === 'demand' ? 'bg-[#36d399]/10 text-[#36d399]' : 'bg-[#65a8ff]/10 text-[#65a8ff]'
                      }`}>
                        {item.type === 'demand' ? <Rocket className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-5 text-white/75">{item.title}</p>
                          <span className="text-[9px] text-white/25">{formatRelativeTime(item.timestamp)}</span>
                        </div>
                        <p className="mt-1 text-[10px] leading-4 text-white/30">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-white/8 bg-[#0c1016] p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Connection status</p>
                <h2 className="mt-2 text-xl font-medium">Live sources</h2>
                <div className="mt-6 space-y-3">
                  {data.connections.map((connection) => (
                    <div key={connection.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-8 w-8 place-items-center rounded-xl ${
                          connection.connected ? 'bg-[#36d399]/10 text-[#36d399]' : 'bg-amber-300/10 text-amber-200'
                        }`}>
                          {connection.connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{connection.label}</p>
                          <p className={`mt-1 text-[9px] ${connection.connected ? 'text-[#36d399]/70' : 'text-amber-200/65'}`}>
                            {connection.connected ? 'Connected' : 'Needs attention'}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-[10px] leading-4 text-white/32">{connection.detail}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default function JasonAIExecutiveStrategyPage() {
  const [authState, setAuthState] = useState<'checking' | 'locked' | 'authenticated'>('checking');
  const [configured, setConfigured] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const fetchData = useCallback(async (quiet = false) => {
    if (!quiet) setIsRefreshing(true);
    setLoadError('');

    try {
      const response = await fetch('/api/jasonai-executive-strategy?action=data', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (response.status === 401) {
        setAuthState('locked');
        setData(null);
        return;
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load live strategy data.');
      setData(result as DashboardData);
      setAuthState('authenticated');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load live strategy data.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetch('/api/jasonai-executive-strategy?action=status', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
      .then((response) => response.json())
      .then((result) => {
        if (!active) return;
        setConfigured(Boolean(result.configured));
        if (result.authenticated) {
          setAuthState('authenticated');
          void fetchData();
        } else {
          setAuthState('locked');
        }
      })
      .catch(() => {
        if (active) setAuthState('locked');
      });
    return () => {
      active = false;
    };
  }, [fetchData]);

  useEffect(() => {
    if (authState !== 'authenticated' || !data) return;
    const interval = window.setInterval(() => void fetchData(true), 60_000);
    return () => window.clearInterval(interval);
  }, [authState, data, fetchData]);

  const logout = async () => {
    await fetch('/api/jasonai-executive-strategy?action=logout', {
      method: 'POST',
      credentials: 'same-origin',
    }).catch(() => undefined);
    setData(null);
    setAuthState('locked');
  };

  const loadingScreen = useMemo(
    () => (
      <main className="grid min-h-screen place-items-center bg-[#07090d] text-white">
        <Seo title="JasonAI Executive Strategy" description="Private JasonAI executive strategy dashboard." robots="noindex, nofollow" />
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#36d399] text-[#07110d]">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/35">Opening secure workspace</p>
        </div>
      </main>
    ),
    [],
  );

  if (authState === 'checking') return loadingScreen;
  if (authState === 'locked') {
    return (
      <JasonAIExecutiveAccessScreen
        configured={configured}
        onAuthenticated={() => {
          setAuthState('authenticated');
          void fetchData();
        }}
      />
    );
  }
  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07090d] px-6 text-white">
        <div className="max-w-md text-center">
          {loadError ? <CircleAlert className="mx-auto h-8 w-8 text-amber-200" /> : <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#36d399]" />}
          <h1 className="mt-5 text-2xl font-medium">{loadError ? 'Live data is unavailable' : 'Connecting live data'}</h1>
          <p className="mt-3 text-sm leading-6 text-white/40">{loadError || 'Loading the latest demand and delivery signals.'}</p>
          {loadError ? (
            <button
              type="button"
              onClick={() => void fetchData()}
              className="mt-6 rounded-xl bg-[#36d399] px-5 py-3 text-xs font-semibold text-[#07110d]"
            >
              Try again
            </button>
          ) : null}
        </div>
      </main>
    );
  }

  return <Dashboard data={data} isRefreshing={isRefreshing} onRefresh={() => void fetchData()} onLogout={() => void logout()} />;
}
