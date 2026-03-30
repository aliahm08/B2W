import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Download,
  Eye,
  FileText,
  Lock,
  MessageSquareText,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FieldBossShell } from './UyghurEatsFieldBossShared';
import { getUyghurEatsRoutes } from './uyghurEatsRoutes';

/* ─────────────────────────────────────────────── data ─── */

const suggestionChips = [
  {
    id: 'evaluate' as const,
    label: 'Give me a Business Evaluation.',
    icon: Sparkles,
  },
  {
    id: 'risks' as const,
    label: 'Identify Risks when Selling.',
    icon: MessageSquareText,
  },
  {
    id: 'package' as const,
    label: 'Package a List of my Assets and SOPs.',
    icon: FileText,
  },
] as const;

type ChipId = (typeof suggestionChips)[number]['id'];

/* scripted answers keyed by chip id */
const scriptedReplies: Record<
  ChipId,
  { lines: string[]; blurredValue?: string; basis?: string[] }
> = {
  evaluate: {
    lines: [
      'I can give you a working evaluation based on three things:',
      'Normalized seller earnings after one-time and owner-specific adjustments, comparable restaurant transactions in the local market, and how easy the business is to hand off.',
    ],
    blurredValue: '$XXX,XXX – $XXX,XXX',
    basis: [
      'Normalized seller earnings after one-time and owner-specific adjustments',
      'Comparable restaurant transactions in the local market and adjacent buyer sets',
      'Transfer readiness, operational documentation, and how easy the business is to hand off',
    ],
  },
  risks: {
    lines: [
      'Here are the main selling risks I see based on publicly available information and the materials you've shared:',
      '① Lease transfer uncertainty – A buyer needs a fresh lease or an approved assignment. Any lapse creates deal risk.',
      '② Key-person dependency – If the head chef or the hand-pull noodle technique is tied to one individual, the buyer's perceived risk goes up.',
      '③ Revenue concentration – Heavy reliance on dine-in vs. delivery means external disruptions (construction, weather, pandemic) directly hit topline.',
    ],
    blurredValue: undefined,
    basis: undefined,
  },
  package: {
    lines: [
      'I'll start building a list of transferable assets and standard operating procedures that a buyer will want to review:',
      'Equipment and fixtures inventory (FFE), vendor and supplier contact list, current POS system configuration, staffing overview with wages and tenure, health permits and licensing, and recipe documentation for signature items.',
    ],
    blurredValue: undefined,
    basis: undefined,
  },
};

/* ─────────────────────────── animated typing component ─── */

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
      <div className="ml-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50">
        <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-cyan-200/40" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50"
    >
      {displayed}
      {!done && (
        <span className="ml-0.5 inline-block h-[1.15em] w-[2px] translate-y-[0.15em] animate-pulse bg-cyan-200" />
      )}
    </motion.div>
  );
}

