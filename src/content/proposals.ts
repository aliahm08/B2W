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
    proposalTitle: 'Proposal for Marketing Systems and Growth',
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
    proposalTitle: 'Proposal for Uyghur Eats Property Sale Advisory',
    proposalSummary:
      'Launch a diligence-as-a-service process around the potential sale of Uyghur Eats by packaging the business properly, controlling information flow, and turning buyer uncertainty into paid diligence access.',
    heroHighlights: [
      'Diligence-as-a-service model built to reduce information asymmetry on both sides of the sale',
      'Distinct restaurant concept in a strong DC corridor with limited direct category competition',
      'Clear paid path from blind-profile interest to diligence unlock and custom review',
    ],
    problemTitle: 'Problem',
    problemBody:
      'Restaurant sale opportunities stall when the seller does not know how to package the business and the buyer does not trust the numbers. The issue is not just visibility. It is information asymmetry. Without a controlled diligence process, the seller underprices the asset, the buyer sees too much risk, and both sides lose time because the business has not been translated into a buyer-ready format.',
    solutionTitle: 'Our Solution',
    solutionBody:
      'B2W proposes a diligence-led property sale process that starts with an Analysis Profile and Blind Profile, moves into financial and operational review, and ends with a buyer-facing diligence package and 90-day roadmap. The model is designed to let B2W earn on packaging, buyer certainty, and custom work without leading as a traditional broker.',
    scopeHeading: 'Scope of Work',
    scopeIntro:
      'Select the scope that matches how far B2W should go in launching the sale process. Each option builds on the prior one, from initial packaging through buyer-facing diligence and active process support.',
    options: [
      {
        id: 'option-one',
        title: 'Option One: Analysis Profile and Blind Profile Setup',
        price: '$250-$650 one-time',
        timeline: '2-week validation sprint',
        summary: 'A seller-side packaging engagement focused on building the first analysis profile, blind profile, and valuation framing needed to test buyer interest.',
        offerings: [
          'Analysis Profile for internal and client-facing positioning',
          'Blind Profile / teaser memo for controlled buyer outreach',
          'Initial valuation framing and buyer objection map',
          'Diligence request list for books, lease, and operating materials',
          'Includes base packaging fee and book-access fee structure as defined in the proposal',
        ],
      },
      {
        id: 'option-two',
        title: 'Option Two: Buyer Diligence Package',
        price: '$3,000 one-time',
        timeline: '3-4 week diligence cycle',
        summary: 'A buyer-facing diligence package that monetizes certainty through a free brief, a paid audit, and a post-acquisition roadmap.',
        offerings: [
          'Phase 1 Brief: free Opportunity Memo / Blind Profile',
          'Phase 2 Audit: $1,000 deep-dive diligence report',
          'Phase 3 Roadmap: $2,000 actionable 90-day growth plan',
          'P&L review, operational bottleneck analysis, and lease review',
          'Optional $500 Phase 2 credit toward Phase 3 if the buyer continues',
        ],
      },
      {
        id: 'option-three',
        title: 'Option Three: Full Deal Arbitrage Launch',
        price: 'Custom + optional performance structure',
        timeline: '6-8 week advisory window',
        summary: 'A broader diligence-as-a-service launch covering seller packaging, buyer outreach, unlock monetization, and custom review support.',
        offerings: [
          'Includes everything in Option One and Option Two',
          'Private-buyer outreach using controlled Blind Profile materials',
          'Diligence unlock workflow and buyer follow-up management',
          'Custom crack-in-the-foundation review work priced separately',
          'Seller-side value-lift logic tied to a pre-agreed minimum threshold',
          'Any success-based compensation remains subject to legal review and compliant documentation',
        ],
      },
    ],
    terms: [
      'Services are limited to advisory, analysis, documentation, and diligence support within the selected scope.',
      'B2W is not acting as a licensed business broker unless separately engaged under legally compliant documentation.',
      'Any success-based fee, commission, or lift-based compensation is subject to legal review before being offered or invoiced.',
      'All analysis depends on the completeness and accuracy of records provided by the client or other stakeholders.',
      'Blind Profile materials must protect the client from direct bypass while still proving the opportunity is real.',
      'Payment is due according to the selected scope unless otherwise agreed in writing.',
      'B2W does not guarantee a sale, target valuation, or buyer conversion.',
      'Legal, tax, brokerage, and securities advice are excluded unless separately retained through licensed professionals.',
    ],
    assumptions: [
      'Client will provide timely access to books, P&Ls, lease materials, and core operating context required for the analysis.',
      'The Analysis Profile is the primary unlocked deliverable, while public-facing project references stay generalized as an M&A Property Sale.',
      'Blind Profile distribution and buyer-facing materials will omit identity-sensitive details until prospects are qualified.',
      'All valuation commentary is advisory in nature and should not be treated as a formal appraisal or fairness opinion.',
      'If the engagement expands into active buyer process management, B2W and the client will confirm the permitted role and documentation before proceeding.',
    ],
    acceptanceHeading: 'Accept Terms and Sign',
    acceptanceIntro:
      'Review the selected property-sale advisory scope, confirm the terms and assumptions, and complete the digital signature to approve the engagement.',
    successHeading: 'The signed proposal has been recorded.',
    successBody:
      'A signed transcript and secure document link have been prepared for the signer and for B2W internal follow-up.',
  },
};

export function getProposalContent(pathname: string): ProposalContent | null {
  return proposalsByPath[pathname] ?? null;
}
