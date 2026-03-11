import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ChefHat, Users, Target, LineChart, TrendingUp } from 'lucide-react';

export default function UyghurEats() {
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
        <article className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className="mb-12 border-b border-neutral-100 pb-8 mt-12">
                    <Link
                        to="/#industries"
                        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-6">
                        <span className="font-semibold text-neutral-900">Food & Beverage</span>
                        <span className="text-neutral-300">•</span>
                        <span>Real Estate Acquisition</span>
                    </div>

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
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Content Section */}
                    <div className="lg:col-span-5 space-y-12">
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 rounded-sm">
                                    <MapPin className="w-5 h-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Location & Footprint</h2>
                            </div>
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
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 rounded-sm">
                                    <ChefHat className="w-5 h-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Culinary Draw</h2>
                            </div>
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
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-neutral-100 rounded-sm">
                                    <Users className="w-5 h-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Community Integration</h2>
                            </div>
                            <p className="text-neutral-600 leading-relaxed">
                                Beyond the food, Uyghur Eats acts as a cultural anchor. The family-run service model yields extremely
                                high customer retention and organic word-of-mouth marketing across Yelp and Google. The "addictive" spice profiles
                                and localized appeal draw distinct crowds from surrounding universities, embassies, and residential blocks.
                            </p>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-3">
                                <LineChart className="w-5 h-5 text-black" />
                                <h3 className="text-xl font-medium">Market Analysis</h3>
                            </div>
                            <div className="p-6 space-y-6">
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
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                Uyghur Eats represents an optimal tenant or acquisition target due to its un-replicable artisanal product,
                                loyal community integration, and prime DC real estate positioning. The business shows resilience to fast-casual
                                market fluctuations by offering a distinct, high-quality dine-in experience.
                            </p>
                        </section>

                        <section className="border border-neutral-200 mt-12">
                            <div className="bg-neutral-50 p-4 border-b border-neutral-200 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-black" />
                                <h3 className="text-xl font-medium">Potential Use Cases & Growth</h3>
                            </div>
                            <div className="p-6 space-y-6 bg-white">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            {images.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`relative rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200 group ${img.span} ${idx === 0 ? 'min-h-[300px] md:min-h-[500px]' : 'min-h-[200px]'}`}
                                    whileHover={{ scale: 0.99 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.alt}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-sm font-medium">{img.alt}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </aside>
                </main>
            </motion.div>
        </article>
    );
}
