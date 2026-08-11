import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, MessageCircle, Radio, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import DescrambleText from '../../components/DescrambleText';
import { ButtonLink, CTASection, Eyebrow, SectionHeading, StatusBadge, pageWidth } from '../../components/site/PublicUI';

const productDefinition = [
  {
    index: '01',
    title: 'Ask in WhatsApp',
    signal: 'Works where owners work',
    body: 'Ask a plain-language question about a job, customer, vendor, or recent change without learning another dashboard.',
    status: 'Available now' as const,
    to: '/jasonai',
  },
  {
    index: '02',
    title: 'Use approved context',
    signal: 'Customer-controlled access',
    body: 'JasonAI searches only the business communication configured during guided setup, keeping the product focused on relevant context.',
    status: 'Available now' as const,
    to: '/products/pricing',
  },
  {
    index: '03',
    title: 'Get one clear answer',
    signal: '$99 / month · $2,000 setup',
    body: 'Turn scattered messages into a concise, reviewable summary so the responsible person can understand what changed and decide what happens next.',
    status: 'Available now' as const,
    to: '/products/pricing',
  },
];

const productFunctions = [
  {
    number: '01',
    title: 'Ask the business',
    body: 'Send JasonAI a natural-language question in WhatsApp instead of searching message threads one by one.',
  },
  {
    number: '02',
    title: 'Find job context',
    body: 'JasonAI searches the approved communication connected to the business and gathers the context relevant to the question.',
  },
  {
    number: '03',
    title: 'Summarize what matters',
    body: 'Receive a concise account of what was said, what changed, and what may need attention—ready for a responsible person to review.',
  },
];

const productCards = [
  {
    label: 'Personal chat',
    capability: 'Private summary',
    context: 'JasonAI · available in WhatsApp',
    sender: 'You',
    question: 'Summarize the Maple Street job from this week.',
    responseLabel: 'JasonAI',
    response: 'I found 14 approved messages and two call notes. The homeowner asked about a laundry sink, the permit question is still being discussed, and the crew confirmed Thursday’s arrival window.',
  },
  {
    label: 'Project group',
    capability: 'Communication search',
    context: 'Oakridge Project Group · 5 participants',
    sender: 'Maya · PM',
    question: 'Did we confirm the window delivery time? The owner is on-site.',
    responseLabel: 'JasonAI',
    response: 'Marco confirmed Thursday, 8–10 AM in the approved project-group history.',
  },
  {
    label: 'Daily brief',
    capability: 'Group summary',
    context: 'Oakridge Project Group · 5:30 PM',
    sender: 'Luis · Field',
    question: 'Demo photos are in. Walls are open and the crew is wrapping up.',
    responseLabel: 'JasonAI · Daily brief',
    response: 'Demo photos were posted at 4:42 PM. The laundry-sink question was discussed. Window delivery remains Thursday, 8–10 AM.',
  },
] as const;

function JasonAICardStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || isPaused) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % productCards.length), 5200);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  const selectCard = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  const moveCard = (direction: number) => {
    setActiveIndex((current) => (current + direction + productCards.length) % productCards.length);
    setIsPaused(true);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="JasonAI WhatsApp examples"
      className="overflow-hidden border border-white/15 bg-white/[.025] p-4 sm:p-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <div className="flex items-center justify-between border-b border-white/12 pb-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8fc2d7] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8fc2d7]" /></span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">JasonAI in WhatsApp</span>
        </div>
        <span className="font-mono text-[10px] text-white/35">0{activeIndex + 1}/03</span>
      </div>

      <div className="relative mb-5 mr-3 mt-5 grid sm:mr-5" aria-live="off">
        {productCards.map((card, index) => {
          const stackPosition = (index - activeIndex + productCards.length) % productCards.length;
          const isActive = stackPosition === 0;
          const stackStyle = [
            { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
            { x: 10, y: 10, scale: .985, rotate: .35, opacity: .82 },
            { x: 20, y: 20, scale: .97, rotate: .7, opacity: .58 },
          ][stackPosition];

          return (
            <motion.article
              key={card.label}
              initial={false}
              animate={reduceMotion ? { x: stackStyle.x, y: stackStyle.y, opacity: stackStyle.opacity } : stackStyle}
              transition={reduceMotion ? { duration: .1 } : { type: 'spring', stiffness: 230, damping: 28, mass: .8 }}
              aria-hidden={!isActive}
              className="relative min-h-[300px] overflow-hidden border border-white/15 bg-[#172027] p-5 [grid-area:1/1] sm:p-7"
              style={{ zIndex: 30 - stackPosition * 10, pointerEvents: isActive ? 'auto' : 'none', transformOrigin: '50% 100%', willChange: 'transform, opacity' }}
            >
              <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.07]" />
              <div className="relative flex items-start justify-between gap-5 border-b border-white/12 pb-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--b2w-rust)] text-white"><MessageCircle className="h-4 w-4" /></span>
                  <div className="min-w-0"><p className="font-semibold text-white">{card.label}</p><p className="truncate text-xs text-white/45">{card.context}</p></div>
                </div>
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#73c3a3]" aria-label="Online" />
              </div>
              <div className="relative grid gap-4 py-6 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:items-center">
                <motion.div
                  initial={false}
                  animate={isActive ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 10, filter: 'blur(6px)' }}
                  transition={{ duration: reduceMotion ? 0 : .36, delay: reduceMotion ? 0 : .12 }}
                  className="border border-white/12 bg-white/[.06] p-4"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-white/38">{card.sender}</p>
                  <p className="mt-3 text-sm leading-6 text-white/78">{card.question}</p>
                </motion.div>
                <motion.div
                  initial={false}
                  animate={isActive ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 12, filter: 'blur(8px)' }}
                  transition={{ duration: reduceMotion ? 0 : .42, delay: reduceMotion ? 0 : .48 }}
                  className="border-l-2 border-[#8fc2d7] bg-white p-4 text-[var(--b2w-ink)]"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[var(--b2w-rust)]">{card.responseLabel}</p>
                  <p className="mt-3 text-sm leading-6">{card.response}</p>
                </motion.div>
              </div>
              <div className="relative flex items-center justify-between gap-4 border-t border-white/12 pt-4">
                <p className="text-xs text-white/45"><span className="font-semibold text-[#8fc2d7]">{card.capability}</span> · Current capability</p>
                <p className="font-mono text-[10px] text-white/30">0{index + 1}</p>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button type="button" onClick={() => moveCard(-1)} aria-label="Show previous JasonAI example" className="grid h-10 w-10 shrink-0 place-items-center border border-white/18 text-white transition hover:border-[#8fc2d7] hover:text-[#8fc2d7]"><ChevronLeft className="h-4 w-4" /></button>
        <div className="flex flex-1 justify-center gap-2" role="group" aria-label="Choose a JasonAI example">
          {productCards.map((card, index) => (
            <button key={card.label} type="button" onClick={() => selectCard(index)} aria-pressed={activeIndex === index} aria-label={`Show ${card.label}`} className={`h-1.5 transition-[width,background-color] ${activeIndex === index ? 'w-10 bg-[#8fc2d7]' : 'w-5 bg-white/20 hover:bg-white/45'}`} />
          ))}
        </div>
        <button type="button" onClick={() => moveCard(1)} aria-label="Show next JasonAI example" className="grid h-10 w-10 shrink-0 place-items-center border border-white/18 text-white transition hover:border-[#8fc2d7] hover:text-[#8fc2d7]"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <p className="mt-2 text-center text-[10px] uppercase tracking-[.14em] text-white/28">{isPaused ? 'Manual view' : 'Examples rotate automatically'}</p>
    </div>
  );
}

