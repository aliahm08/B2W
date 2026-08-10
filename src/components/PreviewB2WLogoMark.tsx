import { Link } from 'react-router-dom';

type B2WLogoMarkProps = {
  to?: string;
  className?: string;
  label?: string;
  variant?: 'consulting' | 'clara' | 'jasonai';
  wordmark?: string;
  theme?: 'light' | 'dark';
  revealWordmark?: boolean;
};

export default function B2WLogoMark({
  to = '/',
  className = '',
  label = 'B2W home',
  variant = 'consulting',
  wordmark = 'B2W',
  theme = 'light',
  revealWordmark = false,
}: B2WLogoMarkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      data-product={variant}
      className={`b2w-logo-link inline-flex min-h-10 items-center gap-2.5 rounded-md text-[var(--b2w-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--b2w-gold)] focus-visible:ring-offset-2 ${theme === 'dark' ? 'text-white' : ''} ${className}`.trim()}
    >
      <span aria-hidden="true" className="relative grid h-8 w-8 shrink-0 place-items-center">
        <img
          src="/brand/clara-logo.png"
          alt=""
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 ${theme === 'dark' ? 'invert' : ''}`}
        />
        {variant === 'jasonai' ? <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-current bg-[var(--b2w-rust)]" /> : null}
      </span>
      <span aria-hidden="true" className={`b2w-wordmark overflow-hidden whitespace-nowrap text-xl font-semibold tracking-[-0.055em] transition-[max-width,opacity,transform] duration-300 ${revealWordmark ? 'max-w-0 -translate-x-1 opacity-0 group-hover:max-w-20 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:max-w-20 group-focus-visible:translate-x-0 group-focus-visible:opacity-100' : ''}`}>
        {wordmark}
      </span>
    </Link>
  );
}
