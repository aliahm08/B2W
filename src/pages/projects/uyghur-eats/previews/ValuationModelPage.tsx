import { motion } from 'motion/react';
import { Building2, DollarSign, Factory, LineChart, TrendingUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProfileSectionNav from '../../../../components/ProfileSectionNav';
import ProjectTagPill from '../../../../components/ProjectTagPill';
import ResponsiveAccordionSection from '../../../../components/ResponsiveAccordionSection';
import {
  uyghurCostStructure,
  uyghurLeadModel,
  uyghurPreviewMetrics,
  uyghurPreviewSectionItems,
  uyghurRevenueMix,
  uyghurScenarioCards,
} from '../../../../content/uyghurEatsPreview';
import PreviewPageFrame from './PreviewPageFrame';

function Meter({
  label,
  value,
  detail,
  className = 'bg-black',
}: {
  label: string;
  value: number;
  detail: string;
  className?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-black">{label}</p>
          <p className="text-xs text-neutral-500">{detail}</p>
        </div>
        <span className="text-sm font-medium text-black">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <motion.div
          className={`h-full rounded-full ${className}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function BasicPreviewPage() {
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get('return') || '/#projects';

  return (
    <PreviewPageFrame
      title="Uyghur Eats Valuation Model"
      description="Valuation and financial snapshot for the Uyghur Eats property sale, including scenario-based earnings visuals."
      returnPath={returnPath}
      returnLabel={searchParams.get('return') ? "Client Portal" : "Projects"}
      returnDetail={searchParams.get('return') ? "Back to the main presentation" : "Back to B2W Portfolio"}
      eyebrow="Property Sale Deliverable"
      kicker="Valuation & Scenarios"
      heading="Uyghur Eats Valuation Model"
      summary="A standalone financial snapshot that supports the business sale narrative with buyer-friendly earnings visuals and scenario modeling."
      heroNotes={
        <>
          <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
            This module is designed to give buyers a clear understanding of earnings capacity and downside clarity.
          </div>
          <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
            All numbers shown here are illustrative, designed to show how buyer economics can be explained on-brand.
          </div>
        </>
      }
      tagContent={
        <>
          <ProjectTagPill tag={{ label: 'Valuation', tier: 1 }} />
          <ProjectTagPill tag={{ label: 'Financial Modeling', tier: 2 }} />
          <ProjectTagPill tag={{ label: 'Scenarios', tier: 3 }} />
        </>
      }
      asideLabel="Valuation Snapshot"
      asideHeading="Earnings visuals that help buyers construct an offer."
      asideSummary="The page starts with a clean executive profile, then moves quickly into earnings capacity, scenario fit, and baseline margins."
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
      navContent={
        <ProfileSectionNav
          items={uyghurPreviewSectionItems}
          description="This preview shows how the website listing, financials, and buyer scenarios can be packaged into a more credible property-sale experience."
        />
      }
      mainContent={
        <>
          <ResponsiveAccordionSection
            id="profile"
            title="Basic Website Profile"
            icon={Building2}
            defaultOpen
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="space-y-6 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
              <div className="space-y-4 text-sm leading-6 text-neutral-600">
                <p>
                  Uyghur Eats is presented here as a differentiated restaurant asset in a strong Washington corridor, with a buyer story centered on hand-pulled noodles, embedded neighborhood demand, and room for better packaging.
                </p>
                <p>
                  The public-facing copy is intentionally concise. It communicates that the business is real, the concept is defensible, and deeper diligence is available without overwhelming early-stage buyers.
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="border border-neutral-200 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Location</p>
                    <p className="mt-2 font-medium text-black">2412 Wisconsin Ave NW</p>
                  </div>
                  <div className="border border-neutral-200 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Concept</p>
                    <p className="mt-2 font-medium text-black">Uyghur / Central Asian dining</p>
                  </div>
                  <div className="border border-neutral-200 p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Positioning</p>
                    <p className="mt-2 font-medium text-black">Category-differentiated neighborhood asset</p>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-900 bg-black p-5 text-white">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Buyer Hooks</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-300">
                  <li>Handmade noodle concept with limited direct competition in-corridor</li>
                  <li>Visible neighborhood demand and strong experiential identity</li>
                  <li>Room to improve delivery, catering, and reporting without changing the brand</li>
                  <li>Better fit for serious buyers once the financial story is made easier to inspect</li>
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
            bodyClassName="space-y-8 p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 border border-neutral-200 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Revenue Mix</p>
                <div className="space-y-4">
                  {uyghurRevenueMix.map((item, index) => (
                    <Meter
                      label={item.label}
                      value={item.value}
                      detail={item.amount}
                      className={index % 2 === 0 ? 'bg-black' : 'bg-neutral-500'}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4 border border-neutral-200 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Cost Structure</p>
                <div className="space-y-4">
                  {uyghurCostStructure.map((item, index) => (
                    <Meter
                      label={item.label}
                      value={item.value}
                      detail={index === uyghurCostStructure.length - 1 ? 'Illustrative normalized margin' : 'Mock ratio'}
                      className={index === uyghurCostStructure.length - 1 ? 'bg-emerald-600' : 'bg-neutral-700'}
                    />
                  ))}
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
                  <div className="mt-5 grid gap-3">
                    <div className="border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Entry Cost</p>
                      <p className="mt-2 text-xl font-medium text-black">{scenario.entryCost}</p>
                    </div>
                    <div className="border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Annual Cash Flow</p>
                      <p className="mt-2 text-xl font-medium text-black">{scenario.annualCashFlow}</p>
                    </div>
                    <div className="border border-neutral-200 bg-black p-3 text-white">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Payback</p>
                      <p className="mt-2 text-xl font-medium">{scenario.payback}</p>
                    </div>
                  </div>
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-600">
                    {scenario.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="lead-model"
            title="Lead Economics"
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
            <div data-project-detail-body className="border border-neutral-900 bg-neutral-950 p-5 text-white">
              <div className="flex items-start gap-3">
                <LineChart className="mt-1 h-5 w-5 shrink-0 text-neutral-300" />
                <p className="text-sm leading-6 text-neutral-300">
                  This page provides buyers with visual clarity on how different debt, equity, and operational scenarios affect their returns.
                </p>
              </div>
            </div>
          </ResponsiveAccordionSection>
        </>
      }
    />
  );
}
