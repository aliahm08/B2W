import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allCapabilities, capabilityLanes } from '../../content/capabilities';
import Seo from '../../components/Seo';

export default function CapabilitiesIndex() {
    const [activeLaneId, setActiveLaneId] = useState('all');

    const filters = [
        { id: 'all', label: 'All' },
        ...capabilityLanes.map((lane) => ({ id: lane.id, label: lane.menuLabel })),
    ];

    const filteredCapabilities =
        activeLaneId === 'all'
            ? allCapabilities
            : allCapabilities.filter((capability) => capability.laneId === activeLaneId);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <article className="min-h-screen bg-[#0b1115] pt-24 pb-32 text-stone-100">
            <Seo
                title="Our Capabilities & Use Cases | B2W"
                description="Explore our full range of consulting capabilities, from business performance analysis to evaluating operational gaps and deploying modern expansion tools."
            />
            
            <section className="px-6 max-w-7xl mx-auto" id="capabilities-index">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 border-b border-white/10 pb-10"
                >
                    <h1 className="text-4xl font-medium tracking-tight mb-4 text-white md:text-6xl">
                        Our Capabilities & Use Cases
                    </h1>
                    <p className="max-w-3xl text-lg text-stone-300 leading-relaxed mb-8 md:text-xl">
                        A comprehensive directory of the AI systems, workflow automations, and operational tools we build and operate. Filter by your specific focus area to discover relevant solutions.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => setActiveLaneId(filter.id)}
                                className={`border px-4 py-2 text-sm font-medium transition-colors ${activeLaneId === filter.id
                                    ? 'border-white bg-white text-black'
                                    : 'border-white/20 bg-transparent text-stone-300 hover:border-white hover:text-white'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCapabilities.map((capability, index) => (
                        <motion.article
                            key={capability.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.04 }}
                            className="group relative border border-white/10 bg-white/5 p-8 transition-colors duration-300 hover:border-white/30 hover:bg-white/10"
                        >
                            <Link
                                to={`/capabilities/${capability.slug}`}
                                className="absolute inset-0 z-10"
                                aria-label={`View ${capability.title}`}
                            />

                            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 mb-6">
                                <span className="font-semibold text-stone-100">{capability.laneMenuLabel}</span>
                            </div>

                            <h3 className="text-2xl font-medium mb-4 text-white group-hover:underline decoration-1 underline-offset-4 decoration-stone-500">
                                {capability.title}
                            </h3>

                            <p className="text-stone-300 leading-relaxed mb-8 text-sm md:text-base">
                                {capability.summary}
                            </p>

                            <div className="pt-6 border-t border-white/10 flex items-end justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {capability.systems.slice(0, 2).map((system) => (
                                        <span
                                            key={system}
                                            className="text-xs text-stone-300 bg-black/20 px-2 py-1 border border-white/10"
                                        >
                                            {system}
                                        </span>
                                    ))}
                                </div>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
                                    View
                                    <ArrowUpRight className="w-4 h-4" />
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </article>
    );
}
