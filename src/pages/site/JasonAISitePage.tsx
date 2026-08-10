import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, MessageCircle, MessageSquareText, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { ButtonLink, CTASection, EvidenceBlock, PageIntro, SectionHeading, StatusBadge, pageWidth } from '../../components/site/PublicUI';
import { workflows } from '../../content/unifiedSite';
import { trackSiteEvent } from '../../lib/siteAnalytics';

type JasonAIPageName = 'overview' | 'how-it-works' | 'questions' | 'privacy';

const problems = [
  ['A decision was made on a call, but nobody recorded it.', '/images/jasonai/call-agreement.jpg'],
  ['A technician handled extra work, but nobody billed it.', '/images/jasonai/unbilled-extra.jpg'],
  ['The PM uses WhatsApp, the technician texts, and the customer emails.', '/images/jasonai/scattered-communication.jpg'],
  ['An owner rereads weeks of messages to understand one job.', '/images/jasonai/sunday-night.jpg'],
] as const;

const steps = [
  ['Understand the operation', 'B2W reviews how the team communicates, how jobs move, which sources may be approved, and where information recovery breaks down.'],
  ['Configure the boundary', 'JasonAI is set up around the agreed sources and the current search-and-summary workflow. The business controls what is connected.'],
  ['Search through WhatsApp', 'A team member asks for prior job context or a summary without learning another heavy dashboard.'],
  ['Review before action', 'The responsible person reviews important job, billing, safety, legal, or customer information before acting.'],
] as const;

const questions = [
  ['Is this another app my team has to use?', 'The current workflow is designed for WhatsApp. The team can search approved communication and request summaries without adopting a new project dashboard.'],
  ['What sources can JasonAI review?', 'Setup begins with sources the business approves, which may include selected WhatsApp groups, email threads, text flows, call notes, or forwarded job communication. Availability depends on the agreed implementation.'],
  ['Does JasonAI replace Jobber, ServiceTitan, or Buildertrend?', 'No. JasonAI helps recover and summarize the unstructured communication around the formal project record. It is not positioned as a replacement for existing systems of record.'],
  ['What is available now?', 'Communication search and job or thread summaries are available now. Action-item extraction, structured status reporting, and source-linked answers are in development.'],
  ['What does it cost?', 'JasonAI is $99 per month. The WhatsApp integration and founder-led onboarding carry a one-time $2,000 setup fee. Custom contracting workflows begin with a founder consultation and are scoped separately.'],
  ['Will AI make decisions for my business?', 'No. JasonAI supports information recovery and review. People remain responsible for consequential job, billing, safety, legal, contractual, and customer decisions.'],
  ['Can I control what it sees?', 'Yes. The customer chooses approved sources and can ask B2W to add, remove, pause, or limit connected sources.'],
  ['Is customer content sold or used for advertising?', 'No. B2W does not sell JasonAI customer communications or use them for targeted advertising.'],
] as const;

