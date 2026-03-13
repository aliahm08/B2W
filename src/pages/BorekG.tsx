import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    ExternalLink,
    LineChart,
    MapPin,
    Megaphone,
    ShoppingBag,
    Star,
    Store,
    Users
} from 'lucide-react';
import Seo from '../components/Seo';

const snapshotDate = 'March 13, 2026';

const scorecards = [
    {
        label: 'Google Rating',
        value: '4.8 / 5',
        detail: '412 reviews'
    },
    {
        label: 'Yelp Rating',
        value: '4.8 / 5',
        detail: '98 reviews'
    },
    {
        label: 'Instagram',
        value: '1,502',
        detail: 'followers / 350 posts'
    },
    {
        label: 'Channel Depth',
        value: '5',
        detail: 'dine-in, pickup, catering, market, retail'
    }
];

const sources = [
    {
        label: 'Official site',
        href: 'https://www.borekg.com/'
    },
    {
        label: 'Instagram profile',
        href: 'https://www.instagram.com/borekg2008/'
    },
    {
        label: 'Google review snapshot',
        href: 'https://www.postcard.inc/@borek-g-cafe-market-falls-church-vall3006zw'
    },
    {
        label: 'Yelp listing',
        href: 'https://www.yelp.com/biz/borek-g-cafe-and-market-falls-church'
    },
    {
        label: 'District Fray feature',
        href: 'https://districtfray.com/articles/borek-g-falls-church/'
    },
    {
        label: 'Falls Church Farmers Market',
        href: 'https://www.fallschurchva.gov/698/Farmers-Market'
    }
];

const marketingReadout = [
    {
        title: 'Reputation strength',
        score: '9.6 / 10',
        body: 'A 4.8 average on both Google and Yelp with roughly 510 combined reviews signals unusually strong local satisfaction for an independent neighborhood operator.'
    },
    {
        title: 'Discovery coverage',
        score: '8.8 / 10',
        body: 'Borek-G is discoverable through Google, Yelp, Instagram, its own ecommerce site, press coverage, and the Falls Church Farmers Market. That is strong local search coverage without needing a large paid media footprint.'
    },
    {
        title: 'Social proof velocity',
        score: '7.4 / 10',
        body: 'The Instagram account has a credible archive at 350 posts and 1,502 followers. The brand is present, but follower scale still trails the review volume, which implies under-monetized social attention.'
    },
    {
        title: 'Conversion readiness',
        score: '8.9 / 10',
        body: 'The Square-powered site supports ordering, catering, gift cards, retail grocery, and dine-in discovery. That lowers friction from awareness to purchase better than a menu-only brochure site.'
    }
];

const recommendations = [
    'Turn review volume into paid and owned creative. Borek-G already has enough five-star proof to rotate review-led landing sections, paid social ads, and menu highlights without inventing new messaging.',
    'Increase Instagram capture at point of sale. Review density is much stronger than follower depth, so the business is converting guests better than it is retaining them digitally.',
    'Promote the market-to-cafe story more aggressively. Farmers market roots, halal catering, Turkish grocery inventory, and dine-in service together create a differentiated narrative that most local bakery accounts do not have.',
    'Track content cadence and post-level engagement weekly. Public social traction can be monitored without Meta admin access if the website stores snapshots of followers, posts, likes, and comments from public pages.'
];

const strategyPlaybook = [
    {
        title: 'Turn reviews into conversion creative',
        body: 'Borek-G already has the review density needed for persuasive paid and organic content. The fastest win is to turn top Google and Yelp language into short-form testimonial ads, menu carousels, and landing-page proof blocks.'
    },
    {
        title: 'Build a weekly short-form food cadence',
        body: 'Winning locally will require repeatable Reels around savory pastry prep, halal meal plates, market inventory, and farmers market moments. The content should sell freshness, variety, and authenticity, not generic lifestyle filler.'
    },
    {
        title: 'Capture existing foot traffic into owned audience',
        body: 'The store and market already generate demand. The missing layer is stronger follow capture through in-store prompts, receipt QR flows, giveaway mechanics, and catering follow-up so one transaction becomes repeat digital reach.'
    },
    {
        title: 'Run geo-tight paid social around high-intent offers',
        body: 'Paid spend should stay narrow: Falls Church, Arlington, McLean, and nearby DC-adjacent neighborhoods, focused on catering, family meal bundles, and best-selling pastry or brunch offers rather than broad awareness campaigns.'
    }
];

