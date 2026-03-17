export type ShowcaseProject = {
  id: string;
  category: string;
  serviceType: string;
  status: 'Proposed' | 'In-progress' | 'Complete';
  title: string;
  clientDescription: string;
  description: string;
  tags: string[];
  date: string;
  link: string;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'borek-g-marketing',
    category: 'Marketing',
    serviceType: 'Consulting',
    status: 'Proposed',
    title: 'Turkish Bistro in Falls Church, VA',
    clientDescription: 'Potential 24% growth in sales',
    description:
      'Restaurant marketing profile covering public reputation, Instagram opportunity, search visibility, and conversion opportunities across the website and owned channels.',
    tags: ['Profile', 'Instagram', 'SEO', 'Web Design'],
    date: 'January 2026',
    link: '#',
  },
  {
    id: 'uyghur-eats-ma',
    category: 'Financials',
    serviceType: 'Consulting',
    status: 'Proposed',
    title: 'Fine Dining in Washington, DC',
    clientDescription: '15 property buyers found, over $50k in value added.',
    description:
      'Property sale engagement covering the diligence-as-a-service model, buyer certainty package, and sale rollout.',
    tags: ['M&A', 'Property Sale', 'Diligence', 'Buyer Package'],
    date: 'March 2026',
    link: '#',
  },
  {
    id: 'sabucnu-operations',
    category: 'Operations',
    serviceType: 'Implementation',
    status: 'Proposed',
    title: 'Sabucnu Contractors',
    clientDescription:
      'Projected 40–60% reduction in coordination time across 18 field crews.',
    description:
      'Operations engagement covering workforce coordination, scheduling automation, SOP deployment, and field-crew communication systems.',
    tags: ['Operations', 'SOPs', 'Workforce', 'Scheduling'],
    date: 'March 2026',
    link: '#',
  },
];
