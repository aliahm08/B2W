import { useEffect, useState } from 'react';
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
import Seo from '../components/Seo';
import {
  ButtonLink,
  CTASection,
  SectionHeading,
  pageWidth,
} from '../components/site/PublicUI';

const claraPink = '#a66589';
const claraDark = '#3d1f33';
const claraDemoUrl = 'https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=b24a24';

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

function ClaraFloatingCTA() {
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
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 sm:bottom-8"
        >
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-[#d9a9c2]/70 bg-white/92 p-2 shadow-[0_18px_60px_rgba(61,31,51,.20)] backdrop-blur-md">
            <a href="mailto:info@b2w-ai.com" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#3d1f33] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5a2c49]">
              Discuss Clara
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={claraDemoUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-[#3d1f33] transition hover:bg-[#f5e4ed]">
              Book Demo Call
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
  const [scene, setScene] = useState(0);
  const [voiceRun, setVoiceRun] = useState(0);
  const [voiceStage, setVoiceStage] = useState(0);
  const [recentWork, setRecentWork] = useState('Kitchen renovation estimate');
  const [promptIndex, setPromptIndex] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (scene !== 0) return undefined;
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
  }, [scene, shouldReduceMotion, voiceRun]);

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
    <div className="relative overflow-hidden rounded-[2.25rem] border border-[#1769ff]/35 bg-[#e9dee4]/92 p-3 shadow-[0_38px_110px_rgba(38,20,32,.28)] sm:p-4">
      <span aria-hidden="true" className="absolute bottom-1.5 left-1/2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[#9f8794]/55" />
      <div className="overflow-hidden rounded-[1.55rem] border border-[#cdbbc5] bg-white shadow-[0_20px_55px_rgba(61,31,51,.16)]">
        <div className="border-b border-[#d9c8d1] bg-[#eee8ec] px-3 py-2.5 sm:px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d58c9f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d9bd83]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#83b99a]" />
            </div>
            <div className="flex h-10 min-w-0 items-center gap-2.5 rounded-xl border border-[#d7cad1] bg-white/95 px-3 shadow-[inset_0_1px_2px_rgba(61,31,51,.05)]">
              <img src="/brand/clara-logo-solid.png" alt="" className="h-5 w-5 shrink-0 object-contain" />
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
              <span className="min-w-0 truncate font-mono text-[10px] text-[#5f4253] sm:text-[11px]">chat.b2w-ai.com</span>
            </div>
            <span className="hidden rounded-full border border-emerald-700/15 bg-emerald-50 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.12em] text-emerald-800 sm:inline-flex">Private</span>
          </div>
        </div>
        <div className="grid min-h-[560px] md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-[#ead9e2] bg-[#fffafd] p-3 md:border-b-0 md:border-r md:p-4">
            <button type="button" onClick={() => selectScene(0)} className={`flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-xl px-3 text-left text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/45 ${scene === 0 ? 'bg-[#1769ff] text-white shadow-[0_8px_22px_rgba(23,105,255,.22)]' : 'text-[#5f4253] hover:bg-[#e8f0ff] hover:text-[#1256d8]'}`}><Mic className="h-4 w-4" /> New document</button>
            <p className="mb-2 mt-5 hidden px-2 text-[9px] font-semibold uppercase tracking-[.17em] text-[#987386] md:block">Recent work</p>
            <div className="mt-2 hidden space-y-1 md:block">
              {['Kitchen renovation estimate', 'Oak Street proposal', 'Vendor comparison'].map((item) => <button key={item} type="button" onClick={() => { setRecentWork(item); setScene(2); }} className={`block w-full cursor-pointer rounded-lg px-2 py-2 text-left text-[11px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/40 ${scene === 2 && recentWork === item ? 'bg-[#e8f0ff] font-semibold text-[#1256d8] shadow-sm ring-1 ring-[#1769ff]/35' : 'text-[#7e5c70] hover:bg-[#eef4ff] hover:text-[#1256d8]'}`}>{item}</button>)}
            </div>
            <button type="button" onClick={() => selectScene(1)} className={`mt-2 flex w-full cursor-pointer items-center gap-2 rounded-xl border-t border-[#ead9e2] px-2 py-3 text-left text-[10px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1769ff]/40 md:mt-7 ${scene === 1 ? 'bg-[#e8f0ff] font-semibold text-[#1256d8] ring-1 ring-[#1769ff]/25' : 'text-[#7e5c70] hover:bg-[#eef4ff] hover:text-[#1256d8]'}`}><FolderLock className="h-3.5 w-3.5" /> Company knowledge</button>
            <div className="mt-3 grid grid-cols-3 gap-1 md:hidden">
              {['Voice', 'Standards', 'Chat'].map((label, index) => <button key={label} type="button" onClick={() => selectScene(index)} className={`cursor-pointer rounded-lg px-2 py-2 text-[9px] font-semibold transition ${scene === index ? 'bg-[#1769ff] text-white' : 'bg-[#fbf3f7] text-[#7e5c70] hover:bg-[#e8f0ff] hover:text-[#1256d8]'}`}>{label}</button>)}
            </div>
          </aside>
          <div className="flex min-w-0 flex-col bg-[#fdf9fb]">
            <div className="flex-1 overflow-hidden p-5 sm:p-8">
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
                          <div className="grid sm:grid-cols-[8.5rem_minmax(0,1fr)]">
                            <img src="/images/clara/living-room-site-update.jpg" alt="Living room renovation site showing drywall, flooring, baseboard, and window-trim work." loading="lazy" decoding="async" className="h-32 w-full object-cover sm:h-full" />
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
  );
}

