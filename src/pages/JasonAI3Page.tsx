import { useEffect, useMemo, useState, type Key, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  DatabaseZap,
  FileText,
  FolderOpen,
  Mail,
  MessageCircle,
  Mic,
  Network,
  RadioTower,
  SearchCheck,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { JasonAIVectorMark } from '../components/BrandVectorMarks';
import Seo from '../components/Seo';

type RiskStatus = 'critical' | 'watch' | 'clear' | 'agent';
type NodeType = 'message' | 'file' | 'event' | 'task' | 'agent' | 'contract';
type CanvasView = 'story' | 'crm' | 'risk';

type StoryNode = {
  id: string;
  label: string;
  source: string;
  type: NodeType;
  status: RiskStatus;
  x: number;
  y: number;
  summary: string;
  evidence: string[];
  owner: string;
  timestamp: string;
  confidence: string;
};

const storyNodes: StoryNode[] = [
  {
    id: 'wa-change',
    label: 'WhatsApp scope change',
    source: 'WhatsApp',
    type: 'message',
    status: 'critical',
    x: 30,
    y: 31,
    summary: 'Client asked for a contract-side change in a fast moving group thread, but no signed instruction exists.',
    evidence: ['Maya confirmed feasibility', 'Owner asked for pricing', 'No approval artifact linked'],
    owner: 'Contract Owner',
    timestamp: '9:42 AM',
    confidence: '96%',
  },
  {
    id: 'email-approval',
    label: 'Email approval trail',
    source: 'Email',
    type: 'message',
    status: 'watch',
    x: 65,
    y: 22,
    summary: 'Approval language exists, but the client reply references a prior attachment not present in the job folder.',
    evidence: ['Approval phrase detected', 'Attachment reference unresolved', 'Two stakeholders copied'],
    owner: 'Clara',
    timestamp: '10:18 AM',
    confidence: '88%',
  },
  {
    id: 'drive-contract',
    label: 'Master service agreement',
    source: 'Drive',
    type: 'contract',
    status: 'clear',
    x: 52,
    y: 52,
    summary: 'Contract terms define a written-change requirement and escalation path for client requested work.',
    evidence: ['Change clause found', 'Owner authority mapped', 'Risk language extracted'],
    owner: 'Legal ops',
    timestamp: 'Synced',
    confidence: '93%',
  },
  {
    id: 'calendar-review',
    label: 'Friday review',
    source: 'Calendar',
    type: 'event',
    status: 'watch',
    x: 78,
    y: 62,
    summary: 'A review meeting is scheduled after the delivery deadline, creating a timing risk for the decision.',
    evidence: ['Deadline: Thu 5 PM', 'Meeting: Fri 11 AM', 'No interim task assigned'],
    owner: 'Project lead',
    timestamp: 'Fri 11:00',
    confidence: '82%',
  },
  {
    id: 'task-draft',
    label: 'Change-order draft',
    source: 'Task',
    type: 'task',
    status: 'agent',
    x: 41,
    y: 73,
    summary: 'Clara generated a change-order draft with source citations and routed it to the Contract Owner.',
    evidence: ['Draft ready', 'Evidence attached', 'Owner signoff required'],
    owner: 'Clara',
    timestamp: 'Ready',
    confidence: '91%',
  },
  {
    id: 'clara',
    label: 'Clara',
    source: 'Gemma custom model',
    type: 'agent',
    status: 'agent',
    x: 50,
    y: 38,
    summary: 'Queryable client-specific model trained on the contract, communication map, delivery playbook, and owner rules.',
    evidence: ['Client profile loaded', 'Risk policy active', 'Deliverable tools available'],
    owner: 'AI executor',
    timestamp: 'Live',
    confidence: '99%',
  },
];

const graphEdges = [
  ['wa-change', 'clara'],
  ['email-approval', 'clara'],
  ['drive-contract', 'clara'],
  ['calendar-review', 'clara'],
  ['clara', 'task-draft'],
  ['drive-contract', 'task-draft'],
  ['wa-change', 'task-draft'],
] as const;

const platformMetrics = [
  { label: 'Risk clusters', value: '14', detail: '+3 from new comms' },
  { label: 'Evidence links', value: '218', detail: 'WhatsApp, email, Drive' },
  { label: 'Owner actions', value: '7', detail: '2 require approval' },
  { label: 'Clara confidence', value: '94%', detail: 'client-tuned retrieval' },
] as const;

const activityFeed = [
  {
    source: 'WhatsApp',
    detail: 'New pricing message matched to open change-order risk.',
    time: '18 sec ago',
    Icon: MessageCircle,
  },
  {
    source: 'Drive',
    detail: 'Contract clause linked to Friday review task.',
    time: '2 min ago',
    Icon: FolderOpen,
  },
  {
    source: 'Email',
    detail: 'Client attachment reference unresolved.',
    time: '6 min ago',
    Icon: Mail,
  },
  {
    source: 'Calendar',
    detail: 'Review event falls after decision deadline.',
    time: '11 min ago',
    Icon: CalendarDays,
  },
] as const;

const claraDeliverables = [
  'Change-order draft with citations',
  'Owner risk memo',
  'Client response script',
  'Decision log update',
] as const;

const channels = [
  { name: 'WhatsApp', detail: 'Group threads, voice notes, owner requests', Icon: MessageCircle },
  { name: 'Email', detail: 'Approvals, client replies, attachments', Icon: Mail },
  { name: 'Drive', detail: 'Contracts, files, folders, source evidence', Icon: FolderOpen },
  { name: 'Calendar', detail: 'Events, tasks, deadlines, review windows', Icon: CalendarDays },
] as const;

const systemLayers = [
  {
    title: 'OpenClaw assistants live inside the channels.',
    body: 'WhatsApp, email, drive, and calendar assistants capture messages, files, events, and task signals without forcing the client team into a new workflow.',
  },
  {
    title: 'The SaaS backend normalizes every input.',
    body: 'OpenClaw events feed the platform API, which indexes files, links evidence, assigns owners, and keeps the canvas current.',
  },
  {
    title: 'The Gemma agent acts on the canvas.',
    body: 'Clara can query the story, change risk state, create tasks, draft client responses, and prepare approvals for the Contract Owner.',
  },
] as const;

const riskQueue = [
  {
    title: 'Unsigned scope change',
    status: 'Critical',
    detail: 'Approval language exists in chat, but contract requires signed instruction.',
  },
  {
    title: 'Missing client attachment',
    status: 'Watch',
    detail: 'Email references a file that is absent from the synced Drive folder.',
  },
  {
    title: 'Late review meeting',
    status: 'Watch',
    detail: 'Scheduled after decision deadline. Clara prepared an interim approval route.',
  },
] as const;

const canvasFiles = [
  {
    id: 'ms-001',
    file: 'WhatsApp / Change request',
    client: 'Aster Commercial',
    source: 'OpenClaw WhatsApp',
    owner: 'Contract Owner',
    risk: 'Critical',
    status: 'Needs approval',
    updated: '18 sec ago',
    summary: 'Client requested additional implementation work without a signed instruction.',
  },
  {
    id: 'em-017',
    file: 'Email / Approval language',
    client: 'Aster Commercial',
    source: 'OpenClaw Email',
    owner: 'Clara',
    risk: 'Watch',
    status: 'Evidence review',
    updated: '2 min ago',
    summary: 'Approval exists, but the referenced attachment is missing from Drive.',
  },
  {
    id: 'dr-044',
    file: 'Drive / Master services agreement',
    client: 'Aster Commercial',
    source: 'OpenClaw Drive',
    owner: 'Legal ops',
    risk: 'Clear',
    status: 'Indexed',
    updated: 'Synced',
    summary: 'Change-control clause extracted and linked to scope-change cluster.',
  },
  {
    id: 'cal-009',
    file: 'Calendar / Friday review',
    client: 'Aster Commercial',
    source: 'OpenClaw Calendar',
    owner: 'Project lead',
    risk: 'Watch',
    status: 'Timing risk',
    updated: '11 min ago',
    summary: 'Review event lands after the decision deadline.',
  },
] as const;

const openClawEvents = [
  { assistant: 'WhatsApp assistant', event: 'Parsed 8 new messages', status: 'Mapped to scope cluster' },
  { assistant: 'Email assistant', event: 'Found attachment reference', status: 'Needs file match' },
  { assistant: 'Drive assistant', event: 'Indexed contract folder', status: 'Clause graph updated' },
  { assistant: 'Calendar assistant', event: 'Detected deadline conflict', status: 'Risk queue updated' },
] as const;

const riskHighlights = [
  {
    title: 'Unsigned change work',
    metric: '3 files',
    severity: 'Critical',
    detail: 'WhatsApp request, pricing email, and contract clause converge without owner approval.',
  },
  {
    title: 'Missing evidence',
    metric: '1 gap',
    severity: 'Watch',
    detail: 'Client email references an attachment that OpenClaw has not found in Drive.',
  },
  {
    title: 'Late decision window',
    metric: '22 hrs',
    severity: 'Watch',
    detail: 'Review meeting is scheduled after the delivery decision deadline.',
  },
] as const;

const gemmaActions = [
  'Update canvas with approval route',
  'Draft client response from evidence',
  'Create owner approval task',
  'Mark missing attachment as risk',
] as const;

function statusStyles(status: RiskStatus) {
  if (status === 'critical') {
    return {
      dot: 'bg-[#ff5a68] shadow-[0_0_0_7px_rgba(255,90,104,0.14)]',
      border: 'border-[#ff5a68]/60',
      text: 'text-[#ff8a94]',
      bg: 'bg-[#ff5a68]/12',
    };
  }

  if (status === 'watch') {
    return {
      dot: 'bg-[#f6b94f] shadow-[0_0_0_7px_rgba(246,185,79,0.13)]',
      border: 'border-[#f6b94f]/55',
      text: 'text-[#ffd083]',
      bg: 'bg-[#f6b94f]/12',
    };
  }

  if (status === 'agent') {
    return {
      dot: 'bg-[#4F6EF7] shadow-[0_0_0_7px_rgba(79,110,247,0.18)]',
      border: 'border-[#4F6EF7]/65',
      text: 'text-[#aebcff]',
      bg: 'bg-[#4F6EF7]/14',
    };
  }

  return {
    dot: 'bg-[#35d6a6] shadow-[0_0_0_7px_rgba(53,214,166,0.13)]',
    border: 'border-[#35d6a6]/55',
    text: 'text-[#8df2d3]',
    bg: 'bg-[#35d6a6]/12',
  };
}

function typeIcon(type: NodeType) {
  if (type === 'message') {
    return MessageCircle;
  }

  if (type === 'file' || type === 'contract') {
    return FileText;
  }

  if (type === 'event') {
    return CalendarDays;
  }

  if (type === 'task') {
    return Workflow;
  }

  return Bot;
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  key?: Key;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.9, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function useRouteHashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '');

      if (!hash) {
        return;
      }

      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    const delayedScroll = window.setTimeout(scrollToHash, 220);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.clearTimeout(delayedScroll);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);
}

