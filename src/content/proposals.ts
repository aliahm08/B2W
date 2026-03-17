export type ProposalScopeOption = {
  id: string;
  title: string;
  price: string;
  timeline: string;
  summary: string;
  offerings: string[];
};

export type ProposalContent = {
  proposalTitle: string;
  proposalSummary: string;
  heroHighlights: string[];
  problemTitle: string;
  problemBody: string;
  solutionTitle: string;
  solutionBody: string;
  scopeHeading: string;
  scopeIntro: string;
  options: ProposalScopeOption[];
  terms: string[];
  assumptions: string[];
  acceptanceHeading: string;
  acceptanceIntro: string;
  successHeading: string;
  successBody: string;
};

export const proposalsByPath: Record<string, ProposalContent> = {
  '/borek-g-operations': {
    proposalTitle: 'Turkish Bistro in Falls Church, VA',
    proposalSummary:
      'Bring more people into Borek-G consistently by packaging the food, story, and brand more clearly across social, local discovery, and digital channels.',
    heroHighlights: [
      'Strong neighborhood reputation with loyal repeat traffic',
      'Distinct product story and visual food appeal that can translate well to short-form content',
      'Clear opportunity to turn in-store demand into stronger digital discovery and retention',
    ],
    problemTitle: 'Problem',
    problemBody:
      'Borek-G already appears to have product credibility and local demand, but the business is under-packaged digitally. The current gap is not whether people like the food. The gap is consistent discovery, stronger storytelling, and a repeatable system that turns interest into recurring attention and sales.',
    solutionTitle: 'Our Solution',
    solutionBody:
      'B2W proposes a marketing system that tightens brand presentation, builds a repeatable content cadence, and gives Borek-G a clearer operating rhythm for local awareness, customer recall, and growth. The proposal below is structured in selectable scopes so the business can choose advisory-only support or a more hands-on execution model.',
    scopeHeading: 'Scope Options',
    scopeIntro:
      'Select a scope below to see the exact deliverables, pricing, and timeline. The selected option is retained locally and carries through into the signing drawer automatically.',
    options: [
      {
        id: 'option-one',
        title: 'Option One: Basic Marketing Strategy Consultation',
        price: '$1,200 one-time',
        timeline: '3-month advisory window',
        summary: 'A strategy-first engagement focused on diagnosing the current marketing stack and defining the next 3-6 months of action.',
        offerings: [
          'Detailed analysis of Instagram, TikTok, Google Business, Yelp, Facebook, and email',
          '3-5 specific strategies to implement over the next 3-6 months',
          '6 hours of dedicated consultation delivered across the 3-month window',
        ],
      },
      {
        id: 'option-two',
        title: 'Option Two: Comprehensive Marketing Strategy & Implementation',
        price: '$1,750 onboarding fee + $2,000 per month',
        timeline: '3-month minimum term, then month to month',
        summary: 'An operating package that combines strategy with ongoing channel execution, content creation, and monthly reporting.',
        offerings: [
          'Includes everything in Option One',
          'Social media marketing across TikTok, Instagram, Facebook, Yelp, Google Business, and email',
          '2 onsite sessions per month',
          '3-4 short-form videos per week and 3-4 curated stories per week',
          'Monthly performance summary covering reach, engagement, and content insights',
        ],
      },
      {
        id: 'option-three',
        title: 'Option Three: End-to-End Marketing and Digital Presence',
        price: 'Pricing finalized after discovery',
        timeline: 'Timeline defined during scoped discovery',
        summary: 'A broader digital presence engagement for clients who want the recurring marketing system plus website and search improvements.',
        offerings: [
          'Includes everything in Option One and Option Two',
          'Website revamp and online ordering system',
          'SEO optimization',
          'Expanded execution scope priced after discovery and technical review',
        ],
      },
    ],
    terms: [
      'Services will be limited to the offerings outlined in the selected scope.',
      'Posting frequency is based on the selected package and may vary depending on performance, holidays, and promotions.',
      'Services are delivered according to a predefined content schedule or recurring cadence. Unplanned or last-minute promotional requests fall outside guaranteed scope and may be declined or deferred.',
      'Option Two and Option Three require an initial minimum term of 3 months, then continue month to month unless terminated by either party with 14 days written notice.',
      'Payment is due at the beginning of each service period. Late payment may result in paused services.',
      'Advertising spend is separate from service fees and is paid directly by the client to the ad platforms.',
      'We do not guarantee specific sales, foot traffic, or revenue results.',
      'Both parties agree to keep non-public business information confidential.',
    ],
    assumptions: [
      'Content will be created using a mix of onsite filming and existing in-store footage. Creative direction and execution are determined by B2W based on performance, best practices, and brand alignment.',
      'Unless otherwise agreed in writing, content does not require pre-approval prior to posting except for limited factual or brand corrections.',
      'Client retains ownership of all social media accounts and grants appropriate access for content and advertising management during the engagement.',
      'All content created during the engagement may be used by the client for marketing purposes. B2W reserves the right to use content for portfolio, case studies, and promotional materials.',
    ],
    acceptanceHeading: 'Accept Terms and Sign',
    acceptanceIntro:
      'Review the selected scope, confirm the terms and assumptions, share any final notes, and complete the digital signature to accept this proposal.',
    successHeading: 'The signed proposal has been recorded.',
    successBody:
      'A transcript and secure document link have been prepared for the signer and for B2W internal follow-up.',
  },
  '/uyghur-eats-acquisition': {
    proposalTitle: 'Exit Strategy for High-End Restaurant in Washington, DC',
    proposalSummary:
      'Launch a low-friction property-sale profile for Uyghur Eats, then layer in deeper buyer diligence and AI-assisted negotiation support only if the owner wants more serious, better-qualified buyer conversations.',
    heroHighlights: [
      'Entry option is intentionally light: publish a basic website profile and pay only for live leads B2W generates',
      'Upgrade path adds a deeper analysis profile with buyer scenarios, earnings views, and interactive diligence visuals',
      'Custom add-ons can layer in inspector data, a negotiation-aware AI agent, and managed buyer communication workflows',
    ],
    problemTitle: 'Problem',
    problemBody:
      'Restaurant sale opportunities stall when the listing is too thin for serious buyers and too manual for the owner to manage well. If the page only says the business is for sale, buyers hesitate. If every question has to be handled manually, the owner loses speed and leverage. The gap is not just visibility. It is packaging, clarity, and controlled follow-through.',
    solutionTitle: 'Our Solution',
    solutionBody:
      'B2W proposes a staged sale-support model. Option One gets the property on the site quickly with clear lead economics. Option Two upgrades the opportunity into a buyer-facing analysis dashboard with scenario-based financials. Option Three extends that dashboard with custom diligence add-ons, inspector data layers, and an AI agent that can answer questions and help manage negotiations using owner-approved guardrails.',
    scopeHeading: 'Scope of Work',
    scopeIntro:
      'Select the scope that matches how much depth and automation the owner wants. Each option builds on the prior one, from a lightweight website listing through an interactive diligence page and AI-supported buyer handling.',
    options: [
      {
        id: 'option-one',
        title: 'Option One: Basic Property Sale Profile',
        price: '$100 publish fee + $100 per lead',
        timeline: '3-5 business days to launch',
        summary: 'A lightweight property-sale profile published on the B2W website, designed to create immediate visibility without committing the owner to a full diligence buildout.',
        offerings: [
          'Basic website profile for the property sale with approved positioning copy and buyer hooks',
          'Lead capture routed through B2W so the owner only pays per real lead generated',
          'Simple qualification framing to avoid low-signal inquiries',
          'Posting, light maintenance, and lead handoff coordination inside the listing flow',
          'Best for testing demand before investing in deeper buyer diligence materials',
        ],
      },
      {
        id: 'option-two',
        title: 'Option Two: Interactive Analysis Profile',
        price: '$1,000 one-time',
        timeline: '7-10 business days',
        summary: 'A deeper buyer-facing webpage that packages the business into a more serious analysis experience with mockup-ready financial and earnings scenarios.',
        offerings: [
          'Includes the basic property sale profile foundation',
          'Interactive webpage with business overview, scenario-based financial visuals, and diligence framing',
          'Mock or owner-provided financial story translated into buyer-readable earnings ranges',
          'Structured sections for current operations, upside case, and buyer-specific scenario analysis',
          'Designed to attract more serious buyers by reducing ambiguity earlier in the process',
        ],
      },
      {
        id: 'option-three',
        title: 'Option Three: Custom Diligence Add-ons + AI Agent',
        price: 'Custom add-on scope',
        timeline: 'Scoped after data review',
        summary: 'A custom layer on top of the analysis profile that can incorporate inspector data, bespoke diligence modules, and an AI sales agent positioned to answer buyer questions and manage negotiation flow.',
        offerings: [
          'Includes everything in Option Two',
          'Custom dashboards or add-ons built from inspector reports and deeper property diligence inputs',
          'AI agent embedded in the webpage to answer recurring buyer questions using approved source material',
          'Negotiation-support workflows so the agent can frame offers, objections, and next steps on the owner’s behalf',
          'Custom sales-management logic scoped only after the owner confirms desired guardrails and data access',
        ],
      },
    ],
    terms: [
      'Services are limited to the deliverables listed in the selected option unless expanded in writing.',
      'The $100 lead fee in Option One applies to each lead generated through the B2W listing flow and introduced to the owner.',
      'B2W is providing consulting, publishing, analysis, and workflow support, not licensed brokerage services unless separately documented and legally compliant.',
      'All financial visuals, buyer scenarios, and diligence narratives depend on the quality and completeness of the owner-provided information.',
      'Custom AI, inspector-data, and negotiation-support add-ons are quoted separately after scope and data availability are reviewed.',
      'Payment timing follows the selected scope unless otherwise agreed in writing.',
      'B2W does not guarantee a sale, target valuation, or buyer conversion.',
      'Legal, tax, brokerage, and securities advice are excluded unless separately retained through licensed professionals.',
    ],
    assumptions: [
      'Client will provide the core business context, approved positioning, and any records needed to support the selected profile depth.',
      'Option Two scenario modeling is advisory and presentation-oriented unless backed by complete verified financial records.',
      'Any AI agent behavior will be constrained to owner-approved facts, positioning, and negotiation guardrails.',
      'Custom add-ons involving inspection findings, diligence documents, or automated sales workflows require additional scoping before implementation.',
      'All valuation commentary is advisory in nature and should not be treated as a formal appraisal or fairness opinion.',
    ],
    acceptanceHeading: 'Accept Terms and Sign',
    acceptanceIntro:
      'Review the selected property-sale support scope, confirm the terms and assumptions, and complete the digital signature to approve the engagement.',
    successHeading: 'The signed proposal has been recorded.',
    successBody:
      'A signed transcript and secure document link have been prepared for the signer and for B2W internal follow-up.',
  },
};

export function getProposalContent(pathname: string): ProposalContent | null {
  return proposalsByPath[pathname] ?? null;
}
