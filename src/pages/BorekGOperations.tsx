import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Clock3, MessageSquare, Settings2, Store, Wrench } from 'lucide-react';
import Seo from '../components/Seo';
import MobileSectionNav from '../components/MobileSectionNav';
import ResponsiveAccordionSection from '../components/ResponsiveAccordionSection';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../components/projectPageLayout';

const workstreams = [
    'Handle menu, hours, pickup, catering, and market inventory questions.',
    'Answer recurring staff questions around shift notes, opening tasks, and store policy.',
    'Escalate edge cases when confidence is low or manager approval is required.',
    'Log recurring questions so the team can spot the next automation targets.'
];

const launchPlan = [
    {
        title: 'Phase 1',
        body: 'Map the operating playbook: hours, menu logic, catering rules, pickup flow, FAQs, and staff escalation paths.'
    },
    {
        title: 'Phase 2',
        body: 'Deploy a Borek-G chatbot interface trained on approved business answers and common customer/staff workflows.'
    },
    {
        title: 'Phase 3',
        body: 'Measure deflection, response speed, unresolved questions, and handoff quality to improve the system after launch.'
    }
];

export default function BorekGOperations() {
    return (
        <article className={projectPageShellClassName}>
            <Seo
                title="Borek-G Operations Chatbot Proposal"
                description="Proposal page for a Borek-G operations chatbot covering the workflow scope, operating use cases, and phased rollout plan."
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className={projectPageHeaderClassName}>
                    <Link
                        to="/#industries"
                        className={projectPageBackLinkClassName}
                    >
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
                                Borek-G Operations Chatbot
                            </h1>

                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                Proposal for a Borek-G chatbot that handles repeat questions, keeps answers consistent, and routes exceptions to staff.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-500">
                                    Operations Chatbot
                                </span>
                                <span className="rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-500">
                                    Workflow Design
                                </span>
                                <span className="rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-500">
                                    Proposal
                                </span>
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
                            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                                Proposal Scope
                            </p>
                            <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                                Cut repetitive store questions without removing human judgment.
                            </h2>
                            <p className="mb-6 text-sm leading-6 text-neutral-300">
                                The system acts as an assistant for speed and consistency, with escalation for edge cases, sensitive requests, and policy exceptions.
                            </p>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</p>
                                    <p className="font-medium">Proposal</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Mode</p>
                                    <p className="font-medium">Human-in-the-loop</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Primary Goal</p>
                                    <p className="font-medium">Faster responses</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Users</p>
                                    <p className="font-medium">Staff + customers</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </header>

                <main data-project-body className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-12">
                        <MobileSectionNav
                            items={[
                                { id: 'role', label: 'Role' },
                                { id: 'use-cases', label: 'Use cases' },
                                { id: 'rollout', label: 'Rollout' },
                                { id: 'handles', label: 'Handles' },
                                { id: 'benefits', label: 'Benefits' },
                                { id: 'next-step', label: 'Next step' },
                            ]}
                        />
                    </div>
                    <div className="space-y-12 lg:col-span-7">
                        <ResponsiveAccordionSection
                            id="role"
                            title="System Role"
                            icon={Bot}
                            defaultOpen
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body>
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    This is a store operations system, not a marketing chatbot. It answers recurring business questions, reduces interruptions, and keeps responses consistent across channels.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="use-cases"
                            title="Core Use Cases"
                            icon={Store}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body>
                                <ul className="list-disc space-y-2 pl-5 text-neutral-600">
                                    {workstreams.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="rollout"
                            title="Proposed Rollout"
                            icon={Settings2}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
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
                    </div>

                    <aside className="space-y-8 lg:col-span-5">
                        <ResponsiveAccordionSection
                            id="handles"
                            title="What It Would Handle"
                            icon={MessageSquare}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                Menu questions, order timing, pickup instructions, catering intake, store policies, common staff procedures, and routing logic for issues that need a person.
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="benefits"
                            title="Expected Benefits"
                            icon={Clock3}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                Faster response times, fewer repetitive interruptions for staff, cleaner handoffs, and a structured record of recurring questions that can inform later automation.
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="next-step"
                            title="Next Step"
                            icon={Wrench}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="p-4 text-sm leading-6 text-neutral-600 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                Confirm the training sources: menus, hours, catering policies, staff SOPs, pickup rules, and escalation contacts. That operating corpus defines the first useful version.
                            </div>
                        </ResponsiveAccordionSection>
                    </aside>
                </main>
            </motion.div>
        </article>
    );
}
