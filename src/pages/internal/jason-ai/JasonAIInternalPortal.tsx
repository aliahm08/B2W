import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  HardHat,
  PackageCheck,
  Pencil,
  Target,
  TrendingUp,
  UsersRound,
  X,
} from 'lucide-react';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import {
  projectPageHeaderClassName,
  projectPageSectionTitleClassName,
  projectPageShellClassName,
} from '../../../components/projectPageLayout';
import { JasonAIInternalNavbar } from './shared';

type ExecutiveRole = 'CEO' | 'COO' | 'CTO';
type KpiType = 'pricing' | 'product' | 'success';

type Kpi = {
  id: KpiType;
  label: string;
  owner: ExecutiveRole;
  minimum: string;
  target: string;
  tasks: string[];
};

type Phase = {
  id: string;
  number: string;
  label: string;
  period: string;
  objective: string;
  pricingMinimum: string;
  pricingTarget: string;
  curveLabel: string;
  point: { x: number; y: number };
  kpis: Kpi[];
};

type TaskReport = {
  completed: boolean;
  quantity: string;
  unit: string;
  result: string;
  plan: string;
};

type KpiReport = {
  currentResult: string;
};

type SelectedTask = {
  phaseId: string;
  kpiId: KpiType;
  taskIndex: number;
};

const trackingStorageKey = 'jasonai-executive-strategy-tracking-v1';

