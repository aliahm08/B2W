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
  const logoPath = 'M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z';
  const rotations = [-16, -11, -7, -3, 2, 6, 10, 15];
  const opacities = [0.12, 0.18, 0.26, 0.35, 0.47, 0.61, 0.74, 0.88];

  return (
    <Link to={to} aria-label={label} className={`inline-flex items-center ${className}`.trim()}>
      <svg
        viewBox="0 0 96 96"
        className="h-10 w-12 overflow-visible md:h-12 md:w-14"
      >
        {rotations.map((rotation, index) => (
          <path
            key={rotation}
            d={logoPath}
            fill="#000000"
            fillOpacity={opacities[index]}
            transform={`rotate(${rotation} 48 48)`}
          />
        ))}
      </svg>
    </Link>
  );
}
