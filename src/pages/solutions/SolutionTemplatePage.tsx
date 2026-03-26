import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calculator, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import { parseKitchenSolutionSlug } from '../../content/kitchen';
import {
  buildSolutionTemplateData,
  formatCurrency,
  formatPercent,
  getDefaultSolutionInputs,
  getInitialInputValues,
  type SolutionInput,
} from '../../content/solutionTemplates';
import { openCalendly } from '../../lib/engagement';

function formatInputValue(input: SolutionInput, value: number) {
  if (input.unit === 'currency') {
    return formatCurrency(value);
  }

  if (input.unit === 'percent') {
    return formatPercent(value);
  }

  return value.toLocaleString();
}

export default function SolutionTemplatePage() {
  const { slug } = useParams();
  const solution = slug ? parseKitchenSolutionSlug(slug) : null;

  const defaultInputs = useMemo(() => (solution ? getDefaultSolutionInputs(solution) : null), [solution]);
  const baseInputs = useMemo(() => (defaultInputs ? getInitialInputValues(defaultInputs) : null), [defaultInputs]);
  const [values, setValues] = useState(baseInputs);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setValues(baseInputs);
  }, [baseInputs]);

  if (!solution || !values) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border border-neutral-200 bg-white p-8">
          <Link to="/kitchen" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Kitchen by B2W
          </Link>
          <h1 className="mt-8 text-4xl font-medium tracking-tight text-neutral-950">Solution template not found</h1>
        </div>
      </section>
    );
  }

  const template = buildSolutionTemplateData(solution, values);

  return (
    <>
      <Seo />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border-b border-neutral-200 pb-10 md:pb-12">
          <Link to="/kitchen" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to Kitchen by B2W
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Solution Template</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {solution.name}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
                {template.profile.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Mock Business Profile</p>
              <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-300">
                <p><span className="text-neutral-500">Business</span> {template.profile.businessName}</p>
                <p><span className="text-neutral-500">Sector</span> {template.profile.sector}</p>
                <p><span className="text-neutral-500">Region</span> {template.profile.geography}</p>
              </div>
              <p className="mt-6 text-sm leading-6 text-neutral-300">{template.profile.marketContext}</p>
              <button
                type="button"
                onClick={openCalendly}
                className="mt-6 inline-flex items-center gap-2 border border-white bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              >
                Schedule a call
                <ExternalLink className="h-4 w-4" />
              </button>
            </aside>
          </div>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start">
          <div className="space-y-8">
            <section className="border border-neutral-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Interactive Inputs</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-tight text-neutral-950">Adjust the mock model</h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {template.inputs.map((input) => (
                  <div key={input.key} className="space-y-3 border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{input.label}</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">{input.help}</p>
                      </div>
                      <span className="text-sm font-medium text-neutral-900">{formatInputValue(input, values[input.key])}</span>
                    </div>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={values[input.key]}
                      onChange={(event) =>
                        setValues((current) =>
                          current
                            ? {
                                ...current,
                                [input.key]: Number(event.target.value),
                              }
                            : current,
                        )
                      }
                      className="w-full"
                    />
                    <input
                      type="number"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={values[input.key]}
                      onChange={(event) =>
                        setValues((current) =>
                          current
                            ? {
                                ...current,
                                [input.key]: Number(event.target.value),
                              }
                            : current,
                        )
                      }
                      className="w-full border border-black/10 px-3 py-2 text-sm text-black outline-none transition-colors focus:border-black"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-neutral-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Calculator className="h-5 w-5 text-neutral-500" />
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Calculated Summary</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-tight text-neutral-950">Modeled outputs</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ['Annual Revenue', formatCurrency(template.derived.annualRevenue)],
                  ['Operating Income', formatCurrency(template.derived.operatingIncome)],
                  ['Implied Multiple', `${template.derived.impliedMultiple.toFixed(2)}x`],
                  ['Enterprise Value', formatCurrency(template.derived.enterpriseValue)],
                  ['Revenue per Visitor', formatCurrency(template.derived.revenuePerVisitor)],
                  ['Repeat Revenue', formatCurrency(template.derived.repeatRevenueShare)],
                ].map(([label, value]) => (
                  <div key={label} className="border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500">{label}</p>
                    <p className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              {template.deliverableSections.map((section) => (
                <div key={section.title} className="border border-neutral-200 bg-white p-6 md:p-8">
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Deliverable View</p>
                  <h2 className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">{section.title}</h2>
                  <p className="mt-4 text-base leading-7 text-neutral-700">{section.body}</p>
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                        <span className="mt-2 h-2 w-2 shrink-0 bg-black" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <section className="border border-neutral-200 bg-white p-6 md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Benchmark Scorecards</p>
              <div className="mt-5 space-y-4">
                {template.scorecards.map((card) => (
                  <div key={card.id} className="border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base font-medium text-neutral-950">{card.label}</h3>
                      <span className="text-lg font-medium text-neutral-950">{card.score}/100</span>
                    </div>
                    <p className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-neutral-500">{card.benchmarkLabel}</p>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{card.summary}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-neutral-200 bg-white p-6 md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Ingredient Stack</p>
              <div className="mt-5 space-y-4">
                {[
                  ['Information', solution.information],
                  ['Integration', solution.integration],
                  ['Production', solution.production],
                ].map(([label, items]) => (
                  <div key={label}>
                    <p className="text-sm font-medium text-neutral-900">{label}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(items as typeof solution.information).map((item) => (
                        <span key={item.id} className="border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] text-neutral-700">
                          {item.shortTitle}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
