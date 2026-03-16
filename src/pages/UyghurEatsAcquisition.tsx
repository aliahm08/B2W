import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CircleAlert, ClipboardCheck, FileSignature, Landmark, Sparkles, Store } from 'lucide-react';
import ProjectTagPill from '../components/ProjectTagPill';
import Seo from '../components/Seo';
import ProfileSectionNav from '../components/ProfileSectionNav';
import ResponsiveAccordionSection from '../components/ResponsiveAccordionSection';
import ProposalAcceptanceSection, { getProposalCacheKey } from '../components/ProposalAcceptanceSection';
import FloatingProposalCTA from '../components/FloatingProposalCTA';
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
  'Uyghur Eats is a property-sale opportunity built around a differentiated restaurant concept in a strong Washington, DC corridor.',
  'The sale case is strongest when the business is translated into a buyer-ready Analysis Profile rather than an owner narrative.',
  'B2W is proposing a diligence-as-a-service model that earns on packaging, certainty, and follow-on diligence work.',
];

const solutionWorkstreams = [
  'Package the business into an Analysis Profile, Blind Profile, and valuation framing memo.',
  'Use controlled information release to qualify interest without exposing the client too early.',
  'Monetize buyer certainty through the free brief, paid audit, roadmap, and custom review work.',
];

const processSteps = [
  {
    title: 'Phase 1: Validation',
    body: 'Build the Blind Profile template, define the Analysis Profile structure, and test the offer with initial restaurant-owner contacts to prove demand without revealing the client.',
  },
  {
    title: 'Phase 2: Outreach',
    body: 'Identify private buyers, circulate the Blind Profile, and use the diligence-led pitch to convert curiosity into paid diligence access.',
  },
  {
    title: 'Phase 3: Unlock Revenue',
    body: 'Formalize the diligence report as the core product, sell the $1,000 unlock, and upsell custom review and post-acquisition roadmap work.',
  },
];

const sectionItems = [
  { id: 'overview', label: 'Business Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Our Solution' },
  { id: 'scope-options', label: 'Explore Your Options' },
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
        title="Fine Dining in Washington, DC"
        description="Buyer diligence engagement for Uyghur Eats covering the diligence-as-a-service model, scope options, and digital signing."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={projectPageHeaderClassName}>
          <Link to="/#projects" className={projectPageBackLinkClassName}>
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">Food & Beverage</span>
            <span className="text-neutral-300">•</span>
            <span>Engagement</span>
          </div>

          <div className={projectHeroGridClassNames.operations}>
            <div>
              <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                {proposal?.proposalTitle ?? 'Fine Dining in Washington, DC'}
              </h1>

              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                {proposal?.proposalSummary}
              </p>

              <div className="mb-8 grid gap-3 md:grid-cols-3">
                {proposal?.heroHighlights.map((highlight) => (
                  <div key={highlight} className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
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
                Diligence-as-a-Service
              </p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                Sell certainty before selling the deal.
              </h2>
              <p className="mb-6 text-sm leading-6 text-neutral-300">
                The proposal packages the seller side, buyer side, and unlock revenue stream into one controlled property-sale process.
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
                  <p className="font-medium">Reduce asymmetry</p>
                </div>
                <div className="border border-white/15 bg-white/5 p-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Outcome</p>
                  <p className="font-medium">Paid buyer certainty</p>
                </div>
              </div>
            </aside>
          </div>
        </header>

        <main data-project-body className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-12">
            <ProfileSectionNav
              items={sectionItems}
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
          </div>

          <div className="lg:col-span-12">
            <ResponsiveAccordionSection
              id="scope-options"
              title="Explore Your Options"
              icon={BriefcaseBusiness}
              className="border-t border-neutral-200"
              headerClassName="border-b border-neutral-200 p-4"
              bodyClassName="space-y-6 p-4 md:p-6"
              titleClassName="md:text-xl"
            >
              <div data-project-detail-body className="space-y-6">
                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                  {proposal?.scopeIntro}
                </p>

                <div className="flex flex-wrap gap-3">
                  {proposal?.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOptionId(option.id)}
                      className={`border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        selectedOptionId === option.id
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-black hover:text-black'
                      }`}
                    >
                      <span className="block">{option.title}</span>
                      <span className={`mt-2 block text-xs leading-5 ${
                        selectedOptionId === option.id ? 'text-neutral-300' : 'text-neutral-500'
                      }`}>
                        {option.summary}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedOption ? (
                  <div className="grid gap-4 border-t border-neutral-200 pt-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(220px,0.7fr)_minmax(220px,0.7fr)]">
                    <div className="border border-neutral-200 p-5">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Deliverables</p>
                      <h4 className="mt-3 text-2xl font-medium text-black">{selectedOption.title}</h4>
                      <p className="mt-3 text-base leading-7 text-neutral-600">
                        {selectedOption.summary}
                      </p>
                      <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-600">
                        {selectedOption.offerings.map((offering) => (
                          <li key={offering}>{offering}</li>
                        ))}
                      </ul>
                      <Link
                        to="/uyghur-eats?preview=proposal&return=%2Fuyghur-eats-acquisition%23scope-options"
                        className="mt-6 inline-flex items-center gap-2 border border-teal-500/30 bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-700 transition-colors hover:border-teal-700 hover:bg-teal-700 hover:text-white"
                      >
                        Preview deliverable
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="border border-neutral-200 p-5">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Price</p>
                      <p className="mt-3 text-3xl font-medium text-black">{selectedOption.price}</p>
                    </div>

                    <div className="border border-neutral-200 p-5">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Timeline</p>
                      <p className="mt-3 text-3xl font-medium text-black">{selectedOption.timeline}</p>
                    </div>
                  </div>
                ) : null}

                <div className="border-t border-black pt-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Selected for Finalization</p>
                  <h4 className="mt-2 text-xl font-medium text-black">{selectedOption?.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {selectedOption?.price} · {selectedOption?.timeline}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFinalizationOpen(true)}
                    className="mt-5 inline-flex items-center justify-center border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Accept Terms and Sign
                  </button>
                </div>
              </div>
            </ResponsiveAccordionSection>
          </div>

          <div className="space-y-12 lg:col-span-7">
            <ResponsiveAccordionSection
              id="process"
              title="Process"
              icon={ClipboardCheck}
              className="border-t border-neutral-200"
              headerClassName="border-b border-neutral-200 p-4"
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
              className="border-t border-neutral-200"
              headerClassName="border-b border-neutral-200 p-4"
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
              className="border-t border-neutral-200"
              headerClassName="border-b border-neutral-200 p-4"
              bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
              titleClassName="md:text-xl"
            >
              <div data-project-detail-body className="space-y-4">
                <p>
                  The client is Uyghur Eats. The project type is Property Sale. The actual unlocked deliverable for the client side is the Analysis Profile.
                </p>
                <p>
                  The public-facing project label remains generalized as an M&A Property Sale, while the live work product centers on diligence, controlled disclosure, and buyer confidence.
                </p>
                <Link
                  to="/uyghur-eats?preview=proposal&return=%2Fuyghur-eats-acquisition%23scope-options"
                  className="inline-flex items-center gap-2 border border-black px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                >
                  Preview Analysis Profile
                </Link>
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

      {selectedOption ? (
        <FloatingProposalCTA
          label={selectedOption.title}
          detail={`${selectedOption.price} · ${selectedOption.timeline}`}
          onClick={() => setIsFinalizationOpen(true)}
        />
      ) : null}
    </article>
  );
}
