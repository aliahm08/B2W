import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { capabilities } from '../content/caseStudies';

export default function Work() {
    const [activeCategory, setActiveCategory] = useState('All');

    // Extract unique categories from case studies
    const categories = ['All', ...Array.from(new Set(capabilities.map(cs => cs.category)))];

    // Filter case studies based on active category
    const filteredStudies = activeCategory === 'All'
        ? capabilities
        : capabilities.filter(cs => cs.category === activeCategory);

    return (
        <section className="py-32 px-6 max-w-7xl mx-auto" id="work">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <h2 className="text-4xl font-medium tracking-tight mb-4">Capabilities</h2>
                <div className="h-px w-full bg-neutral-200 mb-8" />

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-medium transition-colors border ${activeCategory === category
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </motion.div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredStudies.map((project, index) => (
                        <motion.div
                            layout
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="relative group border border-neutral-200 p-8 hover:border-black transition-colors duration-300 flex flex-col justify-between min-h-[400px] bg-white origin-center"
                        >
                            <div>
                                {/* Header: Category • Service Type */}
                                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-6">
                                    <span className="font-semibold text-neutral-900">{project.category}</span>
                                    <span className="text-neutral-300">•</span>
                                    <span>{project.serviceType}</span>
                                </div>

                                {/* Client Description */}
                                <div className="text-sm text-neutral-500 italic mb-2">
                                    {project.clientDescription}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-medium mb-4 text-neutral-900 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-300">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="text-neutral-600 leading-relaxed mb-8 text-sm md:text-base">
                                    {project.description}
                                </p>
                            </div>

                            {/* Footer Section */}
                            <div className="pt-6 border-t border-neutral-100">
                                <div className="mb-4">
                                    <span className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">Impact</span>
                                    <span className="text-lg font-medium text-neutral-900">{project.impact}</span>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-neutral-400 font-mono">{project.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
