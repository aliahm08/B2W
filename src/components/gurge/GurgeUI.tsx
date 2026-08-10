import type { ReactNode } from 'react';
import GurgeIcon, { type GurgeIconName } from './GurgeIcon';

export type GurgeTone = 'green' | 'gold' | 'red' | 'neutral';

const toneStyles: Record<GurgeTone, string> = {
  green: 'bg-[#4F7F52] text-white',
  gold: 'bg-[#D8B536] text-[#171717]',
  red: 'bg-[#C63D2F] text-white',
  neutral: 'bg-neutral-950 text-white',
};

export function GurgeStatusBadge({ children, tone = 'green' }: { children: ReactNode; tone?: GurgeTone }) {
  return (
    <span className={`inline-flex min-h-7 items-center gap-2 rounded-full px-3 text-[9px] font-semibold uppercase tracking-[0.14em] ${toneStyles[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function GurgeIconTile({
  icon,
  inverse = false,
  solid = false,
  className = '',
}: {
  icon: GurgeIconName;
  inverse?: boolean;
  solid?: boolean;
  className?: string;
}) {
  const surfaceClass = solid
    ? 'border-neutral-950 bg-neutral-950 text-white'
    : inverse
      ? 'border-white/15 bg-white/5 text-white'
      : 'border-neutral-200 bg-white text-neutral-700';

  return (
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border ${surfaceClass} ${className}`}>
      <GurgeIcon name={icon} className="h-[18px] w-[18px]" />
    </span>
  );
}

export function GurgeMetricCell({
  label,
  value,
  tone = 'green',
  className = '',
}: {
  label: string;
  value: ReactNode;
  tone?: Exclude<GurgeTone, 'neutral'>;
  className?: string;
}) {
  const dotStyles = {
    green: 'bg-[#4F7F52]',
    gold: 'bg-[#D8B536]',
    red: 'bg-[#C63D2F]',
  } as const;

  return (
    <div className={`p-4 ${className}`}>
      <span className={`block h-2 w-2 rounded-full ${dotStyles[tone]}`} />
      <p className="mt-4 font-mono text-2xl text-current">{value}</p>
      <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-neutral-400">{label}</p>
    </div>
  );
}

export const gurgeSurface = {
  canvas: 'bg-[#FAFAF8] text-black',
  panel: 'border border-neutral-200 bg-white',
  inversePanel: 'border border-neutral-800 bg-neutral-950 text-white',
  eyebrow: 'font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400',
} as const;
