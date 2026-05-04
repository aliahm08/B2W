import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Cloud, Mail, MessageSquareText, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { getSourceMetadata, submitInternalForm } from '../lib/engagement';

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

type ReviewFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  trade: string;
  teamSize: string;
  currentTools: string;
  challenge: string;
  websiteUrl: string;
};

const initialReviewFormState: ReviewFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  trade: '',
  teamSize: '',
  currentTools: '',
  challenge: '',
  websiteUrl: '',
};

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const problemStatements = [
  {
    text: 'You got off a call. Something was agreed to. Nobody wrote it down. Now the customer says it never happened.',
    image: '/images/jasonai/call-agreement.jpg',
    alt: 'Contractor owner in a truck cab after a job call with a blank notebook nearby.',
  },
  {
    text: 'Your tech handled a "while you are here" request. Nobody billed it.',
    image: '/images/jasonai/unbilled-extra.jpg',
    alt: 'Field technician in a residential utility space handling an extra customer request.',
  },
  {
    text: 'Your PM is on WhatsApp. Your tech texts. The customer emails. Nothing connects.',
    image: '/images/jasonai/scattered-communication.jpg',
    alt: 'Operations manager looking across several devices and a job folder on a contractor office desk.',
  },
  {
    text: 'You have tried tools before. Your crew never used them. You still have the subscription.',
    image: '/images/jasonai/unused-tools.jpg',
    alt: 'Contractor office with an unused tablet beside paper work orders.',
  },
  {
    text: 'You spent Sunday night rereading six weeks of messages to figure out what happened on one job.',
    image: '/images/jasonai/sunday-night.jpg',
    alt: 'Contractor owner working late at a kitchen table with phone, laptop, and job papers.',
  },
  {
    text: 'A job closed. You know you left money on the table. You just do not know exactly how much.',
    image: '/images/jasonai/money-left.jpg',
    alt: 'Contractor owner reviewing final job paperwork in a completed residential job space.',
  },
] as const;

const howItWorks = [
  {
    title: 'We learn your business.',
    body:
      'We spend time understanding how your team communicates, how jobs move through your operation, and where things tend to fall through. No assumptions.',
  },
  {
    title: 'We set up JasonAI around your process.',
    body:
      'Not a generic template. Built around how your specific business operates - your tools, your workflow, your team.',
  },
  {
    title: 'Your team keeps working the same way.',
    body:
      'JasonAI runs in the background and is available whenever anyone needs it. Everyone gets help that is relevant to their role. You get visibility across all of it.',
  },
] as const;

const useCases = [
  {
    title: 'Scope change protection',
    body:
      'A homeowner asks for additional work while your tech is on-site. JasonAI flags it as an undocumented scope change so you can issue a change order before the job closes.',
  },
  {
    title: 'Dispute defense',
    body:
      'A customer claims you never mentioned an extra cost. JasonAI pulls the message thread where they approved it - timestamped and organized.',
  },
  {
    title: 'Missed follow-up',
    body:
      'Your PM promised to call back about permit status. JasonAI flags it before it becomes a problem.',
  },
  {
    title: 'Weekly job clarity',
    body:
      'Every Friday, you get a clean summary of every active job - what happened, what was agreed, what is open, what still needs action. Five minutes. No logins.',
  },
  {
    title: 'Field support',
    body:
      'Your tech needs to know what was agreed on a job last week. JasonAI pulls it up instantly in the tool they are already using.',
  },
] as const;

const testimonials = [
  {
    quote:
      'I have tried three different apps. Nobody used them. This actually works the way my team already works.',
    source: 'Plumbing owner, 12 techs',
  },
  {
    quote:
      'We lost $14,000 last year on extras we did not document. This is the first thing I have seen that would actually catch it.',
    source: 'Remodeling GC',
  },
  {
    quote: 'My guys will never use a dashboard. I stopped asking. This is different.',
    source: 'HVAC operator',
  },
] as const;

