import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Download,
  Eye,
  FileText,
  Lock,
  MessageSquareText,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import {
  projectPageShellClassName,
  projectPageHeaderClassName,
} from '../../components/projectPageLayout';
import { getUyghurEatsRoutes } from './uyghurEatsRoutes';

/* ─── FieldBoss Logo (derived from B2W mark) ────────────── */

/**
 * The B2W base shape, re-centered in a tighter viewBox.
 * Added: a subtle crosshair/signal element behind the mark
 * to distinguish FieldBoss as the AI product layer.
 */
function FieldBossIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="20 14 56 62"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Crosshair — AI signal */}
      <line x1="48" y1="18" x2="48" y2="72" stroke="currentColor" strokeOpacity={0.22} strokeWidth={0.9} />
      <line x1="24" y1="45" x2="72" y2="45" stroke="currentColor" strokeOpacity={0.22} strokeWidth={0.9} />
      <circle cx="48" cy="45" r="18" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.8} />
      {/* B2W base mark */}
      <path
        d="M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z"
        fill="currentColor"
        fillOpacity={0.92}
      />
    </svg>
  );
}

/* ─── Data ───────────────────────────────────────────────── */

const suggestionChips = [
  {
    id: 'evaluate' as const,
    label: 'Evaluate my business.',
    icon: Sparkles,
  },
  {
    id: 'risks' as const,
    label: 'Show me the selling risks.',
    icon: MessageSquareText,
  },
  {
    id: 'package' as const,
    label: 'Package my assets and SOPs.',
    icon: FileText,
  },
] as const;

type ChipId = (typeof suggestionChips)[number]['id'];

const scriptedReplies: Record<
  ChipId,
  { lines: string[]; blurredValue?: string; basis?: string[] }
> = {
  evaluate: {
    lines: [
      'I can build you an evaluation right now. It\u2019s based on three things:',
      'First, your normalized earnings after we strip out one-time and owner-specific expenses. Second, comparable restaurant sales in the DC metro area. Third, how transfer-ready the business actually is \u2014 documentation, lease status, and operational handoff difficulty.',
    ],
    blurredValue: '$XXX,XXX \u2013 $XXX,XXX',
    basis: [
      'Normalized seller discretionary earnings',
      'Comparable restaurant transactions within 15 miles',
      'Transfer readiness and documentation quality',
    ],
  },
  risks: {
    lines: [
      'Three risks that will come up in any serious buyer conversation:',
      'Lease transfer \u2014 your lease assignment language is ambiguous, and a buyer can\u2019t close without a clean transfer or a fresh agreement from the landlord.',
      'Key-person dependency \u2014 the hand-pull noodle technique is reputation-critical and currently tied to one individual.',
      'Revenue concentration \u2014 85% dine-in exposure means a single external disruption (construction, pandemic, weather) hits topline directly.',
    ],
  },
  package: {
    lines: [
      'Here\u2019s what a buyer will want to see organized and ready:',
      'Equipment and fixtures inventory, vendor and supplier contacts, POS configuration, staffing overview with wages and tenure, health and alcohol permits, recipe documentation for signature items, and a daily/weekly operations checklist.',
    ],
  },
};

/* ─── Typewriter hook ────────────────────────────────────── */

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

function TypewriterBubble({
  text,
  delay = 0,
  onFinished,
}: {
  text: string;
  delay?: number;
  onFinished?: () => void;
}) {
  const [started, setStarted] = useState(false);
  const { displayed, done } = useTypewriter(started ? text : '', 14);
  const didNotify = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (done && onFinished && !didNotify.current) {
      didNotify.current = true;
      onFinished();
    }
  }, [done, onFinished]);

  if (!started) {
    return (
      <div className="mr-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50">
        <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-cyan-200/40" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mr-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50"
    >
      {displayed}
      {!done && (
        <span className="ml-0.5 inline-block h-[1.15em] w-[2px] translate-y-[0.15em] animate-pulse bg-cyan-200" />
      )}
    </motion.div>
  );
}

/* ─── Document preview modal ─────────────────────────────── */

