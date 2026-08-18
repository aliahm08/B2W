import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  Headphones,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Mic2,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UsersRound,
  Wrench,
} from 'lucide-react';
import B2WIcon from '../components/logo/B2WIcon';
import Seo from '../components/Seo';
import { getSourceMetadata, submitInternalForm } from '../lib/engagement';

const CALENDLY_URL =
  import.meta.env.VITE_CALENDLY_URL?.trim()
  || 'https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=315e3a';

type ServiceLine = {
  id: string;
  label: string;
  summary: string;
  projects: Array<{
    name: string;
    client: string;
    progress: number;
    status: 'On track' | 'Needs review' | 'Waiting';
    next: string;
    value: string;
  }>;
};

const serviceLines: ServiceLine[] = [
  {
    id: 'new-work',
    label: 'New work',
    summary: 'Leads, site walks, estimates, proposals, and decisions in one view.',
    projects: [
      { name: 'Georgetown Retail Fit-out', client: 'Mercer & Pine', progress: 76, status: 'Needs review', next: 'Approve revised estimate', value: '$128k' },
      { name: 'Silver Spring Office', client: 'Northline Health', progress: 42, status: 'On track', next: 'Site walk · Thu 9:30 AM', value: '$84k' },
    ],
  },
  {
    id: 'active-builds',
    label: 'Active builds',
    summary: 'Schedule, field decisions, change orders, risks, and owner updates.',
    projects: [
      { name: 'North Harbor Renovation', client: 'North Harbor Partners', progress: 72, status: 'On track', next: 'Electrical trim · Thursday', value: '$184k' },
      { name: 'Main Street Buildout', client: 'June & Pine Retail', progress: 48, status: 'Needs review', next: 'Client layout approval', value: '$97k' },
    ],
  },
  {
    id: 'service',
    label: 'Service & maintenance',
    summary: 'Requests, dispatch, technician updates, parts, billing, and renewals.',
    projects: [
      { name: 'Cedar House Service Plan', client: 'Cedar House Group', progress: 34, status: 'Waiting', next: 'Vendor lead time', value: '$42k' },
      { name: 'Portfolio Preventive Care', client: 'Linden Property Co.', progress: 86, status: 'On track', next: 'Linden West · Monday', value: '$72k' },
    ],
  },
  {
    id: 'closeout',
    label: 'Closeout & collections',
    summary: 'Punch lists, documentation, retainage, invoices, and outstanding balances.',
    projects: [
      { name: 'Ballston Lobby Upgrade', client: 'Vela Property Group', progress: 94, status: 'Needs review', next: 'Collect $18,420 balance', value: '$119k' },
      { name: 'Capitol Row MEP', client: 'Forge Development', progress: 88, status: 'On track', next: 'Upload final inspection', value: '$211k' },
    ],
  },
];

const signalLog: Array<{
  source: string;
  icon: ComponentType<{ className?: string }>;
  time: string;
  message: string;
  update: string;
  tone: string;
}> = [
  { source: 'Text message', icon: MessageSquareText, time: 'Now', message: 'Inspection passed. Photos attached.', update: 'Inspection complete · progress +8%', tone: 'text-sky-300 bg-sky-300/10' },
  { source: 'WhatsApp', icon: MessageCircle, time: '3 min', message: 'Millwork will arrive Thursday at 8.', update: 'Delivery confirmed · schedule updated', tone: 'text-emerald-300 bg-emerald-300/10' },
  { source: 'Email', icon: Mail, time: '8 min', message: 'The revised layout is approved.', update: 'Decision closed · 2 tasks released', tone: 'text-amber-200 bg-amber-200/10' },
  { source: 'Call', icon: Phone, time: '12 min', message: 'Client asked to split the final invoice.', update: 'Billing request · owner review', tone: 'text-violet-200 bg-violet-200/10' },
  { source: 'Voicemail', icon: Mic2, time: '18 min', message: 'Need an emergency service visit tomorrow.', update: 'New request · dispatch queue', tone: 'text-rose-200 bg-rose-200/10' },
];

