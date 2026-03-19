import type { Category, ExpertiseCell, Tier } from '../content/expertiseData';

export function getExpertiseMetricLabel(category: Category): string {
  return category === 'Optimization' ? 'Value' : 'Pricing';
}

export function getExpertiseBookingLabel(category: Category, tier: Tier, cell: ExpertiseCell): string {
  return `${category} ${tier}: ${cell.deliverable}`;
}
