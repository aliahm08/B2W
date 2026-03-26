import type {
  HomeTestCapabilityId,
  HomeTestExpertiseId,
  HomeTestProjectAreaId,
} from '../content/homeTestTwo';

export type ProjectBriefRequestPayload = {
  businessName: string;
  website: string;
  arr: string;
  email: string;
  capabilityIds: HomeTestCapabilityId[];
  expertiseIds: HomeTestExpertiseId[];
  projectAreaId: HomeTestProjectAreaId;
};

export type ProjectBriefSection = {
  headline: string;
  summary: string;
  bullets: string[];
};

export type GeneratedProjectBrief = {
  projectTitle: string;
  proposalSummary: string;
  profile: ProjectBriefSection;
  model: ProjectBriefSection;
  documentation: ProjectBriefSection;
  recommendedScope: string[];
  nextSteps: string[];
  briefMarkdown: string;
};

export type ProjectBriefApiResponse = {
  brief: GeneratedProjectBrief;
  generatedAt: string;
  provider: 'gemini' | 'fallback';
  warning?: string;
};
