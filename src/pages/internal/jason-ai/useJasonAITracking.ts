import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getDefaultTaskReport,
  getKpiId,
  getTaskId,
  normalizeTaskReports,
  phases,
  trackingMetricsVersion,
  trackingStorageKey,
  type ExecutiveRole,
  type KpiReport,
  type KpiType,
  type TaskReport,
} from './JasonAIInternalPortal';
import {
  fetchProgressState,
  syncProgressChange,
  type ExecutiveAnalysis,
  type ProgressChange,
  type ProgressVersion,
  type TimelineAssessment,
} from './jasonAIProgressApi';

type StoredTracking = {
  taskReports?: Record<string, TaskReport>;
  kpiReports?: Record<string, KpiReport>;
  metricsVersion?: number;
};

export type ProgressSyncStatus = 'local' | 'loading' | 'saved' | 'saving' | 'error';

const actorStorageKey = 'jasonai-executive-actor-role-v1';

export type GoalReportConfig = {
  label: string;
  inputMode: 'numeric' | 'decimal' | 'text';
  prefix?: string;
  suffix?: string;
  placeholder: string;
  minimumValue?: number;
  targetValue?: number;
  lowerIsBetter?: boolean;
};

const reportConfigs: Record<string, GoalReportConfig> = {
  'Customers willing to pay': {
    label: 'Customers committed to pay',
    inputMode: 'numeric',
    suffix: 'customers',
    placeholder: '0',
    minimumValue: 3,
    targetValue: 5,
  },
  'Useful-output rate': {
    label: 'Useful outputs',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 80,
    targetValue: 90,
  },
  'Time to first value': {
    label: 'Median time to first value',
    inputMode: 'decimal',
    suffix: 'minutes',
    placeholder: '0',
    minimumValue: 15,
    targetValue: 5,
    lowerIsBetter: true,
  },
  'Pilot-to-paid conversion': {
    label: 'Pilot-to-paid conversion',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 30,
    targetValue: 50,
  },
  'Four-week team retention': {
    label: 'Four-week retention',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 50,
    targetValue: 65,
  },
  'Verified hours saved': {
    label: 'Hours saved per team per week',
    inputMode: 'decimal',
    suffix: 'hours',
    placeholder: '0',
    minimumValue: 1,
    targetValue: 2,
  },
  'Average revenue per team': {
    label: 'Average monthly revenue per team',
    inputMode: 'decimal',
    prefix: '$',
    placeholder: '0',
    minimumValue: 40,
    targetValue: 75,
  },
  'Eight-week team retention': {
    label: 'Eight-week retention',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 60,
    targetValue: 75,
  },
  'Customer-confirmed ROI': {
    label: 'Customers confirming ROI',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 70,
    targetValue: 85,
  },
  'LTV:CAC': {
    label: 'Lifetime value to acquisition cost',
    inputMode: 'decimal',
    suffix: '×',
    placeholder: '0.0',
    minimumValue: 3,
    targetValue: 4,
  },
  'Weekly active teams': {
    label: 'Paying teams active weekly',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 80,
    targetValue: 90,
  },
  'Monthly logo churn': {
    label: 'Monthly logo churn',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 4,
    targetValue: 3,
    lowerIsBetter: true,
  },
  'Net revenue retention': {
    label: 'Net revenue retention',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 110,
    targetValue: 120,
  },
  'Multi-workflow adoption': {
    label: 'Customers using 2+ workflows',
    inputMode: 'decimal',
    suffix: '%',
    placeholder: '0',
    minimumValue: 50,
    targetValue: 70,
  },
  'Customer ROI score': {
    label: 'Average ROI score',
    inputMode: 'decimal',
    suffix: '/ 100',
    placeholder: '0',
    minimumValue: 85,
    targetValue: 90,
  },
};

export const ownerToneMap = {
  CEO: {
    soft: 'border-[#CDBFAE] bg-[#F4F0EA] text-[#5B4938]',
    line: 'border-[#6B5744]',
    fill: 'bg-[#6B5744]',
  },
  CTO: {
    soft: 'border-[#C1CBD1] bg-[#EDF0F2] text-[#465761]',
    line: 'border-[#4E5D67]',
    fill: 'bg-[#4E5D67]',
  },
  COO: {
    soft: 'border-[#C3CEC6] bg-[#EDF1EE] text-[#46574D]',
    line: 'border-[#526157]',
    fill: 'bg-[#526157]',
  },
} satisfies Record<ExecutiveRole, { soft: string; line: string; fill: string }>;

export const getGoalReportConfig = (goalName: string): GoalReportConfig =>
  reportConfigs[goalName] ?? {
    label: 'Current reported result',
    inputMode: 'text',
    placeholder: 'Enter the latest measured result',
  };

