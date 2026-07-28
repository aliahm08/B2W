import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MessageCircle,
  TrendingUp,
  Users,
} from 'lucide-react';

type BusinessType = 'contractor' | 'firm';

type Scenario = {
  type: BusinessType;
  businesses: number;
  teamMembers: number;
  weeklyBusinessHours: number;
  hourlyCost: number;
  annualGrowth: number;
};

type BusinessProfile = {
  employees: number;
  activeProjects: number;
  averageProjectWeeks: number;
};

type PricingCalculatorProps = {
  onBookReview: () => void;
};

const defaults: Record<BusinessType, Scenario> = {
  contractor: {
    type: 'contractor',
    businesses: 1,
    teamMembers: 4,
    weeklyBusinessHours: 45,
    hourlyCost: 65,
    annualGrowth: 5,
  },
  firm: {
    type: 'firm',
    businesses: 5,
    teamMembers: 20,
    weeklyBusinessHours: 45,
    hourlyCost: 85,
    annualGrowth: 7,
  },
};

const profileDefaults: Record<BusinessType, BusinessProfile> = {
  contractor: {
    employees: 12,
    activeProjects: 6,
    averageProjectWeeks: 16,
  },
  firm: {
    employees: 50,
    activeProjects: 20,
    averageProjectWeeks: 20,
  },
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildScenarioFromProfile(type: BusinessType, profile: BusinessProfile): Scenario {
  const businesses = type === 'firm' ? clamp(Math.round(profile.activeProjects / 4), 2, 12) : 1;
  const coordinationShare = type === 'firm' ? 0.25 : 0.35;
  const projectLoad = profile.activeProjects / Math.max(1, profile.employees);

  return {
    ...defaults[type],
    businesses,
    teamMembers: clamp(
      Math.round(profile.employees * coordinationShare + Math.min(4, profile.activeProjects / 10)),
      1,
      100,
    ),
    weeklyBusinessHours: clamp(
      Math.round((38 + Math.min(20, projectLoad * 30)) / 5) * 5,
      35,
      60,
    ),
    annualGrowth: clamp(
      Math.round(4 + Math.min(8, projectLoad * 5 + 26 / profile.averageProjectWeeks)),
      0,
      20,
    ),
  };
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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % whatsAppScenarios.length);
    }, 6200);

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
      <div className="relative mb-7 mr-5 grid" aria-live="off">
        {whatsAppScenarios.map((scenario, index) => {
          const stackPosition = (index - activeIndex + whatsAppScenarios.length) % whatsAppScenarios.length;
          const isActive = stackPosition === 0;
          const stackStyles = [
            { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            { x: 10, y: 10, scale: 0.985, rotate: 0.45, opacity: 0.88 },
            { x: 20, y: 20, scale: 0.97, rotate: 0.9, opacity: 0.72 },
          ][stackPosition];

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
                  : { type: 'spring', stiffness: 225, damping: 27, mass: 0.82 }
              }
              aria-hidden={!isActive}
              className="[grid-area:1/1]"
              style={{
                zIndex: 30 - stackPosition * 10,
                pointerEvents: isActive ? 'auto' : 'none',
                transformOrigin: '50% 100%',
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
  const [profile, setProfile] = useState<BusinessProfile>(profileDefaults.contractor);
  const [scenario, setScenario] = useState<Scenario>(() =>
    buildScenarioFromProfile('contractor', profileDefaults.contractor),
  );

  const model = useMemo(() => {
    const communicationShare = 0.15;
    const timeRecoveryRate = 0.3;
    const portfolioMultiplier =
      scenario.type === 'firm' ? 1 + Math.min(0.45, Math.max(0, scenario.businesses - 1) * 0.07) : 1;
    const standardMonthlyInvestment = 99;
    const preLaunchMonthlyInvestment = 25;
    const standardSetupInvestment = 2_000;
    const preLaunchSetupInvestment = 0;
    const firstYearTimeRecovered =
      scenario.teamMembers *
      scenario.weeklyBusinessHours *
      communicationShare *
      52 *
      scenario.hourlyCost *
      timeRecoveryRate *
      portfolioMultiplier;

    const years = Array.from({ length: 4 }, (_, index) => {
      const growthFactor = Math.pow(1 + scenario.annualGrowth / 100, index);
      const value = firstYearTimeRecovered * growthFactor;
      const standardInvestment =
        index === 0
          ? standardMonthlyInvestment * 12 + standardSetupInvestment
          : standardMonthlyInvestment * 12;
      const investment =
        index === 0
          ? preLaunchMonthlyInvestment * 12 + preLaunchSetupInvestment
          : standardMonthlyInvestment * 12;

      return {
        year: index + 1,
        value,
        standardInvestment,
        investment,
        net: value - investment,
      };
    });

    const totalValue = years.reduce((sum, year) => sum + year.value, 0);
    const totalStandardInvestment = years.reduce((sum, year) => sum + year.standardInvestment, 0);
    const totalInvestment = years.reduce((sum, year) => sum + year.investment, 0);
    const netReturn = totalValue - totalInvestment;
    const roi = totalInvestment > 0 ? netReturn / totalInvestment : 0;
    const paybackMonths =
      firstYearTimeRecovered > 0 ? years[0].investment / (firstYearTimeRecovered / 12) : 0;
    const standardFirstYearInvestment = standardMonthlyInvestment * 12 + standardSetupInvestment;
    const preLaunchFirstYearInvestment = years[0].investment;

    return {
      preLaunchFirstYearSavings: standardFirstYearInvestment - preLaunchFirstYearInvestment,
      years,
      totalValue,
      totalStandardInvestment,
      totalInvestment,
      netReturn,
      roi,
      paybackMonths,
    };
  }, [scenario]);

  const setType = (type: BusinessType) => {
    const nextProfile = profileDefaults[type];
    setProfile(nextProfile);
    setScenario(buildScenarioFromProfile(type, nextProfile));
  };

  const updateProfile = <Key extends keyof BusinessProfile>(key: Key, value: BusinessProfile[Key]) => {
    const nextProfile = { ...profile, [key]: value };
    setProfile(nextProfile);
    setScenario(buildScenarioFromProfile(scenario.type, nextProfile));
  };

  const chartMax = Math.max(...model.years.map((year) => Math.max(year.value, year.investment)));

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
            <p className="max-w-sm text-sm leading-7 text-[#6b6256]">
              Answer three operating questions. Your result updates immediately.
            </p>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)]">
            <div className="border border-[#d9d2c3] bg-white p-5 md:p-6">
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

            <div className="min-w-0">
              <div className="border border-[#141414] bg-[#141414] p-5 text-white md:p-7">
                <div className="flex flex-col gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#f1b37b]">
                      {scenario.type === 'firm' ? 'Contracting Firm' : 'General Contractor'} · Estimated four-year net
                      return
                    </p>
                    <p className="mt-3 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
                      {compactCurrency.format(model.netReturn)}
                    </p>
                    <p className="mt-2 text-sm text-white/60">
                      {currency.format(model.totalValue)} in modeled value less{' '}
                      <del className="mr-1 decoration-white/55">
                        {currency.format(model.totalStandardInvestment)}
                      </del>{' '}
                      <ins className="font-semibold text-white/85 no-underline">
                        {currency.format(model.totalInvestment)}
                      </ins>{' '}
                      in
                      pre-launch investment.
                    </p>
                  </div>
                  <div className="border border-white/15 bg-white/5 px-5 py-4">
                    <p className="text-xs font-semibold uppercase text-white/55">Four-year ROI</p>
                    <p className="mt-2 text-3xl font-semibold text-[#7ee2ad]">{percent.format(model.roi)}</p>
                  </div>
                </div>

                <div className="grid gap-3 pt-6 sm:grid-cols-3">
                  <div className="border border-white/15 p-4">
                    <TrendingUp className="h-5 w-5 text-[#7ee2ad]" />
                    <p className="mt-3 text-2xl font-semibold">
                      {(model.totalValue / model.totalInvestment).toFixed(1)}×
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/55">Value for every dollar invested</p>
                  </div>
                  <div className="border border-white/15 p-4">
                    <Clock3 className="h-5 w-5 text-[#f1b37b]" />
                    <p className="mt-3 text-2xl font-semibold">
                      {model.paybackMonths < 1 ? '<1' : Math.ceil(model.paybackMonths)} mo.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/55">Modeled payback period</p>
                  </div>
                  <div className="border border-white/15 p-4">
                    <BriefcaseBusiness className="h-5 w-5 text-[#9bc5d8]" />
                    <p className="mt-3 text-2xl font-semibold">4 yr.</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">Projection window</p>
                  </div>
                </div>
              </div>

              <div className="border-x border-b border-[#d9d2c3] bg-white p-5 md:p-7">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Year-by-year view</p>
                    <h3 className="mt-2 text-2xl font-semibold">Value created versus investment</h3>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold text-[#6b6256]">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-[#1f5f7a]" /> Value
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-[#d8b07b]" /> Investment
                    </span>
                  </div>
                </div>

                <div className="mt-7 space-y-5" aria-label="Four-year value and investment chart">
                  {model.years.map((year) => (
                    <div key={year.year} className="grid gap-2 sm:grid-cols-[4rem_1fr_6rem] sm:items-center">
                      <p className="text-sm font-semibold">Year {year.year}</p>
                      <div className="space-y-1.5">
                        <div
                          className="h-3 bg-[#1f5f7a]"
                          style={{ width: `${Math.max(3, (year.value / chartMax) * 100)}%` }}
                          title={`Value: ${currency.format(year.value)}`}
                        />
                        <div
                          className="h-3 bg-[#d8b07b]"
                          style={{ width: `${Math.max(3, (year.investment / chartMax) * 100)}%` }}
                          title={
                            year.standardInvestment > year.investment
                              ? `Investment: ${currency.format(year.standardInvestment)} reduced to ${currency.format(year.investment)}`
                              : `Investment: ${currency.format(year.investment)}`
                          }
                        />
                        {year.standardInvestment > year.investment ? (
                          <p className="pt-1 text-[0.7rem] font-medium text-[#6b6256]">
                            Year 1 investment:{' '}
                            <del className="decoration-[#9b3d1e]">
                              {currency.format(year.standardInvestment)}
                            </del>{' '}
                            <ins className="font-semibold text-[#141414] no-underline">
                              {currency.format(year.investment)}
                            </ins>
                          </p>
                        ) : null}
                      </div>
                      <p className="text-right text-sm font-semibold text-[#1f5f7a]">
                        {year.net >= 0 ? '+' : ''}
                        {compactCurrency.format(year.net)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 overflow-x-auto border border-[#d9d2c3]">
                  <table className="w-full min-w-[34rem] border-collapse text-sm">
                    <thead className="bg-[#f8f3e8] text-left text-xs uppercase text-[#6b6256]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Period</th>
                        <th className="px-4 py-3 text-right font-semibold">Modeled value</th>
                        <th className="px-4 py-3 text-right font-semibold">Investment</th>
                        <th className="px-4 py-3 text-right font-semibold">Net return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.years.map((year) => (
                        <tr key={year.year} className="border-t border-[#d9d2c3]">
                          <th className="px-4 py-3 text-left font-semibold">Year {year.year}</th>
                          <td className="px-4 py-3 text-right">{currency.format(year.value)}</td>
                          <td className="px-4 py-3 text-right">
                            {year.standardInvestment > year.investment ? (
                              <>
                                <del className="mr-2 text-[#8a8176] decoration-[#9b3d1e]">
                                  {currency.format(year.standardInvestment)}
                                </del>
                                <ins className="font-semibold no-underline">{currency.format(year.investment)}</ins>
                              </>
                            ) : (
                              currency.format(year.investment)
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{currency.format(year.net)}</td>
                        </tr>
                      ))}
                    </tbody>
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
    </>
  );
}
