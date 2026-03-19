export type ShowcaseProject = {
  id: string;
  category: string;
  serviceType: string;
  status: 'Proposed' | 'In-progress' | 'Complete';
  title: string;
  clientDescription: string;
  description: string;
  tags: string[];
  date: string;
  link: string;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'marketing-projects',
    category: 'Marketing',
    serviceType: 'Consulting',
    status: 'Complete',
    title: 'Marketing Projects',
    clientDescription:
      'Brand positioning, campaign planning, channel strategy, and customer acquisition work tailored to small and midsize businesses.',
    description:
      'Marketing engagements can include messaging strategy, digital campaign planning, social media direction, website conversion improvements, and performance reporting.',
    tags: ['Brand Strategy', 'Campaigns', 'Content', 'Growth'],
    date: 'Project Type',
    link: '#',
  },
  {
    id: 'financial-projects',
    category: 'Financials',
    serviceType: 'Consulting',
    status: 'Complete',
    title: 'Financial Projects',
    clientDescription:
      'Financial analysis, forecasting, valuation support, and decision-ready reporting built around the realities of owner-operated businesses.',
    description:
      'Financial work can cover budgeting, cash flow analysis, scenario modeling, pricing reviews, due diligence support, and executive summaries for growth or transition decisions.',
    tags: ['Forecasting', 'Valuation', 'Reporting', 'Analysis'],
    date: 'Project Type',
    link: '#',
  },
  {
    id: 'operations-projects',
    category: 'Operations',
    serviceType: 'Implementation',
    status: 'Complete',
    title: 'Operations Projects',
    clientDescription:
      'Process improvement, workflow design, automation, and execution systems that make day-to-day operations more reliable and scalable.',
    description:
      'Operations projects can include SOP development, scheduling systems, team coordination workflows, dashboard rollouts, and practical automations that reduce manual overhead.',
    tags: ['Workflows', 'Automation', 'SOPs', 'Execution'],
    date: 'Project Type',
    link: '#',
  },
];
