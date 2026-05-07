import { useEffect, useState, type Key, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Mail,
  MessageCircle,
  SearchCheck,
  Smartphone,
  X,
} from 'lucide-react';
import { JasonAIVectorMark } from '../components/BrandVectorMarks';
import Seo from '../components/Seo';
import { getCalendlyUrl } from '../lib/engagement';

const steps = [
  {
    title: 'Conversations happen',
    body: 'Texts, emails, calls - same as always.',
  },
  {
    title: 'JasonAI understands',
    body: 'Captures details, context, and decisions automatically.',
  },
  {
    title: 'You get clarity',
    body: 'Every job, update, and issue - organized and visible.',
  },
] as const;

const integrations = [
  { name: 'WhatsApp', Icon: MessageCircle },
  { name: 'SMS', Icon: Smartphone },
  { name: 'Email', Icon: Mail },
  { name: 'Slack', Icon: MessageCircle },
] as const;

const faqItems = [
  {
    question: 'Is this another app?',
    answer:
      'No. JasonAI works inside the channels your team already uses, so there is no new app for the crew to check.',
  },
  {
    question: 'Will my crew need to learn something?',
    answer:
      'No training needed. They keep texting, emailing, and messaging the same way they do now.',
  },
  {
    question: 'What about Jobber / ServiceTitan / Buildertrend?',
    answer:
      'Keep them. JasonAI covers the conversation layer around the job, then keeps the important details organized.',
  },
  {
    question: 'What does setup look like?',
    answer:
      'We start with your existing workflow, choose the channels to connect, and keep the rollout small enough to prove value quickly.',
  },
] as const;

const scenarioMessages = [
  {
    mode: 'Project management',
    prompt: 'JasonAI, what is still open on Maple Ave?',
    teamReply: 'Need the open items before I call them back.',
    answer:
      'Open: permit status reply, laundry sink price, and Friday customer recap. PM owns permit. Owner approval needed on extra work.',
  },
  {
    mode: 'Risk tracking',
    prompt: 'Anything risky before this job closes?',
    teamReply: 'Check whether the added work has approval.',
    answer:
      'Risk flagged: homeowner asked for added rough-in on-site. No written approval found yet. Send change order before closeout.',
  },
  {
    mode: 'Documentation lookup',
    prompt: 'Pull what was agreed last Tuesday.',
    teamReply: 'I need the exact approval before I send the recap.',
    answer:
      'Found it: Tuesday 3:42 PM text thread. Customer approved added rough-in after price confirmation. I can draft the recap.',
  },
] as const;

const conversationStages = ['message', 'whatsapp', 'sources', 'answer'] as const;
type ConversationStage = (typeof conversationStages)[number];
type HowStep = 0 | 1 | 2;

const storyStageMap = {
  'story-message': 'message',
  'story-whatsapp': 'whatsapp',
  'story-sources': 'sources',
  'story-answer': 'answer',
} as const satisfies Record<string, ConversationStage>;

const sourceCards = [
  {
    label: 'Email',
    detail: 'Original scope and price thread',
    Icon: Mail,
    position: 'left-0 top-8 xl:-left-32',
  },
  {
    label: 'Chats',
    detail: 'Crew and customer messages',
    Icon: MessageCircle,
    position: 'right-0 top-24 xl:-right-32',
  },
  {
    label: 'Calls',
    detail: 'Call notes and commitments',
    Icon: Smartphone,
    position: 'left-0 bottom-24 xl:-left-32',
  },
  {
    label: 'Documents',
    detail: 'Contract, change orders, photos',
    Icon: FileText,
    position: 'right-0 bottom-8 xl:-right-32',
  },
] as const;

