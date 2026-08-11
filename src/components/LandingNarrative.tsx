import {
  Blocks,
  Bot,
  Calculator,
  ChartColumnBig,
  FileSpreadsheet,
  FileText,
  MessageSquareText,
  Mic,
  Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { projectPipelineContent } from '../content/projectPipeline';
import { scrollToHashTarget } from '../lib/hashNavigation';
import OfferBanner from './OfferBanner';

type LandingNarrativeProps = {
  basePath?: string;
  showOfferBanner?: boolean;
  onOfferClick?: () => void;
  onOfferClose?: () => void;
};

type NarrativeStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  note?: string;
};

const narrativeSteps: NarrativeStep[] = [
  {
    id: 'landing-hero',
    eyebrow: 'Voice Intake',
    title: 'Record the reality of the job in plain language.',
    description:
      'Clients speak naturally about the property, budget, scope, and constraints. B2W turns that voice input into structured operating context instead of forcing them through a brittle form.',
    accent: 'from-[#d9f2ef] via-[#f4f8f8] to-[#ffffff]',
  },
  {
    id: 'expertise',
    eyebrow: 'Voice To Plan',
    title: 'Turn the conversation into a usable plan through chat.',
    description:
      'The AI assistant clarifies scope, proposes options, surfaces tradeoffs, and organizes the next steps into a usable project plan the client can actually react to.',
    accent: 'from-[#edf5fd] via-[#f7fafc] to-[#ffffff]',
  },
  {
    id: 'estimation-engine',
    eyebrow: 'Estimation Engine',
    title: 'Run the plan through our proprietary financial model.',
    description:
      'B2W converts the plan into an estimation workflow that prices the work, frames the risk, and generates a polished one-page output. That model has already generated over $200M in commercial value.',
    accent: 'from-[#f6efe2] via-[#fbf8f1] to-[#ffffff]',
    note: '$200M+ commercial value generated',
  },
  {
    id: 'guarantee',
    eyebrow: 'B2W Guarantee',
    title: 'Deliver the package and operational support around it.',
    description:
      'The client receives the estimate, the single-page decision document, and an AI agent that can handle outreach, scheduling, and contractor coordination across tools like Slack, WhatsApp, Gmail, and Teams.',
    accent: 'from-[#eef3f5] via-[#f8fafb] to-[#ffffff]',
  },
];

function resolveAnchorTarget(basePath: string, fallbackTarget: string) {
  const hashIndex = fallbackTarget.indexOf('#');
  const hash = hashIndex >= 0 ? fallbackTarget.slice(hashIndex) : '';
  return hash ? `${basePath}${hash}` : fallbackTarget;
}

