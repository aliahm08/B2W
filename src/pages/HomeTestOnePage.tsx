import { motion } from 'motion/react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, MessageCircle, Mic } from 'lucide-react';
import PreviewFooter from '../components/PreviewFooter';
import { LiveSiteHeader } from '../components/V2SiteChrome';
import Seo from '../components/Seo';

const VisitorFitQuiz = lazy(() => import('../components/VisitorFitQuiz'));

type HeroMode = 'consulting' | 'jasonai' | 'clara';

const heroModes: Record<HeroMode, {
  label: string;
  statement: string;
  description: string;
  href: string;
  background: string;
  textClass: string;
  subtextClass: string;
  accentClass: string;
  glow: string;
  footerClass: string;
}> = {
  consulting: {
    label: 'Find a Solution',
    statement: 'We build tools for contractors to succeed.',
    description:
      'We consult with growing businesses, diagnose the real constraint, and bring developers and analysts to build the right service, system, or workflow.',
    href: '/services',
    background: 'linear-gradient(180deg,#fbfaf6 0%,#f7f4ed 55%,#fbfaf6 100%)',
    textClass: 'text-slate-950',
    subtextClass: 'text-slate-600',
    accentClass: 'border-slate-950 bg-slate-950 text-white hover:bg-[#24724f]',
    glow: 'rgba(36,114,79,0.14)',
    footerClass: 'text-slate-500',
  },
  jasonai: {
    label: 'Turn daily messages into follow-up clarity.',
    statement: 'Turn daily messages into follow-up clarity.',
    description:
      'A WhatsApp-ready assistant that searches approved work communication and turns long job conversations into concise summaries.',
    href: '/jasonai',
    background:
      'radial-gradient(circle at 18% 18%,rgba(178,74,36,0.28),transparent 30%),radial-gradient(circle at 82% 18%,rgba(37,211,102,0.14),transparent 26%),linear-gradient(180deg,#17110f 0%,#2a1710 58%,#fff3e7 100%)',
    textClass: 'text-[#fff7ed]',
    subtextClass: 'text-[#f4b28c]',
    accentClass: 'border-[#f4b28c] bg-[#14110f] text-white hover:bg-[#2a1710]',
    glow: 'rgba(178,74,36,0.34)',
    footerClass: 'text-[#fff7ed]/62',
  },
  clara: {
    label: 'Explore a concept for organized project documents.',
    statement: 'Explore a concept for organized project documents.',
    description:
      'A customized AI document-workspace concept for turning approved project inputs into reviewable scopes, estimates, and reports.',
    href: '/clara',
    background:
      'radial-gradient(circle at 16% 18%,rgba(166,101,137,0.24),transparent 30%),radial-gradient(circle at 84% 20%,rgba(232,203,218,0.42),transparent 28%),linear-gradient(180deg,#fbf5f8 0%,#fffafd 56%,#3d1f33 100%)',
    textClass: 'text-[#3d1f33]',
    subtextClass: 'text-[#9a5f7d]',
    accentClass: 'border-[#9a5f7d] bg-white/86 text-[#3d1f33] hover:bg-[#fbf0f5]',
    glow: 'rgba(166,101,137,0.28)',
    footerClass: 'text-[#3d1f33]/70',
  },
};

const heroProductImages = [
  {
    product: 'JasonAI',
    description: 'Find approved job context from the phone your team already uses.',
    to: '/jasonai',
    src: '/images/home/tools-jasonai-devices-1280.jpg',
    srcSet: '/images/home/tools-jasonai-devices-640.jpg 640w, /images/home/tools-jasonai-devices-1280.jpg 1280w, /images/home/tools-jasonai-devices.png 1448w',
    alt: 'Contractor reading a source-aware JasonAI answer on a phone.',
    tone: 'bg-[#14110f] text-white',
    detailTone: 'text-[#f4b28c]',
  },
  {
    product: 'Clara',
    description: 'Create and review project documents from a job-site tablet.',
    to: '/clara',
    src: '/images/home/tools-clara-tablet-1280.jpg',
    srcSet: '/images/home/tools-clara-tablet-640.jpg 640w, /images/home/tools-clara-tablet-1280.jpg 1280w, /images/home/tools-clara-tablet.png 1448w',
    alt: 'Project manager speaking to Clara on a rugged job-site tablet.',
    tone: 'bg-[#3d1f33] text-white',
    detailTone: 'text-[#e8cbda]',
  },
] as const;

