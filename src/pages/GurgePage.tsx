import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileText,
  Layers3,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  Zap,
} from 'lucide-react';
import { HomeSiteFooter } from '../components/HomeSiteChrome';
import { LiveSiteHeader } from '../components/V2SiteChrome';
import DescrambleText from '../components/DescrambleText';
import GurgeIcon, { type GurgeIconName } from '../components/gurge/GurgeIcon';
import { GurgeIconTile, GurgeMetricCell, GurgeStatusBadge, gurgeSurface } from '../components/gurge/GurgeUI';
import Seo from '../components/Seo';

type WorkspaceView = 'overview' | 'jobs' | 'locations' | 'reports';

const workspaceViews: Array<{ id: WorkspaceView; label: string; icon: GurgeIconName }> = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'jobs', label: 'Jobs', icon: 'job' },
  { id: 'locations', label: 'Locations', icon: 'location' },
  { id: 'reports', label: 'Reports', icon: 'report' },
];

const jobs = [
  { name: 'North Harbor Renovation', location: 'Location 02', status: 'Active', progress: 72, owner: 'M. Torres' },
  { name: 'Main Street Buildout', location: 'Location 01', status: 'At review', progress: 48, owner: 'A. Reed' },
  { name: 'Portfolio Maintenance', location: 'All locations', status: 'Active', progress: 86, owner: 'S. Khan' },
] as const;

const locations = [
  { name: 'Location 01', state: 'Operating', jobs: 8, signal: 'On plan' },
  { name: 'Location 02', state: 'Scaling', jobs: 5, signal: '2 reviews' },
  { name: 'Location 03', state: 'Opening', jobs: 3, signal: 'At gate' },
] as const;

