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
  const primaryCtaTarget = hero.primaryCtaHref.replace('#capabilities', '#expertise');
  const primaryCtaHref = resolveAnchorTarget(basePath, primaryCtaTarget);
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
    <section id="landing-hero" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(232,238,233,0.9),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(241,232,212,0.56),transparent_22%),linear-gradient(180deg,#ffffff_0%,#faf8f2_44%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent)]" />

      <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-18 pt-20 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center lg:min-h-[calc(100vh-5rem)]"
        >
          <div className="max-w-4xl">
            {showOfferBanner ? (
              <div className="mb-6">
                <OfferBanner variant="hero" onClick={onOfferClick} onClose={onOfferClose} />
              </div>
            ) : null}

            <h1 className="mb-8 text-5xl font-medium leading-[0.92] tracking-tight text-neutral-950 md:text-7xl lg:text-[5.5rem]">
              {hero.headline}
            </h1>
            <p className="mb-12 max-w-3xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
              {hero.subheadline}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={primaryCtaHref}
                onClick={handleAnchorClick(primaryCtaHref)}
                className="inline-flex min-h-12 items-center border border-black bg-black px-5 py-3 text-lg font-medium text-white transition-colors hover:bg-neutral-800"
              >
                <span>Explore Services</span>
              </Link>
              <Link
                to={contactHref}
                onClick={handleAnchorClick(contactHref)}
                className="inline-flex min-h-12 items-center border-b border-black px-5 py-3 text-lg font-medium text-black transition-colors hover:text-neutral-600"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
