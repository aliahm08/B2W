import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  Mail,
  MessageCircle,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import ProjectIntelligenceCTA from '../../components/site/ProjectIntelligenceCTA';
import { ButtonLink, Eyebrow, pageWidth } from '../../components/site/PublicUI';

const sourceSignals = [
  { label: 'Project messages', detail: 'Client approved the change', icon: MessageCircle, color: '#9cc9dc' },
  { label: 'Email decisions', detail: 'Revised finish selected', icon: Mail, color: '#9cc9dc' },
  { label: 'Field notes', detail: 'Two-day access delay', icon: Mic, color: '#a9c7a8' },
  { label: 'Project documents', detail: 'Scope v4 uploaded', icon: FileText, color: '#d9a9c2' },
] as const;

const intelligenceOutputs = [
  { label: 'Decision captured', tone: 'text-[#9cc9dc]' },
  { label: 'Scope ready to review', tone: 'text-[#d9a9c2]' },
  { label: 'Schedule risk flagged', tone: 'text-[#a9c7a8]' },
  { label: 'Owner assigned', tone: 'text-[#f4b28c]' },
] as const;

const serviceAreas = [
  {
    index: '01', slug: 'communication', label: 'JasonAI', function: 'Communication', product: 'AI assistant',
    title: 'Know what the project already said.',
    body: 'Search approved conversations, catch up on activity, and surface the decisions, questions, and commitments buried in everyday communication.',
    examples: ['Search project conversations', 'Summarize what changed', 'Surface open commitments'],
    to: '/workflows#workflow-examples', action: 'See it in a workflow', status: 'Available now', icon: MessageCircle, theme: 'navy',
  },
  {
    index: '02', slug: 'documentation', label: 'Clara', function: 'Documentation', product: 'Document workspace',
    title: 'Carry context into the document.',
    body: 'Develop scopes, estimates, proposals, and reports from approved project context and company standards—with people reviewing every deliverable.',
    examples: ['Develop structured scopes', 'Review estimates and proposals', 'Apply company standards'],
    to: '/workflows#workflow-examples', action: 'See it in a workflow', status: 'Concept phase', icon: FileCheck2, theme: 'plum',
  },
  {
    index: '03', slug: 'optimization', label: 'B2W Dashboard', function: 'Optimization', product: 'Operating view',
    title: 'See where attention belongs next.',
    body: 'Turn approved project signals into a source-linked view of jobs, owners, schedules, risks, and the decisions holding work back.',
    examples: ['Track actionable exceptions', 'See ownership and risk', 'Return to the source'],
    to: '/workflows#workflow-examples', action: 'See it in a workflow', status: 'Private beta', icon: BarChart3, theme: 'green',
  },
] as const;

const workflowCases = [
  {
    id: 'change', tab: 'Change approval', context: 'A client approves a change in a project thread.',
    outcome: 'The decision becomes a reviewable scope update and a visible cost and schedule action.',
    steps: [
      { label: 'JasonAI', title: 'Capture the approval', body: 'JasonAI finds the decision, related questions, and who made the commitment.', color: '#9cc9dc' },
      { label: 'Clara', title: 'Prepare the revision', body: 'Clara carries the approved context into a scope or estimate for human review.', color: '#d9a9c2' },
      { label: 'B2W Dashboard', title: 'Refresh the operating view', body: 'The dashboard surfaces the cost, schedule, owner, and next action together.', color: '#a9c7a8' },
    ],
  },
  {
    id: 'update', tab: 'Owner update', context: 'The owner asks for a clear weekly project update.',
    outcome: 'The team moves from reconstructing the week to reviewing a source-linked project story.',
    steps: [
      { label: 'JasonAI', title: 'Find the week’s changes', body: 'JasonAI gathers approved decisions, blockers, requests, and commitments.', color: '#9cc9dc' },
      { label: 'Clara', title: 'Develop the update', body: 'Clara structures the activity into a consistent report for review.', color: '#d9a9c2' },
      { label: 'B2W Dashboard', title: 'Show the exceptions', body: 'The dashboard keeps outstanding risks, owners, and next actions visible.', color: '#a9c7a8' },
    ],
  },
  {
    id: 'risk', tab: 'Schedule risk', context: 'A field note signals that access will be delayed by two days.',
    outcome: 'One field signal reaches the people, documents, and operating decisions it affects.',
    steps: [
      { label: 'JasonAI', title: 'Connect the context', body: 'JasonAI finds the related schedule promises and unresolved coordination.', color: '#9cc9dc' },
      { label: 'Clara', title: 'Update what changed', body: 'Clara helps revise the affected report, notice, or working scope.', color: '#d9a9c2' },
      { label: 'B2W Dashboard', title: 'Route the response', body: 'The dashboard flags the exception, its owner, and the decision needed next.', color: '#a9c7a8' },
    ],
  },
] as const;

