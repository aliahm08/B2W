import { motion } from 'motion/react';
import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { projectPipelineContent } from '../content/projectPipeline';
import { scrollToHashTarget } from '../lib/hashNavigation';
import OfferBanner from './OfferBanner';

type HeroProps = {
  basePath?: string;
  onPrimaryAction?: () => void;
  showOfferBanner?: boolean;
  onOfferClick?: () => void;
  onOfferClose?: () => void;
};

function resolveAnchorTarget(basePath: string, fallbackTarget: string) {
  const hashIndex = fallbackTarget.indexOf('#');
  const hash = hashIndex >= 0 ? fallbackTarget.slice(hashIndex) : '';
  return hash ? `${basePath}${hash}` : fallbackTarget;
}

export default function Hero({
  basePath = '/',
  onPrimaryAction,
  showOfferBanner = true,
  onOfferClick,
  onOfferClose,
}: HeroProps) {
  const { hero } = projectPipelineContent;
  const location = useLocation();
  const navigate = useNavigate();
  const primaryCtaHref = resolveAnchorTarget(basePath, hero.primaryCtaHref);
  const contactHref = `${basePath}#contact`;

  const handleAnchorClick = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = target.indexOf('#');
    const hash = hashIndex >= 0 ? target.slice(hashIndex) : '';
    if (!hash) {
      return;
    }

    event.preventDefault();

    const performScroll = () => {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash);
      });
    };

    if (location.pathname === basePath) {
      if (location.hash !== hash) {
        navigate({ pathname: basePath, hash }, { replace: false });
      }
      performScroll();
      return;
    }

    navigate({ pathname: basePath, hash }, { replace: false });
    window.setTimeout(performScroll, 180);
  };

  return (
    <section id="landing-hero" className="min-h-screen flex flex-col justify-center px-6 max-w-7xl mx-auto pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        {showOfferBanner ? (
          <div className="mb-6">
            <OfferBanner onClick={onOfferClick} onClose={onOfferClose} />
          </div>
        ) : null}
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 leading-[0.9]">
          {hero.headline}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl leading-relaxed mb-12">
          {hero.subheadline}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to={primaryCtaHref}
            onClick={(event) => {
              if (onPrimaryAction) {
                event.preventDefault();
                onPrimaryAction();
                return;
              }
              handleAnchorClick(primaryCtaHref)(event);
            }}
            className="inline-flex min-h-12 items-center border border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:bg-black hover:text-white"
          >
            <span>{hero.primaryCtaLabel}</span>
          </Link>
          <Link
            to={contactHref}
            onClick={handleAnchorClick(contactHref)}
            className="inline-flex min-h-12 items-center border-b border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:text-neutral-600"
          >
            <span>Tell us about your business</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
