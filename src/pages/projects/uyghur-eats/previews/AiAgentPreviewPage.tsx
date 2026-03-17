import { AnimatePresence, motion } from 'motion/react';
import { Bot, Building2, DollarSign, Factory, LineChart, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProfileSectionNav from '../../../../components/ProfileSectionNav';
import ProjectTagPill from '../../../../components/ProjectTagPill';
import ResponsiveAccordionSection from '../../../../components/ResponsiveAccordionSection';
import { projectShowcaseOverridesByPath } from '../../../../content/projectShowcase';
import {
  uyghurChatScript,
  uyghurLeadModel,
  uyghurPreviewMetrics,
  uyghurPreviewSectionItems,
  uyghurRevenueMix,
  uyghurScenarioCards,
} from '../../../../content/uyghurEatsPreview';
import PreviewPageFrame from './PreviewPageFrame';

function StatBar({ label, value, amount }: { label: string; value: number; amount: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-black">{label}</p>
        <span className="text-xs text-neutral-500">{amount}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <motion.div
          className="h-full rounded-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function AiAgentPreviewPage() {
  const showcase = projectShowcaseOverridesByPath['/uyghur-eats-acquisition'];
  const [searchParams] = useSearchParams();
  const proposalReturnPath = useMemo(
    () => searchParams.get('return') || '/uyghur-eats-acquisition#scope-options',
    [searchParams],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % uyghurChatScript.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  const visibleMessages = Array.from({ length: 3 }, (_, offset) => uyghurChatScript[(activeIndex + offset) % uyghurChatScript.length]);

  return (
    <PreviewPageFrame
      title="Uyghur Eats AI Buyer Agent Preview"
      description="Mock diligence dashboard preview with a floating AI buyer agent for the Uyghur Eats property sale."
      returnPath={proposalReturnPath}
      returnLabel="Option 3 Preview"
      returnDetail="Mock diligence dashboard plus a floating AI negotiation agent handling buyer questions."
      eyebrow="AI Negotiation Preview"
      kicker="Diligence Dashboard + Agent Layer"
      heading="Buyer Questions, Handled On-Page"
      summary="This mockup extends the analysis dashboard with an AI sales layer that can answer recurring questions, reinforce owner-approved facts, and keep negotiation momentum moving."
      heroNotes={
        <>
          <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
            The chat is intentionally presented as a floating agent, not a generic support bot. It is framed around diligence, negotiation guardrails, and buyer qualification.
          </div>
          <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
            This preview is non-interactive on purpose. It demonstrates the narrative and UI positioning without requiring live data or a production model hookup.
          </div>
        </>
      }
      tagContent={
        <>
          {showcase.tags.map((tag) => (
            <ProjectTagPill key={`${tag.label}-${tag.tier}`} tag={tag} />
          ))}
          <ProjectTagPill tag={{ label: 'AI Agent', tier: 2 }} />
          <ProjectTagPill tag={{ label: 'Negotiation', tier: 3 }} />
        </>
      }
      asideLabel="Option 3 Layer"
      asideHeading="A custom sales assistant for the owner."
      asideSummary="The AI layer is designed to reduce owner involvement in repetitive buyer Q&A while still keeping all responses aligned to approved positioning and deal constraints."
      metricsContent={
        <>
          {uyghurPreviewMetrics.map((metric) => (
            <div key={metric.label} className="border border-white/15 bg-white/5 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">{metric.label}</p>
              <p className="font-medium">{metric.value}</p>
              <p className="mt-1 text-xs text-neutral-400">{metric.detail}</p>
            </div>
          ))}
        </>
      }
      floatingContent={
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 lg:left-1/2 lg:top-1/2 lg:bottom-auto lg:w-[min(92vw,480px)] lg:-translate-x-1/2 lg:-translate-y-1/2">
          <div className="border border-neutral-900 bg-white/92 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-50">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Uyghur Eats AI Buyer Agent</p>
                  <p className="text-xs text-neutral-500">Animated negotiation preview</p>
                </div>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-700">
                live demo
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <AnimatePresence mode="popLayout">
                {visibleMessages.map((message, index) => (
                  <motion.div
                    key={`${activeIndex}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.24 }}
                    className="space-y-3"
                  >
                    <div className="ml-auto max-w-[85%] border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-700">
                      {message.ask}
                    </div>
                    <div className="max-w-[92%] border border-neutral-900 bg-neutral-950 px-4 py-3 text-sm leading-6 text-neutral-200">
                      {message.answer}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      }
      shellClassName="pb-28"
      navContent={
        <ProfileSectionNav
          items={[...uyghurPreviewSectionItems, { id: 'agent-layer', label: 'AI Layer' }]}
          description="This preview shows the Option Two diligence dashboard as the base layer, then adds a floating AI buyer agent and negotiation-support positioning."
        />
      }
      mainContent={
        <>
          <ResponsiveAccordionSection
            id="profile"
            title="Diligence Dashboard Foundation"
            icon={Building2}
            defaultOpen
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="space-y-6 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(240px,0.75fr)]">
              <div className="space-y-4 text-sm leading-6 text-neutral-600">
                <p>
                  Option Three still depends on the same buyer-facing dashboard foundation: clean property narrative, normalized financial story, and scenario views that help the buyer self-qualify.
                </p>
                <p>
                  The owner does not need a chatbot floating over a weak page. The point is to add AI only after the page itself already answers the right questions clearly.
                </p>
              </div>
              <div className="border border-neutral-900 bg-black p-5 text-white">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">What Changes</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-300">
                  <li>Recurring buyer questions are answered consistently</li>
                  <li>Negotiation positioning can follow owner-approved rules</li>
                  <li>Inspector and diligence add-ons can be surfaced contextually</li>
                </ul>
              </div>
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="financials"
            title="Financial Snapshot"
            icon={DollarSign}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="space-y-6 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 border border-neutral-200 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Revenue Readout</p>
                {uyghurRevenueMix.map((item) => (
                  <StatBar key={item.label} label={item.label} value={item.value} amount={item.amount} />
                ))}
              </div>
              <div className="border border-neutral-200 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Why It Matters</p>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  In the AI-agent version, each revenue segment can become part of the response logic. Buyers asking about durability, mix, or upside can get answers grounded in the same dashboard visuals they are already reading.
                </p>
                <div className="mt-5 grid gap-3">
                  <div className="border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Question Type</p>
                    <p className="mt-2 font-medium text-black">Demand durability</p>
                  </div>
                  <div className="border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Agent Response Basis</p>
                    <p className="mt-2 font-medium text-black">Revenue mix + scenario spread + owner guardrails</p>
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="scenarios"
            title="Buyer Scenarios"
            icon={TrendingUp}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="space-y-6 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-4 lg:grid-cols-3">
              {uyghurScenarioCards.map((scenario) => (
                <div key={scenario.title} className="border border-neutral-200 p-5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">{scenario.title}</p>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{scenario.summary}</p>
                  <div className="mt-4 space-y-3">
                    <div className="border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Entry</p>
                      <p className="mt-2 font-medium text-black">{scenario.entryCost}</p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Cash Flow</p>
                      <p className="mt-2 font-medium text-black">{scenario.annualCashFlow}</p>
                    </div>
                    <div className="border border-neutral-900 bg-black p-3 text-white">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Payback</p>
                      <p className="mt-2 font-medium">{scenario.payback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="lead-model"
            title="Lead and Upgrade Model"
            icon={Factory}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="space-y-6 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-4 md:grid-cols-3">
              {uyghurLeadModel.map((item) => (
                <div key={item.stage} className="border border-neutral-200 p-5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">{item.stage}</p>
                  <p className="mt-3 text-3xl font-medium text-black">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="agent-layer"
            title="AI Negotiation Layer"
            icon={Bot}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="space-y-6 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="border border-neutral-200 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Agent Responsibilities</p>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
                  <li>Answer recurring diligence questions using owner-approved knowledge.</li>
                  <li>Route buyer objections into consistent negotiation framing instead of ad hoc replies.</li>
                  <li>Summarize where a buyer is in the funnel and what follow-up is needed next.</li>
                  <li>Support add-ons built from inspector reports, lease notes, or custom diligence findings.</li>
                </ul>
              </div>
              <div className="border border-neutral-900 bg-neutral-950 p-5 text-white">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Owner Guardrails</p>
                <p className="mt-4 text-sm leading-6 text-neutral-300">
                  The agent is positioned as a negotiation-aware assistant, not an autonomous deal closer. Offer framing, acceptable disclosure boundaries, and escalation points still come from the owner.
                </p>
                <div className="mt-5 flex items-start gap-3">
                  <LineChart className="mt-1 h-5 w-5 shrink-0 text-neutral-300" />
                  <p className="text-sm leading-6 text-neutral-300">
                    This is where Option Three becomes meaningfully different: the page stops being just a diligence artifact and starts functioning like a lightweight sales surface.
                  </p>
                </div>
              </div>
            </div>
          </ResponsiveAccordionSection>
        </>
      }
    />
  );
}
