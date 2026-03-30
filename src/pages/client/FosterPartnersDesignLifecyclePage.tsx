import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const designSteps = [
  {
    title: 'Workflow diagnosis',
    body: 'Map how briefs, review comments, reference material, and presentation needs move through the current studio process.',
  },
  {
    title: 'Experience design',
    body: 'Shape the proposed internal product surfaces: what users see, what they input, what the system returns, and where review happens.',
  },
  {
    title: 'Demo definition',
    body: 'Select the smallest product slice that can still demonstrate real value before integration starts.',
  },
] as const;

const designArtifacts = [
  'Workflow map with user roles and approval gates',
  'Project-memory schema for briefs, reviews, and precedent references',
  'Demo UX for internal review and presentation assembly',
  'Initial AI behavior spec for retrieval, summarization, and task generation',
] as const;

export default function FosterPartnersDesignLifecyclePage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Design Lifecycle"
      seoDescription="Design lifecycle view inside the Foster + Partners development dashboard."
      eyebrow="Development Dashboard / Design"
      heading="Design lifecycle: define the product before it touches integration."
      summary="This page shows the design phase of the development dashboard. The goal is to make the proposed AI product legible before engineering dependencies and integrations begin."
      asideLabel="Design Goal"
      asideHeading="Make the product understandable before it becomes technical."
      asideSummary="The design lifecycle aligns users, workflows, surfaces, and outputs so the client is reviewing a product plan rather than a vague AI concept."
      metrics={[
        { label: 'Primary output', value: 'Product definition' },
        { label: 'Users', value: 'Named workflow owners' },
        { label: 'Risk reduced', value: 'Misaligned build scope' },
        { label: 'Next step', value: 'Build demo' },
      ]}
    >
      <section className="border border-neutral-900 bg-neutral-950 p-6 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Design sequence</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {designSteps.map((item, index) => (
            <div key={item.title} className="border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Step {String(index + 1).padStart(2, '0')}</p>
              <h2 className="mt-3 text-xl font-medium tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Design artifacts</p>
          <div className="mt-5 space-y-3">
            {designArtifacts.map((item) => (
              <div key={item} className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Client review question</p>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Does this product definition match the workflow Foster + Partners wants us to develop before we touch the integration layer?
          </p>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-8">
        <Link
          to={`${fosterPartnersBasePath}/development-dashboard/build`}
          className="inline-flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
        >
          Continue to Build Lifecycle
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </FosterPartnersPageFrame>
  );
}