const phases: Phase[] = [
  {
    id: 'foundation',
    number: '01',
    label: 'Foundation',
    period: 'Aug–Oct 2026',
    objective: 'Deliver useful output fast enough to earn payment.',
    pricingMinimum: '3 pilot customers agree to pay',
    pricingTarget: '5 customers at $10–$25 per month',
    curveLabel: 'Invest',
    point: { x: 38, y: 48 },
    kpis: [
      {
        id: 'pricing',
        label: 'Customers willing to pay',
        owner: 'CEO',
        minimum: '3 pilot customers agree to pay after seeing JasonAI work.',
        target: '5 customers willing to pay $10–$25 per month.',
        tasks: [
          'Recruit five qualified pilot teams.',
          'Run pricing interviews after live demonstrations.',
          'Document objections and payment commitments.',
          'Select the initial paid package and contract terms.',
        ],
      },
      {
        id: 'product',
        label: 'Useful-output rate',
        owner: 'CTO',
        minimum: '80% of reviewed outputs are useful.',
        target: '90% require little or no correction.',
        tasks: [
          'Define a consistent output-review rubric.',
          'Instrument summary quality and correction rates.',
          'Resolve the highest-frequency failure cases.',
          'Verify privacy boundaries and audit logging.',
        ],
      },
      {
        id: 'success',
        label: 'Time to first value',
        owner: 'COO',
        minimum: 'Useful output within 15 minutes of onboarding.',
        target: 'Useful output within 5 minutes.',
        tasks: [
          'Create the onboarding checklist.',
          'Measure setup time for every pilot.',
          'Remove avoidable onboarding steps.',
          'Collect first-session feedback from each team.',
        ],
      },
    ],
  },
  {
    id: 'validation',
    number: '02',
    label: 'Validation',
    period: 'Nov 2026–Jan 2027',
    objective: 'Retain teams and prove measurable value.',
    pricingMinimum: '30% pilot-to-paid conversion',
    pricingTarget: '50% pilot-to-paid conversion',
    curveLabel: 'Validate',
    point: { x: 135, y: 132 },
    kpis: [
      {
        id: 'pricing',
        label: 'Pilot-to-paid conversion',
        owner: 'CEO',
        minimum: '30% of completed pilots convert to paid plans.',
        target: 'At least 50% convert to paid plans.',
        tasks: [
          'Define the pilot exit and conversion process.',
          'Present ROI evidence before each pilot ends.',
          'Test monthly and annual purchase options.',
          'Review lost conversions and revise positioning.',
        ],
      },
      {
        id: 'product',
        label: 'Four-week team retention',
        owner: 'CTO',
        minimum: '50% of activated teams remain meaningfully active.',
        target: '65% remain active after four weeks.',
        tasks: [
          'Define meaningful weekly activity.',
          'Build four-week cohort reporting.',
          'Add reminders and action-item follow-up.',
          'Prioritize features linked to repeat usage.',
        ],
      },
      {
        id: 'success',
        label: 'Verified hours saved',
        owner: 'COO',
        minimum: '1 confirmed hour saved per active team each week.',
        target: 'At least 2 confirmed hours saved weekly.',
        tasks: [
          'Establish the baseline workflow time.',
          'Conduct weekly customer value check-ins.',
          'Validate time-saved calculations with owners.',
          'Publish a concise pilot outcome report.',
        ],
      },
    ],
  },
  {
    id: 'inflection',
    number: '03',
    label: 'Inflection',
    period: 'Feb–Jul 2027',
    objective: 'Use proven ROI to support pricing and retention.',
    pricingMinimum: '$40 average revenue per team',
    pricingTarget: '$75 average revenue per team',
    curveLabel: 'Prove',
    point: { x: 236, y: 92 },
    kpis: [
      {
        id: 'pricing',
        label: 'Average revenue per team',
        owner: 'CEO',
        minimum: 'Average monthly revenue reaches $40 per team.',
        target: 'Average monthly revenue reaches $75 per team.',
        tasks: [
          'Introduce tiered pricing tied to value delivered.',
          'Test workflow and usage-based expansion offers.',
          'Track discounting and realized revenue.',
          'Package customer ROI evidence for sales.',
        ],
      },
      {
        id: 'product',
        label: 'Eight-week team retention',
        owner: 'CTO',
        minimum: '60% of activated teams remain active.',
        target: '75% remain active after eight weeks.',
        tasks: [
          'Develop eight-week retention cohorts.',
          'Launch the owner dashboard and ROI tracking.',
          'Automate recurring follow-up workflows.',
          'Improve context reliability across longer histories.',
        ],
      },
      {
        id: 'success',
        label: 'Customer-confirmed ROI',
        owner: 'COO',
        minimum: '70% report clear, measurable business value.',
        target: '85% confirm measurable ROI.',
        tasks: [
          'Standardize the customer ROI review.',
          'Identify low-value accounts early.',
          'Create intervention plans for at-risk teams.',
          'Develop customer proof points and case studies.',
        ],
      },
    ],
  },
  {
    id: 'scale',
    number: '04',
    label: 'Scale',
    period: 'Aug 2027–Jan 2028',
    objective: 'Repeat acquisition, onboarding, and retention efficiently.',
    pricingMinimum: 'LTV:CAC of at least 3×',
    pricingTarget: 'LTV:CAC of at least 4×',
    curveLabel: 'Scale',
    point: { x: 326, y: 50 },
    kpis: [
      {
        id: 'pricing',
        label: 'LTV:CAC',
        owner: 'CEO',
        minimum: 'Estimated lifetime value is at least 3× acquisition cost.',
        target: 'LTV:CAC reaches at least 4×.',
        tasks: [
          'Measure acquisition cost by channel.',
          'Establish a reliable lifetime-value model.',
          'Scale only channels meeting efficiency gates.',
          'Launch referral and partner programs.',
        ],
      },
      {
        id: 'product',
        label: 'Weekly active teams',
        owner: 'CTO',
        minimum: '80% of paying teams use a meaningful capability weekly.',
        target: 'At least 90% are meaningfully active weekly.',
        tasks: [
          'Build self-service onboarding.',
          'Release reusable vertical templates.',
          'Instrument meaningful capability usage.',
          'Improve reliability under increased volume.',
        ],
      },
      {
        id: 'success',
        label: 'Monthly logo churn',
        owner: 'COO',
        minimum: 'Monthly churn remains below 4%.',
        target: 'Monthly churn remains below 3%.',
        tasks: [
          'Implement account-health monitoring.',
          'Create churn-risk playbooks.',
          'Run recurring business reviews.',
          'Document and address cancellation causes.',
        ],
      },
    ],
  },
  {
    id: 'platform',
    number: '05',
    label: 'Platform',
    period: 'Feb–Jul 2028',
    objective: 'Expand customer usage and spend over time.',
    pricingMinimum: '110% net revenue retention',
    pricingTarget: '120% net revenue retention',
    curveLabel: 'Expand',
    point: { x: 410, y: 20 },
    kpis: [
      {
        id: 'pricing',
        label: 'Net revenue retention',
        owner: 'CEO',
        minimum: 'Existing-customer revenue reaches 110% annually.',
        target: 'Net revenue retention reaches 120%.',
        tasks: [
          'Define expansion pricing for integrations and agents.',
          'Create account-level expansion forecasts.',
          'Develop enterprise and partner packaging.',
          'Review expansion, contraction, and churn monthly.',
        ],
      },
      {
        id: 'product',
        label: 'Multi-workflow adoption',
        owner: 'CTO',
        minimum: '50% of active customers use at least two workflows.',
        target: '70% use two or more workflows.',
        tasks: [
          'Launch modular workflow agents.',
          'Add integrations for email, calendars, documents, and CRMs.',
          'Maintain shared context and permission controls.',
          'Track adoption by workflow and account.',
        ],
      },
      {
        id: 'success',
        label: 'Customer ROI score',
        owner: 'COO',
        minimum: 'Average customer health and ROI score reaches 85/100.',
        target: 'Average score reaches at least 90/100.',
        tasks: [
          'Operationalize a customer ROI scorecard.',
          'Benchmark performance by customer segment.',
          'Create expansion plans from workflow gaps.',
          'Publish executive value reports for customers.',
        ],
      },
    ],
  },
];

