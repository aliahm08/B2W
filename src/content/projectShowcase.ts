import type { ProjectTag } from './projectPipeline';

export type ProjectShowcaseOverride = {
  publicTitle: string;
  publicClientDescription: string;
  publicDescription: string;
  publicImpact: string;
  tags: ProjectTag[];
};

export const projectShowcaseOverridesByPath: Record<string, ProjectShowcaseOverride> = {
  '/borek-g-social-media-management': {
    publicTitle: 'Turkish Bistro in Falls Church, VA',
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
    publicTitle: 'Turkish Bistro in Falls Church, VA',
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
    publicTitle: 'Business Sale Preparation & Opportunity Packaging',
    publicClientDescription: 'Fine dining business acquisition opportunity',
    publicDescription: 'A four-step engagement covering business overview creation, valuation modeling, operations documentation, and buyer due diligence packaging for a local restaurant asset.',
    publicImpact: 'Organized asset sale package',
    tags: [
      { label: 'Sale Preparation', tier: 1 },
      { label: 'Valuation', tier: 2 },
      { label: 'Operations documentation', tier: 3 },
      { label: 'Due Diligence', tier: 3 },
    ],
  },
};
