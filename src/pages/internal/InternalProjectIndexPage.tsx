import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CircleUserRound,
  LayoutGrid,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import B2WLogoMark from '../../components/B2WLogoMark';
import Seo from '../../components/Seo';
import {
  getGurgeBusiness,
  gurgeBusinesses,
  type GurgeBusiness,
  type GurgeProject,
  type GurgeProjectStatus,
} from './gurgeData';

const statusStyles: Record<
  GurgeProjectStatus,
  { label: string; background: string; foreground: string }
> = {
  completed: { label: 'Completed', background: '#4F7F52', foreground: '#FFFFFF' },
  active: { label: 'Active', background: '#4F7F52', foreground: '#FFFFFF' },
  pending: { label: 'Pending', background: '#D8B536', foreground: '#171717' },
  planned: { label: 'Planned', background: '#D8B536', foreground: '#171717' },
  'at-risk': { label: 'Blocked', background: '#C63D2F', foreground: '#FFFFFF' },
};

type ExecutiveRoleId = 'ceo' | 'coo' | 'cto';

type ExecutiveRole = {
  id: ExecutiveRoleId;
  title: 'CEO' | 'COO' | 'CTO';
  focus: string;
  directionTitle: string;
  description: string;
  portfolioTitle: string;
};

type ProductDirection = {
  id: 'jason-ai';
  name: string;
  category: string;
};

const executiveRoles: ExecutiveRole[] = [
  {
    id: 'ceo',
    title: 'CEO',
    focus: 'Direction + growth',
    directionTitle: 'Align the portfolio to company value.',
    description:
      'Review market position, company priorities, commercial progress, and the decisions that shape B2W’s direction.',
    portfolioTitle: 'Portfolio priorities and strategic decisions.',
  },
  {
    id: 'coo',
    title: 'COO',
    focus: 'Delivery + accountability',
    directionTitle: 'Turn priorities into owned, measurable delivery.',
    description:
      'Review operating cadence, project status, ownership, dependencies, phase gates, and the work that needs follow-through.',
    portfolioTitle: 'Delivery status, accountability, and open gates.',
  },
  {
    id: 'cto',
    title: 'CTO',
    focus: 'Product + systems',
    directionTitle: 'Make the product architecture reliable and repeatable.',
    description:
      'Review product architecture, integrations, technical delivery, reliability, and the platform risks behind each initiative.',
    portfolioTitle: 'Product systems, technical delivery, and platform risk.',
  },
];

const productDirection: ProductDirection = {
  id: 'jason-ai',
  name: 'JasonAI',
  category: 'Contracting AI assistant',
};

const productRoadmapPreview = [
  { number: '01', label: 'Foundation', period: 'Aug–Oct 2026', state: 'Next' },
  { number: '02', label: 'Validation', period: 'Nov 2026–Jan 2027', state: 'Planned' },
  { number: '03', label: 'Inflection', period: 'Feb–Jul 2027', state: 'Planned' },
  { number: '04', label: 'Scale', period: 'Aug 2027–Jan 2028', state: 'Planned' },
  { number: '05', label: 'Platform', period: 'Feb–Jul 2028', state: 'Planned' },
] as const;

const clientBusinesses = gurgeBusinesses.filter(({ id }) => id !== 'b2w');

function getExecutiveRole(value: string | null) {
  return executiveRoles.find((role) => role.id === value) ?? executiveRoles[0];
}

