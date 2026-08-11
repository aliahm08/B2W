import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Database,
  FileCheck2,
  FileStack,
  MessageCircle,
  Search,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import DescrambleText from '../components/DescrambleText';
import PreviewFooter from '../components/PreviewFooter';
import Seo from '../components/Seo';
import { LiveSiteHeader } from '../components/V2SiteChrome';
import { usesV3Branding } from '../lib/siteVersion';

type SolutionsPage = 'business-use-cases' | 'ai-workflows';

const pageMeta = {
  'business-use-cases': {
    eyebrow: 'Solutions · Use cases',
    title: 'Start with the operating problem, not the software category.',
    description: 'Find the product or workflow that addresses the work slowing the team down today, then expand only when the first use case proves useful.',
  },
  'ai-workflows': {
    eyebrow: 'AI Workflows',
    title: 'Start with JasonAI. Add a workspace only when it helps.',
    description: 'Teach one approved source of company and project context, use it through the tools your team already has, and add Clara only when a dedicated document workspace creates more control.',
  },
} as const;

const useCases = [
  { icon: MessageCircle, title: 'Find information in work communication', body: 'Ask a job, customer, vendor, or time-period question and search only the business communication approved during setup.', product: 'JasonAI · Available now', to: '/jasonai' },
  { icon: ClipboardList, title: 'Turn a long thread into a useful brief', body: 'Summarize what changed, what remains open, and what a responsible person should review before following up.', product: 'JasonAI · Available now', to: '/jasonai/how-it-works' },
  { icon: FileStack, title: 'Turn project inputs into scopes and estimates', body: 'Capture voice notes, site observations, quantities, assumptions, and approvals in a structured, editable document flow.', product: 'Clara · Concept phase', to: '/clara' },
  { icon: Workflow, title: 'Standardize a repeated handoff', body: 'Map the approved signal, responsible person, review point, output, and next action before introducing automation.', product: 'Scoped with B2W', to: 'mailto:info@b2w-ai.com' },
] as const;

const workflows = [
  {
    label: 'Available now',
    title: 'JasonAI communication search and summary',
    tone: 'border-emerald-300/30 bg-emerald-200/10 text-emerald-100',
    resultTone: 'bg-emerald-300/15 text-emerald-50 ring-1 ring-inset ring-emerald-300/35',
    steps: ['Ask a plain-language question in WhatsApp', 'Search approved work-group communication', 'Return a concise answer or summary', 'Review the result before acting'],
    to: '/jasonai/how-it-works',
  },
  {
    label: 'Interactive demonstration',
    title: 'Project Estimates with Clara',
    tone: 'border-pink-300/30 bg-pink-200/10 text-pink-100',
    resultTone: 'bg-pink-300/15 text-pink-50 ring-1 ring-inset ring-pink-300/35',
    steps: ['Capture a site note or project brief', 'Structure scope, quantities, and assumptions', 'Review and edit the draft', 'Prepare an approval-ready output'],
    to: '/solutions/ai-workflows/project-estimates',
  },
  {
    label: 'Scoped with B2W',
    title: 'Business-specific operating workflow',
    tone: 'border-sky-300/30 bg-sky-200/10 text-sky-100',
    resultTone: 'bg-sky-300/15 text-sky-50 ring-1 ring-inset ring-sky-300/35',
    steps: ['Choose one repeated operating problem', 'Define sources, permissions, owners, and exceptions', 'Prototype the reviewed handoff', 'Measure value before expanding'],
    to: 'mailto:info@b2w-ai.com',
  },
] as const;