export const getGoalPerformance = (goalName: string, rawValue: string) => {
  const config = getGoalReportConfig(goalName);
  const value = Number.parseFloat(rawValue.replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(value) || config.targetValue === undefined) return 0;

  if (config.lowerIsBetter) {
    if (value <= config.targetValue) return 100;
    if (config.minimumValue === undefined || value >= config.minimumValue) return value === config.minimumValue ? 60 : 0;
    return Math.round(60 + ((config.minimumValue - value) / (config.minimumValue - config.targetValue)) * 40);
  }

  return Math.min(100, Math.max(0, Math.round((value / config.targetValue) * 100)));
};

const readTracking = (): Required<StoredTracking> => {
  try {
    const stored = window.localStorage.getItem(trackingStorageKey);
    if (!stored) return { taskReports: {}, kpiReports: {}, metricsVersion: trackingMetricsVersion };
    const parsed = JSON.parse(stored) as StoredTracking;
    return {
      taskReports: normalizeTaskReports(
        parsed.taskReports ?? {},
        parsed.metricsVersion !== trackingMetricsVersion,
      ),
      kpiReports: parsed.kpiReports ?? {},
      metricsVersion: trackingMetricsVersion,
    };
  } catch {
    return { taskReports: {}, kpiReports: {}, metricsVersion: trackingMetricsVersion };
  }
};

