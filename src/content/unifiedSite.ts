export type ProductStage = 'Available now' | 'In development' | 'Planned' | 'Future';

export type ServiceDefinition = {
  id: 'strategy' | 'systems' | 'implementation';
  number: string;
  title: string;
  condition: string;
  work: string;
  output: string;
  customer: string;
  nextAction: string;
  href: string;
};

export type WorkflowDefinition = {
  title: string;
  stage: ProductStage;
  action: string;
  outcome: string;
};

export type BusinessHorizon = {
  id: 'now' | 'next' | 'future';
  label: 'Now' | 'Up next' | 'In store';
  sourceLabel: 'NOW' | 'FUTURE' | 'IDEAL';
  headline: string;
  summary: string;
  gate: string;
  status: ProductStage;
  product: {
    title: string;
    body: string;
    points: string[];
  };
  pricing: {
    title: string;
    body: string;
    points: string[];
  };
  success: {
    title: string;
    body: string;
    points: string[];
  };
};

export const publicNavigation = [
  {
    label: 'JasonAI',
    to: '/products',
    children: [
      { label: 'Assistant', to: '/jasonai', description: 'The current B2W assistant for approved business communication' },
      { label: 'Product workflows', to: '/products/workflows', description: 'Available, developing, and future operating workflows' },
    ],
  },
  {
    label: 'General Contracting',
    to: '/general-contractors',
  },
  { label: 'Pricing', to: '/products/pricing' },
  { label: 'Company', to: '/about' },
] as const;

export const services: ServiceDefinition[] = [
  {
    id: 'strategy',
    number: '01',
    title: 'Strategy',
    condition: 'The business has momentum, but the next investment or operating priority is unclear.',
    work: 'B2W diagnoses the constraint, tests the assumptions behind it, and turns scattered evidence into a decision sequence.',
    output: 'A focused operating brief, decision model, and prioritized plan with clear owners and gates.',
    customer: 'Owners and operating leaders preparing to grow, reset, finance, or make a consequential decision.',
    nextAction: 'Discuss a strategy engagement',
    href: 'mailto:info@b2w-ai.com',
  },
  {
    id: 'systems',
    number: '02',
    title: 'Systems',
    condition: 'Important work is held together by memory, messages, spreadsheets, and tools that do not share context.',
    work: 'B2W maps the workflow, defines the information and control layer, and designs a practical system around how the team already operates.',
    output: 'A system blueprint, operating workflow, prototype, and implementation-ready requirements.',
    customer: 'Growing teams losing time or revenue to fragmented communication, handoffs, and reporting.',
    nextAction: 'Map an operating system',
    href: 'mailto:info@b2w-ai.com',
  },
  {
    id: 'implementation',
    number: '03',
    title: 'Implementation',
    condition: 'The direction is sound, but the business needs accountable builders to make it real and usable.',
    work: 'B2W coordinates operators, analysts, designers, and engineers to build, document, launch, and improve the chosen intervention.',
    output: 'A working system, implementation plan, team enablement, documentation, and a measurable operating cadence.',
    customer: 'Leaders who want one accountable path from approved scope through launch and adoption.',
    nextAction: 'Plan an implementation',
    href: 'mailto:info@b2w-ai.com',
  },
];

/**
 * Public translation of the August 2026 Business Plan.
 * NOW is current, FUTURE is the next validation horizon, and IDEAL is the
 * longer-term direction. Keeping the original source labels here prevents the
 * public interface from turning an internal ambition into a current claim.
 */
export const businessHorizons: BusinessHorizon[] = [
  {
    id: 'now',
    label: 'Now',
    sourceLabel: 'NOW',
    headline: 'Prove one useful assistant with one focused customer.',
    summary: 'B2W is starting with JasonAI for general contractors: a narrow admin assistant that helps recover and summarize approved job communication.',
    gate: 'Small contracting business owners test the assistant and confirm that the current workflow creates repeatable value.',
    status: 'Available now',
    product: {
      title: 'Single assistant',
      body: 'JasonAI is the current product. It supports approved communication search and job or thread summaries through WhatsApp.',
      points: ['JasonAI for admin work', 'Approved-source search', 'Human-reviewed summaries'],
    },
    pricing: {
      title: 'One introductory offer',
      body: 'One clear JasonAI launch offer keeps product access separate from the hands-on work required to integrate the assistant into a real business.',
      points: ['$99/month for JasonAI', '$2,000 one-time WhatsApp setup', 'Contracting workflows scoped with the founders'],
    },
    success: {
      title: 'High value for general contractors',
      body: 'The immediate test is whether owner-led contracting businesses recover useful context faster without adding another heavy dashboard.',
      points: ['One primary business type', 'Owner and project-manager review', 'Value proven before expansion'],
    },
  },
  {
    id: 'next',
    label: 'Up next',
    sourceLabel: 'FUTURE',
    headline: 'Define repeatable workflows before expanding the agent system.',
    summary: 'The next horizon tests a broader JasonAI workflow, a Clara management-agent direction, and customer-specific operating patterns without presenting them as launched products.',
    gate: 'After the small-business workflow is established, test the model with midsize contracting firms and document where it repeats.',
    status: 'In development',
    product: {
      title: 'Multiple-agent direction',
      body: 'JasonAI can expand only after the core workflow earns trust. Clara remains a management-agent and interaction direction, not a current commercial offer.',
      points: ['Expanded JasonAI workflows', 'Clara management concept', 'SOP and verified-practice inputs'],
    },
    pricing: {
      title: 'Pick-and-play structure',
      body: 'Agent-level Core and Premium packaging is a planning direction. Availability, scope, and price still require validation.',
      points: ['Agent-level packaging', 'Core and Premium direction', 'No implied availability'],
    },
    success: {
      title: 'Defined customer workflows',
      body: 'B2W intends to map repeatable construction, renovation, and maintenance workflows, then evaluate analytics and custom workflow needs.',
      points: ['Construction and renovation', 'Ongoing improvement', 'Analytics and custom workflows'],
    },
  },
  {
    id: 'future',
    label: 'In store',
    sourceLabel: 'IDEAL',
    headline: 'A unified, governed platform for measurable operating work.',
    summary: 'The longer-term direction connects specialized agents, performance tracking, reporting, and insights—but only after the narrower stages are proven.',
    gate: 'Extend selectively toward engineering consultants and construction companies when the product, controls, and customer evidence justify it.',
    status: 'Future',
    product: {
      title: 'Unified agentic platform',
      body: 'The ideal model connects JasonAI, Clara, and a Gurge operator-agent direction with performance, risk, analytics, and management controls.',
      points: ['Connected agent roles', 'Performance and risk tracking', 'Management reporting and insights'],
    },
    pricing: {
      title: 'Customizable value-add',
      body: 'Tiered and bundled offers could combine agents, analytics, and custom workflows once their costs and customer value are demonstrated.',
      points: ['Core, Premium, and Max direction', 'Bundle options', 'Analytics and custom workflow value'],
    },
    success: {
      title: 'Full project-management direction',
      body: 'The destination spans development, scoping, design, industry workflows, and risk controls without claiming to be a full project-management platform today.',
      points: ['Project phases and contracting workflows', 'Risk definition and root cause', 'Usage rules and measurable phases'],
    },
  },
];