const guideSteps = [
  {
    number: '01',
    short: 'Scope',
    title: 'Choose one repeated problem.',
    body: 'Start with a question, handoff, or document your team handles repeatedly. Define the useful result, who reviews it, and what must remain out of scope.',
    detail: 'A focused first use case makes permissions, source quality, review responsibility, and value easier to prove.',
    icon: Search,
  },
  {
    number: '02',
    short: 'Teach',
    title: 'Teach JasonAI the approved context.',
    body: 'Connect the project communication, reference material, and company rules that JasonAI is permitted to use. The assistant learns from this governed source set—not the open internet.',
    detail: 'The same approved context can later support Clara, so your team does not have to teach two disconnected systems.',
    icon: Database,
  },
  {
    number: '03',
    short: 'Use',
    title: 'Begin inside the tools your team already uses.',
    body: 'JasonAI works through existing communication channels. Ask for context, summaries, or an approved working draft without introducing another daily destination.',
    detail: 'Start with the lowest-friction behavior: ask a question in plain language, inspect the source-linked answer, and keep the person responsible in control.',
    icon: MessageCircle,
  },
  {
    number: '04',
    short: 'Create',
    title: 'Create documents—and add Clara only when useful.',
    body: 'JasonAI can help prepare a working document from approved context when that workflow is configured. Add Clara when the team benefits from seeing, organizing, and revising that work in a dedicated web workspace.',
    detail: 'Clara is optional. It adds a focused website for document work; it does not replace the shared context or the tools JasonAI already supports.',
    icon: FileStack,
  },
  {
    number: '05',
    short: 'Diligence',
    title: 'Review, measure, and expand deliberately.',
    body: 'Keep consequential decisions with people. Check sources and outputs, document exceptions, measure time or quality gained, and expand only after the first workflow is dependable.',
    detail: 'Diligence turns a useful demonstration into a governed operating system the business can trust.',
    icon: ShieldCheck,
  },
] as const;

const adoptionStages = [
  { label: 'Scoping', body: 'Define the repeated problem, useful output, review owner, and boundary.' },
  { label: 'Context', body: 'Approve the communication, company knowledge, and project material the tools may use.' },
  { label: 'Configuration', body: 'Set permissions, response behavior, document standards, and exceptions.' },
  { label: 'Pilot', body: 'Use one live workflow, review every meaningful result, and correct the operating assumptions.' },
  { label: 'Diligence', body: 'Measure value, audit source quality, document controls, and decide what should expand.' },
] as const;

