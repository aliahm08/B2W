export type ShowcaseProject = {
  id: string;
  category: string;
  serviceType: string;
  status: 'Proposed' | 'In-progress' | 'Complete';
  statusLabel?: string;
  statusTone?: 'default' | 'active' | 'warning' | 'info';
  inquiryType: 'Marketing' | 'Financials' | 'Operations' | 'End-to-End Rebuild';
  title: string;
  clientDescription: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  link: string;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'marketing-projects',
    category: 'Marketing',
    serviceType: 'Advisory Services',
    status: 'Proposed',
    statusLabel: 'Accepting Requests',
    statusTone: 'active',
    inquiryType: 'Marketing',
    title: 'Grow your Business by 10%+',
    clientDescription:
      'Brand positioning, campaign planning, channel strategy, and customer acquisition work tailored to small and midsize businesses.',
    description:
      'Marketing engagements can include messaging strategy, digital campaign planning, social media direction, website conversion improvements, and performance reporting.',
    tags: ['Brand Strategy', 'Campaigns', 'Content', 'Growth'],
    ctaLabel: 'Begin Marketing Audit',
    link: '/services/marketing-advisory',
  },
  {
    id: 'financial-projects',
    category: 'Financials',
    serviceType: 'Consulting',
    status: 'Proposed',
    statusLabel: 'Accepting Requests',
    statusTone: 'active',
    inquiryType: 'Financials',
    title: 'Discover up to $100k in Lost Revenue',
    clientDescription:
      'Financial analysis, forecasting, valuation support, and decision-ready reporting built around the realities of owner-operated businesses.',
    description:
      'Financial work can cover budgeting, cash flow analysis, scenario modeling, pricing reviews, due diligence support, and executive summaries for growth or transition decisions.',
    tags: ['Forecasting', 'Valuation', 'Reporting', 'Analysis'],
    ctaLabel: 'Request Financial Review',
    link: '/services/financial-review',
  },
  {
    id: 'operations-projects',
    category: 'Operations',
    serviceType: 'Implementation',
    status: 'Proposed',
    statusLabel: 'Limited Availability',
    statusTone: 'warning',
    inquiryType: 'Operations',
    title: 'Reduce Training Time by 3 Days',
    clientDescription:
      'Process improvement, workflow design, automation, and execution systems that make day-to-day operations more reliable and scalable.',
    description:
      'Operations projects can include SOP development, scheduling systems, team coordination workflows, dashboard rollouts, and practical automations that reduce manual overhead.',
    tags: ['Workflows', 'Automation', 'SOPs', 'Execution'],
    ctaLabel: 'Request Operations Support',
    link: '/services/operations-implementation',
  },
  {
    id: 'business-revamp-projects',
    category: 'Business Revamp',
    serviceType: 'Scoping + Execution',
    status: 'Proposed',
    statusLabel: 'Per Case Basis',
    statusTone: 'info',
    inquiryType: 'End-to-End Rebuild',
    title: 'End-to-End Business Rebuild',
    clientDescription:
      'A full business scoping engagement for owners who need a clear diagnosis, a practical roadmap, and hands-on support to reset performance.',
    description:
      'These projects combine discovery, financial review, operational analysis, growth planning, and implementation sequencing to identify what needs to change and how to execute it.',
    tags: ['Scoping', 'Revamp', 'Roadmap', 'Execution'],
    ctaLabel: 'Request Full Business Scope',
    link: '/services/business-revamp',
  },
];