const promptGroups = [
  {
    label: 'Money & agreements',
    icon: CircleDollarSign,
    prompts: [
      'Client X owes me $18,420. Find the agreement we made.',
      'Which invoices are overdue, and what did we promise to follow up on?',
      'Show every approved change order that has not been billed.',
      'What retainage can we collect this month?',
    ],
  },
  {
    label: 'Estimates & new work',
    icon: FileText,
    prompts: [
      'I need a new estimate for a bathroom renovation at 1412 Oak Street.',
      'Build a scope from the site-walk notes, photos, and client messages.',
      'Compare this request with our last three similar jobs.',
      'Which proposals have gone quiet for more than seven days?',
    ],
  },
  {
    label: 'Projects & field',
    icon: Wrench,
    prompts: [
      'What changed across active jobs since yesterday?',
      'Which projects are waiting on a client, vendor, permit, or inspection?',
      'What does the crew need before they arrive tomorrow?',
      'Summarize today’s field updates for each project manager.',
    ],
  },
  {
    label: 'Schedule & team',
    icon: CalendarDays,
    prompts: [
      'Where is the schedule at risk in the next two weeks?',
      'Who is overbooked next week, and which jobs can move?',
      'Find every promise we made with a date attached.',
      'Draft tomorrow morning’s crew assignments.',
    ],
  },
  {
    label: 'Clients & communication',
    icon: UsersRound,
    prompts: [
      'Draft a client update using only confirmed project facts.',
      'What open questions does the client still expect us to answer?',
      'Find the last decision made about the finish package.',
      'Which clients have not heard from us this week?',
    ],
  },
  {
    label: 'Vendors & closeout',
    icon: FileCheck2,
    prompts: [
      'Which materials are late, and which jobs do they affect?',
      'Show missing warranties, lien releases, and closeout documents.',
      'What remains before the Ballston job can be closed?',
      'Prepare the final handoff checklist with sources attached.',
    ],
  },
];

const setupSteps = [
  { number: '01', title: 'Communication assessment', body: 'We map how work really moves today—what is digital, what can be digitized, and which communication gaps cost the team the most time.', detail: 'Channels · handoffs · privacy boundaries' },
  { number: '02', title: 'Secure channel connection', body: 'With your approval, we connect only the channels and records you choose to a private data log. Access stays scoped to your business.', detail: 'Permissioned sources · controlled access' },
  { number: '03', title: 'Test with real work', body: 'We run a controlled test on a small set of representative projects and verify that messages, calls, documents, and updates land correctly.', detail: 'Source matching · accuracy review' },
  { number: '04', title: 'Build the useful workflows', body: 'Together, we choose a handful of valuable use cases and confirm each one works from incoming signal to action, document, or dashboard update.', detail: 'Use cases · end-to-end validation' },
  { number: '05', title: 'Private deployment', body: 'We finalize the rules, invite your users, and deploy a private B2W dashboard your team can use in the office or the field.', detail: 'Team access · launch · support' },
];

const statusTone = {
  'On track': 'bg-[#dce9dc] text-[#315e3a]',
  'Needs review': 'bg-[#f0e4bd] text-[#75570f]',
  Waiting: 'bg-[#e6e1ea] text-[#675472]',
} as const;

function SectionIntro({ eyebrow, title, body, inverse = false }: { eyebrow: string; title: string; body: string; inverse?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={`font-mono text-[10px] font-semibold uppercase tracking-[.2em] ${inverse ? 'text-[#9fc2a2]' : 'text-[#46744d]'}`}>{eyebrow}</p>
      <h2 className={`mt-5 text-4xl font-medium leading-[1.02] tracking-[-.05em] sm:text-6xl ${inverse ? 'text-white' : 'text-[#172019]'}`}>{title}</h2>
      <p className={`mt-6 max-w-2xl text-base leading-8 ${inverse ? 'text-white/55' : 'text-black/55'}`}>{body}</p>
    </div>
  );
}

