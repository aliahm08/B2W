import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Send,
  Users,
  X,
} from 'lucide-react';
import {
  buildJasonAiScenario,
  calculateJasonAiRoi,
  jasonAiProfileDefaults,
  type JasonAiBusinessProfile as BusinessProfile,
  type JasonAiBusinessType as BusinessType,
  type JasonAiScenario as Scenario,
} from '../lib/jasonAiRoi';

type PricingCalculatorProps = {
  onBookReview: () => void;
};

type RoiReportContact = {
  firstName: string;
  lastName: string;
  businessEmail: string;
  companyName: string;
  companyLocation: string;
  marketingOptIn: boolean;
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ProfileControl({
  id,
  label,
  help,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  const update = (nextValue: number) => {
    if (Number.isFinite(nextValue)) {
      onChange(clamp(nextValue, min, max));
    }
  };

  return (
    <div className="border-t border-[#d9d2c3] py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-semibold text-[#141414]">
            {label}
          </label>
          <p id={`${id}-help`} className="mt-1 text-xs leading-5 text-[#6b6256]">
            {help}
          </p>
        </div>
        <div className="flex min-w-24 items-center border border-[#bfb6a8] bg-white px-3 focus-within:border-[#141414]">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-describedby={`${id}-help`}
            onChange={(event) => update(Number(event.target.value))}
            className="min-h-11 w-full min-w-0 bg-transparent text-right text-sm font-semibold text-[#141414] outline-none"
          />
          {suffix ? <span className="ml-1 shrink-0 text-xs font-semibold text-[#6b6256]">{suffix}</span> : null}
        </div>
      </div>
    </div>
  );
}

const whatsAppScenarios = [
  {
    label: 'Personal chat',
    capability: 'Private summary',
  },
  {
    label: 'Project group',
    capability: 'Communication search',
  },
  {
    label: 'Daily brief',
    capability: 'Group summary',
  },
] as const;

function AnimatedChatMessage({
  active,
  delay,
  reduceMotion,
  className,
  children,
}: {
  active: boolean;
  delay: number;
  reduceMotion: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      data-chat-message="true"
      data-chat-active={active ? 'true' : 'false'}
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.985 }}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.985 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: active ? 0.38 : 0.12,
              delay: active ? delay : 0,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WhatsAppScenarioCard({
  index,
  isActive,
  shouldReduceMotion,
}: {
  index: number;
  isActive: boolean;
  shouldReduceMotion: boolean;
}) {
  const scenario = whatsAppScenarios[index];

  return (
    <div className="flex h-full min-h-[27rem] flex-col border border-[#141414] bg-[#141414] p-5 text-white md:p-7">
      {index === 0 ? (
        <>
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a8d65]">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">JasonAI</p>
                <p className="text-xs text-white/55">personal chat · available in WhatsApp</p>
              </div>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-[#7ee2ad]" aria-label="Online" />
          </div>
          <div className="mt-6 flex flex-1 flex-col justify-center space-y-3">
            <AnimatedChatMessage
              active={isActive}
              delay={0.12}
              reduceMotion={shouldReduceMotion}
              className="ml-auto max-w-[86%] rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-[#245d4b] px-4 py-3 text-sm leading-6"
            >
              Summarize the Maple Street job from this week.
            </AnimatedChatMessage>
            <AnimatedChatMessage
              active={isActive}
              delay={0.52}
              reduceMotion={shouldReduceMotion}
              className="max-w-[94%] rounded-br-xl rounded-tl-xl rounded-tr-xl bg-white px-4 py-3 text-sm leading-6 text-[#2f2a24]"
            >
              I found 14 approved messages and two call notes. The homeowner asked about a laundry sink, the permit
              question is still being discussed, and the crew confirmed Thursday’s arrival window.
            </AnimatedChatMessage>
          </div>
        </>
      ) : null}

      {index === 1 ? (
        <>
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b5d35]">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Oakridge Project Group</p>
                <p className="text-xs text-white/55">5 participants · JasonAI active</p>
              </div>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-[#7ee2ad]" aria-label="Online" />
          </div>
          <div className="mt-5 flex flex-1 flex-col justify-center space-y-3">
            <AnimatedChatMessage
              active={isActive}
              delay={0.12}
              reduceMotion={shouldReduceMotion}
              className="max-w-[88%] rounded-br-xl rounded-tl-xl rounded-tr-xl bg-white/12 px-4 py-3 text-sm leading-6"
            >
              <p className="mb-1 text-[0.68rem] font-semibold uppercase text-[#f1b37b]">Maya · PM</p>
              Did we ever confirm the window delivery time? The owner is on-site.
            </AnimatedChatMessage>
            <AnimatedChatMessage
              active={isActive}
              delay={0.52}
              reduceMotion={shouldReduceMotion}
              className="ml-auto max-w-[94%] rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-[#245d4b] px-4 py-3 text-sm leading-6"
            >
              <p className="mb-1 text-[0.68rem] font-semibold uppercase text-[#b9efd5]">Owner</p>
              I’m on-site now. I checked our approved group history—Marco confirmed Thursday, 8–10 AM.
              <span className="mt-2 block font-semibold text-[#dff8ea]">–JasonAI</span>
            </AnimatedChatMessage>
          </div>
        </>
      ) : null}

      {index === 2 ? (
        <>
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8b5d35]">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Oakridge Project Group</p>
                <p className="text-xs text-white/55">daily brief · 5:30 PM</p>
              </div>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-[#7ee2ad]" aria-label="Online" />
          </div>
          <div className="mt-5 flex flex-1 flex-col justify-center space-y-3">
            <AnimatedChatMessage
              active={isActive}
              delay={0.12}
              reduceMotion={shouldReduceMotion}
              className="max-w-[80%] rounded-br-xl rounded-tl-xl rounded-tr-xl bg-white/12 px-4 py-3 text-sm leading-6"
            >
              <p className="mb-1 text-[0.68rem] font-semibold uppercase text-[#f1b37b]">Luis · Field</p>
              Demo photos are in. Walls are open and the crew is wrapping up.
            </AnimatedChatMessage>
            <AnimatedChatMessage
              active={isActive}
              delay={0.52}
              reduceMotion={shouldReduceMotion}
              className="ml-auto max-w-[96%] rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-[#245d4b] px-4 py-3 text-sm leading-6"
            >
              <p className="mb-2 text-[0.68rem] font-semibold uppercase text-[#b9efd5]">Owner · Daily brief</p>
              <ul className="space-y-1.5">
                <li>• Demo photos were posted at 4:42 PM.</li>
                <li>• The homeowner’s laundry-sink question was discussed.</li>
                <li>• Window delivery remains Thursday, 8–10 AM.</li>
              </ul>
              <span className="mt-2 block font-semibold text-[#dff8ea]">–JasonAI</span>
            </AnimatedChatMessage>
          </div>
        </>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
        <p className="text-xs leading-5 text-white/55">
          <span className="font-semibold text-white/78">{scenario.capability}</span> · Current capability
        </p>
        <p className="text-xs font-semibold tabular-nums text-white/42">
          {index + 1} / {whatsAppScenarios.length}
        </p>
      </div>
    </div>
  );
}

function JasonAIWhatsAppCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const updateMobileState = () => setIsMobile(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener('change', updateMobileState);

    return () => mediaQuery.removeEventListener('change', updateMobileState);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % whatsAppScenarios.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  const showScenario = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + whatsAppScenarios.length) % whatsAppScenarios.length);
    setIsPaused(true);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % whatsAppScenarios.length);
    setIsPaused(true);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="JasonAI WhatsApp examples"
      className="min-w-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="relative mb-7 mr-3 grid sm:mr-5" aria-live="off">
        {whatsAppScenarios.map((scenario, index) => {
          const stackPosition = (index - activeIndex + whatsAppScenarios.length) % whatsAppScenarios.length;
          const isActive = stackPosition === 0;
          const stackStyles = (isMobile
            ? [
                { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
                { x: 6, y: 8, scale: 0.99, rotate: 0.25, opacity: 0.86 },
                { x: 12, y: 16, scale: 0.98, rotate: 0.5, opacity: 0.68 },
              ]
            : [
                { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
                { x: 10, y: 10, scale: 0.985, rotate: 0.45, opacity: 0.88 },
                { x: 20, y: 20, scale: 0.97, rotate: 0.9, opacity: 0.72 },
              ])[stackPosition];

          return (
            <motion.div
              key={scenario.label}
              initial={false}
              animate={
                shouldReduceMotion
                  ? { x: stackStyles.x, y: stackStyles.y, opacity: stackStyles.opacity }
                  : stackStyles
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.12 }
                  : isMobile
                    ? { type: 'spring', stiffness: 250, damping: 30, mass: 0.68 }
                    : { type: 'spring', stiffness: 225, damping: 27, mass: 0.82 }
              }
              aria-hidden={!isActive}
              className="[grid-area:1/1]"
              style={{
                zIndex: 30 - stackPosition * 10,
                pointerEvents: isActive ? 'auto' : 'none',
                transformOrigin: '50% 100%',
                willChange: 'transform, opacity',
              }}
            >
              <WhatsAppScenarioCard
                index={index}
                isActive={isActive}
                shouldReduceMotion={Boolean(shouldReduceMotion)}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Show previous WhatsApp example"
          className="grid h-10 w-10 shrink-0 place-items-center border border-[#141414] bg-white text-[#141414] transition-colors hover:bg-[#f8f3e8]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 justify-center gap-2" role="group" aria-label="Choose a WhatsApp example">
          {whatsAppScenarios.map((scenario, index) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => showScenario(index)}
              aria-pressed={activeIndex === index}
              aria-label={`Show ${scenario.label}`}
              className={`h-2.5 transition-[width,background-color] ${
                activeIndex === index ? 'w-10 bg-[#1f5f7a]' : 'w-5 bg-[#cfc6b7] hover:bg-[#8a8176]'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={showNext}
          aria-label="Show next WhatsApp example"
          className="grid h-10 w-10 shrink-0 place-items-center border border-[#141414] bg-white text-[#141414] transition-colors hover:bg-[#f8f3e8]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-[#6b6256]">
        {isPaused ? 'Manual view' : 'Examples rotate automatically'}
      </p>
    </div>
  );
}

export default function JasonAIPricingCalculator({ onBookReview }: PricingCalculatorProps) {
  const [profile, setProfile] = useState<BusinessProfile>(jasonAiProfileDefaults.contractor);
  const [scenario, setScenario] = useState<Scenario>(() =>
    buildJasonAiScenario('contractor', jasonAiProfileDefaults.contractor),
  );
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [reportContact, setReportContact] = useState<RoiReportContact>({
    firstName: '',
    lastName: '',
    businessEmail: '',
    companyName: '',
    companyLocation: '',
    marketingOptIn: false,
  });
  const [shareStatus, setShareStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [shareMessage, setShareMessage] = useState('');

  const model = useMemo(() => calculateJasonAiRoi(scenario), [scenario]);

  useEffect(() => {
    if (!isShareOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && shareStatus !== 'sending') {
        setIsShareOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isShareOpen, shareStatus]);

  const setType = (type: BusinessType) => {
    const nextProfile = jasonAiProfileDefaults[type];
    setProfile(nextProfile);
    setScenario(buildJasonAiScenario(type, nextProfile));
  };

  const updateProfile = <Key extends keyof BusinessProfile>(key: Key, value: BusinessProfile[Key]) => {
    const nextProfile = { ...profile, [key]: value };
    setProfile(nextProfile);
    setScenario(buildJasonAiScenario(scenario.type, nextProfile));
  };

  const openShareDialog = () => {
    setShareStatus('idle');
    setShareMessage('');
    setIsShareOpen(true);
  };

  const closeShareDialog = () => {
    if (shareStatus !== 'sending') {
      setIsShareOpen(false);
    }
  };

  const updateReportContact = <Key extends keyof RoiReportContact>(key: Key, value: RoiReportContact[Key]) => {
    setReportContact((current) => ({ ...current, [key]: value }));
    if (shareStatus !== 'idle') {
      setShareStatus('idle');
      setShareMessage('');
    }
  };

  const sendRoiReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShareStatus('sending');
    setShareMessage('');

    try {
      const response = await fetch('/api/jasonai-roi-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportContact,
          businessType: scenario.type,
          employees: profile.employees,
          activeProjects: profile.activeProjects,
          averageProjectWeeks: profile.averageProjectWeeks,
          websiteUrl: '',
          sourcePage: document.title,
          sourcePath: window.location.pathname,
          sourceUrl: window.location.href,
          referrer: document.referrer,
          submittedAt: new Date().toISOString(),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Unable to email this report right now.');
      }

      setShareStatus('success');
      setShareMessage(`Report sent to ${reportContact.businessEmail} from info@b2w-ai.com.`);
    } catch (error) {
      setShareStatus('error');
      setShareMessage(error instanceof Error ? error.message : 'Unable to email this report right now.');
    }
  };

  return (
    <>
      <section className="border-b border-[#d9d2c3] bg-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 md:py-24 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.68fr)] lg:items-center">
          <div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-[#141414] md:text-7xl">
              Put a number on the work that slips through the chat.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#4f463c] md:text-xl md:leading-9">
              Estimate the four-year return of an AI Assistant that works with your team on WhatsApp—searching
              approved communication, finding job context, and turning long threads into usable summaries.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#4f463c]">
              {['No new dashboard', 'Choose your business type', 'Four-year view'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#1f5f7a]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <JasonAIWhatsAppCarousel />
        </div>
      </section>

      <section className="border-b border-[#d9d2c3] bg-[#f8f3e8]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#9b3d1e]">
                <Calculator className="h-4 w-4" />
                General Contractor AI ROI Calculator
              </div>
              <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                Calculate your four-year ROI.
              </h2>
            </div>
            <div className="flex max-w-sm flex-wrap gap-3 md:self-end">
              <button
                type="button"
                onClick={openShareDialog}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#141414] bg-white px-4 py-2.5 text-sm font-semibold text-[#141414] transition-colors hover:bg-[#fffaf0]"
              >
                <Mail className="h-4 w-4" />
                Email this ROI report
              </button>
              <button
                type="button"
                onClick={onBookReview}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f5f7a]"
              >
                Book review
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)] xl:items-stretch">
            <div className="border border-[#d9d2c3] bg-white p-5 md:p-6 xl:h-full">
              <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Your business</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">Tell us what you are running.</h3>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1" role="radiogroup" aria-label="Business type">
                <button
                  type="button"
                  onClick={() => setType('contractor')}
                  role="radio"
                  aria-checked={scenario.type === 'contractor'}
                  className={`border p-4 text-left transition-[border-color,box-shadow] hover:border-[#141414] ${
                    scenario.type === 'contractor'
                      ? 'border-[#141414] bg-[#fffaf0] shadow-[5px_5px_0_#141414]'
                      : 'border-[#d9d2c3] bg-[#fffaf0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-[#1f5f7a]" />
                      <span className="font-semibold">General Contractor</span>
                    </span>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#141414] bg-white">
                      {scenario.type === 'contractor' ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#9b3d1e]" />
                      ) : null}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6b6256]">One operating business.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setType('firm')}
                  role="radio"
                  aria-checked={scenario.type === 'firm'}
                  className={`border p-4 text-left transition-[border-color,box-shadow] hover:border-[#141414] ${
                    scenario.type === 'firm'
                      ? 'border-[#141414] bg-[#f4efe4] shadow-[5px_5px_0_#1f5f7a]'
                      : 'border-[#d9d2c3] bg-[#f4efe4]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <BriefcaseBusiness className="h-5 w-5 text-[#9b3d1e]" />
                      <span className="font-semibold">Contracting Firm</span>
                    </span>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#141414] bg-white">
                      {scenario.type === 'firm' ? <span className="h-2.5 w-2.5 rounded-full bg-[#1f5f7a]" /> : null}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#6b6256]">A unified view across businesses.</p>
                </button>
              </div>

              <div className="mt-7 border-t border-[#d9d2c3] pt-1">
                <ProfileControl
                  id="employee-count"
                  label="How many employees?"
                  help={scenario.type === 'firm' ? 'Across the businesses in this operating model.' : 'Across the business today.'}
                  value={profile.employees}
                  min={1}
                  max={500}
                  onChange={(value) => updateProfile('employees', value)}
                />
                <ProfileControl
                  id="active-project-count"
                  label="How many active projects?"
                  help="Projects currently requiring team coordination."
                  value={profile.activeProjects}
                  min={1}
                  max={250}
                  onChange={(value) => updateProfile('activeProjects', value)}
                />
                <ProfileControl
                  id="average-project-weeks"
                  label="Average time to complete a project?"
                  help="Typical duration from start through closeout."
                  value={profile.averageProjectWeeks}
                  min={1}
                  max={104}
                  suffix="weeks"
                  onChange={(value) => updateProfile('averageProjectWeeks', value)}
                />
              </div>
            </div>

            <div className="min-w-0 xl:flex xl:h-full xl:flex-col">
              <div className="border border-[#141414] bg-[#141414] p-6 text-white md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#f1b37b]">
                  Estimated four-year ROI
                </p>
                <p className="mt-3 text-6xl font-semibold tracking-[-0.05em] text-[#7ee2ad] md:text-7xl">
                  {percent.format(model.roi)}
                </p>
              </div>

              <div className="border-x border-b border-[#d9d2c3] bg-white p-5 md:p-7 xl:flex-1">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Year-by-year estimate</p>
                  <h3 className="mt-2 text-2xl font-semibold">Value, investment, and net return</h3>
                </div>

                <div className="mt-6 border border-[#d9d2c3]">
                  <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
                    <thead className="bg-[#f8f3e8] text-left text-[0.6rem] uppercase text-[#6b6256] sm:text-xs">
                      <tr>
                        <th className="w-[24%] px-2 py-3 font-semibold sm:px-4">Period</th>
                        <th className="w-[25%] px-2 py-3 text-right font-semibold sm:px-4">Modeled value</th>
                        <th className="w-[27%] px-2 py-3 text-right font-semibold sm:px-4">Investment</th>
                        <th className="w-[24%] px-2 py-3 text-right font-semibold sm:px-4">Net return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.years.map((year) => (
                        <tr key={year.year} className="border-t border-[#d9d2c3]">
                          <th className="px-2 py-3 text-left font-semibold sm:px-4">Year {year.year}</th>
                          <td className="px-2 py-3 text-right sm:px-4">{currency.format(year.value)}</td>
                          <td className="px-2 py-3 text-right sm:px-4">
                            {year.standardInvestment > year.investment ? (
                              <span className="inline-flex flex-col items-end sm:block">
                                <del className="text-[#8a8176] decoration-[#9b3d1e] sm:mr-2">
                                  {currency.format(year.standardInvestment)}
                                </del>
                                <ins className="font-semibold no-underline">{currency.format(year.investment)}</ins>
                              </span>
                            ) : (
                              currency.format(year.investment)
                            )}
                          </td>
                          <td className="px-2 py-3 text-right font-semibold sm:px-4">{currency.format(year.net)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#141414] bg-[#f8f3e8]">
                        <th className="px-2 py-4 text-left font-semibold sm:px-4">Estimated 4-year return</th>
                        <td className="px-2 py-4 text-right font-semibold sm:px-4">{currency.format(model.totalValue)}</td>
                        <td className="px-2 py-4 text-right sm:px-4">
                          <span className="inline-flex flex-col items-end sm:block">
                            <del className="text-[#8a8176] decoration-[#9b3d1e] sm:mr-2">
                              {currency.format(model.totalStandardInvestment)}
                            </del>
                            <ins className="font-semibold no-underline">{currency.format(model.totalInvestment)}</ins>
                          </span>
                        </td>
                        <td className="px-2 py-4 text-right text-sm font-semibold text-[#1f5f7a] sm:px-4 sm:text-base">
                          {currency.format(model.netReturn)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d9d2c3] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Pricing model</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
              Simple standard pricing. A stronger pre-launch offer.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#4f463c]">
              Standard JasonAI access is $99 per month with a one-time $2,000 setup fee. Pre-launch subscribers get the
              first year for $25 per month and pay no setup fee.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col border border-[#d9d2c3] bg-[#fffaf0] p-6">
              <Building2 className="h-7 w-7 text-[#1f5f7a]" />
              <p className="mt-5 text-xs font-semibold uppercase text-[#9b3d1e]">Standard pricing</p>
              <p className="mt-2 text-3xl font-semibold">$99 <span className="text-base font-medium text-[#6b6256]">/ month</span></p>
              <p className="mt-1 text-sm text-[#6b6256]">plus a one-time $2,000 setup fee</p>
              <div className="mt-6 space-y-3 border-t border-[#d9d2c3] pt-5 text-sm leading-6 text-[#4f463c]">
                <p className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#1f5f7a]" /> WhatsApp-based assistant access</p>
                <p className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#1f5f7a]" /> Search across approved communication</p>
                <p className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#1f5f7a]" /> Job and communication summaries</p>
              </div>
            </div>
            <div className="flex flex-col border border-[#141414] bg-[#141414] p-6 text-white">
              <BriefcaseBusiness className="h-7 w-7 text-[#f1b37b]" />
              <p className="mt-5 text-xs font-semibold uppercase text-[#f1b37b]">Pre-launch subscriber offer</p>
              <p className="mt-2 text-3xl font-semibold">
                <del className="mr-2 text-xl text-white/45 decoration-[#f1b37b]">$99</del>
                <ins className="no-underline">$25</ins>{' '}
                <span className="text-base font-medium text-white/55">/ month</span>
              </p>
              <p className="mt-1 text-sm text-white/55">
                for the first year · <del className="decoration-[#f1b37b]">$2,000 setup</del>{' '}
                <ins className="font-semibold text-white no-underline">$0 setup</ins>
              </p>
              <div className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm leading-6 text-white/72">
                <p className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#7ee2ad]" /> Save {currency.format(model.preLaunchFirstYearSavings)} in year one</p>
                <p className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#7ee2ad]" /> $0 setup fee during pre-launch</p>
                <p className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-[#7ee2ad]" /> Standard $99 monthly price begins in year two</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#141414] text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-5 py-16 text-center md:px-8 md:py-24">
          <p className="text-xs font-semibold uppercase text-[#f1b37b]">Make the model real</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Bring us your numbers. We will pressure-test them with you.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            In a free business review, we map where search and summaries can save time now, then show what is next
            without treating roadmap capabilities as current value.
          </p>
          <button
            type="button"
            onClick={onBookReview}
            className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 border border-white bg-white px-6 py-3 text-sm font-semibold text-[#141414] hover:bg-[#f8f3e8]"
          >
            Book my free business review
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {isShareOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#141414]/55 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeShareDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="roi-report-title"
            aria-describedby="roi-report-description"
            className="my-auto w-full max-w-2xl border border-[#141414] bg-white shadow-[10px_10px_0_#1f5f7a]"
          >
            <div className="flex items-start justify-between gap-6 border-b border-[#d9d2c3] bg-[#fffaf0] p-5 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Share your result</p>
                <h2 id="roi-report-title" className="mt-2 text-2xl font-semibold">
                  Email this ROI report.
                </h2>
              </div>
              <button
                type="button"
                onClick={closeShareDialog}
                disabled={shareStatus === 'sending'}
                aria-label="Close ROI report email form"
                className="grid h-10 w-10 shrink-0 place-items-center border border-[#141414] bg-white transition-colors hover:bg-[#f8f3e8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={sendRoiReport} className="p-5 md:p-6">
              <p id="roi-report-description" className="text-sm leading-6 text-[#6b6256]">
                We will send a dated JasonAI by B2W report with your inputs, {percent.format(model.roi)} ROI,
                {' '}{currency.format(model.netReturn)} estimated return, a four-year graph, and the full table.
              </p>

              <p className="mt-5 text-xs font-semibold uppercase text-[#6b6256]">Required fields are marked *</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-[#141414]">
                  First name *
                  <input
                    type="text"
                    autoComplete="given-name"
                    autoFocus
                    required
                    maxLength={80}
                    value={reportContact.firstName}
                    onChange={(event) => updateReportContact('firstName', event.target.value)}
                    className="mt-2 min-h-12 w-full border border-[#bfb6a8] bg-white px-4 text-base font-normal text-[#141414] outline-none focus:border-[#141414] focus:ring-2 focus:ring-[#1f5f7a]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#141414]">
                  Last name *
                  <input
                    type="text"
                    autoComplete="family-name"
                    required
                    maxLength={80}
                    value={reportContact.lastName}
                    onChange={(event) => updateReportContact('lastName', event.target.value)}
                    className="mt-2 min-h-12 w-full border border-[#bfb6a8] bg-white px-4 text-base font-normal text-[#141414] outline-none focus:border-[#141414] focus:ring-2 focus:ring-[#1f5f7a]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#141414]">
                  Business email address *
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={320}
                    value={reportContact.businessEmail}
                    onChange={(event) => updateReportContact('businessEmail', event.target.value)}
                    placeholder="you@company.com"
                    className="mt-2 min-h-12 w-full border border-[#bfb6a8] bg-white px-4 text-base font-normal text-[#141414] outline-none placeholder:text-[#8a8176] focus:border-[#141414] focus:ring-2 focus:ring-[#1f5f7a]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#141414]">
                  Company name *
                  <input
                    type="text"
                    autoComplete="organization"
                    required
                    maxLength={200}
                    value={reportContact.companyName}
                    onChange={(event) => updateReportContact('companyName', event.target.value)}
                    className="mt-2 min-h-12 w-full border border-[#bfb6a8] bg-white px-4 text-base font-normal text-[#141414] outline-none focus:border-[#141414] focus:ring-2 focus:ring-[#1f5f7a]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#141414] sm:col-span-2">
                  Company location
                  <input
                    type="text"
                    autoComplete="address-level2"
                    maxLength={200}
                    value={reportContact.companyLocation}
                    onChange={(event) => updateReportContact('companyLocation', event.target.value)}
                    placeholder="City, State / Province"
                    className="mt-2 min-h-12 w-full border border-[#bfb6a8] bg-white px-4 text-base font-normal text-[#141414] outline-none placeholder:text-[#8a8176] focus:border-[#141414] focus:ring-2 focus:ring-[#1f5f7a]/20"
                  />
                </label>
              </div>

              <div className="mt-5 border border-[#d9d2c3] bg-[#fffaf0] p-4">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#4f463c]">
                  <input
                    type="checkbox"
                    checked={reportContact.marketingOptIn}
                    onChange={(event) => updateReportContact('marketingOptIn', event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#1f5f7a]"
                  />
                  <span>
                    Yes, I would like to receive marketing communications regarding B2W products, services, and
                    events. I can unsubscribe at any time.
                  </span>
                </label>
                <p className="mt-3 text-xs leading-5 text-[#6b6256]">
                  For details about how we collect, use, and protect your information, please see our{' '}
                  <a
                    href="/jasonai/privacy"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#141414] underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <div
                aria-live="polite"
                className={`mt-4 min-h-6 text-sm leading-6 ${
                  shareStatus === 'error'
                    ? 'text-[#9b3d1e]'
                    : shareStatus === 'success'
                      ? 'font-semibold text-[#1f5f7a]'
                      : 'text-[#6b6256]'
                }`}
              >
                {shareMessage || 'The email is generated and sent securely from info@b2w-ai.com.'}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeShareDialog}
                  disabled={shareStatus === 'sending'}
                  className="min-h-11 border border-[#141414] bg-white px-5 py-2.5 text-sm font-semibold text-[#141414] transition-colors hover:bg-[#f8f3e8] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {shareStatus === 'success' ? 'Done' : 'Cancel'}
                </button>
                {shareStatus !== 'success' ? (
                  <button
                    type="submit"
                    disabled={shareStatus === 'sending'}
                    className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f5f7a] disabled:cursor-wait disabled:opacity-65"
                  >
                    <Send className="h-4 w-4" />
                    {shareStatus === 'sending' ? 'Sending report…' : 'Send ROI report'}
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
