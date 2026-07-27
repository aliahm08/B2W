import { createHash } from 'node:crypto';

export type JasonAIProgressSnapshot = {
  taskReports: Record<string, Record<string, unknown>>;
  kpiReports: Record<string, { currentResult?: string }>;
  metricsVersion: number;
};

export type JasonAIProgressChange = {
  scope: 'task' | 'kpi';
  entityId: string;
  patch: Record<string, unknown>;
  before?: Record<string, unknown>;
  interaction?: string;
};

export type TimelinePhase = {
  id: string;
  label: string;
  expected: number;
  execution: number;
  goalPerformance: number;
  variance: number;
  status: 'ahead' | 'on-track' | 'behind';
};

export type TimelineAssessment = {
  generatedAt: string;
  strategyProgress: number;
  idealExecution: number;
  actualExecution: number;
  portfolioVariance: number;
  currentPhaseId: string;
  currentPhaseLabel: string;
  phases: TimelinePhase[];
};

export type SessionComparison = {
  today: string;
  previousVersionId: number | null;
  previousCreatedAt: string | null;
  daysSincePrevious: number | null;
  executionDelta: number;
  idealExecutionDelta: number;
  reportedGoalsDelta: number;
  completedAssignmentsDelta: number;
  currentExecution: number;
  previousExecution: number | null;
  currentReportedGoals: number;
  previousReportedGoals: number | null;
  currentCompletedAssignments: number;
  previousCompletedAssignments: number | null;
  latestChangeSummary: string;
};

export type ExecutiveAnalysis = {
  source: 'model' | 'deterministic';
  model?: string;
  overviewTitle: string;
  overviewSubtitle: string;
  headline: string;
  executiveSummary: string;
  status: 'ahead' | 'on-track' | 'at-risk' | 'behind';
  timelineAssessment: string;
  decisions: string[];
  risks: Array<{ title: string; owner: 'CEO' | 'COO' | 'CTO'; detail: string }>;
  accountability: Array<{ owner: 'CEO' | 'COO' | 'CTO'; commitment: string; reason: string }>;
  questions: string[];
  confidence: 'low' | 'medium' | 'high';
};

type GoalDefinition = {
  id: string;
  minimum: number;
  target: number;
  lowerIsBetter?: boolean;
};

type PhaseDefinition = {
  id: string;
  label: string;
  start: string;
  end: string;
  goals: GoalDefinition[];
};

const phaseDefinitions: PhaseDefinition[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    start: '2026-08-01T00:00:00-04:00',
    end: '2026-10-31T23:59:59-04:00',
    goals: [
      { id: 'pricing', minimum: 3, target: 5 },
      { id: 'product', minimum: 80, target: 90 },
      { id: 'success', minimum: 15, target: 5, lowerIsBetter: true },
    ],
  },
  {
    id: 'validation',
    label: 'Validation',
    start: '2026-11-01T00:00:00-04:00',
    end: '2027-01-31T23:59:59-05:00',
    goals: [
      { id: 'pricing', minimum: 30, target: 50 },
      { id: 'product', minimum: 50, target: 65 },
      { id: 'success', minimum: 1, target: 2 },
    ],
  },
  {
    id: 'inflection',
    label: 'Inflection',
    start: '2027-02-01T00:00:00-05:00',
    end: '2027-07-31T23:59:59-04:00',
    goals: [
      { id: 'pricing', minimum: 40, target: 75 },
      { id: 'product', minimum: 60, target: 75 },
      { id: 'success', minimum: 70, target: 85 },
    ],
  },
  {
    id: 'scale',
    label: 'Scale',
    start: '2027-08-01T00:00:00-04:00',
    end: '2028-01-31T23:59:59-05:00',
    goals: [
      { id: 'pricing', minimum: 3, target: 4 },
      { id: 'product', minimum: 80, target: 90 },
      { id: 'success', minimum: 4, target: 3, lowerIsBetter: true },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    start: '2028-02-01T00:00:00-05:00',
    end: '2028-07-31T23:59:59-04:00',
    goals: [
      { id: 'pricing', minimum: 110, target: 120 },
      { id: 'product', minimum: 50, target: 70 },
      { id: 'success', minimum: 85, target: 90 },
    ],
  },
];

const allowedTaskFields = new Set(['completed', 'quantity', 'unit', 'result', 'plan']);
const allowedKpiFields = new Set(['currentResult']);

const clamp = (value: number, minimum = 0, maximum = 100) =>
  Math.min(maximum, Math.max(minimum, value));

