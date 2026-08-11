import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  FileSpreadsheet,
  FileText,
  FolderLock,
  Mic,
  Paperclip,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import {
  ButtonLink,
  CTASection,
  SectionHeading,
  pageWidth,
} from '../components/site/PublicUI';
import {
  EstimateDocumentContent,
  initialCategories,
  Section1VoiceCapture,
  Section2_1OrganizedScope,
  type Category,
} from './solutions/SolutionsLandingPage';

const claraPink = '#a66589';
const claraDark = '#3d1f33';
const claraDemoUrl = 'https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=b24a24';
const claraWorkspaceWidth = 760;
const claraWorkspaceHeight = 623;

const promptExamples = [
  'Draft a project estimate from today’s site notes.',
  'Turn our discovery call into a client-ready proposal.',
  'Update this scope using our preferred labor rates.',
] as const;

const voiceTranscript = 'Create an estimate for the south conference room. Replace the flooring, repair the window trim, and use our standard labor rates.';

const preferenceSources = [
  { icon: FileSpreadsheet, name: 'Cost library.xlsx', detail: 'Labor, materials, markup, and contingency' },
  { icon: FileText, name: 'Proposal standards.pdf', detail: 'Tone, terms, exclusions, and approval language' },
  { icon: SlidersHorizontal, name: 'Company preferences', detail: 'Units, formats, review rules, and brand voice' },
] as const;

const createJourneySlides = [
  {
    title: 'Start with the job',
    label: 'Estimate request',
    body: 'Describe the work in plain language and give Clara the project details you already have.',
    image: '/images/clara/ask-naturally.jpg',
    alt: 'Project manager describing a new document request from her project office.',
  },
  {
    title: 'Apply company knowledge',
    label: 'Standards + pricing',
    body: 'Clara brings together your SOPs, pricing manuals, and preferred vendors to structure the estimate.',
    image: '/images/clara/develop-together-v2.jpg',
    alt: 'The same project manager reviewing a plan and tablet during an active renovation site walk.',
  },
  {
    title: 'Review the estimate',
    label: 'Estimate ready',
    body: 'Confirm the scope, costs, assumptions, and vendor choices before approving the estimate for use.',
    image: '/images/clara/finish-with-control-v2.jpg',
    alt: 'The same project manager guiding clients through a final project document review.',
  },
] as const;

function ClaraHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#ead9e2] bg-[#fff8fb]">
      <div className={`${pageWidth} pb-16 pt-32 sm:pb-20 sm:pt-36`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.55fr)] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a66589]">Clara · Expert · Concept phase</p>
            <h1 className="mt-6 max-w-[13ch] text-5xl font-medium leading-[.94] tracking-[-.055em] text-[#141714] sm:text-7xl lg:text-[6.2rem]">Complete tasks on job sites.</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .52, delay: .1, ease: [0.22, 1, 0.36, 1] }} className="border-l border-[#d9a9c2] pl-6 sm:pl-8">
            <p className="text-base leading-8 text-[#7e5c70] sm:text-lg">Clara is a customized, private workspace concept where project teams could capture information, develop documents, complete tasks, and review work directly from the job site.</p>
            <div className="mt-7 flex flex-wrap items-center gap-4"><ButtonLink to="mailto:info@b2w-ai.com" variant="product">Discuss the concept</ButtonLink><ButtonLink to="/solutions/ai-workflows/project-estimates" variant="tertiary">View estimate concept</ButtonLink></div>
          </motion.div>
        </div>
        <motion.figure initial={{ opacity: 0, y: 22, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .68, delay: .16, ease: [0.22, 1, 0.36, 1] }} className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#d9a9c2]/45 bg-[#ead9e2] shadow-[0_34px_100px_rgba(61,31,51,.14)]">
          <img
            src="/images/clara/job-site-hero-1280.jpg"
            srcSet="/images/clara/job-site-hero-640.jpg 640w, /images/clara/job-site-hero-1280.jpg 1280w, /images/clara/job-site-hero.jpg 1600w"
            sizes="(max-width: 1440px) 100vw, (min-width: 2560px) 2240px, 80vw"
            alt="Organized commercial construction site with a secure project tablet on a plan table."
            className="aspect-[16/8] w-full object-cover sm:aspect-[16/7]"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#27131f]/38 via-transparent to-transparent" />
          <figcaption className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/25 bg-[#2b1724]/76 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white shadow-lg backdrop-blur-md sm:bottom-7 sm:left-7"><ShieldCheck className="h-4 w-4 text-[#f0cfe0]" /> Secure workspace concept · Designed for site use</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function ClaraFloatingCTA({ hideOnMobile = false }: { hideOnMobile?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateVisibility = () => {
      const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      setIsVisible(window.scrollY > 520 && distanceFromBottom > 420);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: .22 }}
          className={`pointer-events-none fixed inset-x-0 bottom-16 z-40 justify-center px-4 sm:bottom-8 sm:flex ${hideOnMobile ? 'hidden' : 'flex'}`}
        >
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#d9a9c2]/70 bg-white/92 p-1.5 shadow-[0_18px_60px_rgba(61,31,51,.20)] backdrop-blur-md sm:gap-1.5 sm:p-2">
            <a href="mailto:info@b2w-ai.com" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#3d1f33] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#5a2c49] sm:px-4 sm:text-sm">
              Discuss Clara
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={claraDemoUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full px-3.5 py-2 text-xs font-semibold text-[#3d1f33] transition hover:bg-[#f5e4ed] sm:px-4 sm:text-sm">
              <span className="sm:hidden">Book Demo</span><span className="hidden sm:inline">Book Demo Call</span>
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const estimateSteps = [
  { step: 1, label: 'Capture', detail: 'Speak the field note', icon: Mic },
  { step: 2, label: 'Scope', detail: 'Organize the work', icon: SlidersHorizontal },
  { step: 3, label: 'Estimate', detail: 'Review every line', icon: FileSpreadsheet },
] as const;

function V1ClaraEstimateHero() {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>(() => initialCategories.map((category) => ({
    ...category,
    subItems: category.subItems.map((item) => ({ ...item })),
  })));
  const [contingencyPct, setContingencyPct] = useState<number | string>(15);
  const [animatingCatIndex, setAnimatingCatIndex] = useState(-1);
  const [animatingSubItemCount, setAnimatingSubItemCount] = useState(0);
  const [estimateComplete, setEstimateComplete] = useState(false);

  useEffect(() => {
    if (currentStep !== 3 || estimateComplete) return undefined;

    if (animatingCatIndex < categories.length) {
      const category = categories[animatingCatIndex];
      if (category && animatingSubItemCount < category.subItems.length) {
        const timer = window.setTimeout(() => setAnimatingSubItemCount((count) => count + 1), 70);
        return () => window.clearTimeout(timer);
      }

      const timer = window.setTimeout(() => {
        setAnimatingCatIndex((index) => index + 1);
        setAnimatingSubItemCount(0);
      }, 150);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => setEstimateComplete(true), 220);
    return () => window.clearTimeout(timer);
  }, [animatingCatIndex, animatingSubItemCount, categories, currentStep, estimateComplete]);

  const totals = useMemo(() => {
    const subtotal = categories.reduce((categoryTotal, category) => categoryTotal + category.subItems.reduce((lineTotal, item) => {
      if (!item.checked) return lineTotal;
      const quantity = typeof item.qty === 'string' ? Number.parseFloat(item.qty) || 0 : item.qty;
      return lineTotal + quantity * item.unitPrice;
    }, 0), 0);
    const safeContingency = typeof contingencyPct === 'string' ? Number.parseFloat(contingencyPct) || 0 : contingencyPct;
    const contingency = subtotal * (safeContingency / 100);
    return { subtotal, contingency, grandTotal: subtotal + contingency };
  }, [categories, contingencyPct]);

  const toggleCheck = (categoryIndex: number, itemId: string) => {
    if (!estimateComplete) return;
    setCategories((current) => current.map((category, index) => index === categoryIndex
      ? { ...category, subItems: category.subItems.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item) }
      : category));
  };

  const updateQty = (categoryIndex: number, itemId: string, value: string) => {
    setCategories((current) => current.map((category, index) => index === categoryIndex
      ? { ...category, subItems: category.subItems.map((item) => item.id === itemId ? { ...item, qty: value } : item) }
      : category));
  };

  const showStep = (step: number) => {
    setCurrentStep(step);
    if (step === 3 && animatingCatIndex < 0) setAnimatingCatIndex(0);
  };

  const enterWorkflow = () => {
    showStep(1);
    window.requestAnimationFrame(() => document.getElementById('clara-estimator-workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <section id="clara-estimator" data-header-theme="dark" className="relative isolate overflow-hidden border-b border-[#442638] bg-[#130d12] text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_12%,rgba(166,101,137,.34),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(23,105,255,.22),transparent_28%),linear-gradient(180deg,#130d12_0%,#21131d_58%,#160f15_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className={`${pageWidth} pb-12 pt-24 sm:pb-24 sm:pt-36`}>
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,.65fr)] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d9a9c2] sm:text-[10px] sm:tracking-[0.22em]">Clara · Expert · Concept phase</p>
            <h1 className="mt-5 max-w-[13ch] text-[2.75rem] font-medium leading-[.94] tracking-[-.055em] text-white sm:mt-6 sm:text-7xl lg:text-[6.2rem]">Complete tasks on job sites.</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .12 }} className="border-l border-[#d9a9c2]/65 pl-6 sm:pl-8">
            <p className="text-[15px] leading-7 text-white/68 sm:text-lg sm:leading-8">Clara is a customized, private workspace concept where project teams could capture information, develop documents, complete tasks, and review work directly from the job site.</p>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <a href="mailto:info@b2w-ai.com" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f5dce8] px-5 py-3 text-sm font-semibold text-[#2b1724] shadow-[0_16px_44px_rgba(166,101,137,.24)] transition hover:bg-white">Discuss the concept</a>
              <button type="button" onClick={enterWorkflow} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#1769ff]/70 hover:bg-[#1769ff]/10">Try estimate workflow <ArrowRight className="h-4 w-4" /></button>
            </div>
          </motion.div>
        </div>

        <motion.figure initial={{ opacity: 0, y: 22, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .68, delay: .16, ease: [0.22, 1, 0.36, 1] }} className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-[#d9a9c2]/35 bg-[#2b1724] shadow-[0_34px_100px_rgba(0,0,0,.42)] sm:mt-10 sm:rounded-[2rem]">
          <img
            src="/images/clara/job-site-hero-1280.jpg"
            srcSet="/images/clara/job-site-hero-640.jpg 640w, /images/clara/job-site-hero-1280.jpg 1280w, /images/clara/job-site-hero.jpg 1600w"
            sizes="(max-width: 1440px) 100vw, (min-width: 2560px) 2240px, 80vw"
            alt="Organized commercial construction site with a secure project tablet on a plan table."
            className="aspect-[16/8] w-full object-cover opacity-80 saturate-[.82] sm:aspect-[16/7]"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,13,18,.12),rgba(39,19,31,.68))]" />
          <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-[#160f15]/78 px-3 py-2 text-center text-[8px] font-semibold uppercase leading-4 tracking-[.11em] text-white shadow-lg backdrop-blur-md sm:inset-x-auto sm:bottom-7 sm:left-7 sm:justify-start sm:gap-3 sm:px-4 sm:text-[10px] sm:tracking-[.14em]"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#f0cfe0] sm:h-4 sm:w-4" /> Secure workspace concept · Designed for site use</figcaption>
        </motion.figure>

        <div className="mb-5 mt-12 grid gap-4 sm:mb-7 sm:mt-20 sm:grid-cols-[minmax(0,1fr)_minmax(18rem,.52fr)] sm:items-end sm:gap-5">
          <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.2em] text-[#79a7ff]">Voice to estimate</p><h2 className="mt-3 max-w-[16ch] text-3xl font-medium leading-[1] tracking-[-.045em] text-white sm:text-5xl">From site note to reviewed estimate.</h2></div>
          <p className="text-sm leading-7 text-white/58">Move through the original Clara workflow. Each step keeps the job context visible while the document becomes more structured and ready for judgment.</p>
        </div>

        <motion.div id="clara-estimator-workflow" initial={{ opacity: 0, y: 24, scale: .99 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .65, delay: .18, ease: [0.22, 1, 0.36, 1] }} className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-[#d9a9c2]/24 bg-[#160f15]/92 shadow-[0_42px_120px_rgba(0,0,0,.46)] backdrop-blur">
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/[.025]" aria-label="Clara estimate workflow steps">
            {estimateSteps.map(({ step, label, detail, icon: Icon }) => {
              const active = currentStep === step;
              return (
                <button key={step} type="button" aria-pressed={active} onClick={() => showStep(step)} className={`group relative flex min-h-[4.5rem] min-w-0 flex-col items-start gap-1.5 border-r border-white/8 px-2.5 py-2.5 text-left transition last:border-r-0 sm:min-h-20 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4 ${active ? 'bg-[#2b1724] text-white' : 'text-white/52 hover:bg-white/[.035] hover:text-white'}`}>
                  {active ? <motion.span layoutId="v1-clara-step" className="absolute inset-x-0 bottom-0 h-[2px] bg-[#1769ff]" /> : null}
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition sm:h-9 sm:w-9 sm:rounded-xl ${active ? 'border-[#1769ff]/55 bg-[#1769ff]/16 text-[#79a7ff]' : 'border-white/10 bg-white/[.025] text-[#d9a9c2]'}`}><Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></span>
                  <span><span className="block text-[9px] font-semibold uppercase tracking-[.18em] text-[#d9a9c2]">0{step}</span><span className="mt-1 block text-sm font-semibold">{label}</span><span className="mt-0.5 hidden text-[10px] font-normal text-white/42 lg:block">{detail}</span></span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[620px] overflow-hidden bg-[#130d12] sm:min-h-[720px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={createJourneySlides[currentStep - 1].image}
                src={createJourneySlides[currentStep - 1].image}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: .42, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(23,105,255,.16),transparent_28%),linear-gradient(180deg,rgba(19,13,18,.62),rgba(19,13,18,.90))]" />
            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                <motion.div key="capture" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: .35 }} className="absolute inset-0 z-10 flex items-center justify-center py-5">
                  <Section1VoiceCapture tone="dark" onComplete={() => showStep(2)} />
                </motion.div>
              ) : null}
              {currentStep === 2 ? (
                <motion.div key="scope" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: .35 }} className="absolute inset-0 z-10 flex items-center justify-center py-5">
                  <Section2_1OrganizedScope tone="dark" onComplete={() => showStep(3)} />
                </motion.div>
              ) : null}
              {currentStep === 3 ? (
                <motion.div key="estimate" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: .35 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 py-6">
                  <div className="mb-5 w-full text-center">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[.2em] text-[#79a7ff]">Step 03 · Review and adjust</p>
                    <h2 className="mt-2 text-3xl font-medium text-white md:text-4xl">Your estimate, ready for judgment.</h2>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#d9a9c2]">Toggle line items, edit quantities, and change contingency before anything leaves your hands.</p>
                  </div>
                  <div className="w-full max-w-[42rem] overflow-hidden rounded-[1.35rem] border border-[#1769ff]/28 bg-[#fdf9fb] shadow-[0_30px_90px_rgba(0,0,0,.45)]">
                    <div className="max-h-[510px] overflow-y-auto">
                      <EstimateDocumentContent
                        categories={categories}
                        animatingCatIndex={animatingCatIndex}
                        animatingSubItemCount={animatingSubItemCount}
                        estimateComplete={estimateComplete}
                        toggleCheck={toggleCheck}
                        updateQty={updateQty}
                        subtotal={totals.subtotal}
                        contingencyPct={contingencyPct}
                        setContingencyPct={setContingencyPct}
                        contingency={totals.contingency}
                        grandTotal={totals.grandTotal}
                        onEditNote={() => showStep(1)}
                        onShare={() => { window.location.href = 'mailto:info@b2w-ai.com?subject=Clara%20estimate'; }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-5 flex items-center justify-between gap-5 text-[10px] text-white/38">
          <p>Interactive concept · Review all generated work before use</p>
          <p className="hidden text-right sm:block"><span className="text-[#d9a9c2]">Mauve</span> marks project context · <span className="text-[#79a7ff]">Blue</span> marks estimate-ready work</p>
        </div>
      </div>
    </section>
  );
}

function CreateJourneySection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative border-y border-[#ead9e2] bg-white">
      <div className={`${pageWidth} py-16 sm:py-24`}>
        <SectionHeading title="Your company knowledge, brought together in one estimate." description="You already have SOPs, pricing manuals, and preferred vendors. Clara is the expert that brings them together—starting with a reviewable project estimate." tone="plum" />
        <div className="mb-4 grid gap-2 sm:grid-cols-3" aria-label="Document journey steps">
          {createJourneySlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-pressed={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${activeIndex === index ? 'border-[#3d1f33] bg-[#3d1f33] text-white' : 'border-[#ead9e2] bg-[#fffafd] text-[#7e5c70] hover:border-[#d9a9c2] hover:bg-[#fbf3f7]'}`}
            >
              <span className={`font-mono text-[9px] ${activeIndex === index ? 'text-[#f0cfe0]' : 'text-[#a66589]'}`}>0{index + 1}</span>
              <span className="text-xs font-semibold">{slide.title}</span>
            </button>
          ))}
        </div>
        <div className="flex h-[560px] gap-1 overflow-hidden rounded-[1.5rem] border border-[#ead9e2] bg-[#ead9e2] sm:h-[640px]">
          {createJourneySlides.map((slide, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={slide.title}
                type="button"
                aria-expanded={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="group relative min-w-0 overflow-hidden bg-[#3d1f33] text-left text-white outline-none transition-[flex-grow,flex-basis] duration-700 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f5dce8]"
                style={{ flexGrow: isActive ? 7 : 1, flexBasis: 0 }}
              >
                <img src={slide.image} alt={slide.alt} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-105 opacity-55'}`} />
                <div className={`absolute inset-0 transition duration-500 ${isActive ? 'bg-gradient-to-t from-[#27131f]/95 via-[#27131f]/12 to-black/5' : 'bg-[#3d1f33]/45'}`} />
                <span className="absolute left-1/2 top-5 -translate-x-1/2 font-mono text-[10px] font-semibold tracking-[.16em] text-white/75">0{index + 1}</span>
                {isActive ? (
                  <motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, delay: .12 }} className="absolute inset-x-0 bottom-0 block p-5 sm:p-7">
                    <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-[#f0cfe0]">{slide.label}</span>
                    <span className="mt-3 block max-w-lg text-2xl font-semibold tracking-[-.035em] sm:text-3xl">{slide.title}</span>
                    <span className="mt-3 block max-w-xl text-xs leading-6 text-white/72 sm:text-sm sm:leading-7">{slide.body}</span>
                  </motion.span>
                ) : (
                  <span className="absolute bottom-6 left-1/2 text-[10px] font-semibold uppercase tracking-[.16em] text-white/80 [writing-mode:vertical-rl] [transform:translateX(-50%)_rotate(180deg)]">{slide.title}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between gap-5">
          <p className="text-[10px] text-[#987386]">Choose a step above · Hover, focus, or tap the image</p>
          <div className="flex gap-1.5" aria-hidden="true">{createJourneySlides.map((slide, index) => <span key={slide.title} className={`h-1 rounded-full transition-all duration-500 ${activeIndex === index ? 'w-8 bg-[#a66589]' : 'w-3 bg-[#d9a9c2]'}`} />)}</div>
        </div>
      </div>
    </section>
  );
}

function ClaraWorkspaceDemo() {
  const shouldReduceMotion = useReducedMotion();
  const demoRef = useRef<HTMLDivElement>(null);
  const mockupViewportRef = useRef<HTMLDivElement>(null);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [mockupScale, setMockupScale] = useState(() => typeof window === 'undefined' ? 1 : Math.min(1, Math.max(0.1, (window.innerWidth - 80) / claraWorkspaceWidth)));
  const [mockupCanvasWidth, setMockupCanvasWidth] = useState(claraWorkspaceWidth);
  const [scene, setScene] = useState(0);
  const [voiceRun, setVoiceRun] = useState(0);
  const [voiceStage, setVoiceStage] = useState(0);
  const [recentWork, setRecentWork] = useState('Kitchen renovation estimate');
  const [promptIndex, setPromptIndex] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const demo = demoRef.current;
    if (!demo || !('IntersectionObserver' in window)) {
      setIsDemoActive(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setIsDemoActive(entry.isIntersecting), { rootMargin: '240px 0px' });
    observer.observe(demo);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = mockupViewportRef.current;
    if (!viewport) return undefined;

    const updateScale = () => {
      setMockupScale(Math.min(1, viewport.clientWidth / claraWorkspaceWidth));
      setMockupCanvasWidth(Math.max(claraWorkspaceWidth, viewport.clientWidth));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scene !== 0 || !isDemoActive) return undefined;
    setVoiceStage(0);
    if (shouldReduceMotion) {
      setVoiceStage(3);
      return undefined;
    }
    const timers = [
      window.setTimeout(() => setVoiceStage(1), 750),
      window.setTimeout(() => setVoiceStage(2), 2200),
      window.setTimeout(() => setVoiceStage(3), 4800),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isDemoActive, scene, shouldReduceMotion, voiceRun]);

  const selectScene = (nextScene: number) => {
    setScene(nextScene);
    if (nextScene === 0) setVoiceRun((current) => current + 1);
  };

  const submit = () => {
    if (message.trim()) {
      setMessage('');
      setPromptIndex((current) => (current + 1) % promptExamples.length);
      setScene(2);
    }
  };

  return (
    <div ref={demoRef} className="relative overflow-hidden rounded-[2.25rem] border border-[#1769ff]/35 bg-[#e9dee4]/92 p-3 shadow-[0_38px_110px_rgba(38,20,32,.28)] sm:p-4">
      <span aria-hidden="true" className="absolute bottom-1.5 left-1/2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[#9f8794]/55" />
      <div ref={mockupViewportRef} className="relative w-full overflow-hidden rounded-[1.55rem]" style={{ height: `${Math.ceil(claraWorkspaceHeight * mockupScale)}px` }}>
        <div className="absolute left-0 top-0 overflow-hidden rounded-[1.55rem] border border-[#cdbbc5] bg-white shadow-[0_20px_55px_rgba(61,31,51,.16)]" style={{ width: `${mockupCanvasWidth}px`, transform: `scale(${mockupScale})`, transformOrigin: 'top left' }}>
          <div className="border-b border-[#d9c8d1] bg-[#eee8ec] px-4 py-2.5">
            <div className="mx-auto grid max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d58c9f]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#d9bd83]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#83b99a]" />
              </div>
              <div className="flex h-10 min-w-0 items-center gap-2.5 rounded-xl border border-[#d7cad1] bg-white/95 px-3 shadow-[inset_0_1px_2px_rgba(61,31,51,.05)]">
                <img src="/brand/clara-logo-solid.png" alt="" className="h-5 w-5 shrink-0 object-contain" />
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                <span className="min-w-0 truncate font-mono text-[11px] text-[#5f4253]">chat.b2w-ai.com</span>
              </div>
              <span className="inline-flex rounded-full border border-emerald-700/15 bg-emerald-50 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.12em] text-emerald-800">Private</span>
            </div>
          </div>
          <div className="grid min-h-[560px] grid-cols-[220px_minmax(0,1fr)]">
            <aside className="border-r border-[#ead9e2] bg-[#fffafd] p-4">
            <button type="button" onClick={() => selectScene(0)} className={`flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-xl px-3 text-left text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/45 ${scene === 0 ? 'bg-[#1769ff] text-white shadow-[0_8px_22px_rgba(23,105,255,.22)]' : 'text-[#5f4253] hover:bg-[#e8f0ff] hover:text-[#1256d8]'}`}><Mic className="h-4 w-4" /> New document</button>
            <p className="mb-2 mt-5 px-2 text-[9px] font-semibold uppercase tracking-[.17em] text-[#987386]">Recent work</p>
            <div className="mt-2 space-y-1">
              {['Kitchen renovation estimate', 'Oak Street proposal', 'Vendor comparison'].map((item) => <button key={item} type="button" onClick={() => { setRecentWork(item); setScene(2); }} className={`block w-full cursor-pointer rounded-lg px-2 py-2 text-left text-[11px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/40 ${scene === 2 && recentWork === item ? 'bg-[#e8f0ff] font-semibold text-[#1256d8] shadow-sm ring-1 ring-[#1769ff]/35' : 'text-[#7e5c70] hover:bg-[#eef4ff] hover:text-[#1256d8]'}`}>{item}</button>)}
            </div>
            <button type="button" onClick={() => selectScene(1)} className={`mt-7 flex w-full cursor-pointer items-center gap-2 rounded-xl border-t border-[#ead9e2] px-2 py-3 text-left text-[10px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/40 ${scene === 1 ? 'bg-[#e8f0ff] font-semibold text-[#1256d8] ring-1 ring-[#1769ff]/25' : 'text-[#7e5c70] hover:bg-[#eef4ff] hover:text-[#1256d8]'}`}><FolderLock className="h-3.5 w-3.5" /> Company knowledge</button>
            </aside>
            <div className="flex min-w-0 flex-col bg-[#fdf9fb]">
            <div className="flex-1 overflow-hidden p-8">
              <AnimatePresence mode="wait">
                {scene === 0 ? (
                  <motion.div key="voice" initial={{ opacity: 0, y: 16, filter: 'blur(7px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }} transition={{ duration: .45 }} className="mx-auto max-w-xl">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#a66589]">New document · Voice to text</p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-.035em] text-[#3d1f33]">Start with what happened on site.</h3>
                    <div className="mt-6 flex items-center gap-5 rounded-2xl border border-[#ead9e2] bg-white p-4 shadow-sm">
                      <motion.button type="button" aria-label="Replay voice recording" onClick={() => setVoiceRun((current) => current + 1)} className={`relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white shadow-[0_8px_22px_rgba(61,31,51,.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a66589]/25 ${voiceStage >= 1 && voiceStage < 3 ? 'bg-[#7e4967]' : 'bg-[#3d1f33]'}`} animate={voiceStage === 0 && !shouldReduceMotion ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 1.2, repeat: voiceStage === 0 ? Infinity : 0 }}>
                        {voiceStage >= 1 && voiceStage < 3 ? [12, 22, 30, 18].map((height, index) => <motion.span key={height} className="mx-[1.5px] w-[3px] rounded-full bg-white" animate={{ height: [height * .45, height, height * .65] }} transition={{ duration: .75, repeat: Infinity, delay: index * .1, ease: 'easeInOut' }} />) : <Mic className="h-5 w-5" />}
                      </motion.button>
                      <div><p className="text-xs font-semibold text-[#3d1f33]">{voiceStage === 0 ? 'Record site notes' : voiceStage === 1 ? 'Recording…' : voiceStage === 2 ? 'Transcribing speech…' : 'Recording complete'}</p><p className="mt-1 text-[10px] text-[#987386]">{voiceStage === 0 ? 'Tap the microphone to begin' : voiceStage < 3 ? 'Clara is listening securely' : 'Voice note captured'}</p></div>
                    </div>
                    <AnimatePresence>
                      {voiceStage >= 2 ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-[#3d1f33] p-5 text-white shadow-xl"><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#e8cbd9]">Live transcription</p><p className="mt-3 text-xs leading-6 text-white/78">{voiceTranscript.split(' ').map((word, index) => <motion.span key={`${word}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: shouldReduceMotion ? 0 : index * .055 }}>{word}{' '}</motion.span>)}</p></motion.div> : null}
                      {voiceStage >= 3 ? <motion.div initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .42 }} className="mt-4 flex items-center gap-4 rounded-2xl border border-emerald-700/15 bg-emerald-50 p-4 shadow-sm"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700"><FileText className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-[9px] font-semibold uppercase tracking-[.14em] text-emerald-700">New document generated</p><p className="mt-1 text-sm font-semibold text-[#3d1f33]">South conference room estimate</p><p className="mt-1 text-[10px] text-[#7e5c70]">Scope, company rates, and assumptions are ready for review.</p></div><Check className="h-5 w-5 shrink-0 text-emerald-700" /></motion.div> : null}
                    </AnimatePresence>
                  </motion.div>
                ) : null}
                {scene === 1 ? (
                  <motion.div key="knowledge" initial={{ opacity: 0, scale: .975, filter: 'blur(7px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.015, filter: 'blur(5px)' }} transition={{ duration: .45 }} className="mx-auto max-w-2xl">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#a66589]">Company knowledge · Standardize</p>
                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#ead9e2] bg-white shadow-lg">
                      <div className="flex items-center justify-between border-b border-[#ead9e2] p-5"><div><p className="text-sm font-semibold text-[#3d1f33]">Approved company standards</p><p className="mt-1 text-[9px] text-[#987386]">Applying the right rules to this document</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-semibold text-emerald-700">Connected</span></div>
                      <div className="grid gap-px bg-[#ead9e2] sm:grid-cols-3">{preferenceSources.map((source, index) => { const Icon = source.icon; return <motion.div key={source.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 + index * .12 }} className="bg-white p-4"><Icon className="h-4 w-4 text-[#a66589]" /><p className="mt-3 text-[10px] font-semibold text-[#3d1f33]">{source.name}</p><p className="mt-1 text-[8px] leading-4 text-[#987386]">{source.detail}</p></motion.div>; })}</div>
                      <div className="p-5"><div className="flex items-center justify-between text-[9px] font-semibold text-[#7e5c70]"><span>Standardizing document</span><span>Complete</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f2e7ed]"><motion.div className="h-full rounded-full bg-[#a66589]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.2, ease: 'easeOut' }} /></div></div>
                    </div>
                  </motion.div>
                ) : null}
                {scene === 2 ? (
                  <motion.div key={`chat-${recentWork}`} initial={{ opacity: 0, x: 16, filter: 'blur(7px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -12, filter: 'blur(5px)' }} transition={{ duration: .45 }} className="mx-auto max-w-xl">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-[#a66589]">Recent work · AI chat</p>
                    <h3 className="mt-3 text-lg font-semibold tracking-[-.025em] text-[#3d1f33]">{recentWork}</h3>
                    {recentWork === 'Kitchen renovation estimate' ? (
                      <>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-auto mt-4 max-w-[92%] overflow-hidden rounded-2xl rounded-tr-sm bg-[#f5dce8] shadow-sm">
                          <div className="grid grid-cols-[8.5rem_minmax(0,1fr)]">
                            <img src="/images/clara/living-room-site-update.jpg" alt="Living room renovation site showing drywall, flooring, baseboard, and window-trim work." loading="lazy" decoding="async" className="h-full w-full object-cover" />
                            <div className="p-4 text-[#3d1f33]">
                              <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#a66589]">Site update · Living room</p>
                              <ul className="mt-2 space-y-1 text-[10px] leading-4 text-[#6f4a60]"><li>Repair damaged subfloor at window wall</li><li>Patch drywall and replace baseboard</li><li>Repair and refinish window trim</li></ul>
                              <p className="mt-3 text-xs font-semibold leading-5">Please update the original estimate with this work.</p>
                            </div>
                          </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .32 }} className="mt-4 rounded-2xl border border-[#d9a9c2]/55 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.15em] text-[#a66589]"><Sparkles className="h-3.5 w-3.5" /> Estimate updated</div>
                          <p className="mt-2 text-xs leading-6 text-[#7e5c70]">Clara added 3 living-room work items using your approved rates and terms.</p>
                          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f8edf3] px-3 py-2"><span className="text-[9px] font-semibold uppercase tracking-[.12em] text-[#987386]">Revised estimate</span><span className="text-sm font-semibold text-[#3d1f33]">$34,780 · Ready for review</span></div>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <div className="mt-5 flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3d1f33] text-white"><img src="/brand/clara-logo-solid.png" alt="" className="h-5 w-5 object-contain brightness-0 invert" /></span><div className="rounded-2xl rounded-tl-sm border border-[#ead9e2] bg-white p-4 text-xs leading-6 text-[#5f4253] shadow-sm">I found the working draft and its approved company context. What would you like to update?</div></div>
                        <motion.div key={promptIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="ml-auto mt-4 max-w-[85%] rounded-2xl rounded-tr-sm bg-[#f5dce8] p-4 text-xs leading-6 text-[#3d1f33]">{promptExamples[promptIndex]}</motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }} className="mt-4 rounded-2xl border border-[#ead9e2] bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.15em] text-[#a66589]"><Sparkles className="h-3.5 w-3.5" /> Clara updated the draft</div><p className="mt-2 text-xs leading-6 text-[#7e5c70]">Company rates, formatting, and approval language are applied and ready for review.</p></motion.div>
                      </>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <div className="border-t border-[#ead9e2] bg-white p-4">
              <div className="mx-auto flex max-w-xl items-center gap-2 rounded-2xl border border-[#d9a9c2]/55 bg-[#fdf9fb] p-2 transition focus-within:border-[#1769ff]/55 focus-within:ring-2 focus-within:ring-[#1769ff]/20">
                <button type="button" aria-label="Attach a company file" className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#1256d8] transition hover:bg-[#e8f0ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/35"><Paperclip className="h-4 w-4" /></button>
                <input value={message} onFocus={() => setScene(2)} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} placeholder={scene === 0 ? 'Speak or type a new document request…' : scene === 1 ? 'Ask about company standards…' : 'Ask Clara to revise the document…'} className="min-w-0 flex-1 bg-transparent px-1 text-sm text-[#3d1f33] outline-none placeholder:text-[#a98b9b]" />
                <button type="button" onClick={submit} aria-label="Send message" className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#1769ff] text-white shadow-[0_7px_18px_rgba(23,105,255,.24)] transition hover:bg-[#1256d8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1769ff]/25"><Send className="h-4 w-4" /></button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:hidden" aria-label="SaaS mockup views">
        {['Voice', 'Standards', 'Chat'].map((label, index) => (
          <button key={label} type="button" onClick={() => selectScene(index)} aria-pressed={scene === index} className={`min-h-11 rounded-xl px-2 py-2 text-[10px] font-semibold transition ${scene === index ? 'bg-[#1769ff] text-white shadow-[0_8px_20px_rgba(23,105,255,.2)]' : 'border border-[#d9a9c2]/55 bg-white/72 text-[#6f4a60]'}`}>{label}</button>
        ))}
      </div>
    </div>
  );
}

export default function ClaraProductPage() {
  const location = useLocation();
  const isV1EstimatePage = location.pathname === '/v1/estimates';
  const isVersionedClaraPage = /^\/v[123]\//.test(location.pathname);
  const estimatorLink = isV1EstimatePage ? '/v1/estimates#clara-estimator-workflow' : '/solutions/ai-workflows/project-estimates';

  return (
    <div className="min-h-screen bg-[#fff8fb] text-[#3d1f33] selection:bg-[#3d1f33] selection:text-white" style={{ '--b2w-plum': claraPink, '--b2w-plum-dark': claraDark } as React.CSSProperties}>
      <Seo />
      <main>
        {isV1EstimatePage ? <V1ClaraEstimateHero /> : <><ClaraHero /><CreateJourneySection /></>}

        <section id="clara-saas-workspace" className="relative isolate scroll-mt-20 overflow-hidden border-y border-[#ead9e2]">
          <img
            src="/images/clara/job-site-demo-background-1280.jpg"
            srcSet="/images/clara/job-site-demo-background-640.jpg 640w, /images/clara/job-site-demo-background-1280.jpg 1280w, /images/clara/job-site-demo-background.jpg 1800w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full scale-[1.015] object-cover object-center sm:blur-[3px]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(38,20,32,.38),rgba(63,34,52,.20)_42%,rgba(251,243,247,.52))]" />
          <div className={`${pageWidth} py-12 sm:py-24`}>
            <div className="w-full rounded-[1.35rem] border border-white/15 bg-[#2b1724]/92 p-4 text-white shadow-[0_18px_48px_rgba(31,14,25,.22)] backdrop-blur-sm sm:rounded-[1.5rem] sm:p-6">
              <h2 className="max-w-[22ch] text-2xl font-medium leading-[1] tracking-[-.045em] sm:text-4xl">Clara is B2W’s AI expert concept.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/68">The web workspace keeps company knowledge, current drafts, and the conversation that shaped them together in one permissioned channel.</p>
            </div>
            <div className="mt-6">
              <ClaraWorkspaceDemo />
            </div>
            <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
              {[
                ['Private workspace', FolderLock, 'Company context stays inside the workspace and its approved access boundary.'],
                ['Visible sources', ShieldCheck, 'See which preferences and company materials informed the draft.'],
                ['Human approval', Check, 'Every consequential cost, term, and output remains reviewable before it is used.'],
              ].map(([title, Icon, body]) => {
                const IconComponent = Icon as typeof ShieldCheck;
                return (
                  <article key={title as string} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-l-2 border-[#d9a9c2] bg-[#fff9fc]/90 p-4 shadow-lg backdrop-blur-md sm:block sm:p-5">
                    <IconComponent className="mt-0.5 h-5 w-5 text-[#a66589] sm:mt-0" />
                    <div><h3 className="text-sm font-semibold sm:mt-4">{title as string}</h3><p className="mt-1.5 text-xs leading-5 text-[#7e5c70] sm:mt-2 sm:leading-6">{body as string}</p></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${pageWidth} py-12 sm:py-24`}><SectionHeading title="One workspace. Many company documents." description="Begin with the document your team produces most often, make the preferences reliable, and expand from a proven workflow." tone="plum" /><div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[#ead9e2] bg-[#ead9e2] sm:grid-cols-2 lg:grid-cols-4">{[['Project estimates', 'Turn notes, quantities, and cost preferences into a reviewable estimate.'], ['Scopes of work', 'Organize requirements, assumptions, exclusions, and responsibilities.'], ['Client proposals', 'Develop persuasive, consistent proposals using company standards.'], ['Operating reports', 'Structure project inputs into status, decision, and follow-up documents.']].map(([title, body]) => <article key={title} className="flex flex-col bg-white p-5 sm:min-h-64 sm:p-6"><FileText className="h-5 w-5 text-[#a66589]" /><h3 className="mt-4 text-lg font-semibold tracking-[-.03em] sm:mt-10 sm:text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-[#7e5c70] sm:mt-3 sm:leading-7">{body}</p>{title === 'Project estimates' ? <ButtonLink to={estimatorLink} variant="tertiary" className="mt-2 pt-2 text-[#7e4967] sm:mt-auto sm:pt-7">{isV1EstimatePage ? 'Return to estimator' : 'View workflow demo'}</ButtonLink> : null}</article>)}</div></section>

        <CTASection eyebrow="Explore the concept" title="Bring us one document your company creates repeatedly." description="We’ll map the source material, preferences, review rules, and output so you can evaluate how a customized Clara workspace could fit your team. Clara is not generally available or priced." action={{ label: 'Discuss the Clara concept', to: 'mailto:info@b2w-ai.com', variant: 'product' }} secondary={{ label: isV1EstimatePage ? 'Return to the estimator' : 'View the estimate concept', to: estimatorLink }} tone="plum" compactMobile />
      </main>
      <ClaraFloatingCTA hideOnMobile={isVersionedClaraPage} />
    </div>
  );
}
