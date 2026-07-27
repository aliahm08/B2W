import ClientNavbar, { type ClientNavAction } from '../../../components/ClientNavbar';
import { BarChart3, ClipboardCheck, FileText, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const jasonAIInternalBasePath = '/internal/jason-ai';

export const jasonAIInternalRoutes = {
  proposal: jasonAIInternalBasePath,
  performanceGoals: `${jasonAIInternalBasePath}/performance-goals`,
  kpiTracker: `${jasonAIInternalBasePath}/kpi-tracker`,
  executiveStrategy: `${jasonAIInternalBasePath}/executive-strategy`,
  profile: `${jasonAIInternalBasePath}/profile`,
  valuation: `${jasonAIInternalBasePath}/valuation`,
  documentation: `${jasonAIInternalBasePath}/documentation`,
} as const;

export const jasonAIExecutiveStrategyDownloadItem: ClientNavAction = {
  label: 'Download',
  type: 'cta',
  items: [
    {
      label: 'Download Original',
      href: '/documents/jasonai-executive-strategy.pdf',
      download: 'JasonAI-Executive-Strategy-Original.pdf',
    },
    {
      label: 'Download Current',
      onClick: () => {
        void import('./downloadCurrentExecutiveStrategy').then(({ downloadCurrentExecutiveStrategy }) =>
          downloadCurrentExecutiveStrategy(),
        );
      },
    },
  ],
};

export const jasonAIInternalNavItems: ClientNavAction[] = [
  { label: 'Home', to: jasonAIInternalRoutes.proposal },
  { label: 'Performance Goals', to: jasonAIInternalRoutes.performanceGoals },
  { label: 'KPI Tracker', to: jasonAIInternalRoutes.kpiTracker },
  { label: 'Executive Report', to: jasonAIInternalRoutes.executiveStrategy },
  jasonAIExecutiveStrategyDownloadItem,
];

export function JasonAIInternalNavbar({ navItems = jasonAIInternalNavItems }: { navItems?: ClientNavAction[] }) {
  return (
    <>
      <ClientNavbar
        clientName="JasonAI"
        clientLink={jasonAIInternalRoutes.proposal}
        navItems={navItems}
      />
      <nav
        aria-label="JasonAI mobile app"
        className="fixed inset-x-0 bottom-0 z-[80] border-t border-neutral-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(0,0,0,.08)] backdrop-blur-xl md:hidden"
      >
        <div className="grid grid-cols-4">
          {[
            { label: 'Home', to: jasonAIInternalRoutes.proposal, Icon: Home, end: true },
            { label: 'Goals', to: jasonAIInternalRoutes.performanceGoals, Icon: BarChart3 },
            { label: 'Track', to: jasonAIInternalRoutes.kpiTracker, Icon: ClipboardCheck },
            { label: 'Report', to: jasonAIInternalRoutes.executiveStrategy, Icon: FileText },
          ].map(({ label, to, Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-medium transition ${
                  isActive ? 'bg-neutral-950 text-white' : 'text-neutral-500'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
