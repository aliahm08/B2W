import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronDown,
  CircleAlert,
  DatabaseZap,
  FileText,
  FolderOpen,
  Mail,
  MessageCircle,
  Mic,
  RadioTower,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import Seo from '../components/Seo';
import Footer from '../components/Footer';
import ClientNavbar, { type ClientNavAction } from '../components/ClientNavbar';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageSectionTitleClassName,
  projectPageShellClassName,
} from '../components/projectPageLayout';

type PlatformCanvasMode = 'canvas' | 'risk' | 'clara';

const platformObjectives = [
  {
    id: 'canvas',
    label: 'Organize every file on the canvas',
    to: '#platform-canvas',
  },
  {
    id: 'risk',
    label: 'Track risk before it becomes a dispute',
    to: '#risk-tracker',
  },
  {
    id: 'agent',
    label: 'Customize Clara for owner actions',
    to: '#platform-canvas',
  },
] as const;

const platformValueAdds = [
  {
    id: 'risk-control',
    title: 'Control Risk',
    description:
      'The platform turns live communications into connected evidence, owner actions, and risk highlights before work moves out of control.',
    icon: ShieldCheck,
    cardClassName: 'border-emerald-300',
    iconClassName: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'decision-speed',
    title: 'Move Faster',
    description:
      'OpenClaw assistants keep the backend current while Clara prepares the next best action, draft, or escalation for the Contract Owner.',
    icon: TrendingUp,
    cardClassName: 'border-sky-300',
    iconClassName: 'text-sky-700 bg-sky-50 border-sky-200',
  },
] as const;

const platformModules = [
  {
    id: 'canvas-view',
    title: 'Canvas',
    description:
      'An Obsidian-style network that maps WhatsApp messages, emails, Drive files, events, tasks, and contractual obligations into a living client story.',
    includes: ['Connected node canvas', 'Evidence confidence scores', 'Automatic relationship detection'],
    valueLabel: 'Canvas View',
    valueBody: 'Understand what happened across files, messages, and tasks.',
    cta: 'View Canvas',
  },
  {
    id: 'risk-tracker',
    title: 'Risk Tracker',
    description:
      'A dashboard that highlights unsigned changes, missing evidence, late decisions, owner blockers, and Clara-recommended mitigations.',
    includes: ['Risk severity dashboard', 'Mitigation queue', 'Contract Owner decision log'],
    valueLabel: 'Control View',
    valueBody: 'See where intervention is needed before delivery slips.',
    cta: 'View Risks',
  },
  {
    id: 'clara-dashboard',
    title: 'Clara Dashboard',
    description:
      'A customization dashboard for the Gemma agent that controls client context, model permissions, deliverable tools, and owner approval rules.',
    includes: ['Client memory controls', 'Action permissions', 'Deliverable and task tools'],
    valueLabel: 'Agent View',
    valueBody: 'Tune Clara to query the platform and update the canvas safely.',
    cta: 'Customize Clara',
  },
] as const;

const canvasModeOptions: { id: PlatformCanvasMode; label: string }[] = [
  { id: 'canvas', label: 'Canvas' },
  { id: 'risk', label: 'Risk tracker' },
  { id: 'clara', label: 'Clara customization dashboard' },
];

const ingestRows = [
  {
    source: 'WhatsApp',
    event: 'Scope request detected',
    status: 'Critical',
    owner: 'Contract Owner',
    Icon: MessageCircle,
  },
  {
    source: 'Email',
    event: 'Approval language found',
    status: 'Watch',
    owner: 'Clara',
    Icon: Mail,
  },
  {
    source: 'Drive',
    event: 'Contract clause indexed',
    status: 'Clear',
    owner: 'Legal ops',
    Icon: FolderOpen,
  },
  {
    source: 'Calendar',
    event: 'Review after deadline',
    status: 'Watch',
    owner: 'Project lead',
    Icon: RadioTower,
  },
] as const;