const setupSteps = [
  { number: '01', title: 'Connect', body: 'Choose the approved messages, documents, and systems that already carry the project truth.' },
  { number: '02', title: 'Organize', body: 'B2W connects each signal to the right project, decision, document, owner, and next action.' },
  { number: '03', title: 'Act', body: 'People review the result, make the consequential decision, and expand only when the workflow proves useful.' },
] as const;

function SectionHeading({ eyebrow, title, description, tone = 'rust' }: { eyebrow: string; title: string; description: string; tone?: 'rust' | 'green' | 'plum' }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.62fr)] lg:items-end"
    >
      <div><Eyebrow tone={tone}>{eyebrow}</Eyebrow><h2 className="mt-5 max-w-[14ch] text-[clamp(2.7rem,5vw,5.25rem)] font-medium leading-[.94] tracking-[-.055em]">{title}</h2></div>
      <p className="max-w-xl text-base leading-8 text-[var(--b2w-ink-muted)]">{description}</p>
    </motion.header>
  );
}

function SignalSystem() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: .7, delay: .18, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.035] p-4 shadow-[0_40px_120px_rgba(0,0,0,.35)] sm:p-6 lg:min-h-[39rem]"
    >
      <div aria-hidden="true" className="b2w-dark-grid-field absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f4b28c]/10 blur-[70px]" />
      <div className="relative flex items-center justify-between border-b border-white/8 pb-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.17em] text-white/42"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a9c7a8] opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#a9c7a8]" /></span>Project signal flow</div>
        <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/28">Source linked</span>
      </div>

      <svg aria-hidden="true" viewBox="0 0 720 430" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-5 top-24 hidden h-[29rem] w-[calc(100%-2.5rem)] lg:block">
        <defs><linearGradient id="hero-signal-in" x1="0" x2="1"><stop offset="0" stopColor="#9cc9dc" stopOpacity=".08" /><stop offset="1" stopColor="#f4b28c" stopOpacity=".8" /></linearGradient><linearGradient id="hero-signal-out" x1="0" x2="1"><stop offset="0" stopColor="#f4b28c" stopOpacity=".8" /><stop offset="1" stopColor="#a9c7a8" stopOpacity=".08" /></linearGradient></defs>
        {['M175 80 C245 80 245 168 330 180', 'M175 178 C250 178 250 190 330 195', 'M175 276 C245 276 245 212 330 205'].map((path, index) => <motion.path key={path} d={path} pathLength="1" fill="none" stroke="url(#hero-signal-in)" strokeWidth="2" strokeLinecap="round" strokeDasharray=".03 .12" animate={reduceMotion ? undefined : { strokeDashoffset: [0, -1] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'linear', delay: index * .28 }} />)}
        {['M390 190 C470 190 475 102 548 102', 'M390 195 C470 195 475 195 548 195', 'M390 200 C470 200 475 288 548 288'].map((path, index) => <motion.path key={path} d={path} pathLength="1" fill="none" stroke="url(#hero-signal-out)" strokeWidth="2" strokeLinecap="round" strokeDasharray=".03 .12" animate={reduceMotion ? undefined : { strokeDashoffset: [0, -1] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'linear', delay: .55 + index * .28 }} />)}
      </svg>

      <div className="relative mt-5 grid gap-4 lg:grid-cols-[1fr_.86fr_1fr] lg:items-center lg:gap-5">
        <div>
          <p className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#9cc9dc]">Already flowing in</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {sourceSignals.map(({ label, detail, icon: Icon, color }, index) => (
              <motion.div key={label} animate={reduceMotion ? undefined : { borderColor: ['rgba(255,255,255,.08)', `${color}66`, 'rgba(255,255,255,.08)'] }} transition={{ duration: 4.8, repeat: Infinity, delay: index * 1.05, ease: 'easeInOut' }} className="rounded-2xl border border-white/10 bg-[#111315]/78 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-white/42"><Icon className="h-3.5 w-3.5" style={{ color }} />{label}</div><p className="mt-2 text-xs font-medium text-white/82">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div animate={reduceMotion ? undefined : { boxShadow: ['0 0 0 rgba(244,178,140,0)', '0 24px 70px rgba(244,178,140,.16)', '0 0 0 rgba(244,178,140,0)'] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }} className="relative mx-auto my-2 w-full max-w-[15rem] rounded-[1.75rem] border border-[#f4b28c]/28 bg-[#101214]/94 p-5 text-center backdrop-blur-xl lg:my-0">
          <motion.span animate={reduceMotion ? undefined : { rotate: [0, 4, -4, 0], scale: [1, 1.06, 1] }} transition={{ duration: 5, repeat: Infinity }} className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f4b28c] text-[#111315]"><Sparkles className="h-5 w-5" /></motion.span>
          <p className="mt-4 text-[9px] font-semibold uppercase tracking-[.18em] text-[#f4b28c]">B2W project intelligence</p><p className="mt-3 text-sm font-medium leading-6 text-white">Organized by project, decision, and next action.</p>
        </motion.div>

        <div>
          <p className="mb-3 font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#a9c7a8]">Ready to act on</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{intelligenceOutputs.map(({ label, tone }, index) => <motion.div key={label} initial={reduceMotion ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .7 + index * .1 }} className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[.045] px-3.5 py-3 text-xs font-medium text-white/76"><CheckCircle2 className={`h-4 w-4 shrink-0 ${tone}`} />{label}</motion.div>)}</div>
        </div>
      </div>
      <div className="relative mt-5 flex items-start gap-2.5 rounded-2xl border border-white/8 bg-white/[.035] p-3.5 text-[11px] leading-5 text-white/44"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#a9c7a8]" />Every result remains reviewable. People stay responsible for the documents, decisions, and actions that follow.</div>
    </motion.div>
  );
}

