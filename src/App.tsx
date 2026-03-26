/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CapabilitiesVisualization from './components/CapabilitiesVisualization';
import Expertise from './components/Expertise';
import ProjectShowcase from './components/ProjectShowcase';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import Seo from './components/Seo';
import NotFound from './components/NotFound';
import ProjectBuilderDrawer from './components/ProjectBuilderDrawer';
import { ArrowUpRight } from 'lucide-react';
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
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ExpertisePage = lazy(() => import('./pages/ExpertisePage'));
const KitchenPreviewPage = lazy(() => import('./pages/kitchen/KitchenPreviewPage'));
const OriginalKitchenDemoPage = lazy(() => import('./pages/kitchen/OriginalKitchenDemoPage'));
const SolutionTemplatePage = lazy(() => import('./pages/solutions/SolutionTemplatePage'));

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

function LandingPage({
  onHeroVisibilityChange,
  onOfferClick,
}: {
  onHeroVisibilityChange: (isVisible: boolean) => void;
  onOfferClick: () => void;
}) {
  const [showProjectButton, setShowProjectButton] = useState(false);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);
  const [isHeroOfferDismissed, setIsHeroOfferDismissed] = useState(false);

  useEffect(() => {
    const heroElement = document.getElementById('landing-hero');

    if (!heroElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowProjectButton(!entry.isIntersecting);
        onHeroVisibilityChange(entry.isIntersecting);
      },
      {
        threshold: 0.12,
      },
    );

    observer.observe(heroElement);
    return () => {
      observer.disconnect();
      onHeroVisibilityChange(false);
    };
  }, [onHeroVisibilityChange]);

  return (
    <>
      <Seo />
      <Hero
        onPrimaryAction={() => setIsProjectDrawerOpen(true)}
        showOfferBanner={!showProjectButton && !isHeroOfferDismissed}
        onOfferClick={onOfferClick}
        onOfferClose={() => setIsHeroOfferDismissed(true)}
      />
      <section id="capabilities">
        <CapabilitiesVisualization />
      </section>
      <section id="expertise">
        <Expertise />
      </section>
      <section id="projects">
        <ProjectShowcase />
      </section>
      <section id="contact">
        <CTA />
      </section>
      <AnimatePresence>
        {showProjectButton ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 md:bottom-10"
          >
            <button
              type="button"
              onClick={() => setIsProjectDrawerOpen(true)}
              aria-label="Begin Your Project"
              className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-black text-white shadow-[0_20px_50px_rgba(0,0,0,0.22)] transition-colors hover:bg-neutral-800 h-12 w-12 md:h-auto md:w-auto md:px-8 md:py-4 md:text-base md:font-semibold"
            >
              <ArrowUpRight className="h-5 w-5 md:hidden" />
              <span className="hidden md:inline">Begin Your Project</span>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <ProjectBuilderDrawer isOpen={isProjectDrawerOpen} onClose={() => setIsProjectDrawerOpen(false)} />
    </>
  );
}

function RouteLoadingFallback() {
  return <div className="min-h-[40vh] bg-white" aria-hidden="true" />;
}

export default function App() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLandingHeroVisible, setIsLandingHeroVisible] = useState(false);
  const [isHeaderOfferDismissed, setIsHeaderOfferDismissed] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsLandingHeroVisible(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsHeaderOfferDismissed(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isLandingHeroVisible) {
      setIsHeaderOfferDismissed(false);
    }
  }, [isLandingHeroVisible]);

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
      {!isIsolatedView && (
        <Navbar
          showOfferBanner={location.pathname === '/' && !isLandingHeroVisible && !isHeaderOfferDismissed}
          onOfferClick={() => {
            window.location.hash = 'contact';
          }}
          onOfferClose={() => setIsHeaderOfferDismissed(true)}
        />
      )}
      <main>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  onHeroVisibilityChange={setIsLandingHeroVisible}
                  onOfferClick={() => {
                    const contact = document.getElementById('contact');
                    contact?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                />
              }
            />
            <Route path="/home-test-1" element={<HomeTestOnePage />} />
            <Route path="/borek-g-social-media-management" element={<BorekGProfilePage />} />
            <Route path="/borek-g-operations" element={<BorekGProposalPage />} />
            <Route path="/borek-g" element={<Navigate to="/borek-g-social-media-management" replace />} />
            <Route path="/capabilities" element={<Navigate to="/kitchen" replace />} />
            <Route path="/kitchen" element={<KitchenPage />} />
            <Route path="/kitchen/demo/original" element={<OriginalKitchenDemoPage />} />
            <Route path="/kitchen/preview/:slug" element={<KitchenPreviewPage />} />
            <Route path="/solutions/:slug" element={<SolutionTemplatePage />} />
            <Route path="/capabilities/marketing-data" element={<DataExplainerPage />} />
            <Route path="/capabilities/financials" element={<DataExplainerPage />} />
            <Route path="/capabilities/operational-performance" element={<DataExplainerPage />} />
            <Route path="/capabilities/:slug" element={<CapabilityPage />} />
            <Route path="/expertise/:slug" element={<ExpertisePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/process" element={<Navigate to="/about#process" replace />} />
            <Route path="/about/team" element={<Navigate to="/about#team" replace />} />
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