const privacySections = [
  {
    title: 'Scope and information',
    paragraphs: [
      'This privacy notice covers the JasonAI website, interest and fit-review forms, onboarding, support, and the JasonAI service operated by B2W.',
      'Information may include business contact details, support and commercial records, website usage data, and the job communication or connected-source metadata a customer authorizes JasonAI to process.',
    ],
  },
  {
    title: 'Approved sources and purpose',
    paragraphs: [
      'Customers control which communication sources JasonAI is allowed to review. B2W uses approved information to configure and operate search and summary workflows, provide support, maintain security, and improve product reliability.',
      'New capabilities are not silently enabled. A customer may ask B2W to add, remove, pause, or limit connected sources.',
    ],
  },
  {
    title: 'AI processing and human review',
    paragraphs: [
      'JasonAI uses AI systems to classify, search, organize, and summarize approved communication. Generated results may be incomplete or incorrect.',
      'Customers remain responsible for reviewing important job, billing, safety, legal, contractual, and customer decisions before acting on them. B2W does not use customer content to train public AI models unless separately agreed in writing.',
    ],
  },
  {
    title: 'Sharing and commercial boundaries',
    paragraphs: [
      'B2W may use service providers for hosting, database, security, email, scheduling, AI processing, support, and authorized integrations. Those providers are expected to use information only to provide their services.',
      'B2W does not sell fieldwork communication, job data, customer records, or crew activity, and does not use JasonAI customer content for targeted advertising.',
    ],
  },
  {
    title: 'Retention, access, and security',
    paragraphs: [
      'Information is retained as needed to provide the service, support accounts, maintain security, meet contractual or legal obligations, and resolve disputes. Customers may request access, correction, deletion, export, or source changes, subject to verification and lawful retention requirements.',
      'B2W uses reasonable administrative, technical, and organizational safeguards, including access controls and secure hosting practices. No system is perfectly secure.',
    ],
  },
  {
    title: 'Sensitive information and notices',
    paragraphs: [
      'JasonAI is intended for business and fieldwork communication. Customers should not intentionally send highly sensitive information unless B2W has expressly agreed in writing to handle it.',
      'Customer administrators are responsible for appropriate team access and for providing workers, customers, subcontractors, or other participants with any notice or choice required for their use of JasonAI.',
    ],
  },
  {
    title: 'Questions and requests',
    paragraphs: [
      'Depending on location, individuals may have rights to know, access, correct, delete, or receive a copy of certain personal information. For privacy questions or requests, contact info@b2w-ai.com.',
      'B2W may update this notice as JasonAI changes and will make material changes clear on this page.',
    ],
  },
] as const;

