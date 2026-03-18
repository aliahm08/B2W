import React from 'react';
import { CalendarDays, CheckCircle2, Circle } from 'lucide-react';
import portalData from '../../data/clients/uyghur-eats/portal-data.json';

export default function Timeline() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-2">Project Timeline</h1>
        <p className="text-neutral-600">Track critical milestones across your sale preparation process.</p>
      </header>

      <div className="bg-white border border-neutral-200 rounded-lg p-8">
        <div className="relative border-l border-neutral-200 ml-4 space-y-12">
          {portalData.timeline.map((item, index) => {
            const isCompleted = item.completed;
            const isNext = !isCompleted && (index === 0 || portalData.timeline[index - 1].completed);

            return (
              <div key={index} className="relative pl-8 group">
                {/* Timeline dot */}
                <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                  isCompleted ? 'bg-black' : isNext ? 'bg-black/50' : 'bg-neutral-200'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className={`text-lg mb-1 transition-colors ${
                      isCompleted ? 'font-medium text-black' : 
                      isNext ? 'font-medium text-black' : 'text-neutral-500'
                    }`}>
                      {item.milestone}
                    </h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1.5 font-mono uppercase tracking-widest text-[10px]">
                      <CalendarDays className="w-3 h-3" />
                      {item.date}
                    </p>
                  </div>
                  
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                      isCompleted 
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-700' 
                        : isNext
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-dashed border-neutral-200 text-neutral-400'
                    }`}>
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </>
                      ) : isNext ? (
                        <>
                          <Circle className="w-3.5 h-3.5 fill-current" /> Up Next
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-neutral-300" /> Pending
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
