import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { aiSolutions, type AiDemoMode } from '../../content/aiSolutions';
import { getCalendlyUrl, getSourceMetadata, openCalendly, submitInternalForm } from '../../lib/engagement';

type AiSolutionsFormProps = {
  heading?: string;
  intro?: string;
  submitLabel?: string;
  sourceLabel?: string;
  preselectedSolutions?: AiDemoMode[];
};

type AiSolutionsFormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  selectedSolutions: AiDemoMode[];
  currentWorkflow: string;
  desiredOutcome: string;
  systems: string;
  timeline: string;
  websiteUrl: string;
};

const EMPTY_SOLUTIONS: AiDemoMode[] = [];
const timelineOptions = ['ASAP', 'This month', 'This quarter', 'Exploring'] as const;

const defaultState: AiSolutionsFormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  selectedSolutions: [],
  currentWorkflow: '',
  desiredOutcome: '',
  systems: '',
  timeline: '',
  websiteUrl: '',
};

export default function AiSolutionsForm({
  heading = 'Start an AI workflow conversation',
  intro = 'Tell B2W what the AI should capture, calculate, or move forward. We use this intake to scope the right solution path.',
  submitLabel = 'Send AI intake',
  sourceLabel = 'AI Solutions',
  preselectedSolutions = EMPTY_SOLUTIONS,
}: AiSolutionsFormProps) {
  const preselectedKey = preselectedSolutions.join('|');
  const [state, setState] = useState<AiSolutionsFormState>({
    ...defaultState,
    selectedSolutions: [...preselectedSolutions],
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const calendlyUrl = getCalendlyUrl();

  useEffect(() => {
    setState((current) => ({
      ...current,
      selectedSolutions: [...preselectedSolutions],
    }));
  }, [preselectedKey]);

  const selectedSolutionEntries = useMemo(
    () => aiSolutions.filter((solution) => state.selectedSolutions.includes(solution.slug)),
    [state.selectedSolutions],
  );
  const selectedSolutionLabels = selectedSolutionEntries.map((solution) => solution.navLabel);

  function toggleSolution(slug: AiDemoMode) {
    setState((current) => {
      const hasSlug = current.selectedSolutions.includes(slug);
      return {
        ...current,
        selectedSolutions: hasSlug
          ? current.selectedSolutions.filter((item) => item !== slug)
          : [...current.selectedSolutions, slug],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('submitting');
    setErrorMessage('');

    const inquiryType =
      selectedSolutionLabels.length === 1 ? `${selectedSolutionLabels[0]} AI` : 'AI Solutions';
    const message = [
      `Desired AI workflows: ${selectedSolutionLabels.join(', ')}`,
      `Current workflow: ${state.currentWorkflow.trim()}`,
      `Desired outcome: ${state.desiredOutcome.trim()}`,
      state.systems.trim() ? `Systems involved: ${state.systems.trim()}` : '',
      state.timeline ? `Timeline: ${state.timeline}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    const result = await submitInternalForm('/api/contact-lead', {
      name: state.name.trim(),
      email: state.email.trim(),
      company: state.company.trim(),
      phone: state.phone.trim(),
      website: '',
      projectAreas: selectedSolutionLabels,
      inquiryType,
      normalizedProjectArea: selectedSolutionLabels[0] ?? 'AI Solutions',
      message,
      websiteUrl: state.websiteUrl.trim(),
      ...getSourceMetadata({
        sourcePage: sourceLabel,
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit the AI intake right now.');
      return;
    }

    setStatus('success');
    setState({
      ...defaultState,
      selectedSolutions: [...preselectedSolutions],
    });
  }

  if (status === 'success') {
    return (
      <section className="rounded-[2rem] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(12,16,24,0.92))] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.3)] md:p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/80">AI Intake Received</p>
        <h3 className="mt-3 text-3xl font-medium tracking-tight text-white">B2W has the workflow request.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-300 md:text-base">
          We will review the context you submitted and follow up with the right next step for the AI workflow.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://chat.b2w-ai.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Open live demo
            <ExternalLink className="h-4 w-4" />
          </a>
          {calendlyUrl ? (
            <button
              type="button"
              onClick={openCalendly}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/24 hover:bg-white/6"
            >
              Book intro call
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#131923_0%,#0b1017_100%)] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.3)] md:p-8">
      <div className="max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">AI Intake</p>
        <h3 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-[2.2rem]">{heading}</h3>
        <p className="mt-3 text-sm leading-7 text-neutral-300 md:text-base">{intro}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-200">Name</span>
            <input
              type="text"
              value={state.name}
              onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
              required
              autoComplete="name"
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-200">Work email</span>
            <input
              type="email"
              value={state.email}
              onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
              required
              autoComplete="email"
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
              placeholder="name@company.com"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-200">Company</span>
            <input
              type="text"
              value={state.company}
              onChange={(event) => setState((current) => ({ ...current, company: event.target.value }))}
              required
              autoComplete="organization"
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
              placeholder="Business name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-200">Work phone</span>
            <input
              type="tel"
              value={state.phone}
              onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
              required
              autoComplete="tel"
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
              placeholder="(555) 555-5555"
            />
          </label>
        </div>

        <label className="hidden">
          <span className="mb-2 block text-sm font-medium text-neutral-200">Leave this field empty</span>
          <input
            type="text"
            value={state.websiteUrl}
            onChange={(event) => setState((current) => ({ ...current, websiteUrl: event.target.value }))}
            tabIndex={-1}
            autoComplete="off"
            className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          />
        </label>

        <fieldset className="block">
          <legend className="mb-2 block text-sm font-medium text-neutral-200">Which AI workflows matter most?</legend>
          <p className="mb-4 text-xs leading-6 text-neutral-500">
            Pick the workflows you want B2W to scope first.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {aiSolutions.map((solution) => {
              const isSelected = state.selectedSolutions.includes(solution.slug);
              return (
                <button
                  key={solution.slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleSolution(solution.slug)}
                  className={`rounded-[1.4rem] border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-sky-300/40 bg-sky-300/10 text-white'
                      : 'border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{solution.navLabel}</p>
                      <p className="mt-2 text-sm leading-6 text-neutral-400">{solution.summary}</p>
                    </div>
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-20'}`} />
                  </div>
                </button>
              );
            })}
          </div>
          <AnimatePresence initial={false}>
            {selectedSolutionLabels.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {selectedSolutionLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-neutral-200"
                  >
                    {label}
                  </span>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-200">How does the workflow work today?</span>
            <textarea
              value={state.currentWorkflow}
              onChange={(event) => setState((current) => ({ ...current, currentWorkflow: event.target.value }))}
              required
              rows={5}
              className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
              placeholder="Describe the current intake, quoting, ops, or decision process."
            />
          </label>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-200">Systems involved</span>
              <input
                type="text"
                value={state.systems}
                onChange={(event) => setState((current) => ({ ...current, systems: event.target.value }))}
                className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
                placeholder="CRM, Slack, email, Sheets, phone..."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-200">Timeline</span>
              <select
                value={state.timeline}
                onChange={(event) => setState((current) => ({ ...current, timeline: event.target.value }))}
                className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/30"
              >
                <option value="">Select a timing window</option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#0b1017] text-white">
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-neutral-200">What should the AI do for the team?</span>
          <textarea
            value={state.desiredOutcome}
            onChange={(event) => setState((current) => ({ ...current, desiredOutcome: event.target.value }))}
            required
            rows={4}
            className="w-full rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/30"
            placeholder="What should the AI capture, calculate, route, or automate?"
          />
        </label>

        {status === 'error' ? (
          <p className="rounded-[1rem] border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-neutral-500">
            This intake is specific to AI workflows, not the general consulting form. Select at least one workflow so B2W can route the request correctly.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting' || state.selectedSolutions.length === 0}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Submitting...' : submitLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
