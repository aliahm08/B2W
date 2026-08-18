import { useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  HardDriveDownload,
  History,
  Link2,
  Mail,
  MessageCircle,
  MessageSquareText,
  Monitor,
  Search,
  Save,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRoundCheck,
  UsersRound,
  WandSparkles,
  Wifi,
  X,
} from 'lucide-react';
import { HomeSiteFooter } from '../components/HomeSiteChrome';
import { LiveSiteHeader, V2SiteHeader } from '../components/V2SiteChrome';
import DescrambleText from '../components/DescrambleText';
import GurgeIcon from '../components/gurge/GurgeIcon';
import Seo from '../components/Seo';

type WorkspaceView = 'today' | 'jobs' | 'schedule' | 'inbox' | 'ai' | 'custom';
type JobStatus = 'On track' | 'Needs review' | 'Blocked';
type JobTask = { id: string; label: string; done: boolean; source: string; updated: string };
type Job = {
  id: string;
  name: string;
  customer: string;
  location: string;
  status: JobStatus;
  owner: string;
  due: string;
  value: string;
  progress: number;
  update: string;
  tasks: JobTask[];
};

const viewPath: Record<WorkspaceView, string> = {
  today: 'today',
  jobs: 'jobs',
  schedule: 'schedule',
  inbox: 'inbox',
  ai: 'create-view',
  custom: 'client-decision-risk',
};

