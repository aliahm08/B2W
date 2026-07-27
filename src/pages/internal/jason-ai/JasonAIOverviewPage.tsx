import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, ClipboardCheck, FileText, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import { projectPageHeaderClassName, projectPageShellClassName } from '../../../components/projectPageLayout';
import { InteractiveJCurve, phases } from './JasonAIInternalPortal';
import { JasonAIInternalNavbar, jasonAIInternalRoutes } from './shared';
import { getGoalPerformance, useJasonAITracking } from './useJasonAITracking';

const overviewCards = [
  {
    eyebrow: 'Performance Goals',
    title: 'See what each phase must prove.',
    description:
      'Review the three phase goals, their minimum gates, targets, accountable executive, and latest measured performance.',
    to: jasonAIInternalRoutes.performanceGoals,
    Icon: BarChart3,
  },
  {
    eyebrow: 'KPI Tracker',
    title: 'Run the work and report results.',
    description:
      'Open owner assignments, complete tasks, enter the right measurement for each goal, and maintain supporting metrics.',
    to: jasonAIInternalRoutes.kpiTracker,
    Icon: ClipboardCheck,
  },
  {
    eyebrow: 'Executive Report',
    title: 'Read the strategy as a document.',
    description:
      'Move phase by phase through the full executive strategy, meeting cadence, ownership model, and current operating record.',
    to: jasonAIInternalRoutes.executiveStrategy,
    Icon: FileText,
  },
];

