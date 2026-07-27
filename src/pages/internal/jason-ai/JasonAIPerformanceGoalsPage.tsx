import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Gauge, UsersRound } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import { projectPageShellClassName } from '../../../components/projectPageLayout';
import {
  InteractiveJCurve,
  getKpiId,
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

export default function JasonAIPerformanceGoalsPage() {
  const [searchParams] = useSearchParams();
  const initialPhaseId = searchParams.get('phase');
  const [activePhaseId, setActivePhaseId] = useState(
    phases.some((phase) => phase.id === initialPhaseId) ? initialPhaseId! : phases[0].id,
  );
  const { kpiReports, getKpiProgress, getPhaseProgress } = useJasonAITracking();
  const activePhase = useMemo(
    () => phases.find((phase) => phase.id === activePhaseId) ?? phases[0],
    [activePhaseId],
  );

  return (
    <article className={projectPageShellClassName}>
      <JasonAIInternalNavbar />
      <Seo
        title="JasonAI Performance Goals"
        description="The phase-by-phase JasonAI performance dashboard with minimum gates, targets, owners, and live execution."
        robots="noindex, nofollow"
      />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-8"
      >
        <header className="border-b border-neutral-100 pb-7">
          <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">Performance dashboard</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-medium tracking-[-0.04em] text-black sm:text-5xl">Performance Goals</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
                Each phase defines three outcomes. Their names and measures evolve as JasonAI moves from validation to scale; accountability stays with the executive who owns the result.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-neutral-200 bg-white">
              <div className="p-4">
                <p className="font-mono text-xl text-black">{getPhaseProgress(activePhase.id)}%</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-400">Task execution</p>
              </div>
              <div className="border-l border-neutral-200 p-4">
                <p className="font-mono text-xl text-black">{activePhase.number}/05</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-400">Selected phase</p>
              </div>
            </div>
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
                  onClick={() => setActivePhaseId(phase.id)}
                  aria-pressed={active}
                  className={`min-w-36 border px-4 py-3 text-left transition lg:min-w-0 ${
                    active
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <span className={`font-mono text-[9px] ${active ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    {phase.number} · {phase.period}
                  </span>
                  <span className="mt-1 block text-sm font-medium">{phase.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
          <div className="border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-7">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Interactive operating path</p>
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
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-black">{activePhase.label}</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">{activePhase.objective}</p>
            <div className="mt-6 border-t border-neutral-100 pt-5">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                <Gauge className="h-4 w-4" />
                {getPhaseProgress(activePhase.id)}% of assignments complete
              </div>
            </div>
            <Link
              to={`${jasonAIInternalRoutes.kpiTracker}?phase=${activePhase.id}`}
              className="group mt-auto inline-flex items-center justify-between border-t border-neutral-100 pt-5 text-sm font-semibold text-black"
            >
              Work this phase
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </aside>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
              Phase {activePhase.number} performance
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-black sm:text-3xl">
              Three outcomes this phase must prove.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {activePhase.kpis.map((kpi) => {
              const Icon = kpiIconMap[kpi.id];
              const tone = ownerToneMap[kpi.owner];
              const result = kpiReports[getKpiId(activePhase.id, kpi.id)]?.currentResult ?? '';
              const reportConfig = getGoalReportConfig(kpi.label);
              const performance = getGoalPerformance(kpi.label, result);
              const execution = getKpiProgress(activePhase.id, kpi.id);

              return (
                <article key={kpi.id} className={`flex flex-col border border-neutral-200 border-t-4 bg-white ${tone.line}`}>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${tone.soft}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${tone.soft}`}>
                        <UsersRound className="h-3 w-3" />
                        {kpi.owner}
                      </span>
                    </div>
                    <p className="mt-5 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">{kpi.id}</p>
                    <h3 className="mt-2 text-xl font-medium tracking-tight text-black">{kpi.label}</h3>
                    <p className="mt-3 text-xs leading-5 text-neutral-500">{reportConfig.label}</p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-neutral-50 p-3">
                        <p className="text-[8px] uppercase tracking-[0.16em] text-neutral-400">Current</p>
                        <p className="mt-2 text-base font-medium text-black">
                          {result
                            ? `${reportConfig.prefix ?? ''}${result}${reportConfig.suffix ? ` ${reportConfig.suffix}` : ''}`
                            : 'Not reported'}
                        </p>
                      </div>
                      <div className="bg-neutral-50 p-3">
                        <p className="text-[8px] uppercase tracking-[0.16em] text-neutral-400">Goal performance</p>
                        <p className="mt-2 text-base font-medium text-black">{performance}%</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                        <span>Goal performance</span>
                        <span>{performance}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div className={`h-full rounded-full ${tone.fill}`} style={{ width: `${performance}%` }} />
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                        <span>Assignment execution</span>
                        <span>{execution}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div className="h-full rounded-full bg-neutral-400" style={{ width: `${execution}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="grid border-t border-neutral-100 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="p-5">
                      <p className="text-[8px] uppercase tracking-[0.16em] text-neutral-400">Minimum gate</p>
                      <p className="mt-2 text-xs font-medium leading-5 text-neutral-700">{kpi.minimum}</p>
                    </div>
                    <div className="border-t border-neutral-100 p-5 sm:border-l sm:border-t-0 lg:border-l-0 lg:border-t xl:border-l xl:border-t-0">
                      <p className="text-[8px] uppercase tracking-[0.16em] text-neutral-400">Goal</p>
                      <p className="mt-2 text-xs font-medium leading-5 text-neutral-700">{kpi.target}</p>
                    </div>
                  </div>

                  <Link
                    to={`${jasonAIInternalRoutes.kpiTracker}?phase=${activePhase.id}&goal=${kpi.id as KpiType}`}
                    className="group mt-auto flex items-center justify-between border-t border-neutral-100 px-5 py-4 text-xs font-semibold text-black"
                  >
                    Update goal and assignments
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </motion.main>

      <Footer />
    </article>
  );
}