function CapabilityVisual({ theme }: { theme: 'navy' | 'plum' | 'green' }) {
  if (theme === 'navy') return (
    <div className="relative h-48 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#102b39] p-4"><div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#9cc9dc]/15 blur-3xl" /><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2.5 text-[10px] text-white/45"><Search className="h-3.5 w-3.5 text-[#9cc9dc]" />What changed on the lobby scope?</div><div className="ml-5 mt-3 rounded-xl border border-[#9cc9dc]/18 bg-[#0d222e] p-3"><p className="text-[9px] font-semibold uppercase tracking-[.13em] text-[#9cc9dc]">3 connected results</p><p className="mt-2 text-xs leading-5 text-white/72">Finish approved Monday. Revised price requested. Field start remains pending access.</p></div><div className="mt-3 flex gap-2 pl-5"><span className="rounded-full bg-white/[.06] px-2.5 py-1 text-[8px] text-white/38">Message</span><span className="rounded-full bg-white/[.06] px-2.5 py-1 text-[8px] text-white/38">Email</span></div></div>
  );
  if (theme === 'plum') return (
    <div className="relative h-48 overflow-hidden rounded-[1.35rem] border border-[#6d5c79]/15 bg-[#f9f5fa] p-4 text-[#3d3245]"><div className="mx-auto h-full max-w-[15rem] rounded-xl border border-black/8 bg-white p-4 shadow-[0_14px_32px_rgba(61,50,69,.10)]"><div className="flex items-center justify-between"><span className="text-[8px] font-semibold uppercase tracking-[.15em] text-[#a66589]">Scope revision</span><span className="rounded-full bg-[#f4e6ee] px-2 py-1 text-[7px] font-semibold text-[#a66589]">Review</span></div><div className="mt-4 h-1.5 w-3/4 rounded-full bg-[#302737]/12" /><div className="mt-2 h-1.5 w-full rounded-full bg-[#302737]/8" /><div className="mt-2 h-1.5 w-5/6 rounded-full bg-[#302737]/8" /><div className="mt-4 border-l-2 border-[#d9a9c2] bg-[#fff6fa] px-3 py-2 text-[8px] leading-4 text-[#6f5968]">Updated from approved client decision</div></div></div>
  );
  return (
    <div className="relative h-48 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#101b13] p-4 text-white"><div className="grid grid-cols-3 gap-2"><div className="col-span-2 rounded-xl border border-white/8 bg-white/[.045] p-3"><p className="text-[8px] uppercase tracking-[.14em] text-white/35">Projects requiring action</p><p className="mt-2 text-2xl font-medium">04</p></div><div className="rounded-xl bg-[#b94235]/18 p-3"><p className="text-[8px] uppercase tracking-[.12em] text-[#e79b92]">At risk</p><p className="mt-2 text-2xl font-medium text-[#e79b92]">02</p></div></div><div className="mt-2 space-y-2">{['Lobby access · owner needed', 'Millwork decision · due today'].map((item, index) => <div key={item} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[.035] px-3 py-2.5 text-[9px] text-white/58"><span>{item}</span><span className={index ? 'text-[#f4b28c]' : 'text-[#a9c7a8]'}>View</span></div>)}</div></div>
  );
}

function UnifiedWorkflow() {
  const [activeId, setActiveId] = useState<(typeof workflowCases)[number]['id']>('change');
  const reduceMotion = useReducedMotion();
  const active = workflowCases.find((item) => item.id === activeId) ?? workflowCases[0];
  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.035]">
      <div className="border-b border-white/10 p-3 sm:p-4"><div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="tablist" aria-label="Workflow examples">{workflowCases.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} onClick={() => setActiveId(item.id)} className={`relative rounded-xl px-4 py-3 text-left text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b28c] ${activeId === item.id ? 'text-white' : 'text-white/40 hover:bg-white/[.04] hover:text-white/70'}`}>{activeId === item.id ? <motion.span layoutId="workflow-tab" className="absolute inset-0 rounded-xl bg-white/[.09]" transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }} /> : null}<span className="relative">{item.tab}</span></button>)}</div></div>
      <motion.div key={active.id} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }} className="p-5 sm:p-7 lg:p-9">
        <div className="grid gap-5 border-b border-white/10 pb-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#f4b28c]">The project signal</p><p className="mt-3 text-xl font-medium leading-7 text-white">{active.context}</p></div><p className="text-sm leading-7 text-white/48 lg:border-l lg:border-white/10 lg:pl-7">{active.outcome}</p></div>
        <div className="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">{active.steps.map((step, index) => <div key={step.label} className="contents">{index ? <div className="flex items-center justify-center py-1 lg:py-0"><ArrowRight className="hidden h-4 w-4 text-white/18 lg:block" /><ArrowDownRight className="h-4 w-4 text-white/18 lg:hidden" /></div> : null}<article className="rounded-[1.4rem] border border-white/9 bg-[#111315]/65 p-5"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: step.color }} /><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-white/38">0{index + 1} · {step.label}</p></div><h3 className="mt-6 text-xl font-semibold tracking-[-.03em] text-white">{step.title}</h3><p className="mt-3 text-xs leading-6 text-white/46">{step.body}</p></article></div>)}</div>
      </motion.div>
    </div>
  );
}

