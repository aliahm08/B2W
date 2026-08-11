import { allCapabilities, getCapabilityBySlug } from '../content/capabilities';
import { explainerContent } from '../content/dataExplainers';
import { expertisePages } from '../content/expertisePages';
import { servicePageContent } from '../content/servicePages';
import { tierPageContent } from '../content/tierPages';

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
const DEFAULT_PUBLIC_IMAGE_ALT = 'Official B2W logo beside the B2W-ai wordmark.';
const MARKETING_ASSET_VERSION = '20260811.3';

const brandImages = {
  b2wSocial: `/brand/b2w-social-card.png?v=${MARKETING_ASSET_VERSION}`,
  claraSocial: `/brand/clara-social-card.png?v=${MARKETING_ASSET_VERSION}`,
} as const;

const jasonAiImages = {
  contractorSignals: '/images/jasonai/scattered-communication.jpg',
} as const;

const mainExperienceRoutes = new Map<string, SeoDefinition>([
  ['/', { title: 'AI Assistant for Contractors', description: 'JasonAI helps contractor teams search approved job communication and summarize project conversations through WhatsApp.', imagePath: brandImages.b2wSocial }],
  ['/jasonai', { title: 'JasonAI Contractor Assistant', description: 'See how JasonAI searches approved WhatsApp work-group communication and creates concise job or time-period summaries.', imagePath: jasonAiImages.contractorSignals }],
  ['/jasonai/how-it-works', { title: 'How JasonAI Works for Contractors', description: 'Follow the JasonAI workflow from approved WhatsApp sources through natural questions, reviewed answers, and careful expansion.', imagePath: jasonAiImages.contractorSignals }],
  ['/jasonai/integrations', { title: 'JasonAI Integrations and Availability', description: 'Review the current approved WhatsApp workflow and clearly labeled configurable or planned JasonAI integrations.', imagePath: jasonAiImages.contractorSignals }],
  ['/jasonai/security', { title: 'JasonAI Security and Privacy Controls', description: 'Understand approved access, AI processing, retention, deletion, human review, and current JasonAI security boundaries.', imagePath: jasonAiImages.contractorSignals }],
  ['/contractors', { title: 'AI Assistant for Contracting Businesses', description: 'See how JasonAI supports general contractors, design-build firms, and specialty contractors with approved communication search and summaries.', imagePath: brandImages.b2wSocial }],
  ['/contractors/general-contractors', { title: 'General Contractor Workflow and Job Coordination', description: 'JasonAI helps general contractors find approved project communication, summarize job context, and reduce repeated status searches.', imagePath: '/images/contractor-audiences/business-owners.png' }],
  ['/contractors/general-contractors/project-communication', { title: 'Project Communication for General Contractors', description: 'Find contractor job decisions, commitments, questions, and context without rereading every approved message.', imagePath: jasonAiImages.contractorSignals }],
  ['/contractors/general-contractors/job-tracking', { title: 'Job Tracking for General Contractors', description: 'Use approved job communication to find outstanding work, commitments, changes, blockers, and decisions.', imagePath: jasonAiImages.contractorSignals }],
  ['/contractors/general-contractors/workflow-automation', { title: 'Workflow Automation for General Contractors', description: 'See which JasonAI contractor workflows are available, configurable, in development, or planned.', imagePath: jasonAiImages.contractorSignals }],
  ['/contractors/design-build', { title: 'JasonAI for Design-Build Firms', description: 'Keep approved design decisions, client approvals, handoffs, and field changes easier to find and summarize.', imagePath: '/images/contractor-audiences/project-managers.png' }],
  ['/contractors/specialty-contractors', { title: 'JasonAI for Specialty Contractors', description: 'Search approved GC communication, crew updates, schedule changes, commitments, and inspection details across jobs.', imagePath: '/images/contractor-audiences/operations-teams.png' }],
  ['/pricing', { title: 'JasonAI Pricing for Contractors', description: 'JasonAI standard pricing is $99 per month plus a one-time $2,000 approved-source mapping, onboarding, and setup fee.', imagePath: brandImages.b2wSocial }],
  ['/get-started', { title: 'Try JasonAI With One Contractor Workflow', description: 'Share one active contractor workflow so B2W can assess whether the current JasonAI WhatsApp assistant is a fit.', imagePath: brandImages.b2wSocial }],
  ['/book-demo', { title: 'Book a JasonAI Contractor Walkthrough', description: 'Show B2W one existing contractor workflow and see where JasonAI approved communication search and summaries could help.', imagePath: brandImages.b2wSocial }],
  ['/about', { title: 'About B2W', description: 'B2W builds practical tools that reduce contractor coordination overhead and turn approved job communication into useful answers.', imagePath: brandImages.b2wSocial }],
  ['/contact', { title: 'Contact B2W About JasonAI', description: 'Contact B2W about JasonAI fit, one active contractor workflow, pricing, setup, privacy, or a walkthrough.', imagePath: brandImages.b2wSocial }],
  ['/legal/privacy', { title: 'B2W and JasonAI Privacy Policy', description: 'Read how B2W collects, uses, shares, retains, and protects information for JasonAI.', imagePath: brandImages.b2wSocial }],
  ['/legal', { title: 'B2W Legal Information', description: 'Review B2W privacy information and current terms.', canonicalPath: '/legal/privacy', robots: PRIVATE_ROBOTS }],
  ['/legal/terms', { title: 'B2W Terms', description: 'Current B2W terms placeholder pending publication of finalized general website and JasonAI terms.', robots: PRIVATE_ROBOTS }],
]);

