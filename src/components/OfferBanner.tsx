import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

type OfferBannerProps = {
  compact?: boolean;
  variant?: 'default' | 'hero';
  onClick?: () => void;
  onClose?: () => void;
};

export const OFFER_BANNER_LABEL = 'Next 3 Clients Receive 80% off';
export const OFFER_BANNER_HEADLINE = 'Next 3 clients receive 80% off their first month.';

export default function OfferBanner({
  compact = false,
  variant = 'default',
  onClick,
  onClose,
}: OfferBannerProps) {
  const [isMobileCardOpen, setIsMobileCardOpen] = useState(false);
  const isHeroVariant = variant === 'hero';

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
        className={
          isHeroVariant
            ? 'flex w-full max-w-full items-center gap-2 rounded-[1.25rem] border border-neutral-200/80 bg-white/78 px-3 py-2 text-neutral-950 shadow-[0_12px_30px_rgba(16,24,40,0.05)] backdrop-blur-sm sm:inline-flex sm:w-auto sm:gap-3 sm:rounded-full sm:px-4'
            : `inline-flex items-center gap-2 border border-amber-300 bg-amber-50 text-amber-950 ${
                compact ? 'px-3 py-2' : 'px-4 py-3'
              }`
        }
      >
        <button
          type="button"
          onClick={handleBannerClick}
          className="inline-flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-label="Open offer"
        >
          <span
            className={
              isHeroVariant
                ? 'inline-flex shrink-0 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-500 sm:tracking-[0.28em]'
                : 'text-[11px] font-mono uppercase tracking-[0.22em] text-amber-800'
            }
          >
            {isHeroVariant ? (
              <>
                <motion.span
                  className="h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_0_4px_rgba(20,184,166,0.14)]"
                  animate={{ opacity: [0.45, 1, 0.45], scale: [0.96, 1.08, 0.96] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span>Offer</span>
              </>
            ) : (
              'Offer'
            )}
          </span>
          <span
            className={
              isHeroVariant
                ? 'min-w-0 text-[10px] font-medium uppercase leading-[1.35] tracking-[0.16em] text-neutral-700 sm:whitespace-nowrap sm:tracking-[0.28em]'
                : `whitespace-nowrap font-medium text-amber-950 ${compact ? 'text-xs' : 'text-sm'}`
            }
          >
            {OFFER_BANNER_LABEL}
          </span>
          <ArrowUpRight className={`h-3.5 w-3.5 shrink-0 md:hidden ${isHeroVariant ? 'text-neutral-500' : 'text-amber-800'}`} />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss offer"
          className={`hidden h-5 w-5 shrink-0 items-center justify-center transition-colors md:inline-flex ${
            isHeroVariant ? 'text-neutral-500 hover:text-neutral-950' : 'text-amber-800 hover:text-amber-950'
          }`}
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
                <h3 className="mt-2 text-xl font-medium tracking-tight text-neutral-950">{OFFER_BANNER_HEADLINE}</h3>
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
