import { allCapabilities, getCapabilityBySlug } from '../content/capabilities';
import { aiSolutions, getAiSolutionBySlug } from '../content/aiSolutions';
import { explainerContent } from '../content/dataExplainers';
import { expertisePages } from '../content/expertisePages';
import { parseKitchenSolutionSlug } from '../content/kitchen';
import { servicePageContent } from '../content/servicePages';

type TwitterCard = 'summary' | 'summary_large_image';
type OpenGraphType = 'website' | 'article';

type SeoDefinition = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  type?: OpenGraphType;
  imagePath?: string;
  imageAlt?: string;
};

export type SeoMetadata = {
  pathname: string;
  canonicalPath: string;
  title: string;
  description: string;
  robots: string;
  type: OpenGraphType;
  imageUrl?: string;
  imageAlt?: string;
  twitterCard: TwitterCard;
};

export type SeoOverride = Partial<
  Pick<SeoMetadata, 'title' | 'description' | 'canonicalPath' | 'robots' | 'type' | 'imageUrl' | 'imageAlt' | 'twitterCard'>
>;

const SITE_NAME = 'B2W';
const FALLBACK_SITE_URL = 'https://www.b2w-ai.com';
const DEFAULT_ROBOTS = 'index, follow';
const PRIVATE_ROBOTS = 'noindex, nofollow';

const uyghurImages = {
  main: '/images/uyghur-eats/interior.jpg',
  plating: '/images/uyghur-eats/platter.jpg',
  noodles: '/images/uyghur-eats/laghman.jpg',
} as const;

