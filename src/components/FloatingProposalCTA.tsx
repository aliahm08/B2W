import { FileSignature } from 'lucide-react';

type FloatingProposalCTAProps = {
  label: string;
  detail: string;
  onClick: () => void;
  buttonLabel?: string;
};

export default function FloatingProposalCTA({
  label,
  detail,
  onClick,
  buttonLabel = 'Accept Terms and Sign',
}: FloatingProposalCTAProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col gap-4 border border-neutral-900 bg-white/96 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500">Proposal CTA</p>
          <p className="mt-2 truncate text-base font-medium text-black">{label}</p>
          <p className="mt-1 text-sm text-neutral-600">{detail}</p>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-black bg-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          <FileSignature className="h-4 w-4" />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
