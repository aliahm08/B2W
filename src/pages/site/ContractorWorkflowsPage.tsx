import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowRight, BarChart3, Check, FileCheck2, FileText, Link2, MessageCircle, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import Seo from '../../components/Seo';
import ProjectIntelligenceCTA from '../../components/site/ProjectIntelligenceCTA';
import { ButtonLink, Eyebrow, pageWidth } from '../../components/site/PublicUI';

const workflows = [
  {
    id: 'client-change',
    label: 'Client change',
    title: 'Carry one client decision through the entire project.',
    trigger: 'A client approves a material change in a project conversation.',
    stages: [
      { area: 'Communication', product: 'JasonAI', title: 'Find the complete decision.', body: 'Connect the approval to the earlier request, supplier response, promised date, and unanswered questions.', icon: MessageCircle, tone: 'blue' },
      { area: 'Documentation', product: 'Clara', title: 'Develop the revised project document.', body: 'Prepare an updated scope, estimate, or client-ready change document using approved company standards for human review.', icon: FileCheck2, tone: 'plum' },
      { area: 'Optimization', product: 'Dashboard', title: 'Refresh the operating impact.', body: 'Show the cost, schedule, dependency, ownership, and risk changes together with the original sources.', icon: BarChart3, tone: 'green' },
    ],
    sampleDocument: {
      type: 'Change order draft', number: 'CO-014 · Review copy', title: 'Lobby finish upgrade',
      fields: [
        ['Approved scope', 'Upgrade lobby wall finish to white-oak slat system.'],
        ['Cost impact', '+$8,420 · pending final supplier confirmation'],
        ['Schedule impact', '+2 working days · access date unchanged'],
        ['Approval source', 'Client project thread · Aug 14, 2:18 PM'],
      ],
      review: 'Confirm supplier price and superintendent sequencing before issue.',
    },
    dashboardView: {
      title: 'Change control', subtitle: 'Approved changes and unresolved impact',
      metrics: [['Open changes', '04'], ['Pending value', '$18.6k'], ['Days exposed', '02']],
      record: { project: 'Main Street Buildout', item: 'CO-014 · Lobby finish upgrade', status: 'Review pricing', owner: 'Preconstruction', due: 'Today', impact: '+2 days', source: 'Client thread + CO-014' },
    },
    outcome: 'The office, field, and owner work from the same approved change instead of reconstructing it separately.',
  },
  {
    id: 'field-issue',
    label: 'Field issue',
    title: 'Turn a field observation into a controlled response.',
    trigger: 'A superintendent sends a voice note and photos about work that does not match the plan.',
    stages: [
      { area: 'Communication', product: 'JasonAI', title: 'Connect the field note to context.', body: 'Summarize the observation and find the related drawing discussion, commitment, and previous decision.', icon: MessageCircle, tone: 'blue' },
      { area: 'Documentation', product: 'Clara', title: 'Structure the review package.', body: 'Develop a daily report, RFI draft, scope clarification, or client update with the evidence visible.', icon: FileCheck2, tone: 'plum' },
      { area: 'Optimization', product: 'Dashboard', title: 'Surface the project exception.', body: 'Flag the affected task, responsible owner, schedule dependency, required response, and current risk.', icon: BarChart3, tone: 'green' },
    ],
    sampleDocument: {
      type: 'Request for information', number: 'RFI-027 · Draft', title: 'Lobby soffit conflict',
      fields: [
        ['Observed condition', 'Duct elevation conflicts with the reflected ceiling plan.'],
        ['Plan reference', 'A-611 detail 4 · M-204 coordination zone'],
        ['Response needed', 'Confirm revised soffit elevation or alternate duct route.'],
        ['Evidence', 'Voice note + 3 field photos · Aug 16, 9:42 AM'],
      ],
      review: 'Design lead to verify dimensions before the RFI is issued.',
    },
    dashboardView: {
      title: 'Field exceptions', subtitle: 'Issues requiring a documented response',
      metrics: [['Open issues', '06'], ['Awaiting design', '02'], ['Days exposed', '02']],
      record: { project: 'North Harbor Renovation', item: 'RFI-027 · Lobby soffit conflict', status: 'Response needed', owner: 'Design lead', due: 'Tue', impact: 'Ceiling start', source: 'Field note + RFI-027' },
    },
    outcome: 'The field signal becomes a documented, owned project issue before it disappears into a thread.',
  },
  {
    id: 'weekly-review',
    label: 'Weekly review',
    title: 'Prepare the weekly project review from the work itself.',
    trigger: 'The owner needs to know what changed, which jobs need attention, and what the team should do next.',
    stages: [
      { area: 'Communication', product: 'JasonAI', title: 'Summarize project movement.', body: 'Collect decisions, commitments, unanswered questions, and notable changes from approved project communication.', icon: MessageCircle, tone: 'blue' },
      { area: 'Documentation', product: 'Clara', title: 'Develop the review document.', body: 'Structure the weekly update, owner report, meeting agenda, or action register using the company format.', icon: FileCheck2, tone: 'plum' },
      { area: 'Optimization', product: 'Dashboard', title: 'Rank what needs attention.', body: 'Compare active jobs by decision risk, schedule movement, owner gaps, and operating exceptions.', icon: BarChart3, tone: 'green' },
    ],
    sampleDocument: {
      type: 'Weekly project review', number: 'Week 18 · Review copy', title: 'Portfolio operating brief',
      fields: [
        ['Progress', '9 active jobs moved as planned; 3 require attention.'],
        ['Decisions waiting', '5 open approvals across 4 projects.'],
        ['Primary risk', 'Oak Avenue supplier date moved three days.'],
        ['Next actions', 'Confirm finish, assign RFI response, resequence delivery.'],
      ],
      review: 'Operations lead to confirm owners and due dates before the meeting.',
    },
    dashboardView: {
      title: 'Portfolio attention', subtitle: 'Jobs ranked by the next decision required',
      metrics: [['Active jobs', '12'], ['Need attention', '03'], ['Decisions waiting', '05']],
      record: { project: 'Oak Avenue Addition', item: 'Supplier date moved three days', status: 'At risk', owner: 'Project manager', due: 'Today', impact: '+3 days', source: 'Vendor email + Week 18' },
    },
    outcome: 'The meeting starts with a sourced view of the work instead of spending its first half collecting status.',
  },
] as const;

