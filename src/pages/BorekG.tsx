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
import MobileSectionNav from '../components/MobileSectionNav';
import ResponsiveAccordionSection from '../components/ResponsiveAccordionSection';
import {
    projectPageBackLinkClassName,
    projectPageEyebrowClassName,
    projectPageHeaderClassName,
    projectPageShellClassName,
    projectHeroGridClassNames,
} from '../components/projectPageLayout';

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
    'Turn five-star reviews into landing-page proof, paid creative, and menu-focused social posts.',
    'Capture more Instagram followers in-store because review volume already exceeds audience retention.',
    'Push the market-plus-cafe story harder across catering, retail, and dine-in messaging.',
    'Track posting cadence and engagement weekly so weak creative gets cut quickly.'
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
    'The issue is distribution, not product-market fit. Borek-G already has public proof that should convert better with sharper packaging.',
    'Because trust is already visible across reviews, press, and ordering channels, this is a stronger bet than a cold-start restaurant marketing project.',
    'The project pays off if it grows repeat demand or catering, not if it only grows vanity metrics.'
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
        <article className={projectPageShellClassName}>
            <Seo
                title="Borek-G Project Proposal"
                description="Proposal page for a Borek-G restaurant profile and marketing audit in Falls Church, outlining the public-data workflow, growth thesis, and client-success roadmap for execution."
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
                        <ArrowLeft className="h-4 w-4" />
                        Back to Projects
                    </Link>

                    <div className={projectPageEyebrowClassName}>
                        <span className="font-semibold text-neutral-900">Food & Beverage</span>
                        <span className="text-neutral-300">•</span>
                        <span>Proposal</span>
                    </div>

                    <section className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-8">
                        <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">
                            Proposal for Marketing Systems and Growth
                        </p>

                        <div className={projectHeroGridClassNames.proposal}>
                            <div>
                                <h1 className="mb-6 text-4xl font-medium tracking-tight md:text-6xl">
                                    Borek-G
                                </h1>

                                <p className="mb-5 max-w-3xl text-lg leading-relaxed text-neutral-200 md:text-xl">
                                    Bring more people into Borek-G by turning existing trust into stronger local content, offers, and repeat audience capture.
                                </p>

                                <p className="mb-8 max-w-3xl text-sm leading-6 text-neutral-300">
                                    Built from public review, press, and channel data. The business already has demand; the gap is packaging that proof into repeatable growth.
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
                                <h2 className="text-2xl font-medium tracking-tight md:text-4xl">
                                    Convert public proof into a repeatable growth system.
                                </h2>
                                <p className="text-sm leading-6 text-neutral-300">
                                    Snapshot date: {snapshotDate}. Public data shows strong reputation, solid channel breadth, and underused social leverage. Execution starts with baseline setup, access, and channel alignment.
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

                <main data-project-body className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-12">
                        <MobileSectionNav
                            items={[
                                { id: 'footprint', label: 'Footprint' },
                                { id: 'positioning', label: 'Positioning' },
                                { id: 'evaluation', label: 'Evaluation' },
                                { id: 'thesis', label: 'Thesis' },
                                { id: 'focus', label: 'Focus' },
                                { id: 'value', label: 'Value' },
                                { id: 'sources', label: 'Sources' },
                                { id: 'forecast', label: 'Forecast' },
                            ]}
                        />
                    </div>
                    <div className="space-y-12 lg:col-span-7">
                        <ResponsiveAccordionSection
                            id="footprint"
                            title="Location & Operating Footprint"
                            icon={MapPin}
                            defaultOpen
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body className="space-y-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                                <p>
                                    Borek-G operates from <strong className="font-semibold text-black">315 S Maple Ave, Falls Church, Virginia</strong>.
                                    Public materials show five active revenue paths: cafe, market, catering, online ordering, and gift cards.
                                </p>
                                <p>
                                    Farmers market roots and the Turkish prepared-food plus grocery mix give the business a stronger moat than a standard bakery or breakfast shop.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="positioning"
                            title="Brand Positioning"
                            icon={Store}
                            className="border border-neutral-200 md:border-0"
                            headerClassName="p-4 md:mb-4 md:p-0"
                            bodyClassName="px-4 pb-4 md:px-0 md:pb-0"
                        >
                            <div data-project-detail-body className="space-y-4">
                                <p className="text-sm leading-relaxed text-neutral-600 md:text-base">
                                    Borek-G should be positioned as a Turkish cafe and market with multiple purchase paths, not as a single-product bakery.
                                </p>
                                <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600 md:text-base">
                                    <li>Turkish cafe and market identity anchored in Falls Church.</li>
                                    <li>Halal positioning broadens addressable demand beyond casual bakery traffic.</li>
                                    <li>Farmers market roots support a concrete authenticity story.</li>
                                    <li>Square ecommerce keeps more transactions direct instead of pushing demand to third-party platforms.</li>
                                </ul>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="evaluation"
                            title="Initial Marketing Evaluation"
                            icon={Megaphone}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="space-y-6 p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-6">
                                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                                    Proposal-stage signals only. Enough to justify the project and set the first measurement priorities.
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="thesis"
                            title="Project Thesis"
                            icon={LineChart}
                            className="border border-neutral-900 bg-black text-white"
                            headerClassName="p-4 md:p-6 md:pb-4"
                            bodyClassName="px-4 pb-4 md:px-6 md:pb-6"
                            tone="dark"
                            titleClassName="text-white md:text-lg"
                        >
                            <div data-project-detail-body>
                                <p className="text-sm leading-relaxed text-neutral-300">
                                    Borek-G is stronger operationally than it looks online. The work is to package visible trust into better local conversion, then add deeper tracking after launch.
                                </p>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="focus"
                            title="Bottom Line"
                            icon={Megaphone}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="space-y-6 p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-6">
                                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
                                    Borek-G should win by looking online like it already looks in person: credible, food-forward, and local.
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
                        </ResponsiveAccordionSection>

                    </div>

                    <aside className="space-y-8 lg:col-span-5">
                        <ResponsiveAccordionSection
                            id="value"
                            title="Signal Summary"
                            icon={Star}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="grid gap-4 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-1"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="contents">
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
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            title="Proposed Focus Areas"
                            icon={Users}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
                                    {recommendations.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            title="Valuation Logic"
                            icon={LineChart}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body>
                                <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-600">
                                    {valuationNotes.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </ResponsiveAccordionSection>

                        <ResponsiveAccordionSection
                            id="sources"
                            title="Source Stack"
                            icon={ShoppingBag}
                            className="border border-neutral-200"
                            headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                            bodyClassName="space-y-3 p-4 md:p-6"
                            titleClassName="md:text-xl"
                        >
                            <div data-project-detail-body className="space-y-3">
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
                        </ResponsiveAccordionSection>
                    </aside>

                    <ResponsiveAccordionSection
                        id="forecast"
                        title="Predicted Growth & Project Value"
                        icon={LineChart}
                        className="border border-neutral-200 lg:col-span-12"
                        headerClassName="border-b border-neutral-200 bg-neutral-50 p-4"
                        bodyClassName="space-y-6 p-4 md:p-8"
                        titleClassName="md:text-xl"
                    >
                        <div data-project-detail-body className="space-y-6">
                            <p className="max-w-4xl text-sm leading-relaxed text-neutral-600">
                                This is a demand-amplification model, not a turnaround forecast. The ranges below assume competent execution over one to three quarters.
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
                                    Market data supports this as a high-leverage project because demand and trust are already visible. The commercial upside is more repeat visits, larger catering volume, and stronger owned demand.
                                </p>
                            </div>
                        </div>
                    </ResponsiveAccordionSection>

                </main>
            </motion.div>
        </article>
    );
}