const directRoutes = new Map<string, SeoDefinition>([
  [
    '/',
    {
      title: 'Consulting Services for SMBs',
      description:
        'B2W helps small and midsize businesses improve marketing, operations, and financial performance with practical AI systems, diagnostics, and implementation support.',
    },
  ],
  [
    '/solutions',
    {
      title: 'B2W AI Solutions',
      description:
        'Explore the AI side of B2W: chatbots, estimations, financial models, and voice-to-plan systems designed to show the product in action.',
    },
  ],
  [
    '/jasonai',
    {
      title: 'JasonAI for Contractor Businesses',
      description:
        'JasonAI works inside the tools contractor teams already use and keeps track of scope changes, missed follow-ups, and unbilled extras.',
    },
  ],
  [
    '/jasonai/how-it-works',
    {
      title: 'How JasonAI Works for Contractors',
      description:
        'See how JasonAI is set up around contractor job communication, where it catches scope changes and follow-ups, and how to book a business review.',
    },
  ],
  [
    '/jasonai/questions',
    {
      title: 'JasonAI Questions and Waitlist',
      description:
        'Answers to common JasonAI questions about crew adoption, privacy, existing tools, setup, and founding access for contractor businesses.',
    },
  ],
  [
    '/jasonai/privacy',
    {
      title: 'JasonAI Privacy Policy',
      description:
        'Privacy Policy for JasonAI by B2W, covering fieldwork communications, job context, connected tools, AI processing, data sharing, retention, and user controls.',
    },
  ],
  [
    '/jasonai-2',
    {
      title: 'JasonAI Style 2 by B2W',
      description:
        'A calm second test style for JasonAI, the B2W product that turns business conversations into organized job clarity.',
    },
  ],
  [
    '/jasonai-3',
    {
      title: 'JasonAI-3 Risk Intelligence Platform by B2W',
      description:
        'JasonAI-3 explains the SaaS platform where OpenClaw assistants feed a canvas organized as a story graph, CRM table, and risk tracker powered by Clara, a Gemma agent.',
    },
  ],
  [
    '/jasonai-3/portal',
    {
      title: 'JasonAI-3 SaaS Portal by B2W',
      description:
        'The JasonAI-3 SaaS portal organizes OpenClaw assistant inputs into a canvas with Story Graph, CRM table, and Risk Tracker views powered by Clara, a Gemma agent.',
    },
  ],
  [
    '/jasonai-3/portal-2',
    {
      title: 'JasonAI-3 Platform V2 by B2W',
      description:
        'JasonAI-3 Platform V2 presents the OpenClaw-fed AI platform as a client portal style SaaS canvas with Canvas, Risk Tracker, and Clara customization views.',
    },
  ],
  [
    '/jasonai-3/portal-2/tasks',
    {
      title: 'JasonAI-3 Tasks Portal by B2W',
      description:
        'JasonAI-3 Tasks Portal lets the Contract Owner chat with Clara to develop project estimates from selected OpenClaw-backed comms records.',
    },
  ],
  [
    '/kitchen',
    {
      title: 'Kitchen by B2W',
      description:
        'Build a custom B2W solution by combining information, integration, and production into a preview proposal, or start from Growth, Optimization, and Diligence presets.',
    },
  ],
  [
    '/capabilities',
    {
      title: 'Kitchen by B2W',
      description:
        'Legacy Kitchen by B2W route that forwards to the current solution builder and preview flow.',
      canonicalPath: '/kitchen',
    },
  ],
  [
    '/kitchen/demo/original',
    {
      title: 'Original Kitchen Demo',
      description:
        'Archived Kitchen by B2W demo preserving the original information, integrations, production ingredients, and selectable solution combinations.',
    },
  ],
  [
    '/borek-g-social-media-management',
    {
      title: 'Restaurant Marketing Profile for Borek-G in Falls Church, VA',
      description:
        'Review B2W\'s restaurant marketing profile for Borek-G covering local reputation, search visibility, Instagram opportunity, owned-channel conversion, and growth signals in Falls Church.',
    },
  ],
  [
    '/borek-g-operations',
    {
      title: 'Restaurant Growth Proposal for Borek-G',
      description:
        'Review B2W\'s growth proposal for Borek-G, including local discovery strategy, content cadence, restaurant marketing priorities, and phased implementation recommendations.',
    },
  ],
  [
    '/sabucnu-operations',
    {
      title: 'Operations Assessment for Sabucnu Contractors',
      description:
        'Operations analysis for Sabucnu Contractors covering workforce coordination, standard operating procedures, scheduling systems, and execution consistency.',
    },
  ],
  [
    '/client/uyghur-eats',
    {
      title: 'Uyghur Eats Strategic Exit Proposal',
      description:
        'Client portal for the Uyghur Eats strategic exit engagement, covering the proposal, buyer-facing business profile, valuation model, diligence documentation, and working terms.',
      robots: PRIVATE_ROBOTS,
      imagePath: uyghurImages.main,
      imageAlt: 'Interior dining room at Uyghur Eats in Washington, DC.',
    },
  ],
  [
    '/client/uyghur-eats/profile',
    {
      title: 'Uyghur Eats Business Profile for Buyers',
      description:
        'Buyer-facing business profile for Uyghur Eats covering the concept story, location quality, demand drivers, market positioning, and ownership transition upside.',
      robots: PRIVATE_ROBOTS,
      imagePath: uyghurImages.plating,
      imageAlt: 'Signature Uyghur Eats platter prepared for diners.',
    },
  ],
  [
    '/client/uyghur-eats/valuation',
    {
      title: 'Uyghur Eats Valuation Model and Sale Range',
      description:
        'Valuation model for Uyghur Eats with revenue framing, normalized earnings logic, comparable sale context, and estimated pricing scenarios for a buyer conversation.',
      robots: PRIVATE_ROBOTS,
      imagePath: uyghurImages.noodles,
      imageAlt: 'Hand-pulled noodle dish from Uyghur Eats.',
    },
  ],
  [
    '/client/uyghur-eats/data-room',
    {
      title: 'Uyghur Eats Due Diligence Documentation',
      description:
        'Structured documentation package for Uyghur Eats that organizes executive summary materials, financial records, operating documents, lease items, and digital assets for diligence.',
      robots: PRIVATE_ROBOTS,
      imagePath: uyghurImages.main,
      imageAlt: 'Interior dining room at Uyghur Eats in Washington, DC.',
    },
  ],
  [
    '/client/uyghur-eats/terms',
    {
      title: 'Uyghur Eats Proposal Terms and Scope',
      description:
        'Proposal terms for the Uyghur Eats strategic exit engagement, including scope, valuation assumptions, documentation limits, confidentiality, timeline, and payment expectations.',
      robots: PRIVATE_ROBOTS,
      imagePath: uyghurImages.main,
      imageAlt: 'Interior dining room at Uyghur Eats in Washington, DC.',
    },
  ],
  [
    '/home-test-1',
    {
      title: 'B2W Homepage Prototype',
      description:
        'Prototype homepage for B2W with alternate messaging around SMB consulting, AI systems, service lines, and client access.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/borek-g',
    {
      title: 'Restaurant Marketing Profile for Borek-G in Falls Church, VA',
      description:
        'Legacy route that forwards to the Borek-G restaurant marketing profile covering reputation, search visibility, and growth signals.',
      canonicalPath: '/borek-g-social-media-management',
      robots: PRIVATE_ROBOTS,
    },
  ],
]);

function getSiteUrl() {
  const envSiteUrl =
    typeof import.meta !== 'undefined' && 'env' in import.meta
      ? (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_SITE_URL
      : undefined;

  return (envSiteUrl || FALLBACK_SITE_URL).replace(/\/+$/, '');
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.replace(/\/+$/, '') || '/';
}

function withBrand(title: string) {
  return /\|\s*B2W$/i.test(title) ? title : `${title} | ${SITE_NAME}`;
}

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}

function buildMetadata(pathname: string, definition: SeoDefinition): SeoMetadata {
  const canonicalPath = normalizePathname(definition.canonicalPath ?? pathname);
  const imageUrl = definition.imagePath ? toAbsoluteUrl(definition.imagePath) : undefined;

  return {
    pathname,
    canonicalPath,
    title: withBrand(definition.title),
    description: definition.description,
    robots: definition.robots ?? DEFAULT_ROBOTS,
    type: definition.type ?? 'website',
    imageUrl,
    imageAlt: definition.imageAlt,
    twitterCard: imageUrl ? 'summary_large_image' : 'summary',
  };
}

function buildCapabilityMetadata(pathname: string) {
  const slug = pathname.replace('/capabilities/', '');
  const capability = getCapabilityBySlug(slug);

  if (!capability) {
    return null;
  }

  return buildMetadata(pathname, {
    title: `${capability.title} | ${capability.laneMenuLabel} AI Capability`,
    description: `${capability.summary} Built for ${capability.bestFor}. Explore the use case, operator workflow, connected systems, and expected outputs for this ${capability.laneMenuLabel.toLowerCase()} capability.`,
  });
}

function buildServiceMetadata(pathname: string) {
  const content = servicePageContent[pathname];

  if (!content) {
    return null;
  }

  return buildMetadata(pathname, {
    title: content.seoTitle,
    description: `${content.description} Explore outcomes, scope, and the intake path for this service line.`,
  });
}

function buildExpertiseMetadata(pathname: string) {
  const content = expertisePages[pathname];

  if (!content) {
    return null;
  }

  return buildMetadata(pathname, {
    title: content.seoTitle,
    description: `${content.description} Review how B2W scopes this expertise area, what it prioritizes, and how engagements begin.`,
  });
}

function buildKitchenPreviewMetadata(pathname: string) {
  if (!pathname.startsWith('/kitchen/preview/')) {
    return null;
  }

  const slug = pathname.replace('/kitchen/preview/', '');
  const solution = parseKitchenSolutionSlug(slug);

  if (!solution) {
    return null;
  }

  return buildMetadata(pathname, {
    title: `${solution.name} Preview Proposal`,
    description: `Preview proposal for ${solution.name}, combining ${solution.information.map((item) => item.title.toLowerCase()).join(', ')}, ${solution.integration.map((item) => item.title.toLowerCase()).join(', ')}, and ${solution.production.map((item) => item.title.toLowerCase()).join(', ')} in the Kitchen by B2W flow.`,
    robots: PRIVATE_ROBOTS,
  });
}

function buildSolutionMetadata(pathname: string) {
  if (!pathname.startsWith('/solutions/')) {
    return null;
  }

  const slug = pathname.replace('/solutions/', '');
  const solution = getAiSolutionBySlug(slug);

  if (!solution) {
    return null;
  }

  return buildMetadata(pathname, {
    title: solution.seoTitle,
    description: solution.seoDescription,
  });
}

function buildExplainerMetadata(pathname: string) {
  const content = explainerContent[pathname];

  if (!content) {
    return null;
  }

  return buildMetadata(pathname, {
    title: content.seoTitle,
    description: `${content.description} Review the data inputs and business decisions this analysis supports.`,
  });
}

export function resolveSeoMetadata(pathname: string): SeoMetadata {
  const normalizedPathname = normalizePathname(pathname);
  const directDefinition = directRoutes.get(normalizedPathname);

  if (directDefinition) {
    return buildMetadata(normalizedPathname, directDefinition);
  }

  const serviceMetadata = buildServiceMetadata(normalizedPathname);
  if (serviceMetadata) {
    return serviceMetadata;
  }

  const expertiseMetadata = buildExpertiseMetadata(normalizedPathname);
  if (expertiseMetadata) {
    return expertiseMetadata;
  }

  const kitchenPreviewMetadata = buildKitchenPreviewMetadata(normalizedPathname);
  if (kitchenPreviewMetadata) {
    return kitchenPreviewMetadata;
  }

  const solutionMetadata = buildSolutionMetadata(normalizedPathname);
  if (solutionMetadata) {
    return solutionMetadata;
  }

  const explainerMetadata = buildExplainerMetadata(normalizedPathname);
  if (explainerMetadata) {
    return explainerMetadata;
  }

  if (normalizedPathname.startsWith('/capabilities/')) {
    const capabilityMetadata = buildCapabilityMetadata(normalizedPathname);
    if (capabilityMetadata) {
      return capabilityMetadata;
    }
  }

  return buildMetadata(normalizedPathname, {
    title: 'Page Not Found',
    description: 'The requested B2W page could not be found.',
    robots: PRIVATE_ROBOTS,
  });
}

export function mergeSeoMetadata(pathname: string, override?: SeoOverride): SeoMetadata {
  const base = resolveSeoMetadata(pathname);

  if (!override) {
    return base;
  }

  return {
    ...base,
    ...override,
    canonicalPath: normalizePathname(override.canonicalPath ?? base.canonicalPath),
    title: withBrand(override.title ?? base.title),
    twitterCard: override.twitterCard ?? (override.imageUrl ?? base.imageUrl ? 'summary_large_image' : 'summary'),
  };
}

export function listStaticSeoRoutes() {
  const paths = new Set<string>([
    ...directRoutes.keys(),
    ...Object.keys(servicePageContent),
    ...Object.keys(expertisePages),
    ...Object.keys(explainerContent),
    ...allCapabilities.map((capability) => `/capabilities/${capability.slug}`),
    ...aiSolutions.map((solution) => `/solutions/${solution.slug}`),
  ]);

  return Array.from(paths)
    .sort((left, right) => left.localeCompare(right))
    .map((pathname) => resolveSeoMetadata(pathname));
}
