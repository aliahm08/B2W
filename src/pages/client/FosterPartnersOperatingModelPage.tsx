import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const operatingCadence = [
  'Weekly working sessions with Foster + Partners stakeholders responsible for the nominated workflow',
  'Rapid prototype sprints tied to real project material rather than abstract sample data',
  'Defined signoff points before any workflow expands in scope or touches more sensitive information',
  'Short written readouts after each iteration capturing changes, risks, and next engineering steps',
] as const;

const responsibilities = [
  {
    title: 'B2W responsibilities',
    items: [
      'Lead workflow analysis, system design, implementation, and iteration',
      'Propose architecture, tooling, and operating controls for the selected workflows',
      'Maintain the pilot system and document how it should be used and extended',
    ],
  },
  {
    title: 'Foster + Partners responsibilities',
    items: [
      'Nominate workflow owners and provide timely access to the people and material needed to define the pilot',
      'Review prototypes, provide operational feedback, and approve progression to broader usage',
      'Clarify design, security, and approval requirements that affect deployment',
    ],
  },
] as const;

export default function FosterPartnersOperatingModelPage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Operating Model"
      seoDescription="Operating model for how B2W and Foster + Partners would work together on AI engineering."
      eyebrow="Operating Model"
      heading="How the partnership runs day to day."
      summary="The operating model is designed to feel like an embedded development partnership, not an external software handoff. B2W works against live studio workflows, while Foster + Partners retains review authority over what gets used, expanded, or withheld."
      asideLabel="Working Model"
      asideHeading="Embedded, iterative, and review-driven."
      asideSummary="The contract should make clear that delivery happens through short cycles of diagnosis, build, review, and refinement with nominated workflow owners inside the firm."
      metrics={[
        { label: 'Cadence', value: 'Weekly working sessions' },
        { label: 'Build style', value: 'Prototype to pilot' },
        { label: 'Review mode', value: 'Human-in-the-loop' },
        { label: 'Adoption path', value: 'Workflow by workflow' },
      ]}
    >
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Delivery cadence</p>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
            {operatingCadence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border border-neutral-900 bg-neutral-950 p-6 text-white">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Practical implication</p>
          <p className="mt-4 text-sm leading-6 text-neutral-300">
            The partnership should not be framed as a fixed software package. It should be framed as a retained AI
            development function with a clear mandate, clear review structure, and clear rules for how new workflows are added.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {responsibilities.map((item) => (
          <div key={item.title} className="border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-medium tracking-tight text-black">{item.title}</h2>
            <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
              {item.items.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="border-t border-neutral-200 pt-8">
        <Link
          to={`${fosterPartnersBasePath}/governance`}
          className="inline-flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
        >
          Continue to Governance
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </FosterPartnersPageFrame>
  );
}