const retiredMainRedirectRoutes = new Map<string, SeoDefinition>([
  ['/book-demo', { title: 'Book a B2W Demo', description: 'Contact B2W to discuss the right next step.', canonicalPath: '/contact', robots: PRIVATE_ROBOTS }],
  ['/contractors', { title: 'Contractor Solutions', description: 'Explore B2W solutions for general contractors.', canonicalPath: '/general-contractors', robots: PRIVATE_ROBOTS }],
  ['/get-started', { title: 'Contact B2W', description: 'Contact B2W to discuss JasonAI, services, or a project workflow.', canonicalPath: '/contact', robots: PRIVATE_ROBOTS }],
  ['/jasonai/integrations', { title: 'JasonAI', description: 'Explore the current JasonAI assistant and supported workflow.', canonicalPath: '/jasonai', robots: PRIVATE_ROBOTS }],
  ['/jasonai/security', { title: 'JasonAI Privacy', description: 'Review JasonAI privacy, access, and information-handling details.', canonicalPath: '/jasonai/privacy', robots: PRIVATE_ROBOTS }],
  ['/legal', { title: 'B2W Privacy', description: 'Review B2W and JasonAI privacy information.', canonicalPath: '/jasonai/privacy', robots: PRIVATE_ROBOTS }],
  ['/legal/privacy', { title: 'B2W Privacy', description: 'Review B2W and JasonAI privacy information.', canonicalPath: '/jasonai/privacy', robots: PRIVATE_ROBOTS }],
  ['/legal/terms', { title: 'Contact B2W', description: 'Contact B2W for current service terms and documentation.', canonicalPath: '/contact', robots: PRIVATE_ROBOTS }],
]);

const uyghurImages = {
  main: '/images/uyghur-eats/interior.jpg',
  plating: '/images/uyghur-eats/platter.jpg',
  noodles: '/images/uyghur-eats/laghman.jpg',
} as const;

