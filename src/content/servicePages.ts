export type ServicePageContent = {
  title: string;
  seoTitle: string;
  eyebrow: string;
  description: string;
  summary: string;
  outcomes: string[];
  scope: string[];
  preselectedProjectAreas: ('Marketing' | 'Financials' | 'Operations')[];
};

export const servicePageContent: Record<string, ServicePageContent> = {
  '/services/marketing-advisory': {
    eyebrow: 'Marketing',
    title: 'Marketing Advisory Services',
    seoTitle: 'Marketing Advisory Services for Small Businesses',
    description:
      'Marketing advisory for small and midsize businesses focused on positioning, demand generation, conversion improvement, and more efficient customer acquisition.',
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
    seoTitle: 'Financial Review Services for Small Businesses',
    description:
      'Financial review services that surface missed margin, hidden inefficiencies, pricing issues, and revenue leakage for small and midsize businesses.',
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
    seoTitle: 'Operations Implementation Services for SMB Teams',
    description:
      'Operations implementation consulting that reduces training drag, removes avoidable coordination overhead, and improves execution consistency.',
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
    seoTitle: 'Business Revamp Consulting for SMB Owners',
    description:
      'Business revamp consulting that assesses growth, financials, and operations together, then sequences the highest-leverage improvements into one plan.',
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