export function useJasonAITracking() {
  const [taskReports, setTaskReports] = useState<Record<string, TaskReport>>({});
  const [kpiReports, setKpiReports] = useState<Record<string, KpiReport>>({});
  const [ready, setReady] = useState(false);
  const [actorRole, setActorRoleState] = useState<ExecutiveRole>(() => {
    if (typeof window === 'undefined') return 'CEO';
    const stored = window.localStorage.getItem(actorStorageKey);
    return stored === 'COO' || stored === 'CTO' ? stored : 'CEO';
  });
  const [syncStatus, setSyncStatus] = useState<ProgressSyncStatus>('loading');
  const [backendConfigured, setBackendConfigured] = useState(false);
  const [modelConfigured, setModelConfigured] = useState(false);
  const [version, setVersion] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<ExecutiveAnalysis | null>(null);
  const [timeline, setTimeline] = useState<TimelineAssessment | null>(null);
  const [history, setHistory] = useState<ProgressVersion[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const pendingChangeRef = useRef<ProgressChange | null>(null);
  const syncTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = readTracking();
    setTaskReports(stored.taskReports);
    setKpiReports(stored.kpiReports);
    setReady(true);

    void fetchProgressState()
      .then((response) => {
        setBackendConfigured(Boolean(response.configured));
        setModelConfigured(Boolean(response.modelConfigured));
        if (!response.configured) {
          setSyncStatus('local');
          return;
        }

        const latest = response.latest ?? null;
        if (latest?.snapshot) {
          setTaskReports(normalizeTaskReports(latest.snapshot.taskReports ?? {}));
          setKpiReports(latest.snapshot.kpiReports ?? {});
        }
        setVersion(latest?.id ?? null);
        setAnalysis(latest?.analysis ?? null);
        setTimeline(latest?.timeline ?? null);
        setHistory(response.history ?? []);
        setLastSyncedAt(latest?.created_at ?? null);
        setSyncStatus('saved');
      })
      .catch(() => {
        setBackendConfigured(false);
        setSyncStatus('local');
      });
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      trackingStorageKey,
      JSON.stringify({ taskReports, kpiReports, metricsVersion: trackingMetricsVersion }),
    );

    const pendingChange = pendingChangeRef.current;
    if (!pendingChange) return;
    if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    setSyncStatus('saving');
    setSyncError(null);

    syncTimerRef.current = window.setTimeout(() => {
      const change = pendingChangeRef.current;
      if (!change) return;
      pendingChangeRef.current = null;

      void syncProgressChange({
        actorRole,
        snapshot: { taskReports, kpiReports, metricsVersion: trackingMetricsVersion },
        change,
      })
        .then((response) => {
          const latest = response.latest ?? null;
          setBackendConfigured(Boolean(response.configured));
          setModelConfigured(Boolean(response.modelConfigured) || latest?.analysis?.source === 'model' || modelConfigured);
          setVersion(latest?.id ?? null);
          setAnalysis(latest?.analysis ?? null);
          setTimeline(latest?.timeline ?? null);
          setHistory(response.history ?? []);
          setLastSyncedAt(latest?.created_at ?? new Date().toISOString());
          setSyncStatus('saved');
          setSyncError(response.modelError ?? null);
        })
        .catch((error) => {
          setSyncStatus('error');
          setSyncError(error instanceof Error ? error.message : 'Unable to sync progress.');
        });
    }, 900);

    return () => {
      if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
    };
  }, [actorRole, kpiReports, modelConfigured, ready, taskReports]);

  const queueProgressChange = useCallback((nextChange: ProgressChange) => {
    const pending = pendingChangeRef.current;
    if (
      pending &&
      pending.scope === nextChange.scope &&
      pending.entityId === nextChange.entityId
    ) {
      pendingChangeRef.current = {
        ...nextChange,
        patch: { ...pending.patch, ...nextChange.patch },
        before: { ...nextChange.before, ...pending.before },
      };
      return;
    }
    pendingChangeRef.current = nextChange;
  }, []);

  const setActorRole = useCallback((role: ExecutiveRole) => {
    setActorRoleState(role);
    window.localStorage.setItem(actorStorageKey, role);
  }, []);

  const getKpiProgress = useCallback(
    (phaseId: string, kpiId: KpiType) => {
      const phase = phases.find((item) => item.id === phaseId);
      const kpi = phase?.kpis.find((item) => item.id === kpiId);
      if (!kpi) return 0;
      const completed = kpi.tasks.filter(
        (_, index) => taskReports[getTaskId(phaseId, kpiId, index)]?.completed,
      ).length;
      return Math.round((completed / kpi.tasks.length) * 100);
    },
    [taskReports],
  );

  const getPhaseProgress = useCallback(
    (phaseId: string) => {
      const phase = phases.find((item) => item.id === phaseId);
      if (!phase) return 0;
      const values = phase.kpis.map((kpi) => getKpiProgress(phaseId, kpi.id));
      return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    },
    [getKpiProgress],
  );

  const updateKpiResult = useCallback(
    (phaseId: string, kpiId: KpiType, currentResult: string) => {
      const entityId = getKpiId(phaseId, kpiId);
      queueProgressChange({
        scope: 'kpi',
        entityId,
        before: { currentResult: kpiReports[entityId]?.currentResult ?? '' },
        patch: { currentResult },
        interaction: 'goal result edited',
      });
      setKpiReports((current) => ({
        ...current,
        [entityId]: { currentResult },
      }));
    },
    [kpiReports, queueProgressChange],
  );

  const updateTaskReport = useCallback(
    (
      phaseId: string,
      kpiId: KpiType,
      taskIndex: number,
      patch: Partial<TaskReport>,
    ) => {
      const phase = phases.find((item) => item.id === phaseId);
      const kpi = phase?.kpis.find((item) => item.id === kpiId);
      const task = kpi?.tasks[taskIndex];
      if (!kpi || !task) return;
      const taskId = getTaskId(phaseId, kpiId, taskIndex);
      const currentReport =
        taskReports[taskId] ?? getDefaultTaskReport(task, kpi.owner, kpi.id);
      queueProgressChange({
        scope: 'task',
        entityId: taskId,
        before: Object.fromEntries(Object.keys(patch).map((field) => [field, currentReport[field as keyof TaskReport]])),
        patch,
        interaction: patch.completed !== undefined ? 'assignment completion toggled' : 'assignment report edited',
      });
      setTaskReports((current) => ({
        ...current,
        [taskId]: {
          ...getDefaultTaskReport(task, kpi.owner, kpi.id),
          ...current[taskId],
          ...patch,
        },
      }));
    },
    [queueProgressChange, taskReports],
  );

  const summary = useMemo(() => {
    const allTasks = phases.flatMap((phase) =>
      phase.kpis.flatMap((kpi) =>
        kpi.tasks.map((_, index) => taskReports[getTaskId(phase.id, kpi.id, index)]),
      ),
    );
    const completedTasks = allTasks.filter((report) => report?.completed).length;
    const totalTasks = allTasks.length;
    const reportedGoals = phases.reduce(
      (count, phase) =>
        count +
        phase.kpis.filter((kpi) => kpiReports[getKpiId(phase.id, kpi.id)]?.currentResult?.trim()).length,
      0,
    );
    return {
      completedTasks,
      totalTasks,
      execution: Math.round((completedTasks / totalTasks) * 100),
      reportedGoals,
      totalGoals: phases.length * 3,
    };
  }, [kpiReports, taskReports]);

  return {
    ready,
    actorRole,
    setActorRole,
    taskReports,
    kpiReports,
    summary,
    syncStatus,
    syncError,
    backendConfigured,
    modelConfigured,
    version,
    analysis,
    timeline,
    history,
    lastSyncedAt,
    getKpiProgress,
    getPhaseProgress,
    updateKpiResult,
    updateTaskReport,
  };
}
