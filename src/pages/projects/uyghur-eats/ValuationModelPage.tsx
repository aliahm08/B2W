import { useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, DollarSign, BarChart3, TrendingUp, Scale } from 'lucide-react';
import Seo from '../../../components/Seo';
import ProfileSectionNav from '../../../components/ProfileSectionNav';
import ClientNavbar, { type ClientNavAction } from '../../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../../components/uyghur-eats/UyghurEatsOfferModal';
import { useScrollSectionNav } from '../../../hooks/useScrollSectionNav';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../../components/projectPageLayout';

/* ─── Section content ──────────────────────────────────── */
type SectionDef = { id: string; label: string; content: ReactNode };

function RevenueContent() {
    return (
        <section className="space-y-12">
            <h2 className="text-3xl font-medium tracking-tight border-b pb-6">Revenue & Composition</h2>
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Monthly REV', value: '—', note: 'Pending Final Review' },
                    { label: 'Y-O-Y REV', value: '—', note: 'Trailing 12 Months' },
                    { label: 'Gross Margin', value: '—', note: 'Pre-normalization' },
                    { label: 'Growth Rate', value: '—', note: 'Trend Analysis' }
                ].map(stat => (
                    <div key={stat.label} className="p-6 border border-neutral-100 bg-white shadow-sm">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-bold">{stat.label}</p>
                        <p className="text-2xl font-medium">{stat.value}</p>
                        <p className="text-[9px] text-neutral-400 mt-2 font-mono">{stat.note}</p>
                    </div>
                ))}
            </div>
            <div className="p-10 border border-neutral-200 bg-neutral-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-lg rounded-sm gap-8">
                <div>
                    <h3 className="text-xl font-medium mb-2">Revenue Streams</h3>
                    <p className="text-neutral-400 text-sm">Balanced mix between Dine-in and Carry-out.</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-center font-mono">
                        <span className="block text-2xl mb-1">55%</span>
                        <span className="text-[10px] uppercase text-neutral-400 tracking-widest">Dine-in</span>
                    </div>
                    <div className="text-center font-mono border-l border-white/20 pl-8">
                        <span className="block text-2xl mb-1">45%</span>
                        <span className="text-[10px] uppercase text-neutral-400 tracking-widest">Takeout</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function EarningsContent() {
    return (
        <section className="space-y-12">
            <h2 className="text-3xl font-medium tracking-tight border-b pb-6">Model Methodology</h2>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="p-8 border border-neutral-100 bg-neutral-50/50 shadow-sm">
                        <h3 className="text-sm font-mono uppercase tracking-[0.25em] text-neutral-400 mb-6 font-bold">Primary: SDE-Based Multiple</h3>
                        <p className="text-neutral-600 leading-relaxed text-lg">
                            Determining true earning power (Seller Discretionary Earnings) via detailed normalization of owner compensation, one-time expenses, and discretionary spending.
                        </p>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium tracking-tight">Normalization Logic</h3>
                    <ul className="space-y-4 text-sm text-neutral-500">
                        <li className="flex justify-between border-b pb-2"><span>Net Income (reported)</span><span className="font-mono">$XX,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>+ Owner salary & benefits</span><span className="font-mono">$XX,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>+ Non-recurring legal / consulting</span><span className="font-mono">$X,000</span></li>
                        <li className="flex justify-between border-b pb-2"><span>+ Personal expenses</span><span className="font-mono">$X,000</span></li>
                        <li className="flex justify-between font-bold text-black border-t-2 pt-2 border-black"><span>Adjusted SDE</span><span>$XX,000</span></li>
                    </ul>
                </div>
            </div>
        </section>
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
        <section className="space-y-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold mb-4">Executive Summary</p>
            <h1 className="text-4xl md:text-7xl font-medium tracking-tight mb-8">
                Strategic Valuation.
            </h1>
            <div className="grid md:grid-cols-3 gap-1 grid-cols-1 border border-neutral-200 bg-neutral-200">
                <div className="p-12 bg-white text-center">
                     <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 font-bold">Conservative Multiple</p>
                     <p className="text-4xl font-medium">$XX,000</p>
                </div>
                <div className="p-12 bg-white text-center">
                     <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 font-bold">Standard Target</p>
                     <p className="text-4xl font-black">$XX,000</p>
                </div>
                <div className="p-12 bg-white text-center">
                     <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4 font-bold">Market High Premium</p>
                     <p className="text-4xl font-medium">$XX,000</p>
                </div>
            </div>
            <p className="max-w-2xl text-lg text-neutral-500 leading-relaxed italic">
                "Ranges are based on SDE multiples benchmarked against comparable restaurant sales in the DC metro area, including location premiums for the Glover Park corridor."
            </p>
        </section>
    );
}

