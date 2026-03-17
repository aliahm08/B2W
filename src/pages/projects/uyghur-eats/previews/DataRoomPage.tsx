import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  FileText, 
  FolderLock, 
  LineChart, 
  Lock, 
  MapPin, 
  MonitorSmartphone, 
  Receipt,
  Users
} from 'lucide-react';
import PreviewPageFrame from './PreviewPageFrame';
import ResponsiveAccordionSection from '../../../../components/ResponsiveAccordionSection';
import ProjectTagPill from '../../../../components/ProjectTagPill';
import ProfileSectionNav from '../../../../components/ProfileSectionNav';

const dataRoomSections = [
  { id: 'executive-summary', label: '1. Executive Summary' },
  { id: 'financials', label: '2. Financial & Tax Records' },
  { id: 'operations', label: '3. Operations & Vendors' },
  { id: 'real-estate', label: '4. Real Estate & Lease' },
  { id: 'digital-assets', label: '5. Marketing & Digital Assets' },
];

function DocumentSkeleton({ title, type, locked = false }: { title: string, type: string, locked?: boolean }) {
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

export default function DataRoomPage() {
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get('return') || '/#projects';

  return (
    <PreviewPageFrame
      title="Uyghur Eats | Buyer Data Room"
      description="Structured data room preview showing the framework for due diligence materials."
      returnPath={returnPath}
      returnLabel={searchParams.get('return') ? "Client Portal" : "Projects"}
      returnDetail={searchParams.get('return') ? "Back to the main presentation" : "Back to B2W Portfolio"}
      eyebrow="Property Sale Deliverable"
      kicker="Due Diligence Package"
      heading="Buyer Information Package"
      summary="A structured, secure data room framework designed to organize diligence materials for qualified buyers without exposing sensitive data prematurely."
      heroNotes={
        <>
          <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
            This module represents the structural wireframe of the final Data Room. 
          </div>
          <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
            Actual files (tax returns, leases, vendor contracts) will be populated here once the owner approves them for buyer review.
          </div>
        </>
      }
      tagContent={
        <>
          <ProjectTagPill tag={{ label: 'Due Diligence', tier: 1 }} />
          <ProjectTagPill tag={{ label: 'Data Room', tier: 2 }} />
          <ProjectTagPill tag={{ label: 'Buyer Package', tier: 3 }} />
        </>
      }
      asideLabel="Data Room Snapshot"
      asideHeading="Organized diligence accelerates the sale."
      asideSummary="By classifying documents into clear categories (Financials, Operations, Real Estate), buyers can evaluate the business smoothly without constant back-and-forth requests."
      metricsContent={
        <>
          <div className="border border-white/15 bg-white/5 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</p>
            <p className="font-medium text-neutral-300">Pending Uploads</p>
          </div>
          <div className="border border-white/15 bg-white/5 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Access</p>
            <p className="font-medium text-neutral-300">Restricted</p>
          </div>
        </>
      }
      navContent={
        <ProfileSectionNav
          items={dataRoomSections}
          description="Navigate the planned due diligence categories below."
        />
      }
      mainContent={
        <div className="space-y-8">
          <ResponsiveAccordionSection
            id="executive-summary"
            title="Executive Summary & Highlights"
            icon={Building2}
            defaultOpen
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="space-y-6">
              <p className="text-sm leading-6 text-neutral-600">
                This section will contain the narrative overview of the business, answering the most common high-level questions buyers ask before diving into the numbers.
              </p>
              <div className="grid gap-3">
                <DocumentSkeleton title="Confidential Information Memorandum (CIM)" type="Master PDF Document" />
                <DocumentSkeleton title="Owner's Narrative & History" type="Summary Document" />
              </div>
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="financials"
            title="Financial & Tax Records"
            icon={LineChart}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="space-y-6">
              <p className="text-sm leading-6 text-neutral-600">
                The core financial validation area. Documents here are typically locked behind an NDA or shared only with buyers who have submitted a Letter of Intent.
              </p>
              <div className="grid gap-3">
                <DocumentSkeleton title="Trailing 12-Month (TTM) P&L Statement" type="Spreadsheet" locked />
                <DocumentSkeleton title="Previous 3 Years Business Tax Returns" type="Tax Documents (Redacted)" locked />
                <DocumentSkeleton title="Historical Balance Sheets" type="Financial Statement" locked />
                <DocumentSkeleton title="Schedule of Add-Backs / Normalized Earnings" type="Spreadsheet" locked />
              </div>
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="operations"
            title="Operations & Vendors"
            icon={Users}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="space-y-6">
               <p className="text-sm leading-6 text-neutral-600">
                Details regarding the day-to-day running of the business, including supply chains, physical assets, and staffing models.
              </p>
              <div className="grid gap-3">
                <DocumentSkeleton title="Furniture, Fixtures & Equipment (FF&E) Inventory" type="Asset List" />
                <DocumentSkeleton title="Key Vendor & Supplier List" type="Contact & Terms Record" locked />
                <DocumentSkeleton title="Current Staffing Schedule & Roster" type="Operational Document (Anonymized)" locked />
                <DocumentSkeleton title="Licenses & Permits Review" type="Legal Documents" />
              </div>
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="real-estate"
            title="Real Estate & Lease"
            icon={MapPin}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="space-y-6">
               <p className="text-sm leading-6 text-neutral-600">
                Because location is critical for hospitality assets, this section isolates the terms and conditions of the physical space.
              </p>
              <div className="grid gap-3">
                <DocumentSkeleton title="Master Commercial Lease Agreement" type="Legal Contract" locked />
                <DocumentSkeleton title="Recent Utility Bills (Trailing 6 Months)" type="Expense Records" />
                <DocumentSkeleton title="Floor Plan & Square Footage Breakdown" type="Architectural / Diagram" />
              </div>
            </div>
          </ResponsiveAccordionSection>

          <ResponsiveAccordionSection
            id="digital-assets"
            title="Marketing & Digital Assets"
            icon={MonitorSmartphone}
            className="border border-neutral-200"
            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
            bodyClassName="p-4 md:p-6"
            titleClassName="md:text-xl"
          >
            <div data-project-detail-body className="space-y-6">
               <p className="text-sm leading-6 text-neutral-600">
                A summary of the intangible assets that drive demand and will transfer to the new owner upon sale.
              </p>
              <div className="grid gap-3">
                <DocumentSkeleton title="Domain Name & Website Hosting Access" type="Digital Asset Record" />
                <DocumentSkeleton title="Social Media Account Handles & Transfer Info" type="Platform Details" />
                <DocumentSkeleton title="Delivery App & Third-Party Platform Credentials" type="Vendor Dashboard Access" locked />
              </div>
            </div>
          </ResponsiveAccordionSection>

        </div>
      }
    />
  );
}
