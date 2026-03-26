import { GoogleGenAI } from '@google/genai';
import {
  homeTestCapabilityLookup,
  homeTestExpertiseLookup,
  homeTestProjectAreaLookup,
  type HomeTestCapabilityId,
  type HomeTestExpertiseId,
  type HomeTestProjectAreaId,
} from '../../src/content/homeTestTwo';
import type {
  GeneratedProjectBrief,
  ProjectBriefApiResponse,
  ProjectBriefRequestPayload,
} from '../../src/lib/projectBrief';

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || process.env.GOOGLE_AI_MODEL?.trim() || 'gemini-2.0-flash';

const BRIEF_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'projectTitle',
    'proposalSummary',
    'profile',
    'model',
    'documentation',
    'recommendedScope',
    'nextSteps',
    'briefMarkdown',
  ],
  properties: {
    projectTitle: { type: 'string' },
    proposalSummary: { type: 'string' },
    profile: {
      type: 'object',
      additionalProperties: false,
      required: ['headline', 'summary', 'bullets'],
      properties: {
        headline: { type: 'string' },
        summary: { type: 'string' },
        bullets: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    model: {
      type: 'object',
      additionalProperties: false,
      required: ['headline', 'summary', 'bullets'],
      properties: {
        headline: { type: 'string' },
        summary: { type: 'string' },
        bullets: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    documentation: {
      type: 'object',
      additionalProperties: false,
      required: ['headline', 'summary', 'bullets'],
      properties: {
        headline: { type: 'string' },
        summary: { type: 'string' },
        bullets: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    recommendedScope: {
      type: 'array',
      items: { type: 'string' },
    },
    nextSteps: {
      type: 'array',
      items: { type: 'string' },
    },
    briefMarkdown: { type: 'string' },
  },
} as const;

const SYSTEM_INSTRUCTION = `
You are the B2W proposal engine.

Write like B2W:
- direct, commercially literate, and grounded in real operating context
- no startup clichés, generic AI hype, or vague transformation language
- treat marketing, financial, and operating materials as business evidence, not decoration
- make the proposal feel like a real B2W portal brief, similar in tone to the Uyghur Eats work
- profile, model, and documentation are distinct layers and should not collapse into one another

Output rules:
- return valid JSON only
- keep every sentence concrete and business-specific
- briefMarkdown must be valid markdown and use this structure:
  # [Project Title]
  ## Proposal Summary
  ## Profile
  ## Model
  ## Documentation
  ## Recommended Scope
  ## Immediate Next Steps
`;

function formatList(values: string[]): string {
  if (values.length === 0) {
    return 'no selections yet';
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function getCapabilityTitles(ids: HomeTestCapabilityId[]): string[] {
  return ids.map((id) => homeTestCapabilityLookup[id].title);
}

function getExpertiseTitles(ids: HomeTestExpertiseId[]): string[] {
  return ids.map((id) => homeTestExpertiseLookup[id].title);
}

function getProjectAreaTitle(id: HomeTestProjectAreaId): string {
  return homeTestProjectAreaLookup[id].title;
}

function sanitizeString(value: string | undefined, maxLength: number): string {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function toMarkdownList(values: string[]): string {
  return values.map((value) => `- ${value}`).join('\n');
}

function buildFallbackBrief(input: ProjectBriefRequestPayload): GeneratedProjectBrief {
  const capabilityTitles = getCapabilityTitles(input.capabilityIds);
  const expertiseTitles = getExpertiseTitles(input.expertiseIds);
  const projectArea = homeTestProjectAreaLookup[input.projectAreaId];
  const businessLabel = `${input.businessName} (${input.website})`;
  const arrLine = `Current ARR or revenue context shared: ${input.arr}.`;
  const emailLine = `Primary contact for proposal follow-up: ${input.email}.`;

  const brief: GeneratedProjectBrief = {
    projectTitle: `${input.businessName} ${projectArea.title}`,
    proposalSummary:
      `B2W would package ${businessLabel} into a ${projectArea.title.toLowerCase()} built from ${formatList(capabilityTitles)} and aimed at ${formatList(expertiseTitles).toLowerCase()}. ${arrLine} ${emailLine} The initial scope would be shaped as a proposal portal with distinct profile, model, and documentation layers so the client can review the project quickly and refine it before full scoping.`,
    profile: {
      headline: 'Profile the business in a way the next stakeholder can understand quickly.',
      summary:
        `Start with a business profile that explains how ${input.businessName} presents online through ${input.website}, how the business appears to win today, and where the current story is too thin or too informal for a stronger proposal.`,
      bullets: [
        `Translate ${formatList(capabilityTitles).toLowerCase()} into a cleaner operator-facing summary of how the business is currently performing.`,
        `Frame the business around the website presence, offer clarity, and the practical constraints that shape execution.`,
        `Turn the selected project area into a portal-ready narrative that feels like a B2W proposal rather than a generic intake memo.`,
      ],
    },
    model: {
      headline: 'Build the working logic behind the project, not just the presentation layer.',
      summary:
        `The model layer should connect the selected inputs to the chosen expertise tracks so the client can see how B2W would evaluate value creation, operating friction, and decision tradeoffs.`,
      bullets: [
        `Use ${formatList(expertiseTitles).toLowerCase()} as the operating lens for the first draft model.`,
        arrLine,
        emailLine,
        `Shape the recommendation around a ${projectArea.serviceType.toLowerCase()} so the client can see what gets modeled first and what follows later.`,
      ],
    },
    documentation: {
      headline: 'Organize the records and proof needed to support the work.',
      summary:
        `The documentation layer should show what materials B2W would want next, what can already be used from the selected inputs, and what must be clarified before the project becomes a final scope.`,
      bullets: [
        'List the missing records, assumptions, and approvals that still need to be collected.',
        'Separate supporting evidence into profile, model, and diligence-ready documentation buckets.',
        'Prepare the engagement so it can evolve into a fuller client portal without rewriting the entire project story.',
      ],
    },
    recommendedScope: [
      `Lead with a ${projectArea.title.toLowerCase()} for ${businessLabel}.`,
      `Use ${formatList(capabilityTitles).toLowerCase()} as the first input stack.`,
      `Prioritize ${formatList(expertiseTitles).toLowerCase()} in the first brief iteration.`,
    ],
    nextSteps: [
      'Confirm the business name, website, ARR context, and primary owner-side objective for the project.',
      'Translate the selected tracks into the exact scope assumptions, deliverables, and constraints.',
      'Collect the first round of source materials tied to the selected capabilities.',
      'Convert the draft into a client-facing proposal with profile, model, and documentation sections.',
    ],
    briefMarkdown: '',
  };

  brief.briefMarkdown = [
    `# ${brief.projectTitle}`,
    '',
    '## Proposal Summary',
    brief.proposalSummary,
    '',
    '## Profile',
    `### ${brief.profile.headline}`,
    brief.profile.summary,
    toMarkdownList(brief.profile.bullets),
    '',
    '## Model',
    `### ${brief.model.headline}`,
    brief.model.summary,
    toMarkdownList(brief.model.bullets),
    '',
    '## Documentation',
    `### ${brief.documentation.headline}`,
    brief.documentation.summary,
    toMarkdownList(brief.documentation.bullets),
    '',
    '## Recommended Scope',
    toMarkdownList(brief.recommendedScope),
    '',
    '## Immediate Next Steps',
    toMarkdownList(brief.nextSteps),
  ].join('\n');

  return brief;
}

function parseBriefResponse(raw: string): GeneratedProjectBrief {
  const normalized = raw.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
  const parsed = JSON.parse(normalized) as GeneratedProjectBrief;

  return {
    ...parsed,
    recommendedScope: Array.isArray(parsed.recommendedScope) ? parsed.recommendedScope.filter(Boolean).slice(0, 5) : [],
    nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.filter(Boolean).slice(0, 5) : [],
    profile: {
      headline: parsed.profile?.headline ?? '',
      summary: parsed.profile?.summary ?? '',
      bullets: Array.isArray(parsed.profile?.bullets) ? parsed.profile.bullets.filter(Boolean).slice(0, 5) : [],
    },
    model: {
      headline: parsed.model?.headline ?? '',
      summary: parsed.model?.summary ?? '',
      bullets: Array.isArray(parsed.model?.bullets) ? parsed.model.bullets.filter(Boolean).slice(0, 5) : [],
    },
    documentation: {
      headline: parsed.documentation?.headline ?? '',
      summary: parsed.documentation?.summary ?? '',
      bullets: Array.isArray(parsed.documentation?.bullets) ? parsed.documentation.bullets.filter(Boolean).slice(0, 5) : [],
    },
  };
}

function buildUserPrompt(input: ProjectBriefRequestPayload): string {
  const capabilityTitles = getCapabilityTitles(input.capabilityIds);
  const expertiseTitles = getExpertiseTitles(input.expertiseIds);
  const projectAreaTitle = getProjectAreaTitle(input.projectAreaId);
  const projectArea = homeTestProjectAreaLookup[input.projectAreaId];

  return [
    'Build a tailored B2W project brief for the following intake:',
    '',
    `Business name: ${input.businessName}`,
    `Website: ${input.website}`,
    `ARR / revenue context: ${input.arr}`,
    `Contact email: ${input.email}`,
    `Selected capabilities: ${formatList(capabilityTitles)}`,
    `Selected expertise: ${formatList(expertiseTitles)}`,
    `Selected project area: ${projectAreaTitle}`,
    `Project area summary: ${projectArea.summary}`,
    `Project area detail: ${projectArea.detail}`,
    '',
    'What the brief must do:',
    '- Infer the business context from the company name, website, and selected tracks.',
    '- Treat the selected capabilities as the evidence base the client can already provide.',
    '- Pull those same data sources into every selected expertise track.',
    '- Make the proposal feel customized to the business and website presence, not generic.',
    '- Show how B2W would translate the intake into profile, model, and documentation layers.',
    '- Keep the tone commercially sharp and concrete.',
  ].join('\n');
}

export async function generateProjectBrief(
  rawInput: ProjectBriefRequestPayload,
): Promise<ProjectBriefApiResponse> {
  const input: ProjectBriefRequestPayload = {
    ...rawInput,
    businessName: sanitizeString(rawInput.businessName, 120),
    website: sanitizeString(rawInput.website, 240),
    arr: sanitizeString(rawInput.arr, 80),
    email: sanitizeString(rawInput.email, 160),
  };

  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_AI_API_KEY?.trim() || '';
  const generatedAt = new Date().toISOString();

  if (!apiKey) {
    return {
      brief: buildFallbackBrief(input),
      generatedAt,
      provider: 'fallback',
      warning: 'GEMINI_API_KEY is not configured. Showing a local draft instead of a Gemini-generated brief.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: buildUserPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseJsonSchema: BRIEF_RESPONSE_SCHEMA,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    return {
      brief: parseBriefResponse(responseText),
      generatedAt,
      provider: 'gemini',
    };
  } catch (error) {
    return {
      brief: buildFallbackBrief(input),
      generatedAt,
      provider: 'fallback',
      warning:
        error instanceof Error
          ? `Gemini brief generation failed, so a local draft was returned instead. ${error.message}`
          : 'Gemini brief generation failed, so a local draft was returned instead.',
    };
  }
}