function ProductFrame({
  mode,
  setActiveMode,
}: {
  mode: Exclude<HeroMode, 'consulting'>;
  setActiveMode: (mode: HeroMode) => void;
}) {
  const hero = heroModes[mode];
  const image = heroProductImages.find((item) => item.product.toLowerCase() === mode)!;
  const Icon = mode === 'jasonai' ? MessageCircle : Mic;
  const isJasonAI = mode === 'jasonai';
  const availability = isJasonAI ? 'Available Now' : 'Coming Soon';
  const contextHeading = isJasonAI ? 'In your existing tools' : 'Using your existing methods';
  const frameClass = isJasonAI
    ? 'border-[#f4b28c]/70 bg-[#14110f] text-white shadow-[0_28px_90px_rgba(178,74,36,0.22)]'
    : 'border-[#b889a1]/45 bg-[#fff8fb]/95 text-[#3d1f33] shadow-[0_28px_90px_rgba(126,73,103,0.18)]';
  const eyebrowClass = isJasonAI ? 'text-[#f4b28c]' : 'text-[#9a5f7d]';
  const buttonClass = isJasonAI
    ? 'border-[#f4b28c] bg-[#f4b28c] text-[#14110f] hover:bg-[#ffd7bd]'
    : 'border-[#7e4967] bg-[#3d1f33] text-white hover:bg-[#7e4967]';

  return (
    <motion.article
      layout
      onMouseEnter={() => setActiveMode(mode)}
      onMouseLeave={() => setActiveMode('consulting')}
      onFocus={() => setActiveMode(mode)}
      onBlur={() => setActiveMode('consulting')}
      className={`group relative flex min-h-[34rem] overflow-hidden rounded-[32px] border p-5 transition-colors sm:p-7 ${frameClass}`}
      initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${isJasonAI ? 'bg-[#b24a24]/34' : 'bg-[#d9a9c2]/42'}`}
        animate={{ scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between gap-4">
          <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${eyebrowClass}`}>{availability}</span>
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[22px] border border-white/12 bg-black/10">
          <img src={image.src} srcSet={image.srcSet} sizes="(max-width: 1024px) 100vw, 38rem" alt={image.alt} decoding="async" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <h2 className="whitespace-nowrap text-[clamp(1rem,2.7vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{contextHeading}.</h2>
          <div className="grid grid-rows-[1fr] opacity-100 transition-all duration-500 ease-out lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100">
            <div className="overflow-hidden">
              <div className="pt-3">
                <p className={`whitespace-nowrap text-[clamp(.72rem,1.05vw,1rem)] font-medium leading-6 ${eyebrowClass}`}>{hero.label}</p>
                <Link to={hero.href} className={`mt-7 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors ${buttonClass}`}>
                  {mode === 'jasonai' ? 'Explore JasonAI' : 'Explore Clara concept'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const contractorHeroSlides = [
  {
    label: 'Design-build firms',
    body: 'Connect design decisions, estimates, field changes, and delivery teams from concept through construction.',
    to: '/general-contractors',
    src: '/images/contractor-audiences/project-managers-1280.jpg',
    srcSet: '/images/contractor-audiences/project-managers-640.jpg 640w, /images/contractor-audiences/project-managers-1280.jpg 1280w',
  },
  {
    label: 'General contractors',
    body: 'Keep owners, project coordinators, office teams, crews, and subcontractors aligned across active jobs.',
    to: '/general-contractors',
    src: '/images/contractor-audiences/business-owners-1280.jpg',
    srcSet: '/images/contractor-audiences/business-owners-640.jpg 640w, /images/contractor-audiences/business-owners-1280.jpg 1280w',
  },
  {
    label: 'Electrical contractors',
    body: 'Turn site conditions, change requests, crew questions, and closeout details into clear next steps.',
    to: '/general-contractors',
    src: '/images/clara/job-site-hero-1280.jpg',
    srcSet: '/images/clara/job-site-hero-640.jpg 640w, /images/clara/job-site-hero-1280.jpg 1280w',
  },
  {
    label: 'Plumbing contractors',
    body: 'Keep service notes, material decisions, customer requests, and field-to-office handoffs together.',
    to: '/general-contractors',
    src: '/images/clara/job-site-demo-background-1280.jpg',
    srcSet: '/images/clara/job-site-demo-background-640.jpg 640w, /images/clara/job-site-demo-background-1280.jpg 1280w',
  },
  {
    label: 'HVAC contractors',
    body: 'Find installation context quickly and make estimates, approvals, and project updates easier to review.',
    to: '/general-contractors',
    src: '/images/contractor-audiences/operations-teams-1280.jpg',
    srcSet: '/images/contractor-audiences/operations-teams-640.jpg 640w, /images/contractor-audiences/operations-teams-1280.jpg 1280w',
  },
  {
    label: 'Architecture firms',
    body: 'Organize client direction, technical requirements, design decisions, and review points across the project.',
    to: '/general-contractors',
    src: '/images/contractor-audiences/operations-teams-1280.jpg',
    srcSet: '/images/contractor-audiences/operations-teams-640.jpg 640w, /images/contractor-audiences/operations-teams-1280.jpg 1280w',
  },
  {
    label: 'Engineering consultancies',
    body: 'Keep project communication, calculations, assumptions, deliverables, and approvals traceable.',
    to: '/general-contractors',
    src: '/images/contractor-audiences/project-managers-1280.jpg',
    srcSet: '/images/contractor-audiences/project-managers-640.jpg 640w, /images/contractor-audiences/project-managers-1280.jpg 1280w',
  },
  {
    label: 'Design studios',
    body: 'Bring briefs, selections, revisions, client feedback, and final handoffs into one clear project story.',
    to: '/general-contractors',
    src: '/images/clara/living-room-site-update.jpg',
    srcSet: '/images/clara/living-room-site-update.jpg 1280w',
  },
] as const;

function ContractorHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;
    const interval = window.setInterval(() => setActiveSlide((current) => (current + 1) % contractorHeroSlides.length), 4600);
    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="mt-8 w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocusCapture={() => setIsPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false); }}>
      <div className="flex h-[23rem] gap-2 overflow-hidden rounded-[2rem] border border-slate-950/10 bg-white/70 p-2 shadow-[0_24px_70px_rgba(15,23,42,.10)] sm:h-[30rem] sm:gap-3 sm:p-3">
        {contractorHeroSlides.map((slide, index) => {
          const isActive = activeSlide === index;
          return (
            <motion.button
              key={slide.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveSlide(index)}
              onMouseEnter={() => setActiveSlide(index)}
              onFocus={() => setActiveSlide(index)}
              className="group relative min-w-0 overflow-hidden rounded-[1.45rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24724f]"
              animate={{ flexGrow: isActive ? 4 : 1 }}
              transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={slide.src} srcSet={slide.srcSet} sizes={isActive ? '(max-width: 640px) 76vw, 58rem' : '(max-width: 640px) 12vw, 18rem'} alt="" decoding="async" className={`absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-500 ${isActive ? 'scale-100 brightness-[.72]' : 'scale-105 brightness-[.42]'}`} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className={`absolute inset-x-0 bottom-0 p-4 text-white transition-opacity sm:p-6 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                <span className="font-mono text-[9px] uppercase tracking-[.16em] text-[#b8d3b8]">0{index + 1}</span>
                <h3 className={`${isActive ? 'mt-2 text-2xl sm:text-4xl' : 'mt-3 text-sm [writing-mode:vertical-rl] sm:text-base'} font-semibold tracking-[-.035em]`}>{slide.label}</h3>
                {isActive ? <p className="mt-3 max-w-lg text-sm leading-6 text-white/68 sm:text-base sm:leading-7">{slide.body}</p> : null}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">We help trade businesses, design-build firms, and consulting companies.</p>
        <Link to="/general-contractors" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">Explore contractor solutions <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}

export default function HomeTestOnePage() {
  const [heroMode, setHeroMode] = useState<HeroMode>('consulting');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const activeHero = heroModes[heroMode];

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#visitor-fit') setIsQuizOpen(true);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  useEffect(() => {
    const applyNavigationColorway = (event: Event) => {
      const colorway = (event as CustomEvent<'jasonai' | 'clara' | null>).detail;
      setHeroMode(colorway ?? 'consulting');
    };
    window.addEventListener('b2w:product-colorway', applyNavigationColorway);
    return () => window.removeEventListener('b2w:product-colorway', applyNavigationColorway);
  }, []);

  return (
    <>
      <Seo />
      <motion.main
        className="relative min-h-screen overflow-hidden text-[#111827]"
        animate={{ background: activeHero.background }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          aria-hidden="true"
          className="fixed left-1/2 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{ backgroundColor: activeHero.glow, scale: heroMode === 'consulting' ? 1 : 1.08 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        />

        <LiveSiteHeader followPageTheme />

        <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-44 sm:px-8 sm:pb-32 sm:pt-56 lg:px-10">
          <motion.h1 initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className={`b2w-wordmark mx-auto max-w-[11ch] text-center text-[clamp(4.25rem,10vw,10rem)] font-medium leading-[0.82] tracking-[-0.08em] ${activeHero.textClass}`}>
            We help contractors move projects <em className="italic">forward.</em>
          </motion.h1>

          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
            <button id="visitor-fit" type="button" onClick={() => setIsQuizOpen(true)} className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-950 bg-slate-950 px-5 py-3 text-base font-semibold text-white shadow-[0_18px_48px_rgba(15,23,42,0.14)] transition-colors hover:bg-[#24724f]">
              Find a Solution
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
            </button>
            <Link to="/pricing#roi-calculator" className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-950/16 bg-white/95 px-5 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.10)] transition-colors hover:bg-white">
              Calculate ROI
              <Calculator className="h-4 w-4" />
            </Link>
          </div>

          <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: .45 }} className={`mx-auto mt-32 text-center text-[clamp(2rem,4vw,4rem)] font-medium leading-[1.02] tracking-[-0.055em] ${activeHero.textClass}`}>
            some of the businesses we help.
          </motion.h2>
          <ContractorHeroCarousel />

          <div className="mt-32 flex flex-col items-center text-center">
            <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: .45 }} className={`b2w-wordmark whitespace-nowrap text-[clamp(1.2rem,4.6vw,4.75rem)] font-medium leading-[0.9] tracking-[-0.075em] ${activeHero.textClass}`}>
              take your work to the next stage.
            </motion.h2>
            <div id="products" className="mt-10 grid w-full scroll-mt-28 gap-6 lg:grid-cols-2">
              <ProductFrame mode="jasonai" setActiveMode={setHeroMode} />
              <ProductFrame mode="clara" setActiveMode={setHeroMode} />
            </div>
          </div>
        </section>

        <PreviewFooter />
        {isQuizOpen ? (
          <Suspense fallback={<div className="fixed inset-0 z-[100] bg-[#0d120f]/72 backdrop-blur-xl" aria-hidden="true" />}>
            <VisitorFitQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
          </Suspense>
        ) : null}
      </motion.main>
    </>
  );
}
