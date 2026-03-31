import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  LineChart,
  Lock,
  MapPin,
  MonitorSmartphone,
  Users,
} from 'lucide-react';
import Seo from '../../../../components/Seo';
import Footer from '../../../../components/Footer';
import ProfileSectionNav from '../../../../components/ProfileSectionNav';
import ClientNavbar, { type ClientNavAction } from '../../../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../../../components/uyghur-eats/UyghurEatsOfferModal';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageHeroTitleClassName,
  projectPageSectionTitleClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../../../../components/projectPageLayout';

type SectionDef = { id: string; label: string; content: ReactNode };

function DocumentSkeleton({ title, type, locked = false }: { title: string; type: string; locked?: boolean }) {
  return (
    <div className="flex items-center justify-between border border-neutral-200 bg-white p-4 transition-colors hover:border-black">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-neutral-100 text-neutral-500">
          {locked ? <Lock className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-medium text-black">{title}</p>
          <p className="mt-1 text-xs text-neutral-500">{type}</p>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="h-2 w-24 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

function ExecutiveSummaryContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
        This section houses the high-level materials buyers review first, framing the business clearly before they move into detailed diligence. It reduces repetitive top-of-funnel questions and makes buyer conversations more efficient.
      </p>
      <div className="grid gap-3">
        <DocumentSkeleton title="Confidential Information Memorandum (CIM)" type="Master PDF Document" />
        <DocumentSkeleton title="Owner Narrative & Business History" type="Summary Document" />
      </div>
    </div>
  );
}

function FinancialsContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
        This is the core validation layer for qualified buyers. Financial and tax records are typically shared on a controlled basis once buyer intent and seriousness are established.
      </p>
      <div className="grid gap-3">
        <DocumentSkeleton title="Trailing 12-Month (TTM) P&L Statement" type="Spreadsheet" locked />
        <DocumentSkeleton title="Previous 3 Years Business Tax Returns" type="Tax Documents (Redacted)" locked />
        <DocumentSkeleton title="Historical Balance Sheets" type="Financial Statement" locked />
        <DocumentSkeleton title="Schedule of Add-Backs / Normalized Earnings" type="Spreadsheet" locked />
      </div>
    </div>
  );
}

function OperationsContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
        Day-to-day operating records help buyers understand how the business runs in practice, from staffing and suppliers to equipment and active compliance materials.
      </p>
      <div className="grid gap-3">
        <DocumentSkeleton title="Furniture, Fixtures & Equipment (FF&E) Inventory" type="Asset List" />
        <DocumentSkeleton title="Key Vendor & Supplier List" type="Contact & Terms Record" locked />
        <DocumentSkeleton title="Current Staffing Schedule & Roster" type="Operational Document (Anonymized)" locked />
        <DocumentSkeleton title="Licenses & Permits Review" type="Legal Documents" />
      </div>
    </div>
  );
}

function RealEstateContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
        Because the physical footprint is integral to restaurant performance, this section isolates the lease, occupancy costs, and layout information buyers need to underwrite the location.
      </p>
      <div className="grid gap-3">
        <DocumentSkeleton title="Master Commercial Lease Agreement" type="Legal Contract" locked />
        <DocumentSkeleton title="Recent Utility Bills (Trailing 6 Months)" type="Expense Records" />
        <DocumentSkeleton title="Floor Plan & Square Footage Breakdown" type="Architectural / Diagram" />
      </div>
    </div>
  );
}

function DigitalAssetsContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
        Digital assets are part of the transfer package. This section organizes the channels, credentials, and platform relationships that support customer acquisition and continuity after handoff.
      </p>
      <div className="grid gap-3">
        <DocumentSkeleton title="Domain Name & Website Hosting Access" type="Digital Asset Record" />
        <DocumentSkeleton title="Social Media Account Handles & Transfer Info" type="Platform Details" />
        <DocumentSkeleton title="Delivery App & Third-Party Platform Credentials" type="Vendor Dashboard Access" locked />
      </div>
    </div>
  );
}

const sectionIconMap: Record<string, typeof Building2> = {
  'executive-summary': Building2,
  financials: LineChart,
  operations: Users,
  'real-estate': MapPin,
  'digital-assets': MonitorSmartphone,
};

