import { motion } from 'motion/react';
import ChatBot from '../components/ChatBot';

export default function BorekG() {
    return (
        <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen border-x border-neutral-200">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-6">
                        <span className="font-semibold text-neutral-900">Food & Beverage</span>
                        <span className="text-neutral-300">•</span>
                        <span>Advertising Operations</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
                        Borek-G Advertising Operations
                    </h1>

                    <p className="text-xl text-neutral-600 max-w-3xl leading-relaxed mb-8">
                        A specialized AI consulting agent deployed for Borek-G to optimize and manage digital
                        advertising operations. By integrating directly into their daily workflow, the AI
                        analyzes campaign performance, suggests budget allocations, and drafts ad copy.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-12">
                        <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-200">
                            Consulting Bot
                        </span>
                        <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-200">
                            Ad Optimization
                        </span>
                        <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-200">
                            Data Scrubbing
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Content Section */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-medium mb-4">The Challenge</h2>
                            <p className="text-neutral-600 leading-relaxed">
                                As a growing cafe and pastry business, Borek-G struggled to maintain a consistent
                                and effective online presence across social media channels. The management lacked
                                the specialized knowledge required to optimize ad spend on platforms like Meta
                                and Google, leading to inefficient customer acquisition.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4">The Solution</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We deployed a custom-trained AI consulting bot designed to act as a quasi-marketing
                                director.
                            </p>
                            <ul className="list-disc pl-5 text-neutral-600 space-y-2">
                                <li>Analyzes weekly sales data against ad spend</li>
                                <li>Generates hyper-localized target audience profiles</li>
                                <li>Drafts compelling, culturally-relevant ad copy</li>
                                <li>Provides instant troubleshooting via a chat interface</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium mb-4">Impact</h2>
                            <div className="border border-neutral-200 p-6 bg-neutral-50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-3xl font-medium text-black mb-1">42%</span>
                                        <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">ROAS Increase</span>
                                    </div>
                                    <div>
                                        <span className="block text-3xl font-medium text-black mb-1">10h</span>
                                        <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">Saved Weekly</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Interactive AI Demo Section */}
                    <div className="bg-white border border-neutral-200 p-6 flex flex-col h-[600px]">
                        <div className="mb-4 pb-4 border-b border-neutral-200">
                            <h3 className="text-lg font-medium">Borek-G AI Consultant</h3>
                            <p className="text-sm text-neutral-500">Live Demo Environment</p>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            <ChatBot />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
