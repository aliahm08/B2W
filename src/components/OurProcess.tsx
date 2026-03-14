import { useState } from 'react';
import { motion } from 'motion/react';

type ProcessNode = {
  id: string;
  step: string;
  title: string;
  description: string;
  column: number;
  row: number;
};

const processNodes: ProcessNode[] = [
  {
    id: 'business-audit',
    step: '01',
    title: 'Business Audit',
    description:
      'We establish the operating baseline: offer clarity, process friction, system sprawl, market position, and where value is leaking.',
    column: 0,
    row: 0,
  },
  {
    id: 'due-diligence',
    step: '02',
    title: 'Due Diligence',
    description:
      'We pressure-test the business and technical reality against actual data, internal constraints, existing assets, and execution risk.',
    column: 1,
    row: 0,
  },
  {
    id: 'improvement-scoping',
    step: '03A',
    title: 'Improvement Scoping',
    description:
      'One track defines the intervention itself: what should change, what should stay manual, and what deliverables will produce the highest leverage.',
    column: 2,
    row: -1,
  },
  {
    id: 'contracting',
    step: '03B',
    title: 'Contracting with Engineers and Creatives',
    description:
      'In parallel, we assemble the right execution team and translate scope into working agreements, specialist roles, and delivery responsibilities.',
    column: 2,
    row: 1,
  },
  {
    id: 'initial-delivery',
    step: '04',
    title: 'Initial Delivery',
    description:
      'The branches converge into the first release: the system, assets, or workflows are delivered with approvals, checkpoints, and operational readiness.',
    column: 3,
    row: 0,
  },
  {
    id: 'publishing',
    step: '05',
    title: 'Publishing and Monitoring',
    description:
      'We publish, observe, and refine. Performance, adoption, and failure modes are monitored so the work can stabilize and compound.',
    column: 4,
    row: 0,
  },
];

const processLinks = [
  ['business-audit', 'due-diligence'],
  ['due-diligence', 'improvement-scoping'],
  ['due-diligence', 'contracting'],
  ['improvement-scoping', 'initial-delivery'],
  ['contracting', 'initial-delivery'],
  ['initial-delivery', 'publishing'],
] as const;

const positionForNode = (node: ProcessNode) => {
  const x = 120 + node.column * 220;
  const y = 180 + node.row * 108;
  return { x, y };
};

const createPath = (from: ProcessNode, to: ProcessNode) => {
  const start = positionForNode(from);
  const end = positionForNode(to);
  const controlOffset = (end.x - start.x) * 0.42;

  return `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`;
};

export default function OurProcess() {
  const [activeNodeId, setActiveNodeId] = useState('due-diligence');
  const activeNode = processNodes.find((node) => node.id === activeNodeId) ?? processNodes[1];

  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-7xl border-t border-neutral-200 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-4xl"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Our Process</p>
          <h2 className="text-4xl font-medium tracking-tight text-neutral-950 md:text-5xl">
            A narrow process, with deliberate branching only where specialist work needs to diverge.
          </h2>
        </motion.div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.4fr)_320px] xl:items-start">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[1080px]">
              <div className="relative h-[360px]">
                <svg viewBox="0 0 1120 360" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  {processLinks.map(([fromId, toId]) => {
                    const from = processNodes.find((node) => node.id === fromId)!;
                    const to = processNodes.find((node) => node.id === toId)!;
                    const path = createPath(from, to);
                    const isActive = activeNodeId === fromId || activeNodeId === toId;

                    return (
                      <motion.path
                        key={`${fromId}-${toId}`}
                        d={path}
                        fill="none"
                        stroke={isActive ? '#111111' : '#d4d4d4'}
                        strokeWidth={isActive ? 1.5 : 1}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.45 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85, ease: 'easeInOut' }}
                      />
                    );
                  })}
                </svg>

                {processNodes.map((node, index) => {
                  const { x, y } = positionForNode(node);
                  const isActive = activeNodeId === node.id;

                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      onMouseEnter={() => setActiveNodeId(node.id)}
                      onFocus={() => setActiveNodeId(node.id)}
                      onClick={() => setActiveNodeId(node.id)}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                      style={{ left: `${(x / 1120) * 100}%`, top: `${(y / 360) * 100}%` }}
                    >
                      <div className="w-[174px] border-t border-neutral-300 pt-4">
                        <p className={`text-[10px] font-mono uppercase tracking-[0.24em] ${isActive ? 'text-black' : 'text-neutral-400'}`}>
                          {node.step}
                        </p>
                        <h3 className={`mt-2 text-lg font-medium leading-tight ${isActive ? 'text-black' : 'text-neutral-700'}`}>
                          {node.title}
                        </h3>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="border-t border-neutral-200 pt-4"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">{activeNode.step}</p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">{activeNode.title}</h3>
            <p className="mt-4 text-sm leading-7 text-neutral-600">{activeNode.description}</p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
