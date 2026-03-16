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
    proposalTitle: 'Proposal for Uyghur Eats Acquisition Advisory',
    proposalSummary:
      'Prepare Uyghur Eats for a cleaner acquisition process by packaging the business properly, validating the numbers, and giving qualified buyers a diligence-backed view of the opportunity.',
    heroHighlights: [
      'Distinct Uyghur cuisine concept with limited direct competition in the corridor',
      'Strong Washington, DC location with affluent neighborhood demand and proven restaurant use',
      'Clear opportunity to reduce buyer uncertainty through structured diligence and packaging',
    ],
    problemTitle: 'Problem',
    problemBody:
      'Uyghur Eats may be attractive to a buyer, but restaurant deals break down when the business is not packaged clearly enough for outside review. Sellers often do not know how to frame the asset, buyers do not trust unverified numbers, and both sides lose time because the operating story, risk profile, and upside case are not documented in a disciplined format.',
    solutionTitle: 'Our Solution',
    solutionBody:
      'B2W proposes an acquisition-readiness and diligence process that starts with business packaging, moves into financial and operational review, and ends with a buyer-facing roadmap. The objective is to make Uyghur Eats easier to evaluate, easier to position, and safer for a qualified buyer to underwrite.',
    scopeHeading: 'Scope Options',
    scopeIntro:
      'Select the advisory scope that matches the stage of the process. Each option builds on the prior one so the project can start with packaging only or continue through buyer diligence and transaction support.',
    options: [
      {
        id: 'option-one',
        title: 'Option One: Deal Readiness Sprint',
        price: '$1,500 one-time',
        timeline: '2-week advisory sprint',
        summary: 'A focused engagement to package Uyghur Eats for buyer conversations and establish a more credible acquisition narrative.',
        offerings: [
          'Business overview and positioning memo',
          'Blind profile / opportunity teaser',
          'Initial valuation framing and buyer objection map',
          'Diligence request list for records, lease, and operating materials',
        ],
      },
      {
        id: 'option-two',
        title: 'Option Two: Diligence and Buyer Package',
        price: '$3,000 one-time',
        timeline: '3-4 week diligence cycle',
        summary: 'A deeper acquisition package that verifies the foundation of the business and creates a buyer-facing diligence report.',
        offerings: [
          'Includes everything in Option One',
          'P&L and revenue-quality review based on documents provided',
          'Operational bottleneck and margin-leakage analysis',
          'Lease and occupancy risk review',
          'Deep-dive diligence report for qualified buyers',
          '90-day post-acquisition growth roadmap',
        ],
      },
      {
        id: 'option-three',
        title: 'Option Three: Acquisition Advisory Through Buyer Process',
        price: '$6,000 fixed advisory fee',
        timeline: '6-8 week advisory window',
        summary: 'A broader engagement for projects that need seller packaging, buyer diligence support, and structured advisory through active conversations.',
        offerings: [
          'Includes everything in Option One and Option Two',
          'Qualified buyer outreach support using blind-profile materials',
          'NDA and diligence-flow coordination',
          'Management of buyer questions and follow-up data requests',
          'Offer comparison support and transaction-readiness guidance',
          'Any success-based compensation remains subject to separate legal review and compliant documentation',
        ],
      },
    ],
    terms: [
      'Services are limited to the selected scope and to advisory, analysis, and documentation support.',
      'B2W is not acting as a licensed business broker unless separately engaged under legally compliant documentation.',
      'All analysis depends on the accuracy and completeness of records provided by the client or other stakeholders.',
      'Payment is due at the start of the engagement unless otherwise agreed in writing.',
      'Confidential business information, financial records, and buyer materials will be handled as non-public information.',
      'Any outreach to buyers, transaction structuring support, or performance-based fees may require additional documentation and legal review before commencement.',
      'B2W does not guarantee a sale, a target valuation, or a specific transaction timeline.',
      'Legal, tax, and brokerage services are excluded unless separately retained through the appropriate licensed professionals.',
    ],
    assumptions: [
      'Client will provide timely access to core records such as sales summaries, P&Ls, lease materials, and basic operating context needed for the review.',
      'Blind-profile distribution and buyer-facing materials will omit identity-sensitive details until prospects are qualified.',
      'All valuation commentary is advisory in nature and should be treated as a strategic estimate, not a formal fairness opinion or appraisal.',
      'If the engagement expands into active buyer process management, B2W and the client will confirm the permitted role and documentation before proceeding.',
    ],
    acceptanceHeading: 'Accept Terms and Sign',
    acceptanceIntro:
      'Review the selected acquisition-advisory scope, confirm the terms and assumptions, and complete the digital signature to approve the engagement.',
    successHeading: 'The signed proposal has been recorded.',
    successBody:
      'A signed transcript and secure document link have been prepared for the signer and for B2W internal follow-up.',
  },
};

export function getProposalContent(pathname: string): ProposalContent | null {
  return proposalsByPath[pathname] ?? null;
}