function numberFromUnknown(value: unknown) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function goalPerformance(value: unknown, goal: GoalDefinition) {
  const numericValue = numberFromUnknown(value);
  if (numericValue === null) return 0;

  if (goal.lowerIsBetter) {
    if (numericValue <= goal.target) return 100;
    if (numericValue >= goal.minimum) return numericValue === goal.minimum ? 60 : 0;
    return Math.round(
      60 + ((goal.minimum - numericValue) / (goal.minimum - goal.target)) * 40,
    );
  }

  return Math.round(clamp((numericValue / goal.target) * 100));
}

function phaseExpectedProgress(phase: PhaseDefinition, now: number) {
  const start = new Date(phase.start).getTime();
  const end = new Date(phase.end).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

function getCurrentPhase(now: number) {
  const active = phaseDefinitions.find(
    (phase) => now >= new Date(phase.start).getTime() && now <= new Date(phase.end).getTime(),
  );
  if (active) return active;
  if (now < new Date(phaseDefinitions[0].start).getTime()) return phaseDefinitions[0];
  return phaseDefinitions[phaseDefinitions.length - 1];
}

function countPhaseTasks(snapshot: JasonAIProgressSnapshot, phaseId: string) {
  const taskEntries = Object.entries(snapshot.taskReports).filter(([taskId]) =>
    taskId.startsWith(`${phaseId}:`),
  );
  const completed = taskEntries.filter(([, report]) => report?.completed === true).length;
  const total = Math.max(12, taskEntries.length);
  return { completed, total, percent: Math.round((completed / total) * 100) };
}

function countReportedGoals(snapshot: JasonAIProgressSnapshot) {
  return Object.values(snapshot.kpiReports).filter((report) =>
    String(report?.currentResult ?? '').trim(),
  ).length;
}

function countCompletedAssignments(snapshot: JasonAIProgressSnapshot) {
  return Object.values(snapshot.taskReports).filter((report) => report?.completed === true).length;
}

function formatExecutiveDate(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  }).format(typeof value === 'string' ? new Date(value) : value);
}

export function normalizeSnapshot(value: unknown): JasonAIProgressSnapshot {
  const candidate = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const taskReports =
    candidate.taskReports && typeof candidate.taskReports === 'object'
      ? (candidate.taskReports as Record<string, Record<string, unknown>>)
      : {};
  const kpiReports =
    candidate.kpiReports && typeof candidate.kpiReports === 'object'
      ? (candidate.kpiReports as Record<string, { currentResult?: string }>)
      : {};

  return {
    taskReports: Object.fromEntries(Object.entries(taskReports).slice(0, 120)),
    kpiReports: Object.fromEntries(Object.entries(kpiReports).slice(0, 30)),
    metricsVersion: Number(candidate.metricsVersion ?? 1) || 1,
  };
}

export function normalizeChange(value: unknown): JasonAIProgressChange {
  const candidate = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const scope = candidate.scope === 'task' ? 'task' : candidate.scope === 'kpi' ? 'kpi' : null;
  const entityId = String(candidate.entityId ?? '').trim().slice(0, 160);
  if (!scope || !entityId) throw new Error('A valid progress-change scope and entity are required.');

  const fieldAllowlist = scope === 'task' ? allowedTaskFields : allowedKpiFields;
  const rawPatch =
    candidate.patch && typeof candidate.patch === 'object'
      ? (candidate.patch as Record<string, unknown>)
      : {};
  const patch = Object.fromEntries(
    Object.entries(rawPatch)
      .filter(([key]) => fieldAllowlist.has(key))
      .map(([key, patchValue]) => [
        key,
        typeof patchValue === 'string' ? patchValue.slice(0, 12_000) : patchValue,
      ]),
  );
  if (Object.keys(patch).length === 0) throw new Error('No supported progress fields were provided.');

  return {
    scope,
    entityId,
    patch,
    before:
      candidate.before && typeof candidate.before === 'object'
        ? (candidate.before as Record<string, unknown>)
        : undefined,
    interaction: String(candidate.interaction ?? 'direct edit').trim().slice(0, 120),
  };
}

export function applyChange(
  snapshot: JasonAIProgressSnapshot,
  change: JasonAIProgressChange,
): JasonAIProgressSnapshot {
  const next = structuredClone(snapshot);
  if (change.scope === 'task') {
    next.taskReports[change.entityId] = {
      ...(next.taskReports[change.entityId] ?? {}),
      ...change.patch,
    };
  } else {
    next.kpiReports[change.entityId] = {
      ...(next.kpiReports[change.entityId] ?? {}),
      ...change.patch,
    };
  }
  return next;
}

