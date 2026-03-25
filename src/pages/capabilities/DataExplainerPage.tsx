import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import Seo from '../../components/Seo';

type ExplainerItem = {
  label: string;
  detail: string;
};

type ExplainerContent = {
  title: string;
  seoTitle: string;
  eyebrow: string;
  description: string;
  summary: string;
  examples: ExplainerItem[];
  decisions: string[];
};

const explainerContent: Record<string, ExplainerContent> = {
  '/capabilities/marketing-data': {
    eyebrow: 'Marketing Data',
    title: 'See What Marketing Data Is Really Saying',
    seoTitle: 'Marketing Data Inputs | B2W',
    description:
      'Examples of the marketing data B2W reviews to understand demand, conversion behavior, and channel performance.',
    summary:
      'We look at how people discover the business, what they do once they find it, and where marketing spend or attention is creating momentum or getting wasted.',
    examples: [
      {
        label: 'Instagram analytics',
        detail:
          'Reach, engagement, follower growth, story performance, and content-level drop-off that show which creative is earning attention and where interest fades.',
      },
      {
        label: 'Google reviews',
        detail:
          'Ratings patterns, review volume, recurring complaints, and sentiment signals that reveal what customers repeatedly notice and what is hurting trust.',
      },
      {
        label: 'Google Ads',
        detail:
          'Impressions, click-through rate, cost per click, conversions, and search term quality to show whether paid demand is efficient or being wasted.',
      },
      {
        label: 'Website visit behavior',
        detail:
          'Traffic sources, page paths, time on page, and where people are clicking so we can see how visitors move, hesitate, or leave.',
      },
      {
        label: 'Landing-page conversion data',
        detail:
          'Form completion, call clicks, booking intent, and funnel abandonment points that show where demand turns into leads and where it dies.',
      },
    ],
    decisions: [
      'Identify which channels are actually driving qualified demand',
      'Find where interest is dropping before it becomes revenue',
      'Improve website, campaign, and content decisions using observed user behavior',
    ],
  },
  '/capabilities/financials': {
    eyebrow: 'Financials',
    title: 'Find What the Financials Are Hiding',
    seoTitle: 'Financial Data Inputs | B2W',
    description:
      'Examples of the financial inputs B2W uses to understand profitability, leakage, and the tradeoffs behind growth decisions.',
    summary:
      'We read the numbers behind the business to understand how revenue turns into margin, where losses are hiding, and which changes are financially worth making.',
    examples: [
      {
        label: 'Profit and loss statements',
        detail:
          'Monthly, quarterly, or location-based P&Ls that show how revenue, direct costs, and overhead are actually performing.',
      },
      {
        label: 'Revenue mix',
        detail:
          'Breakdowns by product, service line, or customer segment that reveal where strong sales are helping and where weak mix is dragging results.',
      },
      {
        label: 'Margin performance',
        detail:
          'Gross margin, contribution margin, and pricing behavior that show whether the business is growing profitably or just moving volume.',
      },
      {
        label: 'Cash flow timing',
        detail:
          'Expense concentration, recurring obligations, and payment timing that expose pressure points the P&L alone does not show.',
      },
      {
        label: 'Invoices and payroll patterns',
        detail:
          'Operating records that help surface margin leakage, avoidable spend, and recurring cost structures that need to be corrected.',
      },
    ],
    decisions: [
      'Find where revenue is being lost or diluted',
      'Pressure-test pricing, margin, and cash flow assumptions',
      'Prioritize changes that have real financial upside',
    ],
  },
  '/capabilities/operational-performance': {
    eyebrow: 'Operational Performance',
    title: 'Understand Where Operations Break Down',
    seoTitle: 'Operational Performance Inputs | B2W',
    description:
      'Examples of the operational data B2W reviews to understand workflow friction, execution quality, and delivery constraints.',
    summary:
      'We read how the business actually runs day to day so we can spot bottlenecks, coordination failures, and repeatable issues that keep performance below capacity.',
    examples: [
      {
        label: 'Scheduling and staffing data',
        detail:
          'Shift coverage, labor patterns, and staffing gaps that show whether the operation is consistently matched to demand.',
      },
      {
        label: 'Process maps and SOPs',
        detail:
          'Workflow definitions, handoff points, and operating instructions that reveal confusion, duplication, or missing process control.',
      },
      {
        label: 'Throughput and service benchmarks',
        detail:
          'Production time, service time, completion time, or turnaround metrics that show where execution is slowing down.',
      },
      {
        label: 'Dashboard and task-tracking data',
        detail:
          'Operational metrics, task status patterns, and recurring exceptions that point to systemic reliability problems.',
      },
      {
        label: 'Operational notes and team feedback',
        detail:
          'Observed issues, recurring complaints, and frontline signals that expose execution drag clients and teams are already feeling.',
      },
    ],
    decisions: [
      'Find bottlenecks that are slowing down delivery',
      'Reduce avoidable coordination and training overhead',
      'Improve execution consistency with clearer systems and workflows',
    ],
  },
};

export default function DataExplainerPage() {
  const location = useLocation();
  const content = useMemo(
    () => explainerContent[location.pathname] ?? explainerContent['/capabilities/marketing-data'],
    [location.pathname],
  );
  const [openItem, setOpenItem] = useState(content.examples[0]?.label ?? '');

  useEffect(() => {
    setOpenItem(content.examples[0]?.label ?? '');
  }, [content]);

  const handleToggle = (label: string) => {
    setOpenItem((current) => (current === label ? '' : label));
  };

  return (
    <>
      <Seo title={content.seoTitle} description={content.description} />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="mb-12 border-b border-neutral-200 pb-10 md:pb-12">
          <Link
            to="/#capabilities"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black"
          >
            Back to homepage capabilities
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-start">
            <div>
              <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">{content.eyebrow}</p>
              <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {content.title}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-500 md:text-2xl">
                {content.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">What This Shows</p>
              <h2 className="mb-4 text-2xl font-medium tracking-tight md:text-4xl">
                Concrete examples of the inputs we use before recommending changes.
              </h2>
              <p className="text-sm leading-6 text-neutral-300">{content.description}</p>
            </aside>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="border border-neutral-200 bg-white p-6 md:p-7">
            <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">Example Inputs</h2>
            <ul className="space-y-3">
              {content.examples.map((item) => (
                <li key={item.label} className="border border-neutral-200 bg-neutral-50 transition-colors hover:border-neutral-300">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.label)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                    aria-expanded={openItem === item.label}
                  >
                    <Check className="h-4 w-4 shrink-0 text-neutral-700" />
                    <span className="flex-1 text-base font-medium leading-relaxed text-neutral-900">{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                        openItem === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openItem === item.label ? (
                    <div className="border-t border-neutral-200 px-4 py-4 text-sm leading-relaxed text-neutral-600">
                      {item.detail}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-neutral-200 bg-white p-6 md:p-7">
            <h2 className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400">What We Use It For</h2>
            <ul className="space-y-4">
              {content.decisions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed text-neutral-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col gap-5 border border-neutral-900 bg-neutral-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-2xl">
              <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Next Step</p>
              <h2 className="text-2xl font-medium tracking-tight md:text-4xl">
                Want us to review your {content.eyebrow.toLowerCase()} inputs?
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Share your current business context and we can assess what data is available, what it is saying, and where the highest-leverage opportunities are.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/#contact"
                className="inline-flex min-h-12 items-center justify-center border border-white px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                Tell us about your business
              </Link>
              <a
                href="mailto:info@b2w-ai.com?subject=Capability%20Review"
                className="inline-flex min-h-12 items-center justify-center border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Email B2W
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