const growthForecast = [
    {
        label: 'Conservative case',
        value: '+6% to +9%',
        detail: 'sales growth from better content consistency, review-led creative, and stronger local conversion paths'
    },
    {
        label: 'Base case',
        value: '+10% to +15%',
        detail: 'sales growth if Borek-G adds disciplined short-form content, local paid amplification, and catering capture'
    },
    {
        label: 'Upside case',
        value: '+18% to +24%',
        detail: 'sales growth if the business compounds catering, repeat audience growth, and strong creative execution over 2-3 quarters'
    }
];

const valuationNotes = [
    'The public market data suggests the marketing problem is not weak product-market fit. It is under-distributed proof. That makes this a higher-confidence growth project than a repositioning project.',
    'Because Borek-G already has strong reviews, press, and multi-channel ordering, incremental marketing effort should have better payback than for a restaurant starting from zero trust.',
    'Soft valuation: this proposal should be justified if it helps create even one durable additional revenue engine, especially catering and repeat local audience capture, not just vanity follower growth.'
];

// Archived for later reintroduction:
// const clientSuccessSteps = [
//     {
//         title: 'Baseline + market read',
//         detail: 'Establish the operating baseline: current sales mix, best-selling items, catering volume, channel performance, and target neighborhoods.',
//         start: 1,
//         span: 2
//     },
//     {
//         title: 'Data sharing + access',
//         detail: 'Secure data sharing and account access: Instagram, Meta Ads, Square, Google Business, website analytics, and current creative assets.',
//         start: 1,
//         span: 3
//     },
//     {
//         title: 'Content system build',
//         detail: 'Define weekly shoot priorities, short-form creative templates, review-led proof assets, and campaign offers tied to real menu demand.',
//         start: 2,
//         span: 3
//     },
//     {
//         title: 'Local paid testing',
//         detail: 'Launch narrow geo-targeted paid social, offer-specific campaigns, and channel-specific landing or ordering flows.',
//         start: 4,
//         span: 3
//     },
//     {
//         title: 'Weekly optimization',
//         detail: 'Review what content converts, what audience segments respond, and what should be cut, scaled, or rewritten.',
//         start: 4,
//         span: 5
//     },
//     {
//         title: 'Repeat growth cadence',
//         detail: 'Turn early wins into a repeat system with documented reporting, monthly growth reviews, and a sustainable operating cadence.',
//         start: 7,
//         span: 4
//     }
// ];

