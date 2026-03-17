import { useEffect, useState, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, LineChart, FileText, LayoutTemplate, BriefcaseBusiness, X, FileSignature } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import ProfileSectionNav, { type ProfileSectionNavItem } from '../../components/ProfileSectionNav';
import ResponsiveAccordionSection from '../../components/ResponsiveAccordionSection';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../components/projectPageLayout';

export default function UyghurEatsClientPortal() {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
    const [visibleCtas, setVisibleCtas] = useState<Set<Element>>(new Set());
    const heroCtaRef = useRef<HTMLAnchorElement>(null);
    const endCtaRef = useRef<HTMLButtonElement>(null);

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

    const sectionItems: ProfileSectionNavItem[] = [
        { id: 'overview', label: '1. Opportunity Webpage' },
        { id: 'valuation', label: '2. Valuation Modeling' },
        { id: 'operations', label: '3. Operations Documentation' },
        { id: 'due-diligence', label: '4. Buyer Due Diligence Package' },
    ];

    return (
        <article className={projectPageShellClassName}>
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
                            <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                                Business Sale Preparation & Opportunity Packaging
                            </h1>

                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                Prepare the business for sale by organizing financial, operational, and market information into a clear, professional package that communicates the opportunity to potential buyers. This process helps increase buyer confidence, improve perceived value, and streamline the sale process.
                            </p>

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
                            <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">
                                Execute the preparation phase and package the operations.
                            </h2>
                            <p className="text-sm leading-6 text-neutral-300 mb-6">
                                B2W provides business preparation, research, and documentation services. All communications with prospective buyers and sale negotiations will be conducted directly by the business owner or their licensed broker.
                            </p>
                            
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
                                    const element = document.getElementById('overview');
                                    if (element) {
                                        const y = element.getBoundingClientRect().top + window.scrollY - 100;
                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                    }
                                }}
                                className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                            >
                                Explore Scope
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <p className="mt-3 text-xs text-neutral-500">
                                Review the phase-by-phase timeline below.
                            </p>
                        </aside>
                    </div>
                </header>

                <main data-project-body className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-12 sticky top-24 z-30 bg-white md:bg-transparent">
                        <ProfileSectionNav
                            items={sectionItems}
                            description="Review the four phases of the delivery timeline to ensure alignment with the sale packaging objectives."
                        />
                    </div>
                    {/* Content Section */}
                    <div className="lg:col-span-8 space-y-12">
                        <ResponsiveAccordionSection
                            id="overview"
                            title="1. Business Opportunity Overview Webpage"
                            icon={LayoutTemplate}
                            defaultOpen
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body className="space-y-4">
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Develop a professional digital overview that presents the business in a clear and compelling format for prospective buyers.
                                </p>
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="valuation"
                            title="2. Valuation Modeling & Estimated Sale Range"
                            icon={LineChart}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body>
                                <p className="mb-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Develop an estimated valuation range based on available financial and operational data.
                                </p>
                                <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                                    <li>Review of historical revenue and profitability</li>
                                    <li>Normalized owner earnings analysis</li>
                                    <li>Benchmarking against comparable business sales</li>
                                    <li>Estimated valuation range based on market multiples</li>
                                </ul>
                                <div className="mt-4 p-4 border-l-2 border-black bg-neutral-50">
                                    <strong className="block text-sm font-medium text-black mb-1">Deliverable</strong>
                                    <p className="text-sm text-neutral-700">A valuation model and summary explaining potential sale price ranges.</p>
                                </div>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="operations"
                            title="3. Operations Documentation & SOP Packaging"
                            icon={FileText}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body>
                                <p className="mb-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Organize and formalize the operational knowledge of the business so it can transfer smoothly to a buyer.
                                </p>
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="due-diligence"
                            title="4. Buyer Due Diligence Package"
                            icon={BriefcaseBusiness}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body className="space-y-6">
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Prepare and organize the materials commonly requested by prospective buyers so the business can be clearly evaluated.
                                </p>
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="accept-proposal"
                            title="5. Accept Proposal"
                            icon={FileSignature}
                            className="border-t border-neutral-200"
                            headerClassName="border-b border-neutral-200 p-4 bg-black text-white"
                            bodyClassName="px-4 py-6 md:px-6 md:py-8 bg-neutral-50 border border-neutral-200"
                            titleClassName="md:text-xl font-medium"
                            tone="dark"
                        >
                            <div className="space-y-6 max-w-2xl">
                                <h3 className="text-xl font-medium">Ready to start the sale preparation process?</h3>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    Execute the preparation phase and package the operations. B2W provides business preparation, research, and documentation services. All communications with prospective buyers and sale negotiations will be conducted directly by the business owner or their licensed broker.
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-6 text-sm max-w-sm">
                                    <div className="border border-neutral-200 bg-white p-4">
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Investment Range</p>
                                        <p className="font-medium text-xl">$4K - $7.5K</p>
                                    </div>
                                    <div className="border border-neutral-200 bg-white p-4">
                                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Timeline</p>
                                        <p className="font-medium text-xl">3 Weeks</p>
                                    </div>
                                </div>
                                <button
                                    ref={endCtaRef}
                                    type="button"
                                    onClick={openOfferModal}
                                    className="inline-flex items-center justify-center gap-2 bg-black px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                >
                                    Accept Proposal
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Opens a letter of intent for direct engagement.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>
                    </div>
                </main>
            </motion.div>

            {isOfferModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-8"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="offer-modal-title"
                    onClick={closeOfferModal}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-2xl border border-neutral-200 bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
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
                            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
                                By signing below, Client acknowledges and accepts the scope of services, pricing, and assumptions described in this proposal. This section only serves as a non-binding letter of intent.
                            </p>
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
                        <a
                            href="#accept-proposal"
                            className="pointer-events-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)] inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-neutral-800"
                        >
                            Accept Proposal
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
}
