import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Calculator, Check, Gauge, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import Seo from '../../../components/Seo';
import {
  projectPageEyebrowClassName,
  projectPageHeaderClassName,
  projectPageHeroTitleClassName,
  projectPageSectionTitleClassName,
  projectPageShellClassName,
  projectHeroGridClassNames,
} from '../../../components/projectPageLayout';
import { JasonAIInternalNavbar, jasonAIInternalRoutes } from './shared';

type Scenario = {
  id: 'conservative' | 'base' | 'upside';
  label: string;
  customers: number;
  monthlyRevenuePerCustomer: number;
  multiple: number;
  color: string;
};

const scenarios: Scenario[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    customers: 25,
    monthlyRevenuePerCustomer: 750,
    multiple: 4,
    color: 'bg-neutral-400',
  },
  {
    id: 'base',
    label: 'Base case',
    customers: 75,
    monthlyRevenuePerCustomer: 1000,
    multiple: 6,
    color: 'bg-emerald-500',
  },
  {
    id: 'upside',
    label: 'Upside',
    customers: 200,
    monthlyRevenuePerCustomer: 1250,
    multiple: 8,
    color: 'bg-sky-500',
  },
];

const valueDrivers = [
  ['Retention', 'Prove JasonAI becomes part of the daily operating rhythm and sustains strong net revenue retention.'],
  ['Expansion', 'Show that customers add teams, locations, workflows, or higher-value assistant capabilities over time.'],
  ['Gross margin', 'Reduce inference, support, and onboarding cost without weakening assistant quality or trust.'],
  ['Distribution', 'Build a repeatable acquisition motion through vertical expertise, partners, and customer referrals.'],
  ['Defensibility', 'Compound proprietary workflow knowledge, evaluations, skills, and integrations around WhatsApp use cases.'],
  ['Trust', 'Make privacy, consent, evidence, and access control measurable product advantages.'],
] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
    notation: value >= 1_000_000 ? 'compact' : 'standard',
  }).format(value);

