import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  MapPin, 
  Target, 
  TrendingUp, 
  LayoutTemplate, 
  LineChart, 
  FileText, 
  BriefcaseBusiness,
  ShieldCheck,
  Zap
} from 'lucide-react';
import portalData from '../../data/clients/uyghur-eats/portal-data.json';

const valueAddSteps = [
  {
    icon: LayoutTemplate,
    title: "1. Opportunity Webpage",
    description: "Creating a premium, public-facing digital profile to showcase the value of the Glover Park location and your unique culinary story."
  },
  {
    icon: LineChart,
    title: "2. Valuation Modeling",
    description: "Determining the true earning power (SDE) by normalizing financial records to reveal potentially missing value in your sale price."
  },
  {
    icon: BriefcaseBusiness,
    title: "3. Operations & Due Diligence",
    description: "Consolidating SOPs, vendor lists, and performance records into a turnkey package that builds immediate trust with serious buyers."
  }
];

export default function Proposal() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Header */}
      <section className="pt-24 pb-16 px-6 md:px-10 border-b border-neutral-100 bg-neutral-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6 font-semibold">
            <span>Client Engagement</span>
            <span className="text-neutral-200">/</span>
            <span>Official Proposal</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8">
            Strategic Exit Preparation for Uyghur Eats
          </h1>
          <p className="max-w-3xl text-xl leading-relaxed text-neutral-600 font-normal">
            A comprehensive advisory approach to maximize the value of your business sale through professional opportunity packaging, valuation modeling, and turnkey documentation.
          </p>
        </div>
      </section>

      {/* Strategic Focus - Maximize Returns / Ease Transfer */}
      <section className="py-24 px-6 md:px-10 max-w-5xl mx-auto border-b border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portalData.proposalHighlights.map((highlight, idx) => (
            <div key={idx} className="group cursor-default">
              <div className="mb-6 p-4 bg-black inline-block rounded-xl shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-medium tracking-tight mb-4 group-hover:text-black/80 transition-colors">
                {highlight}
              </h2>
              <p className="text-neutral-600 leading-relaxed text-lg">
                {highlight === "Maximize Returns" 
                  ? "We normalize your financial reality to ensure buyers see the full scope of your earning power, justification for premium multiples."
                  : "We document your operations so thoroughly that a buyer can confidently step into a turnkey environment, reducing their risk and increasing your sale price."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Offerings Grid */}
      <section className="py-24 px-6 md:px-10 bg-neutral-950 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4 font-bold">The Solution Package</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-16">Custom Scope of Work</h2>
          
          <div className="space-y-12">
            {valueAddSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-8 pb-12 border-b border-white/10 last:border-0 group">
                <div className="md:w-1/3 flex items-start gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-neutral-400 group-hover:text-white transition-colors">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-neutral-300 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-neutral-400 text-lg leading-relaxed group-hover:text-neutral-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing and Timeline */}
      <section className="py-24 px-6 md:px-10 max-w-5xl mx-auto border-b border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-12 border border-neutral-200 rounded-2xl shadow-xl">
          <div className="space-y-8">
            <h3 className="text-2xl font-medium tracking-tight">Investment Details</h3>
            <div className="space-y-6 pt-6 border-t border-neutral-100">
              <div className="flex justify-between items-center group">
                <span className="text-sm font-medium text-neutral-400 font-mono uppercase tracking-widest uppercase">Proposal Range</span>
                <span className="text-2xl font-medium text-black">{portalData.investmentRange}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-sm font-medium text-neutral-400 font-mono uppercase tracking-widest uppercase">Estimated Timeline</span>
                <span className="text-2xl font-medium text-black">3 - 4 Weeks</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center gap-6 p-8 bg-black text-white rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-neutral-400" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold font-mono">Next Action Required</p>
            </div>
            <h4 className="text-2xl font-medium tracking-tight">Review & Sign Proposal</h4>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Access the project dashboard to track real-time progress. The official contract will be generated via digital signature upon approval.
            </p>
            <button className="flex items-center justify-between gap-2 px-6 py-4 bg-white text-black font-medium text-base rounded-lg transition-transform hover:scale-105">
              <span>Accept Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Confidentiality Footer */}
      <section className="py-16 px-6 md:px-10 max-w-5xl mx-auto">
        <div className="p-6 bg-red-50/30 border border-red-100/50 rounded-sm italic">
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-900/40 mb-2 font-bold">Confidentiality Notice</p>
          <p className="text-xs text-red-900/60 leading-relaxed">
            This information is strictly confidential and sharing without explicit notice may warrant legal action. All financial and operational details contained herein are subject to an active Non-Disclosure Agreement.
          </p>
        </div>
      </section>
    </div>
  );
}
