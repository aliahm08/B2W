import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  CalendarDays, 
  MessageSquare, 
  Target,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText
} from 'lucide-react';
import portalData from '../../../data/clients/uyghur-eats/portal-data.json';
import Deliverables from '../../../components/portal/Deliverables';
import Outcomes from '../../../components/portal/Outcomes';
import Timeline from '../../../components/portal/Timeline';
import Proposal from '../../../components/portal/Proposal';

function Sidebar() {
  const location = useLocation();
  const basePath = '/client/uyghur-eats-v3';

  const navItems = [
    { name: 'Proposal', path: basePath, icon: FileText },
    { name: 'Dashboard', path: `${basePath}/dashboard`, icon: LayoutDashboard },
    { name: 'Deliverables', path: `${basePath}/deliverables`, icon: Map },
    { name: 'Outcomes', path: `${basePath}/outcomes`, icon: Target },
    { name: 'Timeline', path: `${basePath}/timeline`, icon: CalendarDays },
  ];

  return (
    <aside className="w-64 border-r border-neutral-200 bg-white hidden md:flex flex-col min-h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-neutral-200">
        <h2 className="text-xl font-medium tracking-tight">Client Portal</h2>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-mono text-[9px]">{portalData.clientName}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          // exact match for root, startsWith for others
          const isActive = item.path === basePath 
            ? location.pathname === basePath || location.pathname === `${basePath}/`
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-black text-white font-medium shadow-md shadow-black/10' 
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-200 mt-auto">
        <div className="bg-neutral-50 p-4 rounded-md border border-neutral-100">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2 font-semibold">Strategic Goal</p>
          <ul className="space-y-1.5">
            {portalData.proposalHighlights.map(highlight => (
              <li key={highlight} className="text-xs font-medium flex items-center gap-2 text-neutral-700">
                <div className="w-1 h-1 bg-black rounded-full" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function ProgressTracker() {
  const { projectStatus } = portalData;
  const completedCount = projectStatus.filter(s => s.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / projectStatus.length) * 100);

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-black">Project Progress</h3>
          <p className="text-sm text-neutral-500 mt-1">Custom Uyghur Eats Phase Baseline</p>
        </div>
        <div className="text-3xl font-medium font-mono leading-none">
          {progressPercentage}%
        </div>
      </div>

      <div className="relative pt-4">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-neutral-100">
          <div 
            style={{ width: `${progressPercentage}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-1000 ease-out"
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
          {projectStatus.map((stage, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex items-start gap-2 mb-2">
                {stage.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                ) : stage.status === 'in-progress' ? (
                  <Circle className="w-3.5 h-3.5 text-black fill-black/10 shrink-0 mt-0.5 animate-pulse" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
                )}
                <span className={`text-[11px] leading-tight font-medium ${
                  stage.status === 'pending' ? 'text-neutral-400' : 'text-black font-semibold'
                }`}>
                  {stage.stage}
                </span>
              </div>
              <span className={`text-[9px] uppercase tracking-wider ml-5 ${
                stage.status === 'completed' ? 'text-neutral-500 font-bold' : 'text-neutral-400 font-mono'
              }`}>
                {stage.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagingPlaceholder() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg flex flex-col h-[400px] shadow-sm">
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-medium">B2W Support</h3>
        </div>
      </div>
      <div className="flex-1 bg-neutral-50/50 p-6 flex items-center justify-center flex-col text-center">
        <div className="p-3 bg-white rounded-full border border-neutral-100 mb-3 shadow-sm">
          <MessageSquare className="w-6 h-6 text-neutral-200" />
        </div>
        <p className="text-sm text-neutral-600 font-medium">No messages yet</p>
        <p className="text-[11px] text-neutral-400 mt-2 max-w-[180px] leading-relaxed italic">
          Project updates and operational task requests from B2W-AI will appear here.
        </p>
      </div>
      <div className="p-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
            disabled
          />
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium opacity-10 hover:opacity-100 transition-opacity disabled:cursor-not-allowed">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 mb-4 font-semibold">
          <span>{portalData.clientName}</span>
          <span className="text-neutral-300">/</span>
          <span>Project Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">
          Exit Preparation Dashboard
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl leading-relaxed">
          Monitor your preparation phase, track financial modeling progress, and access key sale deliverables.
        </p>
      </header>

      {/* Top Dashboard Row */}
      <ProgressTracker />

      {/* Bottom Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Deliverables Summary Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="text-lg font-medium tracking-tight">Active Deliverables</h3>
            <Link to="/client/uyghur-eats-v3/deliverables" className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 hover:text-black transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {portalData.deliverables.map(deliverable => (
              <div 
                key={deliverable.id}
                className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-black transition-all hover:shadow-lg cursor-default group flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    deliverable.status === 'completed' ? 'bg-black text-white' : 
                    deliverable.status === 'in-progress' ? 'bg-neutral-100 text-black border border-neutral-200' : 
                    'bg-neutral-50 text-neutral-400 border border-neutral-100 italic'
                  }`}>
                    {deliverable.status}
                  </span>
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">{deliverable.title}</h4>
                <p className="text-sm text-neutral-500 mb-6 flex-1 leading-relaxed">{deliverable.description}</p>
                
                <Link 
                  to="/client/uyghur-eats-v3/deliverables" 
                  className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 opacity-60 group-hover:opacity-100 group-hover:text-black transition-all flex items-center gap-2 font-bold"
                >
                  {deliverable.hoverText} <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Messaging Column */}
        <div className="flex flex-col space-y-6">
            <h3 className="text-lg font-medium tracking-tight border-b border-neutral-100 pb-2">Communication</h3>
            <MessagingPlaceholder />
        </div>

      </div>
    </div>
  );
}

export default function UyghurEatsPortalPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-black flex items-stretch font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header elements (Hidden on Desktop) */}
        <div className="md:hidden border-b border-neutral-200 bg-white p-5 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold tracking-tight">Uyghur Eats Portal</h2>
        </div>

        <div className="flex-1 overflow-auto bg-neutral-50/50">
          <Routes>
            {/* The root is now the Proposal page */}
            <Route path="/" element={<Proposal />} />
            {/* The Dashboard is now moved to /dashboard */}
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/deliverables" element={<Deliverables />} />
            <Route path="/outcomes" element={<Outcomes />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="*" element={<Navigate to="/client/uyghur-eats-v3" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
