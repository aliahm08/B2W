import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CircleAlert, Clock3, Megaphone, Settings2, Sparkles, Store, Wrench } from 'lucide-react';
import ProjectTagPill from '../../../components/ProjectTagPill';
import Seo from '../../../components/Seo';
import ClientNavbar from '../../../components/ClientNavbar';
import ProfileSectionNav from '../../../components/ProfileSectionNav';
import ResponsiveAccordionSection from '../../../components/ResponsiveAccordionSection';
import ProposalAcceptanceSection, { getProposalCacheKey } from '../../../components/ProposalAcceptanceSection';
import FloatingProposalCTA from '../../../components/FloatingProposalCTA';
import { projectShowcaseOverridesByPath } from '../../../content/projectShowcase';
import { getProposalContent } from '../../../content/proposals';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../../components/projectPageLayout';

const workstreams = [
    'Tighten Borek-G positioning across Instagram, Google Business, Yelp, and owned channels.',
    'Build a repeatable content cadence around food visuals, testimonials, seasonal moments, and market activity.',
    'Turn review language and in-store demand signals into higher-converting digital proof and offers.',
    'Create a clearer operating rhythm for local promotion, retention, and channel-by-channel improvement.'
];

const launchPlan = [
    {
        title: 'Phase 1',
        body: 'Audit the current presentation across Google Business, Yelp, Instagram, ecommerce, and any active email or promotion flows.'
    },
    {
        title: 'Phase 2',
        body: 'Define the content system, channel priorities, and execution cadence needed to package the restaurant more clearly online.'
    },
    {
        title: 'Phase 3',
        body: 'Launch the selected scope, measure response by channel, and refine creative, offers, and publishing rhythm based on results.'
    }
];
const showcase = projectShowcaseOverridesByPath['/borek-g-operations'];
const proposal = getProposalContent('/borek-g-operations');
const sectionItems = [
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Our Solution' },
    { id: 'scope-options', label: 'Explore Your Options' },
    { id: 'handles', label: 'Priority Workstreams' },
    { id: 'benefits', label: 'Expected Outcomes' },
    { id: 'context', label: 'Business Context' },
    { id: 'rollout', label: 'Implementation Notes' },
];

export default function BorekGOperations() {
    const [selectedOptionId, setSelectedOptionId] = useState(proposal?.options[0]?.id ?? '');
    const [isFinalizationOpen, setIsFinalizationOpen] = useState(false);

    useEffect(() => {
        if (!proposal) return;

        try {
            const raw = window.localStorage.getItem(getProposalCacheKey('/borek-g-operations'));
            if (!raw) return;

            const cached = JSON.parse(raw) as { selectedOptionId?: string };
            if (proposal.options.some((option) => option.id === cached.selectedOptionId)) {
                setSelectedOptionId(String(cached.selectedOptionId));
            }
        } catch {
            window.localStorage.removeItem(getProposalCacheKey('/borek-g-operations'));
        }
    }, []);

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
            <ClientNavbar clientName="Borek-G" />
            <Seo
                title="Borek-G | Growth Proposal"
                description="Growth systems proposal for Borek-G. Review our consulting engagement scope, strategies for local discovery, and phased implementation recommendations."
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className={projectPageHeaderClassName}>
                    <Link
                        to="/#projects"
                        className={projectPageBackLinkClassName}
                    >
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
                                Turkish Bistro in Falls Church, VA
                            </h1>

                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                Growth system for a Turkish bistro built from the restaurant's existing demand signals, reputation strength, and channel gaps.
                            </p>

                            <div className="mb-8 grid gap-3 md:grid-cols-3">
                                {proposal?.heroHighlights.map((highlight) => (
                                    <div key={highlight} className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                        {highlight}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {showcase.tags.map((tag) => (
                                    <ProjectTagPill key={`${tag.label}-${tag.tier}`} tag={tag} />
                                ))}
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
                            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                                Proposal Scope
                            </p>
                            <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                                Turn strong in-store demand into clearer digital growth.
                            </h2>
                            <p className="mb-6 text-sm leading-6 text-neutral-300">
                                The work is structured so Borek-G can choose strategy only or a more execution-heavy engagement without losing continuity between analysis and rollout.
                            </p>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</p>
                                    <p className="font-medium">Proposal</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Mode</p>
                                    <p className="font-medium">Strategy + execution</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Primary Goal</p>
                                    <p className="font-medium">Stronger demand capture</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Channels</p>
                                    <p className="font-medium">Social + local search</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </header>

                <main data-project-body className="space-y-12">
                    <ProfileSectionNav
                        items={sectionItems}
                    />

                    <div className="space-y-12">
                        <ResponsiveAccordionSection
                            id="problem"
                            title="Problem"
                            icon={CircleAlert}
                            defaultOpen
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
                                    {workstreams.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="scope-options"
                            title="Explore Your Options"
                            icon={Wrench}
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
                                                {selectedOption.offerings.map((offering) => <li key={offering}>{offering}</li>)}
                                            </ul>
                                            <Link
                                                to="/borek-g-social-media-management?preview=proposal&return=%2Fborek-g-operations%23scope-options"
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

                        <ResponsiveAccordionSection
                            id="handles"
                            title="Priority Workstreams"
                            icon={Megaphone}
                            className="border-t border-neutral-200"
                            headerClassName="border-b border-neutral-200 p-4"
                            bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                Channel strategy, short-form content direction, social publishing rhythm, review-driven messaging, local discovery improvements, and higher-conversion packaging for the website and owned channels.
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="benefits"
                            title="Expected Outcomes"
                            icon={Clock3}
                            className="border-t border-neutral-200"
                            headerClassName="border-b border-neutral-200 p-4"
                            bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                Clearer positioning, more consistent content output, stronger local recall, better conversion from discovery to order intent, and a marketing rhythm the business can sustain.
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="rollout"
                            title="Implementation Notes"
                            icon={Settings2}
                            className="border-t border-neutral-200"
                            headerClassName="border-b border-neutral-200 p-4"
                            bodyClassName="space-y-6 p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-6">
                                {launchPlan.map((phase) => (
                                    <div key={phase.title}>
                                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-black">
                                            {phase.title}
                                        </h4>
                                        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">{phase.body}</p>
                                    </div>
                                ))}
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="context"
                            title="Business Information and Highlights"
                            icon={Store}
                            className="border-t border-neutral-200"
                            headerClassName="border-b border-neutral-200 p-4"
                            bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-4">
                                <p>Borek-G is a neighborhood food business with clear product-market appeal, strong visual food assets, and room to sharpen how that value is presented online.</p>
                                <p>The proposal is structured so the business can choose a lighter advisory scope or a more execution-heavy engagement without losing continuity between review and signing.</p>
                            </div>
                        </ResponsiveAccordionSection>
                    </div>
                </main>
            </motion.div>

            {proposal ? (
                <ProposalAcceptanceSection
                    pathname="/borek-g-operations"
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
