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
import UyghurEatsBasicPreviewPage from './pages/projects/uyghur-eats/previews/ValuationModelPage';
import UyghurEatsValuationModelPage from './pages/projects/uyghur-eats/ValuationModelPage';
import UyghurEatsDataRoomPage from './pages/projects/uyghur-eats/previews/DataRoomPage';
import CapabilityPage from './pages/capabilities/CapabilityPage';
import CapabilitiesIndex from './pages/capabilities/CapabilitiesIndex';
import Seo from './components/Seo';
import NotFound from './components/NotFound';
import SabucnuProfilePage from './pages/projects/sabucnu/ProfilePage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
  const isIsolatedView = isClientPortal || isDataRoom || isProjectPage || hasReturnParam;

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
          <Route path="/uyghur-eats" element={<UyghurEatsProfilePage />} />
          <Route path="/uyghur-eats-valuation" element={<UyghurEatsBasicPreviewPage />} />
          <Route path="/uyghur-eats-valuation-model" element={<UyghurEatsValuationModelPage />} />
          <Route path="/uyghur-eats-data-room" element={<UyghurEatsDataRoomPage />} />
          <Route path="/capabilities" element={<CapabilitiesIndex />} />
          <Route path="/capabilities/:slug" element={<CapabilityPage />} />
          <Route path="/sabucnu-operations" element={<SabucnuProfilePage />} />
          <Route path="/client/uyghur-eats" element={<UyghurEatsClientPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isIsolatedView && <Footer />}
      <AssistantWidget />
    </div>
  );
}
