import type { ProjectTag } from './projectPipeline';

export type ProjectShowcaseOverride = {
  publicTitle: string;
  publicClientDescription: string;
  publicDescription: string;
  publicImpact: string;
  tags: ProjectTag[];
};

export const projectShowcaseOverridesByPath: Record<string, ProjectShowcaseOverride> = {
  '/borek-g': {
    publicTitle: 'Neighborhood Restaurant Marketing Profile',
    publicClientDescription: 'Independent restaurant in a high-traffic suburban market',
    publicDescription: 'Restaurant marketing profile covering public reputation, Instagram opportunity, search visibility, and conversion opportunities across the website and owned channels.',
    publicImpact: 'Clearer digital demand capture plan',
    tags: [
      { label: 'Profile', tier: 1 },
      { label: 'Instagram', tier: 2 },
      { label: 'SEO', tier: 3 },
      { label: 'Web Design', tier: 3 },
    ],
  },
  '/borek-g-operations': {
    publicTitle: 'Restaurant Marketing Proposal',
    publicClientDescription: 'Independent restaurant with strong local demand and underused digital channels',
    publicDescription: 'Marketing proposal covering channel strategy, content cadence, local discovery improvements, and digital demand capture.',
    publicImpact: 'Clearer marketing execution plan',
    tags: [
      { label: 'Proposal', tier: 1 },
      { label: 'Marketing', tier: 2 },
      { label: 'Content Strategy', tier: 3 },
      { label: 'Local Growth', tier: 3 },
    ],
  },
  '/uyghur-eats': {
    publicTitle: 'Analysis Profile',
    publicClientDescription: 'Restaurant property sale opportunity',
    publicDescription: 'Analysis profile focused on location quality, market position, and buyer-relevant operating signals.',
    publicImpact: 'Property sale opportunity identified',
    tags: [
      { label: 'Analysis', tier: 1 },
      { label: 'Location', tier: 2 },
      { label: 'Valuation', tier: 3 },
      { label: 'Property Sale', tier: 3 },
    ],
  },
  '/uyghur-eats-acquisition': {
    publicTitle: 'Restaurant Acquisition Proposal',
    publicClientDescription: 'Specialty restaurant with differentiated cuisine and buyer-readiness upside',
    publicDescription: 'Acquisition advisory proposal covering business packaging, diligence, buyer materials, and transaction-readiness support.',
    publicImpact: 'Cleaner acquisition process',
    tags: [
      { label: 'Proposal', tier: 1 },
      { label: 'Acquisition', tier: 2 },
      { label: 'Diligence', tier: 3 },
      { label: 'Valuation', tier: 3 },
    ],
  },
};