const exportAssets = [
  {
    title: 'Owner reply draft',
    body: 'A clear response that confirms the change, next step, and approval needed.',
    meta: 'Ready to send',
  },
  {
    title: 'Change order note',
    body: 'The scope change, timestamp, source thread, and pricing follow-up captured in one record.',
    meta: 'Record created',
  },
  {
    title: 'Job summary',
    body: 'Open items, decisions, blockers, and owner-facing status for Maple Ave.',
    meta: 'Shareable PDF',
  },
  {
    title: 'Business signal',
    body: 'Extra work risk, missed revenue, and repeat issue patterns saved for review.',
    meta: 'Owner insight',
  },
] as const;

const waitlistUrl = 'https://tally.so/embed/jaG0yY?alignLeft=1&hideTitle=1&dynamicHeight=1';
const workflowContextImage = '/images/jasonai-2/workflow-context.png';

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  key?: Key;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.92, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.28, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function JasonAILogo() {
  return (
    <Link to="/jasonai-2" className="group inline-flex items-center gap-3" aria-label="JasonAI by B2W">
      <span className="relative grid h-12 w-12 place-items-center overflow-visible text-[#111111] transition-transform duration-300 group-hover:scale-[1.04]">
        <JasonAIVectorMark title="" className="h-full w-full overflow-visible" strokeWidth={2.9} />
        <span className="sr-only">JasonAI</span>
      </span>
      <span className="leading-none">
        <span className="block text-lg font-semibold tracking-[-0.03em] text-[#111111]">JasonAI</span>
        <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B]">
          <span>by B2W</span>
          <span className="h-1 w-1 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
          <span>conversation clarity</span>
        </span>
      </span>
    </Link>
  );
}

function Button({
  children,
  variant = 'dark',
  onClick,
  href,
}: {
  children: ReactNode;
  variant?: 'dark' | 'light' | 'blue';
  onClick?: () => void;
  href?: string;
}) {
  const className =
    variant === 'dark'
      ? 'border-[#111111] bg-[#111111] text-white shadow-[0_14px_34px_rgba(17,17,17,0.18)] hover:bg-[#2a2a2a]'
      : variant === 'blue'
        ? 'border-[#4F6EF7] bg-[#4F6EF7] text-white shadow-[0_16px_38px_rgba(79,110,247,0.26)] hover:bg-[#425fd8]'
        : 'border-[#d9d9d9] bg-white/88 text-[#111111] shadow-[0_12px_30px_rgba(17,17,17,0.06)] hover:border-[#a8a8a8]';

  if (href) {
    return (
      <a
        href={href}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:scale-[1.02] ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] border px-4 py-2.5 text-sm font-semibold transition duration-200 hover:scale-[1.02] ${className}`}
    >
      {children}
    </button>
  );
}

function CalendlyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const calendlyUrl = getCalendlyUrl();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#111111]/35 px-4 py-6 backdrop-blur-sm">
      <div className="relative h-[min(760px,92vh)] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#d9d9d9] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.22)]">
        <div className="flex items-center justify-between border-b border-[#ededed] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#111111]">Book a JasonAI demo</p>
            <p className="text-xs text-[#6B6B6B]">Pick a time that works for you.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking modal"
            className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#e2e2e2] text-[#111111] transition hover:bg-[#f5f5f5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {calendlyUrl ? (
          <iframe
            src={calendlyUrl}
            title="Book a JasonAI demo"
            className="h-[calc(100%-58px)] w-full"
            loading="lazy"
          />
        ) : (
          <div className="grid h-[calc(100%-58px)] place-items-center px-6 text-center">
            <div className="max-w-md">
              <CalendarDays className="mx-auto h-8 w-8 text-[#4F6EF7]" />
              <p className="mt-4 text-lg font-semibold text-[#111111]">Booking is not configured yet.</p>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">
                Add `VITE_CALENDLY_URL` to enable the embedded demo calendar on this page.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalFrame({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#111111]/35 px-4 py-6 backdrop-blur-sm">
      <div className="relative h-[min(760px,92vh)] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#d9d9d9] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.22)]">
        <div className="flex items-center justify-between border-b border-[#ededed] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#111111]">{title}</p>
            <p className="text-xs text-[#6B6B6B]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#e2e2e2] text-[#111111] transition hover:bg-[#f5f5f5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function WaitlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title="Join the JasonAI waitlist"
      subtitle="Tell us where JasonAI should fit into your workflow."
    >
      <iframe
        src={waitlistUrl}
        data-tally-src={waitlistUrl}
        title="Join the JasonAI waitlist"
        className="h-[calc(100%-58px)] w-full"
        loading="lazy"
      />
    </ModalFrame>
  );
}

function ScenarioPicker({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mt-7 flex max-w-2xl flex-wrap gap-2">
      {scenarioMessages.map((scenario, index) => (
        <button
          key={scenario.mode}
          type="button"
          onClick={() => onSelect(index)}
          className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
            activeIndex === index
              ? 'border-[#4F6EF7] bg-[#4F6EF7] text-white shadow-[0_12px_28px_rgba(79,110,247,0.22)]'
              : 'border-[#d9d9d9] bg-white/78 text-[#6B6B6B] hover:border-[#4F6EF7] hover:text-[#111111]'
          }`}
        >
          {scenario.mode}
        </button>
      ))}
    </div>
  );
}

