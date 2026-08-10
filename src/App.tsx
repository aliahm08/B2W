/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import PreviewNavbar from './components/PreviewNavbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import CTA from './components/CTA';
import Footer from './components/Footer';
import PreviewFooter from './components/PreviewFooter';
import AssistantWidget from './components/AssistantWidget';
import Seo from './components/Seo';
import NotFound from './components/NotFound';
import ProjectBuilderDrawer from './components/ProjectBuilderDrawer';
import VersionSwitcher from './components/VersionSwitcher';
import { LiveSiteHeader } from './components/V2SiteChrome';
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
const GurgePage = lazy(() => import('./pages/GurgePage'));
const MarketDetailPage = lazy(() => import('./pages/MarketDetailPage'));
const UnifiedPricingPage = lazy(() => import('./pages/PricingPage'));
const SolutionsOverviewPage = lazy(() => import('./pages/SolutionsOverviewPage'));
const ContractorAudiencePage = lazy(() => import('./pages/ContractorAudiencePage'));
const V2HomePage = lazy(() => import('./pages/v2/V2HomePage'));
const V2ProductPage = lazy(() => import('./pages/v2/V2ProductPage'));
const V2SolutionPage = lazy(() => import('./pages/v2/V2SolutionPage'));
const V2PricingPage = lazy(() => import('./pages/v2/V2PricingPage'));
const V3HomePage = lazy(() => import('./pages/v3/V3HomePage'));
const ClaraProductPage = lazy(() => import('./pages/ClaraProductPage'));
const UnifiedHomePage = lazy(() => import('./pages/site/UnifiedHomePage'));
const ServicesPage = lazy(() => import('./pages/site/ServicesPage'));
const JasonAISitePage = lazy(() => import('./pages/site/JasonAISitePage'));
const ProductsIndexPage = lazy(() => import('./pages/site/ProductPages').then((module) => ({ default: module.ProductsIndexPage })));
const AgentsPage = lazy(() => import('./pages/site/ProductPages').then((module) => ({ default: module.AgentsPage })));
const WorkflowsPage = lazy(() => import('./pages/site/ProductPages').then((module) => ({ default: module.WorkflowsPage })));
const PricingPage = lazy(() => import('./pages/site/ProductPages').then((module) => ({ default: module.PricingPage })));
const ResourcesPage = lazy(() => import('./pages/site/ResourcesPages'));
const ContactPage = lazy(() => import('./pages/site/ContactPage'));
const InternalProjectIndexPage = lazy(() => import('./pages/internal/InternalProjectIndexPage'));
const InternalResourcesPage = lazy(() => import('./pages/internal/InternalBrandWorkspacePage'));
const WebsiteArchitectureDocumentsPage = lazy(() => import('./pages/internal/WebsiteArchitectureDocumentsPage'));
const ClaraComingSoonPage = lazy(() => import('./pages/internal/ClaraComingSoonPage'));
const JasonAIOverviewPage = lazy(() => import('./pages/internal/jason-ai/JasonAIOverviewPage'));
const JasonAIPerformanceGoalsPage = lazy(() => import('./pages/internal/jason-ai/JasonAIPerformanceGoalsPage'));
const JasonAIKPITrackerPage = lazy(() => import('./pages/internal/jason-ai/JasonAIKPITrackerPage'));
const JasonAIExecutiveStrategyDocumentPage = lazy(() => import('./pages/internal/jason-ai/JasonAIExecutiveStrategyDocumentPage'));
const JasonAIValuationModelPage = lazy(() => import('./pages/internal/jason-ai/JasonAIValuationModelPage'));
const JasonAIDocumentationPage = lazy(() => import('./pages/internal/jason-ai/JasonAIDocumentationPage'));
const B2WExecutiveStrategyPage = lazy(() => import('./pages/B2WExecutiveStrategyPage'));
const InternalAccessGate = lazy(() => import('./pages/internal/InternalAccessGate'));
const LogoVerificationPage = lazy(() => import('./pages/LogoVerificationPage'));

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

