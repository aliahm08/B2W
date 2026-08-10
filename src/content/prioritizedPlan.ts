export const planningHorizons = [
  ['Now', 'Understand the current demo and define the intended product.'],
  ['Next', 'Close the productization gap and produce a deployable package.'],
  ['Then', 'Test the package with additional customers.'],
  ['Later', 'Standardize, launch, and expand from validated evidence.'],
] as const;

export const prioritizationCriteria = [
  ['Customer evidence', 'Does this solve a problem demonstrated by a real customer?'],
  ['Product necessity', 'Is it required for a usable, supportable package?'],
  ['Repeatability', 'Does it reduce one-off configuration or founder effort?'],
  ['Risk reduction', 'Does it improve security, reliability, privacy, or adoption?'],
  ['Revenue proximity', 'Does it move JasonAI closer to a paid deployment?'],
  ['Effort', 'Can it be delivered without delaying more important work?'],
] as const;

export const prioritySequence = [
  {
    priority: 'P1', title: 'Understand the current demo',
    summary: 'Document current behavior, client usage, manual and client-specific work, limitations, infrastructure, prompts, workflows, and integrations.',
    exit: 'One agreed description of the current system, the value it creates, and its limitations.',
  },
  {
    priority: 'P2', title: 'Define the packaged product',
    summary: 'Choose the ICP, primary problem and use case, inclusions, exclusions, onboarding requirements, customer outcome, and B2W operating role.',
    exit: 'A consistent product definition, customer, scope, and value proposition.',
  },
  {
    priority: 'P3', title: 'Identify the productization gap',
    summary: 'Compare the demo with the intended product across behavior, architecture, security, isolation, onboarding, support, analytics, monitoring, pricing, and commercial readiness.',
    exit: 'Every gap has an owner, priority, and completion condition.',
  },
  {
    priority: 'P4', title: 'Build the minimum packaged product',
    summary: 'Create supported workflows, reusable configuration, permissions, data isolation, logging, failure handling, onboarding, support, offboarding, and a pricing hypothesis.',
    exit: 'B2W can deploy a second customer through a documented process.',
  },
  {
    priority: 'P5', title: 'Test repeatability',
    summary: 'Repeat onboarding, measure founder and engineering effort, compare workflows, observe usage and value, and test willingness to pay.',
    exit: 'Evidence shows the package is repeatable, needs refinement, or must be narrowed.',
  },
  {
    priority: 'P6', title: 'Prepare a controlled launch',
    summary: 'Finalize scope and pricing, sales and demo materials, website, customer documentation, agreements, security, support, and success measures.',
    exit: 'B2W can consistently sell, onboard, operate, and support JasonAI.',
  },
] as const;

export const gapRows = [
  ['Customer setup', 'Custom and manual', 'Repeatable onboarding', 'Process + tooling'],
  ['WhatsApp access', 'Client-specific', 'Standard connection', 'Technical'],
  ['Assistant behavior', 'Flexible test', 'Defined supported capabilities', 'Product'],
  ['Knowledge context', 'Manually configured', 'Controlled setup', 'Technical + operations'],
  ['Security', 'Test environment', 'Documented permissions and isolation', 'Security'],
  ['Reliability', 'Informal monitoring', 'Defined thresholds', 'Engineering'],
  ['Analytics', 'Limited observation', 'Internal performance tracking', 'Data'],
  ['Support', 'Direct founder support', 'Repeatable support process', 'Operations'],
  ['Pricing', 'Not established', 'Defined package and terms', 'Commercial'],
] as const;

export const workstreams = [
  ['Product', ['Primary user and workflow', 'Supported commands and boundaries', 'Consistent behavior and escalation']],
  ['Engineering', ['Reusable deployment and configuration', 'Data and permission isolation', 'Logging, monitoring, failure handling, and repeatable WhatsApp setup']],
  ['Operations', ['Qualification and onboarding checklists', 'Setup, training, support, and offboarding', 'Escalation and issue management']],
  ['Commercial', ['Product description', 'Inclusions and exclusions', 'Pilot and pricing hypothesis', 'Demo and customer materials']],
] as const;

export const ownership = [
  ['Customer + market', 'CEO', 'CTO + COO consulted'],
  ['Product scope', 'CEO + CTO', 'COO consulted'],
  ['Technical productization', 'CTO', 'CEO consulted; COO informed'],
  ['Security + isolation', 'CTO', 'COO consulted; CEO informed'],
  ['Onboarding + support', 'COO', 'CEO + CTO consulted'],
  ['Pricing + packaging', 'CEO', 'CTO + COO consulted'],
  ['Trial measurement', 'CEO', 'CTO data owner; COO operations owner'],
  ['Launch readiness', 'CEO', 'CTO technical approval; COO operational approval'],
] as const;

export const roadmap = [
  'Audit the demo',
  'Define the intended product',
  'Identify the gaps',
  'Prioritize gaps blocking another deployment',
  'Build reusable technical and operational foundations',
  'Deploy to another suitable customer',
  'Measure effort, repeatability, usage, value, and willingness to pay',
  'Refine or narrow the package',
  'Run a controlled launch',
] as const;

export const readinessDimensions = [
  ['Product definition', 'Do we know exactly what we are selling?'],
  ['Reusability', 'Can we serve another customer without rebuilding?'],
  ['Reliability', 'Does it behave consistently in normal use?'],
  ['Security', 'Are customer data, permissions, and analytics isolated?'],
  ['Onboarding', 'Can a customer activate through a documented process?'],
  ['Operations', 'Can issues be handled without ad hoc founder intervention?'],
  ['Value', 'Do we have meaningful evidence of customer value?'],
  ['Commercial', 'Can we describe, price, contract, and offer it?'],
  ['Repeatability', 'Has the package worked with more than one client?'],
] as const;

export const decisionsRequired = [
  'Who is the first packaged product for?',
  'What is the single primary workflow?',
  'Which demo capabilities belong in version one?',
  'How much customization is allowed?',
  'What must be automated before the next deployment?',
  'Which manual operations can remain temporarily?',
  'What security and reliability thresholds are required?',
  'Is the next engagement a free test, paid pilot, or subscription?',
  'What evidence is required before launch?',
] as const;

export const notNow = [
  'Multiple tiers before validation',
  'Clara or Gurge as separate active products',
  'A full Project Portal',
  'Broad industry expansion',
  'A large integration library',
  'Complex autonomous actions',
  'Scaled marketing before repeatability',
  'Enterprise functionality',
  'Features unrelated to the primary workflow',
] as const;