function JasonAILogo() {
  return (
    <Link to="/jasonai-3" className="group inline-flex items-center gap-3" aria-label="JasonAI-3 by B2W">
      <span className="relative grid h-11 w-11 place-items-center overflow-visible text-white transition-transform duration-300 group-hover:scale-[1.04]">
        <JasonAIVectorMark title="" className="h-full w-full overflow-visible" strokeWidth={2.9} />
        <span className="sr-only">JasonAI</span>
      </span>
      <span className="leading-none">
        <span className="block text-lg font-semibold tracking-[-0.03em] text-white">JasonAI</span>
        <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/52">
          <span>by B2W</span>
          <span className="h-1 w-1 rounded-full bg-[#35d6a6]" aria-hidden="true" />
          <span>risk intelligence</span>
        </span>
      </span>
    </Link>
  );
}

function Button({
  children,
  variant = 'primary',
  href,
}: {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'light';
  href?: string;
}) {
  const className =
    variant === 'primary'
      ? 'border-[#4F6EF7] bg-[#4F6EF7] text-white shadow-[0_16px_40px_rgba(79,110,247,0.28)] hover:bg-[#5f7cff]'
      : variant === 'light'
        ? 'border-white/70 bg-white text-[#111111] shadow-[0_16px_40px_rgba(0,0,0,0.18)] hover:bg-[#f1f3ff]'
        : 'border-white/14 bg-white/7 text-white hover:border-white/28 hover:bg-white/11';

  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:scale-[1.02] ${className}`}
    >
      {children}
    </a>
  );
}

function StoryGraph({
  activeNodeId,
  onSelectNode,
}: {
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const nodesById = useMemo(() => new Map(storyNodes.map((node) => [node.id, node])), []);

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/12 bg-[#0b0d12]/86 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:min-h-[640px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(79,110,247,0.2), transparent 35%), radial-gradient(circle at 24% 72%, rgba(53,214,166,0.12), transparent 30%), radial-gradient(circle at 82% 18%, rgba(246,185,79,0.08), transparent 28%)',
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {graphEdges.map(([fromId, toId], index) => {
          const from = nodesById.get(fromId);
          const to = nodesById.get(toId);

          if (!from || !to) {
            return null;
          }

          const isActive = from.id === activeNodeId || to.id === activeNodeId;

          return (
            <motion.line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isActive ? '#8ea2ff' : 'rgba(255,255,255,0.2)'}
              strokeWidth={isActive ? 0.46 : 0.22}
              strokeLinecap="round"
              initial={false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: isActive ? [0.72, 1, 0.72] : [0.25, 0.42, 0.25],
                    }
              }
              transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.12 }}
            />
          );
        })}
      </svg>

      <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
        {['Live sync', 'Story graph', 'Risk CRM'].map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/72 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#35d6a6]" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      {storyNodes.map((node, index) => {
        const styles = statusStyles(node.status);
        const Icon = typeIcon(node.type);
        const isActive = activeNodeId === node.id;

        return (
          <motion.button
            key={node.id}
            type="button"
            onClick={() => onSelectNode(node.id)}
            className={`absolute z-10 flex max-w-[168px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border px-3 py-2 text-left shadow-[0_16px_44px_rgba(0,0,0,0.26)] backdrop-blur-xl transition ${
              isActive
                ? `${styles.border} bg-white/16 text-white`
                : 'border-white/12 bg-white/8 text-white/78 hover:border-white/24 hover:bg-white/12'
            }`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: isActive ? [0, -4, 0] : [0, -2, 0],
                  }
            }
            transition={{ duration: isActive ? 2.4 : 4.2, repeat: Infinity, delay: index * 0.16 }}
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${styles.bg}`}>
              <Icon className={`h-4 w-4 ${styles.text}`} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold">{node.label}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/48">
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
                {node.source}
              </span>
            </span>
          </motion.button>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 z-20 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="rounded-[22px] border border-white/12 bg-black/30 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-[#8ea2ff]" />
            <p className="text-xs font-semibold uppercase text-white/48">Obsidian-style story map</p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/74">
            Communications, files, events, and tasks become connected nodes. Every new JasonAI input updates the story
            before a risk becomes a dispute.
          </p>
        </div>
        <div className="rounded-[22px] border border-[#ff5a68]/35 bg-[#ff5a68]/12 px-4 py-3 text-sm font-semibold text-[#ffb0b7] backdrop-blur-xl">
          3 active risks
        </div>
      </div>
    </div>
  );
}