function OverviewView() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <section className="border border-neutral-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className={gurgeSurface.eyebrow}>Today’s view</p><h3 className="mt-3 text-2xl font-medium tracking-tight">Business at a glance.</h3></div><GurgeIcon name="activity" className="h-5 w-5 text-[#4F7F52]" /></div>
        <div className="mt-5 flex items-center gap-3 border-y border-neutral-200 py-3"><span className="flex shrink-0 items-center gap-2 font-mono text-[8px] uppercase tracking-[.16em] text-neutral-500"><span className="h-2 w-2 rounded-full bg-[#4F7F52]" />Update stream</span><p className="truncate text-[10px] text-neutral-500"><span className="font-semibold text-neutral-800">Main Street Buildout</span><span className="mx-2 text-neutral-300">—</span>Scope review is ready for owner approval.</p><span className="ml-auto font-mono text-[9px] text-neutral-400">01 / 03</span></div>
        <div className="mt-5 grid grid-cols-2 border border-neutral-200 sm:grid-cols-4">
          {[
            ['Active jobs', '16'],
            ['Locations', '3'],
            ['At review', '4'],
            ['On plan', '81%'],
          ].map(([label, value]) => <GurgeMetricCell key={label} label={label} value={value} tone={label === 'At review' ? 'gold' : 'green'} className="border-r border-neutral-200 last:border-r-0" />)}
        </div>
        <div className="mt-5 border border-neutral-200">
          {jobs.map((job) => (
            <div key={job.name} className="grid gap-3 border-b border-neutral-200 p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <p className="text-sm font-semibold">{job.name}</p>
                <p className="mt-1 text-[10px] text-neutral-400">{job.location} · Owner {job.owner}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-24 overflow-hidden bg-neutral-100"><div className="h-full bg-[#4F7F52]" style={{ width: `${job.progress}%` }} /></div>
                <span className="w-8 text-right font-mono text-xs text-neutral-400">{job.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col border border-neutral-800 bg-neutral-950 p-5 text-white sm:p-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">Management read</p>
        <h3 className="mt-4 text-2xl font-medium tracking-tight">The portfolio is moving. Two decisions need attention.</h3>
        <div className="mt-6 space-y-3">
          <div className="border border-white/10 p-4"><div className="flex gap-3"><CircleAlert className="mt-0.5 h-4 w-4 text-[#D85A4C]" /><div><p className="text-sm font-semibold">Main Street scope review</p><p className="mt-1 text-xs leading-5 text-neutral-500">Owner review is due today.</p></div></div></div>
          <div className="border border-white/10 p-4"><div className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 text-[#D8B536]" /><div><p className="text-sm font-semibold">Location 03 opening gate</p><p className="mt-1 text-xs leading-5 text-neutral-500">Three confirmations remain open.</p></div></div></div>
          <div className="border border-white/10 p-4"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#6B9B6E]" /><div><p className="text-sm font-semibold">North Harbor is on plan</p><p className="mt-1 text-xs leading-5 text-neutral-500">Milestones and ownership are current.</p></div></div></div>
        </div>
      </section>
    </div>
  );
}

function JobsView() {
  return (
    <section className="border border-neutral-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className={gurgeSurface.eyebrow}>Job control</p><h3 className="mt-2 text-2xl font-medium tracking-tight">Every job, owner, gate, and update.</h3></div><GurgeStatusBadge>16 active</GurgeStatusBadge></div>
      <div className="mt-6 overflow-hidden border border-neutral-200">
        {jobs.map((job, index) => (
          <div key={job.name} className={`grid gap-4 p-5 sm:grid-cols-[minmax(0,1.25fr)_.8fr_.5fr] sm:items-center ${index ? 'border-t border-neutral-200' : ''}`}>
            <div><p className="font-semibold">{job.name}</p><p className="mt-1 text-xs text-neutral-400">{job.location} · {job.owner}</p></div>
            <div><div className="flex items-center justify-between text-[10px] text-neutral-400"><span>Progress</span><span>{job.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden bg-neutral-100"><div className="h-full bg-[#4F7F52]" style={{ width: `${job.progress}%` }} /></div></div>
            <div className="sm:text-right"><GurgeStatusBadge tone={job.status === 'At review' ? 'gold' : 'green'}>{job.status}</GurgeStatusBadge></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LocationsView() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {locations.map((location, index) => (
        <article key={location.name} className={`min-h-72 border p-6 ${index === 0 ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-200 bg-white'}`}>
          <div className="flex items-start justify-between"><GurgeIconTile icon="location" inverse={index === 0} className="h-11 w-11" /><GurgeStatusBadge tone={index === 2 ? 'gold' : 'green'}>{location.state}</GurgeStatusBadge></div>
          <p className={`mt-12 font-mono text-[9px] uppercase tracking-[0.18em] ${index === 0 ? 'text-neutral-500' : 'text-neutral-400'}`}>Managed location</p>
          <h3 className="mt-2 text-2xl font-semibold">{location.name}</h3>
          <div className={`mt-6 grid grid-cols-2 border-t pt-5 ${index === 0 ? 'border-white/10' : 'border-neutral-200'}`}><div><p className="font-mono text-2xl">{location.jobs}</p><p className={`mt-1 text-[8px] uppercase tracking-[0.12em] ${index === 0 ? 'text-neutral-500' : 'text-neutral-400'}`}>Jobs</p></div><div><p className="text-sm font-semibold">{location.signal}</p><p className={`mt-2 text-[8px] uppercase tracking-[0.12em] ${index === 0 ? 'text-neutral-500' : 'text-neutral-400'}`}>Signal</p></div></div>
        </article>
      ))}
    </div>
  );
}

function ReportsView() {
  return (
    <section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
      <div className="border border-neutral-800 bg-neutral-950 p-6 text-white"><GurgeIcon name="report" className="h-6 w-6 text-[#6B9B6E]" /><p className="mt-10 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">Detailed reporting</p><h3 className="mt-3 text-3xl font-medium tracking-tight">Report from portfolio to task without losing context.</h3><p className="mt-5 text-sm leading-7 text-neutral-500">Gurge connects executive status, location performance, job progress, owners, gates, and updates so reports explain both what changed and why it matters.</p></div>
      <div className="border border-neutral-200 bg-white p-6 text-[#171a18]"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Weekly operating report</p><h3 className="mt-2 text-xl font-semibold">Portfolio summary · Week 32</h3></div><TrendingUp className="h-5 w-5 text-[#4F7F52]" /></div><div className="mt-6 grid gap-px border border-neutral-200 bg-neutral-200 sm:grid-cols-2">{[['Delivery','13 of 16 jobs on plan'],['Locations','2 operating · 1 opening'],['Decisions','4 reviews · 2 urgent'],['Reporting','100% owner coverage']].map(([label,value])=><div key={label} className="bg-white p-4"><p className="text-[8px] uppercase tracking-[0.14em] text-neutral-400">{label}</p><p className="mt-2 text-sm font-semibold">{value}</p></div>)}</div><div className="mt-4 border border-neutral-200 bg-[#FAFAF8] p-5"><p className="text-xs font-semibold">Management read</p><p className="mt-2 text-sm leading-6 text-neutral-500">Delivery remains healthy. The immediate management priority is resolving one scope gate and completing vendor confirmations for Location 03.</p></div></div>
    </section>
  );
}

function GurgeWorkspacePreview() {
  const [view, setView] = useState<WorkspaceView>('overview');

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-neutral-300 bg-[#FAFAF8] text-black shadow-[0_42px_120px_rgba(0,0,0,.16)]">
      <div className="flex flex-col border-b border-neutral-200 bg-[#FAFAF8] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 px-5 py-4"><GurgeIconTile icon="brand" solid className="h-9 w-9" /><div><p className="text-sm font-semibold">Gurge <span className="mx-2 text-neutral-300">/</span> <span className="font-normal text-neutral-500">Northside Social</span></p><p className="text-[9px] uppercase tracking-[.14em] text-neutral-400">Multi-location operator</p></div></div>
        <div className="mx-5 mb-4 flex items-center gap-3 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-4 shadow-sm lg:mb-0"><GurgeIconTile icon="account" solid className="h-8 w-8" /><span><span className="block text-[8px] uppercase tracking-[.14em] text-neutral-400">Delivery + accountability</span><span className="block text-xs font-semibold">COO view</span></span></div>
      </div>
      <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-3"><span className="flex shrink-0 items-center gap-2 font-mono text-[8px] uppercase tracking-[.18em] text-neutral-500"><span className="h-2 w-2 rounded-full bg-[#4F7F52]" />Update stream</span><p className="truncate text-[10px] text-neutral-500"><span className="font-semibold text-neutral-800">Location 03</span><span className="mx-2 text-neutral-300">—</span>Opening checklist moved to its final review gate.</p><span className="ml-auto font-mono text-[9px] text-neutral-400">LIVE</span></div>
      <div className="flex overflow-x-auto border-b border-neutral-200 px-3 py-2 lg:px-5">
          {workspaceViews.map(({ id, label, icon }) => (
            <button key={id} type="button" onClick={() => setView(id)} aria-pressed={view === id} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold transition ${view === id ? 'bg-neutral-950 text-white' : 'text-neutral-400 hover:bg-neutral-100 hover:text-black'}`}><GurgeIcon name={icon} className="h-3.5 w-3.5" />{label}</button>
          ))}
      </div>
      <div className="p-4 sm:p-6">
        <motion.div key={view} initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .28 }}>
          {view === 'overview' ? <OverviewView /> : view === 'jobs' ? <JobsView /> : view === 'locations' ? <LocationsView /> : <ReportsView />}
        </motion.div>
      </div>
    </div>
  );
}

function HeroCommandPanel() {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#101713] shadow-[0_44px_120px_rgba(0,0,0,.42)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#dfe9d8] text-[#17321f]"><GurgeIcon name="brand" className="h-4 w-4" /></span>
          <div><p className="text-sm font-semibold text-white">Gurge</p><p className="text-[10px] text-white/35">Live management dashboard</p></div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.14em] text-white/45"><span className="h-1.5 w-1.5 rounded-full bg-[#8fbd9b]" />Updated now</span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4 sm:col-span-2">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[.16em] text-white/35">Portfolio health</p><p className="mt-2 text-3xl font-semibold text-white">81%</p></div><GurgeStatusBadge>On plan</GurgeStatusBadge></div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[81%] rounded-full bg-[#8fbd9b]" /></div>
        </div>
        <div className="rounded-2xl bg-[#f1eadc] p-4 text-[#171a18]"><p className="text-[9px] uppercase tracking-[.14em] text-black/38">Active work</p><p className="mt-5 text-3xl font-semibold">16</p><p className="mt-1 text-xs text-black/45">Across 3 locations</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4 text-white"><p className="text-[9px] uppercase tracking-[.14em] text-white/35">Needs review</p><p className="mt-5 text-3xl font-semibold">4</p><p className="mt-1 text-xs text-white/40">2 decisions due today</p></div>
        <div className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:col-span-2">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold text-white">Main Street Buildout</p><p className="mt-1 text-[10px] text-white/35">Location 01 · Owner A. Reed</p></div><span className="font-mono text-xs text-white/45">48%</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[48%] rounded-full bg-[#d5b86d]" /></div>
        </div>
      </div>
    </div>
  );
}

export default function GurgePage() {
  return (
    <div className="bg-[#f4f0e7] text-[#171a18]">
      <Seo title="Gurge Management Software" description="Gurge gives owners and operating teams a custom high-level system for managing jobs and locations, tracking accountability, and reporting what is happening in detail." canonicalPath="/gurge" />
      <LiveSiteHeader followPageTheme />

      <section data-header-theme="dark" className="relative overflow-hidden bg-[#172019] pb-20 pt-36 text-white sm:pb-28 sm:pt-44">
        <div aria-hidden="true" className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:68px_68px]" />
        <motion.div aria-hidden="true" className="absolute -right-32 top-0 h-[38rem] w-[38rem] rounded-full bg-[#6b936e]/35 blur-[120px]" animate={{ scale: [1, 1.08, 1], opacity: [.5, .85, .5] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.93fr_1.07fr] lg:items-center lg:px-10">
          <div>
            <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#b5ceb4]">Gurge · Operator · Concept phase</span><span className="text-[10px] uppercase tracking-[.16em] text-white/35">Operations management software</span></div>
            <motion.h1 initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} className="mt-7 max-w-[12ch] text-5xl font-medium leading-[.94] tracking-[-.06em] sm:text-7xl lg:text-[5.8rem]"><DescrambleText text="Manage every job and location from one dashboard." animateOnView delay={120} /></motion.h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/58 sm:text-lg">Gurge gives owners and operations teams a live view of work, accountability, risk, and performance—without rebuilding the business in spreadsheets every week.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="mailto:info@b2w-ai.com?subject=Gurge%20Product%20Walkthrough" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#172019] transition hover:bg-[#dfe9d8]">Request early access<ArrowRight className="h-4 w-4" /></a><a href="#product" className="inline-flex min-h-12 items-center rounded-full border border-white/18 px-5 text-sm font-semibold text-white/75 transition hover:border-white/45 hover:text-white">Explore the product</a></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">{['Portfolio visibility','Job controls','Location reporting'].map((item)=><span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#8fbd9b]" />{item}</span>)}</div>
          </div>
          <HeroCommandPanel />
        </div>
      </section>

      <section data-header-theme="light" className="border-b border-black/10 bg-white"><div className="mx-auto grid max-w-7xl gap-px bg-black/10 sm:grid-cols-3">{[
        ['One source of truth','Jobs, locations, ownership, updates, and decisions stay connected.'],
        ['Built around your operation','Configure the workspace to match the way your team actually runs.'],
        ['Reports with context','Move from a portfolio signal to the work and decisions behind it.'],
      ].map(([title,body])=><div key={title} className="bg-white px-5 py-8 sm:px-8 lg:px-10"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-xs leading-5 text-black/48">{body}</p></div>)}</div></section>

      <section id="product" data-header-theme="light" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="mb-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#56765b]">Inside Gurge</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-6xl">The management view and the operating detail.</h2></div><p className="max-w-2xl text-base leading-8 text-black/55 lg:justify-self-end">Start with the state of the business. Drill into a location, job, owner, gate, or update only when you need the detail. Gurge keeps both levels in the same system.</p></div><GurgeWorkspacePreview /></section>

      <section data-header-theme="light" className="border-y border-black/10 bg-white"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="max-w-3xl"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#56765b]">Core product</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Control the work without slowing it down.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[
        [BriefcaseBusiness, 'Job management', 'Set ownership, milestones, review gates, progress, and current status for every active job.'],
        [Building2, 'Location operations', 'Run each location independently while maintaining shared standards and portfolio visibility.'],
        [ClipboardCheck, 'Accountability', 'Make the next action, responsible owner, due date, and blocker visible before work stalls.'],
        [CalendarClock, 'Reviews and gates', 'Bring approvals and operating decisions forward at the moment management attention is needed.'],
        [Layers3, 'Connected context', 'Keep updates, reports, decisions, and files attached to the work they explain.'],
        [BarChart3, 'Detailed reporting', 'Turn live operating signals into a management read across delivery, risk, and performance.'],
      ].map(([Icon,title,body],index)=><article key={String(title)} className={`min-h-72 rounded-[1.5rem] border border-black/10 p-6 sm:p-7 ${index === 0 ? 'bg-[#172019] text-white' : 'bg-[#f4f0e7]'}`}><Icon className={`h-6 w-6 ${index === 0 ? 'text-[#a9c7a8]' : 'text-[#56765b]'}`} /><p className={`mt-14 text-[9px] font-semibold uppercase tracking-[.16em] ${index === 0 ? 'text-white/35' : 'text-black/35'}`}>Gurge module</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.035em]">{title as string}</h3><p className={`mt-4 text-sm leading-7 ${index === 0 ? 'text-white/52' : 'text-black/52'}`}>{body as string}</p></article>)}</div></div></section>

      <section data-header-theme="light" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#56765b]">From update to decision</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">A workflow management can trust.</h2><p className="mt-5 text-sm leading-7 text-black/52">Gurge turns everyday operating activity into structured, reviewable information without adding another reporting exercise.</p></div><ol className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white">{[
        [Zap, 'Capture the update', 'Record progress, issues, changes, and next actions where the work lives.'],
        [ShieldCheck, 'Apply ownership and controls', 'Route the item to the right owner, deadline, review, or approval gate.'],
        [TrendingUp, 'Keep reports current', 'Company and location reports update when the underlying work changes.'],
        [FileText, 'Publish the management read', 'Report what moved, what is at risk, and which decisions need attention.'],
      ].map(([Icon,title,body],index)=><li key={String(title)} className={`grid gap-4 p-6 sm:grid-cols-[auto_1fr] sm:p-7 ${index ? 'border-t border-black/10' : ''}`}><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e2eadc] text-[#315b3b]"><Icon className="h-5 w-5" /></span><div><div className="flex items-center gap-3"><span className="font-mono text-[10px] text-black/30">0{index+1}</span><h3 className="text-lg font-semibold">{title as string}</h3></div><p className="mt-2 text-sm leading-6 text-black/50">{body as string}</p></div></li>)}</ol></div></section>

      <section data-header-theme="light" className="bg-[#dfe7d9]"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#42654a]">Built for the operating team</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">The same facts, shaped for each role.</h2></div><div className="grid gap-4 sm:grid-cols-3">{[
        [UsersRound,'Owners','See company progress, risks, and the decisions that need attention.'],
        [LayoutDashboard,'Operations leaders','Coordinate jobs and locations through one consistent management system.'],
        [MapPin,'Location managers','Own the work, updates, reviews, and performance within a focused location view.'],
      ].map(([Icon,title,body])=><article key={String(title)} className="rounded-[1.5rem] bg-white/75 p-6"><Icon className="h-5 w-5 text-[#42654a]" /><h3 className="mt-10 text-lg font-semibold">{title as string}</h3><p className="mt-3 text-sm leading-6 text-black/50">{body as string}</p></article>)}</div></div></div></section>

      <section data-header-theme="dark" className="bg-[#172019] text-white"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10"><div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#a9c7a8]">Gurge · Operator · Concept phase</p><h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Manage the business around the way your team already works.</h2><p className="mt-5 max-w-2xl text-base leading-8 text-white/55">Show us the jobs, locations, reports, and decisions your team manages today. We’ll map a dashboard that keeps the work organized and shows managers what needs attention.</p></div><a href="mailto:info@b2w-ai.com?subject=Gurge%20Early%20Access" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#172019] transition hover:bg-[#dfe9d8]">Request early access<ArrowRight className="h-4 w-4" /></a></div></div></section>
      <div data-header-theme="dark" className="bg-[#172019]"><HomeSiteFooter className="text-white/55" /></div>
    </div>
  );
}