function DocumentPreviewModal({
  isOpen,
  onClose,
  selectedChip,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedChip: ChipId | null;
}) {
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen || !selectedChip) return null;
  const reply = scriptedReplies[selectedChip];

  const docTitle =
    selectedChip === 'evaluate'
      ? 'Business Evaluation Summary'
      : selectedChip === 'risks'
        ? 'Selling Risk Assessment'
        : 'Asset & SOP Inventory';
  const docFile =
    selectedChip === 'evaluate'
      ? 'Evaluation Summary.pdf'
      : selectedChip === 'risks'
        ? 'Risk Assessment.pdf'
        : 'Asset Package.pdf';

  return (
    <AnimatePresence>
      <motion.div
        key="doc-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/10 bg-[#08131b] shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#08131b]/95 backdrop-blur-md px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-cyan-200">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{docFile}</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">
                  AI-generated document
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSignUp(true)}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
              >
                <Download className="h-3.5 w-3.5" />
                Download
                <Lock className="h-3 w-3 text-slate-500 group-hover:text-cyan-200" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* White document body */}
          <div className="p-6 sm:p-10">
            <div className="border border-black/30 bg-white p-8 text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between border-b border-neutral-200 pb-5">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                    B2W {selectedChip === 'evaluate' ? 'evaluation brief' : selectedChip === 'risks' ? 'risk report' : 'asset package'}
                  </p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight">{docTitle}</h3>
                </div>
                {reply.blurredValue && (
                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                      Indicative range
                    </p>
                    <p className="mt-2 text-lg font-semibold blur-[5px] select-none">
                      {reply.blurredValue}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-5 text-sm leading-6 text-neutral-700">
                <p>{reply.lines[0]}</p>
                {reply.lines.slice(1).map((line, i) => (
                  <p key={i} className="blur-[3px] select-none">{line}</p>
                ))}
                {reply.basis && (
                  <div className="grid gap-3 md:grid-cols-3 blur-[3px] select-none">
                    {reply.basis.map((item) => (
                      <div key={item} className="border border-neutral-200 p-3">
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">Basis</p>
                        <p className="mt-2 font-medium text-black">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-4 blur-[4px] select-none">
                  <div className="border border-neutral-200 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">Detail</p>
                    <p className="mt-2">Market positioning, efficiency metrics, and comparable benchmarks within a 15-mile radius of the subject property.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-neutral-200 pt-5">
                <Lock className="h-4 w-4 text-neutral-400" />
                <p className="text-xs text-neutral-500">Full document available after FieldBoss AI activation</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-between border-t border-white/10 bg-[#08131b]/95 backdrop-blur-md px-6 py-4">
            <p className="text-sm text-slate-400">Preview only &mdash; sign up to unlock.</p>
            <button
              type="button"
              onClick={() => setShowSignUp(true)}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-300/15"
            >
              Unlock with FieldBoss
            </button>
          </div>
        </motion.div>

        {/* Sign-up overlay */}
        <AnimatePresence>
          {showSignUp && (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowSignUp(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.96 }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                className="w-full max-w-md border border-white/15 bg-[#08131b] p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-cyan-200">
                    <FieldBossIcon size={28} />
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white">Activate FieldBoss AI</h3>
                    <p className="text-xs text-slate-400">
                      Unlock full documents, downloads, and the buyer-prospect agent
                    </p>
                  </div>
                </div>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowSignUp(false); }}>
                  <input type="text" placeholder="Your name" required className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-300/40" />
                  <input type="email" placeholder="Work email" required className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-300/40" />
                  <input type="text" placeholder="Company name" className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-300/40" />
                  <button type="submit" className="w-full rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200">
                    Request Access
                  </button>
                  <p className="text-center text-[10px] text-slate-500">We&rsquo;ll follow up within 24 hours.</p>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

/* ────────────────────────────── Main page ────────────────── */

export default function UyghurEatsFieldBossChatbotPage() {
  const routes = getUyghurEatsRoutes();
  const [selectedChip, setSelectedChip] = useState<ChipId | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [showBasisCards, setShowBasisCards] = useState(false);
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const reply = selectedChip ? scriptedReplies[selectedChip] : null;
  const currentLines = reply ? reply.lines.slice(0, lineIndex + 1) : [];

  const handleChipClick = useCallback((id: ChipId) => {
    setSelectedChip(id);
    setLineIndex(0);
    setShowBasisCards(false);
    setShowDocPreview(false);
  }, []);

  const handleLineFinished = useCallback(() => {
    if (!reply) return;
    if (lineIndex < reply.lines.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      if (reply.basis) setTimeout(() => setShowBasisCards(true), 300);
      setTimeout(() => setShowDocPreview(true), reply.basis ? 900 : 400);
    }
  }, [lineIndex, reply]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [lineIndex, showBasisCards, showDocPreview]);

  const navItems: ClientNavAction[] = [
    { label: 'Proposal', to: routes.proposal },
    { label: 'Profile', to: routes.profile },
    { label: 'Valuation', to: routes.valuation },
    { label: 'Documentation', to: routes.dataRoom },
    { label: 'Terms', to: routes.terms },
    { label: 'FieldBoss AI', to: routes.fieldBossChatbot, type: 'link' },
  ];

  const docFile =
    selectedChip === 'evaluate'
      ? 'Evaluation Summary.pdf'
      : selectedChip === 'risks'
        ? 'Risk Assessment.pdf'
        : 'Asset Package.pdf';

  return (
    <div className="min-h-screen bg-[#061017] text-white selection:bg-cyan-200/20 selection:text-white">
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(circle at 12% 14%, rgba(93,197,255,0.1), transparent 28%), radial-gradient(circle at 84% 12%, rgba(241,196,91,0.08), transparent 24%), linear-gradient(180deg, #061017 0%, #07131b 52%, #061017 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <ClientNavbar
        clientName="Uyghur Eats"
        clientLink={routes.proposal}
        navItems={navItems}
        theme="dark"
      />

      <article className={`${projectPageShellClassName} relative z-10 text-white`}>
        {/* ──── Hero ──── */}
        <header className={`${projectPageHeaderClassName} border-white/10 pb-10`}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch lg:gap-6">
            <div className="grid content-start gap-3">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-300/70"
                >
                  <FieldBossIcon size={16} className="text-cyan-200" />
                  FieldBoss AI
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04, duration: 0.45 }}
                  className="max-w-[14ch] text-[2.2rem] font-medium leading-[0.98] tracking-tight text-white sm:max-w-none sm:text-5xl md:text-6xl"
                >
                  Your AI advisor for selling&nbsp;readiness.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.45 }}
                  className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-xl md:leading-8"
                >
                  Choose a topic below. FieldBoss walks through the analysis, surfaces the key numbers,
                  and generates a document you can preview before you commit to anything.
                </motion.p>
              </div>
            </div>

            {/* Aside */}
            <aside className="flex h-full flex-col border border-white/10 bg-[#08131b] p-5 text-white sm:p-6 md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-300/70">
                What to expect
              </p>
              <h2 className="mb-5 max-w-md text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl md:mb-6 md:text-3xl">
                See the answer, preview the document, then decide.
              </h2>
              <div className="mt-auto space-y-3 border-y border-white/10 py-4 md:py-5">
                {[
                  'Pick one of three prompts. No free-form required.',
                  'The AI builds its answer live with a typewriter animation.',
                  'Key financials stay blurred. The full PDF is previewable but locked until you activate.',
                ].map((step, i) => (
                  <p key={i} className="text-sm leading-6 text-slate-300">
                    <span className="mr-2 text-cyan-300/60">{String(i + 1).padStart(2, '0')}</span>
                    {step}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </header>

        {/* ──── Chat landing ──── */}
        <section className="mb-10 border border-white/10 bg-[linear-gradient(180deg,rgba(8,19,27,0.9),rgba(9,18,26,0.76))] px-6 py-12 sm:px-10 sm:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center text-cyan-200">
              <FieldBossIcon size={32} />
            </div>
            <h2 className="mt-5 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              What can I help with?
            </h2>

            {/* Chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {suggestionChips.map((chip) => {
                const Icon = chip.icon;
                const isActive = selectedChip === chip.id;
                return (
                  <motion.button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipClick(chip.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-medium tracking-tight transition-all ${
                      isActive
                        ? 'border-cyan-300/50 bg-cyan-300/15 text-white shadow-[0_0_28px_rgba(103,232,249,0.12)]'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-200' : 'text-slate-500'}`} />
                    {chip.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──── Chat area ──── */}
        <AnimatePresence mode="wait">
          {selectedChip && reply && (
            <motion.section
              key={selectedChip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mb-12"
            >
              <div className="border border-white/10 bg-[#08131b]">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-200">
                      <FieldBossIcon size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">FieldBoss</p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Analyzing</p>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                    Live demo
                  </div>
                </div>

                {/* Body */}
                <div
                  ref={chatContainerRef}
                  className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-4"
                >
                  {/* User message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-auto max-w-[88%] rounded-[26px] border border-white/8 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-200"
                  >
                    {suggestionChips.find((c) => c.id === selectedChip)?.label}
                  </motion.div>

                  {/* AI reply lines */}
                  {currentLines.map((line, i) => (
                    <div key={`${selectedChip}-${i}`}>
                      <TypewriterBubble
                        text={line}
                        delay={i === 0 ? 400 : 200}
                        onFinished={i === lineIndex ? handleLineFinished : undefined}
                      />
                    </div>
                  ))}

                  {/* Blurred range */}
                  {reply.blurredValue && showBasisCards && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mr-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50"
                    >
                      Your indicative range is{' '}
                      <span className="inline-block rounded px-2 py-0.5 text-white blur-[6px] select-none bg-white/10">
                        {reply.blurredValue}
                      </span>
                      . The supporting narrative is shareable &mdash; the figure stays protected.
                    </motion.div>
                  )}

                  {/* Basis cards */}
                  {reply.basis && showBasisCards && (
                    <div className="border border-white/8 bg-black/20 p-4">
                      <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                        Valuation basis
                      </p>
                      <div className="mt-4 space-y-3">
                        {reply.basis.map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.12 }}
                            className="flex items-start gap-3 border border-white/6 bg-white/[0.03] px-4 py-3"
                          >
                            <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-300">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm leading-6 text-slate-200">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Document preview card */}
                  {showDocPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45 }}
                      className="border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))]"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-cyan-200">
                            <FileText className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">{docFile}</p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">AI-generated document</p>
                          </div>
                        </div>
                        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                          Ready
                        </div>
                      </div>

                      {/* Floating white doc */}
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="mx-auto my-5 w-[88%] border border-black/30 bg-white p-6 text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                      >
                        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                              B2W {selectedChip === 'evaluate' ? 'evaluation brief' : selectedChip === 'risks' ? 'risk report' : 'asset package'}
                            </p>
                            <h3 className="mt-2 text-lg font-medium tracking-tight">
                              {selectedChip === 'evaluate' ? 'Business Evaluation Summary' : selectedChip === 'risks' ? 'Selling Risk Assessment' : 'Asset & SOP Inventory'}
                            </h3>
                          </div>
                          {reply.blurredValue && (
                            <div className="text-right">
                              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">Indicative range</p>
                              <p className="mt-2 text-base font-semibold blur-[5px] select-none">{reply.blurredValue}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                          <p>{reply.lines[0]}</p>
                          <p className="blur-[3px] select-none">{reply.lines[1] ?? 'Additional detail is available in the full document.'}</p>
                        </div>
                      </motion.div>

                      {/* Actions */}
                      <div className="border-t border-white/10 bg-black/15 px-5 py-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowModal(true)}
                          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-300/15"
                        >
                          <Eye className="h-4 w-4" />
                          Preview Document
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowModal(true)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                        >
                          <Download className="h-4 w-4" />
                          Download
                          <Lock className="h-3 w-3 text-slate-500" />
                        </button>
                        <Link
                          to={routes.fieldBossManager}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                        >
                          <MessageSquareText className="h-4 w-4" />
                          Send to buyer agent
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ──── Empty state ──── */}
        {!selectedChip && (
          <section className="mb-12">
            <div className="border border-white/8 bg-[#08131b] p-8 sm:p-12 text-center">
              <span className="inline-block text-cyan-200 mb-5">
                <FieldBossIcon size={32} />
              </span>
              <p className="text-lg font-medium text-white mb-2">Pick a topic above to start</p>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                The AI will walk through the analysis, surface key findings, and generate a document you can preview right here.
              </p>
            </div>
          </section>
        )}

        {/* ──── Next steps ──── */}
        <section className="mb-12 border-t border-white/10 pt-10 md:pt-12">
          <div className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500">
            <span>Continue</span>
            <span className="text-white/20">/</span>
            <span>Agent handoff</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              {
                title: 'Feed this to the buyer agent',
                body: 'The generated document becomes the context the AI uses when buyer prospects start asking questions.',
                cta: 'Open Agent Manager',
                to: routes.fieldBossManager,
              },
              {
                title: 'Track what the AI is doing',
                body: 'See files produced, data processed, and what the AI system is costing across all workflows.',
                cta: 'Open Dashboard',
                to: routes.fieldBossDashboard,
              },
            ].map((card) => (
              <div key={card.title} className="border border-white/10 bg-[#08131b] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-cyan-200">
                    <FieldBossIcon size={20} />
                  </span>
                  <h3 className="text-lg font-medium tracking-tight text-white">{card.title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-300 mb-5">{card.body}</p>
                <Link
                  to={card.to}
                  className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition-colors hover:text-white"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </article>

      <DocumentPreviewModal isOpen={showModal} onClose={() => setShowModal(false)} selectedChip={selectedChip} />
    </div>
  );
}
