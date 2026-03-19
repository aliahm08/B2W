import { useEffect, useState, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import ClientNavbar, { type ClientNavAction } from '../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../components/uyghur-eats/UyghurEatsOfferModal';
import {
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../components/projectPageLayout';

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

const deliveryPackageItems = [
    {
        id: 'business-profile',
        title: 'Business Profile',
        description: 'A buyer-facing profile that turns the concept, location, and business story into a clear marketable opportunity.',
        includes: [
            'Business narrative and positioning',
            'Location, market, and concept overview',
            'Visual profile for buyer outreach',
        ],
        value: 'Increases lead generation with a stronger marketing profile and creates new use cases to engage broader outreach.',
        ctaLabel: 'Preview How It Will Look',
        ctaClassName: 'text-emerald-600 group-hover:text-emerald-500',
        to: '/client/uyghur-eats/profile',
    },
    {
        id: 'valuation-model',
        title: 'Valuation Model',
        description: 'A pricing framework that reframes reported performance into normalized earnings and a more credible sale range.',
        includes: [
            'Normalized earnings analysis',
            'Comparable sale logic and range framing',
            'Pricing support for buyer conversations',
        ],
        value: 'Profiles existing financials and creates custom scenarios so buyers can see how specific services can increase revenue from the business.',
        ctaLabel: 'Explore Our Model',
        ctaClassName: 'text-emerald-600 group-hover:text-emerald-500',
        to: '/client/uyghur-eats/valuation',
    },
    {
        id: 'diligence-package',
        title: 'Diligence Package',
        description: 'A structured package that organizes key operating and transfer materials so the business is easier to review and hand off.',
        includes: [
            'Core operating workflows and handoff notes',
            'Transfer-ready business information',
            'Buyer diligence support materials',
        ],
        value: 'Keeps the transfer package compliance-ready so the business can be handed over as a more turnkey solution.',
        ctaLabel: 'See Progress Tracker',
        ctaClassName: 'text-sky-600 group-hover:text-sky-500',
        to: '/client/uyghur-eats/data-room',
    },
] as const;

const copyReveal = {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.45, ease: 'easeOut' as const },
};

const proposalObjectives = [
    {
        id: 'advertise',
        label: 'Advertise your business',
        to: '/client/uyghur-eats/profile',
    },
    {
        id: 'value',
        label: 'Get the best value',
        to: '/client/uyghur-eats/valuation',
    },
    {
        id: 'transfer',
        label: 'Timely transfer of ownership',
        to: '/client/uyghur-eats/data-room',
    },
] as const;

/* ─── Main component ──────────────────────────────────── */
export default function UyghurEatsClientPortal() {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
    const [showPricingWhy, setShowPricingWhy] = useState(false);
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

    const navItems: ClientNavAction[] = [
        { label: 'Proposal', to: '/client/uyghur-eats' },
        { label: 'Profile', to: '/client/uyghur-eats/profile' },
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
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch lg:gap-6">
                        <div className="grid content-start gap-3 md:grid-cols-2 md:gap-4">
                            <div className="md:col-span-2">
                                <motion.p
                                    {...copyReveal}
                                    className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500"
                                >
                                    Client Proposal
                                </motion.p>
                                <motion.h1
                                    {...copyReveal}
                                    transition={{ ...copyReveal.transition, delay: 0.04 }}
                                    className="max-w-[12ch] text-[2.2rem] font-medium leading-[0.98] tracking-tight text-black sm:text-5xl md:max-w-none md:text-6xl"
                                >
                                    Business Sale Preparation & Opportunity Packaging
                                </motion.h1>
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:col-span-2 md:contents">
                            <motion.div
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.06 }}
                                className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700"
                            >
                                <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                            </motion.div>
                            <motion.div
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.1 }}
                                className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700"
                            >
                                <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Project</span>
                                <span className="mt-2 block font-medium text-black">Strategic Exit</span>
                            </motion.div>
                            </div>
                        </div>

                        <aside className="flex h-full flex-col border border-neutral-900 bg-neutral-950 p-5 text-white sm:p-6 md:p-7">
                            <motion.p
                                {...copyReveal}
                                className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400"
                            >
                                Proposal details
                            </motion.p>
                            <motion.h2
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.05 }}
                                className="mb-5 max-w-md text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl md:mb-6 md:text-3xl"
                            >
                                Build a buyer-ready package that markets, supports, and makes operational handoff more efficient.
                            </motion.h2>

                            <motion.div
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.1 }}
                                className="mb-5 space-y-3 border-y border-white/10 py-4 md:mb-6 md:py-5"
                            >
                                {proposalObjectives.map((item, index) => (
                                    <Link
                                        key={item.id}
                                        to={item.to}
                                        className="group flex items-start gap-3 border border-transparent px-1 py-1 transition-colors hover:border-white/10 hover:bg-white/5"
                                    >
                                        <span className="flex items-start gap-3">
                                            <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-300">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="inline-flex items-center gap-2 text-sm text-neutral-200 transition-colors group-hover:text-white">
                                                <span>{item.label}</span>
                                                <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                                            </span>
                                        </span>
                                    </Link>
                                ))}
                            </motion.div>

                            <motion.div
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.14 }}
                                className="mb-5 grid grid-cols-2 gap-3 text-sm md:mb-6"
                            >
                                <div className="relative border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Investment</p>
                                    <button
                                        type="button"
                                        onClick={() => setShowPricingWhy((current) => !current)}
                                        className="text-left font-medium text-white transition-colors hover:text-orange-300"
                                        aria-expanded={showPricingWhy}
                                        aria-controls="pricing-why-hero"
                                    >
                                        <span className="font-semibold">$4K - $7.5K</span>
                                    </button>
                                    {showPricingWhy ? (
                                        <div
                                            id="pricing-why-hero"
                                            className="absolute left-3 right-3 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-white/15 bg-neutral-950 p-4 shadow-2xl"
                                        >
                                            <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                                                Why We Charge This
                                            </p>
                                            <p className="text-sm leading-6 text-neutral-300">
                                                The fee reflects strategy, financial profiling, deliverable design, and buyer-ready packaging across the profile, valuation, and diligence workstreams.
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Timeline</p>
                                    <p className="font-medium">3 Weeks</p>
                                </div>
                            </motion.div>

                            <motion.div
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.18 }}
                                className="mt-auto flex flex-col gap-2.5 sm:gap-3"
                            >
                                <button
                                    type="button"
                                    onClick={openOfferModal}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 group"
                                >
                                    Accept Proposal
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        </aside>
                    </div>
                </header>

                <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
                    <motion.div
                        {...copyReveal}
                        className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500"
                    >
                        <span>Strategic Objectives</span>
                        <span className="text-neutral-300">/</span>
                        <span>Outcome Design</span>
                    </motion.div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {proposalValueAdds.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: [0, -4, 0] }}
                                    viewport={{ once: false, amount: 0.45 }}
                                    transition={{
                                        opacity: { duration: 0.45, ease: 'easeOut' },
                                        y: { duration: 3.6, ease: 'easeInOut', repeat: Infinity },
                                    }}
                                    className={`overflow-hidden border bg-white p-5 sm:p-6 ${item.cardClassName}`}
                                >
                                    <motion.div
                                        whileInView={{ scale: [1, 1.015, 1] }}
                                        viewport={{ once: false, amount: 0.45 }}
                                        transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
                                        className={`mb-4 inline-flex rounded-full border p-3 ${item.iconClassName}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.35 }}
                                        transition={{ duration: 0.4, delay: 0.12 }}
                                        className="space-y-3"
                                    >
                                        <h2 className="text-lg font-medium tracking-tight text-black sm:text-xl">{item.title}</h2>
                                        <p className="text-sm leading-6 text-neutral-700">{item.description}</p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                <section className="mb-12">
                    <motion.div
                        {...copyReveal}
                        className="mb-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 md:mb-6"
                    >
                        <span>Delivery Package</span>
                        <span className="text-neutral-300">/</span>
                        <span>Scope</span>
                    </motion.div>
                    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
                        {deliveryPackageItems.map((item, index) => (
                            <Link
                                key={item.id}
                                to={item.to}
                                className="group flex min-h-[38rem] h-full min-w-[88%] snap-center snap-always flex-col border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-neutral-900 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:min-h-[40rem] sm:min-w-[72%] sm:p-7 lg:min-w-0"
                            >
                                <div className="mb-4 flex items-center justify-between sm:mb-5">
                                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-300 lg:hidden">
                                        <span>Next</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                                <h2 className="mb-3 min-h-[3.5rem] text-[1.6rem] font-medium tracking-tight text-black sm:min-h-[4rem] sm:text-2xl">{item.title}</h2>
                                <p className="mb-4 min-h-[4.5rem] text-sm leading-6 text-neutral-600 sm:mb-5 sm:min-h-[5rem]">{item.description}</p>
                                <div className="flex flex-1 flex-col overflow-hidden">
                                    <div className="mb-4 flex-1 border-t border-neutral-100 pt-4 sm:mb-5 sm:pt-5">
                                        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Includes</p>
                                        <ul className="space-y-2 text-sm leading-6 text-neutral-700">
                                            {item.includes.map((bullet) => (
                                                <li key={bullet} className="flex items-start gap-2">
                                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black" />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-auto border border-neutral-900 bg-neutral-950 p-4 text-white sm:p-5">
                                        <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Client Value</p>
                                        <p className="text-sm leading-6 text-neutral-200">{item.value}</p>
                                        <div className={`mt-4 inline-flex items-center gap-2 text-sm transition-colors ${item.ctaClassName}`}>
                                            {item.ctaLabel}
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-12 border-t border-neutral-100 pt-10 md:pt-12">
                    <motion.div
                        {...copyReveal}
                        className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500"
                    >
                        <span>Terms</span>
                        <span className="text-neutral-300">/</span>
                        <span>Engagement</span>
                    </motion.div>
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                        <motion.div
                            {...copyReveal}
                            className="border border-neutral-200 bg-white p-6"
                        >
                            <motion.h2
                                {...copyReveal}
                                transition={{ ...copyReveal.transition, delay: 0.04 }}
                                className="mb-4 text-2xl font-medium tracking-tight text-black md:text-3xl"
                            >
                                Key Terms of the Proposal
                            </motion.h2>
                            <div className="divide-y divide-neutral-100 border-y border-neutral-100">
                                {[
                                    {
                                        label: 'Investment',
                                        detail: 'depending on final scope and deliverable depth.',
                                    },
                                    {
                                        label: 'Timeline',
                                        detail: 'Target delivery window of approximately 3 weeks from kickoff and receipt of source materials.',
                                    },
                                    {
                                        label: 'Scope',
                                        detail: 'Business Profile, Valuation Model, and Diligence Package prepared for sale-readiness and buyer communication.',
                                    },
                                    {
                                        label: 'Approval Flow',
                                        detail: 'Major deliverables are reviewed with the client before finalization and buyer-facing release.',
                                    },
                                ].map((item) => (
                                    <div key={item.label} className="py-4">
                                        <p className="mb-1 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                                            {item.label}
                                        </p>
                                        {item.label === 'Investment' ? (
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPricingWhy((current) => !current)}
                                                    className="text-left text-sm leading-6 text-neutral-700 transition-colors hover:text-orange-600"
                                                    aria-expanded={showPricingWhy}
                                                    aria-controls="pricing-why-terms"
                                                >
                                                    <span className="font-semibold text-black">$4K - $7.5K</span> {item.detail}
                                                </button>
                                                {showPricingWhy ? (
                                                    <div
                                                        id="pricing-why-terms"
                                                        className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                                                    >
                                                        <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                                                            Why We Charge This
                                                        </p>
                                                        <p className="text-sm leading-6 text-neutral-700">
                                                            This pricing covers strategic framing, financial scenario work, and a sale-ready documentation package rather than a single design deliverable.
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <p className="text-sm leading-6 text-neutral-700">{item.detail}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            {...copyReveal}
                            transition={{ ...copyReveal.transition, delay: 0.08 }}
                            className="border border-neutral-900 bg-neutral-950 p-6 text-white"
                        >
                            <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                                Working Terms
                            </p>
                            <div className="space-y-4 text-sm leading-6 text-neutral-300">
                                <p>
                                    All materials are developed in coordination with the client and refined as new business and financial information becomes available.
                                </p>
                                <p>
                                    Buyer-facing materials should be treated as controlled documents and shared in line with the client’s approval and diligence process.
                                </p>
                            </div>
                            <Link
                                to="/client/uyghur-eats/terms"
                                className="mt-6 inline-flex items-center gap-2 text-sm text-orange-600 transition-colors hover:text-orange-700"
                            >
                                View Key Terms
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

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
