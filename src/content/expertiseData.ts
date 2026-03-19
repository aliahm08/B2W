export type Tier = 'Advisory' | 'Consulting' | 'Implementation';
export type Category = 'Growth' | 'Optimization' | 'M&A';

export interface ExpertiseCell {
  value: string;
  deliverable: string;
  terms: string;
}

export type ExpertiseMatrix = Record<Tier, Record<Category, ExpertiseCell>>;

export const tiers: Tier[] = ['Advisory', 'Consulting', 'Implementation'];
export const categories: Category[] = ['Growth', 'Optimization', 'M&A'];

export const categoryDescriptions: Record<Category, string> = {
  Growth: 'Expand reach, build brand, and acquire customers.',
  Optimization: 'Streamline operations and improve execution across your business.',
  'M&A': 'Prepare, position, and close a sale.',
};

export const tierDescriptions: Record<Tier, string> = {
  Advisory: 'Strategic guidance and deliverables with minimal ongoing involvement.',
  Consulting: 'Hands-on, recurring engagement over a defined period.',
  Implementation: 'Full-scope execution — we build and operate the solution.',
};

export const expertiseMatrix: ExpertiseMatrix = {
  Advisory: {
    Growth: {
      value: '$1,200',
      deliverable: 'Marketing Strategy',
      terms: '1 payment on 3 month contingency',
    },
    Optimization: {
      value:
        'Identifies inefficiencies and creates a clearer path to improvement',
      deliverable:
        'Process audits, workflow mapping, SOP recommendations, KPI design, reporting structure',
      terms: 'Includes findings summary and prioritized recommendations',
    },
    'M&A': {
      value: '$1,200',
      deliverable: 'Sale Profile',
      terms: 'Fixed cost for a buyer-facing sale profile',
    },
  },
  Consulting: {
    Growth: {
      value: '$3,000 – $5,000',
      deliverable: 'Social Media Campaign',
      terms: 'Per month for 3 months minimum',
    },
    Optimization: {
      value:
        'Builds stronger execution through better workflows and accountability',
      deliverable:
        'Workflow optimization, team accountability systems, sales process refinement, admin process improvement, operational planning',
      terms: 'Structured over a defined engagement period',
    },
    'M&A': {
      value: '$2,000 - $6,000',
      deliverable: 'Value Modeling',
      terms: 'Scoped to business complexity and model depth',
    },
  },
  Implementation: {
    Growth: {
      value: '$7,000+',
      deliverable: 'Digital Branding',
      terms: 'Per month',
    },
    Optimization: {
      value:
        'Installs the systems needed for more scalable and consistent operations',
      deliverable:
        'SOP buildout, CRM setup, dashboard implementation, automation workflows, onboarding systems',
      terms: 'Scoped based on business needs and implementation complexity',
    },
    'M&A': {
      value: 'Dependent on documentation and business readiness',
      deliverable: 'Due Diligence',
      terms: 'Our due diligence technology requires an NDA and is scoped only after records, materials, and business readiness are confirmed',
    },
  },
};
