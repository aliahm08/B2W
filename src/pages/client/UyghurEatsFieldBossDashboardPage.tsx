import { motion } from 'motion/react';
import { Bot, DollarSign, FileStack, FolderKanban, Gauge, ChartColumnIncreasing } from 'lucide-react';
import { FieldBossShell } from './UyghurEatsFieldBossShared';

const topStats = [
  { label: 'Active AI workflows', value: '12', icon: Bot, tone: 'text-cyan-200 bg-cyan-400/10' },
  { label: 'Files produced', value: '486', icon: FileStack, tone: 'text-emerald-200 bg-emerald-400/10' },
  { label: 'Tracked monthly cost', value: '$3,420', icon: DollarSign, tone: 'text-amber-200 bg-amber-400/10' },
  { label: 'Automation coverage', value: '74%', icon: Gauge, tone: 'text-violet-200 bg-violet-400/10' },
] as const;

const outputs = [
  { title: 'Inspection summaries', count: '152 files', detail: 'Generated from call notes, field photos, and technician updates.' },
  { title: 'Dispatch packets', count: '88 files', detail: 'Structured instructions, checklists, and job context bundles.' },
  { title: 'Customer follow-ups', count: '194 files', detail: 'Email drafts, WhatsApp replies, and phone-call recaps.' },
] as const;

const dashboardExplain = [
  {
    title: 'Data in motion',
    body: 'The prototype shows intake, artifacts, and cost signals moving together instead of living in separate reports.',
  },
  {
    title: 'Output accountability',
    body: 'Generated files are visible as operational assets, not just background system activity.',
  },
  {
    title: 'Cost control',
    body: 'Model usage, voice transcription, and automation runs are broken out so margin is easier to protect.',
  },
] as const;

function DashboardPrototype() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-[#0b1722] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-cyan-200/75">Animated prototype</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-white">AI output and cost board</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
          Monthly view
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
          <div className="flex items-end gap-3">
            {[44, 72, 58, 90, 66, 104, 82].map((height, index) => (
              <motion.div
                key={`${height}-${index}`}
                className="flex-1 rounded-t-[18px] bg-[linear-gradient(180deg,rgba(103,232,249,0.95),rgba(103,232,249,0.14))]"
                animate={{ height: [Math.max(28, height - 14), height, Math.max(32, height - 6)] }}
                transition={{ duration: 2.8 + index * 0.18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                style={{ height }}
              />
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['Data processed', '1,284 records'],
              ['Artifacts created', '486 files'],
              ['Cost / estimate', '$28 avg'],
            ].map(([label, value], index) => (
              <motion.div
                key={label}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
              >
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-3 text-base font-medium text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {[
            ['Model usage', '$1,940', '57%'],
            ['Voice + transcription', '$890', '26%'],
            ['Automation runs', '$590', '17%'],
          ].map(([label, value, share], index) => (
            <div key={label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-sm text-slate-300">{value}</p>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(103,232,249,0.95),rgba(52,211,153,0.75))]"
                  animate={{ width: [0, share, share] }}
                  transition={{ duration: 1.2 + index * 0.18, ease: 'easeOut' }}
                  style={{ width: share }}
                />
              </div>
              <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">{share} of monthly AI spend</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UyghurEatsFieldBossDashboardPage() {
  return (
    <FieldBossShell
      active="dashboard"
      eyebrow="FieldBoss AI / Dashboard"
      title="See the data, files, and cost footprint created by your AI system."
      intro="This dashboard is where FieldBoss calculates what the AI is processing, which files it has produced, and how much the system is costing so the operation stays legible and margin-aware."
    >
      <section className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-[28px] border border-white/10 bg-[#0b1722] p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-medium tracking-tight text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <DashboardPrototype />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[#0b1722] p-6">
            <div className="mb-6 flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-cyan-200" />
              <h2 className="text-xl font-medium tracking-tight text-white">Files Produced by AI</h2>
            </div>
            <div className="space-y-4">
              {outputs.map((output) => (
                <div key={output.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-white">{output.title}</p>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-200/80">{output.count}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{output.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,116,144,0.16),rgba(8,15,24,0.72))] p-6">
              <div className="flex items-center gap-3">
                <ChartColumnIncreasing className="h-5 w-5 text-cyan-200" />
                <h2 className="text-lg font-medium tracking-tight text-white">Prototype explainer</h2>
              </div>
              <div className="mt-5 space-y-4">
                {dashboardExplain.map((item, index) => (
                  <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">Panel {index + 1}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#0b1722] p-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">Data posture</p>
              <p className="mt-4 text-lg font-medium tracking-tight text-white">The system is producing more operational value per file than per live conversation.</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                That suggests the next optimization is better reuse of generated artifacts, not just more chat volume.
              </p>
            </div>
          </div>
        </div>
      </section>
    </FieldBossShell>
  );
}
