import React, { useEffect, useMemo, useState } from 'react';
import type { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Mic,
  Activity,
  ShieldCheck,
  Cpu,
  Radio,
  Zap,
  ArrowRight,
  Menu,
  X,
  Database,
  MessageSquareText,
  FileText,
  Lock,
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  Train,
  Bus,
  Building2,
  Server,
  MapPin,
  Clock,
  User,
  MoreHorizontal,
  Send,
  Sparkles,
  BarChart3,
  ListFilter,
  Smartphone,
  Tablet,
  Monitor,
  Siren,
  ClipboardCheck,
  FileBadge,
  Eye,
  History,
  FileOutput,
  BrainCircuit,
  RadioReceiver,
  ChevronDown,
  Layers,
  Fingerprint,
  GanttChartSquare,
  Scale,
  Settings,
  Sliders,
  ChevronRight,
  Maximize2,
  Gauge,
  Lightbulb,
  Workflow,
  FileCheck
} from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type VoxelPhaseId = 'city' | 'bus' | 'train' | 'software' | 'agency';
type Page = 'home' | 'features' | 'integration' | 'miles' | 'optio' | 'praetor' | 'platform';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: ButtonSize;
}

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle: string;
  center?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BentoCardSize = 'sm' | 'md' | 'lg';

interface BentoCardProps {
  title: string;
  desc: string;
  icon?: LucideIcon;
  size?: BentoCardSize;
  graphic?: ReactNode;
}

interface VoxelPhase {
  map: number[][];
  color: string;
}

interface VoxelGridProps {
  activePhase: VoxelPhaseId;
}

interface LandingPageProps {
  setPage: Dispatch<SetStateAction<Page>>;
}

interface LandingPhase {
  id: VoxelPhaseId;
  label: string;
  icon: LucideIcon;
  alert: { title: string; status: string };
}

