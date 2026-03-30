import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const modules = [
  {
    title: 'Project memory module',
    body: 'Stores structured brief context, review decisions, and reference retrieval so the product has usable memory.',
  },
  {
    title: 'Review copilot module',
    body: 'Turns comments and markups into summarized actions, tracked changes, and pending decisions.',
  },
  {
    title: 'Presentation assembly module',
    body: 'Combines approved project context into a usable communication flow for internal and client-facing review.',
  },
] as const;

const buildLayers = [
  'UI surfaces for workflow owners and reviewers',
  'AI behaviors for retrieval, summarization, and generation',
  'State and orchestration logic across review cycles',
  'Demo data and staging rules that keep the product useful before integration',
] as const;

export default function FosterPartnersBuildLifecyclePage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Build Lifecycle"
      seoDescription="Build lifecycle view inside the Foster + Partners development dashboard."
      eyebrow="Development Dashboard / Build"
      heading="Build lifecycle: turn the design into a reviewable product demo."
      summary="This page shows the build phase of the dashboard. The emphasis is on demonstrating the product logic clearly enough that the client can assess what we are developing before integration work begins."
      asideLabel="Build Goal"
      asideHeading="A product demo serious enough to review."
      asideSummary="The build lifecycle does not wait for full integration. It creates a working development surface that proves the product logic, the AI behaviors, and the review flow first."
      metrics={[
        { label: 'Primary output', value: 'Reviewable demo' },
        { label: 'Core modules', value: '3 modules' },
        { label: 'User focus', value: 'Workflow owners' },
        { label: 'Next step', value: 'Development readiness' },
      ]}
    >
      <section className="border border-neutral-900 bg-neutral-950 p-6 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Build modules</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {modules.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-medium tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">What gets built before integration</p>
          <div className="mt-5 space-y-3">
            {buildLayers.map((item) => (
              <div key={item} className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Client review question</p>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Is this the right product shape to build further, or does the demo need to change before we move toward integration and production dependencies?
          </p>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-8">
        <Link
          to={`${fosterPartnersBasePath}/development-dashboard/development`}
          className="inline-flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
        >
          Continue to Development Lifecycle
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </FosterPartnersPageFrame>
  );
}