export default function UnifiedHomePage() {
  return (
    <div className="min-h-screen bg-[var(--b2w-canvas)]">
      <Seo title="JasonAI — The AI Assistant for Contractor Operations" description="JasonAI helps contractor business owners ask questions of approved business communication and receive concise, reviewable answers in WhatsApp." canonicalPath="/" />

      <section className="relative overflow-hidden bg-[var(--b2w-ink)] pb-14 pt-28 text-white sm:pb-20 sm:pt-36">
        <div aria-hidden="true" className="b2w-grid-field absolute inset-0 opacity-[.08]" />
        <motion.div aria-hidden="true" className="absolute -right-36 top-20 h-[34rem] w-[34rem] rounded-full bg-[var(--b2w-rust)]/30 blur-[110px]" animate={{ scale: [1, 1.08, 1], opacity: [.5, .9, .5] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <div className={`${pageWidth} relative`}>
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1.08fr)_minmax(400px,.72fr)] xl:items-end">
            <div>
              <Eyebrow tone="rust"><DescrambleText text="B2W · Product company" animateOnMount delay={180} /></Eyebrow>
              <h1 className="mt-7 max-w-[10ch] text-6xl font-medium leading-[.86] tracking-[-0.072em] sm:text-8xl lg:text-[9.2rem]">Turn business noise into work that moves.</h1>
            </div>
            <div className="border-l border-white/18 pl-6 sm:pl-8">
              <p className="max-w-xl text-lg leading-8 text-white/68">B2W builds practical AI products for General Contracting businesses. JasonAI is our launch product—an assistant that finds useful job context in approved business communication and delivers a clear answer in WhatsApp.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/jasonai" variant="secondary" className="border-white bg-white text-[var(--b2w-ink)]">Meet JasonAI</ButtonLink>
                <ButtonLink to="mailto:info@b2w-ai.com" variant="tertiary" className="text-white hover:text-[#8fc2d7]">Book a founder review</ButtonLink>
              </div>
            </div>
          </div>
          <div className="mt-14"><JasonAICardStack /></div>
        </div>
      </section>

      <section className="border-b border-[var(--b2w-line)] bg-white">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="01 · Meet JasonAI" title="The AI assistant for the business behind the jobsite." description="JasonAI helps an owner ask questions of approved business communication, recover the context buried across job threads, and receive one concise answer in WhatsApp. It is one focused product with guided setup—not a consulting package." tone="rust" />
          <div className="grid gap-px border border-[var(--b2w-line)] bg-[var(--b2w-line)] lg:grid-cols-3">
            {productDefinition.map((item) => (
              <Link key={item.title} to={item.to} className="group flex min-h-[390px] flex-col bg-[var(--b2w-canvas)] p-6 transition hover:bg-[var(--b2w-rust-soft)] sm:p-8">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[var(--b2w-rust)]">{item.index}</span><StatusBadge stage={item.status} /></div>
                <h2 className="mt-14 text-4xl font-medium leading-none tracking-[-0.05em]">{item.title}</h2>
                <p className="mt-4 text-sm font-semibold text-[var(--b2w-rust-dark)]">{item.signal}</p>
                <p className="mt-6 text-sm leading-7 text-[var(--b2w-ink-muted)]">{item.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pageWidth} py-16 sm:py-24`}>
        <SectionHeading index="02 · JasonAI functionality" title="Ask. Find. Understand. Move the job forward." description="JasonAI turns scattered business communication into reviewable operating context. The product follows one clear sequence from the owner’s question to a useful answer." />
        <div className="border-y border-[var(--b2w-line)]">
          {productFunctions.map((item) => (
            <article key={item.number} className="grid gap-6 border-b border-[var(--b2w-line)] py-8 last:border-0 lg:grid-cols-[100px_260px_minmax(0,1fr)_auto] lg:items-center">
              <span className="font-mono text-xs text-[var(--b2w-ink-faint)]">{item.number}</span>
              <h2 className="text-3xl font-medium tracking-[-0.04em]">{item.title}</h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--b2w-ink-muted)]">{item.body}</p>
              <Link to="/jasonai" className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--b2w-rust)]">See JasonAI <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)]">
        <div className={`${pageWidth} py-16 sm:py-24`}>
          <SectionHeading index="03 · Product architecture" title="Build the trust ladder before the platform." description="The long-term plan is ambitious. The public identity stays honest by showing what is live, what must be proven next, and what belongs to the future." tone="rust" />
          <div className="grid gap-px border border-[var(--b2w-line)] bg-[var(--b2w-line)] lg:grid-cols-3">
            {[
              ['Now', 'JasonAI', 'Administrative assistant', 'Communication search, job summaries, WhatsApp delivery, and founder-led setup.', 'Available now'],
              ['Next', 'Clara direction', 'Management agent', 'Defined workflows, reviewed outputs, source-linked reporting, and management visibility.', 'In development'],
              ['Potential', 'Connected system', 'Governed agent platform', 'Role-based agents, performance tracking, risk controls, reporting, and operating insight.', 'Future'],
            ].map(([horizon, name, role, body, stage]) => (
              <article key={horizon} className={`min-h-[420px] p-7 sm:p-8 ${horizon === 'Now' ? 'bg-[var(--b2w-rust-dark)] text-white' : 'bg-white'}`}>
                <div className="flex items-center justify-between gap-4"><p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${horizon === 'Now' ? 'text-[#8fc2d7]' : 'text-[var(--b2w-ink-faint)]'}`}>{horizon}</p><StatusBadge stage={stage as 'Available now' | 'In development' | 'Future'} /></div>
                <p className={`mt-16 text-sm font-semibold ${horizon === 'Now' ? 'text-[#8fc2d7]' : 'text-[var(--b2w-rust)]'}`}>{role}</p>
                <h2 className="mt-3 text-4xl font-medium tracking-[-0.05em]">{name}</h2>
                <p className={`mt-6 text-sm leading-7 ${horizon === 'Now' ? 'text-white/65' : 'text-[var(--b2w-ink-muted)]'}`}>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pageWidth} py-16 sm:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <Eyebrow tone="plum">Interaction principle</Eyebrow>
            <h2 className="mt-5 max-w-[13ch] text-5xl font-medium leading-[.95] tracking-[-0.055em] sm:text-7xl">Every useful output passes through a person.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--b2w-ink-muted)]">The strongest idea from Clara becomes a rule for all of B2W: capture one clear input, show the transformation, make review visible, and end with one practical next action.</p>
          </div>
          <div className="grid gap-px border border-[var(--b2w-line)] bg-[var(--b2w-line)] sm:grid-cols-2">
            {[
              [MessageCircle, 'Capture', 'Start with the words, records, and decisions the business already has.'],
              [Radio, 'Structure', 'Show what the system found and how it organized the evidence.'],
              [ShieldCheck, 'Review', 'Keep responsibility with the owner, operator, or project manager.'],
              [Check, 'Use', 'Deliver one understandable output inside the next real business action.'],
            ].map(([Icon, title, body]) => (
              <article key={String(title)} className="min-h-56 bg-white p-6"><Icon className="h-5 w-5 text-[var(--b2w-plum)]" /><h3 className="mt-10 text-2xl font-medium tracking-[-0.035em]">{String(title)}</h3><p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{String(body)}</p></article>
            ))}
          </div>
        </div>
      </section>

      <CTASection eyebrow="Start with JasonAI" title="Ask the question your messages should already answer." description="See whether JasonAI can recover the context your team needs, then configure the approved communication it can use through a guided WhatsApp setup." action={{ label: 'Book a founder review', to: 'mailto:info@b2w-ai.com', variant: 'product' }} secondary={{ label: 'See product workflows', to: '/products/workflows' }} tone="rust" />
    </div>
  );
}
