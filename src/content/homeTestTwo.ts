export type HomeTestCapabilityId = 'marketing-data' | 'financials' | 'operational-performance';
export type HomeTestExpertiseId = 'growth' | 'optimization' | 'diligence';
export type HomeTestProjectAreaId =
  | 'profile-build'
  | 'model-build'
  | 'documentation-build'
  | 'integrated-proposal';

export type HomeTestCapability = {
  id: HomeTestCapabilityId;
  title: string;
  body: string;
  detail: string;
  tags: string[];
};

export type HomeTestExpertise = {
  id: HomeTestExpertiseId;
  title: string;
  description: string;
  accentClassName: string;
  borderClassName: string;
};

export type HomeTestProjectArea = {
  id: HomeTestProjectAreaId;
  eyebrow: string;
  serviceType: string;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  capabilityIds: HomeTestCapabilityId[];
  expertiseIds: HomeTestExpertiseId[];
};

export type RankedProjectArea = HomeTestProjectArea & {
  score: number;
  matchedCapabilityCount: number;
  matchedExpertiseCount: number;
  isRecommended: boolean;
};

export const homeTestCapabilities: HomeTestCapability[] = [
  {
    id: 'marketing-data',
    title: 'Marketing Data',
    body: 'Ads, reviews, website analytics, CRM activity, lead funnels, ordering behavior, and customer-facing demand signals.',
    detail: 'Use this when the business can provide channel performance, local discovery, conversion, or customer-acquisition material.',
    tags: ['Reviews', 'Ads', 'Website', 'CRM'],
  },
  {
    id: 'financials',
    title: 'Financials',
    body: 'Revenue history, margins, cash flow, ARR context, pricing logic, unit economics, and budget or forecast materials.',
    detail: 'Use this when the business can provide operating statements, forecasting inputs, bank-level summaries, or model assumptions.',
    tags: ['P&L', 'Cash Flow', 'Forecasts', 'ARR'],
  },
  {
    id: 'operational-performance',
    title: 'Operational Performance',
    body: 'Scheduling, staffing, SOPs, service logs, vendor flow, fulfillment timing, training notes, and execution bottlenecks.',
    detail: 'Use this when the business can provide workflow context, operating records, staffing patterns, or execution-quality evidence.',
    tags: ['SOPs', 'Scheduling', 'Staffing', 'Workflow'],
  },
];

export const homeTestExpertise: HomeTestExpertise[] = [
  {
    id: 'growth',
    title: 'Growth',
    description:
      'Pull every selected data source into a growth read: where demand is coming from, where it stalls, and what the business can realistically support next.',
    accentClassName: 'text-emerald-700',
    borderClassName: 'border-emerald-200',
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description:
      'Translate the same data stack into a working model for revenue quality, margin leakage, operating drag, and the highest-leverage design changes.',
    accentClassName: 'text-sky-700',
    borderClassName: 'border-sky-200',
  },
  {
    id: 'diligence',
    title: 'Diligence',
    description:
      'Organize the same source material into a cleaner package for owner review, financing, transition planning, buyer conversations, or internal documentation.',
    accentClassName: 'text-amber-700',
    borderClassName: 'border-amber-200',
  },
];

