import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Bot, Check, DollarSign, Flag, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessHorizons, type BusinessHorizon } from '../../content/unifiedSite';
import { trackSiteEvent } from '../../lib/siteAnalytics';
import { StatusBadge } from './PublicUI';

const detailGroups = [
  { id: 'product', label: 'Product', Icon: Bot },
  { id: 'pricing', label: 'Pricing', Icon: DollarSign },
  { id: 'success', label: 'Success', Icon: Target },
] as const;

type DetailId = (typeof detailGroups)[number]['id'];

function HorizonButton({ horizon, active, onSelect }: { horizon: BusinessHorizon; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group min-h-36 border p-5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] ${active ? 'border-[var(--b2w-forest)] bg-[var(--b2w-forest)] text-white shadow-[var(--b2w-shadow)]' : 'border-[var(--b2w-line)] bg-white/65 hover:-translate-y-1 hover:bg-white'}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${active ? 'text-[var(--b2w-gold)]' : 'text-[var(--b2w-gold-dark)]'}`}>{horizon.sourceLabel} in the plan</span>
        <ArrowRight className={`h-4 w-4 transition ${active ? 'translate-x-0 text-[var(--b2w-gold)]' : '-translate-x-1 text-[var(--b2w-ink-faint)] group-hover:translate-x-0'}`} />
      </span>
      <span className="mt-7 block text-2xl font-medium tracking-[-0.035em]">{horizon.label}</span>
      <span className={`mt-2 block text-xs leading-5 ${active ? 'text-white/60' : 'text-[var(--b2w-ink-muted)]'}`}>{horizon.headline}</span>
    </button>
  );
}

export default function BusinessHorizonExplorer({ compact = false }: { compact?: boolean }) {
  const [activeId, setActiveId] = useState<BusinessHorizon['id']>('now');
  const [detailId, setDetailId] = useState<DetailId>('product');
  const shouldReduceMotion = useReducedMotion();
  const horizon = businessHorizons.find((item) => item.id === activeId) ?? businessHorizons[0];
  const detail = horizon[detailId];

  const chooseHorizon = (id: BusinessHorizon['id']) => {
    setActiveId(id);
    trackSiteEvent('business_horizon_selected', { horizon: id });
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--b2w-line)] bg-[var(--b2w-canvas)] shadow-[var(--b2w-shadow)]">
      <div className="grid gap-px bg-[var(--b2w-line)] md:grid-cols-3">
        {businessHorizons.map((item) => <HorizonButton key={item.id} horizon={item} active={item.id === activeId} onSelect={() => chooseHorizon(item.id)} />)}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white"
        >
          <div className={`grid gap-8 p-6 sm:p-8 ${compact ? '' : 'lg:grid-cols-[minmax(0,.78fr)_minmax(420px,1.22fr)] lg:p-10'}`}>
            <div>
              <div className="flex flex-wrap items-center gap-3"><StatusBadge stage={horizon.status} /><span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-ink-faint)]">Business Plan horizon</span></div>
              <h3 className="mt-6 max-w-[16ch] text-4xl font-medium leading-[1] tracking-[-0.045em] sm:text-5xl">{horizon.headline}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--b2w-ink-muted)]">{horizon.summary}</p>
              <div className="mt-7 border-l-2 border-[var(--b2w-gold)] bg-[var(--b2w-gold-soft)]/45 p-5">
                <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--b2w-gold-dark)]"><Flag className="h-3.5 w-3.5" />Gate before advancing</p>
                <p className="mt-3 text-sm leading-6 text-[var(--b2w-ink-muted)]">{horizon.gate}</p>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-2" role="tablist" aria-label={`${horizon.label} business plan areas`}>
                {detailGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    role="tab"
                    aria-selected={detailId === group.id}
                    onClick={() => setDetailId(group.id)}
                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold transition ${detailId === group.id ? 'border-[var(--b2w-rust)] bg-[var(--b2w-rust-soft)] text-[var(--b2w-rust-dark)]' : 'border-[var(--b2w-line)] bg-[var(--b2w-canvas)] text-[var(--b2w-ink-muted)] hover:bg-white'}`}
                  >
                    <group.Icon className="h-4 w-4" />{group.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.article
                  key={`${activeId}-${detailId}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: .25 }}
                  className="mt-4 min-h-72 rounded-[1.5rem] bg-[var(--b2w-canvas-deep)] p-6 sm:p-8"
                >
                  <Sparkles className="h-5 w-5 text-[var(--b2w-rust)]" />
                  <h4 className="mt-8 text-3xl font-medium tracking-[-0.04em]">{detail.title}</h4>
                  <p className="mt-4 text-sm leading-7 text-[var(--b2w-ink-muted)]">{detail.body}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    {detail.points.map((point) => <li key={point} className="flex items-start gap-2 text-xs font-medium leading-5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--b2w-green)]" />{point}</li>)}
                  </ul>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col justify-between gap-4 border-t border-[var(--b2w-line)] bg-[var(--b2w-canvas-deep)] px-6 py-5 sm:flex-row sm:items-center sm:px-8">
        <p className="text-xs leading-5 text-[var(--b2w-ink-muted)]"><strong className="text-[var(--b2w-ink)]">How to read this:</strong> available work is current; next and in-store work remain subject to customer evidence, controls, and validation.</p>
        <Link to="/products/workflows" className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--b2w-rust)]">Review workflow stages<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link>
      </div>
    </div>
  );
}
