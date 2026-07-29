import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Gauge,
  KeyRound,
  Layers3,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import B2WIcon from '../components/logo/B2WIcon';
import Seo from '../components/Seo';

type SectionId =
  | 'map'
  | 'company'
  | 'problem'
  | 'architecture'
  | 'today'
  | 'revenue'
  | 'stages'
  | 'gates'
  | 'next'
  | 'ownership'
  | 'financials'
  | 'ninety-days'
  | 'tracker';

type TrackerStatus = 'Not started' | 'In progress' | 'Blocked' | 'Complete';

type TrackerItem = {
  id: string;
  phase: string;
  category: 'Pricing' | 'Product' | 'Success';
  objective: string;
  task: string;
  owner: 'CEO' | 'COO' | 'CTO';
  contributors: string;
  deadline: string;
  dependency: string;
  measure: string;
  defaultStatus: TrackerStatus;
};

type TrackerUpdate = {
  status: TrackerStatus;
  evidence: string;
};

const trackerStorageKey = 'b2w-executive-strategy-tracker-v1';

const sectionLinks: Array<{ id: SectionId; number: string; label: string }> = [
  { id: 'map', number: '00', label: 'Strategy map' },
  { id: 'company', number: '01', label: 'Company in one view' },
  { id: 'problem', number: '02', label: 'Customer problem' },
  { id: 'architecture', number: '03', label: 'Product architecture' },
  { id: 'today', number: '04', label: 'What exists today' },
  { id: 'revenue', number: '05', label: 'Revenue model now' },
  { id: 'stages', number: '06', label: 'Three-stage model' },
  { id: 'gates', number: '07', label: 'Phase gates' },
  { id: 'next', number: '08', label: 'What to build next' },
  { id: 'ownership', number: '09', label: 'Ownership model' },
  { id: 'financials', number: '10', label: 'Financial progression' },
  { id: 'ninety-days', number: '11', label: '90-day plan' },
  { id: 'tracker', number: '12', label: 'Execution tracker' },
];

const trackerItems: TrackerItem[] = [
  {
    id: 'segment',
    phase: 'Phase 1 · Prove value',
    category: 'Pricing',
    objective: 'Choose a focused market',
    task: 'Focus the first customer segment on contracting businesses and document their shared operating pain.',
    owner: 'CEO',
    contributors: 'COO',
    deadline: 'Day 15',
    dependency: 'Customer interviews',
    measure: 'A contracting-business ICP is documented with its operating pain and buying trigger.',
    defaultStatus: 'In progress',
  },
  {
    id: 'offer',
    phase: 'Phase 1 · Prove value',
    category: 'Pricing',
    objective: 'Define the paid offer',
    task: 'Package Core, Premium, and Maximum plans around the WhatsApp Assistant, Document Maker, and Project Portal.',
    owner: 'CEO',
    contributors: 'COO, CTO',
    deadline: 'Day 21',
    dependency: 'Segment selection',
    measure: 'The three-tier product ladder is used consistently in live sales conversations.',
    defaultStatus: 'Not started',
  },
  {
    id: 'pricing',
    phase: 'Phase 2 · Prove repeatability',
    category: 'Pricing',
    objective: 'Validate willingness to pay',
    task: 'Run pricing conversations and record objections, accepted ranges, and value drivers.',
    owner: 'CEO',
    contributors: 'COO',
    deadline: 'Day 45',
    dependency: 'Offer definition',
    measure: 'At least 10 qualified pricing conversations and 3 paid commitments.',
    defaultStatus: 'Not started',
  },
  {
    id: 'workflow',
    phase: 'Phase 1 · Prove value',
    category: 'Product',
    objective: 'Complete one end-to-end workflow',
    task: 'Generate a weekly owner update from WhatsApp and project context, then request approval and save it.',
    owner: 'CTO',
    contributors: 'COO',
    deadline: 'Day 40',
    dependency: 'Workflow specification',
    measure: 'The full workflow completes reliably with one pilot dataset.',
    defaultStatus: 'In progress',
  },
  {
    id: 'context',
    phase: 'Phase 1 · Prove value',
    category: 'Product',
    objective: 'Define minimum business context',
    task: 'Model customers, projects, contracts, dates, owners, status, actions, and linked documents.',
    owner: 'CTO',
    contributors: 'COO',
    deadline: 'Day 30',
    dependency: 'First workflow',
    measure: 'Context schema supports the selected workflow without manual re-entry.',
    defaultStatus: 'Not started',
  },
  {
    id: 'approvals',
    phase: 'Phase 1 · Prove value',
    category: 'Product',
    objective: 'Control action execution',
    task: 'Define review, approval, audit, and permission rules for generated outputs and actions.',
    owner: 'CTO',
    contributors: 'CEO, COO',
    deadline: 'Day 50',
    dependency: 'End-to-end workflow',
    measure: 'No action is taken without the correct approval and recorded result.',
    defaultStatus: 'Not started',
  },
  {
    id: 'onboarding',
    phase: 'Phase 1 · Prove value',
    category: 'Success',
    objective: 'Onboard initial customers',
    task: 'Create the onboarding checklist, baseline survey, workflow configuration, and training sequence.',
    owner: 'COO',
    contributors: 'CEO, CTO',
    deadline: 'Day 45',
    dependency: 'Paid offer and working workflow',
    measure: 'First customer reaches a useful output in five business days or less.',
    defaultStatus: 'Not started',
  },
  {
    id: 'adoption',
    phase: 'Phase 1 · Prove value',
    category: 'Success',
    objective: 'Prove recurring use',
    task: 'Track weekly usage, completed outputs, time saved, missed actions recovered, and feedback.',
    owner: 'COO',
    contributors: 'CTO',
    deadline: 'Day 70',
    dependency: 'Customer onboarding',
    measure: 'Customers use two or three workflows repeatedly for four consecutive weeks.',
    defaultStatus: 'Not started',
  },
  {
    id: 'repeatability',
    phase: 'Phase 2 · Prove repeatability',
    category: 'Product',
    objective: 'Reduce custom delivery',
    task: 'Turn the proven workflow into reusable configuration, templates, and integration steps.',
    owner: 'CTO',
    contributors: 'COO',
    deadline: 'After Phase 1 gate',
    dependency: 'Validated recurring workflows',
    measure: 'Implementation hours per customer decline meaningfully.',
    defaultStatus: 'Not started',
  },
  {
    id: 'case-study',
    phase: 'Phase 2 · Prove repeatability',
    category: 'Success',
    objective: 'Make value credible',
    task: 'Publish a quantified case study with baseline, outcome, evidence, and customer approval.',
    owner: 'COO',
    contributors: 'CEO',
    deadline: 'After first success',
    dependency: 'Documented customer outcome',
    measure: 'One approved case study supports sales and onboarding.',
    defaultStatus: 'Not started',
  },
  {
    id: 'acquisition',
    phase: 'Phase 2 · Prove repeatability',
    category: 'Pricing',
    objective: 'Learn which acquisition channels work',
    task: 'Record where every paying customer originated, then compare conversion, sales cycle, customer acquisition cost, and payback by source.',
    owner: 'CEO',
    contributors: 'COO',
    deadline: 'After first paid conversions',
    dependency: 'Paying customers and reliable source attribution',
    measure: 'Customer count and acquisition source reveal which offers and channels are producing paid conversion.',
    defaultStatus: 'Not started',
  },
];

