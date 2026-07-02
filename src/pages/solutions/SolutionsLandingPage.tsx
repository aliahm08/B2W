import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, FileText, Mic, CheckSquare, Square, Calculator, Share2, MapPin, Home, Layers, Sparkles, Send, Users, Activity, Lock } from 'lucide-react';
import Seo from '../../components/Seo';
import B2WLogoMark from '../../components/B2WLogoMark';

const voiceNote =
  'I am repairing a 1200 square foot living room with 6 windows, 2 archways, and one door to the basement staircase. The ceilings are approximately 13 feet tall, and there are 12 spot lights. We need to replace all window frames, caulk all seals and fix the glass on 3 windows. The carpeting needs to be removed, trashed, and the original wood flooring needs to be sanded, buffed, and polished assuming no damage.';

type HighlightRegion = {
  startWord: number;
  endWord: number;
  type: 'info' | 'estimate';
};

const highlights: HighlightRegion[] = [
  { startWord: 4, endWord: 8, type: 'info' },
  { startWord: 24, endWord: 27, type: 'info' },
  { startWord: 31, endWord: 33, type: 'estimate' },
  { startWord: 37, endWord: 41, type: 'estimate' },
  { startWord: 42, endWord: 44, type: 'estimate' },
  { startWord: 46, endWord: 50, type: 'estimate' },
  { startWord: 52, endWord: 57, type: 'estimate' },
  { startWord: 62, endWord: 69, type: 'estimate' },
];

const organizedScopeData = [
  { type: 'info', label: 'Project Details', items: ['1,200 sq ft living room', '13 ft ceilings', '6 windows, 2 archways', '1 basement door'] },
  { type: 'estimate', label: 'Demolition & Prep', items: ['Remove & dispose of carpet', 'General room masking'] },
  { type: 'estimate', label: 'Windows & Openings', items: ['Replace 6 window frames', 'Caulk all window seals', 'Fix glass on 3 windows'] },
  { type: 'estimate', label: 'Flooring', items: ['Sand existing wood flooring', 'Buff & polish wood'] },
  { type: 'estimate', label: 'Electrical', items: ['Install 12 spot lights'] },
];

type SubItem = {
  id: string;
  desc: string;
  qty: number | string;
  unitPrice: number;
  checked: boolean;
  essential: boolean;
};

type Category = {
  label: string;
  subItems: SubItem[];
};

const initialCategories: Category[] = [
  { label: 'Demolition & Prep', subItems: [
    { id: 'd1', desc: 'Remove & dispose of carpet', qty: 1200, unitPrice: 0.35, checked: true, essential: true },
    { id: 'd2', desc: 'General room masking', qty: 1, unitPrice: 150, checked: true, essential: false },
  ]},
  { label: 'Electrical', subItems: [
    { id: 'e1', desc: 'Install spot lights', qty: 12, unitPrice: 150, checked: true, essential: true },
  ]},
  { label: 'Windows & Openings', subItems: [
    { id: 'w1', desc: 'Replace window frames', qty: 6, unitPrice: 700, checked: true, essential: true },
    { id: 'w2', desc: 'Fix glass panes & seal', qty: 3, unitPrice: 150, checked: true, essential: true },
    { id: 'w3', desc: 'Caulk all window seals', qty: 6, unitPrice: 45, checked: true, essential: false },
  ]},
  { label: 'Flooring', subItems: [
    { id: 'f1', desc: 'Sand, buff, & polish wood', qty: 1200, unitPrice: 2.25, checked: true, essential: true },
  ]},
];

function MiniRecordGlyph() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black" aria-hidden="true">
      <span className="flex h-4 items-center gap-[2px]">
        {[7, 10, 14, 11].map((height, index) => (
          <span key={`${height}-${index}`} className="w-[2px] rounded-full bg-white" style={{ height }} />
        ))}
      </span>
    </span>
  );
}