/* ─── Icon map ──────────────────────────────────── */
const sectionIconMap: Record<string, typeof BarChart3> = {
    revenue: BarChart3,
    earnings: DollarSign,
    comparables: TrendingUp,
    range: Scale,
};

/* ─── Main component ──────────────────────────────────── */
export default function ValuationModelPage() {
    const [searchParams] = useSearchParams();
    const [activeSection, setActiveSection] = useState('revenue');
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);

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
        { label: 'Proposal', to: '/portal/uyghur-eats' },
        { label: 'Opportunity', to: '/client/uyghur-eats/opportunity' },
        { label: 'Valuation', to: '/client/uyghur-eats/valuation' },
        { label: 'Accept', type: 'cta', onClick: openOfferModal },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections: SectionDef[] = [
        { id: 'revenue', label: '1 - Existing Restaurant', content: <RevenueContent /> },
        { id: 'earnings', label: '2 - Add Management Services', content: <EarningsContent /> },
        { id: 'comparables', label: '3 - Add Marketing Services', content: <ComparablesContent /> },
        { id: 'range', label: '4 - Add Merchandising', content: <ValuationRangeContent /> },
    ];

    const sectionNavItems = sections.map((s) => ({ id: s.id, label: s.label }));
    const sectionIds = sectionNavItems.map((s) => s.id);
    useScrollSectionNav(sectionIds, activeSection, setActiveSection);
    const currentSection = sections.find((s) => s.id === activeSection) ?? sections[0];
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    const nextSection = sections[currentIndex + 1];
    const Icon = sectionIconMap[currentSection.id];

    return (
        <article className={projectPageShellClassName}>
            <ClientNavbar 
                clientName="Uyghur Eats" 
                clientLink="/client/uyghur-eats"
                navItems={navItems} 
            />
            <Seo
                title="Uyghur Eats | Valuation Model"
                description="Estimated valuation model for Uyghur Eats. Revenue analysis, normalized earnings, comparable sales benchmarking, and estimated sale price range."
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className={projectPageHeaderClassName}>
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/portal/uyghur-eats" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full">
                                <ArrowLeft className="w-4 h-4" />
                                Return to Proposal
                            </Link>
                            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                                Preview Mode
                            </span>
                        </div>
                    </div>

                    <div className={projectPageEyebrowClassName}>
                        <span className="font-semibold text-neutral-900">Uyghur Eats</span>
                        <span className="text-neutral-300">•</span>
                        <span>Valuation Model</span>
                    </div>

                    <div className={projectHeroGridClassNames.profile}>
                        <div>
                            <h1 className="mb-6 text-4xl font-medium tracking-tighter md:tracking-tight md:text-6xl">
                                Valuation Modeling & Estimated Sale Range
                            </h1>
                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                Revenue review, earnings normalization, comparable sale benchmarks, and an estimated price range to help position the business for sale.
                            </p>

                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                    <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                                </div>
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Deliverable</span>
                                    <span className="mt-2 block font-medium text-black">Valuation Model</span>
                                </div>
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Status</span>
                                    <span className="mt-2 block font-medium text-black">Sample Format</span>
                                </div>
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 text-white p-6 md:p-7">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">
                                Deliverable Preview
                            </p>
                            <h2 className="mb-6 text-2xl font-medium tracking-tight md:text-3xl">
                                How this model adds value to your exit.
                            </h2>
                            <div className="space-y-4 text-sm text-neutral-300">
                                <ul className="list-disc pl-4 space-y-2">
                                    <li>Establishes an objective, defensible baseline for your asking price.</li>
                                    <li>Highlights scenarios for immediate cash flow improvements to buyers.</li>
                                    <li>Demonstrates untapped earning power through precise financial modeling.</li>
                                    <li>Equips you with quantitative data during buyer negotiations.</li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </header>

                {/* ─── Tab Navigation ──────────────────────────────── */}
                <ProfileSectionNav
                    items={sectionNavItems}
                    activeId={activeSection}
                    onSelect={setActiveSection}
                />

                <main className="mt-8 md:mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 lg:gap-12 items-start">
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
                                    {nextSection ? (
                                        <button type="button" onClick={() => setActiveSection(nextSection.id)} className="inline-flex items-center gap-2 text-sm font-medium text-black">
                                            {nextSection.label}
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <Link to={searchParams.get('return') || '/client/uyghur-eats'} className="inline-flex items-center gap-2 text-sm font-medium text-black">
                                            Back to Portal
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
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
                                        {s.label}
                                    </button>
                                ))}
                            </nav>
                        </aside>
                    </div>
                </main>
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
        </article>
    );
}
