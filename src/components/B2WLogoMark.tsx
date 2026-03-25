import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type B2WLogoMarkProps = {
  to?: string;
  className?: string;
  label?: string;
};

export default function B2WLogoMark({
  to = '/',
  className = '',
  label = 'B2W home',
}: B2WLogoMarkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'reverse'>('forward');
  const logoPath = 'M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z';
  const baseOpacity = 0.93;
  const animatedRotations = [-28, -20, -12, -5, 6, 14, 22];
  const animatedOpacities = [0.12, 0.18, 0.26, 0.35, 0.47, 0.61, 0.74];
  const totalSteps = animatedRotations.length * 2;
  const cycleDuration = 7.2;

  return (
    <Link
      to={to}
      aria-label={label}
      className={`inline-flex items-center overflow-visible text-black ${className}`.trim()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setAnimationDirection('reverse');
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => {
        setIsHovered(false);
        setAnimationDirection('reverse');
      }}
    >
      <motion.svg
        viewBox="0 0 96 96"
        className="h-10 w-12 shrink-0 overflow-visible md:h-12 md:w-14"
        initial={false}
      >
        <path d={logoPath} fill="currentColor" fillOpacity={baseOpacity} />
        {animatedRotations.map((rotation, index) => {
          const forwardFadeInStart = index / totalSteps;
          const forwardFadeInEnd = (index + 1) / totalSteps;
          const forwardFadeOutStart = (totalSteps - 1 - index) / totalSteps;
          const forwardFadeOutEnd = (totalSteps - index) / totalSteps;
          const reverseFadeInStart = (animatedRotations.length - 1 - index) / totalSteps;
          const reverseFadeInEnd = (animatedRotations.length - index) / totalSteps;
          const reverseFadeOutStart = (animatedRotations.length + index) / totalSteps;
          const reverseFadeOutEnd = (animatedRotations.length + index + 1) / totalSteps;
          const passiveTimes =
            animationDirection === 'reverse'
              ? [0, reverseFadeInStart, reverseFadeInEnd, reverseFadeOutStart, reverseFadeOutEnd]
              : [0, forwardFadeInStart, forwardFadeInEnd, forwardFadeOutStart, forwardFadeOutEnd];

          return (
            <motion.path
              key={rotation}
              d={logoPath}
              fill="currentColor"
              fillOpacity={animatedOpacities[index]}
              initial={false}
              animate={isHovered ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
              transition={
                isHovered
                  ? { duration: 0.54, ease: [0.22, 1, 0.36, 1] }
                  : {
                      duration: cycleDuration,
                      ease: 'linear',
                      repeat: Infinity,
                      times: passiveTimes,
                    }
              }
              transform={`rotate(${rotation} 48 48)`}
            />
          );
        })}
      </motion.svg>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={
          isHovered
            ? { opacity: 1, maxWidth: 88, x: 0, marginLeft: 1, paddingLeft: 0 }
            : { opacity: 0, maxWidth: 0, x: -6, marginLeft: 0, paddingLeft: 0 }
        }
        transition={
          isHovered
            ? { duration: 0.48, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.28, ease: [0.4, 0, 1, 1] }
        }
        className="inline-block overflow-hidden whitespace-nowrap pr-1 md:pr-2"
      >
        <span className="b2w-wordmark inline-block text-xl font-medium tracking-[-0.09em] [transform:scaleY(0.94)] md:text-2xl">
          B2W
        </span>
      </motion.span>
    </Link>
  );
}
