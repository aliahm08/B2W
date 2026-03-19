/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ClientNavbar from './components/ClientNavbar';
import Hero from './components/Hero';
import CapabilitiesVisualization from './components/CapabilitiesVisualization';
import Expertise from './components/Expertise';
import ProjectShowcase from './components/ProjectShowcase';
import Team from './components/Team';
import OurProcess from './components/OurProcess';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import BorekGProfilePage from './pages/projects/borek-g/ProfilePage';
import BorekGProposalPage from './pages/projects/borek-g/ProposalPage';
import UyghurEatsProfilePage from './pages/projects/uyghur-eats/ProfilePage';
import UyghurEatsClientPortal from './pages/client/UyghurEatsClientPortal';
import UyghurEatsTermsPage from './pages/client/UyghurEatsTermsPage';
import UyghurEatsPortalV1 from './app/client/uyghur-eats-v1/page';
import UyghurEatsPortalV2 from './app/client/uyghur-eats-v2/page';
import UyghurEatsPortalV3 from './app/client/uyghur-eats-v3/page';
import UyghurEatsPortalV4 from './app/client/uyghur-eats-v4/page';
import UyghurEatsPortalV4PropertyProfile from './app/client/uyghur-eats-v4/property-profile';
import UyghurEatsPortalV4ValuationModel from './app/client/uyghur-eats-v4/valuation-model';
import UyghurEatsPortalV4OpsDashboard from './app/client/uyghur-eats-v4/ops-dashboard';
import UyghurEatsPortalV5 from './app/client/uyghur-eats-v5/page';
import UyghurEatsPortalV5PropertyProfile from './app/client/uyghur-eats-v5/property-profile';
import UyghurEatsPortalV5ValuationModel from './app/client/uyghur-eats-v5/valuation-model';
import UyghurEatsPortalV5OpsDashboard from './app/client/uyghur-eats-v5/ops-dashboard';
import UyghurEatsProposalHub from './app/portal/uyghur-eats/page';
import PropertyProfile from './app/portal/uyghur-eats/property-profile';
import ValuationModel from './app/portal/uyghur-eats/valuation-model';
import OpsDashboard from './app/portal/uyghur-eats/ops-dashboard';
import UyghurEatsBasicPreviewPage from './pages/projects/uyghur-eats/previews/ValuationModelPage';
import UyghurEatsValuationModelPage from './pages/projects/uyghur-eats/ValuationModelPage';
import UyghurEatsDataRoomPage from './pages/projects/uyghur-eats/previews/DataRoomPage';
import CapabilityPage from './pages/capabilities/CapabilityPage';
import CapabilitiesIndex from './pages/capabilities/CapabilitiesIndex';
import ServiceProjectPage from './pages/ServiceProjectPage';
import Seo from './components/Seo';
import NotFound from './components/NotFound';
import SabucnuProfilePage from './pages/projects/sabucnu/ProfilePage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/client/uyghur-eats/valuation') && hash) {
      return;
    }

    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function LandingPage() {
  return (
    <>
      <Seo
        title="B2W | Consulting for Small to Midsize Businesses"
        description="B2W helps small and midsize businesses analyze performance, identify operational gaps, and deploy modern tools to support sustainable expansion."
      />
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

export default function App() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isClientPortal = location.pathname.startsWith('/client/');
  const isDataRoom = location.pathname.includes('-data-room');
  const isProjectPage = location.pathname.includes('-operations') || 
                        location.pathname.includes('-social-media-management') ||
                        location.pathname.includes('-valuation-model');
  const hasReturnParam = searchParams.has('return');
  const isIsolatedView = isClientPortal || isDataRoom || isProjectPage || hasReturnParam || location.pathname.startsWith('/portal/');

  let clientName: string | undefined = undefined;
  if (location.pathname.includes('uyghur-eats')) {
    clientName = "Uyghur Eats";
  }

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-black selection:text-white">
      <ScrollToTop />
      {!isIsolatedView && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/borek-g-social-media-management" element={<BorekGProfilePage />} />
          <Route path="/borek-g-operations" element={<BorekGProposalPage />} />
          <Route path="/borek-g" element={<Navigate to="/borek-g-social-media-management" replace />} />
          <Route path="/client/uyghur-eats-v1/*" element={<UyghurEatsPortalV1 />} />
          <Route path="/client/uyghur-eats-v2/*" element={<UyghurEatsPortalV2 />} />
          <Route path="/client/uyghur-eats" element={<UyghurEatsClientPortal />} />
          <Route path="/client/uyghur-eats-v3/*" element={<UyghurEatsPortalV3 />} />
          <Route path="/client/uyghur-eats-v4" element={<UyghurEatsPortalV4 />} />
          <Route path="/client/uyghur-eats-v4/ad" element={<UyghurEatsPortalV4PropertyProfile />} />
          <Route path="/client/uyghur-eats-v4/analysis" element={<UyghurEatsPortalV4ValuationModel />} />
          <Route path="/client/uyghur-eats-v4/dashboard" element={<UyghurEatsPortalV4OpsDashboard />} />
          <Route path="/client/uyghur-eats-v5" element={<UyghurEatsPortalV5 />} />
          <Route path="/client/uyghur-eats-v5/ad" element={<UyghurEatsPortalV5PropertyProfile />} />
          <Route path="/client/uyghur-eats-v5/analysis" element={<UyghurEatsPortalV5ValuationModel />} />
          <Route path="/client/uyghur-eats-v5/dashboard" element={<UyghurEatsPortalV5OpsDashboard />} />
          <Route path="/portal/uyghur-eats" element={<UyghurEatsProposalHub />} />
          <Route path="/portal/uyghur-eats/ad" element={<PropertyProfile />} />
          <Route path="/portal/uyghur-eats/analysis" element={<ValuationModel />} />
          <Route path="/portal/uyghur-eats/dashboard" element={<OpsDashboard />} />
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
      </main>
      {!isIsolatedView && <Footer />}
      <AssistantWidget />
    </div>
  );
}
