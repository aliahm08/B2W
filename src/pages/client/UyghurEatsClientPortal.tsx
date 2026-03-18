import { useEffect, useState, useRef, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, LineChart, FileText, LayoutTemplate, BriefcaseBusiness, FileSignature, Scale, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../components/uyghur-eats/UyghurEatsOfferModal';
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
                    to="/client/uyghur-eats/opportunity"
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
                    to="/client/uyghur-eats/valuation"
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

const proposalValueAdds = [
    {
        id: 'maximize-returns',
        title: 'Maximize Returns',
        description:
            'We normalize your financial reality to ensure buyers see the full scope of your earning power, justification for premium multiples.',
        icon: TrendingUp,
        cardClassName: 'border-emerald-300',
        iconClassName: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
        id: 'ease-transfer',
        title: 'Ease Transfer',
        description:
            'We document your operations so thoroughly that a buyer can confidently step into a turnkey environment, reducing their risk and increasing your sale price.',
        icon: ShieldCheck,
        cardClassName: 'border-sky-300',
        iconClassName: 'text-sky-700 bg-sky-50 border-sky-200',
    },
] as const;

/* ─── Main component ──────────────────────────────────── */
export default function UyghurEatsClientPortal() {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
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
        if (section && section !== activeSection) {
            setActiveSection(section);
        }
    }, [section]);

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

    const navItems: ClientNavAction[] = [
        { label: 'Proposal', to: '/client/uyghur-eats' },
        { label: 'Opportunity', to: '/client/uyghur-eats/opportunity' },
        { label: 'Valuation', to: '/client/uyghur-eats/valuation' },
        { label: 'Accept', type: 'cta', onClick: openOfferModal }
    ];

    return (
        <article className={projectPageShellClassName}>
            <ClientNavbar 
                clientName="Uyghur Eats" 
                clientLink="/client/uyghur-eats"
                navItems={navItems} 
            />
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

                            <div className="mb-8 grid gap-4 md:grid-cols-2">
                                <div className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                    <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                                </div>
                                <div className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Project Type</span>
                                    <span className="mt-2 block font-medium text-black">Sale Preparation</span>
                                </div>
                                {proposalValueAdds.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`overflow-hidden border bg-white p-5 ${item.cardClassName}`}
                                        >
                                            <div className={`mb-5 inline-flex rounded-full border p-3 ${item.iconClassName}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-3">
                                                <h2 className="text-xl font-medium tracking-tight text-black">{item.title}</h2>
                                                <p className="text-sm leading-6 text-neutral-700">{item.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 text-white p-6 md:p-7">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">
                                Proposal details
                            </p>
                            <h2 className="mb-6 text-2xl font-medium tracking-tight md:text-3xl">
                                Three deliverables to position the business for a stronger transaction.
                            </h2>

                            <div className="mb-6 space-y-3 border-y border-white/10 py-5">
                                {[
                                    'Opportunity webpage',
                                    'Valuation modeling',
                                    'Operations documentation',
                                ].map((item, index) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-300">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-sm text-neutral-200">{item}</p>
                                    </div>
                                ))}
                            </div>
                            
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

                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/client/uyghur-eats/terms"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 group"
                                >
                                    View Key Terms
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={openOfferModal}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 group"
                                >
                                    Accept Proposal
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </aside>
                    </div>
                </header>

            </motion.div>

            <UyghurEatsOfferModal 
                isOpen={isOfferModalOpen}
                onClose={closeOfferModal}
                isSubmitted={isOfferSubmitted}
                onSubmit={handleOfferSubmit}
            />

            <footer className="mt-20 border-t border-neutral-100 py-12 px-6 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 opacity-50">
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2">B2W LLC</p>
                        <p className="text-xs text-neutral-500">M&A Advisory & Strategy Consulting</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Contact</p>
                        <p className="text-xs text-neutral-500 underline underline-offset-4">ali@b2w-ai.com</p>
                    </div>
                </div>
            </footer>

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
