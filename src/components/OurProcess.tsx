import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

type ProcessStep = {
  id: string;
  step: string;
  title: string;
  description: string;
  interactionLabel: string;
  interactionDetail: string;
};

const processSteps: ProcessStep[] = [
  {
    id: 'business-audit',
    step: '01',
    title: 'Business Audit',
    description:
      'We establish the operating baseline: offer clarity, process friction, system sprawl, market position, and where value is leaking.',
    interactionLabel: 'Client Intake',
    interactionDetail: 'Founder interview, document review, and operating context capture.',
  },
  {
    id: 'due-diligence',
    step: '02',
    title: 'Due Diligence',
    description:
      'We pressure-test the business and technical reality against actual data, internal constraints, existing assets, and execution risk.',
    interactionLabel: 'Working Session',
    interactionDetail: 'Shared review of systems, data access, constraints, and priority decisions.',
  },
  {
    id: 'improvement-scoping',
    step: '03A',
    title: 'Improvement Scoping',
    description:
      'One track defines the intervention itself: what should change, what should stay manual, and what deliverables will produce the highest leverage.',
    interactionLabel: 'Scope Alignment',
    interactionDetail: 'Client-facing proposal review, tradeoff discussion, and approval path.',
  },
  {
    id: 'contracting',
    step: '03B',
    title: 'Contracting with Engineers and Creatives',
    description:
      'In parallel, we assemble the right execution team and translate scope into working agreements, specialist roles, and delivery responsibilities.',
    interactionLabel: 'Team Formation',
    interactionDetail: 'Stakeholder signoff on specialists, roles, budget, and delivery ownership.',
  },
  {
    id: 'initial-delivery',
    step: '04',
    title: 'Initial Delivery',
    description:
      'The branches converge into the first release: the system, assets, or workflows are delivered with approvals, checkpoints, and operational readiness.',
    interactionLabel: 'Client Review',
    interactionDetail: 'Demo, revision loop, launch approval, and handoff readiness check.',
  },
  {
    id: 'publishing',
    step: '05',
    title: 'Publishing and Monitoring',
    description:
      'We publish, observe, and refine. Performance, adoption, and failure modes are monitored so the work can stabilize and compound.',
    interactionLabel: 'Feedback Loop',
    interactionDetail: 'Ongoing reporting, user feedback intake, and performance-informed iteration.',
  },
];

const processRows = [
  ['business-audit'],
  ['due-diligence'],
  ['improvement-scoping', 'contracting'],
  ['initial-delivery'],
  ['publishing'],
] as const;

const branchStepIds = new Set(['improvement-scoping', 'contracting']);

function resolveOpenKey(stepId: string) {
  return branchStepIds.has(stepId) ? 'branch-track' : stepId;
}

export default function OurProcess() {
  const [openStepId, setOpenStepId] = useState(processSteps[1]?.id ?? processSteps[0].id);

  const renderStep = (step: ProcessStep, index: number) => {
    const stepOpenKey = resolveOpenKey(step.id);
    const isOpen = stepOpenKey === openStepId;

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
          onClick={() => setOpenStepId((current) => (current === stepOpenKey ? '' : stepOpenKey))}
          className="flex w-full items-start gap-6 px-6 py-6 text-left md:px-8"
          aria-expanded={isOpen}
        >
          <div className="min-w-14 pt-1 text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
            {step.step}
          </div>
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] ${
                  isOpen
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 bg-white text-neutral-500'
                }`}
              >
                {step.interactionLabel}
              </span>
              <span className="text-xs text-neutral-400">
                {step.interactionDetail}
              </span>
            </div>
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
                  <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.26em] text-neutral-400">
                    Client / User Interaction
                  </p>
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
  };

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
        {processRows.map((row, rowIndex) => (
          <div
            key={row.join('-')}
            className={row.length === 2 ? 'grid gap-3 md:grid-cols-2' : ''}
          >
            {row.map((stepId) => {
              const step = processSteps.find((item) => item.id === stepId)!;
              return renderStep(step, rowIndex);
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
