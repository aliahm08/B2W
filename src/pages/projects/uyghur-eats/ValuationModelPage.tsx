import { useEffect, useRef, useState, type ReactNode, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, DollarSign, BarChart3, TrendingUp, Scale } from 'lucide-react';
import Seo from '../../../components/Seo';
import ProfileSectionNav from '../../../components/ProfileSectionNav';
import ClientNavbar, { type ClientNavAction } from '../../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../../components/uyghur-eats/UyghurEatsOfferModal';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageHeroTitleClassName,
    projectPageSectionTitleClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../../components/projectPageLayout';

/* ─── Section content ──────────────────────────────────── */
type SectionDef = { id: string; label: string; content: ReactNode };

const revenueStats = [
    {
        label: 'Avg Monthly REV',
        value: '$30k-$50k',
        note: 'Observed Monthly Range',
        detailTitle: 'Monthly Revenue Range',
        detailBody:
            'This range frames the business as a stable neighborhood operation rather than a distressed asset or a breakout growth story. It gives buyers a realistic topline band for underwriting the base case.',
    },
    {
        label: 'Y-O-Y REV',
        value: '-5% to 5%',
        note: 'Trailing 12 Months',
        detailTitle: 'Revenue Trend',
        detailBody:
            'The business appears relatively flat year over year, which supports a steady-state assumption. That makes future upside more attributable to new management or marketing interventions rather than existing momentum.',
    },
    {
        label: 'Gross Margin',
        value: '40%',
        note: 'COGS: $300k',
        detailTitle: 'Margin Profile',
        detailBody:
            'A 40% gross margin with roughly $300k in cost of goods suggests the concept has an understandable cost base, but still leaves room for procurement, pricing, and menu-engineering improvements.',
    },
    {
        label: 'Growth Rate',
        value: '0% to 2%',
        note: 'Baseline Estimate',
        detailTitle: 'Organic Growth Assumption',
        detailBody:
            'Before adding management, marketing, or merchandising programs, the business should be modeled as essentially flat to slightly growing. This is the clean base case against which the scenario packages can show incremental value.',
    },
] as const;

function RevenueContent() {
    const [activeMetricLabel, setActiveMetricLabel] = useState(revenueStats[0].label);
    const mobileTooltipRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const activeMetric = revenueStats.find((stat) => stat.label === activeMetricLabel) ?? revenueStats[0];

    const handleMetricSelect = (label: string) => {
        setActiveMetricLabel(label);

        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            window.requestAnimationFrame(() => {
                mobileTooltipRefs.current[label]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    };

    return (
        <section className="space-y-12">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {revenueStats.map((stat) => {
                            const isActive = stat.label === activeMetric.label;

                            return (
                                <div key={stat.label} className="space-y-0">
                                    <button
                                        type="button"
                                        onMouseEnter={() => setActiveMetricLabel(stat.label)}
                                        onFocus={() => setActiveMetricLabel(stat.label)}
                                        onClick={() => handleMetricSelect(stat.label)}
                                        className={`min-h-[132px] w-full p-6 border bg-white shadow-sm text-left transition-colors ${
                                            isActive
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-neutral-100 hover:border-emerald-300'
                                        }`}
                                    >
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-bold">{stat.label}</p>
                                        <p className="text-2xl font-medium">{stat.value}</p>
                                        <p className="text-[9px] text-neutral-400 mt-2 font-mono">{stat.note}</p>
                                    </button>

                                    {isActive ? (
                                        <div
                                            ref={(element) => {
                                                mobileTooltipRefs.current[stat.label] = element;
                                            }}
                                            className="border-x border-b border-emerald-500 bg-emerald-50 p-5 lg:hidden"
                                        >
                                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-700">Metric Insight</p>
                                            <h3 className="mt-3 text-lg font-medium text-emerald-950">{stat.detailTitle}</h3>
                                            <p className="mt-3 text-sm leading-6 text-emerald-900/80">{stat.detailBody}</p>
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
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
                </div>

                <aside className="hidden border border-emerald-500 bg-emerald-50 p-6 lg:sticky lg:top-32 lg:block self-stretch min-h-full">
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-700">Metric Insight</p>
                    <h3 className="mt-4 text-xl font-medium text-emerald-950">{activeMetric.detailTitle}</h3>
                    <p className="mt-4 text-sm leading-6 text-emerald-900/80">{activeMetric.detailBody}</p>
                </aside>
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

    const sections: SectionDef[] = [
        { id: 'revenue', label: 'Revenue & Composition', content: <RevenueContent /> },
        { id: 'earnings', label: 'Model Methodology', content: <EarningsContent /> },
        { id: 'comparables', label: 'Comparables', content: <ComparablesContent /> },
        { id: 'range', label: 'Executive Summary', content: <ValuationRangeContent /> },
    ];

    const sectionNavItems = sections.map((s) => ({ id: s.id, label: s.label }));
    const currentSection = sections.find((s) => s.id === activeSection) ?? sections[0];
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    const nextSection = sections[currentIndex + 1];
    const Icon = sectionIconMap[currentSection.id];
    const sheetLabel = `Sheet ${currentIndex + 1} / ${currentSection.label}`;
    const sectionHeader = currentSection.id === 'revenue' ? 'Financial Profile' : currentSection.label;

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
                            <Link to="/client/uyghur-eats" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full">
                                <ArrowLeft className="w-4 h-4" />
                                Return to Proposal
                            </Link>
                        </div>
                    </div>

                    <div className={projectPageEyebrowClassName}>
                        <span className="font-semibold text-neutral-900">Uyghur Eats</span>
                        <span className="text-neutral-300">•</span>
                        <span>Valuation Model</span>
                    </div>

                    <div className={projectHeroGridClassNames.profile}>
                        <div>
                            <h1 className={projectPageHeroTitleClassName}>
                                Valuation Modeling & Estimated Sale Range
                            </h1>
                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                Revenue review, earnings normalization, comparable sale benchmarks, and an estimated price range to help position the business for sale.
                            </p>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                    <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                                </div>
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Deliverable</span>
                                    <span className="mt-2 block font-medium text-black">Valuation Model</span>
                                </div>
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700 col-span-2 md:col-span-1">
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
                    <div>
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
                                    <div>
                                        <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                                            {sheetLabel}
                                        </p>
                                        <h2 className={projectPageSectionTitleClassName}>{sectionHeader}</h2>
                                    </div>
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
