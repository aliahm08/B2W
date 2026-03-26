/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CapabilitiesVisualization from './components/CapabilitiesVisualization';
import Expertise from './components/Expertise';
import ProjectShowcase from './components/ProjectShowcase';
import Team from './components/Team';
import OurProcess from './components/OurProcess';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import Seo from './components/Seo';
import NotFound from './components/NotFound';
import { scrollToHashTarget } from './lib/hashNavigation';
import HomeTestOnePage from './pages/HomeTestOnePage';

const BorekGProfilePage = lazy(() => import('./pages/projects/borek-g/ProfilePage'));
const BorekGProposalPage = lazy(() => import('./pages/projects/borek-g/ProposalPage'));
const UyghurEatsProfilePage = lazy(() => import('./pages/projects/uyghur-eats/ProfilePage'));
const UyghurEatsClientPortal = lazy(() => import('./pages/client/UyghurEatsClientPortal'));
const UyghurEatsTermsPage = lazy(() => import('./pages/client/UyghurEatsTermsPage'));
const UyghurEatsBasicPreviewPage = lazy(() => import('./pages/projects/uyghur-eats/previews/ValuationModelPage'));
const UyghurEatsValuationModelPage = lazy(() => import('./pages/projects/uyghur-eats/ValuationModelPage'));
const UyghurEatsDataRoomPage = lazy(() => import('./pages/projects/uyghur-eats/previews/DataRoomPage'));
const CapabilityPage = lazy(() => import('./pages/capabilities/CapabilityPage'));
const KitchenPage = lazy(() => import('./pages/capabilities/KitchenPage'));
const DataExplainerPage = lazy(() => import('./pages/capabilities/DataExplainerPage'));
const ServiceProjectPage = lazy(() => import('./pages/ServiceProjectPage'));
const SabucnuProfilePage = lazy(() => import('./pages/projects/sabucnu/ProfilePage'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/client/uyghur-eats/valuation') && hash) {
      return;
    }

    if (hash) {
      const attemptScroll = () => {
        if (scrollToHashTarget(hash)) {
          return;
        }

        window.setTimeout(() => {
          scrollToHashTarget(hash);
        }, 180);
      };

      window.requestAnimationFrame(attemptScroll);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function LandingPage() {
  return (
    <>
      <Seo />
      <Hero />
      <section id="capabilities">
        <CapabilitiesVisualization />
      </section>
      <section id="expertise">
        <Expertise />
      </section>
      <section id="projects">
        <ProjectShowcase />
      </section>
      <section id="process">
        <OurProcess />
      </section>
      <section id="team">
        <Team />
      </section>
      <section id="contact">
        <CTA />
      </section>
    </>
  );
}

function RouteLoadingFallback() {
  return <div className="min-h-[40vh] bg-white" aria-hidden="true" />;
}

export default function App() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isClientPortal = location.pathname.startsWith('/client/');
  const isDataRoom = location.pathname.includes('-data-room');
  const isPrototypeHome = location.pathname === '/home-test-1';
  const isProjectPage = location.pathname.includes('-operations') || 
                        location.pathname.includes('-social-media-management') ||
                        location.pathname.includes('-valuation-model');
  const hasReturnParam = searchParams.has('return');
  const isIsolatedView = isClientPortal || isDataRoom || isProjectPage || hasReturnParam || isPrototypeHome;

  let clientName: string | undefined = undefined;
  if (location.pathname.includes('uyghur-eats')) {
    clientName = "Uyghur Eats";
  }

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-black selection:text-white">
      <ScrollToTop />
      {!isIsolatedView && <Navbar />}
      <main>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home-test-1" element={<HomeTestOnePage />} />
            <Route path="/borek-g-social-media-management" element={<BorekGProfilePage />} />
            <Route path="/borek-g-operations" element={<BorekGProposalPage />} />
            <Route path="/borek-g" element={<Navigate to="/borek-g-social-media-management" replace />} />
            <Route path="/capabilities" element={<KitchenPage />} />
            <Route path="/capabilities/marketing-data" element={<DataExplainerPage />} />
            <Route path="/capabilities/financials" element={<DataExplainerPage />} />
            <Route path="/capabilities/operational-performance" element={<DataExplainerPage />} />
            <Route path="/capabilities/:slug" element={<CapabilityPage />} />
            <Route path="/sabucnu-operations" element={<SabucnuProfilePage />} />
            {/* Legacy Uyghur Eats client variants remain on disk but are intentionally archived.
                Reactivate them by restoring imports/routes documented in docs/legacy-client-archives.md. */}
            <Route path="/client/uyghur-eats" element={<UyghurEatsClientPortal />} />
            <Route path="/client/uyghur-eats/terms" element={<UyghurEatsTermsPage />} />
            <Route path="/client/uyghur-eats/:section" element={<UyghurEatsClientPortal />} />
            <Route path="/client/uyghur-eats/profile" element={<UyghurEatsProfilePage />} />
            <Route path="/client/uyghur-eats/opportunity" element={<Navigate to="/client/uyghur-eats/profile" replace />} />
            <Route path="/client/uyghur-eats/valuation" element={<UyghurEatsValuationModelPage />} />
            <Route path="/client/uyghur-eats/data-room" element={<UyghurEatsDataRoomPage />} />
            
            {/* Redirects for legacy routes */}
            <Route path="/uyghur-eats" element={<Navigate to="/client/uyghur-eats/profile" replace />} />
            <Route path="/uyghur-eats-valuation-model" element={<Navigate to="/client/uyghur-eats/valuation" replace />} />
            <Route path="/uyghur-eats-data-room" element={<Navigate to="/client/uyghur-eats/data-room" replace />} />
            
            <Route path="/uyghur-eats-valuation" element={<UyghurEatsBasicPreviewPage />} />
            <Route path="/services/marketing-advisory" element={<ServiceProjectPage />} />
            <Route path="/services/financial-review" element={<ServiceProjectPage />} />
            <Route path="/services/operations-implementation" element={<ServiceProjectPage />} />
            <Route path="/services/business-revamp" element={<ServiceProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isIsolatedView && <Footer />}
      <AssistantWidget />
    </div>
  );
}
