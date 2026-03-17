export type Tier = 'Advisory' | 'Consulting' | 'Implementation';
export type Category = 'Growth' | 'Optimization' | 'Exit';

export interface ExpertiseCell {
  pricing: string;
  deliverable: string;
  terms: string;
}

export type ExpertiseMatrix = Record<Tier, Record<Category, ExpertiseCell>>;

export const tiers: Tier[] = ['Advisory', 'Consulting', 'Implementation'];
export const categories: Category[] = ['Growth', 'Optimization', 'Exit'];

export const categoryDescriptions: Record<Category, string> = {
  Growth: 'Expand reach, build brand, and acquire customers.',
  Optimization: 'Streamline operations and train your workforce.',
  Exit: 'Prepare, position, and close a sale.',
};

export const tierDescriptions: Record<Tier, string> = {
  Advisory: 'Strategic guidance and deliverables with minimal ongoing involvement.',
  Consulting: 'Hands-on, recurring engagement over a defined period.',
  Implementation: 'Full-scope execution — we build and operate the solution.',
};

export const expertiseMatrix: ExpertiseMatrix = {
  Advisory: {
    Growth: {
      pricing: '$1,200',
      deliverable: 'Marketing Strategy',
      terms: '1 payment on 3 month contingency',
    },
    Optimization: {
      pricing: '$150/document',
      deliverable: 'SOPs',
      terms: '3 revisions allowed',
    },
    Exit: {
      pricing: '$100 + $100/lead',
      deliverable: 'Sale Profile',
      terms: 'Exclusively publish on our site',
    },
  },
  Consulting: {
    Growth: {
      pricing: '$3,000 – $5,000',
      deliverable: 'Social Media Campaign',
      terms: 'Per month for 3 months minimum',
    },
    Optimization: {
      pricing: '$15/month per employee',
      deliverable: 'Workforce Training',
      terms: 'Management or managing owners must take course',
    },
    Exit: {
      pricing: '$500 + 15% profits',
      deliverable: 'Due Diligence',
      terms: 'Requires full disclosure of financial documents',
    },
  },
  Implementation: {
    Growth: {
      pricing: '$7,000+',
      deliverable: 'Digital Branding',
      terms: 'Per month',
    },
    Optimization: {
      pricing: '$1,800+',
      deliverable: 'Courses',
      terms: 'Limited to 10 total minutes over 3–5 videos',
    },
    Exit: {
      pricing: '$300/month',
      deliverable: 'Negotiations',
      terms: 'Our negotiations technology requires an NDA',
    },
  },
};
