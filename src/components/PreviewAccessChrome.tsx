import type { FormEventHandler } from 'react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';

type PreviewAccessChromeProps = {
  returnPath: string;
  previewLabel: string;
  previewMessage: string;
  unlockLabel: string;
  passwordPlaceholder: string;
  passwordValue: string;
  onPasswordChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  error?: string;
};

export default function PreviewAccessChrome({
  returnPath,
  previewLabel,
  previewMessage,
  unlockLabel,
  passwordPlaceholder,
  passwordValue,
  onPasswordChange,
  onSubmit,
  isSubmitting,
  error,
}: PreviewAccessChromeProps) {
  return (
    <>
      <div className="fixed inset-x-0 top-20 z-40 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border border-neutral-900 bg-white/95 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Preview Mode</p>
            <p className="mt-1 text-sm text-neutral-700">{previewMessage}</p>
          </div>
          <Link
            to={returnPath}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:border-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Proposal
          </Link>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 sm:px-6">
        <div className="pointer-events-auto w-full max-w-5xl border border-neutral-900 bg-neutral-950 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-400">Unlock Full Access</p>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {previewLabel} stays partially blurred and all page CTAs remain disabled until the password is entered.
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 lg:max-w-xl lg:flex-row lg:items-center">
              <input
                type="password"
                value={passwordValue}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder={passwordPlaceholder}
                autoComplete="current-password"
                className="min-w-0 flex-1 border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-white/40"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockKeyhole className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Unlocking...' : unlockLabel}
              </button>
              <Link
                to={returnPath}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/40"
              >
                Back to Proposal
              </Link>
            </form>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        </div>
      </div>
    </>
  );
}
