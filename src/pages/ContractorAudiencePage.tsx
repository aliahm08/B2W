import { useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Link2,
  Radio,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import Seo from '../components/Seo';
import PreviewFooter from '../components/PreviewFooter';
import { LiveSiteHeader } from '../components/V2SiteChrome';

export type ContractorAudience = 'business-owners' | 'project-coordinators' | 'operations-teams';

type AudienceConfig = {
  navLabel: string;
  title: string;
  description: string;
  heroImage: string;
  heroSrcSet: string;
  heroAlt: string;
  painsTitle: string;
  pains: Array<{ title: string; body: string; Icon: ComponentType<{ className?: string }> }>;
  flowTitle: string;
  flowDescription: string;
  flow: Array<{ label: string; detail: string }>;
  closingTitle: string;
  closingBody: string;
};

const audienceConfigs: Record<ContractorAudience, AudienceConfig> = {
  'business-owners': {
    navLabel: 'Business owners',
    title: 'Know which jobs need you before they become problems.',
    description: 'You should not have to chase every superintendent, open every thread, or rebuild the story of a job just to understand margin, risk, and customer commitments.',
    heroImage: '/images/contractor-audiences/business-owners-1280.jpg',
    heroSrcSet: '/images/contractor-audiences/business-owners-640.jpg 640w, /images/contractor-audiences/business-owners-1280.jpg 1280w, /images/contractor-audiences/business-owners.png 1586w',
    heroAlt: 'General contracting business owner reviewing active project plans and job records.',
    painsTitle: 'Growth creates distance from the work. The information rarely catches up.',
    pains: [
      { title: 'No operating picture', body: 'Job health is split across calls, messages, spreadsheets, and the people who remember what happened.', Icon: CircleDot },
      { title: 'Decisions arrive late', body: 'Scope changes, customer concerns, and cost pressure reach you after the team has already worked around them.', Icon: Clock3 },
      { title: 'The business depends on memory', body: 'As more work is added, standards become tribal knowledge and oversight becomes another full-time job.', Icon: AlertTriangle },
    ],
    flowTitle: 'Move from chasing updates to reviewing exceptions.',
    flowDescription: 'Bring the signals that matter into one review rhythm so leaders can see what changed, where attention is needed, and who owns the next move.',
    flow: [
      { label: 'Collect', detail: 'Job updates, commitments, changes, and open questions' },
      { label: 'Connect', detail: 'Match each signal to the right job and operating context' },
      { label: 'Surface', detail: 'Show exceptions, risks, and decisions that need leadership' },
      { label: 'Confirm', detail: 'Record the owner, decision, and next review point' },
    ],
    closingTitle: 'Lead the business without becoming its routing system.',
    closingBody: 'Start with the recurring decision that takes the most chasing, then design a reliable path from job signal to owner review.',
  },
  'project-coordinators': {
    navLabel: 'Project coordinators',
    title: 'Keep the job moving without carrying every detail in your head.',
    description: 'Project coordinators sit between the customer, field, office, schedule, and budget. The work gets risky when those conversations stop forming one reliable job record.',
    heroImage: '/images/contractor-audiences/project-managers-1280.jpg',
    heroSrcSet: '/images/contractor-audiences/project-managers-640.jpg 640w, /images/contractor-audiences/project-managers-1280.jpg 1280w, /images/contractor-audiences/project-managers.png 1586w',
    heroAlt: 'Construction project coordinator organizing a commercial renovation with a superintendent.',
    painsTitle: 'The job moves faster than its documentation.',
    pains: [
      { title: 'Context is scattered', body: 'A decision in a call, a photo in a text, and a change in the field may never meet in the same place.', Icon: Link2 },
      { title: 'Field and office drift apart', body: 'Crews work from the latest conversation while the office works from the latest document.', Icon: Radio },
      { title: 'Documentation happens twice', body: 'The same site facts are rewritten for scopes, updates, estimates, reports, and customer follow-up.', Icon: ClipboardCheck },
    ],
    flowTitle: 'Turn field information into an approved next move.',
    flowDescription: 'Capture information where the work happens, preserve its job context, and make the next document or decision reviewable before it travels.',
    flow: [
      { label: 'Capture', detail: 'Voice, photos, messages, markups, and field conditions' },
      { label: 'Contextualize', detail: 'Connect the update to scope, standards, and prior decisions' },
      { label: 'Structure', detail: 'Prepare the change, document, or follow-up in a usable form' },
      { label: 'Approve', detail: 'Review the output and send the right next action' },
    ],
    closingTitle: 'Make the job record keep pace with the job.',
    closingBody: 'Begin with one repeated update, document, or approval that currently depends on a project coordinator stitching the context together manually.',
  },
  'operations-teams': {
    navLabel: 'Operations teams',
    title: 'Turn handoffs into a reliable operating rhythm.',
    description: 'Operations teams connect staffing, purchasing, schedules, project support, and reporting. Small gaps in those handoffs become delays everywhere else.',
    heroImage: '/images/contractor-audiences/operations-teams-1280.jpg',
    heroSrcSet: '/images/contractor-audiences/operations-teams-640.jpg 640w, /images/contractor-audiences/operations-teams-1280.jpg 1280w, /images/contractor-audiences/operations-teams.png 1587w',
    heroAlt: 'Construction operations team coordinating schedules, materials, and field support around a shared worktable.',
    painsTitle: 'Every job has a process. Too much of it lives between systems.',
    pains: [
      { title: 'Requests arrive without structure', body: 'Field needs, customer changes, and internal requests enter through different channels with different levels of detail.', Icon: Radio },
      { title: 'Ownership is implied', body: 'People know a task exists, but the responsible person, deadline, and confirmation are not consistently visible.', Icon: UsersRound },
      { title: 'Reporting is rebuilt', body: 'Status meetings depend on people collecting and translating updates instead of reviewing one current operating picture.', Icon: TrendingUp },
    ],
    flowTitle: 'Create one path from request to confirmation.',
    flowDescription: 'Standardize how work enters the operation, how it is routed, and how completion becomes visible—without forcing every team into a new way of communicating.',
    flow: [
      { label: 'Receive', detail: 'Capture requests with the job, need, timing, and source intact' },
      { label: 'Route', detail: 'Send the work to the right role with a clear expectation' },
      { label: 'Track', detail: 'Keep changes, blockers, and approvals attached to the task' },
      { label: 'Report', detail: 'Roll confirmed activity into a current operating view' },
    ],
    closingTitle: 'Build the rhythm the company can rely on.',
    closingBody: 'Choose one high-volume handoff—crew support, purchasing, changes, closeout, or reporting—and make its path visible from request through confirmation.',
  },
};

const audienceOrder: ContractorAudience[] = ['business-owners', 'project-coordinators', 'operations-teams'];

export default function ContractorAudiencePage() {
  const [audience, setAudience] = useState<ContractorAudience>('business-owners');
  const config = audienceConfigs[audience];

  return (
    <div className="min-h-screen bg-[#0b0f0d] text-white selection:bg-[#a9c7a8] selection:text-[#0b0f0d]">
      <Seo
        title="AI Solutions for General Contractors"
        description="Find job information faster, keep field work moving, and explore practical AI solutions for general contracting owners, project coordinators, and operations teams."
        canonicalPath="/general-contractors"
      />
      <LiveSiteHeader theme="dark" followPageTheme />
      <main>
        <section data-header-theme="dark" className="relative min-h-[92svh] overflow-hidden border-b border-white/10">
          <img
            src="/images/contractor-audiences/business-owners-1280.jpg"
            srcSet="/images/contractor-audiences/business-owners-640.jpg 640w, /images/contractor-audiences/business-owners-1280.jpg 1280w, /images/contractor-audiences/business-owners.png 1586w"
            sizes="100vw"
            alt="General contractor reviewing active job information and project plans."
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,9,.96)_0%,rgba(7,11,9,.82)_42%,rgba(7,11,9,.22)_78%),linear-gradient(0deg,rgba(7,11,9,.86)_0%,transparent_45%)]" />
          <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-36 sm:px-8 sm:pb-20 lg:px-10">
            <div className="max-w-4xl">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#a9c7a8]">General contracting</p>
              <h1 className="mt-7 max-w-[13ch] text-[clamp(3.7rem,8vw,7.8rem)] font-medium leading-[.88] tracking-[-.07em]">Find job information faster and keep field work moving.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl">Help field and office teams find decisions, changes, requests, and updates in approved work messages. Start with search and summaries, then add more workflows when the team is ready.</p>
              <a href="#by-function" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c6ddc4] px-6 text-sm font-semibold text-[#101511] transition hover:bg-white">Explore by function <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <section id="by-function" data-header-theme="dark" className="scroll-mt-24 border-b border-white/10 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#a9c7a8]">Solutions by function</p><h2 className="mt-5 text-4xl font-medium leading-[.98] tracking-[-.05em] sm:text-6xl">See where work breaks down for each team.</h2></div>
            <nav aria-label="General contractor functions" className="mt-10 grid gap-2 sm:grid-cols-3">
              {audienceOrder.map((item) => <button key={item} type="button" onClick={() => setAudience(item)} aria-pressed={item === audience} className={`cursor-pointer rounded-[1rem] border px-5 py-4 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9c7a8]/55 ${item === audience ? 'border-[#a9c7a8] bg-[#a9c7a8] text-[#101511]' : 'border-white/15 bg-white/[.025] text-white/62 hover:border-white/40 hover:text-white'}`}>{audienceConfigs[item].navLabel}</button>)}
            </nav>
            <AnimatePresence mode="wait">
              <motion.div key={`function-${audience}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3 }} className="mt-5 overflow-hidden rounded-[2rem] border border-white/12 bg-[#111714]">
                <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                  <div className="relative min-h-[24rem] overflow-hidden border-b border-white/10 lg:min-h-full lg:border-b-0 lg:border-r"><img src={config.heroImage} srcSet={config.heroSrcSet} sizes="(max-width: 1023px) 100vw, 45vw" alt={config.heroAlt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#080c0a]/85 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#c6ddc4]">{config.navLabel}</p><h3 className="mt-3 max-w-[16ch] text-3xl font-medium leading-[1] tracking-[-.045em]">{config.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-white/65">{config.description}</p></div></div>
                  <div className="p-6 sm:p-8"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#a9c7a8]">Where work breaks down</p><h3 className="mt-4 max-w-[18ch] text-3xl font-medium leading-[1.02] tracking-[-.04em] sm:text-4xl">{config.painsTitle}</h3><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{config.pains.map(({ title, body, Icon }, index) => <article key={title} className="grid gap-4 py-6 sm:grid-cols-[auto_1fr]"><div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-[#a9c7a8]"><Icon className="h-4 w-4" /></div><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/32">Breakdown {index + 1}</p><h4 className="mt-2 text-xl font-semibold tracking-[-.03em]">{title}</h4><p className="mt-2 text-sm leading-6 text-white/52">{body}</p></div></article>)}</div></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section data-header-theme="dark" className="relative overflow-hidden border-b border-white/10 bg-[#111714] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#426149]/20 blur-[120px]" />
          <motion.div key={`flow-${audience}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="relative mx-auto max-w-7xl">
            <div className="max-w-4xl"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#a9c7a8]">A better operating path</p><h2 className="mt-5 text-4xl font-medium leading-[.98] tracking-[-.05em] sm:text-6xl">{config.flowTitle}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-white/58">{config.flowDescription}</p></div>
            <ol className="mt-12 grid gap-3 lg:grid-cols-4">
              {config.flow.map((step, index) => <li key={step.label} className="relative min-h-64 overflow-hidden rounded-[1.5rem] border border-white/12 bg-[#0b0f0d]/75 p-6"><div className="flex items-center justify-between"><span className="font-mono text-xs text-[#a9c7a8]">0{index + 1}</span><CheckCircle2 className="h-5 w-5 text-white/24" /></div><h3 className="mt-14 text-2xl font-semibold">{step.label}</h3><p className="mt-3 text-sm leading-7 text-white/52">{step.detail}</p>{index < config.flow.length - 1 ? <ArrowRight className="absolute -right-2 top-1/2 z-10 hidden h-5 w-5 text-[#a9c7a8] lg:block" /> : null}</li>)}
            </ol>
          </motion.div>
        </section>

        <section data-header-theme="dark" className="border-b border-white/10 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div><ShieldCheck className="h-8 w-8 text-[#a9c7a8]" /><p className="mt-6 font-mono text-[10px] uppercase tracking-[.2em] text-[#a9c7a8]">Illustrative average ROI</p><h2 className="mt-4 max-w-[14ch] text-4xl font-medium leading-[.98] tracking-[-.05em] sm:text-6xl">Measure the operating outcome.</h2><p className="mt-6 max-w-xl text-base leading-8 text-white/55">The current contractor model uses a 12-person company with six active jobs and values recovered communication-search time at $65 per hour. These are planning assumptions, not guaranteed results.</p></div>
            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/12 sm:grid-cols-3">
              <article className="min-h-60 bg-[#111714] p-6"><p className="text-4xl font-medium tracking-[-.05em] text-[#c6ddc4]">54 hrs/mo</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.18em] text-white/40">Less time</p><p className="mt-4 text-sm leading-7 text-white/55">Illustrative communication-search time recovered across the modeled coordination team.</p></article>
              <article className="min-h-60 bg-[#111714] p-6"><p className="text-4xl font-medium tracking-[-.05em] text-[#c6ddc4]">30%</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.18em] text-white/40">Faster decisions</p><p className="mt-4 text-sm leading-7 text-white/55">Modeled recovery of time spent searching and reconstructing context before the next decision.</p></article>
              <article className="min-h-60 bg-[#111714] p-6"><p className="text-4xl font-medium tracking-[-.05em] text-[#c6ddc4]">1 record</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[.18em] text-white/40">Better job records</p><p className="mt-4 text-sm leading-7 text-white/55">A connected, reviewable job history for decisions, changes, requests, and follow-up.</p></article>
            </div>
          </div>
        </section>

        <section data-header-theme="dark" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#a9c7a8]/25 bg-[linear-gradient(135deg,#19241d,#101511)] p-7 sm:p-12">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#a9c7a8]">Choose one recurring problem</p>
            <div className="mt-5 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><h2 className="max-w-[14ch] text-4xl font-medium leading-[.98] tracking-[-.05em] sm:text-6xl">{config.closingTitle}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-white/58">{config.closingBody}</p></div><div className="flex flex-col gap-3 sm:flex-row lg:justify-end"><Link to="/contact?type=contractor-solution" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c6ddc4] px-6 text-sm font-semibold text-[#101511] transition hover:bg-white">Map the problem <ArrowRight className="h-4 w-4" /></Link><Link to="/jasonai" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-semibold text-white/78 transition hover:border-white/45 hover:text-white">Explore communication clarity</Link></div></div>
          </div>
        </section>
      </main>
      <PreviewFooter />
    </div>
  );
}
