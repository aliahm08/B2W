import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, Cpu, Handshake, MessageSquareText } from 'lucide-react';
import Seo from '../components/Seo';
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
                    <header className="mt-12 border-b border-white/10 pb-10">
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
                                <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6 text-white">
                                    {capability.title}
                                </h1>

                                <p className="text-xl text-stone-300 max-w-3xl leading-relaxed mb-8">
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

                    <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12 pt-12">
                        <div className="space-y-10">
                            <section>
                                <h2 className="text-2xl font-medium mb-4 text-white">The Problem</h2>
                                <p className="text-stone-300 leading-relaxed">
                                    {capability.problem}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-medium mb-4 text-white">The AI Solution</h2>
                                <p className="text-stone-300 leading-relaxed">
                                    {capability.solution}
                                </p>
                            </section>

                            <section className="border border-white/10">
                                <div className="border-b border-white/10 px-6 py-4 bg-white/[0.03]">
                                    <h2 className="text-xl font-medium text-white">What Teams Receive</h2>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-4">
                                        {capability.outputs.map((output) => (
                                            <li key={output} className="flex items-start gap-3">
                                                <span className="mt-2 h-2 w-2 shrink-0 bg-white" />
                                                <span className="text-stone-300 leading-relaxed">{output}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <section className="border border-white/10 p-6">
                                <div className="flex items-center gap-2 text-stone-400 mb-4">
                                    <Cpu className="w-4 h-4" />
                                    <p className="text-[11px] font-mono uppercase tracking-[0.24em]">Connected systems</p>
                                </div>
                                <div className="space-y-2">
                                    {capability.systems.map((system) => (
                                        <div key={system} className="border border-white/10 px-3 py-2 text-sm text-stone-200">
                                            {system}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="border border-white/10 p-6">
                                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-stone-500 mb-4">
                                    Lane context
                                </p>
                                <p className="text-sm leading-relaxed text-stone-300">
                                    {capability.laneDescription}
                                </p>
                            </section>
                        </aside>
                    </main>
                </motion.div>
            </div>
        </article>
    );
}