export const homeTestProjectAreas: HomeTestProjectArea[] = [
  {
    id: 'profile-build',
    eyebrow: 'Profile',
    serviceType: 'Portal Foundation',
    title: 'Business Profile Build',
    summary:
      'Build a clear business profile that packages the concept, market position, operating story, and opportunity framing into a client-ready proposal shell.',
    detail:
      'Best when the business needs sharper positioning, better narrative control, or a stronger profile before deeper modeling or diligence work.',
    tags: ['Profile', 'Positioning', 'Opportunity Memo'],
    capabilityIds: ['marketing-data', 'operational-performance', 'financials'],
    expertiseIds: ['growth', 'diligence'],
  },
  {
    id: 'model-build',
    eyebrow: 'Model',
    serviceType: 'Scenario Modeling',
    title: 'Decision Model Build',
    summary:
      'Turn the selected inputs into a usable operating and economics model covering revenue quality, margin logic, sensitivity, and project tradeoffs.',
    detail:
      'Best when the client needs a practical model to support optimization, pricing, staffing, expansion, or valuation-style decision-making.',
    tags: ['Model', 'Economics', 'Scenarios'],
    capabilityIds: ['financials', 'operational-performance', 'marketing-data'],
    expertiseIds: ['optimization', 'growth'],
  },
  {
    id: 'documentation-build',
    eyebrow: 'Documentation',
    serviceType: 'Diligence Package',
    title: 'Documentation & Diligence Build',
    summary:
      'Package the business into a cleaner documentation layer with records, proof points, assumptions, and operating context organized for review.',
    detail:
      'Best when the engagement needs a stronger diligence trail, clearer handoff materials, or a buyer-, lender-, or leadership-ready record set.',
    tags: ['Documentation', 'Data Room', 'Proof'],
    capabilityIds: ['financials', 'operational-performance', 'marketing-data'],
    expertiseIds: ['diligence', 'optimization'],
  },
  {
    id: 'integrated-proposal',
    eyebrow: 'Integrated',
    serviceType: 'Profile + Model + Documentation',
    title: 'Integrated Proposal Portal',
    summary:
      'Combine profile, model, and documentation into one B2W-style project portal that adapts the scope to the business type, location, and available records.',
    detail:
      'Best when multiple expertise tracks matter at once and the client needs one proposal environment instead of separate deliverables.',
    tags: ['Portal', 'Proposal', 'End-to-End'],
    capabilityIds: ['marketing-data', 'financials', 'operational-performance'],
    expertiseIds: ['growth', 'optimization', 'diligence'],
  },
];

export const homeTestCapabilityLookup = Object.fromEntries(
  homeTestCapabilities.map((item) => [item.id, item]),
) as Record<HomeTestCapabilityId, HomeTestCapability>;

export const homeTestExpertiseLookup = Object.fromEntries(
  homeTestExpertise.map((item) => [item.id, item]),
) as Record<HomeTestExpertiseId, HomeTestExpertise>;

export const homeTestProjectAreaLookup = Object.fromEntries(
  homeTestProjectAreas.map((item) => [item.id, item]),
) as Record<HomeTestProjectAreaId, HomeTestProjectArea>;

export function getRankedProjectAreas(
  selectedCapabilityIds: HomeTestCapabilityId[],
  selectedExpertiseIds: HomeTestExpertiseId[],
): RankedProjectArea[] {
  const selectedCapabilitySet = new Set(selectedCapabilityIds);
  const selectedExpertiseSet = new Set(selectedExpertiseIds);
  const isFullCapabilityStack = selectedCapabilityIds.length === homeTestCapabilities.length;
  const isMultiTrackProject = selectedExpertiseIds.length > 1;

  return homeTestProjectAreas
    .map((area) => {
      const matchedCapabilityCount = area.capabilityIds.filter((id) => selectedCapabilitySet.has(id)).length;
      const matchedExpertiseCount = area.expertiseIds.filter((id) => selectedExpertiseSet.has(id)).length;
      const fullStackBonus = isFullCapabilityStack && area.id === 'integrated-proposal' ? 3 : 0;
      const multiTrackBonus = isMultiTrackProject && area.id === 'integrated-proposal' ? 2 : 0;
      const depthBonus =
        area.id === 'documentation-build' && selectedCapabilitySet.has('financials') && selectedCapabilitySet.has('operational-performance')
          ? 1
          : 0;

      return {
        ...area,
        matchedCapabilityCount,
        matchedExpertiseCount,
        score: matchedCapabilityCount * 2 + matchedExpertiseCount * 3 + fullStackBonus + multiTrackBonus + depthBonus,
        isRecommended: false,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.matchedExpertiseCount !== left.matchedExpertiseCount) {
        return right.matchedExpertiseCount - left.matchedExpertiseCount;
      }

      return right.matchedCapabilityCount - left.matchedCapabilityCount;
    })
    .map((area, index, allAreas) => ({
      ...area,
      isRecommended: area.score > 0 && index < Math.min(2, allAreas.filter((item) => item.score > 0).length),
    }));
}
