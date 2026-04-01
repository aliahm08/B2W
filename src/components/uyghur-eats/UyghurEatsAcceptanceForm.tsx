import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { getSourceMetadata, submitInternalForm } from '../../lib/engagement';

type UyghurEatsAcceptanceFormState = {
  clientName: string;
  representative: string;
  email: string;
  phone: string;
  signature: string;
  comments: string;
  acceptedTerms: boolean;
  companyWebsite: string;
};

export default function UyghurEatsAcceptanceForm() {
  const [state, setState] = useState<UyghurEatsAcceptanceFormState>({
    clientName: '',
    representative: '',
    email: '',
    phone: '',
    signature: '',
    comments: '',
    acceptedTerms: false,
    companyWebsite: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'warning' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const notes = [
      state.phone.trim() ? `Phone: ${state.phone.trim()}` : '',
      state.comments.trim() ? `Comments: ${state.comments.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const result = await submitInternalForm('/api/proposal-signature', {
      signerName: state.representative.trim(),
      signerEmail: state.email.trim(),
      company: state.clientName.trim(),
      proposalName: 'Business Sale Preparation & Opportunity Packaging',
      proposalId: 'uyghur-eats-strategic-exit',
      proposalUrl: typeof window !== 'undefined' ? window.location.href : '/client/uyghur-eats',
      selectedOptionId: 'uyghur-eats-strategic-exit',
      selectedOptionTitle: 'Business Sale Preparation & Opportunity Packaging',
      selectedOptionPrice: '$4K - $7.5K',
      actionTaken: 'proposal_acceptance',
      notes,
      acceptedTerms: state.acceptedTerms,
      signatureName: state.signature.trim(),
      signatureDataUrl: '',
      companyWebsite: state.companyWebsite.trim(),
      ...getSourceMetadata({
        formType: 'proposal_acceptance',
        actionType: 'proposal_acceptance',
        sourcePage: 'Uyghur Eats proposal acceptance',
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to submit the proposal acceptance.');
      return;
    }

    if (result.warning) {
      setStatus('warning');
      setErrorMessage(result.warning);
      return;
    }

    setStatus('success');
    setState({
      clientName: '',
      representative: '',
      email: '',
      phone: '',
      signature: '',
      comments: '',
      acceptedTerms: false,
      companyWebsite: '',
    });
  }

  return (
    <div className="border border-neutral-900 bg-neutral-950 p-6 text-white md:p-8">
      <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em] text-neutral-400">Accept Proposal</p>
      <h2 className="max-w-2xl text-2xl font-medium tracking-tight md:text-3xl">
        Begin Your Journey With B2W.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 md:text-base">
        This is a non-binding agreement. We will send you a full contract upon acceptance of this proposal.
      </p>

      {status === 'success' ? (
        <div className="mt-6 border border-emerald-400/30 bg-emerald-400/10 p-5">
          <p className="text-sm font-medium text-emerald-200">Proposal acceptance received.</p>
          <p className="mt-2 text-sm leading-6 text-emerald-50/90">
            We sent the submission through the internal workflow and a receipt should go to the email you entered.
          </p>
        </div>
      ) : status === 'warning' ? (
        <div className="mt-6 border border-amber-400/30 bg-amber-400/10 p-5">
          <p className="text-sm font-medium text-amber-100">Submission recorded with follow-up warning.</p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">
            The acceptance reached the API, but downstream delivery was not fully confirmed. Do not assume the receipt email or inbox notification was delivered yet.
          </p>
          <p className="mt-3 text-sm leading-6 text-amber-50/90">{errorMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white">Business / Client Name</span>
              <input
                type="text"
                value={state.clientName}
                onChange={(event) => setState((current) => ({ ...current, clientName: event.target.value }))}
                required
                className="w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/40"
                placeholder="Uyghur Eats or legal entity"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white">Authorized Representative</span>
              <input
                type="text"
                value={state.representative}
                onChange={(event) => setState((current) => ({ ...current, representative: event.target.value }))}
                required
                className="w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/40"
                placeholder="Full name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white">Email</span>
              <input
                type="email"
                value={state.email}
                onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
                required
                autoComplete="email"
                className="w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/40"
                placeholder="name@company.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white">Phone</span>
              <input
                type="tel"
                value={state.phone}
                onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
                className="w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/40"
                placeholder="Optional"
              />
            </label>
          </div>

          <label className="hidden">
            <span className="mb-2 block text-sm font-medium text-white">Leave this field empty</span>
            <input
              type="text"
              value={state.companyWebsite}
              onChange={(event) => setState((current) => ({ ...current, companyWebsite: event.target.value }))}
              tabIndex={-1}
              autoComplete="off"
              className="w-full"
            />
          </label>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm leading-6 text-neutral-300">
              By submitting this form, you are confirming your acceptance of the proposal scope, pricing, and assumptions described on this page.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Typed Signature</span>
            <input
              type="text"
              value={state.signature}
              onChange={(event) => setState((current) => ({ ...current, signature: event.target.value }))}
              required
              className="w-full border border-white/15 bg-white/5 px-4 py-3 text-lg font-serif italic text-white outline-none transition-colors focus:border-white/40"
              placeholder="Type full name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Comments</span>
            <textarea
              value={state.comments}
              onChange={(event) => setState((current) => ({ ...current, comments: event.target.value }))}
              rows={4}
              className="w-full resize-y border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-white/40"
              placeholder="Optional notes or requested follow-up."
            />
          </label>

          <label className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-4">
            <input
              type="checkbox"
              checked={state.acceptedTerms}
              onChange={(event) => setState((current) => ({ ...current, acceptedTerms: event.target.checked }))}
              required
              className="mt-1 h-4 w-4"
            />
            <span className="text-sm leading-6 text-neutral-300">
              I am authorized to accept this proposal on behalf of the client.
            </span>
          </label>

          {status === 'error' ? (
            <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{errorMessage}</p>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm leading-6 text-neutral-300">
              <p>
                Prefer not to use the form? Email <a className="text-white underline underline-offset-4" href="mailto:info@b2w-ai.com?subject=Uyghur%20Eats%20Proposal%20Acceptance">info@b2w-ai.com</a>
                {' '}or text <a className="text-white underline underline-offset-4" href="sms:2022109491">202-210-9491</a>.
              </p>
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Acceptance'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
