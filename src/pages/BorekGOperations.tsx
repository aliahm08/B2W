import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Clock3, MessageSquare, Settings2, Store, Wrench } from 'lucide-react';
import Seo from '../components/Seo';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../components/projectPageLayout';

const workstreams = [
    'Front-of-house question handling for menu, hours, pickup, catering, and market inventory.',
    'Internal operating support for recurring staff questions, shift notes, opening tasks, and customer-policy consistency.',
    'Structured escalation when the bot cannot answer confidently or when a manager decision is required.',
    'Conversation logging to identify repetitive operational friction and future automation opportunities.'
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
                            <h1 className="mb-6 text-5xl font-medium tracking-tight md:text-6xl">
                                Borek-G Operations Chatbot
                            </h1>

                            <p className="mb-8 max-w-3xl text-xl leading-relaxed text-neutral-600">
                                Proposal for a Borek-G chatbot that supports day-to-day store operations, handles
                                repetitive customer and staff questions, and standardizes how the business responds
                                across pickup, catering, dine-in, and market workflows.
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
                            <h2 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl">
                                Reduce repetitive operational load without replacing human judgment.
                            </h2>
                            <p className="mb-6 text-sm leading-6 text-neutral-300">
                                The system is framed as an assistant for consistency and speed, with manager escalation
                                built in for edge cases, sensitive requests, and policy exceptions.
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

                <main data-project-body className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="space-y-12 lg:col-span-7">
                        <section>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-sm bg-neutral-100 p-2">
                                    <Bot className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">System Role</h2>
                            </div>
                            <div data-project-detail-body>
                                <p className="leading-relaxed text-neutral-600">
                                    This proposal is separate from Borek-G marketing work. It is an operations system:
                                    a chatbot trained to answer recurring business questions, reduce interruptions, and
                                    keep responses consistent across channels.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-sm bg-neutral-100 p-2">
                                    <Store className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Core Use Cases</h2>
                            </div>
                            <div data-project-detail-body>
                                <ul className="list-disc space-y-2 pl-5 text-neutral-600">
                                    {workstreams.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Settings2 className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Proposed Rollout</h3>
                            </div>
                            <div data-project-detail-body className="space-y-6 p-6">
                                {launchPlan.map((phase) => (
                                    <div key={phase.title}>
                                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-black">
                                            {phase.title}
                                        </h4>
                                        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">{phase.body}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-8 lg:col-span-5">
                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <MessageSquare className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">What It Would Handle</h3>
                            </div>
                            <div data-project-detail-body className="p-6 text-sm leading-6 text-neutral-600">
                                Menu questions, order timing, pickup instructions, catering intake, store policies,
                                common staff procedures, and routing logic for issues that need a person.
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Clock3 className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Expected Benefits</h3>
                            </div>
                            <div data-project-detail-body className="p-6 text-sm leading-6 text-neutral-600">
                                Faster response times, fewer repetitive interruptions for staff, cleaner handoffs,
                                and a structured record of recurring questions that can inform later automation.
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Wrench className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Next Step</h3>
                            </div>
                            <div data-project-detail-body className="p-6 text-sm leading-6 text-neutral-600">
                                Confirm the source materials for training: menus, hours, catering policies, staff SOPs,
                                pickup rules, and escalation contacts. That operating corpus defines the first useful version.
                            </div>
                        </section>
                    </aside>
                </main>
            </motion.div>
        </article>
    );
}
