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
    description: 'Marketing data reveals where demand is forming, where conversion is weak, and where growth effort should be redirected or amplified.',
    href: '/growth',
    accentClassName: 'text-emerald-700',
    borderClassName: 'border-emerald-200',
  },
  {
    title: 'Optimization',
    description: 'Operational performance analysis exposes execution drag, bottlenecks, and process gaps so the business can run with more consistency and less waste.',
    href: '/capabilities/operational-performance',
    accentClassName: 'text-sky-700',
    borderClassName: 'border-sky-200',
  },
  {
    title: 'Diligence',
    description: 'Financial review clarifies margins, cash flow, and hidden pressure points so major decisions are grounded in the numbers behind the business.',
    href: '/capabilities/financials',
    accentClassName: 'text-amber-700',
    borderClassName: 'border-amber-200',
  },
];

export default function Expertise() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-8 sm:mb-10"
      >
        <h2 className="mb-4 max-w-[12ch] text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
          Our Capabilities
        </h2>
        <p className="mb-7 max-w-3xl text-base leading-7 text-neutral-600 sm:mb-8 sm:text-lg sm:leading-8">
          We use marketing data, operational performance, and financials to understand how the business is actually performing, then frame the growth, optimization, and diligence work that matters most.
        </p>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
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
            <div className="relative flex h-full flex-col p-5 sm:p-6 md:p-8">
              <p className={`mb-5 text-[11px] font-mono uppercase tracking-[0.28em] ${card.accentClassName}`}>
                {card.title}
              </p>
              <p className="mb-7 flex-1 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
                {card.description}
              </p>
              <Link
                to={card.href}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-black"
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
        className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-7 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:pt-8"
      >
        <p className="text-base text-neutral-600">Need customized expertise?</p>
        <Link
          to="/#contact"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
        >
          Get a project estimate today.
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
