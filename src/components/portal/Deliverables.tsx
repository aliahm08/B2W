import React from 'react';
import { LayoutTemplate, LineChart, BriefcaseBusiness, ArrowRight } from 'lucide-react';
import portalData from '../../data/clients/uyghur-eats/portal-data.json';

const iconMap: Record<string, React.FC<any>> = {
  LayoutTemplate,
  LineChart,
  BriefcaseBusiness
};

export default function Deliverables() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Deliverables</h1>
        <p className="text-neutral-600">Review the status of your prepared materials and access your packages below.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portalData.deliverables.map((deliverable) => {
          const IconComponent = iconMap[deliverable.iconName] || BriefcaseBusiness;
          
          return (
            <div 
              key={deliverable.id}
              className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-black transition-colors shadow-sm flex flex-col group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 border border-neutral-100 rounded-md text-neutral-600">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  deliverable.status === 'completed' ? 'bg-black text-white' : 
                  deliverable.status === 'in-progress' ? 'bg-neutral-100 text-black' : 
                  'bg-neutral-50 text-neutral-400 border border-neutral-100'
                }`}>
                  {deliverable.status}
                </span>
              </div>
              
              <h3 className="text-lg font-medium mb-2">{deliverable.title}</h3>
              <p className="text-sm text-neutral-600 mb-6 flex-1">{deliverable.description}</p>
              
              {/* Mock Link for Property Profile if it's the opportunity deliverable */}
              {deliverable.id === 'opportunity' ? (
                <a 
                  href="/client/uyghur-eats"
                  className="inline-flex items-center gap-2 text-sm font-medium text-black group-hover:underline"
                >
                  View Opportunity Overview <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <button 
                  disabled={deliverable.status === 'locked' || deliverable.status === 'pending'}
                  className={`inline-flex items-center gap-2 text-sm font-medium ${
                    deliverable.status === 'locked' || deliverable.status === 'pending'
                      ? 'text-neutral-300 cursor-not-allowed'
                      : 'text-black group-hover:underline'
                  }`}
                >
                  {deliverable.hoverText} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
