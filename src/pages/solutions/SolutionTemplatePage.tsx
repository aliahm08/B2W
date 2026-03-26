import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, Calculator, CheckCircle2, ExternalLink, Send, SlidersHorizontal } from 'lucide-react';
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
import { getSourceMetadata, openCalendly, submitInternalForm } from '../../lib/engagement';

function formatInputValue(input: SolutionInput, value: number) {
  if (input.unit === 'currency') {
    return formatCurrency(value);
  }

  if (input.unit === 'percent') {
    return formatPercent(value);
  }

  return value.toLocaleString();
}

const defaultLeadState = {
  name: '',
  email: '',
  company: '',
  notes: '',
  websiteUrl: '',
};

export default function SolutionTemplatePage() {
  const { slug } = useParams();
  const solution = slug ? parseKitchenSolutionSlug(slug) : null;

  const defaultInputs = useMemo(() => (solution ? getDefaultSolutionInputs(solution) : null), [solution]);
  const baseInputs = useMemo(() => (defaultInputs ? getInitialInputValues(defaultInputs) : null), [defaultInputs]);
  const [values, setValues] = useState(baseInputs);
  const [leadState, setLeadState] = useState(defaultLeadState);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
            Back to project builder
          </Link>
          <h1 className="mt-8 text-4xl font-medium tracking-tight text-neutral-950">Solution template not found</h1>
        </div>
      </section>
    );
  }

  const template = buildSolutionTemplateData(solution, values);

  async function handleAcceptPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLeadStatus('submitting');
    setErrorMessage('');

    const result = await submitInternalForm('/api/contact-lead', {
      name: leadState.name.trim(),
      email: leadState.email.trim(),
      company: leadState.company.trim(),
      phone: '',
      website: '',
      arrRange: solution.roughEstimate,
      projectAreas: solution.projectAreas,
      inquiryType: solution.inquiryType,
      normalizedProjectArea: solution.projectAreas[0] ?? solution.inquiryType,
      message: [
        `Accepted preview for ${solution.name}.`,
        `Estimate: ${solution.roughEstimate}.`,
        `Information: ${solution.information.map((item) => item.title).join(', ')}.`,
        `Integration: ${solution.integration.map((item) => item.title).join(', ')}.`,
        `Production: ${solution.production.map((item) => item.title).join(', ')}.`,
        leadState.notes.trim() ? `Notes: ${leadState.notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join(' '),
      websiteUrl: leadState.websiteUrl.trim(),
      ...getSourceMetadata({
        formType: 'solution_acceptance',
        actionType: 'solution_acceptance',
        sourcePage: `Solution acceptance: ${solution.name}`,
      }),
    });

    if (!result.ok) {
      setLeadStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit your request right now.');
      return;
    }

    setLeadStatus('success');
    setLeadState(defaultLeadState);
  }

  return (
    <>
      <Seo />
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="border-b border-neutral-200 pb-10 md:pb-12">
          <Link to="/kitchen" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back to project builder
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500">Project Preview</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl leading-[0.95]">
                {solution.name}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
                {template.profile.summary}
              </p>
            </div>

            <aside className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400">Preview Summary</p>
              <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-300">
                <p><span className="text-neutral-500">Business</span> {template.profile.businessName}</p>
                <p><span className="text-neutral-500">Sector</span> {template.profile.sector}</p>
                <p><span className="text-neutral-500">Region</span> {template.profile.geography}</p>
                <p><span className="text-neutral-500">Estimate</span> {solution.roughEstimate}</p>
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

            <section className="border border-black bg-[#f8f4ec] p-6 md:p-7">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">Accept This Preview</p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight text-neutral-950">Send this project to B2W.</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Preview stays open. If this is close to what you want, submit your information here and we will follow up with a tailored proposal.
              </p>

              {leadStatus === 'success' ? (
                <div className="mt-6 border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm font-medium text-emerald-900">Your request has been submitted.</p>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        B2W now has your selected project stack and the preview context.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openCalendly}
                    className="mt-4 inline-flex items-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Schedule a call
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAcceptPreview} className="mt-6 space-y-4">
                  <div className="grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Name</span>
                      <input
                        type="text"
                        value={leadState.name}
                        onChange={(event) => setLeadState((current) => ({ ...current, name: event.target.value }))}
                        required
                        autoComplete="name"
                        className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Work email</span>
                      <input
                        type="email"
                        value={leadState.email}
                        onChange={(event) => setLeadState((current) => ({ ...current, email: event.target.value }))}
                        required
                        autoComplete="email"
                        className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="name@business.com"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Business</span>
                      <input
                        type="text"
                        value={leadState.company}
                        onChange={(event) => setLeadState((current) => ({ ...current, company: event.target.value }))}
                        required
                        autoComplete="organization"
                        className="w-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="Business name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">Context</span>
                      <textarea
                        value={leadState.notes}
                        onChange={(event) => setLeadState((current) => ({ ...current, notes: event.target.value }))}
                        rows={4}
                        className="w-full resize-y border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                        placeholder="What is the decision, timeline, or outcome you want this project to support?"
                      />
                    </label>
                  </div>

                  <label className="hidden">
                    <span className="mb-2 block text-sm font-medium text-neutral-800">Leave this field empty</span>
                    <input
                      type="text"
                      value={leadState.websiteUrl}
                      onChange={(event) => setLeadState((current) => ({ ...current, websiteUrl: event.target.value }))}
                      tabIndex={-1}
                      autoComplete="off"
                      className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none"
                    />
                  </label>

                  {leadStatus === 'error' ? (
                    <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={leadStatus === 'submitting'}
                    className="inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-5 py-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {leadStatus === 'submitting' ? 'Submitting...' : 'Accept preview and send inquiry'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
