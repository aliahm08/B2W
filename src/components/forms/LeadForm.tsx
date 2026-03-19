import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { getHostedFormEndpoint, getSourceMetadata, openCalendly, submitHostedForm } from '../../lib/engagement';

type LeadFormState = {
  name: string;
  email: string;
  businessName: string;
  message: string;
};

const initialState: LeadFormState = {
  name: '',
  email: '',
  businessName: '',
  message: '',
};

export default function LeadForm() {
  const [state, setState] = useState<LeadFormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitHostedForm(getHostedFormEndpoint('lead'), {
      name: state.name.trim(),
      email: state.email.trim(),
      business_name: state.businessName.trim(),
      message: state.message.trim(),
      _subject: `New B2W lead inquiry from ${state.businessName.trim() || state.name.trim()}`,
      ...getSourceMetadata({
        form_type: 'lead_inquiry',
        action_type: 'lead_submission',
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit your inquiry.');
      return;
    }

    setStatus('success');
    setState(initialState);
  }

  return (
    <div className="border border-black/10 bg-white p-6 md:p-7">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Lead Inquiry</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight text-black">Tell us about your business</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
          Share the basics first. Once we have your intake, you can book a call if you want to move faster.
        </p>
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
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Submitting...' : 'Request a consultation'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
