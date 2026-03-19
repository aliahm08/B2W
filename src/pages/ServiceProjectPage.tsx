import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import Seo from '../components/Seo';
import LeadForm, { type PublicProjectArea } from '../components/forms/LeadForm';

type ServicePageContent = {
  title: string;
  eyebrow: string;
  description: string;
  summary: string;
  outcomes: string[];
  scope: string[];
  preselectedProjectAreas: PublicProjectArea[];
};

const servicePageContent: Record<string, ServicePageContent> = {
  '/services/marketing-advisory': {
    eyebrow: 'Marketing',
    title: 'Marketing Advisory Services',
    description:
      'Marketing support focused on revenue growth, clearer positioning, stronger campaigns, and more efficient customer acquisition.',
    summary:
      'This project is built for businesses that need sharper messaging, better channel strategy, and practical guidance on where to focus marketing effort next.',
    outcomes: [
      'Clarify brand positioning and market narrative',
      'Find the highest-return growth channels',
      'Improve campaign planning and conversion performance',
    ],
    scope: [
      'Messaging and positioning review',
      'Channel and campaign strategy',
      'Website and funnel conversion recommendations',
      'Performance measurement and reporting priorities',
    ],
    preselectedProjectAreas: ['Marketing'],
  },
  '/services/financial-review': {
    eyebrow: 'Financials',
    title: 'Financial Review Projects',
    description:
      'Financial analysis that surfaces missed margin, hidden inefficiencies, pricing issues, and revenue leakage.',
    summary:
      'This project is for owners who need a clearer read on performance, stronger reporting, and a grounded plan for where money is being lost or left on the table.',
    outcomes: [
      'Identify lost revenue and profit leakage',
      'Pressure-test pricing, margins, and cash flow',
      'Turn financial data into decision-ready recommendations',
    ],
    scope: [
      'Revenue and cost analysis',
      'Forecasting and scenario review',
      'Pricing and margin diagnostics',
      'Decision memo with recommended next actions',
    ],
    preselectedProjectAreas: ['Financials'],
  },
  '/services/operations-implementation': {
    eyebrow: 'Operations',
    title: 'Operations Implementation Projects',
    description:
      'Operational improvement work that reduces training drag, eliminates avoidable coordination overhead, and improves execution consistency.',
    summary:
      'This project is for teams that need cleaner workflows, stronger SOPs, better handoffs, and practical systems that help people perform faster.',
    outcomes: [
      'Reduce onboarding and training time',
      'Standardize repeatable workflows across the team',
      'Improve visibility, coordination, and accountability',
    ],
    scope: [
      'Workflow mapping and bottleneck review',
      'SOP and training system design',
      'Scheduling, dashboard, or automation recommendations',
      'Implementation roadmap tied to day-to-day operations',
    ],
    preselectedProjectAreas: ['Operations'],
  },
  '/services/business-revamp': {
    eyebrow: 'Business Revamp',
    title: 'Full Business Scoping and Revamp Projects',
    description:
      'A comprehensive engagement that scopes the business across growth, financials, and operations, then builds a practical plan to improve the whole system.',
    summary:
      'This is for businesses that need more than a narrow fix. The work starts with diagnosis, identifies the highest-leverage issues, and translates them into a coordinated reset plan.',
    outcomes: [
      'Diagnose the business end-to-end before investing in changes',
      'Prioritize the few changes most likely to improve performance',
      'Move from scattered fixes to one coordinated execution plan',
    ],
    scope: [
      'Business-wide discovery and problem framing',
      'Marketing, financial, and operational assessment',
      'Revamp roadmap with sequenced priorities',
      'Advisory support for implementation decisions',
    ],
    preselectedProjectAreas: ['Marketing', 'Financials', 'Operations'],
  },
};

export default function ServiceProjectPage() {
  const location = useLocation();
  const content = useMemo(
    () => servicePageContent[location.pathname] ?? servicePageContent['/services/marketing-advisory'],
    [location.pathname],
  );

  return (
    <>
      <Seo title={`${content.title} | B2W`} description={content.description} />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-12 border-b border-neutral-200 pb-10 md:pb-12">
          <Link to="/#projects" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            Back to homepage projects
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-start">
            <div>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">{content.eyebrow}</p>
              <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-500 md:text-2xl">
                {content.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Service Snapshot</p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                Practical support shaped around the business constraints you already have.
              </h2>
              <p className="text-sm leading-6 text-neutral-300">
                Share your situation, urgency, and current business context. B2W uses that intake to assess fit, define the right scope, and recommend the next step.
              </p>
            </aside>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="border border-neutral-200 bg-white p-6 md:p-7">
                <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Outcomes</h2>
                <ul className="space-y-4">
                  {content.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-neutral-200 bg-white p-6 md:p-7">
                <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Scope</h2>
                <ul className="space-y-4">
                  {content.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-8 md:pt-10">
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">How It Starts</p>
              <p className="max-w-3xl text-base leading-relaxed text-neutral-700">
                Share your business context, current constraints, and what you want to improve. B2W uses that information
                to understand whether the project is a fit and what the right scope should look like.
              </p>
            </div>
          </div>

          <aside className="border border-black/10 bg-white p-5 sm:p-6 md:p-7 lg:sticky lg:top-28">
            <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Inquiry Form</p>
            <div className="mt-4">
              <LeadForm
                intro="The matching project area is preselected for this page, but you can adjust it if your needs span multiple areas."
                submitLabel="Send Inquiry"
                preselectedProjectAreas={content.preselectedProjectAreas}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
