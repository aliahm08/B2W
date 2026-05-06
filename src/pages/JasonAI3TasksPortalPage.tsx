import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Bot, Calculator, FileText, MessageCircle, Mic, Send, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Footer from '../components/Footer';
import ClientNavbar, { type ClientNavAction } from '../components/ClientNavbar';
import {
  projectPageHeaderClassName,
  projectPageShellClassName,
} from '../components/projectPageLayout';

const projectOptions = [
  {
    id: 'scope-change',
    name: 'Expanded implementation scope',
    client: 'Aster Commercial',
    risk: 'Critical',
    source: 'WhatsApp + MSA clause',
    estimate: '$18,400 - $24,800',
  },
  {
    id: 'migration',
    name: 'Drive evidence migration',
    client: 'Aster Commercial',
    risk: 'Watch',
    source: 'Drive + Email',
    estimate: '$7,200 - $10,500',
  },
  {
    id: 'review-window',
    name: 'Fast-track review window',
    client: 'Aster Commercial',
    risk: 'Watch',
    source: 'Calendar + Task log',
    estimate: '$3,900 - $5,600',
  },
] as const;

const estimateInputs = [
  { label: 'Labor', value: '84 hrs', detail: 'Implementation, QA, owner review' },
  { label: 'Complexity', value: 'Medium-high', detail: 'Contract change and evidence reconciliation' },
  { label: 'Risk buffer', value: '18%', detail: 'Unsigned scope and approval timing' },
  { label: 'Owner action', value: 'Approve draft', detail: 'Clara prepares client-facing estimate packet' },
] as const;

const chatMessages = [
  {
    speaker: 'Contract Owner',
    body: 'Clara, build an estimate for the selected implementation change and show what evidence you used.',
  },
  {
    speaker: 'Clara',
    body: 'I found the WhatsApp request, approval language in email, and the MSA written-change clause. I am estimating labor, risk buffer, and owner approval steps.',
  },
  {
    speaker: 'Clara',
    body: 'Draft range is $18,400 - $24,800. I recommend packaging it as a change-order estimate with citations and a 24-hour approval window.',
  },
] as const;

function ClaraTasksChatTray({ onClose }: { onClose: () => void }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-5 bg-[#08131b] px-4 py-5 text-white sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.7fr)] md:py-7">
      <div className="border border-white/10 bg-[#071019] p-5 md:p-6">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300/75">Clara Estimate Chat</p>
        <h2 className="max-w-2xl text-2xl font-medium tracking-tight md:text-3xl">Ask Clara to revise the selected project estimate.</h2>
        <div className="mt-5 space-y-3">
          {chatMessages.slice(1).map((message) => (
            <div key={message.body} className="border border-white/10 bg-white/5 p-4">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">{message.speaker}</p>
              <p className="text-sm leading-6 text-neutral-300">{message.body}</p>
            </div>
          ))}
        </div>
      </div>
      <aside className="border border-white/10 bg-[#071019] p-5 md:p-6">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Quick Prompt</p>
        <p className="text-sm leading-6 text-slate-300">
          “Tighten the estimate around implementation hours, explain the risk buffer, and prepare the approval message.”
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          Apply to estimate
          <ArrowRight className="h-4 w-4" />
        </button>
      </aside>
    </div>
  );
}