export default function DataRoomPage() {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState('executive-summary');

  const openOfferModal = () => {
    setIsOfferSubmitted(false);
    setIsOfferModalOpen(true);
  };

  const closeOfferModal = () => {
    setIsOfferModalOpen(false);
  };

  const handleOfferSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOfferSubmitted(true);
  };

  const navItems: ClientNavAction[] = [
    { label: 'Proposal', to: '/client/uyghur-eats' },
    { label: 'Profile', to: '/client/uyghur-eats/profile' },
    { label: 'Valuation', to: '/client/uyghur-eats/valuation' },
    { label: 'Documentation', to: '/client/uyghur-eats/data-room' },
    { label: 'Terms', to: '/client/uyghur-eats/terms' },
    { label: 'Accept', type: 'cta', onClick: openOfferModal },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isOfferModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOfferModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOfferModalOpen]);

  const sections: SectionDef[] = [
    { id: 'executive-summary', label: 'Executive Summary', content: <ExecutiveSummaryContent /> },
    { id: 'financials', label: 'Financial & Tax Records', content: <FinancialsContent /> },
    { id: 'operations', label: 'Operations & Vendors', content: <OperationsContent /> },
    { id: 'real-estate', label: 'Real Estate & Lease', content: <RealEstateContent /> },
    { id: 'digital-assets', label: 'Marketing & Digital Assets', content: <DigitalAssetsContent /> },
  ];

  const sectionNavItems = sections.map((section) => ({ id: section.id, label: section.label }));
  const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0];
  const currentIndex = sections.findIndex((section) => section.id === activeSection);
  const nextSection = sections[currentIndex + 1];
  const Icon = sectionIconMap[currentSection.id];
  const sheetLabel = `Section ${currentIndex + 1} / ${currentSection.label}`;

  return (
    <article className={projectPageShellClassName}>
      <ClientNavbar clientName="Uyghur Eats" clientLink="/client/uyghur-eats" navItems={navItems} hasFieldBoss={true} />
      <Seo
        title="Uyghur Eats Due Diligence Documentation"
        description="Structured documentation package for Uyghur Eats that organizes executive summary materials, financial records, operating documents, lease items, and digital assets for diligence."
        robots="noindex, nofollow"
        imageUrl="https://www.b2w-ai.com/images/uyghur-eats/interior.jpg"
        imageAlt="Interior dining room at Uyghur Eats in Washington, DC."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className={projectPageHeaderClassName}>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/client/uyghur-eats"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Proposal
              </Link>
            </div>
          </div>

          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">Uyghur Eats</span>
            <span className="text-neutral-300">•</span>
            <span>Documentation</span>
          </div>

          <div className={projectHeroGridClassNames.profile}>
            <div>
              <h1 className={projectPageHeroTitleClassName}>Documentation & Diligence Package</h1>
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                A structured buyer-readiness package that organizes the core documents, operating records, and transfer materials needed to review the business confidently.
              </p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                  <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                </div>
                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Deliverable</span>
                  <span className="mt-2 block font-medium text-black">Documentation</span>
                </div>
                <div className="col-span-2 border border-neutral-200 p-4 text-sm leading-6 text-neutral-700 md:col-span-1">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</span>
                  <span className="mt-2 block font-medium text-black">Structured Framework</span>
                </div>
              </div>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                Deliverable Preview
              </p>
              <h2 className="mb-6 text-2xl font-medium tracking-tight md:text-3xl">
                How this package supports a cleaner transfer.
              </h2>
              <div className="space-y-4 text-sm text-neutral-300">
                <ul className="list-disc space-y-2 pl-4">
                  <li>Reduces buyer friction by organizing materials into clear diligence categories.</li>
                  <li>Creates a more turnkey handoff by documenting operations and transfer records.</li>
                  <li>Improves trust by showing that compliance, records, and workflows are accounted for.</li>
                  <li>Decreases repetitive buyer requests through a more structured review environment.</li>
                </ul>
              </div>
            </aside>
          </div>
        </header>

        <ProfileSectionNav items={sectionNavItems} activeId={activeSection} onSelect={setActiveSection} />

        <main className="mt-8 md:mt-12">
          <AnimatePresence mode="wait">
            <motion.section
              key={currentSection.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6 flex items-center gap-3">
                {Icon ? (
                  <div className="border border-neutral-200 p-2">
                    <Icon className="h-5 w-5 text-black" />
                  </div>
                ) : null}
                <div>
                  <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                    {sheetLabel}
                  </p>
                  <h2 className={projectPageSectionTitleClassName}>{currentSection.label}</h2>
                </div>
              </div>
              <div className="pb-6">{currentSection.content}</div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 lg:hidden">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-neutral-400">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
                </p>
                {nextSection ? (
                  <button
                    type="button"
                    onClick={() => setActiveSection(nextSection.id)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-black"
                  >
                    {nextSection.label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <Link to="/client/uyghur-eats" className="inline-flex items-center gap-2 text-sm font-medium text-black">
                    Back to Proposal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </motion.section>
          </AnimatePresence>
        </main>
      </motion.div>

      <UyghurEatsOfferModal
        isOpen={isOfferModalOpen}
        onClose={closeOfferModal}
        isSubmitted={isOfferSubmitted}
        onSubmit={handleOfferSubmit}
      />

      <Footer />
    </article>
  );
}