function ProjectOwnerLabel() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] shadow-[0_6px_16px_rgba(37,211,102,0.24)]">
        <MessageCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.4} />
      </span>
      <p className="text-[11px] font-semibold uppercase text-[#6B6B6B]">Project owner</p>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label="JasonAI is typing">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-2 w-2 rounded-full bg-[#4F6EF7]"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function JasonAIAvatar() {
  return (
    <span className="relative grid h-7 w-7 place-items-center overflow-visible text-[#111111]">
      <JasonAIVectorMark title="" className="h-full w-full overflow-visible" strokeWidth={2.5} />
      <span className="sr-only">JasonAI</span>
    </span>
  );
}

function ScrollConversationVisual({
  stage,
  scenario,
  howStep,
}: {
  stage: ConversationStage;
  scenario: (typeof scenarioMessages)[number];
  howStep: HowStep;
}) {
  const shouldShowPhone = stage !== 'message';
  const shouldShowTeamReply = stage === 'whatsapp' || stage === 'sources' || stage === 'answer';
  const shouldShowJasonTyping = stage === 'whatsapp' && howStep === 1;
  const shouldShowJasonResponse = (stage === 'whatsapp' && howStep === 2) || stage === 'sources' || stage === 'answer';
  const shouldShowSources = stage === 'sources' || stage === 'answer';
  const shouldShowAnswer = stage === 'answer';
  const stageLabel = {
    message: 'Inbound message',
    whatsapp: 'Shared thread',
    sources: 'Context build',
    answer: 'Owner answer',
  }[stage];

  return (
    <motion.div
      className="relative mx-auto min-h-[580px] w-full max-w-[500px]"
      animate={stage === 'sources' ? { x: -390, y: 86 } : { x: 0, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#dedede] bg-white/84 px-3 py-2 text-xs font-semibold text-[#111111] shadow-[0_14px_36px_rgba(17,17,17,0.08)] backdrop-blur ${
          stage === 'message' ? 'top-[27%]' : 'top-0'
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-[#4F6EF7] shadow-[0_0_0_5px_rgba(79,110,247,0.12)]" aria-hidden="true" />
        {stageLabel}
      </div>

      {shouldShowSources ? (
        <div className="pointer-events-none absolute inset-0 z-[70] hidden lg:block">
          {sourceCards.map(({ label, detail, Icon, position }, index) => (
            <motion.div
              key={label}
              className={`absolute w-44 rounded-2xl border border-[#d9defd] bg-white/94 p-3 shadow-[0_18px_54px_rgba(79,110,247,0.12)] backdrop-blur ${position}`}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#eef2ff]">
                  <Icon className="h-4 w-4 text-[#4F6EF7]" />
                </span>
                <p className="text-xs font-semibold uppercase text-[#6B6B6B]">{label}</p>
              </div>
              <p className="mt-2 text-sm font-medium leading-5 text-[#111111]">{detail}</p>
            </motion.div>
          ))}
        </div>
      ) : null}

      <motion.div
        layout
        className="absolute inset-x-4 top-[36%] z-10 mx-auto max-w-[360px]"
        animate={shouldShowPhone ? { opacity: 0, y: -38, scale: 0.88 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-3xl border border-[#dcdcdc] bg-white/92 p-4 shadow-[0_22px_70px_rgba(17,17,17,0.1)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <ProjectOwnerLabel />
            <span className="rounded-full bg-[#f1f3ff] px-2 py-1 text-[11px] font-semibold text-[#4F6EF7]">new</span>
          </div>
          <p className="mt-2 text-xl font-medium leading-8 text-[#111111]">
            {scenario.prompt}
          </p>
        </div>
      </motion.div>

      <motion.div
        layout
        className="relative z-[60] mx-auto aspect-[9/19.5] w-full max-w-[340px] rounded-[2.55rem] border border-[#cfcfcf] bg-[#111111] p-2 shadow-[0_30px_86px_rgba(17,17,17,0.18)]"
        initial={false}
        animate={shouldShowPhone ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.92 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-full overflow-hidden rounded-[2rem] bg-[#f9f9f9] p-4">
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#d5d5d5]" />
          <div className="flex items-center justify-between rounded-2xl border border-[#e6e6e6] bg-white/82 px-3 py-3 shadow-[0_10px_26px_rgba(17,17,17,0.04)]">
            <div>
              <p className="text-sm font-semibold text-[#111111]">WhatsApp</p>
              <p className="mt-0.5 text-xs text-[#6B6B6B]">Maple Ave job group</p>
            </div>
            <span className="rounded-full bg-[#e8edff] px-2 py-1 text-xs font-semibold text-[#4F6EF7]">
              Connected
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-[#e8e8e8] bg-white p-3 text-sm leading-6 text-[#111111] shadow-sm">
              <ProjectOwnerLabel />
              <p className="mt-1">{scenario.prompt}</p>
            </div>

            {shouldShowTeamReply ? (
              <>
                <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-[#4F6EF7] p-3 text-sm leading-6 text-white shadow-[0_14px_30px_rgba(79,110,247,0.22)]">
                  <p className="text-[11px] font-semibold uppercase text-white/70">Maya</p>
                  <p className="mt-1">{scenario.teamReply}</p>
                </div>
              </>
            ) : null}

            {shouldShowJasonTyping ? (
              <motion.div
                className="max-w-[74%] rounded-2xl rounded-tl-md border border-[#d9defd] bg-white p-3 text-sm leading-6 text-[#111111] shadow-[0_14px_34px_rgba(17,17,17,0.06)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2">
                  <JasonAIAvatar />
                  <p className="text-[11px] font-semibold uppercase text-[#6B6B6B]">JasonAI</p>
                </div>
                <div className="mt-3">
                  <TypingDots />
                </div>
              </motion.div>
            ) : null}

            {shouldShowJasonResponse ? (
              <>
                <motion.div
                  className="max-w-[92%] rounded-2xl rounded-tl-md border border-[#d9defd] bg-white p-3 text-sm leading-6 text-[#111111] shadow-[0_14px_34px_rgba(17,17,17,0.06)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-2">
                    <JasonAIAvatar />
                    <p className="text-[11px] font-semibold uppercase text-[#6B6B6B]">JasonAI</p>
                  </div>
                  <p className="mt-2">{scenario.answer}</p>
                </motion.div>
              </>
            ) : null}
          </div>

          {shouldShowSources ? (
            <motion.div
              className="mt-5 grid grid-cols-2 gap-2 lg:hidden"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {sourceCards.map(({ label, Icon }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl border border-[#dfdfdf] bg-white px-3 py-2">
                  <Icon className="h-4 w-4 text-[#4F6EF7]" />
                  <span className="text-xs font-semibold text-[#111111]">{label}</span>
                </div>
              ))}
            </motion.div>
          ) : null}

          {shouldShowAnswer ? (
            <motion.div
              className="mt-5 rounded-2xl border border-[#dfdfdf] bg-white p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2">
                <SearchCheck className="h-4 w-4 text-[#4F6EF7]" />
                <p className="text-xs font-semibold uppercase text-[#6B6B6B]">Owner answer</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#111111]">
                {scenario.answer}
              </p>
              <div className="mt-4 grid gap-2">
                {['Decision captured', 'Follow-up assigned', 'Record updated'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-[#111111]">
                    <Check className="h-4 w-4 text-[#4F6EF7]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ContextMediaBand() {
  const shouldReduceMotion = useReducedMotion();
  const chips = [
    { label: 'Email thread', className: 'left-5 top-5 md:left-8 md:top-8' },
    { label: 'Call note', className: 'right-5 top-10 md:right-10 md:top-14' },
    { label: 'Job document', className: 'bottom-6 left-6 md:bottom-10 md:left-10' },
    { label: 'Owner answer', className: 'bottom-5 right-5 md:bottom-8 md:right-8' },
  ] as const;

  return (
    <section className="border-b border-[#e5e5e5] bg-[#f8f8f8]">
      <div className="mx-auto grid max-w-[1160px] gap-10 px-5 py-20 md:py-24 lg:grid-cols-[0.58fr_1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#d9defd] bg-white/72 px-3 py-1.5 text-sm font-semibold text-[#4F6EF7] shadow-[0_12px_30px_rgba(79,110,247,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
            Workflow context
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            It feels like the job finally has memory.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#6B6B6B]">
            The visual layer stays grounded in real work: the phone, the job folder, the plan set, and the quick message
            that started it all.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white p-2 shadow-[0_28px_90px_rgba(17,17,17,0.12)]">
          <img
            src={workflowContextImage}
            alt="Phone, job folder, and documents on a field-service work surface."
            loading="eager"
            className="aspect-[16/9] w-full rounded-[24px] object-cover"
          />
          <div className="absolute inset-2 rounded-[24px] bg-[linear-gradient(90deg,rgba(17,17,17,0.36),transparent_42%,rgba(79,110,247,0.12))]" />
          {!shouldReduceMotion ? (
            <motion.div
              aria-hidden="true"
              className="absolute bottom-2 top-2 w-24 rounded-[24px] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)]"
              animate={{ x: ['-7rem', '48rem'] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : null}
          <div className="absolute inset-0">
            {chips.map((chip, index) => (
              <motion.div
                key={chip.label}
                className={`absolute rounded-2xl border border-white/28 bg-white/82 px-3 py-2 text-xs font-semibold text-[#111111] shadow-[0_16px_42px_rgba(17,17,17,0.14)] backdrop-blur-md ${chip.className}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 3.2, repeat: shouldReduceMotion ? 0 : Infinity, delay: index * 0.22 }}
              >
                {chip.label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalPhonePreview({ scenario }: { scenario: (typeof scenarioMessages)[number] }) {
  return (
    <div className="mx-auto aspect-[9/19.5] w-full max-w-[330px] rounded-[2.5rem] border border-[#111111] bg-[#111111] p-2 shadow-[0_30px_90px_rgba(17,17,17,0.2)]">
      <div className="h-full overflow-hidden rounded-[1.95rem] bg-[#f9f9f9] p-4">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#d5d5d5]" />
        <div className="rounded-2xl border border-[#e6e6e6] bg-white/86 px-3 py-3">
          <p className="text-sm font-semibold text-[#111111]">JasonAI</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">{scenario.mode}</p>
        </div>
        <div className="mt-4 rounded-2xl rounded-tl-md border border-[#e8e8e8] bg-white p-3 text-sm leading-6 text-[#111111]">
          <ProjectOwnerLabel />
          <p className="mt-1">{scenario.prompt}</p>
        </div>
        <div className="mt-3 rounded-2xl rounded-tl-md border border-[#d9defd] bg-white p-3 text-sm leading-6 text-[#111111] shadow-[0_14px_34px_rgba(17,17,17,0.06)]">
          <div className="flex items-center gap-2">
            <JasonAIAvatar />
            <p className="text-[11px] font-semibold uppercase text-[#6B6B6B]">JasonAI</p>
          </div>
          <p className="mt-2">{scenario.answer}</p>
        </div>
        <div className="mt-4 grid gap-2">
          {['Reply drafted', 'Document exported', 'Record saved'].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl border border-[#e6e6e6] bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
              <Check className="h-4 w-4 text-[#4F6EF7]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnerOutputSection({ scenario }: { scenario: (typeof scenarioMessages)[number] }) {
  return (
    <section id="story-answer" className="scroll-mt-24 border-b border-[#e5e5e5] bg-[#f8f8f8]">
      <div className="mx-auto grid max-w-[1160px] gap-10 px-5 py-20 md:py-24 lg:grid-cols-[0.52fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#d9defd] bg-white/72 px-3 py-1.5 text-sm font-semibold text-[#4F6EF7] shadow-[0_12px_30px_rgba(79,110,247,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
            What you get
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            The owner gets a usable answer, plus the assets behind it.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#6B6B6B]">
            The phone moves out of the way. JasonAI turns the answer into owner-ready documents, reply drafts, job
            records, and business signals.
          </p>
          <div className="mt-8">
            <FinalPhonePreview scenario={scenario} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {exportAssets.map((asset, index) => (
            <Reveal
              key={asset.title}
              delay={index * 0.05}
              className="rounded-[24px] border border-[#e1e1e1] bg-white p-5 shadow-[0_18px_54px_rgba(17,17,17,0.06)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-semibold text-[#4F6EF7]">
                  {asset.meta}
                </span>
                <FileText className="h-5 w-5 text-[#4F6EF7]" />
              </div>
              <h3 className="mt-7 text-xl font-semibold text-[#111111]">{asset.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6B6B6B]">{asset.body}</p>
              <div className="mt-5 rounded-2xl border border-[#eeeeee] bg-[#f7f7f7] p-3">
                <div className="h-2 w-3/4 rounded-full bg-[#dedede]" />
                <div className="mt-2 h-2 w-11/12 rounded-full bg-[#e7e7e7]" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-[#e7e7e7]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JasonAI2Page() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [conversationStage, setConversationStage] = useState<ConversationStage>('message');
  const [activeHowStep, setActiveHowStep] = useState<HowStep>(0);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeScenario = scenarioMessages[activeScenarioIndex];

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 360);

    update();
    window.addEventListener('scroll', update, { passive: true });

    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveScenarioIndex((current) => (current + 1) % scenarioMessages.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (conversationStage !== 'whatsapp') {
      setActiveHowStep(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveHowStep((current) => ((current + 1) % steps.length) as HowStep);
    }, 1900);

    return () => window.clearInterval(interval);
  }, [conversationStage]);

  useEffect(() => {
    const sections = Object.keys(storyStageMap)
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const updateStage = () => {
      const viewportAnchor = window.innerHeight * 0.42;
      const activeSection =
        sections
          .map((section) => ({
            section,
            distance: Math.abs(section.getBoundingClientRect().top - viewportAnchor),
          }))
          .sort((a, b) => a.distance - b.distance)[0]?.section ?? sections[0];

      setConversationStage(storyStageMap[activeSection.id as keyof typeof storyStageMap]);
    };

    updateStage();
    window.addEventListener('scroll', updateStage, { passive: true });
    window.addEventListener('resize', updateStage);

    return () => {
      window.removeEventListener('scroll', updateStage);
      window.removeEventListener('resize', updateStage);
    };
  }, []);

  return (
    <>
      <Seo
        title="JasonAI Style 2 by B2W"
        description="A calm second test style for JasonAI, the B2W product that turns business conversations into organized job clarity."
        canonicalPath="/jasonai-2"
      />
      <div className="min-h-screen overflow-x-clip bg-[#F5F5F5] text-[#111111]">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-80"
          style={{
            background:
              'linear-gradient(120deg, rgba(255,255,255,0.82) 0%, rgba(245,245,245,0) 34%, rgba(79,110,247,0.055) 68%, rgba(255,255,255,0.72) 100%)',
          }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-[0.24]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(17,17,17,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.055) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
          animate={shouldReduceMotion ? undefined : { backgroundPosition: ['0px 0px', '72px 72px'] }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        />

        <header className="sticky top-0 z-40 px-3 pt-3">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between rounded-[22px] border border-white/70 bg-white/72 px-4 py-3 shadow-[0_18px_70px_rgba(17,17,17,0.09)] backdrop-blur-xl md:px-5">
            <JasonAILogo />
            <nav className="hidden items-center gap-1 rounded-2xl border border-[#e7e7e7] bg-[#f8f8f8]/82 p-1 text-sm font-semibold text-[#6B6B6B] lg:flex">
              <a href="#story-whatsapp" className="rounded-xl px-3 py-2 transition hover:bg-white hover:text-[#111111]">
                Flow
              </a>
              <a href="#story-sources" className="rounded-xl px-3 py-2 transition hover:bg-white hover:text-[#111111]">
                Sources
              </a>
              <a href="#story-answer" className="rounded-xl px-3 py-2 transition hover:bg-white hover:text-[#111111]">
                Answer
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsBookingOpen(true)}>
                Book a demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <section className="border-b border-[#e5e5e5]">
            <div className="mx-auto grid max-w-[1160px] gap-12 px-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.76fr)]">
              <div className="pb-12 lg:pb-24">
                <section id="story-message" className="min-h-[calc(100vh-74px)] scroll-mt-24 pt-16 md:pt-24">
                  <Reveal>
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#d9defd] bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#4F6EF7] shadow-[0_12px_30px_rgba(79,110,247,0.08)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7]" aria-hidden="true" />
                      JasonAI
                    </p>
                    <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] text-[#111111] md:text-7xl">
                      Your business runs on conversations. Now they count.
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B6B6B] md:text-xl md:leading-9">
                      JasonAI starts with the same message your team already gets - then turns the context around it into
                      a clear answer.
                    </p>
                    <ScenarioPicker activeIndex={activeScenarioIndex} onSelect={setActiveScenarioIndex} />
                  </Reveal>
                  <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row" delay={0.08}>
                    <Button onClick={() => setIsBookingOpen(true)}>
                      Book a demo
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                    <Button href="#story-whatsapp" variant="light">
                      See how it works
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Reveal>
                  <Reveal className="mt-6 text-sm font-medium text-[#6B6B6B]" delay={0.14}>
                    No new app. No training. No behavior change.
                  </Reveal>
                </section>

                <section id="story-whatsapp" className="min-h-screen scroll-mt-24 py-20">
                  <div className="max-w-2xl rounded-[28px] border border-white/70 bg-white/46 p-6 shadow-[0_18px_70px_rgba(17,17,17,0.05)] backdrop-blur md:p-7">
                    <p className="text-sm font-semibold text-[#4F6EF7]">How it works</p>
                    <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                      The message becomes the workspace.
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-[#6B6B6B]">
                      The same conversation sits inside a familiar WhatsApp-style thread. JasonAI joins quietly and
                      starts watching for the details that usually disappear.
                    </p>
                  </div>
                  <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {steps.map((step, index) => (
                      <Reveal
                        key={step.title}
                        delay={index * 0.05}
                        className={`rounded-2xl border p-6 shadow-[0_12px_40px_rgba(17,17,17,0.04)] transition duration-300 ${
                          conversationStage === 'whatsapp' && activeHowStep === index
                            ? 'border-[#bac6ff] bg-white shadow-[0_18px_54px_rgba(79,110,247,0.14)]'
                            : 'border-[#e1e1e1] bg-white/84'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#4F6EF7]">0{index + 1}</p>
                        <h3 className="mt-8 text-xl font-semibold text-[#111111]">{step.title}</h3>
                        <p className="mt-3 text-base leading-7 text-[#6B6B6B]">{step.body}</p>
                      </Reveal>
                    ))}
                  </div>
                </section>

                <section id="story-sources" className="relative z-0 min-h-screen scroll-mt-24 py-20 lg:pt-24">
                  <div className="relative z-0 mx-auto max-w-3xl text-center opacity-95">
                    <p className="text-sm font-semibold text-[#4F6EF7]">Where it lives</p>
                    <h2 className="mt-6 text-4xl font-semibold leading-tight md:text-[4.35rem]">
                      The answer pulls from the margins.
                    </h2>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-[#6B6B6B]">
                      Email, chats, calls, and documents stay where they are. JasonAI uses them to understand what the
                      owner is really asking and what the team needs to do next.
                    </p>
                  </div>
                  <div className="relative z-0 mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                    {integrations.map(({ name, Icon }) => (
                      <div
                        key={name}
                        className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-[#e1e1e1] bg-white px-4 shadow-[0_10px_30px_rgba(17,17,17,0.035)]"
                      >
                        <Icon className="h-4 w-4 text-[#4F6EF7]" />
                        <span className="text-sm font-semibold text-[#111111]">{name}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              <div className="order-first pt-10 lg:order-none lg:pt-0">
                <div className="sticky top-28 py-8">
                  <ScrollConversationVisual
                    stage={conversationStage}
                    scenario={activeScenario}
                    howStep={activeHowStep}
                  />
                </div>
              </div>
            </div>
          </section>

          <OwnerOutputSection scenario={activeScenario} />

          <ContextMediaBand />

          <section className="border-b border-[#e5e5e5]">
            <div className="mx-auto max-w-[900px] px-5 py-18 text-center md:py-24">
              <p className="text-sm font-semibold text-[#4F6EF7]">Proof</p>
              <blockquote className="mt-5 text-3xl font-semibold leading-tight text-[#111111] md:text-5xl">
                "Used by teams managing crews, jobs, and clients daily."
              </blockquote>
              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#6B6B6B]">
                JasonAI is built for businesses where the real work happens across quick calls, texts, emails, and field
                updates.
              </p>
            </div>
          </section>

          <section className="border-b border-[#e5e5e5] bg-[#fbfbfb]">
            <div className="mx-auto max-w-[920px] px-5 py-20 md:py-24">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-[#4F6EF7]">FAQ</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">The first objections.</h2>
              </div>
              <div className="mt-10 divide-y divide-[#e5e5e5] rounded-2xl border border-[#e1e1e1] bg-white">
                {faqItems.map((item) => (
                  <details key={item.question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left text-base font-semibold text-[#111111] md:px-6">
                      {item.question}
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#6B6B6B] transition group-open:rotate-180" />
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-7 text-[#6B6B6B] md:px-6">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[#111111] text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
                backgroundSize: '68px 68px',
              }}
            />
            <div className="relative mx-auto grid max-w-[1160px] gap-8 px-5 py-20 md:py-24 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm font-semibold text-[#91a3ff]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#91a3ff]" aria-hidden="true" />
                  JasonAI by B2W
                </p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">
                  See it with your own workflow.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
                  Bring the messages, jobs, and handoffs your team already uses. We will show where JasonAI fits without
                  asking anyone to change how they work.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button onClick={() => setIsBookingOpen(true)} variant="blue">
                  Book a demo
                  <CalendarDays className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsWaitlistOpen(true)} variant="light">
                  Join the waitlist
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </main>

        {hasScrolled ? (
          <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#d9d9d9] bg-white/92 p-2 shadow-[0_18px_60px_rgba(17,17,17,0.12)] backdrop-blur-md">
              <span className="hidden px-2 text-sm font-medium text-[#6B6B6B] sm:inline">Want to test it early?</span>
              <Button onClick={() => setIsWaitlistOpen(true)} variant="blue">
                Join the waitlist
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}

        <CalendlyModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      </div>
    </>
  );
}