export default function JasonAI3TasksPortalPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<(typeof projectOptions)[number]['id']>('scope-change');
  const selectedProject = projectOptions.find((project) => project.id === selectedProjectId) ?? projectOptions[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navItems: ClientNavAction[] = [
    { label: 'Platform', to: '/jasonai-3/portal-2' },
    { label: 'Canvas', to: '/jasonai-3/portal-2#platform-canvas' },
    { label: 'Tasks', to: '/jasonai-3/portal-2/tasks' },
    { label: 'Launch', type: 'cta', to: '/jasonai-3/portal-2/tasks' },
  ];

  return (
    <article className={projectPageShellClassName}>
      <ClientNavbar
        clientName="JasonAI-3"
        clientLink="/jasonai-3/portal-2"
        navItems={navItems}
        hasFieldBoss={true}
        assistantButtonLabel="Clara Chat"
        assistantTrayTitle="Estimate With Clara"
        assistantTray={({ onClose }) => <ClaraTasksChatTray onClose={onClose} />}
      />
      <Seo
        title="JasonAI-3 Tasks Portal by B2W"
        description="JasonAI-3 Tasks Portal lets the Contract Owner chat with Clara to develop project estimates from selected OpenClaw-backed comms records."
        robots="noindex, nofollow"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <header className={projectPageHeaderClassName}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch lg:gap-6">
            <div className="grid content-start gap-3 md:grid-cols-2 md:gap-4">
              <div className="md:col-span-2">
                <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Tasks Portal</p>
                <h1 className="max-w-[12ch] text-[2.2rem] font-medium leading-[0.98] tracking-tight text-black sm:text-5xl md:max-w-none md:text-6xl">
                  Estimate Builder For Selected Project Work
                </h1>
              </div>
              {[
                { label: 'Selected Project', value: selectedProject.name },
                { label: 'Client', value: selectedProject.client },
                { label: 'Risk State', value: selectedProject.risk },
                { label: 'Draft Estimate', value: selectedProject.estimate },
              ].map((item) => (
                <div key={item.label} className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">{item.label}</span>
                  <span className="mt-2 block font-medium text-black">{item.value}</span>
                </div>
              ))}
            </div>

            <aside className="flex h-full flex-col border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-6 md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Clara estimate workspace</p>
              <h2 className="mb-5 max-w-md text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl md:mb-6 md:text-3xl">
                Chat with Clara to turn linked comms, files, risks, and owner rules into a defensible project estimate.
              </h2>
              <div className="mb-5 grid grid-cols-2 gap-3 text-sm md:mb-6">
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Source</p>
                  <p className="font-medium">{selectedProject.source}</p>
                </div>
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Mode</p>
                  <p className="font-medium">Estimate chat</p>
                </div>
              </div>
              <Link
                to="/jasonai-3/portal-2"
                className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                Back to canvas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </header>

        <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 md:mb-6">
            <span>Task Workspace</span>
            <span className="text-neutral-300">/</span>
            <span>Estimate Development</span>
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]">
            <div className="border border-neutral-200 bg-white p-5">
              <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Selected Project</p>
              <div className="space-y-3">
                {projectOptions.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full border p-4 text-left transition-colors ${
                      selectedProjectId === project.id
                        ? 'border-neutral-900 bg-neutral-950 text-white'
                        : 'border-neutral-200 bg-white text-black hover:border-neutral-900'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{project.name}</span>
                    <span className={selectedProjectId === project.id ? 'mt-2 block text-xs text-neutral-300' : 'mt-2 block text-xs text-neutral-500'}>
                      {project.source} / {project.estimate}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]">
              <div className="border border-neutral-900 bg-neutral-950 p-5 text-white">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Chat with Clara</p>
                    <p className="text-xs text-neutral-500">Estimate development session</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.body} className="border border-white/10 bg-white/5 p-4">
                      <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500">{message.speaker}</p>
                      <p className="text-sm leading-6 text-neutral-300">{message.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 border border-white/10 bg-white/5 p-2">
                  <button type="button" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-100">
                    <Mic className="h-5 w-5" />
                  </button>
                  <div className="min-h-11 flex-1 border border-white/10 bg-[#071019] px-4 py-3 text-sm text-neutral-400">
                    Ask Clara to revise the estimate...
                  </div>
                  <button type="button" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <aside className="border border-neutral-200 bg-white p-5">
                <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Estimate Draft</p>
                <div className="mb-5 border border-neutral-900 bg-neutral-950 p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Recommended Range</p>
                  <p className="mt-2 text-2xl font-medium tracking-tight">{selectedProject.estimate}</p>
                </div>
                <div className="space-y-3">
                  {estimateInputs.map((item) => (
                    <div key={item.label} className="border border-neutral-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{item.label}</span>
                        <span className="text-sm font-semibold text-black">{item.value}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-neutral-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
                  Generate estimate packet
                  <ArrowRight className="h-4 w-4" />
                </button>
              </aside>
            </div>
          </div>
        </section>

        <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
          <div className="grid gap-px border border-[#122230] bg-[#122230]">
            {[
              { title: 'Evidence-backed', description: 'Estimate cites source messages, files, and contract clauses.', Icon: FileText },
              { title: 'Risk-adjusted', description: 'Clara carries risk buffer and approval timing into the range.', Icon: ShieldCheck },
              { title: 'Owner-controlled', description: 'The Contract Owner approves packets before client release.', Icon: Bot },
              { title: 'Estimate-ready', description: 'Outputs can become a change order, memo, or client response.', Icon: Calculator },
            ].map((item) => {
              const Icon = item.Icon;

              return (
                <div key={item.title} className="flex h-full items-center justify-between bg-[#08131b] p-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">{item.title}</span>
                      <span className="text-xs leading-5 text-slate-400">{item.description}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </motion.div>

      <Footer />
    </article>
  );
}