export const workflows: WorkflowDefinition[] = [
  {
    stage: 'Available now',
    title: 'Find the job conversation that matters',
    action: 'Ask JasonAI to search the communication sources your company approved.',
    outcome: 'Recover a customer request, crew update, decision, or job detail without rereading every thread.',
  },
  {
    stage: 'Available now',
    title: 'Turn long threads into a usable recap',
    action: 'Request a summary for an approved job, conversation, or time period through WhatsApp.',
    outcome: 'Give an owner or project manager a concise review while keeping human judgment in the loop.',
  },
  {
    stage: 'In development',
    title: 'Surface commitments and follow-ups',
    action: 'Identify possible actions, owners, and open loops inside approved communication.',
    outcome: 'Reduce missed handoffs while requiring review before tasks become operating commitments.',
  },
  {
    stage: 'In development',
    title: 'Prepare source-linked status reports',
    action: 'Organize job updates and point back to the messages or documents that support them.',
    outcome: 'Make reporting faster and easier to verify before it is shared or acted on.',
  },
  {
    stage: 'Future',
    title: 'Coordinate inbound jobs',
    action: 'Turn an approved customer request, referral, or service call into a structured job intake for owner review.',
    outcome: 'Carry the source, scope, customer, location, and next decision into one reviewable intake before work is accepted.',
  },
  {
    stage: 'Future',
    title: 'Coordinate outbound jobs',
    action: 'Move an approved job from the office into the field with the confirmed scope, schedule, crew, and customer context.',
    outcome: 'Give the assigned team a governed job handoff while preserving approval, evidence, and accountability.',
  },
];

export const searchEntries = [
  { label: 'Services', description: 'Strategy, systems, and implementation', group: 'Services', to: '/services' },
  ...services.map((service) => ({
    label: service.title,
    description: service.condition,
    group: 'Services',
    to: `/services#${service.id}`,
  })),
  { label: 'JasonAI platform', description: 'Assistant, product workflows, and B2W document generation', group: 'JasonAI', to: '/products' },
  { label: 'Agents', description: 'JasonAI is B2W\'s current commercial agent', group: 'Products', to: '/products/agents' },
  { label: 'Assistant', description: 'Search approved contractor communication and create job summaries', group: 'JasonAI', to: '/jasonai' },
  { label: 'How JasonAI works', description: 'Setup, approved sources, search, summary, and review', group: 'Agents', to: '/jasonai/how-it-works' },
  { label: 'JasonAI questions', description: 'Common questions, boundaries, pricing, and access', group: 'Agents', to: '/jasonai/questions' },
  { label: 'JasonAI privacy', description: 'Data boundaries, controls, retention, and review', group: 'Agents', to: '/jasonai/privacy' },
  { label: 'Workflows', description: 'Available, in-development, and future product workflows', group: 'Products', to: '/products/workflows' },
  { label: 'Pricing and ROI calculator', description: 'JasonAI subscription, WhatsApp setup, workflow consultation, and illustrative time-value modeling', group: 'Products', to: '/products/pricing' },
  { label: 'General Contracting', description: 'Project communication, contractor workflows, and practical AI assistants', group: 'Industry', to: '/general-contractors' },
  { label: 'About B2W', description: 'Why B2W combines strategy, systems, and AI products', group: 'Company', to: '/about' },
  { label: 'Contact', description: 'Service, JasonAI, WhatsApp setup, partnership, and general inquiries', group: 'Company', to: 'mailto:info@b2w-ai.com' },
] as const;

export const stageOrder: ProductStage[] = ['Available now', 'In development', 'Planned', 'Future'];
