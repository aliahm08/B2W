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
    publicTitle: 'Turkish Bistro Social Media Management',
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
    publicTitle: 'Turkish Bistro Content and Promotion System',
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
    publicTitle: 'Urban Restaurant Sale Readiness',
    publicClientDescription: 'Restaurant property sale opportunity',
    publicDescription: 'Restaurant M&A property sale engagement focused on location quality, market position, and buyer-relevant operating signals.',
    publicImpact: 'Property sale opportunity identified',
    tags: [
      { label: 'Analysis', tier: 1 },
      { label: 'Location', tier: 2 },
      { label: 'Valuation', tier: 3 },
      { label: 'Property Sale', tier: 3 },
    ],
  },
  '/uyghur-eats-acquisition': {
    publicTitle: 'Urban Restaurant Buyer Diligence',
    publicClientDescription: 'Restaurant property sale opportunity with diligence-led buyer packaging',
    publicDescription: 'Email-protected proposal covering the diligence-as-a-service model, buyer certainty package, and property sale rollout.',
    publicImpact: 'Controlled sale process defined',
    tags: [
      { label: 'Proposal', tier: 1 },
      { label: 'Property Sale', tier: 2 },
      { label: 'Diligence', tier: 3 },
      { label: 'Buyer Package', tier: 3 },
    ],
  },
};