export default function BorekG() {
    return (
        <article className="min-h-screen max-w-7xl mx-auto px-6 pb-16 pt-24">
            <Seo
                title="Borek-G Project Proposal"
                description="Proposal page for a Borek-G restaurant profile and marketing audit in Falls Church, outlining the public-data workflow, growth thesis, and client-success roadmap for execution."
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className="mt-12 mb-12 border-b border-neutral-100 pb-8">
                    <Link
                        to="/#industries"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Projects
                    </Link>

                    <div className="mb-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
                        <span className="font-semibold text-neutral-900">Food & Beverage</span>
                        <span className="text-neutral-300">•</span>
                        <span>Proposal</span>
                    </div>

                    <section className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-8">
                        <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                            Proposal for Marketing Systems and Growth
                        </p>

                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.9fr)] lg:items-start">
                            <div>
                                <h1 className="mb-6 text-5xl font-medium tracking-tight md:text-6xl">
                                    Borek-G
                                </h1>

                                <p className="mb-6 max-w-3xl text-xl leading-relaxed text-neutral-200">
                                    Bring more people into BorekG consistently by showcasing your food, story, and authenticity
                                    through short videos, photos, and proven engagement strategies.
                                </p>

                                <p className="mb-8 max-w-3xl text-sm leading-7 text-neutral-300">
                                    This proposal is built from public operating, review, press, and social data. The current
                                    signal suggests a strong neighborhood food business with real trust already in place, but with
                                    digital storytelling and repeat audience capture still underdeveloped.
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-xs text-neutral-300">
                                        Marketing Profile
                                    </span>
                                    <span className="rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-xs text-neutral-300">
                                        Social Media Audit
                                    </span>
                                    <span className="rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-xs text-neutral-300">
                                        Instagram Content Analytics
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                                    Build the public-facing profile into a repeatable growth engine.
                                </h2>
                                <p className="text-sm leading-6 text-neutral-300">
                                    Public data already indicates strong local reputation, strong channel diversity, and credible but
                                    under-leveraged Instagram scale. Snapshot date: {snapshotDate}. Full execution would begin with
                                    baseline setup, data sharing, and channel alignment once the project formally starts.
                                </p>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {scorecards.slice(0, 4).map((card) => (
                                        <div key={card.label} className="border border-white/15 bg-white/5 p-3">
                                            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                                                {card.label}
                                            </p>
                                            <p className="font-medium">{card.value}</p>
                                            <p className="mt-1 text-xs text-neutral-400">{card.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </header>

                <main className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    <div className="space-y-12 lg:col-span-7">
                        <section>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-sm bg-neutral-100 p-2">
                                    <MapPin className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Location & Operating Footprint</h2>
                            </div>
                            <p className="mb-4 leading-relaxed text-neutral-600">
                                Borek-G operates from <strong className="font-semibold text-black">315 S Maple Ave, Falls Church, Virginia</strong>.
                                For proposal purposes, the operating thesis is that Borek-G is more than a single-format restaurant.
                                Public materials show a combined cafe, market, catering, online-ordering, and gift-card setup,
                                which materially improves resilience versus a dine-in-only concept.
                            </p>
                            <p className="leading-relaxed text-neutral-600">
                                Press coverage also ties the brand to the Falls Church Farmers Market and to its Turkish prepared-food
                                and grocery identity. That combination gives Borek-G a stronger neighborhood moat than a standard pastry
                                shop or breakfast cafe.
                            </p>
                        </section>

                        <section>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-sm bg-neutral-100 p-2">
                                    <Store className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-medium">Brand Positioning</h2>
                            </div>
                            <p className="mb-4 leading-relaxed text-neutral-600">
                                The proposed brand narrative positions Borek-G as a culturally specific Turkish food business with a
                                broader commercial footprint than typical independent cafes. The brand promise spans savory pastries,
                                halal food, catering, and imported pantry goods rather than relying on one hero menu item alone.
                            </p>
                            <ul className="list-disc space-y-2 pl-5 text-neutral-600">
                                <li>Turkish cafe and market identity anchored in Falls Church.</li>
                                <li>Halal positioning broadens addressable demand beyond casual bakery traffic.</li>
                                <li>Farmers market roots create a strong authenticity story and recurring local discovery.</li>
                                <li>Square ecommerce stack supports direct transactions instead of pushing all demand to third-party marketplaces.</li>
                            </ul>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Megaphone className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Initial Marketing Evaluation</h3>
                            </div>
                            <div className="space-y-6 p-6">
                                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                                    These are proposal-stage signals from public sources, not full campaign analytics. They are
                                    enough to justify the project and define where deeper measurement should start.
                                </p>
                                {marketingReadout.map((item) => (
                                    <div key={item.title}>
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-black">
                                                {item.title}
                                            </h4>
                                            <span className="text-sm font-medium text-black">{item.score}</span>
                                        </div>
                                        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-black p-6 text-white">
                            <div className="mb-4 flex items-center gap-2">
                                <LineChart className="h-5 w-5 text-white" />
                                <h3 className="text-lg font-medium">Project Thesis</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-300">
                                Borek-G looks operationally stronger than its digital brand scale suggests. Review quality, channel diversity,
                                and earned media indicate a business with real local trust. The proposal is to package that proof into a
                                cleaner public profile first, then layer in deeper social tracking once the engagement begins.
                            </p>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Megaphone className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Bottom Line</h3>
                            </div>
                            <div className="space-y-6 p-6">
                                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                                    Soft bottom line: Borek-G should win on social by looking more like the business it already is in real life.
                                    The winning strategy is proof-heavy, local, food-forward, and offer-specific rather than brand-abstract.
                                </p>
                                {strategyPlaybook.map((item) => (
                                    <div key={item.title}>
                                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-black">
                                            {item.title}
                                        </h4>
                                        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    <aside className="space-y-8 lg:col-span-5">
                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Star className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Signal Summary</h3>
                            </div>
                            <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-1">
                                {scorecards.map((card) => (
                                    <div key={card.label} className="border border-neutral-200 p-4">
                                        <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">
                                            {card.label}
                                        </p>
                                        <p className="text-2xl font-medium text-black">{card.value}</p>
                                        <p className="mt-1 text-sm text-neutral-600">{card.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <Users className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Proposed Focus Areas</h3>
                            </div>
                            <div className="p-6">
                                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
                                    {recommendations.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <LineChart className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Valuation Logic</h3>
                            </div>
                            <div className="p-6">
                                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
                                    {valuationNotes.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="border border-neutral-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                                <ShoppingBag className="h-5 w-5 text-black" />
                                <h3 className="text-xl font-medium">Source Stack</h3>
                            </div>
                            <div className="space-y-3 p-6">
                                {sources.map((source) => (
                                    <a
                                        key={source.href}
                                        href={source.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between gap-3 border border-neutral-200 px-4 py-3 text-sm text-neutral-700 transition-colors hover:border-black hover:text-black"
                                    >
                                        <span>{source.label}</span>
                                        <ExternalLink className="h-4 w-4 shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </section>
                    </aside>

                    <section className="border border-neutral-200 lg:col-span-12">
                        <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
                            <LineChart className="h-5 w-5 text-black" />
                            <h3 className="text-xl font-medium">Predicted Growth & Project Value</h3>
                        </div>
                        <div className="space-y-6 p-6 md:p-8">
                            <p className="max-w-4xl text-sm leading-relaxed text-neutral-600">
                                Based on Borek-G&apos;s existing public trust signals, this proposal is modeled as a demand-amplification
                                project. The forecast below is a soft prediction, not a guarantee, and assumes competent execution over
                                one to three quarters.
                            </p>
                            <div className="grid gap-4 md:grid-cols-3">
                                {growthForecast.map((item) => (
                                    <div key={item.label} className="border border-neutral-200 p-4 md:p-5">
                                        <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">
                                            {item.label}
                                        </p>
                                        <p className="text-2xl font-medium text-black">{item.value}</p>
                                        <p className="mt-2 text-sm leading-6 text-neutral-600">{item.detail}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border border-neutral-200 bg-neutral-50 p-4 md:p-5">
                                <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">
                                    Soft Valuation
                                </p>
                                <p className="max-w-5xl text-sm leading-6 text-neutral-700">
                                    Market data supports the view that this is a high-leverage project because Borek-G already has
                                    validated demand, strong local sentiment, and multiple purchase channels. The commercial value is
                                    in converting that existing trust into more frequent visits, larger catering volume, and stronger
                                    repeat digital demand.
                                </p>
                            </div>
                        </div>
                    </section>

                </main>
            </motion.div>
        </article>
    );
}