const objections = [
  {
    question: 'Is this just another app my team has to use?',
    answer:
      'No. JasonAI does not have an app for your team to open. It works inside the tools they already use - text, email, WhatsApp. They keep communicating exactly how they communicate now. JasonAI keeps track of what happens.',
  },
  {
    question: 'Will my crew have to learn anything?',
    answer:
      'Nothing. Your crew keeps texting, emailing, and making calls. Nobody downloads anything, logs into anything, or changes anything.',
  },
  {
    question: 'I already use Jobber, ServiceTitan, or Buildertrend.',
    answer:
      'JasonAI does not replace those. They handle scheduling, invoicing, and job management. What they do not capture is the unstructured communication - the texts, the WhatsApp messages, the calls - where scope changes, missed follow-ups, and undocumented extras actually happen. JasonAI covers that gap.',
  },
  {
    question: 'I do not want AI reading my job communications.',
    answer:
      'We understand. You control which channels JasonAI connects to. Your data is only used to generate your summaries and alerts - never shared, never sold. During the founding beta, you work directly with our team, so you always know exactly what is being reviewed and how.',
  },
  {
    question: 'We have a PM who handles this.',
    answer:
      'Good - JasonAI makes your PM better, not redundant. Your PM is probably spending significant time rereading conversations to stay on top of jobs. JasonAI does that automatically so your PM can focus on managing jobs instead of managing information.',
  },
] as const;

const faqs = [
  {
    question: 'What tools does JasonAI connect to?',
    answer:
      'During the founding beta, we start with the channels you choose: email threads, text flows, WhatsApp groups, call notes, or forwarded job communication. We only connect what you approve.',
  },
  {
    question: 'How does the weekly summary work?',
    answer:
      'You receive a clean weekly recap of active jobs: what happened, what was agreed to, what is still open, and what needs action. It is delivered to you, not hidden behind a login.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'The first review is 15 minutes. Setup depends on how your business communicates today, but the founding beta is intentionally hands-on so we can do the heavy lifting with you.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Founding beta pricing is being offered to a small group of contractor businesses after the business review. The review itself is free.',
  },
  {
    question: 'Is my data private?',
    answer:
      'You choose what JasonAI can review. Your business communication is used for your summaries and alerts. It is never sold or shared.',
  },
  {
    question: 'What if I already use project management tools?',
    answer:
      'Keep using it. JasonAI is for the conversations around the job - the places where promises, changes, and follow-ups often happen before anyone enters them somewhere else.',
  },
  {
    question: 'What trades does it work for?',
    answer:
      'We are starting with plumbing, HVAC, remodeling, and GC businesses with active job communication spread across several people.',
  },
  {
    question: 'Is it the same setup for every business?',
    answer:
      'No. JasonAI is set up around how your business already works, including your team structure, communication habits, and job flow.',
  },
  {
    question: 'Can I cancel?',
    answer:
      'Yes. Founding beta access is designed to prove value quickly. If it does not help your operation, you are not locked in.',
  },
] as const;

function loadTallyEmbeds() {
  if (typeof window === 'undefined') {
    return;
  }

  const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://tally.so/widgets/embed.js"]');

  if (existingScript) {
    window.Tally?.loadEmbeds();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://tally.so/widgets/embed.js';
  script.async = true;
  script.onload = () => window.Tally?.loadEmbeds();
  document.head.appendChild(script);
}

function ScrambleText({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    let timeoutId: number | undefined;
    let animationId: number | undefined;
    const totalFrames = Math.max(18, Math.min(42, text.length * 1.15));

    const run = () => {
      frame += 1;
      const settledCharacters = Math.floor((frame / totalFrames) * text.length);

      setDisplayText(
        text
          .split('')
          .map((character, index) => {
            if (character === ' ' || character === '.' || character === '?' || character === ',') {
              return character;
            }

            if (index < settledCharacters) {
              return character;
            }

            return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
          })
          .join(''),
      );

      if (frame < totalFrames) {
        animationId = window.setTimeout(run, 28);
      } else {
        setDisplayText(text);
      }
    };

    timeoutId = window.setTimeout(run, delay);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (animationId) {
        window.clearTimeout(animationId);
      }
    };
  }, [delay, isInView, shouldReduceMotion, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold uppercase text-[#9b3d1e]">
      <ScrambleText text={children} />
    </p>
  );
}

function JasonAILockup() {
  return (
    <div className="flex items-center gap-3 text-[#141414]">
      <Link to="/jasonai" aria-label="JasonAI landing page" className="inline-flex items-center gap-2.5">
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-9 w-9 shrink-0">
          <rect x="4" y="4" width="40" height="40" fill="#141414" />
          <path d="M17 14h15v5H23v8.5c0 5.2-3.2 8.5-8.4 8.5H13v-5h1.4c2.4 0 3.6-1.2 3.6-3.6V14Z" fill="#fffaf0" />
          <path d="M30 25h5l-7 10 1.5-7h-5l7-10L30 25Z" fill="#f1b37b" />
        </svg>
        <span className="text-xl font-semibold tracking-[-0.04em] md:text-2xl">JasonAI</span>
      </Link>
      <span className="h-6 w-px bg-[#cfc6b7]" aria-hidden="true" />
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5d554b]">
        <span>by</span>
        <Link to="/" className="text-[#141414] underline-offset-4 hover:underline" aria-label="B2W home">
          B2W
        </Link>
      </span>
    </div>
  );
}

