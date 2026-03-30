import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const inScope = [
  'Workflow mapping across design communications, project-memory capture, retrieval, review packaging, and presentation assembly.',
  'AI system design for internal tools, agent behaviors, approval logic, and the interfaces required to make those workflows usable.',
  'Prototype and pilot implementation against one or more real studio workflows selected jointly with Foster + Partners.',
  'Integration planning with the firm’s existing storage, communication, and operational systems where appropriate.',
  'Measurement of pilot performance against review speed, reuse, team adoption, and quality-control criteria.',
] as const;

const outOfScope = [
  'Replacing architectural authorship, partner judgment, or core design decision-making.',
  'Open-ended firmwide transformation work before a pilot workflow is defined and validated.',
  'Unbounded support for unrelated business systems outside the agreed AI-engineering mandate.',
  'Production release of autonomous systems into sensitive workflows without a defined review and governance model.',
] as const;

const firstPhase = [
  {
    title: 'Pilot selection',
    body: 'Both parties nominate one workflow where speed, coordination burden, and strategic value are all high enough to justify immediate build effort.',
  },
  {
    title: 'System specification',
    body: 'B2W documents the inputs, outputs, handoffs, approval points, and interface requirements for that workflow before engineering begins.',
  },
  {
    title: 'Pilot delivery',
    body: 'The first release is intentionally constrained: narrow enough to be reliable, serious enough to prove operational value.',
  },
] as const;

export default function FosterPartnersScopePage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Scope"
      seoDescription="Scope summary for the Foster + Partners and B2W development partnership."
      eyebrow="Contract Scope"
      heading="What B2W is being retained to build."
      summary="This page defines the working scope of the partnership: the workflows B2W would support, the first phase of delivery, and the boundary between a serious AI engineering engagement and loosely defined experimentation."
      asideLabel="Scope Snapshot"
      asideHeading="Focused initial scope with room to expand."
      asideSummary="The contract should start with one operationally meaningful workflow, prove value in live studio use, then extend into broader adoption only after that pilot succeeds."
      metrics={[
        { label: 'Delivery mode', value: 'Pilot-first' },
        { label: 'Workflow type', value: 'Internal studio systems' },
        { label: 'Primary users', value: 'Design comms + project teams' },
        { label: 'Expansion rule', value: 'After validated pilot' },
      ]}
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">In scope</p>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
            {inScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Out of scope</p>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
            {outOfScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border border-neutral-900 bg-neutral-950 p-6 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">First phase of work</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {firstPhase.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/5 p-4">
              <h2 className="text-lg font-medium tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-8">
        <Link
          to={`${fosterPartnersBasePath}/operating-model`}
          className="inline-flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
        >
          Continue to Operating Model
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </FosterPartnersPageFrame>
  );
}
