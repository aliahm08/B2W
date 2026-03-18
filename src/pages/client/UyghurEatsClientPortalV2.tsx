import React, { useState, useEffect, useRef, useMemo, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
    MapPin, ChefHat, Users, LineChart, Target, TrendingUp, 
    ArrowRight, ArrowLeft, LayoutTemplate, FileText, BriefcaseBusiness, 
    Scale, BarChart3, DollarSign, ChevronRight, ChevronLeft
} from 'lucide-react';
import Seo from '../../components/Seo';
import ProjectTagPill from '../../components/ProjectTagPill';
import { useScrollSectionNav } from '../../hooks/useScrollSectionNav';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../components/uyghur-eats/UyghurEatsOfferModal';
import { projectShowcaseOverridesByPath } from '../../content/projectShowcase';
import {
    projectPageShellClassName,
} from '../../components/projectPageLayout';

/* ─── Shared Content Components ─── */

function LocationContent() {
    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base italic">
                Situated at <strong className="text-black font-semibold">2412 Wisconsin Ave NW, Washington, DC</strong>,
                the restaurant sits in a high-income, high-traffic corridor. The 2024 rebrand to <em>Uyghur Eats</em> signals a clearer operating identity.
            </p>
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base italic">
                The room combines high ceilings, cultural murals, and efficient seating density without reading as cramped.
            </p>
        </div>
    );
}

