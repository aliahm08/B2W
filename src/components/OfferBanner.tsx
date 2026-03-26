import { X } from 'lucide-react';

type OfferBannerProps = {
  compact?: boolean;
  onClick?: () => void;
  onClose?: () => void;
};

export default function OfferBanner({ compact = false, onClick, onClose }: OfferBannerProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 border border-amber-300 bg-amber-50 text-amber-950 ${
        compact ? 'px-3 py-2' : 'px-4 py-3'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-w-0 items-center gap-2 text-left"
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-800 md:hidden">Offer</span>
        <span className="hidden text-[11px] font-mono uppercase tracking-[0.22em] text-amber-800 md:inline">Offer</span>
        <span className={`hidden whitespace-nowrap font-medium text-amber-950 md:inline ${compact ? 'text-xs' : 'text-sm'}`}>
          Next 3 Clients Receive 80% off
        </span>
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss offer"
        className="inline-flex h-5 w-5 items-center justify-center text-amber-800 transition-colors hover:text-amber-950"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
