import type { ProjectTag } from '../content/projectPipeline';

type ProjectTagPillProps = {
  key?: string;
  tag: ProjectTag;
  tone?: 'light' | 'dark';
};

function getClasses(tier: ProjectTag['tier'], tone: 'light' | 'dark'): string {
  if (tone === 'dark') {
    if (tier === 1) {
      return 'border-white bg-white text-black';
    }
    if (tier === 2) {
      return 'border-white/30 bg-white/15 text-white';
    }
    return 'border-white/15 bg-white/5 text-neutral-300';
  }

  if (tier === 1) {
    return 'border-black bg-black text-white';
  }
  if (tier === 2) {
    return 'border-neutral-700 bg-neutral-700 text-white';
  }
  return 'border-neutral-200 bg-neutral-50 text-neutral-600';
}

export default function ProjectTagPill({ tag, tone = 'light' }: ProjectTagPillProps) {
  return (
    <span
      className={`rounded-sm border px-2 py-1 text-xs transition-colors ${getClasses(tag.tier, tone)}`}
      data-tag-tier={tag.tier}
    >
      {tag.label}
    </span>
  );
}
