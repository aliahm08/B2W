import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Eye, FileText, Lock, MessageSquareText, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import FieldBossIcon from './FieldBossIcon';
import { getUyghurEatsRoutes } from '../../pages/client/uyghurEatsRoutes';

/* ─── Data ───────────────────────────────────────────────── */
const suggestionChips = [
  { id: 'evaluate' as const, label: 'Evaluate my business.', icon: Sparkles },
  { id: 'risks' as const, label: 'Show me the selling risks.', icon: MessageSquareText },
  { id: 'package' as const, label: 'Package my assets and SOPs.', icon: FileText },
] as const;

type ChipId = (typeof suggestionChips)[number]['id'];

const scriptedReplies: Record<ChipId, { lines: string[]; blurredValue?: string; basis?: string[] }> = {
  evaluate: {
    lines: [
      'I can build you an evaluation right now. It\u2019s based on three things:',
      'First, your normalized earnings after we strip out one-time and owner-specific expenses. Second, comparable restaurant sales in the DC metro area. Third, how transfer-ready the business actually is \u2014 documentation, lease status, and operational handoff difficulty.',
    ],
    blurredValue: '$XXX,XXX \u2013 $XXX,XXX',
    basis: ['Normalized seller discretionary earnings', 'Comparable restaurant transactions within 15 miles', 'Transfer readiness and documentation quality'],
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
    setDisplayed(''); setDone(false); let i = 0;
    const interval = setInterval(() => {
      i += 1; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, done };
}

function TypewriterBubble({ text, delay = 0, onFinished }: { text: string; delay?: number; onFinished?: () => void }) {
  const [started, setStarted] = useState(false);
  const { displayed, done } = useTypewriter(started ? text : '', 14);
  const didNotify = useRef(false);
  useEffect(() => { const timeout = setTimeout(() => setStarted(true), delay); return () => clearTimeout(timeout); }, [delay]);
  useEffect(() => { if (done && onFinished && !didNotify.current) { didNotify.current = true; onFinished(); } }, [done, onFinished]);

  if (!started) return (
    <div className="mr-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50">
      <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-cyan-200/40" />
    </div>
  );
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mr-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50">
      {displayed}
      {!done && <span className="ml-0.5 inline-block h-[1.15em] w-[2px] translate-y-[0.15em] animate-pulse bg-cyan-200" />}
    </motion.div>
  );
}

/* ─── Document preview modal ─────────────────────────────── */
function DocumentPreviewModal({ isOpen, onClose, selectedChip }: { isOpen: boolean; onClose: () => void; selectedChip: ChipId | null }) {
  const [showSignUp, setShowSignUp] = useState(false);
  useEffect(() => {
    if (!isOpen) return; const original = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = original; };
  }, [isOpen]);
  if (!isOpen || !selectedChip) return null;
  const reply = scriptedReplies[selectedChip];
  const docTitle = selectedChip === 'evaluate' ? 'Business Evaluation Summary' : selectedChip === 'risks' ? 'Selling Risk Assessment' : 'Asset & SOP Inventory';
  const docFile = selectedChip === 'evaluate' ? 'Evaluation Summary.pdf' : selectedChip === 'risks' ? 'Risk Assessment.pdf' : 'Asset Package.pdf';

  return (
    <AnimatePresence>
      <motion.div key="doc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }} className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/10 bg-[#08131b] shadow-[0_40px_120px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#08131b]/95 backdrop-blur-md px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-cyan-200"><FileText className="h-5 w-5" /></span>
              <div><p className="text-sm font-semibold text-white">{docFile}</p><p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/60">Proposal summary</p></div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowSignUp(true)} className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"><Download className="h-3.5 w-3.5" />Download<Lock className="h-3 w-3 text-slate-500 group-hover:text-cyan-200" /></button>
              <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
          </div>
          {/* Document body */}
          <div className="p-6 sm:p-10">
            <div className="border border-black/30 bg-white p-8 text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between border-b border-neutral-200 pb-5">
                <div><p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">B2W {selectedChip === 'evaluate' ? 'evaluation brief' : selectedChip === 'risks' ? 'risk report' : 'asset package'}</p><h3 className="mt-2 text-2xl font-medium tracking-tight">{docTitle}</h3></div>
                {reply.blurredValue && <div className="text-right"><p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">Indicative range</p><p className="mt-2 text-lg font-semibold blur-[5px] select-none">{reply.blurredValue}</p></div>}
              </div>
              <div className="mt-6 space-y-5 text-sm leading-6 text-neutral-700">
                <p>{reply.lines[0]}</p>
                {reply.lines.slice(1).map((line, i) => <p key={i} className="blur-[3px] select-none">{line}</p>)}
                {reply.basis && <div className="grid gap-3 md:grid-cols-3 blur-[3px] select-none">{reply.basis.map((item) => <div key={item} className="border border-neutral-200 p-3"><p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">Basis</p><p className="mt-2 font-medium text-black">{item}</p></div>)}</div>}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-between border-t border-white/10 bg-[#08131b]/95 backdrop-blur-md px-6 py-4">
            <p className="text-sm text-slate-400">Preview only &mdash; sign up to unlock.</p>
            <button type="button" onClick={() => setShowSignUp(true)} className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-300/15">Unlock with FieldBoss</button>
          </div>
        </motion.div>
        
        {/* Sign-up */}
        <AnimatePresence>
          {showSignUp && (
            <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowSignUp(false)}>
              <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} className="w-full max-w-md border border-white/15 bg-[#08131b] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-6 flex items-center gap-3"><span className="text-cyan-200"><FieldBossIcon size={28} /></span><div><h3 className="text-lg font-medium text-white">Open Full Proposal Summary</h3><p className="text-xs text-slate-400">Unlock full documents and downloads</p></div></div>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowSignUp(false); }}><input type="text" placeholder="Your name" required className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40" /><input type="email" placeholder="Work email" required className="w-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40" /><button type="submit" className="w-full rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-black hover:bg-neutral-200">Request Access</button></form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

/* ────────────────────────────── Chat Tray Content ────────────────── */
export default function FieldBossChatTray({ onClose }: { onClose: () => void }) {
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
    setSelectedChip(id); setLineIndex(0); setShowBasisCards(false); setShowDocPreview(false);
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
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [lineIndex, showBasisCards, showDocPreview]);

  const docFile = selectedChip === 'evaluate' ? 'Evaluation Summary.pdf' : selectedChip === 'risks' ? 'Risk Assessment.pdf' : 'Asset Package.pdf';

  return (
    <div className="mx-auto max-w-4xl px-6 py-6 pb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-cyan-200"><FieldBossIcon size={24} /></span>
          <div>
            <h2 className="text-lg font-medium text-white">Summarize Proposal</h2>
            <p className="text-xs text-cyan-300/70">A quick summary panel for the viewer.</p>
          </div>
        </div>
      </div>

      {!selectedChip && (
         <div className="flex flex-col items-center justify-center p-8 border border-white/10 bg-white/[0.02] rounded-2xl mb-6">
            <span className="text-cyan-200 mb-4"><FieldBossIcon size={32} /></span>
            <p className="text-white font-medium mb-1">What would you like summarized?</p>
            <p className="text-sm text-cyan-100/60 mb-8 max-w-sm text-center">Pick a topic below to review a quick summary and preview the supporting document.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {suggestionChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <motion.button key={chip.id} onClick={() => handleChipClick(chip.id)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium tracking-tight text-slate-300 transition-all hover:border-white/20 hover:text-white">
                    <Icon className="h-4 w-4 text-cyan-200" />
                    {chip.label}
                  </motion.button>
                );
              })}
            </div>
         </div>
      )}

      {selectedChip && reply && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-white/10 bg-[#08131b] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedChip(null)} 
                className="flex items-center justify-center p-1.5 -ml-1.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Back to questions"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-cyan-200"><FieldBossIcon size={20} /></span>
              <div><p className="text-sm font-semibold text-white">Proposal Summary</p><p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Summarizing</p></div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100/70">Live demo</div>
          </div>
          
          <div ref={chatContainerRef} className="max-h-[50vh] overflow-y-auto p-5 space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-auto max-w-[88%] rounded-[26px] border border-white/8 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-200">
              {suggestionChips.find((c) => c.id === selectedChip)?.label}
            </motion.div>

            {currentLines.map((line, i) => (
              <div key={`${selectedChip}-${i}`}>
                <TypewriterBubble text={line} delay={i === 0 ? 400 : 200} onFinished={i === lineIndex ? handleLineFinished : undefined} />
              </div>
            ))}

            {reply.blurredValue && showBasisCards && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mr-auto max-w-[92%] rounded-[26px] border border-cyan-300/20 bg-cyan-300/[0.09] px-5 py-4 text-sm leading-7 text-cyan-50">
                Your indicative range is <span className="inline-block rounded px-2 py-0.5 text-white blur-[6px] select-none bg-white/10">{reply.blurredValue}</span>. The supporting narrative is shareable &mdash; the figure stays protected.
              </motion.div>
            )}

            {reply.basis && showBasisCards && (
              <div className="border border-white/8 bg-black/20 p-4 rounded-xl">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">Valuation basis</p>
                <div className="mt-4 space-y-3">
                  {reply.basis.map((item, index) => (
                    <motion.div key={item} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.12 }} className="flex items-start gap-3 border border-white/6 bg-white/[0.03] px-4 py-3 rounded-lg">
                      <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-[0.16em] text-cyan-100/60">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-sm leading-6 text-cyan-50/90">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {showDocPreview && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] rounded-xl overflow-hidden mt-6">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-3"><span className="text-cyan-200"><FileText className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-cyan-50">{docFile}</p><p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/50">Proposal summary</p></div></div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Ready</div>
                </div>
                
                <div className="px-5 py-4 flex flex-wrap items-center gap-3">
                  <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-300/15"><Eye className="h-4 w-4" />Preview Document</button>
                  <Link to={routes.fieldBossManager} onClick={onClose} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50 transition-colors hover:border-white/20 hover:text-white"><MessageSquareText className="h-4 w-4" />Agent Manager</Link>
                </div>
              </motion.div>
            )}

            {showDocPreview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6 border-t border-white/10 mt-6 flex flex-col">
                 <p className="text-sm text-cyan-100/60 mb-4 text-center">Want to explore another topic?</p>
                 <div className="flex flex-wrap items-center justify-center gap-2">
                   {suggestionChips.filter(c => c.id !== selectedChip).map(chip => {
                     const Icon = chip.icon;
                     return (
                        <button key={chip.id} onClick={() => handleChipClick(chip.id)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all">
                           <Icon className="h-3.5 w-3.5 text-cyan-200" />
                           {chip.label}
                        </button>
                     );
                   })}
                 </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      <DocumentPreviewModal isOpen={showModal} onClose={() => setShowModal(false)} selectedChip={selectedChip} />
    </div>
  );
}
