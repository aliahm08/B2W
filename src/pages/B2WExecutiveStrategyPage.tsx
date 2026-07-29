import { FormEvent, Fragment, useEffect, useMemo, useState } from 'react';
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
  category: 'Market' | 'Revenue' | 'Product' | 'Customer Success' | 'Scale';
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

type NavigationGroupId = 'map' | 'optimization' | 'diligence';

const sectionLinks: Array<{ id: SectionId; number: string; label: string; parent?: NavigationGroupId }> = [
  { id: 'company', number: '01', label: 'Company in one view', parent: 'map' },
  { id: 'problem', number: '02', label: 'Customer problem', parent: 'map' },
  { id: 'architecture', number: '03', label: 'Product architecture', parent: 'map' },
  { id: 'today', number: '04', label: 'What exists today', parent: 'map' },
  { id: 'revenue', number: '05', label: 'Revenue development model', parent: 'optimization' },
  { id: 'stages', number: '06', label: 'Five-stage model', parent: 'optimization' },
  { id: 'gates', number: '07', label: 'Commercial gates', parent: 'optimization' },
  { id: 'next', number: '08', label: 'What to build next', parent: 'optimization' },
  { id: 'ownership', number: '09', label: 'Ownership model', parent: 'diligence' },
  { id: 'financials', number: '10', label: 'Financial progression', parent: 'diligence' },
  { id: 'ninety-days', number: '11', label: 'Five-phase diligence plan', parent: 'diligence' },
  { id: 'tracker', number: '12', label: 'Execution tracker', parent: 'diligence' },
];

type NavigationGroupDefinition = {
  label: string;
  subtitle?: string;
};

const navigationGroupStarts: Partial<Record<SectionId, NavigationGroupDefinition>> = {
  company: { label: 'Growth Map' },
  revenue: { label: 'Optimization' },
  ownership: { label: 'Diligence', subtitle: 'Accountability + tracking' },
};

