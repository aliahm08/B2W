import type { ExecutiveRole } from './JasonAIInternalPortal';

export type ExecutiveMeeting = {
  day: string;
  duration: string;
  name: string;
  lead: ExecutiveRole;
  purpose: string;
  requiredInputs: string[];
  agenda: string[];
  outputs: string[];
};

export const executiveMeetings: ExecutiveMeeting[] = [
  {
    day: 'Monday',
    duration: '60 minutes',
    name: 'Executive Operating Review',
    lead: 'CEO',
    purpose:
      'Set the company priority for the week, review the active phase gate, and resolve decisions that cross pricing, product, and customer success.',
    requiredInputs: [
      'CEO: pipeline, pricing evidence, cash, and external commitments.',
      'CTO: product quality, reliability, safety, and delivery risks.',
      'COO: KPI scorecard, customer health, onboarding, and overdue actions.',
    ],
    agenda: [
      '00-05 · Restate the active phase objective and the one outcome that matters this week.',
      '05-20 · Review only KPI movement, minimum-gate risk, and material exceptions.',
      '20-40 · Decide the two or three cross-functional issues that block progress.',
      '40-55 · Assign weekly commitments with one owner, metric, and due date.',
      '55-60 · Read back decisions, owners, and what will not be worked on.',
    ],
    outputs: [
      'One written weekly priority.',
      'Decision log updated.',
      'Named commitments with due dates.',
      'Escalations and deprioritized work recorded.',
    ],
  },
  {
    day: 'Wednesday',
    duration: '45 minutes',
    name: 'Product + Customer Checkpoint',
    lead: 'CTO',
    purpose:
      'Turn live customer evidence into product decisions while catching delivery, reliability, privacy, or onboarding risks before they compound.',
    requiredInputs: [
      'CTO: shipped work, open defects, reliability signals, and technical tradeoffs.',
      'COO: customer feedback, onboarding friction, adoption, and at-risk accounts.',
      'CEO: joins when a scope, pricing, customer promise, or resource tradeoff needs a decision.',
    ],
    agenda: [
      '00-10 · Review incidents, quality failures, and current delivery confidence.',
      '10-20 · Review the highest-value customer signal and its supporting evidence.',
      '20-35 · Decide fixes, experiments, and scope changes for the next delivery window.',
      '35-45 · Confirm owners, customer communication, success measures, and deadlines.',
    ],
    outputs: [
      'Ranked product and customer interventions.',
      'Explicit acceptance criteria.',
      'Customer communication owner.',
      'Risks requiring Monday escalation.',
    ],
  },
  {
    day: 'Friday',
    duration: '45 minutes',
    name: 'KPI + Commitments Review',
    lead: 'COO',
    purpose:
      'Close the operating week with verified results, completed task reports, captured learning, and a clean starting position for Monday.',
    requiredInputs: [
      'Every owner updates current KPI results and task reports before the meeting.',
      'Evidence is linked or summarized for every claimed result.',
      'Incomplete commitments include the reason, recovery plan, and new date.',
    ],
    agenda: [
      '00-15 · Score commitments complete, incomplete, or invalidated by evidence.',
      '15-25 · Compare each active KPI against its minimum gate and goal.',
      '25-35 · Capture learning, customer evidence, and changes to assumptions.',
      '35-45 · Confirm carryovers, close actions, and prepare Monday decision topics.',
    ],
    outputs: [
      'Dashboard and KPI tracker current.',
      'Completed work evidenced.',
      'Carryovers explicitly accepted or rejected.',
      'Monday decision agenda drafted.',
    ],
  },
];

export const executiveResponsibilities = [
  {
    role: 'CEO' as ExecutiveRole,
    leads: 'Monday Executive Operating Review',
    owns:
      'Pricing, market selection, revenue, partnerships, capital allocation, and the final call on phase priorities.',
  },
  {
    role: 'CTO' as ExecutiveRole,
    leads: 'Wednesday Product + Customer Checkpoint',
    owns:
      'Product quality, architecture, engineering delivery, reliability, and safety and privacy risk.',
  },
  {
    role: 'COO' as ExecutiveRole,
    leads: 'Friday KPI + Commitments Review',
    owns:
      'Operating scorecard, customer success, onboarding, process quality, action tracking, and meeting follow-through.',
  },
];

export const meetingProtocol = [
  {
    stage: 'Before',
    timing: '24 hours before',
    owner: 'COO coordinates; every KPI owner contributes',
    steps: [
      'Update KPI results, task status, quantities, evidence, and tracked metrics in the report.',
      'Submit only topics that require a decision, tradeoff, or escalation.',
      'Mark below-minimum metrics red, minimum-cleared metrics amber, and goal-achieved metrics green.',
      'Circulate the agenda with the desired decision stated for every discussion item.',
    ],
  },
  {
    stage: 'During',
    timing: 'Timeboxed meeting',
    owner: 'Meeting lead facilitates; CEO resolves unresolved company tradeoffs',
    steps: [
      'Start with the scorecard and exceptions; do not read status updates aloud.',
      'Separate facts, assumptions, options, and the decision being requested.',
      'End every topic with a decision, a named directly responsible individual, and a due date.',
      'Move unresolved analysis to a small working session instead of consuming the full meeting.',
    ],
  },
  {
    stage: 'After',
    timing: 'Within 2 hours',
    owner: 'COO maintains the operating record',
    steps: [
      'Publish the decision and action log with owners, dates, and success measures.',
      'Update the dashboard whenever a reported result, task, phase gate, or priority changed.',
      'Owners acknowledge their commitments and immediately flag impossible dates.',
      'Any unresolved blocker older than 48 hours escalates to the CEO.',
    ],
  },
];

export const operatingRules = [
  'One directly responsible individual for every action.',
  'No recurring commitment without an owner, metric, and deadline.',
  'A decision is not complete until the rationale and revisit condition are recorded.',
  'Below the minimum gate means recovery work takes priority over new scope.',
  'Meeting time is for decisions and exceptions; routine updates stay asynchronous.',
];
