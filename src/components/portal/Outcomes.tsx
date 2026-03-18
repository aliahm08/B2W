import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import portalData from '../../data/clients/uyghur-eats/portal-data.json';

export default function Outcomes() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Project Outcomes</h1>
        <p className="text-neutral-600 max-w-xl mx-auto">
          The ultimate goals and strategic highlights defined in our proposal.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {portalData.proposalHighlights.map((highlight, index) => (
          <div key={index} className="bg-black text-white p-8 rounded-xl flex items-center justify-between shadow-lg">
            <h2 className="text-2xl font-medium tracking-tight w-3/4">{highlight}</h2>
            <Target className="w-12 h-12 opacity-20" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-8">
        <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
          Current Stage Status
        </h3>
        <div className="divide-y divide-neutral-100">
          {portalData.projectStatus.map((status, index) => (
            <div key={index} className="py-4 flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${status.status === 'completed' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                  {status.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <span className="block w-4 h-4 rounded-full border border-neutral-300" />}
                </div>
                <span className={`text-lg transition-colors ${status.status === 'completed' ? 'text-black font-medium' : 'text-neutral-600'}`}>
                  {status.stage}
                </span>
              </div>
              <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full ${
                status.status === 'completed' ? 'bg-black text-white' : 
                status.status === 'in-progress' ? 'bg-neutral-900 text-white' : 
                'bg-neutral-100 text-neutral-500'
              }`}>
                {status.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
