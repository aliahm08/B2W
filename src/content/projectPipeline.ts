export type HeroContent = {
  headline: string;
  subheadline: string;
  tags?: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
};

export type ProjectTag = {
  label: string;
  tier: 1 | 2 | 3;
};

export type ProjectCard = {
  id: number;
  category: string;
  projectType: string;
  serviceType: string;
  status: string;
  clientDescription: string;
  title: string;
  description: string;
  impact: string;
  tags: ProjectTag[];
  date: string;
  link: string;
};

export type ProjectPipelineContent = {
  hero: HeroContent;
  projects: ProjectCard[];
};

export { projectPipelineContent } from './projectPipeline.generated';
