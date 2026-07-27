import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, ClipboardCheck, FileText, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import { projectPageHeaderClassName, projectPageShellClassName } from '../../../components/projectPageLayout';
import { InteractiveJCurve, phases } from './JasonAIInternalPortal';
import { JasonAIInternalNavbar, jasonAIInternalRoutes } from './shared';
import { useJasonAITracking } from './useJasonAITracking';

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
  const { summary, getPhaseProgress } = useJasonAITracking();
  const activePhase = phases.find((phase) => phase.id === activePhaseId) ?? phases[0];

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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                  JasonAI Executive Strategy
                </p>
                <h1 className="max-w-[12ch] text-[2.65rem] font-medium leading-[.96] tracking-[-0.045em] text-black sm:text-6xl">
                  The AI Assistant
                  <span className="mt-2 block text-neutral-400">for Business Owners</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  JasonAI helps owners of SMB general contractors turn everyday WhatsApp communication into useful summaries, visible follow-ups, and measurable time and business value.
                </p>
              </div>

              {[
                ['Target Customer', 'SMB General Contractors'],
                ['Primary User', 'Project Group Chats'],
                ['Product', 'WhatsApp AI Assistant'],
                ['Strategy Horizon', 'Aug 2026 – Jul 2028'],
              ].map(([label, value]) => (
                <div key={label} className="border border-neutral-200 bg-white p-4 text-sm leading-6">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">{label}</span>
                  <span className="mt-2 block font-medium text-black">{value}</span>
                </div>
              ))}
            </div>

            <aside className="flex flex-col border border-neutral-900 bg-neutral-950 p-6 text-white sm:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Project pulse</p>
              <h2 className="mt-4 text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                One overview. Three connected working areas.
              </h2>
              <p className="mt-5 text-sm leading-6 text-neutral-300">
                This homepage stays read-only. Goal measurements and completed assignments flow back here automatically from the working pages.
              </p>

              <div className="my-6 grid grid-cols-3 border-y border-white/10 py-5">
                <div>
                  <p className="font-mono text-xl text-white">{summary.execution}%</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-500">Execution</p>
                </div>
                <div>
                  <p className="font-mono text-xl text-white">{summary.completedTasks}/{summary.totalTasks}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-500">Tasks</p>
                </div>
                <div>
                  <p className="font-mono text-xl text-white">{summary.reportedGoals}/{summary.totalGoals}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-500">Goals reported</p>
                </div>
              </div>

              <Link
                to={jasonAIInternalRoutes.performanceGoals}
                className="group mt-auto inline-flex min-h-12 items-center justify-between rounded-full border border-white bg-white px-5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
              >
                Open Performance Goals
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </aside>
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
