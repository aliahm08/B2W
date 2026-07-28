import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { B2WSilhouetteMark } from './BrandVectorMarks';

type B2WLogoMarkProps = {
  to?: string;
  className?: string;
  label?: string;
  variant?: 'consulting' | 'clara' | 'jasonai';
  wordmark?: string;
};

export default function B2WLogoMark({
  to = '/',
  className = '',
  label = 'B2W home',
  variant = 'consulting',
  wordmark = 'B2W',
}: B2WLogoMarkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`b2w-logo-link inline-flex items-center overflow-visible text-black ${className}`.trim()}
    >
      <span aria-hidden="true" className="relative grid h-7 w-7 shrink-0 place-items-center overflow-visible md:h-8 md:w-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={variant}
            className="absolute inset-0 grid place-items-center overflow-visible"
            initial={{ opacity: 0, scale: 0.72, rotate: -6, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.18, rotate: 6, filter: 'blur(6px)' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {variant === 'jasonai' ? (
              <B2WSilhouetteMark title="" className="h-full w-full overflow-visible" />
            ) : (
              <img
                src={variant === 'clara' ? '/brand/clara-logo-solid.png' : '/brand/clara-logo.png'}
                alt=""
                className="b2w-consulting-logo-image h-full w-full object-contain"
              />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden="true" className="b2w-logo-wordmark-shell pr-1 md:pr-2">
        <span className="b2w-wordmark inline-block text-xl font-medium tracking-[-0.09em] [transform:scaleY(0.94)] md:text-2xl">
          {wordmark}
        </span>
      </span>
    </Link>
  );
}