export default function JasonAIValuationModelPage() {
  const [scenarioId, setScenarioId] = useState<Scenario['id']>('base');
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[1];
  const [customers, setCustomers] = useState(scenario.customers);
  const [monthlyRevenuePerCustomer, setMonthlyRevenuePerCustomer] = useState(scenario.monthlyRevenuePerCustomer);
  const [multiple, setMultiple] = useState(scenario.multiple);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectScenario = (nextScenario: Scenario) => {
    setScenarioId(nextScenario.id);
    setCustomers(nextScenario.customers);
    setMonthlyRevenuePerCustomer(nextScenario.monthlyRevenuePerCustomer);
    setMultiple(nextScenario.multiple);
  };

  const model = useMemo(() => {
    const mrr = Math.max(0, customers) * Math.max(0, monthlyRevenuePerCustomer);
    const arr = mrr * 12;
    return {
      mrr,
      arr,
      impliedValue: arr * Math.max(0, multiple),
    };
  }, [customers, monthlyRevenuePerCustomer, multiple]);

  return (
    <article className={projectPageShellClassName}>
      <JasonAIInternalNavbar />
      <Seo
        title="JasonAI Product Valuation Model"
        description="Private planning model for JasonAI product revenue, valuation scenarios, and value drivers."
        robots="noindex, nofollow"
      />

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className={projectPageHeaderClassName}>
          <Link
            to={jasonAIInternalRoutes.proposal}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-500 transition hover:bg-neutral-200 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Proposal
          </Link>

          <div className={projectPageEyebrowClassName}>
            <span className="font-semibold text-neutral-900">JasonAI</span>
            <span className="text-neutral-300">•</span>
            <span>Valuation</span>
          </div>

          <div className={projectHeroGridClassNames.profile}>
            <div>
              <h1 className={projectPageHeroTitleClassName}>Product Valuation Model</h1>
              <p className="mb-8 max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl">
                A working planning model that connects customer adoption and recurring revenue to an illustrative product value.
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  ['Method', 'ARR Multiple'],
                  ['Stage', 'Internal Planning'],
                  ['Model', 'Scenario-Based'],
                ].map(([label, value], index) => (
                  <div key={label} className={`border border-neutral-200 p-4 text-sm ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-neutral-500">{label}</span>
                    <span className="mt-2 block font-medium text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Current model output</p>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-neutral-500">Illustrative product value</p>
              <p className="mt-2 text-5xl font-medium tracking-tight text-white">{formatCurrency(model.impliedValue)}</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">ARR</p>
                  <p className="mt-2 text-base font-medium">{formatCurrency(model.arr)}</p>
                </div>
                <div className="border border-white/10 bg-white/5 p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">Multiple</p>
                  <p className="mt-2 text-base font-medium">{multiple.toFixed(1)}×</p>
                </div>
              </div>
              <p className="mt-5 text-xs leading-5 text-neutral-500">
                Illustrative internal scenario only. This is not an appraisal, financing opinion, or investment advice.
              </p>
            </aside>
          </div>
        </header>

        <main>
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="border border-neutral-200 p-2">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400">Interactive worksheet</p>
                <h2 className={projectPageSectionTitleClassName}>Operating assumptions</h2>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
              <div className="space-y-3">
                {scenarios.map((item) => {
                  const selected = item.id === scenarioId;
                  const arr = item.customers * item.monthlyRevenuePerCustomer * 12;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectScenario(item)}
                      className={`w-full border p-4 text-left transition ${
                        selected ? 'border-black bg-neutral-950 text-white' : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <span className={`text-xs ${selected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {formatCurrency(arr * item.multiple)}
                        </span>
                      </div>
                      <p className={`mt-3 text-xs ${selected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {item.customers} customers · {formatCurrency(item.monthlyRevenuePerCustomer)} MRR/customer · {item.multiple}× ARR
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="border border-neutral-200 bg-white p-5 sm:p-7">
                <div className="grid gap-6 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Customers</span>
                    <input
                      type="number"
                      min="0"
                      value={customers}
                      onChange={(event) => setCustomers(Number(event.target.value))}
                      className="mt-3 h-12 w-full border border-neutral-200 px-3 text-lg font-medium outline-none transition focus:border-black"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Monthly revenue / customer</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={monthlyRevenuePerCustomer}
                      onChange={(event) => setMonthlyRevenuePerCustomer(Number(event.target.value))}
                      className="mt-3 h-12 w-full border border-neutral-200 px-3 text-lg font-medium outline-none transition focus:border-black"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">ARR multiple</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step=".5"
                      value={multiple}
                      onChange={(event) => setMultiple(Number(event.target.value))}
                      className="mt-3 h-12 w-full border border-neutral-200 px-3 text-lg font-medium outline-none transition focus:border-black"
                    />
                  </label>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Monthly recurring revenue', formatCurrency(model.mrr)],
                    ['Annual recurring revenue', formatCurrency(model.arr)],
                    ['Illustrative value', formatCurrency(model.impliedValue)],
                  ].map(([label, value], index) => (
                    <div key={label} className={index === 2 ? 'bg-emerald-50 p-4' : 'bg-neutral-50 p-4'}>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-500">{label}</p>
                      <p className={`mt-2 text-xl font-medium ${index === 2 ? 'text-emerald-800' : 'text-black'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 border-t border-neutral-100 pt-5">
                  <p className="text-xs leading-5 text-neutral-500">
                    Formula: customers × monthly revenue per customer × 12 months × ARR multiple. Future versions can add churn, gross margin, expansion, implementation revenue, and probability-weighted milestones.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-neutral-100 pt-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(260px,.65fr)_minmax(0,1.35fr)]">
              <div>
                <Gauge className="h-6 w-6 text-emerald-700" />
                <h2 className="mt-4 text-3xl font-medium tracking-tight">What earns the multiple.</h2>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  Revenue creates the baseline. Evidence of durable, efficient, and defensible growth determines the quality of the valuation.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {valueDrivers.map(([title, body]) => (
                  <div key={title} className="border border-neutral-200 p-5">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-700" />
                      <h3 className="text-sm font-medium text-black">{title}</h3>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-neutral-600">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 flex flex-col gap-5 border border-neutral-900 bg-neutral-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Next model input</p>
              <h2 className="mt-2 text-xl font-medium">Connect strategy assumptions to documented evidence.</h2>
            </div>
            <Link
              to={jasonAIInternalRoutes.documentation}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Open Documentation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </main>
      </motion.div>
      <Footer />
    </article>
  );
}