const categoryStyles = {
  Pricing: 'border-amber-200 bg-amber-50 text-amber-900',
  Product: 'border-sky-200 bg-sky-50 text-sky-900',
  Success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
} satisfies Record<TrackerItem['category'], string>;

const statusStyles = {
  'Not started': 'bg-neutral-100 text-neutral-600',
  'In progress': 'bg-blue-100 text-blue-800',
  Blocked: 'bg-red-100 text-red-800',
  Complete: 'bg-emerald-100 text-emerald-800',
} satisfies Record<TrackerStatus, string>;

const systemLayers = [
  {
    label: 'Interface',
    title: 'WhatsApp Assistant',
    description: 'The WhatsApp assistant where the team asks, reviews, and follows through.',
    icon: MessageCircle,
    tone: 'bg-[#223C33] text-white',
  },
  {
    label: 'Intelligence',
    title: 'Reasoning and orchestration',
    description: 'OpenClaw, AI models, memory, permissions, and workflow control.',
    icon: Sparkles,
    tone: 'bg-[#D8B56A] text-[#1E2A25]',
  },
  {
    label: 'Skills',
    title: 'Document Maker',
    description: 'Reusable SOP, estimating, proposal, contract, reporting, and task capabilities.',
    icon: Workflow,
    tone: 'bg-[#DDE8E1] text-[#223C33]',
  },
  {
    label: 'Context',
    title: 'Project Portal',
    description: 'Projects, contracts, dates, owners, status, actions, documents, and connected systems.',
    icon: Network,
    tone: 'bg-[#F2EEE5] text-[#332F27]',
  },
];

const ownership = [
  {
    role: 'CEO',
    owns: 'Market, positioning, pricing, partnerships, revenue',
    action: 'Identifies and qualifies the opportunity.',
    icon: TrendingUp,
  },
  {
    role: 'COO',
    owns: 'Priorities, onboarding, delivery, success, milestones',
    action: 'Translates the opportunity into a workflow and product requirement.',
    icon: ClipboardCheck,
  },
  {
    role: 'CTO',
    owns: 'Architecture, integrations, security, reliability',
    action: 'Determines how to deliver the workflow safely and repeatably.',
    icon: Network,
  },
];

function AccessScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/executive-strategy?scope=b2w&action=login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json() as { authenticated?: boolean; error?: string };
      if (!response.ok || !result.authenticated) {
        setError(result.error ?? 'Access could not be verified.');
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
    <main className="relative min-h-screen overflow-hidden bg-[#EEE9DE] text-[#17221E]">
      <Seo
        title="B2W Executive Strategy"
        description="Private B2W executive strategy system."
        robots="noindex, nofollow"
        canonicalPath="/executive-strategy"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,60,51,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,60,51,0.08) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
      />
      <div aria-hidden="true" className="absolute -left-48 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#D8B56A]/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-56 -right-40 h-[40rem] w-[40rem] rounded-full bg-[#6F9A86]/20 blur-3xl" />

      <Link
        to="/"
        className="absolute left-5 top-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/65 px-4 text-xs font-semibold text-[#223C33] backdrop-blur transition hover:bg-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        B2W home
      </Link>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-24 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#223C33]/15 bg-[#F8F5EE]/90 shadow-[0_45px_120px_rgba(34,60,51,0.18)] backdrop-blur lg:grid-cols-[minmax(0,1.2fr)_430px]">
          <section className="relative hidden min-h-[680px] overflow-hidden border-r border-[#223C33]/12 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div
                className="group inline-flex items-center gap-3"
                aria-label="B2W"
                title="B2W"
              >
                <B2WIcon title="" className="h-10 w-11 text-[#223C33]" />
                <span className="b2w-wordmark max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap text-sm font-semibold tracking-[0.18em] opacity-0 transition-all duration-200 group-hover:max-w-16 group-hover:translate-x-0 group-hover:opacity-100">
                  B2W
                </span>
              </div>
              <p
                className="mt-28 max-w-2xl text-4xl font-medium leading-[1.02] tracking-[-0.05em] xl:text-5xl 2xl:text-6xl"
                style={{ textWrap: "balance" }}
              >
                Our mission is to improve communication and optimize actionable insights.
              </p>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#223C33]/62">
                We help small and midsize business owners by providing a WhatsApp-based AI assistant that can summarize, search, and act.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ['Now', 'Prove value'],
                ['Next', 'Prove repeatability'],
                ['Future', 'Scale the platform'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#223C33]/12 bg-white/55 p-4">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#223C33]/40">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#223C33]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-h-[680px] flex-col justify-center p-7 sm:p-10">
            <div className="lg:hidden">
              <B2WIcon title="" className="h-10 w-11 text-[#223C33]" />
            </div>
            <div className="mt-10 grid h-12 w-12 place-items-center rounded-2xl border border-[#223C33]/12 bg-white lg:mt-0">
              <LockKeyhole className="h-5 w-5 text-[#B68124]" />
            </div>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#997022]">
              Restricted workspace
            </p>
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
              Building JasonAI for general contractors &amp; contracting firms.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#223C33]/58">
              This portal helps layout our business plan and keep track of progress.
            </p>

            <form className="mt-9" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value="B2W Executive"
                autoComplete="username"
                readOnly
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <label htmlFor="b2w-strategy-password" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#223C33]/50">
                Strategy password
              </label>
              <div className="relative mt-3">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#223C33]/35" />
                <input
                  id="b2w-strategy-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  autoFocus
                  className="h-14 w-full rounded-2xl border border-[#223C33]/15 bg-white/75 pl-11 pr-12 text-sm outline-none transition focus:border-[#B68124] focus:bg-white"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[#223C33]/40 transition hover:text-[#223C33]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error ? (
                <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-red-700">
                  <CircleAlert className="h-4 w-4" />
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!password || isSubmitting}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#223C33] px-5 text-sm font-semibold text-white transition hover:bg-[#315746] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {isSubmitting ? 'Verifying' : 'Open strategy system'}
              </button>
            </form>

            <p className="mt-8 flex items-center gap-2 text-[11px] text-[#223C33]/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              Private · no search indexing · temporary access
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="grid gap-5 border-b border-[#223C33]/15 pb-8 lg:grid-cols-[120px_minmax(0,1fr)]">
      <p className="font-mono text-xs text-[#997022]">{number}</p>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#223C33]/45">{eyebrow}</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-[#17221E] sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#223C33]/62 sm:text-base">{description}</p>
      </div>
    </header>
  );
}