function StatusLabel({ status }: { status: GurgeProjectStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className="inline-flex min-h-7 items-center gap-2 rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.15em]"
      style={{ backgroundColor: style.background, color: style.foreground }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  );
}

function getClientAccountState(client: GurgeBusiness) {
  if (client.projects.some(({ status }) => status === 'at-risk')) {
    return { label: 'Attention', color: '#C63D2F' };
  }
  if (client.projects.some(({ status }) => status === 'pending' || status === 'planned')) {
    return { label: 'At gate', color: '#D8B536' };
  }
  if (client.projects.some(({ status }) => status === 'active')) {
    return { label: 'Active', color: '#4F7F52' };
  }
  return { label: 'Complete', color: '#4F7F52' };
}

function getClientProjectCounts(client: GurgeBusiness) {
  return {
    active: client.projects.filter(({ status }) => status === 'active').length,
    completed: client.projects.filter(({ status }) => status === 'completed').length,
    attention: client.projects.filter(({ status }) =>
      status === 'pending' || status === 'planned' || status === 'at-risk',
    ).length,
  };
}

function getUpdateDisplayDuration(update: string) {
  const wordCount = update.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(wordCount * 320, update.length * 45);
  return Math.min(10_000, Math.max(4_000, 1_200 + readingTime));
}

const fallbackTodayStatement =
  'Today: JasonAI is preparing for Foundation, Gurge remains in product build, and Clara is active. Client delivery includes eight active workstreams, with four review items requiring attention.';

async function requestGurgeToday(
  context: {
    executiveRole: ExecutiveRole['title'];
    selectedProduct: string;
    selectedBusiness: string;
  },
  signal: AbortSignal,
) {
  const response = await fetch('/api/gurge-today', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(context),
    signal,
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok || !contentType.includes('application/json')) return null;
  const payload = await response.json() as { statement?: string | null };
  return payload.statement?.trim() || null;
}

function ClientMetricCard({
  client,
  project,
}: {
  client: GurgeBusiness;
  project: GurgeProject;
}) {
  return (
    <article className="flex min-h-72 flex-col border border-neutral-200 bg-white p-5 text-black">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-neutral-50">
          <Building2 className="h-4 w-4 text-neutral-600" />
        </div>
        <StatusLabel status={project.status} />
      </div>
      <p className="mt-6 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">
        {client.name} · {project.type}
      </p>
      <h3 className="mt-2 text-xl font-medium tracking-tight">{project.name}</h3>
      <p className="mt-3 min-h-12 text-xs leading-5 text-neutral-500">{project.update}</p>
      <div className="mt-5 border-y border-neutral-100 py-5">
        <div>
          <p className="text-[8px] uppercase tracking-[0.15em] text-neutral-400">{project.metricLabel}</p>
          <p className="mt-2 font-mono text-2xl">{project.metricValue}</p>
        </div>
      </div>
      {project.href ? (
        <Link
          to={project.href}
          className="group mt-auto inline-flex items-center justify-between pt-5 text-xs font-semibold text-neutral-600 transition hover:text-black"
        >
          Open client work
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <p className="mt-auto pt-5 text-[9px] uppercase tracking-[0.15em] text-neutral-400">
          Client-reported signal
        </p>
      )}
    </article>
  );
}

function ClientAccountCard({
  client,
  selected,
  onSelect,
}: {
  client: GurgeBusiness;
  selected: boolean;
  onSelect: () => void;
}) {
  const accountState = getClientAccountState(client);
  const counts = getClientProjectCounts(client);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex min-h-64 flex-col border p-5 text-left transition ${
        selected
          ? 'border-neutral-950 bg-neutral-950 text-white'
          : 'border-neutral-200 bg-white text-black hover:border-neutral-500'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`grid h-10 w-10 place-items-center rounded-full border ${
          selected ? 'border-white/15' : 'border-neutral-200'
        }`}>
          <Building2 className="h-4 w-4" />
        </span>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white"
          style={{ backgroundColor: accountState.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {accountState.label}
        </span>
      </div>

      <p className={`mt-5 text-[8px] uppercase tracking-[0.14em] ${
        selected ? 'text-neutral-500' : 'text-neutral-400'
      }`}>
        Client · {client.segment}
      </p>
      <h3 className="mt-2 text-lg font-semibold">{client.name}</h3>

      <div className={`mt-5 grid grid-cols-3 border-y ${
        selected ? 'border-white/10' : 'border-neutral-100'
      }`}>
        {[
          ['Active', counts.active],
          ['Complete', counts.completed],
          ['Attention', counts.attention],
        ].map(([label, value], index) => (
          <span key={label} className={`${index ? selected ? 'border-l border-white/10' : 'border-l border-neutral-100' : ''} py-3`}>
            <span className="block font-mono text-base">{value}</span>
            <span className={`mt-1 block text-[7px] uppercase tracking-[0.12em] ${
              selected ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              {label}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {client.projects.slice(0, 3).map((project) => (
          <span key={project.id} className="flex items-center justify-between gap-3 text-xs">
            <span className={`truncate ${selected ? 'text-neutral-300' : 'text-neutral-600'}`}>{project.name}</span>
            <span className={`shrink-0 text-[7px] uppercase tracking-[0.12em] ${
              selected ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              {statusStyles[project.status].label}
            </span>
          </span>
        ))}
        {client.projects.length > 3 ? (
          <span className={`block text-[8px] uppercase tracking-[0.12em] ${
            selected ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            +{client.projects.length - 3} more project
          </span>
        ) : null}
      </div>

      <span className={`mt-auto flex items-center justify-between pt-5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
        selected ? 'text-neutral-400' : 'text-neutral-500'
      }`}>
        {selected ? 'Metrics focused' : 'View account metrics'}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </button>
  );
}

export default function InternalProjectIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const business = getGurgeBusiness(searchParams.get('business'));
  const executiveRole = getExecutiveRole(searchParams.get('view'));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeUpdateIndex, setActiveUpdateIndex] = useState(0);
  const [todaySummary, setTodaySummary] = useState(fallbackTodayStatement);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const selectedClient = clientBusinesses.find(({ id }) => id === business.id) ?? null;
  const metricBusinesses = selectedClient ? [selectedClient] : clientBusinesses;
  const clientMetrics = metricBusinesses.flatMap((client) =>
    client.projects.map((project) => ({ client, project })),
  );
  const clientMetricSummary = {
    active: clientMetrics.filter(({ project }) => project.status === 'active').length,
    completed: clientMetrics.filter(({ project }) => project.status === 'completed').length,
    attention: clientMetrics.filter(({ project }) =>
      project.status === 'pending' || project.status === 'planned' || project.status === 'at-risk',
    ).length,
  };
  const portfolioCounts = useMemo(() => ({
    active: business.projects.filter((project) => project.status === 'active').length,
    completed: business.projects.filter((project) => project.status === 'completed').length,
    attention: business.projects.filter((project) =>
      project.status === 'pending' || project.status === 'planned' || project.status === 'at-risk',
    ).length,
  }), [business]);
  const updateStream = useMemo(() => {
    const selectedProductUpdate = business.projects.find((project) => project.id === productDirection.id);
    const orderedProjects = selectedProductUpdate
      ? [selectedProductUpdate, ...business.projects.filter((project) => project.id !== selectedProductUpdate.id)]
      : business.projects;

    return orderedProjects.slice(0, 3);
  }, [business]);
  const activeUpdate = updateStream[activeUpdateIndex % updateStream.length];
  const activeUpdateDuration = activeUpdate ? getUpdateDisplayDuration(activeUpdate.update) : 4_000;

  useEffect(() => {
    setActiveUpdateIndex(0);
  }, [updateStream]);

  useEffect(() => {
    if (updateStream.length < 2) return undefined;
    const timer = window.setTimeout(() => {
      setActiveUpdateIndex((current) => (current + 1) % updateStream.length);
    }, activeUpdateDuration);
    return () => window.clearTimeout(timer);
  }, [activeUpdateDuration, updateStream.length]);

  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;
    const refreshTodaySummary = () => {
      controller?.abort();
      controller = new AbortController();
      void requestGurgeToday({
        executiveRole: executiveRole.title,
        selectedProduct: productDirection.name,
        selectedBusiness: business.name,
      }, controller.signal)
        .then((statement) => {
          if (active && statement) setTodaySummary(statement);
        })
        .catch(() => {
          if (active) setTodaySummary(fallbackTodayStatement);
        });
    };

    setTodaySummary(fallbackTodayStatement);
    refreshTodaySummary();
    const interval = window.setInterval(refreshTodaySummary, 30_000);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, [business.name, executiveRole.title, productDirection.name]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const selectBusiness = (id: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (id === 'b2w') next.delete('business');
      else next.set('business', id);
      return next;
    });
  };

  const selectExecutiveRole = (id: ExecutiveRoleId) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (id === 'ceo') next.delete('view');
      else next.set('view', id);
      return next;
    });
    setIsUserMenuOpen(false);
  };

  return (
    <article className="min-h-screen bg-[#FAFAF8] text-black">
      <Seo
        title="B2W Tracking Tool"
        description="Private B2W executive-strategy tracking tool built on the Gurge project-management concept."
        robots="noindex, nofollow"
        canonicalPath="/internal/portal"
      />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-[#FAFAF8]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <B2WLogoMark
              to="/internal"
              label="Tracking Tool"
              wordmark="Gurge"
              className="text-black"
            />
            <span className="text-neutral-300">/</span>
            <Link to="/internal" className="text-sm font-medium text-neutral-700">
              B2W LLC.
            </Link>
          </div>

          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              className="flex min-h-11 items-center gap-3 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-3 text-left shadow-sm transition hover:border-neutral-400"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-950 text-white">
                <CircleUserRound className="h-4 w-4" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                  {executiveRole.focus}
                </span>
                <span className="block max-w-40 truncate text-xs font-semibold text-black">{executiveRole.title}</span>
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isUserMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] border border-neutral-200 bg-white p-2 shadow-2xl"
                >
                  <div className="px-3 pb-2 pt-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">Executive views</p>
                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      Switch the portfolio emphasis by executive ownership.
                    </p>
                  </div>
                  <div className="mt-2 space-y-1">
                    {executiveRoles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => selectExecutiveRole(role.id)}
                        className={`flex w-full items-center gap-3 p-3 text-left transition ${
                          role.id === executiveRole.id ? 'bg-neutral-950 text-white' : 'hover:bg-neutral-100'
                        }`}
                      >
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                          role.id === executiveRole.id ? 'border-white/15' : 'border-neutral-200'
                        }`}>
                          <CircleUserRound className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{role.title}</span>
                          <span className={`mt-0.5 block truncate text-[9px] uppercase tracking-[0.13em] ${
                            role.id === executiveRole.id ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>
                            {role.focus}
                          </span>
                        </span>
                        {role.id === executiveRole.id ? <Check className="h-4 w-4 text-[#D8B536]" /> : null}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <motion.main
        key={`${business.id}:${executiveRole.id}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8"
      >
        <header className="border-b border-neutral-200 pb-8 sm:pb-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div>
              <div
                className="flex max-w-4xl items-center gap-4 overflow-hidden border-y border-neutral-200 py-2.5"
                role="region"
                aria-label="Recent updates"
              >
                <span className="flex shrink-0 items-center gap-2 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                  <span className="h-2 w-2 rounded-full bg-[#4F7F52]" />
                  Update stream
                </span>
                <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeUpdate ? (
                      <motion.p
                        key={activeUpdate.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.25 }}
                        className="truncate text-[10px] text-neutral-500"
                      >
                        <span className="font-semibold text-neutral-800">{activeUpdate.name}</span>
                        <span className="mx-2 text-neutral-300">—</span>
                        {activeUpdate.update}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                  <motion.span
                    key={`${activeUpdate?.id ?? 'empty'}:${activeUpdateIndex}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: activeUpdateDuration / 1_000, ease: 'linear' }}
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#4F7F52]/50"
                  />
                </div>
                <span className="shrink-0 font-mono text-[9px] text-neutral-400">
                  {String((activeUpdateIndex % updateStream.length) + 1).padStart(2, '0')}
                  <span className="mx-1 text-neutral-300">/</span>
                  {String(updateStream.length).padStart(2, '0')}
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-[.98] tracking-[-0.045em] sm:text-6xl">
                Today’s view.
              </h1>
              <p
                className="mt-5 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7"
                aria-live="polite"
              >
                {todaySummary}
              </p>
            </div>

            <div className="grid grid-cols-3 border border-neutral-200 bg-white">
              {[
                ['Active', portfolioCounts.active, '#4F7F52'],
                ['Complete', portfolioCounts.completed, '#4F7F52'],
                ['Open gates', portfolioCounts.attention, '#D8B536'],
              ].map(([label, value, color], index) => (
                <div key={label} className={`${index ? 'border-l border-neutral-200' : ''} p-4 sm:p-5`}>
                  <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  <p className="mt-4 font-mono text-2xl text-black">{value}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-neutral-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-5 border-b border-neutral-200 py-7 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start">
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">Product direction</p>
            <p className="mt-2 text-sm font-semibold text-black">JasonAI</p>
          </div>
          <Link
            to="/internal/portal/product"
            className="group overflow-hidden border border-neutral-800 bg-neutral-950 text-white shadow-[0_20px_70px_rgba(0,0,0,.12)] transition hover:border-neutral-600"
          >
            <div className="grid min-h-[360px] lg:grid-cols-[minmax(0,.88fr)_minmax(420px,1.12fr)]">
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#D8B536]">
                      JasonAI product roadmap
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-neutral-500">
                      {productDirection.category}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5">
                    <ArrowUpRight className="h-4 w-4 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </span>
                </div>
                <h2 className="mt-10 max-w-xl text-3xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-4xl">
                  Track JasonAI from Foundation to Platform.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-neutral-400">
                  Review phase goals, KPI gates, accountable owners, assignments, reported results, and the executive strategy behind each stage.
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-xs font-semibold text-white">
                  Open product dashboard
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>

              <div className="border-t border-white/10 bg-[#151816] p-4 sm:p-5 lg:border-l lg:border-t-0">
                <div className="h-full border border-white/10 bg-[#0D0F0E] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                        Executive roadmap
                      </p>
                      <p className="mt-2 text-sm font-semibold">Five-phase product strategy</p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8B536]/25 bg-[#D8B536]/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.14em] text-[#E2C45E]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D8B536]" />
                      Foundation next
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 border border-white/10">
                    {[
                      ['Phases', '5'],
                      ['KPI goals', '15'],
                      ['Owners', '3'],
                    ].map(([label, value], index) => (
                      <div key={label} className={`${index ? 'border-l border-white/10' : ''} p-3 sm:p-4`}>
                        <p className="font-mono text-xl text-white">{value}</p>
                        <p className="mt-1 text-[7px] uppercase tracking-[0.14em] text-neutral-600">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    {productRoadmapPreview.map((phase) => (
                      <div
                        key={phase.number}
                        className={`grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border p-3 ${
                          phase.state === 'Next'
                            ? 'border-[#D8B536]/35 bg-[#D8B536]/10'
                            : 'border-white/10 bg-white/[.025]'
                        }`}
                      >
                        <span className={`font-mono text-[9px] ${
                          phase.state === 'Next' ? 'text-[#E2C45E]' : 'text-neutral-600'
                        }`}>
                          {phase.number}
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-neutral-200">{phase.label}</span>
                          <span className="mt-0.5 block text-[8px] text-neutral-600">{phase.period}</span>
                        </span>
                        <span className={`text-[7px] uppercase tracking-[0.14em] ${
                          phase.state === 'Next' ? 'text-[#E2C45E]' : 'text-neutral-700'
                        }`}>
                          {phase.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section className="grid gap-7 border-b border-neutral-200 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-10">
          <div>
            <div className="flex items-center gap-2 text-neutral-400">
              <LayoutGrid className="h-4 w-4" />
              <p className="text-[9px] font-mono uppercase tracking-[0.2em]">Client workspaces</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Active clients using B2W products and operating systems.
            </p>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between border-t border-neutral-300 pt-3">
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                All client accounts
              </p>
              <span className="font-mono text-[10px] text-neutral-400">
                {String(clientBusinesses.length).padStart(2, '0')}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {clientBusinesses.map((item) => (
                <ClientAccountCard
                  key={item.id}
                  client={item}
                  selected={item.id === business.id}
                  onSelect={() => selectBusiness(item.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                {executiveRole.title} view · Client metrics
              </p>
              <h2 className="mt-3 max-w-3xl text-2xl font-medium tracking-tight text-black sm:text-3xl">
                {selectedClient
                  ? `${selectedClient.name} operating metrics.`
                  : 'Performance signals across active clients.'}
              </h2>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
              {clientMetrics.length} signals · {metricBusinesses.length} {metricBusinesses.length === 1 ? 'client' : 'clients'}
            </p>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {clientMetrics.map(({ client, project }) => (
                <ClientMetricCard
                  key={`${client.id}:${project.id}`}
                  client={client}
                  project={project}
                />
              ))}
            </div>

            <aside className="flex min-h-80 flex-col border border-neutral-200 bg-neutral-950 p-5 text-white sm:p-6">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">Metric rollup</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">
                {selectedClient ? selectedClient.name : 'Active clients'}
              </h3>
              <p className="mt-4 text-sm leading-6 text-neutral-400">
                {selectedClient
                  ? selectedClient.description
                  : 'A consolidated view of delivery signals reported across current B2W client workspaces.'}
              </p>
              <div className="mt-7 grid grid-cols-3 border-y border-white/10">
                {[
                  ['Active', clientMetricSummary.active, '#4F7F52'],
                  ['Complete', clientMetricSummary.completed, '#4F7F52'],
                  ['Attention', clientMetricSummary.attention, '#D8B536'],
                ].map(([label, value, color], index) => (
                  <div key={label} className={`${index ? 'border-l border-white/10' : ''} py-5 text-center`}>
                    <span className="mx-auto block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    <p className="mt-3 font-mono text-2xl">{value}</p>
                    <p className="mt-1 text-[8px] uppercase tracking-[0.13em] text-neutral-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-7">
                <p className="text-[8px] uppercase tracking-[0.15em] text-neutral-600">Reporting scope</p>
                <p className="mt-2 text-sm font-medium text-neutral-200">
                  {clientMetrics.length} operating signals from {metricBusinesses.length} active {metricBusinesses.length === 1 ? 'client' : 'clients'}
                </p>
              </div>
            </aside>
          </div>
        </section>
      </motion.main>
    </article>
  );
}