export default function ContractorIntelligenceHomePage() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--b2w-canvas)] text-[var(--b2w-ink)]">
      <Seo title="Project Intelligence for Contractors" description="B2W connects contractor communication, documentation, and operating insights so project information becomes a clear next action." canonicalPath="/" />
      <main>
        <section data-header-theme="dark" className="relative overflow-hidden bg-[#111315] pb-20 pt-28 text-white sm:pb-28 sm:pt-36 lg:min-h-[min(860px,100svh)] lg:pt-32">
          <div aria-hidden="true" className="absolute -left-44 top-10 h-[32rem] w-[32rem] rounded-full bg-[#315f79]/22 blur-[120px]" /><div aria-hidden="true" className="absolute -right-40 top-28 h-[30rem] w-[30rem] rounded-full bg-[#39745f]/16 blur-[120px]" />
          <div className={`${pageWidth} relative grid gap-14 lg:grid-cols-[.84fr_1.16fr] lg:items-center lg:gap-12`}>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .62, ease: [0.22, 1, 0.36, 1] }}>
              <Eyebrow tone="rust">Project intelligence for contractors</Eyebrow><h1 className="mt-6 max-w-[10ch] text-[clamp(3.35rem,6.1vw,6.9rem)] font-medium leading-[.89] tracking-[-.065em]">Every project signal. <span className="text-white/42">One clear next move.</span></h1><p className="mt-7 max-w-xl text-base leading-8 text-white/58 sm:text-lg">We turn the information already flowing through your contracting business into organized project intelligence.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><ButtonLink to="https://calendly.com/b2w-ai-info/30min" variant="secondary" className="!border-white !bg-white !text-[#111315]">Book a workflow review</ButtonLink><ButtonLink to="/workflows" variant="tertiary" className="text-white hover:text-[#f4b28c]">See unified workflows</ButtonLink></div><p className="mt-4 text-[10px] font-medium uppercase tracking-[.13em] text-white/30">30-minute working session · Start with one real information gap</p>
            </motion.div>
            <SignalSystem />
          </div>
        </section>

        <section className="border-b border-[var(--b2w-line)] bg-[#f7f4ed] py-20 sm:py-28"><div className={pageWidth}>
          <SectionHeading eyebrow="The information already exists" title="The information isn’t missing. It’s disconnected." description="The same project is being described in messages, documents, schedules, and memory. When those versions stop moving together, the team spends its time reconstructing what happened." />
          <div className="grid gap-4 lg:grid-cols-3">{[
            ['01', 'A decision happens', 'A client approval, site condition, or schedule promise enters the business through one everyday channel.'],
            ['02', 'The context breaks apart', 'Someone updates the scope. Someone else updates the schedule. Another person never sees the change.'],
            ['03', 'The team reconstructs the truth', 'Owners and project teams ask around, compare versions, and make the next decision with incomplete context.'],
          ].map(([number, title, body], index) => <motion.article key={title} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: index * .08, duration: .45 }} className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--b2w-line)] bg-white/72 p-6 sm:p-7"><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-semibold tracking-[.16em] text-[var(--b2w-rust)]">{number}</span>{index < 2 ? <ArrowDownRight className="h-4 w-4 text-black/22 lg:-rotate-45" /> : <span className="h-2 w-2 rounded-full bg-[var(--b2w-risk)]" />}</div><h3 className="mt-14 text-2xl font-semibold tracking-[-.04em]">{title}</h3><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{body}</p></motion.article>)}</div>
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-[1.5rem] bg-[#111315] px-6 py-5 text-white sm:flex-row sm:items-center sm:px-7"><p className="max-w-2xl text-sm font-medium leading-6">B2W keeps the project story connected from first signal to reviewed next action.</p><a href="#intelligence" className="group inline-flex items-center gap-2 text-xs font-semibold text-[#f4b28c]">See the intelligence system<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a></div>
        </div></section>

        <section id="intelligence" className="scroll-mt-24 py-20 sm:py-28"><div className={pageWidth}>
          <SectionHeading eyebrow="The project intelligence system" title="One intelligence system carries the whole project story." description="JasonAI finds the context. Clara develops what the work needs. B2W Dashboard shows where attention belongs next. Three connected tools carry one continuous project story." />
          <div className="grid gap-5 lg:grid-cols-3">{serviceAreas.map((area, index) => {
            const Icon = area.icon;
            const cardTone = area.theme === 'navy' ? 'bg-[#173d52] text-white' : area.theme === 'green' ? 'bg-[#172019] text-white' : 'border border-[#d9a9c2]/50 bg-[#fff9fc] text-[#3d1f33]';
            const accent = area.theme === 'navy' ? 'text-[#9cc9dc]' : area.theme === 'green' ? 'text-[#a9c7a8]' : 'text-[#a66589]';
            return <motion.article id={area.slug} key={area.label} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ delay: index * .08, duration: .5, ease: [0.22, 1, 0.36, 1] }} className={`group flex h-full scroll-mt-28 flex-col rounded-[2rem] p-4 shadow-[var(--b2w-shadow)] transition-transform duration-500 hover:-translate-y-1 ${cardTone}`}><CapabilityVisual theme={area.theme} /><div className="flex flex-1 flex-col p-3 pt-6 sm:p-4 sm:pt-7"><div className="flex items-center justify-between gap-3"><p className={`text-[9px] font-semibold uppercase tracking-[.18em] ${accent}`}>{area.index} · {area.function}</p><span className="rounded-full border border-current/15 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.1em] opacity-58">{area.status}</span></div><div className="mt-5 flex items-center gap-2 text-xs font-semibold opacity-48"><Icon className="h-4 w-4" />{area.product}</div><h3 className="mt-3 text-[2.6rem] font-medium leading-[.95] tracking-[-.052em]">{area.label}</h3><p className="mt-4 text-xl font-medium leading-6 tracking-[-.025em] opacity-86">{area.title}</p><p className="mt-4 text-sm leading-7 opacity-64">{area.body}</p><ul className="mt-6 space-y-2.5">{area.examples.map((example) => <li key={example} className="flex items-center gap-2.5 text-xs font-medium opacity-72"><Check className={`h-3.5 w-3.5 shrink-0 ${accent}`} />{example}</li>)}</ul><Link to={area.to} className={`mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold ${accent}`}>{area.action}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></Link></div></motion.article>;
          })}</div>
        </div></section>

        <section id="how-it-works" className="border-y border-[var(--b2w-line)] bg-[#fbfaf6] py-20 sm:py-28"><div className={pageWidth}>
          <div className="mx-auto max-w-4xl text-center"><Eyebrow tone="rust">How it works</Eyebrow><h2 className="mt-5 text-[clamp(3rem,6vw,6rem)] font-medium leading-[.94] tracking-[-.055em]">Connect. Organize. Act.</h2><p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--b2w-ink-muted)] sm:text-lg">One intelligence layer follows the information your team already creates.</p></div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] lg:grid-cols-3">{setupSteps.map((step, index) => <article key={step.number} className="min-h-72 bg-white p-7 sm:p-8"><div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[var(--b2w-ink-faint)]">{step.number}</span><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#111315] text-[#f4b28c]">{index === 0 ? <MessageCircle className="h-5 w-5" /> : index === 1 ? <Sparkles className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}</span></div><h3 className="mt-14 text-4xl font-semibold tracking-[-.05em]">{step.title}</h3><p className="mt-5 text-sm leading-7 text-[var(--b2w-ink-muted)]">{step.body}</p></article>)}</div>
        </div></section>

        <section id="project-example" data-header-theme="dark" className="relative overflow-hidden bg-[#111315] py-20 text-white sm:py-28"><div aria-hidden="true" className="absolute -left-32 top-28 h-80 w-80 rounded-full bg-[#315f79]/15 blur-[100px]" /><div aria-hidden="true" className="absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-[#39745f]/12 blur-[100px]" /><div className={`${pageWidth} relative`}>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><Eyebrow tone="green">Example project</Eyebrow><h2 className="mt-5 max-w-[12ch] text-[clamp(3rem,5.5vw,5.8rem)] font-medium leading-[.92] tracking-[-.058em]">One workflow. Every part of the project story.</h2></div><div className="lg:border-l lg:border-white/10 lg:pl-8"><p className="max-w-xl text-base leading-8 text-white/50">A B2W workflow begins when information enters the business and ends when the right person can make a better decision—not when AI produces an answer.</p><ButtonLink to="/workflows" variant="tertiary" className="mt-6 text-white hover:text-[#f4b28c]">Explore the complete workflow piece</ButtonLink></div></div><UnifiedWorkflow />
        </div></section>

        <section id="control" className="border-b border-[var(--b2w-line)] bg-[#f7f4ed] py-20 sm:py-28"><div className={`${pageWidth} grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center`}><div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#111315] text-[#a9c7a8]"><ShieldCheck className="h-5 w-5" /></span><Eyebrow tone="green"><span className="mt-7 block">Security and control</span></Eyebrow><h2 className="mt-4 max-w-[14ch] text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[.96] tracking-[-.052em]">Useful intelligence stays controlled.</h2></div><div className="grid gap-3 sm:grid-cols-2">{['Only approved sources are connected.', 'Projects and permissions stay separated.', 'People review documents and decisions.', 'Every result can return to its source.', 'Access can be changed or removed.', 'Workflows expand only after proving useful.'].map((item) => <div key={item} className="flex min-h-28 items-start gap-3 rounded-[1.35rem] border border-[var(--b2w-line)] bg-white/70 p-5 text-sm font-medium leading-6 text-[var(--b2w-ink-muted)]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--b2w-green)]" />{item}</div>)}</div></div></section>

        <ProjectIntelligenceCTA eyebrow="Your first workflow" title="Bring us the project question your team keeps asking." description="In one 30-minute working session, we’ll map where the answer lives today and identify the smallest useful workflow to connect it." action={{ label: 'Book a workflow review', to: 'https://calendly.com/b2w-ai-info/30min' }} secondary={{ label: 'Email B2W', to: 'mailto:info@b2w-ai.com?subject=B2W%20workflow%20review' }} />
      </main>
    </div>
  );
}
