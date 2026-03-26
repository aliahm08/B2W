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
    id: 'basic-advisory-package',
    category: 'Tier 1',
    serviceType: 'Basic Advisory',
    status: 'Proposed',
    statusLabel: 'Accepting Requests',
    statusTone: 'active',
    inquiryType: 'Marketing',
    title: 'Basic Advisory',
    clientDescription:
      'A focused advisory package for owners who need a clear read on the business, sharper priorities, and a practical starting point.',
    description:
      'This package centers on diagnosis, structured recommendations, and the first round of profile, valuation, and documentation thinking without requiring a full execution engagement.',
    tags: ['Advisory', 'Scoping', 'Decision Support', 'Profile'],
    ctaLabel: 'Open Project Builder',
    link: '/',
  },
  {
    id: 'consulting-package',
    category: 'Tier 2',
    serviceType: 'Consulting',
    status: 'Proposed',
    statusLabel: 'Accepting Requests',
    statusTone: 'active',
    inquiryType: 'Financials',
    title: 'Consulting',
    clientDescription:
      'A hands-on consulting package for clients who want recurring working sessions, tighter analysis, and more active support across selected lanes.',
    description:
      'Consulting includes everything in Basic Advisory, then adds a deeper operating cadence, model-based reasoning, and iteration around the business decisions that matter most.',
    tags: ['Consulting', 'Valuation', 'Working Sessions', 'Iteration'],
    ctaLabel: 'Open Project Builder',
    link: '/',
  },
  {
    id: 'implementation-package',
    category: 'Tier 3',
    serviceType: 'End to End Implementation',
    status: 'Proposed',
    statusLabel: 'Limited Availability',
    statusTone: 'warning',
    inquiryType: 'Operations',
    title: 'End to End Implementation',
    clientDescription:
      'A full delivery package for clients who want the scope translated into systems, process layers, documentation, and operational rollout.',
    description:
      'Implementation includes everything in Consulting, then adds execution ownership, build coordination, documentation systems, and launch readiness work.',
    tags: ['Implementation', 'Execution', 'Documentation', 'Systems'],
    ctaLabel: 'Open Project Builder',
    link: '/',
  },
  {
    id: 'custom-tool-package',
    category: 'Tier 4',
    serviceType: 'Custom Tool Solution',
    status: 'Proposed',
    statusLabel: 'Per Case Basis',
    statusTone: 'info',
    inquiryType: 'End-to-End Rebuild',
    title: 'Custom Tool Solution',
    clientDescription:
      'A bespoke software or AI package for clients who need a dedicated tool such as a chatbot, web app, client portal, or new site.',
    description:
      'Custom Tool Solution includes everything in End to End Implementation, then extends the engagement into a purpose-built product or automation layer tailored to the business.',
    tags: ['Custom Tool', 'AI', 'Web App', 'Automation'],
    ctaLabel: 'Open Project Builder',
    link: '/',
  },
];