const versionedArchiveRoutes = [
  ...Array.from(mainExperienceRoutes.keys(), (pathname) => `/v1${pathname === '/' ? '' : pathname}`),
  '/v1/capabilities/financials',
  '/v1/capabilities/operational-performance',
  '/v1/clara',
  '/v1/estimates',
  '/v1/growth',
  '/v1/jasonai/privacy',
  '/v1/jasonai/pricing',
  '/v1/jasonai/questions',
  '/v1/services',
  '/v1/services/business-revamp',
  '/v1/services/financial-review',
  '/v1/services/marketing-advisory',
  '/v1/services/operations-implementation',
  '/v1/tiers/basic-advisory',
  '/v1/tiers/consulting',
  '/v1/tiers/custom-tool',
  '/v1/tiers/implementation',
  '/v2/about',
  '/v2/clara',
  '/v2/contact',
  '/v2/general-contractors',
  '/v2/growth',
  '/v2/gurge',
  '/v2/industries/food-and-beverage',
  '/v2/industries/general-contracting',
  '/v2/industries/real-estate-management',
  '/v2/jasonai',
  '/v2/jasonai/how-it-works',
  '/v2/jasonai/pricing',
  '/v2/jasonai/privacy',
  '/v2/jasonai/questions',
  '/v2/pricing',
  '/v2/products',
  '/v2/products/agents',
  '/v2/products/pricing',
  '/v2/products/workflows',
  '/v2/services',
  '/v2/services/business-revamp',
  '/v2/services/financial-review',
  '/v2/services/marketing-advisory',
  '/v2/services/operations-implementation',
  '/v2/solutions/ai-workflows',
  '/v2/solutions/ai-workflows/project-estimates',
  '/v2/solutions/business-use-cases',
  '/v2/workflows',
];

const v3ArchiveRoutes = [
  '/v3',
  ...versionedArchiveRoutes
    .filter((pathname) => pathname.startsWith('/v2/'))
    .map((pathname) => pathname.replace(/^\/v2/, '/v3')),
];

const v4ArchiveRoutes = [
  '/v4',
  '/v4/jasonai',
  '/v4/how-it-works',
  '/v4/solutions',
  '/v4/why-jasonai',
  '/v4/pricing',
  '/v4/faq',
];