const initialJobs: Job[] = [
  {
    id: 'north-harbor',
    name: 'North Harbor Renovation',
    customer: 'North Harbor Partners',
    location: '44 Harbor Street',
    status: 'On track',
    owner: 'Maya Torres',
    due: 'Aug 23',
    value: '$184,200',
    progress: 72,
    update: 'Millwork is confirmed. Electrical trim begins Thursday.',
    tasks: [
      { id: 'nh-1', label: 'Confirm millwork delivery', done: true, source: 'Vendor email', updated: '18 min ago' },
      { id: 'nh-2', label: 'Upload electrical inspection', done: true, source: 'Crew text', updated: '24 min ago' },
      { id: 'nh-3', label: 'Approve finish schedule', done: false, source: 'Client email', updated: 'Waiting' },
      { id: 'nh-4', label: 'Send customer Friday update', done: false, source: 'Project rule', updated: 'Due Friday' },
    ],
  },
  {
    id: 'main-street',
    name: 'Main Street Buildout',
    customer: 'June & Pine Retail',
    location: '218 Main Street',
    status: 'Needs review',
    owner: 'Avery Reed',
    due: 'Aug 16',
    value: '$96,800',
    progress: 48,
    update: 'Customer requested a revised back-counter layout. Approval is open.',
    tasks: [
      { id: 'ms-1', label: 'Price layout change', done: true, source: 'Estimator email', updated: '8:42 AM' },
      { id: 'ms-2', label: 'Get customer approval', done: false, source: 'Client message', updated: 'Waiting' },
      { id: 'ms-3', label: 'Issue revised field set', done: false, source: 'Dependency rule', updated: 'After approval' },
      { id: 'ms-4', label: 'Confirm plumber availability', done: false, source: 'PM text', updated: 'Due today' },
    ],
  },
  {
    id: 'cedar-service',
    name: 'Cedar House Service Plan',
    customer: 'Cedar House Group',
    location: '3 managed locations',
    status: 'Blocked',
    owner: 'Sam Khan',
    due: 'Aug 14',
    value: '$42,000',
    progress: 34,
    update: 'Two replacement units are waiting on vendor confirmation.',
    tasks: [
      { id: 'cs-1', label: 'Complete site walk', done: true, source: 'Field text', updated: 'Yesterday' },
      { id: 'cs-2', label: 'Confirm equipment lead time', done: false, source: 'Vendor email', updated: 'Waiting' },
      { id: 'cs-3', label: 'Revise dispatch plan', done: false, source: 'Dependency rule', updated: 'After lead time' },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio Preventive Maintenance',
    customer: 'Linden Property Co.',
    location: '8 managed properties',
    status: 'On track',
    owner: 'Jordan Ellis',
    due: 'Sep 02',
    value: '$71,500',
    progress: 86,
    update: 'Seven locations are complete. Linden West is scheduled Monday.',
    tasks: [
      { id: 'pm-1', label: 'Close seven completed visits', done: true, source: 'Technician texts', updated: '38 min ago' },
      { id: 'pm-2', label: 'Confirm Linden West access', done: true, source: 'Client email', updated: '1 hr ago' },
      { id: 'pm-3', label: 'Publish portfolio report', done: false, source: 'Portfolio rule', updated: 'Friday' },
    ],
  },
];

const statusStyle: Record<JobStatus, string> = {
  'On track': 'bg-[#dce9dc] text-[#315e3a]',
  'Needs review': 'bg-[#f0e4bd] text-[#75570f]',
  Blocked: 'bg-[#f2d9d4] text-[#8e3327]',
};

function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.12em] ${statusStyle[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

const workspaceNav: Array<{ id: WorkspaceView; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: 'today', label: 'Today', icon: BarChart3 },
  { id: 'jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'inbox', label: 'Inbox', icon: MessageSquareText },
  { id: 'ai', label: 'Create a view', icon: Sparkles },
];

function Metric({ label, value, detail, tone = 'green' }: { label: string; value: string; detail: string; tone?: 'green' | 'gold' | 'red' }) {
  const dots = { green: 'bg-[#4f7f52]', gold: 'bg-[#d2ad45]', red: 'bg-[#c85b4d]' };
  return <div className="min-w-0 border-r border-[#e2e2dc] bg-white p-4 last:border-r-0"><span className={`block h-2 w-2 rounded-full ${dots[tone]}`} /><p className="mt-4 font-mono text-2xl font-medium tracking-tight text-[#171a18]">{value}</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[.13em] text-black/35">{label}</p><p className="mt-2 truncate text-[10px] text-black/40">{detail}</p></div>;
}

function TodayView({ jobs, openJob }: { jobs: Job[]; openJob: (job: Job) => void }) {
  const openTasks = jobs.flatMap((job) => job.tasks).filter((task) => !task.done).length;
  const liveSignals = [
    { icon: MessageCircle, source: 'Crew text', title: 'Electrical inspection passed', detail: 'North Harbor · marked complete', time: 'Now' },
    { icon: Mail, source: 'Client email', title: 'Revised layout requested', detail: 'Main Street · approval opened', time: '8 min' },
    { icon: MessageSquareText, source: 'PM update', title: 'Plumber confirmed for Thursday', detail: 'Main Street · schedule protected', time: '14 min' },
  ];
  return (
    <div className="space-y-4">
      <header className="border-b border-[#d9d9d2] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-black/35">Owner view · Delivery + accountability</p><h3 className="mt-2 text-3xl font-medium tracking-[-.04em] sm:text-4xl">Today’s view.</h3></div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#bcd0bd] bg-[#edf4eb] px-3 py-2 text-[9px] font-semibold uppercase tracking-[.13em] text-[#315e3a]"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4f7f52] opacity-40" /><span className="relative h-2 w-2 rounded-full bg-[#4f7f52]" /></span>AI maintained · live</span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-black/48">The schedule is healthy. Main Street needs one client approval; every other active job is moving from confirmed field and customer updates.</p>
      </header>
      <div className="grid grid-cols-2 overflow-hidden border border-[#e2e2dc] lg:grid-cols-4">
        <Metric label="Active jobs" value={String(jobs.length)} detail="$394.5k active value" />
        <Metric label="Open actions" value={String(openTasks)} detail="AI reconciled · now" tone="gold" />
        <Metric label="Needs review" value="2" detail="1 client decision" tone="red" />
        <Metric label="On-time rate" value="91%" detail="Across confirmed dates" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]">
        <section className="border border-[#e2e2dc] bg-white">
          <div className="flex items-center justify-between border-b border-[#e2e2dc] px-4 py-4 sm:px-5"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-black/35">Current operating record</p><h3 className="mt-1 text-lg font-semibold tracking-[-.025em]">Work reconstructed from your communication</h3></div><ShieldCheck className="h-4 w-4 text-[#4f7f52]" /></div>
          {jobs.slice(0, 3).map((job) => (
            <button key={job.id} type="button" onClick={() => openJob(job)} className="grid w-full gap-3 border-b border-[#e2e2dc] p-4 text-left transition hover:bg-[#fafaf6] last:border-b-0 sm:grid-cols-[minmax(0,1fr)_112px_auto] sm:items-center sm:px-5">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold">{job.name}</p><StatusBadge status={job.status} /></div><p className="mt-1 truncate text-[10px] text-black/38">{job.customer} · {job.owner}</p><p className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#4f7f52]"><Link2 className="h-3 w-3" />{job.tasks[0].source} · {job.tasks[0].updated}</p></div>
              <div><div className="flex justify-between text-[9px] text-black/35"><span>Progress</span><span>{job.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/6"><div className="h-full rounded-full bg-[#56825a]" style={{ width: `${job.progress}%` }} /></div></div>
              <ChevronRight className="hidden h-4 w-4 text-black/25 sm:block" />
            </button>
          ))}
        </section>
        <aside className="border border-[#263a2a] bg-[#172019] text-white">
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/35">Live change stream</p><p className="mt-1 text-sm font-semibold">Sources becoming dashboard updates</p></div><Activity className="h-4 w-4 text-[#9fc2a2]" /></div>
          {liveSignals.map(({ icon: Icon, source, title, detail, time }) => <div key={title} className="flex gap-3 border-b border-white/10 p-4 last:border-b-0"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04]"><Icon className="h-3.5 w-3.5 text-[#9fc2a2]" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="text-[8px] font-semibold uppercase tracking-[.13em] text-[#9fc2a2]">{source}</p><span className="text-[8px] text-white/25">{time}</span></div><p className="mt-1 text-xs font-semibold text-white/80">{title}</p><p className="mt-1 text-[10px] text-white/32">{detail}</p></div></div>)}
          <p className="p-4 text-[9px] leading-4 text-white/25">Every change keeps its source, time, and rule so the dashboard can be verified.</p>
        </aside>
      </div>
    </div>
  );
}

function JobsView({ jobs, openJob }: { jobs: Job[]; openJob: (job: Job) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | JobStatus>('All');
  const visible = jobs.filter((job) => (filter === 'All' || job.status === filter) && `${job.name} ${job.customer} ${job.owner}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="border border-[#e2e2dc] bg-white">
      <div className="flex flex-col gap-4 border-b border-[#e2e2dc] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-black/35">AI-maintained job record</p><h3 className="mt-1 text-xl font-semibold tracking-[-.03em]">Every job, owner, deadline, and next action.</h3></div><span className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-[#bed2bf] bg-[#edf4eb] px-4 text-[9px] font-semibold uppercase tracking-[.12em] text-[#315e3a]"><Activity className="h-3.5 w-3.5" />No manual entry</span></div>
      <div className="flex flex-col gap-3 border-b border-[#e2e2dc] bg-[#fafaf6] p-3 sm:flex-row sm:items-center">
        <label className="flex min-h-10 flex-1 items-center gap-2 border border-[#deded7] bg-white px-3"><Search className="h-3.5 w-3.5 text-black/30" /><span className="sr-only">Search jobs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs, customers, or owners" className="w-full bg-transparent text-xs outline-none placeholder:text-black/30" /></label>
        <div className="flex gap-1 overflow-x-auto">{(['All', 'On track', 'Needs review', 'Blocked'] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`min-h-9 shrink-0 rounded-full px-3 text-[10px] font-semibold ${filter === item ? 'bg-[#172019] text-white' : 'text-black/45 hover:bg-black/5'}`}>{item}</button>)}</div>
      </div>
      <div className="hidden grid-cols-[minmax(0,1.5fr)_.7fr_.6fr_.55fr_auto] gap-4 border-b border-[#e2e2dc] px-5 py-3 text-[8px] font-semibold uppercase tracking-[.15em] text-black/30 md:grid"><span>Job</span><span>Owner</span><span>Due</span><span>Value</span><span>Status</span></div>
      {visible.map((job) => <button key={job.id} type="button" onClick={() => openJob(job)} className="grid w-full gap-3 border-b border-[#e2e2dc] p-4 text-left transition hover:bg-[#fafaf6] last:border-b-0 md:grid-cols-[minmax(0,1.5fr)_.7fr_.6fr_.55fr_auto] md:items-center md:px-5"><div className="min-w-0"><p className="truncate text-sm font-semibold">{job.name}</p><p className="mt-1 truncate text-[10px] text-black/38">{job.customer} · {job.location}</p><div className="mt-2 flex items-center gap-2"><div className="h-1 w-28 overflow-hidden rounded-full bg-black/6"><div className="h-full bg-[#56825a]" style={{ width: `${job.progress}%` }} /></div><span className="inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[.1em] text-[#4f7f52]"><Link2 className="h-2.5 w-2.5" />{job.tasks[0].source}</span></div></div><p className="text-xs text-black/55">{job.owner}</p><p className="text-xs font-semibold">{job.due}</p><p className="font-mono text-xs">{job.value}</p><StatusBadge status={job.status} /></button>)}
      {!visible.length ? <p className="p-10 text-center text-sm text-black/40">No jobs match this view.</p> : null}
    </section>
  );
}

const scheduleItems = [
  ['08:00', 'Crew start', 'North Harbor Renovation', 'Maya + 4'],
  ['09:30', 'Customer approval call', 'Main Street Buildout', 'Avery'],
  ['11:00', 'Vendor confirmation', 'Cedar House Service Plan', 'Sam'],
  ['14:00', 'Site closeout', 'Portfolio Maintenance', 'Jordan + 2'],
];

function ScheduleView() {
  return <section className="border border-[#e2e2dc] bg-white"><div className="flex items-center justify-between border-b border-[#e2e2dc] p-5"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-black/35">Wednesday · August 12</p><h3 className="mt-1 text-xl font-semibold">Team schedule</h3></div><CalendarDays className="h-5 w-5 text-[#4f7f52]" /></div><div className="grid md:grid-cols-[90px_1fr]">{scheduleItems.map(([time, type, job, team]) => <div key={time} className="contents"><p className="border-b border-[#e2e2dc] px-5 py-5 font-mono text-xs text-black/40">{time}</p><div className="border-b border-[#e2e2dc] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.1em] text-[#4f7f52]">{type}</p><p className="mt-1 text-sm font-semibold">{job}</p></div><span className="inline-flex items-center gap-2 text-xs text-black/42"><UsersRound className="h-3.5 w-3.5" />{team}</span></div></div></div>)}</div></section>;
}

function InboxView() {
  const messages = [
    ['Customer', 'June & Pine Retail', 'Can you send the revised layout before our 9:30 call?', '8 min'],
    ['Field update', 'Maya Torres', 'Electrical inspection passed. Uploading the card now.', '24 min'],
    ['Vendor', 'Atlantic Equipment', 'Lead time is now 12 business days. Please confirm.', '1 hr'],
  ];
  return <section className="border border-[#e2e2dc] bg-white"><div className="flex items-center justify-between border-b border-[#e2e2dc] p-5"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-black/35">Connected communication</p><h3 className="mt-1 text-xl font-semibold">Job inbox</h3></div><span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#4f7f52]"><Wifi className="h-3.5 w-3.5" />3 sources live</span></div>{messages.map(([type, name, body, time], index) => <button key={name} type="button" className="grid w-full gap-3 border-b border-[#e2e2dc] p-5 text-left hover:bg-[#fafaf6] sm:grid-cols-[42px_1fr_auto]"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#edf1e8] text-xs font-semibold text-[#426b47]">{name[0]}</span><span><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{name}</span>{index < 2 ? <span className="h-2 w-2 rounded-full bg-[#4f7f52]" /> : null}</span><span className="mt-1 block text-xs leading-5 text-black/48">{body}</span><span className="mt-2 block text-[9px] font-semibold uppercase tracking-[.12em] text-black/30">{type}</span></span><span className="text-[10px] text-black/30">{time}</span></button>)}</section>;
}

function ViewBuilder({ onSave }: { onSave: (name: string) => void }) {
  const suggestions = [
    'Show jobs with client decisions holding up field work',
    'Build a weekly owner view of margin risk',
    'Show every promise made to a client this week',
  ];
  const [prompt, setPrompt] = useState(suggestions[0]);
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = () => {
    setSaved(false);
    setGenerated(true);
  };

  const save = () => {
    setSaved(true);
    onSave('Client decision risk');
  };

  return (
    <section className="grid min-h-[35rem] overflow-hidden border border-[#263a2a] bg-[#172019] text-white lg:grid-cols-[.78fr_1.22fr]">
      <aside className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-6">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dfe9d8] text-[#17321f]"><Settings2 className="h-4 w-4" /></span><div><p className="text-sm font-semibold">Create a business view</p><p className="text-[9px] text-white/35">Describe it. Gurge builds and maintains it.</p></div></div>
        <p className="mt-8 text-[9px] font-semibold uppercase tracking-[.16em] text-white/30">Starting points</p>
        <div className="mt-3 space-y-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setPrompt(suggestion); setGenerated(false); }} className={`w-full border p-3 text-left text-xs leading-5 transition ${prompt === suggestion ? 'border-[#94b899]/45 bg-white/[.08] text-white' : 'border-white/8 text-white/45 hover:bg-white/[.04]'}`}>{suggestion}</button>)}</div>
        <div className="mt-6 border border-white/10 bg-black/15 p-3"><label htmlFor="gurge-view-prompt" className="text-[8px] font-semibold uppercase tracking-[.14em] text-white/28">What do you want to see?</label><textarea id="gurge-view-prompt" value={prompt} onChange={(event) => { setPrompt(event.target.value); setGenerated(false); }} rows={4} className="mt-2 w-full resize-none bg-transparent text-xs leading-5 text-white outline-none" /><button type="button" onClick={generate} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 bg-[#dfe9d8] px-4 text-xs font-semibold text-[#17321f]"><WandSparkles className="h-3.5 w-3.5" />Generate view</button></div>
      </aside>
      <div className="flex flex-col bg-[#f6f6f1] p-4 text-[#171a18] sm:p-6">
        {!generated ? <div className="grid flex-1 place-items-center border border-dashed border-black/15 p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#dfe9d8] text-[#315e3a]"><Sparkles className="h-5 w-5" /></span><h3 className="mt-5 text-xl font-semibold tracking-[-.03em]">Your view will appear here.</h3><p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-black/42">Gurge decides which records belong, which communication sources maintain them, and which changes should refresh the view.</p></div></div> : <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-4"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#4f7f52]">Generated view · preview</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Client decision risk</h3><p className="mt-2 text-xs text-black/42">Jobs where a client response controls field work, schedule, or revenue.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-[#dfe9d8] px-3 py-2 text-[8px] font-semibold uppercase tracking-[.12em] text-[#315e3a]"><Activity className="h-3 w-3" />Will update live</span></div><div className="mt-4 grid grid-cols-3 border border-black/10 bg-white"><Metric label="Jobs" value="2" detail="Current match" tone="gold" /><Metric label="Value" value="$138.8k" detail="Exposed revenue" tone="red" /><Metric label="Decisions" value="3" detail="Awaiting client" tone="gold" /></div><div className="mt-4 border border-black/10 bg-white">{[['Main Street Buildout', 'Layout approval', 'Client email · 8 min'], ['North Harbor Renovation', 'Finish schedule', 'Client email · 18 min']].map(([job, decision, source]) => <div key={job} className="grid gap-2 border-b border-black/10 p-4 last:border-b-0 sm:grid-cols-[1fr_.7fr_auto] sm:items-center"><div><p className="text-xs font-semibold">{job}</p><p className="mt-1 text-[9px] text-black/35">{decision}</p></div><span className="text-[9px] font-semibold text-[#4f7f52]">{source}</span><StatusBadge status="Needs review" /></div>)}</div><div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="border border-black/10 bg-white p-4"><p className="text-[8px] font-semibold uppercase tracking-[.13em] text-black/30">Update rules selected by Gurge</p><p className="mt-2 text-xs leading-5 text-black/55">Refresh when a client replies, a dependent task changes, or a promised date moves.</p></div><div className="border border-black/10 bg-white p-4"><p className="text-[8px] font-semibold uppercase tracking-[.13em] text-black/30">Connected sources</p><p className="mt-2 text-xs leading-5 text-black/55">Client email · project texts · schedule · job records</p></div></div><button type="button" onClick={save} disabled={saved} className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 bg-[#172019] px-4 text-xs font-semibold text-white disabled:bg-[#4f7f52]"><Save className="h-3.5 w-3.5" />{saved ? 'Saved to your dashboard' : 'Save this view to dashboard'}</button></motion.div>}
      </div>
    </section>
  );
}

function SavedCustomView() {
  return <section className="border border-[#e2e2dc] bg-white"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e2e2dc] p-5"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#4f7f52]">Custom view · AI maintained</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Client decision risk</h3><p className="mt-2 text-xs text-black/42">Saved from your request. Gurge now maintains this view automatically.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-[#dfe9d8] px-3 py-2 text-[8px] font-semibold uppercase tracking-[.12em] text-[#315e3a]"><Activity className="h-3 w-3" />Live</span></div><div className="grid grid-cols-3 border-b border-[#e2e2dc]"><Metric label="Jobs" value="2" detail="Current match" tone="gold" /><Metric label="Value" value="$138.8k" detail="Exposed revenue" tone="red" /><Metric label="Decisions" value="3" detail="Awaiting client" tone="gold" /></div>{[['Main Street Buildout', 'Layout approval', 'Client email · 8 min'], ['North Harbor Renovation', 'Finish schedule', 'Client email · 18 min']].map(([job, decision, source]) => <div key={job} className="grid gap-3 border-b border-[#e2e2dc] p-5 last:border-b-0 sm:grid-cols-[1fr_.7fr_auto] sm:items-center"><div><p className="text-sm font-semibold">{job}</p><p className="mt-1 text-[10px] text-black/35">{decision}</p></div><span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#4f7f52]"><Link2 className="h-3 w-3" />{source}</span><StatusBadge status="Needs review" /></div>)}</section>;
}

function ReadOnlyJobDrawer({ job, close }: { job: Job; close: () => void }) {
  return <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 28 }} className="absolute inset-y-0 right-0 z-30 w-full max-w-md overflow-y-auto border-l border-[#deded7] bg-white shadow-[-30px_0_80px_rgba(0,0,0,.12)]"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e2e2dc] bg-white/95 p-4 backdrop-blur"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-black/35">Job record</p><p className="mt-1 inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[.12em] text-[#4f7f52]"><Activity className="h-3 w-3" />AI maintained</p></div><button type="button" onClick={close} aria-label="Close job details" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"><X className="h-4 w-4" /></button></div><div className="p-5 sm:p-6"><StatusBadge status={job.status} /><h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.04em]">{job.name}</h3><p className="mt-2 text-sm text-black/45">{job.customer} · {job.location}</p><div className="mt-6 grid grid-cols-3 border-y border-[#e2e2dc] py-4"><div><p className="text-[8px] uppercase tracking-[.13em] text-black/30">Owner</p><p className="mt-2 text-xs font-semibold">{job.owner.split(' ')[0]}</p></div><div><p className="text-[8px] uppercase tracking-[.13em] text-black/30">Due</p><p className="mt-2 text-xs font-semibold">{job.due}</p></div><div><p className="text-[8px] uppercase tracking-[.13em] text-black/30">Value</p><p className="mt-2 font-mono text-xs font-semibold">{job.value}</p></div></div><div className="mt-6 border border-[#cddccc] bg-[#edf4eb] p-4"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#426b47]" /><div><p className="text-[9px] font-semibold uppercase tracking-[.13em] text-[#426b47]">Current verified state</p><p className="mt-2 text-xs leading-6 text-black/58">{job.update}</p><p className="mt-2 text-[9px] text-[#426b47]">Reconciled from 3 approved sources · now</p></div></div></div><div className="mt-7 flex items-center justify-between"><h4 className="text-sm font-semibold">Automatically maintained checklist</h4><span className="font-mono text-[10px] text-black/35">{job.tasks.filter((task) => task.done).length}/{job.tasks.length}</span></div><div className="mt-3 border border-[#e2e2dc]">{job.tasks.map((task) => <div key={task.id} className="flex items-start gap-3 border-b border-[#e2e2dc] p-4 last:border-b-0"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${task.done ? 'border-[#4f7f52] bg-[#4f7f52] text-white' : 'border-black/20'}`}>{task.done ? <Check className="h-3 w-3" /> : null}</span><span className="min-w-0 flex-1"><span className={`block text-xs leading-5 ${task.done ? 'text-black/30 line-through' : 'text-black/70'}`}>{task.label}</span><span className="mt-1 flex flex-wrap items-center gap-2 text-[8px] font-semibold uppercase tracking-[.1em] text-[#4f7f52]"><Link2 className="h-2.5 w-2.5" />{task.source}<span className="text-black/25">· {task.updated}</span></span></span></div>)}</div><div className="mt-6 border-t border-[#e2e2dc] pt-5"><p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.13em] text-black/35"><History className="h-3.5 w-3.5" />Audit trail retained</p><p className="mt-2 text-xs leading-5 text-black/42">Nothing is edited here. Gurge updates this record when approved communication or connected systems confirm a change.</p></div></div></motion.aside>;
}

function GurgeWorkspace({ view, setView }: { view: WorkspaceView; setView: (view: WorkspaceView) => void }) {
  const jobs = initialJobs;
  const [navOpen, setNavOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [customView, setCustomView] = useState<string | null>(() => {
    try { return window.localStorage.getItem('gurge-saved-view-demo'); } catch { return null; }
  });
  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const saveCustomView = (name: string) => {
    setCustomView(name);
    try { window.localStorage.setItem('gurge-saved-view-demo', name); } catch { /* view still saves for this session */ }
  };
  const openJob = (job: Job) => { setSelectedJobId(job.id); };
  const visibleNav = customView ? [...workspaceNav, { id: 'custom' as const, label: customView, icon: Activity }] : workspaceNav;
  const activeLabel = visibleNav.find((item) => item.id === view)?.label ?? 'Today';
  return (
    <div className="relative overflow-hidden border border-[#233329] bg-[#f6f6f1] shadow-[0_44px_120px_rgba(0,0,0,.18)]">
      <header className="relative z-20 border-b border-white/10 bg-[#101713] text-white">
        <div className="flex min-h-[4.75rem] items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#dfe9d8]"><img src="/brand/gurge-logo.png" alt="" className="h-7 w-7 object-contain" /></span>
            <div className="min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-semibold">Gurge</p><span className="font-mono text-[7px] uppercase tracking-[.18em] text-[#9fc2a2]">Operator OS</span></div><p className="mt-1 flex items-center gap-1 font-mono text-[8px] uppercase tracking-[.13em] text-white/28"><span className="hidden sm:inline">fieldstone-services</span><span className="hidden text-white/12 sm:inline">/</span><span className="truncate text-[#9fc2a2]">{viewPath[view]}</span></p></div>
          </div>

          <div className="hidden h-[4.75rem] items-stretch md:flex">
            <div className="relative" onMouseEnter={() => { setNavOpen(true); setSystemOpen(false); }}>
              <button type="button" aria-expanded={navOpen} onClick={() => setNavOpen((open) => !open)} className="group flex h-full min-w-40 items-center justify-center gap-2 border-x border-white/0 px-5 text-[9px] font-semibold uppercase tracking-[.14em] text-white/45 transition hover:border-white/10 hover:bg-white/[.05] hover:text-white">{activeLabel}<ChevronDown className={`h-3 w-3 text-[#9fc2a2] transition ${navOpen ? 'rotate-180' : ''}`} /></button>
              <AnimatePresence>{navOpen ? <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 border border-white/10 bg-[#101713] p-2 shadow-2xl"><p className="px-3 pb-2 pt-2 font-mono text-[8px] uppercase tracking-[.17em] text-[#9fc2a2]">Operating views · choose a screen</p><div className="grid grid-cols-2 gap-1">{visibleNav.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => { setView(id); setNavOpen(false); }} className={`group flex items-center gap-3 p-3 text-left transition ${view === id ? 'bg-[#dfe9d8] text-[#17321f]' : 'text-white/50 hover:bg-white/[.05] hover:text-white'}`}><span className={`grid h-9 w-9 shrink-0 place-items-center border ${view === id ? 'border-[#315e3a]/20' : 'border-white/10 text-[#9fc2a2]'}`}><GurgeIcon name={id === 'today' ? 'overview' : id === 'jobs' ? 'job' : id === 'schedule' ? 'report' : id === 'inbox' ? 'update' : id === 'ai' ? 'activity' : 'gate'} className="h-4 w-4" /></span><span><span className="block text-xs font-semibold">{label}</span><span className={`mt-1 block text-[8px] ${view === id ? 'text-[#315e3a]/55' : 'text-white/25'}`}>{id === 'ai' ? 'Generate a maintained business view' : `Open ${viewPath[id]}`}</span></span><ChevronRight className="ml-auto h-3.5 w-3.5 opacity-30 transition group-hover:translate-x-0.5" /></button>)}</div></motion.div> : null}</AnimatePresence>
            </div>
            <button type="button" onClick={() => setView('ai')} className="group flex h-full items-center gap-2 px-5 text-[9px] font-semibold uppercase tracking-[.14em] text-white/45 transition hover:bg-white/[.05] hover:text-white"><GurgeIcon name="activity" className="h-4 w-4 text-[#9fc2a2]" />Create a view</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block" onMouseEnter={() => { setSystemOpen(true); setNavOpen(false); }} onMouseLeave={() => setSystemOpen(false)}>
              <button type="button" aria-expanded={systemOpen} onClick={() => setSystemOpen((open) => !open)} className="flex min-h-10 items-center gap-2 border border-white/10 bg-white/[.035] px-3 text-left transition hover:border-[#9fc2a2]/40"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fbd9b] opacity-40" /><span className="relative h-2 w-2 rounded-full bg-[#8fbd9b]" /></span><span><span className="block text-[8px] font-semibold uppercase tracking-[.13em] text-[#9fc2a2]">AI maintained</span><span className="mt-0.5 block text-[8px] text-white/28">Reconciled now</span></span></button>
              <AnimatePresence>{systemOpen ? <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 top-full w-64 border border-white/10 bg-[#101713] p-4 shadow-2xl"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-[#9fc2a2]">System intelligence</p><div className="mt-3 grid grid-cols-3 gap-px bg-white/10 text-center"><span className="bg-[#101713] p-2"><b className="block text-sm">4</b><small className="text-[7px] text-white/30">sources</small></span><span className="bg-[#101713] p-2"><b className="block text-sm">3</b><small className="text-[7px] text-white/30">updates</small></span><span className="bg-[#101713] p-2"><b className="block text-sm">0</b><small className="text-[7px] text-white/30">conflicts</small></span></div><p className="mt-3 text-[9px] leading-4 text-white/35">Latest client email verified and propagated across four connected records.</p></motion.div> : null}</AnimatePresence>
            </div>
            <button type="button" aria-label="Notifications" className="relative grid h-10 w-10 place-items-center border border-white/10 text-white/55 transition hover:border-[#9fc2a2]/40 hover:text-white"><GurgeIcon name="update" className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#c85b4d]" /></button>
            <span className="hidden h-10 items-center gap-2 border border-white/10 pl-1 pr-3 text-[9px] font-semibold text-white/60 lg:flex"><span className="grid h-8 w-8 place-items-center bg-[#dfe9d8] text-[#17321f]"><GurgeIcon name="account" className="h-4 w-4" /></span>Alex Rivera</span>
          </div>
        </div>
        <div className="flex gap-px overflow-x-auto border-t border-white/10 bg-white/10 p-px md:hidden">{visibleNav.map(({ id, label }) => <button key={id} type="button" onClick={() => setView(id)} className={`flex min-h-10 shrink-0 items-center gap-2 px-3 text-[9px] font-semibold ${view === id ? 'bg-[#dfe9d8] text-[#17321f]' : 'bg-[#101713] text-white/42'}`}><GurgeIcon name={id === 'today' ? 'overview' : id === 'jobs' ? 'job' : id === 'schedule' ? 'report' : id === 'inbox' ? 'update' : 'activity'} className="h-3.5 w-3.5" />{label}</button>)}</div>
      </header>
      <div className="flex min-h-[42rem]">
        <aside className="hidden w-44 shrink-0 flex-col border-r border-[#d8ddd8] bg-[#edf0eb] p-3 lg:flex"><div className="border-b border-black/8 px-2 pb-3 pt-1"><p className="font-mono text-[8px] uppercase tracking-[.16em] text-black/28">Pinned views</p></div><nav className="mt-2 space-y-1">{visibleNav.map(({ id, label }) => <button key={id} type="button" onClick={() => setView(id)} className={`group flex min-h-10 w-full items-center gap-3 px-2.5 text-xs font-semibold transition ${view === id ? 'bg-[#172019] text-white' : 'text-black/42 hover:bg-white hover:text-black'}`}><GurgeIcon name={id === 'today' ? 'overview' : id === 'jobs' ? 'job' : id === 'schedule' ? 'report' : id === 'inbox' ? 'update' : id === 'ai' ? 'activity' : 'gate'} className={`h-4 w-4 ${view === id ? 'text-[#9fc2a2]' : 'text-[#4f7f52]'}`} /><span className="truncate">{label}</span>{id === 'inbox' ? <span className="ml-auto grid h-5 min-w-5 place-items-center bg-[#dfe9d8] px-1 text-[8px] text-[#315e3a]">3</span> : id === 'custom' ? <span className="ml-auto h-2 w-2 rounded-full bg-[#4f7f52]" /> : null}</button>)}</nav><div className="mt-auto border border-[#c9d9c9] bg-[#e7f0e6] p-3"><p className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[.13em] text-[#315e3a]"><GurgeIcon name="activity" className="h-3.5 w-3.5" />Workspace state</p><div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#4f7f52]"><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-[#4f7f52] opacity-40" /><span className="relative h-2 w-2 rounded-full bg-[#4f7f52]" /></span>Live · AI maintained</div><p className="mt-2 text-[8px] leading-4 text-black/35">Texts, email, messages, and connected systems are current.</p></div></aside>
        <main className="min-w-0 flex-1 p-3 sm:p-5"><motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>{view === 'today' ? <TodayView jobs={jobs} openJob={openJob} /> : view === 'jobs' ? <JobsView jobs={jobs} openJob={openJob} /> : view === 'schedule' ? <ScheduleView /> : view === 'inbox' ? <InboxView /> : view === 'custom' ? <SavedCustomView /> : <ViewBuilder onSave={(name) => { saveCustomView(name); window.setTimeout(() => setView('custom'), 650); }} />}</motion.div></main>
      </div>
      <AnimatePresence>{selectedJob ? <ReadOnlyJobDrawer job={selectedJob} close={() => setSelectedJobId(null)} /> : null}</AnimatePresence>
    </div>
  );
}

function AutoUpdateHeroPanel() {
  return <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#101713] shadow-[0_44px_120px_rgba(0,0,0,.42)]"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dfe9d8] text-[#17321f]"><GurgeIcon name="brand" className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-white">Gurge <span className="mx-1 text-white/15">/</span> Fieldstone Services</p><p className="text-[10px] text-white/35">Your operating record</p></div></div><span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.13em] text-white/40"><span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-[#8fbd9b] opacity-50" /><span className="relative h-1.5 w-1.5 rounded-full bg-[#8fbd9b]" /></span>Live</span></div><div className="p-5 sm:p-6"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[.06]"><Mail className="h-4 w-4 text-[#a9c7a8]" /></span><div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[#171a18]"><div className="flex items-center justify-between gap-3"><p className="text-[8px] font-semibold uppercase tracking-[.13em] text-[#4f7f52]">Client email · now</p><span className="text-[8px] text-black/25">June & Pine</span></div><p className="mt-2 text-sm leading-5">“The revised layout looks good. Approved—go ahead.”</p></div></div><div className="my-4 flex items-center gap-3"><span className="h-px flex-1 bg-white/10" /><span className="inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[.14em] text-[#9fc2a2]"><Sparkles className="h-3 w-3" />Gurge reconciled 4 connected records</span><span className="h-px flex-1 bg-white/10" /></div><div className="border border-[#8fbd9b]/35 bg-[#8fbd9b]/[.08] p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-[8px] font-semibold uppercase tracking-[.14em] text-[#9fc2a2]">Dashboard updated automatically</p><p className="mt-2 text-sm font-semibold text-white">Main Street Buildout</p><p className="mt-1 text-[10px] text-white/35">Layout approval · Avery Reed</p></div><span className="rounded-full bg-[#dce9dc] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.12em] text-[#315e3a]">On track</span></div><div className="mt-4 grid grid-cols-2 gap-px bg-white/10"><div className="bg-[#101713] p-3"><p className="text-[8px] uppercase tracking-[.12em] text-white/28">Approval</p><p className="mt-1 text-xs font-semibold text-[#9fc2a2]">Complete</p></div><div className="bg-[#101713] p-3"><p className="text-[8px] uppercase tracking-[.12em] text-white/28">Progress</p><p className="mt-1 text-xs font-semibold text-white">48% → 56%</p></div></div><p className="mt-3 flex items-center gap-1.5 text-[8px] text-white/28"><Link2 className="h-3 w-3" />Source retained · client email · 10:18 AM</p></div><p className="mt-4 text-center text-[9px] text-white/25">Nobody opened Gurge. Nobody edited the dashboard.</p></div></div>;
}

const productModules: Array<[ComponentType<{ className?: string }>, string, string]> = [
  [BriefcaseBusiness, 'Jobs', 'Scopes, owners, deadlines, tasks, files, progress, and history—maintained from the work itself.'],
  [CalendarDays, 'Schedule', 'Crew dates, appointments, promises, and conflicts update when connected plans or messages change.'],
  [MessageSquareText, 'Communication', 'Texts, email, field updates, and client replies become the structured record behind each job.'],
  [ClipboardCheck, 'Checklists', 'A confirmed “done” marks the right task complete and preserves the message that proved it.'],
  [BarChart3, 'Reporting', 'Every metric rolls up from source-linked job facts, so management can trust what it sees.'],
  [Sparkles, 'Custom views', 'Describe a new view of the business. Gurge builds it, selects its rules, and keeps it current.'],
];

export default function GurgePage({ canonicalPath = '/v3/gurge' }: { canonicalPath?: string }) {
  const requestAccess = 'mailto:info@b2w-ai.com?subject=Gurge%20Download%20Access';
  const [activeView, setActiveView] = useState<WorkspaceView>('today');
  return (
    <div className="bg-[#f4f0e7] text-[#171a18]">
      <Seo title="Gurge AI Job Management Software" description="Gurge turns approved texts, emails, client replies, and team updates into a live, source-linked job management dashboard that nobody has to maintain manually." canonicalPath={canonicalPath} />
      <style>{`
        [class~="min-h-[32rem]"] > div:first-child {
          border-radius: 0;
          border-color: rgba(23, 32, 25, .2);
          background: #edf0eb;
          box-shadow: 0 30px 80px rgba(0, 0, 0, .16);
        }
        [class~="min-h-[32rem]"] > div:first-child > div:first-child {
          min-height: 3.25rem;
          gap: 0;
          border-color: rgba(255, 255, 255, .1);
          background: #172019;
          color: white;
        }
        [class~="min-h-[32rem]"] > div:first-child > div:first-child::before {
          content: "";
          width: 2rem;
          height: 2rem;
          margin-right: .7rem;
          background: #dfe9d8 url('/brand/gurge-logo.png') center / 1.15rem 1.15rem no-repeat;
        }
        [class~="min-h-[32rem]"] > div:first-child > div:first-child > span {
          display: none;
        }
        [class~="min-h-[32rem]"] > div:first-child > div:first-child > p {
          margin-left: 0;
          color: transparent;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          text-transform: uppercase;
          letter-spacing: .13em;
        }
        [class~="min-h-[32rem]"] > div:first-child > div:first-child > p::after {
          content: "Gurge  /  fieldstone-services / today";
          color: rgba(255, 255, 255, .56);
        }
        [class~="min-h-[32rem]"] > div:first-child > div:nth-child(2) > div:first-child {
          background: #e8ede7;
          border-color: rgba(23, 32, 25, .12);
        }
      `}</style>
      {canonicalPath.startsWith('/v2/') ? <V2SiteHeader followPageTheme /> : <LiveSiteHeader followPageTheme />}

      <section id="gurge-top" data-header-theme="dark" className="relative scroll-mt-28 overflow-hidden bg-[#172019] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
        <div aria-hidden="true" className="absolute inset-0 opacity-[.1] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:68px_68px]" />
        <motion.div aria-hidden="true" className="absolute -right-32 top-0 h-[38rem] w-[38rem] rounded-full bg-[#6b936e]/35 blur-[120px]" animate={{ scale: [1, 1.08, 1], opacity: [.5, .85, .5] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:px-10">
          <div><div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[.16em] text-[#b5ceb4]">Gurge · Operator · Private beta</span><span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/35">Desktop + mobile</span></div><motion.h1 initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} className="mt-7 max-w-[11ch] text-5xl font-medium leading-[.94] tracking-[-.06em] sm:text-7xl lg:text-[5.8rem]"><DescrambleText text="The dashboard nobody has to update." animateOnView delay={120} /></motion.h1><p className="mt-7 max-w-xl text-base leading-8 text-white/58 sm:text-lg">Gurge turns your approved texts, emails, client replies, and team updates into a live operating record. When the work changes, the dashboard changes—with the source attached.</p><div className="mt-8 flex flex-wrap gap-3"><a href={requestAccess} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#172019] transition hover:bg-[#dfe9d8]"><Download className="h-4 w-4" />Get download access</a><a href="#workspace" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 px-5 text-sm font-semibold text-white/75 transition hover:border-white/45 hover:text-white">See the live workspace<ArrowRight className="h-4 w-4" /></a></div><div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">{['No dashboard entry', 'Every change source-linked', 'Custom views maintained by AI'].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8fbd9b]" />{item}</span>)}</div></div>
          <AutoUpdateHeroPanel />
        </div>
      </section>

      <section id="how-it-updates" data-header-theme="light" className="scroll-mt-28 border-b border-black/10 bg-white"><div className="mx-auto grid max-w-7xl gap-px bg-black/10 sm:grid-cols-3">{[['Your team keeps communicating', 'Work continues through texts, email, calls, field updates, and the tools people already use.'], ['Gurge maintains the record', 'AI connects each signal to the right job, task, owner, date, status, and operating rule.'], ['You open it to see the truth', 'The dashboard is a reliable view of the business—not another place where work has to be entered.']].map(([title, body]) => <div key={title} className="bg-white px-5 py-8 sm:px-8 lg:px-10"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-xs leading-5 text-black/48">{body}</p></div>)}</div></section>

      <section id="workspace" data-header-theme="light" className="mx-auto max-w-[90rem] scroll-mt-28 px-4 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="mx-auto mb-10 grid max-w-7xl gap-6 lg:grid-cols-[.82fr_1.18fr] lg:items-end"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#56765b]">The actual Gurge product</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">The internal operating view. Now maintained by AI.</h2></div><p className="max-w-2xl text-base leading-8 text-black/55 lg:justify-self-end">This uses Gurge’s existing Today view, status cells, update stream, operating records, schedules, and role-focused navigation. Open any line to see where it came from. Use Create a view when you want Gurge to build and maintain a different way of seeing the business.</p></div><GurgeWorkspace view={activeView} setView={setActiveView} /></section>

      <section id="intelligence" data-header-theme="dark" className="scroll-mt-28 overflow-hidden bg-[#172019] text-white"><div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-10"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#a9c7a8]">The intelligence is in every line</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">The dashboard is the output of the AI.</h2><p className="mt-6 max-w-xl text-base leading-8 text-white/55">Gurge is trained on years of our operations management experience, then configured around your approved communication and systems. Its job is to maintain the operating record continuously—not wait for someone to ask a chatbot what happened.</p><div className="mt-9 grid gap-3 sm:grid-cols-2">{[['It listens to the work', 'Approved texts, emails, client replies, voice updates, and connected tools become live operating signals.'], ['It resolves what changed', 'Gurge identifies the job, owner, task, date, status, and dependencies affected by each signal.'], ['It maintains the rules', 'The engine selects when each line should update, how it rolls up, and which exceptions need review.'], ['It keeps the evidence', 'Every visible fact retains its source, timestamp, rule, and history so the dashboard can be trusted.']].map(([title, body]) => <div key={title} className="border border-white/10 bg-white/[.035] p-5"><p className="text-sm font-semibold">{title}</p><p className="mt-3 text-xs leading-6 text-white/42">{body}</p></div>)}</div></div><div className="relative"><div aria-hidden="true" className="absolute inset-12 rounded-full bg-[#6b936e]/25 blur-[100px]" /><div className="relative rounded-[1.75rem] border border-white/12 bg-[#101713] p-5 shadow-2xl sm:p-7"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfe9d8] text-[#17321f]"><Activity className="h-4 w-4" /></span><div><p className="text-sm font-semibold">One message. Four records changed.</p><p className="text-[9px] text-white/35">Client email · reconciled now</p></div></div><ShieldCheck className="h-4 w-4 text-[#a9c7a8]" /></div><div className="mt-6 border-l-2 border-[#8fbd9b] pl-5"><p className="text-xl font-medium leading-8">“The revised layout looks good. Approved—go ahead.”</p><p className="mt-3 text-xs leading-6 text-white/40">Gurge marked the approval complete, moved Main Street to On track, released two dependent tasks, and refreshed the owner view.</p></div><div className="mt-6 grid gap-px bg-white/10 sm:grid-cols-2">{[['Approval', 'Complete'], ['Job status', 'On track'], ['Dependencies', '2 released'], ['Owner view', 'Refreshed']].map(([label, value]) => <div key={label} className="bg-[#101713] p-4"><p className="text-[8px] uppercase tracking-[.13em] text-white/28">{label}</p><p className="mt-2 text-xs font-semibold text-[#9fc2a2]">{value}</p></div>)}</div><p className="mt-4 flex items-center gap-2 text-[9px] text-white/25"><Link2 className="h-3 w-3" />Source and audit history retained automatically</p></div></div></div></section>

      <section data-header-theme="light" className="border-b border-black/10 bg-white"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#56765b]">Everything needed to move a job</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">One operating system. Six connected views.</h2></div><div className="grid gap-px border border-black/10 bg-black/10 sm:grid-cols-2">{productModules.map(([Icon, title, body], index) => <article key={title} className={`min-h-56 p-6 sm:p-7 ${index === 5 ? 'bg-[#dfe7d9]' : 'bg-white'}`}><Icon className="h-5 w-5 text-[#4f7f52]" /><p className="mt-10 text-[9px] font-semibold uppercase tracking-[.15em] text-black/28">Gurge module</p><h3 className="mt-2 text-xl font-semibold tracking-[-.025em]">{title}</h3><p className="mt-3 text-sm leading-6 text-black/48">{body}</p></article>)}</div></div></div></section>

      <section data-header-theme="light" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#56765b]">The office and field share one truth</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">View Gurge wherever the work happens.</h2><p className="mt-6 text-base leading-8 text-black/52">See the complete operating record on desktop or phone. Your team keeps working through its existing channels; Gurge keeps every view current across both apps.</p><div className="mt-8 space-y-3">{[[Monitor, 'Desktop app', 'Mac and Windows · full operating, reporting, source, and view-building workspace'], [Smartphone, 'Mobile app', 'iPhone and Android · live jobs, schedules, decisions, and saved views']].map(([Icon, title, body]) => <div key={String(title)} className="flex gap-4 border-t border-black/10 py-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dfe7d9] text-[#42654a]"><Icon className="h-5 w-5" /></span><div><p className="text-sm font-semibold">{title as string}</p><p className="mt-1 text-xs leading-5 text-black/42">{body as string}</p></div></div>)}</div><a href={requestAccess} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#172019] px-5 text-sm font-semibold text-white"><HardDriveDownload className="h-4 w-4" />Get desktop + mobile access</a></div><div className="relative min-h-[32rem]"><div className="absolute inset-x-0 top-8 overflow-hidden rounded-[1.4rem] border border-black/12 bg-[#f6f6f1] shadow-[0_30px_80px_rgba(0,0,0,.14)]"><div className="flex items-center gap-2 border-b border-black/8 bg-white px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-[#e1a198]" /><span className="h-2.5 w-2.5 rounded-full bg-[#e3cd83]" /><span className="h-2.5 w-2.5 rounded-full bg-[#92bb95]" /><p className="ml-3 text-[9px] text-black/30">Gurge · Fieldstone Services</p></div><div className="grid grid-cols-[80px_1fr]"><div className="border-r border-black/8 p-3"><span className="block h-8 rounded-lg bg-[#172019]" /><span className="mt-2 block h-8 rounded-lg bg-black/5" /><span className="mt-2 block h-8 rounded-lg bg-black/5" /></div><div className="p-4"><div className="grid grid-cols-3 gap-2">{['4 jobs', '8 open', '91%'].map((item) => <span key={item} className="bg-white p-3 text-[10px] font-semibold">{item}</span>)}</div><div className="mt-3 h-28 bg-white p-3"><span className="block h-2 w-28 bg-black/12" /><span className="mt-4 block h-2 w-full bg-black/6" /><span className="mt-3 block h-2 w-4/5 bg-black/6" /><span className="mt-3 block h-2 w-2/3 bg-black/6" /></div></div></div></div><div className="absolute bottom-0 right-4 w-48 overflow-hidden rounded-[2.2rem] border-[7px] border-[#171a18] bg-[#f6f6f1] shadow-[0_30px_80px_rgba(0,0,0,.2)] sm:right-12"><div className="bg-[#172019] px-4 pb-5 pt-7 text-white"><div className="flex items-center justify-between"><GurgeIcon name="brand" className="h-4 w-4" /><span className="text-[8px] text-white/35">9:41</span></div><p className="mt-5 text-[8px] uppercase tracking-[.13em] text-white/35">Good morning, Alex</p><p className="mt-1 text-lg font-semibold leading-tight">Two things need you.</p></div><div className="space-y-2 p-3"><div className="rounded-xl bg-white p-3"><p className="text-[8px] font-semibold text-[#8e3327]">APPROVAL</p><p className="mt-1 text-[10px] font-semibold">Main Street layout</p></div><div className="rounded-xl bg-white p-3"><p className="text-[8px] font-semibold text-[#75570f]">VENDOR</p><p className="mt-1 text-[10px] font-semibold">Cedar House lead time</p></div><div className="grid h-9 place-items-center rounded-full bg-[#172019] text-[9px] font-semibold text-white">Create a view</div></div></div></div></div></section>

      <section data-header-theme="light" className="bg-[#dfe7d9]"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="max-w-3xl"><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#42654a]">Made for service businesses</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Your operation becomes the update logic.</h2><p className="mt-6 text-base leading-8 text-black/52">Gurge is configured around the way your business already sells, schedules, delivers, reviews, and closes work. It learns which communication proves a change and how that change should move through every saved view.</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{[[UserRoundCheck, 'Learn the operation', 'We map your job lifecycle, roles, systems, recurring decisions, and the language your team already uses.'], [Link2, 'Connect the evidence', 'Approved texts, email, client messages, schedules, and existing systems become trusted update sources.'], [Settings2, 'Set the update intelligence', 'Gurge selects when records refresh, how changes roll up, and which uncertain signals require review.']].map(([Icon, title, body], index) => <article key={String(title)} className={`min-h-72 rounded-[1.5rem] p-6 sm:p-7 ${index === 1 ? 'bg-[#172019] text-white' : 'bg-white/75'}`}><span className={`grid h-11 w-11 place-items-center rounded-full ${index === 1 ? 'bg-white/10 text-[#a9c7a8]' : 'bg-[#dfe7d9] text-[#42654a]'}`}><Icon className="h-5 w-5" /></span><p className={`mt-12 font-mono text-[9px] uppercase tracking-[.15em] ${index === 1 ? 'text-white/30' : 'text-black/28'}`}>0{index + 1}</p><h3 className="mt-2 text-xl font-semibold">{title as string}</h3><p className={`mt-4 text-sm leading-7 ${index === 1 ? 'text-white/45' : 'text-black/48'}`}>{body as string}</p></article>)}</div></div></section>

      <section data-header-theme="dark" className="bg-[#172019] text-white"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"><div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#a9c7a8]">Gurge · Operator · Private beta</p><h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Bring us the tracker your team actually uses.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/55">We will map the jobs, schedules, handoffs, reports, and decisions you manage today—and show you how Gurge can turn them into one downloadable operating system.</p></div><a href={requestAccess} className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#172019] transition hover:bg-[#dfe9d8]">Request Gurge access<ArrowRight className="h-4 w-4" /></a></div></div></section>
      <div data-header-theme="dark" className="bg-[#172019]"><HomeSiteFooter className="text-white/55" /></div>
    </div>
  );
}
