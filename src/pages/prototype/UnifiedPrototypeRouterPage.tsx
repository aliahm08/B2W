import { useLocation } from 'react-router-dom';
import {
  UnifiedGuidePage,
  UnifiedResourcesPage,
  UnifiedServicesPage,
} from './UnifiedPrototypePages';
import {
  UnifiedAboutPage,
  UnifiedAgentsPage,
  UnifiedContactPage,
  UnifiedPricingPage,
  UnifiedProductsPage,
  UnifiedStructuredHomePage,
  UnifiedWorkflowsPage,
} from './UnifiedStructurePages';

export default function UnifiedPrototypeRouterPage() {
  const { pathname } = useLocation();

  if (pathname === '/prototype/services') return <UnifiedServicesPage />;
  if (pathname === '/prototype/products') return <UnifiedProductsPage />;
  if (pathname === '/prototype/products/agents' || pathname === '/prototype/jasonai') return <UnifiedAgentsPage />;
  if (pathname === '/prototype/products/workflows') return <UnifiedWorkflowsPage />;
  if (pathname === '/prototype/products/pricing') return <UnifiedPricingPage />;
  if (pathname === '/prototype/resources') return <UnifiedResourcesPage />;
  if (pathname === '/prototype/guide') return <UnifiedGuidePage />;
  if (pathname === '/prototype/about') return <UnifiedAboutPage />;
  if (pathname === '/prototype/contact') return <UnifiedContactPage />;

  return <UnifiedStructuredHomePage />;
}
