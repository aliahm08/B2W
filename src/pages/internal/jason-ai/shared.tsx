import ClientNavbar, { type ClientNavAction } from '../../../components/ClientNavbar';

export const jasonAIInternalBasePath = '/internal/jason-ai';

export const jasonAIInternalRoutes = {
  proposal: jasonAIInternalBasePath,
  profile: `${jasonAIInternalBasePath}/profile`,
  valuation: `${jasonAIInternalBasePath}/valuation`,
  documentation: `${jasonAIInternalBasePath}/documentation`,
} as const;

export const jasonAIInternalNavItems: ClientNavAction[] = [
  { label: 'Executive Strategy', to: `${jasonAIInternalRoutes.proposal}#j-curve` },
];

export function JasonAIInternalNavbar() {
  return (
    <ClientNavbar
      clientName="JasonAI"
      clientLink={jasonAIInternalRoutes.proposal}
      navItems={jasonAIInternalNavItems}
    />
  );
}
