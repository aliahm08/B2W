import { useState, type FormEvent } from 'react';
import { getSourceMetadata, submitInternalForm } from '../../lib/engagement';
import { FormStatus, FormTemplate } from './FormTemplate';

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
    <FormTemplate
      eyebrow="Client Communication"
      title={title}
      intro={intro}
      onSubmit={handleSubmit}
      footerNote="This routes through the client submission flow and is separate from public lead booking."
      submitLabel="Send to B2W"
      submittingLabel="Sending..."
      submitDisabled={status === 'submitting'}
      isSubmitting={status === 'submitting'}
    >
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

        <FormStatus
          status={status}
          errorMessage={errorMessage}
          successContent={<p className="text-sm text-emerald-700">Message sent. B2W will reply to the email you submitted.</p>}
        />
    </FormTemplate>
  );
}
