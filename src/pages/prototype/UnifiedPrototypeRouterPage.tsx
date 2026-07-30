import { useLocation } from 'react-router-dom';
import {
  UnifiedGuidePage,
  UnifiedHomePage,
  UnifiedJasonAIPage,
  UnifiedResourcesPage,
  UnifiedServicesPage,
} from './UnifiedPrototypePages';

export default function UnifiedPrototypeRouterPage() {
  const { pathname } = useLocation();

  if (pathname === '/prototype/services') return <UnifiedServicesPage />;
  if (pathname === '/prototype/jasonai') return <UnifiedJasonAIPage />;
  if (pathname === '/prototype/resources') return <UnifiedResourcesPage />;
  if (pathname === '/prototype/guide') return <UnifiedGuidePage />;

  return <UnifiedHomePage />;
}
