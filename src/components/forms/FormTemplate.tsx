import type { FormEvent, ReactNode } from 'react';

type FormTemplateProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  footerNote: string;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
};

type FormStatusProps = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  successContent: ReactNode;
  errorMessage: string;
};

export function FormTemplate({
  eyebrow,
  title,
  intro,
  children,
  footerNote,
  submitLabel,
  submittingLabel,
  onSubmit,
  submitDisabled = false,
  isSubmitting = false,
}: FormTemplateProps) {
  return (
    <section className="border border-black/10 bg-white p-5 sm:p-6 md:p-7">
      <div className="mb-6">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">{eyebrow}</p>
        <h3 className="mt-3 max-w-2xl text-2xl font-medium tracking-tight text-neutral-950 sm:text-[1.9rem]">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
          {intro}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {children}

        <div className="flex flex-col gap-3 border-t border-black/10 pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-5 text-neutral-500">{footerNote}</p>
          <button
            type="submit"
            disabled={submitDisabled}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}

export function FormStatus({ status, successContent, errorMessage }: FormStatusProps) {
  if (status === 'success') {
    return <div className="space-y-3 border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">{successContent}</div>;
  }

  if (status === 'error') {
    return <p className="border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-700">{errorMessage}</p>;
  }

  return null;
}