function RecordIcon({ isRecording }: { isRecording: boolean }) {
  return (
    <motion.button
      type="button"
      className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black shadow-[0_24px_70px_rgba(0,0,0,0.42)] ring-1 ring-white/12 md:h-28 md:w-28"
      animate={isRecording ? { scale: [1, 0.92, 1.04, 1] } : { scale: 1 }}
      transition={isRecording ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: [0.22, 1, 0.36, 1] } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-[#f5dce8]/40"
        animate={isRecording ? { scale: [1, 1.45], opacity: [0.55, 0] } : { scale: 1, opacity: 0 }}
        transition={isRecording ? { duration: 1.4, repeat: Infinity, ease: 'easeOut' } : { duration: 0.45, ease: 'easeInOut' }}
      />
      <span className="flex h-12 items-center gap-[4px]">
        {[18, 26, 34, 42, 30, 22].map((height, index) => (
          <motion.span
            key={height}
            className="w-[5px] rounded-full bg-white"
            animate={isRecording ? { height: [height * 0.58, height, height * 0.72] } : { height }}
            transition={isRecording ? { duration: 0.8, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' } : { duration: 0.5, delay: index * 0.035, ease: 'easeInOut' }}
          />
        ))}
      </span>
    </motion.button>
  );
}

function SectionNavigator({ currentStep, setStep }: { currentStep: number, setStep: (step: number) => void }) {
  const [desktopPortal, setDesktopPortal] = useState<HTMLElement | null>(null);
  const [mobilePortal, setMobilePortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setDesktopPortal(document.getElementById('solutions-navbar-center-portal'));
    setMobilePortal(document.getElementById('solutions-navbar-mobile-portal'));
  }, [currentStep]);

  if (currentStep === 0) return null;

  const navItems = [
    { label: 'Start', step: 0 },
    { label: 'Capture', step: 1 },
    { label: 'Scope', step: 2 },
    { label: 'Estimate', step: 3 },
    { label: 'Share', step: 4 }
  ];

  return (
    <>
      {desktopPortal && createPortal(
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="hidden md:flex pointer-events-auto items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.step}
              onClick={() => setStep(item.step)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition ${
                currentStep === item.step
                  ? 'bg-[#f5dce8] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>,
        desktopPortal
      )}

      {mobilePortal && createPortal(
        <div className="flex md:hidden flex-col gap-4 py-4 w-full">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 border-b border-white/10 pb-2">Sections</p>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.step}
                onClick={() => {
                  setStep(item.step);
                  document.dispatchEvent(new CustomEvent('close-solutions-mobile-menu'));
                }}
                className={`text-left text-base font-semibold py-2 px-3 rounded-lg transition-colors ${
                  currentStep === item.step
                    ? 'bg-[#f5dce8]/15 text-[#f5dce8]'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>,
        mobilePortal
      )}
    </>
  );
}

function Section0Hero({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center text-center px-5 py-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="inline-flex items-center gap-2 rounded-full border border-[#d9a9c2]/20 bg-[#d9a9c2]/[0.07] px-4 py-1.5">
        <Mic className="h-3.5 w-3.5 text-[#e8cbd9]" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#f5dce8]/84">Voice to estimate</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="mt-6 text-[3rem] font-medium leading-[1.02] md:text-[5.5rem] md:leading-[0.94]">
        Estimate your project in seconds.
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }} className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-400 md:text-xl">
        Record a field note. Clara turns it into an organized scope, then generates a line-item estimate with contingency.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }} className="mt-10 flex flex-wrap justify-center items-center gap-4">
        <button onClick={onNext} className="clara-cta relative z-[110] inline-flex min-h-12 overflow-hidden rounded-full bg-[#f5dce8] px-6 py-3 text-sm font-semibold text-[#2b1724] shadow-[0_0_0_1px_rgba(245,220,232,0.24)] transition-[box-shadow,opacity] duration-200 hover:opacity-95 hover:shadow-[0_14px_38px_rgba(184,137,161,0.24)]">
          <span className="relative z-10 inline-flex items-center gap-2">
            <MiniRecordGlyph /> See How
          </span>
        </button>
        <button onClick={onNext} className="relative z-[110] inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.2)] transition-[box-shadow,opacity] duration-200 hover:bg-white/15 hover:shadow-[0_14px_38px_rgba(255,255,255,0.14)]">
          Test Demo <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
}

function Section1VoiceCapture({ onComplete }: { onComplete: () => void }) {
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const words = useMemo(() => voiceNote.split(' '), []);
  const transcriptComplete = visibleWordCount >= words.length;
  const organizeThreshold = Math.ceil(words.length * 0.67);
  const canProceed = visibleWordCount >= organizeThreshold;

  useEffect(() => {
    if (transcriptComplete) return;
    const timer = window.setInterval(() => setVisibleWordCount((current) => Math.min(words.length, current + 1)), 60);
    return () => window.clearInterval(timer);
  }, [transcriptComplete, words.length]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center px-5 py-4 max-w-5xl">
      <div className="w-full text-center">
        <h2 className="text-3xl font-medium text-white md:text-5xl">Speak your scope.</h2>
        <p className="mt-2 text-neutral-400">Clara instantly transcribes and tags your voice note.</p>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center my-3 max-h-[55vh]">
        <div className="relative rounded-[1.75rem] border border-[#e8cbd9]/12 bg-[#1a1118]/88 p-4 shadow-[0_34px_100px_rgba(0,0,0,0.34)] backdrop-blur md:p-6 w-full max-w-4xl mx-auto flex flex-col h-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <div className="scale-75 origin-left"><RecordIcon isRecording={!transcriptComplete} /></div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <motion.span className={`h-2 w-2 rounded-full ${transcriptComplete ? 'bg-[#f5dce8]' : 'bg-red-400'}`} animate={{ opacity: transcriptComplete ? 0.85 : [0.55, 1, 0.55] }} transition={transcriptComplete ? { duration: 0.35, ease: 'easeInOut' } : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f5dce8]/70">{transcriptComplete ? 'Recording complete' : 'Recording active'}</p>
                </div>
                <p className="text-sm text-neutral-400">{visibleWordCount} words captured</p>
              </div>
            </div>
            <p className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-neutral-400">00:38 voice note</p>
          </div>

          <div className="flex-1 rounded-[1.25rem] border border-white/8 bg-[#0f0a0e] p-4 md:p-6 overflow-y-auto">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">Live transcript</p>
            <p className="mt-3 text-[1rem] leading-7 text-neutral-500 md:text-[1.1rem] md:leading-8">
              {words.map((word, index) => {
                const infoRegion = highlights.find(r => r.type === 'info' && index >= r.startWord && index <= r.endWord);
                const estRegion = highlights.find(r => r.type === 'estimate' && index >= r.startWord && index <= r.endWord);
                const isHighlightedInfo = Boolean(infoRegion) && index < visibleWordCount;
                const isHighlightedEst = Boolean(estRegion) && index < visibleWordCount;
                return (
                  <motion.span key={`${word}-${index}`} className={`transition-colors box-decoration-clone px-0.5 py-[1px] ${isHighlightedInfo ? 'bg-[#d9a9c2]/40 text-[#f5dce8] rounded-sm' : isHighlightedEst ? 'bg-sky-500/30 text-sky-200 rounded-sm' : index < visibleWordCount ? 'text-neutral-100' : 'text-neutral-700'}`} initial={false} animate={{ opacity: index < visibleWordCount ? 1 : 0.32 }} transition={{ duration: 0.24 }}>
                    {word}{index === words.length - 1 ? '' : ' '}
                  </motion.span>
                );
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full text-center shrink-0">
        <button onClick={onComplete} disabled={!canProceed} className={`inline-flex min-h-12 items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition ${canProceed ? 'clara-cta bg-[#f5dce8] text-[#2b1724] shadow-[0_12px_34px_rgba(184,137,161,0.2)] hover:opacity-95' : 'cursor-not-allowed border border-white/10 bg-white/[0.04] text-neutral-500'}`}>
          <span className="relative z-10 inline-flex items-center gap-2"><Layers className="h-4 w-4" /> Get an estimate</span>
        </button>
      </div>
    </div>
  );
}

function Section2_1OrganizedScope({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => { onComplete(); }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex w-full flex-col items-center justify-center px-5 py-2 max-w-5xl">
      <div className="w-full text-center shrink-0 mb-4">
        <h2 className="text-3xl font-medium text-white md:text-4xl">Organizing Scope...</h2>
        <p className="mt-1 text-sm text-neutral-400">Context and line items mapped seamlessly.</p>
      </div>
      <div className="w-full mb-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {organizedScopeData.map((category, index) => {
            const isInfo = category.type === 'info';
            return (
              <motion.div key={category.label} initial={{ opacity: 0, y: 15, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, delay: index * 0.1 }} className={`rounded-[1rem] border p-4 shadow-xl ${isInfo ? 'border-[#d9a9c2]/30 bg-[#d9a9c2]/5' : 'border-sky-500/20 bg-sky-500/5'}`}>
                <h3 className={`text-[11px] font-bold uppercase tracking-wider ${isInfo ? 'text-[#d9a9c2]' : 'text-sky-400'}`}>{category.label}</h3>
                <ul className="mt-2 space-y-1">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[12px] text-neutral-200">
                      <span className={`mt-1.5 h-1.2 w-1.2 rounded-full flex-shrink-0 ${isInfo ? 'bg-[#d9a9c2]' : 'bg-sky-400'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className="w-full text-center shrink-0">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center justify-center gap-2 text-xs text-[#d9a9c2]">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-3 w-3 rounded-full border-[1.5px] border-[#e8cbd9] border-t-[#c284a3]" />
           Preparing document...
         </motion.div>
      </div>
    </div>
  );
}

function EstimateDocumentContent({ categories, animatingCatIndex, animatingSubItemCount, estimateComplete, toggleCheck, updateQty, subtotal, contingencyPct, setContingencyPct, contingency, grandTotal }: any) {
  return (
    <div className="w-full h-full">
      <div className="border-b border-[#e8cbd9]/40 bg-[#f8f1f4] px-4 py-4 md:px-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#fcecf3]">
              <Calculator className="h-4 w-4 text-[#c284a3]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#2b1724]">Project Estimate</h3>
              <p className="text-[11px] text-[#5e4252]">Generated from material library.</p>
            </div>
          </div>
          <div className="rounded-lg border border-[#e8cbd9]/40 bg-[#fdf9fb] p-2 md:text-right hidden sm:block">
            <div className="flex items-center gap-2 md:justify-end">
              <MapPin className="h-3 w-3 text-[#c284a3]" />
              <p className="text-[11px] font-medium text-[#2b1724]">123 Main Street, NY</p>
            </div>
          </div>
        </div>
        {!estimateComplete && (
          <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#c284a3]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-2.5 w-2.5 rounded-full border border-[#e8cbd9] border-t-[#c284a3]" /> Building scope...
          </div>
        )}
      </div>

      <div className="bg-[#fdf9fb] p-4 md:p-5">
        <div className="space-y-3">
          {categories.map((category: Category, catIdx: number) => {
            if (catIdx > animatingCatIndex) return null;
            return (
              <motion.div key={category.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
                <div className="mb-1 border-b border-[#e8cbd9]/30 pb-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#2b1724]">{category.label}</h4>
                </div>
                <div className="space-y-0.5">
                  {category.subItems.map((sub: SubItem, subIdx: number) => {
                    const isSubVisible = catIdx < animatingCatIndex || (catIdx === animatingCatIndex && subIdx < animatingSubItemCount);
                    if (!isSubVisible) return null;
                    const isChecked = sub.checked;
                    const qtyNum = typeof sub.qty === 'string' ? parseFloat(sub.qty) || 0 : sub.qty;
                    const lineTotal = qtyNum * sub.unitPrice;

                    return (
                      <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center justify-between rounded-md px-1.5 py-1 transition-all ${!isChecked && estimateComplete ? 'opacity-40 grayscale' : 'hover:bg-[#f8f1f4]'}`}>
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <AnimatePresence>
                            {estimateComplete ? (
                              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => toggleCheck(catIdx, sub.id)} className="flex-shrink-0 text-sky-500 hover:text-sky-600">
                                {isChecked ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5 text-[#e8cbd9]" />}
                              </motion.button>
                            ) : <div className="h-3.5 w-3.5" />}
                          </AnimatePresence>
                          <p className={`text-[11px] font-medium truncate ${sub.essential ? 'text-[#2b1724]' : 'text-[#7e5c70]'}`}>{sub.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 border-r border-[#e8cbd9]/40 pr-2">
                            <span className="text-[10px] text-[#7e5c70]">x</span>
                            {estimateComplete ? (
                              <input type="number" value={sub.qty} onChange={(e) => updateQty(catIdx, sub.id, e.target.value)} disabled={!isChecked} className="w-8 rounded bg-transparent px-1 py-0 text-center font-mono text-[11px] font-medium text-[#2b1724] outline-none transition hover:bg-[#fcecf3] focus:bg-[#fcecf3] focus:ring-1 focus:ring-[#d9a9c2]/70 disabled:cursor-not-allowed" />
                            ) : <span className="inline-block w-8 text-center font-mono text-[11px] font-medium text-[#7e5c70]">{sub.qty}</span>}
                          </div>
                          <div className={`w-12 text-right font-mono text-[11px] ${sub.essential ? 'text-[#2b1724] font-semibold' : 'text-[#7e5c70]'}`}>${lineTotal.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="mt-4 rounded-xl border border-[#e8cbd9]/40 bg-[#f8f1f4] p-3" initial={false} animate={{ opacity: estimateComplete ? 1 : 0.4 }}>
          <div className="flex items-center justify-between py-0.5 text-[11px] text-[#5e4252]">
            <p>Subtotal</p><p className="font-mono font-medium text-[#2b1724]">{estimateComplete ? `$${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}</p>
          </div>
          <div className="flex items-center justify-between py-0.5 text-[11px] text-[#5e4252]">
            <div className="flex items-center gap-2"><p>Contingency</p>
              {estimateComplete ? (
                <div className="flex items-center"><input type="number" value={contingencyPct} onChange={(e) => setContingencyPct(e.target.value)} className="w-8 rounded bg-transparent px-0.5 text-right font-medium outline-none transition hover:bg-[#e8cbd9]/30 focus:bg-[#fcecf3] focus:ring-1 focus:ring-[#d9a9c2]/70" /><span className="ml-0.5">%</span></div>
              ) : <span>(15%)</span>}
            </div>
            <p className="font-mono font-medium text-[#2b1724]">{estimateComplete ? `$${contingency.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}</p>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-[#e8cbd9]/40 pt-2 text-sm font-bold text-[#2b1724]">
            <p>Total Estimate</p><p className="font-mono text-[#c284a3]">{estimateComplete ? `$${grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SolutionsLandingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Estimate document state shared across Step 3 and 4
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [contingencyPct, setContingencyPct] = useState<number | string>(15);
  const [animatingCatIndex, setAnimatingCatIndex] = useState(-1);
  const [animatingSubItemCount, setAnimatingSubItemCount] = useState(0);
  const [estimateComplete, setEstimateComplete] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const totalScrollable = rect.height - window.innerHeight;

      // When above the interactive container
      if (window.scrollY < containerTop - 100) {
        setCurrentStep(0);
        return;
      }

      const currentScroll = window.scrollY - containerTop;
      const pct = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      if (pct <= 0.25) {
        setCurrentStep(1);
      } else if (pct <= 0.5) {
        setCurrentStep(2);
      } else if (pct <= 0.75) {
        setCurrentStep(3);
      } else {
        setCurrentStep(4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = (step: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = rect.top + window.scrollY;
    const totalScrollable = rect.height - window.innerHeight;

    if (step === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const pct = (step - 1) * 0.25 + 0.125;
      window.scrollTo({
        top: containerTop + pct * totalScrollable,
        behavior: 'smooth'
      });
    }
  };

  // Shared Document Animation Driver
  useEffect(() => {
    if (currentStep < 3) return; // Only start building when we reach step 3
    if (animatingCatIndex < categories.length) {
      const currentCat = categories[animatingCatIndex];
      if (currentCat && animatingSubItemCount < currentCat.subItems.length) {
        const timer = setTimeout(() => setAnimatingSubItemCount(prev => prev + 1), 60);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setAnimatingCatIndex(prev => prev + 1);
          setAnimatingSubItemCount(0);
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => {
        setEstimateComplete(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animatingCatIndex, animatingSubItemCount, categories, currentStep]);

  const toggleCheck = (catIndex: number, subId: string) => {
    if (!estimateComplete) return;
    setCategories(prev => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.subItems = cat.subItems.map(sub => sub.id === subId ? { ...sub, checked: !sub.checked } : sub);
      next[catIndex] = cat;
      return next;
    });
  };

  const updateQty = (catIndex: number, subId: string, val: string) => {
    setCategories(prev => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.subItems = cat.subItems.map(sub => sub.id === subId ? { ...sub, qty: val } : sub);
      next[catIndex] = cat;
      return next;
    });
  };

  let subtotal = 0;
  categories.forEach(cat => {
    cat.subItems.forEach(sub => {
      if (sub.checked) {
        const qtyNum = typeof sub.qty === 'string' ? parseFloat(sub.qty) || 0 : sub.qty;
        subtotal += (qtyNum * sub.unitPrice);
      }
    });
  });
  const safeContingencyPct = typeof contingencyPct === 'string' ? parseFloat(contingencyPct) || 0 : contingencyPct;
  const contingency = subtotal * (safeContingencyPct / 100);
  const grandTotal = subtotal + contingency;

  const sharedEstimateProps = {
    categories, animatingCatIndex, animatingSubItemCount, estimateComplete, toggleCheck, updateQty, subtotal, contingencyPct, setContingencyPct, contingency, grandTotal
  };

  return (
    <>
      <Seo title="Clara Project Estimates" description="Clara turns voice notes into organized project scopes and line-item estimates with contingency." canonicalPath="/clara" />

      {/* Section Navigator dynamically injected into SolutionsNavbar */}
      <SectionNavigator currentStep={currentStep} setStep={scrollToStep} />

      {/* Hero (Section 0) sits natively at the top of the page flow */}
      <div className="w-full min-h-[90vh] flex items-center justify-center bg-[#0a0608] text-white pt-10">
        <Section0Hero onNext={() => scrollToStep(1)} />
      </div>

      {/* Second Section Frame: Interactive container (Steps 1 to 4) */}
      <div ref={containerRef} className="relative w-full" style={{ height: '350vh' }}>
        <div className="sticky top-20 left-0 right-0 h-[calc(100vh-80px)] overflow-hidden bg-[#0a0608] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center pb-8">
                  <Section1VoiceCapture onComplete={() => scrollToStep(2)} />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex items-center justify-center pb-8">
                  <Section2_1OrganizedScope onComplete={() => scrollToStep(3)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3 (First Stage - Loading Estimate document ONLY without any frame) */}
            {currentStep === 3 && !estimateComplete && (
              <motion.div
                key="step3-loading"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-5 py-4 max-w-5xl mx-auto"
              >
                <div className="w-full text-center shrink-0 mb-4">
                  <h2 className="text-3xl font-medium text-white md:text-4xl">Your estimate.</h2>
                </div>

                <motion.div
                  layoutId="estimate-card-container"
                  className="w-full max-w-[40rem] mx-auto overflow-hidden rounded-[1.25rem] bg-[#fdf9fb] border border-[#e8cbd9]/40 shadow-[0_24px_80px_rgba(0,0,0,0.15)] flex flex-col h-fit max-h-[70vh]"
                >
                  <div className="overflow-y-auto overflow-x-hidden">
                    <EstimateDocumentContent {...sharedEstimateProps} />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3 (Loaded Stage with MacBook frame chassis) & Step 4 (Chat view) */}
            {((currentStep === 3 && estimateComplete) || currentStep === 4) && (
              <motion.div
                key="step3-loaded-step4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-5 py-4 max-w-5xl mx-auto"
              >
                <div className="w-full text-center shrink-0 mb-3">
                  <h2 className="text-3xl font-medium text-white md:text-4xl">
                    {currentStep === 3 ? "Your estimate." : "Plan, Propose, Share."}
                  </h2>
                </div>

                {/* MAC LAPTOP MOCKUP CHASSIS (Shared Layout element) */}
                <motion.div
                  layoutId="macbook-chassis"
                  className="relative w-full max-w-[48rem] rounded-2xl md:rounded-3xl border-2 md:border-8 border-neutral-800 bg-neutral-950 p-1 md:p-2 shadow-[0_24px_80px_rgba(0,0,0,0.5)] flex flex-col h-fit max-h-[65vh] overflow-hidden"
                  transition={{ duration: 0.5 }}
                >
                  {/* Webcam Indicator */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-neutral-900 z-50" />

                  {/* Browser chrome wrapper */}
                  <div className="w-full rounded-xl overflow-hidden bg-[#fdf9fb] border border-[#e8cbd9]/30 flex flex-col min-h-0 flex-1">
                    
                    {/* Browser Address Bar */}
                    <div className="flex items-center gap-2 border-b border-[#e8cbd9]/40 bg-[#f8f1f4] px-4 py-2 shrink-0">
                      <div className="flex gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                        <div className="h-2 w-2 rounded-full bg-yellow-400" />
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                      </div>
                      <div className="mx-auto flex items-center gap-2 rounded-md bg-[#fdf9fb] border border-[#e8cbd9]/30 px-4 py-1 text-[10px] text-[#7e5c70] font-mono w-60 justify-center">
                        <Lock className="h-2.5 w-2.5 text-[#c284a3]" />
                        <span>{currentStep === 3 ? "b2w-ai.com/estimate" : "chat.b2w-ai.com"}</span>
                      </div>
                    </div>

                    {/* Viewport Content */}
                    <div className="flex-1 overflow-y-auto bg-[#fdf9fb] p-4 relative min-h-0">
                      <AnimatePresence mode="wait">
                        {currentStep === 3 ? (
                          <motion.div
                            key="estimate-viewport"
                            layoutId="estimate-card-container"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4 }}
                          >
                            <EstimateDocumentContent {...sharedEstimateProps} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="chat-viewport"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex flex-col h-full max-w-2xl mx-auto py-2"
                          >
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                              {/* Message 1 (User Request) */}
                              <div className="flex items-start gap-3 justify-end">
                                <div className="rounded-2xl rounded-tr-sm bg-neutral-800 px-4 py-3 text-sm text-neutral-200 max-w-[80%]">
                                  Can you convert this estimate into a client-facing proposal and share it with John?
                                </div>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                                  <Users className="h-4 w-4 text-neutral-400" />
                                </div>
                              </div>
                              
                              {/* Message 2 (Clara Reply) */}
                              <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black border border-[#e8cbd9]/20 shadow-sm">
                                  <B2WLogoMark className="h-4 w-4" />
                                </div>
                                <div className="rounded-2xl rounded-tl-sm border border-[#e8cbd9]/30 bg-white px-4 py-3 text-sm text-[#2b1724] max-w-[80%] shadow-sm">
                                  <p>Absolutely! I've drafted the proposal and emailed the link to John.</p>
                                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[#e8cbd9]/40 bg-[#fdf9fb] p-3 shadow-sm">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded bg-sky-50">
                                        <FileText className="h-4 w-4 text-sky-500" />
                                      </div>
                                      <div className="text-left">
                                        <p className="font-semibold text-[13px] text-[#2b1724]">Living Room Renovation.pdf</p>
                                        <p className="text-[11px] text-[#5e4252]">Sent to john@example.com</p>
                                      </div>
                                    </div>
                                    <button className="rounded-full bg-sky-500 p-2 text-white shadow-sm hover:bg-sky-600 transition">
                                      <Share2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Chat input footer */}
                            <div className="relative pt-4">
                              <input type="text" placeholder="Ask Clara anything..." disabled className="w-full rounded-full border border-[#e8cbd9]/40 bg-white py-2.5 pl-4 pr-12 text-sm text-[#2b1724] placeholder-neutral-400 outline-none shadow-sm" />
                              <div className="absolute right-1.5 top-5.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#f5dce8] text-[#2b1724]"><Send className="h-3 w-3" /></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </motion.div>

                {/* Bottom CTA Overlay */}
                <div className="shrink-0 mt-6 z-50 flex justify-center w-full pb-2">
                  <AnimatePresence mode="wait">
                    {currentStep === 3 && estimateComplete && (
                      <motion.button
                        key="share-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scrollToStep(4)}
                        className="clara-cta relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-[#f5dce8] px-8 py-3 text-sm font-bold text-[#2b1724] shadow-[0_12px_40px_rgba(245,220,232,0.3)] transition hover:opacity-95"
                      >
                        <Share2 className="h-4 w-4" /> Share & Chat
                      </motion.button>
                    )}

                    {currentStep === 4 && (
                      <motion.a
                        key="try-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        href="https://chat.b2w-ai.com"
                        target="_blank"
                        rel="noreferrer"
                        className="relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-cyan-400 px-8 py-3 text-sm font-bold text-black shadow-[0_0_0_1px_rgba(34,211,238,0.24)] transition hover:opacity-95 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                      >
                        Try it out <ArrowRight className="h-4 w-4" />
                      </motion.a>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
