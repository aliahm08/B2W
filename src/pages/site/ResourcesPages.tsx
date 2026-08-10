import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, FileText, HardHat, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { ButtonLink, CTASection, PageIntro, SectionHeading, StatusBadge, pageWidth } from '../../components/site/PublicUI';
import { resources, services, type ResourceDefinition } from '../../content/unifiedSite';
import { exampleFlows, libraryDocuments, type ExampleFlow } from '../../content/resourceLibrary';
import { trackSiteEvent } from '../../lib/siteAnalytics';

type ResourceCategory = ResourceDefinition['category'];
type PathfinderAnswer = 'unclear' | 'fragmented' | 'stalled';

const categoryMeta: Record<ResourceCategory, { slug: string; description: string }> = {
  Guides: { slug: 'guides', description: 'Decision frameworks that help an owner diagnose the condition before choosing an intervention.' },
  Tools: { slug: 'tools', description: 'Interactive utilities that turn a few operating inputs into a reviewable starting point.' },
  Demonstrations: { slug: 'demonstrations', description: 'Guided examples of capture, transformation, review, and completion inside the B2W system.' },
  'Case Studies': { slug: 'case-studies', description: 'Animated business flows that show how B2W transforms source evidence into a reviewed operating document.' },
};

const questions = [
  {
    prompt: 'Which condition is most visible right now?',
    options: [
      { id: 'unclear' as const, label: 'The next project decision is unclear', detail: 'Scope, schedule, or customer decisions are competing for attention.' },
      { id: 'fragmented' as const, label: 'Job communication is fragmented', detail: 'The team loses project context across messages, calls, photos, and handoffs.' },
      { id: 'stalled' as const, label: 'Approved project work is stalled', detail: 'The direction exists, but ownership or field execution is not moving.' },
    ],
  },
  {
    prompt: 'What would create the most value next?',
    options: [
      { id: 'unclear' as const, label: 'A project decision sequence', detail: 'Evidence, tradeoffs, approvals, and a clear owner.' },
      { id: 'fragmented' as const, label: 'A working job-information flow', detail: 'A system that connects field and office communication and makes status visible.' },
      { id: 'stalled' as const, label: 'Accountable project delivery', detail: 'Owners, documentation, launch, and field adoption.' },
    ],
  },
  {
    prompt: 'Where should B2W begin?',
    options: [
      { id: 'unclear' as const, label: 'Diagnose contractor operations', detail: 'Start with the project condition before prescribing a product workflow.' },
      { id: 'fragmented' as const, label: 'Map the contracting workflow', detail: 'Trace job information, decisions, people, and tools.' },
      { id: 'stalled' as const, label: 'Review implementation readiness', detail: 'Confirm project scope, ownership, dependencies, and adoption gates.' },
    ],
  },
] as const;

function EngagementPathfinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PathfinderAnswer[]>([]);
  const [complete, setComplete] = useState(false);

  const recommendation = useMemo(() => {
    const counts: Record<PathfinderAnswer, number> = { unclear: 0, fragmented: 0, stalled: 0 };
    answers.forEach((answer) => { counts[answer] += 1; });
    const candidates: PathfinderAnswer[] = ['unclear', 'fragmented', 'stalled'];
    const winner = candidates.reduce((best, candidate) => counts[candidate] > counts[best] ? candidate : best, 'unclear');
    return winner === 'unclear' ? services[0] : winner === 'fragmented' ? services[1] : services[2];
  }, [answers]);

  const select = (answer: PathfinderAnswer) => {
    setAnswers((current) => [...current.slice(0, step), answer]);
  };

  const next = () => {
    if (!answers[step]) return;
    if (step === questions.length - 1) setComplete(true);
    else setStep((current) => current + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setComplete(false);
  };

  return (
    <section id="pathfinder" className="scroll-mt-32 overflow-hidden rounded-[2rem] border border-[var(--b2w-line)] bg-white shadow-[var(--b2w-shadow)]">
      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="bg-[var(--b2w-plum-dark)] p-7 text-white">
          <Sparkles className="h-6 w-6 text-[var(--b2w-gold)]" />
          <p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold)]">Interactive tool</p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">Engagement pathfinder</h2>
          <ol className="mt-10 space-y-4">
            {['Input', 'Transform', 'Review', 'Complete'].map((label, index) => {
              const active = complete ? index === 3 : index === 0 ? step < 2 : index === 1 ? step === 2 : index === 2 && step === 2;
              return <li key={label} className={`flex items-center gap-3 text-xs ${active ? 'text-white' : 'text-white/35'}`}><span className={`grid h-7 w-7 place-items-center rounded-full border ${active ? 'border-[var(--b2w-gold)] bg-[var(--b2w-gold)] text-[var(--b2w-plum-dark)]' : 'border-white/15'}`}>{index + 1}</span>{label}</li>;
            })}
          </ol>
        </aside>
        <div className="min-h-[500px] p-6 sm:p-9">
          {!complete ? (
            <>
              <div className="flex items-center justify-between gap-4"><p className="font-mono text-[10px] text-[var(--b2w-plum)]">Question {step + 1} of {questions.length}</p><div className="flex gap-1">{questions.map((_, index) => <span key={index} className={`h-1.5 w-8 rounded-full ${index <= step ? 'bg-[var(--b2w-plum)]' : 'bg-[var(--b2w-canvas-deep)]'}`} />)}</div></div>
              <h3 className="mt-10 max-w-xl text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">{questions[step].prompt}</h3>
              <div className="mt-8 grid gap-3">
                {questions[step].options.map((option) => {
                  const selected = answers[step] === option.id;
                  return <button key={option.label} type="button" onClick={() => select(option.id)} aria-pressed={selected} className={`flex w-full items-center justify-between gap-5 rounded-[1.25rem] border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] ${selected ? 'border-[var(--b2w-plum)] bg-[var(--b2w-plum-soft)]/65' : 'border-[var(--b2w-line)] hover:border-[var(--b2w-plum)]/50'}`}><span><span className="block text-sm font-semibold">{option.label}</span><span className="mt-1 block text-xs leading-5 text-[var(--b2w-ink-muted)]">{option.detail}</span></span><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${selected ? 'border-[var(--b2w-plum)] bg-[var(--b2w-plum)] text-white' : 'border-[var(--b2w-line)]'}`}>{selected ? <Check className="h-3.5 w-3.5" /> : null}</span></button>;
                })}
              </div>
              <div className="mt-8 flex items-center justify-between"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--b2w-ink-muted)] disabled:opacity-30"><ArrowLeft className="h-4 w-4" />Back</button><button type="button" onClick={next} disabled={!answers[step]} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--b2w-plum-dark)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35">{step === questions.length - 1 ? 'Review recommendation' : 'Continue'}<ArrowRight className="h-4 w-4" /></button></div>
            </>
          ) : (
            <div aria-live="polite">
              <ClipboardCheck className="h-7 w-7 text-[var(--b2w-green)]" />
              <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-green-dark)]">Complete · Recommended starting path</p>
              <h3 className="mt-4 text-5xl font-medium tracking-[-0.05em]">{recommendation.title}</h3>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--b2w-ink-muted)]">{recommendation.work}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-[1.25rem] bg-[var(--b2w-canvas)] p-5"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-gold-dark)]">Expected output</p><p className="mt-3 text-sm leading-6">{recommendation.output}</p></div><div className="rounded-[1.25rem] bg-[var(--b2w-canvas)] p-5"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-gold-dark)]">Why this path</p><p className="mt-3 text-sm leading-6">Your answers point to the General Contracting condition this workflow should resolve first.</p></div></div>
              <div className="mt-8 flex flex-wrap gap-3"><ButtonLink to={`${recommendation.href}&source=pathfinder`} eventLabel={`Pathfinder: ${recommendation.title}`}>{recommendation.nextAction}</ButtonLink><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--b2w-ink-muted)]"><RotateCcw className="h-4 w-4" />Start again</button></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DocumentLibrary() {
  const documents = libraryDocuments['General Contracting'];

  return (
    <section id="document-library" className="scroll-mt-32">
      <div className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--b2w-plum-dark)] px-5 text-sm font-semibold text-white">
        <HardHat className="h-4 w-4" />General Contracting
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }} className="grid gap-px overflow-hidden rounded-[1.75rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => <article key={document.title} className="flex min-h-72 flex-col bg-white p-6"><div className="flex items-center justify-between gap-4"><FileText className="h-5 w-5 text-[var(--b2w-plum)]" /><span className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] ${document.status === 'Concept phase' ? 'bg-[var(--b2w-gold-soft)] text-[var(--b2w-gold-dark)]' : 'bg-[var(--b2w-green-soft)] text-[var(--b2w-green-dark)]'}`}>{document.status}</span></div><h3 className="mt-9 text-2xl font-semibold tracking-[-0.035em]">{document.title}</h3><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{document.description}</p><div className="mt-auto pt-7"><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--b2w-ink-faint)]">Typical inputs</p><p className="mt-2 text-xs leading-6 text-[var(--b2w-ink-muted)]">{document.inputs}</p></div></article>)}
      </motion.div>
    </section>
  );
}

