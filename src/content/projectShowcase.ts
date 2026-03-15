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
    publicTitle: 'Frontline Operations Copilot Prototype',
    publicClientDescription: 'Independent restaurant team with recurring frontline questions',
    publicDescription: 'Operations proposal focused on repetitive question handling, workflow consistency, escalation rules, and staff-support coverage.',
    publicImpact: 'Faster frontline response flow',
    tags: [
      { label: 'Prototype', tier: 1 },
      { label: 'Operations', tier: 2 },
      { label: 'Chatbot', tier: 3 },
      { label: 'Workflow Design', tier: 3 },
    ],
  },
  '/uyghur-eats': {
    publicTitle: 'Acquisition Readiness and Valuation Profile',
    publicClientDescription: 'Specialty restaurant positioned in a strong urban corridor',
    publicDescription: 'Business profile focused on acquisition readiness, location quality, market position, and differentiated demand drivers.',
    publicImpact: 'Stronger acquisition positioning',
    tags: [
      { label: 'Profile', tier: 1 },
      { label: 'Location', tier: 2 },
      { label: 'Valuation', tier: 3 },
      { label: 'Acquisition', tier: 3 },
    ],
  },
};
