import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDown,
  Check,
  ChevronDown,
  CircleDollarSign,
  Download,
  PackageCheck,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import type { ClientNavAction } from '../../../components/ClientNavbar';
import {
  InteractiveJCurve,
  getDefaultTaskReport,
  getKpiId,
  getTaskId,
  kpiToneMap,
  phases,
  trackingStorageKey,
  type ExecutiveRole,
  type Kpi,
  type KpiReport,
  type KpiType,
  type TaskReport,
} from './JasonAIInternalPortal';
import { JasonAIInternalNavbar, jasonAIInternalRoutes } from './shared';

const kpiIcons = {
  pricing: CircleDollarSign,
  product: PackageCheck,
  success: TrendingUp,
} satisfies Record<KpiType, typeof Target>;

const sectionLinks = [
  { id: 'strategy-overview', number: '01', label: 'Strategy Overview' },
  ...phases.map((phase, index) => ({
    id: `phase-${phase.id}`,
    number: String(index + 2).padStart(2, '0'),
    label: `Phase ${phase.number} · ${phase.label}`,
  })),
];

const strategyNavItems: ClientNavAction[] = [
  ...sectionLinks.map((section) => ({
    label: section.label,
    to: `${jasonAIInternalRoutes.executiveStrategy}#${section.id}`,
  })),
  {
    label: 'Download PDF',
    type: 'cta',
    href: '/documents/jasonai-executive-strategy.pdf',
    download: 'JasonAI-Executive-Strategy.pdf',
  },
];

function getCompletedTaskCount(
  phaseId: string,
  kpi: Kpi,
  taskReports: Record<string, TaskReport>,
) {
  return kpi.tasks.filter(
    (_, taskIndex) => taskReports[getTaskId(phaseId, kpi.id, taskIndex)]?.completed,
  ).length;
}