function FlowPreview({ flow, step }: { flow: ExampleFlow; step: number }) {
  const current = flow.steps[step];
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`${flow.industry}-${step}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .32 }} className="grid min-h-[430px] gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)] lg:items-center">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--b2w-plum)]">{current.label} · Step {step + 1} of 4</p><h3 className="mt-5 max-w-xl text-4xl font-medium leading-none tracking-[-0.045em] sm:text-5xl">{current.title}</h3><p className="mt-6 max-w-2xl text-sm leading-7 text-[var(--b2w-ink-muted)]">{current.detail}</p></div>
        <motion.div initial={{ scale: .97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .08 }} className="rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-6 shadow-[0_18px_55px_rgba(23,34,30,.08)]"><div className="flex items-center justify-between gap-4 border-b border-[var(--b2w-line)] pb-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--b2w-plum-dark)] text-white"><FileText className="h-4 w-4" /></span><div><p className="text-xs font-semibold">B2W working document</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--b2w-ink-faint)]">{flow.industry}</p></div></div><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--b2w-green)]" /></div><ul className="mt-5 space-y-3">{current.artifact.map((item, index) => <motion.li key={item} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 + index * .08 }} className="flex gap-3 rounded-xl bg-white p-3 text-xs leading-5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--b2w-green-dark)]" />{item}</motion.li>)}</ul>{current.label === 'Generate' ? <p className="mt-5 border-t border-[var(--b2w-line)] pt-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--b2w-gold-dark)]">Human reviewed · Source linked · Ready for approved use</p> : null}</motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ExampleFlowStudio() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduceMotion = useReducedMotion();
  const flow = exampleFlows[0];

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % 4), 2800);
    return () => window.clearInterval(timer);
  }, [playing, reduceMotion]);

  return (
    <section id="example-flows" className="scroll-mt-32 overflow-hidden rounded-[2rem] border border-[var(--b2w-line)] bg-white shadow-[var(--b2w-shadow)]">
      <div className="border-b border-[var(--b2w-line)] bg-[var(--b2w-plum-dark)] p-5 text-white sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-gold)]">General Contracting demonstration</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">See the document build, not a static case study.</h2></div><span className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[var(--b2w-plum-dark)]"><HardHat className="h-3.5 w-3.5" />General Contracting</span></div>
      </div>
      <div className="grid border-b border-[var(--b2w-line)] sm:grid-cols-4">{flow.steps.map((item, index) => <button key={item.label} type="button" onClick={() => { setStep(index); setPlaying(false); }} className={`relative flex min-h-16 items-center justify-center gap-2 border-b border-[var(--b2w-line)] px-4 text-xs font-semibold transition last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${step === index ? 'bg-[var(--b2w-plum-soft)] text-[var(--b2w-plum-dark)]' : 'text-[var(--b2w-ink-faint)] hover:bg-[var(--b2w-canvas)]'}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-[9px] ${step === index ? 'bg-[var(--b2w-plum-dark)] text-white' : 'border border-[var(--b2w-line)]'}`}>{index + 1}</span>{item.label}{step === index ? <motion.span layoutId="flow-progress" className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--b2w-plum)]" /> : null}</button>)}</div>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--b2w-line)] bg-[var(--b2w-canvas)] px-6 py-4"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{flow.title}</p><span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] ${flow.status === 'Concept phase' ? 'bg-[var(--b2w-gold-soft)] text-[var(--b2w-gold-dark)]' : 'bg-[var(--b2w-green-soft)] text-[var(--b2w-green-dark)]'}`}>{flow.status}</span></div><p className="mt-1 text-xs text-[var(--b2w-ink-faint)]">{flow.description}</p></div><button type="button" onClick={() => setPlaying((current) => !current)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--b2w-line)] bg-white" aria-label={playing ? 'Pause animation' : 'Play animation'}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button></div>
      <FlowPreview flow={flow} step={step} />
      <div className="flex items-center justify-between gap-4 border-t border-[var(--b2w-line)] px-6 py-4"><p className="text-[10px] text-[var(--b2w-ink-faint)]">Example content is illustrative. Generated documents require human review and approved source data.</p><button type="button" onClick={() => { setStep((current) => (current + 1) % 4); setPlaying(false); }} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-[var(--b2w-plum-dark)] px-4 text-xs font-semibold text-white">Next stage <ArrowRight className="h-3.5 w-3.5" /></button></div>
    </section>
  );
}

