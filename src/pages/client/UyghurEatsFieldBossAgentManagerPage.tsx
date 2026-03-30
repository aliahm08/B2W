import { motion } from 'motion/react';
import { FileText, MessageCircleMore, RadioTower, Smartphone, Workflow } from 'lucide-react';
import { FieldBossShell } from './UyghurEatsFieldBossShared';

const explainers = [
  {
    title: 'Document-guided answers',
    body: 'The agent reads the valuation summary PDF before answering buyer-prospect questions.',
  },
  {
    title: 'Channel-native communication',
    body: 'The same underlying document can be used on WhatsApp, email, or phone without rewriting the logic from scratch.',
  },
  {
    title: 'Controlled disclosure',
    body: 'The agent answers necessary questions without revealing every internal detail or stepping outside the document.',
  },
] as const;

const integrations = [
  { name: 'WhatsApp buyer response', status: 'Healthy', detail: 'Uses the document summary to answer early-stage prospect questions in plain language.' },
  { name: 'Email follow-up', status: 'Healthy', detail: 'Turns the same document into cleaner long-form replies and next-step summaries.' },
  { name: 'Human escalation', status: 'Watching', detail: 'Flags unusual diligence or pricing questions for manual review before sending.' },
  { name: 'Document sync', status: 'Healthy', detail: 'Refreshes the active summary when valuation assumptions are updated.' },
];

function AgentPrototype() {
  return (
    <div className="overflow-hidden border border-white/10 bg-[#08131b]">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-cyan-300/75">Animated prototype</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-white">Agent mode using the valuation document</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
            <FileText className="h-3.5 w-3.5" />
            Use this document
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="border-b border-white/10 p-5 sm:p-6 xl:border-b-0 xl:border-r">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Loaded source</p>
                <h3 className="mt-2 text-lg font-medium tracking-tight text-white">Evaluation Summary.pdf</h3>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Synced
              </div>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Agent instruction</p>
                <p className="mt-2">Communicate with buyer prospects using only the document summary, approved assumptions, and early-stage buyer FAQ guidance.</p>
              </div>
              <div className="border border-white/8 bg-black/15 p-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">Document anchors</p>
                <ul className="mt-3 space-y-2">
                  <li>Normalized earnings logic</li>
                  <li>Comparable transaction framing</li>
                  <li>Transfer-readiness narrative</li>
                </ul>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                communicate with buyer prospects
                <MessageCircleMore className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">WhatsApp buyer chat</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Document-grounded replies</p>
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Prospect thread
              </div>
            </div>

            <div className="space-y-4 p-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[78%] rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-slate-200"
              >
                What is the valuation based on? I want to understand whether this is tied to actual earnings or just the location story.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="ml-auto max-w-[84%] rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.09] px-4 py-4 text-sm leading-7 text-emerald-50"
              >
                It is based on both. The summary explains that the range is anchored in normalized seller earnings, then checked against comparable restaurant transactions, and adjusted for how transferable the operation is to a buyer.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="max-w-[78%] rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-slate-200"
              >
                Does the summary say anything about what would make the handoff easier after purchase?
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52 }}
                className="ml-auto max-w-[84%] rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.09] px-4 py-4 text-sm leading-7 text-emerald-50"
              >
                Yes. It specifically points to transfer readiness: documentation quality, operating clarity, and how easily a buyer can step into the business without rebuilding core workflows.
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UyghurEatsFieldBossAgentManagerPage() {
  return (
    <FieldBossShell
      active="manager"
      eyebrow="FieldBoss AI / Agent Manager"
      title="Use the generated valuation document to communicate with buyer prospects across channels."
      intro="Agent mode picks up where the chatbot leaves off. Once the valuation summary PDF exists, the agent studies that document and uses it to answer buyer-prospect questions on WhatsApp, email, or phone without drifting away from the approved narrative."
    >
      <section className="space-y-6">
        <AgentPrototype />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
          <div className="border border-white/10 bg-[#0b1722] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Workflow className="h-5 w-5 text-cyan-200" />
              <h2 className="text-xl font-medium tracking-tight text-white">Integration Performance</h2>
            </div>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.name} className="flex flex-col gap-3 border border-white/8 bg-white/[0.03] p-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{integration.name}</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{integration.detail}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                    {integration.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-white/10 bg-[linear-gradient(180deg,rgba(8,145,178,0.16),rgba(8,15,24,0.72))] p-6">
              <div className="flex items-center gap-3">
                <RadioTower className="h-5 w-5 text-cyan-200" />
                <h2 className="text-lg font-medium tracking-tight text-white">Prototype explainer</h2>
              </div>
              <div className="mt-5 space-y-4">
                {explainers.map((step, index) => (
                  <div key={step.title} className="border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">Layer {index + 1}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-[#0b1722] p-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-slate-500">Why this matters</p>
              <p className="mt-4 text-lg font-medium tracking-tight text-white">The agent answers necessary buyer questions by studying the document instead of inventing a new story every time.</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">That keeps outbound communication consistent, faster, and safer when multiple prospects begin asking the same early diligence questions.</p>
            </div>
          </div>
        </div>
      </section>
    </FieldBossShell>
  );
}