const kpiIconMap = {
  pricing: CircleDollarSign,
  product: PackageCheck,
  success: TrendingUp,
} satisfies Record<KpiType, typeof Target>;

const kpiToneMap = {
  pricing: 'border-amber-300 bg-amber-50 text-amber-800',
  product: 'border-sky-300 bg-sky-50 text-sky-800',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
} satisfies Record<KpiType, string>;

const getTaskId = (phaseId: string, kpiId: KpiType, taskIndex: number) =>
  `${phaseId}:${kpiId}:${taskIndex}`;

const getKpiId = (phaseId: string, kpiId: KpiType) => `${phaseId}:${kpiId}`;

const createSuggestedPlan = (task: string, owner: ExecutiveRole) =>
  [
    `1. ${owner} confirms the owner, deadline, and evidence required.`,
    `2. Execute: ${task}`,
    '3. Record the measurable result and attach the supporting context.',
    '4. Review progress at the next weekly strategy check-in.',
  ].join('\n');

const getDefaultTaskReport = (task: string, owner: ExecutiveRole): TaskReport => ({
  completed: false,
  quantity: '',
  unit: '',
  result: '',
  plan: createSuggestedPlan(task, owner),
});

const strategyCurvePath =
  'M38 48 C76 62 92 132 135 132 C190 132 201 109 236 92 C277 72 294 60 326 50 C359 39 385 27 410 20';
const strategyStartTimestamp = Date.UTC(2026, 7, 1);
const strategyEndTimestamp = Date.UTC(2028, 7, 1);

