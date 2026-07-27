import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Pencil, Target, UsersRound, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import { projectPageShellClassName } from '../../../components/projectPageLayout';
import {
  getDefaultTaskReport,
  getTaskId,
  kpiIconMap,
  phases,
  type KpiType,
} from './JasonAIInternalPortal';
import { JasonAIInternalNavbar, jasonAIInternalRoutes } from './shared';
import {
  getGoalPerformance,
  getGoalReportConfig,
  ownerToneMap,
  useJasonAITracking,
} from './useJasonAITracking';

type SelectedTask = {
  phaseId: string;
  kpiId: KpiType;
  taskIndex: number;
};

export default function JasonAIKPITrackerPage() {
  const [searchParams] = useSearchParams();
  const requestedPhase = searchParams.get('phase');
  const requestedGoal = searchParams.get('goal') as KpiType | null;
  const [activePhaseId, setActivePhaseId] = useState(
    phases.some((phase) => phase.id === requestedPhase) ? requestedPhase! : phases[0].id,
  );
  const [selectedKpiId, setSelectedKpiId] = useState<KpiType>(
    requestedGoal && ['pricing', 'product', 'success'].includes(requestedGoal) ? requestedGoal : 'pricing',
  );
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const {
    taskReports,
    kpiReports,
    getKpiProgress,
    getPhaseProgress,
    updateKpiResult,
    updateTaskReport,
  } = useJasonAITracking();

  const activePhase = useMemo(
    () => phases.find((phase) => phase.id === activePhaseId) ?? phases[0],
    [activePhaseId],
  );
  const selectedKpi = activePhase.kpis.find((kpi) => kpi.id === selectedKpiId) ?? activePhase.kpis[0];
  const SelectedKpiIcon = kpiIconMap[selectedKpi.id];
  const selectedTone = ownerToneMap[selectedKpi.owner];
  const selectedResult = kpiReports[`${activePhase.id}:${selectedKpi.id}`]?.currentResult ?? '';
  const reportConfig = getGoalReportConfig(selectedKpi.label);
  const goalPerformance = getGoalPerformance(selectedKpi.label, selectedResult);

  const selectedTaskPhase = selectedTask ? phases.find((phase) => phase.id === selectedTask.phaseId) : null;
  const selectedTaskKpi = selectedTaskPhase?.kpis.find((kpi) => kpi.id === selectedTask?.kpiId);
  const selectedTaskText = selectedTaskKpi && selectedTask ? selectedTaskKpi.tasks[selectedTask.taskIndex] : null;
  const selectedTaskId = selectedTask
    ? getTaskId(selectedTask.phaseId, selectedTask.kpiId, selectedTask.taskIndex)
    : null;
  const selectedTaskReport =
    selectedTaskText && selectedTaskKpi && selectedTaskId
      ? taskReports[selectedTaskId] ??
        getDefaultTaskReport(selectedTaskText, selectedTaskKpi.owner, selectedTaskKpi.id)
      : null;

  const selectPhase = (phaseId: string) => {
    setActivePhaseId(phaseId);
  };

  return (
    <article className={projectPageShellClassName}>
      <JasonAIInternalNavbar />
      <Seo
        title="JasonAI KPI Tracker"
        description="Executive assignments, measurable goal reporting, tracked tasks, and supporting metrics for JasonAI."
        robots="noindex, nofollow"
      />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 md:pt-32 lg:px-8"
      >
        <header className="border-b border-neutral-100 pb-7">
          <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">Assignments and reporting</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-medium tracking-[-0.04em] text-black sm:text-5xl">KPI Tracker</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
                Each executive owns one goal per phase. Report the goal in its native unit, complete the work behind it, and maintain the evidence and metrics used at weekly reviews.
              </p>
            </div>
            <Link
              to={`${jasonAIInternalRoutes.performanceGoals}?phase=${activePhase.id}`}
              className="inline-flex min-h-11 items-center justify-between gap-5 rounded-full border border-neutral-300 px-5 text-xs font-semibold text-black transition hover:border-black"
            >
              View performance dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <nav aria-label="Strategy phases" className="-mx-4 overflow-x-auto px-4 py-5 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2 lg:grid lg:min-w-0 lg:grid-cols-5">
            {phases.map((phase) => {
              const active = phase.id === activePhase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => selectPhase(phase.id)}
                  aria-pressed={active}
                  className={`min-w-36 border px-4 py-3 text-left transition lg:min-w-0 ${
                    active
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <span className="font-mono text-[9px] text-neutral-400">{phase.number} · {phase.period}</span>
                  <span className="mt-1 block text-sm font-medium">{phase.label}</span>
                  <span className="mt-2 block text-[9px] text-neutral-400">{getPhaseProgress(phase.id)}% complete</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section className="mb-7">
          <div className="flex items-center gap-3">
            <div className="border border-neutral-200 p-2">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                Phase {activePhase.number} · {activePhase.period}
              </p>
              <h2 className="text-2xl font-medium tracking-tight text-black">{activePhase.label} assignments</h2>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(260px,.38fr)_minmax(0,1fr)]">
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:content-start lg:overflow-visible lg:px-0">
            {activePhase.kpis.map((kpi) => {
              const Icon = kpiIconMap[kpi.id];
              const tone = ownerToneMap[kpi.owner];
              const selected = kpi.id === selectedKpi.id;
              const progress = getKpiProgress(activePhase.id, kpi.id);
              return (
                <button
                  key={kpi.id}
                  type="button"
                  onClick={() => setSelectedKpiId(kpi.id)}
                  aria-pressed={selected}
                  className={`min-w-[82vw] border p-4 text-left transition sm:min-w-72 lg:min-w-0 ${
                    selected ? `${tone.soft} ${tone.line} border-l-4` : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${tone.soft}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">{kpi.owner}</span>
                        <span className="font-mono text-[9px] text-neutral-500">{progress}%</span>
                      </span>
                      <span className="mt-1 block text-sm font-medium leading-5 text-black">{kpi.label}</span>
                      <span className="mt-3 block h-1 overflow-hidden rounded-full bg-black/10">
                        <span className={`block h-full ${tone.fill}`} style={{ width: `${progress}%` }} />
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <motion.article
            key={`${activePhase.id}-${selectedKpi.id}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="border border-neutral-200 bg-white"
          >
            <div className={`border-l-4 p-5 sm:p-7 ${selectedTone.soft} ${selectedTone.line}`}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${selectedTone.soft}`}>
                    <SelectedKpiIcon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">{selectedKpi.id}</p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight text-black">{selectedKpi.label}</h3>
                </div>
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${selectedTone.soft}`}>
                  <UsersRound className="h-3 w-3" />
                  {selectedKpi.owner} accountable
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-100 p-5 sm:p-7">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
                <label>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">{reportConfig.label}</span>
                  <div className="mt-2 flex min-h-14 items-center border border-neutral-300 bg-white focus-within:border-neutral-700">
                    {reportConfig.prefix ? (
                      <span className="pl-4 text-lg font-medium text-neutral-500">{reportConfig.prefix}</span>
                    ) : null}
                    <input
                      type={reportConfig.inputMode === 'text' ? 'text' : 'number'}
                      inputMode={reportConfig.inputMode}
                      value={selectedResult}
                      onChange={(event) =>
                        updateKpiResult(activePhase.id, selectedKpi.id, event.target.value)
                      }
                      placeholder={reportConfig.placeholder}
                      className="min-w-0 flex-1 bg-transparent px-4 text-lg font-medium text-black outline-none"
                    />
                    {reportConfig.suffix ? (
                      <span className="pr-4 text-xs font-medium text-neutral-500">{reportConfig.suffix}</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[9px] text-neutral-400">Auto-saved and reflected on Performance Goals and Home.</p>
                </label>

                <div className="border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-neutral-400">Goal performance</p>
                      <p className="mt-2 font-mono text-2xl text-black">{goalPerformance}%</p>
                    </div>
                    <p className="font-mono text-[10px] text-neutral-500">
                      {getKpiProgress(activePhase.id, selectedKpi.id)}% execution
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                    <div className={`h-full ${selectedTone.fill}`} style={{ width: `${goalPerformance}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid border-t border-neutral-100 sm:grid-cols-2">
              <div className="border-b border-neutral-100 p-5 sm:border-b-0 sm:border-r sm:p-7">
                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Minimum gate</p>
                <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{selectedKpi.minimum}</p>
              </div>
              <div className="p-5 sm:p-7">
                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Target</p>
                <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{selectedKpi.target}</p>
              </div>
            </div>

            <div className="border-t border-neutral-100 bg-neutral-950 p-5 text-white sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-500">Assigned work</p>
                  <p className="mt-2 text-xs text-neutral-400">Check off a task or open it to report quantities, evidence, and tracked metrics.</p>
                </div>
                <span className="font-mono text-[10px] text-neutral-300">
                  {selectedKpi.tasks.filter((_, index) => taskReports[getTaskId(activePhase.id, selectedKpi.id, index)]?.completed).length}
                  /{selectedKpi.tasks.length} complete
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {selectedKpi.tasks.map((task, taskIndex) => {
                  const taskId = getTaskId(activePhase.id, selectedKpi.id, taskIndex);
                  const report =
                    taskReports[taskId] ?? getDefaultTaskReport(task, selectedKpi.owner, selectedKpi.id);
                  return (
                    <div
                      key={task}
                      className={`flex items-stretch border ${
                        report.completed ? 'border-white/25 bg-white/10' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`${report.completed ? 'Mark incomplete' : 'Mark complete'}: ${task}`}
                        aria-pressed={report.completed}
                        onClick={() =>
                          updateTaskReport(activePhase.id, selectedKpi.id, taskIndex, {
                            completed: !report.completed,
                          })
                        }
                        className="flex w-12 shrink-0 items-center justify-center border-r border-white/10"
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            report.completed ? 'border-white bg-white text-neutral-950' : 'border-neutral-600 text-transparent'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTask({ phaseId: activePhase.id, kpiId: selectedKpi.id, taskIndex })}
                        className="group flex min-h-24 flex-1 items-start justify-between gap-3 p-4 text-left"
                      >
                        <span>
                          <span className={`block text-xs leading-5 ${report.completed ? 'text-neutral-400 line-through' : 'text-neutral-200'}`}>
                            {task}
                          </span>
                          <span className="mt-2 block text-[9px] uppercase tracking-[0.14em] text-neutral-600">
                            {report.quantity || report.result ? 'Report added' : 'Open report'}
                          </span>
                        </span>
                        <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600 transition group-hover:text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.article>
        </section>
      </motion.main>

      <AnimatePresence>
        {selectedTask && selectedTaskPhase && selectedTaskKpi && selectedTaskText && selectedTaskReport ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end bg-black/55 sm:items-center sm:justify-center sm:p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-report-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2 }}
              className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-none sm:border sm:border-neutral-200"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-5 pb-4 pt-3 sm:p-7">
                <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-neutral-200 sm:hidden" />
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                      {selectedTaskKpi.owner} · Phase {selectedTaskPhase.number} assignment
                    </p>
                    <h2 id="task-report-title" className="mt-3 text-xl font-medium leading-7 tracking-tight text-black">
                      {selectedTaskText}
                    </h2>
                  </div>
                  <button
                    type="button"
                    aria-label="Close task report"
                    onClick={() => setSelectedTask(null)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-7">
                <button
                  type="button"
                  aria-pressed={selectedTaskReport.completed}
                  onClick={() =>
                    updateTaskReport(selectedTask.phaseId, selectedTask.kpiId, selectedTask.taskIndex, {
                      completed: !selectedTaskReport.completed,
                    })
                  }
                  className={`flex w-full items-center gap-3 border p-4 text-left ${
                    selectedTaskReport.completed
                      ? 'border-neutral-700 bg-neutral-900 text-white'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedTaskReport.completed ? 'border-white bg-white text-black' : 'border-neutral-300 text-transparent'}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium">
                    {selectedTaskReport.completed ? 'Task completed' : 'Mark task complete'}
                  </span>
                </button>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Reported quantity</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={selectedTaskReport.quantity}
                      onChange={(event) =>
                        updateTaskReport(selectedTask.phaseId, selectedTask.kpiId, selectedTask.taskIndex, {
                          quantity: event.target.value,
                        })
                      }
                      placeholder="e.g. 5"
                      className="mt-2 min-h-12 w-full border border-neutral-200 px-3 text-base text-neutral-900 outline-none focus:border-neutral-500"
                    />
                  </label>
                  <label>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Unit or measure</span>
                    <input
                      type="text"
                      value={selectedTaskReport.unit}
                      onChange={(event) =>
                        updateTaskReport(selectedTask.phaseId, selectedTask.kpiId, selectedTask.taskIndex, {
                          unit: event.target.value,
                        })
                      }
                      placeholder="e.g. pilots recruited"
                      className="mt-2 min-h-12 w-full border border-neutral-200 px-3 text-base text-neutral-900 outline-none focus:border-neutral-500"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Reportable result</span>
                  <textarea
                    value={selectedTaskReport.result}
                    onChange={(event) =>
                      updateTaskReport(selectedTask.phaseId, selectedTask.kpiId, selectedTask.taskIndex, {
                        result: event.target.value,
                      })
                    }
                    placeholder="Record the result, evidence, and decision."
                    rows={4}
                    className="mt-2 w-full resize-y border border-neutral-200 p-3 text-base leading-6 text-neutral-900 outline-none focus:border-neutral-500"
                  />
                </label>

                <label className="block">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Tracked metrics</span>
                  <textarea
                    value={selectedTaskReport.plan}
                    onChange={(event) =>
                      updateTaskReport(selectedTask.phaseId, selectedTask.kpiId, selectedTask.taskIndex, {
                        plan: event.target.value,
                      })
                    }
                    rows={6}
                    className="mt-2 w-full resize-y border border-neutral-200 bg-neutral-50 p-3 text-base leading-6 text-neutral-900 outline-none focus:border-neutral-500"
                  />
                </label>
              </div>

              <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-neutral-100 bg-white px-5 py-4 sm:px-7">
                <p className="text-[9px] text-neutral-500">Auto-saved across the portal.</p>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-6 text-xs font-semibold text-white"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Footer />
    </article>
  );
}