export function buildTimelineAssessment(
  snapshot: JasonAIProgressSnapshot,
  generatedAt = new Date(),
): TimelineAssessment {
  const now = generatedAt.getTime();
  const phases = phaseDefinitions.map((phase): TimelinePhase => {
    const expected = phaseExpectedProgress(phase, now);
    const execution = countPhaseTasks(snapshot, phase.id).percent;
    const goalValues = phase.goals.map((goal) =>
      goalPerformance(snapshot.kpiReports[`${phase.id}:${goal.id}`]?.currentResult, goal),
    );
    const performance = Math.round(
      goalValues.reduce((total, value) => total + value, 0) / goalValues.length,
    );
    const variance = execution - expected;
    return {
      id: phase.id,
      label: phase.label,
      expected,
      execution,
      goalPerformance: performance,
      variance,
      status: variance >= 10 ? 'ahead' : variance >= -10 ? 'on-track' : 'behind',
    };
  });
  const idealExecution = Math.round(
    phases.reduce((total, phase) => total + phase.expected, 0) / phases.length,
  );
  const actualExecution = Math.round(
    phases.reduce((total, phase) => total + phase.execution, 0) / phases.length,
  );
  const strategyStart = new Date(phaseDefinitions[0].start).getTime();
  const strategyEnd = new Date(phaseDefinitions[phaseDefinitions.length - 1].end).getTime();
  const currentPhase = getCurrentPhase(now);

  return {
    generatedAt: generatedAt.toISOString(),
    strategyProgress: Math.round(clamp(((now - strategyStart) / (strategyEnd - strategyStart)) * 100)),
    idealExecution,
    actualExecution,
    portfolioVariance: actualExecution - idealExecution,
    currentPhaseId: currentPhase.id,
    currentPhaseLabel: currentPhase.label,
    phases,
  };
}

export function buildSessionComparison(
  snapshot: JasonAIProgressSnapshot,
  timeline: TimelineAssessment,
  previous: {
    id: number;
    createdAt: string;
    snapshot: JasonAIProgressSnapshot;
    timeline: TimelineAssessment;
  } | null,
  latestChangeSummary: string,
  generatedAt = new Date(timeline.generatedAt),
): SessionComparison {
  const currentReportedGoals = countReportedGoals(snapshot);
  const currentCompletedAssignments = countCompletedAssignments(snapshot);
  const previousReportedGoals = previous ? countReportedGoals(previous.snapshot) : null;
  const previousCompletedAssignments = previous
    ? countCompletedAssignments(previous.snapshot)
    : null;
  const previousExecution = previous?.timeline.actualExecution ?? null;
  const previousCreatedAt = previous?.createdAt ?? null;
  const daysSincePrevious = previousCreatedAt
    ? Math.max(
        0,
        Math.floor(
          (generatedAt.getTime() - new Date(previousCreatedAt).getTime()) / 86_400_000,
        ),
      )
    : null;

  return {
    today: generatedAt.toISOString(),
    previousVersionId: previous?.id ?? null,
    previousCreatedAt,
    daysSincePrevious,
    executionDelta:
      previousExecution === null ? 0 : timeline.actualExecution - previousExecution,
    idealExecutionDelta: previous
      ? timeline.idealExecution - previous.timeline.idealExecution
      : 0,
    reportedGoalsDelta:
      previousReportedGoals === null ? 0 : currentReportedGoals - previousReportedGoals,
    completedAssignmentsDelta:
      previousCompletedAssignments === null
        ? 0
        : currentCompletedAssignments - previousCompletedAssignments,
    currentExecution: timeline.actualExecution,
    previousExecution,
    currentReportedGoals,
    previousReportedGoals,
    currentCompletedAssignments,
    previousCompletedAssignments,
    latestChangeSummary,
  };
}

