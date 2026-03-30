import { FosterPartnersPageFrame } from './fosterPartnersShared';

const terms = [
  {
    number: '01',
    label: 'Nature of Engagement',
    detail:
      'B2W is engaged as the development partner to design, build, and iterate internal workflow systems for Foster + Partners within the agreed scope. This is a services engagement, not an assignment of architectural authorship or design responsibility.',
  },
  {
    number: '02',
    label: 'Defined Pilot Scope',
    detail:
      'Initial delivery should be limited to the workflow or workflows explicitly identified in the contract. Any expansion into additional workflows, teams, or system capabilities should require mutual written approval.',
  },
  {
    number: '03',
    label: 'Client Cooperation',
    detail:
      'Foster + Partners will provide timely access to the relevant stakeholders, workflow context, and non-excluded material needed to specify and evaluate the pilot.',
  },
  {
    number: '04',
    label: 'Review and Approval',
    detail:
      'B2W may generate prototypes, summaries, interfaces, or other outputs during delivery, but any use of those outputs in live design or client-facing contexts remains subject to Foster + Partners review and approval.',
  },
  {
    number: '05',
    label: 'Confidentiality',
    detail:
      'Both parties will treat non-public project, client, operational, and technical information shared during the engagement as confidential, subject to the final contract language.',
  },
  {
    number: '06',
    label: 'Information Handling Boundaries',
    detail:
      'The parties should identify what information may be used within the pilot workflow, what requires additional safeguards, and what is excluded entirely from the engagement environment.',
  },
  {
    number: '07',
    label: 'Intellectual Property',
    detail:
      'Project-specific materials, client-specific system configurations, and agreed deliverables should be allocated in the final contract. B2W retains ownership of its pre-existing methods, tooling, and general engineering know-how unless otherwise agreed.',
  },
  {
    number: '08',
    label: 'Commercial Structure',
    detail:
      'Fees, timing, and payment milestones should be tied to the retained engineering scope and pilot phases rather than to a one-time static software delivery unless the contract specifies otherwise.',
  },
  {
    number: '09',
    label: 'Change Control',
    detail:
      'Material scope changes, additional workflows, or broader rollout requests should trigger a written scope update rather than being treated as implied continuation of the original pilot.',
  },
  {
    number: '10',
    label: 'No Performance Guarantee',
    detail:
      'B2W will engineer and refine the system in good faith, but no AI system should be represented as error-free or as replacing human review in high-stakes design workflows.',
  },
] as const;

export default function FosterPartnersTermsPage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Terms"
      seoDescription="Working contract terms for the Foster + Partners and B2W development partnership."
      eyebrow="Working Terms"
      heading="Key items for the contract."
      summary="This page captures the main contractual points that should define the relationship between Foster + Partners and B2W. It is a working summary for discussion, not a substitute for the final agreement."
      asideLabel="Commercial View"
      asideHeading="A retained development partnership with clear boundaries."
      asideSummary="The contract should treat this as an ongoing development relationship with pilot scope, governance rules, and explicit change control rather than as an undefined AI advisory exercise."
      metrics={[
        { label: 'Contract type', value: 'Services engagement' },
        { label: 'Initial scope', value: 'Pilot workflow' },
        { label: 'Expansion', value: 'Written scope update' },
        { label: 'Output rule', value: 'Human review required' },
      ]}
    >
      <section className="border border-neutral-200 bg-white p-6">
        <div className="divide-y divide-neutral-100 border-y border-neutral-100">
          {terms.map((item) => (
            <div key={item.label} className="py-4">
              <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">{item.number}</p>
              <h2 className="mb-2 text-lg font-medium tracking-tight text-black">{item.label}</h2>
              <p className="text-sm leading-6 text-neutral-700">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </FosterPartnersPageFrame>
  );
}
