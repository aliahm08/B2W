import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';

type ServicePageContent = {
  title: string;
  eyebrow: string;
  description: string;
  summary: string;
  outcomes: string[];
  scope: string[];
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
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-32">
        <div className="mb-8">
          <p className="mb-5 text-xs font-mono uppercase tracking-[0.28em] text-neutral-400">{content.eyebrow}</p>
          <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl">
            {content.title}
          </h1>
        </div>

        <div className="grid gap-12 md:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
          <div>
            <p className="max-w-3xl text-xl leading-relaxed text-neutral-600">{content.summary}</p>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">Outcomes</h2>
                <ul className="space-y-4 text-base leading-relaxed text-neutral-700">
                  {content.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">Scope</h2>
                <ul className="space-y-4 text-base leading-relaxed text-neutral-700">
                  {content.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="border border-neutral-200 bg-neutral-50 p-8">
            <p className="mb-4 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">Next Step</p>
            <p className="mb-8 text-lg leading-relaxed text-neutral-700">
              If this is the type of project you need, send a note and B2W can scope the right level of support.
            </p>
            <a
              href="mailto:info@b2w-ai.com?subject=B2W%20Project%20Inquiry"
              className="inline-flex items-center border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Contact B2W
            </a>
            <div className="mt-4">
              <Link to="/#projects" className="text-sm font-medium text-neutral-600 transition-colors hover:text-black">
                Back to homepage projects
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