export function buildDeterministicAnalysis(
  snapshot: JasonAIProgressSnapshot,
  timeline: TimelineAssessment,
  comparison?: SessionComparison,
): ExecutiveAnalysis {
  const reportedGoals = countReportedGoals(snapshot);
  const current = timeline.phases.find((phase) => phase.id === timeline.currentPhaseId) ?? timeline.phases[0];
  const status: ExecutiveAnalysis['status'] =
    timeline.portfolioVariance >= 8
      ? 'ahead'
      : timeline.portfolioVariance >= -8
        ? 'on-track'
        : timeline.portfolioVariance >= -20
          ? 'at-risk'
          : 'behind';
  const missingGoalCount = 15 - reportedGoals;
  const today = formatExecutiveDate(comparison?.today ?? timeline.generatedAt);
  const previousDate = comparison?.previousCreatedAt
    ? formatExecutiveDate(comparison.previousCreatedAt)
    : null;
  const overviewTitle = !comparison?.previousVersionId
    ? `Baseline established for ${timeline.currentPhaseLabel}.`
    : comparison.executionDelta !== 0
      ? `Execution ${comparison.executionDelta > 0 ? 'improved' : 'declined'} ${Math.abs(comparison.executionDelta)} points since the previous session.`
      : comparison.reportedGoalsDelta !== 0
        ? `${Math.abs(comparison.reportedGoalsDelta)} goal ${Math.abs(comparison.reportedGoalsDelta) === 1 ? 'result' : 'results'} ${comparison.reportedGoalsDelta > 0 ? 'reported' : 'removed'} since the previous session.`
        : comparison.completedAssignmentsDelta !== 0
          ? `${Math.abs(comparison.completedAssignmentsDelta)} ${Math.abs(comparison.completedAssignmentsDelta) === 1 ? 'assignment' : 'assignments'} ${comparison.completedAssignmentsDelta > 0 ? 'completed' : 'reopened'} since the previous session.`
          : 'No measurable movement since the previous session.';
  const overviewSubtitle = !comparison?.previousVersionId
    ? `As of ${today}, this is the first saved operating baseline: ${timeline.actualExecution}% execution and ${reportedGoals} of 15 goals reported.`
    : `As of ${today}, compared with the saved session from ${previousDate}, execution is ${timeline.actualExecution}% and ${reportedGoals} of 15 goals have current results. ${comparison.latestChangeSummary}`;

  return {
    source: 'deterministic',
    overviewTitle,
    overviewSubtitle,
    headline:
      status === 'ahead'
        ? 'Execution is ahead of the ideal operating path.'
        : status === 'on-track'
          ? 'Execution is aligned with the current strategy window.'
          : 'Execution needs an explicit recovery decision.',
    executiveSummary: `${timeline.actualExecution}% actual execution versus ${timeline.idealExecution}% ideal execution. ${reportedGoals} of 15 goals have a current measured result.`,
    status,
    timelineAssessment: `${current.label} is the current operating focus. Its execution is ${current.execution}% against an ideal ${current.expected}%.`,
    decisions: [
      missingGoalCount > 0
        ? `Require current results for the ${missingGoalCount} unreported goals before the next executive review.`
        : 'Confirm whether the measured results are strong enough to advance the active phase gate.',
      'Concentrate the next weekly priority on the largest negative phase variance.',
    ],
    risks: [
      ...(missingGoalCount > 0
        ? [{
            title: 'Incomplete performance evidence',
            owner: 'COO' as const,
            detail: `${missingGoalCount} goal results are not yet reported, limiting decision confidence.`,
          }]
        : []),
      ...(current.variance < -10
        ? [{
            title: 'Timeline variance',
            owner: 'CEO' as const,
            detail: `${current.label} execution is ${Math.abs(current.variance)} points behind its ideal timeline.`,
          }]
        : []),
    ],
    accountability: [
      {
        owner: 'CEO',
        commitment: 'Confirm the active phase priority and any tradeoff requiring an executive decision.',
        reason: 'The CEO owns pricing, phase priority, and final cross-functional decisions.',
      },
      {
        owner: 'CTO',
        commitment: 'Validate product evidence and close the highest-impact delivery blocker.',
        reason: 'Product reliability and delivery evidence determine whether execution is real.',
      },
      {
        owner: 'COO',
        commitment: 'Ensure every active goal and assignment has a current measure and owner.',
        reason: 'Operating discipline depends on complete reporting and follow-through.',
      },
    ],
    questions: [
      'Which current result is least supported by evidence?',
      'What single decision would remove the largest execution constraint this week?',
    ],
    confidence: reportedGoals >= 12 ? 'high' : reportedGoals >= 6 ? 'medium' : 'low',
  };
}

export function snapshotHash(snapshot: JasonAIProgressSnapshot) {
  return createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
}

export function summarizeChange(change: JasonAIProgressChange) {
  const fields = Object.keys(change.patch).join(', ');
  return `${change.scope === 'task' ? 'Assignment' : 'Goal'} ${change.entityId} updated: ${fields}.`;
}
