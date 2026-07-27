import type {
  ExecutiveRole,
  KpiReport,
  TaskReport,
} from './JasonAIInternalPortal';

export type ProgressSnapshot = {
  taskReports: Record<string, TaskReport>;
  kpiReports: Record<string, KpiReport>;
  metricsVersion: number;
};

export type ProgressChange = {
  scope: 'task' | 'kpi';
  entityId: string;
  patch: Record<string, unknown>;
  before?: Record<string, unknown>;
  interaction: string;
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

export type ExecutiveAnalysis = {
  source: 'model' | 'deterministic';
  model?: string;
  overviewTitle?: string;
  overviewSubtitle?: string;
  headline: string;
  executiveSummary: string;
  status: 'ahead' | 'on-track' | 'at-risk' | 'behind';
  timelineAssessment: string;
  decisions: string[];
  risks: Array<{ title: string; owner: ExecutiveRole; detail: string }>;
  accountability: Array<{ owner: ExecutiveRole; commitment: string; reason: string }>;
  questions: string[];
  confidence: 'low' | 'medium' | 'high';
};

export type ProgressVersion = {
  id: number;
  created_at: string;
  actor_role: ExecutiveRole;
  change_type: string;
  entity_id: string;
  change_summary: string;
  timeline: TimelineAssessment;
  analysis: ExecutiveAnalysis;
  snapshot?: ProgressSnapshot;
};

type ProgressResponse = {
  ok: boolean;
  configured?: boolean;
  modelConfigured?: boolean;
  latest?: ProgressVersion | null;
  history?: ProgressVersion[];
  modelError?: string | null;
  error?: string;
};

async function parseResponse(response: Response): Promise<ProgressResponse> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('JasonAI progress API is unavailable in this local runtime.');
  }
  const payload = (await response.json()) as ProgressResponse;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Progress API returned ${response.status}.`);
  }
  return payload;
}

export async function fetchProgressState() {
  const response = await fetch('/api/jasonai-progress?action=state', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  return parseResponse(response);
}

export async function syncProgressChange(input: {
  actorRole: ExecutiveRole;
  snapshot: ProgressSnapshot;
  change: ProgressChange;
}) {
  const response = await fetch('/api/jasonai-progress?action=sync', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}
