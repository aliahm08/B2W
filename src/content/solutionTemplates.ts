import type { KitchenSolution } from './kitchen';

export type SolutionInputKey =
  | 'monthlyRevenue'
  | 'grossMarginPct'
  | 'laborPct'
  | 'monthlyRent'
  | 'websiteConversionPct'
  | 'socialEngagementPct'
  | 'repeatCustomerPct'
  | 'monthlyFootTraffic'
  | 'marketGrowthPct';

export type SolutionInput = {
  key: SolutionInputKey;
  label: string;
  unit: 'currency' | 'percent' | 'number';
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  help: string;
};

export type SolutionScoreCard = {
  id: string;
  label: string;
  score: number;
  benchmarkLabel: string;
  summary: string;
};

export type SolutionDerivedMetrics = {
  annualRevenue: number;
  grossProfit: number;
  laborCost: number;
  annualRent: number;
  operatingIncome: number;
  impliedMultiple: number;
  enterpriseValue: number;
  revenuePerVisitor: number;
  repeatRevenueShare: number;
};

export type SolutionProfile = {
  businessName: string;
  sector: string;
  geography: string;
  summary: string;
  marketContext: string;
};

export type SolutionTemplateData = {
  profile: SolutionProfile;
  inputs: SolutionInput[];
  scorecards: SolutionScoreCard[];
  derived: SolutionDerivedMetrics;
  deliverableSections: Array<{
    title: string;
    body: string;
    bullets: string[];
  }>;
};

type InputValues = Record<SolutionInputKey, number>;

const marketBenchmarks = {
  grossMarginPct: 0.58,
  laborPct: 0.29,
  websiteConversionPct: 0.031,
  socialEngagementPct: 0.038,
  repeatCustomerPct: 0.33,
  monthlyFootTraffic: 3800,
  marketGrowthPct: 0.06,
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getDefaultSolutionInputs(solution: KitchenSolution): SolutionInput[] {
  const hasRealEstate = solution.production.some((item) => item.id === 'real-estate');
  const hasBuild = solution.production.some((item) => item.id === 'fullstack');
  const hasAnalysis = solution.production.some((item) => item.id === 'senior-analysis');
  const hasSocial = solution.integration.some((item) => item.id === 'instagram-analytics');
  const hasWebsite = solution.integration.some((item) => item.id === 'google-analytics' || item.id === 'website-scrubbing');

  return [
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      unit: 'currency',
      min: 25000,
      max: 300000,
      step: 2500,
      defaultValue: hasAnalysis ? 118000 : 92000,
      help: 'Mock topline revenue used for profitability, value, and market-position calculations.',
    },
    {
      key: 'grossMarginPct',
      label: 'Gross Margin',
      unit: 'percent',
      min: 0.3,
      max: 0.85,
      step: 0.01,
      defaultValue: hasRealEstate ? 0.61 : 0.56,
      help: 'Gross margin assumption for the business before labor, occupancy, and overhead allocations.',
    },
    {
      key: 'laborPct',
      label: 'Labor Load',
      unit: 'percent',
      min: 0.1,
      max: 0.5,
      step: 0.01,
      defaultValue: hasBuild ? 0.24 : 0.29,
      help: 'Labor cost as a share of revenue. Lower values indicate stronger operating efficiency.',
    },
    {
      key: 'monthlyRent',
      label: 'Monthly Rent',
      unit: 'currency',
      min: 3000,
      max: 40000,
      step: 500,
      defaultValue: hasRealEstate ? 12400 : 8600,
      help: 'Occupancy cost assumption used in the mock operating model.',
    },
    {
      key: 'websiteConversionPct',
      label: 'Website Conversion',
      unit: 'percent',
      min: 0.005,
      max: 0.12,
      step: 0.001,
      defaultValue: hasWebsite ? 0.041 : 0.024,
      help: 'Conversion rate for visitors who complete the desired business action.',
    },
    {
      key: 'socialEngagementPct',
      label: 'Social Engagement',
      unit: 'percent',
      min: 0.005,
      max: 0.2,
      step: 0.001,
      defaultValue: hasSocial ? 0.054 : 0.026,
      help: 'Engagement rate used to compare the mock brand profile against general market traction.',
    },
    {
      key: 'repeatCustomerPct',
      label: 'Repeat Customer Share',
      unit: 'percent',
      min: 0.05,
      max: 0.85,
      step: 0.01,
      defaultValue: 0.37,
      help: 'Portion of revenue attributed to repeat or retained business.',
    },
    {
      key: 'monthlyFootTraffic',
      label: 'Monthly Demand Volume',
      unit: 'number',
      min: 500,
      max: 15000,
      step: 100,
      defaultValue: hasWebsite || hasSocial ? 4600 : 3200,
      help: 'Mock visitor or demand volume used to estimate conversion quality and revenue per visitor.',
    },
    {
      key: 'marketGrowthPct',
      label: 'Market Growth',
      unit: 'percent',
      min: -0.05,
      max: 0.2,
      step: 0.005,
      defaultValue: hasBuild ? 0.08 : 0.05,
      help: 'General market-growth assumption used to benchmark the mock business profile.',
    },
  ];
}

export function getInitialInputValues(inputs: SolutionInput[]): InputValues {
  return Object.fromEntries(inputs.map((input) => [input.key, input.defaultValue])) as InputValues;
}

