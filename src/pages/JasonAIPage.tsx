import { useEffect, useMemo, useRef, useState, type Key, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  ChevronDown,
  FolderSearch,
  MessageSquareText,
  ShieldAlert,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const waitlistUrl = 'https://tally.so/embed/jaG0yY?alignLeft=1&hideTitle=1&dynamicHeight=1';
const jasonAiCalendlyUrl =
  'https://calendly.com/b2w-ai-info/30min?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=00ffc3';

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

const privacyHighlights = [
  {
    title: 'You choose the fieldwork channels JasonAI can review.',
    body:
      'JasonAI is configured around the communication sources you approve, such as work texts, email, WhatsApp, call notes, job documents, and connected field operations tools.',
  },
  {
    title: 'Your job communication is used to run JasonAI for your business.',
    body:
      'We use approved information to produce summaries, alerts, open-loop reminders, scope-change flags, dispute context, and field support for your team.',
  },
  {
    title: 'We do not sell your fieldwork data.',
    body:
      'JasonAI is not an advertising product. We do not sell your business communications, customer records, job details, or crew activity to advertisers or data brokers.',
  },
] as const;

const privacySections = [
  {
    title: '1. What this policy covers',
    body: [
      'This Privacy Policy explains how B2W collects, uses, shares, and protects information for JasonAI, including the JasonAI website, waitlist, business review, onboarding process, and JasonAI service.',
      'JasonAI is built for fieldwork businesses where work happens across job sites, crews, customers, owners, project managers, subcontractors, and office staff. That means the information JasonAI handles may include operational communication about real jobs in the field.',
    ],
  },
  {
    title: '2. Information we collect',
    body: [
      'Contact and account information, such as your name, email address, phone number, company name, role, team size, service area, and details you provide when joining the waitlist, booking a review, or onboarding JasonAI.',
      'Fieldwork and job communication you authorize JasonAI to access, such as work texts, email, WhatsApp messages, call notes or transcripts, customer requests, project manager notes, technician updates, job names, job addresses, schedule details, estimates, scope changes, photos, documents, and related metadata.',
      'Integration information from tools you connect, such as authorization status, connected account identifiers, sync logs, delivery status, and settings needed to send summaries, alerts, or responses back through approved channels.',
      'Website and service usage information, such as pages visited, form submissions, device and browser information, IP address, timestamps, diagnostics, and security logs.',
      'Commercial and support information, such as billing contacts, contract records, support requests, implementation notes, and feedback.',
    ],
  },
  {
    title: '3. How we use information',
    body: [
      'We use information to operate JasonAI, configure it around your fieldwork process, summarize approved communications, identify open tasks, flag possible scope changes, prepare job context, support dispute review, and help your team find what was agreed or still needs action.',
      'We also use information to provide onboarding and support, communicate with you, manage waitlist and business review requests, maintain security, troubleshoot issues, improve reliability, develop new features, and meet legal or contractual obligations.',
      'We may use aggregated or de-identified information to understand product performance and improve JasonAI. Aggregated or de-identified information does not identify your business, workers, customers, or job sites.',
    ],
  },
  {
    title: '4. AI processing',
    body: [
      'JasonAI uses artificial intelligence systems to classify, summarize, search, and organize approved fieldwork communications and job context.',
      'Customer content is processed to provide JasonAI to your business. We do not use your business communications, customer records, crew messages, job files, or connected-channel content to train public AI models unless you separately agree in writing.',
      'AI-generated summaries and alerts can be incomplete or incorrect. You remain responsible for reviewing important job, billing, safety, legal, or customer decisions before acting on them.',
    ],
  },
  {
    title: '5. How we share information',
    body: [
      'We share information with service providers that help us operate JasonAI, such as hosting, database, analytics, email, scheduling, automation, transcription, AI processing, security, and customer support providers. These providers are expected to use information only to provide services to us.',
      'We share information with integrations and communication channels you authorize, for example when JasonAI posts an alert, sends a summary, or retrieves context from an approved tool.',
      'We may share information when required by law, to protect rights and safety, to prevent fraud or abuse, in connection with a business transaction, or with your direction or consent.',
      'We do not sell your fieldwork communications, job data, customer records, or crew activity. We do not use JasonAI customer content for targeted advertising.',
    ],
  },
  {
    title: '6. Your choices and controls',
    body: [
      'You control which channels JasonAI connects to and what information JasonAI is allowed to review. You can ask us to add, remove, pause, or limit connected sources.',
      'You can request access, correction, deletion, or export of personal information by contacting us. We may need to verify your request and may retain information when required for security, legal, billing, backup, or legitimate business reasons.',
      'If you are a customer administrator, you are responsible for choosing appropriate access settings for your team and for giving workers, customers, subcontractors, or other participants any notices or choices required for your use of JasonAI.',
    ],
  },
  {
    title: '7. Retention',
    body: [
      'We keep information for as long as needed to provide JasonAI, support your account, comply with our agreements, maintain security, resolve disputes, and meet legal obligations.',
      'When information is no longer needed, we delete it, de-identify it, or retain it only in limited backup, audit, or security systems for a reasonable period.',
    ],
  },
  {
    title: '8. Security',
    body: [
      'We use reasonable administrative, technical, and organizational safeguards designed to protect information handled by JasonAI. These safeguards may include access controls, secure hosting practices, logging, monitoring, and limiting internal access based on role and need.',
      'No system is perfectly secure. If you believe information connected to JasonAI has been accessed without authorization, contact us promptly.',
    ],
  },
  {
    title: '9. Sensitive information',
    body: [
      'JasonAI is designed for fieldwork operations, job communication, and business context. Do not intentionally send Social Security numbers, full payment card numbers, protected health information, children\'s information, or other highly sensitive information to JasonAI unless we have expressly agreed to handle that information in writing.',
      'If sensitive information appears incidentally in approved fieldwork communications, JasonAI may process it as part of providing the service. We may work with you to limit or remove that information where practical.',
    ],
  },
  {
    title: '10. Children',
    body: [
      'JasonAI is not directed to children and is not intended for use by anyone under 16. We do not knowingly collect personal information from children through JasonAI.',
    ],
  },
  {
    title: '11. U.S. and international use',
    body: [
      'B2W operates from the United States. If you access JasonAI from outside the United States, your information may be processed and stored in the United States or other countries where our service providers operate.',
    ],
  },
  {
    title: '12. State privacy rights',
    body: [
      'Depending on where you live, you may have rights to know, access, correct, delete, or receive a copy of certain personal information, and to appeal certain privacy request decisions. You may submit a request using the contact information below.',
      'We will not discriminate against you for exercising privacy rights that apply to you.',
    ],
  },
  {
    title: '13. Changes to this policy',
    body: [
      'We may update this Privacy Policy as JasonAI changes. If the changes are material, we will take reasonable steps to notify customers or make the updated policy clear on this page.',
    ],
  },
  {
    title: '14. Contact',
    body: ['For privacy questions or requests, contact B2W at info@b2w-ai.com.'],
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#141414]/45 px-4 py-6 backdrop-blur-sm">
      <div className="relative h-[min(760px,92vh)] w-full max-w-4xl overflow-hidden border border-[#d9d2c3] bg-white shadow-[0_24px_80px_rgba(20,20,20,0.24)]">
        <div className="flex items-center justify-between border-b border-[#d9d2c3] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#141414]">{title}</p>
            <p className="text-xs text-[#6b6256]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="grid h-9 w-9 place-items-center border border-[#d9d2c3] text-[#141414] transition hover:bg-[#fffaf0]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CalendlyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title="Book a JasonAI business review"
      subtitle="Pick a time that works for you."
    >
      <iframe
        src={jasonAiCalendlyUrl}
        title="Book a JasonAI business review"
        className="h-[calc(100%-58px)] w-full"
        loading="lazy"
      />
    </ModalFrame>
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
  key?: Key;
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

function JasonAILockup({ showByline = true }: { showByline?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-[#141414]">
      <Link to="/jasonai" aria-label="JasonAI landing page" className="inline-flex items-center gap-2.5">
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9">
          <rect x="4" y="4" width="40" height="40" fill="#141414" />
          <path d="M17 14h15v5H23v8.5c0 5.2-3.2 8.5-8.4 8.5H13v-5h1.4c2.4 0 3.6-1.2 3.6-3.6V14Z" fill="#fffaf0" />
          <path d="M30 25h5l-7 10 1.5-7h-5l7-10L30 25Z" fill="#f1b37b" />
        </svg>
        <span className="text-lg font-semibold tracking-[-0.04em] sm:text-xl md:text-2xl">JasonAI</span>
      </Link>
      <motion.span
        className="hidden h-6 w-px bg-[#cfc6b7] sm:block"
        aria-hidden="true"
        animate={{ opacity: showByline ? 1 : 0, x: showByline ? 0 : -8 }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        className="hidden items-center gap-1.5 text-sm font-semibold text-[#5d554b] sm:inline-flex"
        animate={{ opacity: showByline ? 1 : 0, x: showByline ? 0 : -10, width: showByline ? 'auto' : 0 }}
        transition={{ duration: 0.25 }}
      >
        <span>by</span>
        <Link to="/" className="text-[#141414] underline-offset-4 hover:underline" aria-label="B2W home">
          B2W
        </Link>
      </motion.span>
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

function BookingPrompt({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div>
        <CalendarDays className="h-9 w-9 text-[#1f5f7a]" />
        <h3 className="mt-5 text-2xl font-semibold leading-tight text-[#141414]">Choose a time on the calendar.</h3>
        <p className="mt-4 text-sm leading-7 text-[#4f463c]">
          The calendar opens in a popup on this page, so you can pick an available 30-minute slot without filling out a
          separate intake form first.
        </p>
      </div>
      <div className="grid gap-3 border-t border-[#d9d2c3] pt-5">
        {['30-minute JasonAI booking', 'Embedded Calendly scheduling', 'No separate lead form'].map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#2f2a24]">
            <Check className="h-4 w-4 text-[#1f5f7a]" />
            {item}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenBooking}
        className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f2a24] disabled:cursor-not-allowed disabled:opacity-70"
      >
        Open Booking Calendar
        <CalendarDays className="h-4 w-4" />
      </button>
    </div>
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
    <div className="mt-10 grid gap-5 lg:grid-cols-[0.36fr_0.64fr]">
      <div className="grid gap-2">
        {progressItems.map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show objection ${index + 1}`}
            className={`relative overflow-hidden border px-4 py-3 text-left transition-colors ${
              activeIndex === index
                ? 'border-[#141414] bg-[#141414] text-white'
                : 'border-[#d9d2c3] bg-white text-[#4f463c] hover:border-[#141414]'
            }`}
          >
            <span className="block text-[11px] font-semibold uppercase opacity-70">Objection {index + 1}</span>
            <span className="mt-1 hidden text-sm font-semibold leading-5 sm:block">{objections[index].question}</span>
            {activeIndex === index && !shouldReduceMotion ? (
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f1b37b]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 8.2, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="min-h-[27rem] border border-[#d9d2c3] bg-[#fffaf0] p-5 md:min-h-[22rem] md:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeObjection.question}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(14px)' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, filter: 'blur(14px)' }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-l-4 border-[#1f5f7a] pl-5">
              <p className="text-xs font-semibold uppercase text-[#1f5f7a]">Answer</p>
              <p aria-live="polite" className="mt-4 min-h-[15rem] text-xl leading-9 text-[#3c362f] md:min-h-[12rem]">
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

const chatModeIcons = [ClipboardList, ShieldAlert, FolderSearch] as const;

const jasonAiBodyCopy = [
  'JasonAI works inside the communication tools your team already uses - texts, email, WhatsApp, and calls. It learns how your business operates and keeps track of what matters across every role.',
  'For your techs in the field: relevant job information and reminders, right where they already communicate. No new app to open.',
  'For your admin and PM: organized records, flagged scope changes, and open follow-ups across every active job. Automatically.',
  'For you as the owner: weekly clarity on every job. Every commitment made. Every extra that needs to be billed. Every follow-up still open. Delivered to you.',
] as const;

const jasonAiCallouts = [
  { label: 'Works where they already talk', body: jasonAiBodyCopy[0], Icon: MessageSquareText, side: 'left' },
  { label: 'Field support', body: jasonAiBodyCopy[1], Icon: ClipboardList, side: 'right' },
  { label: 'Admin and PM clarity', body: jasonAiBodyCopy[2], Icon: ShieldAlert, side: 'left' },
  { label: 'Owner visibility', body: jasonAiBodyCopy[3], Icon: FolderSearch, side: 'right' },
] as const;

function TeamChatPhone() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCalloutIndex, setActiveCalloutIndex] = useState(0);
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

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveCalloutIndex((current) => (current + 1) % jasonAiCallouts.length);
    }, 3900);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mx-auto mb-5 grid max-w-[12rem] grid-cols-3 gap-2 sm:mb-8 sm:max-w-3xl">
        {chatScenarios.map((scenario, index) => (
          <button
            key={scenario.mode}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={scenario.mode}
            className={`relative grid aspect-square place-items-center overflow-hidden border transition-colors sm:aspect-auto sm:block sm:px-3 sm:py-3 sm:text-left ${
              index === activeIndex
                ? 'border-[#141414] bg-[#141414] text-white'
                : 'border-[#d9d2c3] bg-white text-[#4f463c] hover:border-[#141414]'
            }`}
          >
            {(() => {
              const ModeIcon = chatModeIcons[index];
              return <ModeIcon className="relative z-10 h-5 w-5 sm:hidden" />;
            })()}
            <span className="relative z-10 hidden text-xs font-semibold uppercase sm:block">{scenario.mode}</span>
            <span className="relative z-10 mt-1 hidden text-xs leading-5 opacity-70 sm:block">{scenario.detail}</span>
            {index === activeIndex && !shouldReduceMotion ? (
              <motion.span
                key={scenario.mode}
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1 origin-left bg-[#f1b37b] sm:h-0.5"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5.2, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid gap-7 lg:items-center">
        <motion.div
          className="relative mx-auto w-full max-w-[22rem] lg:max-w-[24rem]"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96, filter: 'blur(10px)' }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-8 hidden bg-[radial-gradient(circle,rgba(31,95,122,0.16),transparent_64%)] sm:block"
          />
          <div className="pointer-events-none absolute inset-x-0 top-[47%] z-20 hidden -translate-y-1/2 lg:block">
            {jasonAiCallouts.map(({ label, body, Icon, side }, index) => {
              const isLeft = side === 'left';
              return (
                <motion.div
                  key={label}
                  className={`absolute w-72 border border-[#d9d2c3] bg-white/95 p-4 shadow-sm ${
                    isLeft ? '-left-80' : '-right-80'
                  }`}
                  style={{ top: `${index * 5.15 - 8.1}rem` }}
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
                  <p className="mt-2 text-xs leading-5 text-[#4f463c]">{body}</p>
                </motion.div>
              );
            })}

            {jasonAiCallouts.map(({ label, side }, index) => {
              const isLeft = side === 'left';
              return (
                <motion.div
                  key={`${label}-line`}
                  className={`absolute h-px w-28 bg-[#1f5f7a]/45 ${isLeft ? 'left-[-2.25rem]' : 'right-[-2.25rem]'}`}
                  style={{ top: `${index * 5.15 - 5.15}rem` }}
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
                        {jasonAiCallouts.map(({ label }) => (
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
      </div>

      <div className="mx-auto mt-6 max-w-[22rem] border-t border-[#d9d2c3] pt-4 text-sm leading-6 text-[#3c362f] lg:hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={jasonAiCallouts[activeCalloutIndex]?.label}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {jasonAiCallouts[activeCalloutIndex]?.body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
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
  );
}

function UseCasesSection() {
  return (
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
  );
}

function BusinessReviewSection({ onOpenBooking }: { onOpenBooking: () => void }) {
  return (
    <section id="business-review" className="border-b border-[#d9d2c3] bg-[#f8f3e8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.7fr_1fr]">
        <div>
          <SectionLabel>Free 30-minute business review</SectionLabel>
          <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            <ScrambleText text="We will look at how your job communication works right now." />
          </h2>
          <Reveal>
            <p className="mt-6 text-lg leading-8 text-[#4f463c]">
              No pitch. No demo. Just a real conversation about where job details fall through, what gets missed, and
              what might already be costing you money.
            </p>
          </Reveal>
        </div>
        <Reveal className="border border-[#d9d2c3] bg-white p-5 md:p-6">
          <BookingPrompt onOpenBooking={onOpenBooking} />
        </Reveal>
      </div>
    </section>
  );
}

function QuestionsHeroSection() {
  return (
    <section id="questions" className="border-b border-[#d9d2c3]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[#9b3d1e]">Questions</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] md:text-7xl">
            <ScrambleText text="The things contractor owners ask first." />
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#4f463c] md:text-xl md:leading-9">
            What changes for the crew, what JasonAI connects to, what happens to your data, and how to stay updated if
            you are not ready for a review.
          </p>
        </div>
        <ObjectionCarousel />
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-b border-[#d9d2c3]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
            <ScrambleText text="Details before you talk to us." />
          </h2>
        </div>
        <div className="mt-10 grid gap-3 lg:grid-cols-2">
          {faqs.map((item, index) => (
            <Reveal key={item.question} delay={index * 0.035} className="border border-[#d9d2c3] bg-white">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold">
                  <span>{item.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="border-t border-[#d9d2c3] px-5 py-4 text-sm leading-7 text-[#4f463c]">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaitlistSection({ onOpenWaitlist }: { onOpenWaitlist: () => void }) {
  return (
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
        <Reveal className="flex items-center border border-white/15 bg-white p-6 text-[#141414]">
          <div>
            <p className="text-xl font-semibold">Founding access is still limited.</p>
            <p className="mt-3 text-sm leading-7 text-[#4f463c]">
              Join the waitlist and we will follow up as we open more contractor accounts.
            </p>
            <button
              type="button"
              onClick={onOpenWaitlist}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f2a24]"
            >
              Join the waitlist
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function JasonAISubpageIntro({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <section className="border-b border-[#d9d2c3]">
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-semibold uppercase text-[#9b3d1e]">{label}</p>
        <h1 className="mt-4 text-5xl font-semibold leading-[1.02] md:text-7xl">
          <ScrambleText text={title} />
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[#4f463c] md:text-xl md:leading-9">{body}</p>
      </div>
    </section>
  );
}

function JasonAILandingLinks() {
  return (
    <section className="border-b border-[#d9d2c3] bg-[#f8f3e8]">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-2">
        <Link
          to="/jasonai/how-it-works"
          className="group border border-[#d9d2c3] bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#141414] hover:shadow-[8px_8px_0_#141414]"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase text-[#9b3d1e]">How it works</p>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#141414] bg-[#fffaf0] transition-colors group-hover:bg-[#141414] group-hover:text-white">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold">Setup, use cases, and review intake.</h2>
          <p className="mt-4 text-sm leading-7 text-[#4f463c]">
            See how we learn the business, set JasonAI around your process, and review the places details fall through.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#141414]">
            Open how it works
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        <Link
          to="/jasonai/questions"
          className="group border border-[#d9d2c3] bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#141414] hover:shadow-[8px_8px_0_#141414]"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase text-[#9b3d1e]">Questions</p>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#141414] bg-[#fffaf0] transition-colors group-hover:bg-[#141414] group-hover:text-white">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold">Objections, FAQs, and waitlist.</h2>
          <p className="mt-4 text-sm leading-7 text-[#4f463c]">
            Clear answers for the things owners usually ask before they book a review.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#141414]">
            Open questions
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}

function JasonAIPrivacyPolicy() {
  return (
    <>
      <JasonAISubpageIntro
        label="Privacy Policy"
        title="How JasonAI handles fieldwork communication."
        body="JasonAI is built for businesses where the work happens in the field and the context lives across calls, messages, emails, job notes, and handoffs. This policy explains what we collect, how we use it, and the controls you have."
      />
      <section className="border-b border-[#d9d2c3] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {privacyHighlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} className="border border-[#d9d2c3] bg-[#fffaf0] p-5">
                <Check className="h-5 w-5 text-[#1f5f7a]" />
                <h2 className="mt-4 text-2xl font-semibold leading-tight">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#4f463c]">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-[#d9d2c3] bg-[#fffaf0]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel>Effective date</SectionLabel>
            <p className="mt-4 text-3xl font-semibold leading-tight">May 7, 2026</p>
            <p className="mt-5 text-sm leading-7 text-[#6b6256]">
              This policy is written for JasonAI by B2W. Customer agreements or onboarding documents may include
              additional data handling terms for a specific deployment.
            </p>
            <a
              href="mailto:info@b2w-ai.com?subject=JasonAI%20Privacy%20Request"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f2a24]"
            >
              Contact privacy
              <ArrowRight className="h-4 w-4" />
            </a>
          </aside>
          <div className="space-y-5">
            {privacySections.map((section) => (
              <Reveal key={section.title} className="border border-[#d9d2c3] bg-white p-6 md:p-8">
                <h2 className="text-2xl font-semibold leading-tight text-[#141414]">{section.title}</h2>
                <div className="mt-5 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-[#4f463c]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function JasonAIFooter({ page }: { page: 'landing' | 'how-it-works' | 'questions' | 'privacy' }) {
  return (
    <footer className="border-t border-[#d9d2c3] bg-[#141414] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-sm font-semibold">JasonAI by B2W</p>
          <p className="mt-1 text-sm text-white/62">Fieldwork communication, organized around the way jobs move.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/72">
          <Link to="/jasonai" className="hover:text-white">
            Home
          </Link>
          <Link to="/jasonai/how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link to="/jasonai/questions" className="hover:text-white">
            Questions
          </Link>
          <Link
            to="/jasonai/privacy"
            aria-current={page === 'privacy' ? 'page' : undefined}
            className="hover:text-white aria-[current=page]:text-white"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default function JasonAIPage({ page = 'landing' }: { page?: 'landing' | 'how-it-works' | 'questions' | 'privacy' }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const seoByPage = {
    landing: {
      title: 'JasonAI for Contractor Businesses',
      description:
        'JasonAI works inside the tools contractor teams already use and keeps track of scope changes, missed follow-ups, and unbilled extras.',
      canonicalPath: '/jasonai',
    },
    'how-it-works': {
      title: 'How JasonAI Works for Contractors',
      description:
        'See how JasonAI is set up around contractor job communication, where it catches scope changes and follow-ups, and how to book a business review.',
      canonicalPath: '/jasonai/how-it-works',
    },
    questions: {
      title: 'JasonAI Questions and Waitlist',
      description:
        'Answers to common JasonAI questions about crew adoption, privacy, existing tools, setup, and founding access for contractor businesses.',
      canonicalPath: '/jasonai/questions',
    },
    privacy: {
      title: 'JasonAI Privacy Policy',
      description:
        'Privacy Policy for JasonAI by B2W, covering fieldwork communications, job context, connected tools, AI processing, data sharing, retention, and user controls.',
      canonicalPath: '/jasonai/privacy',
    },
  }[page];

  useEffect(() => {
    loadTallyEmbeds();
  }, []);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <>
      <Seo
        title={seoByPage.title}
        description={seoByPage.description}
        canonicalPath={seoByPage.canonicalPath}
      />
      <div className="min-h-screen bg-[#fffaf0] text-[#141414]">
        <header
          className={`sticky -top-px z-40 bg-[#fffaf0]/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-[border-color,box-shadow] duration-300 ${
            hasScrolled ? 'border-b border-[#d9d2c3] shadow-sm' : 'border-b border-transparent'
          }`}
        >
          <div
            className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-[padding] duration-300 sm:px-5 md:px-8 ${
              hasScrolled ? 'py-2.5' : 'py-3.5 md:py-5'
            }`}
          >
            <JasonAILockup showByline={!hasScrolled} />
            <motion.nav
              className="hidden items-center gap-6 text-sm font-semibold text-[#4f463c] md:flex"
              initial={false}
              animate={{ opacity: hasScrolled ? 1 : 0, y: hasScrolled ? 0 : -8, pointerEvents: hasScrolled ? 'auto' : 'none' }}
              transition={{ duration: 0.25 }}
            >
              <Link to="/jasonai#problem" className="hover:text-[#141414]">
                The problem
              </Link>
              <Link to="/jasonai/how-it-works" className="hover:text-[#141414]">
                How it works
              </Link>
              <Link to="/jasonai/questions" className="hover:text-[#141414]">
                Questions
              </Link>
              <Link to="/jasonai/privacy" className="hover:text-[#141414]">
                Privacy
              </Link>
            </motion.nav>
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2f2a24] sm:min-h-10 sm:px-4 sm:text-sm"
            >
              <span className="hidden sm:inline">Book review</span>
              <span className="sm:hidden">Review</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </header>

        <main>
          {page === 'landing' ? (
            <>
              <section className="border-b border-[#d9d2c3]">
                <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 md:px-8 md:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,0.7fr)] lg:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase text-[#9b3d1e]">Accepting new accounts</p>
                    <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] text-[#141414] md:text-7xl">
                      <ScrambleText text="Built around your business. Not the other way around." />
                    </h1>
                    <Reveal delay={0.18}>
                      <p className="mt-7 max-w-3xl text-lg leading-8 text-[#4f463c] md:text-xl md:leading-9">
                        JasonAI works inside the tools your team already uses - text, email, WhatsApp, and calls - and
                        keeps track of everything that matters. No new app. No new process. Built around the way you
                        already work.
                      </p>
                    </Reveal>
                    <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row" delay={0.28}>
                      <button
                        type="button"
                        onClick={() => setIsBookingOpen(true)}
                        className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f2a24]"
                      >
                        Book Your Free 15-Minute Business Review
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWaitlistOpen(true)}
                        className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-transparent px-5 py-3 text-sm font-semibold text-[#141414] hover:bg-white"
                      >
                        Not ready? Join the waitlist
                        <ArrowRight className="h-4 w-4" />
                      </button>
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
                  <Reveal className="hidden lg:block" delay={0.22}>
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

              <JasonAILandingLinks />
            </>
          ) : null}

          {page === 'how-it-works' ? (
            <>
              <JasonAISubpageIntro
                label="How it works"
                title="Built around the way your jobs already move."
                body="This is the deeper look at setup, the day-to-day use cases, and the business review intake. No new habits for the crew."
              />
              <HowItWorksSection />
              <UseCasesSection />
              <BusinessReviewSection onOpenBooking={() => setIsBookingOpen(true)} />
            </>
          ) : null}

          {page === 'questions' ? (
            <>
              <QuestionsHeroSection />
              <FaqSection />
              <WaitlistSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
            </>
          ) : null}

          {page === 'privacy' ? <JasonAIPrivacyPolicy /> : null}

          {page !== 'privacy' ? (
            <>
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

              <section className="bg-[#fffaf0]">
                <div className="mx-auto max-w-5xl px-5 py-16 text-center md:px-8 md:py-24">
                  <p className="text-sm font-semibold uppercase text-[#9b3d1e]">A B2W Product</p>
                  <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                    <ScrambleText text="Stop losing money on jobs you cannot track." />
                  </h2>
                  <Reveal>
                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#4f463c]">
                      Book a free 30-minute business review. We will look at how your job communication works right now and
                      where things are falling through. No pitch. No demo. Just a real conversation.
                    </p>
                  </Reveal>
                  <Reveal className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(true)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f2a24]"
                    >
                      Book My Free Business Review
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsWaitlistOpen(true)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#141414] bg-transparent px-5 py-3 text-sm font-semibold text-[#141414] hover:bg-white"
                    >
                      Just want updates? Join the waitlist
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Reveal>
                </div>
              </section>
            </>
          ) : null}
        </main>

        <JasonAIFooter page={page} />

        {hasScrolled && page !== 'privacy' ? (
          <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
            <div className="flex items-center gap-2 border border-[#d9d2c3] bg-white/92 p-2 shadow-[0_18px_60px_rgba(20,20,20,0.14)] backdrop-blur-md">
              <span className="hidden px-2 text-sm font-semibold text-[#6b6256] sm:inline">Want to test it early?</span>
              <button
                type="button"
                onClick={() => setIsWaitlistOpen(true)}
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#141414] bg-[#141414] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f2a24]"
              >
                Join the waitlist
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        <CalendlyModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      </div>
    </>
  );
}