// --- Shared UI Components ---

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', onClick, size = 'md' }) => {
  const sizeClass: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const baseStyle = `${sizeClass[size]} rounded-full font-medium transition-all duration-300 flex items-center gap-2 relative overflow-hidden group`;
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]',
    secondary: 'bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800',
    outline: 'border border-zinc-700 text-zinc-300 hover:text-white hover:border-white'
  };

  const variantClass = variants[variant] ?? variants.primary;

  return (
    <button onClick={onClick} className={`${baseStyle} ${variantClass} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

const SectionHeading: React.FC<SectionHeadingProps> = ({ badge, title, subtitle, center = false }) => (
  <div className={`mb-16 md:mb-24 ${center ? 'text-center flex flex-col items-center' : ''}`}>
    <span className="inline-block py-1 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-6">
      {badge}
    </span>
    <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]">
      {title}
    </h2>
    <p className="text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">
      {subtitle}
    </p>
  </div>
);

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <h3 className="text-3xl font-semibold text-white mb-2">Request Access</h3>
        <p className="text-zinc-400 mb-8">Optimize your transit operations and safety protocols.</p>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Work Email</label>
            <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700" placeholder="name@agency.gov" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Agency Type</label>
            <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors">
              <option>Municipal Rail</option>
              <option>Bus Fleet</option>
              <option>Federal / State Transport</option>
              <option>Airport Operations</option>
              <option>Private Logistics</option>
            </select>
          </div>
          <Button className="w-full justify-center mt-4">Get Pricing & Demo</Button>
        </form>
      </div>
    </div>
  );
};

const BentoCard: React.FC<BentoCardProps> = ({ title, desc, icon: Icon, size = 'sm', graphic }) => {
  const sizeClasses: Record<BentoCardSize, string> = {
    sm: "col-span-1 md:col-span-1",
    md: "col-span-1 md:col-span-2",
    lg: "col-span-1 md:col-span-3",
  };

  return (
    <div className={`${sizeClasses[size]} group relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:border-zinc-600 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between`}>
      <div className="p-8 relative z-10 h-full flex flex-col">
        <div className="mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            {Icon && <Icon size={18} />}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">{title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{desc}</p>
        </div>
        {graphic && (
            <div className="mt-auto pt-6 min-h-[140px] flex items-end justify-center w-full">
                {graphic}
            </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

// --- Animated Visual Components ---

const AudioWaveform = () => (
  <div className="flex items-end justify-center gap-1 h-32 w-full pb-4 px-4 mask-linear-fade">
    {[...Array(24)].map((_, i) => (
      <div 
        key={i} 
        className="w-2 bg-white/20 rounded-full group-hover:bg-white/80 transition-colors duration-500"
        style={{
          height: `${Math.max(20, Math.random() * 100)}%`,
          animation: `pulseHeight ${1 + Math.random()}s infinite ease-in-out alternate`,
          animationDelay: `${Math.random() * 0.5}s`
        }} 
      />
    ))}
  </div>
);

const RAGVisualizer = () => (
  <div className="relative h-32 w-full flex items-center justify-center overflow-hidden">
    <div className="absolute z-10 w-12 h-12 bg-zinc-800 rounded-xl border border-zinc-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
      <Database size={20} className="text-white" />
    </div>
    {[...Array(5)].map((_, i) => (
      <div 
        key={i}
        className="absolute w-full h-full animate-[spin_10s_linear_infinite]"
        style={{ animationDuration: `${15 + i * 5}s`, animationDirection: i % 2 === 0 ? 'normal' : 'reverse' }}
      >
        <div 
          className="absolute w-8 h-8 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-lg flex items-center justify-center"
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: `rotate(${i * 72}deg) translate(${60 + i * 10}px) rotate(-${i * 72}deg)` 
          }}
        >
          <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full group-hover:bg-white transition-colors" />
        </div>
      </div>
    ))}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </div>
);

const InvestigationTerminal = () => (
  <div className="h-32 w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-[10px] md:text-xs text-zinc-400 flex flex-col gap-2 shadow-inner overflow-hidden relative">
    <div className="flex gap-1.5 mb-1 opacity-50">
      <div className="w-2 h-2 rounded-full bg-zinc-600" />
      <div className="w-2 h-2 rounded-full bg-zinc-600" />
      <div className="w-2 h-2 rounded-full bg-zinc-600" />
    </div>
    <div className="flex gap-2">
        <span className="text-green-500">➜</span>
        <span className="typing-effect">query: "mechanical delays line 4"</span>
    </div>
    <div className="opacity-0 animate-[fadeIn_0.5s_ease-in_1s_forwards] flex gap-2">
       <span className="text-blue-500">ℹ</span>
       <span>Parsing dispatch logs...</span>
    </div>
    <div className="opacity-0 animate-[fadeIn_0.5s_ease-in_2s_forwards] flex gap-2 text-white bg-white/5 p-1 rounded">
       <CheckCircle2 size={12} className="mt-0.5 text-green-500"/>
       <span>Found 3 incidents. Safety risk: Minimal.</span>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-zinc-950 to-transparent" />
  </div>
);

const SummarizationBlock = () => (
  <div className="h-32 w-full flex flex-col items-center justify-center gap-2 relative">
    <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
             <div 
                key={i}
                className="absolute bg-zinc-800/50 border border-zinc-700 w-24 h-16 rounded mb-8 transition-all duration-700 group-hover:translate-y-4 group-hover:scale-50 group-hover:opacity-0"
                style={{ 
                    transform: `rotate(${ (i - 1) * 10 }deg) translateY(-${i * 10}px)`,
                    zIndex: 10 - i 
                }}
             >
                <div className="h-1 w-12 bg-zinc-600/50 rounded mt-2 ml-2" />
                <div className="h-1 w-8 bg-zinc-600/50 rounded mt-1 ml-2" />
             </div>
        ))}
    </div>
    <div className="relative z-20 bg-zinc-900 border border-zinc-600 w-32 h-auto p-3 rounded-lg shadow-2xl scale-90 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                <Activity size={10} className="text-white" />
            </div>
            <span className="text-[8px] uppercase tracking-wider text-zinc-400">Incident Report</span>
        </div>
        <div className="space-y-1">
            <div className="h-1 w-full bg-zinc-700 rounded" />
            <div className="h-1 w-2/3 bg-zinc-700 rounded" />
            <div className="h-1 w-4/5 bg-zinc-700 rounded" />
        </div>
    </div>
  </div>
);

// --- 3D Hero Components ---

const VoxelGrid: React.FC<VoxelGridProps> = ({ activePhase }) => {
  const gridSize = 8;
  const phases = useMemo<Record<VoxelPhaseId, VoxelPhase>>(() => ({
    city: {
      map: [
        [0,0,0,0,0,0,0,0],
        [0,1,2,1,0,3,1,0],
        [0,2,4,2,0,4,2,0],
        [0,1,2,1,0,3,1,0],
        [0,0,0,0,0,0,0,0],
        [0,2,3,2,0,1,2,0],
        [0,1,2,1,0,2,1,0],
        [0,0,0,0,0,0,0,0]
      ],
      color: 'bg-zinc-600'
    },
    bus: {
      map: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,2,2,2,2,2,2,0],
        [0,2,2,2,2,2,2,0],
        [0,2,2,2,2,2,2,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
      ],
      color: 'bg-blue-600'
    },
    train: {
      map: [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,2,2,0,0,0],
        [0,0,0,2,2,0,0,0],
        [0,0,0,2,2,0,0,0],
        [0,0,0,2,2,0,0,0],
        [0,0,0,2,2,0,0,0],
        [0,0,0,1,1,0,0,0]
      ],
      color: 'bg-red-600'
    },
    software: {
      map: [
        [4,1,0,0,0,0,1,4],
        [1,2,0,0,0,0,2,1],
        [0,0,1,0,0,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,0,0,1,0,0],
        [1,2,0,0,0,0,2,1],
        [4,1,0,0,0,0,1,4]
      ],
      color: 'bg-green-500'
    },
    agency: {
      map: [
        [0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0],
        [0,1,2,2,2,2,1,0],
        [0,1,2,4,4,2,1,0],
        [0,1,2,4,4,2,1,0],
        [0,1,2,2,2,2,1,0],
        [0,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0]
      ],
      color: 'bg-amber-600'
    }
  }), []);

  const currentPhase = phases[activePhase] ?? phases.city;
  const currentMap = currentPhase.map;
  const mainColor = currentPhase.color;

  return (
    <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] relative preserve-3d rotate-x-60 rotate-z-45 transform-style-3d transition-transform duration-1000">
       <div className="grid grid-cols-8 gap-1 absolute inset-0">
          {currentMap.flat().map((height, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const delay = (Math.abs(row - 3.5) + Math.abs(col - 3.5)) * 50;
            
            return (
              <div 
                key={i}
                className="relative w-full h-full preserve-3d transition-all duration-700 ease-in-out"
                style={{ 
                   transform: `translateZ(${height * 15}px)`,
                   transitionDelay: `${delay}ms`
                }}
              >
                 <div className={`absolute inset-0 ${height > 0 ? (height > 2 ? 'bg-white' : mainColor) : 'bg-zinc-900/20'} opacity-90 border border-white/10 transition-colors duration-700`} />
                 {height > 0 && <div className={`absolute inset-x-0 top-full h-[200px] origin-top -rotate-x-90 ${mainColor} opacity-40`} style={{ height: `${height * 15}px` }} />}
                 {height > 0 && <div className={`absolute inset-y-0 right-0 w-[200px] origin-right rotate-y-90 ${mainColor} opacity-60`} style={{ width: `${height * 15}px` }} />}
              </div>
            );
          })}
       </div>
    </div>
  );
};

// --- Platform Hero Demo Component ---

const SaaSInterface = () => {
    return (
        <div className="w-full flex flex-col xl:flex-row items-center justify-center py-12 scale-[0.85] md:scale-100 origin-top transform-gpu">
            
            {/* 1. DESKTOP: Data Intake (Back Layer) */}
            <div className="relative z-10 w-[700px] h-[450px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col shrink-0 transition-transform duration-500 hover:scale-[1.01] hover:z-40 group">
                {/* Header */}
                <div className="h-9 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-900/50">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="ml-4 h-5 w-48 bg-zinc-900 rounded flex items-center px-2 text-[10px] text-zinc-600 font-mono">
                        tenentes.os/dispatch
                    </div>
                </div>
                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-48 border-r border-zinc-800 bg-zinc-900/30 p-4 flex flex-col gap-1.5">
                        {['Live Channels', 'Protocol Flags', 'Field Units', 'Map View', 'Shift Logs'].map((item, i) => (
                            <div key={i} className={`text-xs px-3 py-2 rounded-md ${i === 1 ? 'bg-white/10 text-white font-medium' : 'text-zinc-500'}`}>{item}</div>
                        ))}
                    </div>
                    <div className="flex-1 p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-sm font-semibold text-white tracking-tight">Active Dispatch Logs</h3>
                            <span className="px-2.5 py-1 bg-red-500/10 text-red-500 text-[10px] font-medium rounded border border-red-500/20 flex items-center gap-1.5 animate-pulse"><AlertTriangle size={10}/> 2 Flags</span>
                        </div>
                        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/10">
                            <div className="grid grid-cols-4 bg-zinc-900/80 p-2.5 text-[9px] font-medium text-zinc-500 border-b border-zinc-800 tracking-wider">
                                <div>UNIT ID</div>
                                <div>MESSAGE TYPE</div>
                                <div>PROTOCOL</div>
                                <div>TIME</div>
                            </div>
                            {[1, 2, 3, 4].map((item, idx) => (
                                <div key={idx} className="grid grid-cols-4 p-2.5 border-b border-zinc-800/50 text-[11px] text-zinc-300 items-center">
                                    <div className="font-mono text-zinc-500">MOW-40{item}</div>
                                    <div>{idx === 1 ? <span className="text-white">Track Entry Req</span> : "Radio Check"}</div>
                                    <div>
                                        {idx === 1 ? (
                                            <span className="text-red-400 flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded w-fit text-[9px] border border-red-500/20">
                                                <X size={10} /> No Readback
                                            </span>
                                        ) : (
                                            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={10} /> Verified</span>
                                        )}
                                    </div>
                                    <div className="text-zinc-600 font-mono text-[10px]">09:42:{10 + idx}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. TABLET: Risk Synthesis (Middle Layer) */}
            <div className="relative z-20 w-[360px] h-[520px] bg-zinc-900 border border-zinc-700 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col shrink-0 -mt-24 xl:mt-24 xl:-ml-32 transition-transform duration-500 hover:scale-[1.02] hover:z-50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                <div className="h-7 flex justify-between px-5 items-center text-[9px] text-white bg-black/90 backdrop-blur-md sticky top-0 z-30">
                    <span>SOP-COMPLIANCE</span>
                    <ShieldCheck size={10} />
                </div>
                <div className="p-6 flex flex-col gap-5 bg-gradient-to-b from-zinc-900 to-zinc-950 flex-1">
                    <div className="bg-zinc-800/40 rounded-2xl p-5 border border-zinc-700/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-500"><FileBadge size={18} /></div>
                            <h2 className="text-base font-bold text-white">Rule 405 Variance</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] text-zinc-400 mb-1.5">
                                    <span>Compliance Score</span>
                                    <span className="text-amber-500 font-mono">65%</span>
                                </div>
                                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                                    <div className="w-[65%] h-full bg-amber-500" />
                                </div>
                            </div>
                            <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed font-mono">
                                <span className="text-zinc-600 block mb-1 uppercase text-[9px] tracking-wider">Transcript Analysis</span>
                                "Dispatch, MOW-402, we are stepping on the rail at MP 12." <br/>
                                <span className="text-red-400 mt-2 block flex items-start gap-1"><X size={12} className="mt-0.5 shrink-0"/> Missing mandatory authority ID.</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-center items-center text-center">
                            <div className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1">Risk Level</div>
                            <div className="text-sm text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Critical</div>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-center items-center text-center">
                            <div className="text-zinc-500 text-[9px] uppercase tracking-widest mb-1">Action</div>
                            <div className="text-sm text-white font-semibold">Halt Ops</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MOBILE: Investigation (Front Layer) */}
            <div className="relative z-30 w-[260px] h-[520px] bg-black border border-zinc-700 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col shrink-0 -mt-24 xl:mt-48 xl:-ml-20 transition-transform duration-500 hover:scale-[1.05] hover:z-50 ring-4 ring-zinc-900">
                <div className="h-8 w-full flex justify-center items-end pb-1 bg-black z-20">
                    <div className="w-20 h-5 bg-zinc-900 rounded-full" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-end pb-8 bg-zinc-950">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-end">
                            <div className="bg-blue-600 text-white text-[11px] px-3.5 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg shadow-blue-900/20">
                                Draft NTD report for MOW incident 9921.
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-zinc-900 text-zinc-200 text-[11px] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[95%] border border-zinc-800 shadow-xl">
                                <div className="flex items-center gap-1.5 mb-2 text-zinc-500 uppercase tracking-wider text-[9px] font-bold">
                                    <Sparkles size={10} className="text-purple-500" /> AI Generator
                                </div>
                                <p className="mb-3 leading-relaxed">I've compiled the data points into NTD Form S&S-40.</p>
                                <div className="p-2.5 bg-black rounded-xl border border-zinc-800 flex items-center gap-3 cursor-pointer hover:bg-zinc-900 transition-colors group/file">
                                    <div className="p-2 bg-zinc-900 rounded-lg text-blue-500 group-hover/file:text-blue-400 border border-zinc-800"><FileText size={14}/></div>
                                    <div>
                                        <span className="text-[10px] text-white font-medium block">NTD_Report_9921.pdf</span>
                                        <span className="text-[8px] text-zinc-500">142 KB • Ready for review</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-10 bg-zinc-900 rounded-full border border-zinc-800 px-4 flex items-center text-[11px] text-zinc-500 justify-between hover:border-zinc-700 transition-colors cursor-text">
                        <span>Send to Director...</span>
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black">
                            <ArrowRight size={12} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

const SignalIndicator = () => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4].map((bar) => (
      <div
        key={bar}
        className={`w-1.5 rounded-sm ${bar < 4 ? 'bg-green-500/40' : 'bg-green-400'} transition-colors`}
        style={{ height: `${4 + bar * 4}px` }}
      />
    ))}
  </div>
);

interface HeroStatProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
}

const HeroStat: React.FC<HeroStatProps> = ({ label, value, icon: Icon, accent = 'text-white' }) => (
  <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center gap-3">
    <div className={`p-2 rounded-lg bg-white/5 ${accent}`}>
      <Icon size={16} />
    </div>
    <div className="leading-tight">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="text-sm text-white font-semibold">{value}</p>
    </div>
  </div>
);

const BatteryIcon = () => (
  <div className="flex items-center gap-1 text-amber-300">
    <div className="relative w-8 h-4 border border-amber-300 rounded-sm">
      <div className="absolute right-[-4px] top-[6px] w-1 h-2 bg-amber-300 rounded-sm" />
      <div className="h-full bg-amber-300/40 w-[82%]" />
    </div>
  </div>
);

const MilesHero = () => {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="absolute -z-10 w-[420px] h-[420px] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-transparent blur-3xl rounded-full" />
      <div className="relative w-[320px] h-[620px] bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="h-12 px-5 flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Fingerprint size={14} className="text-blue-400" />
            <span className="text-white font-semibold">Miles</span>
          </div>
          <div className="flex items-center gap-2">
            <SignalIndicator />
            <Clock size={14} />
          </div>
        </div>

        <div className="flex-1 p-6 space-y-5 bg-gradient-to-b from-zinc-900/40 to-black">
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex items-start gap-3">
            <Siren className="text-amber-400" size={18} />
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-amber-400">Active Alert</p>
              <p className="text-sm text-white">Work Zone ingress detected on Track 12.</p>
              <p className="text-xs text-zinc-500">Haptic pulse sent to crew. SOP readback pending.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HeroStat label="Shift Status" value="Authenticated" icon={ShieldCheck} accent="text-green-400" />
            <HeroStat label="Bodycam" value="Streaming" icon={Monitor} accent="text-blue-400" />
            <HeroStat label="Vitals" value="Stable" icon={Gauge} accent="text-emerald-400" />
            <HeroStat label="Battery" value="82%" icon={BatteryIcon} accent="text-amber-300" />
          </div>

          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-3">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span className="flex items-center gap-2"><RadioReceiver size={14} className="text-cyan-400" /> Live Comms</span>
              <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Online</span>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-zinc-300">
              <p className="text-zinc-500">[09:42:12] Dispatch: "Hold at Signal 42."</p>
              <p className="text-white">[09:42:18] MOW-402: "Copy. Holding at 42."</p>
              <p className="text-red-400">[09:42:22] &gt;&gt; Missing authority ID. Flagged.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/80 flex items-center justify-between text-sm text-white">
            <div className="flex items-center gap-3">
              <User className="text-blue-400" size={18} />
              <div>
                <p className="text-xs text-zinc-400">Crew Lead</p>
                <p className="font-semibold">J. Morales</p>
              </div>
            </div>
            <Button className="px-4 py-2 text-xs" variant="secondary">
              <Send size={14} /> Check-in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptioHero = SaaSInterface;
// --- Pages ---

const FeaturesPage = () => (
  <div className="pt-32 px-6 pb-20 animate-in slide-in-from-bottom-8 duration-700">
    <div className="max-w-7xl mx-auto">
      <SectionHeading 
        badge="Capabilities"
        title="Designed for high-stakes transit."
        subtitle="Tools built specifically for safety teams where accuracy and speed prevent accidents."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BentoCard 
            title="Radio Integration"
            desc="Direct frequency monitoring. We digitize the analog workflow without changing operator behavior."
            icon={Radio}
        />
        <BentoCard 
            title="Contextual Intelligence"
            desc="The AI understands transit jargon. From 'deadhead' to 'block signal', the context is preserved."
            icon={Cpu}
        />
        <BentoCard 
            title="Regulatory Guardrails"
            desc="RAG models are constantly updated with latest standards (FTA, FRA, OSHA) to ensure compliance."
            icon={ShieldCheck}
        />
        <BentoCard 
            title="Mobile Field App"
            desc="For track inspectors and station staff, a simplified push-to-talk interface that feeds into central command."
            icon={Zap}
        />
        <BentoCard 
            title="Incident Replay"
            desc="Reconstruct timelines of safety events by querying the conversation history of multiple channels instantly."
            icon={Activity}
            size="md"
        />
      </div>
    </div>
  </div>
);

const IntegrationPage = () => (
  <div className="pt-32 px-6 pb-20 animate-in slide-in-from-bottom-8 duration-700">
    <div className="max-w-7xl mx-auto">
       <SectionHeading 
        badge="Ecosystem"
        title="Fits your existing stack."
        subtitle="Tenentes is an aggregation layer, not a replacement for your core scheduling or dispatch software."
      />

      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-2xl font-semibold text-white mb-4">Input Sources</h3>
                <div className="flex flex-wrap gap-3">
                    {['Motorola Solutions', 'Kenwood', 'iOS', 'Android', 'VoIP', 'RoIP Gateways'].map(tag => (
                        <span key={tag} className="px-4 py-2 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm">{tag}</span>
                    ))}
                </div>
            </div>
             <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-2xl font-semibold text-white mb-4">Export & Visualization</h3>
                <div className="flex flex-wrap gap-3">
                    {['Tableau', 'PowerBI', 'Trapeze', 'Hastus', 'Oracle', 'Custom API'].map(tag => (
                        <span key={tag} className="px-4 py-2 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 flex flex-col justify-center items-center text-center">
            <Lock size={48} className="text-white mb-6" />
            <h3 className="text-3xl font-semibold text-white mb-4">GovCloud Ready</h3>
            <p className="text-zinc-400 mb-8">SOC2 Type II Compliant. End-to-end encryption for all audio. Private LLM deployment options available for Federal and State agencies.</p>
            <Button variant="secondary">View Security Whitepaper</Button>
        </div>
      </div>
    </div>
  </div>
);

// --- Sub-Pages ---

const MilesPage = () => (
    <div className="pt-32 px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6">
                        <Smartphone size={12} /> Tenentes Miles
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tighter">
                        Field Safety & Readiness.
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        Equip your frontline with an intelligent guardian. Tenentes Miles brings voice-activated logging, haptic hazard alerts, and instant protocol checks to the mobile device.
                    </p>
                    <div className="flex gap-4">
                        <Button>Deploy Miles</Button>
                        <Button variant="outline">View Hardware Support</Button>
                    </div>
                </div>
                <MilesHero />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <Mic className="text-blue-500 mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Ambient Logging</h3>
                    <p className="text-zinc-400">Hands-free data intake. Operators speak naturally; Miles structures the data.</p>
                </div>
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <Zap className="text-amber-500 mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Haptic Warnings</h3>
                    <p className="text-zinc-400">GPS-fenced hazard alerts vibrate the device when crews enter fouling points.</p>
                </div>
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <Fingerprint className="text-green-500 mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Biometric Check-in</h3>
                    <p className="text-zinc-400">Secure shift authentication ensuring only qualified personnel access track rights.</p>
                </div>
            </div>
        </div>
    </div>
);

const OptioPage = () => (
    <div className="pt-32 px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 mb-6">
                    <Monitor size={12} /> Tenentes Optio
                </div>
                <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tighter max-w-4xl">
                    Operational Visibility & Response.
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                    The central nervous system of your transit network. Monitor live dispatch streams, visualize assets in real-time, and catch protocol violations before they become incidents.
                </p>
            </div>
            
            <div className="mb-32">
                <OptioHero />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col justify-center group hover:border-green-500/30 transition-colors">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">Semantic Protocol Enforcement</h3>
                    <p className="text-zinc-400 mb-6">
                        Optio listens to radio traffic. If a dispatcher issues a mandatory directive but fails to get a proper readback, the system flags the channel instantly.
                    </p>
                    <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 font-mono text-xs">
                        <div className="text-green-500 mb-2">&gt;&gt; Listening Channel 4...</div>
                        <div className="text-zinc-500">Disp: "Hold at Signal 42."</div>
                        <div className="text-zinc-500">Unit: "Copy."</div>
                        <div className="text-red-500 mt-2">&gt;&gt; ALERT: Readback incomplete. Flagged.</div>
                    </div>
                </div>
                <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col justify-center group hover:border-blue-500/30 transition-colors">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Unified Asset Map</h3>
                    <p className="text-zinc-400 mb-6">
                        See every bus, train, and MOW crew on a single pane of glass. Filter by risk level, maintenance status, or active communication.
                    </p>
                    <div className="h-40 bg-zinc-800 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PraetorPage = () => (
    <div className="pt-32 px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto">
            {/* Reordered Layout: Hero First (Left), Content Second (Right) on Desktop */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                
                {/* 1. Hero Graphic (Now First) */}
                <PraetorHero />

                {/* 2. Text Content (Now Second) */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 mb-6">
                        <Scale size={12} /> Tenentes Praetor
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tighter">
                        Strategic Governance & Intelligence.
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                        Turn operational chaos into federal compliance. Tenentes Praetor automates NTD reporting, analyzes long-term risk trends, and provides an AI-powered legal memory for your agency.
                    </p>
                    <div className="flex gap-4">
                        <Button>Start Audit</Button>
                        <Button variant="outline">Learn More</Button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <FileOutput className="text-purple-500 mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Auto-NTD Reporting</h3>
                    <p className="text-zinc-400">Generates federal S&S-40 and S&S-50 forms automatically from incident logs.</p>
                </div>
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <History className="text-zinc-200 mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Incident Replay</h3>
                    <p className="text-zinc-400">Reconstruct timelines with synchronized audio, map data, and logs for post-mortems.</p>
                </div>
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                    <BrainCircuit className="text-pink-500 mb-4" size={32} />
                    <h3 className="text-xl font-bold text-white mb-2">Predictive Governance</h3>
                    <p className="text-zinc-400">Identify SOP gaps and training deficiencies before they lead to accidents.</p>
                </div>
            </div>
        </div>
    </div>
);

const PraetorHero = () => {
    // 0: Dashboard, 1: Deviation Monitoring, 2: RCA & Intelligence
    const [activeTab, setActiveTab] = useState(0); 

    // Auto-cycle tabs logic
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab(prev => (prev + 1) % 3);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: 0, label: 'Safety KPIs', icon: BarChart3 },
        { id: 1, label: 'Monitoring', icon: Eye },
        { id: 2, label: 'Intelligence', icon: BrainCircuit }
    ];

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* Main Application Window */}
            <div className="relative z-10 w-[90%] max-w-4xl h-[550px] bg-white text-zinc-900 rounded-xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col transition-all duration-700">
                
                {/* Header / Nav */}
                <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 bg-white shrink-0">
                    <div className="flex items-center gap-2 text-zinc-900 font-bold tracking-tight">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white"><Scale size={18}/></div>
                        <span>Praetor Governance</span>
                    </div>
                    <div className="flex bg-zinc-100 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-xs font-medium flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-purple-700' : 'text-zinc-500 hover:text-zinc-700'}`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 relative bg-zinc-50/50 p-6 overflow-hidden">
                    
                    {/* --- TAB 0: KPI DASHBOARD --- */}
                    <div className={`absolute inset-0 p-6 flex flex-col gap-6 transition-all duration-500 ${activeTab === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
                                <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-2">Safety Score</div>
                                <div className="text-5xl font-bold text-zinc-900 tracking-tighter mb-2">88</div>
                                <div className="text-green-600 text-xs font-medium flex items-center gap-1"><ArrowRight size={10} className="-rotate-45"/> +2.4% vs last month</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-center text-center">
                                <div className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-2">Compliance Rate</div>
                                <div className="text-5xl font-bold text-purple-600 tracking-tighter mb-2">94%</div>
                                <div className="text-zinc-500 text-xs">Target: 98%</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-center gap-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-500">Open Audits</span>
                                    <span className="font-bold">3</span>
                                </div>
                                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-amber-500" /></div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-500">Resolved</span>
                                    <span className="font-bold">12</span>
                                </div>
                                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden"><div className="w-full h-full bg-green-500" /></div>
                            </div>
                        </div>
                        <div className="flex-1 bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 relative">
                            <h3 className="text-sm font-bold text-zinc-800 mb-6">Incident Trend Analysis (6 Months)</h3>
                            <div className="flex items-end justify-between h-32 px-4 gap-4">
                                {/* Simulated bar chart animation */}
                                {[40, 65, 45, 30, 25, 15].map((h, i) => (
                                    <div key={i} className="flex-1 bg-zinc-100 rounded-t-lg relative group">
                                        <div 
                                            className="absolute bottom-0 w-full bg-purple-500 rounded-t-lg transition-all duration-1000 ease-out group-hover:bg-purple-600" 
                                            style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }} 
                                        />
                                        <div className="absolute -bottom-6 w-full text-center text-[10px] text-zinc-400">
                                            {['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'][i]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- TAB 1: DEVIATION MONITORING --- */}
                    <div className={`absolute inset-0 p-6 flex flex-col gap-6 transition-all duration-500 ${activeTab === 1 ? 'opacity-100 translate-x-0' : activeTab < 1 ? 'opacity-0 translate-x-full pointer-events-none' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Live Policy Checks</h3>
                                <p className="text-xs text-zinc-500">Real-time scans against Agency SOP v4.2</p>
                            </div>
                            <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-red-100">
                                <AlertTriangle size={14} /> 1 Critical Deviation Found
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                            <div className="bg-red-50/50 p-4 border-b border-red-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-red-100 text-red-500"><Siren size={20}/></div>
                                    <div>
                                        <div className="text-sm font-bold text-zinc-900">Excessive Speed in Work Zone</div>
                                        <div className="text-xs text-red-500">Rule 202 Violation • Sector 4</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-zinc-400 uppercase">Detected</div>
                                    <div className="text-sm font-mono text-zinc-700">10:42 AM</div>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Evidence Snapshot</div>
                                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 text-xs font-mono text-zinc-600 leading-relaxed">
                                        <span className="text-zinc-400 block mb-2">// TELEMETRY LOG</span>
                                        UNIT_ID: BUS-402<br/>
                                        SPEED: 45 MPH<br/>
                                        LIMIT: 25 MPH<br/>
                                        STATUS: ACTIVE_WORK_ZONE
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Proactive Hazard ID</div>
                                    <div className="flex items-start gap-2 text-sm text-zinc-600">
                                        <BrainCircuit size={16} className="text-purple-500 shrink-0 mt-0.5"/>
                                        <p>AI correlates this deviation with 3 prior warnings in this sector. Risk of collision elevated by 40%.</p>
                                    </div>
                                    <button className="mt-4 w-full py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800">Initiate Intervention</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TAB 2: INTELLIGENCE (RCA) --- */}
                    <div className={`absolute inset-0 p-6 flex flex-col gap-4 transition-all duration-500 ${activeTab === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-purple-600"/>
                            <h3 className="text-sm font-bold text-zinc-900">Root Cause Analysis Engine</h3>
                        </div>
                        
                        <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 relative overflow-hidden flex flex-col items-center justify-center">
                            {/* Node Graph Visualization */}
                            <div className="absolute top-10 flex items-center gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 border border-red-200"><AlertTriangle size={20}/></div>
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase bg-white px-2 py-1 rounded border border-zinc-100">Incident</div>
                                </div>
                                <div className="h-px w-16 bg-zinc-300 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-zinc-300 rotate-45"/></div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 border border-purple-200 animate-pulse"><BrainCircuit size={20}/></div>
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase bg-white px-2 py-1 rounded border border-zinc-100">Analysis</div>
                                </div>
                                <div className="h-px w-16 bg-zinc-300 relative"><div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-zinc-300 rotate-45"/></div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 border border-green-200"><Lightbulb size={20}/></div>
                                    <div className="text-[10px] font-bold text-zinc-600 uppercase bg-white px-2 py-1 rounded border border-zinc-100">Root Cause</div>
                                </div>
                            </div>

                            <div className="mt-24 w-full max-w-md bg-zinc-50 rounded-xl border border-zinc-100 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-zinc-700">AI Findings</span>
                                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Confidence: 92%</span>
                                </div>
                                <p className="text-sm text-zinc-600 mb-4 leading-relaxed">
                                    Primary deviation caused by <span className="font-semibold text-zinc-900">Training Gap</span>. Operator was recently transferred to Sector 4 and has not completed the "Work Zone Safety" refresher module.
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex-1 p-2 bg-white rounded border border-zinc-200 flex items-center gap-2 text-xs text-zinc-600">
                                        <Workflow size={14} className="text-blue-500"/> Recommendation: Schedule Module 4B
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-4 w-full max-w-md">
                                <button className="flex-1 py-2 bg-black text-white text-xs font-medium rounded-lg hover:bg-zinc-800 flex items-center justify-center gap-2">
                                    <FileCheck size={14}/> Generate Report PDF
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -z-10 w-full h-full bg-gradient-to-br from-purple-50 via-white to-white rounded-3xl" />
        </div>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases: LandingPhase[] = [
    { id: 'city', label: 'Network', icon: Building2, alert: { title: 'Grid Congestion', status: 'Rerouting' } },
    { id: 'bus', label: 'Fleet', icon: Bus, alert: { title: 'Engine Temp High', status: 'Vehicle 404' } },
    { id: 'train', label: 'Rail', icon: Train, alert: { title: 'Signal Loss', status: 'Track 4B' } },
    { id: 'software', label: 'Ops', icon: Server, alert: { title: 'Data Latency', status: 'Packet Loss' } },
    { id: 'agency', label: 'Compliance', icon: ShieldCheck, alert: { title: 'SOP Violation', status: 'Reviewing' } }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activePhase = phases[phaseIndex];

  return (
    <div className="animate-in fade-in duration-700">
      <style>{`
        .rotate-x-60 { transform: rotateX(60deg); }
        .rotate-z-45 { transform: rotateZ(45deg); }
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      
      {/* Dynamic 3D Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-24 px-6 overflow-hidden min-h-[80vh] flex flex-col justify-center relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-8 animate-[fadeIn_0.5s_ease-out]">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
               SYSTEM ACTIVE
            </div>
            
            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter text-white mb-8 leading-[0.9]">
              Control your <br />
              <span className="text-zinc-500 transition-all duration-500 inline-block min-w-[300px]">
                {activePhase.label}.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-xl mb-12 font-light leading-relaxed">
              Tenentes unifies communication and compliance. We turn raw radio chatter into organized operational intelligence for transit safety.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
              <Button onClick={() => document.dispatchEvent(new CustomEvent('openModal'))}>
                Test platform now <ArrowRight size={16} />
              </Button>
              <Button variant="outline" onClick={() => setPage('features')}>Explore capabilities</Button>
            </div>
          </div>

          {/* 3D Animation Container */}
          <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center perspective-[1000px]">
             
             {/* The Voxel Grid */}
             <div className="relative z-10 scale-75 md:scale-100">
                <VoxelGrid activePhase={activePhase.id} />
             </div>

             {/* Floating Safety Alert Card */}
             <div 
               key={activePhase.id} 
               className="absolute top-1/4 right-0 lg:right-1/4 z-30 animate-[slideIn_0.5s_ease-out_forwards]"
               style={{ animation: 'float 4s ease-in-out infinite' }}
             >
                <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 p-4 rounded-xl shadow-2xl w-64">
                   <div className="flex justify-between items-start mb-3">
                      <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                        <AlertTriangle size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Risk Detected</span>
                   </div>
                   <h4 className="text-white font-medium mb-1">{activePhase.alert.title}</h4>
                   <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                      {activePhase.alert.status}
                   </div>
                   
                   {/* Decorative Scan Line */}
                   <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-[scan_2s_linear_infinite] pointer-events-none" />
                </div>
             </div>

             {/* Background Glow */}
             <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/0 via-zinc-800/10 to-zinc-500/5 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* Industries */}
      <section className="border-y border-zinc-900 bg-zinc-950/50 overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-8">Trusted by safety teams in</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Municipal Rail', 'Bus Fleets', 'High Speed Rail', 'Federal Transport', 'Emergency Response', 'Port Authority'].map((ind) => (
                  <span key={ind} className="text-xl font-semibold text-white hover:text-white cursor-default transition-colors">{ind}</span>
              ))}
          </div>
        </div>
      </section>

      {/* Value Props Grid - Enhanced with Generative Animation */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BentoCard 
                  size="md"
                  title="Audio Intake" 
                  desc="Seamless integration with dispatch radios. We ingest raw field audio, filter background noise, and transcribe instantly using transit-specific acoustic models."
                  icon={Radio}
                  graphic={<AudioWaveform />}
              />
              <BentoCard 
                  size="sm"
                  title="RAG Compliance" 
                  desc="Answers grounded in FTA/FRA regulations and agency SOPs."
                  icon={Database}
                  graphic={<RAGVisualizer />}
              />
              <BentoCard 
                  size="sm"
                  title="Live Investigation" 
                  desc="Query your operational logs and safety reports using natural language."
                  icon={Search}
                  graphic={<InvestigationTerminal />}
              />
              <BentoCard 
                  size="md"
                  title="Automated Summarization" 
                  desc="Our prompt-engineered models turn radio chatter into structured datasets. Grouping incidents by route, vehicle ID, and severity."
                  icon={FileText}
                  graphic={<SummarizationBlock />}
              />
          </div>
        </div>
      </section>
    </div>
  );
};

