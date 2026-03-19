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
} from '../content/expertiseData';
import { getCalendlyUrl, openCalendly } from '../lib/engagement';

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
  { key: 'value' as const, label: 'Value', mono: false },
  { key: 'terms' as const, label: 'Terms', mono: false },
];

export default function Expertise() {
  const [activeCategory, setActiveCategory] = useState<Category>('Growth');
  const accent = categoryAccentClasses[activeCategory];
  const calendlyUrl = getCalendlyUrl();

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
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Tell us about your business
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={openCalendly}
            className="inline-flex items-center gap-2 border border-black px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            {calendlyUrl ? 'Book a call' : 'Add Calendly URL'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
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

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: tierIndex * 0.06 }}
              className={`border bg-white transition-colors duration-300 ${accent.card}`}
            >
              {/* Tier header */}
              <div className="border-b border-neutral-100 px-6 py-5 md:px-8">
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
                  className="grid gap-6 px-6 py-6 md:grid-cols-3 md:px-8"
                >
                  {infoTypeLabels.map(({ key, label }) => (
                    <div key={key}>
                      <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.26em] text-neutral-400">
                        {label}
                      </span>
                      {key === 'value' ? (
                        <span className="text-2xl font-medium tracking-tight text-neutral-950">
                          {cell[key]}
                        </span>
                      ) : key === 'deliverable' ? (
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
    </section>
  );
}
