import ClientNavbar, { type ClientNavAction } from '../../../components/ClientNavbar';

export const jasonAIInternalBasePath = '/internal/jason-ai';

export const jasonAIInternalRoutes = {
  proposal: jasonAIInternalBasePath,
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
  { label: 'Strategy Overview', to: `${jasonAIInternalRoutes.proposal}#j-curve` },
  { label: 'KPI Tracker', to: `${jasonAIInternalRoutes.proposal}#kpi-tracker` },
  { label: 'Executive Strategy', to: jasonAIInternalRoutes.executiveStrategy },
  jasonAIExecutiveStrategyDownloadItem,
];

export function JasonAIInternalNavbar({ navItems = jasonAIInternalNavItems }: { navItems?: ClientNavAction[] }) {
  return (
    <ClientNavbar
      clientName="JasonAI"
      clientLink={jasonAIInternalRoutes.proposal}
      navItems={navItems}
    />
  );
}