const trackerItems: TrackerItem[] = [
  {
    id: 'segment',
    phase: 'Phase 01 · Foundation',
    category: 'Market',
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
    phase: 'Phase 01 · Foundation',
    category: 'Revenue',
    objective: 'Define the paid offer',
    task: 'Define the five revenue stages from the $99/month trade-expert offer through SME verification, midsize workflows, project-system integrations, and enterprise agentic contracts.',
    owner: 'CEO',
    contributors: 'COO, CTO',
    deadline: 'Day 21',
    dependency: 'Segment selection',
    measure: 'Every sales conversation identifies the customer’s current stage, evidence exchange, revenue gate, and next expansion path.',
    defaultStatus: 'Not started',
  },
  {
    id: 'pricing',
    phase: 'Phase 02 · Validation',
    category: 'Revenue',
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
    phase: 'Phase 01 · Foundation',
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
    phase: 'Phase 01 · Foundation',
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
    phase: 'Phase 01 · Foundation',
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
    phase: 'Phase 01 · Foundation',
    category: 'Customer Success',
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
    phase: 'Phase 01 · Foundation',
    category: 'Customer Success',
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
    phase: 'Phase 02 · Validation',
    category: 'Scale',
    objective: 'Reduce custom delivery',
    task: 'Turn the proven workflow into reusable configuration, templates, and integration steps.',
    owner: 'COO',
    contributors: 'COO',
    deadline: 'After Phase 1 gate',
    dependency: 'Validated recurring workflows',
    measure: 'Implementation hours per customer decline meaningfully.',
    defaultStatus: 'Not started',
  },
  {
    id: 'case-study',
    phase: 'Phase 02 · Validation',
    category: 'Customer Success',
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
    phase: 'Phase 02 · Validation',
    category: 'Market',
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
  Market: 'border-amber-200 bg-amber-50 text-amber-900',
  Revenue: 'border-violet-200 bg-violet-50 text-violet-900',
  Product: 'border-sky-200 bg-sky-50 text-sky-900',
  'Customer Success': 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Scale: 'border-stone-300 bg-stone-100 text-stone-800',
} satisfies Record<TrackerItem['category'], string>;

const statusStyles = {
  'Not started': 'bg-neutral-100 text-neutral-600',
  'In progress': 'bg-blue-100 text-blue-800',
  Blocked: 'bg-red-100 text-red-800',
  Complete: 'bg-emerald-100 text-emerald-800',
} satisfies Record<TrackerStatus, string>;

const pchipSegments = (xValues: number[], yValues: number[]) => {
  const intervals = xValues.slice(0, -1).map((x, index) => xValues[index + 1] - x);
  const slopes = intervals.map((interval, index) => (yValues[index + 1] - yValues[index]) / interval);
  const derivatives = new Array<number>(xValues.length).fill(0);

  const endpointDerivative = (firstInterval: number, secondInterval: number, firstSlope: number, secondSlope: number) => {
    let derivative = ((2 * firstInterval + secondInterval) * firstSlope - firstInterval * secondSlope)
      / (firstInterval + secondInterval);
    if (Math.sign(derivative) !== Math.sign(firstSlope)) derivative = 0;
    else if (Math.sign(firstSlope) !== Math.sign(secondSlope) && Math.abs(derivative) > Math.abs(3 * firstSlope)) {
      derivative = 3 * firstSlope;
    }
    return derivative;
  };

  derivatives[0] = endpointDerivative(intervals[0], intervals[1], slopes[0], slopes[1]);
  derivatives[derivatives.length - 1] = endpointDerivative(
    intervals[intervals.length - 1],
    intervals[intervals.length - 2],
    slopes[slopes.length - 1],
    slopes[slopes.length - 2],
  );

  for (let index = 1; index < derivatives.length - 1; index += 1) {
    if (slopes[index - 1] * slopes[index] <= 0) {
      derivatives[index] = 0;
    } else {
      const previousInterval = intervals[index - 1];
      const nextInterval = intervals[index];
      const previousWeight = 2 * nextInterval + previousInterval;
      const nextWeight = nextInterval + 2 * previousInterval;
      derivatives[index] = (previousWeight + nextWeight)
        / (previousWeight / slopes[index - 1] + nextWeight / slopes[index]);
    }
  }

  return xValues.slice(0, -1).map((x, index) => {
    const interval = intervals[index];
    const nextX = xValues[index + 1];
    const nextY = yValues[index + 1];
    const controlOneX = x + interval / 3;
    const controlOneY = yValues[index] + derivatives[index] * interval / 3;
    const controlTwoX = nextX - interval / 3;
    const controlTwoY = nextY - derivatives[index + 1] * interval / 3;
    return `M ${x},${yValues[index]} C ${controlOneX},${controlOneY} ${controlTwoX},${controlTwoY} ${nextX},${nextY}`;
  });
};

const systemLayers = [
  {
    label: 'Interface',
    title: 'WhatsApp Assistant',
    description: 'The front door where a contractor asks for help, reviews the response, and follows through.',
    icon: MessageCircle,
    tone: 'bg-[#223C33] text-white',
  },
  {
    label: 'Reasoning',
    title: 'Reasoning',
    description: 'Interprets the request, retrieves context, and selects the correct workflow, model, memory, and permissions.',
    icon: Sparkles,
    tone: 'bg-[#D8B56A] text-[#1E2A25]',
  },
  {
    label: 'Creation',
    title: 'Document Maker',
    description: 'Turns the reasoned request into an estimate, SOP, proposal, contract, report, or other repeatable document.',
    icon: Workflow,
    tone: 'bg-[#DDE8E1] text-[#223C33]',
  },
  {
    label: 'Verification',
    title: 'Expert Verification',
    description: 'A subject-matter expert verifies accuracy, trade logic, business fit, and required approvals before release.',
    icon: UserRoundCheck,
    tone: 'bg-[#F2EEE5] text-[#332F27]',
  },
  {
    label: 'Operations',
    title: 'Project Portal',
    description: 'Stores the approved result with the project, contract, dates, owners, status, actions, and linked documents.',
    icon: Network,
    tone: 'bg-slate-700 text-white',
  },
  {
    label: 'Security',
    title: 'SOC 2 & Security Development',
    description: 'Develops the controls, access management, audit logging, data protection, and operating evidence required for SOC 2 readiness.',
    icon: ShieldCheck,
    tone: 'bg-black text-white',
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
              <div className="flex items-center gap-3">
                <B2WIcon title="" className="h-10 w-11 text-[#223C33]" />
                <div>
                  <p className="b2w-wordmark text-sm font-semibold tracking-[0.18em]">B2W</p>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#223C33]/50">Executive strategy system</p>
                </div>
              </div>
              <p className="mt-28 max-w-2xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] xl:text-6xl">
                One operating view for the company we are building.
              </p>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#223C33]/62">
                Product architecture, commercial progression, phase gates, executive ownership, and weekly execution—connected in one private workspace.
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
            <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">Executive access</h1>
            <p className="mt-4 text-sm leading-6 text-[#223C33]/58">
              Enter the strategy password once per secure browser session. Access expires automatically and can be locked manually at any time.
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

function NavigationGroupLabel({ group }: { group: NavigationGroupDefinition }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-1 pt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#997022]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#B68124]" />
      <span>
        <span className="block">{group.label}</span>
        {group.subtitle ? (
          <span className="mt-0.5 block text-[7px] font-medium tracking-[0.1em] text-[#223C33]/38">
            {group.subtitle}
          </span>
        ) : null}
      </span>
      <span className="h-px flex-1 bg-[#223C33]/10" />
    </div>
  );
}

function StrategyWorkspace({
  onLock,
  mode = 'strategy',
}: {
  onLock?: () => void;
  mode?: 'strategy' | 'services';
}) {
  const isServices = mode === 'services';
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
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
        title={isServices ? 'B2W Operating Map' : 'B2W Executive Strategy System'}
        description={
          isServices
            ? 'Private B2W operating map covering the growth map, optimization model, diligence, ownership, and execution tracking.'
            : 'Private B2W product, business, financial, and execution strategy system.'
        }
        robots="noindex, nofollow"
        canonicalPath={isServices ? '/internal/services' : '/executive-strategy'}
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
                {isServices ? 'Operating map' : 'Executive strategy system'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isServices ? (
              <Link
                to="/about"
                className="hidden min-h-9 items-center rounded-full border border-[#223C33]/12 bg-white/55 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#223C33]/65 transition hover:bg-white hover:text-[#223C33] sm:inline-flex"
              >
                About B2W
              </Link>
            ) : (
              <>
                <nav
                  className="flex shrink-0 items-center rounded-full border border-[#223C33]/12 bg-white/55 p-1"
                  aria-label="Executive strategy version"
                >
                  <a
                    href="https://www.b2w-ai.com/executive-strategy"
                    className="rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#223C33]/55 transition hover:bg-white hover:text-[#223C33]"
                    aria-label="Open live version 0"
                    title="Open live V0"
                  >
                    V0
                    <span className="hidden xl:inline"> · Live</span>
                  </a>
                  <span
                    className="rounded-full bg-[#223C33] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm"
                    aria-current="page"
                    aria-label="Current draft version 1"
                    title="Current unstaged V1"
                  >
                    V1
                    <span className="hidden xl:inline"> · Draft</span>
                  </span>
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
              </>
            )}
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
          {sectionLinks.map((section) => {
            const groupLabel = navigationGroupStarts[section.id];
            return (
              <Fragment key={section.id}>
                {groupLabel ? <NavigationGroupLabel group={groupLabel} /> : null}
                <button
                  type="button"
                  onClick={() => goToSection(section.id)}
                  className={`flex w-full items-center gap-4 rounded-xl py-3 pr-4 text-left text-sm ${
                    section.parent ? 'ml-4 w-[calc(100%-1rem)] border-l border-[#223C33]/15 pl-5' : 'px-4'
                  } ${
                    activeSection === section.id ? 'bg-[#223C33] text-white' : 'text-[#223C33]/65 hover:bg-white'
                  }`}
                >
                  <span className="font-mono text-[9px] opacity-50">{section.number}</span>
                  {section.label}
                </button>
              </Fragment>
            );
          })}
        </nav>
      ) : null}

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[238px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#223C33]/12 lg:block">
          <nav className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8" aria-label="Strategy sections">
            <p className="px-3 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#223C33]/35">
              Document sections
            </p>
            <div className="mt-4 space-y-0.5">
              {sectionLinks.map((section) => {
                const groupLabel = navigationGroupStarts[section.id];
                return (
                  <Fragment key={section.id}>
                    {groupLabel ? <NavigationGroupLabel group={groupLabel} /> : null}
                    <button
                      type="button"
                      onClick={() => goToSection(section.id)}
                      className={`relative flex w-full items-center gap-3 rounded-xl py-2.5 pr-3 text-left text-[11px] transition ${
                        section.parent
                          ? 'ml-4 w-[calc(100%-1rem)] border-l border-[#223C33]/15 pl-5'
                          : 'px-3'
                      } ${
                        activeSection === section.id
                          ? 'bg-[#223C33] font-semibold text-white'
                          : 'text-[#223C33]/55 hover:bg-white hover:text-[#223C33]'
                      }`}
                    >
                      <span className="font-mono text-[8px] opacity-50">{section.number}</span>
                      <span className="flex-1">{section.label}</span>
                      {activeSection === section.id ? <ChevronDown className="h-3 w-3 -rotate-90" /> : null}
                    </button>
                  </Fragment>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-[#223C33]/12 bg-white/50 p-4">
              <p className="text-[8px] uppercase tracking-[0.18em] text-[#223C33]/38">Diligence progress</p>
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
                {isServices ? 'B2W Operating Map' : 'B2W Product + Business Strategy'}
              </p>
              <h1 className="mt-7 max-w-5xl text-5xl font-medium leading-[0.96] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                The operating layer for contracting businesses.
              </h1>
              <p className="mt-8 max-w-3xl text-base leading-8 text-white/62 sm:text-lg">
                B2W connects communication, business context, document creation, and approved actions—turning fragmented information into completed work.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#company"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#D8B56A] px-5 text-sm font-semibold text-[#223C33] transition hover:bg-[#E5C77F]"
                >
                  {isServices ? 'Explore Operating Map' : 'Read the strategy'}
                  <ArrowDown className="h-4 w-4" />
                </a>
                {isServices ? (
                  <a
                    href="#tracker"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/24 bg-white/8 px-5 text-sm font-semibold text-white transition hover:bg-white/14"
                  >
                    View our Progress
                    <TrendingUp className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          <article className="mx-auto max-w-6xl px-5 pb-28 sm:px-8 lg:px-14">
            <section id="map" className="scroll-mt-24 py-20 sm:py-28">
              <header className="border-b border-[#223C33]/15 pb-8">
                <h2 className="max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.045em] text-[#17221E] sm:text-5xl">
                  One system. Five connected capabilities.
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#223C33]/62 sm:text-base">
                  The assistant, document maker, and management system are components of one product—not separate bets.
                </p>
              </header>
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
                description="What exists today, what must be proven next, and what the complete platform could eventually become."
              />
              <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#223C33]/12 bg-[#223C33]/12 lg:grid-cols-3">
                {[
                  {
                    horizon: 'Now',
                    product: 'JasonAI prototype with one pre-launch client',
                    model: 'Founder-led testing; Clara remains a concept',
                    proof: 'Prove usage, reliability + launch readiness',
                    tone: 'bg-white',
                  },
                  {
                    horizon: 'Next',
                    product: 'Reasoning, Clara + SME verification',
                    model: 'Build the first verified document workflow',
                    proof: 'Prove repeatable, industry-valid output',
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
                title="Six layers move a request from conversation to secure execution."
                description="The WhatsApp Assistant starts the request. Reasoning guides the work, the Document Maker creates it, an SME verifies it, the Project Portal records it, and security development strengthens the system toward SOC 2 readiness."
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
                        <div className="flex h-10 items-center justify-center gap-4 text-[#997022]">
                          <ArrowDown className="h-4 w-4" />
                          <span className="text-[8px] uppercase tracking-[0.18em]">moves to the next control layer</span>
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
                title="The product vision is ahead of the product today."
                description="JasonAI is a prototype with one pre-launch client. Clara is a concept. Reasoning, SME verification, project systems, integrations, enterprise security, and SOC 2 remain research and development."
              />
              <div className="mt-10 overflow-hidden rounded-3xl border border-[#223C33]/12 bg-white/60">
                <div className="hidden grid-cols-[1fr_.7fr_1.35fr_1.45fr] bg-[#223C33] px-6 py-4 text-[9px] uppercase tracking-[0.18em] text-white/55 md:grid">
                  <span>Capability</span><span>Maturity</span><span>Evidence today</span><span>Next proof</span>
                </div>
                {[
                  [
                    'JasonAI · WhatsApp Assistant',
                    'Prototype',
                    'One client is using the product in pre-launch. It is not yet launched, repeatable, or commercially proven.',
                    'Validate recurring use, reliability, willingness to pay, and readiness for a broader launch.',
                  ],
                  [
                    'Clara · Document Maker',
                    'Concept',
                    'The product and workflow are defined conceptually, but there is no customer-ready prototype today.',
                    'Build one usable document workflow and test it with selected subject-matter experts.',
                  ],
                  [
                    'Reasoning + SME verification',
                    'R&D',
                    'The reasoning, orchestration, and expert-verification loop have not been validated as a repeatable system.',
                    'Prove reasoning quality and a regular expert-review process before introducing the next agent price.',
                  ],
                  [
                    'Project systems + enterprise security',
                    'R&D',
                    'The Project Portal, external integrations, custom management system, enterprise controls, and SOC 2 program are future work.',
                    'Learn from midsize project-system integrations before building; fund compliance and security after revenue.',
                  ],
                ].map(([component, maturity, evidence, proof]) => (
                  <div key={component} className="grid gap-4 border-t border-[#223C33]/10 p-6 first:border-t-0 md:grid-cols-[1fr_.7fr_1.35fr_1.45fr]">
                    <p className="font-semibold">{component}</p>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/35 md:hidden">Maturity</p>
                      <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] md:mt-0 ${
                        maturity === 'Prototype'
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : maturity === 'Concept'
                            ? 'border-sky-200 bg-sky-50 text-sky-800'
                            : 'border-neutral-200 bg-neutral-100 text-neutral-600'
                      }`}>{maturity}</span>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/35 md:hidden">Evidence today</p>
                      <p className="mt-1 text-sm leading-6 text-[#223C33]/62 md:mt-0">{evidence}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-[#223C33]/35 md:hidden">Next proof</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-[#8A5B16] md:mt-0">{proof}</p>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            <section id="revenue" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="05"
                eyebrow="Revenue development model"
                title="Each customer segment teaches the product what the next segment will pay for."
                description="B2W starts with trade experts, exchanges free access for verified industry knowledge, moves into midsize workflow systems, and uses enterprise revenue to fund the security and compliance required for scale."
              />
              <div className="mt-10 rounded-3xl bg-[#223C33] p-7 text-white sm:p-9">
                <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-center">
                  <div>
                    <RefreshCw className="h-6 w-6 text-[#D8B56A]" />
                    <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D8B56A]">Revenue flywheel</p>
                  </div>
                  <p className="text-2xl font-medium leading-9 tracking-[-0.03em] sm:text-3xl">
                    Give valuable access before charging more—then convert the resulting expertise, project structure, and workflow knowledge into a defensible agent.
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  {
                    stage: '01',
                    market: 'Trade experts',
                    title: 'Turn the JasonAI prototype into a launchable product.',
                    product: 'WhatsApp Assistant + verified reasoning and orchestration',
                    exchange: 'Use the one pre-launch client to validate recurring use, reliability, and the core workflow. Once ready, market directly to general contractors and expert owner-operators—plumbers, barbers, and other trade specialists—and use stickiness to identify future SME partners.',
                    revenue: 'Pre-launch target: $2,000 setup + $99/month. Validate before treating it as a proven offer.',
                  },
                  {
                    stage: '02',
                    market: 'SME partners',
                    title: 'Trade free Clara access for continuous verification.',
                    product: 'JasonAI + Clara + SME feedback loop',
                    exchange: 'Give the stickiest experts free, unlimited access to Clara. They can produce through JasonAI or Clara directly. In exchange, collect regular feedback, codify the documents, create B2W-style industry baselines verified by practitioners, and reserve those verified deliverables for JasonAI.',
                    revenue: 'When the verified baseline is strong, end open free usage and introduce the next agent price.',
                  },
                  {
                    stage: '03',
                    market: 'Midsize specialist firms',
                    title: 'Sell a productive workflow system—not a document tool.',
                    product: 'JasonAI + Clara, configured together',
                    exchange: 'Target architecture firms, engineering consultancies, real estate developers, and businesses that contract trade specialists. Configure repeatable processes and full workflows while building a network between specialist firms and trade experts.',
                    revenue: 'Setup fee + higher recurring price for the configured duo.',
                  },
                  {
                    stage: '04',
                    market: 'Project-system customers',
                    title: 'Use one free integration to learn the operating structure.',
                    product: 'Project Portal or integration into the customer’s existing system',
                    exchange: 'Provide one free integration setup into Google Workspace, a CRM, Salesforce, or the relevant construction platform. Use that access to understand project structure, identify CRM gaps, and build a custom management layer where needed.',
                    revenue: 'The first integration is free; additional integrations, management systems, and workflow expansion become paid.',
                  },
                  {
                    stage: '05',
                    market: 'Enterprise',
                    title: 'Lock in an agentic platform with workflows it can act on.',
                    product: 'JasonAI + custom workflows + connected systems + action permissions',
                    exchange: 'Teach JasonAI to read and update the customer’s tools. Package the resulting custom workflows and integrations into a fully agentic platform, then use the earnings to hire developers for security, reliability, and SOC 2 compliance.',
                    revenue: 'Enterprise contract, implementation, integrations, and recurring platform revenue.',
                  },
                ].map(({ stage, market, title, product, exchange, revenue }, index) => (
                  <div key={stage} className={`grid gap-6 rounded-3xl border p-6 lg:grid-cols-[150px_1fr_255px] lg:items-start lg:p-8 ${
                    index === 4 ? 'border-[#223C33] bg-[#223C33] text-white' : 'border-[#223C33]/12 bg-white/55'
                  }`}>
                    <div>
                      <p className={`font-mono text-xs ${index === 4 ? 'text-[#D8B56A]' : 'text-[#997022]'}`}>{stage}</p>
                      <p className={`mt-5 text-[9px] font-semibold uppercase tracking-[0.18em] ${index === 4 ? 'text-white/45' : 'text-[#223C33]/42'}`}>{market}</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-medium tracking-[-0.03em]">{title}</h3>
                      <p className={`mt-3 text-sm font-semibold leading-6 ${index === 4 ? 'text-white/78' : 'text-[#315746]'}`}>{product}</p>
                      <p className={`mt-4 text-sm leading-6 ${index === 4 ? 'text-white/52' : 'text-[#223C33]/58'}`}>{exchange}</p>
                    </div>
                    <div className={`border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 ${index === 4 ? 'border-white/12' : 'border-[#223C33]/10'}`}>
                      <CircleDollarSign className={`h-5 w-5 ${index === 4 ? 'text-[#D8B56A]' : 'text-[#997022]'}`} />
                      <p className={`mt-5 text-[9px] font-semibold uppercase tracking-[0.18em] ${index === 4 ? 'text-white/42' : 'text-[#223C33]/38'}`}>Revenue gate</p>
                      <p className="mt-3 text-sm font-semibold leading-6">{revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="stages" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="06"
                eyebrow="Five-stage commercial model"
                title="Each product tier funds the next stage of capability."
                description="Core establishes recurring revenue. Premium grows through verified expert knowledge. Maximum temporarily raises service effort before productization, security, and full-price platform revenue improve the economics."
              />
              <div className="mt-10 overflow-hidden rounded-3xl border border-[#223C33]/12 bg-white/55">
                <div className="border-b border-[#223C33]/10 p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <Gauge className="h-6 w-6 text-[#997022]" />
                    <h3 className="mt-5 text-2xl font-medium tracking-[-0.03em]">Commercial and economic progression</h3>
                    <p className="mt-2 text-sm leading-6 text-[#223C33]/55">
                      One stage-aligned view of recurring revenue, added capability, verified knowledge, security milestones, and service effort—not a financial forecast.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#223C33]/8 pt-5">
                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#223C33]/58">
                      <svg viewBox="0 0 28 14" className="h-3.5 w-7" aria-hidden="true">
                        <path d="M1 12 L1 10 C7 10 10 8 14 7 C19 5 22 3 27 1 L27 12 Z" fill="#1F4B3C" fillOpacity="0.7" />
                      </svg>
                      Recurring revenue
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#223C33]/58">
                      <span className="flex items-end gap-0.5">
                        {['#A8A8A8', '#737373', '#404040', '#111111'].map((tone, index) => (
                          <span key={tone} className="h-1.5 w-1.5 rounded-[1px]" style={{ backgroundColor: tone, transform: `translateY(${-index}px)` }} />
                        ))}
                      </span>
                      Verified knowledge
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#223C33]/58">
                      <span className="h-0.5 w-7 rounded-full bg-[#C24D3A]" />
                      Service effort
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto px-4 pb-6 pt-6 sm:px-7">
                  <div className="min-w-[840px]">
                    <svg
                      viewBox="0 0 1000 520"
                      className="w-full"
                      role="img"
                      aria-label="Unified five-stage graph showing recurring revenue columns, product capability callouts, verified knowledge blocks, security milestones, and a service effort curve"
                    >
                      {[100, 300, 500, 700, 900].map((x, index) => (
                        <g key={x}>
                          <rect
                            x={x - 90}
                            y="14"
                            width="180"
                            height="488"
                            rx="18"
                            fill={index === 3 ? '#F5EDE7' : index === 4 ? '#223C33' : '#F7F4EC'}
                            opacity={index === 4 ? 0.08 : 0.74}
                          />
                          {index === 4 ? <rect x={x - 90} y="14" width="180" height="88" rx="18" fill="#223C33" /> : null}
                          <line x1={x} y1="108" x2={x} y2="430" stroke="#223C33" strokeOpacity="0.08" />
                        </g>
                      ))}

                      {[205, 270, 335, 390].map((y) => (
                        <line key={y} x1="18" y1={y} x2="982" y2={y} stroke="#223C33" strokeOpacity="0.07" strokeDasharray="4 8" />
                      ))}

                      {[
                        ['01', 'CORE LAUNCH', '$99/mo + $2,000 setup'],
                        ['02', 'PREMIUM TRIALS', '$149/mo · setup waived early'],
                        ['03', 'VERIFIED WORKFLOWS', 'Core + Premium subscriptions rise'],
                        ['04', 'MAXIMUM TRIALS', 'Free trials · tokens + hiring spike'],
                        ['05', 'FULL PLATFORM', '$399/mo + larger setup fee'],
                      ].map(([number, title, pricing], index) => {
                        const x = [100, 300, 500, 700, 900][index];
                        const inverse = index === 4;
                        return (
                          <g key={number}>
                            <text x={x} y="39" textAnchor="middle" fill={inverse ? '#D8B56A' : '#997022'} fontSize="10" fontFamily="monospace">
                              {number}
                            </text>
                            <text x={x} y="62" textAnchor="middle" fill={inverse ? '#FFFFFF' : '#223C33'} fontSize="11" fontWeight="700" letterSpacing="1.1">
                              {title}
                            </text>
                            <foreignObject x={x - 72} y="70" width="144" height="34">
                              <div className={`text-center text-[9px] leading-4 ${inverse ? 'text-white/55' : 'text-[#223C33]/48'}`}>{pricing}</div>
                            </foreignObject>
                          </g>
                        );
                      })}

                      {[
                        ['BASE', 'WhatsApp assistant'],
                        ['+ 01', 'Document maker'],
                        ['+ 02', 'Verified workflows'],
                        ['+ 03', 'Project systems'],
                        ['+ 04', 'Agentic platform'],
                      ].map(([step, capability], index) => {
                        const x = [100, 300, 500, 700, 900][index];
                        const revenueY = [410, 370, 335, 290, 220][index];
                        return (
                          <g key={capability}>
                            <path
                              d={`M ${x},178 L ${x},${revenueY - 7}`}
                              fill="none"
                              stroke="#B68124"
                              strokeOpacity="0.32"
                              strokeWidth="1.2"
                              strokeDasharray="3 4"
                            />
                            <circle cx={x} cy={revenueY} r="3.5" fill="#D8B56A" stroke="#FFFEFA" strokeWidth="1.5" />
                            <rect x={x - 72} y="132" width="144" height="46" rx="12" fill="#F7F0DE" stroke="#B68124" strokeOpacity="0.28" />
                            <text x={x - 60} y="149" fill="#997022" fontSize="8.5" fontFamily="monospace">{step}</text>
                            <text x={x - 60} y="165" fill="#43351D" fontSize="10" fontWeight="700">{capability}</text>
                          </g>
                        );
                      })}

                      <line x1="45" y1="390" x2="955" y2="390" stroke="#1F4B3C" strokeOpacity="0.22" strokeDasharray="5 6" />
                      <text x="35" y="393" textAnchor="end" fill="#1F4B3C" fillOpacity="0.55" fontSize="8.5" fontWeight="700">0</text>
                      <path
                        d="M 100,410 C 170,408 230,380 300,370 C 370,360 430,345 500,335 C 570,325 630,302 700,290 C 770,278 830,238 900,220 L 900,390 L 100,390 Z"
                        fill="#1F4B3C"
                        fillOpacity="0.18"
                      />
                      <path
                        d="M 100,410 C 170,408 230,380 300,370 C 370,360 430,345 500,335 C 570,325 630,302 700,290 C 770,278 830,238 900,220"
                        fill="none"
                        stroke="#1F4B3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {[
                        [100, 410, '-20'],
                        [300, 370, '+15'],
                        [500, 335, '+35'],
                        [700, 290, '+58'],
                        [900, 220, '+92'],
                      ].map(([x, y, value]) => (
                        <g key={String(x)}>
                          <circle cx={Number(x)} cy={Number(y)} r="3.5" fill="#1F4B3C" stroke="#FFFEFA" strokeWidth="1.5" />
                          <text x={Number(x)} y={Number(y) - 10} textAnchor="middle" fill="#1F4B3C" fontSize="9" fontWeight="700">{value}</text>
                        </g>
                      ))}

                      {pchipSegments([100, 300, 500, 700, 900], [388, 354, 321, 292, 269]).map((segment, index) => (
                        <path
                          key={segment}
                          d={segment}
                          fill="none"
                          stroke={['#A8A8A8', '#737373', '#404040', '#111111'][index]}
                          strokeWidth="4"
                          strokeDasharray="5 6"
                          strokeLinecap="butt"
                        />
                      ))}
                      {[
                        [100, 388, '1×', 377, '#B8B8B8'],
                        [300, 354, '3×', 343, '#8A8A8A'],
                        [500, 321, '5×', 310, '#595959'],
                        [700, 292, '7×', 310, '#303030'],
                        [900, 269, '9×', 258, '#111111'],
                      ].map(([x, y, value, labelY, tone]) => (
                        <g key={String(x)}>
                          <rect x={Number(x) - 4.5} y={Number(y) - 4.5} width="9" height="9" rx="1.5" fill={String(tone)} stroke="#FFFEFA" strokeWidth="2" />
                          <text x={Number(x)} y={Number(labelY)} textAnchor="middle" fill={String(tone)} fontSize="9" fontWeight="700">{value}</text>
                        </g>
                      ))}

                      <path
                        d="M 100,208 C 170,208 230,232 300,239 C 370,246 430,275 500,278 C 570,281 630,254 700,255 C 770,256 830,292 900,301"
                        fill="none"
                        stroke="#C24D3A"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                      />
                      {[
                        [100, 208, '85%'],
                        [300, 239, '65%'],
                        [500, 278, '40%'],
                        [700, 255, '55%'],
                        [900, 301, '25%'],
                      ].map(([x, y, value]) => (
                        <g key={String(x)}>
                          <circle cx={Number(x)} cy={Number(y)} r="3.5" fill="#C24D3A" stroke="#FFFEFA" strokeWidth="2" />
                          <text x={Number(x)} y={Number(y) - 10} textAnchor="middle" fill="#A43F30" fontSize="9" fontWeight="700">{value}</text>
                        </g>
                      ))}

                      <text x="20" y="432" fill="#7C4C55" fontSize="8.5" fontWeight="700" letterSpacing="1.2">
                        SECURITY MATURITY MILESTONES
                      </text>
                      <line x1="100" y1="450" x2="900" y2="450" stroke="#8D5A63" strokeOpacity="0.28" strokeWidth="2" />
                      {[
                        'Prototype',
                        'Permissions',
                        'Audit trail',
                        'Controls',
                        'SOC 2 readiness',
                      ].map((milestone, index) => {
                        const x = [100, 300, 500, 700, 900][index];
                        return (
                          <g key={milestone}>
                            <circle cx={x} cy="450" r={8 + index * 1.2} fill="#8D5A63" opacity={0.4 + index * 0.13} />
                            <text x={x} y="453.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="monospace">0{index + 1}</text>
                            <foreignObject x={x - 65} y="467" width="130" height="30">
                              <div className="text-center text-[9px] font-semibold leading-4 text-[#68424A]">{milestone}</div>
                            </foreignObject>
                          </g>
                        );
                      })}

                      <text x="20" y="510" fill="#223C33" fillOpacity="0.36" fontSize="8" fontWeight="700" letterSpacing="1.2">
                        RELATIVE ECONOMIC PROGRESSION
                      </text>
                      <text x="980" y="510" textAnchor="end" fill="#223C33" fillOpacity="0.36" fontSize="8" fontWeight="700" letterSpacing="1.2">
                        TIME →
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="grid border-t border-[#223C33]/10 sm:grid-cols-5">
                  {[
                    ['01', 'Launch Core', 'Prove $99/month recurring use while the $2,000 setup funds high-touch onboarding.'],
                    ['02', 'Open Premium', 'Increase monthly price 50%. Introduce a setup fee, but waive it for early trade-expert trials and feedback.'],
                    ['03', 'Codify value', 'Keep Core and Premium subscriptions growing while expert verification creates defensible deliverables.'],
                    ['04', 'Trial Maximum', 'Project-management trials raise token usage and service effort; developer hiring creates a temporary cost spike.'],
                    ['05', 'Sell full price', 'Productize Maximum at $399/month plus larger setup fees while Core and Premium continue compounding.'],
                  ].map(([number, title, description], index) => (
                    <div
                      key={number}
                      className={`border-[#223C33]/10 p-5 sm:border-r sm:last:border-r-0 ${
                        index === 4 ? 'bg-[#223C33] text-white' : 'border-b last:border-b-0 sm:border-b-0'
                      }`}
                    >
                      <p className={`font-mono text-[10px] ${index === 4 ? 'text-[#D8B56A]' : 'text-[#997022]'}`}>{number}</p>
                      <p className="mt-4 text-sm font-semibold">{title}</p>
                      <p className={`mt-2 text-xs leading-5 ${index === 4 ? 'text-white/55' : 'text-[#223C33]/52'}`}>{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="gates" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="07"
                eyebrow="Commercial gates"
                title="Move upmarket only when the prior market has taught us enough."
                description="The trade-expert, midsize, and enterprise gates require evidence across customers, product capability, revenue, delivery, and economics."
              />
              <div className="mt-10 overflow-x-auto rounded-3xl border border-[#223C33]/12 bg-white/60">
                <div className="min-w-[780px]">
                  <div className="grid grid-cols-[150px_repeat(3,1fr)] bg-[#223C33] px-6 py-4 text-[9px] uppercase tracking-[0.15em] text-white/55">
                    <span>Category</span><span>Trade-expert gate</span><span>Midsize workflow gate</span><span>Enterprise gate</span>
                  </div>
                  {[
                    ['Customers', 'Sticky trade users + committed SME partners', 'Midsize firms using repeatable workflows', 'Enterprise buyers with action-ready use cases'],
                    ['Product', 'Reasoning works + verified document baseline', 'JasonAI + Clara + project-system integration', 'Agentic workflows + security controls'],
                    ['Revenue', '$99 base validated + next agent tier priced', 'Setup + recurring duo + paid expansion', 'Enterprise contracts + implementation'],
                    ['Delivery', 'Founder-led onboarding + regular SME feedback', 'Standardized setup + one free integration', 'Controlled enterprise implementation'],
                    ['Economics', 'Willingness to pay + recurring use', 'Positive margin + valuable integration learning', 'Earnings fund developers, SOC 2, and security'],
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
                  ['Trade gate complete', 'JasonAI has sticky paying users, trusted SME partners, a verified document baseline, and evidence for the next agent price.'],
                  ['Midsize gate complete', 'JasonAI and Clara support repeatable workflows, one integration reveals project structure, and customers pay for expansion.'],
                  ['Enterprise begins', 'JasonAI can safely read and update connected systems through custom workflows, with revenue available to fund security and SOC 2.'],
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
                  <div className="rounded-2xl border border-[#D8B56A]/35 bg-[#DCE6E0] p-5 text-[#223C33]">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#223C33] text-[#D8B56A]">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <p className="mt-5 text-sm font-semibold">Ask</p>
                    <p className="mt-2 text-[11px] leading-5 text-[#223C33]/58">User requests through WhatsApp</p>
                  </div>
                  {[
                    ['01', 'Understand', 'Assistant identifies intent'],
                    ['02', 'Retrieve', 'Project + contract context'],
                    ['03', 'Select', 'Correct document skill'],
                    ['04', 'Draft', 'Structured update generated'],
                    ['05', 'Approve', 'User reviews or approves'],
                    ['06', 'Act', 'Save, share, or trigger next action'],
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
                  const isCeo = index === 0;
                  return (
                    <div key={item.role} className={`rounded-3xl border p-7 ${
                      isCeo
                        ? 'border-black bg-black text-white'
                        : index === 1
                          ? 'border-[#B68124]/35 bg-[#D8B56A]/14'
                          : 'border-[#223C33]/12 bg-white/55'
                    }`}>
                      <div className="flex items-center justify-between">
                        <Icon className={`h-5 w-5 ${isCeo ? 'text-[#D8B56A]' : 'text-[#997022]'}`} />
                        <span className={`font-mono text-xs ${isCeo ? 'text-white/40' : 'text-[#223C33]/38'}`}>0{index + 1}</span>
                      </div>
                      <h3 className="mt-10 text-3xl font-medium tracking-[-0.04em]">{item.role}</h3>
                      <p className="mt-4 text-sm font-semibold leading-6">{item.owns}</p>
                      <p className={`mt-5 border-t pt-5 text-sm leading-6 ${
                        isCeo ? 'border-white/15 text-white/60' : 'border-[#223C33]/10 text-[#223C33]/55'
                      }`}>{item.action}</p>
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
                eyebrow="Five-phase diligence plan"
                title="Invest. Validate. Prove. Scale. Expand."
                description="B2W follows the JasonAI J-curve. Each phase advances only when pricing, product, and customer-success evidence supports the next level of investment."
              />
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    number: '01',
                    curve: 'Invest',
                    label: 'Foundation',
                    period: 'Aug–Oct 2026',
                    objective: 'Deliver useful output fast enough to earn payment.',
                    checks: ['Prove willingness to pay', 'Reach useful output quickly'],
                  },
                  {
                    number: '02',
                    curve: 'Validate',
                    label: 'Validation',
                    period: 'Nov 2026–Jan 2027',
                    objective: 'Retain active teams and prove measurable value.',
                    checks: ['Convert pilots to paid', 'Verify retention and time saved'],
                  },
                  {
                    number: '03',
                    curve: 'Prove',
                    label: 'Inflection',
                    period: 'Feb–Jul 2027',
                    objective: 'Use customer-confirmed ROI to support pricing and retention.',
                    checks: ['Confirm eight-week retention', 'Package evidence for sales'],
                  },
                  {
                    number: '04',
                    curve: 'Scale',
                    label: 'Scale',
                    period: 'Aug 2027–Jan 2028',
                    objective: 'Repeat acquisition, onboarding, and retention efficiently.',
                    checks: ['Protect acquisition economics', 'Standardize reliable delivery'],
                  },
                  {
                    number: '05',
                    curve: 'Expand',
                    label: 'Platform',
                    period: 'Feb–Jul 2028',
                    objective: 'Expand customer usage and spend across trusted workflows.',
                    checks: ['Grow multi-workflow adoption', 'Increase retained revenue'],
                  },
                ].map((phase, index) => {
                  const isDark = index === 0 || index === 4;
                  return (
                  <div key={phase.number} className={`rounded-3xl border p-6 ${
                    isDark
                      ? 'border-[#223C33] bg-[#223C33] text-white'
                      : index === 2
                        ? 'border-[#B68124]/25 bg-[#D8B56A]/14'
                        : index === 3
                          ? 'border-[#527764]/22 bg-[#DCE6E0]'
                          : 'border-[#223C33]/12 bg-white/55'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[9px] ${isDark ? 'text-[#D8B56A]' : 'text-[#997022]'}`}>
                        Phase {phase.number}
                      </span>
                      <Clock3 className={`h-4 w-4 ${isDark ? 'text-[#D8B56A]' : 'text-[#997022]'}`} />
                    </div>
                    <p className={`mt-8 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                      isDark ? 'text-[#D8B56A]' : 'text-[#997022]'
                    }`}>
                      {phase.curve}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-[-0.03em]">{phase.label}</h3>
                    <p className={`mt-2 font-mono text-[8px] ${isDark ? 'text-white/35' : 'text-[#223C33]/38'}`}>
                      {phase.period}
                    </p>
                    <p className={`mt-5 text-xs leading-5 ${isDark ? 'text-white/58' : 'text-[#223C33]/58'}`}>
                      {phase.objective}
                    </p>
                    <div className={`mt-6 space-y-3 border-t pt-5 ${isDark ? 'border-white/12' : 'border-[#223C33]/10'}`}>
                      {phase.checks.map((item) => (
                        <p key={item} className={`flex gap-2 text-[11px] leading-5 ${isDark ? 'text-white/55' : 'text-[#223C33]/55'}`}>
                          <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isDark ? 'text-[#D8B56A]' : 'text-[#527764]'}`} />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  );
                })}
              </div>
              <blockquote className="mt-10 rounded-3xl bg-[#D8B56A]/18 p-7 text-2xl font-medium leading-9 tracking-[-0.03em] text-[#223C33] sm:p-9 sm:text-3xl sm:leading-10">
                “Does this help B2W deliver a valuable customer outcome more reliably, repeatedly, or profitably?”
              </blockquote>
            </section>

            <section id="tracker" className="scroll-mt-24 border-t border-[#223C33]/12 py-20 sm:py-28">
              <SectionHeader
                number="12"
                eyebrow="Supporting execution tracker"
                title={isServices ? 'Turn the operating map into owned, measurable work.' : 'Turn the strategy into owned, measurable work.'}
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
                <p className="mt-1 text-[10px] text-[#223C33]/42">
                  {isServices ? 'Private operating map · direction, ownership, and execution' : 'Private executive strategy system'}
                </p>
              </div>
              {isServices ? (
                <Link
                  to="/internal"
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/55 px-4 text-xs font-semibold text-[#223C33] transition hover:bg-white"
                >
                  Return to internal
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onLock}
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#223C33]/15 bg-white/55 px-4 text-xs font-semibold text-[#223C33] transition hover:bg-white"
                >
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Lock strategy
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default function B2WExecutiveStrategyPage({
  mode = 'strategy',
}: {
  mode?: 'strategy' | 'services';
}) {
  const [authState, setAuthState] = useState<'checking' | 'locked' | 'authenticated'>('checking');
  const isServices = mode === 'services';

  useEffect(() => {
    if (isServices) {
      return;
    }

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
  }, [isServices]);

  if (isServices) {
    return <StrategyWorkspace mode="services" />;
  }

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
      mode="strategy"
      onLock={() => {
        void fetch('/api/executive-strategy?scope=b2w&action=logout', {
          method: 'POST',
          credentials: 'same-origin',
        }).finally(() => setAuthState('locked'));
      }}
    />
  );
}
