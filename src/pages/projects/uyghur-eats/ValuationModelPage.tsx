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
            <div className="bg-black text-white p-6 md:p-8 -mx-4 md:mx-0">
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
                <p className="text-xs text-neutral-400 leading-relaxed">
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
        { label: 'Opportunity', to: '/client/uyghur-eats/opportunity' },
        { label: 'Valuation', to: '/client/uyghur-eats/valuation' },
        { label: 'Accept', type: 'cta', onClick: openOfferModal },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections: SectionDef[] = [
        { id: 'revenue', label: 'Revenue & Profitability', content: <RevenueContent /> },
        { id: 'earnings', label: 'Normalized Earnings (SDE)', content: <EarningsContent /> },
        { id: 'comparables', label: 'Comparable Sales', content: <ComparablesContent /> },
        { id: 'range', label: 'Estimated Valuation Range', content: <ValuationRangeContent /> },
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
                    {/* Back link hidden per user request */}
                    {/* <Link
                        to={searchParams.get('return') || '/client/uyghur-eats'}
                        className={projectPageBackLinkClassName}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {searchParams.get('return') ? 'Back to Client Portal' : 'Back to Client Portal'}
                    </Link> */}

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
                                What will be included in the valuation model.
                            </h2>
                            <div className="space-y-3 text-sm text-neutral-300">
                                {sections.map((s, i) => (
                                    <div key={s.id} className="flex items-start gap-3">
                                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 mt-0.5">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span>{s.label}</span>
                                    </div>
                                ))}
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
