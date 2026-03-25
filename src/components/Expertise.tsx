import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type ExpertiseCard = {
  title: string;
  description: string;
  href: string;
  accentClassName: string;
  borderClassName: string;
};

const expertiseCards: ExpertiseCard[] = [
  {
    title: 'Growth',
    description: 'Marketing, positioning, and customer acquisition support for businesses that need a clearer path to demand.',
    href: '/services/marketing-advisory',
    accentClassName: 'text-emerald-700',
    borderClassName: 'border-emerald-200',
  },
  {
    title: 'Optimization',
    description: 'Operational systems, workflow improvements, and implementation support that make day-to-day execution more reliable.',
    href: '/services/operations-implementation',
    accentClassName: 'text-sky-700',
    borderClassName: 'border-sky-200',
  },
  {
    title: 'M&A',
    description: 'Financial review, valuation support, and transaction-facing analysis for owners preparing for major business decisions.',
    href: '/services/financial-review',
    accentClassName: 'text-amber-700',
    borderClassName: 'border-amber-200',
  },
];

export default function Expertise() {
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
          We shape your business to grow by discovering what additional elements drive most value.
        </p>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {expertiseCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className={`group relative overflow-hidden border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-black ${card.borderClassName}`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.02),transparent_45%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col p-6 md:p-8">
              <p className={`mb-6 text-[11px] font-mono uppercase tracking-[0.28em] ${card.accentClassName}`}>
                {card.title}
              </p>
              <p className="mb-8 flex-1 text-lg leading-relaxed text-neutral-700">
                {card.description}
              </p>
              <Link
                to={card.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-black"
              >
                View options
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-base text-neutral-600">Need customized expertise?</p>
        <a
          href="mailto:info@b2w-ai.com?subject=Custom%20Solution%20Inquiry"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
        >
          Reach out for custom solution development
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}
