import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, LineChart, BarChart3, TrendingUp, DollarSign, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  { id: 'analysis', label: 'Analysis', icon: Scale },
  { id: 'revenue', label: 'Revenue Visualization', icon: BarChart3 },
  { id: 'summary', label: 'Executive Summary', icon: TrendingUp }
];

type ValuationModelProps = {
    basePath?: string;
};

export default function ValuationModel({
    basePath = '/client/uyghur-eats-v5',
}: ValuationModelProps) {
    const [activeSection, setActiveSection] = useState('analysis');

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-24">
            {/* Header / Nav Container */}
            <div className="sticky top-0 z-50 bg-white border-b border-neutral-100 px-6 md:px-10 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to={basePath} className="p-2 hover:bg-neutral-50 rounded-full transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    {/* Horizontal Nav Bar */}
                    <nav className="flex items-center gap-1 md:gap-4">
                        {sections.map((section) => {
                            const isActive = activeSection === section.id;
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`relative px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                                        isActive ? 'text-white' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                                    }`}
                                >
                                    <span className="relative z-10 hidden md:inline">{section.label}</span>
                                    <Icon className="relative z-10 w-4 h-4 md:hidden" />
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-bg"
                                            className="absolute inset-0 bg-black rounded-full"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="w-9" /> {/* Spacer */}
                </div>
            </div>

            {/* Content Transition */}
            <main className="px-6 md:px-10 max-w-7xl mx-auto py-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {activeSection === 'analysis' && (
                            <section className="space-y-16">
                                <h1 className="text-4xl md:text-6xl font-medium tracking-tight max-w-3xl">Our Model Methodology.</h1>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="p-8 border border-neutral-100 bg-neutral-50/50">
                                            <h3 className="text-sm font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6 font-bold">Primary: SDE-Based Multiple</h3>
                                            <p className="text-neutral-600 leading-relaxed text-lg">
                                                Determining true earning power (Seller Discretionary Earnings) via detailed normalization of owner compensation, one-time expenses, and discretionary spending.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium tracking-tight">Normalization Logic</h3>
                                        <ul className="space-y-4 text-sm text-neutral-500">
                                            <li className="flex justify-between border-b pb-2"><span>Net Income (reported)</span><span className="font-mono">$XX,000</span></li>
                                            <li className="flex justify-between border-b pb-2"><span>+ Owner salary & benefits</span><span className="font-mono">$XX,000</span></li>
                                            <li className="flex justify-between border-b pb-2"><span>+ Non-recurring legal / consulting</span><span className="font-mono">$X,000</span></li>
                                            <li className="flex justify-between border-b pb-2"><span>+ Personal expenses</span><span className="font-mono">$X,000</span></li>
                                            <li className="flex justify-between font-bold text-black border-t-2 pt-2 border-black"><span>Adjusted SDE</span><span>$XX,000</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === 'revenue' && (
                            <section className="space-y-12">
                                <h2 className="text-3xl font-medium tracking-tight border-b pb-6">Revenue & Composition</h2>
                                <div className="grid md:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Avg Monthly REV', value: '—', note: 'Pending Final Review' },
                                        { label: 'Y-O-Y REV', value: '—', note: 'Trailing 12 Months' },
                                        { label: 'Gross Margin', value: '—', note: 'Pre-normalization' },
                                        { label: 'Growth Rate', value: '—', note: 'Trend Analysis' }
                                    ].map(stat => (
                                        <div key={stat.label} className="p-6 border border-neutral-100 bg-white">
                                            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-bold">{stat.label}</p>
                                            <p className="text-2xl font-medium">{stat.value}</p>
                                            <p className="text-[9px] text-neutral-400 mt-2 font-mono">{stat.note}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-10 border border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-medium mb-2">Revenue Streams</h3>
                                        <p className="text-neutral-400 text-sm">Balanced mix between Dine-in and Carry-out.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-center font-mono">Dine-in <br/> 55%</div>
                                        <div className="text-center font-mono">Takeout <br/> 45%</div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeSection === 'summary' && (
                            <section className="space-y-8">
                                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold mb-4">Executive Summary</p>
                                <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8">
                                    Strategic Valuation.
                                </h1>
                                <div className="grid md:grid-cols-3 gap-1 grid-cols-1 border border-neutral-200 bg-neutral-200">
                                    <div className="p-12 bg-white text-center">
                                         <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 font-bold">Conservative Multiple</p>
                                         <p className="text-4xl font-medium">$XX,000</p>
                                    </div>
                                    <div className="p-12 bg-white text-center">
                                         <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 font-bold">Standard Target</p>
                                         <p className="text-4xl font-black">$XX,000</p>
                                    </div>
                                    <div className="p-12 bg-white text-center">
                                         <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 font-bold">Market High Premium</p>
                                         <p className="text-4xl font-medium">$XX,000</p>
                                    </div>
                                </div>
                                <p className="max-w-2xl text-lg text-neutral-500 leading-relaxed italic">
                                    "Ranges are based on SDE multiples benchmarked against comparable restaurant sales in the DC metro area, including location premiums for the Glover Park corridor."
                                </p>
                            </section>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