function ImageCarousel({ images }: { images: { url: string; alt: string }[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative group aspect-[16/9] overflow-hidden bg-neutral-100 border border-neutral-200">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img 
                        src={images[currentIndex].url} 
                        alt={images[currentIndex].alt}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-xs font-mono uppercase tracking-widest opacity-70 mb-1">
                            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                        </p>
                        <p className="text-sm font-medium">{images[currentIndex].alt}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-y-0 left-4 flex items-center">
                <button 
                    onClick={prev}
                    className="p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
                <button 
                    onClick={next}
                    className="p-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1 transition-all ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}

function CulinaryContent() {
    return (
        <div>
            <p className="mb-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                The key value driver is <strong className="text-black font-semibold">daily hand-pulled laghman noodles</strong>. The menu wins because it is specific, labor-intensive, and hard to substitute nearby.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                <li><strong>Signature:</strong> Royal Laghman & Fried Laghman</li>
                <li><strong>Savory:</strong> Handmade Manta (dumplings) & Samsa (pastries)</li>
                <li><strong>Proteins:</strong> Premium Halal meats including Fried Lamb Shank</li>
                <li><strong>Communal:</strong> High-margin shareables like "Big Plate Chicken"</li>
            </ul>
        </div>
    );
}

function CommunityContent() {
    return (
        <div>
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Uyghur Eats functions as a neighborhood anchor. Family-run service, <strong className="text-black font-semibold">strong word of mouth</strong>, and traffic from nearby universities, embassies, and residences support repeat demand.
            </p>
        </div>
    );
}

function MarketContent() {
    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Property Profile</h4>
                <p className="text-sm text-neutral-600 leading-relaxed mb-1">
                    <strong className="text-black font-medium">Size:</strong> 2,880 sqft retail space on a 0.05-acre lot. High-ceiling dining room.
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                    <strong className="text-black font-medium">History:</strong> The location has supported Central Asian restaurant demand for years, which lowers concept risk for the footprint.
                </p>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Glover Park Demographics</h4>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                    Highly affluent population with median household incomes between $142K–$166K.
                    Boasts a "Walker's Paradise" score of 91, funneling significant, consistent foot traffic directly to the Wisconsin Ave strip.
                </p>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Competitive Landscape</h4>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                    Nearby competition covers Italian, Middle Eastern, and fast casual formats, but not authentic hand-pulled noodles. That makes the concept unusually defensible for the corridor.
                </p>
            </div>
        </div>
    );
}

function ThesisContent() {
    return (
        <div className="bg-black text-white p-6 md:p-8">
            <p className="text-sm text-neutral-300 leading-relaxed">
                Uyghur Eats is attractive because the product is difficult to replicate, the location is strong, and demand is already embedded in the neighborhood.
            </p>
        </div>
    );
}

function GrowthContent() {
    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Cafe & Restaurant Buyers</h4>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                    Immediate acquisition for operators who want a live handmade-noodle concept. Growth upside comes from wider delivery coverage and longer hours.
                </p>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Continued Operations & Management</h4>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                    For holdco or absentee ownership, B2W can layer in operating systems such as inventory tracking and shift scheduling without changing the local-facing brand.
                </p>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Mixed-Use Space Redevelopment</h4>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                    The Wisconsin Ave footprint also supports a longer-term land-bank strategy: preserve restaurant cash flow while evaluating upper-level residential additions.
                </p>
            </div>
        </div>
    );
}

function RevenueContent() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                    { label: 'Avg Monthly Revenue', value: '—', note: 'Pending financial review' },
                    { label: 'Annual Gross Revenue', value: '—', note: 'Year-over-year' },
                    { label: 'Gross Margin', value: '—', note: 'Pre-owner compensation' },
                    { label: 'Growth Rate', value: '—', note: 'Trailing 12 months' },
                ].map((stat) => (
                    <div key={stat.label} className="border border-neutral-200 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">{stat.label}</p>
                        <p className="text-2xl font-medium text-black">{stat.value}</p>
                        <p className="mt-1 text-xs text-neutral-400">{stat.note}</p>
                    </div>
                ))}
            </div>

            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-3">Revenue Composition</h4>
                <div className="space-y-3">
                    {[
                        { stream: 'Dine-in', pct: '—' },
                        { stream: 'Takeout & Delivery', pct: '—' },
                        { stream: 'Catering & Events', pct: '—' },
                    ].map((row) => (
                        <div key={row.stream} className="flex items-center justify-between border-b border-neutral-100 pb-2">
                            <span className="text-sm text-neutral-700">{row.stream}</span>
                            <span className="text-sm font-medium text-black">{row.pct}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EarningsContent() {
    return (
        <div className="space-y-6">
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Seller's Discretionary Earnings (SDE) normalizes owner compensation, one-time expenses, and non-operational costs to reflect true earning power.
            </p>

            <div className="border border-neutral-200">
                <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Normalization Adjustments</p>
                </div>
                {[
                    'Net Income (reported)',
                    '+ Owner salary & benefits',
                    '+ One-time legal / consulting',
                    '+ Depreciation & amortization',
                    '+ Personal expenses through business',
                    '= Adjusted SDE',
                ].map((line, idx) => (
                    <div key={idx} className={`flex items-center justify-between px-4 py-3 text-sm ${idx === 5 ? 'bg-black text-white font-medium' : 'border-b border-neutral-100 text-neutral-700'}`}>
                        <span>{line}</span>
                        <span className="font-mono">—</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ComparablesContent() {
    return (
        <div className="space-y-6">
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Comparable business sales provide market context for establishing a reasonable valuation range.
            </p>

            <div className="border border-neutral-200">
                <div className="grid grid-cols-4 gap-0 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    <span>Business Type</span>
                    <span>Revenue</span>
                    <span>Sale Price</span>
                    <span>Multiple</span>
                </div>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="grid grid-cols-4 gap-0 border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700">
                        <span className="text-neutral-400">Comp {i}</span>
                        <span className="font-mono">—</span>
                        <span className="font-mono">—</span>
                        <span className="font-mono">—</span>
                    </div>
                ))}
            </div>

            <div className="p-4 border-l-2 border-black bg-neutral-50">
                <p className="text-sm text-neutral-700">
                    Valuation multiples will be sourced from BizBuySell, DealStats, and regional restaurant sale data.
                </p>
            </div>
        </div>
    );
}

function ValuationRangeContent() {
    return (
        <div className="space-y-6">
            <div className="bg-black text-white p-6 md:p-8">
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">Estimated Valuation Range</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Low</p>
                        <p className="text-2xl font-medium md:text-3xl">—</p>
                    </div>
                    <div className="text-center border-x border-white/15">
                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Mid</p>
                        <p className="text-2xl font-medium md:text-3xl">—</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2">High</p>
                        <p className="text-2xl font-medium md:text-3xl">—</p>
                    </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed text-center">
                    Ranges are based on SDE multiples benchmarked against comparable restaurant sales in the DC metro area.
                </p>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-3">Methodology</h4>
                <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                    <li>SDE-based multiple analysis (primary)</li>
                    <li>Revenue-based multiple cross-reference</li>
                    <li>Asset-adjusted floor valuation</li>
                    <li>Location premium adjustment for Glover Park corridor</li>
                </ul>
            </div>
        </div>
    );
}

function TermRow({ label, detail }: { label: string; detail: string }) {
    return (
        <div className="p-4 border border-neutral-200 first:rounded-t-sm last:rounded-b-sm -mt-[1px] first:mt-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">{label}</p>
            <p className="text-sm text-neutral-700">{detail}</p>
        </div>
    );
}

/* ─── Main Portal Component ─── */

export default function UyghurEatsClientPortalV2() {
    const showcase = projectShowcaseOverridesByPath['/uyghur-eats'];
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
    const [activePackage, setActivePackage] = useState('opportunity');
    const [activeSection, setActiveSection] = useState('culinary');

    const openOfferModal = () => {
        setIsOfferSubmitted(false);
        setIsOfferModalOpen(true);
    };

    const navItems: ClientNavAction[] = [
        { label: 'Accept Proposal', type: 'cta', onClick: openOfferModal },
    ];

    const packageItems = [
        { 
            id: 'opportunity', 
            label: '1. Opportunity Webpage', 
            title: 'An Unrivaled Location with a Story to Tell.',
            hoverText: 'Spread the Word',
            icon: LayoutTemplate 
        },
        { 
            id: 'valuation', 
            label: '2. Valuation Modeling', 
            title: 'Potentially Missing $XX,000 in Sale.',
            hoverText: 'How Much Is it Worth?',
            icon: LineChart 
        },
        { 
            id: 'operations', 
            label: '3. Operations Documentation', 
            title: 'Consolidate all Paperwork',
            hoverText: 'Make Buyers Happy',
            icon: FileText 
        },
        { 
            id: 'due-diligence', 
            label: '4. Buyer Due Diligence Package', 
            title: 'Ready for Turnkey Handoff.',
            hoverText: 'Turnkey Handoff',
            icon: BriefcaseBusiness 
        },
        { 
            id: 'terms', 
            label: '5. Terms & Conditions', 
            title: 'Terms & Conditions',
            hoverText: 'Review Terms',
            icon: Scale 
        },
    ];

    // Filtered items for the navigation section (excluding Terms)
    const offerItems = packageItems.filter(pkg => pkg.id !== 'terms');

    const images = [
        { url: '/images/uyghur-eats/interior.jpg', alt: 'Uyghur Eats Interior with Cultural Murals' },
        { url: '/images/uyghur-eats/laghman.jpg', alt: 'Signature Hand-Pulled Laghman Noodles' },
        { url: '/images/uyghur-eats/chicken.jpg', alt: 'Big Plate Chicken Dish' },
        { url: '/images/uyghur-eats/soup.jpg', alt: 'Traditional Pot Soup' },
        { url: '/images/uyghur-eats/platter.jpg', alt: 'Specialty Platter' },
    ];

    const packageSections: Record<string, { id: string; label: string; icon?: any; content: ReactNode }[]> = {
        opportunity: [
            { id: 'culinary', label: 'Culinary Draw', icon: ChefHat, content: <CulinaryContent /> },
            { id: 'community', label: 'Community Integration', icon: Users, content: <CommunityContent /> },
            { id: 'market', label: 'Market Analysis', icon: LineChart, content: <MarketContent /> },
            { id: 'thesis', label: 'Acquisition Thesis', icon: Target, content: <ThesisContent /> },
            { id: 'growth', label: 'Use Cases & Growth', icon: TrendingUp, content: <GrowthContent /> },
        ],
        valuation: [
            { id: 'revenue', label: 'Revenue & Profitability', icon: BarChart3, content: <RevenueContent /> },
            { id: 'earnings', label: 'Normalized Earnings (SDE)', icon: DollarSign, content: <EarningsContent /> },
            { id: 'comparables', label: 'Comparable Sales', icon: TrendingUp, content: <ComparablesContent /> },
            { id: 'range', label: 'Estimated Valuation Range', icon: Scale, content: <ValuationRangeContent /> },
        ],
        operations: [
            { id: 'sop', label: 'SOP Documentation', content: <p className="text-sm text-neutral-600">Standardizing manual tasks for seamless transition.</p> },
            { id: 'vendors', label: 'Vendor Management', content: <p className="text-sm text-neutral-600">Inventory and supply chain workflows.</p> },
            { id: 'staffing', label: 'Staffing Model', content: <p className="text-sm text-neutral-600">Defining roles and shift scheduling.</p> },
        ],
        'due-diligence': [
            { id: 'financials', label: 'Financial Records', content: <p className="text-sm text-neutral-600">Verified P&L and tax documentation.</p> },
            { id: 'legal', label: 'Legal & Permits', content: <p className="text-sm text-neutral-600">Health permits, ABC license (if applicable), and lease terms.</p> },
            { id: 'assets', label: 'Asset Inventory', content: <p className="text-sm text-neutral-600">Complete list of FFE (Furniture, Fixtures, and Equipment icon).</p> },
        ],
        terms: [
            { id: '1-scope', label: '1. Scope of Work', content: <TermRow label="1. Scope of Work" detail="Services are limited to the preparation, analysis, and documentation outlined in the selected option(s) above. B2W provides advisory and preparation services only." /> },
            { id: '2-info', label: '2. Information Provided by Client', content: <TermRow label="2. Information Provided by Client" detail="The client is responsible for providing accurate financial, operational, and business information required to perform the services. B2W will rely on the information provided and does not independently audit or verify its accuracy." /> },
            { id: '3-financial', label: '3. Financial Analysis and Valuation', content: <TermRow label="3. Financial Analysis and Valuation" detail="Any valuation estimates or financial analyses are illustrative and based on available data and market benchmarks. They are not formal appraisals and do not guarantee a specific sale price or transaction outcome." /> },
            { id: '4-market', label: '4. Market Research', content: <TermRow label="4. Market Research" detail="Market research and competitive analysis are based on publicly available information and industry data available at the time of analysis. Market conditions may change over time and may affect the accuracy or relevance of findings." /> },
            { id: '5-docs', label: '5. Documentation and SOP Development', content: <TermRow label="5. Documentation and SOP Development" detail="Operational documentation and SOPs will be developed based on interviews, available records, and observations of current processes. These materials are intended as guidance and may require future updates as the business evolves." /> },
            { id: '6-participation', label: '6. Client Participation', content: <TermRow label="6. Client Participation" detail="Timely client participation, including interviews, document sharing, and operational clarification, is required to complete the engagement within the estimated timeline." /> },
            { id: '7-buyer', label: '7. Buyer Communication and Brokerage Activities', content: <TermRow label="7. Buyer Communication and Brokerage Activities" detail="B2W does not act as a licensed business broker, intermediary, or advisor in negotiating a transaction. B2W will not solicit buyers, negotiate sale terms, or participate in brokerage activities. All communications with prospective buyers and any transaction negotiations will be conducted by the business owner or their licensed broker." /> },
            { id: '8-materials', label: '8. Use of Materials', content: <TermRow label="8. Use of Materials" detail="All materials prepared as part of the engagement are intended for use by the client in presenting the business opportunity to prospective buyers. The client retains ownership of materials produced specifically for their business. B2W reserves the right to reference non-confidential aspects of the engagement for portfolio or case study purposes." /> },
            { id: '9-confidentiality', label: '9. Confidentiality', content: <TermRow label="9. Confidentiality" detail="Both parties agree to maintain confidentiality of non-public financial, operational, and strategic information shared during the engagement." /> },
            { id: '10-timeline', label: '10. Timeline and Deliverables', content: <TermRow label="10. Timeline and Deliverables" detail="Project timelines are estimates based on timely client participation and information availability. Delays in receiving required information may extend the project timeline." /> },
            { id: '11-payment', label: '11. Payment Terms', content: <TermRow label="11. Payment Terms" detail="Payment terms will be outlined in the selected package. Unless otherwise agreed, payment is due at the start of the engagement." /> },
            { id: '12-legal', label: '12. No Legal, Tax, or Investment Advice', content: <TermRow label="12. No Legal, Tax, or Investment Advice" detail="B2W does not provide legal, tax, accounting, or investment advice. Clients should consult qualified professionals for advice related to legal matters, taxation, accounting treatment, or transaction structuring." /> },
            { id: '13-guarantee', label: '13. No Guarantee of Sale', content: <TermRow label="13. No Guarantee of Sale" detail="While the services are designed to improve the presentation and preparedness of the business for sale, B2W does not guarantee that a sale will occur or that any specific valuation or transaction outcome will be achieved." /> },
        ],
    };

    useEffect(() => {
        const handleScroll = () => {
            const packageElements = packageItems.map(p => document.getElementById(`pkg-${p.id}`));
            const scrollPos = window.scrollY + 250;

            for (let i = packageElements.length - 1; i >= 0; i--) {
                const el = packageElements[i];
                if (el && el.offsetTop <= scrollPos) {
                    setActivePackage(packageItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentSubSectionIds = useMemo(() => packageSections[activePackage].map(s => s.id), [activePackage]);
    useScrollSectionNav(currentSubSectionIds, activeSection, setActiveSection);

    const scrollToPackage = (id: string) => {
        const el = document.getElementById(`pkg-${id}`);
        if (el) {
            const offset = 140; 
            window.scrollTo({
                top: el.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 180;
            window.scrollTo({
                top: el.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    };

    const handleNextDeliverable = () => {
        const currentIndex = packageItems.findIndex(p => p.id === activePackage);
        const nextPkg = packageItems[currentIndex + 1];
        if (nextPkg) {
            scrollToPackage(nextPkg.id);
        }
    };
    const currentPkgIndex = packageItems.findIndex(p => p.id === activePackage);
    const nextPkg = packageItems[currentPkgIndex + 1];

    return (
        <article className={`${projectPageShellClassName} bg-white`}>
            <ClientNavbar 
                clientName="Uyghur Eats" 
                clientLink="/client/uyghur-eats-v2"
                navItems={navItems} 
            />
            <Seo
                title="Uyghur Eats | Unified Client Portal"
                description="Explore the complete business exit strategy for Uyghur Eats. Unified portal containing opportunity profile, valuation modeling, and operations documentation."
            />

            <motion.header 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-32 pb-16 px-6 max-w-7xl mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-24 items-start">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6">
                            <span>Client Portal</span>
                            <span className="text-neutral-200">/</span>
                            <span>Sale Preparation</span>
                        </div>
                        <h1 className="mb-8 text-5xl font-medium tracking-tight md:text-7xl lg:text-8xl">
                            Business Sale Preparation & Opportunity Packaging
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                            A consolidated view of the preparation phase for Uyghur Eats. This portal contains all strategic deliverables required to exit the business at peak value.
                        </p>
                    </div>

                    <aside className="border border-neutral-900 bg-neutral-950 text-white p-8 md:p-10">
                        <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-6">
                            Proposal Details
                        </p>
                        <h2 className="mb-8 text-3xl font-medium tracking-tight md:text-4xl">
                            Explore how we can add value to your Business Exit.
                        </h2>
                        <div className="space-y-6 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Investment Range</p>
                                <p className="text-xl font-medium">$4K – $7.5K</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Timeline</p>
                                <p className="text-xl font-medium">3 Weeks</p>
                            </div>
                        </div>
                        <div className="mt-10 p-4 bg-white/5 border border-white/10 text-sm text-neutral-400 italic">
                            Strictly Confidential. Access limited to authorized personnel only.
                        </div>
                    </aside>
                </div>
            </motion.header>

            <section className="bg-neutral-50 border-y border-neutral-100 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-4">Deliverables</p>
                    <h2 className="text-center text-3xl font-medium tracking-tight mb-12">Our Offer to You</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {offerItems.map(pkg => (
                            <button
                                key={pkg.id}
                                onClick={() => scrollToPackage(pkg.id)}
                                className={`group relative p-6 bg-white border border-neutral-200 text-left transition-all hover:border-black hover:shadow-xl ${
                                    activePackage === pkg.id ? 'border-black ring-1 ring-black shadow-lg' : ''
                                }`}
                            >
                                <div className="mb-4 text-neutral-400 transition-colors group-hover:text-black">
                                    <pkg.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900 mb-2">
                                    {pkg.label.split('. ')[1]}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                                    {pkg.hoverText || 'View Details'}
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12 lg:gap-20 items-start">
                    
                    <div className="space-y-32">
                        {packageItems.map(pkg => (
                            <section key={pkg.id} id={`pkg-${pkg.id}`} className="scroll-mt-40">
                                <div className="mb-12">
                                    <div className="flex items-center gap-3 text-neutral-400 mb-4">
                                        <pkg.icon className="w-5 h-5" />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.22em]">{pkg.label}</span>
                                    </div>
                                    <h2 className="text-3xl font-medium tracking-tight md:text-5xl">{pkg.title}</h2>
                                    
                                    {pkg.id === 'opportunity' && (
                                        <div className="mt-8 space-y-12">
                                            <div className="max-w-3xl">
                                                <LocationContent />
                                            </div>
                                            <div className="max-w-5xl">
                                                <ImageCarousel images={images} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-24">
                                    {packageSections[pkg.id].map(sub => (
                                        <div key={sub.id} id={sub.id} className="scroll-mt-48 group">
                                            <div className="flex items-start gap-4 mb-6">
                                                {sub.icon && (
                                                    <div className="mt-1 p-1.5 border border-neutral-100 text-neutral-400">
                                                        <sub.icon className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-medium text-black mb-4">
                                                        {sub.label}
                                                    </h3>
                                                    <div className="max-w-3xl">
                                                        {sub.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <aside className="hidden lg:block sticky top-48">
                        <div className="mb-6">
                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 mb-2 whitespace-nowrap overflow-hidden">
                                Deliverable
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold truncate">
                                    {packageItems.find(p => p.id === activePackage)?.label.split('. ')[1]}
                                </p>
                                {activePackage !== 'terms' && (
                                    <button 
                                        onClick={handleNextDeliverable}
                                        className="p-1 hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-black"
                                        title="Next Deliverable"
                                    >
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="h-px bg-neutral-100 mb-6" />
                        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 mb-4">Sections</p>
                        <nav className="space-y-1">
                            {packageSections[activePackage].map((sub, i) => (
                                <button
                                    key={sub.id}
                                    onClick={() => scrollToSection(sub.id)}
                                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors border-l-2 ${
                                        activeSection === sub.id
                                            ? 'border-black text-black font-medium bg-neutral-50'
                                            : 'border-transparent text-neutral-400 hover:text-black hover:border-neutral-300'
                                    }`}
                                >
                                    <span className="font-mono text-[10px] tracking-[0.18em] mr-2">{String(i + 1).padStart(2, '0')}</span>
                                    {sub.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                </div>
            </main>

            <UyghurEatsOfferModal 
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                isSubmitted={isOfferSubmitted}
                onSubmit={(e) => { e.preventDefault(); setIsOfferSubmitted(true); }}
            />

            <footer className="mt-32 py-12 px-6 max-w-7xl mx-auto border-t border-neutral-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <h3 className="text-lg font-medium tracking-tight">B2W</h3>
                        <p className="text-sm text-neutral-500 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
                    </div>

                    <div className="flex gap-8 text-sm text-neutral-600">
                        <a href="mailto:info@b2w-ai.com?subject=B2W%20Inquiry" className="hover:text-black transition-colors">Contact</a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-neutral-50">
                    <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-sm">
                        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-900/40 mb-2">Confidentiality Notice</p>
                        <p className="text-xs text-red-900/60 leading-relaxed italic">
                            This information is strictly confidential and sharing without explicit notice may warrant legal action. All financial and operational details contained herein are subject to an active Non-Disclosure Agreement.
                        </p>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {activePackage === 'opportunity' && nextPkg && (
                    <motion.div
                        key={nextPkg.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none"
                    >
                        <button
                            type="button"
                            onClick={() => scrollToPackage(nextPkg.id)}
                            className="pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-neutral-800"
                        >
                            Next Section: {nextPkg.label.split('. ')[1]}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
                {activePackage === 'terms' && (
                    <motion.div
                        key="accept-proposal"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none"
                    >
                        <button
                            type="button"
                            onClick={openOfferModal}
                            className="pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-all hover:scale-105 hover:bg-neutral-800"
                        >
                            Accept Proposal
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
}
