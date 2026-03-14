import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, Cpu, Handshake, MessageSquareText } from 'lucide-react';
import Seo from '../components/Seo';
import MobileSectionNav from '../components/MobileSectionNav';
import ResponsiveAccordionSection from '../components/ResponsiveAccordionSection';
import { getCapabilityBySlug } from '../content/capabilities';

export default function CapabilityPage() {
    const { slug } = useParams();
    const capability = slug ? getCapabilityBySlug(slug) : undefined;

    if (!capability) {
        return (
            <article className="min-h-screen bg-[#0b1115] pt-24 pb-16 text-stone-100">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mt-12 border border-white/10 p-8">
                        <Link
                            to="/#capabilities"
                            className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Capabilities
                        </Link>
                        <h1 className="mt-8 text-4xl font-medium tracking-tight text-white">Capability not found</h1>
                    </div>
                </div>
            </article>
        );
    }

    const detailCards = [
        {
            label: 'Where it fits',
            value: capability.bestFor,
            icon: BriefcaseBusiness,
        },
        {
            label: 'Operator touchpoint',
            value: capability.interaction,
            icon: MessageSquareText,
        },
        {
            label: 'Human loop',
            value: capability.humanLoop,
            icon: Handshake,
        },
    ];

    return (
        <article className="min-h-screen bg-[#0b1115] pt-24 pb-16 text-stone-100">
            <Seo
                title={`${capability.title} | Capability`}
                description={capability.summary}
            />

            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <header className="mt-8 border-b border-white/10 pb-10 md:mt-12">
                        <Link
                            to="/#capabilities"
                            className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-white mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Capabilities
                        </Link>

                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 mb-6">
                            <span className="font-semibold text-stone-100">{capability.laneMenuLabel}</span>
                            <span className="text-stone-700">•</span>
                            <span>Capability</span>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px]">
                            <div>
                                <h1 className="mb-5 text-4xl font-medium tracking-tight text-white md:text-6xl">
                                    {capability.title}
                                </h1>

                                <p className="mb-6 max-w-3xl text-lg leading-relaxed text-stone-300 md:text-xl">
                                    {capability.summary}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {capability.systems.map((system) => (
                                        <span
                                            key={system}
                                            className="text-xs text-stone-300 bg-white/5 px-2 py-1 border border-white/10"
                                        >
                                            {system}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <aside className="border border-white/10 bg-white/5 p-6">
                                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-stone-500 mb-4">
                                    Capability Snapshot
                                </p>
                                <div className="space-y-4">
                                    {detailCards.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <div key={item.label} className="border border-white/10 bg-black/20 p-4">
                                                <div className="flex items-center gap-2 text-stone-400">
                                                    <Icon className="w-4 h-4" />
                                                    <p className="text-[10px] uppercase tracking-[0.24em]">{item.label}</p>
                                                </div>
                                                <p className="mt-3 text-sm leading-relaxed text-stone-200">{item.value}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </aside>
                        </div>
                    </header>

                    <main className="grid grid-cols-1 gap-8 pt-10 md:gap-12 md:pt-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <MobileSectionNav
                            items={[
                                { id: 'when-to-use', label: 'When to use' },
                                { id: 'what-we-deploy', label: 'What we deploy' },
                                { id: 'what-you-get', label: 'What you get' },
                                { id: 'systems', label: 'Systems' },
                                { id: 'lane-fit', label: 'Lane fit' },
                            ]}
                        />
                        <div className="space-y-10">
                            <ResponsiveAccordionSection
                                id="when-to-use"
                                title="When to use it"
                                defaultOpen
                                tone="dark"
                                className="border border-white/10 md:border-0"
                                headerClassName="p-4 md:p-0"
                                bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                                titleClassName="text-white"
                            >
                                <p className="text-sm leading-relaxed text-stone-300 md:text-base">
                                    {capability.problem}
                                </p>
                            </ResponsiveAccordionSection>

                            <ResponsiveAccordionSection
                                id="what-we-deploy"
                                title="What we deploy"
                                tone="dark"
                                className="border border-white/10 md:border-0"
                                headerClassName="p-4 md:p-0"
                                bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                                titleClassName="text-white"
                            >
                                <p className="text-sm leading-relaxed text-stone-300 md:text-base">
                                    {capability.solution}
                                </p>
                            </ResponsiveAccordionSection>

                            <ResponsiveAccordionSection
                                id="what-you-get"
                                title="What you get"
                                tone="dark"
                                className="border border-white/10"
                                headerClassName="border-b border-white/10 bg-white/[0.03] px-4 py-4 md:px-6"
                                bodyClassName="p-4 md:p-6"
                                titleClassName="text-white md:text-xl"
                            >
                                <div>
                                    <ul className="space-y-4">
                                        {capability.outputs.map((output) => (
                                            <li key={output} className="flex items-start gap-3">
                                                <span className="mt-2 h-2 w-2 shrink-0 bg-white" />
                                                <span className="text-sm leading-relaxed text-stone-300 md:text-base">{output}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </ResponsiveAccordionSection>
                        </div>

                        <aside className="space-y-6">
                            <ResponsiveAccordionSection
                                id="systems"
                                title="Connected systems"
                                icon={Cpu}
                                tone="dark"
                                className="border border-white/10"
                                headerClassName="p-4 md:p-6 md:pb-4"
                                bodyClassName="px-4 pb-4 md:px-6 md:pb-6"
                                titleClassName="text-white md:text-xl"
                            >
                                <div className="space-y-2">
                                    {capability.systems.map((system) => (
                                        <div key={system} className="border border-white/10 px-3 py-2 text-sm text-stone-200">
                                            {system}
                                        </div>
                                    ))}
                                </div>
                            </ResponsiveAccordionSection>

                            <ResponsiveAccordionSection
                                id="lane-fit"
                                title="Lane fit"
                                tone="dark"
                                className="border border-white/10"
                                headerClassName="p-4 md:p-6 md:pb-4"
                                bodyClassName="px-4 pb-4 md:px-6 md:pb-6"
                                titleClassName="text-white md:text-xl"
                            >
                                <p className="text-sm leading-relaxed text-stone-300">
                                    {capability.laneDescription}
                                </p>
                            </ResponsiveAccordionSection>
                        </aside>
                    </main>
                </motion.div>
            </div>
        </article>
    );
}
