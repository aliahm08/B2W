/**
 * ARCHIVED ON: 2026-03-17
 * DESCRIPTION: This is the "single unified agent package" version of the capabilities visualization.
 * It frames all information, integrations, and production methods flowing into a single 
 * B2W Agent Engine, which then outputs to WhatsApp/Telegram/Signal.
 */

import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDown, Database, Cpu, Activity, MessageSquare, FileText, Send, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// The "ingredients" from the CSV
const ingredientsData = [
    {
        category: 'Information',
        icon: Database,
        items: [
            { id: 'financial-statements', label: 'Financial statements' },
            { id: 'project-proposals', label: 'project proposals' },
            { id: 'engineering-drawings', label: 'engineering drawings/floorplans' },
            { id: 'supplier-invoices', label: 'supplier invoices' },
        ],
    },
    {
        category: 'Integrations',
        icon: Cpu,
        items: [
            { id: 'pos-analytics', label: 'POS analytics' },
            { id: 'instagram-analytics', label: 'Instagram analytics' },
            { id: 'google-analytics', label: 'Google analytics' },
            { id: 'website-scrubbing', label: 'Website scrubbing' },
        ],
    },
    {
        category: 'Production',
        icon: Activity,
        items: [
            { id: 'fullstack', label: 'Fullstack engineering' },
            { id: 'senior-analysis', label: 'Senior-level analysis' },
            { id: 'safety-risk', label: 'Safety Risk coordination' },
            { id: 'real-estate', label: 'Real Estate consulting' },
        ],
    },
];

const endPoints = [
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'signal', label: 'Signal', icon: Share2 },
];

export default function CapabilitiesVisualization() {
    return (
        <div className="py-32 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16 md:text-center"
            >
                <h2 className="text-4xl font-medium tracking-tight mb-4">The Complete Package</h2>
                <p className="max-w-3xl md:mx-auto text-base text-neutral-600 leading-relaxed mb-6">
                    We don’t just provide individual tools. We take your raw inputs, integrations, and our deep 
                    production capabilities, and synthesize them into a <strong>single, powerful delivery package</strong>: 
                    an autonomous agent tailored to your operations.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative bg-neutral-50/50 border border-neutral-200 p-8 md:p-12 mb-12 rounded-[2rem] overflow-hidden shadow-sm"
            >
                {/* Visual Connector Lines Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neutral-300" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10">
                    {/* Layer 1: The Ingredients */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12 mb-12">
                        {ingredientsData.map((category, colIndex) => {
                            const Icon = category.icon;
                            return (
                                <div key={category.category} className="flex flex-col relative">
                                    <div className="flex items-center justify-center gap-3 mb-8 border-b border-neutral-200 pb-4">
                                        <div className="p-2 bg-white border border-neutral-200 shadow-sm rounded-xl">
                                            <Icon className="w-5 h-5 text-neutral-700" />
                                        </div>
                                        <h3 className="text-lg font-medium tracking-tight text-neutral-900">{category.category}</h3>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {category.items.map((item, itemIndex) => (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ scale: 1.02 }}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: (colIndex * 0.1) + (itemIndex * 0.05) }}
                                                className="relative p-4 border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-300 rounded-xl group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-neutral-700 group-hover:text-black transition-colors capitalize">
                                                        {item.label}
                                                    </span>
                                                    <div className="h-2 w-2 rounded-full bg-neutral-200 group-hover:bg-black transition-colors" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Funnel Down Arrow */}
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        whileInView={{ opacity: 1, height: 'auto' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-px h-12 bg-gradient-to-b from-neutral-300 to-black" />
                            <ArrowDown className="w-6 h-6 text-black -mt-2" />
                        </div>
                    </motion.div>

                    {/* Layer 2: The Agent Package */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="max-w-3xl mx-auto bg-black text-white p-8 md:p-10 rounded-2xl shadow-xl border border-neutral-800 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/50 to-transparent opacity-30" />
                        <div className="relative z-10 flex flex-col items-center">
                            <Activity className="w-10 h-10 text-white mb-6" />
                            <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">B2W Agent Engine</h3>
                            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                                The engine continuously ingests your information, pulls live data from integrations, 
                                and leverages our production logic into a unified brain.
                            </p>
                        </div>
                    </motion.div>

                    {/* Funnel Down Arrow */}
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        whileInView={{ opacity: 1, height: 'auto' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="flex justify-center my-12"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-px h-12 bg-gradient-to-b from-black to-neutral-300" />
                            <ArrowDown className="w-6 h-6 text-neutral-400 -mt-2" />
                        </div>
                    </motion.div>

                    {/* Layer 3: End Deliverable (Chat Interface) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <h4 className="text-xl font-medium tracking-tight text-neutral-900 mb-2">The Multi-Channel Interface</h4>
                            <p className="text-sm text-neutral-500">
                                Your agent deployed directly to your team's existing comms.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                            <div className="flex justify-center gap-6">
                                {endPoints.map((endpoint) => (
                                    <div key={endpoint.id} className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700">
                                            <endpoint.icon className="w-8 h-8" />
                                        </div>
                                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">{endpoint.label}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col justify-center space-y-4 md:border-l md:border-neutral-100 md:pl-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-50 rounded-lg"><FileText className="w-5 h-5 text-neutral-700" /></div>
                                    <span className="text-sm font-medium text-neutral-900">Read & analyze documents</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-50 rounded-lg"><MessageSquare className="w-5 h-5 text-neutral-700" /></div>
                                    <span className="text-sm font-medium text-neutral-900">Write operational updates</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-neutral-50 rounded-lg"><Send className="w-5 h-5 text-neutral-700" /></div>
                                    <span className="text-sm font-medium text-neutral-900">Send files & generate reports</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="flex justify-center"
            >
                <Link
                    to="/capabilities"
                    className="inline-flex items-center gap-3 border border-neutral-200 bg-white px-8 py-4 text-sm font-bold tracking-wide uppercase text-neutral-800 transition-all hover:border-black hover:bg-black hover:text-white group shadow-sm rounded-full"
                >
                    Explore use cases
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
            </motion.div>
        </div>
    );
}
