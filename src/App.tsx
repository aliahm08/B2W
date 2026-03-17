/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import Industries from './components/Industries';
import Team from './components/Team';
import OurProcess from './components/OurProcess';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import BorekGProfilePage from './pages/projects/borek-g/ProfilePage';
import BorekGProposalPage from './pages/projects/borek-g/ProposalPage';
import UyghurEatsProfilePage from './pages/projects/uyghur-eats/ProfilePage';
import UyghurEatsProposalPage from './pages/projects/uyghur-eats/ProposalPage';
import UyghurEatsAiAgentPreviewPage from './pages/projects/uyghur-eats/previews/AiAgentPreviewPage';
import UyghurEatsBasicPreviewPage from './pages/projects/uyghur-eats/previews/BasicPreviewPage';
import CapabilityPage from './pages/capabilities/CapabilityPage';
import Seo from './components/Seo';

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
        title="AI Consulting for Operations, Logistics, and Growth"
        description="B2W builds practical AI systems for hospitality, retail, transportation, government, and real estate teams focused on measurable operational results."
      />
      <Hero />
      <Work />
      <section id="projects">
        <Industries />
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
  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-black selection:text-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/borek-g-social-media-management" element={<BorekGProfilePage />} />
          <Route path="/borek-g" element={<Navigate to="/borek-g-social-media-management" replace />} />
          <Route path="/borek-g-operations" element={<BorekGProposalPage />} />
          <Route path="/uyghur-eats" element={<UyghurEatsProfilePage />} />
          <Route path="/uyghur-eats-acquisition" element={<UyghurEatsProposalPage />} />
          <Route path="/uyghur-eats-basic-profile-preview" element={<UyghurEatsBasicPreviewPage />} />
          <Route path="/uyghur-eats-ai-agent-preview" element={<UyghurEatsAiAgentPreviewPage />} />
          <Route path="/capabilities/:slug" element={<CapabilityPage />} />
        </Routes>
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  );
}