/* ─────────────────────────────── document preview modal ─── */

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

  if (!isOpen || !selectedChip) return null;

  const reply = scriptedReplies[selectedChip];

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
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/10 bg-[#0b1722] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#0b1722]/95 backdrop-blur-md px-6 py-4 z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedChip === 'evaluate'
                    ? 'Evaluation Summary.pdf'
                    : selectedChip === 'risks'
                      ? 'Selling Risks Report.pdf'
                      : 'Asset & SOP Package.pdf'}
                </p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  AI-Generated Document
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
                <span>Download</span>
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

          {/* Document Body – blurred content */}
          <div className="p-6 sm:p-10">
            <div className="border border-black/30 bg-white p-8 text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between border-b border-neutral-200 pb-5">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                    B2W {selectedChip === 'evaluate' ? 'evaluation brief' : selectedChip === 'risks' ? 'risk report' : 'asset package'}
                  </p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight">
                    {selectedChip === 'evaluate'
                      ? 'Business Evaluation Summary'
                      : selectedChip === 'risks'
                        ? 'Selling Risk Assessment'
                        : 'Asset & SOP Inventory'}
                  </h3>
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
                {reply.lines.map((line, i) => (
                  <p key={i} className={i > 0 ? 'blur-[3px] select-none' : ''}>
                    {line}
                  </p>
                ))}

                {reply.basis && (
                  <div className="grid gap-3 md:grid-cols-3 blur-[3px] select-none">
                    {reply.basis.map((item) => (
                      <div key={item} className="border border-neutral-200 p-3">
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                          Basis
                        </p>
                        <p className="mt-2 font-medium text-black">{item.split(',')[0]}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* blurred body sections */}
                <div className="space-y-4 blur-[4px] select-none">
                  <div className="border border-neutral-200 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                      Detailed analysis
                    </p>
                    <p className="mt-2">
                      The comprehensive analysis covers market positioning, operational efficiency metrics, and comparable transaction benchmarks within a 15-mile radius of the subject property.
                    </p>
                  </div>
                  <div className="border border-neutral-200 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">
                      Methodology notes
                    </p>
                    <p className="mt-2">
                      SDE multiples were cross-referenced against BizBuySell, DealStats, and regional restaurant brokerage data for the trailing 24-month window.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lock overlay */}
              <div className="mt-8 flex items-center gap-3 border-t border-neutral-200 pt-5">
                <Lock className="h-4 w-4 text-neutral-400" />
                <p className="text-xs text-neutral-500">
                  Full document available after FieldBoss AI activation
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="sticky bottom-0 border-t border-white/10 bg-[#0b1722]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Preview only – sign up to unlock the full document and download.
            </p>
            <button
              type="button"
              onClick={() => setShowSignUp(true)}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-300/20"
            >
              Unlock with FieldBoss
            </button>
          </div>
        </motion.div>

        {/* Sign-up overlay */}
        <AnimatePresence>
          {showSignUp && (
            <motion.div
              key="signup-overlay"
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
                className="w-full max-w-md border border-white/15 bg-[#0b1722] p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Activate FieldBoss AI
                    </h3>
                    <p className="text-xs text-slate-400">
                      Unlock full documents, downloads, and the buyer-prospect agent
                    </p>
                  </div>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSignUp(false);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-300/40"
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    required
                    className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-300/40"
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-300/40"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
                  >
                    Request Access
                  </button>
                  <p className="text-center text-[10px] text-slate-500">
                    We'll reach out within 24 hours with your FieldBoss activation.
                  </p>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

/* ────────────────────────────────── main page component ─── */

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
      // all lines typed – show extras
      if (reply.basis) {
        setTimeout(() => setShowBasisCards(true), 300);
      }
      setTimeout(() => setShowDocPreview(true), reply.basis ? 900 : 400);
    }
  }, [lineIndex, reply]);

  // auto-scroll chat
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [lineIndex, showBasisCards, showDocPreview]);

  return (
    <FieldBossShell
      active="chatbot"
      eyebrow="FieldBoss AI / Chatbot"
      title="Ask questions. Get real answers. Preview the document before you commit."
      intro="FieldBoss is our AI advisory layer. Select a prompt below to see how the system evaluates your business, identifies selling risks, or builds your asset package — with key details and full downloads gated behind activation."
    >
      <section className="space-y-6">
        {/* ──── Chat Landing ──── */}
        <div className="border border-white/10 bg-[linear-gradient(180deg,rgba(8,19,27,0.9),rgba(9,18,26,0.76))] px-6 py-12 sm:px-10 sm:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-cyan-300/75">
              FieldBoss AI
            </p>
            <h2 className="mt-5 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              What can I help with?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Select one of the prompts below. The assistant will walk through the analysis and generate a document you can preview on-page.
            </p>

            {/* suggestion chips */}
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
        </div>

        {/* ──── Chat animation area ──── */}
        <AnimatePresence mode="wait">
          {selectedChip && reply && (
            <motion.div
              key={selectedChip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="border border-white/10 bg-[#08131b]"
            >
              {/* top bar */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">FieldBoss</p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      Analyzing
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                  Live demo
                </div>
              </div>

              {/* chat body */}
              <div
                ref={chatContainerRef}
                className="max-h-[60vh] overflow-y-auto p-5 sm:p-6 space-y-4"
              >
                {/* user message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-[88%] rounded-[26px] border border-white/8 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-200"
                >
                  {suggestionChips.find((c) => c.id === selectedChip)?.label}
                </motion.div>

                {/* streamed reply lines */}
                {currentLines.map((line, i) => (
                  <TypewriterBubble
                    key={`${selectedChip}-${i}`}
                    text={line}
                    delay={i === 0 ? 400 : 200}
                    onFinished={i === lineIndex ? handleLineFinished : undefined}
                  />
                ))}

                {/* Blurred evaluation range */}
                {reply.blurredValue && showBasisCards && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50"
                  >
                    Your indicative evaluation range is{' '}
                    <span className="inline-block rounded px-2 py-0.5 text-white blur-[6px] select-none bg-white/10">
                      {reply.blurredValue}
                    </span>
                    . I am keeping the final figure blurred here while the supporting narrative
                    remains shareable.
                  </motion.div>
                )}

                {/* Basis cards */}
                {reply.basis && showBasisCards && (
                  <div className="border border-white/8 bg-black/20 p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
                      This evaluation is based on
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

                {/* Generated document preview card */}
                {showDocPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))]"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {selectedChip === 'evaluate'
                              ? 'Evaluation Summary.pdf'
                              : selectedChip === 'risks'
                                ? 'Selling Risks Report.pdf'
                                : 'Asset & SOP Package.pdf'}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                            AI-generated document
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                        Ready
                      </div>
                    </div>

                    {/* Mini preview – the floating white document */}
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 3.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="mx-auto my-5 w-[88%] border border-black/30 bg-white p-6 text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                    >
                      <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                            B2W {selectedChip === 'evaluate' ? 'evaluation brief' : selectedChip === 'risks' ? 'risk report' : 'asset package'}
                          </p>
                          <h3 className="mt-2 text-lg font-medium tracking-tight">
                            {selectedChip === 'evaluate'
                              ? 'Business Evaluation Summary'
                              : selectedChip === 'risks'
                                ? 'Selling Risk Assessment'
                                : 'Asset & SOP Inventory'}
                          </h3>
                        </div>
                        {reply.blurredValue && (
                          <div className="text-right">
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                              Indicative range
                            </p>
                            <p className="mt-2 text-base font-semibold blur-[5px] select-none">
                              {reply.blurredValue}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                        <p>{reply.lines[0]}</p>
                        <p className="blur-[3px] select-none">
                          {reply.lines[1] ?? 'Additional detail is available in the full document.'}
                        </p>
                      </div>
                    </motion.div>

                    {/* Action row */}
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
                        Use with buyer agent
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──── Empty state when no chip is selected ──── */}
        {!selectedChip && (
          <div className="border border-white/8 bg-[#08131b] p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200 mb-5">
              <Bot className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium text-white mb-2">Select a prompt above to begin</p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Choose one of the three suggested topics. The AI will walk through its analysis, show you the key findings, and generate a document you can preview right here.
            </p>
          </div>
        )}
      </section>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedChip={selectedChip}
      />
    </FieldBossShell>
  );
}
