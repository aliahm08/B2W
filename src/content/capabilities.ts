export type Capability = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  interaction: string;
  humanLoop: string;
  bestFor: string;
  outputs: string[];
  systems: string[];
};

export type CapabilityLane = {
  id: string;
  menuLabel: string;
  title: string;
  description: string;
  capabilities: Capability[];
};

export const capabilityLanes: CapabilityLane[] = [
  {
    id: 'front-of-house',
    menuLabel: 'Front-of-House',
    title: 'Front-of-House (Guest Experience)',
    description:
      'Guest-facing systems that answer faster, protect service quality, and capture demand after hours without forcing operators to babysit inboxes.',
    capabilities: [
      {
        id: 'guest-experience-concierge',
        slug: 'guest-experience-concierge',
        title: 'Guest Experience Concierge',
        summary:
          'A 24/7 host agent that handles calls, texts, and chat inquiries so the floor team can stay focused on service.',
        problem:
          'Hosts and managers lose bookings when calls hit during service, menu questions pile up, or large-party requests wait too long for a response.',
        solution:
          'We deploy an AI concierge across phone, SMS, and web chat that answers FAQs, handles reservation and waitlist flows, captures event leads, and routes exceptions to staff with full context.',
        interaction: 'Phone, SMS, web chat, and reservation workflows',
        humanLoop: 'Escalates VIPs, disputes, accessibility requests, and bespoke event planning.',
        bestFor: 'Restaurants, cafes, boutique hospitality groups',
        outputs: [
          'Reservation confirmations, waitlist updates, and event lead capture',
          'Menu, allergy, hours, parking, and policy answers',
          'Clean handoff notes for hosts and managers when human intervention is required',
        ],
        systems: ['Phone', 'SMS', 'Web chat', 'Booking platform', 'POS knowledge base'],
      },
      {
        id: 'post-visit-review-recovery',
        slug: 'post-visit-review-recovery',
        title: 'Post-Visit Review Recovery',
        summary:
          'A follow-up system that recovers unhappy guests privately and pushes satisfied guests toward public reviews.',
        problem:
          'Strong service often disappears without a review, while frustrated guests post publicly before management has a chance to respond.',
        solution:
          'We wire an agent to trigger after a visit, send a personalized check-in, sort sentiment, and branch feedback into private recovery or public review requests.',
        interaction: 'Post-visit SMS and CRM-triggered outreach',
        humanLoop: 'Managers approve make-goods, refunds, and sensitive service recovery.',
        bestFor: 'Hospitality operators competing on local reputation and repeat traffic',
        outputs: [
          'Personalized guest follow-ups tied to a specific visit or order',
          'Private recovery threads for neutral and negative feedback',
          'Review generation flows for Google, Yelp, and first-party feedback channels',
        ],
        systems: ['POS', 'CRM', 'SMS', 'Review platforms'],
      },
      {
        id: 'delivery-demand-router',
        slug: 'delivery-demand-router',
        title: 'Delivery Demand Router',
        summary:
          'A demand-control layer that protects kitchen throughput by adjusting messaging, timing, and channel behavior in real time.',
        problem:
          'Delivery demand spikes during rushes, ticket times slip, and margin gets squeezed when the kitchen cannot distinguish profitable volume from chaos.',
        solution:
          'We stand up an operating layer that reacts to kitchen load, updates wait times, promotes bundles, and shifts channel behavior so operators can protect service levels and contribution margin.',
        interaction: 'Delivery menu controls and operations alerts',
        humanLoop: 'Operators set guardrails for pricing, item availability, and brand-sensitive messaging.',
        bestFor: 'Busy kitchens balancing dine-in, pickup, and third-party delivery',
        outputs: [
          'Channel-aware wait time adjustments and availability changes',
          'Higher-margin bundle and upsell recommendations during peak periods',
          'Alerts when direct intervention is needed to protect service levels',
        ],
        systems: ['Delivery platforms', 'POS', 'Kitchen ops data', 'Manager alerts'],
      },
    ],
  },
  {
    id: 'back-of-house',
    menuLabel: 'Back-of-House',
    title: 'Back-of-House (The Kitchen)',
    description:
      'Kitchen-side systems that convert operational data into purchasing, prep, maintenance, and waste decisions before issues become fire drills.',
    capabilities: [
      {
        id: 'autonomous-inventory',
        slug: 'autonomous-inventory',
        title: 'Autonomous Inventory',
        summary:
          'Tracks stock levels continuously and places vendor orders before crews discover shortages mid-shift.',
        problem:
          'Inventory counts happen too late, purchasing is reactive, and missed reorder windows turn into emergency runs or menu outages.',
        solution:
          'The system watches stock movement, projects depletion, and prepares or places vendor orders automatically with suppliers like Sysco or US Foods based on approved rules.',
        interaction: 'Managers review exceptions instead of manually counting and reordering.',
        humanLoop: 'Purchasing leads approve vendor changes, budget overrides, and unusual substitutions.',
        bestFor: 'Multi-SKU kitchens, commissaries, and multi-location operators',
        outputs: [
          'Reorder recommendations and auto-generated purchase orders',
          'Low-stock alerts tied to service risk, not just raw counts',
          'Vendor-ready order packets with quantity, timing, and substitution logic',
        ],
        systems: ['POS', 'Inventory data', 'Vendor catalogs', 'Email and procurement workflows'],
      },
      {
        id: 'prep-oracle',
        slug: 'prep-oracle',
        title: 'The Prep Oracle',
        summary:
          'Builds prep plans from weather, local events, and historical sales patterns instead of gut feel.',
        problem:
          'Prep is often based on yesterday’s memory, which creates stockouts on busy nights and labor waste on slow ones.',
        solution:
          'We generate a daily prep forecast that combines historical sales, event calendars, and demand signals so the kitchen starts each day with a reasoned production plan.',
        interaction: 'Chefs and managers receive a daily prep brief with quantities and confidence notes.',
        humanLoop: 'Kitchen leadership adjusts final targets for special menus, closures, and one-off events.',
        bestFor: 'Restaurants where volume swings with weather, seasonality, and local foot traffic',
        outputs: [
          'Daily prep lists with recommended quantities by item or station',
          'Forecast notes tied to weather, events, and historical performance',
          'Labor planning signals that help align prep volume with staffing',
        ],
        systems: ['Historical sales', 'Weather', 'Event calendars', 'Prep sheets'],
      },
      {
        id: 'equipment-watchdog',
        slug: 'equipment-watchdog',
        title: 'Equipment Watchdog',
        summary:
          'Monitors kitchen equipment and flags failure risk before a freezer or fridge goes down.',
        problem:
          'Critical equipment usually gets attention only after temperatures drift, food is at risk, or service has already been disrupted.',
        solution:
          'We connect sensor feeds and maintenance logic to detect abnormal behavior, notify the right people early, and trigger a technician before the motor fails.',
        interaction: 'Operators receive risk alerts and recommended next actions, not raw sensor noise.',
        humanLoop: 'Managers approve service calls and coordinate operational workarounds when needed.',
        bestFor: 'Operators with refrigerated inventory, aging equipment, or distributed sites',
        outputs: [
          'Early warning alerts for abnormal temperature and performance patterns',
          'Recommended maintenance actions with urgency levels',
          'Technician dispatch prompts before spoilage or shutdown becomes likely',
        ],
        systems: ['Sensors', 'Maintenance vendors', 'SMS', 'Email', 'Operations alerts'],
      },
      {
        id: 'waste-auditor',
        slug: 'waste-auditor',
        title: 'Waste Auditor',
        summary:
          'Turns food waste into an operating signal that improves ordering, prep, and portioning.',
        problem:
          'Teams know waste is happening, but they rarely get structured insight on what is being lost, why it is happening, and what to change next.',
        solution:
          'We analyze waste logs, image evidence, or staff inputs to identify recurring loss patterns and feed those insights back into ordering, prep plans, and portion decisions.',
        interaction: 'Operators review the biggest avoidable loss drivers and the recommended fixes.',
        humanLoop: 'Leadership decides on menu changes, supplier changes, and policy adjustments.',
        bestFor: 'Food businesses under margin pressure or struggling with prep variance',
        outputs: [
          'Waste pattern reports by item, shift, and root cause',
          'Recommendations for future ordering and prep adjustments',
          'Portioning and production signals tied to avoidable loss',
        ],
        systems: ['Waste logs', 'Photo inputs', 'Prep data', 'Inventory baselines'],
      },
    ],
  },
  {
    id: 'management-admin',
    menuLabel: 'Management & Admin',
    title: 'Management & Admin',
    description:
      'Administrative systems that remove repetitive coordination, pricing, reconciliation, and payroll work from management teams.',
    capabilities: [
      {
        id: 'shift-optimizer',
        slug: 'shift-optimizer',
        title: 'Shift Optimizer',
        summary:
          'Handles call-out communication, finds coverage, and compresses the scramble around open shifts.',
        problem:
          'Managers spend too much time texting staff one by one when someone calls out, especially during nights, weekends, and peak periods.',
        solution:
          'We deploy a scheduling assistant that manages the communication chain for call-outs, identifies eligible staff, and proposes the best coverage path automatically.',
        interaction: 'Managers approve the chosen coverage path instead of manually chasing replies.',
        humanLoop: 'Leadership sets labor rules, overtime thresholds, and exception handling.',
        bestFor: 'Shift-based teams with frequent coverage changes and thin management bandwidth',
        outputs: [
          'Automated outreach to eligible team members for open shifts',
          'Coverage recommendations ranked by fit, cost, and compliance',
          'A clean audit trail of who was contacted and what was accepted',
        ],
        systems: ['Scheduling system', 'SMS', 'Email', 'Labor rules'],
      },
      {
        id: 'dynamic-pricing',
        slug: 'dynamic-pricing',
        title: 'Dynamic Pricing',
        summary:
          'Adjusts delivery or digital menu pricing in real time when kitchen load or demand changes.',
        problem:
          'Static pricing ignores kitchen congestion and peak demand, which means teams either leave revenue on the table or overload the line.',
        solution:
          'We implement rules and models that change prices, fees, or promotions based on real-time busyness, peak hours, and operating constraints.',
        interaction: 'Operators set the policy guardrails; the system handles live pricing behavior.',
        humanLoop: 'Leadership defines pricing boundaries, exclusions, and brand constraints.',
        bestFor: 'Operators balancing throughput, margin protection, and digital demand',
        outputs: [
          'Real-time menu or fee adjustments tied to kitchen load',
          'Peak-hour pricing actions with configurable thresholds',
          'Visibility into how pricing choices affect throughput and margin',
        ],
        systems: ['POS', 'Delivery channels', 'Demand signals', 'Operations dashboards'],
      },
      {
        id: 'invoice-reconciler',
        slug: 'invoice-reconciler',
        title: 'Invoice Reconciler',
        summary:
          'Compares vendor slips against contracted pricing and flags discrepancies before they become silent margin leaks.',
        problem:
          'Teams routinely overpay because delivery slips and invoices are not checked line by line against what was actually negotiated.',
        solution:
          'We automate the reconciliation of vendor paperwork against price lists and contract terms so operators can catch overcharges, substitutions, and missing credits quickly.',
        interaction: 'Finance or operations teams review only flagged mismatches and exceptions.',
        humanLoop: 'Staff decide how to dispute charges and manage supplier escalation.',
        bestFor: 'Operators with frequent vendor deliveries, variable commodity prices, and tight margins',
        outputs: [
          'Exception reports for price mismatches and unauthorized substitutions',
          'Supporting evidence tied to contract rates and delivery documents',
          'A shortlist of disputes worth pursuing with vendors',
        ],
        systems: ['Invoices', 'Delivery slips', 'Contract pricing', 'Accounting workflows'],
      },
      {
        id: 'payroll-assistant',
        slug: 'payroll-assistant',
        title: 'Payroll Assistant',
        summary:
          'Brings time data, tips, and labor rules together so managers can approve payroll with less manual cleanup.',
        problem:
          'Payroll review becomes a weekly reconciliation exercise across clock-ins, tip allocations, overtime rules, and local labor requirements.',
        solution:
          'We sync timekeeping data with tips and policy checks so managers get a payroll-ready packet with exceptions already surfaced.',
        interaction: 'Managers review exceptions and approve payroll instead of stitching records together.',
        humanLoop: 'Leadership handles disputes, policy overrides, and final signoff.',
        bestFor: 'Labor-heavy operators dealing with tips, overtime, and local compliance rules',
        outputs: [
          'Payroll packets with exceptions pre-flagged for review',
          'Tip and timekeeping reconciliation summaries',
          'Compliance checks aligned to local labor requirements',
        ],
        systems: ['Time clock', 'Tips data', 'Payroll system', 'Local labor rules'],
      },
    ],
  },
  {
    id: 'contractor-operations',
    menuLabel: 'Contractor Operations',
    title: 'Field Service & Contractor Operations',
    description:
      'Revenue, dispatch, field support, and coordination systems for contractors, trades, and general contractors that need better follow-through without adding more admin headcount.',
    capabilities: [
      {
        id: 'autonomous-dispatcher',
        slug: 'autonomous-dispatcher',
        title: '24/7 Autonomous Dispatcher',
        summary:
          'Captures leads after hours, qualifies the job, and books the next step before a competitor answers first.',
        problem:
          'Missing a call at 9:00 PM can mean losing a $500 to $2,000 job to a competitor who responded immediately.',
        solution:
          'We deploy a voice or text agent that connects to calendars and field-service systems like Jobber or Housecall Pro, qualifies the lead, gives a rough starting price, and books an on-site estimate without human intervention.',
        interaction: 'Voice and text booking flows tied to dispatch calendars',
        humanLoop: 'Office staff step in for edge cases, emergency routing, and pricing exceptions.',
        bestFor: 'Electrical, HVAC, plumbing, and other service businesses that depend on fast response',
        outputs: [
          'Booked estimates and service calls outside office hours',
          'Structured lead intake with job type, urgency, and location',
          'Calendar-ready handoffs for dispatch and office staff',
        ],
        systems: ['Phone', 'SMS', 'Jobber', 'Housecall Pro', 'Calendar systems'],
      },
      {
        id: 'vision-based-estimator',
        slug: 'vision-based-estimator',
        title: 'Vision-Based Rough Estimator',
        summary:
          'Uses uploaded photos to screen job fit and produce a ballpark before anyone drives to site.',
        problem:
          'Teams waste time on site visits only to discover the job is too small, the equipment is incompatible, or critical context was missing from intake.',
        solution:
          'Customers upload photos of panels, furnaces, fixtures, or site conditions. The system analyzes visible context, model numbers, and likely compatibility issues to produce a rough range and highlight red flags before you roll a truck.',
        interaction: 'Photo intake, guided questions, and estimate triage',
        humanLoop: 'Estimators validate edge cases and convert qualified opportunities into formal quotes.',
        bestFor: 'Trade businesses where truck rolls and estimator time are expensive',
        outputs: [
          'Ballpark ranges based on visible equipment and site context',
          'Compatibility and scope red flags before dispatch',
          'Cleaner lead qualification for office and sales teams',
        ],
        systems: ['Photo uploads', 'Model-number lookups', 'CRM', 'Estimate workflows'],
      },
      {
        id: 'persistent-sales-clerk',
        slug: 'persistent-sales-clerk',
        title: 'The Persistent Sales Clerk',
        summary:
          'Keeps quotes warm with useful follow-up so ghost revenue does not stay ghost revenue.',
        problem:
          'Contractors are often strong at generating quotes but weak at the follow-up discipline required to close them.',
        solution:
          'We monitor the CRM for unsigned quotes and trigger personalized follow-ups, answer common objections, and surface the right close tactic, including limited-time offers when appropriate.',
        interaction: 'CRM-triggered follow-up sequences across email and SMS',
        humanLoop: 'Sales owners approve discounts, scope changes, and sensitive objections.',
        bestFor: 'Owners and estimators with a backlog of unsigned proposals',
        outputs: [
          'Personalized follow-up cadences tied to quote status',
          'Response handling for common scope and timing questions',
          'Visibility into stalled quotes and likely close opportunities',
        ],
        systems: ['CRM', 'Email', 'SMS', 'Quote and proposal data'],
      },
      {
        id: 'field-tech-knowledge-brain',
        slug: 'field-tech-knowledge-brain',
        title: 'Field Tech Knowledge Brain',
        summary:
          'Gives field crews instant answers from manuals, prior jobs, and local codes instead of constant phone-a-friend escalation.',
        problem:
          'Junior techs get stuck on-site and interrupt senior staff repeatedly for wiring diagrams, specs, or code interpretations.',
        solution:
          'We build a private RAG system around your manuals, past job notes, and local code references so techs can ask a field question and get the relevant answer immediately.',
        interaction: 'Field-accessible chat and search tied to private technical knowledge',
        humanLoop: 'Senior staff stay in the loop for safety-critical decisions and ambiguous conditions.',
        bestFor: 'Service businesses training newer field crews across diverse equipment types',
        outputs: [
          'Fast answers to equipment, wiring, troubleshooting, and code questions',
          'Private search across your historical job knowledge',
          'Reduced interruption load on owners and senior technicians',
        ],
        systems: ['Manuals', 'Job notes', 'Code references', 'Field mobile access'],
      },
      {
        id: 'review-reputation-management',
        slug: 'review-reputation-management',
        title: 'Review and Reputation Management',
        summary:
          'Automates the ask after a completed job and routes negative feedback into private resolution instead of public damage.',
        problem:
          'Great work often goes unreviewed, which weakens local SEO and reduces the compounding value of a strong service reputation.',
        solution:
          'After a job is marked complete, the system sends a personalized follow-up tied to a specific service detail, handles neutral or negative feedback privately, and routes positive sentiment to Google or Yelp.',
        interaction: 'Completion-triggered outreach with sentiment routing',
        humanLoop: 'Staff handle remediation, callbacks, and reputation-sensitive responses.',
        bestFor: 'Field-service businesses competing heavily on local search and trust',
        outputs: [
          'Personalized review asks tied to completed jobs',
          'Private handling of neutral and negative feedback',
          'A steady stream of positive review opportunities to public channels',
        ],
        systems: ['Job-complete events', 'SMS', 'CRM', 'Google and Yelp workflows'],
      },
      {
        id: 'subcontractor-vendor-coordination',
        slug: 'subcontractor-vendor-coordination',
        title: 'Subcontractor and Vendor Coordination (GC Focus)',
        summary:
          'Keeps subs and vendors aligned to the schedule without making the GC spend half the day asking where everyone is.',
        problem:
          'General contractors burn time sending status texts, chasing confirmations, and manually reshuffling schedules when one trade slips.',
        solution:
          'We deploy an agent that watches the timeline, pings the electrician or supplier before they are due on-site, updates the master schedule, and notifies stakeholders when a delay changes the plan.',
        interaction: 'Schedule-aware outreach and timeline updates',
        humanLoop: 'Project managers approve major rescheduling decisions and client-facing changes.',
        bestFor: 'General contractors coordinating multiple subs, vendors, and homeowners',
        outputs: [
          'Proactive status checks ahead of scheduled work',
          'Automatic schedule adjustments when timelines shift',
          'Homeowner and stakeholder notifications when delays affect the plan',
        ],
        systems: ['Project schedules', 'SMS', 'Email', 'Vendor and subcontractor contacts'],
      },
    ],
  },
];

export type CapabilityRecord = Capability & {
  laneId: string;
  laneMenuLabel: string;
  laneTitle: string;
  laneDescription: string;
};

export const allCapabilities: CapabilityRecord[] = capabilityLanes.flatMap((lane) =>
  lane.capabilities.map((capability) => ({
    ...capability,
    laneId: lane.id,
    laneMenuLabel: lane.menuLabel,
    laneTitle: lane.title,
    laneDescription: lane.description,
  })),
);

export function getCapabilityBySlug(slug: string) {
  return allCapabilities.find((capability) => capability.slug === slug);
}
