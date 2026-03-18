import React, { useState, useEffect, useMemo, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, ChefHat, Users, LineChart, Target, TrendingUp, ArrowLeft, ArrowRight, X } from 'lucide-react';
import ProjectTagPill from '../../../components/ProjectTagPill';
import Seo from '../../../components/Seo';
import ProfileSectionNav from '../../../components/ProfileSectionNav';
import ClientNavbar, { type ClientNavAction } from '../../../components/ClientNavbar';
import UyghurEatsOfferModal from '../../../components/uyghur-eats/UyghurEatsOfferModal';
import { useScrollSectionNav } from '../../../hooks/useScrollSectionNav';
import PreviewAccessChrome from '../../../components/PreviewAccessChrome';
import { fetchProjectAccessStatus, hasGrantedView, submitProjectAccess } from '../../../content/projectAccess';
import { projectShowcaseOverridesByPath } from '../../../content/projectShowcase';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../../../components/projectPageLayout';

/* ─── Section content components ──────────────────────────────────── */
type SectionDef = { id: string; label: string; content: ReactNode };

function LocationContent() {
    return (
        <div className="space-y-4">
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                Situated at <strong className="text-black font-semibold">2412 Wisconsin Ave NW, Washington, DC</strong>,
                the restaurant sits in a high-income, high-traffic corridor. The 2024 rebrand to <em>Uyghur Eats</em> signals a clearer operating identity.
            </p>
            <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                The room combines high ceilings, cultural murals, and efficient seating density without reading as cramped.
            </p>
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
                Uyghur Eats functions as a neighborhood anchor. Family-run service, strong word of mouth, and traffic from nearby universities, embassies, and residences support repeat demand.
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
                    Boasts a "Walker's Paradise" score of 91, funneling significant, consistent foot traffic from nearby residents, embassy staff, and students directly to the Wisconsin Ave strip.
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
        <div className="bg-black text-white p-6 -mx-4 md:-mx-0 md:p-8">
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

function GalleryContent({ images }: { images: { url: string; alt: string; span: string }[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
            {images.map((img, idx) => (
                <motion.figure
                    key={idx}
                    className={`relative overflow-hidden border border-neutral-200 bg-neutral-100 group ${idx === 0 ? 'col-span-2 min-h-[220px] md:min-h-[400px]' : 'col-span-1 min-h-[160px] md:min-h-[200px]'}`}
                    whileHover={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                >
                    <img
                        src={img.url}
                        alt={img.alt}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent md:bg-black/0 md:group-hover:bg-black/10 transition-colors duration-300" />
                    <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-sm font-medium text-white md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
                            {img.alt}
                        </p>
                    </figcaption>
                </motion.figure>
            ))}
        </div>
    );
}

/* ─── Icon map ──────────────────────────────────── */
const sectionIconMap: Record<string, typeof MapPin> = {
    location: MapPin,
    culinary: ChefHat,
    community: Users,
    market: LineChart,
    thesis: Target,
    growth: TrendingUp,
};

/* ─── Main component ──────────────────────────────────── */
export default function UyghurEats() {
    const projectPath = '/uyghur-eats';
    const showcase = projectShowcaseOverridesByPath['/uyghur-eats'];
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
    const [profilePassword, setProfilePassword] = useState('');
    const [previewError, setPreviewError] = useState('');
    const [isUnlockingPreview, setIsUnlockingPreview] = useState(false);
    const [hasPreviewAccess, setHasPreviewAccess] = useState(false);
    const [activeSection, setActiveSection] = useState('location');

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
    const isProposalPreview = searchParams.get('preview') === 'proposal';
    const proposalReturnPath = useMemo(
        () => searchParams.get('return') || '/client/uyghur-eats',
        [searchParams],
    );
    const isBlurredPreview = isProposalPreview && !hasPreviewAccess;

    useEffect(() => {
        if (!isProposalPreview) {
            setHasPreviewAccess(false);
            setPreviewError('');
            setProfilePassword('');
            return;
        }

        let isActive = true;

        void fetchProjectAccessStatus(projectPath).then((status) => {
            if (!isActive) {
                return;
            }

            setHasPreviewAccess(hasGrantedView(status, 'profile'));
        });

        return () => {
            isActive = false;
        };
    }, [isProposalPreview]);

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

    useEffect(() => {
        const handleOfferOpen = () => {
            openOfferModal();
        };

        window.addEventListener('b2w-uyghur-offer:open', handleOfferOpen as EventListener);
        return () => window.removeEventListener('b2w-uyghur-offer:open', handleOfferOpen as EventListener);
    }, [isBlurredPreview]);

    const handlePreviewUnlock = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsUnlockingPreview(true);

        try {
            const result = await submitProjectAccess({
                path: projectPath,
                method: 'profile',
                password: profilePassword,
            });

            if (!hasGrantedView(result, 'profile')) {
                setPreviewError(result.error || 'Incorrect password.');
                return;
            }

            setHasPreviewAccess(true);
            setPreviewError('');
            setProfilePassword('');
            navigate(projectPath, { replace: true });
        } finally {
            setIsUnlockingPreview(false);
        }
    };

    const images = [
        { url: '/images/uyghur-eats/interior.jpg', alt: 'Uyghur Eats Interior with Cultural Murals', span: 'col-span-2' },
        { url: '/images/uyghur-eats/laghman.jpg', alt: 'Signature Hand-Pulled Laghman Noodles', span: 'col-span-1' },
        { url: '/images/uyghur-eats/chicken.jpg', alt: 'Big Plate Chicken Dish', span: 'col-span-1' },
        { url: '/images/uyghur-eats/soup.jpg', alt: 'Traditional Pot Soup', span: 'col-span-1' },
        { url: '/images/uyghur-eats/platter.jpg', alt: 'Specialty Platter', span: 'col-span-1' },
    ];

    const sections: SectionDef[] = [
        { id: 'location', label: 'Location & Footprint', content: <LocationContent /> },
        { id: 'culinary', label: 'Culinary Draw', content: <CulinaryContent /> },
        { id: 'community', label: 'Community Integration', content: <CommunityContent /> },
        { id: 'market', label: 'Market Analysis', content: <MarketContent /> },
        { id: 'thesis', label: 'Acquisition Thesis', content: <ThesisContent /> },
        { id: 'growth', label: 'Use Cases & Growth', content: <GrowthContent /> },
        { id: 'gallery', label: 'Image Gallery', content: <GalleryContent images={images} /> },
    ];

    const sectionNavItems = sections.map((s) => ({ id: s.id, label: s.label }));
    const sectionIds = sectionNavItems.map((s) => s.id);
    useScrollSectionNav(sectionIds, activeSection, setActiveSection);

    const currentSection = sections.find((s) => s.id === activeSection) ?? sections[0];
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    const nextSection = sections[currentIndex + 1];
    const Icon = sectionIconMap[currentSection.id];

    return (
        <article className={projectPageShellClassName} data-project-preview={isBlurredPreview ? 'blurred' : undefined}>
            <ClientNavbar 
                clientName="Uyghur Eats" 
                clientLink="/client/uyghur-eats"
                navItems={navItems} 
            />
            <Seo
                title="Uyghur Eats | Business Opportunity Profile"
                description="Comprehensive business profile for Uyghur Eats. Explore the location footprint, culinary draw, community integration, and acquisition thesis for this Washington, DC restaurant."
            />
            {isBlurredPreview ? (
                <PreviewAccessChrome
                    returnPath={proposalReturnPath}
                    previewLabel="This analysis profile preview"
                    previewMessage="Hero content, scoping context, and section headings remain visible, while analysis details stay blurred until the profile password is entered."
                    unlockLabel="Unlock Full Profile"
                    passwordPlaceholder="Analysis profile password"
                    passwordValue={profilePassword}
                    onPasswordChange={setProfilePassword}
                    onSubmit={handlePreviewUnlock}
                    isSubmitting={isUnlockingPreview}
                    error={previewError}
                />
            ) : null}
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
                        <span className="font-semibold text-neutral-900">Food & Beverage</span>
                        <span className="text-neutral-300">•</span>
                        <span>Real Estate Acquisition</span>
                    </div>

                    <div className={projectHeroGridClassNames.profile}>
                        <div>
                            <h1 className="mb-6 text-4xl font-medium tracking-tighter md:tracking-tight md:text-6xl">
                                Fine Dining in Washington, DC
                            </h1>

                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                A plain-language analysis profile for the potential sale of Uyghur Eats, built around location quality, neighborhood loyalty, and a differentiated handmade noodle offering.
                            </p>

                            <div className="mb-8 grid gap-3 md:grid-cols-2">
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Client</span>
                                    <span className="mt-2 block font-medium text-black">Uyghur Eats</span>
                                </div>
                                <div className="border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">Project Type</span>
                                    <span className="mt-2 block font-medium text-black">Property Sale</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {showcase.tags.map((tag) => (
                                    <ProjectTagPill key={`${tag.label}-${tag.tier}`} tag={tag} />
                                ))}
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 text-white p-6 md:p-7">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">
                                For Sale
                            </p>
                            <h2 className="mb-6 text-2xl font-medium tracking-tight md:text-4xl">
                                Acquire the business and the demand already around it.
                            </h2>
                            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Type</p>
                                    <p className="font-medium">Business Acquisition</p>
                                </div>
                                <div className="border border-white/15 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-2">Buyer</p>
                                    <p className="font-medium">Individual Operators</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={openOfferModal}
                                disabled={isBlurredPreview}
                                data-preview-cta="true"
                                className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                            >
                                Make an Offer
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <p className="mt-4 border-t border-white/10 pt-4 text-[11px] leading-5 text-neutral-400">
                                B2W LLC is not acting as a brokerage or agent in this matter. B2W LLC provides consulting services to the client only.
                            </p>
                        </aside>
                    </div>
                </header>

                {/* ─── Tab Navigation ──────────────────────────────── */}
                {/* Horizontal navigation hidden per user request */}
                {/* <ProfileSectionNav
                    items={sectionNavItems}
                    activeId={activeSection}
                    onSelect={setActiveSection}
                /> */}

                <main className="mt-8 md:mt-12" data-project-body>
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
                                <div data-project-detail-body className="pb-6">
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
                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 mb-4">Sections</p>
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
