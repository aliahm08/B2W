import type { PublicProjectArea } from '../components/forms/LeadForm';

export type KitchenOption = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
};

export type KitchenSelection = {
  informationIds: string[];
  integrationIds: string[];
  productionIds: string[];
};

export type KitchenPreset = {
  slug: 'growth' | 'optimization' | 'diligence';
  title: string;
  solutionName: string;
  description: string;
  roughEstimate: string;
  selection: KitchenSelection;
  subpagePath: string;
};

export type KitchenSolution = {
  slug: string;
  name: string;
  summary: string;
  previewPath: string;
  information: KitchenOption[];
  integration: KitchenOption[];
  production: KitchenOption[];
  deliverables: string[];
  proposalHighlights: string[];
  projectAreas: PublicProjectArea[];
  inquiryType: string;
  roughEstimate: string;
};

export const kitchenInformationOptions: KitchenOption[] = [
  {
    id: 'financial-statements',
    title: 'Financial statements',
    shortTitle: 'Financials',
    description: 'Income statements, balance sheets, cash flow, and owner-level performance records.',
    detail:
      'Use financial statements when the engagement needs real operating economics, margin visibility, and a clearer basis for value or performance analysis.',
  },
  {
    id: 'project-proposals',
    title: 'Project proposals',
    shortTitle: 'Proposals',
    description: 'Prior scoping documents, commercial terms, concept framing, and opportunity packaging materials.',
    detail:
      'Use project proposals when the work needs commercial context, positioning logic, or a stronger read on how the business is currently being framed.',
  },
  {
    id: 'engineering-drawings',
    title: 'Engineering drawings/floorplans',
    shortTitle: 'Drawings',
    description: 'Layouts, plans, site drawings, and physical-context documents that affect production and execution.',
    detail:
      'Use engineering drawings or floorplans when the solution depends on physical layout, property context, or site-level decision support.',
  },
  {
    id: 'supplier-invoices',
    title: 'Supplier invoices',
    shortTitle: 'Invoices',
    description: 'Vendor billing history, purchasing records, supply inputs, and cost-level evidence.',
    detail:
      'Use supplier invoices when the work depends on procurement visibility, reconciliation, diligence support, or cost-structure review.',
  },
];

export const kitchenIntegrationOptions: KitchenOption[] = [
  {
    id: 'pos-analytics',
    title: 'POS analytics',
    shortTitle: 'POS',
    description: 'Sales, throughput, ticket mix, and operational demand patterns from transaction systems.',
    detail:
      'Use POS analytics when the solution depends on live transaction behavior, throughput patterns, or revenue-linked operating signals.',
  },
  {
    id: 'instagram-analytics',
    title: 'Instagram analytics',
    shortTitle: 'Instagram',
    description: 'Audience, engagement, reach, content traction, and signal quality from Instagram activity.',
    detail:
      'Use Instagram analytics when the solution needs social traction signals, audience behavior, or a stronger view of brand momentum.',
  },
  {
    id: 'google-analytics',
    title: 'Google analytics',
    shortTitle: 'Google',
    description: 'Website traffic, behavior, conversion signals, and search-linked demand evidence.',
    detail:
      'Use Google analytics when the solution depends on site behavior, digital acquisition quality, or conversion-level performance.',
  },
  {
    id: 'website-scrubbing',
    title: 'Website scrubbing',
    shortTitle: 'Website',
    description: 'Structured extraction of website content, structure, and visible business information.',
    detail:
      'Use website scrubbing when the business needs a clean external read on how it presents itself, what information is exposed, and where clarity breaks down.',
  },
];

export const kitchenProductionOptions: KitchenOption[] = [
  {
    id: 'fullstack',
    title: 'Fullstack engineering',
    shortTitle: 'Fullstack',
    description: 'Hands-on product and implementation work to build the selected system end to end.',
    detail:
      'Use fullstack engineering when the output needs to become a working software layer, internal tool, or productionized workflow.',
  },
  {
    id: 'senior-analysis',
    title: 'Senior-level analysis',
    shortTitle: 'Analysis',
    description: 'Higher-order framing, modeling, and interpretation of the source data for decision support.',
    detail:
      'Use senior-level analysis when the client needs rigorous interpretation, prioritization, and advisory logic more than direct buildout.',
  },
  {
    id: 'safety-risk',
    title: 'Safety Risk coordination',
    shortTitle: 'Safety',
    description: 'Risk-oriented coordination and compliance-aware evaluation for operational or site-sensitive work.',
    detail:
      'Use safety risk coordination when the work needs operational caution, site review, or stronger attention to risk-sensitive execution.',
  },
  {
    id: 'real-estate',
    title: 'Real Estate consulting',
    shortTitle: 'Real Estate',
    description: 'Property-linked advisory for layout, asset, lease, or sale-related decision making.',
    detail:
      'Use real estate consulting when the outcome depends on property context, site planning, sale support, or physical expansion decisions.',
  },
];

