import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Seo from '../components/Seo';

type InquiryType = 'Marketing' | 'Financials' | 'Operations' | 'End-to-End Rebuild';

const arrRangeOptions = [
  'Under $250k',
  '$250k - $1M',
  '$1M - $5M',
  '$5M - $10M',
  '$10M - $25M',
  '$25M+',
] as const;

type ArrRange = (typeof arrRangeOptions)[number] | '';

type ServicePageContent = {
  title: string;
  eyebrow: string;
  description: string;
  summary: string;
  outcomes: string[];
  scope: string[];
  inquiryType: InquiryType;
};

const servicePageContent: Record<string, ServicePageContent> = {
  '/services/marketing-advisory': {
    eyebrow: 'Marketing',
    title: 'Marketing Advisory Services',
    description:
      'Marketing support focused on revenue growth, clearer positioning, stronger campaigns, and more efficient customer acquisition.',
    summary:
      'This project is built for businesses that need sharper messaging, better channel strategy, and practical guidance on where to focus marketing effort next.',
    outcomes: [
      'Clarify brand positioning and market narrative',
      'Find the highest-return growth channels',
      'Improve campaign planning and conversion performance',
    ],
    scope: [
      'Messaging and positioning review',
      'Channel and campaign strategy',
      'Website and funnel conversion recommendations',
      'Performance measurement and reporting priorities',
    ],
    inquiryType: 'Marketing',
  },
  '/services/financial-review': {
    eyebrow: 'Financials',
    title: 'Financial Review Projects',
    description:
      'Financial analysis that surfaces missed margin, hidden inefficiencies, pricing issues, and revenue leakage.',
    summary:
      'This project is for owners who need a clearer read on performance, stronger reporting, and a grounded plan for where money is being lost or left on the table.',
    outcomes: [
      'Identify lost revenue and profit leakage',
      'Pressure-test pricing, margins, and cash flow',
      'Turn financial data into decision-ready recommendations',
    ],
    scope: [
      'Revenue and cost analysis',
      'Forecasting and scenario review',
      'Pricing and margin diagnostics',
      'Decision memo with recommended next actions',
    ],
    inquiryType: 'Financials',
  },
  '/services/operations-implementation': {
    eyebrow: 'Operations',
    title: 'Operations Implementation Projects',
    description:
      'Operational improvement work that reduces training drag, eliminates avoidable coordination overhead, and improves execution consistency.',
    summary:
      'This project is for teams that need cleaner workflows, stronger SOPs, better handoffs, and practical systems that help people perform faster.',
    outcomes: [
      'Reduce onboarding and training time',
      'Standardize repeatable workflows across the team',
      'Improve visibility, coordination, and accountability',
    ],
    scope: [
      'Workflow mapping and bottleneck review',
      'SOP and training system design',
      'Scheduling, dashboard, or automation recommendations',
      'Implementation roadmap tied to day-to-day operations',
    ],
    inquiryType: 'Operations',
  },
  '/services/business-revamp': {
    eyebrow: 'Business Revamp',
    title: 'Full Business Scoping and Revamp Projects',
    description:
      'A comprehensive engagement that scopes the business across growth, financials, and operations, then builds a practical plan to improve the whole system.',
    summary:
      'This is for businesses that need more than a narrow fix. The work starts with diagnosis, identifies the highest-leverage issues, and translates them into a coordinated reset plan.',
    outcomes: [
      'Diagnose the business end-to-end before investing in changes',
      'Prioritize the few changes most likely to improve performance',
      'Move from scattered fixes to one coordinated execution plan',
    ],
    scope: [
      'Business-wide discovery and problem framing',
      'Marketing, financial, and operational assessment',
      'Revamp roadmap with sequenced priorities',
      'Advisory support for implementation decisions',
    ],
    inquiryType: 'End-to-End Rebuild',
  },
};

export default function ServiceProjectPage() {
  const location = useLocation();
  const content = useMemo(
    () => servicePageContent[location.pathname] ?? servicePageContent['/services/marketing-advisory'],
    [location.pathname],
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [arrRange, setArrRange] = useState<ArrRange>('');
  const [businessInfo, setBusinessInfo] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>(content.inquiryType);

  useEffect(() => {
    setInquiryType(content.inquiryType);
  }, [content.inquiryType]);

  function handleInquirySubmit(event: FormEvent) {
    event.preventDefault();

    const subject = encodeURIComponent(`B2W Inquiry: ${inquiryType}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Website: ${website}`,
        `ARR range: ${arrRange || 'Not provided'}`,
        `Area of interest: ${inquiryType}`,
        '',
        'Business information:',
        businessInfo,
      ].join('\n'),
    );

    window.location.href = `mailto:info@b2w-ai.com?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <Seo title={`${content.title} | B2W`} description={content.description} />
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-10">
          <Link to="/#projects" className="text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            Back to homepage projects
          </Link>
          <p className="mb-5 mt-8 text-xs font-mono uppercase tracking-[0.28em] text-neutral-400">{content.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl md:text-7xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
            {content.summary}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="space-y-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="border border-neutral-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">Outcomes</h2>
                <ul className="space-y-4">
                  {content.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-neutral-200 bg-white p-6">
                <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">Scope</h2>
                <ul className="space-y-4">
                  {content.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-neutral-200 bg-neutral-50 p-6 md:p-8">
              <p className="mb-3 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">How It Starts</p>
              <p className="max-w-3xl text-base leading-relaxed text-neutral-700">
                Share your business context, current constraints, and what you want to improve. B2W uses that information
                to understand whether the project is a fit and what the right scope should look like.
              </p>
            </div>
          </div>

          <aside className="border border-neutral-200 bg-white p-5 sm:p-6 md:p-8 lg:sticky lg:top-28">
            <p className="mb-3 text-sm font-mono uppercase tracking-[0.22em] text-neutral-400">Inquiry Form</p>
            <h2 className="text-2xl font-medium tracking-tight text-neutral-950 sm:text-3xl">
              Tell us about your business
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              The service area is already selected for this page. Add enough business context for B2W to evaluate fit,
              scope, and urgency.
            </p>

            <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Work email"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Business name"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
                <input
                  type="url"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="Website"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
              </div>

              <select
                value={arrRange}
                onChange={(event) => setArrRange(event.target.value as ArrRange)}
                className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              >
                <option value="">Select ARR range</option>
                {arrRangeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={inquiryType}
                onChange={(event) => setInquiryType(event.target.value as InquiryType)}
                className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
              >
                <option value="Marketing">Marketing</option>
                <option value="Financials">Financials</option>
                <option value="Operations">Operations</option>
                <option value="End-to-End Rebuild">End-to-End Rebuild</option>
              </select>

              <textarea
                value={businessInfo}
                onChange={(event) => setBusinessInfo(event.target.value)}
                placeholder="Describe the business, the current problem, any constraints, and what kind of outcome you want."
                rows={7}
                className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                required
              />

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Send Inquiry
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </div>
      </section>
    </>
  );
}
