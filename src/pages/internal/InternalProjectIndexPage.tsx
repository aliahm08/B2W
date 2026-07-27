import { motion } from 'motion/react';
import { ArrowRight, Bot, CalendarRange, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import B2WLogoMark from '../../components/B2WLogoMark';
import Footer from '../../components/Footer';
import Seo from '../../components/Seo';
import { useJasonAITracking } from './jason-ai/useJasonAITracking';

export default function InternalProjectIndexPage() {
  const { summary } = useJasonAITracking();

  return (
    <article className="min-h-screen bg-white">
      <Seo
        title="B2W Internal Projects"
        description="B2W internal project strategies, dashboards, trackers, and operating records."
        robots="noindex, nofollow"
      />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <B2WLogoMark className="text-black" />
            <span className="text-neutral-300">/</span>
            <Link to="/internal" className="text-sm font-medium text-neutral-700">
              Internal Projects
            </Link>
          </div>
          <span className="hidden text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 sm:block">
            B2W operating index
          </span>
        </div>
      </nav>

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8"
      >
        <header className="border-b border-neutral-100 pb-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">B2W internal portfolio</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-[.95] tracking-[-0.05em] text-black sm:text-6xl">
                Project strategies
                <span className="block text-neutral-400">and operating systems.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
                A single index for active B2W projects, their executive strategy, performance goals, assignments, and operating records.
              </p>
            </div>
            <div className="grid grid-cols-2 border border-neutral-200 bg-white">
              <div className="p-5">
                <p className="font-mono text-2xl text-black">01</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-neutral-400">Active project</p>
              </div>
              <div className="border-l border-neutral-200 p-5">
                <p className="font-mono text-2xl text-black">{summary.execution}%</p>
                <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-neutral-400">Portfolio execution</p>
              </div>
            </div>
          </div>
        </header>

        <section className="pt-9">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Active projects</p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-black">Current operating portfolio</h2>
            </div>
            <FolderKanban className="h-5 w-5 text-neutral-400" />
          </div>

          <Link
            to="/internal/jason-ai"
            className="group grid overflow-hidden border border-neutral-200 bg-white transition hover:border-neutral-500 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                  <Bot className="h-5 w-5 text-neutral-700" />
                </span>
                <span className="rounded-full border border-neutral-200 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Active
                </span>
              </div>

              <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                JasonAI Executive Strategy
              </p>
              <h3 className="mt-4 text-4xl font-medium leading-[.98] tracking-[-0.045em] text-black sm:text-5xl">
                The AI Assistant
                <span className="block text-neutral-400">for Business Owners</span>
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                JasonAI helps owners of SMB general contractors turn everyday WhatsApp communication into useful summaries, visible follow-ups, and measurable time and business value.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ['Target Customer', 'SMB General Contractors'],
                  ['Primary User', 'Project Group Chats'],
                  ['Product', 'WhatsApp AI Assistant'],
                  ['Strategy Horizon', 'Aug 2026 – Jul 2028'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-neutral-200 p-4">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex flex-col bg-neutral-950 p-6 text-white sm:p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Live project status</p>
              <div className="mt-6 grid grid-cols-3 border-y border-white/10 py-5">
                <div>
                  <p className="font-mono text-xl">{summary.execution}%</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-neutral-500">Execution</p>
                </div>
                <div>
                  <p className="font-mono text-xl">{summary.completedTasks}/{summary.totalTasks}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-neutral-500">Tasks</p>
                </div>
                <div>
                  <p className="font-mono text-xl">{summary.reportedGoals}/{summary.totalGoals}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-neutral-500">Goals</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarRange className="mt-0.5 h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-500">Operating horizon</p>
                    <p className="mt-1 text-sm text-neutral-200">Five phases across 24 months</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FolderKanban className="mt-0.5 h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-500">Workspace</p>
                    <p className="mt-1 text-sm text-neutral-200">Dashboard, goals, assignments, and report</p>
                  </div>
                </div>
              </div>

              <span className="mt-auto inline-flex min-h-12 items-center justify-between rounded-full bg-white px-5 text-sm font-semibold text-black">
                Open JasonAI project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </aside>
          </Link>
        </section>
      </motion.main>

      <Footer />
    </article>
  );
}
