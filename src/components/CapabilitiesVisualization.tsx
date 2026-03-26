import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CapabilitiesVisualization() {
  const capabilityCards = [
    {
      title: 'Marketing Data',
      body: 'Instagram analytics, Google reviews and ads, website visits, click behavior, and conversion signals.',
      to: '/capabilities/marketing-data',
    },
    {
      title: 'Financials',
      body: 'Revenue trends, margins, cash flow, unit economics, and the financial constraints behind growth decisions.',
      to: '/capabilities/financials',
    },
    {
      title: 'Operational Performance',
      body: 'Workflow bottlenecks, staffing patterns, delivery capacity, and execution gaps that limit performance.',
      to: '/capabilities/operational-performance',
    },
  ];

  return (
    <div className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-4xl font-medium tracking-tight mb-4">Capabilities</h2>
        <p className="max-w-3xl text-base text-neutral-600 leading-relaxed mb-6">
          We analyze marketing data, financials, and operational performance. We use that analysis to
          identify the highest-leverage actions, implement solutions, and increase revenue.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {capabilityCards.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="group border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-black hover:bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="mb-3 text-lg font-medium tracking-tight text-neutral-950">{item.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{item.body}</p>
              </div>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black" />
            </div>
          </Link>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-neutral-200 pt-8"
      >
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Need help capturing better business data?
        </p>
        <Link
          to="/#contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
        >
          Schedule a Business Audit
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </motion.div>
    </div>
  );
}
