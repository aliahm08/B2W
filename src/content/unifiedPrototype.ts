export const unifiedPrototype = {
  promise: 'Clear enough to act on.',
  description:
    'B2W helps contracting businesses turn fragmented communication, operating context, and project work into clear decisions, reliable follow-up, and better visibility.',
  navigation: [
    { label: 'Services', to: '/prototype/services' },
    {
      label: 'Products',
      to: '/prototype/products',
      children: [
        { label: 'Agents', to: '/prototype/products/agents', description: 'AI assistants designed around real contracting work.' },
        { label: 'Workflows', to: '/prototype/products/workflows', description: 'Repeatable paths from communication to operating action.' },
        { label: 'Pricing', to: '/prototype/products/pricing', description: 'Packages, early access, and capability boundaries.' },
      ],
    },
    { label: 'Resources', to: '/prototype/resources' },
    { label: 'About', to: '/prototype/about' },
    { label: 'Contact', to: '/prototype/contact' },
  ],
  searchEntries: [
    { label: 'Services', group: 'Website', description: 'Growth, optimization, and diligence services.', to: '/prototype/services' },
    { label: 'Products', group: 'Website', description: 'B2W agents, workflows, and pricing.', to: '/prototype/products' },
    { label: 'Agents', group: 'Products', description: 'JasonAI and the B2W agent model.', to: '/prototype/products/agents' },
    { label: 'Workflows', group: 'Products', description: 'Communication search, summaries, owner updates, and future actions.', to: '/prototype/products/workflows' },
    { label: 'Pricing', group: 'Products', description: 'Current JasonAI standard and early-access pricing.', to: '/prototype/products/pricing' },
    { label: 'Resources', group: 'Website', description: 'Guides, demonstrations, templates, and decision tools.', to: '/prototype/resources' },
    { label: 'Owner update guide', group: 'Resources', description: 'Turn project communication into a structured owner update.', to: '/prototype/guide' },
    { label: 'About B2W', group: 'Company', description: 'Company purpose, approach, audience, and operating principles.', to: '/prototype/about' },
    { label: 'Contact B2W', group: 'Company', description: 'Start a business review or JasonAI conversation.', to: '/prototype/contact' },
    { label: 'Workspace system', group: 'Internal reference', description: 'Brand, content, components, and implementation rules.', to: '/workspace' },
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
  productCategories: [
    {
      number: '01',
      name: 'Agents',
      statement: 'Specialized assistants that work where the team already communicates.',
      description: 'JasonAI is the first B2W agent: a WhatsApp assistant for approved contracting project communication.',
      to: '/prototype/products/agents',
    },
    {
      number: '02',
      name: 'Workflows',
      statement: 'Defined paths from communication to reviewable operating output.',
      description: 'Search, summaries, owner updates, scope capture, status reporting, and carefully controlled future actions.',
      to: '/prototype/products/workflows',
    },
    {
      number: '03',
      name: 'Pricing',
      statement: 'Commercial packages tied to current capability and business value.',
      description: 'Clear standard pricing, early-access terms, setup expectations, and boundaries between available and planned capability.',
      to: '/prototype/products/pricing',
    },
  ],
  agents: [
    {
      name: 'JasonAI',
      status: 'Available now',
      role: 'Project communication assistant',
      description:
        'Searches and summarizes approved job communication so owners and project managers can recover decisions, customer requests, crew updates, and project context without rereading entire threads.',
      accent: 'jason',
    },
    {
      name: 'Future B2W agents',
      status: 'Planned',
      role: 'Specialized operational assistants',
      description:
        'Additional agents may support defined administrative, operational, and project-management workflows after JasonAI proves recurring value and trusted use.',
      accent: 'neutral',
    },
  ],
  workflows: [
    { status: 'Available now', title: 'Communication search', input: 'Approved job messages', output: 'Relevant prior discussions and project context' },
    { status: 'Available now', title: 'Job summary', input: 'A job or reporting window', output: 'A concise recap of important communication' },
    { status: 'In development', title: 'Owner update', input: 'Approved messages and project context', output: 'Completed work, active work, gates, risks, and next actions' },
    { status: 'In development', title: 'Action-item extraction', input: 'Requests, commitments, and follow-up', output: 'Proposed tasks, owners, dependencies, and dates for review' },
    { status: 'Future', title: 'Trusted action', input: 'Approved workflow and explicit permissions', output: 'A controlled system action with review and auditability' },
  ],
  pricing: {
    standard: {
      name: 'JasonAI Standard',
      monthly: '$99/month',
      setup: '$2,000 setup',
      description: 'The commercial reference price for configured access, business context, and the core communication search and summary experience.',
    },
    earlyAccess: {
      name: 'Early access',
      monthly: '$25/month for year one',
      setup: 'Setup waived',
      description: 'Limited pre-launch terms for selected businesses that participate in onboarding, workflow testing, and structured feedback.',
    },
  },
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
  about: {
    statement: 'B2W designs clearer operating systems for contracting businesses.',
    description:
      'We combine business analysis, product thinking, workflow design, documentation, and applied AI. The work begins with the operating condition and ends with a usable system, a measurable result, and a documented next step.',
    principles: [
      'Start with the business condition, not the technology.',
      'Fit the system to the existing workflow before asking people to change behavior.',
      'Separate current capability from future ambition.',
      'Make evidence, ownership, status, and next action visible.',
    ],
  },
} as const;