const crmRows = [
  {
    record: 'WhatsApp / Change request',
    source: 'OpenClaw WhatsApp',
    owner: 'Contract Owner',
    risk: 'Critical',
    status: 'Needs approval',
  },
  {
    record: 'Email / Approval language',
    source: 'OpenClaw Email',
    owner: 'Clara',
    risk: 'Watch',
    status: 'Evidence review',
  },
  {
    record: 'Drive / Master agreement',
    source: 'OpenClaw Drive',
    owner: 'Legal ops',
    risk: 'Clear',
    status: 'Indexed',
  },
  {
    record: 'Calendar / Friday review',
    source: 'OpenClaw Calendar',
    owner: 'Project lead',
    risk: 'Watch',
    status: 'Timing risk',
  },
] as const;

const canvasRiskCards = [
  {
    title: 'Unsigned scope change',
    metric: '3 linked records',
    detail: 'WhatsApp request, pricing email, and contract clause converge without signed instruction.',
  },
  {
    title: 'Missing evidence',
    metric: '1 unresolved file',
    detail: 'Client approval email references an attachment that OpenClaw has not found in Drive.',
  },
  {
    title: 'Late decision window',
    metric: '22 hours',
    detail: 'Review event is scheduled after the delivery decision deadline.',
  },
] as const;

const claraDashboardItems = [
  {
    label: 'Client memory',
    value: 'Aster Commercial',
    detail: 'Contract, communication map, approval rules, and delivery playbook loaded.',
  },
  {
    label: 'Canvas permissions',
    value: 'Draft + queue',
    detail: 'Clara can draft updates, create tasks, and queue owner-approved changes.',
  },
  {
    label: 'Deliverable tools',
    value: '4 active',
    detail: 'Estimate builder, owner memo, client response, and change-order packet.',
  },
  {
    label: 'Risk policy',
    value: 'Strict',
    detail: 'Escalate missing evidence, unsigned work, late approvals, and source conflicts.',
  },
] as const;

const claraChatSuggestions = [
  'Show me risks created by the last WhatsApp thread.',
  'Update the missing attachment risk after Drive sync.',
  'Create a task to estimate the new implementation scope.',
] as const;

const deliveryActions = [
  'Owner risk memo',
  'Client response draft',
  'Change-order packet',
  'Decision log update',
] as const;

const riskBars = [
  { label: 'Unsigned scope', value: '82%', className: 'bg-orange-500' },
  { label: 'Missing files', value: '61%', className: 'bg-sky-500' },
  { label: 'Late approvals', value: '47%', className: 'bg-emerald-500' },
] as const;

const qnaItems = [
  {
    id: 'backend' as const,
    title: 'Backend',
    question: 'How does the platform receive data?',
    answer:
      'OpenClaw assistants run inside comms channels and push normalized messages, files, events, tasks, and source metadata into the JasonAI backend.',
  },
  {
    id: 'canvas' as const,
    title: 'Canvas',
    question: 'What is the main screen?',
    answer:
      'The main screen is one canvas. The view dropdown switches it between Canvas, Risk Tracker, and Clara Customization Dashboard while keeping the same comms record model underneath.',
  },
  {
    id: 'agent' as const,
    title: 'Agent',
    question: 'What can Clara do?',
    answer:
      'Clara is a Gemma agent tuned to the client. She can query the story, update risk states, draft deliverables, create tasks, and prepare actions for the Contract Owner.',
  },
  {
    id: 'security' as const,
    title: 'Security',
    question: 'How is control maintained?',
    answer:
      'Clara prepares and executes within scoped permissions. Owner approvals, source citations, and audit records keep the platform accountable.',
  },
] as const;

const copyReveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

const heroReveal = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

function StrategicObjectivesCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platformValueAdds.map((item) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: [0, -4, 0] }}
            viewport={{ once: false, amount: 0.45 }}
            transition={{
              opacity: { duration: 0.45, ease: 'easeOut' },
              y: { duration: 3.6, ease: 'easeInOut', repeat: Infinity },
            }}
            className={`overflow-hidden border bg-white p-5 sm:p-6 ${item.cardClassName}`}
          >
            <motion.div
              whileInView={{ scale: [1, 1.015, 1] }}
              viewport={{ once: false, amount: 0.45 }}
              transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
              className={`mb-4 inline-flex rounded-full border p-3 ${item.iconClassName}`}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-medium tracking-tight text-black sm:text-xl">{item.title}</h2>
              <p className="text-sm leading-6 text-neutral-700">{item.description}</p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function PlatformCanvasVisualization() {
  const [canvasMode, setCanvasMode] = useState<PlatformCanvasMode>('canvas');
  const activeModeLabel = canvasModeOptions.find((mode) => mode.id === canvasMode)?.label ?? 'Canvas';

  return (
    <div id="platform-canvas" className="border border-neutral-900 bg-neutral-950 p-5 text-white md:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300/75">Live Canvas</p>
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">One canvas with switchable app views.</h2>
        </div>
        <label className="grid gap-2 sm:min-w-[310px]">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">View</span>
          <select
            value={canvasMode}
            onChange={(event) => setCanvasMode(event.target.value as PlatformCanvasMode)}
            className="h-11 border border-white/15 bg-[#08131b] px-3 text-sm font-medium text-white outline-none transition-colors hover:border-cyan-300/35 focus:border-cyan-300/45"
          >
            {canvasModeOptions.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-4 border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Current view</p>
        <p className="mt-1 text-sm font-semibold text-white">{activeModeLabel}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(250px,0.75fr)]">
        {canvasMode === 'canvas' ? (
          <div className="relative min-h-[360px] overflow-hidden border border-white/10 bg-[#070b10]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.28) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
              }}
            />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="23" y1="28" x2="51" y2="43" stroke="rgba(255,255,255,0.32)" strokeWidth="0.42" />
              <line x1="51" y1="43" x2="73" y2="24" stroke="rgba(255,255,255,0.32)" strokeWidth="0.42" />
              <line x1="51" y1="43" x2="72" y2="68" stroke="rgba(255,255,255,0.32)" strokeWidth="0.42" />
              <line x1="31" y1="72" x2="51" y2="43" stroke="rgba(255,255,255,0.32)" strokeWidth="0.42" />
            </svg>
            {[
              { label: 'WhatsApp change', x: '23%', y: '28%', color: 'bg-orange-400' },
              { label: 'Clara', x: '51%', y: '43%', color: 'bg-blue-400' },
              { label: 'Contract clause', x: '73%', y: '24%', color: 'bg-emerald-400' },
              { label: 'Decision task', x: '72%', y: '68%', color: 'bg-cyan-300' },
              { label: 'Missing file', x: '31%', y: '72%', color: 'bg-rose-400' },
            ].map((node) => (
              <motion.div
                key={node.label}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
                className="absolute min-w-[128px] -translate-x-1/2 -translate-y-1/2 border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur"
                style={{ left: node.x, top: node.y }}
              >
                <span className={`mb-2 block h-2 w-2 rounded-full ${node.color}`} />
                <span className="block text-xs font-semibold text-white">{node.label}</span>
                <span className="mt-1 block text-[11px] text-neutral-400">linked evidence</span>
              </motion.div>
            ))}
            <div className="absolute bottom-4 left-4 right-4 border border-white/10 bg-black/35 p-4 backdrop-blur">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Comms table overlay</p>
              <div className="grid gap-2 md:grid-cols-2">
                {crmRows.slice(0, 4).map((row) => (
                  <div key={row.record} className="flex items-center justify-between gap-3 border border-white/10 bg-white/5 px-3 py-2 text-xs text-neutral-300">
                    <span className="truncate font-medium text-white">{row.record}</span>
                    <span className="shrink-0 text-neutral-500">{row.risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {canvasMode === 'risk' ? (
          <div className="min-h-[360px] border border-white/10 bg-[#070b10] p-4">
            <div className="mb-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Risk tracker</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">Highlights where comms, files, and tasks create delivery exposure.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {canvasRiskCards.map((risk) => (
                <div key={risk.title} className="border border-white/10 bg-white/5 p-4">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-cyan-300/75">{risk.metric}</p>
                  <h3 className="text-base font-semibold text-white">{risk.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-neutral-400">{risk.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {riskBars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{bar.label}</span>
                    <span className="text-neutral-500">{bar.value}</span>
                  </div>
                  <div className="h-3 border border-white/10 bg-white/5">
                    <div className={`h-full ${bar.className}`} style={{ width: bar.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {canvasMode === 'clara' ? (
          <div className="min-h-[360px] border border-white/10 bg-[#070b10] p-4">
            <div className="mb-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Clara customization dashboard</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">Configure the Gemma agent that queries the platform and updates the canvas.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {claraDashboardItems.map((item) => (
                <div key={item.label} className="border border-white/10 bg-white/5 p-4">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-cyan-300/75">{item.label}</p>
                  <h3 className="text-base font-semibold text-white">{item.value}</h3>
                  <p className="mt-3 text-xs leading-5 text-neutral-400">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border border-white/10 bg-[#08131b] p-4">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Allowed updates</p>
              <div className="grid gap-2 md:grid-cols-2">
                {deliveryActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="flex items-center justify-between border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-medium text-white"
                  >
                    <span>{action}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-px border border-[#122230] bg-[#122230]">
          {ingestRows.map((item) => {
            const Icon = item.Icon;

            return (
              <div key={item.source} className="bg-[#08131b] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-white">{item.source}</span>
                    <span className="text-xs leading-5 text-slate-400">{item.event}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                  <span className="border border-white/10 bg-white/5 p-2">{item.status}</span>
                  <span className="border border-white/10 bg-white/5 p-2">{item.owner}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RiskTrackerVisualization() {
  return (
    <div id="risk-tracker" className="border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Risk Tracker</p>
          <h2 className={projectPageSectionTitleClassName}>Where the platform sees exposure now.</h2>
        </div>
        <CircleAlert className="h-6 w-6 text-orange-500" />
      </div>
      <div className="space-y-4">
        {riskBars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-black">{bar.label}</span>
              <span className="text-neutral-500">{bar.value}</span>
            </div>
            <div className="h-3 border border-neutral-200 bg-neutral-50">
              <div className={`h-full ${bar.className}`} style={{ width: bar.value }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border border-neutral-900 bg-neutral-950 p-4 text-white">
        <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Clara recommendation</p>
        <p className="text-sm leading-6 text-neutral-300">
          Draft a change-order packet, cite the written-change clause, and ask the Contract Owner to approve or reject the expanded scope today.
        </p>
      </div>
    </div>
  );
}

function ClaraAgentPanel() {
  return (
    <div id="clara-agent" className="border border-neutral-900 bg-neutral-950 p-6 text-white">
      <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300/75">Gemma Agent</p>
      <div className="mb-5 flex items-start gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Clara acts on the canvas.</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            Clara is the client-specific Gemma model inside the platform. She queries the story, produces deliverables, and prepares owner-approved actions.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {deliveryActions.map((action) => (
          <button
            key={action}
            type="button"
            className="flex min-h-14 items-center justify-between gap-3 border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:border-cyan-300/35 hover:bg-cyan-300/10"
          >
            <span>{action}</span>
            <ArrowRight className="h-4 w-4 text-neutral-500" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
      >
        <Mic className="h-4 w-4" />
        Ask Clara by voice
      </button>
    </div>
  );
}

function ClaraPlatformChatTray({ onClose }: { onClose: () => void }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-5 bg-[#08131b] px-4 py-5 text-white sm:px-6 md:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.65fr)] md:py-7">
      <div className="border border-white/10 bg-[#071019] p-5 md:p-6">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300/75">Clara Platform Chat</p>
        <h2 className="max-w-2xl text-2xl font-medium tracking-tight md:text-3xl">Query the platform and update the canvas through Clara.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          Clara reads the current comms graph, checks risk state, updates records, and queues owner-approved actions without leaving the portal.
        </p>

        <div className="mt-6 grid gap-3">
          <div className="border border-white/10 bg-[#08131b] p-4">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Ask Clara</p>
            <p className="text-sm leading-6 text-neutral-300">
              “Find the latest risks from WhatsApp and Drive, update the canvas, and prepare a task if the owner needs to approve anything.”
            </p>
          </div>
          <div className="flex items-center gap-2 border border-white/10 bg-white/5 p-2">
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10 text-cyan-100 transition-colors hover:bg-cyan-300/15"
              aria-label="Start Clara voice query"
            >
              <Mic className="h-5 w-5" />
            </button>
            <div className="min-h-11 flex-1 border border-white/10 bg-[#071019] px-4 py-3 text-sm text-neutral-400">
              Type or speak a platform query...
            </div>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Run
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {claraChatSuggestions.map((item) => (
            <div key={item} className="border border-white/10 bg-white/5 p-3 text-xs font-medium text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      <aside className="border border-white/10 bg-[#071019] p-5 md:p-6">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Agent Update</p>
        <h3 className="text-xl font-medium tracking-tight text-white">Canvas updated from latest comms</h3>
        <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
          <div className="border border-white/10 bg-white/5 p-3">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-neutral-500">Query result</span>
            3 linked records now contribute to the unsigned-scope risk.
          </div>
          <div className="border border-white/10 bg-white/5 p-3">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-neutral-500">Canvas update</span>
            Risk tracker moved unsigned scope to Critical and attached the MSA clause.
          </div>
          <div className="border border-white/10 bg-white/5 p-3">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-neutral-500">Next action</span>
            Launch the tasks portal to develop an estimate for the selected project.
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          <a
            href="/jasonai-3/portal-2/tasks"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Open tasks portal
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function JasonAI3Portal2Page() {
  const [showPricingWhy, setShowPricingWhy] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<(typeof qnaItems)[number]['id']>('backend');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navItems: ClientNavAction[] = [
    { label: 'Overview', to: '/jasonai-3/portal-2' },
    { label: 'Canvas', to: '/jasonai-3/portal-2#platform-canvas' },
    { label: 'Risk Tracker', to: '/jasonai-3/portal-2#platform-canvas' },
    { label: 'Clara', to: '/jasonai-3/portal-2#platform-canvas' },
    { label: 'Launch', type: 'cta', onClick: () => { window.location.href = '/jasonai-3/portal-2/tasks'; } },
  ];

  return (
    <article className={projectPageShellClassName}>
      <ClientNavbar
        clientName="JasonAI-3"
        clientLink="/jasonai-3/portal-2"
        navItems={navItems}
        hasFieldBoss={true}
        assistantButtonLabel="Clara Chat"
        assistantTrayTitle="Query Platform With Clara"
        assistantTray={({ onClose }) => <ClaraPlatformChatTray onClose={onClose} />}
      />
      <Seo
        title="JasonAI-3 Platform V2 by B2W"
        description="JasonAI-3 Platform V2 presents the OpenClaw-fed AI platform as a client portal style SaaS canvas with Canvas, Risk Tracker, and Clara customization views."
        robots="noindex, nofollow"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <header className={projectPageHeaderClassName}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch lg:gap-6">
            <div className="grid content-start gap-3 md:grid-cols-2 md:gap-4">
              <div className="md:col-span-2">
                <motion.p {...heroReveal} className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                  Platform V2
                </motion.p>
                <motion.h1
                  {...heroReveal}
                  transition={{ ...heroReveal.transition, delay: 0.04 }}
                  className="max-w-[12ch] text-[2.2rem] font-medium leading-[0.98] tracking-tight text-black sm:text-5xl md:max-w-none md:text-6xl"
                >
                  AI Risk Intelligence Canvas & Client Operating System
                </motion.h1>
              </div>
              <div className="grid grid-cols-2 gap-3 md:col-span-2 md:contents">
                {[
                  { label: 'Platform', value: 'JasonAI-3' },
                  { label: 'Backend Feed', value: 'OpenClaw Assistants' },
                  { label: 'Primary Screen', value: 'Single Canvas' },
                  { label: 'AI Executor', value: 'Clara, Gemma Agent' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    {...heroReveal}
                    transition={{ ...heroReveal.transition, delay: 0.06 + index * 0.04 }}
                    className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700"
                  >
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">{item.label}</span>
                    <span className="mt-2 block font-medium text-black">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <aside className="flex h-full flex-col border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-6 md:p-7">
              <motion.p {...heroReveal} className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                Platform details
              </motion.p>
              <motion.h2
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.05 }}
                className="mb-5 max-w-md text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl md:mb-6 md:text-3xl"
              >
                Build a secure SaaS workspace that turns scattered communications into a live client story and owner action queue.
              </motion.h2>

              <motion.div
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.1 }}
                className="mb-5 space-y-3 border-y border-white/10 py-4 md:mb-6 md:py-5"
              >
                {platformObjectives.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.to}
                    className="group flex items-start gap-3 border border-transparent px-1 py-1 transition-colors hover:border-white/10 hover:bg-white/5"
                  >
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-300">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-neutral-200 transition-colors group-hover:text-white">
                        <span>{item.label}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                      </span>
                    </span>
                  </a>
                ))}
              </motion.div>

              <motion.div
                {...heroReveal}
                transition={{ ...heroReveal.transition, delay: 0.14 }}
                className="mb-5 grid grid-cols-2 gap-3 text-sm md:mb-6"
              >
                <div className="relative border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Build Track</p>
                  <button
                    type="button"
                    onClick={() => setShowPricingWhy((current) => !current)}
                    className="text-left font-medium text-white transition-colors hover:text-cyan-300"
                    aria-expanded={showPricingWhy}
                    aria-controls="platform-v2-build-track"
                  >
                    <span className="font-semibold">Backend + Frontend</span>
                  </button>
                  {showPricingWhy ? (
                    <div
                      id="platform-v2-build-track"
                      className="absolute left-3 right-3 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-white/15 bg-neutral-950 p-4 shadow-2xl"
                    >
                      <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Platform Scope</p>
                      <p className="text-sm leading-6 text-neutral-300">
                        V2 frames the app as a real SaaS platform: OpenClaw data ingestion, a canvas record model, Clara actions, and secure owner controls.
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Views</p>
                  <p className="font-medium">Canvas / Risk / Clara</p>
                </div>
              </motion.div>

              <motion.div {...heroReveal} transition={{ ...heroReveal.transition, delay: 0.18 }} className="mt-auto flex flex-col gap-2.5 sm:gap-3">
                <a
                  href="/jasonai-3/portal-2/tasks"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                >
                  Launch Platform V2
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </aside>
          </div>
        </header>

        <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <motion.div {...copyReveal} className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
            <span>Strategic Objectives</span>
            <span className="text-neutral-300">/</span>
            <span>Platform Control</span>
          </motion.div>
          <StrategicObjectivesCards />
        </section>

        <section className="mb-12">
          <motion.div {...copyReveal} className="mb-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 md:mb-6">
            <span>Platform Modules</span>
            <span className="text-neutral-300">/</span>
            <span>Canvas Views</span>
          </motion.div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {platformModules.map((item, index) => (
              <a
                key={item.id}
                href="#platform-canvas"
                className="group flex h-[40rem] min-w-[88%] snap-center snap-always flex-col border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-900 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:h-[41rem] sm:min-w-[72%] sm:p-7 lg:min-w-0"
              >
                <div className="mb-4 flex items-center justify-between sm:mb-5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-300 lg:hidden">
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <h2 className="mb-3 min-h-[3.5rem] text-[1.6rem] font-medium tracking-tight text-black sm:min-h-[4rem] sm:text-2xl">{item.title}</h2>
                <p className="mb-4 min-h-[4.5rem] text-sm leading-6 text-neutral-600 sm:mb-5 sm:min-h-[5rem]">{item.description}</p>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="mb-4 flex-1 border-t border-neutral-100 pt-4 sm:mb-5 sm:pt-5">
                    <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Includes</p>
                    <ul className="space-y-2 text-sm leading-6 text-neutral-700">
                      {item.includes.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-neutral-900 bg-neutral-950 p-4 text-white sm:p-5">
                    <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">{item.valueLabel}</p>
                    <p className="min-h-[3rem] text-sm font-semibold leading-6 tracking-tight text-white">{item.valueBody}</p>
                    <div className="mt-5 min-h-11">
                      <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold tracking-tight text-white transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/10 sm:text-[0.96rem]">
                        <span>{item.cta}</span>
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <motion.div {...copyReveal} className={projectPageEyebrowClassName}>
            <span>Visualization</span>
            <span className="text-neutral-300">/</span>
            <span>OpenClaw Backend</span>
          </motion.div>
          <PlatformCanvasVisualization />
        </section>

        <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <motion.div {...copyReveal} className={projectPageEyebrowClassName}>
            <span>Terms</span>
            <span className="text-neutral-300">/</span>
            <span>Platform Behavior</span>
          </motion.div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <motion.div {...copyReveal} className="border border-neutral-200 bg-white p-6">
              <motion.h2 {...copyReveal} transition={{ ...copyReveal.transition, delay: 0.04 }} className={`mb-4 ${projectPageSectionTitleClassName}`}>
                Questions & Answers
              </motion.h2>
              <div className="divide-y divide-neutral-100 border-y border-neutral-100">
                {qnaItems.map((item) => {
                  const isOpen = openQuestion === item.id;

                  return (
                    <div key={item.id} className="py-1">
                      <button
                        type="button"
                        onClick={() => setOpenQuestion(item.id)}
                        className="flex w-full items-start justify-between gap-3 px-0 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="min-w-0">
                          <h4 className="mb-1 text-xs font-mono uppercase tracking-wider text-neutral-500">{item.title}</h4>
                          <h3 className="text-lg font-medium tracking-tight text-black md:text-xl">{item.question}</h3>
                        </span>
                        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            key={`${item.id}-answer`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4">
                              <div className="border border-neutral-300 p-4">
                                <p className="text-sm leading-6 text-neutral-700">{item.answer}</p>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div {...copyReveal} transition={{ ...copyReveal.transition, delay: 0.08 }} className="space-y-4 lg:self-start">
              <RiskTrackerVisualization />
            </motion.div>
          </div>
        </section>

        <section id="clara-agent" className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <motion.div {...copyReveal} className="mb-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 md:mb-6">
            <span>Project Implementation</span>
            <span className="text-neutral-300">/</span>
            <span>Clara Execution</span>
          </motion.div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <ClaraAgentPanel />

            <div className="grid gap-px border border-[#122230] bg-[#122230]">
              {[
                { title: 'Backend ingest', description: 'OpenClaw assistants push channel events into the platform API.', Icon: DatabaseZap },
                { title: 'Record model', description: 'Every message, file, event, task, and clause becomes queryable.', Icon: FileText },
                { title: 'Canvas action', description: 'Clara can update records, draft deliverables, and prepare approvals.', Icon: Workflow },
                { title: 'Owner control', description: 'Contract Owner review gates keep sensitive actions accountable.', Icon: Bot },
              ].map((item) => {
                const Icon = item.Icon;

                return (
                  <motion.div key={item.title} {...copyReveal}>
                    <div className="flex h-full items-center justify-between bg-[#08131b] p-5">
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-white">{item.title}</span>
                          <span className="text-xs leading-5 text-slate-400">{item.description}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <motion.div {...copyReveal} className="grid gap-4 border border-neutral-900 bg-neutral-950 p-6 text-white md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
            <div>
              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300/75">Platform V2 Ready</p>
              <h2 className="max-w-3xl text-2xl font-medium tracking-tight md:text-3xl">
                A client-portal style SaaS surface for JasonAI-3 that turns comms into risk-aware execution and project estimates.
              </h2>
            </div>
            <a
              href="/jasonai-3/portal-2/tasks"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Open Tasks Portal
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </section>
      </motion.div>

      <Footer />
    </article>
  );
}
