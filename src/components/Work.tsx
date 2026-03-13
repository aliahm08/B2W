import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { allCapabilities, capabilityLanes } from '../content/capabilities';

export default function Work() {
    const [activeLaneId, setActiveLaneId] = useState('all');
    const [isExpanded, setIsExpanded] = useState(false);

    const filters = [
        { id: 'all', label: 'All' },
        ...capabilityLanes.map((lane) => ({ id: lane.id, label: lane.menuLabel })),
    ];

    const filteredCapabilities =
        activeLaneId === 'all'
            ? allCapabilities
            : allCapabilities.filter((capability) => capability.laneId === activeLaneId);

    useEffect(() => {
        setIsExpanded(false);
    }, [activeLaneId]);

    const visibleCapabilities = isExpanded ? filteredCapabilities : filteredCapabilities.slice(0, 6);

    return (
        <section className="py-32 px-6 max-w-7xl mx-auto" id="capabilities">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10"
            >
                <h2 className="text-4xl font-medium tracking-tight mb-4">Capabilities</h2>
                <p className="max-w-3xl text-base text-neutral-600 leading-relaxed mb-8">
                    High-level operating systems we can deploy inside a business. Filter by lane, then open any
                    capability as its own page for the full workflow, delivery shape, and human handoff.
                </p>
                <div className="h-px w-full bg-neutral-200 mb-8" />

                <div className="flex flex-wrap gap-3">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => setActiveLaneId(filter.id)}
                            className={`border px-4 py-2 text-sm font-medium transition-colors ${activeLaneId === filter.id
                                ? 'border-black bg-black text-white'
                                : 'border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {visibleCapabilities.map((capability, index) => (
                    <motion.article
                        key={capability.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: index * 0.04 }}
                        className="group relative border border-neutral-200 bg-white p-8 transition-colors duration-300 hover:border-black"
                    >
                        <Link
                            to={`/capabilities/${capability.slug}`}
                            className="absolute inset-0 z-10"
                            aria-label={`View ${capability.title}`}
                        />

                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-6">
                            <span className="font-semibold text-neutral-900">{capability.laneMenuLabel}</span>
                            <span className="text-neutral-300">•</span>
                            <span>Capability</span>
                        </div>

                        <h3 className="text-2xl font-medium mb-4 text-neutral-900 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
                            {capability.title}
                        </h3>

                        <p className="text-neutral-600 leading-relaxed mb-8 text-sm md:text-base">
                            {capability.summary}
                        </p>

                        <div className="pt-6 border-t border-neutral-100 flex items-end justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                {capability.systems.slice(0, 2).map((system) => (
                                    <span
                                        key={system}
                                        className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 border border-neutral-200"
                                    >
                                        {system}
                                    </span>
                                ))}
                            </div>
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900">
                                View
                                <ArrowUpRight className="w-4 h-4" />
                            </span>
                        </div>
                    </motion.article>
                ))}
            </div>

            {filteredCapabilities.length > 6 && (
                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setIsExpanded((current) => !current)}
                        className="border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-black hover:text-black"
                    >
                        {isExpanded ? 'Show fewer' : `Show all ${filteredCapabilities.length} capabilities`}
                    </button>
                </div>
            )}
        </section>
    );
}
