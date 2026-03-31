export default function FieldBossIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="20 14 56 62"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id="fb-text-cutout">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <text 
            x="54.5" 
            y="43.5" 
            fontSize="17" 
            fontWeight="800" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fill="black" 
            textAnchor="middle" 
            letterSpacing="-0.8"
          >
            Fb
          </text>
        </mask>
      </defs>

      <line x1="48" y1="18" x2="48" y2="72" stroke="currentColor" strokeOpacity={0.22} strokeWidth={0.9} />
      <line x1="24" y1="45" x2="72" y2="45" stroke="currentColor" strokeOpacity={0.22} strokeWidth={0.9} />
      <circle cx="48" cy="45" r="18" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.8} />
      
      <path
        d="M 34 20 L 58 20 Q 76 20 76 38 L 76 60 Q 76 70 69 63 L 31 25 Q 26 20 34 20 Z"
        fill="currentColor"
        fillOpacity={0.92}
        mask="url(#fb-text-cutout)"
      />
    </svg>
  );
}