function NodeInspector({ node }: { node: StoryNode }) {
  const styles = statusStyles(node.status);

  return (
    <div className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_24px_74px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`inline-flex items-center gap-2 rounded-full border ${styles.border} ${styles.bg} px-3 py-1 text-xs font-semibold ${styles.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
            {node.status === 'critical' ? 'Critical risk' : node.status === 'watch' ? 'Watch item' : node.status === 'agent' ? 'Clara action' : 'Cleared'}
          </p>
          <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">{node.label}</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/22 px-3 py-2 text-right">
          <p className="text-xs font-semibold uppercase text-white/38">Confidence</p>
          <p className="mt-1 text-xl font-semibold text-white">{node.confidence}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-white/64">{node.summary}</p>
      <div className="mt-5 grid gap-2">
        {node.evidence.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/76">
            <Check className="h-4 w-4 shrink-0 text-[#35d6a6]" />
            {item}
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
          <p className="text-xs font-semibold uppercase text-white/36">Owner</p>
          <p className="mt-1 text-sm font-semibold text-white">{node.owner}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
          <p className="text-xs font-semibold uppercase text-white/36">Updated</p>
          <p className="mt-1 text-sm font-semibold text-white">{node.timestamp}</p>
        </div>
      </div>
    </div>
  );
}

function ClaraPanel({ isListening, onToggleListening }: { isListening: boolean; onToggleListening: () => void }) {
  return (
    <div className="rounded-[28px] border border-white/12 bg-[#0d1016]/88 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#4F6EF7]/35 bg-[#4F6EF7]/16">
            <Bot className="h-5 w-5 text-[#aebcff]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Clara</p>
            <p className="mt-0.5 text-xs text-white/44">Gemma model, trained to the client</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleListening}
          aria-label={isListening ? 'Stop Clara voice input' : 'Start Clara voice input'}
          className={`grid h-11 w-11 place-items-center rounded-2xl border transition ${
            isListening
              ? 'border-[#35d6a6]/60 bg-[#35d6a6]/18 text-[#8df2d3]'
              : 'border-white/12 bg-white/8 text-white/72 hover:border-white/24'
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/10 bg-black/26 p-4">
        <p className="text-xs font-semibold uppercase text-white/38">Contract Owner asked</p>
        <p className="mt-2 text-lg font-semibold leading-7 text-white">
          What risk blocks delivery this week, and what should I approve first?
        </p>
        <div className="mt-4 flex h-9 items-end gap-1.5">
          {[18, 28, 16, 34, 22, 30, 14, 25, 20, 32].map((height, index) => (
            <motion.span
              key={`${height}-${index}`}
              className={`w-1.5 rounded-full ${isListening ? 'bg-[#35d6a6]' : 'bg-[#4F6EF7]/64'}`}
              animate={isListening ? { height: [height, height + 12, height] } : { height }}
              transition={{ duration: 0.72, repeat: isListening ? Infinity : 0, delay: index * 0.04 }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-[#4F6EF7]/24 bg-[#4F6EF7]/10 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#aebcff]" />
          <p className="text-xs font-semibold uppercase text-[#aebcff]">Clara response</p>
        </div>
        <p className="mt-3 text-sm leading-7 text-white/72">
          The unsigned scope change is the primary blocker. I prepared a change-order draft, an owner memo, and a client
          response. Approve the change-order route before Friday review.
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {claraDeliverables.map((deliverable) => (
          <div key={deliverable} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white/76">
            <span>{deliverable}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#8ea2ff]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaraVoiceBar({ isListening, onToggleListening }: { isListening: boolean; onToggleListening: () => void }) {
  return (
    <div className="rounded-[24px] border border-[#4F6EF7]/24 bg-[#4F6EF7]/10 p-4 shadow-[0_18px_54px_rgba(79,110,247,0.12)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-[#aebcff]">Queryable model</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">Ask Clara about the contract story</p>
        </div>
        <button
          type="button"
          onClick={onToggleListening}
          aria-label={isListening ? 'Stop Clara portal voice input' : 'Start Clara portal voice input'}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${
            isListening
              ? 'border-[#35d6a6]/60 bg-[#35d6a6]/18 text-[#8df2d3]'
              : 'border-white/12 bg-white/8 text-white/72 hover:border-white/24'
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex h-8 items-end gap-1.5">
        {[14, 22, 16, 27, 19, 25, 13, 21, 17, 24, 15, 20].map((height, index) => (
          <motion.span
            key={`${height}-${index}`}
            className={`w-1.5 rounded-full ${isListening ? 'bg-[#35d6a6]' : 'bg-[#8ea2ff]/70'}`}
            animate={isListening ? { height: [height, height + 9, height] } : { height }}
            transition={{ duration: 0.72, repeat: isListening ? Infinity : 0, delay: index * 0.04 }}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_24px_74px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">JasonAI intake</p>
          <p className="mt-1 text-xs text-white/42">Automatic updates from live channels</p>
        </div>
        <RadioTower className="h-5 w-5 text-[#35d6a6]" />
      </div>
      <div className="mt-5 space-y-3">
        {activityFeed.map(({ source, detail, time, Icon }) => (
          <div key={`${source}-${time}`} className="rounded-2xl border border-white/10 bg-black/18 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-[#8ea2ff]" />
                <p className="text-sm font-semibold text-white">{source}</p>
              </div>
              <p className="text-xs font-medium text-white/34">{time}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/58">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {platformMetrics.map((metric, index) => (
        <Reveal
          key={metric.label}
          delay={index * 0.04}
          className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase text-white/38">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
          <p className="mt-2 text-sm text-white/50">{metric.detail}</p>
        </Reveal>
      ))}
    </div>
  );
}

function ChannelSection() {
  return (
    <section id="channels" className="border-t border-white/10">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.66fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#4F6EF7]/28 bg-[#4F6EF7]/12 px-3 py-1.5 text-sm font-semibold text-[#aebcff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
              Where OpenClaw lives
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Assistants in every communication channel feed the SaaS backend.
            </h2>
          </div>
          <p className="text-lg leading-8 text-white/58">
            OpenClaw assistants can run through WhatsApp, email, shared drives, calendar events, task systems, or the
            client channels already carrying the work. The platform normalizes those inputs into a SaaS canvas.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ name, detail, Icon }, index) => (
            <Reveal
              key={name}
              delay={index * 0.05}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20">
                <Icon className="h-5 w-5 text-[#8ea2ff]" />
              </span>
              <h3 className="mt-8 text-xl font-semibold text-white">{name}</h3>
              <p className="mt-3 text-sm leading-7 text-white/54">{detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformSection() {
  return (
    <section id="platform" className="border-t border-white/10 bg-white/[0.025]">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#35d6a6]/28 bg-[#35d6a6]/10 px-3 py-1.5 text-sm font-semibold text-[#8df2d3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35d6a6]" aria-hidden="true" />
              Platform layer
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
              The web app is built around the canvas, not a website navigation model.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/58">
              The graph is not just a visualization. It is the working record for the client relationship: messages,
              files, tasks, owners, risk status, OpenClaw ingest state, and Clara-generated mitigation assets in one place.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/12 bg-[#0c0f15]/86 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.26)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Risk queue</p>
                <p className="mt-1 text-xs text-white/42">Prioritized for the Contract Owner</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-[#8df2d3]" />
            </div>
            <div className="mt-5 space-y-3">
              {riskQueue.map((risk) => (
                <div key={risk.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{risk.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        risk.status === 'Critical'
                          ? 'bg-[#ff5a68]/13 text-[#ff9aa3]'
                          : 'bg-[#f6b94f]/12 text-[#ffd083]'
                      }`}
                    >
                      {risk.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">{risk.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClaraSection() {
  return (
    <section id="clara" className="border-t border-white/10">
      <div className="mx-auto max-w-[1180px] px-5 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.84fr_1fr] lg:items-center">
          <div className="rounded-[30px] border border-white/12 bg-white/[0.06] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.26)] backdrop-blur">
            <div className="rounded-[24px] border border-[#4F6EF7]/22 bg-[#4F6EF7]/10 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <DatabaseZap className="h-6 w-6 text-[#aebcff]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Client-trained context</p>
                  <p className="mt-1 text-xs text-white/44">Contract, communications, owner rules, deliverable history</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2">
                {systemLayers.map((layer, index) => (
                  <div key={layer.title} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                    <p className="text-xs font-semibold text-[#aebcff]">0{index + 1}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{layer.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">{layer.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#4F6EF7]/28 bg-[#4F6EF7]/12 px-3 py-1.5 text-sm font-semibold text-[#aebcff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
              Clara
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
              A secure AI executor trained to understand the client.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/58">
              Clara is the Gemma agent inside the platform. It answers questions by voice, edits the canvas, produces
              client-specific deliverables, and prepares mitigation steps for approval by the Contract Owner.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Voice-first query', 'Evidence-backed answers', 'Custom tools', 'Owner approval controls'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white/76">
                  <SearchCheck className="h-4 w-4 text-[#8df2d3]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JasonAI3Background({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen overflow-x-clip bg-[#08090d] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.23]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 20% 10%, rgba(79,110,247,0.15), transparent 62%), radial-gradient(ellipse 45% 36% at 84% 22%, rgba(53,214,166,0.09), transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0) 36%)',
        }}
        animate={shouldReduceMotion ? undefined : { opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {children}
    </div>
  );
}

function JasonAI3Header({
  variant,
}: {
  variant: 'landing' | 'portal';
}) {
  const navItems =
    variant === 'landing'
      ? [
          { href: '#story', label: 'Story' },
          { href: '#platform', label: 'Platform' },
          { href: '#clara', label: 'Clara' },
        ]
      : [
          { href: '#portal', label: 'Portal' },
          { href: '#channels', label: 'Channels' },
          { href: '#platform', label: 'Platform' },
          { href: '#clara', label: 'Clara' },
        ];

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 rounded-[22px] border border-white/12 bg-[#0c0e13]/78 px-4 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl md:px-5">
        <JasonAILogo />
        <nav className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.05] p-1 text-sm font-semibold text-white/56 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-xl px-3 py-2 transition hover:bg-white/9 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <Button href={variant === 'landing' ? '/jasonai-3/portal' : '/jasonai-3'}>
          {variant === 'landing' ? 'Open portal' : 'Landing'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

function LandingGraphPreview() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[30px] border border-white/12 bg-[#0b0d12]/88 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.34)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(79,110,247,0.22), transparent 36%), radial-gradient(circle at 25% 70%, rgba(53,214,166,0.12), transparent 28%)',
        }}
      />
      <div className="relative z-10 flex flex-wrap gap-2">
        {['WhatsApp', 'Email', 'Drive', 'Tasks'].map((source) => (
          <span key={source} className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/70">
            {source}
          </span>
        ))}
      </div>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {[
          [25, 34, 52, 44],
          [72, 28, 52, 44],
          [36, 74, 52, 44],
          [52, 44, 67, 68],
          [52, 44, 30, 58],
        ].map(([x1, y1, x2, y2], index) => (
          <motion.line
            key={`${x1}-${y1}-${x2}-${y2}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={index === 0 ? '#8ea2ff' : 'rgba(255,255,255,0.22)'}
            strokeWidth={index === 0 ? 0.48 : 0.24}
            strokeLinecap="round"
            animate={{ opacity: [0.4, 0.92, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.14 }}
          />
        ))}
      </svg>
      {[
        { label: 'Client asks for change', x: '25%', y: '34%', status: 'bg-[#ff5a68]' },
        { label: 'Email confirms pricing', x: '72%', y: '28%', status: 'bg-[#f6b94f]' },
        { label: 'Contract clause', x: '36%', y: '74%', status: 'bg-[#35d6a6]' },
        { label: 'Clara', x: '52%', y: '44%', status: 'bg-[#4F6EF7]' },
        { label: 'Mitigation task', x: '67%', y: '68%', status: 'bg-[#4F6EF7]' },
        { label: 'Missing approval', x: '30%', y: '58%', status: 'bg-[#ff5a68]' },
      ].map((node, index) => (
        <motion.div
          key={node.label}
          className="absolute z-10 max-w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/12 bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-[0_16px_44px_rgba(0,0,0,0.25)] backdrop-blur"
          style={{ left: node.x, top: node.y }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, delay: index * 0.16 }}
        >
          <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${node.status}`} aria-hidden="true" />
          {node.label}
        </motion.div>
      ))}
      <div className="absolute bottom-5 left-5 right-5 z-10 rounded-[22px] border border-white/12 bg-black/34 p-4 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase text-white/42">Portal preview</p>
        <p className="mt-2 text-sm leading-6 text-white/72">
          The full portal lives at `/jasonai-3/portal`, where the graph becomes the operating CRM.
        </p>
      </div>
    </div>
  );
}

function AppStoryCanvas({
  activeNodeId,
  onSelectNode,
}: {
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
}) {
  return (
    <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#090b10]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Story graph</p>
          <p className="mt-0.5 text-xs text-white/42">Files, comms, events, and tasks linked by OpenClaw backend events.</p>
        </div>
        <span className="rounded-full border border-[#35d6a6]/24 bg-[#35d6a6]/10 px-3 py-1 text-xs font-semibold text-[#8df2d3]">
          Live canvas
        </span>
      </div>
      <div className="flex-1 p-3">
        <StoryGraph activeNodeId={activeNodeId} onSelectNode={onSelectNode} />
      </div>
    </div>
  );
}

function AppCRMCanvas() {
  return (
    <div className="h-full min-h-[560px] overflow-hidden rounded-[18px] border border-white/10 bg-[#090b10]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">CRM table</p>
          <p className="mt-0.5 text-xs text-white/42">Every file is a relationship record with risk, owner, and source context.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/58">
          {canvasFiles.length} records
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase text-white/38">
            <tr>
              {['File', 'Client', 'Source', 'Owner', 'Risk', 'Status', 'Updated'].map((heading) => (
                <th key={heading} className="border-b border-white/10 px-4 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {canvasFiles.map((record) => {
              const riskClass =
                record.risk === 'Critical'
                  ? 'bg-[#ff5a68]/12 text-[#ff9aa3]'
                  : record.risk === 'Watch'
                    ? 'bg-[#f6b94f]/12 text-[#ffd083]'
                    : 'bg-[#35d6a6]/12 text-[#8df2d3]';

              return (
                <tr key={record.id} className="border-b border-white/8 align-top hover:bg-white/[0.035]">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{record.file}</p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-white/45">{record.summary}</p>
                  </td>
                  <td className="px-4 py-4 text-white/68">{record.client}</td>
                  <td className="px-4 py-4 text-white/58">{record.source}</td>
                  <td className="px-4 py-4 text-white/68">{record.owner}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${riskClass}`}>{record.risk}</span>
                  </td>
                  <td className="px-4 py-4 text-white/58">{record.status}</td>
                  <td className="px-4 py-4 text-white/42">{record.updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppRiskCanvas() {
  return (
    <div className="h-full min-h-[560px] overflow-hidden rounded-[18px] border border-white/10 bg-[#090b10]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Risk tracker</p>
          <p className="mt-0.5 text-xs text-white/42">Highlights where risks exist across the current canvas.</p>
        </div>
        <span className="rounded-full border border-[#ff5a68]/28 bg-[#ff5a68]/12 px-3 py-1 text-xs font-semibold text-[#ff9aa3]">
          1 critical
        </span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-3">
        {riskHighlights.map((risk) => (
          <div key={risk.title} className="rounded-[20px] border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{risk.title}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{risk.metric}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  risk.severity === 'Critical' ? 'bg-[#ff5a68]/12 text-[#ff9aa3]' : 'bg-[#f6b94f]/12 text-[#ffd083]'
                }`}
              >
                {risk.severity}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/55">{risk.detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 border-t border-white/10 p-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[20px] border border-white/10 bg-black/18 p-4">
          <p className="text-xs font-semibold uppercase text-white/36">Risk concentration</p>
          <div className="mt-4 space-y-3">
            {[
              ['Change control', '78%', 'bg-[#ff5a68]'],
              ['Evidence gaps', '43%', 'bg-[#f6b94f]'],
              ['Timing conflicts', '36%', 'bg-[#4F6EF7]'],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="flex justify-between text-sm">
                  <span className="text-white/68">{label}</span>
                  <span className="font-semibold text-white">{value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                  <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-[#4F6EF7]/22 bg-[#4F6EF7]/10 p-4">
          <p className="text-xs font-semibold uppercase text-[#aebcff]">Gemma recommendation</p>
          <p className="mt-3 text-lg font-semibold leading-7 text-white">Generate approval route before responding to the client.</p>
          <p className="mt-3 text-sm leading-6 text-white/58">
            Clara can update the canvas, create the task, draft the response, and attach the evidence bundle.
          </p>
        </div>
      </div>
    </div>
  );
}

function OpenClawBackendPanel() {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.055] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">OpenClaw backend</p>
          <p className="mt-1 text-xs text-white/42">Assistant events feeding the SaaS canvas.</p>
        </div>
        <RadioTower className="h-5 w-5 text-[#8df2d3]" />
      </div>
      <div className="mt-4 space-y-2">
        {openClawEvents.map((event) => (
          <div key={event.assistant} className="rounded-2xl border border-white/10 bg-black/18 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-white">{event.assistant}</p>
              <span className="h-1.5 w-1.5 rounded-full bg-[#35d6a6]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-xs leading-5 text-white/52">{event.event}</p>
            <p className="mt-1 text-xs font-semibold text-[#aebcff]">{event.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GemmaAgentPanel({
  isListening,
  onToggleListening,
}: {
  isListening: boolean;
  onToggleListening: () => void;
}) {
  return (
    <div className="rounded-[18px] border border-[#4F6EF7]/24 bg-[#4F6EF7]/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
            <Bot className="h-5 w-5 text-[#aebcff]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Clara</p>
            <p className="mt-1 text-xs text-white/42">Gemma agent with canvas permissions</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleListening}
          aria-label={isListening ? 'Stop Clara SaaS voice input' : 'Start Clara SaaS voice input'}
          className={`grid h-10 w-10 place-items-center rounded-2xl border transition ${
            isListening
              ? 'border-[#35d6a6]/60 bg-[#35d6a6]/18 text-[#8df2d3]'
              : 'border-white/12 bg-white/8 text-white/72 hover:border-white/24'
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/22 p-3">
        <p className="text-xs font-semibold uppercase text-white/36">Ask Clara</p>
        <p className="mt-2 text-sm leading-6 text-white/72">
          Find the risks blocking approval and update the canvas with the next action.
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {gemmaActions.map((action) => (
          <button
            key={action}
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2.5 text-left text-xs font-semibold text-white/70 transition hover:border-[#4F6EF7]/36 hover:bg-[#4F6EF7]/12 hover:text-white"
          >
            {action}
            <Send className="h-3.5 w-3.5 shrink-0 text-[#8ea2ff]" />
          </button>
        ))}
      </div>
    </div>
  );
}

function CanvasWorkspace({
  activeView,
  activeNodeId,
  onSelectNode,
}: {
  activeView: CanvasView;
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
}) {
  if (activeView === 'crm') {
    return <AppCRMCanvas />;
  }

  if (activeView === 'risk') {
    return <AppRiskCanvas />;
  }

  return <AppStoryCanvas activeNodeId={activeNodeId} onSelectNode={onSelectNode} />;
}

function JasonAI3LandingPage() {
  useRouteHashScroll();

  return (
    <>
      <Seo
        title="JasonAI-3 Risk Intelligence Platform by B2W"
        description="JasonAI-3 explains the SaaS platform where OpenClaw assistants feed a canvas organized as a story graph, CRM table, and risk tracker powered by Clara, a Gemma agent."
        canonicalPath="/jasonai-3"
      />
      <JasonAI3Background>
        <JasonAI3Header variant="landing" />
        <main className="relative z-10">
          <section className="px-5 pb-20 pt-14 md:pb-24 md:pt-20">
            <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-center">
              <Reveal>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#4F6EF7]/28 bg-[#4F6EF7]/12 px-3 py-1.5 text-sm font-semibold text-[#aebcff]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
                  JasonAI-3
                </p>
                <h1 className="mt-5 text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
                  A SaaS canvas for client risk intelligence.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60 md:text-xl md:leading-9">
                  OpenClaw assistants live inside WhatsApp, email, drives, calendars, and task flows. The platform turns
                  that backend stream into a web app canvas where files can be viewed as a story graph, CRM table, or
                  risk tracker.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/jasonai-3/portal">
                    Open the portal
                    <Network className="h-4 w-4" />
                  </Button>
                  <Button href="#story" variant="ghost">
                    See the system
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Reveal>
              <LandingGraphPreview />
            </div>
          </section>

          <section id="story" className="border-t border-white/10 px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1180px]">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-[#aebcff]">How the story forms</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  OpenClaw feeds the backend. Clara changes the frontend canvas.
                </h2>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {systemLayers.map((layer, index) => (
                  <Reveal
                    key={layer.title}
                    delay={index * 0.05}
                    className="rounded-[24px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur"
                  >
                    <p className="text-sm font-semibold text-[#8df2d3]">0{index + 1}</p>
                    <h3 className="mt-8 text-xl font-semibold text-white">{layer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/56">{layer.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <ChannelSection />
          <PlatformSection />
          <ClaraSection />

          <section className="border-t border-white/10 bg-[#111111] px-5 py-20 md:py-24">
            <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm font-semibold text-[#aebcff]">
                  <ShieldCheck className="h-4 w-4" />
                  Secure client operating layer
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
                  The portal is where the story becomes executable.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/58">
                  Open the portal to use the canvas, switch between story graph, CRM, and risk tracker views, and let
                  Clara take action on behalf of the Contract Owner.
                </p>
              </div>
              <Button href="/jasonai-3/portal" variant="light">
                Open portal
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </JasonAI3Background>
    </>
  );
}

function JasonAI3PortalPage() {
  useRouteHashScroll();

  const [activeNodeId, setActiveNodeId] = useState('wa-change');
  const [activeView, setActiveView] = useState<CanvasView>('story');
  const [isListening, setIsListening] = useState(false);
  const activeNode = storyNodes.find((node) => node.id === activeNodeId) ?? storyNodes[0];

  useEffect(() => {
    if (isListening) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveNodeId((current) => {
        const currentIndex = storyNodes.findIndex((node) => node.id === current);
        return storyNodes[(currentIndex + 1) % storyNodes.length].id;
      });
    }, 5200);

    return () => window.clearInterval(interval);
  }, [isListening]);

  return (
    <>
      <Seo
        title="JasonAI-3 SaaS Portal by B2W"
        description="The JasonAI-3 SaaS portal organizes OpenClaw assistant inputs into a canvas with Story Graph, CRM table, and Risk Tracker views powered by Clara, a Gemma agent."
        canonicalPath="/jasonai-3/portal"
      />
      <div className="min-h-screen bg-[#05070b] text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-[260px] shrink-0 border-r border-white/10 bg-[#090b10] p-4 xl:flex xl:flex-col">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <Workflow className="h-5 w-5 text-[#8ea2ff]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Platform</p>
                <p className="mt-0.5 text-xs text-white/42">JasonAI SaaS workspace</p>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-[#35d6a6]/24 bg-[#35d6a6]/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-[#8df2d3]">Backend ingest</p>
                <span className="h-2 w-2 rounded-full bg-[#35d6a6]" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm leading-6 text-white/64">
                OpenClaw assistants are streaming comms events into the canvas API.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {channels.map(({ name, Icon }) => (
                <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#8ea2ff]" />
                    <span className="text-sm font-medium text-white/70">{name}</span>
                  </div>
                  <span className="text-xs text-[#8df2d3]">live</span>
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-[18px] border border-white/10 bg-black/18 p-3">
              <p className="text-xs font-semibold uppercase text-white/36">Workspace</p>
              <p className="mt-2 text-sm font-semibold text-white">Aster Commercial</p>
              <p className="mt-1 text-xs text-white/42">4 source systems · 218 evidence links</p>
              <a href="/jasonai-3" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#aebcff]">
                Landing page
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col">
            <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#080a0f]/92 px-4 py-3 backdrop-blur-xl lg:px-5">
              <div>
                <p className="text-xs font-semibold uppercase text-white/36">Canvas</p>
                <h1 className="text-lg font-semibold text-white">Risk intelligence workspace</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/58">
                  SaaS app
                </span>
                <span className="rounded-full border border-[#35d6a6]/24 bg-[#35d6a6]/10 px-3 py-1.5 text-xs font-semibold text-[#8df2d3]">
                  OpenClaw API connected
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-semibold text-[#111111]">
                  CO
                </span>
              </div>
            </header>

            <main className="grid min-h-0 flex-1 gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="flex min-h-[760px] min-w-0 flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0d12] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Main canvas</p>
                    <p className="mt-0.5 text-xs text-white/42">One file universe, three operating views.</p>
                  </div>
                  <div className="flex rounded-2xl border border-white/10 bg-white/[0.045] p-1">
                    {[
                      { id: 'story', label: 'Story graph', Icon: Network },
                      { id: 'crm', label: 'CRM', Icon: DatabaseZap },
                      { id: 'risk', label: 'Risk tracker', Icon: ShieldCheck },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveView(id as CanvasView)}
                        className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                          activeView === id ? 'bg-white text-[#111111]' : 'text-white/55 hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="min-h-0 flex-1 p-3">
                  <CanvasWorkspace activeView={activeView} activeNodeId={activeNodeId} onSelectNode={setActiveNodeId} />
                </div>
              </section>

              <aside className="grid min-h-0 gap-3 xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto">
                <GemmaAgentPanel isListening={isListening} onToggleListening={() => setIsListening((current) => !current)} />
                <OpenClawBackendPanel />
                <NodeInspector node={activeNode} />
              </aside>
            </main>
          </section>
        </div>
      </div>
    </>
  );
}

export default function JasonAI3Page({ page = 'landing' }: { page?: 'landing' | 'portal' }) {
  if (page === 'portal') {
    return <JasonAI3PortalPage />;
  }

  return <JasonAI3LandingPage />;
}
