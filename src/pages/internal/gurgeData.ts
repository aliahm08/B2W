export type GurgeProjectStatus = 'completed' | 'active' | 'pending' | 'at-risk' | 'planned';

export type GurgeProject = {
  id: string;
  name: string;
  type: string;
  status: GurgeProjectStatus;
  summary: string;
  metricLabel: string;
  metricValue: string;
  update: string;
  href?: string;
};

export type GurgeBusiness = {
  id: string;
  name: string;
  shortName: string;
  segment: string;
  userCategory: string;
  description: string;
  projects: GurgeProject[];
};

export type GurgeCopy = {
  eyebrow: string;
  title: string;
  body: string;
  sectionLabel: string;
  sectionTitle: string;
};

export const gurgeBusinesses: GurgeBusiness[] = [
  {
    id: 'real-estate',
    name: 'Real Estate Co.',
    shortName: 'Real Estate',
    segment: 'Small real estate business',
    userCategory: 'Owner / Operator',
    description:
      'One operating view for flips, offers, short-term rentals, and the work connecting them.',
    projects: [
      {
        id: 'airbnb-portfolio',
        name: 'Airbnb Portfolio',
        type: 'Property operations',
        status: 'active',
        summary: 'Thirteen short-term rentals operating as one managed portfolio.',
        metricLabel: 'Operating units',
        metricValue: '13',
        update: 'All 13 units are in the active operating portfolio.',
      },
      {
        id: 'flip-01',
        name: 'Flip 01',
        type: 'Acquisition and renovation',
        status: 'completed',
        summary: 'Completed flip retained as a reference for cost and schedule performance.',
        metricLabel: 'Stage',
        metricValue: 'Closed',
        update: 'Project completed and available for historical comparison.',
      },
      {
        id: 'flip-02',
        name: 'Flip 02',
        type: 'Acquisition and renovation',
        status: 'completed',
        summary: 'Second completed flip with an archived delivery record.',
        metricLabel: 'Stage',
        metricValue: 'Closed',
        update: 'Project completed and available for historical comparison.',
      },
      {
        id: 'flip-03',
        name: 'Flip 03',
        type: 'Acquisition',
        status: 'pending',
        summary: 'A new flip at the acquisition gate with an offer submitted.',
        metricLabel: 'Current gate',
        metricValue: 'Offer in',
        update: 'Awaiting a response to the submitted offer.',
      },
    ],
  },
  {
    id: 'borek-g',
    name: 'Borek-G',
    shortName: 'Borek-G',
    segment: 'Small business',
    userCategory: 'Owner / Team',
    description:
      'Restaurant and catering work separated into clear operating projects with shared ownership.',
    projects: [
      {
        id: 'restaurant',
        name: 'Restaurant',
        type: 'Hospitality operations',
        status: 'active',
        summary: 'Daily restaurant operations, service priorities, and recurring improvement work.',
        metricLabel: 'Operating mode',
        metricValue: 'Daily',
        update: 'The restaurant project is active and carrying routine operating work.',
        href: '/borek-g-operations',
      },
      {
        id: 'catering',
        name: 'Catering',
        type: 'Events and fulfillment',
        status: 'active',
        summary: 'Catering inquiries, booked events, preparation, and fulfillment tracked together.',
        metricLabel: 'Pipeline',
        metricValue: 'Active',
        update: 'Catering remains an active project alongside restaurant operations.',
        href: '/borek-g-social-media-management',
      },
    ],
  },
  {
    id: 'northside-social',
    name: 'Northside Social',
    shortName: 'Northside',
    segment: 'Medium business · scaling',
    userCategory: 'Multi-location Operator',
    description:
      'A location-aware operating view for a growing hospitality business.',
    projects: [
      {
        id: 'location-01',
        name: 'Location 01',
        type: 'Location operations',
        status: 'active',
        summary: 'The established location, with operating work and recurring performance reviews.',
        metricLabel: 'Location state',
        metricValue: 'Operating',
        update: 'Location 01 is operating and remains the comparison point for shared standards.',
      },
      {
        id: 'location-02',
        name: 'Location 02',
        type: 'Location operations',
        status: 'active',
        summary: 'The second location, tracked independently while using shared company standards.',
        metricLabel: 'Location state',
        metricValue: 'Operating',
        update: 'Location 02 is operating within the two-location business portfolio.',
      },
    ],
  },
  {
    id: 'b2w',
    name: 'B2W',
    shortName: 'B2W',
    segment: 'Startup portfolio',
    userCategory: 'Founder / Executive Team',
    description:
      'Product strategy and execution across three related startup initiatives.',
    projects: [
      {
        id: 'gurge',
        name: 'Gurge',
        type: 'Project management software',
        status: 'active',
        summary: 'The shared project operating system for businesses, teams, and owners.',
        metricLabel: 'Current stage',
        metricValue: 'Product build',
        update: 'The product shell and representative business workspaces are in active development.',
        href: '/internal',
      },
      {
        id: 'clara',
        name: 'Clara',
        type: 'AI product',
        status: 'active',
        summary: 'A B2W-managed AI product with its own market and delivery work.',
        metricLabel: 'Current stage',
        metricValue: 'Active',
        update: 'Clara remains active within the B2W startup portfolio.',
        href: '/clara',
      },
      {
        id: 'jason-ai',
        name: 'JasonAI',
        type: 'WhatsApp AI assistant',
        status: 'active',
        summary: 'Executive strategy, performance goals, assignments, and product documentation.',
        metricLabel: 'Strategy horizon',
        metricValue: '24 months',
        update: 'JasonAI is preparing for Foundation, the first phase of its five-phase strategy.',
        href: '/internal/portal/product',
      },
    ],
  },
  {
    id: 'foster-partners',
    name: 'Foster + Partners',
    shortName: 'Foster + Partners',
    segment: 'Enterprise project portfolio',
    userCategory: 'Project Leadership',
    description:
      'An executive portfolio view of active design, development, and delivery programs.',
    projects: [
      {
        id: 'cultural-campus',
        name: 'Cultural Campus',
        type: 'Design program',
        status: 'active',
        summary: 'An active multidisciplinary design program moving through coordinated reviews.',
        metricLabel: 'Program state',
        metricValue: 'Active',
        update: 'The project is active within the design and governance workflow.',
        href: '/client/foster-partners/development-dashboard',
      },
      {
        id: 'mixed-use-development',
        name: 'Mixed-Use Development',
        type: 'Development program',
        status: 'active',
        summary: 'A live development program coordinating design, approvals, and delivery readiness.',
        metricLabel: 'Program state',
        metricValue: 'Active',
        update: 'The program is active with linked design and development work.',
        href: '/client/foster-partners/development-dashboard/development',
      },
      {
        id: 'transport-hub',
        name: 'Transport Hub',
        type: 'Infrastructure program',
        status: 'pending',
        summary: 'A project approaching its next coordinated review gate.',
        metricLabel: 'Next state',
        metricValue: 'Review',
        update: 'The project is assembled for its next review milestone.',
        href: '/client/foster-partners/development-dashboard/design',
      },
    ],
  },
  {
    id: 'plumbing',
    name: 'Independent Plumbing Co.',
    shortName: 'Plumbing Co.',
    segment: 'Self-owned contracting business',
    userCategory: 'Owner / Field Operator',
    description:
      'A job-first view of scheduled work, field progress, customer commitments, and closeout.',
    projects: [
      {
        id: 'water-heater',
        name: 'Water Heater Replacement',
        type: 'Residential job',
        status: 'active',
        summary: 'A replacement job currently moving through field execution and closeout.',
        metricLabel: 'Job state',
        metricValue: 'In progress',
        update: 'The job is active and ready for its next field update.',
      },
      {
        id: 'bathroom-rough-in',
        name: 'Bathroom Rough-In',
        type: 'Renovation job',
        status: 'pending',
        summary: 'A scheduled rough-in waiting on the planned start and site readiness.',
        metricLabel: 'Job state',
        metricValue: 'Scheduled',
        update: 'The job is scheduled and has not entered field execution.',
      },
      {
        id: 'service-call-184',
        name: 'Service Call 184',
        type: 'Service job',
        status: 'completed',
        summary: 'A completed service call retained for customer and job history.',
        metricLabel: 'Job state',
        metricValue: 'Closed',
        update: 'The service call is complete and archived in job history.',
      },
      {
        id: 'commercial-leak',
        name: 'Commercial Leak Investigation',
        type: 'Diagnostic job',
        status: 'at-risk',
        summary: 'A diagnostic job with an unresolved access dependency.',
        metricLabel: 'Open dependency',
        metricValue: 'Site access',
        update: 'Field progress is paused until site access is available.',
      },
    ],
  },
];

export function getGurgeBusiness(id: string | null) {
  return gurgeBusinesses.find((business) => business.id === id) ?? gurgeBusinesses[3];
}

export function getGurgeFallbackCopy(business: GurgeBusiness): GurgeCopy {
  const active = business.projects.filter((project) => project.status === 'active').length;
  const completed = business.projects.filter((project) => project.status === 'completed').length;
  const openGates = business.projects.filter((project) =>
    project.status === 'pending' || project.status === 'planned' || project.status === 'at-risk',
  ).length;

  return {
    eyebrow: `${business.segment} · ${business.userCategory}`,
    title: `${business.name} has ${business.projects.length} projects in view.`,
    body: `${active} active, ${completed} completed, and ${openGates} at an open gate. ${business.description}`,
    sectionLabel: 'Project portfolio',
    sectionTitle: `Work currently visible to ${business.userCategory.toLowerCase()}.`,
  };
}