const stageStyles = {
  blue: { surface: 'bg-[#173d52] text-white', accent: 'text-[#9cc9dc]', label: 'border-[#9cc9dc]/25 bg-[#9cc9dc]/10' },
  plum: { surface: 'bg-[#fff8fb] text-[#3d1f33] border border-[#d9a9c2]/55', accent: 'text-[#a66589]', label: 'border-[#a66589]/20 bg-[#a66589]/8' },
  green: { surface: 'bg-[#172019] text-white', accent: 'text-[#a9c7a8]', label: 'border-[#a9c7a8]/20 bg-[#a9c7a8]/8' },
} as const;

function DocumentToDashboard({ workflow }: { workflow: (typeof workflows)[number] }) {
  const { sampleDocument, dashboardView } = workflow;
  return (
    <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[var(--b2w-line)] bg-[#ede9df] p-3 sm:p-5 lg:p-7">
      <div className="flex flex-col justify-between gap-4 px-2 pb-5 sm:flex-row sm:items-end">
        <div><p className="text-[9px] font-semibold uppercase tracking-[.17em] text-[var(--b2w-plum)]">Document → operating view</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">See how reviewed information becomes visible action.</h3></div>
        <p className="max-w-sm text-xs leading-6 text-[var(--b2w-ink-muted)]">Representative sample content for this workflow. It demonstrates the information structure, not a completed customer deliverable.</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <article className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-white shadow-[0_20px_55px_rgba(17,19,21,.08)]">
          <div className="flex items-center justify-between border-b border-black/8 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4e6ee] text-[#a66589]"><FileText className="h-5 w-5" /></span><div><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#a66589]">{sampleDocument.type}</p><p className="mt-1 text-xs font-medium text-black/42">{sampleDocument.number}</p></div></div>
            <span className="rounded-full border border-[#a66589]/20 bg-[#fff8fb] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.1em] text-[#a66589]">Human review</span>
          </div>
          <div className="p-5 sm:p-6">
            <h4 className="text-2xl font-semibold tracking-[-.04em] text-[#3d1f33]">{sampleDocument.title}</h4>
            <dl className="mt-6 divide-y divide-black/8 border-y border-black/8">
              {sampleDocument.fields.map(([label, value]) => <div key={label} className="grid gap-1 py-3.5 sm:grid-cols-[8rem_1fr] sm:gap-4"><dt className="text-[9px] font-semibold uppercase tracking-[.12em] text-black/35">{label}</dt><dd className="text-xs leading-5 text-black/68">{value}</dd></div>)}
            </dl>
            <div className="mt-5 border-l-2 border-[#d9a9c2] bg-[#fff8fb] px-4 py-3"><p className="text-[8px] font-semibold uppercase tracking-[.13em] text-[#a66589]">Review note</p><p className="mt-2 text-[11px] leading-5 text-[#6f5968]">{sampleDocument.review}</p></div>
          </div>
        </article>

        <div className="flex items-center justify-center py-1 lg:px-1 lg:py-0"><div className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[var(--b2w-green)] shadow-sm"><ArrowRight className="hidden h-5 w-5 lg:block" /><ArrowDown className="h-5 w-5 lg:hidden" /></div></div>

        <article className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#111914] text-white shadow-[0_20px_55px_rgba(17,19,21,.16)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dfe9d8] text-[#315e3a]"><BarChart3 className="h-5 w-5" /></span><div><p className="text-sm font-semibold">{dashboardView.title}</p><p className="mt-1 text-[9px] text-white/35">{dashboardView.subtitle}</p></div></div>
            <span className="inline-flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[.11em] text-[#a9c7a8]"><RefreshCw className="h-3 w-3" />From reviewed fields</span>
          </div>
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-3 gap-2">{dashboardView.metrics.map(([label, value], index) => <div key={label} className={`rounded-xl border p-3 ${index === 1 ? 'border-[#a9c7a8]/18 bg-[#a9c7a8]/[.07]' : 'border-white/8 bg-white/[.035]'}`}><p className="text-[7px] font-semibold uppercase tracking-[.1em] text-white/32">{label}</p><p className="mt-3 text-xl font-medium tracking-[-.04em] sm:text-2xl">{value}</p></div>)}</div>
            <div className="mt-4 rounded-2xl border border-[#a9c7a8]/20 bg-[#a9c7a8]/[.055] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-semibold uppercase tracking-[.13em] text-[#a9c7a8]">{dashboardView.record.project}</p><p className="mt-2 text-sm font-semibold leading-5">{dashboardView.record.item}</p></div><span className="rounded-full bg-[#efe4c9] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.09em] text-[#735a24]">{dashboardView.record.status}</span></div>
              <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10"><div className="bg-[#111914] p-3"><p className="text-[7px] uppercase tracking-[.1em] text-white/28">Owner</p><p className="mt-2 text-[9px] leading-4 text-white/65">{dashboardView.record.owner}</p></div><div className="bg-[#111914] p-3"><p className="text-[7px] uppercase tracking-[.1em] text-white/28">Due</p><p className="mt-2 text-[9px] leading-4 text-white/65">{dashboardView.record.due}</p></div><div className="bg-[#111914] p-3"><p className="text-[7px] uppercase tracking-[.1em] text-white/28">Impact</p><p className="mt-2 text-[9px] leading-4 text-white/65">{dashboardView.record.impact}</p></div></div>
              <p className="mt-4 flex items-center gap-2 text-[8px] text-[#a9c7a8]"><Link2 className="h-3 w-3" />{dashboardView.record.source}</p>
            </div>
            <p className="mt-4 text-[9px] leading-5 text-white/36">Only reviewed fields drive the visible status, owner, due date, impact, and source link.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function StaticSectionHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <header className="mb-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.65fr)] lg:items-end">
      <div><Eyebrow tone="rust">{index}</Eyebrow><h2 className="mt-4 max-w-[18ch] text-4xl font-medium leading-[1] tracking-[-.045em] sm:text-5xl">{title}</h2></div>
      <p className="max-w-2xl text-sm leading-7 text-[var(--b2w-ink-muted)]">{description}</p>
    </header>
  );
}

export default function ContractorWorkflowsPage() {
  const [activeId, setActiveId] = useState<(typeof workflows)[number]['id']>('client-change');
  const active = workflows.find((workflow) => workflow.id === activeId) ?? workflows[0];

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--b2w-canvas)] text-[var(--b2w-ink)]">
      <Seo title="Unified AI Workflows for Contractors" description="See how B2W connects contractor communication, documentation, and source-linked operating insights in practical project workflows." canonicalPath="/workflows" />
      <main>
        <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.035]" />
          <div aria-hidden="true" className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-[var(--b2w-rust-soft)] blur-3xl" />
          <div className={`${pageWidth} relative`}>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_.6fr] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}><Eyebrow tone="rust">The new way to work</Eyebrow><h1 className="mt-6 max-w-[13ch] text-5xl font-medium leading-[.94] tracking-[-.058em] sm:text-7xl lg:text-[6.4rem]">One workflow from conversation to decision.</h1></motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="border-l border-[var(--b2w-line)] pl-6 sm:pl-8"><p className="text-base leading-8 text-[var(--b2w-ink-muted)] sm:text-lg">B2W unifies communication, project documentation, and actionable operating insight so the same information does not have to be found, interpreted, and entered again at every step.</p><ButtonLink to="#workflow-examples" className="mt-7">Explore the examples</ButtonLink></motion.div>
            </div>
          </div>
        </section>

        <section id="workflow-examples" className="scroll-mt-24 border-y border-[var(--b2w-line)] bg-white py-20 sm:py-28">
          <div className={pageWidth}>
            <StaticSectionHeading index="Contractor use cases" title="Follow the information all the way through." description="These are representative workflow patterns, not customer case studies or guaranteed results. Each starts with information the team already creates." />
            <div role="tablist" aria-label="Workflow examples" className="grid gap-2 rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-2 sm:grid-cols-3">
              {workflows.map((workflow) => <button key={workflow.id} type="button" role="tab" aria-selected={workflow.id === activeId} aria-controls="workflow-panel" onClick={() => setActiveId(workflow.id)} className={`min-h-12 rounded-[1rem] px-4 py-3 text-sm font-semibold transition ${workflow.id === activeId ? 'bg-[#111315] text-white shadow-lg' : 'text-[var(--b2w-ink-muted)] hover:bg-white'}`}>{workflow.label}</button>)}
            </div>

            <AnimatePresence mode="wait">
              <motion.div id="workflow-panel" role="tabpanel" key={active.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }} className="mt-8">
                <div className="rounded-[1.75rem] border border-[var(--b2w-line)] bg-[#f7f4ed] p-6 sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[.17em] text-[var(--b2w-rust)]">Starting signal</p><div className="mt-4 grid gap-5 lg:grid-cols-[.65fr_1.35fr] lg:items-end"><h2 className="text-3xl font-medium leading-[1] tracking-[-.045em] sm:text-5xl">{active.title}</h2><p className="text-base leading-8 text-[var(--b2w-ink-muted)]">{active.trigger}</p></div></div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
                  {active.stages.map((stage, index) => {
                    const Icon = stage.icon;
                    const styles = stageStyles[stage.tone];
                    return (
                      <div key={stage.area} className="contents">
                        {index ? <div className="hidden items-center justify-center lg:flex"><ArrowRight className="h-5 w-5 text-black/24" /></div> : null}
                        <article className={`flex min-h-[26rem] flex-col rounded-[1.75rem] p-6 shadow-[0_18px_55px_rgba(17,19,21,.08)] sm:p-7 ${styles.surface}`}>
                          <div className="flex items-center justify-between gap-3"><span className={`grid h-11 w-11 place-items-center rounded-2xl border ${styles.label} ${styles.accent}`}><Icon className="h-5 w-5" /></span><span className="text-[9px] font-semibold uppercase tracking-[.14em] opacity-45">0{index + 1}</span></div>
                          <p className={`mt-10 text-[9px] font-semibold uppercase tracking-[.17em] ${styles.accent}`}>{stage.area}</p>
                          <p className="mt-2 text-xs font-semibold opacity-48">{stage.product}</p>
                          <h3 className="mt-5 text-3xl font-medium leading-[1] tracking-[-.045em]">{stage.title}</h3>
                          <p className="mt-5 text-sm leading-7 opacity-60">{stage.body}</p>
                        </article>
                      </div>
                    );
                  })}
                </div>

                <DocumentToDashboard workflow={active} />

                <div className="mt-5 flex items-start gap-4 rounded-[1.5rem] bg-[#111315] p-6 text-white sm:items-center sm:p-7"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f4b28c] text-[#111315]"><Check className="h-5 w-5" /></span><div><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#f4b28c]">Useful outcome</p><p className="mt-2 text-base font-medium leading-7 text-white/75">{active.outcome}</p></div></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section id="by-function" className="scroll-mt-24 border-b border-[var(--b2w-line)] bg-[#172019] py-20 text-white sm:py-28">
          <div className={pageWidth}>
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div><Eyebrow tone="green">Built around the team</Eyebrow><h2 className="mt-5 max-w-[12ch] text-5xl font-medium leading-[.96] tracking-[-.052em] sm:text-6xl">One workflow piece. Three working perspectives.</h2></div>
              <p className="max-w-2xl text-base leading-8 text-white/58">The information stays unified while each person sees the decisions, handoffs, and exceptions their role is responsible for moving.</p>
            </div>
            <div className="mt-12 grid gap-3 lg:grid-cols-3">
              {[
                { role: 'Business owners', title: 'Know which jobs need leadership.', body: 'Review exceptions, waiting decisions, and portfolio-level risk before they become expensive project problems.', icon: BarChart3 },
                { role: 'Project coordinators', title: 'Keep the job record aligned with the job.', body: 'Connect field updates, office communication, reviewed documents, owners, and due dates without rebuilding the same context.', icon: FileCheck2 },
                { role: 'Operations teams', title: 'Turn handoffs into a reliable rhythm.', body: 'See where work is waiting, who owns the next move, and which recurring breakdown should be improved next.', icon: RefreshCw },
              ].map(({ role, title, body, icon: Icon }, index) => (
                <article key={role} className="rounded-[1.75rem] border border-white/10 bg-white/[.045] p-6 sm:p-7">
                  <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#dfe9d8] text-[#315e3a]"><Icon className="h-5 w-5" /></span><span className="font-mono text-[9px] text-white/28">0{index + 1}</span></div>
                  <p className="mt-9 text-[9px] font-semibold uppercase tracking-[.16em] text-[#a9c7a8]">{role}</p>
                  <h3 className="mt-4 text-3xl font-medium leading-[1] tracking-[-.04em]">{title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/52">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-you-use" className="scroll-mt-24 py-20 sm:py-28">
          <div className={pageWidth}>
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><Eyebrow tone="green">How you use B2W</Eyebrow><h2 className="mt-5 max-w-[13ch] text-5xl font-medium leading-[.96] tracking-[-.052em] sm:text-6xl">Begin narrow. Keep the evidence. Expand with control.</h2></div><div className="grid gap-px overflow-hidden rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)]">
              {[
                ['Choose the recurring breakdown', 'Start with one costly project question, handoff, document, or review—not every process at once.'],
                ['Approve the context and the reviewer', 'Define which sources can be used, who checks the output, and what remains outside the workflow.'],
                ['Prove one complete loop', 'Run the workflow from incoming signal through reviewed output and operating decision.'],
                ['Add the next connected step', 'Expand only when the first workflow is useful, understandable, and controlled.'],
              ].map(([title, body], index) => <article key={title} className="grid gap-4 bg-white/72 p-6 sm:grid-cols-[auto_1fr] sm:p-7"><span className="font-mono text-[10px] font-semibold text-[var(--b2w-green)]">0{index + 1}</span><div><h3 className="text-lg font-semibold tracking-[-.025em]">{title}</h3><p className="mt-2 text-sm leading-7 text-[var(--b2w-ink-muted)]">{body}</p></div></article>)}
            </div></div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[1.5rem] border border-[var(--b2w-line)] bg-[#f7f4ed] p-5 text-xs text-[var(--b2w-ink-muted)]"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--b2w-green)]" />Approved sources</span><span className="inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-[var(--b2w-plum)]" />Human review</span><span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--b2w-rust)]" />Clear product-stage boundaries</span></div>
          </div>
        </section>

        <ProjectIntelligenceCTA eyebrow="Workflow fit" title="Bring us one project handoff your team keeps rebuilding." description="We’ll trace the information from communication through documentation and the operating decision, then scope the smallest useful B2W workflow." action={{ label: 'Book a workflow review', to: 'https://calendly.com/b2w-ai-info/30min' }} secondary={{ label: 'Email B2W', to: 'mailto:info@b2w-ai.com' }} />
      </main>
    </div>
  );
}
