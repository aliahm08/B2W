import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, CircleAlert, ClipboardCheck, FileSignature, Landmark, Sparkles, Store } from 'lucide-react';
import ProjectTagPill from '../components/ProjectTagPill';
import Seo from '../components/Seo';
import ProfileSectionNav from '../components/ProfileSectionNav';
import ResponsiveAccordionSection from '../components/ResponsiveAccordionSection';
import ProposalAcceptanceSection, { getProposalCacheKey } from '../components/ProposalAcceptanceSection';
import { projectShowcaseOverridesByPath } from '../content/projectShowcase';
import { getProposalContent } from '../content/proposals';
import {
  projectPageBackLinkClassName,
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../components/projectPageLayout';

const businessOverview = [
  'Uyghur Eats operates in a strong Washington, DC corridor with affluent neighborhood traffic and established restaurant demand.',
  'The concept is differentiated by authentic Uyghur cuisine, hand-pulled noodles, and a niche category with limited direct competition nearby.',
  'The acquisition opportunity is strongest when the business is packaged around verified fundamentals, not just story or cuisine novelty.',
];

const solutionWorkstreams = [
  'Package the business into a buyer-ready narrative with a controlled blind profile and diligence request list.',
  'Validate the operating foundation through financial review, operational analysis, and lease-risk screening.',
  'Convert diligence into a practical buyer-facing roadmap that clarifies risks, upside, and first-90-day priorities.',
];

const processSteps = [
  {
    title: 'Business Packaging',
    body: 'Build the overview, blind teaser, valuation framing, and buyer objection map so the opportunity can be presented without exposing the client too early.',
  },
  {
    title: 'Diligence Review',
    body: 'Review financials, operating patterns, lease materials, and known risks to identify what is credible, what needs explanation, and what should be corrected before wider buyer review.',
  },
  {
    title: 'Buyer-Ready Delivery',
    body: 'Prepare the diligence report and 90-day roadmap so qualified buyers can assess the business with more certainty and a clearer ownership plan.',
  },
];

const sectionItems = [
  { id: 'overview', label: 'Business Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Our Solution' },
  { id: 'scope-options', label: 'Scopes' },
  { id: 'process', label: 'Process' },
];

export default function UyghurEatsAcquisition() {
  const proposalPath = '/uyghur-eats-acquisition';
  const showcase = projectShowcaseOverridesByPath[proposalPath];
  const proposal = getProposalContent(proposalPath);
  const [selectedOptionId, setSelectedOptionId] = useState(proposal?.options[0]?.id ?? '');
  const [isFinalizationOpen, setIsFinalizationOpen] = useState(false);

  useEffect(() => {
    if (!proposal) return;

    try {
      const raw = window.localStorage.getItem(getProposalCacheKey(proposalPath));
      if (!raw) return;

      const cached = JSON.parse(raw) as { selectedOptionId?: string };
      if (proposal.options.some((option) => option.id === cached.selectedOptionId)) {
        setSelectedOptionId(String(cached.selectedOptionId));
      }
    } catch {
      window.localStorage.removeItem(getProposalCacheKey(proposalPath));
    }
  }, [proposal]);

  useEffect(() => {
    function handleOpen() {
      setIsFinalizationOpen(true);
    }

    window.addEventListener('b2w-assistant:open', handleOpen as EventListener);
    return () => window.removeEventListener('b2w-assistant:open', handleOpen as EventListener);
  }, []);

  const selectedOption = proposal?.options.find((option) => option.id === selectedOptionId) ?? proposal?.options[0];

  return (
    <article className={projectPageShellClassName}>
      <Seo
        title="Uyghur Eats Acquisition Proposal"
        description="Acquisition advisory proposal for Uyghur Eats covering business packaging, diligence, scope options, and digital signing."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={projectPageHeaderClassName}>
          <Link to="/#industries" className={projectPageBackLinkClassName}>
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">Food & Beverage</span>
            <span className="text-neutral-300">•</span>
            <span>Proposal</span>
          </div>

          <div className={projectHeroGridClassNames.operations}>
            <div>
              <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                Uyghur Eats Acquisition Proposal
              </h1>

              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                Proposal for a diligence-led acquisition process that makes Uyghur Eats easier to evaluate, safer to underwrite, and better packaged for serious buyer conversations.
              </p>

              <div className="mb-8 grid gap-3 md:grid-cols-3">
                {proposal?.heroHighlights.map((highlight) => (
                  <div key={highlight} className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {showcase?.tags.map((tag) => (
                  <ProjectTagPill key={`${tag.label}-${tag.tier}`} tag={tag} />
                ))}
              </div>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                Acquisition Advisory
              </p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                Reduce buyer uncertainty before the deal gets expensive.
              </h2>
              <p className="mb-6 text-sm leading-6 text-neutral-300">
                The proposal is built around packaging, diligence, and transaction-readiness support so the project can start lean or continue through active buyer review.
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</p>
                  <p className="font-medium">Proposal</p>
                </div>
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Mode</p>
                  <p className="font-medium">Advisory + diligence</p>
                </div>
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Primary Goal</p>
                  <p className="font-medium">Deal readiness</p>
                </div>
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Outcome</p>
                  <p className="font-medium">Cleaner buyer process</p>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <main data-project-body className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-12">
            <ProfileSectionNav
              items={sectionItems}
              eyebrow="Proposal navigation"
            />
          </div>

          <div className="space-y-12 lg:col-span-7">
            <ResponsiveAccordionSection
              id="overview"
              title="Business Overview"
              icon={Store}
              defaultOpen
              className="border border-neutral-200 md:border-0"
              headerClassName="p-4 md:mb-4 md:p-0"
              bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
            >
              <div data-project-detail-body>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 md:text-base">
                  {businessOverview.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="problem"
              title="Problem"
              icon={CircleAlert}
              className="border border-neutral-200 md:border-0"
              headerClassName="p-4 md:mb-4 md:p-0"
              bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
            >
              <div data-project-detail-body>
                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                  {proposal?.problemBody}
                </p>
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="solution"
              title="Our Solution"
              icon={Sparkles}
              className="border border-neutral-200 md:border-0"
              headerClassName="p-4 md:mb-4 md:p-0"
              bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
            >
              <div data-project-detail-body>
                <p className="mb-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                  {proposal?.solutionBody}
                </p>
                <ul className="list-disc space-y-2 pl-5 text-neutral-600">
                  {solutionWorkstreams.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="scope-options"
              title="Scopes"
              icon={BriefcaseBusiness}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="space-y-6 p-4 md:p-6"
              titleClassName="md:text-xl"
            >
              <div data-project-detail-body className="space-y-6">
                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                  {proposal?.scopeIntro}
                </p>

                <div className="grid gap-4">
                  {proposal?.options.map((option) => (
                    <label
                      key={option.id}
                      className={`block rounded-[1.5rem] border p-5 transition-colors ${
                        selectedOptionId === option.id ? 'border-black bg-black text-white' : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="scopeOption"
                              value={option.id}
                              checked={selectedOptionId === option.id}
                              onChange={() => setSelectedOptionId(option.id)}
                              className="mt-1 h-4 w-4"
                            />
                            <div>
                              <p className={`text-lg font-medium ${selectedOptionId === option.id ? 'text-white' : 'text-black'}`}>{option.title}</p>
                              <p className={`mt-2 text-sm leading-6 ${selectedOptionId === option.id ? 'text-neutral-300' : 'text-neutral-600'}`}>{option.summary}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-2 text-sm md:min-w-56">
                          <div className={`rounded-2xl border px-4 py-3 ${selectedOptionId === option.id ? 'border-white/15 bg-white/5' : 'border-neutral-200 bg-neutral-50'}`}>
                            <p className={`text-[10px] uppercase tracking-[0.22em] ${selectedOptionId === option.id ? 'text-neutral-400' : 'text-neutral-500'}`}>Price</p>
                            <p className={`mt-1 font-medium ${selectedOptionId === option.id ? 'text-white' : 'text-black'}`}>{option.price}</p>
                          </div>
                          <div className={`rounded-2xl border px-4 py-3 ${selectedOptionId === option.id ? 'border-white/15 bg-white/5' : 'border-neutral-200 bg-neutral-50'}`}>
                            <p className={`text-[10px] uppercase tracking-[0.22em] ${selectedOptionId === option.id ? 'text-neutral-400' : 'text-neutral-500'}`}>Timeline</p>
                            <p className={`mt-1 font-medium ${selectedOptionId === option.id ? 'text-white' : 'text-black'}`}>{option.timeline}</p>
                          </div>
                        </div>
                      </div>
                      <ul className={`mt-4 list-disc space-y-2 pl-5 text-sm leading-6 ${selectedOptionId === option.id ? 'text-neutral-200' : 'text-neutral-600'}`}>
                        {option.offerings.map((offering) => (
                          <li key={offering}>{offering}</li>
                        ))}
                      </ul>
                    </label>
                  ))}
                </div>

                <div className="rounded-[1.5rem] border border-black/10 bg-[#f4efe5] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Selected for Finalization</p>
                  <h4 className="mt-2 text-xl font-medium text-black">{selectedOption?.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {selectedOption?.price} · {selectedOption?.timeline}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFinalizationOpen(true)}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Accept Terms and Sign
                  </button>
                </div>
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="process"
              title="Process"
              icon={ClipboardCheck}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="space-y-6 p-4 md:p-6"
              titleClassName="md:text-xl"
            >
              <div data-project-detail-body className="space-y-6">
                {processSteps.map((step) => (
                  <div key={step.title}>
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-black">
                      {step.title}
                    </h4>
                    <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">{step.body}</p>
                  </div>
                ))}
              </div>
            </ResponsiveAccordionSection>
          </div>

          <aside className="space-y-8 lg:col-span-5">
            <ResponsiveAccordionSection
              id="terms"
              title="Accept Terms and Sign"
              icon={FileSignature}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
              titleClassName="md:text-xl"
            >
              <div data-project-detail-body className="space-y-4">
                <p>
                  The selected scope flows directly into the signing drawer. Terms are structured for advisory, diligence, and documentation support rather than licensed brokerage services.
                </p>
                <p>
                  Use the finalization step when you are ready to confirm scope, accept the assumptions, and sign digitally.
                </p>
              </div>
            </ResponsiveAccordionSection>

            <ResponsiveAccordionSection
              id="business-info"
              title="Business Context"
              icon={Landmark}
              className="border border-neutral-200"
              headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
              bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
              titleClassName="md:text-xl"
            >
              <div data-project-detail-body className="space-y-4">
                <p>
                  The engagement is built around a real restaurant asset with differentiated cuisine, corridor-level demand, and acquisition upside that depends on cleaner packaging.
                </p>
                <p>
                  The proposal framework is intentionally simple: establish the business overview, define the problem, present the solution, let the client choose a scope, and convert that choice into signed authorization.
                </p>
              </div>
            </ResponsiveAccordionSection>
          </aside>
        </main>
      </motion.div>

      {proposal ? (
        <ProposalAcceptanceSection
          pathname={proposalPath}
          proposal={proposal}
          isOpen={isFinalizationOpen}
          onClose={() => setIsFinalizationOpen(false)}
          selectedOptionId={selectedOptionId}
          onSelectedOptionChange={setSelectedOptionId}
        />
      ) : null}
    </article>
  );
}
