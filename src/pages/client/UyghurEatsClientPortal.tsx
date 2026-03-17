import { useEffect, useState, useRef, useCallback, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, LineChart, FileText, LayoutTemplate, BriefcaseBusiness, X, FileSignature, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useScrollSectionNav } from '../../hooks/useScrollSectionNav';
import ProfileSectionNav, { type ProfileSectionNavItem } from '../../components/ProfileSectionNav';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import {
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../components/projectPageLayout';

/* ─── Section content data ──────────────────────────────────── */
type SectionDef = {
    id: string;
    label: string;
    content: ReactNode;
};

function OverviewContent() {
    return (
        <div className="space-y-4">
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                <li>Business overview and history</li>
                <li>Description of products or services</li>
                <li>Customer profile and demand drivers</li>
                <li>Financial highlights and revenue model</li>
                <li>Competitive positioning and market overview</li>
                <li>Key assets included in the sale</li>
                <li>Growth opportunities for a new owner</li>
            </ul>
            <div className="mt-4 p-4 border-l-2 border-black bg-neutral-50">
                <strong className="block text-sm font-medium text-black mb-1">Deliverable</strong>
                <p className="text-sm text-neutral-700">A structured Business Opportunity Page designed to clearly communicate the value of the business.</p>
                <Link
                    to="/uyghur-eats?return=%2Fclient%2Fuyghur-eats"
                    className="mt-4 inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                >
                    View Sample Webpage
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

function ValuationContent() {
    return (
        <div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                <li>Review of historical revenue and profitability</li>
                <li>Normalized owner earnings analysis</li>
                <li>Benchmarking against comparable business sales</li>
                <li>Estimated valuation range based on market multiples</li>
            </ul>
            <div className="mt-4 p-4 border-l-2 border-black bg-neutral-50">
                <strong className="block text-sm font-medium text-black mb-1">Deliverable</strong>
                <p className="text-sm text-neutral-700">A valuation model and summary explaining potential sale price ranges.</p>
                <Link
                    to="/uyghur-eats-valuation-model?return=%2Fclient%2Fuyghur-eats"
                    className="mt-4 inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                >
                    View Sample Model
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

function OperationsContent() {
    return (
        <div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                <li>Documentation of key processes and workflows</li>
                <li>Creation or formalization of Standard Operating Procedures (SOPs)</li>
                <li>Vendor and supplier documentation</li>
                <li>Marketing and customer acquisition processes</li>
                <li>Staff roles and operational responsibilities</li>
            </ul>
            <div className="mt-4 p-4 border-l-2 border-black bg-neutral-50">
                <strong className="block text-sm font-medium text-black mb-1">Deliverable</strong>
                <p className="text-sm text-neutral-700">A structured Business Operations Manual to help a new owner quickly understand and operate the business.</p>
            </div>
        </div>
    );
}

function TermsContent() {
    return (
        <div className="space-y-6">
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Review the primary terms and conditions for the engagement.
            </p>
            <div className="border border-neutral-200 divide-y divide-neutral-100">
                {[
                    { label: 'Exclusivity', detail: 'Engagement is exclusive for a period of 4 months from signing.' },
                    { label: 'Success Fee', detail: 'Payable only upon successful transaction or capital raise.' },
                    { label: 'Confidentiality', detail: 'Mutual NDA covers all financial and operational disclosures.' },
                    { label: 'Termination', detail: 'Either party may terminate with 30 days written notice.' },
                ].map((item) => (
                    <div key={item.label} className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">{item.label}</p>
                        <p className="text-sm text-neutral-700">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DueDiligenceContent() {
    return (
        <div className="space-y-6">
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                <li>Business summary and key investment highlights</li>
                <li>Organized financial summaries</li>
                <li>Vendor and supplier overview</li>
                <li>Lease or location information</li>
                <li>Equipment and asset inventory</li>
                <li>Marketing channels and digital assets</li>
                <li>Growth opportunities and common buyer questions</li>
            </ul>
            <div className="mt-4 p-4 border-l-2 border-black bg-neutral-50">
                <strong className="block text-sm font-medium text-black mb-1">Deliverable</strong>
                <p className="text-sm text-neutral-700">A structured Buyer Information Package / Data Room that the owner can share with qualified buyers.</p>
            </div>
        </div>
    );
}

/* ─── Section icon map ──────────────────────────────────── */
const sectionIconMap: Record<string, typeof LayoutTemplate> = {
    overview: LayoutTemplate,
    valuation: LineChart,
    operations: FileText,
    'due-diligence': BriefcaseBusiness,
    terms: Scale,
    'accept-proposal': FileSignature,
};

/* ─── Main component ──────────────────────────────────── */
export default function UyghurEatsClientPortal() {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [visibleCtas, setVisibleCtas] = useState<Set<Element>>(new Set());
    const heroCtaRef = useRef<HTMLAnchorElement>(null);
    const endCtaRef = useRef<HTMLButtonElement>(null);

    const sections: SectionDef[] = [
        { id: 'overview', label: '1. Opportunity Webpage', content: <OverviewContent /> },
        { id: 'valuation', label: '2. Valuation Modeling', content: <ValuationContent /> },
        { id: 'operations', label: '3. Operations Documentation', content: <OperationsContent /> },
        { id: 'due-diligence', label: '4. Buyer Due Diligence Package', content: <DueDiligenceContent /> },
        { id: 'terms', label: '5. Terms & Conditions', content: <TermsContent /> },
    ];

    const sectionItems: ProfileSectionNavItem[] = [
        ...sections.map((s) => ({ id: s.id, label: s.label })),
        { id: 'accept-proposal', label: '6. Accept Proposal' },
    ];

    const allSectionIds = sectionItems.map((s) => s.id);

    const handleSectionSelect = useCallback((id: string) => {
        if (id === 'accept-proposal') {
            openOfferModal();
            return;
        }
        setActiveSection(id);
    }, []);

    useScrollSectionNav(allSectionIds, activeSection, handleSectionSelect);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleCtas((prev) => {
                    const next = new Set(prev);
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            next.add(entry.target);
                        } else {
                            next.delete(entry.target);
                        }
                    });
                    return next;
                });
            },
            { threshold: 0, rootMargin: '0px 0px 50px 0px' }
        );

        if (heroCtaRef.current) observer.observe(heroCtaRef.current);
        if (endCtaRef.current) observer.observe(endCtaRef.current);

        return () => observer.disconnect();
    }, []);

    const showFloatingCta = visibleCtas.size === 0 && !isOfferModalOpen;

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

    /* Current section metadata */
    const currentSection = sections.find((s) => s.id === activeSection) ?? sections[0];
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    const nextSection = sections[currentIndex + 1];
    const Icon = sectionIconMap[currentSection.id];

    const navItems: ClientNavAction[] = [
        { label: 'Proposal', onClick: () => setActiveSection('overview') },
        { 
            label: 'Package', 
            items: [
                { label: 'Valuation Modeling', onClick: () => setActiveSection('valuation') },
                { label: 'Operations Documentation', onClick: () => setActiveSection('operations') },
                { label: 'Buyer Due Diligence', onClick: () => setActiveSection('due-diligence') },
            ]
        },
        { label: 'Terms', onClick: () => setActiveSection('terms') },
        { label: 'Accept', type: 'cta', onClick: openOfferModal },
    ];

    return (
        <article className={projectPageShellClassName}>
            <ClientNavbar clientName="Uyghur Eats" navItems={navItems} />
            <Seo
                title="Uyghur Eats | Client Portal"
                description="Secure client portal for Uyghur Eats. Review business sale preparation deliverables, valuation models, operations documentation, and buyer packages from B2W."
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className={projectPageHeaderClassName}>
                    <div className={projectHeroGridClassNames.profile}>
                        <div>
                            <h1 className="mb-8 text-4xl font-medium tracking-tight md:text-6xl">
                                Business Sale Preparation & Opportunity Packaging
                            </h1>

                            <div className="mb-8 grid gap-3 md:grid-cols-2">
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                    <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                                </div>
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Project Type</span>
                                    <span className="mt-2 block font-medium text-black">Sale Preparation</span>
                                </div>
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 text-white p-6 md:p-7">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">
                                Proposal details
                            </p>
                            <h2 className="mb-6 text-2xl font-medium tracking-tight md:text-3xl">
                                Execute the preparation phase and package the operations.
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Investment</p>
                                    <p className="font-medium">$4K - $7.5K</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Timeline</p>
                                    <p className="font-medium">3 Weeks</p>
                                </div>
                            </div>

                            <a
                                ref={heroCtaRef}
                                href="#overview"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveSection('overview');
                                }}
                                className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                            >
                                Explore Scope
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </aside>
                    </div>
                </header>

                {/* ─── Tab Navigation ──────────────────────────────── */}
                <ProfileSectionNav
                    items={sectionItems}
                    activeId={activeSection}
                    onSelect={handleSectionSelect}
                />

                {/* ─── Content Frame ──────────────────────────────── */}
                <main className="mt-8 md:mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 lg:gap-12 items-start">
                        {/* Left: active section content */}
                        <AnimatePresence mode="wait">
                            <motion.section
                                key={currentSection.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="mb-6 flex items-center gap-3">
                                    {Icon && (
                                        <div className="border border-neutral-200 p-2">
                                            <Icon className="h-5 w-5 text-black" />
                                        </div>
                                    )}
                                    <h2 className="text-xl font-medium md:text-2xl">{currentSection.label}</h2>
                                </div>
                                <div className="pb-6">
                                    {currentSection.content}
                                </div>
                                {/* Mobile: next section link */}
                                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 lg:hidden">
                                    <p className="text-xs font-mono uppercase tracking-[0.18em] text-neutral-400">
                                        {String(currentIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
                                    </p>
                                    {nextSection && (
                                        <button type="button" onClick={() => setActiveSection(nextSection.id)} className="inline-flex items-center gap-2 text-sm font-medium text-black">
                                            {nextSection.label}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.section>
                        </AnimatePresence>

                        {/* Right sidebar: section index (desktop) */}
                        <aside className="hidden lg:block sticky top-40">
                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 mb-4">Package Items</p>
                            <nav className="space-y-1">
                                {sections.map((s, i) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setActiveSection(s.id)}
                                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors border-l-2 ${
                                            s.id === activeSection
                                                ? 'border-black text-black font-medium bg-neutral-50'
                                                : 'border-transparent text-neutral-400 hover:text-black hover:border-neutral-300'
                                        }`}
                                    >
                                        <span className="font-mono text-[10px] tracking-[0.18em] mr-2">{String(i + 1).padStart(2, '0')}</span>
                                        {s.label.replace(/^\d+\.\s*/, '')}
                                    </button>
                                ))}
                            </nav>
                        </aside>
                    </div>
                </main>
            </motion.div>

            {isOfferModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-0 py-0 md:px-4 md:py-8"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="offer-modal-title"
                    onClick={closeOfferModal}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-2xl border-0 md:border md:border-neutral-200 bg-white md:shadow-2xl overflow-y-auto"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeOfferModal}
                            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:text-black"
                            aria-label="Close form"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="border-b border-neutral-200 px-6 py-5 md:px-8">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                                Letter of Intent
                            </p>
                            <h2 id="offer-modal-title" className="text-2xl font-medium tracking-tight">
                                Proposal Acceptance
                            </h2>
                        </div>

                        {!isOfferSubmitted ? (
                            <form onSubmit={handleOfferSubmit} className="px-6 py-6 md:px-8 md:py-8">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Client Name</span>
                                        <input
                                            type="text"
                                            name="clientName"
                                            required
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="Legal entity or name"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Authorized Representative</span>
                                        <input
                                            type="text"
                                            name="representative"
                                            required
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="Name of signee"
                                        />
                                    </label>
                                </div>

                                <label className="mt-5 block border-b border-neutral-300 pb-2">
                                    <span className="mb-2 block text-sm font-medium text-neutral-800">Signature</span>
                                    <input
                                        type="text"
                                        name="signature"
                                        required
                                        className="w-full font-serif italic text-lg outline-none transition-colors focus:border-black text-black"
                                        placeholder="Type signature here..."
                                    />
                                </label>

                                <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-5 md:flex-row md:items-center md:justify-between">
                                    <p className="text-xs leading-5 text-neutral-500">
                                        All information is strictly confidential and private.
                                    </p>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                    >
                                        Execute LOI
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="px-6 py-8 md:px-8">
                                <div className="border border-neutral-200 bg-neutral-50 p-6">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                                        Success
                                    </p>
                                    <h3 className="text-2xl font-medium tracking-tight mb-3">
                                        Letter of Intent Received
                                    </h3>
                                    <p className="max-w-xl text-sm leading-6 text-neutral-600">
                                        Your acceptance has been captured. B2W will forward the finalized service contract to govern the legal relationship shortly.
                                    </p>
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={closeOfferModal}
                                            className="inline-flex items-center justify-center border border-neutral-300 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            <AnimatePresence>
                {showFloatingCta && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-0 right-0 z-40 flex justify-center pointer-events-none"
                    >
                        <button
                            type="button"
                            onClick={openOfferModal}
                            className="pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-neutral-800"
                        >
                            Accept Proposal
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
}