function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-2 text-[#997022] md:py-0">
      {label ? <span className="text-[9px] uppercase tracking-[0.18em]">{label}</span> : null}
      <ArrowDown className="h-4 w-4 md:hidden" />
      <ArrowRight className="hidden h-4 w-4 md:block" />
    </div>
  );
}

function StrategyWorkspace({ onLock }: { onLock: () => void }) {
  const [activeSection, setActiveSection] = useState<SectionId>('map');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [trackerUpdates, setTrackerUpdates] = useState<Record<string, TrackerUpdate>>({});

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(trackerStorageKey);
      if (stored) setTrackerUpdates(JSON.parse(stored) as Record<string, TrackerUpdate>);
    } catch {
      // The strategy remains usable when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(trackerStorageKey, JSON.stringify(trackerUpdates));
    } catch {
      // The tracker remains usable for the current view.
    }
  }, [trackerUpdates]);

  useEffect(() => {
    const sections = sectionLinks
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionId);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0.05, 0.2, 0.45] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const trackerSummary = useMemo(() => {
    const statuses = trackerItems.map(
      (item) => trackerUpdates[item.id]?.status ?? item.defaultStatus,
    );
    const complete = statuses.filter((status) => status === 'Complete').length;
    const inProgress = statuses.filter((status) => status === 'In progress').length;
    const blocked = statuses.filter((status) => status === 'Blocked').length;
    return {
      complete,
      inProgress,
      blocked,
      percentage: Math.round((complete / statuses.length) * 100),
    };
  }, [trackerUpdates]);

  const updateTracker = (item: TrackerItem, patch: Partial<TrackerUpdate>) => {
    setTrackerUpdates((current) => ({
      ...current,
      [item.id]: {
        status: current[item.id]?.status ?? item.defaultStatus,
        evidence: current[item.id]?.evidence ?? '',
        ...patch,
      },
    }));
  };

  const goToSection = (id: SectionId) => {
    setMobileNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-[#F7F4EC] text-[#17221E]">
      <Seo
        title="B2W Executive Strategy System"
        description="Private B2W product, business, financial, and execution strategy system."
        robots="noindex, nofollow"
        canonicalPath="/executive-strategy"
      />

      <header className="sticky top-0 z-50 border-b border-[#223C33]/12 bg-[#F7F4EC]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#223C33]/12 bg-white/65 text-[#223C33] transition hover:bg-white"
              aria-label="Return to B2W home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <B2WIcon title="" className="h-8 w-9 shrink-0 text-[#223C33]" />
            <div className="min-w-0">
              <p className="b2w-wordmark truncate text-xs font-semibold tracking-[0.16em]">B2W</p>
              <p className="truncate text-[8px] uppercase tracking-[0.18em] text-[#223C33]/42">
                Executive strategy system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav
              className="flex shrink-0 items-center rounded-full border border-[#223C33]/12 bg-white/55 p-1"
              aria-label="Executive strategy version"
            >
              <span
                className="rounded-full bg-[#223C33] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm"
                aria-current="page"
                aria-label="Live version 0"
                title="Live V0"
              >
                V0
                <span className="hidden xl:inline"> · Live</span>
              </span>
              <a
                href="/strategy-v1/executive-strategy"
                className="rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#223C33]/55 transition hover:bg-white hover:text-[#223C33]"
                aria-label="Open draft version 1"
                title="Open draft V1"
              >
                V1
                <span className="hidden xl:inline"> · Draft</span>
              </a>
            </nav>
            <span className="hidden items-center gap-2 rounded-full border border-[#223C33]/12 bg-white/55 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#223C33]/55 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Temporary access
            </span>
            <button
              type="button"
              onClick={onLock}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#223C33]/12 bg-white/55 text-[#223C33]/60 transition hover:bg-white hover:text-[#223C33]"
              aria-label="Lock strategy"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#223C33]/12 bg-white/55 text-[#223C33] lg:hidden"
              aria-label="Open strategy navigation"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen ? (
        <nav className="fixed inset-x-4 top-20 z-40 max-h-[calc(100vh-6rem)] overflow-auto rounded-2xl border border-[#223C33]/12 bg-[#F7F4EC] p-3 shadow-2xl lg:hidden">
          {sectionLinks.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => goToSection(section.id)}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm ${
                activeSection === section.id ? 'bg-[#223C33] text-white' : 'text-[#223C33]/65 hover:bg-white'
              }`}
            >
              <span className="font-mono text-[9px] opacity-50">{section.number}</span>
              {section.label}
            </button>
          ))}
        </nav>
      ) : null}

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[238px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#223C33]/12 lg:block">
          <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8" aria-label="Strategy sections">
            <p className="px-3 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#223C33]/35">
              Document sections
            </p>
            <div className="mt-4 space-y-0.5">
              {sectionLinks.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => goToSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] transition ${
                    activeSection === section.id
                      ? 'bg-[#223C33] font-semibold text-white'
                      : 'text-[#223C33]/55 hover:bg-white hover:text-[#223C33]'
                  }`}
                >
                  <span className="font-mono text-[8px] opacity-50">{section.number}</span>
                  <span className="flex-1">{section.label}</span>
                  {activeSection === section.id ? <ChevronDown className="h-3 w-3 -rotate-90" /> : null}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#223C33]/12 bg-white/50 p-4">
              <p className="text-[8px] uppercase tracking-[0.18em] text-[#223C33]/38">Execution</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl font-medium">{trackerSummary.percentage}%</p>
                <p className="font-mono text-[9px] text-[#223C33]/45">
                  {trackerSummary.complete}/{trackerItems.length}
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#223C33]/8">
                <div
                  className="h-full rounded-full bg-[#B68124] transition-[width]"
                  style={{ width: `${trackerSummary.percentage}%` }}
                />
              </div>
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          <section className="relative overflow-hidden border-b border-[#223C33]/12 bg-[#223C33] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-14">
            <div aria-hidden="true" className="absolute -right-40 -top-56 h-[40rem] w-[40rem] rounded-full bg-[#D8B56A]/16 blur-3xl" />
            <div className="relative mx-auto max-w-6xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D8B56A]">
                B2W Product + Business Strategy
              </p>
              <h1 className="mt-7 max-w-5xl text-5xl font-medium leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                The operating layer for project-based businesses.
              </h1>
              <p className="mt-8 max-w-3xl text-base leading-8 text-white/62 sm:text-lg">
                B2W connects communication, business context, document creation, and approved actions—turning fragmented information into completed work.
              </p>
              <a
                href="#map"
                className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D8B56A] px-5 text-sm font-semibold text-[#223C33] transition hover:bg-[#E5C77F]"
              >
                Read the strategy
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </section>

          <article className="mx-auto max-w-6xl px-5 pb-28 sm:px-8 lg:px-14">
            <section id="map" className="scroll-mt-24 py-20 sm:py-28">
              <SectionHeader
                number="00"
                eyebrow="One-page strategy map"
                title="One system. Five connected capabilities."
                description="The assistant, document maker, and management system are components of one product—not separate bets."
              />
              <div className="mt-10 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
                {[
                  ['WhatsApp', 'Assistant', MessageCircle],
                  ['Business', 'Context', Building2],
                  ['Document +', 'Workflow skills', FileText],
                  ['Approved', 'Actions', FileCheck2],
                  ['Project +', 'Contract systems', Layers3],
                ].map(([eyebrow, title, Icon], index) => (
                  <div className="contents" key={String(title)}>
                    {index > 0 ? <FlowArrow /> : null}
                    <div className={`rounded-2xl border p-5 ${
                      index === 0 ? 'border-[#223C33] bg-[#223C33] text-white' : 'border-[#223C33]/12 bg-white/60'
                    }`}>
                      <Icon className={`h-5 w-5 ${index === 0 ? 'text-[#D8B56A]' : 'text-[#997022]'}`} />
                      <p className={`mt-8 text-[8px] uppercase tracking-[0.18em] ${index === 0 ? 'text-white/40' : 'text-[#223C33]/38'}`}>
                        {eyebrow}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-5">{title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <blockquote className="mt-10 border-l-2 border-[#B68124] pl-6 text-xl font-medium leading-8 tracking-[-0.02em] text-[#223C33] sm:text-2xl">
                Business information already exists. B2W turns it into context, documents, decisions, and completed actions.
              </blockquote>
            </section>

            <section id="company" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="01"
                eyebrow="The company in one view"
                title="A shared mental model from first value to platform scale."
                description="What B2W sells now, what becomes connected next, and what the complete platform eventually becomes."
              />
              <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#223C33]/12 bg-[#223C33]/12 lg:grid-cols-3">
                {[
                  {
                    horizon: 'Now',
                    product: 'WhatsApp assistant + document capabilities',
                    model: 'High-touch paid implementation',
                    proof: 'Prove customer value',
                    tone: 'bg-white',
                  },
                  {
                    horizon: 'Next',
                    product: 'Connected assistant, context + document workflows',
                    model: 'Repeatable integrated product',
                    proof: 'Prove product repeatability',
                    tone: 'bg-[#F2EEE5]',
                  },
                  {
                    horizon: 'Future',
                    product: 'AI operating platform that understands + acts',
                    model: 'Scalable subscription platform',
                    proof: 'Scale acquisition + recurring revenue',
                    tone: 'bg-[#223C33] text-white',
                  },
                ].map((column) => (
                  <div key={column.horizon} className={`p-7 sm:p-8 ${column.tone}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
                      column.horizon === 'Future' ? 'text-[#D8B56A]' : 'text-[#997022]'
                    }`}>
                      {column.horizon}
                    </p>
                    <p className="mt-10 text-2xl font-medium leading-8 tracking-[-0.03em]">{column.product}</p>
                    <div className={`mt-8 border-t pt-5 ${column.horizon === 'Future' ? 'border-white/12' : 'border-[#223C33]/12'}`}>
                      <p className={`text-xs leading-5 ${column.horizon === 'Future' ? 'text-white/58' : 'text-[#223C33]/55'}`}>{column.model}</p>
                      <p className="mt-5 text-sm font-semibold">{column.proof}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="problem" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="02"
                eyebrow="The customer problem"
                title="The owner is the integration layer."
                description="Conversations, documents, commitments, project status, customers, and finances live in different places. The owner manually connects them."
              />
              <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['WhatsApp', 'Conversations', MessageCircle],
                    ['Google Drive', 'Documents', FileText],
                    ['PDFs', 'Contracts', FileCheck2],
                    ['Spreadsheets', 'Project status', BarChart3],
                    ['CRM', 'Customers', UsersRound],
                    ['Accounting', 'Financials', CircleDollarSign],
                  ].map(([title, label, Icon]) => (
                    <div key={String(title)} className="rounded-2xl border border-[#223C33]/12 bg-white/60 p-4">
                      <Icon className="h-4 w-4 text-[#997022]" />
                      <p className="mt-5 text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-[10px] text-[#223C33]/45">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="grid h-28 w-28 place-items-center rounded-full border border-[#B68124]/40 bg-[#D8B56A]/18 text-center shadow-[0_20px_45px_rgba(182,129,36,0.12)]">
                    <div>
                      <UserRoundCheck className="mx-auto h-5 w-5 text-[#997022]" />
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.14em]">Owner</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-[#223C33] p-7 text-white sm:p-9">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#D8B56A] text-[#223C33]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="mt-10 text-[9px] uppercase tracking-[0.2em] text-[#D8B56A]">B2W intelligent workflow</p>
                  <p className="mt-3 text-3xl font-medium leading-9 tracking-[-0.035em]">
                    One context. One workflow. One recorded result.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-white/60">
                    {['Read context', 'Create output', 'Request approval', 'Record action'].map((item) => (
                      <div key={item} className="flex items-center gap-2 border-t border-white/12 pt-3">
                        <Check className="h-3.5 w-3.5 text-[#D8B56A]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="architecture" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="03"
                eyebrow="Product architecture"
                title="Four layers, with information moving both ways."
                description="B2W reads context, produces outputs, takes approved actions, and records the result in the systems the business already trusts."
              />
              <div className="mt-10 space-y-3">
                {systemLayers.map((layer, index) => {
                  const Icon = layer.icon;
                  return (
                    <div key={layer.label}>
                      <div className={`grid gap-5 rounded-3xl p-6 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:p-8 ${layer.tone}`}>
                        <div>
                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-55">
                            Layer {index + 1} · {layer.label}
                          </p>
                          <Icon className="mt-5 h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-medium tracking-[-0.03em]">{layer.title}</h3>
                          <p className="mt-2 max-w-2xl text-sm leading-6 opacity-65">{layer.description}</p>
                        </div>
                        <div className="hidden rounded-full border border-current/15 px-3 py-2 text-[9px] uppercase tracking-[0.16em] opacity-60 sm:block">
                          {index % 2 === 0 ? 'Input + output' : 'Control + route'}
                        </div>
                      </div>
                      {index < systemLayers.length - 1 ? (
                        <div className="flex h-10 items-center justify-center gap-8 text-[#997022]">
                          <ArrowDown className="h-4 w-4" />
                          <span className="text-[8px] uppercase tracking-[0.18em]">two-way information flow</span>
                          <ArrowDown className="h-4 w-4 rotate-180" />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="today" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="04"
                eyebrow="Current reality"
                title="Three products create one expandable operating system."
                description="The WhatsApp Assistant is the required starting point. The Document Maker adds the document layer when a customer needs it. The Project Portal adds project control for the most complete operating model."
              />
              <div className="mt-10 overflow-hidden rounded-3xl border border-[#223C33]/12 bg-white/60">
                <div className="hidden grid-cols-[1fr_1.35fr_1.55fr] bg-[#223C33] px-6 py-4 text-[9px] uppercase tracking-[0.18em] text-white/55 md:grid">
                  <span>Product</span><span>What exists today</span><span>Commercial role</span>
                </div>
                {[
                  [
                    'WhatsApp Assistant',
                    'Reads business communication, summarizes conversations, and identifies actions and follow-ups.',
                    'Core is the minimum B2W product: $2,000 setup + $99/month.',
                  ],
                  [
                    'Document Maker',
                    'Creates the SOPs, estimates, reports, and repeatable document workflows the assistant can use.',
                    'Premium adds document capability through a higher monthly plan—without another setup fee.',
                  ],
                  [
                    'Project Portal',
                    'Organizes projects, contracts, dates, owners, status, actions, and linked documents in one portal.',
                    'Maximum adds the Project Portal to Premium for customers that need a shared project-control layer.',
                  ],
                ].map(([component, capability, role]) => (
                  <div key={component} className="grid gap-4 border-t border-[#223C33]/10 p-6 first:border-t-0 md:grid-cols-[1fr_1.35fr_1.55fr]">
                    <p className="font-semibold">{component}</p>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/35 md:hidden">What exists today</p>
                      <p className="mt-1 text-sm leading-6 text-[#223C33]/62 md:mt-0">{capability}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/35 md:hidden">Commercial role</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-[#8A5B16] md:mt-0">{role}</p>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            <section id="revenue" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="05"
                eyebrow="Revenue model now"
                title="Start with the WhatsApp Assistant. Expand through documents and project control."
                description="Every customer begins with Core. Premium adds the Document Maker. Maximum adds the Project Portal. The ladder increases recurring revenue without repeating the original setup fee."
              />
              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#223C33]/12 bg-white/60 p-7">
                  <CircleDollarSign className="h-6 w-6 text-[#997022]" />
                  <p className="mt-8 text-[9px] uppercase tracking-[0.18em] text-[#223C33]/38">One-time revenue</p>
                  <p className="mt-3 text-2xl font-medium tracking-[-0.03em]">$2,000 Core setup.</p>
                  <p className="mt-4 text-sm leading-6 text-[#223C33]/58">
                    Configure the WhatsApp Assistant, permissions, onboarding, and the first workflow. If a customer has existing SOPs or estimating tools, a separate one-time document-learning fee covers up to 50 documents.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#223C33]/12 bg-[#DDE8E1] p-7">
                  <RefreshCw className="h-6 w-6 text-[#315746]" />
                  <p className="mt-8 text-[9px] uppercase tracking-[0.18em] text-[#223C33]/38">Recurring revenue</p>
                  <p className="mt-3 text-2xl font-medium tracking-[-0.03em]">Move customers up the product ladder.</p>
                  <p className="mt-4 text-sm leading-6 text-[#223C33]/58">
                    Core begins at $99/month. Premium increases the monthly plan for document capability. Maximum increases it again for the Project Portal. Neither upgrade repeats the setup fee.
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {[
                  [
                    'Core',
                    'WhatsApp Assistant',
                    'WhatsApp assistant for summaries, actions, and follow-up clarity.',
                    '$2,000 setup',
                    '$99 / month',
                  ],
                  [
                    'Premium',
                    'WhatsApp Assistant + Document Maker',
                    'Use existing process documents or develop the missing SOPs, estimates, reports, and templates.',
                    'No additional setup',
                    'Higher monthly plan',
                  ],
                  [
                    'Maximum',
                    'WhatsApp Assistant + Document Maker + Project Portal',
                    'Add the project portal for shared project context, status, decisions, actions, and risk visibility.',
                    'No additional setup',
                    'Highest monthly plan',
                  ],
                ].map(([offer, products, description, setup, recurring], index) => (
                  <div key={offer} className={`rounded-3xl border p-6 ${
                    index === 0 ? 'border-[#223C33] bg-[#223C33] text-white' : 'border-[#223C33]/12 bg-white/50'
                  }`}>
                    <p className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${index === 0 ? 'text-[#D8B56A]' : 'text-[#997022]'}`}>{offer}</p>
                    <p className="mt-5 text-lg font-semibold leading-6">{products}</p>
                    <p className={`mt-3 min-h-20 text-xs leading-5 ${index === 0 ? 'text-white/52' : 'text-[#223C33]/52'}`}>{description}</p>
                    <div className={`mt-6 border-t pt-5 ${index === 0 ? 'border-white/12' : 'border-[#223C33]/10'}`}>
                      <p className="text-xl font-medium">{setup}</p>
                      <p className={`mt-1 text-[10px] ${index === 0 ? 'text-white/45' : 'text-[#223C33]/42'}`}>one-time</p>
                      <p className="mt-5 text-sm font-semibold">{recurring}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#223C33]/42">
                Premium and Maximum monthly prices, plus the one-time document-learning fee, remain to be validated. The document-learning fee is distinct from setup and covers up to 50 existing documents.
              </p>
            </section>

            <section id="stages" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="06"
                eyebrow="Three-stage business model"
                title="Product maturity changes the economics."
                description="Service effort declines as the product becomes repeatable; recurring revenue, capability, and gross margin should rise."
              />
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {[
                  [
                    '01',
                    'Prove value',
                    'Free tools, demos + consultations',
                    'Attract contractors with free estimate, SOP, and proposal tools; convert interest through product demos and growth consultations.',
                    'Founder-led',
                  ],
                  [
                    '02',
                    'Prove repeatability',
                    'Paying customers + source data',
                    'Use customer count, plan selection, retention, and acquisition source to learn which offers and channels are working.',
                    'Standardized',
                  ],
                  ['03', 'Scale the platform', 'Integrations, templates + approval controls', 'Grow recurring revenue faster than delivery cost.', 'Low-touch'],
                ].map(([number, title, product, goal, delivery], index) => (
                  <div key={number} className={`rounded-3xl border p-7 ${
                    index === 2 ? 'border-[#223C33] bg-[#223C33] text-white' : 'border-[#223C33]/12 bg-white/55'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs ${index === 2 ? 'text-[#D8B56A]' : 'text-[#997022]'}`}>{number}</span>
                      <span className={`rounded-full border px-3 py-1 text-[8px] uppercase tracking-[0.14em] ${
                        index === 2 ? 'border-white/12 text-white/45' : 'border-[#223C33]/12 text-[#223C33]/45'
                      }`}>{delivery}</span>
                    </div>
                    <h3 className="mt-10 text-3xl font-medium tracking-[-0.04em]">{title}</h3>
                    <p className={`mt-4 text-sm font-semibold leading-6 ${index === 2 ? 'text-white/75' : ''}`}>{product}</p>
                    <p className={`mt-5 text-sm leading-6 ${index === 2 ? 'text-white/45' : 'text-[#223C33]/52'}`}>{goal}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-3xl border border-[#223C33]/12 bg-white/50 p-6 sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:items-end">
                  <div>
                    <Gauge className="h-6 w-6 text-[#997022]" />
                    <p className="mt-6 text-xl font-medium tracking-[-0.025em]">Economic progression</p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {[
                      ['Recurring revenue', [24, 42, 66, 88], 'bg-[#315746]'],
                      ['Product capability', [28, 48, 72, 94], 'bg-[#B68124]'],
                      ['Gross margin', [18, 36, 62, 84], 'bg-[#527764]'],
                      ['Service effort', [92, 70, 44, 22], 'bg-[#9B6953]'],
                    ].map(([label, values, color]) => (
                      <div key={String(label)}>
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-[#223C33]/45">
                          <span>{String(label)}</span><span>Time →</span>
                        </div>
                        <div className="mt-3 flex h-16 items-end gap-2">
                          {(values as number[]).map((value, index) => (
                            <div
                              key={index}
                              className={`flex-1 rounded-t-lg ${String(color)}`}
                              style={{ height: `${value}%`, opacity: 0.55 + index * 0.14 }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="gates" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="07"
                eyebrow="Phase gates"
                title="Progress when evidence is ready—not when the calendar changes."
                description="Each phase has measurable exit criteria across customers, product, revenue, delivery, and economics."
              />
              <div className="mt-10 overflow-x-auto rounded-3xl border border-[#223C33]/12 bg-white/60">
                <div className="min-w-[780px]">
                  <div className="grid grid-cols-[150px_repeat(3,1fr)] bg-[#223C33] px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-white/55">
                    <span>Category</span><span>Phase 1 gate</span><span>Phase 2 gate</span><span>Scale gate</span>
                  </div>
                  {[
                    ['Customers', 'Qualified demos + consultations', 'Paying customers + source data', 'Repeatable acquisition'],
                    ['Product', 'Useful free tools + demo proven', 'Paid product in recurring use', 'Configurable platform'],
                    ['Revenue', 'Offer interest validated', 'Initial recurring revenue + retention', 'Predictable growth'],
                    ['Delivery', 'Founder-led demos + consultations', 'Standardized onboarding', 'Low-touch deployment'],
                    ['Economics', 'Demand signal validated', 'Positive contribution margin', 'Strong gross margin'],
                  ].map((row) => (
                    <div key={row[0]} className="grid grid-cols-[150px_repeat(3,1fr)] border-t border-[#223C33]/10 px-6 py-5 text-sm">
                      <span className="font-semibold">{row[0]}</span>
                      {row.slice(1).map((cell) => <span key={cell} className="pr-5 leading-6 text-[#223C33]/58">{cell}</span>)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ['Phase 1 complete', 'Free-tool use, qualified demos, and consultation demand consistently reveal contractor pain and offer interest.'],
                  ['Phase 2 complete', 'Paying customers, recurring use, retention, and acquisition-source data reveal which offers and channels work.'],
                  ['Phase 3 begins', 'Acquisition, onboarding, delivery, support, and infrastructure can scale predictably.'],
                ].map(([title, body], index) => (
                  <div key={title} className="rounded-2xl border border-[#223C33]/12 bg-white/45 p-5">
                    <CheckCircle2 className={`h-5 w-5 ${index === 2 ? 'text-[#997022]' : 'text-[#527764]'}`} />
                    <p className="mt-6 text-sm font-semibold">{title}</p>
                    <p className="mt-3 text-xs leading-5 text-[#223C33]/52">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="next" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="08"
                eyebrow="What must be built next"
                title="One complete workflow is worth more than ten disconnected features."
                description="The first priority is proving that the assistant can invoke the right document skill using relevant business context."
              />
              <div className="mt-10 rounded-3xl bg-[#223C33] p-6 text-white sm:p-9">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D8B56A]">Reference workflow</p>
                <p className="mt-4 text-2xl font-medium tracking-[-0.03em]">“Create this week’s project update for the owner.”</p>
                <div className="mt-9 grid gap-3 md:grid-cols-[repeat(4,1fr)]">
                  {[
                    ['01', 'Ask', 'User requests through WhatsApp'],
                    ['02', 'Understand', 'Assistant identifies intent'],
                    ['03', 'Retrieve', 'Project + contract context'],
                    ['04', 'Select', 'Correct document skill'],
                    ['05', 'Draft', 'Structured update generated'],
                    ['06', 'Approve', 'User reviews or approves'],
                    ['07', 'Act', 'Save, share, or trigger next action'],
                  ].map(([number, title, body]) => (
                    <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                      <p className="font-mono text-[9px] text-[#D8B56A]">{number}</p>
                      <p className="mt-6 text-sm font-semibold">{title}</p>
                      <p className="mt-2 text-[11px] leading-5 text-white/45">{body}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl bg-[#D8B56A] p-5 text-[#223C33]">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="mt-6 text-sm font-semibold">Recorded result</p>
                    <p className="mt-2 text-[11px] leading-5 text-[#223C33]/65">Approved version saved with a visible audit trail.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="ownership" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="09"
                eyebrow="Ownership and operating model"
                title="Every strategic decision has an executive owner."
                description="Opportunities move through a deliberate handoff, then the team decides whether the requirement becomes configuration, a reusable feature, or is rejected."
              />
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {ownership.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.role} className={`rounded-3xl border p-7 ${
                      index === 1 ? 'border-[#B68124]/35 bg-[#D8B56A]/14' : 'border-[#223C33]/12 bg-white/55'
                    }`}>
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-[#997022]" />
                        <span className="font-mono text-xs text-[#223C33]/38">0{index + 1}</span>
                      </div>
                      <h3 className="mt-10 text-3xl font-medium tracking-[-0.04em]">{item.role}</h3>
                      <p className="mt-4 text-sm font-semibold leading-6">{item.owns}</p>
                      <p className="mt-5 border-t border-[#223C33]/10 pt-5 text-sm leading-6 text-[#223C33]/55">{item.action}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 rounded-3xl border border-[#223C33]/12 bg-white/50 p-6 sm:p-8">
                <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
                  {[
                    ['CEO', 'Qualify opportunity'],
                    ['COO', 'Define workflow'],
                    ['CTO', 'Design delivery'],
                    ['Team', 'Configure, productize, or reject'],
                  ].map(([role, action], index) => (
                    <div className="contents" key={role}>
                      {index > 0 ? <FlowArrow /> : null}
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.18em] text-[#997022]">{role}</p>
                        <p className="mt-2 text-sm font-semibold">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="financials" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="10"
                eyebrow="Financial progression"
                title="Show how the economics change before projecting the future."
                description="Setup fees lead the initial model. Subscriptions grow with repeatability. Platform subscriptions, usage, integrations, and workflow tiers drive scale."
              />
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Initial validation', '10', '$1,000 / mo', '$120K'],
                  ['Integrated product', '50', '$1,500 / mo', '$900K'],
                  ['Early scale', '250', '$2,000 / mo', '$6M'],
                  ['Platform scale', '1,000', '$2,500 / mo', '$30M'],
                ].map(([stage, customers, recurring, arr], index) => (
                  <div key={stage} className={`rounded-3xl border p-6 ${
                    index === 3 ? 'border-[#223C33] bg-[#223C33] text-white' : 'border-[#223C33]/12 bg-white/55'
                  }`}>
                    <p className={`text-[8px] uppercase tracking-[0.18em] ${index === 3 ? 'text-[#D8B56A]' : 'text-[#997022]'}`}>{stage}</p>
                    <p className="mt-8 text-4xl font-medium tracking-[-0.04em]">{arr}</p>
                    <p className={`mt-1 text-[9px] uppercase tracking-[0.14em] ${index === 3 ? 'text-white/35' : 'text-[#223C33]/35'}`}>Illustrative ARR</p>
                    <div className={`mt-7 border-t pt-5 text-xs ${index === 3 ? 'border-white/12 text-white/55' : 'border-[#223C33]/10 text-[#223C33]/52'}`}>
                      <p>{customers} customers</p>
                      <p className="mt-2">{recurring} average recurring</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] leading-5 text-[#223C33]/42">Scale scenarios—not forecasts or promises.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['CAC', 'Cost to acquire a customer'],
                  ['Retention', 'Recurring customer and revenue durability'],
                  ['Gross margin', 'Revenue remaining after delivery cost'],
                  ['Implementation hours', 'Founder and team effort per launch'],
                  ['Infrastructure cost', 'Model, storage, and integration spend'],
                  ['Revenue / customer', 'Recurring and expansion value'],
                ].map(([metric, label]) => (
                  <div key={metric} className="flex items-start gap-4 rounded-2xl border border-[#223C33]/12 bg-white/45 p-5">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-[#997022]" />
                    <div>
                      <p className="text-sm font-semibold">{metric}</p>
                      <p className="mt-1 text-[11px] leading-5 text-[#223C33]/48">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="ninety-days" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="11"
                eyebrow="Immediate 90-day plan"
                title="Narrow the market. Complete the workflow. Prove repeatable value."
                description="The next 90 days are for learning what customers will repeatedly pay for—not for building a complete CRM, project-management suite, or broad AI platform."
              />
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  ['Days 1–30', 'Focus', ['Select one customer segment', 'Define the first paid offer', 'Specify the first workflow']],
                  ['Days 31–60', 'Build + onboard', ['Validate assistant-to-document flow', 'Onboard initial customers', 'Measure time-to-first-value']],
                  ['Days 61–90', 'Prove + standardize', ['Document recurring use', 'Validate pricing and outcomes', 'Capture what is repeatable']],
                ].map(([range, label, items], index) => (
                  <div key={String(range)} className={`rounded-3xl border p-7 ${
                    index === 0 ? 'border-[#223C33] bg-[#223C33] text-white' : 'border-[#223C33]/12 bg-white/55'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Clock3 className={`h-5 w-5 ${index === 0 ? 'text-[#D8B56A]' : 'text-[#997022]'}`} />
                      <span className="font-mono text-[9px] opacity-40">{range}</span>
                    </div>
                    <h3 className="mt-9 text-2xl font-medium tracking-[-0.03em]">{label}</h3>
                    <div className={`mt-6 space-y-3 border-t pt-5 ${index === 0 ? 'border-white/12' : 'border-[#223C33]/10'}`}>
                      {(items as string[]).map((item) => (
                        <p key={item} className={`flex gap-2 text-xs leading-5 ${index === 0 ? 'text-white/60' : 'text-[#223C33]/55'}`}>
                          <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${index === 0 ? 'text-[#D8B56A]' : 'text-[#527764]'}`} />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <blockquote className="mt-10 rounded-3xl bg-[#D8B56A]/18 p-7 text-2xl font-medium leading-9 tracking-[-0.03em] text-[#223C33] sm:p-9 sm:text-3xl sm:leading-10">
                “Does this help B2W deliver a valuable customer outcome more reliably, repeatedly, or profitably?”
              </blockquote>
            </section>

            <section id="tracker" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="12"
                eyebrow="Supporting execution tracker"
                title="Turn the strategy into owned, measurable work."
                description="Update status and evidence weekly. Progress is stored in this browser and uses the same phases, owners, metrics, and language as the strategy."
              />

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  ['Complete', trackerSummary.complete, 'text-emerald-700'],
                  ['In progress', trackerSummary.inProgress, 'text-blue-700'],
                  ['Blocked', trackerSummary.blocked, 'text-red-700'],
                ].map(([label, count, tone]) => (
                  <div key={String(label)} className="rounded-2xl border border-[#223C33]/12 bg-white/55 p-5">
                    <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/38">{label}</p>
                    <p className={`mt-3 text-3xl font-medium ${tone}`}>{count}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {trackerItems.map((item, index) => {
                  const update = trackerUpdates[item.id] ?? {
                    status: item.defaultStatus,
                    evidence: '',
                  };
                  return (
                    <details key={item.id} className="group overflow-hidden rounded-3xl border border-[#223C33]/12 bg-white/60">
                      <summary className="grid cursor-pointer list-none gap-5 p-5 sm:p-6 lg:grid-cols-[44px_120px_minmax(0,1fr)_130px_auto] lg:items-center">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#223C33] font-mono text-[9px] text-white">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <span className={`w-fit rounded-full border px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] ${categoryStyles[item.category]}`}>
                          {item.category}
                        </span>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-[#223C33]/38">{item.phase}</p>
                          <p className="mt-2 text-base font-semibold tracking-[-0.015em]">{item.objective}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.14em] text-[#223C33]/35">Owner</p>
                          <p className="mt-1 text-sm font-semibold">{item.owner}</p>
                        </div>
                        <div className="flex items-center justify-between gap-4 lg:justify-end">
                          <span className={`rounded-full px-3 py-1.5 text-[9px] font-semibold ${statusStyles[update.status]}`}>
                            {update.status}
                          </span>
                          <ChevronDown className="h-4 w-4 text-[#223C33]/38 transition group-open:rotate-180" />
                        </div>
                      </summary>
                      <div className="border-t border-[#223C33]/10 bg-[#F2EEE5]/65 p-5 sm:p-6">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                          <div>
                            <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/38">Task</p>
                            <p className="mt-2 text-sm leading-6">{item.task}</p>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                              {[
                                ['Contributors', item.contributors],
                                ['Deadline', item.deadline],
                                ['Dependency', item.dependency],
                                ['Success measure', item.measure],
                              ].map(([label, value]) => (
                                <div key={label} className="border-t border-[#223C33]/10 pt-3">
                                  <p className="text-[8px] uppercase tracking-[0.14em] text-[#223C33]/35">{label}</p>
                                  <p className="mt-2 text-xs leading-5 text-[#223C33]/58">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block">
                              <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#223C33]/45">Status</span>
                              <select
                                value={update.status}
                                onChange={(event) => updateTracker(item, { status: event.target.value as TrackerStatus })}
                                className="mt-2 h-11 w-full rounded-xl border border-[#223C33]/15 bg-white px-3 text-sm outline-none focus:border-[#B68124]"
                              >
                                {(['Not started', 'In progress', 'Blocked', 'Complete'] as TrackerStatus[]).map((status) => (
                                  <option key={status}>{status}</option>
                                ))}
                              </select>
                            </label>
                            <label className="mt-4 block">
                              <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#223C33]/45">Evidence of completion</span>
                              <textarea
                                value={update.evidence}
                                onChange={(event) => updateTracker(item, { evidence: event.target.value })}
                                rows={5}
                                placeholder="Add a result, metric, link, decision, or other evidence."
                                className="mt-2 w-full resize-y rounded-xl border border-[#223C33]/15 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#B68124]"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          </article>

          <footer className="border-t border-[#223C33]/12 bg-[#EEE9DE] px-5 py-10 sm:px-8 lg:px-14">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="b2w-wordmark text-sm font-semibold">B2W LLC</p>
                <p className="mt-1 text-[10px] text-[#223C33]/42">Private executive strategy system</p>
              </div>
              <button
                type="button"
                onClick={onLock}
                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/55 px-4 text-xs font-semibold text-[#223C33] transition hover:bg-white"
              >
                <LockKeyhole className="h-3.5 w-3.5" />
                Lock strategy
              </button>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default function B2WExecutiveStrategyV0Page() {
  const [authState, setAuthState] = useState<'checking' | 'locked' | 'authenticated'>('checking');

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const response = await fetch('/api/executive-strategy?scope=b2w&action=status', {
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
    const revalidateRestoredPage = () => void verifySession();
    window.addEventListener('pageshow', revalidateRestoredPage);

    return () => {
      active = false;
      window.removeEventListener('pageshow', revalidateRestoredPage);
    };
  }, []);

  if (authState === 'checking') {
    return (
      <main className="grid min-h-screen place-items-center bg-[#EEE9DE] text-[#223C33]">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#223C33]/55">
          <RefreshCw className="h-4 w-4 animate-spin text-[#B68124]" />
          Checking secure session
        </div>
      </main>
    );
  }

  if (authState === 'locked') {
    return <AccessScreen onAuthenticated={() => setAuthState('authenticated')} />;
  }

  return (
    <StrategyWorkspace
      onLock={() => {
        void fetch('/api/executive-strategy?scope=b2w&action=logout', {
          method: 'POST',
          credentials: 'same-origin',
        }).finally(() => setAuthState('locked'));
      }}
    />
  );
}
