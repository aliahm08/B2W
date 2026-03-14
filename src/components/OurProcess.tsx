import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

type ProcessStep = {
  id: string;
  step: string;
  title: string;
  description: string;
};

const processSteps: ProcessStep[] = [
  {
    id: 'business-audit',
    step: '01',
    title: 'Business Audit',
    description:
      'We establish the operating baseline: offer clarity, process friction, system sprawl, market position, and where value is leaking.',
  },
  {
    id: 'due-diligence',
    step: '02',
    title: 'Due Diligence',
    description:
      'We pressure-test the business and technical reality against actual data, internal constraints, existing assets, and execution risk.',
  },
  {
    id: 'improvement-scoping',
    step: '03A',
    title: 'Improvement Scoping',
    description:
      'One track defines the intervention itself: what should change, what should stay manual, and what deliverables will produce the highest leverage.',
  },
  {
    id: 'contracting',
    step: '03B',
    title: 'Contracting with Engineers and Creatives',
    description:
      'In parallel, we assemble the right execution team and translate scope into working agreements, specialist roles, and delivery responsibilities.',
  },
  {
    id: 'initial-delivery',
    step: '04',
    title: 'Initial Delivery',
    description:
      'The branches converge into the first release: the system, assets, or workflows are delivered with approvals, checkpoints, and operational readiness.',
  },
  {
    id: 'publishing',
    step: '05',
    title: 'Publishing and Monitoring',
    description:
      'We publish, observe, and refine. Performance, adoption, and failure modes are monitored so the work can stabilize and compound.',
  },
];

export default function OurProcess() {
  const [openStepId, setOpenStepId] = useState(processSteps[1]?.id ?? processSteps[0].id);

  return (
    <section className="mx-auto max-w-7xl px-6 py-32" id="process">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="mb-4 text-4xl font-medium tracking-tight">Process</h1>
        <h2 className="mb-8 max-w-4xl text-xl font-medium leading-relaxed text-neutral-600 md:text-2xl">
          A narrow process, with deliberate branching only where specialist work needs to diverge.
        </h2>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      <div className="grid gap-3">
        {processSteps.map((step, index) => {
          const isOpen = step.id === openStepId;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className={`border transition-colors ${
                isOpen ? 'border-neutral-900 bg-white' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenStepId((current) => (current === step.id ? '' : step.id))}
                className="flex w-full items-start gap-6 px-6 py-6 text-left md:px-8"
                aria-expanded={isOpen}
              >
                <div className="min-w-14 pt-1 text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-medium tracking-tight md:text-2xl ${isOpen ? 'text-neutral-950' : 'text-neutral-700'}`}>
                    {step.title}
                  </h3>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 shrink-0 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-neutral-200 px-6 py-6 md:px-8">
                      <div className="ml-0 md:ml-20 max-w-3xl">
                        <p className="text-sm leading-7 text-neutral-600 md:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