const directRoutes = new Map<string, SeoDefinition>([
  [
    '/',
    {
      title: 'JasonAI for Contractor Communication',
      description: 'JasonAI reduces the cost of contractor communication by turning existing project conversations, documents, and field information into useful work.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/v1',
    {
      title: 'B2W V1 — Consulting, JasonAI, and Estimates',
      description: 'Archived B2W business-first experience featuring SMB consulting, JasonAI communication support, and the original Clara estimating workspace.',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/v2',
    {
      title: 'B2W V2 — Tools for Contractors to Succeed',
      description: 'Archived B2W website featuring practical tools that help contractors improve job visibility, project coordination, operational handoffs, and company knowledge.',
      canonicalPath: '/',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/v4',
    {
      title: 'B2W V4 — JasonAI for Contractor Communication',
      description: 'JasonAI reduces the cost of contractor communication by living inside the tools teams already use and turning existing project information into useful work.',
      canonicalPath: '/',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  ...v4ArchiveRoutes.slice(1).map((pathname): [string, SeoDefinition] => [
    pathname,
    {
      title: 'B2W V4 — JasonAI for Contractor Communication',
      description: 'This former V4 subpage redirects to its matching section in the single JasonAI contractor communication landing page.',
      canonicalPath: '/',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ]),
  [
    '/services',
    {
      title: 'Consulting Services for SMBs',
      description:
        'B2W helps small and midsize businesses improve marketing, operations, and financial performance with practical AI systems, diagnostics, and implementation support.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/gurge',
    {
      title: 'Gurge Management Software Concept',
      description:
        'Explore Gurge, B2W’s concept for managing jobs and locations, tracking accountability, and reporting operating detail.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/industries/food-and-beverage',
    {
      title: 'AI Systems for Food & Beverage',
      description: 'B2W helps restaurants, cafes, franchises, and supermarkets organize daily tasks, maintenance, location standards, catering work, and manager reports.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/industries/general-contracting',
    {
      title: 'AI Systems for General Contractors',
      description: 'B2W helps trade businesses, contracting firms, and AEC companies find job information, organize scopes, improve follow-up, and prepare management reports.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/industries/real-estate-management',
    {
      title: 'AI Systems for Real Estate Management',
      description: 'B2W helps owners and property teams track properties, renovations, maintenance, responsibilities, deadlines, and portfolio reports in one place.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/pricing',
    {
      title: 'JasonAI AI Assistant Pricing and ROI',
      description: 'Calculate potential ROI and review current JasonAI AI-assistant pricing, plus the planned roles for Clara and Gurge.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/workflows',
    {
      title: 'AI Workflows for General Contractors',
      description: 'See practical JasonAI workflows for trade businesses, contracting firms, and AEC companies, from approved communication to reviewed next steps.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/solutions/ai-roi',
    {
      title: 'JasonAI AI Assistant Pricing and ROI',
      description: 'Calculate potential ROI and review current JasonAI AI-assistant pricing, plus the planned roles for Clara and Gurge.',
      canonicalPath: '/pricing',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/solutions/business-use-cases',
    {
      title: 'B2W AI Use Cases and Workflow Patterns',
      description: 'Explore operating problems B2W can help solve, with current, concept-stage, and custom workflow patterns for communication, documents, and handoffs.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/general-contractors',
    {
      title: 'AI Guidance for General Contractors',
      description: 'Find job information faster, keep field work moving, and explore practical AI guidance for general contracting owners, project coordinators, and operations teams.',
      imagePath: '/images/contractor-audiences/business-owners.png',
      imageAlt: 'General contractor reviewing active project plans and job records.',
    },
  ],
  [
    '/solutions/general-contractors',
    {
      title: 'AI Solutions for General Contractors',
      description: 'Explore role-specific operating solutions for general contracting business owners, project coordinators, and operations teams.',
      canonicalPath: '/general-contractors',
      robots: PRIVATE_ROBOTS,
      imagePath: '/images/contractor-audiences/business-owners.png',
    },
  ],
  [
    '/solutions/general-contractors/business-owners',
    {
      title: 'AI Solutions for General Contractors',
      description: 'Role-specific solutions for general contracting business owners, project coordinators, and operations teams.',
      canonicalPath: '/general-contractors',
      robots: PRIVATE_ROBOTS,
      imagePath: '/images/contractor-audiences/business-owners.png',
    },
  ],
  ...['project-managers', 'operations-teams'].map((legacyAudience) => [
    `/solutions/general-contractors/${legacyAudience}`,
    {
      title: 'AI Solutions for General Contractors',
      description: 'Role-specific solutions for general contracting business owners, project coordinators, and operations teams.',
      canonicalPath: '/general-contractors',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ] as const),
  [
    '/solutions/ai-workflows',
    {
      title: 'AI Workflows — Five-Step User Guide',
      description: 'Follow the B2W process from scoping and approved project context to JasonAI, optional Clara document workspaces, human review, and diligence.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/solutions/agentic-workflows',
    {
      title: 'JasonAI AI Assistant Pricing and ROI',
      description: 'Calculate potential ROI and review current JasonAI AI-assistant pricing, plus the planned roles for Clara and Gurge.',
      canonicalPath: '/pricing',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/solutions/compare-agents',
    {
      title: 'JasonAI AI Assistant Pricing and ROI',
      description: 'Calculate potential ROI and review current JasonAI AI-assistant pricing, plus the planned roles for Clara and Gurge.',
      canonicalPath: '/pricing',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/products',
    {
      title: 'B2W AI Assistants: Now, Next, and Future',
      description: "See JasonAI as B2W's current assistant, the workflows planned next, and the longer-term governed agent platform direction.",
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/products/agents',
    {
      title: 'B2W Agents and JasonAI',
      description: 'JasonAI is B2W’s current commercial agent for searching approved contractor communication and creating job summaries.',
      imagePath: jasonAiImages.contractorSignals,
    },
  ],
  [
    '/products/workflows',
    {
      title: 'B2W AI Assistant Workflows',
      description: 'See the product workflows B2W supports now, is developing, and may add later, explained through user actions and outcomes.',
      imagePath: jasonAiImages.contractorSignals,
    },
  ],
  [
    '/products/pricing',
    {
      title: 'JasonAI Pricing and WhatsApp Setup',
      description: 'JasonAI is $99 per month, with a one-time $2,000 WhatsApp integration and founder-led setup fee. Model the current workflow with the ROI calculator.',
      canonicalPath: '/pricing',
      robots: PRIVATE_ROBOTS,
      imagePath: jasonAiImages.contractorSignals,
    },
  ],
  [
    '/contact',
    {
      title: 'Contact B2W',
      description: 'Contact B2W about services, JasonAI, WhatsApp setup, partnerships, or a general business question.',
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/services/archive/2026-07-29',
    {
      title: 'Archived B2W Services Page — July 29, 2026',
      description: 'Archived snapshot of the former B2W consulting services page.',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/clara',
    {
      title: 'Clara — AI Document Workspace Concept',
      description:
        'Explore Clara, B2W’s customized AI document-workspace concept for approved cost libraries, standards, preferences, and review rules.',
      imagePath: brandImages.claraSocial,
      imageAlt: 'Clara by B2W mark on a light background.',
    },
  ],
  [
    '/solutions/ai-workflows/project-estimates',
    {
      title: 'Clara Project Estimate Workflow Concept',
      description:
        'See a concept for how Clara could turn a voice note into an organized project scope and a reviewable estimate using company cost preferences.',
      imagePath: brandImages.claraSocial,
      imageAlt: 'Clara by B2W mark on a light background.',
    },
  ],
  [
    '/solutions',
    {
      title: 'B2W AI Business Use Cases',
      description:
        'Start with a clear operating problem, then find the product or workflow that addresses it.',
      canonicalPath: '/solutions/business-use-cases',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/solutions/how-it-works',
    {
      title: 'How JasonAI Works for Contractors',
      description:
        'See how JasonAI searches approved contractor communication, creates summaries, and expands carefully as the core workflow earns trust.',
      canonicalPath: '/jasonai/how-it-works',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/solutions/questions',
    {
      title: 'JasonAI Questions and Waitlist',
      description:
        'Answers to common JasonAI questions about search, summaries, privacy, setup, pricing, and founding access for contractor businesses.',
      canonicalPath: '/jasonai/questions',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/solutions/privacy',
    {
      title: 'JasonAI Privacy Policy',
      description:
        'Privacy Policy for JasonAI by B2W, covering fieldwork communications, job context, connected tools, AI processing, data sharing, retention, and user controls.',
      canonicalPath: '/jasonai/privacy',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/jasonai',
    {
      title: 'JasonAI for Contractor Businesses',
      description:
        'JasonAI gives contractor teams a faster way to search approved job communication and turn long threads into clear summaries through WhatsApp.',
      imagePath: jasonAiImages.contractorSignals,
      imageAlt: 'Contractor job communication scattered across phones, notes, and work channels.',
    },
  ],
  [
    '/jasonai/pricing',
    {
      title: 'JasonAI AI Assistant Pricing and ROI',
      description:
        'Calculate potential ROI and review current JasonAI AI-assistant pricing, plus the planned roles for Clara and Gurge.',
      canonicalPath: '/pricing',
      robots: PRIVATE_ROBOTS,
      imagePath: brandImages.b2wSocial,
    },
  ],
  [
    '/jasonai/how-it-works',
    {
      title: 'How JasonAI Works for Contractors',
      description:
        'See how JasonAI searches approved contractor communication, creates summaries, and expands carefully as the core workflow earns trust.',
      imagePath: jasonAiImages.contractorSignals,
      imageAlt: 'Contractor job communication scattered across phones, notes, and work channels.',
    },
  ],
  [
    '/jasonai/questions',
    {
      title: 'JasonAI Questions and Waitlist',
      description:
        'Answers to common JasonAI questions about search, summaries, privacy, setup, pricing, and founding access for contractor businesses.',
      imagePath: jasonAiImages.contractorSignals,
      imageAlt: 'Contractor job communication scattered across phones, notes, and work channels.',
    },
  ],
  [
    '/jasonai/privacy',
    {
      title: 'JasonAI Privacy Policy',
      description:
        'Privacy Policy for JasonAI by B2W, covering fieldwork communications, job context, connected tools, AI processing, data sharing, retention, and user controls.',
      imagePath: jasonAiImages.contractorSignals,
      imageAlt: 'Contractor job communication scattered across phones, notes, and work channels.',
    },
  ],
  [
    '/internal',
    {
      title: 'B2W Executive Strategy',
      description: 'Private B2W business plan, product direction, and executive strategy resources.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/business-plan',
    {
      title: 'B2W Business Plan',
      description: 'Private B2W business plan and operating map covering growth, optimization, diligence, ownership, and execution tracking.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/services',
    {
      title: 'B2W Business Plan',
      description: 'Legacy route for the private B2W business plan and operating map.',
      canonicalPath: '/internal/business-plan',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal',
    {
      title: 'B2W Product Direction',
      description: 'Private B2W product-direction tracking tool built on the Gurge project-management concept.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/resources',
    {
      title: 'JasonAI Productization Prioritized Plan',
      description: 'Private B2W prioritized plan for moving JasonAI from a single-client demo to a repeatable, controlled product launch.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/resources/website-architecture',
    {
      title: 'B2W Website and Business Architecture',
      description: 'Private B2W architecture documents mapping the current website and business system, intended next state, and planned future state.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/products/clara',
    {
      title: 'Clara · Concept Phase',
      description: 'Private B2W product placeholder for Clara, held outside the current JasonAI productization sequence.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/workspace',
    {
      title: 'B2W Executive Resources',
      description: 'Legacy route for the private B2W executive resources strategy map.',
      canonicalPath: '/internal/resources',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product',
    {
      title: 'JasonAI Executive Strategy',
      description: 'JasonAI 24-month J-curve strategy for helping SMB general-contractor owners create measurable value from business communication.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product/performance-goals',
    {
      title: 'JasonAI Performance Goals',
      description: 'Private JasonAI performance goals and execution scorecard.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product/kpi-tracker',
    {
      title: 'JasonAI KPI Tracker',
      description: 'Private JasonAI KPI tracker for product and commercial performance.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product/profile',
    {
      title: 'JasonAI Executive Strategy',
      description: 'JasonAI 24-month J-curve strategy with five phases, executive ownership, KPI gates, goals, and execution tasks.',
      canonicalPath: '/internal/portal/product/executive-strategy',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product/executive-strategy',
    {
      title: 'JasonAI Interactive Executive Strategy',
      description: 'Interactive JasonAI operating document with five phases, KPI gates, measurable goals, accountable owners, and reportable execution tasks.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product/valuation',
    {
      title: 'JasonAI Product Valuation Model',
      description: 'Private scenario model for JasonAI recurring revenue, product value, and valuation drivers.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/portal/product/documentation',
    {
      title: 'JasonAI Product Documentation',
      description: 'Private JasonAI documentation structure for product, skills, architecture, safety, privacy, and operations.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/executive-strategy',
    {
      title: 'B2W Executive Strategy',
      description: 'Private B2W strategy and business-planning resources.',
      robots: PRIVATE_ROBOTS,
      canonicalPath: '/internal',
    },
  ],
  [
    '/strategy-v1/executive-strategy',
    {
      title: 'B2W Executive Strategy',
      description: 'Private B2W strategy and business-planning resources.',
      robots: PRIVATE_ROBOTS,
      canonicalPath: '/internal',
    },
  ],
  [
    '/brand/logo-verification',
    {
      title: 'B2W Logo Verification',
      description: 'Private visual verification page for the canonical B2W silhouette logo.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai',
    {
      title: 'JasonAI Executive Strategy',
      description: 'JasonAI 24-month J-curve strategy for helping SMB general-contractor owners create measurable value from business communication.',
      canonicalPath: '/internal/portal/product',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai/performance-goals',
    {
      title: 'JasonAI Performance Goals',
      description: 'Private JasonAI performance goals and execution scorecard.',
      canonicalPath: '/internal/portal/product/performance-goals',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai/kpi-tracker',
    {
      title: 'JasonAI KPI Tracker',
      description: 'Private JasonAI KPI tracker for product and commercial performance.',
      canonicalPath: '/internal/portal/product/kpi-tracker',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai/profile',
    {
      title: 'JasonAI Executive Strategy',
      description: 'JasonAI 24-month J-curve strategy with five phases, executive ownership, KPI gates, goals, and execution tasks.',
      canonicalPath: '/internal/portal/product/executive-strategy',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai/executive-strategy',
    {
      title: 'JasonAI Interactive Executive Strategy',
      description: 'Interactive JasonAI operating document with five phases, KPI gates, measurable goals, accountable owners, and reportable execution tasks.',
      canonicalPath: '/internal/portal/product/executive-strategy',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai/valuation',
    {
      title: 'JasonAI Product Valuation Model',
      description: 'Private scenario model for JasonAI recurring revenue, product value, and valuation drivers.',
      canonicalPath: '/internal/portal/product/valuation',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/internal/jason-ai/documentation',
    {
      title: 'JasonAI Product Documentation',
      description: 'Private JasonAI documentation structure for product, skills, architecture, safety, privacy, and operations.',
      canonicalPath: '/internal/portal/product/documentation',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/portal/JasonAI-Executive-Strategy',
    {
      title: 'JasonAI Executive Strategy',
      description: 'Legacy route for the JasonAI 24-month executive strategy.',
      canonicalPath: '/internal/portal/product/executive-strategy',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/borek-g-social-media-management',
    {
      title: 'Restaurant Marketing Profile for Borek-G in Falls Church, VA',
      description:
        'Review B2W\'s restaurant marketing profile for Borek-G covering local reputation, search visibility, Instagram opportunity, owned-channel conversion, and growth signals in Falls Church.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/borek-g-operations',
    {
      title: 'Restaurant Growth Proposal for Borek-G',
      description:
        'Review B2W\'s growth proposal for Borek-G, including local discovery strategy, content cadence, restaurant marketing priorities, and phased implementation recommendations.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/sabucnu-operations',
    {
      title: 'Operations Assessment for Sabucnu Contractors',
      description:
        'Operations analysis for Sabucnu Contractors covering workforce coordination, standard operating procedures, scheduling systems, and execution consistency.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/work/coffeeshop-financing/model',
    {
      title: 'Coffee Shop Financing Model by B2W',
      description:
        'Review B2W\'s financing model for a coffee shop project, including assumptions, cash flow framing, and lender-facing structure.',
      robots: PRIVATE_ROBOTS,
    },
  ],
  [
    '/about',
    {
      title: 'About B2W',
      description: 'Learn why B2W focuses exclusively on General Contracting and how JasonAI addresses project communication, job context, and reviewed workflows.',
      imagePath: brandImages.b2wSocial,
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

function toMetaDescription(description: string, maxLength = 160) {
  const normalized = description.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const shortened = normalized.slice(0, maxLength - 1).replace(/\s+\S*$/, '').replace(/[,:;\s]+$/, '');
  return `${shortened}…`;
}

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}

function buildMetadata(pathname: string, definition: SeoDefinition): SeoMetadata {
  const canonicalPath = normalizePathname(definition.canonicalPath ?? pathname);
  const robots = definition.robots ?? DEFAULT_ROBOTS;
  const resolvedImagePath = brandImages.b2wSocial;
  const imageUrl = resolvedImagePath ? toAbsoluteUrl(resolvedImagePath) : undefined;

  return {
    pathname,
    canonicalPath,
    title: withBrand(definition.title),
    description: toMetaDescription(definition.description),
    robots,
    type: definition.type ?? 'website',
    imageUrl,
    imageAlt: imageUrl ? DEFAULT_PUBLIC_IMAGE_ALT : undefined,
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
    robots: PRIVATE_ROBOTS,
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

function buildTierMetadata(pathname: string) {
  const content = tierPageContent[pathname];

  if (!content) {
    return null;
  }

  return buildMetadata(pathname, {
    title: content.seoTitle,
    description: content.description,
  });
}

export function resolveSeoMetadata(pathname: string): SeoMetadata {
  const normalizedPathname = normalizePathname(pathname);

  const versionPrefix = ['/v1', '/v2', '/v3'].find((prefix) => normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`));
  if (versionPrefix) {
    const versionlessPathname = normalizePathname(normalizedPathname.replace(versionPrefix, '') || '/');
    const livePathname = versionPrefix === '/v1' && versionlessPathname === '/estimates'
      ? '/clara'
      : versionlessPathname;
    const archivedDefinition = versionPrefix === '/v1'
      ? normalizedPathname === '/v1'
        ? directRoutes.get('/v1')
        : mainExperienceRoutes.get(livePathname)
      : directRoutes.get(livePathname);
    const liveMetadata = archivedDefinition
      ? buildMetadata(livePathname, archivedDefinition)
      : resolveSeoMetadata(livePathname);

    return {
      ...liveMetadata,
      pathname: normalizedPathname,
      canonicalPath: livePathname,
      robots: PRIVATE_ROBOTS,
      description: versionPrefix === '/v3' && livePathname === '/'
        ? 'Archived B2W experience featuring AI assistants, contractor guidance, pricing, and the solution finder.'
        : versionPrefix === '/v2'
          ? liveMetadata.description.replace('AI guidance', 'AI solutions')
          : liveMetadata.description,
      title: versionPrefix === '/v3'
        ? livePathname === '/'
          ? withBrand('V3 — AI Assistants for Contractors')
          : liveMetadata.title.replace('Products', 'AI Assistants').replace('Product Workflows', 'AI Assistant Workflows').replace('Solutions', 'Guidance')
        : versionPrefix === '/v2'
          ? livePathname === '/'
            ? withBrand('Tools for Contractors to Succeed')
            : liveMetadata.title.replace('AI Assistants', 'Products').replace('AI Assistant Workflows', 'Product Workflows').replace('Guidance', 'Solutions')
        : liveMetadata.title,
    };
  }

  const directDefinition = directRoutes.get(normalizedPathname) ?? retiredMainRedirectRoutes.get(normalizedPathname);

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

  const tierMetadata = buildTierMetadata(normalizedPathname);
  if (tierMetadata) {
    return tierMetadata;
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

  const definedOverride = Object.fromEntries(
    Object.entries(override).filter(([, value]) => value !== undefined),
  ) as SeoOverride;

  return {
    ...base,
    ...definedOverride,
    canonicalPath: normalizePathname(definedOverride.canonicalPath ?? base.canonicalPath),
    title: withBrand(definedOverride.title ?? base.title),
    imageUrl: base.imageUrl,
    imageAlt: base.imageAlt,
    twitterCard: base.imageUrl ? 'summary_large_image' : 'summary',
  };
}

export function listStaticSeoRoutes() {
  const paths = new Set<string>([
    ...directRoutes.keys(),
    ...retiredMainRedirectRoutes.keys(),
    ...versionedArchiveRoutes,
    ...v3ArchiveRoutes,
    ...v4ArchiveRoutes,
    ...Object.keys(servicePageContent),
    ...Object.keys(expertisePages),
    ...Object.keys(explainerContent),
    ...Object.keys(tierPageContent),
    ...allCapabilities.map((capability) => `/capabilities/${capability.slug}`),
  ]);

  return Array.from(paths)
    .sort((left, right) => left.localeCompare(right))
    .map((pathname) => resolveSeoMetadata(pathname));
}