export const kitchenPresets: KitchenPreset[] = [
  {
    slug: 'growth',
    title: 'Growth',
    solutionName: 'Digital Growth Engine',
    description:
      'The preset for businesses that need stronger digital positioning, social traction, and build-ready growth execution.',
    roughEstimate: '$6k - $12k',
    selection: {
      informationIds: ['project-proposals'],
      integrationIds: ['instagram-analytics'],
      productionIds: ['fullstack'],
    },
    subpagePath: '/expertise/growth',
  },
  {
    slug: 'optimization',
    title: 'Optimization',
    solutionName: 'Performance Optimization Model',
    description:
      'The preset for owners who need stronger financial and operational analysis before making a consequential decision.',
    roughEstimate: '$8k - $18k',
    selection: {
      informationIds: ['financial-statements'],
      integrationIds: ['pos-analytics'],
      productionIds: ['senior-analysis'],
    },
    subpagePath: '/expertise/optimization',
  },
  {
    slug: 'diligence',
    title: 'Diligence',
    solutionName: 'Acquisition Due Diligence',
    description:
      'The preset for businesses preparing for review, transition, or transaction support with stronger property and procurement context.',
    roughEstimate: '$10k - $24k',
    selection: {
      informationIds: ['supplier-invoices'],
      integrationIds: ['google-analytics'],
      productionIds: ['real-estate'],
    },
    subpagePath: '/expertise/diligence',
  },
];

function getKitchenOptionsByIds(options: KitchenOption[], ids: string[]) {
  const resolved = ids
    .map((id) => options.find((option) => option.id === id))
    .filter((option): option is KitchenOption => Boolean(option));

  return resolved.length > 0 ? resolved : [options[0]];
}

function getInquiryType(productionIds: string[]): string {
  if (productionIds.includes('fullstack')) {
    return 'Marketing';
  }

  if (productionIds.includes('senior-analysis') || productionIds.includes('real-estate')) {
    return 'Financials';
  }

  return 'Operations';
}

function getProjectAreas(productionIds: string[]): PublicProjectArea[] {
  const areas = new Set<PublicProjectArea>();

  if (productionIds.includes('fullstack')) {
    areas.add('Marketing');
  }

  if (productionIds.includes('senior-analysis') || productionIds.includes('real-estate')) {
    areas.add('Financials');
  }

  if (productionIds.includes('safety-risk') || productionIds.includes('real-estate')) {
    areas.add('Operations');
  }

  return areas.size > 0 ? Array.from(areas) : ['Operations'];
}

function getSolutionName(
  information: KitchenOption[],
  integration: KitchenOption[],
  production: KitchenOption[],
) {
  const infoLabel =
    information.length === 1 ? information[0].shortTitle : `${information.length} Info Inputs`;
  const integrationLabel =
    integration.length === 1 ? integration[0].shortTitle : `${integration.length} Integrations`;

  if (production.length === 1) {
    const mode = production[0];

    if (mode.id === 'fullstack') {
      return `${infoLabel} ${integrationLabel} Build`;
    }

    if (mode.id === 'senior-analysis') {
      return `${infoLabel} ${integrationLabel} Analysis`;
    }

    if (mode.id === 'safety-risk') {
      return `${infoLabel} ${integrationLabel} Risk Review`;
    }

    return `${infoLabel} ${integrationLabel} Property Brief`;
  }

  return `${infoLabel} Multi-Layer Solution Stack`;
}

function getSolutionSummary(
  information: KitchenOption[],
  integration: KitchenOption[],
  production: KitchenOption[],
) {
  return `${production.length} production layer(s) built from ${information.length} information source(s) and ${integration.length} integration signal(s), preserving the original Kitchen logic while turning the selected ingredient stack into a scoping-ready proposal.`;
}

