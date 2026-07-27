/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AssistantWidget from './components/AssistantWidget';
import Seo from './components/Seo';
import NotFound from './components/NotFound';
import ProjectBuilderDrawer from './components/ProjectBuilderDrawer';
import SolutionsNavbar from './components/solutions/SolutionsNavbar';
import { ArrowUpRight } from 'lucide-react';
import { scrollToHashTarget } from './lib/hashNavigation';
import HomeTestOnePage from './pages/HomeTestOnePage';

const OFFER_BANNER_STORAGE_KEY = 'b2w-offer-banner-dismissed';

const BorekGProfilePage = lazy(() => import('./pages/projects/borek-g/ProfilePage'));
const BorekGProposalPage = lazy(() => import('./pages/projects/borek-g/ProposalPage'));
const UyghurEatsProfilePage = lazy(() => import('./pages/projects/uyghur-eats/ProfilePage'));
const UyghurEatsClientPortal = lazy(() => import('./pages/client/UyghurEatsClientPortal'));
const UyghurEatsTermsPage = lazy(() => import('./pages/client/UyghurEatsTermsPage'));
const UyghurEatsFieldBossChatbotPage = lazy(() => import('./pages/client/UyghurEatsFieldBossChatbotPage'));
const UyghurEatsFieldBossAgentManagerPage = lazy(() => import('./pages/client/UyghurEatsFieldBossAgentManagerPage'));
const UyghurEatsFieldBossDashboardPage = lazy(() => import('./pages/client/UyghurEatsFieldBossDashboardPage'));
const FosterPartnersOverviewPage = lazy(() => import('./pages/client/FosterPartnersOverviewPage'));
const FosterPartnersDevelopmentDashboardPage = lazy(() => import('./pages/client/FosterPartnersDevelopmentDashboardPage'));
const FosterPartnersDesignLifecyclePage = lazy(() => import('./pages/client/FosterPartnersDesignLifecyclePage'));
const FosterPartnersBuildLifecyclePage = lazy(() => import('./pages/client/FosterPartnersBuildLifecyclePage'));
const FosterPartnersDevelopmentLifecyclePage = lazy(() => import('./pages/client/FosterPartnersDevelopmentLifecyclePage'));
const FosterPartnersScopePage = lazy(() => import('./pages/client/FosterPartnersScopePage'));
const FosterPartnersOperatingModelPage = lazy(() => import('./pages/client/FosterPartnersOperatingModelPage'));
const FosterPartnersGovernancePage = lazy(() => import('./pages/client/FosterPartnersGovernancePage'));
const FosterPartnersTermsPage = lazy(() => import('./pages/client/FosterPartnersTermsPage'));
const UyghurEatsValuationModelPage = lazy(() => import('./pages/projects/uyghur-eats/ValuationModelPage'));
const UyghurEatsDataRoomPage = lazy(() => import('./pages/projects/uyghur-eats/previews/DataRoomPage'));
const CapabilityPage = lazy(() => import('./pages/capabilities/CapabilityPage'));
const DataExplainerPage = lazy(() => import('./pages/capabilities/DataExplainerPage'));
const ServiceProjectPage = lazy(() => import('./pages/ServiceProjectPage'));
const SabucnuProfilePage = lazy(() => import('./pages/projects/sabucnu/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ExpertisePage = lazy(() => import('./pages/ExpertisePage'));
const SolutionsLandingPage = lazy(() => import('./pages/solutions/SolutionsLandingPage'));
const TierPage = lazy(() => import('./pages/TierPage'));
const AppTestOnePage = lazy(() => import('./pages/AppTestOnePage'));
const CoffeeShopFinancingModelPage = lazy(() => import('./pages/work/CoffeeShopFinancingModelPage'));
const JasonAIPage = lazy(() => import('./pages/JasonAIPage'));
const JasonAIInternalPortal = lazy(() => import('./pages/internal/jason-ai/JasonAIInternalPortal'));
const JasonAIValuationModelPage = lazy(() => import('./pages/internal/jason-ai/JasonAIValuationModelPage'));
const JasonAIDocumentationPage = lazy(() => import('./pages/internal/jason-ai/JasonAIDocumentationPage'));

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
  onOfferClose,
  openBuilderOnLoad = false,
}: {
  onHeroVisibilityChange: (isVisible: boolean) => void;
  onOfferClick: () => void;
  onOfferClose: () => void;
  openBuilderOnLoad?: boolean;
}) {
  const [showProjectButton, setShowProjectButton] = useState(false);
  const [isProjectDrawerOpen, setIsProjectDrawerOpen] = useState(false);

  const scrollToContact = () => {
    const contact = document.getElementById('contact');
    contact?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (openBuilderOnLoad) {
      setIsProjectDrawerOpen(true);
    }
  }, [openBuilderOnLoad]);

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
        showOfferBanner
        onOfferClick={onOfferClick}
        onOfferClose={onOfferClose}
      />
      <section id="expertise">
        <Expertise />
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
              onClick={scrollToContact}
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

