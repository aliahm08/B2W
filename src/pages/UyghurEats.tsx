import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ChefHat, Users, Target, LineChart, TrendingUp, X, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
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
                            <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
                                Uyghur Eats
                            </h1>

                            <p className="text-xl text-neutral-600 max-w-3xl leading-relaxed mb-8">
                                A definitive location and business profile of an authentic Central Asian dining institution.
                                This study details the operational strengths, hyper-local community loyalty, and unique
                                artisanal food production (specifically hand-pulled noodles) that make this business an ideal
                                anchor tenant for high-value real estate acquisition.
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
                            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                                Acquire the business and its neighborhood loyalty.
                            </h2>
                            <p className="text-sm leading-6 text-neutral-300 mb-6">
                                Qualified individual buyers can submit an acquisition offer for owner review, including
                                proposed structure, close timeline, and operating intent.
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

                <main data-project-body className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Content Section */}
                    <div className="lg:col-span-5 space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 rounded-sm">
                                    <MapPin className="w-5 h-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Location & Footprint</h2>
                            </div>
                            <div data-project-detail-body>
                                <p className="text-neutral-600 leading-relaxed mb-4">
                                    Situated at <strong className="text-black font-semibold">2412 Wisconsin Ave NW, Washington, DC</strong>,
                                    the restaurant occupies a premium neighborhood position in a high-income, high-traffic commercial corridor.
                                    Operating previously under a different namesake, the recent 2024 rebranding to <em>Uyghur Eats</em> points to
                                    a modern, focused operational overhaul by founders Thi and Lan.
                                </p>
                                <p className="text-neutral-600 leading-relaxed">
                                    The interior features high ceilings, contemporary industrial-chic seating mixed with warm wooden elements,
                                    and distinctly cultural murals, creating a tranquil environment that maximizes seating density without
                                    sacrificing comfort.
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 rounded-sm">
                                    <ChefHat className="w-5 h-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Culinary Draw</h2>
                            </div>
                            <div data-project-detail-body>
                                <p className="text-neutral-600 leading-relaxed mb-4">
                                    The principal value driver is their artisanal specialty: <strong className="text-black font-semibold">Daily Fresh Made Hand-Pulled Noodles (Laghman)</strong>.
                                    By focusing on authentic, labor-intensive Uyghur and Central Asian preparations, they command a niche market
                                    that ensures consistent, recurring revenue.
                                </p>
                                <ul className="list-disc pl-5 text-neutral-600 space-y-2">
                                    <li><strong>Signature:</strong> Royal Laghman & Fried Laghman</li>
                                    <li><strong>Savory:</strong> Handmade Manta (dumplings) & Samsa (pastries)</li>
                                    <li><strong>Proteins:</strong> Premium Halal meats including Fried Lamb Shank</li>
                                    <li><strong>Communal:</strong> High-margin shareables like "Big Plate Chicken"</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 rounded-sm">
                                    <Users className="w-5 h-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Community Integration</h2>
                            </div>
                            <div data-project-detail-body>
                                <p className="text-neutral-600 leading-relaxed">
                                    Beyond the food, Uyghur Eats acts as a cultural anchor. The family-run service model yields extremely
                                    high customer retention and organic word-of-mouth marketing across Yelp and Google. The "addictive" spice profiles
                                    and localized appeal draw distinct crowds from surrounding universities, embassies, and residential blocks.
                                </p>
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-3">
                                <LineChart className="w-5 h-5 text-black" />
                                <h3 className="text-xl font-medium">Market Analysis</h3>
                            </div>
                            <div data-project-detail-body className="p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Property Profile</h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed mb-1">
                                        <strong className="text-black font-medium">Size:</strong> 2,880 sqft retail space on a 0.05-acre lot. High-ceiling dining room.
                                    </p>
                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                        <strong className="text-black font-medium">History:</strong> The location has hosted a continuous lineage of successful Central Asian restaurants since its 2001 sale ($391,100), proving sustained local demand for this specific footprint.
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
                                        Surrounded by Italian (Divino), Middle Eastern (Bonjon Rumi), and Fast Casual (Chipotle), Uyghur Eats maintains a monopoly on authentic hand-pulled noodles in this corridor. Highly defensible asset.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-black text-white p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="w-5 h-5 text-white" />
                                <h3 className="text-lg font-medium">Acquisition Thesis</h3>
                            </div>
                            <div data-project-detail-body>
                                <p className="text-sm text-neutral-300 leading-relaxed">
                                    Uyghur Eats represents an optimal tenant or acquisition target due to its un-replicable artisanal product,
                                    loyal community integration, and prime DC real estate positioning. The business shows resilience to fast-casual
                                    market fluctuations by offering a distinct, high-quality dine-in experience.
                                </p>
                            </div>
                        </section>

                        <section className="border border-neutral-200 mt-12">
                            <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-black" />
                                <h3 className="text-xl font-medium">Potential Use Cases & Growth</h3>
                            </div>
                            <div data-project-detail-body className="p-6 space-y-6 bg-white">
                                <div>
                                    <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Cafe & Restaurant Buyers</h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                                        Immediate turnkey acquisition for operators looking to capitalize on the established handmade noodle market. Growth predictions indicate a potential 15-20% YOY revenue increase by expanding delivery radiuses and extending operational hours.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Continued Operations & Management</h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                                        For absentee owners or holding companies, B2W can provide comprehensive, automated management solutions. Integrating AI-driven supply chain tracking and shift scheduling can aggressively maximize net operating margins without altering the beloved local brand.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-2">Mixed-Use Space Redevelopment</h4>
                                    <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                                        The 0.05-acre premium Wisconsin Ave footprint offers compelling long-term redevelopment potential. Maintaining the current high-yield restaurant lease while scoping upper-level residential additions provides a highly secure, cash-flowing land banking strategy.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Image Gallery Section */}
                    <aside className="lg:col-span-7">
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
                    </aside>
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
