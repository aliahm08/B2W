import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle2, Circle, MessageSquare, ArrowRight, CalendarDays } from 'lucide-react';
import portalData from '../../../data/clients/uyghur-eats/portal-data.json';

export default function OpsDashboard() {
    const { projectStatus, timeline } = portalData;
    const completedCount = projectStatus.filter(s => s.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / projectStatus.length) * 100);

    return (
        <div className="min-h-screen bg-neutral-50 text-black font-sans pb-24 flex items-stretch">
            {/* Minimal Dashboard Sidebar */}
            <aside className="w-64 border-r border-neutral-200 bg-white hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto">
                <div className="p-8 border-b border-neutral-100 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <Link to="/portal/uyghur-eats" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full self-start">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Proposal
                        </Link>
                        <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 self-start">
                            Preview Mode
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-medium tracking-tight">Project Status</h2>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mt-1 font-bold">Uyghur Eats Dashboard</p>
                    </div>
                </div>
                <div className="p-8 flex-1">
                    <div className="text-4xl font-black mb-2">{progressPercentage}%</div>
                    <p className="text-xs text-neutral-400 uppercase tracking-widest font-mono mb-12">Overall Progress</p>
                    <div className="space-y-6">
                        {projectStatus.map((step, idx) => (
                            <div key={idx} className="flex gap-4">
                               <div className="mt-1">
                                    {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-black" /> : 
                                     step.status === 'in-progress' ? <Circle className="w-4 h-4 text-black fill-black/10 animate-pulse" /> : 
                                     <Circle className="w-4 h-4 text-neutral-200" />}
                               </div>
                               <div>
                                    <p className={`text-xs font-semibold leading-tight ${step.status === 'pending' ? 'text-neutral-300' : 'text-black'}`}>{step.stage}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1 font-mono">{step.status}</p>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 px-6 md:px-16 py-24 max-w-5xl mx-auto space-y-24">
                
                {/* Header Mobile Only */}
                <div className="md:hidden flex flex-col gap-4 mb-12">
                    <div className="flex items-center justify-between w-full">
                        <Link to="/portal/uyghur-eats" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors bg-white hover:bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200">
                            <ArrowLeft className="w-4 h-4" />
                            Return
                        </Link>
                        <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                            Preview Mode
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black">{progressPercentage}%</div>
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400">Project Status</p>
                    </div>
                </div>

                <section>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6 font-bold">
                        <span>Project Command Center</span>
                        <span className="text-neutral-200">/</span>
                        <span>Tracking & Timeline</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-8">Exit Command.</h1>
                    <p className="max-w-2xl text-lg text-neutral-600 leading-relaxed">
                        Track your live preparation status, review pending milestones, and access current deliverables as they are handed off from our team.
                    </p>
                </section>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Progress History Column */}
                    <div className="md:col-span-2 space-y-12">
                         <h3 className="text-xl font-medium tracking-tight border-b pb-4">Detailed Timeline</h3>
                         <div className="space-y-4">
                             {timeline.map((item, idx) => (
                                <div key={idx} className={`p-6 border bg-white flex items-center justify-between group hover:border-black transition-colors ${item.completed ? 'border-neutral-100 opacity-60' : 'border-neutral-200 shadow-xl'}`}>
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 bg-neutral-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-1 font-mono">{item.date}</p>
                                            <h4 className="text-lg font-medium tracking-tight">{item.milestone}</h4>
                                        </div>
                                    </div>
                                    {!item.completed && <div className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 bg-black text-white rounded-full">Up Next</div>}
                                </div>
                             ))}
                         </div>
                    </div>

                    {/* Quick Access Sidebar */}
                    <div className="space-y-12">
                         <div className="p-8 bg-neutral-900 text-white space-y-6">
                            <h3 className="text-lg font-medium tracking-tight">Communication</h3>
                            <div className="p-6 bg-white/5 border border-white/10 text-center rounded-lg">
                                <MessageSquare className="w-8 h-8 text-neutral-400 mb-4 mx-auto" />
                                <p className="text-sm text-neutral-300 mb-6 italic leading-relaxed">No messages yet. Our team is finalizing modeling.</p>
                                <button className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded transition-transform active:scale-95">Send Inquiry</button>
                            </div>
                         </div>

                         <div className="p-8 border border-neutral-200 bg-white space-y-6">
                            <h3 className="text-lg font-medium tracking-tight">Highlights</h3>
                            <ul className="space-y-4">
                                {portalData.proposalHighlights.map(h => (
                                    <li key={h} className="text-sm flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                        {h}
                                    </li>
                                ))}
                            </ul>
                            <div className="h-px bg-neutral-100" />
                            <Link to="/portal/uyghur-eats" className="text-xs font-bold uppercase tracking-widest flex items-center justify-between group">
                                Back to Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                         </div>
                    </div>
                </div>

                <section className="mt-24 space-y-8">
                    <div className="border border-neutral-200 bg-white p-8 md:p-12 shadow-sm rounded-sm">
                        <h3 className="text-2xl font-medium tracking-tight mb-4">Due Diligence Checklist</h3>
                        <p className="text-neutral-600 mb-10 max-w-2xl text-lg">
                            The following documents and research materials are required to complete the preparation phase and build the final buyer data room.
                        </p>
                        <div className="space-y-4">
                            {[
                                '3 Years of Business Tax Returns',
                                'Year-to-Date Profit & Loss Statement (Detailed)',
                                'Current Lease Agreement & Any Applicable Amendments',
                                'Equipment & Fixture Inventory List (FFE)',
                                'Copy of Health Department Permits and Licenses',
                                'Summary of Key Employee Roles, Wages, & Tenures',
                                'Primary Vendor & Supplier List with Contact Info',
                                'Point of Sale (POS) Revenue Reports (last 12 months)'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-5 p-5 border border-neutral-100 rounded-lg bg-neutral-50/50 hover:border-black transition-colors group cursor-default">
                                    <div className="mt-0.5">
                                        <Circle className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-black text-sm md:text-base">{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