function SolutionsLayout() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#080a0f] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 20% 15%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(ellipse 55% 45% at 82% 22%, rgba(45,212,191,0.05), transparent 62%), radial-gradient(ellipse 58% 50% at 50% 100%, rgba(168,85,247,0.05), transparent 70%)',
        }}
      />
      <div className="relative z-10 pt-28 md:pt-32 xl:pt-24">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLandingHeroVisible, setIsLandingHeroVisible] = useState(false);
  const [isOfferBannerDismissed, setIsOfferBannerDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(OFFER_BANNER_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (location.pathname !== '/services') {
      setIsLandingHeroVisible(false);
    }
  }, [location.pathname]);

  const dismissOfferBanner = () => {
    setIsOfferBannerDismissed(true);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(OFFER_BANNER_STORAGE_KEY, 'true');
    }
  };

  const isClientPortal = location.pathname.startsWith('/client/');
  const isDataRoom = location.pathname.includes('-data-room');
  const isPrototypeHome = location.pathname === '/' || location.pathname === '/home-test-1';
  const isAppTest = location.pathname === '/app-test-1';
  const isClaraPage = location.pathname.startsWith('/clara');
  const isJasonAIPage = location.pathname.startsWith('/jasonai');
  const isInternalPortal = location.pathname.startsWith('/internal/') || location.pathname.startsWith('/portal/');
  const isProjectPage = location.pathname.includes('-operations') || 
                        location.pathname.includes('-social-media-management') ||
                        location.pathname.includes('-valuation-model') ||
                        location.pathname === '/work/coffeeshop-financing/model';
  const hasReturnParam = searchParams.has('return');
  const isIsolatedView =
    isClientPortal || isInternalPortal || isDataRoom || isProjectPage || hasReturnParam || isPrototypeHome || isAppTest || isClaraPage || isJasonAIPage;
  const routeTransitionKey = isClaraPage ? '/clara' : isJasonAIPage ? '/jasonai' : location.pathname;

  let clientName: string | undefined = undefined;
  if (location.pathname.includes('uyghur-eats')) {
    clientName = "Uyghur Eats";
  }

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-black selection:text-white">
      <ScrollToTop />
      {!isIsolatedView && (
        <Navbar
          showOfferBanner={location.pathname === '/services' && !isLandingHeroVisible && !isOfferBannerDismissed}
          transparentAtTop={location.pathname === '/services' && isLandingHeroVisible}
          onOfferClick={() => {
            window.location.hash = 'contact';
          }}
          onOfferClose={dismissOfferBanner}
        />
      )}
      {isClaraPage && <SolutionsNavbar />}
      <main>
        <Suspense fallback={<RouteLoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={routeTransitionKey}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes location={location}>
                <Route
                  path="/"
                  element={<HomeTestOnePage />}
                />
                <Route
                  path="/services"
                  element={
                    <LandingPage
                      onHeroVisibilityChange={setIsLandingHeroVisible}
                      onOfferClick={() => {
                        const contact = document.getElementById('contact');
                        contact?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      onOfferClose={dismissOfferBanner}
                      openBuilderOnLoad={searchParams.get('project-builder') === 'open'}
                    />
                  }
                />
                <Route path="/home-test-1" element={<Navigate to="/" replace />} />
                <Route path="/app-test-1" element={<AppTestOnePage />} />
                <Route path="/solutions" element={<Navigate to="/jasonai" replace />} />
                <Route path="/solutions/how-it-works" element={<Navigate to="/jasonai/how-it-works" replace />} />
                <Route path="/solutions/questions" element={<Navigate to="/jasonai/questions" replace />} />
                <Route path="/solutions/privacy" element={<Navigate to="/jasonai/privacy" replace />} />
                <Route path="/jasonai" element={<JasonAIPage />} />
                <Route path="/jasonai/how-it-works" element={<JasonAIPage page="how-it-works" />} />
                <Route path="/jasonai/questions" element={<JasonAIPage page="questions" />} />
                <Route path="/jasonai/privacy" element={<JasonAIPage page="privacy" />} />
                <Route path="/internal/jason-ai" element={<JasonAIInternalPortal />} />
                <Route path="/internal/jason-ai/profile" element={<Navigate to="/internal/jason-ai#j-curve" replace />} />
                <Route path="/internal/jason-ai/valuation" element={<JasonAIValuationModelPage />} />
                <Route path="/internal/jason-ai/documentation" element={<JasonAIDocumentationPage />} />
                <Route path="/portal/JasonAI-Executive-Strategy" element={<Navigate to="/internal/jason-ai/profile" replace />} />
                <Route path="/jasonai-2" element={<Navigate to="/jasonai" replace />} />
                <Route path="/jasonai-3" element={<Navigate to="/jasonai" replace />} />
                <Route path="/jasonai-3/*" element={<Navigate to="/jasonai" replace />} />
                <Route path="/borek-g-social-media-management" element={<BorekGProfilePage />} />
                <Route path="/borek-g-operations" element={<BorekGProposalPage />} />
                <Route path="/borek-g" element={<Navigate to="/borek-g-social-media-management" replace />} />
                <Route path="/capabilities" element={<Navigate to="/growth" replace />} />
                <Route path="/clara" element={<SolutionsLayout />}>
                  <Route index element={<SolutionsLandingPage />} />
                </Route>
                <Route path="/clara/:slug" element={<Navigate to="/clara" replace />} />
                <Route path="/kitchen" element={<Navigate to="/growth" replace />} />
                <Route path="/kitchen/*" element={<Navigate to="/growth" replace />} />
                <Route path="/tiers/basic-advisory" element={<TierPage />} />
                <Route path="/tiers/consulting" element={<TierPage />} />
                <Route path="/tiers/implementation" element={<TierPage />} />
                <Route path="/tiers/custom-tool" element={<TierPage />} />
                <Route path="/growth" element={<DataExplainerPage />} />
                <Route path="/capabilities/marketing-data" element={<Navigate to="/growth" replace />} />
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
                <Route path="/client/uyghur-eats/profile" element={<UyghurEatsProfilePage />} />
                <Route path="/client/uyghur-eats/valuation" element={<UyghurEatsValuationModelPage />} />
                <Route path="/client/uyghur-eats/data-room" element={<UyghurEatsDataRoomPage />} />
                <Route path="/client/uyghur-eats/fieldboss-chatbot" element={<UyghurEatsFieldBossChatbotPage />} />
                <Route path="/client/uyghur-eats/fieldboss-agent-manager" element={<UyghurEatsFieldBossAgentManagerPage />} />
                <Route path="/client/uyghur-eats/fieldboss-dashboard" element={<UyghurEatsFieldBossDashboardPage />} />
                <Route path="/client/foster-partners" element={<FosterPartnersOverviewPage />} />
                <Route path="/client/foster-partners/development-dashboard" element={<FosterPartnersDevelopmentDashboardPage />} />
                <Route path="/client/foster-partners/development-dashboard/design" element={<FosterPartnersDesignLifecyclePage />} />
                <Route path="/client/foster-partners/development-dashboard/build" element={<FosterPartnersBuildLifecyclePage />} />
                <Route path="/client/foster-partners/development-dashboard/development" element={<FosterPartnersDevelopmentLifecyclePage />} />
                <Route path="/client/foster-partners/scope" element={<FosterPartnersScopePage />} />
                <Route path="/client/foster-partners/operating-model" element={<FosterPartnersOperatingModelPage />} />
                <Route path="/client/foster-partners/governance" element={<FosterPartnersGovernancePage />} />
                <Route path="/client/foster-partners/terms" element={<FosterPartnersTermsPage />} />
                <Route path="/client/narinder-sagoo" element={<Navigate to="/client/foster-partners" replace />} />

                {/* Redirects for legacy routes */}
                <Route path="/uyghur-eats" element={<Navigate to="/client/uyghur-eats" replace />} />
                <Route path="/uyghur-eats-profile" element={<Navigate to="/client/uyghur-eats/profile" replace />} />
                <Route path="/uyghur-eats-valuation-model" element={<Navigate to="/client/uyghur-eats/valuation" replace />} />
                <Route path="/uyghur-eats-data-room" element={<Navigate to="/client/uyghur-eats/data-room" replace />} />
                <Route path="/uyghur-eats-acquisition" element={<Navigate to="/client/uyghur-eats" replace />} />
                <Route path="/uyghur-eats-valuation" element={<Navigate to="/client/uyghur-eats/valuation" replace />} />
                <Route path="/services/marketing-advisory" element={<ServiceProjectPage />} />
                <Route path="/services/financial-review" element={<ServiceProjectPage />} />
                <Route path="/services/operations-implementation" element={<ServiceProjectPage />} />
                <Route path="/services/business-revamp" element={<ServiceProjectPage />} />
                <Route path="/work/coffeeshop-financing/model" element={<CoffeeShopFinancingModelPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isIsolatedView && <Footer />}
      <AssistantWidget />
    </div>
  );
}
