import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock3,
  Link2,
  Mail,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Seo from '../../components/Seo';
import ProjectIntelligenceCTA from '../../components/site/ProjectIntelligenceCTA';
import { ButtonLink, Eyebrow, pageWidth } from '../../components/site/PublicUI';

const recordRows = [
  { job: 'Main Street Buildout', change: 'Layout approval received', source: 'Client email · 8 min', status: 'On track', tone: 'green' },
  { job: 'North Harbor Renovation', change: 'Finish selection still open', source: 'Project chat · 18 min', status: 'Needs review', tone: 'gold' },
  { job: 'Oak Avenue Addition', change: 'Supplier date moved 3 days', source: 'Vendor email · 31 min', status: 'At risk', tone: 'red' },
] as const;

function StaticSectionHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <header className="mb-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.65fr)] lg:items-end">
      <div><Eyebrow tone="green">{index}</Eyebrow><h2 className="mt-4 max-w-[18ch] text-4xl font-medium leading-[1] tracking-[-.045em] sm:text-5xl">{title}</h2></div>
      <p className="max-w-2xl text-sm leading-7 text-black/55">{description}</p>
    </header>
  );
}

function DashboardPreview() {
  return (
    <motion.div initial={{ opacity: 0, y: 22, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: .16, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-[2rem] border border-white/12 bg-[#101713] shadow-[0_40px_120px_rgba(0,0,0,.42)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfe9d8] text-[#17321f]"><BarChart3 className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-white">B2W Dashboard</p><p className="text-[10px] text-white/35">Source-linked project intelligence</p></div></div>
        <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.13em] text-white/45"><span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-[#8fbd9b] opacity-50" /><span className="relative h-1.5 w-1.5 rounded-full bg-[#8fbd9b]" /></span>Live record</span>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[.68fr_1.32fr]">
        <div className="space-y-3">
          {([
            ['Active projects', '12', Activity],
            ['Needs attention', '3', AlertTriangle],
            ['Decisions waiting', '5', Clock3],
          ] as const).map(([label, value, Icon]) => <div key={label} className="border border-white/10 bg-white/[.035] p-4"><div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.13em] text-white/32">{label}</p><Icon className="h-3.5 w-3.5 text-[#a9c7a8]" /></div><p className="mt-5 text-4xl font-medium tracking-[-.05em] text-white">{value}</p></div>)}
          <div className="border border-[#8fbd9b]/25 bg-[#8fbd9b]/[.07] p-4"><p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.13em] text-[#a9c7a8]"><RefreshCw className="h-3 w-3" />Updated by connected signals</p><p className="mt-3 text-xs leading-6 text-white/42">No separate round of dashboard entry is required for the approved sources in the workflow.</p></div>
        </div>

        <div className="overflow-hidden border border-white/10 bg-[#131b16]">
          <div className="flex items-center justify-between border-b border-white/10 p-4"><div><p className="text-[9px] uppercase tracking-[.14em] text-[#a9c7a8]">Attention view</p><p className="mt-1 text-sm font-semibold text-white">What changed across active work</p></div><Sparkles className="h-4 w-4 text-[#a9c7a8]" /></div>
          <div>
            {recordRows.map((row) => <div key={row.job} className="grid gap-3 border-b border-white/8 p-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-xs font-semibold text-white">{row.job}</p><p className="mt-1 text-[10px] text-white/42">{row.change}</p><p className="mt-2 flex items-center gap-1.5 text-[9px] text-[#a9c7a8]"><Link2 className="h-3 w-3" />{row.source}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.1em] ${row.tone === 'green' ? 'bg-[#dfe9d8] text-[#315e3a]' : row.tone === 'gold' ? 'bg-[#efe4c9] text-[#735a24]' : 'bg-[#f1d5d0] text-[#813e35]'}`}>{row.status}</span></div>)}
          </div>
          <div className="grid grid-cols-2 border-t border-white/10"><div className="p-4"><p className="text-[8px] uppercase tracking-[.12em] text-white/28">Update rule</p><p className="mt-2 text-[10px] leading-5 text-white/48">Refresh when owner, date, dependency, or approval changes.</p></div><div className="border-l border-white/10 p-4"><p className="text-[8px] uppercase tracking-[.12em] text-white/28">Connected evidence</p><p className="mt-2 text-[10px] leading-5 text-white/48">Email · messages · schedule · job record</p></div></div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OptimizationDashboardPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f3f5f0] text-[#172019]">
      <Seo title="B2W Project Intelligence Dashboard" description="See how B2W turns approved project communication and connected systems into a live, source-linked operating view for contractor decisions." canonicalPath="/dashboard" />
      <main>
        <section className="relative overflow-hidden bg-[#172019] pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
          <div aria-hidden="true" className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-[#6b936e]/22 blur-[110px]" />
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.04]" />
          <div className={`${pageWidth} relative`}>
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#a9c7a8]">Optimization · Project intelligence · Private beta</p>
                <h1 className="mt-6 max-w-[12ch] text-5xl font-medium leading-[.94] tracking-[-.058em] sm:text-7xl lg:text-[6.2rem]">The dashboard your projects update for you.</h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="border-l border-[#8fbd9b]/45 pl-6 sm:pl-8">
                <p className="max-w-xl text-base leading-8 text-white/60 sm:text-lg">Approved messages, emails, client decisions, schedules, and job updates become a live operating record—with the source, time, and update rule retained.</p>
                <div className="mt-7 flex flex-wrap gap-3"><ButtonLink to="mailto:info@b2w-ai.com?subject=B2W%20dashboard%20private%20beta" variant="secondary" className="!border-white/10 !bg-white !text-[#172019]">Discuss the dashboard</ButtonLink><ButtonLink to="/workflows" variant="tertiary" className="text-white hover:text-[#a9c7a8]">See it in a workflow</ButtonLink></div>
              </motion.div>
            </div>
            <div className="mt-12"><DashboardPreview /></div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-20 sm:py-28">
          <div className={pageWidth}>
            <StaticSectionHeading index="How it functions" title="The dashboard is the output of the intelligence." description="The system listens to approved work signals, resolves what changed, and maintains the operating view so people can focus on exceptions and decisions." />
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 lg:grid-cols-3">
              {([
                ['The team keeps working', 'Messages, email, field updates, schedules, and connected systems continue to carry day-to-day project activity.', MessageCircle],
                ['B2W resolves the change', 'Each approved signal is connected to the right job, owner, task, date, status, dependency, and rule.', Sparkles],
                ['The operating view stays current', 'The dashboard refreshes the relevant record and keeps the evidence attached for review.', RefreshCw],
              ] as const).map(([title, body, Icon], index) => <article key={title} className="min-h-72 bg-[#f3f5f0] p-7 sm:p-8"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#172019] text-[#a9c7a8]"><Icon className="h-5 w-5" /></span><p className="mt-10 text-[9px] font-semibold uppercase tracking-[.16em] text-[#4f7f52]">0{index + 1}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-7 text-black/55">{body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#172019] py-20 text-white sm:py-28">
          <div className={pageWidth}>
            <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#a9c7a8]">Optimization means attention</p><h2 className="mt-5 max-w-[13ch] text-5xl font-medium leading-[.96] tracking-[-.052em] sm:text-7xl">See the work that needs judgment now.</h2></div><p className="max-w-xl text-base leading-8 text-white/52 lg:justify-self-end">A useful dashboard does not merely display everything. It shows the exceptions, dependencies, and decisions that can change the project outcome.</p></div>
            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {([
                ['Client decision risk', 'Find jobs where an unanswered approval controls field work, schedule, or revenue.', Mail],
                ['Schedule movement', 'See when a supplier date, crew constraint, or dependent task changes the plan.', Clock3],
                ['Ownership gaps', 'Surface open items without a clear owner, response, or due date.', AlertTriangle],
                ['Custom operating views', 'Ask for a new business view, review its sources and rules, then save it for continued updates.', BarChart3],
              ] as const).map(([title, body, Icon]) => <article key={title} className="border border-white/10 bg-white/[.035] p-6 sm:p-7"><Icon className="h-5 w-5 text-[#a9c7a8]" /><h3 className="mt-9 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-7 text-white/45">{body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className={`${pageWidth} grid gap-10 lg:grid-cols-[.75fr_1.25fr]`}>
            <div><Eyebrow tone="green">Trust the record</Eyebrow><h2 className="mt-5 max-w-[13ch] text-5xl font-medium leading-[.96] tracking-[-.052em] sm:text-6xl">Every visible fact should be reviewable.</h2></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ['Source retained', 'Open the message, email, or connected record behind the update.', Link2],
                ['Time retained', 'See when the source arrived and when the operating record changed.', Clock3],
                ['Rule retained', 'Understand which condition caused the line or view to refresh.', RefreshCw],
                ['People stay in control', 'Review exceptions and approve consequential decisions and actions.', ShieldCheck],
              ] as const).map(([title, body, Icon]) => <article key={title} className="rounded-[1.5rem] border border-black/10 bg-white/70 p-6"><Icon className="h-5 w-5 text-[#4f7f52]" /><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-black/52">{body}</p></article>)}
            </div>
          </div>
        </section>

        <ProjectIntelligenceCTA eyebrow="Optimization fit" title="Choose the operating view your team keeps rebuilding by hand." description="Start with one recurring review—project risk, client decisions, schedule movement, ownership, or progress—and map the approved sources that should maintain it." action={{ label: 'Discuss optimization', to: 'mailto:info@b2w-ai.com?subject=B2W%20optimization%20dashboard' }} secondary={{ label: 'Explore workflows', to: '/workflows' }} />
      </main>
    </div>
  );
}
