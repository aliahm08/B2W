export type HeroContent = {
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
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
  tags: string[];
  date: string;
  link: string;
};

export type ProjectPipelineContent = {
  hero: HeroContent;
  projects: ProjectCard[];
};

export { projectPipelineContent } from './projectPipeline.generated';
