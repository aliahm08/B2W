import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { getSourceMetadata, openCalendly, submitInternalForm } from '../../lib/engagement';
import { FormStatus, FormTemplate } from './FormTemplate';

export const publicProjectAreas = ['Marketing', 'Financials', 'Ops Performance'] as const;
export type PublicProjectArea = (typeof publicProjectAreas)[number];
export type NormalizedProjectArea = PublicProjectArea;

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
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
  phone: '',
  businessName: '',
  selectedProjectAreas: [],
  message: '',
  websiteUrl: '',
};

function normalizeProjectArea(selectedProjectAreas: PublicProjectArea[]): NormalizedProjectArea | '' {
  return selectedProjectAreas[0] ?? '';
}

const EMPTY_ARRAY: PublicProjectArea[] = [];
const publicProjectAreaOptions: Array<{ area: PublicProjectArea; description: string }> = [
  {
    area: 'Marketing',
    description: 'Ads, campaigns, CRM activity, reviews, website analytics, and demand generation signals.',
  },
  {
    area: 'Financials',
    description: 'Revenue, margins, forecasts, pricing logic, cash flow, and valuation-related records.',
  },
  {
    area: 'Ops Performance',
    description: 'Staffing, SOPs, workflows, scheduling, service logs, and execution-quality records.',
  },
];

export default function LeadForm({
  heading = 'Contact Us',
  intro = 'Share the basic first. Once we have your information, we will schedule a call with you.',
  submitLabel = 'Request a consultation',
  preselectedProjectAreas = EMPTY_ARRAY,
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
      website: '',
      arrRange: '',
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
    <FormTemplate
      eyebrow="Contact Us"
      title={heading}
      intro={intro}
      onSubmit={handleSubmit}
      footerNote="This is the primary intake flow for prospective businesses. Booking is offered after submission as a follow-on option."
      submitLabel={submitLabel}
      submittingLabel="Submitting..."
      submitDisabled={status === 'submitting' || state.selectedProjectAreas.length === 0}
      isSubmitting={status === 'submitting'}
    >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Name</span>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
              required
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="organization"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Business name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Phone Number (Optional)</span>
            <input
              type="tel"
              name="phone"
              value={state.phone}
              onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
              autoComplete="tel"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="(555) 555-5555"
            />
          </label>
        </div>

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

        <fieldset className="block">
          <legend className="mb-2 block text-sm font-medium text-neutral-800">What data does your business currently track?</legend>
          <p className="mb-3 text-xs leading-5 text-neutral-500">
            Select every data category you can provide.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {publicProjectAreaOptions.map(({ area, description }) => {
              const isSelected = state.selectedProjectAreas.includes(area);
              return (
                <div key={area} className="space-y-2">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleProjectArea(area)}
                    className={`flex w-full flex-col items-start gap-3 border px-4 py-4 text-left text-sm transition-colors ${
                      isSelected ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                      <span>{area}</span>
                    </div>
                    <span className={`text-xs leading-5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>{description}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-neutral-800">What do you need help with?</span>
          <textarea
            name="message"
            value={state.message}
            onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            required
            autoComplete="off"
            rows={5}
            className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
            placeholder="What do you want to improve, and how urgent is it?"
          />
        </label>

        <FormStatus
          status={status}
          errorMessage={errorMessage}
          successContent={
            <>
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
            </>
          }
        />
    </FormTemplate>
  );
}
