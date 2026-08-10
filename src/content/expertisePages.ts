import type { PublicProjectArea } from '../components/forms/LeadForm';

export type ExpertisePageSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type ExpertisePageContent = {
  slug: 'growth' | 'optimization' | 'diligence';
  title: string;
  seoTitle: string;
  eyebrow: string;
  description: string;
  summary: string;
  profileLens: string;
  profileInputs: string[];
  priorities: string[];
  exampleMoves: string[];
  outcomes: string[];
  fit: string[];
  engagementNote: string;
  preselectedProjectAreas: PublicProjectArea[];
  sections: ExpertisePageSection[];
};

export const expertisePages: Record<string, ExpertisePageContent> = {
  '/expertise/growth': {
    slug: 'growth',
    eyebrow: 'Expertise',
    title: 'Growth',
    seoTitle: 'Growth Strategy and Execution for SMBs',
    description:
      'B2W growth engagements turn marketing data, operating signals, and financial context into a clearer client profile, then prioritize the moves most likely to expand demand and strengthen brand position.',
    summary:
      'Growth starts with understanding how the business is currently performing across market visibility, internal execution, and financial reality. From there, we decide what should be amplified, rebuilt, or newly introduced to move the business forward.',
    profileLens:
      'We build a client profile from marketing data, operational performance, and financials so growth decisions are tied to the actual condition of the business rather than assumptions.',
    profileInputs: [
      'Marketing data to understand visibility, demand capture, brand perception, and channel performance',
      'Operational performance to test whether the business can support additional demand without breaking execution',
      'Financials to confirm which growth moves are commercially sound and where returns are most likely',
    ],
    priorities: [
      'Clarify where growth is being blocked: awareness, conversion, experience, or delivery capacity',
      'Sequence the highest-leverage improvements before investing in broad execution',
      'Match the business with the right creative, technical, or strategic support needed for the next level',
    ],
    exampleMoves: [
      'Increase visibility on social media with a sharper content system and channel plan',
      'Redesign a website so it reflects the quality of the business and converts more effectively',
      'Bring in a designer, strategist, or architect when the physical or digital brand needs to evolve',
    ],
    outcomes: [
      'A clearer growth profile showing where demand is being won or lost',
      'A prioritized roadmap of brand, channel, and experience improvements',
      'Recommendations grounded in both ambition and operational reality',
    ],
    fit: [
      'Businesses with solid fundamentals but inconsistent demand',
      'Owners preparing to reposition the business for a stronger market presence',
      'Teams that need clearer priorities before spending on marketing or redesign work',
    ],
    engagementNote:
      'Growth work can stay advisory or extend into implementation depending on whether the client needs strategy, partner selection, or direct execution support.',
    preselectedProjectAreas: ['Growth'],
    sections: [
      {
        title: 'What growth means at B2W',
        body:
          'Growth is not treated as a marketing-only problem. It is a business expansion problem that starts with a full read on what the company is communicating, how it is operating, and what it can support financially.',
        bullets: [
          'We diagnose before recommending channels, campaigns, or redesign work',
          'We separate surface-level visibility issues from deeper structural constraints',
          'We align growth recommendations with the actual next stage of the business',
        ],
      },
      {
        title: 'How we prioritize solutions',
        body:
          'Once the client profile is built, we determine which interventions create the strongest lift relative to risk, budget, and readiness.',
        bullets: [
          'Social media and demand-generation strategy when attention is the constraint',
          'Website, brand, or customer experience redesign when perception or conversion is the constraint',
          'Specialist sourcing when the right external operator is needed to move faster',
        ],
      },
    ],
  },
  '/expertise/optimization': {
    slug: 'optimization',
    eyebrow: 'Expertise',
    title: 'Optimization',
    seoTitle: 'Business Optimization and Decision Modeling for SMBs',
    description:
      'B2W optimization engagements translate business data into models, decision frameworks, and operating clarity so owners can evaluate risk before making major moves.',
    summary:
      'Optimization means developing a stronger decision model for the business. We use the client profile to understand performance, identify pressure points, and build the analytical structure needed to move with more confidence.',
    profileLens:
      'We combine marketing data, operational performance, and financials to understand what the business is doing well, where risk is accumulating, and which decisions need better framing.',
    profileInputs: [
      'Marketing data to measure acquisition efficiency and demand quality',
      'Operational performance to find process friction, execution drag, and delivery risk',
      'Financials to model value, return scenarios, and downside exposure',
    ],
    priorities: [
      'Turn scattered business information into a usable model for ownership decisions',
      'Quantify tradeoffs before expansion, hiring, property moves, or capital commitments',
      'Reduce uncertainty by giving the owner a defensible view of value and risk',
    ],
    exampleMoves: [
      'Develop a valuation model for the business or for a major asset-related decision',
      'Pressure-test an expansion plan before committing capital or increasing overhead',
      'Model the impact of hires, pricing changes, or operational restructuring',
    ],
    outcomes: [
      'A decision-ready model tied to current business performance',
      'Clearer visibility into risk, upside, and sequencing',
      'More grounded choices around growth, expansion, hiring, or sale preparation',
    ],
    fit: [
      'Owners facing a major decision and needing stronger analytical support',
      'Businesses with growing complexity but weak internal modeling',
      'Teams that need a more rigorous basis for expansion or restructuring',
    ],
    engagementNote:
      'Optimization work can produce a discrete decision model or continue into operational implementation once the preferred path is clear.',
    preselectedProjectAreas: ['Due Diligence'],
    sections: [
      {
        title: 'What optimization means at B2W',
        body:
          'Optimization is about making the business more legible to itself. We structure the business so key decisions can be evaluated with less guesswork and more control.',
        bullets: [
          'We convert raw business information into decision support',
          'We focus on choices that carry real operational or financial consequence',
          'We build models that help owners move without avoidable exposure',
        ],
      },
      {
        title: 'Where this becomes valuable',
        body:
          'The work is most useful when the next move is meaningful enough that intuition alone is no longer sufficient.',
        bullets: [
          'Selling a property or testing whether that sale improves the business position',
          'Evaluating whether expansion is justified by actual performance',
          'Making new hires with a clearer read on affordability and expected return',
        ],
      },
    ],
  },
  '/expertise/diligence': {
    slug: 'diligence',
    eyebrow: 'Expertise',
    title: 'Diligence',
    seoTitle: 'Business Diligence Preparation for SMBs',
    description:
      'B2W diligence engagements help businesses gather, organize, and prepare the information needed to move into their next phase with less friction and stronger readiness.',
    summary:
      'Diligence is the work of getting a business ready to proceed smoothly. We help owners collect the right records, organize key materials, and close gaps that can slow down future transactions, transitions, or strategic moves.',
    profileLens:
      'The client profile tells us what information matters most, what is missing, and where the business needs more structure before it can move confidently into its next stage.',
    profileInputs: [
      'Marketing data to document positioning, customer traction, and external credibility',
      'Operational performance to organize workflows, responsibilities, and supporting records',
      'Financials to assemble the materials needed for review, valuation, or transition planning',
    ],
    priorities: [
      'Collect the information required for a cleaner next step',
      'Reduce back-and-forth by organizing materials before they are requested under pressure',
      'Help the business present itself with more coherence to partners, buyers, lenders, or internal stakeholders',
    ],
    exampleMoves: [
      'Assemble documentation needed for a sale, transition, or partnership process',
      'Organize operating records so the business is easier to review and understand',
      'Create a smoother handoff environment before major strategic changes',
    ],
    outcomes: [
      'A more complete and usable record of the business',
      'Less friction during review, transition, or transaction processes',
      'Greater readiness for the business to move forward without avoidable delays',
    ],
    fit: [
      'Owners preparing for a sale, transition, financing, or major change',
      'Businesses with valuable information spread across too many systems',
      'Teams that need structure before entering a formal review process',
    ],
    engagementNote:
      'Diligence work often overlaps operations and financial preparation, so engagements may preselect both areas when the business needs documentation and readiness support together.',
    preselectedProjectAreas: ['Due Diligence', 'Optimization'],
    sections: [
      {
        title: 'What diligence means at B2W',
        body:
          'Diligence is not just paperwork. It is readiness work that helps the business proceed with fewer surprises, better organization, and more confidence when outside review begins.',
        bullets: [
          'We identify which records and materials matter for the client’s next move',
          'We organize information so it is easier to review and easier to maintain',
          'We reduce avoidable delays caused by missing, unclear, or scattered documentation',
        ],
      },
      {
        title: 'How it supports the future state',
        body:
          'Well-run diligence creates smoother transitions because the business is already prepared to answer questions, support decisions, and show its structure clearly.',
        bullets: [
          'Supports sale and transition readiness',
          'Helps expansion or financing conversations move with less friction',
          'Creates a more orderly base for the next operator, partner, or investor review',
        ],
      },
    ],
  },
};

export function getExpertisePageByPath(pathname: string) {
  return expertisePages[pathname];
}

export function getExpertisePageBySlug(slug: string) {
  return Object.values(expertisePages).find((page) => page.slug === slug);
}