function inferSector(solution: KitchenSolution) {
  if (solution.production.some((item) => item.id === 'real-estate')) {
    return 'Property-Linked SMB';
  }

  if (solution.production.some((item) => item.id === 'fullstack')) {
    return 'Digitally Operated Service Business';
  }

  return 'Owner-Operated SMB';
}

function inferSummary(solution: KitchenSolution) {
  return `This mock deliverable combines ${solution.information.length} information input(s), ${solution.integration.length} integration layer(s), and ${solution.production.length} production layer(s) into a solution template that shows what the final B2W work product could look like.`;
}

export function buildSolutionTemplateData(solution: KitchenSolution, values: InputValues): SolutionTemplateData {
  const annualRevenue = values.monthlyRevenue * 12;
  const grossProfit = annualRevenue * values.grossMarginPct;
  const laborCost = annualRevenue * values.laborPct;
  const annualRent = values.monthlyRent * 12;
  const operatingIncome = grossProfit - laborCost - annualRent;
  const revenuePerVisitor = annualRevenue / Math.max(values.monthlyFootTraffic * 12, 1);
  const repeatRevenueShare = annualRevenue * values.repeatCustomerPct;

  const digitalStrengthScore = clampScore(
    (values.websiteConversionPct / marketBenchmarks.websiteConversionPct) * 32 +
      (values.socialEngagementPct / marketBenchmarks.socialEngagementPct) * 28 +
      (values.marketGrowthPct / Math.max(marketBenchmarks.marketGrowthPct, 0.01)) * 20,
  );
  const operatingQualityScore = clampScore(
    (values.grossMarginPct / marketBenchmarks.grossMarginPct) * 36 +
      (marketBenchmarks.laborPct / Math.max(values.laborPct, 0.01)) * 34 +
      (values.repeatCustomerPct / marketBenchmarks.repeatCustomerPct) * 20,
  );
  const marketPositionScore = clampScore(
    (values.monthlyFootTraffic / marketBenchmarks.monthlyFootTraffic) * 30 +
      (revenuePerVisitor / 28) * 25 +
      (values.marketGrowthPct / Math.max(marketBenchmarks.marketGrowthPct, 0.01)) * 25,
  );

  const averageScore = (digitalStrengthScore + operatingQualityScore + marketPositionScore) / 3;
  const impliedMultiple = Number((2.4 + averageScore / 40 + solution.production.length * 0.18).toFixed(2));
  const enterpriseValue = Math.max(annualRevenue * 0.18, operatingIncome * impliedMultiple);

  return {
    profile: {
      businessName: 'Northstar Mock Co.',
      sector: inferSector(solution),
      geography: 'Mid-Atlantic Metro',
      summary: inferSummary(solution),
      marketContext:
        'Benchmarks shown on this page use generalized SMB market assumptions so the deliverable can demonstrate how B2W would package context, score the business, and summarize decision options.',
    },
    inputs: getDefaultSolutionInputs(solution),
    scorecards: [
      {
        id: 'digital-strength',
        label: 'Digital Strength',
        score: digitalStrengthScore,
        benchmarkLabel: `Market engagement benchmark ${(marketBenchmarks.socialEngagementPct * 100).toFixed(1)}%`,
        summary: 'Measures conversion quality, engagement signal, and the business’s digital momentum against generalized market behavior.',
      },
      {
        id: 'operating-quality',
        label: 'Operating Quality',
        score: operatingQualityScore,
        benchmarkLabel: `Market gross margin benchmark ${(marketBenchmarks.grossMarginPct * 100).toFixed(0)}%`,
        summary: 'Compares margin quality, labor load, and repeat-customer strength to a generic SMB peer set.',
      },
      {
        id: 'market-position',
        label: 'Market Position',
        score: marketPositionScore,
        benchmarkLabel: `Market demand benchmark ${marketBenchmarks.monthlyFootTraffic.toLocaleString()} monthly visitors`,
        summary: 'Shows how the mock business profile performs against broad demand, pricing efficiency, and market-growth assumptions.',
      },
    ],
    derived: {
      annualRevenue,
      grossProfit,
      laborCost,
      annualRent,
      operatingIncome,
      impliedMultiple,
      enterpriseValue,
      revenuePerVisitor,
      repeatRevenueShare,
    },
    deliverableSections: [
      {
        title: 'Executive Profile',
        body:
          'A mock summary of the business position, what the selected inputs suggest, and where B2W would focus first.',
        bullets: [
          `Business profile built from ${solution.information.map((item) => item.title).join(', ')}`,
          `Integrated with ${solution.integration.map((item) => item.title).join(', ')}`,
          `Final output framed through ${solution.production.map((item) => item.title).join(', ')}`,
        ],
      },
      {
        title: 'Decision Summary',
        body:
          'A model-style summary that translates the editable assumptions into a concise read on value, efficiency, and market readiness.',
        bullets: [
          `Estimated operating income: ${formatCurrency(operatingIncome)}`,
          `Implied enterprise value: ${formatCurrency(enterpriseValue)}`,
          `Repeat revenue represented in profile: ${formatCurrency(repeatRevenueShare)}`,
        ],
      },
      {
        title: 'Benchmark Narrative',
        body:
          'A concise mock narrative showing how the business would be positioned against generalized market data in the final deliverable.',
        bullets: [
          `Digital strength score: ${digitalStrengthScore}/100`,
          `Operating quality score: ${operatingQualityScore}/100`,
          `Market position score: ${marketPositionScore}/100`,
        ],
      },
    ],
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}