function ResourceGrid({ items }: { items: ResourceDefinition[] }) {
  return <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] sm:grid-cols-2 lg:grid-cols-3">{items.map((resource) => <Link key={`${resource.category}-${resource.title}`} to={resource.href} onClick={() => trackSiteEvent('resource_engaged', { resource: resource.title, category: resource.category })} className="group flex min-h-72 flex-col bg-white p-6 transition hover:bg-[var(--b2w-plum-soft)]/40"><div className="flex items-center justify-between gap-4"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--b2w-plum)]">{resource.category}</p><StatusBadge stage={resource.status} /></div><h3 className="mt-10 text-2xl font-semibold tracking-[-0.035em]">{resource.title}</h3><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{resource.description}</p><div className="mt-auto pt-7"><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--b2w-ink-faint)]">Decision supported</p><span className="mt-2 flex items-center justify-between gap-4 text-sm font-semibold">{resource.decision}<ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" /></span></div></Link>)}</div>;
}

export default function ResourcesPage({ category }: { category?: ResourceCategory }) {
  const shownResources = category ? resources.filter((resource) => resource.category === category) : resources;
  const title = category ? `${category} for General Contracting` : 'General Contracting Resources';
  const description = category ? categoryMeta[category].description : 'Explore documents for General Contracting, then follow an interactive workflow from raw project input to a reviewed, usable output.';
  const canonicalPath = category ? `/resources/${categoryMeta[category].slug}` : '/resources';

  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title={`${title} from B2W`} description={description} canonicalPath={canonicalPath} />
      <PageIntro eyebrow={category ? `General Contracting · ${category}` : 'General Contracting resources'} title={category ? `${category} for contractor decisions.` : 'Turn job evidence into a document your team can use.'} description={description} primary={{ label: 'Explore contractor documents', to: `${canonicalPath}#document-library` }} secondary={{ label: 'See the project flow', to: `${canonicalPath}#example-flows` }} tone="plum" />
      {!category || category === 'Tools' ? <section className="border-y border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)]"><div className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="01 · Guided progression" title="Input. Transform. Review. Complete." description="The interaction uses Clara-derived progression inside the B2W parent system: one prompt at a time, a visible state change, review before output, and one next action." tone="plum" /><EngagementPathfinder /></div></section> : null}
      {!category || category === 'Guides' || category === 'Tools' ? <section className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="02 · Contractor document library" title="Built around how General Contracting jobs move." description="Each document begins with field or office evidence, preserves review responsibility, and supports a real project decision. Project estimation remains a coming-soon workflow." tone="plum" /><DocumentLibrary /></section> : null}
      {!category || category === 'Demonstrations' || category === 'Case Studies' ? <section className="border-y border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)]"><div className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="03 · Contracting workflow" title="A project example becomes a working demonstration." description="Watch a contractor move from site evidence through scope structure and human review to a usable project document. Estimation remains clearly marked as concept phase." tone="plum" /><ExampleFlowStudio /></div></section> : null}
      {category && category !== 'Case Studies' && category !== 'Demonstrations' ? <section className={`${pageWidth} pb-16 sm:pb-24`}><SectionHeading index="04 · Resource index" title={`Browse ${category.toLowerCase()}.`} description="Supporting resources remain connected to a decision, a status, and a useful next action." tone="plum" /><ResourceGrid items={shownResources} /></section> : null}
      <CTASection eyebrow="General Contracting" title="Bring the job question your messages should already answer." description="We will review the project condition, the communication available, and whether JasonAI or a focused contractor workflow is the right next product step." action={{ label: 'Book a founder review', to: '/contact?type=jasonai' }} secondary={{ label: 'Meet JasonAI', to: '/jasonai' }} tone="plum" />
    </div>
  );
}
