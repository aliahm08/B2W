import { useMemo, useState } from 'react';
import { motion } from 'motion/react';

type ProcessNode = {
  id: string;
  step: string;
  title: string;
  description: string;
};

const processNodes: ProcessNode[] = [
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

const desktopPositions: Record<string, { x: number; y: number }> = {
  'business-audit': { x: 92, y: 174 },
  'due-diligence': { x: 292, y: 174 },
  'improvement-scoping': { x: 510, y: 88 },
  contracting: { x: 510, y: 260 },
  'initial-delivery': { x: 742, y: 174 },
  publishing: { x: 956, y: 174 },
};

const mobilePositions: Record<string, { x: number; y: number }> = {
  'business-audit': { x: 24, y: 34 },
  'due-diligence': { x: 24, y: 126 },
  'improvement-scoping': { x: 24, y: 218 },
  contracting: { x: 24, y: 310 },
  'initial-delivery': { x: 24, y: 402 },
  publishing: { x: 24, y: 494 },
};

const desktopLinks = [
  ['business-audit', 'due-diligence'],
  ['due-diligence', 'improvement-scoping'],
  ['due-diligence', 'contracting'],
  ['improvement-scoping', 'initial-delivery'],
  ['contracting', 'initial-delivery'],
  ['initial-delivery', 'publishing'],
] as const;

const mobileLinks = [
  ['business-audit', 'due-diligence'],
  ['due-diligence', 'improvement-scoping'],
  ['improvement-scoping', 'contracting'],
  ['contracting', 'initial-delivery'],
  ['initial-delivery', 'publishing'],
] as const;

function createCurve(
  from: { x: number; y: number },
  to: { x: number; y: number },
  direction: 'horizontal' | 'vertical',
) {
  if (direction === 'horizontal') {
    const control = Math.max((to.x - from.x) * 0.42, 68);
    return `M ${from.x} ${from.y} C ${from.x + control} ${from.y}, ${to.x - control} ${to.y}, ${to.x} ${to.y}`;
  }

  const control = Math.max((to.y - from.y) * 0.38, 34);
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + control}, ${to.x} ${to.y - control}, ${to.x} ${to.y}`;
}

function DiagramPath({
  path,
  isActive,
}: {
  path: string;
  isActive: boolean;
}) {
  return (
    <>
      <path
        d={path}
        fill="none"
        stroke="#e5e5e5"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <motion.path
        d={path}
        fill="none"
        stroke={isActive ? '#111111' : '#d4d4d4'}
        strokeWidth={isActive ? 2 : 1.1}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        whileInView={{ pathLength: 1, opacity: isActive ? 1 : 0.85 }}
        animate={isActive ? { opacity: [0.55, 1, 0.55] } : undefined}
        viewport={{ once: true }}
        transition={
          isActive
            ? { pathLength: { duration: 0.9, ease: 'easeInOut' }, opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }
            : { duration: 0.8, ease: 'easeInOut' }
        }
      />
    </>
  );
}

export default function OurProcess() {
  const [activeNodeId, setActiveNodeId] = useState('due-diligence');
  const activeNode = processNodes.find((node) => node.id === activeNodeId) ?? processNodes[1];

  const desktopPaths = useMemo(
    () =>
      desktopLinks.map(([fromId, toId]) => ({
        key: `${fromId}-${toId}`,
        ids: [fromId, toId] as const,
        path: createCurve(desktopPositions[fromId], desktopPositions[toId], 'horizontal'),
      })),
    [],
  );

  const mobilePaths = useMemo(
    () =>
      mobileLinks.map(([fromId, toId]) => ({
        key: `${fromId}-${toId}`,
        ids: [fromId, toId] as const,
        path: createCurve(mobilePositions[fromId], mobilePositions[toId], 'vertical'),
      })),
    [],
  );

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" id="process">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-medium tracking-tight mb-4">Process</h1>
        <h2 className="max-w-4xl text-xl font-medium leading-relaxed text-neutral-600 mb-8 md:text-2xl">
          A narrow process, with deliberate branching only where specialist work needs to diverge.
        </h2>
        <div className="h-px w-full bg-neutral-200" />
      </motion.div>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="hidden lg:block">
          <div className="relative min-h-[360px]">
            <svg viewBox="0 0 1040 348" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {desktopPaths.map((item) => (
                <DiagramPath
                  key={item.key}
                  path={item.path}
                  isActive={item.ids.includes(activeNodeId)}
                />
              ))}
            </svg>

            {processNodes.map((node, index) => {
              const position = desktopPositions[node.id];
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
                  transition={{ duration: 0.32, delay: index * 0.05 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                  style={{ left: position.x, top: position.y }}
                >
                  <div className="w-[168px] border-t pt-4 transition-colors" style={{ borderColor: isActive ? '#111111' : '#d4d4d4' }}>
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

        <div className="lg:hidden">
          <div className="relative pl-12">
            <svg viewBox="0 0 64 540" className="absolute left-0 top-0 h-full w-16" aria-hidden="true">
              {mobilePaths.map((item) => (
                <DiagramPath
                  key={item.key}
                  path={item.path}
                  isActive={item.ids.includes(activeNodeId)}
                />
              ))}
            </svg>

            <div className="space-y-7">
              {processNodes.map((node, index) => {
                const isActive = activeNodeId === node.id;

                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.32, delay: index * 0.04 }}
                    className="block w-full text-left"
                  >
                    <div className="border-t pt-4 transition-colors" style={{ borderColor: isActive ? '#111111' : '#d4d4d4' }}>
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
          <p className="mt-4 text-sm leading-7 text-neutral-500">{activeNode.description}</p>
        </motion.aside>
      </div>
    </section>
  );
}
