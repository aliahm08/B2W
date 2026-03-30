import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Mic, Sparkles, MessageSquare, Cpu, Shield, Send, Bot, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import AiSolutionsForm from '../../components/forms/AiSolutionsForm';
import { aiSolutions } from '../../content/aiSolutions';

/* ─────────────────────────────────────────────────────────────────────────────
   B2W Solutions Page — Product walkthrough
   
   Layout:
     Hero       → Voice recording entering the AI (full viewport cinematic)
     Section 1  → Voice to Plan — chatbot resolves the recording into a plan
     Section 2  → Estimation Engine — proprietary model, $200M+ commercial value
     Section 3  → The B2W Guarantee — deliverables + AI agent + integrations
   
   Scroll mechanic:
     Each section slides up and covers the previous one. The outgoing section
     blurs and scales down slightly behind the incoming card, like layered
     blueprint drawings in a set.
   ───────────────────────────────────────────────────────────────────────── */

type StageId = 'hero' | 'chatbot' | 'engine' | 'guarantee';

/* ─── Audio Bars ─── */

function AudioBars({ count = 20, color = 'sky' }: { count?: number; color?: 'sky' | 'teal' | 'white' }) {
  const heights = useMemo(
    () => Array.from({ length: count }, (_, i) => 10 + Math.abs(Math.sin(i * 1.8 + 0.5)) * 34),
    [count],
  );
  const gradients: Record<string, string> = {
    sky: 'linear-gradient(180deg, rgba(56,189,248,0.9), rgba(56,189,248,0.3))',
    teal: 'linear-gradient(180deg, rgba(45,212,191,0.9), rgba(45,212,191,0.3))',
    white: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.25))',
  };

  return (
    <div className="flex items-end gap-[2px]" style={{ height: 48 }}>
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full"
          style={{ background: gradients[color] }}
          animate={{ height: [h * 0.55, h, h * 0.65] }}
          transition={{ duration: 1.2 + i * 0.03, repeat: Infinity, delay: i * 0.035, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO ANIMATION — Voice → Phone → Estimate
   The entire pipeline in one cinematic frame.
   ═══════════════════════════════════════════════════════════════════════ */

function HeroCinematic() {
  return (
    <div className="relative mx-auto flex min-h-[28rem] w-full max-w-[52rem] items-center justify-center md:min-h-[32rem]">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(56,189,248,0.10), transparent 70%)' }}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [0.97, 1.04, 0.97] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Left: incoming audio ── */}
      <motion.div
        className="absolute left-0 top-[38%] z-10 -translate-y-1/2 md:left-4"
        animate={{ x: [0, 6, 0], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="rounded-2xl border border-white/8 bg-[rgba(12,16,24,0.85)] px-4 py-3 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            <span className="text-[9px] uppercase tracking-[0.22em] text-red-300/70">Recording</span>
          </div>
          <AudioBars count={12} color="sky" />
        </div>
      </motion.div>

      {/* ── Beam: audio → phone ── */}
      <motion.div
        className="absolute left-[20%] top-[42%] z-0 h-px w-[16%] origin-left rotate-[4deg]"
        style={{ background: 'linear-gradient(90deg, rgba(56,189,248,0.5), rgba(45,212,191,0.7), transparent)' }}
        animate={{ opacity: [0.15, 0.85, 0.15], scaleX: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Center: phone device ── */}
      <motion.div
        className="relative z-20"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative h-[21rem] w-[11.5rem] rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,28,0.98)_0%,rgba(9,13,18,0.97)_100%)] p-2.5 shadow-[0_36px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* Notch */}
          <div className="absolute left-1/2 top-2.5 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/12" />
          <div className="flex h-full flex-col rounded-[1.6rem] border border-white/5 bg-white/[0.03] px-3 py-4">
            {/* Header */}
            <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.22em]">
              <span className="text-neutral-500">B2W</span>
              <span className="text-teal-300/60">AI</span>
            </div>

            {/* Waveform */}
            <div className="mt-4 rounded-[1rem] border border-white/5 bg-white/[0.02] p-2.5">
              <AudioBars count={18} color="teal" />
            </div>

            {/* Transcript */}
            <div className="mt-2.5 rounded-[1rem] border border-teal-300/8 bg-teal-300/[0.03] p-2.5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-teal-200/50">Transcript</p>
              <p className="mt-1 text-[9px] leading-[14px] text-neutral-400">
                Six cameras, rear conduit, mobile alerts, 2-weekend install…
              </p>
            </div>

            {/* Status pills */}
            <div className="mt-auto flex gap-1">
              {['Scope', 'Model', 'Export'].map((s, i) => (
                <motion.span
                  key={s}
                  className="flex-1 rounded-full border border-white/5 py-1 text-center text-[7px] uppercase tracking-[0.14em] text-neutral-600"
                  animate={{ borderColor: ['rgba(255,255,255,0.05)', 'rgba(56,189,248,0.25)', 'rgba(255,255,255,0.05)'] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Beam: phone → estimate ── */}
      <motion.div
        className="absolute right-[20%] top-[42%] z-0 h-px w-[16%] origin-right -rotate-[4deg]"
        style={{ background: 'linear-gradient(270deg, rgba(45,212,191,0.5), rgba(168,85,247,0.6), transparent)' }}
        animate={{ opacity: [0.15, 0.85, 0.15], scaleX: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />

      {/* ── Right: estimate document ── */}
      <motion.div
        className="absolute right-0 top-[36%] z-10 -translate-y-1/2 md:right-4"
        animate={{ x: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        <div className="w-[10.5rem] rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(242,246,255,0.97))] p-3 text-black shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500">Estimate</span>
            <Sparkles className="h-3 w-3 text-teal-600" />
          </div>
          <p className="mt-1 text-[13px] font-medium text-neutral-950">Single-page export</p>
          <div className="mt-2.5 space-y-1.5">
            {[['Project', '$23,400'], ['Margin', '41%'], ['Install', '2 weekends']].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-neutral-200/80 bg-white px-2 py-1.5">
                <p className="text-[7px] uppercase tracking-[0.2em] text-neutral-400">{l}</p>
                <p className="text-[12px] font-medium text-neutral-950">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Bottom: model context chip ── */}
      <motion.div
        className="absolute bottom-6 left-[18%] z-10"
        animate={{ y: [0, 5, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div className="rounded-lg border border-white/6 bg-[rgba(12,16,24,0.8)] px-3 py-1.5 backdrop-blur-sm">
          <p className="text-[7px] uppercase tracking-[0.2em] text-purple-300/60">Financial Model</p>
          <p className="mt-0.5 text-[10px] text-neutral-500">Equip $9.8k · Labor $5.7k · 41%</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION VISUALS — each one is its own standalone animation panel
   ═══════════════════════════════════════════════════════════════════════ */

function ChatbotVisual() {
  const messages = [
    { from: 'ai' as const, text: 'What\'s the conduit length to the utility room?' },
    { from: 'user' as const, text: 'About 45 feet — there\'s an existing chase.' },
    { from: 'ai' as const, text: 'Updated. Conduit cost reduced from $2,400 to $1,600. Margin improved to 44%.' },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-2.5">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`max-w-[84%] rounded-2xl px-4 py-3 text-[13px] leading-6 ${
              m.from === 'ai'
                ? 'border border-teal-300/10 bg-teal-300/[0.06] text-teal-100'
                : 'ml-auto border border-white/6 bg-white/[0.05] text-neutral-200'
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      {/* Resolved scope items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="mt-4 rounded-xl border border-white/6 bg-white/[0.025] p-3.5"
      >
        <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-neutral-500">Scope resolved</p>
        <div className="flex flex-wrap gap-1.5">
          {['6 cameras', 'Rear conduit (45ft)', 'Mobile alerts', '2-weekend install', 'Existing chase'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full border border-teal-300/12 bg-teal-300/[0.05] px-2.5 py-1 text-[10px] text-teal-200/80">
              <Check className="h-2.5 w-2.5" />
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EngineVisual() {
  const rows = [
    { label: 'Equipment', value: '$9,800', pct: 42 },
    { label: 'Labor', value: '$5,700', pct: 28 },
    { label: 'Overhead', value: '$2,200', pct: 14 },
    { label: 'Margin', value: '41%', pct: 41 },
    { label: 'Sell Price', value: '$23,400', pct: 88 },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Engine header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-purple-300" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-purple-300/70">Estimation Engine</span>
        </div>
        <span className="rounded-full border border-purple-300/15 bg-purple-300/[0.06] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-purple-200/80">
          $200M+ informed
        </span>
      </div>

      {/* Calculation rows */}
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between text-[10px]">
              <span className="uppercase tracking-[0.18em] text-neutral-500">{r.label}</span>
              <motion.span
                className="font-medium text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                {r.value}
              </motion.span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.5), rgba(56,189,248,0.7))' }}
                initial={{ width: 0 }}
                animate={{ width: `${r.pct}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Output stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-5 grid grid-cols-3 gap-2"
      >
        {[['Confidence', '0.86'], ['Version', 'v4.2'], ['Accuracy', '±3.2%']].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-center">
            <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-500">{l}</p>
            <p className="mt-0.5 text-sm font-medium text-white">{v}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function GuaranteeVisual() {
  const activities = [
    { text: 'Estimate sent to stakeholders via email', done: true },
    { text: 'Contractor follow-up scheduled on Slack', done: true },
    { text: 'Project timeline updated on Teams', active: true },
    { text: 'WhatsApp group created for site crew', pending: true },
  ];
  const integrations = [
    { name: 'Slack', slug: 'slack' },
    { name: 'WhatsApp', slug: 'whatsapp' },
    { name: 'Gmail', slug: 'gmail' },
    { name: 'Teams', slug: 'microsoftteams' },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Deliverables */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {['Estimate', 'Plan', 'Assumptions', 'Task List', 'Export Pack'].map((d) => (
          <span key={d} className="rounded-full border border-amber-300/12 bg-amber-300/[0.05] px-3 py-1.5 text-[10px] text-amber-100/90">
            {d}
          </span>
        ))}
      </div>

      {/* AI Agent activity */}
      <div className="rounded-xl border border-white/6 bg-white/[0.025] p-4">
        <div className="mb-3 flex items-center gap-2">
          <Bot className="h-4 w-4 text-amber-200" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-200/70">AI Agent</span>
          <motion.div
            className="ml-auto h-2 w-2 rounded-full bg-emerald-400"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </div>
        <div className="space-y-2">
          {activities.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.3, duration: 0.4 }}
              className="flex items-center gap-2.5 rounded-lg border border-white/4 bg-white/[0.015] px-3 py-2 text-[11px] text-neutral-300"
            >
              {a.done ? (
                <Check className="h-3 w-3 shrink-0 text-emerald-400" />
              ) : a.active ? (
                <motion.div className="h-2 w-2 shrink-0 rounded-full bg-amber-300" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} />
              ) : (
                <div className="h-2 w-2 shrink-0 rounded-full bg-white/10" />
              )}
              {a.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="mt-4 grid grid-cols-4 gap-2"
      >
        {integrations.map((integration) => (
          <div key={integration.name} className="rounded-lg border border-emerald-400/10 bg-white/[0.02] px-2 py-2 text-center">
            <img
              src={`https://cdn.simpleicons.org/${integration.slug}/22c55e?viewbox=auto`}
              alt={`${integration.name} icon`}
              className="mx-auto mb-1 h-4 w-4"
              loading="lazy"
              decoding="async"
            />
            <span className="text-[8px] uppercase tracking-[0.15em] text-emerald-300">{integration.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION DATA — no explanatory copy, let the product speak
   ═══════════════════════════════════════════════════════════════════════ */

const sections: Array<{
  id: StageId;
  step: string;
  label: string;
  headline: string;
  sub: string;
  accent: string;
  Visual: () => React.JSX.Element;
}> = [
  {
    id: 'chatbot',
    step: '02',
    label: 'Voice To Plan',
    headline: 'Your recording becomes a conversation.',
    sub: 'The AI picks up where the recording left off — asking follow-ups, resolving scope, and locking in the details that turn a field note into a plan.',
    accent: 'rgba(45,212,191,0.9)',
    Visual: ChatbotVisual,
  },
  {
    id: 'engine',
    step: '03',
    label: 'Estimation Engine',
    headline: 'The model runs your numbers.',
    sub: 'Equipment, labor, margin, sell price — calculated instantly by a proprietary engine informed by $200M+ in real commercial value.',
    accent: 'rgba(168,85,247,0.9)',
    Visual: EngineVisual,
  },
  {
    id: 'guarantee',
    step: '04',
    label: 'The B2W Guarantee',
    headline: 'An AI agent ships the work.',
    sub: 'Deliverables export automatically. An agent handles outreach, scheduling, and contractor coordination across Slack, WhatsApp, Gmail, and Teams.',
    accent: 'rgba(251,191,36,0.9)',
    Visual: GuaranteeVisual,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL SECTIONS — cards that stack and blur
   ═══════════════════════════════════════════════════════════════════════ */

function ScrollSection({
  section,
  index,
}: {
  section: (typeof sections)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 = section top at viewport bottom, 1 = section top at viewport top
      const raw = 1 - rect.top / vh;
      setScrollProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="solutions-scroll-section sticky top-0 min-h-screen"
      style={{ zIndex: 10 + index }}
    >
      {/* Full viewport card */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080a0f]">
        {/* Section-specific accent glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 50% 40%, ${section.accent.replace('0.9', '0.06')}, transparent 65%)`,
          }}
        />

        {/* Top accent bar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 20%, ${section.accent.replace('0.9', '0.4')}, transparent 80%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: copy */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[12px] font-medium text-white"
                  style={{ background: `linear-gradient(135deg, ${section.accent}, rgba(255,255,255,0.06))` }}
                >
                  {section.step}
                </div>
                <span className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">{section.label}</span>
              </div>

              <h2 className="max-w-md text-[2.6rem] font-medium leading-[1.06] tracking-[-0.04em] text-white md:text-[3.4rem]">
                {section.headline}
              </h2>

              <p className="mt-5 max-w-md text-lg leading-8 text-neutral-400">
                {section.sub}
              </p>
            </div>

            {/* Right: visual */}
            <div className="rounded-2xl border border-white/6 bg-[rgba(12,16,24,0.7)] p-5 backdrop-blur-sm md:p-7">
              <section.Visual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */

export default function SolutionsLandingPage() {
  return (
    <>
      <Seo
        title="B2W AI — Voice to Estimate in Seconds"
        description="Record the job on-site. B2W transcribes, scopes, runs the financial model, and exports a single-page estimate. $200M+ in commercial value powering every calculation."
        canonicalPath="/solutions"
      />

      <div className="solutions-page text-white">
        {/* ─── HERO — Voice to Plan (viewport 1) ─── */}
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080a0f] to-transparent" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 pb-16 md:pt-28">
            {/* Centered hero copy */}
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-4 py-1.5"
              >
                <Mic className="h-3.5 w-3.5 text-sky-300" />
                <span className="text-[10px] uppercase tracking-[0.28em] text-sky-200/80">Voice To Plan</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="mt-6 text-[3rem] font-medium leading-[1.04] tracking-[-0.05em] md:text-[5rem] md:leading-[0.94]"
              >
                Record the job.
                <br />
                <span className="bg-gradient-to-r from-sky-200 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  Get the estimate.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="mx-auto mt-5 max-w-xl text-lg leading-8 text-neutral-400 md:text-xl"
              >
                Speak into your phone on-site. B2W transcribes, runs the financial model, and hands back a single-page estimate — before you leave.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
              >
                <Link
                  to="/solutions/voice-to-plan"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                >
                  Open voice-to-plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#flow"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/[0.03]"
                >
                  See the system
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#ai-intake"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/[0.03]"
                >
                  Talk to B2W AI
                </a>
              </motion.div>
            </div>

            {/* Hero animation — cinematic pipeline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-10"
            >
              <div className="rounded-[2rem] border border-white/6 bg-[rgba(12,16,24,0.65)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-6">
                <HeroCinematic />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── SCROLL SECTIONS — layer on top of each other ─── */}
        <div id="flow">
          {sections.map((section, i) => (
            <ScrollSection key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* ─── CLOSING CTA ─── */}
        <section className="relative z-[20] bg-[#080a0f]">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/6 bg-[rgba(12,16,24,0.7)] p-8 backdrop-blur-sm md:p-14">
              {/* BG accents */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 50% 40% at 20% 80%, rgba(56,189,248,0.06), transparent), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(168,85,247,0.05), transparent)',
                }}
              />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="max-w-xl text-[2.4rem] font-medium leading-[1.06] tracking-[-0.04em] text-white md:text-[3.2rem]">
                    Bring the recording.
                    <br />
                    <span className="text-neutral-500">We build the system.</span>
                  </h2>
                  <p className="mt-4 max-w-lg text-lg leading-8 text-neutral-500">
                    Voice-to-plan, estimation engine, AI agent, and integrations — one connected workflow.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#ai-intake"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                  >
                    Talk to B2W AI
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="https://chat.b2w-ai.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/[0.03]"
                  >
                    Live demo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 bg-[#0d1116]">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Solution Pages</p>
              <h2 className="mt-4 text-[2.4rem] font-medium leading-[1.06] tracking-[-0.04em] text-white md:text-[3.2rem]">
                Open the exact workflow you want to explore.
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-400">
                Each page explains where the system fits, what B2W builds, and what the output looks like in practice.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {aiSolutions.map((solution) => (
                <motion.div key={solution.slug} whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
                  <Link
                    to={`/solutions/${solution.slug}`}
                    className="group block h-full rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#141a24_0%,#10151d_100%)] p-6 transition-colors hover:border-white/24"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{solution.navLabel}</p>
                    <p className="mt-4 text-2xl font-medium tracking-tight text-white">{solution.title}</p>
                    <p className="mt-4 text-sm leading-7 text-neutral-300">{solution.summary}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white">
                      Open subpage
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-intake" className="scroll-mt-32 border-t border-white/8 bg-[#080a0f]">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
            <div className="mb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Start Here</p>
              <h2 className="mt-4 text-[2.4rem] font-medium leading-[1.06] tracking-[-0.04em] text-white md:text-[3.2rem]">
                Tell B2W what the AI should do.
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-400">
                This intake is specific to AI systems. Use it to describe the workflow, the business logic, and the
                systems the AI needs to touch.
              </p>
            </div>
            <AiSolutionsForm sourceLabel="AI Solutions landing" />
          </div>
        </section>
      </div>
    </>
  );
}
