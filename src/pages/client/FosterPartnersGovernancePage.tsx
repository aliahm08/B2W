import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const governanceTerms = [
  {
    title: 'Human approval',
    detail:
      'No client-facing or design-critical output should be treated as final without review by the designated Foster + Partners stakeholders.',
  },
  {
    title: 'Information handling',
    detail:
      'The workflow should be mapped so both parties understand what information is permitted in the pilot environment, what requires additional controls, and what remains excluded.',
  },
  {
    title: 'System behavior',
    detail:
      'B2W is responsible for engineering the system, but usage boundaries, approval gates, and escalation rules should be documented jointly before deployment broadens.',
  },
  {
    title: 'Auditability',
    detail:
      'Where practical, the system should retain action history, review summaries, and change traceability so the team can understand what happened and why.',
  },
  {
    title: 'Access control',
    detail:
      'User roles, pilot participants, and any permissions connected to the workflow should be explicit rather than informal.',
  },
  {
    title: 'Expansion control',
    detail:
      'Any move from pilot use into broader firm adoption should require an explicit decision and an updated scope rather than happening by drift.',
  },
] as const;

export default function FosterPartnersGovernancePage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Governance"
      seoDescription="Governance summary for the Foster + Partners and B2W development partnership."
      eyebrow="Governance"
      heading="How the partnership stays controlled and usable."
      summary="The governance model matters because the workflows in question are not casual automations. They touch project context, internal review, and client-facing presentation. The contract should therefore define how systems are approved, observed, and expanded."
      asideLabel="Governance Summary"
      asideHeading="Adoption should be deliberate, not accidental."
      asideSummary="Good governance here is not bureaucracy. It is the mechanism that makes a serious AI system acceptable inside a serious design practice."
      metrics={[
        { label: 'Approval mode', value: 'Named stakeholders' },
        { label: 'Output status', value: 'Review before release' },
        { label: 'Access', value: 'Role-aware' },
        { label: 'Expansion', value: 'Explicit approval' },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-2">
        {governanceTerms.map((item) => (
          <div key={item.title} className="border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-medium tracking-tight text-black">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="border border-neutral-900 bg-neutral-950 p-6 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Contract implication</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-300">
          These controls should be written into the engagement as working rules, not left as informal assumptions.
          That includes who can approve pilot outputs, how the system is evaluated, how sensitive information is treated,
          and how scope expands once the first workflow proves itself.
        </p>
      </section>

      <section className="border-t border-neutral-200 pt-8">
        <Link
          to={`${fosterPartnersBasePath}/terms`}
          className="inline-flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
        >
          Continue to Terms
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </FosterPartnersPageFrame>
  );
}
