import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ChefHat, Users, Target, LineChart, TrendingUp, X, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import MobileSectionNav from '../components/MobileSectionNav';
import ResponsiveAccordionSection from '../components/ResponsiveAccordionSection';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../components/projectPageLayout';

export default function UyghurEats() {
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);

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
    }, []);

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

    const images = [
        {
            url: '/images/uyghur-eats/interior.jpg',
            alt: 'Uyghur Eats Interior with Cultural Murals',
            span: 'col-span-1 md:col-span-2 row-span-2'
        },
        {
            url: '/images/uyghur-eats/laghman.jpg',
            alt: 'Signature Hand-Pulled Laghman Noodles',
            span: 'col-span-1 row-span-1'
        },
        {
            url: '/images/uyghur-eats/chicken.jpg',
            alt: 'Big Plate Chicken Dish',
            span: 'col-span-1 row-span-1'
        },
        {
            url: '/images/uyghur-eats/soup.jpg',
            alt: 'Traditional Pot Soup',
            span: 'col-span-1 row-span-1'
        },
        {
            url: '/images/uyghur-eats/platter.jpg',
            alt: 'Specialty Platter',
            span: 'col-span-1 row-span-1'
        }
    ];

    return (
        <article className={projectPageShellClassName}>
            <Seo
                title="Uyghur Eats Restaurant Profile"
                description="Business profile of Uyghur Eats covering location value, operational footprint, market positioning, and neighborhood loyalty for acquisition evaluation."
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className={projectPageHeaderClassName}>
                    <Link
                        to="/#industries"
                        className={projectPageBackLinkClassName}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>

                    <div className={projectPageEyebrowClassName}>
                        <span className="font-semibold text-neutral-900">Food & Beverage</span>
                        <span className="text-neutral-300">•</span>
                        <span>Real Estate Acquisition</span>
                    </div>

                    <div className={projectHeroGridClassNames.profile}>
                        <div>
                            <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                                Uyghur Eats
                            </h1>

                            <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                                A business profile built around location quality, neighborhood loyalty, and a differentiated handmade noodle offering that can support acquisition or continued operation.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-200">
                                    Real Estate Profile
                                </span>
                                <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-200">
                                    Location Value
                                </span>
                                <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-sm border border-neutral-200">
                                    Market Positioning
                                </span>
                            </div>
                        </div>

                        <aside className="border border-neutral-900 bg-neutral-950 text-white p-6 md:p-7">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">
                                For Sale
                            </p>
                            <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                                Acquire the business and the demand already around it.
                            </h2>
                            <p className="text-sm leading-6 text-neutral-300 mb-6">
                                Qualified buyers can submit an acquisition offer with proposed structure, timeline, and operating plan.
                            </p>
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
                                className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                            >
                                Make an Offer
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <p className="mt-3 text-xs text-neutral-500">
                                Opens a short acquisition intake form for direct outreach.
                            </p>
                            <p className="mt-4 border-t border-white/10 pt-4 text-[11px] leading-5 text-neutral-400">
                                B2W LLC is not acting as a brokerage or agent in this matter. B2W LLC provides consulting services to the client only.
                            </p>
                        </aside>
                    </div>
                </header>

                <main data-project-body className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-12">
                        <MobileSectionNav
                            items={[
                                { id: 'location', label: 'Location' },
                                { id: 'culinary', label: 'Food draw' },
                                { id: 'community', label: 'Community' },
                                { id: 'market', label: 'Market' },
                                { id: 'thesis', label: 'Thesis' },
                                { id: 'growth', label: 'Growth' },
                                { id: 'gallery', label: 'Gallery' },
                            ]}
                        />
                    </div>
                    {/* Content Section */}
                    <div className="lg:col-span-5 space-y-12">
                        <ResponsiveAccordionSection
                            id="location"
                            title="Location & Footprint"
                            icon={MapPin}
                            defaultOpen
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body className="space-y-4">
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Situated at <strong className="text-black font-semibold">2412 Wisconsin Ave NW, Washington, DC</strong>,
                                    the restaurant sits in a high-income, high-traffic corridor. The 2024 rebrand to <em>Uyghur Eats</em> signals a clearer operating identity.
                                </p>
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    The room combines high ceilings, cultural murals, and efficient seating density without reading as cramped.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="culinary"
                            title="Culinary Draw"
                            icon={ChefHat}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body>
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="community"
                            title="Community Integration"
                            icon={Users}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body>
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Uyghur Eats functions as a neighborhood anchor. Family-run service, strong word of mouth, and traffic from nearby universities, embassies, and residences support repeat demand.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="market"
                            title="Market Analysis"
                            icon={LineChart}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="space-y-6 p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-6">
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="thesis"
                            title="Acquisition Thesis"
                            icon={Target}
                            className="border border-neutral-900 bg-black text-white"
                            headerClassName="p-4 md:p-6 md:pb-4"
                            bodyClassName="px-4 pb-4 md:px-6 md:pb-6"
                            tone="dark"
                            titleClassName="text-white md:text-lg"
                        >
                            <div data-project-detail-body>
                                <p className="text-sm text-neutral-300 leading-relaxed">
                                    Uyghur Eats is attractive because the product is difficult to replicate, the location is strong, and demand is already embedded in the neighborhood.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="growth"
                            title="Potential Use Cases & Growth"
                            icon={TrendingUp}
                            className="mt-12 border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="space-y-6 bg-white p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-6">
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
                        </ResponsiveAccordionSection>
                    </div>

                    {/* Image Gallery Section */}
                    <ResponsiveAccordionSection
                        id="gallery"
                        title="Image Gallery"
                        className="border border-neutral-200 lg:col-span-7 md:border-0"
                        headerClassName="p-4 md:mb-4 md:p-0"
                        bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                    >
                        <div
                            data-project-detail-body
                            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 h-full"
                        >
                            {images.map((img, idx) => (
                                <motion.figure
                                    key={idx}
                                    className={`relative shrink-0 snap-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100 group w-[85vw] ${idx === 0 ? 'min-h-[360px]' : 'min-h-[280px]'} md:w-auto ${img.span} ${idx === 0 ? 'md:min-h-[500px]' : 'md:min-h-[200px]'}`}
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
                    </ResponsiveAccordionSection>
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
                        className="relative w-full max-w-2xl border border-neutral-200 bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeOfferModal}
                            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:text-black"
                            aria-label="Close offer form"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="border-b border-neutral-200 px-6 py-5 md:px-8">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                                Acquisition Offer
                            </p>
                            <h2 id="offer-modal-title" className="text-2xl font-medium tracking-tight">
                                Make an offer for Uyghur Eats
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
                                Share your proposed purchase range, buyer profile, and intended close timeline. This form is positioned for individual acquirers.
                            </p>
                            <p className="mt-3 max-w-xl text-xs leading-5 text-neutral-500">
                                B2W LLC is not a brokerage or agent and does not represent either party in a brokerage capacity. B2W LLC provides consulting services to the client.
                            </p>
                        </div>

                        {!isOfferSubmitted ? (
                            <form onSubmit={handleOfferSubmit} className="px-6 py-6 md:px-8 md:py-8">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Full name</span>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="Your name"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Email</span>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="name@example.com"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Phone</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="(555) 555-5555"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Offer range</span>
                                        <input
                                            type="text"
                                            name="offerRange"
                                            required
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="$850,000 - $1,050,000"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Closing timeline</span>
                                        <input
                                            type="text"
                                            name="timeline"
                                            required
                                            className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                            placeholder="30-45 days"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-neutral-800">Buyer type</span>
                                        <select
                                            name="buyerType"
                                            required
                                            defaultValue=""
                                            className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        >
                                            <option value="" disabled>Select buyer profile</option>
                                            <option value="owner-operator">Owner-operator</option>
                                            <option value="family-office">Family office</option>
                                            <option value="strategic-buyer">Strategic buyer</option>
                                            <option value="other">Other individual buyer</option>
                                        </select>
                                    </label>
                                </div>

                                <label className="mt-5 block">
                                    <span className="mb-2 block text-sm font-medium text-neutral-800">Operating plan</span>
                                    <textarea
                                        name="operatingPlan"
                                        required
                                        rows={4}
                                        className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        placeholder="Describe your intent for the business, brand, and team."
                                    />
                                </label>

                                <label className="mt-5 block">
                                    <span className="mb-2 block text-sm font-medium text-neutral-800">Notes for the seller</span>
                                    <textarea
                                        name="notes"
                                        rows={4}
                                        className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                                        placeholder="Outline financing certainty, diligence needs, or transition preferences."
                                    />
                                </label>

                                <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-5 md:flex-row md:items-center md:justify-between">
                                    <p className="text-xs leading-5 text-neutral-500">
                                        Submission is currently captured as an owner inquiry flow. A confirmation view appears immediately after send.
                                    </p>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                    >
                                        Submit Offer
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="px-6 py-8 md:px-8">
                                <div className="border border-neutral-200 bg-neutral-50 p-6">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                                        Offer Received
                                    </p>
                                    <h3 className="text-2xl font-medium tracking-tight mb-3">
                                        Your acquisition inquiry is ready for review.
                                    </h3>
                                    <p className="max-w-xl text-sm leading-6 text-neutral-600">
                                        The buyer intake has been captured and can now be routed into a direct owner follow-up workflow. If you want, the next step can be wiring this form to email, a CRM, or a database-backed submissions endpoint.
                                    </p>
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={closeOfferModal}
                                            className="inline-flex items-center justify-center border border-neutral-300 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsOfferSubmitted(false)}
                                            className="inline-flex items-center justify-center bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                        >
                                            Edit Offer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </article>
    );
}
