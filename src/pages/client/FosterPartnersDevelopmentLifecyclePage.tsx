import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const readinessSteps = [
  {
    title: 'Validate the demo',
    body: 'Confirm that the product behavior, workflow shape, and review logic are correct before touching live integrations.',
  },
  {
    title: 'Prepare dependencies',
    body: 'Identify what systems, permissions, environments, and governance rules are required for integration.',
  },
  {
    title: 'Sequence rollout',
    body: 'Plan how the validated product moves from demo into staged development and then into controlled deployment.',
  },
] as const;

const readinessChecks = [
  'Approved product scope',
  'Named pilot users and stakeholders',
  'Defined information boundaries',
  'Agreed rollout sequence',
  'Success metrics for post-integration use',
] as const;

export default function FosterPartnersDevelopmentLifecyclePage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Development Lifecycle"
      seoDescription="Development lifecycle view inside the Foster + Partners development dashboard."
      eyebrow="Development Dashboard / Development"
      heading="Development lifecycle: move from demo confidence to integration readiness."
      summary="This page shows the final pre-integration stage. Once the client is aligned on the product and the demo proves the concept, this lifecycle explains how B2W would prepare the system for real development and integration work."
      asideLabel="Development Goal"
      asideHeading="No integration before the plan is concrete."
      asideSummary="The purpose of this stage is to remove ambiguity: confirm what gets connected, when it gets connected, and under what rollout conditions."
      metrics={[
        { label: 'Primary output', value: 'Integration readiness' },
        { label: 'Gate', value: 'Validated demo' },
        { label: 'Focus', value: 'Dependencies + rollout' },
        { label: 'Transition', value: 'Into integration' },
      ]}
    >
      <section className="border border-neutral-900 bg-neutral-950 p-6 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Readiness sequence</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {readinessSteps.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-medium tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Readiness checklist</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {readinessChecks.map((item) => (
              <div key={item} className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Client review question</p>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Is the product mature enough, scoped enough, and governed enough to move from development dashboard review into actual integration planning?
          </p>
          <Link
            to={`${fosterPartnersBasePath}/development-dashboard`}
            className="mt-6 inline-flex items-center gap-2 border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
          >
            Return to Development Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </FosterPartnersPageFrame>
  );
}