const PREVIEW_BASE_PATH = '/preview';
const V1_BASE_PATH = '/v1';
const V3_BASE_PATH = '/v3';

function VersionedSiteFrame({ basePath, children, fullChrome = false }: { basePath: string; children: ReactNode; fullChrome?: boolean }) {
  const navigate = useNavigate();

  const keepNavigationInVersion = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const anchor = (event.target as Element).closest('a');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
      return;
    }

    const target = new URL(anchor.href, window.location.href);
    if (target.origin !== window.location.origin || target.pathname.startsWith(basePath) || target.pathname.startsWith('/internal')) {
      return;
    }

    event.preventDefault();
    navigate(`${basePath}${target.pathname}${target.search}${target.hash}`);
  };

  return (
    <div onClickCapture={keepNavigationInVersion}>
      {fullChrome ? <PreviewNavbar basePath={basePath} /> : null}
      {children}
      {fullChrome ? <PreviewFooter basePath={basePath} /> : null}
    </div>
  );
}

function FullSiteFrame({ children }: { children: ReactNode }) {
  return (
    <div>
      <LiveSiteHeader />
      {children}
      <PreviewFooter />
    </div>
  );
}

function SolutionsLayout() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fff8fb] text-[#3d1f33]">
      <LiveSiteHeader />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(61,31,51,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,31,51,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 20% 15%, rgba(232,203,217,0.42), transparent 60%), radial-gradient(ellipse 55% 45% at 82% 22%, rgba(194,132,163,0.18), transparent 62%), radial-gradient(ellipse 58% 50% at 50% 100%, rgba(126,73,103,0.10), transparent 70%)',
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
  const setIsLandingHeroVisible = (_isVisible: boolean) => undefined;

  useEffect(() => {
    if (
      location.pathname !== '/services'
      && location.pathname !== '/services/archive/2026-07-29'
    ) {
      setIsLandingHeroVisible(false);
    }
  }, [location.pathname]);

  const dismissOfferBanner = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(OFFER_BANNER_STORAGE_KEY, 'true');
    }
  };

  const isClientPortal = location.pathname.startsWith('/client/');
  const isPreviewSite = location.pathname === PREVIEW_BASE_PATH || location.pathname.startsWith(`${PREVIEW_BASE_PATH}/`);
  const isV1Site = location.pathname === V1_BASE_PATH || location.pathname.startsWith(`${V1_BASE_PATH}/`);
  const isV2Site = location.pathname === '/v2' || location.pathname.startsWith('/v2/');
  const isV3Site = location.pathname === V3_BASE_PATH || location.pathname.startsWith(`${V3_BASE_PATH}/`);
  const isDataRoom = location.pathname.includes('-data-room');
  const isAppTest = location.pathname === '/app-test-1';
  const isClaraPage = location.pathname.startsWith('/clara');
  const isJasonAIPage = location.pathname.startsWith('/jasonai');
  const isGurgePage = location.pathname === '/gurge';
  const isMarketDetailPage = location.pathname === '/general-contractors' || location.pathname.startsWith('/industries/') || location.pathname.startsWith('/solutions/');
  const isFullSiteLive = location.pathname === '/pricing' || location.pathname === '/workflows' || location.pathname.startsWith('/products') || location.pathname.startsWith('/resources') || location.pathname === '/contact' || location.pathname === '/about';
  const isLogoVerification = location.pathname === '/brand/logo-verification';
  const isLiveServices = location.pathname === '/services';
  const isArchivedServices = location.pathname === '/services/archive/2026-07-29';
  const isServicesLanding = isLiveServices || isArchivedServices;
  const isInternalPortal =
    location.pathname === '/internal' ||
    location.pathname.startsWith('/internal/') ||
    location.pathname.startsWith('/portal/') ||
    location.pathname === '/executive-strategy' ||
    location.pathname === '/strategy-v1/executive-strategy';
  const isProjectPage = location.pathname.includes('-operations') || 
                        location.pathname.includes('-social-media-management') ||
                        location.pathname.includes('-valuation-model') ||
                        location.pathname === '/work/coffeeshop-financing/model';
  const hasReturnParam = searchParams.has('return');
  const isIsolatedView =
    location.pathname === '/' || isV1Site || isV2Site || isV3Site || isFullSiteLive || isClientPortal || isInternalPortal || isDataRoom || isProjectPage || hasReturnParam || isAppTest || isClaraPage || isJasonAIPage || isGurgePage || isMarketDetailPage || isLogoVerification;
  const routeTransitionKey = isClaraPage ? '/clara' : isJasonAIPage ? '/jasonai' : location.pathname;

  let clientName: string | undefined = undefined;
  if (location.pathname.includes('uyghur-eats')) {
    clientName = "Uyghur Eats";
  }

  return (
    <div className={isPreviewSite ? 'min-h-screen bg-[var(--b2w-canvas)] text-[var(--b2w-ink)] font-sans' : 'min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white'}>
      <ScrollToTop />
      {!isIsolatedView && (
        isPreviewSite ? (
          <PreviewNavbar basePath={PREVIEW_BASE_PATH} />
        ) : (
          <LiveSiteHeader />
        )
      )}
      <main>
        <Suspense fallback={<RouteLoadingFallback />}>
          <div key={routeTransitionKey}>
            <Routes location={location}>
                <Route
                  path="/"
                  element={<HomeTestOnePage />}
                />
                <Route path="/products" element={<FullSiteFrame><ProductsIndexPage /></FullSiteFrame>} />
                <Route path="/products/agents" element={<FullSiteFrame><AgentsPage /></FullSiteFrame>} />
                <Route path="/products/workflows" element={<FullSiteFrame><WorkflowsPage /></FullSiteFrame>} />
                <Route path="/products/pricing" element={<Navigate to="/pricing" replace />} />
                <Route path="/resources" element={<FullSiteFrame><ResourcesPage /></FullSiteFrame>} />
                <Route path="/resources/guides" element={<FullSiteFrame><ResourcesPage category="Guides" /></FullSiteFrame>} />
                <Route path="/resources/tools" element={<FullSiteFrame><ResourcesPage category="Tools" /></FullSiteFrame>} />
                <Route path="/resources/demonstrations" element={<FullSiteFrame><ResourcesPage category="Demonstrations" /></FullSiteFrame>} />
                <Route path="/resources/case-studies" element={<FullSiteFrame><ResourcesPage category="Case Studies" /></FullSiteFrame>} />
                <Route path="/contact" element={<FullSiteFrame><ContactPage /></FullSiteFrame>} />
                <Route path="/about" element={<FullSiteFrame><AboutPage /></FullSiteFrame>} />
                <Route path="/v1" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><UnifiedHomePage /></VersionedSiteFrame>} />
                <Route path="/v1/services" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ServicesPage /></VersionedSiteFrame>} />
                <Route path="/v1/products" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ProductsIndexPage /></VersionedSiteFrame>} />
                <Route path="/v1/products/agents" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><AgentsPage /></VersionedSiteFrame>} />
                <Route path="/v1/products/workflows" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><WorkflowsPage /></VersionedSiteFrame>} />
                <Route path="/v1/products/pricing" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><PricingPage /></VersionedSiteFrame>} />
                <Route path="/v1/resources" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ResourcesPage /></VersionedSiteFrame>} />
                <Route path="/v1/resources/guides" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ResourcesPage category="Guides" /></VersionedSiteFrame>} />
                <Route path="/v1/resources/tools" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ResourcesPage category="Tools" /></VersionedSiteFrame>} />
                <Route path="/v1/resources/demonstrations" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ResourcesPage category="Demonstrations" /></VersionedSiteFrame>} />
                <Route path="/v1/resources/case-studies" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ResourcesPage category="Case Studies" /></VersionedSiteFrame>} />
                <Route path="/v1/contact" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><ContactPage /></VersionedSiteFrame>} />
                <Route path="/v1/about" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><AboutPage /></VersionedSiteFrame>} />
                <Route path="/v1/jasonai" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><JasonAISitePage /></VersionedSiteFrame>} />
                <Route path="/v1/jasonai/pricing" element={<Navigate to="/v1/products/pricing" replace />} />
                <Route path="/v1/jasonai/how-it-works" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><JasonAISitePage page="how-it-works" /></VersionedSiteFrame>} />
                <Route path="/v1/jasonai/questions" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><JasonAISitePage page="questions" /></VersionedSiteFrame>} />
                <Route path="/v1/jasonai/privacy" element={<VersionedSiteFrame basePath={V1_BASE_PATH} fullChrome><JasonAISitePage page="privacy" /></VersionedSiteFrame>} />
                <Route path="/preview" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><UnifiedHomePage /></VersionedSiteFrame>} />
                <Route path="/preview/services" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ServicesPage /></VersionedSiteFrame>} />
                <Route path="/preview/products" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ProductsIndexPage /></VersionedSiteFrame>} />
                <Route path="/preview/products/agents" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><AgentsPage /></VersionedSiteFrame>} />
                <Route path="/preview/products/workflows" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><WorkflowsPage /></VersionedSiteFrame>} />
                <Route path="/preview/products/pricing" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><PricingPage /></VersionedSiteFrame>} />
                <Route path="/preview/resources" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ResourcesPage /></VersionedSiteFrame>} />
                <Route path="/preview/resources/guides" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ResourcesPage category="Guides" /></VersionedSiteFrame>} />
                <Route path="/preview/resources/tools" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ResourcesPage category="Tools" /></VersionedSiteFrame>} />
                <Route path="/preview/resources/demonstrations" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ResourcesPage category="Demonstrations" /></VersionedSiteFrame>} />
                <Route path="/preview/resources/case-studies" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ResourcesPage category="Case Studies" /></VersionedSiteFrame>} />
                <Route path="/preview/contact" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><ContactPage /></VersionedSiteFrame>} />
                <Route path="/preview/about" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><AboutPage /></VersionedSiteFrame>} />
                <Route path="/preview/jasonai" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><JasonAISitePage /></VersionedSiteFrame>} />
                <Route path="/preview/jasonai/pricing" element={<Navigate to="/preview/products/pricing" replace />} />
                <Route path="/preview/jasonai/how-it-works" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><JasonAISitePage page="how-it-works" /></VersionedSiteFrame>} />
                <Route path="/preview/jasonai/questions" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><JasonAISitePage page="questions" /></VersionedSiteFrame>} />
                <Route path="/preview/jasonai/privacy" element={<VersionedSiteFrame basePath={PREVIEW_BASE_PATH}><JasonAISitePage page="privacy" /></VersionedSiteFrame>} />
                <Route path="/v2" element={<V2HomePage />} />
                <Route path="/v2/products/jasonai" element={<V2ProductPage product="jasonai" />} />
                <Route path="/v2/products/clara" element={<V2ProductPage product="clara" />} />
                <Route path="/v2/solutions/general-contractors" element={<V2SolutionPage solution="general-contractors" />} />
                <Route path="/v2/solutions/engineering-firms" element={<V2SolutionPage solution="engineering-firms" />} />
                <Route path="/v2/pricing" element={<V2PricingPage />} />
                <Route path="/v3" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><V3HomePage /></VersionedSiteFrame>} />
                <Route path="/v3/jasonai" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><JasonAIPage /></VersionedSiteFrame>} />
                <Route path="/v3/jasonai/how-it-works" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><JasonAIPage page="how-it-works" /></VersionedSiteFrame>} />
                <Route path="/v3/jasonai/questions" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><JasonAIPage page="questions" /></VersionedSiteFrame>} />
                <Route path="/v3/jasonai/privacy" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><JasonAIPage page="privacy" /></VersionedSiteFrame>} />
                <Route path="/v3/workflows" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><MarketDetailPage page="general-contracting" /></VersionedSiteFrame>} />
                <Route path="/v3/pricing" element={<VersionedSiteFrame basePath={V3_BASE_PATH}><UnifiedPricingPage /></VersionedSiteFrame>} />
                <Route path="/brand/logo-verification" element={<LogoVerificationPage />} />
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
                <Route
                  path="/services/archive/2026-07-29"
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
                <Route path="/solutions" element={<Navigate to="/solutions/business-use-cases" replace />} />
                <Route path="/solutions/industries" element={<Navigate to="/industries/general-contracting" replace />} />
                <Route path="/solutions/business-use-cases" element={<SolutionsOverviewPage page="business-use-cases" />} />
                <Route path="/general-contractors" element={<ContractorAudiencePage />} />
                <Route path="/solutions/general-contractors" element={<Navigate to="/general-contractors" replace />} />
                <Route path="/solutions/general-contractors/business-owners" element={<Navigate to="/general-contractors" replace />} />
                <Route path="/solutions/general-contractors/project-managers" element={<Navigate to="/general-contractors" replace />} />
                <Route path="/solutions/general-contractors/operations-teams" element={<Navigate to="/general-contractors" replace />} />
                <Route path="/solutions/ai-workflows" element={<SolutionsOverviewPage page="ai-workflows" />} />
                <Route path="/solutions/ai-workflows/project-estimates" element={<SolutionsLayout />}>
                  <Route index element={<SolutionsLandingPage />} />
                </Route>
                <Route path="/solutions/how-it-works" element={<Navigate to="/jasonai/how-it-works" replace />} />
                <Route path="/solutions/questions" element={<Navigate to="/jasonai/questions" replace />} />
                <Route path="/solutions/privacy" element={<Navigate to="/jasonai/privacy" replace />} />
                <Route path="/pricing" element={<UnifiedPricingPage />} />
                <Route path="/workflows" element={<MarketDetailPage page="general-contracting" />} />
                <Route path="/solutions/ai-roi" element={<Navigate to="/pricing#roi-calculator" replace />} />
                <Route path="/solutions/agentic-workflows" element={<Navigate to="/pricing#workflows" replace />} />
                <Route path="/solutions/compare-agents" element={<Navigate to="/pricing#jasonai-pricing" replace />} />
                <Route path="/industries/food-and-beverage" element={<MarketDetailPage page="food-and-beverage" />} />
                <Route path="/industries/general-contracting" element={<MarketDetailPage page="general-contracting" />} />
                <Route path="/industries/real-estate-management" element={<MarketDetailPage page="real-estate-management" />} />
                <Route path="/jasonai" element={<JasonAIPage />} />
                <Route path="/jasonai/pricing" element={<Navigate to="/pricing" replace />} />
                <Route path="/jasonai/how-it-works" element={<JasonAIPage page="how-it-works" />} />
                <Route path="/jasonai/questions" element={<JasonAIPage page="questions" />} />
                <Route path="/jasonai/privacy" element={<JasonAIPage page="privacy" />} />
                <Route path="/gurge" element={<GurgePage />} />
                <Route path="/executive-strategy" element={<Navigate to="/internal" replace />} />
                <Route path="/strategy-v1/executive-strategy" element={<Navigate to="/internal" replace />} />
                <Route path="/internal" element={<InternalAccessGate />} />
                <Route
                  path="/internal/business-plan"
                  element={
                    <InternalAccessGate>
                      <B2WExecutiveStrategyPage mode="services" />
                    </InternalAccessGate>
                  }
                />
                <Route path="/internal/services" element={<Navigate to="/internal/business-plan" replace />} />
                <Route
                  path="/internal/resources"
                  element={
                    <InternalAccessGate>
                      <InternalResourcesPage />
                    </InternalAccessGate>
                  }
                />
                <Route
                  path="/internal/resources/website-architecture"
                  element={
                    <InternalAccessGate>
                      <WebsiteArchitectureDocumentsPage />
                    </InternalAccessGate>
                  }
                />
                <Route path="/internal/workspace" element={<Navigate to="/internal/resources" replace />} />
                <Route
                  path="/internal/products/clara"
                  element={
                    <InternalAccessGate>
                      <ClaraComingSoonPage />
                    </InternalAccessGate>
                  }
                />
                <Route
                  path="/internal/portal"
                  element={
                    <InternalAccessGate>
                      <InternalProjectIndexPage />
                    </InternalAccessGate>
                  }
                />
                <Route
                  element={
                    <InternalAccessGate>
                      <Outlet />
                    </InternalAccessGate>
                  }
                >
                  <Route path="/internal/portal/product" element={<JasonAIOverviewPage />} />
                  <Route path="/internal/portal/product/performance-goals" element={<JasonAIPerformanceGoalsPage />} />
                  <Route path="/internal/portal/product/kpi-tracker" element={<JasonAIKPITrackerPage />} />
                  <Route path="/internal/portal/product/executive-strategy" element={<JasonAIExecutiveStrategyDocumentPage />} />
                  <Route path="/internal/portal/product/profile" element={<Navigate to="/internal/portal/product/executive-strategy" replace />} />
                  <Route path="/internal/portal/product/valuation" element={<JasonAIValuationModelPage />} />
                  <Route path="/internal/portal/product/documentation" element={<JasonAIDocumentationPage />} />
                </Route>
                <Route path="/internal/jason-ai" element={<Navigate to="/internal/portal/product" replace />} />
                <Route path="/internal/jason-ai/performance-goals" element={<Navigate to="/internal/portal/product/performance-goals" replace />} />
                <Route path="/internal/jason-ai/kpi-tracker" element={<Navigate to="/internal/portal/product/kpi-tracker" replace />} />
                <Route path="/internal/jason-ai/executive-strategy" element={<Navigate to="/internal/portal/product/executive-strategy" replace />} />
                <Route path="/internal/jason-ai/profile" element={<Navigate to="/internal/portal/product/executive-strategy" replace />} />
                <Route path="/internal/jason-ai/valuation" element={<Navigate to="/internal/portal/product/valuation" replace />} />
                <Route path="/internal/jason-ai/documentation" element={<Navigate to="/internal/portal/product/documentation" replace />} />
                <Route path="/portal/JasonAI-Executive-Strategy" element={<Navigate to="/internal/portal/product/executive-strategy" replace />} />
                <Route path="/jasonai-2" element={<Navigate to="/jasonai" replace />} />
                <Route path="/jasonai-3" element={<Navigate to="/jasonai" replace />} />
                <Route path="/jasonai-3/*" element={<Navigate to="/jasonai" replace />} />
                <Route path="/borek-g-social-media-management" element={<BorekGProfilePage />} />
                <Route path="/borek-g-operations" element={<BorekGProposalPage />} />
                <Route path="/borek-g" element={<Navigate to="/borek-g-social-media-management" replace />} />
                <Route path="/capabilities" element={<Navigate to="/growth" replace />} />
                <Route path="/clara" element={<FullSiteFrame><ClaraProductPage /></FullSiteFrame>} />
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
          </div>
        </Suspense>
      </main>
      {!isIsolatedView && (isPreviewSite ? <PreviewFooter basePath={PREVIEW_BASE_PATH} /> : <Footer />)}
      {(isV1Site || isV2Site || isV3Site) && <VersionSwitcher />}
      {!isLogoVerification && <AssistantWidget />}
    </div>
  );
}