export default function ClaraProductPage() {
  return (
    <div className="min-h-screen bg-[#fff8fb] text-[#3d1f33] selection:bg-[#3d1f33] selection:text-white" style={{ '--b2w-plum': claraPink, '--b2w-plum-dark': claraDark } as React.CSSProperties}>
      <Seo />
      <main>
        <ClaraHero />

        <CreateJourneySection />

        <section className="relative isolate overflow-hidden border-y border-[#ead9e2]">
          <img
            src="/images/clara/job-site-demo-background-1280.jpg"
            srcSet="/images/clara/job-site-demo-background-640.jpg 640w, /images/clara/job-site-demo-background-1280.jpg 1280w, /images/clara/job-site-demo-background.jpg 1800w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full scale-[1.015] object-cover object-center blur-[3px]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(38,20,32,.38),rgba(63,34,52,.20)_42%,rgba(251,243,247,.52))]" />
          <div className={`${pageWidth} py-16 sm:py-24`}>
            <div className="w-full rounded-[1.5rem] border border-white/15 bg-[#2b1724]/92 p-5 text-white shadow-[0_18px_48px_rgba(31,14,25,.22)] backdrop-blur-sm sm:p-6">
              <h2 className="max-w-[22ch] text-3xl font-medium leading-[1] tracking-[-.045em] sm:text-4xl">Clara is B2W’s AI expert concept.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/68">The web workspace keeps company knowledge, current drafts, and the conversation that shaped them together in one permissioned channel.</p>
            </div>
            <div className="mt-6">
              <ClaraWorkspaceDemo />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['Private workspace', FolderLock, 'Company context stays inside the workspace and its approved access boundary.'],
                ['Visible sources', ShieldCheck, 'See which preferences and company materials informed the draft.'],
                ['Human approval', Check, 'Every consequential cost, term, and output remains reviewable before it is used.'],
              ].map(([title, Icon, body]) => {
                const IconComponent = Icon as typeof ShieldCheck;
                return (
                  <article key={title as string} className="border-l-2 border-[#d9a9c2] bg-[#fff9fc]/90 p-5 shadow-lg backdrop-blur-md">
                    <IconComponent className="h-5 w-5 text-[#a66589]" />
                    <h3 className="mt-4 text-sm font-semibold">{title as string}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#7e5c70]">{body as string}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${pageWidth} py-16 sm:py-24`}><SectionHeading title="One workspace. Many company documents." description="Begin with the document your team produces most often, make the preferences reliable, and expand from a proven workflow." tone="plum" /><div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[#ead9e2] bg-[#ead9e2] sm:grid-cols-2 lg:grid-cols-4">{[['Project estimates', 'Turn notes, quantities, and cost preferences into a reviewable estimate.'], ['Scopes of work', 'Organize requirements, assumptions, exclusions, and responsibilities.'], ['Client proposals', 'Develop persuasive, consistent proposals using company standards.'], ['Operating reports', 'Structure project inputs into status, decision, and follow-up documents.']].map(([title, body]) => <article key={title} className="flex min-h-64 flex-col bg-white p-6"><FileText className="h-5 w-5 text-[#a66589]" /><h3 className="mt-10 text-xl font-semibold tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#7e5c70]">{body}</p>{title === 'Project estimates' ? <ButtonLink to="/solutions/ai-workflows/project-estimates" variant="tertiary" className="mt-auto pt-7 text-[#7e4967]">View workflow demo</ButtonLink> : null}</article>)}</div></section>

        <CTASection eyebrow="Explore the concept" title="Bring us one document your company creates repeatedly." description="We’ll map the source material, preferences, review rules, and output so you can evaluate how a customized Clara workspace could fit your team. Clara is not generally available or priced." action={{ label: 'Discuss the Clara concept', to: 'mailto:info@b2w-ai.com', variant: 'product' }} secondary={{ label: 'View the estimate concept', to: '/solutions/ai-workflows/project-estimates' }} tone="plum" />
      </main>
      <ClaraFloatingCTA />
    </div>
  );
}
