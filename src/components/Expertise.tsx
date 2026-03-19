import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import {
  categories,
  tiers,
  expertiseMatrix,
  categoryDescriptions,
  tierDescriptions,
  type Category,
  type Tier,
} from '../content/expertiseData';
import ExpertiseBookingModal from './ExpertiseBookingModal';
import { getExpertiseBookingLabel, getExpertiseMetricLabel } from '../lib/expertise';

const categoryAccentClasses: Record<Category, { active: string; card: string }> = {
  Growth: {
    active: 'border-emerald-600 bg-emerald-600 text-white',
    card: 'border-emerald-200',
  },
  Optimization: {
    active: 'border-sky-600 bg-sky-600 text-white',
    card: 'border-sky-200',
  },
  'M&A': {
    active: 'border-amber-600 bg-amber-600 text-white',
    card: 'border-amber-200',
  },
};

const infoTypeLabels = [
  { key: 'deliverable' as const, label: 'Deliverable', mono: false },
  { key: 'terms' as const, label: 'Terms', mono: false },
];

export default function Expertise() {
  const [activeCategory, setActiveCategory] = useState<Category>('Growth');
  const accent = categoryAccentClasses[activeCategory];
  const [selectedBooking, setSelectedBooking] = useState<{ tier: Tier; serviceLabel: string } | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="mb-4 text-4xl font-medium tracking-tight">Expertise</h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-neutral-600">
          What we deliver, how engagements are structured, and the value they create.
        </p>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      {/* Category tabs */}
      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`border px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? accent.active
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Category description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeCategory}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-10 text-lg font-medium text-neutral-500"
        >
          {categoryDescriptions[activeCategory]}
        </motion.p>
      </AnimatePresence>

      {/* Tier cards */}
      <div className="grid gap-6">
        {tiers.map((tier, tierIndex) => {
          const cell = expertiseMatrix[tier][activeCategory];
          const serviceLabel = getExpertiseBookingLabel(activeCategory, tier, cell);

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: tierIndex * 0.06 }}
              className={`group relative border bg-white transition-colors duration-300 ${accent.card}`}
            >
              <button
                type="button"
                onClick={() => setSelectedBooking({ tier, serviceLabel })}
                className="absolute inset-0 z-10"
                aria-label={`Book a call for ${serviceLabel}`}
              />
              <div className="pointer-events-none absolute inset-3 border border-black/0 opacity-0 transition-all duration-200 group-hover:border-black/15 group-hover:opacity-100" />
              <div className="pointer-events-none absolute right-6 top-6 z-20 translate-y-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                Book a call
              </div>
              {/* Tier header */}
              <div className="relative border-b border-neutral-100 px-6 py-5 md:px-8">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                  <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                    {tier}
                  </span>
                  <span className="text-xs text-neutral-400 leading-relaxed">
                    {tierDescriptions[tier]}
                  </span>
                </div>
              </div>

              {/* Cell content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tier}-${activeCategory}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="relative grid gap-6 px-6 py-6 md:grid-cols-3 md:px-8"
                >
                  <div>
                    <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.26em] text-neutral-400">
                      {getExpertiseMetricLabel(activeCategory)}
                    </span>
                    <span className="text-2xl font-medium tracking-tight text-neutral-950">
                      {cell.value}
                    </span>
                  </div>
                  {infoTypeLabels.map(({ key, label }) => (
                    <div key={key}>
                      <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.26em] text-neutral-400">
                        {label}
                      </span>
                      {key === 'deliverable' ? (
                        <ul className="space-y-2">
                          {cell[key].split(',').map((item) => (
                            <li key={item.trim()} className="flex items-start gap-2 text-base font-medium text-neutral-800">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                              <span>{item.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-sm leading-relaxed text-neutral-500">
                          {cell[key]}
                        </span>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Custom solution CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12 border-t border-neutral-200 pt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-base text-neutral-600">
          Need something outside the box?
        </p>
        <a
          href="mailto:info@b2w-ai.com?subject=Custom%20Solution%20Inquiry"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-black underline decoration-neutral-300 underline-offset-4 hover:decoration-black"
        >
          Reach out for custom solution development
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>

      <ExpertiseBookingModal
        isOpen={selectedBooking !== null}
        serviceLabel={selectedBooking?.serviceLabel ?? ''}
        onClose={() => setSelectedBooking(null)}
      />
    </section>
  );
}
