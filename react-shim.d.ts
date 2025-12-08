// Minimal React and icon module shims for offline TypeScript checking

declare module 'react' {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => any;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }): any;
  }
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export type MouseEventHandler<T = any> = (event: any) => void;

  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;

  const React: { createElement: any };
  export default React;
  export as namespace React;

  // Namespace-style types for React.FC usage
  namespace React {
    export type FC<P = {}> = (props: P & { children?: ReactNode }) => any;
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'lucide-react' {
  import type { FC } from 'react';
  export type LucideIcon = FC<{ size?: number; className?: string }>;
  export const Mic: LucideIcon;
  export const Activity: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Cpu: LucideIcon;
  export const Radio: LucideIcon;
  export const Zap: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const Database: LucideIcon;
  export const MessageSquareText: LucideIcon;
  export const FileText: LucideIcon;
  export const Lock: LucideIcon;
  export const Globe: LucideIcon;
  export const Search: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Train: LucideIcon;
  export const Bus: LucideIcon;
  export const Building2: LucideIcon;
  export const Server: LucideIcon;
  export const MapPin: LucideIcon;
  export const Clock: LucideIcon;
  export const User: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Send: LucideIcon;
  export const Sparkles: LucideIcon;
  export const BarChart3: LucideIcon;
  export const ListFilter: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Tablet: LucideIcon;
  export const Monitor: LucideIcon;
  export const Siren: LucideIcon;
  export const ClipboardCheck: LucideIcon;
  export const FileBadge: LucideIcon;
  export const Eye: LucideIcon;
  export const History: LucideIcon;
  export const FileOutput: LucideIcon;
  export const BrainCircuit: LucideIcon;
  export const RadioReceiver: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Layers: LucideIcon;
  export const Fingerprint: LucideIcon;
  export const GanttChartSquare: LucideIcon;
  export const Scale: LucideIcon;
  export const Settings: LucideIcon;
  export const Sliders: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Gauge: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Workflow: LucideIcon;
  export const FileCheck: LucideIcon;
}