function NarrativeAnimation({ activeIndex }: { activeIndex: number }) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const motionEnabled = !shouldReduceMotion;

  const phoneX = activeIndex === 0 ? -46 : activeIndex === 1 ? -24 : activeIndex === 2 ? -6 : -42;
  const phoneScale = activeIndex === 0 ? 1 : activeIndex === 1 ? 0.98 : activeIndex === 2 ? 0.94 : 0.92;
  const docVisible = activeIndex >= 2;
  const planVisible = activeIndex >= 1;
  const guaranteeVisible = activeIndex >= 3;

  return (
    <div className="relative w-full max-w-[40rem] overflow-hidden rounded-[2.25rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,246,241,0.78))] p-6 shadow-[0_28px_90px_rgba(16,24,40,0.08)] backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(21,140,140,0.12),transparent_24%),radial-gradient(circle_at_78%_18%,rgba(109,149,196,0.12),transparent_22%),radial-gradient(circle_at_62%_76%,rgba(201,163,92,0.12),transparent_24%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.35),transparent_35%,rgba(255,255,255,0.4)_72%,transparent)]" />

      <div className="relative aspect-[1.02/1]">
        <motion.div
          className="absolute inset-y-[8%] left-[4%] w-[30%]"
          animate={
            motionEnabled
              ? {
                  opacity: activeIndex === 0 ? 1 : 0.28,
                  x: activeIndex === 0 ? 0 : -10,
                }
              : undefined
          }
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-full">
            {[0, 1, 2].map((wave) => (
              <motion.div
                key={wave}
                className="absolute left-0 top-1/2 h-[34%] -translate-y-1/2 rounded-r-full border border-[#158c8c]/45"
                style={{ width: `${36 + wave * 18}%` }}
                animate={
                  motionEnabled
                    ? {
                        scaleX: [0.92, 1.06, 0.92],
                        opacity: [0.18, 0.72, 0.18],
                      }
                    : undefined
                }
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: wave * 0.24 }}
              />
            ))}

            {[0, 1, 2, 3].map((bar) => (
              <motion.span
                key={bar}
                className="absolute bottom-[20%] rounded-full bg-[#158c8c]/80"
                style={{
                  left: `${24 + bar * 12}%`,
                  width: '0.42rem',
                  height: `${1.2 + (bar % 2) * 0.8}rem`,
                }}
                animate={motionEnabled ? { scaleY: [0.72, 1.18, 0.72], opacity: [0.32, 1, 0.32] } : undefined}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: bar * 0.12 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 z-20 h-[68%] w-[30%] -translate-y-1/2"
          animate={motionEnabled ? { x: `${phoneX}%`, scale: phoneScale } : undefined}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-full rounded-[2.2rem] border border-neutral-900/10 bg-[linear-gradient(180deg,rgba(27,33,41,0.98),rgba(57,64,74,0.98))] p-3 shadow-[0_24px_80px_rgba(18,27,39,0.18)]">
            <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/18" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#fbfcfd,#edf4f8)] p-4">
              <motion.div
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#e3f3ef] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#15736d]"
                animate={motionEnabled ? { opacity: [0.56, 1, 0.56] } : undefined}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Mic className="h-3 w-3" />
                Listening
              </motion.div>

              <div className="mt-4 space-y-2">
                <motion.div
                  className="h-2.5 rounded-full bg-[#d5e7eb]"
                  animate={motionEnabled ? { width: ['56%', '72%', '56%'] } : undefined}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="h-2.5 rounded-full bg-[#dce8ef]"
                  animate={motionEnabled ? { width: ['78%', '62%', '78%'] } : undefined}
                  transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 0.16 }}
                />
                <motion.div
                  className="h-2.5 rounded-full bg-[#d5e7eb]"
                  animate={motionEnabled ? { width: ['64%', '84%', '64%'] } : undefined}
                  transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.28 }}
                />
              </div>

              <motion.div
                className="mt-auto grid grid-cols-3 gap-2"
                animate={motionEnabled ? { opacity: activeIndex === 0 ? 1 : 0.68 } : undefined}
                transition={{ duration: 0.4 }}
              >
                {['Scope', 'Budget', 'Site'].map((label) => (
                  <div key={label} className="rounded-2xl bg-white/90 px-2 py-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute right-[6%] top-[12%] z-10 w-[30%] rounded-[1.8rem] border border-[#dce6ee] bg-white/88 p-4 shadow-[0_20px_50px_rgba(18,27,39,0.08)] backdrop-blur-md"
          animate={
            motionEnabled
              ? {
                  opacity: planVisible ? 1 : 0,
                  x: planVisible ? 0 : 20,
                  y: planVisible ? 0 : 12,
                }
              : undefined
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#5a7590]">
            <MessageSquareText className="h-3.5 w-3.5" />
            Plan Chat
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[#eef5fb] px-3 py-2 text-sm text-neutral-700">Clarify scope</div>
            <div className="rounded-2xl bg-[#f4f7fa] px-3 py-2 text-sm text-neutral-700">Compare options</div>
            <div className="rounded-2xl bg-[#eef5fb] px-3 py-2 text-sm text-neutral-700">Organize next steps</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute left-[36%] top-[58%] z-10 w-[28%] rounded-[1.8rem] border border-[#e9dcc4] bg-white/86 p-4 shadow-[0_20px_50px_rgba(18,27,39,0.08)] backdrop-blur-md"
          animate={
            motionEnabled
              ? {
                  opacity: activeIndex >= 2 ? 1 : 0,
                  y: activeIndex >= 2 ? 0 : 20,
                  scale: activeIndex >= 2 ? 1 : 0.96,
                }
              : undefined
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#8a6735]">
            <Calculator className="h-3.5 w-3.5" />
            Model
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1.4, 2.2, 1.8, 2.6, 1.3, 2].map((value, index) => (
              <motion.div
                key={index}
                className="rounded-xl bg-[#f7f0e4]"
                style={{ height: `${value}rem` }}
                animate={motionEnabled ? { scaleY: [0.86, 1.04, 0.86] } : undefined}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.09 }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#fff7e8] px-3 py-2 text-sm font-medium text-neutral-700">
            <span>Output</span>
            <span>$1.84M</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute right-[10%] top-[32%] z-20 w-[30%] rounded-[1.8rem] border border-[#dfe6eb] bg-white/94 p-5 shadow-[0_28px_90px_rgba(18,27,39,0.12)]"
          animate={
            motionEnabled
              ? {
                  opacity: docVisible ? 1 : 0,
                  x: docVisible ? 0 : 24,
                  y: docVisible ? 0 : 14,
                  rotate: docVisible ? 0 : 2,
                }
              : undefined
          }
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[#158c8c]" />
              Final Estimate
            </span>
            <span>1 Page</span>
          </div>
          <div className="mt-4 rounded-[1.35rem] bg-[#f5f8fa] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Project Value</p>
                <p className="mt-2 text-3xl font-medium tracking-tight text-neutral-950">$1.84M</p>
              </div>
              <div className="rounded-2xl bg-[#e5f3ef] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#15736d]">
                Approved
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-2 rounded-full bg-[#d8e4ea]" />
              <div className="h-2 w-[82%] rounded-full bg-[#d8e4ea]" />
              <div className="h-2 w-[68%] rounded-full bg-[#d8e4ea]" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white px-3 py-3 text-center">
                <ChartColumnBig className="mx-auto h-4 w-4 text-[#6d95c4]" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Margin</p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-3 text-center">
                <FileSpreadsheet className="mx-auto h-4 w-4 text-[#c9a35c]" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Model</p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-3 text-center">
                <Sparkles className="mx-auto h-4 w-4 text-[#158c8c]" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Summary</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-x-[8%] bottom-[6%] z-10"
          animate={
            motionEnabled
              ? {
                  opacity: guaranteeVisible ? 1 : 0,
                  y: guaranteeVisible ? 0 : 18,
                }
              : undefined
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Estimate', icon: FileText },
              { label: 'Scope', icon: Blocks },
              { label: 'Outreach Agent', icon: Bot },
              { label: 'Integrations', icon: Sparkles },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-white/82 px-4 py-3 shadow-[0_18px_40px_rgba(18,27,39,0.06)]">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                  <item.icon className="h-3.5 w-3.5 text-[#158c8c]" />
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {['Slack', 'WhatsApp', 'Gmail', 'Teams'].map((label) => (
              <motion.div
                key={label}
                className="rounded-full border border-[#dce7ea] bg-white/85 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-600"
                animate={motionEnabled ? { y: [0, -3, 0] } : undefined}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: label.length * 0.08 }}
              >
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SectionCard({ step, isHero = false }: { step: NarrativeStep; isHero?: boolean }) {
  return (
    <div className={`rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(250,249,245,0.82))] p-8 shadow-[0_22px_80px_rgba(16,24,40,0.08)] backdrop-blur-md md:p-10 ${isHero ? 'max-w-4xl' : 'max-w-2xl'}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">{step.eyebrow}</p>
      <h2 className={`${isHero ? 'mt-5 text-5xl md:text-7xl lg:text-[5.4rem]' : 'mt-4 text-4xl md:text-5xl'} font-medium leading-[0.94] tracking-tight text-neutral-950`}>
        {step.title}
      </h2>
      <p className={`${isHero ? 'mt-6 max-w-3xl text-xl md:text-2xl' : 'mt-5 text-lg'} leading-relaxed text-neutral-600`}>
        {step.description}
      </p>
      {step.note ? (
        <div className="mt-6 inline-flex rounded-full border border-[#e9dcc4] bg-[#fbf3e6] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#8a6735]">
          {step.note}
        </div>
      ) : null}
    </div>
  );
}

function SectionStackCard({
  step,
  index,
  activeStep,
  showOfferBanner,
  onOfferClick,
  onOfferClose,
  isHero,
  primaryCtaHref,
  contactHref,
  handleAnchorClick,
  shouldReduceMotion,
}: {
  step: NarrativeStep;
  index: number;
  activeStep: number;
  showOfferBanner: boolean;
  onOfferClick?: () => void;
  onOfferClose?: () => void;
  isHero: boolean;
  primaryCtaHref: string;
  contactHref: string;
  handleAnchorClick: (target: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
  shouldReduceMotion: boolean;
}) {
  const offset = activeStep - index;
  const isActive = offset === 0;
  const isPast = offset > 0;
  const isFuture = offset < 0;

  const animate = shouldReduceMotion
    ? undefined
    : {
        y: isActive ? 0 : isPast ? -18 - Math.min(offset, 2) * 8 : 28 + Math.min(Math.abs(offset), 2) * 18,
        x: isActive ? 0 : isPast ? -6 : 10,
        scale: isActive ? 1 : isPast ? 0.975 : 0.985,
        opacity: isActive ? 1 : isPast ? 0.42 : 0.24,
        filter: isActive ? 'blur(0px)' : isPast ? 'blur(5px)' : 'blur(2px)',
      };

  return (
    <motion.div
      className="absolute inset-0"
      animate={animate}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex: isActive ? 40 : 40 - index }}
    >
      <div className={`relative ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {isHero && showOfferBanner ? (
          <div className="mb-6">
            <OfferBanner variant="hero" onClick={onOfferClick} onClose={onOfferClose} />
          </div>
        ) : null}

        <SectionCard step={step} isHero={isHero} />

        {isHero ? (
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={primaryCtaHref}
              onClick={handleAnchorClick(primaryCtaHref)}
              className="inline-flex min-h-12 items-center border border-black bg-black px-5 py-3 text-lg font-medium text-white transition-colors hover:bg-neutral-800"
            >
              <span>Explore Services</span>
            </Link>
            <a
              href={contactHref}
              className="inline-flex min-h-12 items-center border-b border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:text-neutral-600"
            >
              <span>Get in Touch</span>
            </a>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function LandingNarrative({
  basePath = '/',
  showOfferBanner = true,
  onOfferClick,
  onOfferClose,
}: LandingNarrativeProps) {
  const { hero } = projectPipelineContent;
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  const primaryCtaTarget = hero.primaryCtaHref.replace('#capabilities', '#expertise');
  const primaryCtaHref = resolveAnchorTarget(basePath, primaryCtaTarget);
  const contactHref = 'mailto:info@b2w-ai.com';

  const stepList = useMemo(() => narrativeSteps, []);

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLElement[];
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (!visible[0]) {
          return;
        }

        const index = elements.findIndex((element) => element === visible[0].target);
        if (index >= 0) {
          setActiveStep(index);
        }
      },
      { rootMargin: '-28% 0px -28% 0px', threshold: [0.2, 0.4, 0.6] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [stepList.length]);

  const handleAnchorClick = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = target.indexOf('#');
    const hash = hashIndex >= 0 ? target.slice(hashIndex) : '';
    if (!hash) {
      return;
    }

    event.preventDefault();

    const performScroll = () => {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash);
      });
    };

    if (location.pathname === basePath) {
      if (location.hash !== hash) {
        navigate({ pathname: basePath, hash }, { replace: false });
      }
      performScroll();
      return;
    }

    navigate({ pathname: basePath, hash }, { replace: false });
    window.setTimeout(performScroll, 180);
  };

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8f6ef_34%,#ffffff_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(21,140,140,0.1),transparent_22%),radial-gradient(circle_at_84%_16%,rgba(109,149,196,0.1),transparent_20%),radial-gradient(circle_at_52%_76%,rgba(201,163,92,0.1),transparent_24%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="relative hidden py-20 lg:block lg:py-24">
            <div className="sticky top-24 flex h-[calc(100vh-6rem)] items-center">
              <div className="relative h-[42rem] w-full max-w-4xl">
                {stepList.map((step, index) => (
                  <SectionStackCard
                    key={step.id}
                    step={step}
                    index={index}
                    activeStep={activeStep}
                    showOfferBanner={showOfferBanner}
                    onOfferClick={onOfferClick}
                    onOfferClose={onOfferClose}
                    isHero={index === 0}
                    primaryCtaHref={primaryCtaHref}
                    contactHref={contactHref}
                    handleAnchorClick={handleAnchorClick}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </div>
            </div>

            <div className="pointer-events-none -mt-[calc(100vh-6rem)]">
              {stepList.map((step, index) => (
                <section
                  key={`spacer-${step.id}`}
                  id={step.id}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  className={`${index === 0 ? 'min-h-screen' : 'min-h-[92vh]'}`}
                />
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-24 flex h-[calc(100vh-6rem)] items-center justify-center">
              <motion.div
                animate={shouldReduceMotion ? undefined : { scale: activeStep === 0 ? 0.96 : 1, y: activeStep === 0 ? -6 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <NarrativeAnimation activeIndex={activeStep} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="space-y-12 pb-12 lg:hidden">
          {stepList.map((step, index) => {
            const isHero = index === 0;

            return (
              <section
                key={`mobile-${step.id}`}
                id={`${step.id}-mobile`}
                className={`${isHero ? 'pt-20' : 'pt-6'} space-y-6`}
              >
                {isHero && showOfferBanner ? (
                  <div>
                    <OfferBanner variant="hero" onClick={onOfferClick} onClose={onOfferClose} />
                  </div>
                ) : null}
                <SectionCard step={step} isHero={isHero} />
                {isHero ? (
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={primaryCtaHref}
                      onClick={handleAnchorClick(primaryCtaHref)}
                      className="inline-flex min-h-12 items-center border border-black bg-black px-5 py-3 text-lg font-medium text-white transition-colors hover:bg-neutral-800"
                    >
                      <span>Explore Services</span>
                    </Link>
                    <a
                      href={contactHref}
                      className="inline-flex min-h-12 items-center border-b border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:text-neutral-600"
                    >
                      <span>Get in Touch</span>
                    </a>
                  </div>
                ) : null}
                <NarrativeAnimation activeIndex={index} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