function getDeliverables(
  information: KitchenOption[],
  integration: KitchenOption[],
  production: KitchenOption[],
) {
  const base = [
    `${information.length} information input(s) organized into a project-ready working base`,
    `${integration.length} integration signal(s) used to connect the source material to live operating or digital context`,
  ];

  const deliverables = [...base];

  if (production.some((item) => item.id === 'fullstack')) {
    deliverables.push(
      'Implementation scope for a production-ready system or internal tool',
      'Technical roadmap for what needs to be built, connected, and maintained',
    );
  }

  if (production.some((item) => item.id === 'senior-analysis')) {
    deliverables.push(
      'Senior-level assessment with priorities, scenarios, and next-step interpretation',
      'Decision memo showing where B2W would focus first and why',
    );
  }

  if (production.some((item) => item.id === 'safety-risk')) {
    deliverables.push(
      'Risk-sensitive coordination scope covering site or operational exposure',
      'Practical review of what must be resolved before execution can move forward',
    );
  }

  if (production.some((item) => item.id === 'real-estate')) {
    deliverables.push(
      'Property or transfer-oriented advisory scope tied to the underlying business context',
      'Readiness view for sale, expansion, layout, or site-linked decisions',
    );
  }

  return Array.from(new Set(deliverables));
}

function getProposalHighlights(
  information: KitchenOption[],
  integration: KitchenOption[],
  production: KitchenOption[],
) {
  return [
    `Information inputs: ${information.map((item) => item.title).join(', ')}`,
    `Integration signals: ${integration.map((item) => item.title).join(', ')}`,
    `Production layers: ${production.map((item) => item.title).join(', ')}`,
  ];
}

function getRoughEstimate(production: KitchenOption[], ingredientCount: number) {
  let floor = 4500;
  let ceiling = 9000;

  if (production.some((item) => item.id === 'fullstack')) {
    floor += 3500;
    ceiling += 7000;
  }

  if (production.some((item) => item.id === 'senior-analysis')) {
    floor += 2500;
    ceiling += 5000;
  }

  if (production.some((item) => item.id === 'safety-risk')) {
    floor += 2000;
    ceiling += 4500;
  }

  if (production.some((item) => item.id === 'real-estate')) {
    floor += 3000;
    ceiling += 6500;
  }

  floor += Math.max(0, ingredientCount - 3) * 500;
  ceiling += Math.max(0, ingredientCount - 3) * 1200;

  return `$${Math.round(floor / 1000)}k - $${Math.round(ceiling / 1000)}k`;
}

export function buildKitchenSolution(selection: KitchenSelection): KitchenSolution {
  const information = getKitchenOptionsByIds(kitchenInformationOptions, selection.informationIds);
  const integration = getKitchenOptionsByIds(kitchenIntegrationOptions, selection.integrationIds);
  const production = getKitchenOptionsByIds(kitchenProductionOptions, selection.productionIds);
  const slug = [
    information.map((item) => item.id).join('+'),
    integration.map((item) => item.id).join('+'),
    production.map((item) => item.id).join('+'),
  ].join('--');
  const name = getSolutionName(information, integration, production);

  return {
    slug,
    name,
    summary: getSolutionSummary(information, integration, production),
    previewPath: `/clara/${slug}`,
    information,
    integration,
    production,
    deliverables: getDeliverables(information, integration, production),
    proposalHighlights: getProposalHighlights(information, integration, production),
    projectAreas: getProjectAreas(production.map((item) => item.id)),
    inquiryType: getInquiryType(production.map((item) => item.id)),
    roughEstimate: getRoughEstimate(production, information.length + integration.length + production.length),
  };
}

export function getKitchenPresetBySlug(slug: string) {
  return kitchenPresets.find((preset) => preset.slug === slug);
}

export function buildKitchenSolutionFromPreset(slug: string) {
  const preset = getKitchenPresetBySlug(slug);

  if (!preset) {
    return null;
  }

  const solution = buildKitchenSolution(preset.selection);

  return {
    ...solution,
    name: preset.solutionName,
    roughEstimate: preset.roughEstimate,
    preset,
  };
}

export function parseKitchenSolutionSlug(slug: string) {
  const [informationIdsRaw, integrationIdsRaw, productionIdsRaw] = slug.split('--');

  if (!informationIdsRaw || !integrationIdsRaw || !productionIdsRaw) {
    return null;
  }

  return buildKitchenSolution({
    informationIds: informationIdsRaw.split('+').filter(Boolean),
    integrationIds: integrationIdsRaw.split('+').filter(Boolean),
    productionIds: productionIdsRaw.split('+').filter(Boolean),
  });
}
