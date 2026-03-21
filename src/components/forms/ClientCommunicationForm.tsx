import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { getSourceMetadata, submitInternalForm } from '../../lib/engagement';

type ClientCommunicationFormProps = {
  clientName: string;
  projectName: string;
  actionType?: string;
  title?: string;
  intro?: string;
};

type ClientCommunicationState = {
  clientName: string;
  clientEmail: string;
  company: string;
  message: string;
  faxNumber: string;
};

export default function ClientCommunicationForm({
  clientName,
  projectName,
  actionType = 'client_message',
  title = 'Client Communication',
  intro = 'Use this form for comments, requested edits, or next-step questions related to this proposal or portal.',
}: ClientCommunicationFormProps) {
  const [state, setState] = useState<ClientCommunicationState>({
    clientName,
    clientEmail: '',
    company: '',
    message: '',
    faxNumber: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const result = await submitInternalForm('/api/client-communication', {
      clientName: state.clientName.trim(),
      clientEmail: state.clientEmail.trim(),
      company: state.company.trim(),
      message: state.message.trim(),
      projectName,
      messageCategory: actionType,
      faxNumber: state.faxNumber.trim(),
      ...getSourceMetadata({
        formType: 'client_communication',
        actionType,
      }),
    });

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error ?? 'Unable to send your message.');
      return;
    }

    setStatus('success');
    setState((current) => ({ ...current, clientEmail: '', company: '', message: '', faxNumber: '' }));
  }

  return (
    <section className="border border-neutral-200 bg-white p-6">
      <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500">Client Communication</p>
      <h3 className="mt-3 text-2xl font-medium tracking-tight text-black">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{intro}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Client name</span>
            <input
              type="text"
              value={state.clientName}
              onChange={(event) => setState((current) => ({ ...current, clientName: event.target.value }))}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Email</span>
            <input
              type="email"
              value={state.clientEmail}
              onChange={(event) => setState((current) => ({ ...current, clientEmail: event.target.value }))}
              required
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="name@company.com"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Company</span>
            <input
              type="text"
              value={state.company}
              onChange={(event) => setState((current) => ({ ...current, company: event.target.value }))}
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
              placeholder="Company name"
            />
          </label>
          <label className="hidden">
            <span className="mb-2 block text-sm font-medium text-neutral-800">Leave this field empty</span>
            <input
              type="text"
              value={state.faxNumber}
              onChange={(event) => setState((current) => ({ ...current, faxNumber: event.target.value }))}
              tabIndex={-1}
              autoComplete="off"
              className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-neutral-800">Message</span>
          <textarea
            value={state.message}
            onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            required
            rows={5}
            className="w-full border border-black/10 px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
            placeholder="Share feedback, requested changes, approvals needed, or scheduling constraints."
          />
        </label>

        {status === 'success' ? (
          <p className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            Message sent. B2W will reply to the email you submitted.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-black/10 pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-5 text-neutral-500">
            This routes through the client submission flow and is separate from public lead booking.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Sending...' : 'Send to B2W'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
}
