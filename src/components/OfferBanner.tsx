import { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

type OfferBannerProps = {
  compact?: boolean;
  onClick?: () => void;
  onClose?: () => void;
};

export default function OfferBanner({ compact = false, onClick, onClose }: OfferBannerProps) {
  const [isMobileCardOpen, setIsMobileCardOpen] = useState(false);

  const handleBannerClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileCardOpen(true);
      return;
    }

    onClick?.();
  };

  const handleMobileDismiss = () => {
    setIsMobileCardOpen(false);
    onClose?.();
  };

  return (
    <>
      <div
        className={`inline-flex items-center gap-2 border border-amber-300 bg-amber-50 text-amber-950 ${
          compact ? 'px-3 py-2' : 'px-4 py-3'
        }`}
      >
        <button
          type="button"
          onClick={handleBannerClick}
          className="inline-flex min-w-0 items-center gap-2 text-left"
          aria-label="Open offer"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-800">Offer</span>
          <span className={`whitespace-nowrap font-medium text-amber-950 ${compact ? 'text-xs' : 'text-sm'}`}>
            Next 3 Clients Receive 80% off
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-amber-800 md:hidden" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss offer"
          className="hidden h-5 w-5 items-center justify-center text-amber-800 transition-colors hover:text-amber-950 md:inline-flex"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {isMobileCardOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/45 p-4 md:hidden">
          <div className="w-full rounded-[1.6rem] border border-amber-200 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-700">Limited Offer</p>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-neutral-950">
                  Next 3 clients receive 80% off their first month.
                </h3>
              </div>
              <button
                type="button"
                onClick={handleMobileDismiss}
                aria-label="Dismiss offer"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              Start with a discounted engagement while spots remain. Tap below to continue to the next step.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsMobileCardOpen(false);
                onClick?.();
              }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
            >
              <span>Claim offer</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
