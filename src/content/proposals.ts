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
    scopeHeading: 'Scope Options',
    scopeIntro:
      'Each scope below carries its own commercial structure. Multi-option proposals can be selected at signing; single-option proposals can use the same layout without the package chooser.',
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
};

export function getProposalContent(pathname: string): ProposalContent | null {
  return proposalsByPath[pathname] ?? null;
}
