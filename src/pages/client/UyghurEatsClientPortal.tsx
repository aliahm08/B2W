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
        id: 'advertise',
        title: 'Advertise Your Business',
        description: 'A public-facing business profile that packages the concept, location, and buyer story into a clear acquisition narrative.',
        to: '/client/uyghur-eats/opportunity',
    },
    {
        id: 'value',
        title: 'Get the Best Value',
        description: 'A valuation model that reframes reported performance into normalized earnings and a sharper market pricing range.',
        to: '/client/uyghur-eats/valuation',
    },
    {
        id: 'transfer',
        title: 'Timely Transfer of Ownership',
        description: 'An operations package that organizes workflows and key handoff material so ownership can transition with less friction.',
        to: '/client/uyghur-eats/terms',
    },
] as const;

/* ─── Main component ──────────────────────────────────── */
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
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-stretch">
                        <div className="grid gap-4 content-start md:grid-cols-2">
                            <div className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700 md:col-span-2">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Engagement Focus</p>
                                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-700">
                                    Build a buyer-ready package that markets the opportunity clearly, supports a stronger valuation position, and makes operational handoff more efficient.
                                </p>
                            </div>
                            <div className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700">
                                <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                            </div>
                            <div className="border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-700">
                                <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Project Type</span>
                                <span className="mt-2 block font-medium text-black">Strategic Exit</span>
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

                        <aside className="flex h-full flex-col border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
                            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                                Proposal details
                            </p>
                            <h1 className="mb-6 text-3xl font-medium tracking-tight md:text-5xl">
                                Business Sale Preparation & Opportunity Packaging
                            </h1>
                            <p className="mb-6 max-w-md text-sm leading-6 text-neutral-300">
                                Three deliverables designed to market the business, improve pricing support, and make transfer easier for the next owner.
                            </p>

                            <div className="mb-6 space-y-3 border-y border-white/10 py-5">
                                {[
                                    'Advertise your business',
                                    'Get the best value',
                                    'Timely transfer of ownership',
                                ].map((item, index) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-300">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-sm text-neutral-200">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Investment</p>
                                    <p className="font-medium">$4K - $7.5K</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Timeline</p>
                                    <p className="font-medium">3 Weeks</p>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
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

                <section className="mb-12">
                    <div className="mb-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                        <span>Delivery Package</span>
                        <span className="text-neutral-300">/</span>
                        <span>Scope</span>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {deliveryPackageItems.map((item, index) => (
                            <Link
                                key={item.id}
                                to={item.to}
                                className="group border border-neutral-200 bg-white p-6 transition-colors hover:border-black"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-black" />
                                </div>
                                <h2 className="mb-3 text-2xl font-medium tracking-tight text-black">{item.title}</h2>
                                <p className="text-sm leading-6 text-neutral-600">{item.description}</p>
                            </Link>
                        ))}
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