export default function JasonAIExecutiveStrategyDocumentPage() {
  const [taskReports, setTaskReports] = useState<Record<string, TaskReport>>({});
  const [kpiReports, setKpiReports] = useState<Record<string, KpiReport>>({});
  const [trackingReady, setTrackingReady] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState(sectionLinks[0].id);

  useEffect(() => {
    try {
      const storedTracking = window.localStorage.getItem(trackingStorageKey);
      if (storedTracking) {
        const parsedTracking = JSON.parse(storedTracking) as {
          taskReports?: Record<string, TaskReport>;
          kpiReports?: Record<string, KpiReport>;
        };
        setTaskReports(parsedTracking.taskReports ?? {});
        setKpiReports(parsedTracking.kpiReports ?? {});
      }
    } catch {
      // Start with a clean document when local tracking data is unavailable.
    }
    setTrackingReady(true);
  }, []);

  useEffect(() => {
    if (!trackingReady) return;
    try {
      window.localStorage.setItem(trackingStorageKey, JSON.stringify({ taskReports, kpiReports }));
    } catch {
      // The document remains usable when browser storage is unavailable.
    }
  }, [kpiReports, taskReports, trackingReady]);

  useEffect(() => {
    const sections = sectionLinks
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry) setActiveSectionId(visibleEntry.target.id);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0.05, 0.2, 0.45] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const getKpiProgress = (phaseId: string, kpiId: KpiType) => {
    const phase = phases.find((item) => item.id === phaseId);
    const kpi = phase?.kpis.find((item) => item.id === kpiId);
    if (!kpi) return 0;
    return Math.round((getCompletedTaskCount(phaseId, kpi, taskReports) / kpi.tasks.length) * 100);
  };

  const getPhaseProgress = (phaseId: string) => {
    const phase = phases.find((item) => item.id === phaseId);
    if (!phase) return 0;
    const totalTasks = phase.kpis.reduce((total, kpi) => total + kpi.tasks.length, 0);
    const completedTasks = phase.kpis.reduce(
      (total, kpi) => total + getCompletedTaskCount(phaseId, kpi, taskReports),
      0,
    );
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const overallProgress = useMemo(() => {
    const totalTasks = phases.reduce(
      (total, phase) => total + phase.kpis.reduce((phaseTotal, kpi) => phaseTotal + kpi.tasks.length, 0),
      0,
    );
    const completedTasks = phases.reduce(
      (total, phase) =>
        total +
        phase.kpis.reduce(
          (phaseTotal, kpi) => phaseTotal + getCompletedTaskCount(phase.id, kpi, taskReports),
          0,
        ),
      0,
    );
    return {
      completedTasks,
      totalTasks,
      percentage: Math.round((completedTasks / totalTasks) * 100),
    };
  }, [taskReports]);

  const activeCurvePhase =
    phases.find((phase) => activeSectionId === `phase-${phase.id}`) ?? phases[0];

  const updateTaskReport = (
    taskId: string,
    task: string,
    owner: ExecutiveRole,
    patch: Partial<TaskReport>,
  ) => {
    setTaskReports((current) => ({
      ...current,
      [taskId]: {
        ...getDefaultTaskReport(task, owner),
        ...current[taskId],
        ...patch,
      },
    }));
  };

  const scrollToPhase = (phaseId: string) => {
    document.getElementById(`phase-${phaseId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className="min-h-screen bg-white text-neutral-950">
      <JasonAIInternalNavbar navItems={strategyNavItems} />
      <Seo
        title="JasonAI Executive Strategy Document"
        description="Interactive 24-month JasonAI executive strategy organized by phase, KPI, measurable gate, target, and accountable task."
        robots="noindex, nofollow"
      />

      <header className="border-b border-neutral-200 bg-neutral-50 px-4 pb-10 pt-28 sm:px-6 md:pb-14 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                JasonAI · Interactive Executive Strategy
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                A five-phase operating document built to be completed.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">
                Read the strategy in sequence, report every KPI, and complete each accountable task as JasonAI moves from first customer value to platform expansion.
              </p>
            </div>
            <div className="border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">Overall execution</p>
                  <p className="mt-3 text-3xl font-medium">{overallProgress.percentage}%</p>
                </div>
                <p className="font-mono text-[10px] text-emerald-300">
                  {overallProgress.completedTasks}/{overallProgress.totalTasks} tasks
                </p>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-[width]"
                  style={{ width: `${overallProgress.percentage}%` }}
                />
              </div>
              <a
                href="#strategy-overview"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-white"
              >
                Begin with the overview
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto py-10" aria-label="Executive strategy sections">
            <p className="mb-4 text-[9px] font-mono uppercase tracking-[0.22em] text-neutral-400">Document sections</p>
            <div className="border-l border-neutral-200">
              {sectionLinks.map((section, sectionIndex) => {
                const active = activeSectionId === section.id;
                const phase = sectionIndex > 0 ? phases[sectionIndex - 1] : null;
                return (
                  <div key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`flex items-start gap-3 border-l-2 py-2.5 pl-4 text-xs leading-5 transition ${
                        active
                          ? '-ml-px border-neutral-950 font-semibold text-black'
                          : '-ml-px border-transparent text-neutral-500 hover:text-black'
                      }`}
                    >
                      <span className="font-mono text-[9px] text-neutral-400">{section.number}</span>
                      <span>{section.label}</span>
                    </a>
                    {phase ? (
                      <div className="mb-2 ml-9 grid gap-1">
                        {phase.kpis.map((kpi) => (
                          <a
                            key={kpi.id}
                            href={`#${phase.id}-${kpi.id}`}
                            className="py-1 text-[10px] uppercase tracking-[0.14em] text-neutral-400 transition hover:text-black"
                          >
                            {kpi.id}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <a
              href="/documents/jasonai-executive-strategy.pdf"
              download="JasonAI-Executive-Strategy.pdf"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 transition hover:text-black"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
          </nav>
        </aside>

        <main className="min-w-0">
          <section
            id="strategy-overview"
            data-strategy-section
            className="scroll-mt-24 border-b border-neutral-200 py-12 md:py-16"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                  Section 01 · Five-phase overview
                </p>
                <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">The strategy at a glance.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-neutral-500">
                Each phase must clear measurable pricing, product, and customer-success gates before the next phase becomes the operating priority.
              </p>
            </div>

            <div className="mt-8 border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-7">
              <InteractiveJCurve
                activePhase={activeCurvePhase}
                onSelect={scrollToPhase}
                getPhaseProgress={getPhaseProgress}
              />
            </div>

            <div className="mt-4 divide-y divide-neutral-200 border border-neutral-200">
              {phases.map((phase) => {
                const phaseProgress = getPhaseProgress(phase.id);
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => scrollToPhase(phase.id)}
                    className="group grid w-full gap-3 bg-white p-4 text-left transition hover:bg-neutral-50 sm:grid-cols-[48px_minmax(0,1fr)_150px] sm:items-center sm:p-5"
                  >
                    <span className="font-mono text-xs text-emerald-700">{phase.number}</span>
                    <span>
                      <span className="block text-base font-medium text-black">{phase.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-neutral-500">{phase.objective}</span>
                    </span>
                    <span>
                      <span className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                        <span>{phase.period}</span>
                        <span>{phaseProgress}%</span>
                      </span>
                      <span className="mt-2 block h-1 overflow-hidden rounded-full bg-neutral-100">
                        <span
                          className="block h-full rounded-full bg-emerald-400 transition-[width]"
                          style={{ width: `${phaseProgress}%` }}
                        />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {phases.map((phase, phaseIndex) => {
            const phaseProgress = getPhaseProgress(phase.id);
            return (
              <section
                key={phase.id}
                id={`phase-${phase.id}`}
                data-strategy-section
                className="scroll-mt-24 border-b border-neutral-200 py-12 md:py-16"
              >
                <div className="grid gap-6 border-b border-neutral-200 pb-8 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-end">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">
                      Section {String(phaseIndex + 2).padStart(2, '0')} · Phase {phase.number} · {phase.period}
                    </p>
                    <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">{phase.label}</h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">{phase.objective}</p>
                  </div>
                  <div className="border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-end justify-between">
                      <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">Phase execution</p>
                      <p className="font-mono text-sm text-neutral-800">{phaseProgress}%</p>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-[width]"
                        style={{ width: `${phaseProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-neutral-200">
                  {phase.kpis.map((kpi) => {
                    const KpiIcon = kpiIcons[kpi.id];
                    const kpiProgress = getKpiProgress(phase.id, kpi.id);
                    const completedTasks = getCompletedTaskCount(phase.id, kpi, taskReports);
                    const kpiReportId = getKpiId(phase.id, kpi.id);
                    return (
                      <article
                        key={kpi.id}
                        id={`${phase.id}-${kpi.id}`}
                        className="scroll-mt-24 py-10"
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-4">
                            <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${kpiToneMap[kpi.id]}`}>
                              <KpiIcon className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                                {kpi.id} KPI
                              </p>
                              <h3 className="mt-2 text-2xl font-medium tracking-tight">{kpi.label}</h3>
                              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-semibold text-neutral-700">
                                <UsersRound className="h-3 w-3" />
                                Owner · {kpi.owner}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-40">
                            <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                              <span>{completedTasks}/{kpi.tasks.length} tasks</span>
                              <span>{kpiProgress}%</span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                              <div
                                className="h-full rounded-full bg-emerald-400 transition-[width]"
                                style={{ width: `${kpiProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-7">
                          <label className="block">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Current reported metric</span>
                            <input
                              type="text"
                              value={kpiReports[kpiReportId]?.currentResult ?? ''}
                              onChange={(event) =>
                                setKpiReports((current) => ({
                                  ...current,
                                  [kpiReportId]: { currentResult: event.target.value },
                                }))
                              }
                              placeholder="Enter the latest measured result"
                              className="mt-2 min-h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-neutral-500"
                            />
                          </label>
                          <p className="mt-2 text-[9px] text-neutral-400">Auto-saved in this browser and shared with the dashboard.</p>
                        </div>

                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                          <div className="border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Minimum gate</p>
                            <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{kpi.minimum}</p>
                          </div>
                          <div className="border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-700">Goal</p>
                            <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{kpi.target}</p>
                          </div>
                        </div>

                        <div className="mt-7">
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">Execution tasks</p>
                              <p className="mt-2 text-xs leading-5 text-neutral-500">Complete a task or open it to report the result and revise its plan.</p>
                            </div>
                          </div>

                          <div className="mt-4 divide-y divide-neutral-200 border border-neutral-200">
                            {kpi.tasks.map((task, taskIndex) => {
                              const taskId = getTaskId(phase.id, kpi.id, taskIndex);
                              const report = taskReports[taskId] ?? getDefaultTaskReport(task, kpi.owner);
                              const expanded = expandedTaskId === taskId;
                              return (
                                <div key={taskId} className={report.completed ? 'bg-emerald-50/40' : 'bg-white'}>
                                  <div className="flex min-h-16 items-stretch">
                                    <button
                                      type="button"
                                      aria-label={`${report.completed ? 'Mark incomplete' : 'Mark complete'}: ${task}`}
                                      aria-pressed={report.completed}
                                      onClick={() =>
                                        updateTaskReport(taskId, task, kpi.owner, { completed: !report.completed })
                                      }
                                      className="flex w-12 shrink-0 items-center justify-center border-r border-neutral-200"
                                    >
                                      <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                          report.completed
                                            ? 'border-emerald-400 bg-emerald-400 text-white'
                                            : 'border-neutral-300 text-transparent'
                                        }`}
                                      >
                                        <Check className="h-3 w-3" />
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      aria-expanded={expanded}
                                      onClick={() => setExpandedTaskId(expanded ? null : taskId)}
                                      className="flex flex-1 items-center justify-between gap-4 p-4 text-left"
                                    >
                                      <span>
                                        <span className={`block text-sm leading-6 ${report.completed ? 'text-neutral-500 line-through' : 'text-neutral-800'}`}>
                                          {task}
                                        </span>
                                        {report.quantity || report.result ? (
                                          <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-emerald-700">
                                            {report.quantity ? `${report.quantity}${report.unit ? ` ${report.unit}` : ''}` : 'Result reported'}
                                          </span>
                                        ) : null}
                                      </span>
                                      <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                                    </button>
                                  </div>

                                  <AnimatePresence initial={false}>
                                    {expanded ? (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="border-t border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                                          <div className="grid gap-4 sm:grid-cols-2">
                                            <label>
                                              <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">Reported quantity</span>
                                              <input
                                                type="number"
                                                inputMode="decimal"
                                                value={report.quantity}
                                                onChange={(event) =>
                                                  updateTaskReport(taskId, task, kpi.owner, { quantity: event.target.value })
                                                }
                                                placeholder="e.g. 5"
                                                className="mt-2 min-h-11 w-full border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-500"
                                              />
                                            </label>
                                            <label>
                                              <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">Unit or measure</span>
                                              <input
                                                type="text"
                                                value={report.unit}
                                                onChange={(event) =>
                                                  updateTaskReport(taskId, task, kpi.owner, { unit: event.target.value })
                                                }
                                                placeholder="pilots, interviews, %, hours"
                                                className="mt-2 min-h-11 w-full border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-500"
                                              />
                                            </label>
                                          </div>
                                          <label className="mt-4 block">
                                            <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">Reported result</span>
                                            <textarea
                                              value={report.result}
                                              onChange={(event) =>
                                                updateTaskReport(taskId, task, kpi.owner, { result: event.target.value })
                                              }
                                              rows={3}
                                              placeholder="Record what happened, the evidence, and any decision."
                                              className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-neutral-500"
                                            />
                                          </label>
                                          <label className="mt-4 block">
                                            <span className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">Suggested plan</span>
                                            <textarea
                                              value={report.plan}
                                              onChange={(event) =>
                                                updateTaskReport(taskId, task, kpi.owner, { plan: event.target.value })
                                              }
                                              rows={5}
                                              className="mt-2 w-full resize-y border border-neutral-200 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-neutral-500"
                                            />
                                          </label>
                                          <p className="mt-3 text-[9px] text-neutral-400">Changes auto-save in this browser.</p>
                                        </div>
                                      </motion.div>
                                    ) : null}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      <Footer />
    </article>
  );
}