function PlatformWorkspace() {
  const [activeLine, setActiveLine] = useState(serviceLines[1]);
  const [signalIndex, setSignalIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setSignalIndex((current) => (current + 1) % signalLog.length), 2800);
    return () => window.clearInterval(interval);
  }, []);

  const activeSignal = signalLog[signalIndex];

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f1511] shadow-[0_50px_140px_rgba(0,0,0,.5)]">
      <div className="flex min-h-14 items-center justify-between border-b border-white/10 px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#dfe9d8] text-[#17321f]"><B2WIcon className="h-4 w-4" title="" /></span>
          <div><p className="text-xs font-semibold text-white">B2W <span className="mx-1 text-white/20">/</span> Fieldstone Services</p><p className="text-[8px] uppercase tracking-[.14em] text-white/30">Unified operating system</p></div>
        </div>
        <span className="inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[.14em] text-[#9fc2a2]"><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-[#8fbd9b] opacity-40" /><span className="relative h-2 w-2 rounded-full bg-[#8fbd9b]" /></span>Live</span>
      </div>

      <div className="grid lg:grid-cols-[150px_minmax(0,1fr)_230px]">
        <aside className="hidden border-r border-white/10 bg-[#121a14] p-3 lg:flex lg:flex-col">
          <p className="px-2 py-2 font-mono text-[8px] uppercase tracking-[.16em] text-white/25">Service lines</p>
          <nav className="mt-1 space-y-1">
            {serviceLines.map((line) => (
              <button key={line.id} type="button" onClick={() => setActiveLine(line)} className={`flex min-h-10 w-full items-center gap-2 px-2 text-left text-[10px] font-semibold transition ${activeLine.id === line.id ? 'bg-[#dfe9d8] text-[#17321f]' : 'text-white/38 hover:bg-white/5 hover:text-white'}`}>
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="min-w-0 truncate">{line.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto border border-[#9fc2a2]/20 bg-[#9fc2a2]/5 p-3"><p className="text-[8px] uppercase tracking-[.14em] text-[#9fc2a2]">Data state</p><p className="mt-2 text-[10px] font-semibold text-white/65">5 channels connected</p><p className="mt-1 text-[8px] leading-4 text-white/25">Sources and update history retained.</p></div>
        </aside>

        <div className="min-w-0 bg-[#f4f4ef] p-3 text-[#172019] sm:p-4">
          <div className="flex gap-1 overflow-x-auto pb-3 lg:hidden">
            {serviceLines.map((line) => <button key={line.id} type="button" onClick={() => setActiveLine(line)} className={`shrink-0 px-3 py-2 text-[9px] font-semibold ${activeLine.id === line.id ? 'bg-[#172019] text-white' : 'border border-black/10 bg-white text-black/45'}`}>{line.label}</button>)}
          </div>
          <div className="flex flex-col gap-3 border-b border-black/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="font-mono text-[8px] uppercase tracking-[.17em] text-black/30">Portfolio view</p><AnimatePresence mode="wait"><motion.h3 key={activeLine.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-1 text-2xl font-semibold tracking-[-.04em] text-[#172019]">{activeLine.label}</motion.h3></AnimatePresence><p className="mt-1 max-w-lg text-[10px] leading-4 text-black/40">{activeLine.summary}</p></div>
            <div className="flex gap-px bg-black/10"><div className="bg-white px-3 py-2"><p className="text-[7px] uppercase tracking-[.12em] text-black/28">Active value</p><p className="mt-1 text-sm font-semibold">$281k</p></div><div className="bg-white px-3 py-2"><p className="text-[7px] uppercase tracking-[.12em] text-black/28">Needs review</p><p className="mt-1 text-sm font-semibold">01</p></div></div>
          </div>
          <div className="mt-3 space-y-2">
            <AnimatePresence mode="popLayout">
              {activeLine.projects.map((project, index) => (
                <motion.article key={`${activeLine.id}-${project.name}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .08 }} className="border border-black/10 bg-white p-3 sm:p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold text-[#172019]">{project.name}</p><span className={`rounded-full px-2 py-1 text-[7px] font-semibold uppercase tracking-[.1em] ${statusTone[project.status]}`}>{project.status}</span></div><p className="mt-1 text-[9px] text-black/35">{project.client} · {project.value}</p></div><p className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#46744d]"><ChevronRight className="h-3 w-3" />{project.next}</p></div>
                  <div className="mt-4 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/7"><motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: .8, ease: 'easeOut' }} className="h-full rounded-full bg-[#56825a]" /></div><span className="font-mono text-[8px] text-black/35">{project.progress}%</span></div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-px bg-black/10"><div className="bg-white p-3"><p className="text-[7px] uppercase tracking-[.12em] text-black/28">Open actions</p><p className="mt-1 text-lg font-semibold">12</p></div><div className="bg-white p-3"><p className="text-[7px] uppercase tracking-[.12em] text-black/28">Due this week</p><p className="mt-1 text-lg font-semibold">07</p></div><div className="bg-white p-3"><p className="text-[7px] uppercase tracking-[.12em] text-black/28">On-time</p><p className="mt-1 text-lg font-semibold">91%</p></div></div>
        </div>

        <aside className="border-t border-white/10 bg-[#121a14] p-4 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between"><div><p className="font-mono text-[8px] uppercase tracking-[.16em] text-white/25">Live communication log</p><p className="mt-1 text-[11px] font-semibold text-white/70">Signals becoming work</p></div><Activity className="h-4 w-4 text-[#9fc2a2]" /></div>
          <div className="mt-4 min-h-48">
            <AnimatePresence mode="wait">
              <motion.div key={activeSignal.source} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} className="border border-white/10 bg-white/[.035] p-3">
                <div className="flex items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-full ${activeSignal.tone}`}><activeSignal.icon className="h-3.5 w-3.5" /></span><div><p className="text-[8px] font-semibold uppercase tracking-[.13em] text-white/50">{activeSignal.source}</p><p className="text-[7px] text-white/22">{activeSignal.time}</p></div></div>
                <p className="mt-3 text-[11px] leading-5 text-white/68">“{activeSignal.message}”</p>
                <div className="my-3 h-px bg-white/10" />
                <p className="flex gap-2 text-[9px] leading-4 text-[#9fc2a2]"><Sparkles className="mt-0.5 h-3 w-3 shrink-0" />{activeSignal.update}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex justify-between gap-1">{signalLog.map((signal, index) => <button key={signal.source} type="button" aria-label={`Show ${signal.source}`} onClick={() => setSignalIndex(index)} className={`h-1 flex-1 rounded-full transition ${index === signalIndex ? 'bg-[#9fc2a2]' : 'bg-white/10'}`} />)}</div>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4"><p className="flex items-center gap-2 text-[8px] leading-4 text-white/25"><ShieldCheck className="h-3.5 w-3.5 text-[#9fc2a2]" />Every visible fact keeps its source, time, and update history.</p></div>
        </aside>
      </div>
    </div>
  );
}

function PromptLibrary() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState(promptGroups[0].prompts[0]);
  const [showAnswer, setShowAnswer] = useState(true);

  function choosePrompt(prompt: string) {
    setShowAnswer(false);
    setSelectedPrompt(prompt);
    window.setTimeout(() => setShowAnswer(true), 180);
  }

  function chooseGroup(index: number) {
    setActiveGroup(index);
    choosePrompt(promptGroups[index].prompts[0]);
  }

  const active = promptGroups[activeGroup];

  return (
    <div className="mt-12 grid overflow-hidden border border-black/10 bg-white shadow-[0_30px_80px_rgba(23,32,25,.08)] lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-black/10 bg-[#eef0ea] p-3 lg:border-b-0 lg:border-r">
        <p className="px-3 py-3 font-mono text-[9px] uppercase tracking-[.17em] text-black/30">Ask by requirement</p>
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {promptGroups.map((group, index) => {
            const Icon = group.icon;
            return <button key={group.label} type="button" onClick={() => chooseGroup(index)} className={`flex min-h-12 items-center gap-3 px-3 text-left text-xs font-semibold transition ${index === activeGroup ? 'bg-[#172019] text-white' : 'text-black/45 hover:bg-white hover:text-black'}`}><Icon className={`h-4 w-4 ${index === activeGroup ? 'text-[#9fc2a2]' : 'text-[#46744d]'}`} />{group.label}<ChevronRight className="ml-auto h-3.5 w-3.5 opacity-35" /></button>;
          })}
        </div>
      </aside>
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[.17em] text-[#46744d]">{active.label}</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Ask it like you would ask your team.</h3></div><Search className="hidden h-5 w-5 text-black/20 sm:block" /></div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {active.prompts.map((prompt) => <button key={prompt} type="button" onClick={() => choosePrompt(prompt)} className={`min-h-24 border p-4 text-left text-xs leading-5 transition ${prompt === selectedPrompt ? 'border-[#56825a] bg-[#edf4eb] text-[#17321f]' : 'border-black/10 bg-white text-black/55 hover:border-black/25'}`}>{prompt}</button>)}
        </div>
        <div className="mt-6 rounded-[1.4rem] bg-[#172019] p-4 text-white sm:p-6">
          <div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/7"><Send className="h-4 w-4 text-[#9fc2a2]" /></span><div><p className="text-[8px] uppercase tracking-[.14em] text-white/30">You asked</p><p className="mt-2 text-sm leading-6 text-white/80">{selectedPrompt}</p></div></div>
          <AnimatePresence mode="wait">{showAnswer ? <motion.div key={selectedPrompt} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 border-l-2 border-[#8fbd9b] pl-4"><p className="text-[8px] uppercase tracking-[.14em] text-[#9fc2a2]">B2W response preview</p><p className="mt-2 text-xs leading-6 text-white/55">I found the relevant project records and organized the answer with its source messages, documents, dates, and next action. Review the linked evidence before sending or updating the project.</p><p className="mt-3 inline-flex items-center gap-2 text-[9px] font-semibold text-[#9fc2a2]"><Link2 className="h-3 w-3" />3 approved sources attached</p></motion.div> : null}</AnimatePresence>
        </div>
      </div>
    </div>
  );
}

type IntakeState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceLine: string;
  channels: string;
  websiteUrl: string;
};

const initialIntake: IntakeState = { name: '', email: '', company: '', phone: '', serviceLine: 'Project tracking', channels: '', websiteUrl: '' };

function BookingWrapper() {
  const [intake, setIntake] = useState(initialIntake);
  const [stage, setStage] = useState<'intake' | 'calendar'>('intake');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');

  const calendarUrl = useMemo(() => {
    const url = new URL(CALENDLY_URL);
    url.searchParams.set('embed_domain', typeof window === 'undefined' ? 'www.b2w-ai.com' : window.location.hostname);
    url.searchParams.set('embed_type', 'Inline');
    url.searchParams.set('name', intake.name);
    url.searchParams.set('email', intake.email);
    url.searchParams.set('a1', intake.company);
    return url.toString();
  }, [intake.company, intake.email, intake.name]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    const message = [
      `Primary workflow: ${intake.serviceLine}`,
      `Current channels: ${intake.channels.trim() || 'Not specified'}`,
      'Requested a free B2W unified platform demo and communication assessment.',
    ].join('\n\n');

    const result = await submitInternalForm('/api/contact-lead', {
      name: intake.name.trim(),
      email: intake.email.trim(),
      company: intake.company.trim(),
      phone: intake.phone.trim(),
      website: '',
      inquiryType: 'B2W Unified Platform Demo',
      normalizedProjectArea: 'Unified Contractor Platform',
      projectAreas: [intake.serviceLine],
      message,
      websiteUrl: intake.websiteUrl,
      ...getSourceMetadata({ formType: 'unified_platform_demo', sourcePage: 'B2W Unified Platform' }),
    });

    if (!result.ok) {
      setStatus('error');
      setError(result.error || 'Unable to save your request right now.');
      return;
    }

    setStatus('idle');
    setStage('calendar');
  }

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0f1511] shadow-[0_45px_120px_rgba(0,0,0,.35)]">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div><p className="font-mono text-[9px] uppercase tracking-[.17em] text-[#9fc2a2]">Free demo · 30 minutes</p><p className="mt-1 text-sm font-semibold text-white">Start with one real contractor workflow.</p></div>
        <div className="flex items-center gap-2 text-[9px] text-white/35"><span className={`grid h-6 w-6 place-items-center rounded-full ${stage === 'intake' ? 'bg-[#dfe9d8] text-[#17321f]' : 'bg-[#56825a] text-white'}`}>{stage === 'calendar' ? <Check className="h-3 w-3" /> : '1'}</span><span>Your workflow</span><span className="h-px w-6 bg-white/15" /><span className={`grid h-6 w-6 place-items-center rounded-full ${stage === 'calendar' ? 'bg-[#dfe9d8] text-[#17321f]' : 'bg-white/7 text-white/35'}`}>2</span><span>Choose a time</span></div>
      </div>

      {stage === 'intake' ? (
        <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
          <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/45">Name</span><input required autoComplete="name" value={intake.name} onChange={(event) => setIntake((current) => ({ ...current, name: event.target.value }))} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#9fc2a2]" placeholder="Your name" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/45">Work email</span><input required type="email" autoComplete="email" value={intake.email} onChange={(event) => setIntake((current) => ({ ...current, email: event.target.value }))} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#9fc2a2]" placeholder="you@company.com" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/45">Company</span><input required autoComplete="organization" value={intake.company} onChange={(event) => setIntake((current) => ({ ...current, company: event.target.value }))} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#9fc2a2]" placeholder="Contracting business" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/45">Phone</span><input required type="tel" autoComplete="tel" value={intake.phone} onChange={(event) => setIntake((current) => ({ ...current, phone: event.target.value }))} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#9fc2a2]" placeholder="(555) 555-5555" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/45">First workflow to improve</span><select value={intake.serviceLine} onChange={(event) => setIntake((current) => ({ ...current, serviceLine: event.target.value }))} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#18201a] px-4 text-sm text-white outline-none focus:border-[#9fc2a2]"><option>Project tracking</option><option>Estimating & proposals</option><option>Scheduling & dispatch</option><option>Client communication</option><option>Billing & collections</option><option>Closeout & documentation</option></select></label>
          <label className="block"><span className="mb-2 block text-[10px] font-semibold uppercase tracking-[.12em] text-white/45">Channels you use now</span><input value={intake.channels} onChange={(event) => setIntake((current) => ({ ...current, channels: event.target.value }))} className="min-h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#9fc2a2]" placeholder="Text, WhatsApp, Gmail…" /></label>
          <label className="hidden" aria-hidden="true"><span>Leave this field empty</span><input tabIndex={-1} autoComplete="off" value={intake.websiteUrl} onChange={(event) => setIntake((current) => ({ ...current, websiteUrl: event.target.value }))} /></label>
          {status === 'error' ? <p className="sm:col-span-2 rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-[10px] leading-5 text-white/28">Submitting saves your request to B2W’s private Supabase intake log and emails the connected B2W team inbox. No payment is required.</p><button disabled={status === 'submitting'} type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dfe9d8] px-6 text-sm font-semibold text-[#17321f] transition hover:bg-white disabled:opacity-60">{status === 'submitting' ? 'Saving your request…' : 'Continue to calendar'}<ArrowRight className="h-4 w-4" /></button></div>
        </form>
      ) : (
        <div className="bg-white">
          <div className="flex flex-col gap-3 border-b border-black/10 bg-[#edf4eb] px-5 py-4 text-[#17321f] sm:flex-row sm:items-center sm:justify-between sm:px-7"><p className="flex items-center gap-2 text-xs font-semibold"><CheckCircle2 className="h-4 w-4" />Your workflow request is saved. Choose a demo time.</p><button type="button" onClick={() => setStage('intake')} className="text-left text-[10px] font-semibold underline underline-offset-4 sm:text-right">Edit details</button></div>
          <iframe title="Schedule a free B2W contractor platform demo" src={calendarUrl} className="h-[760px] w-full bg-white" loading="lazy" />
          <div className="border-t border-black/10 px-5 py-4 text-center"><a href={calendarUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#315e3a] underline underline-offset-4">Having trouble with the calendar? Open Calendly in a new tab.</a></div>
        </div>
      )}
    </div>
  );
}

export default function UnifiedPlatformPage() {
  return (
    <div className="min-h-screen bg-[#f4f4ef] text-[#172019] selection:bg-[#172019] selection:text-white">
      <Seo title="B2W V5 — Unified Contractor Platform" description="Versioned preview of the B2W contractor platform for connected communication, project workflows, documents, and live operating dashboards." canonicalPath="/v5" robots="noindex, nofollow" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0f1511]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="#top" aria-label="B2W platform preview home" className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#dfe9d8] text-[#17321f]"><B2WIcon className="h-4 w-4" title="" /></span><span><span className="block text-sm font-semibold tracking-[-.02em]">B2W</span><span className="block font-mono text-[7px] uppercase tracking-[.17em] text-white/30">Unified platform</span></span></a>
          <nav aria-label="Platform preview" className="hidden items-center gap-6 text-[10px] font-semibold text-white/45 md:flex"><a className="transition hover:text-white" href="#platform">Platform</a><a className="transition hover:text-white" href="#ask">What you can ask</a><a className="transition hover:text-white" href="#setup">Setup</a><a className="transition hover:text-white" href="#pricing">Pricing</a></nav>
          <a href="#book" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#dfe9d8] px-4 text-[11px] font-semibold text-[#17321f]">Book a free demo<ArrowRight className="h-3.5 w-3.5" /></a>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-[#101713] pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
          <div aria-hidden="true" className="b2w-dark-grid-field absolute inset-0 opacity-70" />
          <motion.div aria-hidden="true" animate={{ x: ['-15%', '12%', '-15%'], y: ['0%', '8%', '0%'] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-[#6b936e]/18 blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-[#9fc2a2]/25 bg-[#9fc2a2]/8 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-[#b5ceb4]">B2W for contractors</span><span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/30">Private platform preview</span></div>
                <motion.h1 initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .65 }} className="mt-7 max-w-[10ch] text-5xl font-medium leading-[.94] tracking-[-.06em] sm:text-7xl lg:text-[5.4rem]">Every project signal. One operating system.</motion.h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-white/55 sm:text-lg">B2W combines your communication, project data, working documents, and dashboards in one private program—so every service line has a current status, a clear next step, and the source behind it.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#book" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#dfe9d8] px-6 text-sm font-semibold text-[#17321f]">Book your free demo<ArrowRight className="h-4 w-4" /></a><a href="#platform" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white/70">See the whole workflow<ChevronRight className="h-4 w-4" /></a></div>
                <div className="mt-9 grid gap-3 text-[10px] text-white/35 sm:grid-cols-3">{['Built around your workflow', 'Source-linked answers', 'Private team dashboard'].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8fbd9b]" />{item}</span>)}</div>
              </div>
              <motion.div initial={{ opacity: 0, y: 28, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .75, delay: .15 }}><PlatformWorkspace /></motion.div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white"><div className="mx-auto grid max-w-7xl gap-px bg-black/10 sm:grid-cols-3"><div className="bg-white px-6 py-8 sm:px-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#46744d]">One data log</p><p className="mt-3 text-lg font-semibold">Communication becomes organized project history.</p></div><div className="bg-white px-6 py-8 sm:px-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#46744d]">One program</p><p className="mt-3 text-lg font-semibold">Ask, draft, track, review, and act in the same place.</p></div><div className="bg-white px-6 py-8 sm:px-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#46744d]">One dashboard</p><p className="mt-3 text-lg font-semibold">Every service line rolls into a live owner view.</p></div></div></section>

        <section id="platform" className="scroll-mt-20 bg-[#f4f4ef] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionIntro eyebrow="The complete workflow" title="Your team keeps working. B2W keeps the record current." body="Texts, WhatsApp messages, emails, calls, voicemails, schedules, and project files feed one approved data log. B2W connects each signal to the right project and turns it into something useful." />
            <div className="relative mt-12 grid gap-3 md:grid-cols-5">
              <div aria-hidden="true" className="b2w-signal-line absolute left-[8%] right-[8%] top-12 hidden h-px md:block" />
              {[
                { icon: MessageSquareText, label: 'Text', detail: 'Crew + client' },
                { icon: MessageCircle, label: 'WhatsApp', detail: 'Approved groups' },
                { icon: Mail, label: 'Email', detail: 'Inbox + threads' },
                { icon: Headphones, label: 'Calls', detail: 'Notes + outcomes' },
                { icon: Mic2, label: 'Voicemail', detail: 'Audio + transcript' },
              ].map(({ icon: Icon, label, detail }, index) => <motion.div key={label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ delay: index * .08 }} className="relative border border-black/10 bg-white p-5"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#edf4eb] text-[#315e3a]"><Icon className="h-5 w-5" /></span><p className="mt-5 text-sm font-semibold">{label}</p><p className="mt-1 text-[10px] text-black/35">{detail}</p><p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-[#46744d]"><Check className="h-3 w-3" />Connected signal</p></motion.div>)}
            </div>
            <div className="mt-3 grid gap-px bg-black/10 lg:grid-cols-3"><div className="bg-[#172019] p-7 text-white"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#9fc2a2]">01 · Understand</p><h3 className="mt-4 text-2xl font-semibold tracking-[-.035em]">B2W identifies what changed.</h3><p className="mt-3 text-sm leading-6 text-white/45">Project, owner, date, status, cost, decision, and dependency are resolved from the approved source.</p></div><div className="bg-[#dfe9d8] p-7"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#315e3a]">02 · Update</p><h3 className="mt-4 text-2xl font-semibold tracking-[-.035em]">The right record moves.</h3><p className="mt-3 text-sm leading-6 text-black/50">Progress changes, an action opens, a document is drafted, or a deadline is escalated for review.</p></div><div className="bg-white p-7"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#46744d]">03 · Verify</p><h3 className="mt-4 text-2xl font-semibold tracking-[-.035em]">The source stays attached.</h3><p className="mt-3 text-sm leading-6 text-black/50">Your team can trace an answer back to the exact message, call note, email, or file behind it.</p></div></div>
          </div>
        </section>

        <section id="ask" className="scroll-mt-20 border-y border-black/10 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><SectionIntro eyebrow="Ask the business" title="Use the questions contractors already ask every day." body="B2W searches across the approved project record, then returns a concise answer with evidence. Choose a requirement below to preview the range of questions your team can ask." /><PromptLibrary /></div>
        </section>

        <section id="setup" className="scroll-mt-20 bg-[#172019] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><SectionIntro eyebrow="How setup works" title="Start safely. Prove the workflow. Then deploy." body="We do not ask your team to change everything at once. Setup begins with the communication you already use and expands only after the test works end to end." inverse />
            <div className="mt-12 border-y border-white/10">
              {setupSteps.map((step, index) => <motion.article key={step.number} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .5 }} transition={{ delay: index * .06 }} className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 md:grid-cols-[90px_minmax(200px,.7fr)_1fr_auto] md:items-center"><span className="font-mono text-sm text-[#9fc2a2]">{step.number}</span><h3 className="text-xl font-semibold tracking-[-.025em]">{step.title}</h3><p className="max-w-xl text-sm leading-7 text-white/45">{step.body}</p><span className="w-fit rounded-full border border-white/10 px-3 py-2 text-[8px] font-semibold uppercase tracking-[.12em] text-white/35">{step.detail}</span></motion.article>)}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">{[{ icon: ShieldCheck, title: 'Scoped access', body: 'Only approved channels and records are connected.' }, { icon: Search, title: 'Testable answers', body: 'Outputs keep links to the information behind them.' }, { icon: Smartphone, title: 'Private workspace', body: 'Your users receive their own team dashboard.' }].map(({ icon: Icon, title, body }) => <div key={title} className="border border-white/10 bg-white/[.025] p-5"><Icon className="h-5 w-5 text-[#9fc2a2]" /><p className="mt-4 text-sm font-semibold">{title}</p><p className="mt-2 text-xs leading-5 text-white/35">{body}</p></div>)}</div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 bg-[#e7eadf] py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-10">
            <div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#46744d]">Simple pricing</p><h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-.05em] sm:text-6xl">One setup. One monthly plan. Your whole workflow.</h2><p className="mt-6 max-w-xl text-base leading-8 text-black/55">We configure B2W around the channels, service lines, and questions your business actually needs—then support your team as the workflow goes live.</p><div className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#315e3a] px-4 py-2 text-[10px] font-semibold uppercase tracking-[.13em] text-white"><MapPin className="h-3.5 w-3.5" />DMV contractor summer discounts available</div></div>
            <div className="overflow-hidden rounded-[1.7rem] border border-black/10 bg-white shadow-[0_35px_100px_rgba(23,32,25,.12)]"><div className="grid sm:grid-cols-2"><div className="border-b border-black/10 p-7 sm:border-b-0 sm:border-r sm:p-9"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-black/35">Private B2W platform</p><div className="mt-6 flex items-end gap-2"><span className="text-6xl font-medium tracking-[-.06em]">$99</span><span className="pb-2 text-sm text-black/40">/ month</span></div><p className="mt-3 text-xs text-black/40">Cancel any time.</p><div className="mt-7 border-t border-black/10 pt-6"><p className="text-[9px] uppercase tracking-[.13em] text-black/30">One-time setup</p><p className="mt-2 text-3xl font-semibold tracking-[-.04em]">$1,500</p></div></div><div className="bg-[#172019] p-7 text-white sm:p-9"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#9fc2a2]">What is included</p><ul className="mt-6 space-y-4">{['Communication assessment', 'Secure channel connections', 'Controlled workflow testing', 'Private team dashboard', 'Money-back guarantee'].map((item) => <li key={item} className="flex gap-3 text-sm text-white/65"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9fc2a2]" />{item}</li>)}</ul><a href="#book" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#dfe9d8] px-5 text-sm font-semibold text-[#17321f]">Start with a free demo<ArrowRight className="h-4 w-4" /></a></div></div><div className="border-t border-black/10 bg-[#f7f7f2] px-7 py-4 text-[10px] leading-5 text-black/42 sm:px-9">No long-term contract. Ask about current DMV setup discounts and the terms of the money-back guarantee during your demo.</div></div>
          </div>
        </section>

        <section id="book" className="scroll-mt-20 bg-[#101713] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10"><div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div className="lg:sticky lg:top-28"><p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#9fc2a2]">Book your free demo</p><h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-.05em] sm:text-5xl">Bring us one workflow that keeps falling through the cracks.</h2><p className="mt-6 text-base leading-8 text-white/50">We’ll map where the information lives today, show how it can feed the platform, and identify the smallest useful place to start.</p><div className="mt-8 space-y-4 text-xs text-white/38"><p className="flex gap-3"><Clock3 className="h-4 w-4 shrink-0 text-[#9fc2a2]" />30-minute working demo</p><p className="flex gap-3"><ShieldCheck className="h-4 w-4 shrink-0 text-[#9fc2a2]" />No channel connection required for the demo</p><p className="flex gap-3"><CalendarDays className="h-4 w-4 shrink-0 text-[#9fc2a2]" />Choose a time directly after the intake</p></div></div><BookingWrapper /></div></div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#0b0f0c] px-5 py-8 text-white/35"><div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><B2WIcon className="h-5 w-5 text-[#9fc2a2]" title="" /><p className="text-xs font-semibold text-white/65">B2W · Contractor operating intelligence</p></div><div className="flex flex-wrap gap-5 text-[10px]"><a className="hover:text-white" href="mailto:info@b2w-ai.com">info@b2w-ai.com</a><span>Private platform preview</span><span>© {new Date().getFullYear()} B2W</span></div></div></footer>
    </div>
  );
}
