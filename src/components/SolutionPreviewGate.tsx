import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSourceMetadata, openCalendly, submitInternalForm } from '../lib/engagement';
import type { PublicProjectArea } from './forms/LeadForm';

type SolutionPreviewGateProps = {
  isOpen: boolean;
  onClose: () => void;
  solutionName: string;
  previewPath: string;
  projectAreas: PublicProjectArea[];
  inquiryType: string;
};

const defaultState = {
  name: '',
  email: '',
  businessName: '',
  websiteUrl: '',
};

export default function SolutionPreviewGate({
  isOpen,
  onClose,
  solutionName,
  previewPath,
  projectAreas,
  inquiryType,
}: SolutionPreviewGateProps) {
  const navigate = useNavigate();
  const [state, setState] = useState(defaultState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setState(defaultState);
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('submitting');
    setErrorMessage('');

    const result = await submitInternalForm('/api/contact-lead', {
      name: state.name.trim(),
      email: state.email.trim(),
      company: state.businessName.trim(),
      phone: '',
      website: '',
      arrRange: '',
      projectAreas,
      inquiryType,
      normalizedProjectArea: inquiryType,
      message: `Requested preview access for ${solutionName}. Preview route: ${previewPath}.`,
      websiteUrl: state.websiteUrl.trim(),
      ...getSourceMetadata({
        formType: 'kitchen_preview_access',
        actionType: 'kitchen_preview_access',
        sourcePage: `Kitchen by B2W preview access: ${solutionName}`,
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to unlock the preview right now.');
      return;
    }

    setStatus('success');
  }

  function handleViewPreview() {
    onClose();
    navigate(previewPath);
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="relative max-h-full w-full max-w-2xl overflow-auto border border-white/10 bg-white p-6 text-black shadow-[0_28px_90px_rgba(0,0,0,0.32)] md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-black/10 text-neutral-500 transition-colors hover:border-black hover:text-black"
          aria-label="Close preview access form"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Preview Access</p>
        <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-tight text-neutral-950">{solutionName}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">
          Enter your contact information to open the preview proposal. After submission you can continue to the preview and schedule a call.
        </p>

        {status === 'success' ? (
          <div className="mt-8 space-y-4 border border-emerald-500/30 bg-emerald-500/10 p-5">
            <p className="text-sm text-emerald-800">Preview access has been recorded.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleViewPreview}
                className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                View preview proposal
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openCalendly}
                className="inline-flex items-center justify-center gap-2 border border-black/15 px-5 py-3 text-sm font-medium text-black transition-colors hover:border-black"
              >
                Schedule a call
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-neutral-800">Name</span>
                <input
                  type="text"
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
                  value={state.email}
                  onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
                  required
                  autoComplete="email"
                  className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                  placeholder="name@business.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-neutral-800">Business</span>
              <input
                type="text"
                value={state.businessName}
                onChange={(event) => setState((current) => ({ ...current, businessName: event.target.value }))}
                required
                autoComplete="organization"
                className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                placeholder="Business name"
              />
            </label>

            <label className="hidden">
              <span className="mb-2 block text-sm font-medium text-neutral-800">Leave this field empty</span>
              <input
                type="text"
                value={state.websiteUrl}
                onChange={(event) => setState((current) => ({ ...current, websiteUrl: event.target.value }))}
                tabIndex={-1}
                autoComplete="off"
                className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none"
              />
            </label>

            {status === 'error' ? (
              <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-neutral-500">
                This records the solution preview request so B2W can follow up directly.
              </p>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === 'submitting' ? 'Submitting...' : 'Unlock preview'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