function InteractiveJCurve({
  activePhase,
  onSelect,
  getPhaseProgress,
}: {
  activePhase: Phase;
  onSelect: (phaseId: string) => void;
  getPhaseProgress: (phaseId: string) => number;
}) {
  const curvePathRef = useRef<SVGPathElement>(null);
  const [today] = useState(() => new Date());
  const todayTimestamp = today.getTime();
  const strategyHasStarted = todayTimestamp >= strategyStartTimestamp;
  const strategyIsComplete = todayTimestamp >= strategyEndTimestamp;
  const strategyProgress = Math.min(
    1,
    Math.max(0, (todayTimestamp - strategyStartTimestamp) / (strategyEndTimestamp - strategyStartTimestamp)),
  );
  const daysUntilStart = Math.max(0, Math.ceil((strategyStartTimestamp - todayTimestamp) / 86_400_000));
  const [todayPoint, setTodayPoint] = useState(phases[0].point);
  const todayLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(today);
  const progressStatus = strategyIsComplete
    ? 'Strategy horizon complete'
    : strategyHasStarted
      ? `${Math.round(strategyProgress * 100)}% through the strategy horizon`
      : `Pre-start · ${daysUntilStart} ${daysUntilStart === 1 ? 'day' : 'days'} to Phase 01`;
  const todayMarkerY = Math.max(18, todayPoint.y - 30);

  useEffect(() => {
    const path = curvePathRef.current;
    if (!path) return;

    const point = path.getPointAtLength(path.getTotalLength() * strategyProgress);
    setTodayPoint({ x: point.x, y: point.y });
  }, [strategyProgress]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-white">Today · {todayLabel}</span>
        <span className="text-[9px] uppercase tracking-[0.14em] text-emerald-300">{progressStatus}</span>
      </div>
      <div className="relative">
        <svg viewBox="0 0 450 185" aria-hidden="true" className="pointer-events-none block h-auto w-full">
          <line x1="24" y1="78" x2="426" y2="78" stroke="rgba(255,255,255,.16)" strokeDasharray="5 5" />
          <path
            ref={curvePathRef}
            d={strategyCurvePath}
            fill="none"
            stroke="#6ee7b7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {phases.map((phase) => {
            const active = phase.id === activePhase.id;
            return (
              <text
                key={phase.id}
                x={phase.point.x}
                y={phase.point.y + (phase.point.y > 105 ? 28 : -18)}
                fill={active ? '#ffffff' : 'rgba(255,255,255,.48)'}
                fontSize="9"
                textAnchor="middle"
              >
                {phase.curveLabel.toUpperCase()}
              </text>
            );
          })}
          <line
            x1={todayPoint.x}
            y1={todayMarkerY + 7}
            x2={todayPoint.x}
            y2="78"
            stroke="#f87171"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
          <circle cx={todayPoint.x} cy={todayMarkerY} r="7" fill="#f87171" stroke="white" strokeWidth="2" />
          <text
            x={todayPoint.x}
            y={todayMarkerY - 11}
            fill="#f87171"
            fontSize="8"
            fontWeight="700"
            textAnchor="middle"
          >
            TODAY
          </text>
          <text x="24" y="178" fill="rgba(255,255,255,.4)" fontSize="9">AUG 2026</text>
          <text x="378" y="178" fill="rgba(255,255,255,.4)" fontSize="9">JUL 2028</text>
        </svg>
        {phases.map((phase) => {
          const active = phase.id === activePhase.id;
          const phaseProgress = getPhaseProgress(phase.id);
          return (
            <button
              key={phase.id}
              type="button"
              aria-label={`Show phase ${phase.number}: ${phase.label}`}
              aria-pressed={active}
              title={`${phase.label}: ${phaseProgress}% complete`}
              onClick={() => onSelect(phase.id)}
              className={`absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-[3px] text-[10px] font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-300 sm:h-9 sm:w-9 ${
                active ? 'ring-2 ring-white' : ''
              }`}
              style={{
                left: `${(phase.point.x / 450) * 100}%`,
                top: `${(phase.point.y / 185) * 100}%`,
                background: `conic-gradient(#6ee7b7 ${phaseProgress * 3.6}deg, #404040 0deg)`,
              }}
            >
              <span className={`flex h-full w-full items-center justify-center rounded-full ${active ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'}`}>
                {phase.number}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function JasonAIInternalPortal() {
  const strategyRef = useRef<HTMLElement>(null);
  const [activePhaseId, setActivePhaseId] = useState(phases[0].id);
  const [selectedKpiId, setSelectedKpiId] = useState<KpiType>('pricing');
  const activePhase = phases.find((phase) => phase.id === activePhaseId) ?? phases[0];
  const selectedKpi = activePhase.kpis.find((kpi) => kpi.id === selectedKpiId) ?? activePhase.kpis[0];
  const SelectedKpiIcon = kpiIconMap[selectedKpi.id];

  useEffect(() => {
    if (window.location.hash === '#j-curve') {
      window.requestAnimationFrame(() => strategyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      return;
    }
    window.scrollTo(0, 0);
  }, []);

  const selectPhase = (phaseId: string) => {
    setActivePhaseId(phaseId);
  };

  const scrollToStrategy = () => {
    strategyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className={projectPageShellClassName}>
      <JasonAIInternalNavbar />
      <Seo
        title="JasonAI Executive Strategy"
        description="JasonAI 24-month roadmap for helping SMB general-contractor owners create measurable value from their business communication."
        robots="noindex, nofollow"
      />

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className={projectPageHeaderClassName}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                  JasonAI Executive Strategy
                </p>
                <h1 className="max-w-[12ch] text-[2.65rem] font-medium leading-[.96] tracking-[-0.045em] text-black sm:text-6xl">
                  The AI Assistant
                  <span className="mt-2 block text-neutral-400">for Business Owners</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  JasonAI helps owners of SMB general contractors turn everyday WhatsApp communication into useful summaries, visible follow-ups, and measurable time and business value.
                </p>
              </div>

              {[
                ['Target Customer', 'SMB General Contractors'],
                ['Primary User', 'Project Group Chats'],
                ['Product', 'WhatsApp AI Assistant'],
                ['Strategy Horizon', 'Aug 2026 – Jul 2028'],
              ].map(([label, value]) => (
                <div key={label} className="border border-neutral-200 bg-white p-4 text-sm leading-6">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">{label}</span>
                  <span className="mt-2 block font-medium text-black">{value}</span>
                </div>
              ))}
            </div>

            <aside className="flex flex-col border border-neutral-900 bg-neutral-950 p-6 text-white sm:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">24-Month Roadmap</p>
              <h2 className="mt-4 text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                Build customer value before scaling the platform.
              </h2>
              <p className="mt-5 text-sm leading-6 text-neutral-300">
                The strategy follows a five-phase J-curve: earn the first payment, retain active teams, prove owner-confirmed ROI, scale efficiently, then expand customer usage.
              </p>

              <div className="my-6 border-y border-white/10 py-5">
                {[
                  'Five phase gates over 24 months',
                  'CEO, CTO, and COO accountability',
                  'Pricing, product, and success KPIs',
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-3 py-2 text-sm text-neutral-200">
                    <span className="mt-0.5 font-mono text-[10px] text-emerald-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={scrollToStrategy}
                className="group mt-auto inline-flex min-h-12 items-center justify-between rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/10"
              >
                Explore Goals &amp; KPIs
                <ArrowRight className="h-4 w-4 rotate-90 transition-transform group-hover:translate-y-1" />
              </button>
            </aside>
          </div>
        </header>

        <main>
          <section id="j-curve" ref={strategyRef} className="scroll-mt-24">
            <div className="mb-7 flex flex-col gap-4 border-b border-neutral-100 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">Static Strategy Dashboard</p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight text-black md:text-4xl">The JasonAI J-curve.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                  Select a point or phase card to inspect its pricing, product, and customer-success gates.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500">
                <HardHat className="h-4 w-4" />
                Built for general-contractor owners
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
              <div className="border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-7">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Interactive operating path</p>
                <div className="mt-5">
                  <InteractiveJCurve activePhase={activePhase} onSelect={selectPhase} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.aside
                  key={activePhase.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="border border-neutral-200 bg-white p-5 sm:p-6"
                >
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                    Phase {activePhase.number} · {activePhase.period}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight text-black">{activePhase.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{activePhase.objective}</p>
                  <div className="mt-6 space-y-4 border-t border-neutral-100 pt-5">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Minimum pricing gate</p>
                      <p className="mt-2 text-xs font-medium leading-5 text-neutral-800">{activePhase.pricingMinimum}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Target</p>
                      <p className="mt-2 text-xs font-medium leading-5 text-emerald-800">{activePhase.pricingTarget}</p>
                    </div>
                  </div>
                </motion.aside>
              </AnimatePresence>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {phases.map((phase) => {
                const active = phase.id === activePhase.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => selectPhase(phase.id)}
                    aria-pressed={active}
                    className={`min-h-full border p-4 text-left transition ${
                      active ? 'border-black bg-neutral-950 text-white' : 'border-neutral-200 bg-white hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-[10px] ${active ? 'text-emerald-300' : 'text-neutral-400'}`}>{phase.number}</span>
                      <span className={`text-[9px] uppercase tracking-[0.16em] ${active ? 'text-neutral-400' : 'text-neutral-400'}`}>{phase.period}</span>
                    </div>
                    <h3 className="mt-4 text-base font-medium">{phase.label}</h3>
                    <p className={`mt-2 text-xs leading-5 ${active ? 'text-neutral-400' : 'text-neutral-500'}`}>{phase.objective}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-12 border-t border-neutral-100 pt-10 md:mt-16 md:pt-12">
            <div className="mb-7 flex items-center gap-3">
              <div className="border border-neutral-200 p-2">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                  Phase {activePhase.number} stage gates
                </p>
                <h2 className={projectPageSectionTitleClassName}>{activePhase.label} KPI Dashboard</h2>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(240px,.38fr)_minmax(0,1fr)]">
              <div className="grid content-start gap-3">
                {activePhase.kpis.map((kpi) => {
                  const Icon = kpiIconMap[kpi.id];
                  const selected = selectedKpi.id === kpi.id;
                  return (
                    <button
                      key={kpi.id}
                      type="button"
                      onClick={() => setSelectedKpiId(kpi.id)}
                      aria-pressed={selected}
                      aria-controls="selected-kpi-details"
                      className={`flex w-full items-center gap-4 border p-4 text-left transition sm:p-5 ${
                        selected
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-white/20 bg-white/10 text-emerald-300' : kpiToneMap[kpi.id]
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-[10px] font-mono uppercase tracking-[0.22em] ${selected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                          {kpi.id}
                        </span>
                        <span className="mt-1 block text-sm font-medium leading-5">{kpi.label}</span>
                      </span>
                      <ArrowRight className={`ml-auto h-4 w-4 shrink-0 ${selected ? 'text-emerald-300' : 'text-neutral-300'}`} />
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.article
                  id="selected-kpi-details"
                  key={`${activePhase.id}-${selectedKpi.id}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="border border-neutral-200 bg-white"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                    <div>
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${kpiToneMap[selectedKpi.id]}`}>
                        <SelectedKpiIcon className="h-5 w-5" />
                      </div>
                      <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">{selectedKpi.id}</p>
                      <h3 className="mt-2 text-2xl font-medium tracking-tight text-black">{selectedKpi.label}</h3>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Owner</p>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-semibold text-neutral-700">
                        <UsersRound className="h-3 w-3" />
                        {selectedKpi.owner}
                      </span>
                    </div>
                  </div>

                  <div className="grid border-t border-neutral-100 sm:grid-cols-2">
                    <div className="border-b border-neutral-100 p-5 sm:border-b-0 sm:border-r sm:p-7">
                      <div className="border-l-2 border-neutral-300 pl-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Minimum gate</p>
                        <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{selectedKpi.minimum}</p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-7">
                      <div className="border-l-2 border-emerald-400 pl-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Target</p>
                        <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{selectedKpi.target}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 bg-neutral-950 p-5 text-white sm:p-7">
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">Key tasks</p>
                    <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {selectedKpi.tasks.map((task) => (
                        <div key={task} className="flex items-start gap-2.5 text-xs leading-5 text-neutral-300">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </section>
        </main>
      </motion.div>
      <Footer />
    </article>
  );
}