export default function JasonAIOverviewPage() {
  const [activePhaseId, setActivePhaseId] = useState(phases[0].id);
  const {
    summary,
    kpiReports,
    getPhaseProgress,
    analysis,
    timeline,
    history,
    syncStatus,
    version,
    modelConfigured,
    lastSyncedAt,
  } = useJasonAITracking();
  const activePhase = phases.find((phase) => phase.id === activePhaseId) ?? phases[0];
  const phaseDashboard = phases.map((phase) => {
    const reportedGoals = phase.kpis.filter(
      (kpi) => kpiReports[`${phase.id}:${kpi.id}`]?.currentResult?.trim(),
    ).length;
    const performanceValues = phase.kpis.map((kpi) =>
      getGoalPerformance(kpi.label, kpiReports[`${phase.id}:${kpi.id}`]?.currentResult ?? ''),
    );
    return {
      ...phase,
      execution: getPhaseProgress(phase.id),
      performance: Math.round(
        performanceValues.reduce((total, performance) => total + performance, 0) / performanceValues.length,
      ),
      reportedGoals,
    };
  });
  const strategyStart = new Date('2026-08-01T00:00:00');
  const daysUntilStart = Math.max(0, Math.ceil((strategyStart.getTime() - Date.now()) / 86_400_000));
  const operatingPosition =
    daysUntilStart > 0
      ? `Pre-start · ${daysUntilStart} ${daysUntilStart === 1 ? 'day' : 'days'} to Foundation`
      : 'Foundation · active operating phase';
  const chronologicalHistory = [...history].reverse().slice(-12);
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  const overviewTitle =
    analysis?.overviewTitle ?? 'Executive performance across the five-phase strategy.';
  const overviewSubtitle = analysis?.overviewSubtitle ?? operatingPosition;

  return (
    <article className={projectPageShellClassName}>
      <JasonAIInternalNavbar />
      <Seo
        title="JasonAI Executive Overview"
        description="A read-only executive overview of JasonAI strategy, performance goals, assignments, and reporting."
        robots="noindex, nofollow"
      />

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className={projectPageHeaderClassName}>
          <div className="flex flex-col gap-5 border-b border-neutral-100 pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                JasonAI Executive Strategy · Today {todayLabel}
              </p>
              <h1 className="mt-4 max-w-4xl text-[2.65rem] font-medium leading-[.96] tracking-[-0.045em] text-black sm:text-6xl">
                {overviewTitle}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-neutral-600">{overviewSubtitle}</p>
            </div>
            <Link
              to={jasonAIInternalRoutes.performanceGoals}
              className="group inline-flex min-h-12 items-center justify-between gap-8 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Open Performance Goals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 border border-neutral-200 bg-white sm:grid-cols-4">
            {[
              ['Overall execution', `${summary.execution}%`],
              ['Assignments complete', `${summary.completedTasks} / ${summary.totalTasks}`],
              ['Goals reported', `${summary.reportedGoals} / ${summary.totalGoals}`],
              ['Phases reporting', `${phaseDashboard.filter((phase) => phase.reportedGoals > 0).length} / 5`],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`p-4 sm:p-5 ${
                  index % 2 ? 'border-l border-neutral-200' : ''
                } ${index > 1 ? 'border-t border-neutral-200 sm:border-t-0' : ''} ${
                  index > 0 ? 'sm:border-l sm:border-neutral-200' : ''
                }`}
              >
                <p className="font-mono text-2xl text-black">{value}</p>
                <p className="mt-2 text-[8px] uppercase tracking-[0.16em] text-neutral-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {phaseDashboard.map((phase) => (
              <Link
                key={phase.id}
                to={`${jasonAIInternalRoutes.performanceGoals}?phase=${phase.id}`}
                className="group border border-neutral-200 bg-white p-4 transition hover:border-neutral-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] text-neutral-400">{phase.number} · {phase.period}</p>
                    <h2 className="mt-2 text-base font-medium text-black">{phase.label}</h2>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-black" />
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-[8px] uppercase tracking-[0.14em] text-neutral-400">
                    <span>Performance</span>
                    <span>{phase.performance}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full bg-neutral-900" style={{ width: `${phase.performance}%` }} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[8px] uppercase tracking-[0.14em] text-neutral-400">
                    <span>Execution</span>
                    <span>{phase.execution}%</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full bg-neutral-400" style={{ width: `${phase.execution}%` }} />
                  </div>
                </div>
                <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-400">
                  {phase.reportedGoals} / 3 goals reported
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
            <section className="flex flex-col bg-neutral-950 p-5 text-white sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                    Executive project-manager review
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-neutral-500">
                    {modelConfigured ? 'OSS thinking model connected' : 'Deterministic review until model is connected'}
                  </p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                  {analysis?.status ?? (syncStatus === 'local' ? 'Local only' : 'Awaiting version')}
                </span>
              </div>

              {analysis ? (
                <>
                  <h2 className="mt-6 text-2xl font-medium leading-tight tracking-tight">{analysis.headline}</h2>
                  <p className="mt-4 text-sm leading-6 text-neutral-300">{analysis.executiveSummary}</p>
                  <p className="mt-4 border-l border-white/20 pl-4 text-xs leading-5 text-neutral-400">
                    {analysis.timelineAssessment}
                  </p>
                  {analysis.decisions.length ? (
                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-500">Decisions to make</p>
                      <div className="mt-3 space-y-3">
                        {analysis.decisions.slice(0, 3).map((decision, index) => (
                          <div key={decision} className="flex gap-3 text-xs leading-5 text-neutral-200">
                            <span className="font-mono text-[9px] text-neutral-500">{String(index + 1).padStart(2, '0')}</span>
                            <span>{decision}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {analysis.accountability.length ? (
                    <div className="mt-6 grid gap-2 border-t border-white/10 pt-5 sm:grid-cols-3">
                      {analysis.accountability.map((item) => (
                        <div key={item.owner} className="border border-white/10 p-3">
                          <p className="font-mono text-[9px] text-neutral-500">{item.owner}</p>
                          <p className="mt-2 text-[10px] leading-4 text-neutral-300">{item.commitment}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="flex flex-1 flex-col justify-center py-10">
                  <h2 className="text-2xl font-medium tracking-tight">Create the first accountable version.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-400">
                    Update a goal or assignment in KPI Tracker. The backend will record who changed what, compare the resulting snapshot with the ideal timeline, and return an executive review here.
                  </p>
                  <Link
                    to={jasonAIInternalRoutes.kpiTracker}
                    className="group mt-7 inline-flex w-fit items-center gap-4 text-sm font-semibold text-white"
                  >
                    Open KPI Tracker
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              )}

              <p className="mt-auto border-t border-white/10 pt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-600">
                {version ? `Version ${version}` : 'No backend version yet'}
                {lastSyncedAt ? ` · ${new Date(lastSyncedAt).toLocaleString()}` : ''}
              </p>
            </section>

            <section className="border border-neutral-200 bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Actual vs ideal timeline</p>
                  <h2 className="mt-3 text-xl font-medium tracking-tight text-black">
                    {timeline ? `${timeline.actualExecution}% actual · ${timeline.idealExecution}% ideal` : 'Waiting for the first saved version'}
                  </h2>
                </div>
                {timeline ? (
                  <span className="font-mono text-sm text-neutral-500">
                    {timeline.portfolioVariance > 0 ? '+' : ''}{timeline.portfolioVariance} pts
                  </span>
                ) : null}
              </div>

              {timeline ? (
                <div className="mt-6 space-y-4">
                  {timeline.phases.map((phase) => (
                    <div key={phase.id}>
                      <div className="flex items-center justify-between gap-4 text-[9px] uppercase tracking-[0.14em]">
                        <span className="font-medium text-neutral-600">{phase.label}</span>
                        <span className="font-mono text-neutral-400">
                          {phase.execution}% / {phase.expected}% ideal
                        </span>
                      </div>
                      <div className="relative mt-2 h-2 bg-neutral-100">
                        <div className="absolute inset-y-0 left-0 bg-neutral-900" style={{ width: `${phase.execution}%` }} />
                        <div
                          className="absolute -top-1 h-4 w-px bg-neutral-400"
                          style={{ left: `${phase.expected}%` }}
                          title={`${phase.expected}% ideal`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 border border-dashed border-neutral-200 p-5 text-xs leading-5 text-neutral-500">
                  Version history begins with the first server-synced progress change. The tracker continues working locally until Supabase and the model endpoint are configured.
                </div>
              )}

              <div className="mt-7 border-t border-neutral-100 pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">Version trajectory</p>
                  <p className="text-[8px] uppercase tracking-[0.14em] text-neutral-400">Bar = actual · line = ideal</p>
                </div>
                {chronologicalHistory.length ? (
                  <div className="mt-4 flex h-24 items-end gap-2">
                    {chronologicalHistory.map((item) => (
                      <div key={item.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="relative h-16 w-full max-w-8 bg-neutral-100">
                          <div
                            className="absolute inset-x-0 bottom-0 bg-neutral-900"
                            style={{ height: `${Math.max(2, item.timeline.actualExecution)}%` }}
                          />
                          <div
                            className="absolute inset-x-0 h-px bg-neutral-400"
                            style={{ bottom: `${item.timeline.idealExecution}%` }}
                          />
                        </div>
                        <span className="font-mono text-[7px] text-neutral-400">v{item.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-neutral-400">No versions recorded yet.</p>
                )}
              </div>
            </section>
          </div>
        </header>

        <main>
          <section>
            <div className="mb-7 flex flex-col gap-4 border-b border-neutral-100 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">Strategy Overview</p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight text-black md:text-4xl">The JasonAI J-curve.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                  A live overview of the five-phase operating path. Open Performance Goals for the full phase dashboard.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500">
                <HardHat className="h-4 w-4" />
                Built for general-contractor owners
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
              <div className="border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-7">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Operating path overview</p>
                <div className="mt-5">
                  <InteractiveJCurve
                    activePhase={activePhase}
                    onSelect={setActivePhaseId}
                    getPhaseProgress={getPhaseProgress}
                  />
                </div>
              </div>

              <aside className="flex flex-col border border-neutral-200 bg-white p-5 sm:p-6">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                  Phase {activePhase.number} · {activePhase.period}
                </p>
                <h3 className="mt-3 text-2xl font-medium tracking-tight text-black">{activePhase.label}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{activePhase.objective}</p>
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                    <span>Assignment execution</span>
                    <span>{getPhaseProgress(activePhase.id)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-neutral-700 transition-[width]"
                      style={{ width: `${getPhaseProgress(activePhase.id)}%` }}
                    />
                  </div>
                </div>
                <Link
                  to={`${jasonAIInternalRoutes.performanceGoals}?phase=${activePhase.id}`}
                  className="group mt-auto inline-flex items-center justify-between border-t border-neutral-100 pt-5 text-sm font-semibold text-black"
                >
                  Review this phase
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </aside>
            </div>
          </section>

          <section className="mt-12 border-t border-neutral-100 pt-10 md:mt-16 md:pt-12">
            <div className="max-w-3xl">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">Connected workspaces</p>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-black md:text-4xl">
                Read here. Work in the dedicated pages.
              </h2>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {overviewCards.map(({ eyebrow, title, description, to, Icon }) => (
                <Link
                  key={eyebrow}
                  to={to}
                  className="group flex min-h-72 flex-col border border-neutral-200 bg-white p-6 transition hover:border-neutral-500"
                >
                  <Icon className="h-5 w-5 text-neutral-500" />
                  <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">{eyebrow}</p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight text-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
                  <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    {eyebrow === 'Performance Goals'
                      ? `${summary.reportedGoals} / ${summary.totalGoals} goal results reported`
                      : eyebrow === 'KPI Tracker'
                        ? `${summary.completedTasks} / ${summary.totalTasks} assignments complete`
                        : '5 phases · 24-month operating record'}
                  </p>
                  <span className="mt-auto inline-flex items-center justify-between border-t border-neutral-100 pt-5 text-sm font-semibold text-black">
                    Open page
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </motion.div>

      <Footer />
    </article>
  );
}