function WorkflowCatalog() {
  return (
    <section className="bg-[#111714] px-5 py-20 text-white sm:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#9fd4ae]">Ways B2W can help</p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <h2 className="max-w-xl text-4xl font-semibold tracking-[-.045em] sm:text-6xl">Match the use case to the right operating pattern.</h2>
          <p className="max-w-2xl text-base leading-7 text-white/60 lg:justify-self-end">These examples show what is available, what can be demonstrated, and what requires business-specific scoping. Every pattern ends with a result for a person to review.</p>
        </div>
        <div className="mt-12 space-y-5">
          {workflows.map((workflow, workflowIndex) => (
            <article key={workflow.title} className="grid gap-8 rounded-[2rem] border border-white/12 bg-white/[.035] p-7 sm:p-9 lg:grid-cols-[.65fr_1.35fr]">
              <div><span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em] ${workflow.tone}`}>{workflow.label}</span><h3 className="mt-6 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{workflow.title}</h3><Link to={workflow.to} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#9fd4ae]">Open details <ArrowRight className="h-4 w-4" /></Link></div>
              <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/10 sm:grid-cols-2">
                {workflow.steps.map((step, stepIndex) => {
                  const isResult = stepIndex === workflow.steps.length - 1;
                  return <li key={step} className={`flex gap-4 p-5 text-sm leading-6 ${isResult ? workflow.resultTone : 'bg-[#172019] text-white/70'}`}><span className={`shrink-0 font-mono ${isResult ? 'rounded-full border border-white/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[.12em]' : 'text-xs text-[#9fd4ae]'}`}>{isResult ? 'Result' : `${workflowIndex + 1}.${stepIndex + 1}`}</span>{step}</li>;
                })}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowB2WWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = guideSteps[activeStep];
  const SelectedIcon = selectedStep.icon;

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 lg:grid-cols-2">
          <article className="bg-[#141714] p-7 text-white sm:p-10">
            <span className="inline-flex rounded-full bg-[#dfe9d8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-[#27442e]">Start here · Available now</span>
            <h2 className="mt-8 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">JasonAI works where the work already happens.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65">It uses approved company and project context to answer questions, summarize work, and support configured document workflows through the communication tools your team already uses.</p>
            <Link to="/jasonai/how-it-works" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-[#b8dec1]">See JasonAI in practice <ArrowRight className="h-4 w-4" /></Link>
          </article>
          <article className="bg-[#f2e8ee] p-7 sm:p-10">
            <span className="inline-flex rounded-full bg-[#4a203b] px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-white">Optional workspace · Concept phase</span>
            <h2 className="mt-8 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Clara gives document work a dedicated home.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#685560]">Use the same approved context in a focused web workspace when your team wants to see recent work, develop documents, apply company standards, and manage revisions in one place.</p>
            <Link to="/clara" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-[#4a203b]">Explore the Clara concept <ArrowRight className="h-4 w-4" /></Link>
          </article>
        </div>
      </section>

      <section className="bg-[#111714] px-5 py-20 text-white sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#9fd4ae]">The five-step guide</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <h2 className="text-4xl font-semibold tracking-[-.05em] sm:text-6xl">From one scoped problem to governed daily use.</h2>
            <p className="max-w-2xl text-base leading-7 text-white/60 lg:justify-self-end">Choose a step to see what your team decides, what B2W configures, and why the sequence matters.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
            <div className="grid gap-2" role="tablist" aria-label="B2W implementation steps">
              {guideSteps.map((step, index) => (
                <button
                  key={step.number}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === index}
                  onClick={() => setActiveStep(index)}
                  className={`group flex min-h-16 items-center gap-4 rounded-2xl border px-5 text-left transition ${activeStep === index ? 'border-[#9fd4ae] bg-[#dfe9d8] text-[#141714]' : 'border-white/12 bg-white/[.035] text-white hover:border-white/30 hover:bg-white/[.07]'}`}
                >
                  <span className={`font-mono text-[10px] ${activeStep === index ? 'text-[#426149]' : 'text-[#9fd4ae]'}`}>{step.number}</span>
                  <span className="text-base font-semibold">{step.short}</span>
                  <ArrowRight className={`ml-auto h-4 w-4 transition-transform ${activeStep === index ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-35 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>
            <article role="tabpanel" className="flex min-h-[30rem] flex-col rounded-[2rem] bg-[#eef4ea] p-7 text-[#141714] sm:p-10">
              <div className="flex items-center justify-between gap-4"><span className="font-mono text-xs font-semibold text-[#426149]">STEP {selectedStep.number}</span><SelectedIcon className="h-8 w-8 text-[#426149]" /></div>
              <h3 className="mt-12 max-w-[14ch] text-4xl font-semibold tracking-[-.05em] sm:text-6xl">{selectedStep.title}</h3>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4e5a50]">{selectedStep.body}</p>
              <div className="mt-auto border-t border-black/10 pt-7"><p className="max-w-2xl text-sm leading-6 text-[#596159]"><span className="font-semibold text-[#141714]">Why it matters: </span>{selectedStep.detail}</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#426149]">One governed context</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Teach the business once. Use the context two ways.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#596159]">JasonAI and Clara can use the same approved company and project knowledge. The difference is where the team chooses to work—not a second, disconnected source of truth.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 sm:grid-cols-2">
            <article className="bg-white p-7 sm:col-span-2"><Database className="h-7 w-7 text-[#426149]" /><p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[#426149]">Shared context layer</p><h3 className="mt-2 text-2xl font-semibold">Approved communication, project files, company standards, and permissions</h3></article>
            <article className="bg-[#e8f0e3] p-7"><MessageCircle className="h-7 w-7 text-[#426149]" /><h3 className="mt-6 text-2xl font-semibold">JasonAI</h3><p className="mt-3 text-sm leading-6 text-[#596159]">Ask and act from existing communication channels. No new daily workspace is required.</p></article>
            <article className="bg-[#f2e8ee] p-7"><FileStack className="h-7 w-7 text-[#7d3f69]" /><h3 className="mt-6 text-2xl font-semibold">Clara</h3><p className="mt-3 text-sm leading-6 text-[#685560]">Open an optional web workspace for focused document creation, standards, revisions, and recent work.</p></article>
            <article className="bg-[#141714] p-7 text-white sm:col-span-2"><FileCheck2 className="h-7 w-7 text-[#9fd4ae]" /><p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-[#9fd4ae]">Reviewed result</p><h3 className="mt-2 text-2xl font-semibold">A source-aware answer, summary, or working document that remains under human control</h3></article>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#e8e4da] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-2 lg:items-end"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#426149]">From scoping to diligence</p><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">The implementation is part of the product.</h2></div><p className="max-w-2xl text-base leading-7 text-[#596159] lg:justify-self-end">B2W does not begin with a broad automation mandate. We define the operating boundary, configure one useful workflow, test it with the people responsible, and earn the right to expand.</p></div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 lg:grid-cols-5">
            {adoptionStages.map((stage, index) => <li key={stage.label} className="bg-[#f6f3eb] p-6"><span className="font-mono text-[10px] text-[#426149]">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-8 text-xl font-semibold">{stage.label}</h3><p className="mt-3 text-sm leading-6 text-[#596159]">{stage.body}</p></li>)}
          </ol>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[['Approved sources', 'The business decides what context is permitted and what stays outside the system.'], ['Visible review', 'People can inspect meaningful outputs before they become decisions, commitments, or records.'], ['Measured expansion', 'The next workflow is added only after the current one is useful, controlled, and understood.']].map(([title, body]) => <article key={title} className="rounded-2xl border border-black/10 bg-white/60 p-6"><CheckCircle2 className="h-5 w-5 text-[#426149]" /><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#596159]">{body}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

export default function SolutionsOverviewPage({ page }: { page: SolutionsPage }) {
  const meta = pageMeta[page];
  const { pathname } = useLocation();
  const isV3 = usesV3Branding(pathname);
  const eyebrow = isV3 ? meta.eyebrow.replace('Solutions', 'Guidance') : meta.eyebrow;

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#141714] selection:bg-[#141714] selection:text-white">
      <Seo title={`${eyebrow} — B2W`} description={meta.description} canonicalPath={`/solutions/${page}`} />
      <LiveSiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-black/10 px-5 pb-24 pt-40 [contain:paint] sm:px-8 md:pb-32 md:pt-48">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(20,23,20,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(20,23,20,.055)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="pointer-events-none absolute right-[-7rem] top-0 hidden h-[34rem] w-[34rem] rounded-full bg-[#d8e5cf] blur-[110px] sm:block" />
          <div className="relative mx-auto max-w-7xl">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#426149]">{eyebrow}</p>
            <h1 className="mt-8 max-w-[12ch] break-words text-[clamp(3.1rem,15vw,8.5rem)] font-medium leading-[.88] tracking-[-.07em] sm:text-[clamp(3.8rem,9vw,8.5rem)] sm:leading-[.86] sm:tracking-[-.075em]">
              <DescrambleText text={meta.title} animateOnMount delay={100} />
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#596159] sm:text-xl">{meta.description}</p>
          </div>
        </section>

        {page === 'business-use-cases' ? (
          <>
            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
              <div className="grid gap-5 md:grid-cols-2">
                {useCases.map((useCase) => (
                  <article key={useCase.title} className="group flex min-h-[24rem] min-w-0 flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(20,23,20,.07)] sm:p-9">
                    <div className="flex min-w-0 items-center justify-between gap-3"><useCase.icon className="h-7 w-7 shrink-0 text-[#426149]" /><span className="min-w-0 rounded-full bg-[#eef4ea] px-3 py-1 text-right text-[10px] font-semibold uppercase tracking-[.12em] text-[#426149]">{useCase.product}</span></div>
                    <h2 className="mt-10 max-w-[20ch] break-words text-3xl font-semibold tracking-[-.045em] sm:text-4xl">{useCase.title}</h2>
                    <p className="mt-5 max-w-xl text-base leading-7 text-[#596159]">{useCase.body}</p>
                    <Link to={useCase.to} className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold">See the fit <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                  </article>
                ))}
              </div>
            </section>
            <WorkflowCatalog />
          </>
        ) : null}

        {page === 'ai-workflows' ? <HowB2WWorks /> : null}

        <section className="px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-[2rem] bg-[#dfe9d8] p-6 sm:p-12 lg:flex-row lg:items-end">
            <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#426149]">{page === 'ai-workflows' ? 'Ready to scope the first use case?' : 'Not sure where to start?'}</p><h2 className="mt-4 max-w-2xl break-words text-3xl font-semibold tracking-[-.045em] sm:text-6xl">{page === 'ai-workflows' ? 'Begin with one real problem and the context your team already trusts.' : 'Find your recommendation with our 1-minute quiz.'}</h2></div>
            {page === 'ai-workflows' ? <a href="mailto:info@b2w-ai.com" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#141714] px-6 text-sm font-semibold text-white">Book a scoping call <ArrowRight className="h-4 w-4" /></a> : <Link to="/#visitor-fit" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#141714] px-6 text-sm font-semibold text-white">Build my recommendation <ArrowRight className="h-4 w-4" /></Link>}
          </div>
        </section>
      </main>
      <PreviewFooter />
    </div>
  );
}
