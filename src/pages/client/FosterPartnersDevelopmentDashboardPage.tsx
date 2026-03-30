import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, DraftingCompass, Hammer, Waypoints } from 'lucide-react';
import { FosterPartnersPageFrame, fosterPartnersBasePath } from './fosterPartnersShared';

const lifecycleCards = [
  {
    title: 'Design Lifecycle',
    to: `${fosterPartnersBasePath}/development-dashboard/design`,
    body:
      'Shows how we define the product before integration: workflow diagnosis, interface concepts, project-memory structure, and design-system logic.',
    icon: DraftingCompass,
  },
  {
    title: 'Build Lifecycle',
    to: `${fosterPartnersBasePath}/development-dashboard/build`,
    body:
      'Shows the demo product architecture: agents, orchestration layers, review surfaces, and the product modules we build into a usable pre-integration system.',
    icon: Hammer,
  },
  {
    title: 'Development Lifecycle',
    to: `${fosterPartnersBasePath}/development-dashboard/development`,
    body:
      'Shows the path from validated demo to integration readiness, including staging, approvals, instrumentation, and deployment sequencing.',
    icon: Waypoints,
  },
] as const;

const dashboardFlow = [
  {
    title: 'Design',
    body: 'Clarify workflow, inputs, users, outputs, and approval rules before code starts pushing into firm systems.',
  },
  {
    title: 'Build',
    body: 'Turn the workflow into a product demo with real interfaces, AI behaviors, and usable internal review surfaces.',
  },
  {
    title: 'Development',
    body: 'Prepare the validated product for integration by tightening governance, dependencies, and rollout sequencing.',
  },
] as const;

export default function FosterPartnersDevelopmentDashboardPage() {
  return (
    <FosterPartnersPageFrame
      seoTitle="Foster + Partners | Development Dashboard"
      seoDescription="Development dashboard for the Foster + Partners and B2W partnership."
      eyebrow="Development Dashboard"
      heading="The product development dashboard before integration begins."
      summary="This is the second half of the client portal. It shows the product we are proposing to develop through design, build, and development lifecycles, with demo-oriented subpages that explain the AI development plan before any integration work starts."
      asideLabel="Dashboard Purpose"
      asideHeading="A pre-integration view of what gets built."
      asideSummary="The dashboard is not the contract itself. It is the development communication layer: the place where Foster + Partners can review the proposed product, the demo path, and the lifecycle logic before systems are connected to production environments."
      metrics={[
        { label: 'Page type', value: 'Product dashboard' },
        { label: 'Use case', value: 'Pre-integration review' },
        { label: 'Lifecycle count', value: '3 stages' },
        { label: 'Output', value: 'AI development plan' },
      ]}
    >
      <section className="border border-neutral-900 bg-neutral-950 p-6 text-white">
        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Lifecycle map</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)] lg:items-stretch">
          {dashboardFlow.map((item, index) => (
            <div key={item.title} className="contents">
              <div className="border border-white/10 bg-white/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Stage {String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-2xl font-medium tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-300">{item.body}</p>
              </div>
              {index < dashboardFlow.length - 1 ? (
                <div className="hidden items-center justify-center lg:flex">
                  <ArrowRight className="h-5 w-5 text-neutral-500" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {lifecycleCards.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.to}
              className="group border border-neutral-200 bg-white p-6 transition-colors hover:border-black"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="border border-neutral-200 p-3 transition-colors group-hover:border-black">
                  <Icon className="h-5 w-5 text-black" />
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-black" />
              </div>
              <h2 className="mt-6 text-2xl font-medium tracking-tight text-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Why this exists</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              'Lets the client review the proposed product before integration commitments are made.',
              'Turns the AI plan into concrete demo surfaces instead of abstract technical language.',
              'Creates a shared development sequence for design, build, and rollout discussions.',
            ].map((item) => (
              <div key={item} className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-neutral-200 bg-white p-6">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Linked overview</p>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            The overview side of the portal remains where scope, operating model, governance, and terms are reviewed.
            The dashboard side is where the product and lifecycle plan are presented in a form the client can inspect before integration.
          </p>
          <Link
            to={fosterPartnersBasePath}
            className="mt-6 inline-flex items-center gap-2 border border-neutral-200 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
          >
            Return to Overview
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </FosterPartnersPageFrame>
  );
}
