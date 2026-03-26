import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type B2WLogoMarkProps = {
  to?: string;
  className?: string;
  label?: string;
};

const logoPath = 'M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z';
const baseOpacity = 0.93;
const animatedRotations = [-28, -20, -12, -5, 6, 14, 22];
const animatedOpacities = [0.12, 0.18, 0.26, 0.35, 0.47, 0.61, 0.74];
const layerDurationSeconds = 7.2;
const layerDelayStepSeconds = 0.34;

export default function B2WLogoMark({
  to = '/',
  className = '',
  label = 'B2W home',
}: B2WLogoMarkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`b2w-logo-link inline-flex items-center overflow-visible text-black ${className}`.trim()}
    >
      <svg viewBox="0 0 96 96" className="h-10 w-12 shrink-0 overflow-visible md:h-12 md:w-14">
        <path d={logoPath} fill="currentColor" fillOpacity={baseOpacity} />
        {animatedRotations.map((rotation, index) => {
          const layerStyle = {
            animationDelay: `${index * layerDelayStepSeconds}s`,
            animationDuration: `${layerDurationSeconds}s`,
          } as CSSProperties;

          return (
            <path
              key={rotation}
              d={logoPath}
              fill="currentColor"
              fillOpacity={animatedOpacities[index]}
              className="b2w-logo-layer"
              style={layerStyle}
              transform={`rotate(${rotation} 48 48)`}
            />
          );
        })}
      </svg>
      <span aria-hidden="true" className="b2w-logo-wordmark-shell pr-1 md:pr-2">
        <span className="b2w-wordmark inline-block text-xl font-medium tracking-[-0.09em] [transform:scaleY(0.94)] md:text-2xl">
          B2W
        </span>
      </span>
    </Link>
  );
}