const PlatformPage = () => (
  <div className="pt-32 px-6 pb-20 animate-in slide-in-from-bottom-8 duration-700">
    <div className="max-w-7xl mx-auto">
       <SectionHeading 
        center={true}
        badge="The Tenentes Suite"
        title="One platform. Three distinct powers."
        subtitle="A unified operating system for modern transit safety, from the tracks to the boardroom."
      />
      
      {/* 3x3 Matrix / Unified View */}
      <div className="grid md:grid-cols-3 gap-6 mb-32">
          {/* Miles Card */}
          <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Smartphone size={120} />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                      <Smartphone size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tenentes Miles</h3>
                  <p className="text-sm text-zinc-400 mb-6">Field Safety & Readiness</p>
                  <ul className="space-y-2 text-sm text-zinc-500 mb-8">
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Ambient Logging</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Hazard Haptics</li>
                  </ul>
                  <span className="text-white text-sm font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">Explore Miles <ArrowRight size={14}/></span>
              </div>
          </div>

          {/* Optio Card */}
          <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500/50 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Monitor size={120} />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6 border border-green-500/20">
                      <Layers size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tenentes Optio</h3>
                  <p className="text-sm text-zinc-400 mb-6">Operational Visibility</p>
                  <ul className="space-y-2 text-sm text-zinc-500 mb-8">
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Protocol Flags</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Live Risk Map</li>
                  </ul>
                  <span className="text-white text-sm font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">Explore Optio <ArrowRight size={14}/></span>
              </div>
          </div>

          {/* Praetor Card */}
          <div className="group bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Scale size={120} />
              </div>
              <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6 border border-purple-500/20">
                      <Scale size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tenentes Praetor</h3>
                  <p className="text-sm text-zinc-400 mb-6">Strategic Governance</p>
                  <ul className="space-y-2 text-sm text-zinc-500 mb-8">
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500"/> Auto-NTD Reports</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500"/> Audit Trail</li>
                  </ul>
                  <span className="text-white text-sm font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform">Explore Praetor <ArrowRight size={14}/></span>
              </div>
          </div>
      </div>

      <SectionHeading 
        badge="Unified Architecture"
        title="Built on the same core intelligence."
        subtitle="Data flows seamlessly from Miles (Field) to Optio (Ops) to Praetor (Governance)."
      />
      
      {/* Reusing the Voxel Grid to show unified underlying tech */}
      <div className="flex justify-center py-12">
         {/* Simple version of VoxelGrid for Platform page specifically */}
         <div className="relative w-64 h-64 perspective-[800px]">
            <div className="w-full h-full bg-zinc-800/20 rounded-full blur-3xl absolute top-0 left-0" />
            {/* Abstract visual placeholder for unified data core */}
            <div className="w-full h-full flex items-center justify-center">
                <Database size={64} className="text-zinc-700" />
            </div>
         </div>
      </div>

    </div>
  </div>
);