function HeroVisual() {
  const rows = [
    ['Mon 8:14 AM', 'Tech text', 'Customer asked about adding laundry sink.'],
    ['Mon 8:37 AM', 'Call note', 'Owner approved rough-in if price is sent today.'],
    ['Tue 4:10 PM', 'Email', 'Permit question still needs reply.'],
  ] as const;

  return (
    <div className="border border-[#d9d2c3] bg-[#f8f3e8] p-4 shadow-[12px_12px_0_#1f2937] sm:p-5">
      <div className="flex items-center justify-between border-b border-[#d9d2c3] pb-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Friday owner summary</p>
          <p className="mt-1 text-sm font-semibold text-[#141414]">Maple Avenue Bath Remodel</p>
        </div>
        <span className="border border-[#141414] bg-white px-2 py-1 text-xs font-semibold">Open</span>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map(([time, channel, note]) => (
          <div key={note} className="grid gap-2 border border-[#d9d2c3] bg-white p-3 sm:grid-cols-[7rem_6rem_1fr]">
            <p className="text-xs font-semibold text-[#6b6256]">{time}</p>
            <p className="text-xs font-semibold text-[#1f5f7a]">{channel}</p>
            <p className="text-sm leading-6 text-[#2f2a24]">{note}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ['Scope change', 'Price laundry sink rough-in.'],
          ['Follow-up', 'Reply on permit status.'],
          ['Money risk', 'Extra not billed yet.'],
        ].map(([label, note]) => (
          <div key={label} className="border border-[#141414] bg-[#fffaf0] p-3">
            <p className="text-xs font-semibold uppercase text-[#9b3d1e]">{label}</p>
            <p className="mt-2 text-sm leading-6 text-[#141414]">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm() {
  const [formState, setFormState] = useState<ReviewFormState>(initialReviewFormState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function updateField(field: keyof ReviewFormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const message = [
      `Trade: ${formState.trade}`,
      `Team size: ${formState.teamSize}`,
      `Current job communication tools: ${formState.currentTools}`,
      `Biggest job communication challenge: ${formState.challenge}`,
    ].join('\n');

    const result = await submitInternalForm('/api/contact-lead', {
      name: formState.name.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
      company: formState.company.trim(),
      website: '',
      inquiryType: 'JasonAI business review',
      normalizedProjectArea: 'Optimization',
      projectAreas: ['Optimization'],
      message,
      websiteUrl: formState.websiteUrl.trim(),
      ...getSourceMetadata({
        formType: 'jasonai_business_review',
        actionType: 'business_review_request',
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit the request right now.');
      return;
    }

    setStatus('success');
    setFormState(initialReviewFormState);
  }

  const isSubmitting = status === 'submitting';

  if (status === 'success') {
    return (
      <div className="border border-[#b7d4c2] bg-[#f0faf3] p-5">
        <p className="text-lg font-semibold text-[#12351f]">Review request received.</p>
        <p className="mt-2 text-sm leading-6 text-[#285034]">
          We will review what you sent and reply with next steps for a 15-minute business review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        aria-label="Website"
        autoComplete="off"
        tabIndex={-1}
        value={formState.websiteUrl}
        onChange={(event) => updateField('websiteUrl', event.target.value)}
        className="hidden"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
          Name
          <input
            required
            value={formState.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
          Company
          <input
            required
            value={formState.company}
            onChange={(event) => updateField('company', event.target.value)}
            className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
          Email
          <input
            required
            type="email"
            value={formState.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
          Phone
          <input
            required
            value={formState.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
          Trade
          <select
            required
            value={formState.trade}
            onChange={(event) => updateField('trade', event.target.value)}
            className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
          >
            <option value="">Select one</option>
            <option>Plumbing</option>
            <option>HVAC</option>
            <option>Remodeling / GC</option>
            <option>Electrical</option>
            <option>Other contractor business</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
          Team size
          <select
            required
            value={formState.teamSize}
            onChange={(event) => updateField('teamSize', event.target.value)}
            className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
          >
            <option value="">Select one</option>
            <option>1-4 people</option>
            <option>5-10 people</option>
            <option>11-25 people</option>
            <option>26-50 people</option>
            <option>50+ people</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
        Tools currently used to communicate about jobs
        <input
          required
          value={formState.currentTools}
          onChange={(event) => updateField('currentTools', event.target.value)}
          placeholder="Text, email, WhatsApp, calls, Jobber, Buildertrend..."
          className="min-h-12 border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[#2f2a24]">
        Biggest job communication challenge right now
        <textarea
          required
          value={formState.challenge}
          onChange={(event) => updateField('challenge', event.target.value)}
          rows={5}
          className="border border-[#cfc6b7] bg-white px-3 py-2 text-base font-normal outline-none focus:border-[#1f5f7a]"
        />
      </label>
      {status === 'error' ? (
        <p className="border border-[#e3a39a] bg-[#fff3f0] px-3 py-2 text-sm text-[#8a2418]">{errorMessage}</p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f2a24] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Sending...' : 'Book Your Free 15-Minute Business Review'}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

function ObjectionCarousel() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState(objections[0].answer);
  const activeObjection = objections[activeIndex];

  useEffect(() => {
    if (shouldReduceMotion) {
      setTypedAnswer(activeObjection.answer);
      return;
    }

    setTypedAnswer('');
    let characterIndex = 0;
    const typingInterval = window.setInterval(() => {
      characterIndex += 2;
      setTypedAnswer(activeObjection.answer.slice(0, characterIndex));

      if (characterIndex >= activeObjection.answer.length) {
        window.clearInterval(typingInterval);
      }
    }, 22);

    return () => window.clearInterval(typingInterval);
  }, [activeIndex, activeObjection.answer, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const cycleInterval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % objections.length);
    }, 8200);

    return () => window.clearInterval(cycleInterval);
  }, [shouldReduceMotion]);

  const progressItems = useMemo(() => objections.map((_, index) => index), []);

  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-[0.28fr_0.72fr]">
      <div className="flex gap-2 lg:flex-col">
        {progressItems.map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show objection ${index + 1}`}
            className={`h-2 flex-1 border border-[#141414] transition-colors lg:h-12 lg:flex-none ${
              activeIndex === index ? 'bg-[#141414]' : 'bg-transparent hover:bg-[#f8f3e8]'
            }`}
          />
        ))}
      </div>

      <div className="min-h-[28rem] border border-[#d9d2c3] bg-[#fffaf0] p-5 md:min-h-[22rem] md:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeObjection.question}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(14px)' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, filter: 'blur(14px)' }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="mt-4 text-3xl font-semibold leading-tight text-[#141414] md:text-5xl">
              Objection {activeIndex + 1}: {activeObjection.question}
            </h3>
            <div className="mt-8 border-l-4 border-[#1f5f7a] pl-5">
              <p className="text-xs font-semibold uppercase text-[#1f5f7a]">Answer</p>
              <p aria-live="polite" className="mt-3 min-h-[12rem] text-lg leading-8 text-[#3c362f] md:min-h-[8rem]">
                {typedAnswer}
                {!shouldReduceMotion && typedAnswer.length < activeObjection.answer.length ? (
                  <motion.span
                    aria-hidden="true"
                    className="ml-1 inline-block h-5 w-0.5 translate-y-1 bg-[#141414]"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                ) : null}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProblemCostsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="problem" className="scroll-mt-24 border-b border-[#d9d2c3] bg-[#141414] text-white">
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold md:text-5xl">
            <ScrambleText text="You Already Know This Is Costing You" />
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#cfc6b7]">
            Scroll through the work your team is already doing. Each one is a real place where money, trust, or time
            leaks out of the business.
          </p>
        </div>

        <div className="mt-10 divide-y divide-white/15 border-y border-white/15">
          {problemStatements.map((statement, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.article
                key={statement.text}
                onViewportEnter={() => setActiveIndex(index)}
                viewport={{ amount: 0.62, margin: '-18% 0px -34% 0px' }}
                className={`py-5 transition-opacity duration-500 md:py-6 ${
                  isActive ? 'opacity-100' : 'opacity-38'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="grid w-full gap-4 text-left md:grid-cols-[5rem_1fr] md:items-start"
                >
                  <span className="pt-1 text-xs font-semibold uppercase text-[#f1b37b]">Cost {index + 1}</span>
                  <span className="text-xl leading-8 text-[#f8f3e8] md:text-2xl md:leading-10">
                    {statement.text}
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={
                    shouldReduceMotion
                      ? { height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }
                      : {
                          height: isActive ? 'auto' : 0,
                          opacity: isActive ? 1 : 0,
                          filter: isActive ? 'blur(0px)' : 'blur(8px)',
                        }
                  }
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 md:pl-20">
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              scale: isActive ? 1 : 0.96,
                              y: isActive ? 0 : 10,
                            }
                      }
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border border-white/15 bg-[#0f0f0f]"
                    >
                      <img
                        src={statement.image}
                        alt={statement.alt}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const chatScenarios = [
  {
    mode: 'Project management',
    prompt: 'JasonAI, what is still open on Maple Ave?',
    response:
      'Open: permit status reply, laundry sink price, and Friday customer recap. PM owns permit. Owner approval needed on extra work.',
    detail: 'Turns scattered messages into a working job list.',
  },
  {
    mode: 'Risk tracking',
    prompt: 'Anything risky before this job closes?',
    response:
      'Risk flagged: homeowner asked for added rough-in on-site. No written approval found yet. Send change order before closeout.',
    detail: 'Catches scope, follow-up, and dispute risk inside the chat.',
  },
  {
    mode: 'Documentation lookup',
    prompt: 'Pull what was agreed last Tuesday.',
    response:
      'Found it: Tuesday 3:42 PM text thread. Customer approved added rough-in after price confirmation. I can draft the recap.',
    detail: 'Finds the paper trail without making anyone search old threads.',
  },
] as const;

const jasonAiBodyCopy = [
  'JasonAI works inside the communication tools your team already uses - texts, email, WhatsApp, and calls. It learns how your business operates and keeps track of what matters across every role.',
  'For your techs in the field: relevant job information and reminders, right where they already communicate. No new app to open.',
  'For your admin and PM: organized records, flagged scope changes, and open follow-ups across every active job. Automatically.',
  'For you as the owner: weekly clarity on every job. Every commitment made. Every extra that needs to be billed. Every follow-up still open. Delivered to you.',
] as const;

const chatSources = [
  { label: 'Chat history', detail: 'Field texts + PM thread', Icon: MessageSquareText, side: 'left' },
  { label: 'Emails', detail: 'Approvals + recap', Icon: Mail, side: 'right' },
  { label: 'Cloud storage', detail: 'Photos + job docs', Icon: Cloud, side: 'right' },
] as const;

function TeamChatPhone() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScenario = chatScenarios[activeIndex];

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % chatScenarios.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mx-auto mb-8 grid max-w-3xl gap-2 sm:grid-cols-3">
        {chatScenarios.map((scenario, index) => (
          <button
            key={scenario.mode}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative overflow-hidden border px-3 py-3 text-left transition-colors ${
              index === activeIndex
                ? 'border-[#141414] bg-[#141414] text-white'
                : 'border-[#d9d2c3] bg-white text-[#4f463c] hover:border-[#141414]'
            }`}
          >
            <span className="relative z-10 block text-xs font-semibold uppercase">{scenario.mode}</span>
            <span className="relative z-10 mt-1 block text-xs leading-5 opacity-70">{scenario.detail}</span>
            {index === activeIndex && !shouldReduceMotion ? (
              <motion.span
                key={scenario.mode}
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f1b37b]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5.2, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(18rem,24rem)_minmax(0,0.82fr)] lg:items-center">
        <div className="hidden space-y-5 lg:block">
          {jasonAiBodyCopy.slice(0, 2).map((item, index) => (
            <motion.p
              key={item}
              className="border-l-4 border-[#9b3d1e] bg-[#fffaf0] p-4 text-sm leading-7 text-[#3c362f]"
              initial={shouldReduceMotion ? false : { opacity: 0, x: -18, filter: 'blur(8px)' }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {item}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96, filter: 'blur(10px)' }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-8 bg-[radial-gradient(circle,rgba(31,95,122,0.16),transparent_64%)]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-[47%] z-20 hidden -translate-y-1/2 lg:block">
            {chatSources.map(({ label, detail, Icon, side }, index) => {
              const isLeft = side === 'left';
              return (
                <motion.div
                  key={label}
                  className={`absolute w-40 border border-[#d9d2c3] bg-white/95 p-3 shadow-sm ${
                    isLeft ? '-left-44' : '-right-44'
                  }`}
                  style={{ top: `${index * 5.6 - 5.2}rem` }}
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: [0.45, 1, 0.58],
                          x: isLeft ? [0, 10, 0] : [0, -10, 0],
                          filter: ['blur(1.5px)', 'blur(0px)', 'blur(1px)'],
                        }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.48, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#1f5f7a]" />
                    <p className="text-[11px] font-semibold uppercase text-[#9b3d1e]">{label}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#4f463c]">{detail}</p>
                </motion.div>
              );
            })}

            {chatSources.map(({ label, side }, index) => {
              const isLeft = side === 'left';
              return (
                <motion.div
                  key={`${label}-line`}
                  className={`absolute h-px w-24 bg-[#1f5f7a]/45 ${isLeft ? 'left-[-1.5rem]' : 'right-[-1.5rem]'}`}
                  style={{ top: `${index * 5.6 - 2.4}rem` }}
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scaleX: [0.25, 1, 0.25],
                          opacity: [0.2, 0.85, 0.2],
                        }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.48, ease: 'easeInOut' }}
                />
              );
            })}
          </div>
          <div className="relative rounded-[2.4rem] border border-[#141414] bg-[#141414] p-2 shadow-[18px_22px_0_rgba(20,20,20,0.12)]">
            <div className="min-h-[38rem] rounded-[1.85rem] bg-[#fffaf0] p-4">
              <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-[#141414]/20" />
              <div className="flex items-center justify-between border-b border-[#d9d2c3] pb-3">
                <div>
                  <p className="text-sm font-semibold text-[#141414]">Maple Ave Team</p>
                  <p className="mt-0.5 text-xs text-[#6b6256]">Luis, Maya, Owner, JasonAI</p>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-[#1f7a4f]" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase text-[#6b6256]">Luis - field</p>
                  <p className="mt-1 text-sm leading-6 text-[#2f2a24]">Homeowner asked about adding the laundry sink.</p>
                </div>
                <div className="ml-auto max-w-[84%] rounded-2xl rounded-tr-sm bg-[#1f5f7a] p-3 text-white">
                  <p className="text-[11px] font-semibold uppercase text-white/70">Maya - PM</p>
                  <p className="mt-1 text-sm leading-6">Need the open items before I call them back.</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScenario.mode}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8, filter: 'blur(8px)' }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-3"
                  >
                    <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#2f2a24] p-3 text-white">
                      <p className="text-[11px] font-semibold uppercase text-white/60">Owner</p>
                      <p className="mt-1 text-sm leading-6">{activeScenario.prompt}</p>
                    </div>
                    <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-[#d9d2c3] bg-white p-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center bg-[#141414] text-[11px] font-semibold text-[#fffaf0]">
                          J
                        </span>
                        <p className="text-[11px] font-semibold uppercase text-[#9b3d1e]">JasonAI</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {chatSources.map(({ label }) => (
                          <span key={label} className="border border-[#d9d2c3] bg-[#fffaf0] px-1.5 py-0.5 text-[10px] font-semibold text-[#6b6256]">
                            {label}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#2f2a24]">{activeScenario.response}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d9d2c3] bg-white p-3">
                <p className="text-[11px] font-semibold uppercase text-[#6b6256]">Pipeline connected</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['Jobs', 'Risks', 'Docs'].map((item) => (
                    <div key={item} className="border border-[#d9d2c3] bg-[#fffaf0] px-2 py-2 text-center text-xs font-semibold text-[#4f463c]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="hidden space-y-5 lg:block">
          {jasonAiBodyCopy.slice(2).map((item, index) => (
            <motion.p
              key={item}
              className="border-l-4 border-[#9b3d1e] bg-[#fffaf0] p-4 text-sm leading-7 text-[#3c362f]"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 18, filter: 'blur(8px)' }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {item}
            </motion.p>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 text-base leading-7 text-[#3c362f] lg:hidden">
        {jasonAiBodyCopy.map((item) => (
          <p key={item} className="border-l-4 border-[#9b3d1e] bg-[#fffaf0] p-4">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function JasonAIPage() {
  useEffect(() => {
    loadTallyEmbeds();
  }, []);

  return (
    <>
      <Seo
        title="JasonAI for Contractor Businesses"
        description="JasonAI works inside the tools contractor teams already use and keeps track of scope changes, missed follow-ups, and unbilled extras."
        canonicalPath="/jasonai"
      />
      <div className="min-h-screen bg-[#fffaf0] text-[#141414]">
        <header className="sticky top-0 z-40 border-b border-[#d9d2c3] bg-[#fffaf0]/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
            <JasonAILockup />
            <nav className="hidden items-center gap-6 text-sm font-semibold text-[#4f463c] md:flex">
              <a href="#problem" className="hover:text-[#141414]">
                The problem
              </a>
              <a href="#how-it-works" className="hover:text-[#141414]">
                How it works
              </a>
              <a href="#questions" className="hover:text-[#141414]">
                Questions
              </a>
            </nav>
            <a
              href="#business-review"
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f2a24]"
            >
              Book review
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </header>

        <main>
          <section className="border-b border-[#d9d2c3]">
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:px-8 md:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.7fr)] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase text-[#9b3d1e]">JasonAI</p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-[#141414] md:text-7xl">
                  <ScrambleText text="Built around your business. Not the other way around." />
                </h1>
                <Reveal delay={0.18}>
                  <p className="mt-7 max-w-3xl text-lg leading-8 text-[#4f463c] md:text-xl md:leading-9">
                    JasonAI works inside the tools your team already uses - text, email, WhatsApp, and calls - and keeps
                    track of everything that matters. No new app. No new process. Built around the way you already work.
                  </p>
                </Reveal>
                <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row" delay={0.28}>
                  <a
                    href="#business-review"
                    className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f2a24]"
                  >
                    Book Your Free 15-Minute Business Review
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#waitlist"
                    className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-transparent px-5 py-3 text-sm font-semibold text-[#141414] hover:bg-white"
                  >
                    Not ready? Join the waitlist
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Reveal>
                <Reveal className="mt-9 hidden gap-3 text-sm font-semibold text-[#4f463c] sm:grid sm:grid-cols-3" delay={0.36}>
                  {['Texts', 'Email', 'WhatsApp and calls'].map((item) => (
                    <div key={item} className="flex items-center gap-2 border-l border-[#9b3d1e] pl-3">
                      <Check className="h-4 w-4 text-[#1f5f7a]" />
                      {item}
                    </div>
                  ))}
                </Reveal>
              </div>
              <Reveal delay={0.22}>
                <HeroVisual />
              </Reveal>
            </div>
          </section>

          <ProblemCostsSection />

          <section id="what-jasonai-does" className="scroll-mt-24 border-b border-[#d9d2c3] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
              <div className="mx-auto max-w-3xl text-center">
                <SectionLabel>What JasonAI does</SectionLabel>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="It keeps track of what matters across every role." />
                </h2>
              </div>

              <div className="mt-12">
                <TeamChatPhone />
              </div>

              <Reveal>
                <p className="mx-auto mt-8 max-w-3xl border-l-4 border-[#141414] pl-5 text-lg font-semibold leading-8 text-[#141414]">
                  JasonAI does not ask your business to fit into a template. It is set up around the way you already
                  work.
                </p>
              </Reveal>
            </div>
          </section>

          <section id="how-it-works" className="border-b border-[#d9d2c3]">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
              <SectionLabel>How it works</SectionLabel>
              <div className="mt-4 grid gap-8 lg:grid-cols-[0.6fr_1fr]">
                <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="Three steps. No new habits." />
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {howItWorks.map((step, index) => (
                    <Reveal key={step.title} delay={index * 0.08} className="border border-[#d9d2c3] bg-white p-5">
                      <p className="text-sm font-semibold text-[#9b3d1e]">0{index + 1}</p>
                      <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-[#4f463c]">{step.body}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-[#d9d2c3] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
              <div className="max-w-3xl">
                <SectionLabel>Use cases</SectionLabel>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="The places where money and trust usually slip." />
                </h2>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {useCases.map((useCase, index) => (
                  <Reveal key={useCase.title} delay={index * 0.06} className="border border-[#d9d2c3] bg-[#fffaf0] p-5">
                    <h3 className="text-xl font-semibold">{useCase.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#4f463c]">{useCase.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="border-b border-[#d9d2c3]">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
              <div className="max-w-3xl">
                <SectionLabel>Founding contractors</SectionLabel>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="We are working with a small group of founding contractor businesses." />
                </h2>
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <Reveal key={testimonial.source} delay={index * 0.08} className="border border-[#d9d2c3] bg-white p-5">
                    <figure>
                    <p className="text-lg leading-8 text-[#2f2a24]">"{testimonial.quote}"</p>
                    <figcaption className="mt-5 text-sm font-semibold text-[#9b3d1e]">{testimonial.source}</figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="business-review" className="border-b border-[#d9d2c3] bg-[#f8f3e8]">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1fr]">
              <div>
                <SectionLabel>Free 15-minute business review</SectionLabel>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="We will look at how your job communication works right now." />
                </h2>
                <Reveal>
                  <p className="mt-6 text-lg leading-8 text-[#4f463c]">
                    No pitch. No demo. Just a real conversation about where job details fall through, what gets missed,
                    and what might already be costing you money.
                  </p>
                </Reveal>
              </div>
              <Reveal className="border border-[#d9d2c3] bg-white p-5 md:p-6">
                <ReviewForm />
              </Reveal>
            </div>
          </section>

          <section id="questions" className="border-b border-[#d9d2c3] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
              <div className="max-w-3xl">
                <SectionLabel>Objections</SectionLabel>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="The questions contractors usually ask first." />
                </h2>
              </div>
              <ObjectionCarousel />
            </div>
          </section>

          <section className="border-b border-[#d9d2c3]">
            <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
              <div className="max-w-3xl">
                <SectionLabel>FAQ</SectionLabel>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="Details before you talk to us." />
                </h2>
              </div>
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {faqs.map((item, index) => (
                  <Reveal key={item.question} delay={index * 0.04} className="border border-[#d9d2c3] bg-white p-5">
                    <details>
                    <summary className="cursor-pointer list-none text-base font-semibold">{item.question}</summary>
                    <p className="mt-4 text-sm leading-7 text-[#4f463c]">{item.answer}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="waitlist" className="border-b border-[#d9d2c3] bg-[#141414] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.65fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase text-[#f1b37b]">Waitlist</p>
                <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  <ScrambleText text="Not ready for a review yet?" />
                </h2>
                <Reveal>
                  <p className="mt-6 text-lg leading-8 text-[#f8f3e8]">
                    Join the JasonAI waitlist and get updates as founding access opens for more contractor businesses.
                  </p>
                </Reveal>
              </div>
              <Reveal className="border border-white/15 bg-white p-2 text-[#141414]">
                <iframe
                  data-tally-src="https://tally.so/embed/jaG0yY?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="1951"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Join the JasonAI waitlist"
                />
              </Reveal>
            </div>
          </section>

          <section className="bg-[#fffaf0]">
            <div className="mx-auto max-w-5xl px-5 py-16 text-center md:px-8 md:py-24">
              <p className="text-sm font-semibold uppercase text-[#9b3d1e]">A B2W Product</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                <ScrambleText text="Stop losing money on jobs you cannot track." />
              </h2>
              <Reveal>
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#4f463c]">
                  Book a free 15-minute business review. We will look at how your job communication works right now and
                  where things are falling through. No pitch. No demo. Just a real conversation.
                </p>
              </Reveal>
              <Reveal className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#business-review"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f2a24]"
                >
                  Book My Free Business Review
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#waitlist"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-transparent px-5 py-3 text-sm font-semibold text-[#141414] hover:bg-white"
                >
                  Just want updates? Join the waitlist
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
