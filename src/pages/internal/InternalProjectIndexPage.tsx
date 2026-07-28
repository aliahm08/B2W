import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  CircleUserRound,
  FolderKanban,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import B2WLogoMark from '../../components/B2WLogoMark';
import Seo from '../../components/Seo';
import {
  getGurgeBusiness,
  getGurgeFallbackCopy,
  gurgeBusinesses,
  type GurgeBusiness,
  type GurgeCopy,
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

function businessSignature(business: GurgeBusiness) {
  return business.projects
    .map((project) => [
      project.id,
      project.status,
      project.metricValue,
      project.update,
    ].join(':'))
    .join('|');
}

async function requestGurgeCopy(business: GurgeBusiness, signal: AbortSignal) {
  const response = await fetch('/api/gurge-copy', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ business }),
    signal,
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok || !contentType.includes('application/json')) return null;
  const payload = await response.json() as { copy?: GurgeCopy | null; source?: string };
  return payload.copy ? { copy: payload.copy, source: payload.source ?? 'model' } : null;
}

function ProjectCard({
  project,
  selected,
  onSelect,
}: {
  project: GurgeProject;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full border p-5 text-left transition ${
        selected
          ? 'border-neutral-950 bg-neutral-950 text-white'
          : 'border-neutral-200 bg-white text-black hover:border-neutral-500'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-10 w-10 place-items-center rounded-full border ${
          selected ? 'border-white/15 bg-white/5' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <FolderKanban className={`h-4 w-4 ${selected ? 'text-neutral-300' : 'text-neutral-600'}`} />
        </div>
        <StatusLabel status={project.status} />
      </div>
      <p className={`mt-6 text-[9px] font-mono uppercase tracking-[0.18em] ${
        selected ? 'text-neutral-500' : 'text-neutral-400'
      }`}>
        {project.type}
      </p>
      <h3 className="mt-2 text-xl font-medium tracking-tight">{project.name}</h3>
      <p className={`mt-3 min-h-12 text-xs leading-5 ${
        selected ? 'text-neutral-400' : 'text-neutral-500'
      }`}>
        {project.summary}
      </p>
      <div className={`mt-5 flex items-end justify-between border-t pt-4 ${
        selected ? 'border-white/10' : 'border-neutral-100'
      }`}>
        <div>
          <p className={`text-[8px] uppercase tracking-[0.15em] ${
            selected ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            {project.metricLabel}
          </p>
          <p className="mt-1 font-mono text-sm">{project.metricValue}</p>
        </div>
        <ArrowRight className={`h-4 w-4 transition group-hover:translate-x-1 ${
          selected ? 'text-white' : 'text-neutral-300'
        }`} />
      </div>
    </button>
  );
}

export default function InternalProjectIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const business = getGurgeBusiness(searchParams.get('business'));
  const [selectedProjectId, setSelectedProjectId] = useState(business.projects[0].id);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copy, setCopy] = useState<GurgeCopy>(() => getGurgeFallbackCopy(business));
  const [copySource, setCopySource] = useState<'model' | 'fallback' | 'loading'>('loading');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const selectedProject =
    business.projects.find((project) => project.id === selectedProjectId) ?? business.projects[0];
  const portfolioCounts = useMemo(() => ({
    active: business.projects.filter((project) => project.status === 'active').length,
    completed: business.projects.filter((project) => project.status === 'completed').length,
    attention: business.projects.filter((project) =>
      project.status === 'pending' || project.status === 'planned' || project.status === 'at-risk',
    ).length,
  }), [business]);

  useEffect(() => {
    setSelectedProjectId(business.projects[0].id);
    setCopy(getGurgeFallbackCopy(business));
    setCopySource('loading');

    const signature = businessSignature(business);
    const storageKey = `gurge-copy:${business.id}`;
    try {
      const cached = JSON.parse(window.sessionStorage.getItem(storageKey) ?? 'null') as {
        signature?: string;
        copy?: GurgeCopy;
      } | null;
      if (cached?.signature === signature && cached.copy) {
        setCopy(cached.copy);
        setCopySource('model');
        return;
      }
    } catch {
      // A malformed cache should never block the deterministic dashboard copy.
    }

    const controller = new AbortController();
    void requestGurgeCopy(business, controller.signal)
      .then((result) => {
        if (!result?.copy) {
          setCopySource('fallback');
          return;
        }
        setCopy(result.copy);
        setCopySource('model');
        try {
          window.sessionStorage.setItem(storageKey, JSON.stringify({ signature, copy: result.copy }));
        } catch {
          // Session storage is only an optimization.
        }
      })
      .catch(() => setCopySource('fallback'));
    return () => controller.abort();
  }, [business]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const selectBusiness = (id: string) => {
    setSearchParams(id === 'b2w' ? {} : { business: id });
    setIsUserMenuOpen(false);
  };

  return (
    <article className="min-h-screen bg-[#FAFAF8] text-black">
      <Seo
        title="Gurge Projects"
        description="Gurge project management software for owners, teams, and project leaders."
        robots="noindex, nofollow"
      />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-[#FAFAF8]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <B2WLogoMark
              to="/internal"
              label="Gurge projects"
              wordmark="Gurge"
              className="text-black"
            />
            <span className="text-neutral-300">/</span>
            <Link to="/internal" className="text-sm font-medium text-neutral-700">
              Projects
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
                  {business.userCategory}
                </span>
                <span className="block max-w-40 truncate text-xs font-semibold text-black">{business.name}</span>
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
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">Demo user categories</p>
                    <p className="mt-2 text-xs leading-5 text-neutral-500">Switch the operating context without signing in.</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    {gurgeBusinesses.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectBusiness(item.id)}
                        className={`flex w-full items-center gap-3 p-3 text-left transition ${
                          item.id === business.id ? 'bg-neutral-950 text-white' : 'hover:bg-neutral-100'
                        }`}
                      >
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                          item.id === business.id ? 'border-white/15' : 'border-neutral-200'
                        }`}>
                          <Building2 className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{item.name}</span>
                          <span className={`mt-0.5 block truncate text-[9px] uppercase tracking-[0.13em] ${
                            item.id === business.id ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>
                            {item.userCategory} · {item.segment}
                          </span>
                        </span>
                        {item.id === business.id ? <Check className="h-4 w-4 text-[#D8B536]" /> : null}
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
        key={business.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8"
      >
        <header className="border-b border-neutral-200 pb-8 sm:pb-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">{copy.eyebrow}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[8px] uppercase tracking-[0.13em] text-neutral-500">
                  <Sparkles className="h-3 w-3" />
                  {copySource === 'loading' ? 'Updating language' : copySource === 'model' ? 'AI-adapted' : 'Data summary'}
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-[.98] tracking-[-0.045em] sm:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                {copy.body}
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

        <section className="grid gap-7 border-b border-neutral-200 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-10">
          <div>
            <div className="flex items-center gap-2 text-neutral-400">
              <LayoutGrid className="h-4 w-4" />
              <p className="text-[9px] font-mono uppercase tracking-[0.2em]">Business workspaces</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Representative operating views across Gurge’s user categories.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {gurgeBusinesses.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectBusiness(item.id)}
                className={`group flex min-h-24 items-center gap-4 border p-4 text-left transition ${
                  item.id === business.id
                    ? 'border-neutral-950 bg-neutral-950 text-white'
                    : 'border-neutral-200 bg-white hover:border-neutral-500'
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${
                  item.id === business.id ? 'border-white/15' : 'border-neutral-200'
                }`}>
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{item.name}</span>
                  <span className={`mt-1 block truncate text-[9px] uppercase tracking-[0.13em] ${
                    item.id === business.id ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    {item.segment}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-30 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">{copy.sectionLabel}</p>
              <h2 className="mt-3 max-w-3xl text-2xl font-medium tracking-tight text-black sm:text-3xl">
                {copy.sectionTitle}
              </h2>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
              {business.projects.length} projects · {business.userCategory}
            </p>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {business.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  selected={project.id === selectedProject.id}
                  onSelect={() => setSelectedProjectId(project.id)}
                />
              ))}
            </div>

            <aside className="flex min-h-80 flex-col border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">Selected project</p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight text-black">{selectedProject.name}</h3>
                </div>
                <StatusLabel status={selectedProject.status} />
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600">{selectedProject.update}</p>
              <div className="mt-6 border-y border-neutral-100 py-5">
                <p className="text-[8px] uppercase tracking-[0.15em] text-neutral-400">{selectedProject.metricLabel}</p>
                <p className="mt-2 font-mono text-2xl text-black">{selectedProject.metricValue}</p>
              </div>
              <div className="mt-5">
                <p className="text-[8px] uppercase tracking-[0.15em] text-neutral-400">Project type</p>
                <p className="mt-2 text-sm font-medium text-black">{selectedProject.type}</p>
              </div>
              {selectedProject.href ? (
                <Link
                  to={selectedProject.href}
                  className="group mt-auto inline-flex min-h-12 items-center justify-between rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Open project
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <div className="mt-auto flex min-h-12 items-center justify-between rounded-full border border-neutral-200 px-5 text-xs font-medium text-neutral-500">
                  Demonstration workspace
                  <span className="h-2 w-2 rounded-full bg-[#D8B536]" />
                </div>
              )}
            </aside>
          </div>
        </section>
      </motion.main>
    </article>
  );
}
