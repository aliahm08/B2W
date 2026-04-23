export type ExplainerItem = {
  label: string;
  detail: string;
};

export type ExplainerContent = {
  title: string;
  seoTitle: string;
  eyebrow: string;
  description: string;
  summary: string;
  examples: ExplainerItem[];
  decisions: string[];
  examplesLabel?: string;
  accent?: 'default' | 'green';
};

export const explainerContent: Record<string, ExplainerContent> = {
  '/growth': {
    eyebrow: 'Marketing Data',
    title: 'See What Marketing Data Is Really Saying',
    seoTitle: 'Marketing Data Analysis for Small Business Growth',
    description:
      'Examples of the marketing data B2W reviews to understand demand, conversion behavior, and channel performance.',
    summary:
      'We look at how people discover the business, what they do once they find it, and where marketing spend or attention is creating momentum or getting wasted.',
    examples: [
      {
        label: 'Instagram analytics',
        detail:
          'Reach, engagement, follower growth, story performance, and content-level drop-off that show which creative is earning attention and where interest fades.',
      },
      {
        label: 'Google reviews',
        detail:
          'Ratings patterns, review volume, recurring complaints, and sentiment signals that reveal what customers repeatedly notice and what is hurting trust.',
      },
      {
        label: 'Google Ads',
        detail:
          'Impressions, click-through rate, cost per click, conversions, and search term quality to show whether paid demand is efficient or being wasted.',
      },
      {
        label: 'Website visit behavior',
        detail:
          'Traffic sources, page paths, time on page, and where people are clicking so we can see how visitors move, hesitate, or leave.',
      },
      {
        label: 'Landing-page conversion data',
        detail:
          'Form completion, call clicks, booking intent, and funnel abandonment points that show where demand turns into leads and where it dies.',
      },
    ],
    decisions: [
      'Identify which channels are actually driving qualified demand',
      'Find where interest is dropping before it becomes revenue',
      'Improve website, campaign, and content decisions using observed user behavior',
    ],
    examplesLabel: 'High ROI Priorities',
    accent: 'green',
  },
  '/capabilities/financials': {
    eyebrow: 'Financials',
    title: 'Find What the Financials Are Hiding',
    seoTitle: 'Financial Review and Margin Analysis for SMBs',
    description:
      'Examples of the financial inputs B2W uses to understand profitability, leakage, and the tradeoffs behind growth decisions.',
    summary:
      'We read the numbers behind the business to understand how revenue turns into margin, where losses are hiding, and which changes are financially worth making.',
    examples: [
      {
        label: 'Profit and loss statements',
        detail:
          'Monthly, quarterly, or location-based P&Ls that show how revenue, direct costs, and overhead are actually performing.',
      },
      {
        label: 'Revenue mix',
        detail:
          'Breakdowns by product, service line, or customer segment that reveal where strong sales are helping and where weak mix is dragging results.',
      },
      {
        label: 'Margin performance',
        detail:
          'Gross margin, contribution margin, and pricing behavior that show whether the business is growing profitably or just moving volume.',
      },
      {
        label: 'Cash flow timing',
        detail:
          'Expense concentration, recurring obligations, and payment timing that expose pressure points the P&L alone does not show.',
      },
      {
        label: 'Invoices and payroll patterns',
        detail:
          'Operating records that help surface margin leakage, avoidable spend, and recurring cost structures that need to be corrected.',
      },
    ],
    decisions: [
      'Find where revenue is being lost or diluted',
      'Pressure-test pricing, margin, and cash flow assumptions',
      'Prioritize changes that have real financial upside',
    ],
  },
  '/capabilities/operational-performance': {
    eyebrow: 'Operational Performance',
    title: 'Understand Where Operations Break Down',
    seoTitle: 'Operational Performance Analysis for SMB Teams',
    description:
      'Examples of the operational data B2W reviews to understand workflow friction, execution quality, and delivery constraints.',
    summary:
      'We read how the business actually runs day to day so we can spot bottlenecks, coordination failures, and repeatable issues that keep performance below capacity.',
    examples: [
      {
        label: 'Scheduling and staffing data',
        detail:
          'Shift coverage, labor patterns, and staffing gaps that show whether the operation is consistently matched to demand.',
      },
      {
        label: 'Process maps and SOPs',
        detail:
          'Workflow definitions, handoff points, and operating instructions that reveal confusion, duplication, or missing process control.',
      },
      {
        label: 'Throughput and service benchmarks',
        detail:
          'Production time, service time, completion time, or turnaround metrics that show where execution is slowing down.',
      },
      {
        label: 'Dashboard and task-tracking data',
        detail:
          'Operational metrics, task status patterns, and recurring exceptions that point to systemic reliability problems.',
      },
      {
        label: 'Operational notes and team feedback',
        detail:
          'Observed issues, recurring complaints, and frontline signals that expose execution drag clients and teams are already feeling.',
      },
    ],
    decisions: [
      'Find bottlenecks that are slowing down delivery',
      'Reduce avoidable coordination and training overhead',
      'Improve execution consistency with clearer systems and workflows',
    ],
  },
};
