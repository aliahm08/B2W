/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import Industries from './components/Industries';
import Team from './components/Team';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import BorekG from './pages/BorekG';
import UyghurEats from './pages/UyghurEats';
import CapabilityPage from './pages/CapabilityPage';
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
      <section id="industries">
        <Industries />
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
          <Route path="/borek-g" element={<BorekG />} />
          <Route path="/uyghur-eats" element={<UyghurEats />} />
          <Route path="/capabilities/:slug" element={<CapabilityPage />} />
        </Routes>
      </main>
      <Footer />
      <AssistantWidget />
    </div>
  );
}
