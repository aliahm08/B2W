export type TierPageContent = {
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  summary: string;
  fit: string[];
  includes: string[];
  timeline: string[];
  outputs: string[];
};

export const tierPageContent: Record<string, TierPageContent> = {
  '/tiers/basic-advisory': {
    eyebrow: 'Tier 1',
    title: 'Basic Advisory',
    seoTitle: 'Basic Advisory Tier',
    description: 'Explanatory page for the Basic Advisory tier.',
    summary: 'A focused entry tier for owners who need a clear business read, practical prioritization, and a defined next move without a full execution engagement.',
    fit: [
      'Businesses that need a fast diagnostic before committing to larger work',
      'Owners evaluating where marketing, financial, or operational drag is strongest',
      'Teams that need a first scope before deeper consulting or implementation',
    ],
    includes: [
      'Business audit and issue framing',
      'Initial profile, valuation, and documentation direction',
      'Recommended scope path and immediate priority list',
    ],
    timeline: [
      'Week 1: intake and operating review',
      'Week 2: analysis and recommendation drafting',
      'Week 3: final advisory package and next-step alignment',
    ],
    outputs: [
      'Advisory memo',
      'Priority map',
      'Recommended project structure',
    ],
  },
  '/tiers/consulting': {
    eyebrow: 'Tier 2',
    title: 'Consulting',
    seoTitle: 'Consulting Tier',
    description: 'Explanatory page for the Consulting tier.',
    summary: 'A hands-on working tier for clients who need recurring support, deeper reasoning, and more active iteration around decisions that shape the business.',
    fit: [
      'Businesses with enough data to support repeated working sessions',
      'Owners making pricing, growth, staffing, or expansion decisions',
      'Teams that need tighter interpretation of business signals before execution',
    ],
    includes: [
      'Everything in Basic Advisory',
      'Recurring consulting sessions',
      'Deeper financial and operational reasoning tied to live decisions',
    ],
    timeline: [
      'Week 1: kickoff and workplan',
      'Week 2: consulting workstream',
      'Week 3: review and refinement',
      'Week 4: handoff into next phase',
    ],
    outputs: [
      'Working decision model',
      'Updated recommendations',
      'Consulting-ready scope extension',
    ],
  },
  '/tiers/implementation': {
    eyebrow: 'Tier 3',
    title: 'End to End Implementation',
    seoTitle: 'End to End Implementation Tier',
    description: 'Explanatory page for the End to End Implementation tier.',
    summary: 'A delivery-led tier for businesses that want the strategy translated into systems, process layers, operating documentation, and rollout support.',
    fit: [
      'Businesses ready to move from strategy into delivery',
      'Teams that need implementation ownership and structured coordination',
      'Operators who need launch readiness, handoff systems, and execution support',
    ],
    includes: [
      'Everything in Consulting',
      'Implementation planning and delivery coordination',
      'Documentation, systems setup, and rollout support',
    ],
    timeline: [
      'Week 1: discovery and signoff',
      'Week 2: systems design and build sprint',
      'Week 3: execution and testing',
      'Week 4: launch prep and delivery transition',
    ],
    outputs: [
      'Implementation plan',
      'Operational documentation',
      'Launch-ready delivery package',
    ],
  },
  '/tiers/custom-tool': {
    eyebrow: 'Tier 4',
    title: 'Custom Tool Solution',
    seoTitle: 'Custom Tool Solution Tier',
    description: 'Explanatory page for the Custom Tool Solution tier.',
    summary: 'A bespoke build tier for clients who need a dedicated product, software layer, or AI-enabled tool tailored to their business workflows.',
    fit: [
      'Businesses needing a chatbot, web app, portal, or AI workflow layer',
      'Teams with custom operating requirements that off-the-shelf tools do not fit',
      'Owners ready to scope a bespoke software or automation build',
    ],
    includes: [
      'Everything in End to End Implementation',
      'Product scoping and custom tool architecture',
      'Tailored development planning for a dedicated build',
    ],
    timeline: [
      'Discovery and requirements definition',
      'Architecture and scoped build plan',
      'Phased development and testing sequence',
    ],
    outputs: [
      'Product requirements scope',
      'Custom build roadmap',
      'Development-ready proposal package',
    ],
  },
};