function JasonAISubnav({ active }: { active: JasonAIPageName }) {
  const items = [
    ['overview', 'Overview', '/jasonai'],
    ['how-it-works', 'How It Works', '/jasonai/how-it-works'],
    ['questions', 'Questions', '/jasonai/questions'],
    ['privacy', 'Privacy', '/jasonai/privacy'],
  ] as const;
  return (
    <nav aria-label="JasonAI sections" className="sticky top-20 z-30 border-y border-[var(--b2w-line)] bg-[color:rgba(246,243,236,.94)] backdrop-blur-xl">
      <div className={`${pageWidth} flex gap-1 overflow-x-auto py-2`}>
        {items.map(([id, label, to]) => <Link key={id} to={to} aria-current={active === id ? 'page' : undefined} className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${active === id ? 'bg-[var(--b2w-rust-dark)] text-white' : 'text-[var(--b2w-ink-muted)] hover:bg-white'}`}>{label}</Link>)}
      </div>
    </nav>
  );
}

const demoSteps = [
  { label: 'Ask', title: 'Owner asks in WhatsApp', body: '“Summarize Maple Avenue from this week. What still needs my attention?”' },
  { label: 'Search', title: 'JasonAI checks approved context', body: '14 messages and two call notes match the approved job and time period.' },
  { label: 'Summarize', title: 'The record becomes useful', body: 'Arrival was confirmed. A laundry-sink request was discussed. The permit question remains open.' },
  { label: 'Review', title: 'The owner stays responsible', body: 'The summary supports the next call; it does not approve scope, pricing, or contractual action.' },
] as const;

function ConversationDemo() {
  const [step, setStep] = useState(0);
  const current = demoSteps[step];

  return (
    <div className="overflow-hidden border border-[var(--b2w-line)] bg-white shadow-[var(--b2w-shadow)]">
      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="bg-[var(--b2w-rust-dark)] p-6 text-white sm:p-8">
          <MessageCircle className="h-6 w-6 text-[#8fc2d7]" />
          <p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8fc2d7]">Live interaction model</p>
          <h3 className="mt-4 text-3xl font-medium tracking-[-0.045em]">One question. One reviewable answer.</h3>
          <div className="mt-10 space-y-2">
            {demoSteps.map((item, index) => <button key={item.label} type="button" onClick={() => setStep(index)} className={`flex min-h-11 w-full items-center justify-between border-b border-white/12 text-left text-xs transition ${step === index ? 'text-white' : 'text-white/35 hover:text-white/65'}`}><span>{item.label}</span><span className="font-mono">0{index + 1}</span></button>)}
          </div>
        </aside>
        <div className="relative min-h-[430px] overflow-hidden bg-[#edf3f5] p-6 sm:p-10">
          <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-35" />
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .35 }} className="relative mx-auto max-w-xl">
              <div className={`max-w-md p-5 shadow-sm ${step === 0 ? 'ml-auto bg-[#d8f2d0]' : 'bg-white'}`}>
                <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--b2w-rust)]">{current.label}</p>
                <h4 className="mt-4 text-2xl font-medium tracking-[-0.04em]">{current.title}</h4>
                <p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{current.body}</p>
              </div>
              <div className="mt-6 flex justify-between gap-3">
                <button type="button" onClick={() => setStep((currentStep) => Math.max(0, currentStep - 1))} disabled={step === 0} className="min-h-10 px-3 text-xs font-semibold text-[var(--b2w-ink-muted)] disabled:opacity-25">Previous</button>
                <button type="button" onClick={() => setStep((currentStep) => (currentStep + 1) % demoSteps.length)} className="inline-flex min-h-10 items-center gap-2 bg-[var(--b2w-ink)] px-4 text-xs font-semibold text-white">{step === demoSteps.length - 1 ? 'Restart' : 'Next'}<ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function OverviewPage() {
  return (
    <>
      <PageIntro eyebrow="JasonAI · The B2W Assistant" title="Ask the business what happened—without rereading every message." description="JasonAI searches the communication your company approves and turns long job threads into concise summaries through WhatsApp. It is $99 per month, with a one-time $2,000 WhatsApp integration and onboarding fee." primary={{ label: 'Book a founder review', to: '/contact?type=jasonai', variant: 'product' }} secondary={{ label: 'Review pricing', to: '/products/pricing' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white"><div className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="01 · Interaction" title="The user experience is the product strategy." description="JasonAI works in a channel contractor teams already use. One clear question becomes one visible search, one concise answer, and one human review." tone="rust" /><ConversationDemo /></div></section>
      <section className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="02 · Business problem" title="The context exists. The cost is finding it in time." description="The first product wedge focuses on an observable contractor workflow: recovering what was said, what changed, and what still needs attention." tone="rust" /><div className="grid gap-px border border-[var(--b2w-line)] bg-[var(--b2w-line)] sm:grid-cols-2 lg:grid-cols-4">{problems.map(([text, image]) => <article key={text} className="overflow-hidden bg-[var(--b2w-canvas)]"><img src={image} alt="" className="h-48 w-full object-cover grayscale transition duration-500 hover:grayscale-0" loading="lazy" /><p className="p-6 text-lg font-medium leading-7 tracking-[-0.025em]">{text}</p></article>)}</div></section>
      <section className="border-y border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)]"><div className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="03 · Product boundary" title="Useful now. More capable only as trust grows." description="Every workflow carries a stage so the current assistant does not borrow credibility from the future platform." tone="rust" /><div className="grid gap-px border border-[var(--b2w-line)] bg-[var(--b2w-line)] md:grid-cols-2 lg:grid-cols-3">{workflows.map((workflow) => <article key={workflow.title} className="min-h-72 bg-white p-6"><div className="flex justify-between gap-4"><MessageSquareText className="h-5 w-5 text-[var(--b2w-rust)]" /><StatusBadge stage={workflow.stage} /></div><h3 className="mt-10 text-xl font-semibold tracking-[-0.025em]">{workflow.title}</h3><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{workflow.outcome}</p></article>)}</div></div></section>
      <section className={`${pageWidth} py-16 sm:py-24`}><SectionHeading index="04 · Trust" title="Access, evidence, and responsibility stay visible." description="JasonAI supports judgment. It does not quietly turn a helpful answer into an authorized decision." tone="green" /><div className="grid gap-5 md:grid-cols-3"><EvidenceBlock label="Approved access">The customer chooses the sources JasonAI may review and can request that access be changed.</EvidenceBlock><EvidenceBlock label="Source-aware direction">Source-linked answers are in development and are not presented as a current capability.</EvidenceBlock><EvidenceBlock label="Human responsibility">People review consequential job, billing, safety, legal, contractual, and customer decisions.</EvidenceBlock></div><ButtonLink to="/jasonai/privacy" variant="secondary" className="mt-8">Read the privacy model</ButtonLink></section>
      <CTASection eyebrow="Start with one question" title="Which job question costs your team the most time to answer?" description="A founder review maps that question to the approved sources, the current product boundary, and the WhatsApp setup required to make the first workflow useful." action={{ label: 'Book a JasonAI review', to: '/contact?type=jasonai', variant: 'product' }} secondary={{ label: 'See how setup works', to: '/jasonai/how-it-works' }} tone="rust" />
    </>
  );
}

function HowItWorksPage() {
  return (
    <>
      <PageIntro eyebrow="JasonAI · How It Works" title="Configure around the operation, then keep the interaction simple." description="The current experience begins with an approved source boundary and ends with a person reviewing the retrieved context or summary." primary={{ label: 'Request a fit review', to: '/contact?type=jasonai', variant: 'product' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white"><div className={`${pageWidth} py-16 sm:py-24`}><div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-line)] lg:grid-cols-4">{steps.map(([title, body], index) => <article key={title} className={`min-h-[360px] p-7 ${index === 2 ? 'bg-[var(--b2w-rust-dark)] text-white' : 'bg-[var(--b2w-canvas)]'}`}><p className={`font-mono text-[10px] ${index === 2 ? 'text-[var(--b2w-gold)]' : 'text-[var(--b2w-gold-dark)]'}`}>0{index + 1}</p>{index === 2 ? <Search className="mt-14 h-6 w-6 text-[var(--b2w-gold)]" /> : <ShieldCheck className="mt-14 h-6 w-6 text-[var(--b2w-rust)]" />}<h2 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">{title}</h2><p className={`mt-4 text-sm leading-7 ${index === 2 ? 'text-white/65' : 'text-[var(--b2w-ink-muted)]'}`}>{body}</p></article>)}</div><div className="mt-6 grid gap-5 md:grid-cols-2"><EvidenceBlock label="Current endpoint">A useful answer or summary in WhatsApp that a responsible team member can review.</EvidenceBlock><EvidenceBlock label="Current limitation">JasonAI does not independently authorize work, change scope, commit money, or make contractual decisions.</EvidenceBlock></div></div></section>
      <CTASection eyebrow="Next step" title="Map the first question your team needs answered faster." description="B2W will use that question to test source fit, implementation scope, and whether the current release can provide measurable value." action={{ label: 'Discuss the first workflow', to: '/contact?type=jasonai', variant: 'product' }} tone="rust" />
    </>
  );
}

function QuestionsPage() {
  return (
    <>
      <PageIntro eyebrow="JasonAI · Questions" title="Direct answers about fit, access, boundaries, and price." description="The questions page is designed to resolve uncertainty before asking for a commercial commitment." primary={{ label: 'Book a founder review', to: '/contact?type=jasonai', variant: 'product' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white"><div className={`${pageWidth} py-16 sm:py-24`}><div className="mx-auto max-w-4xl divide-y divide-[var(--b2w-line)] border-y border-[var(--b2w-line)]">{questions.map(([question, answer]) => <details key={question} className="group py-2"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold tracking-[-0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)]"><span>{question}</span><span className="text-2xl font-light text-[var(--b2w-rust)] transition group-open:rotate-45">+</span></summary><p className="max-w-3xl pb-6 text-sm leading-7 text-[var(--b2w-ink-muted)]">{answer}</p></details>)}</div><div className="mx-auto mt-10 max-w-4xl"><EvidenceBlock label="Still unsure?">Ask B2W directly. A fit review should make the current product boundary clearer—not pressure the business into a broader claim.</EvidenceBlock></div></div></section>
      <CTASection eyebrow="Advance" title="Bring the communication problem to a fit review." description="Share the source, the job question, and the people who need the answer. B2W will explain what is current, what needs setup, and what remains in development." action={{ label: 'Contact B2W about JasonAI', to: '/contact?type=jasonai', variant: 'product' }} secondary={{ label: 'Review privacy', to: '/jasonai/privacy' }} tone="rust" />
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="JasonAI · Privacy" title="The customer controls access. People remain accountable for action." description="This page explains the current data boundary in plain language. It is a product and trust statement, not a claim that any system can eliminate risk." primary={{ label: 'Ask a privacy question', to: '/contact?type=general&focus=JasonAI%20privacy', variant: 'product' }} tone="rust" />
      <section className="border-y border-[var(--b2w-line)] bg-white"><div className={`${pageWidth} py-16 sm:py-24`}><div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]"><aside className="lg:sticky lg:top-36 lg:self-start"><ShieldCheck className="h-7 w-7 text-[var(--b2w-rust)]" /><p className="mt-5 text-sm leading-7 text-[var(--b2w-ink-muted)]">Effective August 1, 2026. JasonAI is operated by B2W LLC. Contact info@b2w-ai.com for access, correction, deletion, export, source-control, or security requests.</p></aside><div className="space-y-4">{privacySections.map((section, index) => <section key={section.title} className="rounded-[1.5rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] p-6 sm:p-8"><p className="font-mono text-[9px] text-[var(--b2w-gold-dark)]">{String(index + 1).padStart(2, '0')}</p><h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{paragraph}</p>)}</section>)}</div></div></div></section>
      <CTASection eyebrow="Privacy request" title="Ask what JasonAI can access before approving a source." description="B2W will explain the proposed source boundary, the current workflow, and the human-review expectation during setup." action={{ label: 'Contact B2W about privacy', to: '/contact?type=general&focus=JasonAI%20privacy', variant: 'product' }} tone="rust" />
    </>
  );
}

export default function JasonAISitePage({ page = 'overview' }: { page?: JasonAIPageName }) {
  const metadata = {
    overview: ['JasonAI for Contractor Communication', 'JasonAI searches approved contractor communication and creates concise job summaries through WhatsApp.', '/jasonai'],
    'how-it-works': ['How JasonAI Works', 'See how JasonAI is configured around approved communication, used through WhatsApp, and kept inside a human-review boundary.', '/jasonai/how-it-works'],
    questions: ['JasonAI Questions', 'Direct answers about JasonAI fit, access, current capability, privacy, setup, and pricing.', '/jasonai/questions'],
    privacy: ['JasonAI Privacy and Data Controls', 'How B2W handles approved communication, AI processing, user control, retention, security, and human review for JasonAI.', '/jasonai/privacy'],
  } as const;
  const [title, description, canonicalPath] = metadata[page];

  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]" onClick={(event) => {
      const target = event.target as HTMLElement;
      if (target.closest('a[href*="contact"]')) trackSiteEvent('jasonai_interest_selected', { page });
    }}>
      <Seo title={title} description={description} canonicalPath={canonicalPath} />
      <JasonAISubnav active={page} />
      {page === 'overview' ? <OverviewPage /> : null}
      {page === 'how-it-works' ? <HowItWorksPage /> : null}
      {page === 'questions' ? <QuestionsPage /> : null}
      {page === 'privacy' ? <PrivacyPage /> : null}
    </div>
  );
}