// --- Main Layout ---

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    document.addEventListener('openModal', handleOpenModal);
    return () => document.removeEventListener('openModal', handleOpenModal);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-white/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="text-xl font-bold tracking-widest cursor-pointer select-none" 
            onClick={() => setCurrentPage('home')}
          >
            TENENTES
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Platform Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsPlatformMenuOpen(true)} onMouseLeave={() => setIsPlatformMenuOpen(false)}>
                <button 
                    onClick={() => setCurrentPage('platform')}
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${['platform', 'miles', 'optio', 'praetor'].includes(currentPage) ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                    Platform <ChevronDown size={14} className={`transition-transform duration-300 ${isPlatformMenuOpen ? 'rotate-180' : ''}`}/>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${isPlatformMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}`}>
                    <div className="w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl grid gap-1">
                        <button onClick={() => {setCurrentPage('platform'); setIsPlatformMenuOpen(false)}} className="p-3 hover:bg-zinc-800 rounded-xl text-left group/item">
                            <div className="text-white font-medium text-sm flex items-center gap-2">Tenentes Suite <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity"/></div>
                            <div className="text-zinc-500 text-xs">Overview of all platforms</div>
                        </button>
                        <div className="h-px bg-zinc-800 my-1 mx-2" />
                        <button onClick={() => {setCurrentPage('miles'); setIsPlatformMenuOpen(false)}} className="p-3 hover:bg-zinc-800 rounded-xl text-left flex items-start gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Smartphone size={16}/></div>
                            <div>
                                <div className="text-white font-medium text-sm">Tenentes Miles</div>
                                <div className="text-zinc-500 text-xs">Field Safety & Readiness</div>
                            </div>
                        </button>
                        <button onClick={() => {setCurrentPage('optio'); setIsPlatformMenuOpen(false)}} className="p-3 hover:bg-zinc-800 rounded-xl text-left flex items-start gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Monitor size={16}/></div>
                            <div>
                                <div className="text-white font-medium text-sm">Tenentes Optio</div>
                                <div className="text-zinc-500 text-xs">Ops Visibility & Response</div>
                            </div>
                        </button>
                        <button onClick={() => {setCurrentPage('praetor'); setIsPlatformMenuOpen(false)}} className="p-3 hover:bg-zinc-800 rounded-xl text-left flex items-start gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Scale size={16}/></div>
                            <div>
                                <div className="text-white font-medium text-sm">Tenentes Praetor</div>
                                <div className="text-zinc-500 text-xs">Strategic Governance</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <button onClick={() => setCurrentPage('features')} className={`text-sm font-medium transition-colors ${currentPage === 'features' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>Features</button>
            <button onClick={() => setCurrentPage('integration')} className={`text-sm font-medium transition-colors ${currentPage === 'integration' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>Integration</button>
          </div>

          <div className="hidden md:block">
            <Button size="sm" onClick={() => setIsModalOpen(true)}>Test Platform</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-800 p-6 flex flex-col gap-6">
            <div className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Platform</div>
            <button onClick={() => {setCurrentPage('miles'); setIsMenuOpen(false);}} className="text-lg text-left text-white pl-4 border-l border-blue-500">Tenentes Miles</button>
            <button onClick={() => {setCurrentPage('optio'); setIsMenuOpen(false);}} className="text-lg text-left text-white pl-4 border-l border-green-500">Tenentes Optio</button>
            <button onClick={() => {setCurrentPage('praetor'); setIsMenuOpen(false);}} className="text-lg text-left text-white pl-4 border-l border-purple-500">Tenentes Praetor</button>
            <div className="h-px bg-zinc-800" />
            <button onClick={() => {setCurrentPage('features'); setIsMenuOpen(false);}} className="text-lg text-left text-zinc-300">Features</button>
            <button onClick={() => {setCurrentPage('integration'); setIsMenuOpen(false);}} className="text-lg text-left text-zinc-300">Integration</button>
            <Button onClick={() => {setIsModalOpen(true); setIsMenuOpen(false);}}>Test Platform Now</Button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        {currentPage === 'home' && <LandingPage setPage={setCurrentPage} />}
        {currentPage === 'platform' && <PlatformPage />}
        {currentPage === 'miles' && <MilesPage />}
        {currentPage === 'optio' && <OptioPage />}
        {currentPage === 'praetor' && <PraetorPage />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'integration' && <IntegrationPage />}
      </main>

      {/* CTA Section (Visible on all pages) */}
      <section className="py-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4">Ready to listen?</h2>
            <p className="text-zinc-600 max-w-md">Join the forward-thinking transit agencies transforming operations.</p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <Button variant="secondary" className="justify-center border-zinc-200 bg-black text-white hover:bg-zinc-800" onClick={() => setIsModalOpen(true)}>
                Request Pricing & Demo
             </Button>
             <p className="text-xs text-zinc-500 text-center">No RFP required for sandbox access.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold tracking-widest mb-6">TENENTES</h4>
            <p className="text-zinc-500 text-sm">
              Operations control for transit.
              <br />San Francisco, CA
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-medium mb-4">Platform</h5>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentPage('miles')}>Tenentes Miles</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentPage('optio')}>Tenentes Optio</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentPage('praetor')}>Tenentes Praetor</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-medium mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Press</li>
            </ul>
          </div>

          <div>
             <h5 className="text-white font-medium mb-4">Connect</h5>
             <ul className="space-y-2 text-sm text-zinc-500">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><Globe size={14}/> LinkedIn</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><MessageSquareText size={14}/> Contact Support</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between text-xs text-zinc-600">
          <p>© 2024 Tenentes Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
