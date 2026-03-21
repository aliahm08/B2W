import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { getSourceMetadata, openCalendly, submitInternalForm } from '../../lib/engagement';

export const publicProjectAreas = ['Marketing', 'Financials', 'Operations'] as const;
export type PublicProjectArea = (typeof publicProjectAreas)[number];
export type NormalizedProjectArea = PublicProjectArea | 'End-to-End Rebuild';

const arrRangeOptions = [
  'Under $250k',
  '$250k - $1M',
  '$1M - $5M',
  '$5M - $10M',
  '$10M - $25M',
  '$25M+',
] as const;

type ArrRange = (typeof arrRangeOptions)[number] | '';

type LeadFormState = {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  website: string;
  arrRange: ArrRange;
  selectedProjectAreas: PublicProjectArea[];
  message: string;
  websiteUrl: string;
};

type LeadFormProps = {
  heading?: string;
  intro?: string;
  submitLabel?: string;
  preselectedProjectAreas?: PublicProjectArea[];
};

const defaultState: LeadFormState = {
  name: '',
  email: '',
  businessName: '',
  phone: '',
  website: '',
  arrRange: '',
  selectedProjectAreas: [],
  message: '',
  websiteUrl: '',
};

function normalizeProjectArea(selectedProjectAreas: PublicProjectArea[]): NormalizedProjectArea | '' {
  if (selectedProjectAreas.length === publicProjectAreas.length) {
    return 'End-to-End Rebuild';
  }

  return selectedProjectAreas[0] ?? '';
}

export default function LeadForm({
  heading = 'Tell us about your business',
  intro = 'Share the basics first. Once we have your intake, you can book a call if you want to move faster.',
  submitLabel = 'Request a consultation',
  preselectedProjectAreas = [],
}: LeadFormProps) {
  const [state, setState] = useState<LeadFormState>({
    ...defaultState,
    selectedProjectAreas: preselectedProjectAreas,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setState((current) => ({
      ...current,
      selectedProjectAreas: preselectedProjectAreas,
    }));
  }, [preselectedProjectAreas]);

  const normalizedProjectArea = useMemo(
    () => normalizeProjectArea(state.selectedProjectAreas),
    [state.selectedProjectAreas],
  );

  function toggleProjectArea(area: PublicProjectArea) {
    setState((current) => {
      const nextAreas = current.selectedProjectAreas.includes(area)
        ? current.selectedProjectAreas.filter((item) => item !== area)
        : [...current.selectedProjectAreas, area];

      return {
        ...current,
        selectedProjectAreas: nextAreas,
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitInternalForm('/api/contact-lead', {
      name: state.name.trim(),
      email: state.email.trim(),
      company: state.businessName.trim(),
      phone: state.phone.trim(),
      website: state.website.trim(),
      arrRange: state.arrRange,
      projectAreas: state.selectedProjectAreas,
      inquiryType: normalizedProjectArea || 'General inquiry',
      normalizedProjectArea,
      message: state.message.trim(),
      websiteUrl: state.websiteUrl.trim(),
      ...getSourceMetadata({
        formType: 'lead_inquiry',
        actionType: 'lead_submission',
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit your inquiry.');
      return;
    }

    setStatus('success');
    setState({
      ...defaultState,
      selectedProjectAreas: preselectedProjectAreas,
    });
  }

  return (
    <div className="border border-black/10 bg-white p-6 md:p-7">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Lead Inquiry</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight text-black">{heading}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{intro}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Name</span>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Work email</span>
            <input
              type="email"
              name="email"
              value={state.email}
              onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="name@business.com"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Business</span>
            <input
              type="text"
              name="business_name"
              value={state.businessName}
              onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Business name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Phone</span>
            <input
              type="tel"
              name="phone"
              value={state.phone}
              onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Optional"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Website</span>
            <input
              type="url"
              name="website"
              value={state.website}
              onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="https://yourbusiness.com"
            />
          </label>
          <label className="hidden">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Leave this field empty</span>
            <input
              type="text"
              name="websiteUrl"
              tabIndex={-1}
              autoComplete="off"
              value={state.websiteUrl}
              onChange={(event) => setState((current) => ({ ...current, websiteUrl: event.target.value }))}
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-neutral-800">ARR</span>
          <select
            value={state.arrRange}
            onChange={(event) => setState((current) => ({ ...current, arrRange: event.target.value as ArrRange }))}
            className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black"
          >
            <option value="">Select ARR range</option>
            {arrRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="block">
          <legend className="mb-2 block text-sm font-medium text-neutral-800">Project area</legend>
          <p className="mb-3 text-xs leading-5 text-neutral-500">
            Select one or more areas. Selecting all three maps to End-to-End Rebuild.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {publicProjectAreas.map((area) => {
              const isSelected = state.selectedProjectAreas.includes(area);
              return (
                <label
                  key={area}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                    isSelected ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-neutral-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProjectArea(area)}
                    className="sr-only"
                  />
                  <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                  <span>{area}</span>
                </label>
              );
            })}
          </div>
          {normalizedProjectArea === 'End-to-End Rebuild' ? (
            <p className="mt-3 text-xs leading-5 text-neutral-600">Normalized intake: End-to-End Rebuild</p>
          ) : null}
        </fieldset>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-neutral-800">What do you need help with?</span>
          <textarea
            name="message"
            value={state.message}
            onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            required
            rows={5}
            className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
            placeholder="Share the business, problem, timing, and what a good outcome looks like."
          />
        </label>

        {status === 'success' ? (
          <div className="space-y-3 border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
            <p className="text-sm text-emerald-700">
              Inquiry received. We will follow up using the email you submitted.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-emerald-800/80">
                Want to move faster? Book a call as the next step.
              </p>
              <button
                type="button"
                onClick={openCalendly}
                className="inline-flex items-center justify-center gap-2 border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-700 hover:text-white"
              >
                Book a call
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
        {status === 'error' ? (
          <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-black/10 pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-5 text-neutral-500">
            This is the primary intake flow for prospective businesses. Booking is offered after submission as a follow-on option.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting' || state.selectedProjectAreas.length === 0}
            className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Submitting...' : submitLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
