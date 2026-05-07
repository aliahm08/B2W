import { Link } from 'react-router-dom';
import { B2WVectorMark } from './BrandVectorMarks';

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
  return (
    <Link
      to={to}
      aria-label={label}
      className={`b2w-logo-link inline-flex items-center overflow-visible text-black ${className}`.trim()}
    >
      <B2WVectorMark title="" className="h-10 w-12 shrink-0 overflow-visible md:h-12 md:w-14" />
      <span aria-hidden="true" className="b2w-logo-wordmark-shell pr-1 md:pr-2">
        <span className="b2w-wordmark inline-block text-xl font-medium tracking-[-0.09em] [transform:scaleY(0.94)] md:text-2xl">
          B2W
        </span>
      </span>
    </Link>
  );
}
