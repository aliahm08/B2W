export const unifiedPrototype = {
  promise: 'Clear enough to act on.',
  description:
    'B2W helps contracting businesses turn fragmented communication, business context, and project work into clear decisions, reliable follow-up, and better operating visibility.',
  navigation: [
    { label: 'Services', to: '/prototype/services' },
    { label: 'JasonAI', to: '/prototype/jasonai' },
    { label: 'Resources', to: '/prototype/resources' },
    { label: 'Guide', to: '/prototype/guide' },
  ],
  serviceLanes: [
    {
      number: '01',
      name: 'Growth',
      statement: 'Find the next practical source of demand and revenue.',
      description:
        'Market positioning, offer definition, customer research, pricing, acquisition analysis, and commercial planning for businesses that need a clearer path forward.',
      evidence: ['Market and offer definition', 'Pricing conversations', 'Acquisition and conversion analysis'],
    },
    {
      number: '02',
      name: 'Optimization',
      statement: 'Remove friction from the way work moves through the business.',
      description:
        'Workflow discovery, operating-model design, project communication, document systems, and management tools that reduce repeated effort and missed follow-up.',
      evidence: ['Workflow and process mapping', 'Project communication systems', 'Operational dashboards and reporting'],
    },
    {
      number: '03',
      name: 'Diligence',
      statement: 'Make important decisions with organized evidence.',
      description:
        'Financial reviews, valuation support, operating assessments, business cases, and decision documents built around traceable assumptions and visible risks.',
      evidence: ['Financial and operational review', 'Business cases and valuation models', 'Decision-ready documentation'],
    },
  ],
  operatingFlow: [
    { label: 'Orient', body: 'Establish the business condition, audience, and decision.' },
    { label: 'Diagnose', body: 'Identify the operating constraint and supporting evidence.' },
    { label: 'Resolve', body: 'Design the service, system, or product around the real workflow.' },
    { label: 'Prove', body: 'Show current capability, outcomes, status, and trust controls.' },
    { label: 'Advance', body: 'Give the user one clear next action.' },
  ],
  jasonAI: {
    eyebrow: 'WhatsApp assistant for contracting businesses',
    headline: 'The job history is already in your messages. JasonAI makes it usable.',
    description:
      'JasonAI searches and summarizes approved job communication so owners and project managers can recover decisions, customer requests, crew updates, and project context without rereading entire threads.',
    problems: [
      'An agreement was made on a call, but nobody documented it.',
      'A customer requested extra work, but the change was never billed.',
      'The PM, field team, and customer are communicating in different places.',
      'The owner spends evenings reconstructing what happened on a job.',
    ],
    capabilities: [
      { status: 'Available now', title: 'Communication search', body: 'Find prior discussions, requests, updates, and job details across approved sources.' },
      { status: 'Available now', title: 'Job summaries', body: 'Turn long message histories into a concise recap for a job or time period.' },
      { status: 'In development', title: 'Action-item extraction', body: 'Identify tasks, owners, and follow-up inside approved communication.' },
      { status: 'In development', title: 'Status reporting', body: 'Produce structured updates across active jobs after the core search and summary workflow is trusted.' },
    ],
  },
  resources: [
    {
      type: 'Interactive demonstration',
      title: 'From field note to organized scope',
      description: 'A guided capture, organization, review, and output experience adapted from Clara.',
      action: 'Open demonstration',
    },
    {
      type: 'Operator guide',
      title: 'Turn job communication into an owner update',
      description: 'A repeatable structure for consolidating decisions, changes, blockers, and next actions.',
      action: 'Read guide',
    },
    {
      type: 'Template',
      title: 'Weekly project status structure',
      description: 'A practical status format for active work, completed work, open gates, risks, and owner decisions.',
      action: 'View template',
    },
    {
      type: 'Decision tool',
      title: 'Workflow readiness assessment',
      description: 'A short assessment for deciding which communication or reporting workflow should be improved first.',
      action: 'Start assessment',
    },
  ],
} as const;
