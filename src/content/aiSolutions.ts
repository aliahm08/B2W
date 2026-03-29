export type AiDemoMode = 'chatbots' | 'estimations' | 'financial-models' | 'voice-to-plan';

export type AiSolution = {
  slug: AiDemoMode;
  navLabel: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  outputs: string[];
  workflow: Array<{
    title: string;
    body: string;
  }>;
  integrations: string[];
  related: AiDemoMode[];
  seoTitle: string;
  seoDescription: string;
};

export const aiSolutions: AiSolution[] = [
  {
    slug: 'chatbots',
    navLabel: 'Chatbots',
    eyebrow: 'Customer and team interaction',
    title: 'AI chatbots that capture context and move work forward.',
    summary:
      'Web, SMS, and internal chat systems that answer, qualify, schedule, route, and hand off with the right context.',
    description:
      'These are not brochure bots. They are operating interfaces that help the business respond immediately, collect the right details, and trigger the next action without losing context.',
    stats: [
      { label: 'Channels', value: 'Web, SMS, internal chat' },
      { label: 'Primary role', value: 'Answer, qualify, route' },
      { label: 'Output', value: 'Booked, tagged, handed off' },
    ],
    outputs: [
      'Qualified lead capture and intake summaries',
      'Appointment and callback booking flows',
      'Escalation notes for the human team',
      'Structured records pushed into the next system',
    ],
    workflow: [
      {
        title: 'Capture the request',
        body: 'The AI meets the customer or employee in the channel they already use and collects the relevant context in real time.',
      },
      {
        title: 'Interpret the need',
        body: 'It determines what type of issue, estimate, or workflow is being requested and gathers the right follow-up details.',
      },
      {
        title: 'Trigger the next step',
        body: 'The system can book, route, summarize, or escalate so the conversation produces an operational result.',
      },
    ],
    integrations: ['Website', 'SMS', 'Slack', 'Email', 'Calendars', 'CRMs'],
    related: ['estimations', 'voice-to-plan'],
    seoTitle: 'AI Chatbots',
    seoDescription:
      'B2W builds AI chatbots for websites, SMS, and internal workflows that qualify requests, capture context, and move work forward.',
  },
  {
    slug: 'estimations',
    navLabel: 'Estimations',
    eyebrow: 'Quoted work and pricing logic',
    title: 'AI estimation systems built around your pricing model.',
    summary:
      'Structured estimation workflows that take scope inputs, apply assumptions, and return usable pricing, margin, and next-step outputs.',
    description:
      'We build estimation engines for teams that need speed without losing rigor. Inputs can come from forms, chat, operators, or recordings, and the result can be sent, exported, or routed immediately.',
    stats: [
      { label: 'Primary role', value: 'Calculate and quote' },
      { label: 'Inputs', value: 'Scope, units, labor, constraints' },
      { label: 'Output', value: 'Estimate, margin, follow-up' },
    ],
    outputs: [
      'Instant rough estimates tied to defined assumptions',
      'Margin-aware pricing summaries',
      'Exportable worksheets and task-ready outputs',
      'Follow-up actions for sales or operations teams',
    ],
    workflow: [
      {
        title: 'Accept the scope',
        body: 'The system receives the work request from chat, form, voice note, or an internal operator.',
      },
      {
        title: 'Apply pricing logic',
        body: 'It maps units, labor, travel, complexity, and timing to your estimation framework and business rules.',
      },
      {
        title: 'Export the result',
        body: 'The output can be turned into a quote, worksheet, handoff summary, or internal planning object.',
      },
    ],
    integrations: ['Forms', 'Website', 'Voice recordings', 'Spreadsheets', 'CRMs', 'Email'],
    related: ['voice-to-plan', 'financial-models'],
    seoTitle: 'AI Estimations',
    seoDescription:
      'B2W builds AI estimation systems that turn scope inputs into calculated pricing, margin visibility, and exportable next-step outputs.',
  },
  {
    slug: 'financial-models',
    navLabel: 'Financial Models',
    eyebrow: 'Decision support and modeling',
    title: 'AI financial models that turn operating numbers into decisions.',
    summary:
      'Interactive models for revenue, margin, operating performance, and scenario planning that help teams decide what to do next.',
    description:
      'These systems are designed to make numbers usable. They connect inputs to outcomes, frame tradeoffs, and produce a recommendation layer instead of leaving teams with a static spreadsheet.',
    stats: [
      { label: 'Primary role', value: 'Model and recommend' },
      { label: 'Focus', value: 'Revenue, margin, operating profit' },
      { label: 'Output', value: 'Scenario and decision view' },
    ],
    outputs: [
      'Scenario-based financial models',
      'Modeled revenue and margin impacts',
      'Recommendation layers tied to the numbers',
      'Exportable planning views for operators or owners',
    ],
    workflow: [
      {
        title: 'Load the business inputs',
        body: 'Revenue, costs, utilization, demand, and operating assumptions are translated into a structured model.',
      },
      {
        title: 'Run scenarios',
        body: 'The model adjusts assumptions and shows the effect on revenue, profit, margin, and business performance.',
      },
      {
        title: 'Present the decision',
        body: 'The system explains what the numbers imply and surfaces a practical operating recommendation.',
      },
    ],
    integrations: ['Spreadsheets', 'Google Workspace', 'POS systems', 'CRMs', 'Dashboards'],
    related: ['estimations', 'chatbots'],
    seoTitle: 'AI Financial Models',
    seoDescription:
      'B2W builds AI financial models that connect operating inputs to scenarios, modeled outcomes, and decision support.',
  },
  {
    slug: 'voice-to-plan',
    navLabel: 'Voice to Plan',
    eyebrow: 'Recording in, structured plan out',
    title: 'AI workflows that accept recordings and export calculated plans.',
    summary:
      'Voice-driven systems that transcribe, extract scope, apply logic, and turn what someone said into a usable plan.',
    description:
      'This is for teams that think in the field, capture details on the move, or need operators to speak instead of type. The system listens, structures the work, calculates what matters, and exports the result.',
    stats: [
      { label: 'Input', value: 'Voice note or call recording' },
      { label: 'Processing', value: 'Transcript, extraction, calculation' },
      { label: 'Output', value: 'Plan, estimate, next-step tasks' },
    ],
    outputs: [
      'Structured transcript summaries',
      'Scope extraction from free-form speech',
      'Calculated plans and estimates',
      'Task-ready exports for sales, ops, or delivery teams',
    ],
    workflow: [
      {
        title: 'Accept the recording',
        body: 'A voice memo, phone call, or spoken walkthrough becomes the starting input.',
      },
      {
        title: 'Extract and calculate',
        body: 'The AI identifies the scope, constraints, assumptions, and required numbers, then applies the right logic.',
      },
      {
        title: 'Export the plan',
        body: 'The result is turned into a structured plan, estimate, or action list that the next person can use immediately.',
      },
    ],
    integrations: ['Phone', 'Voice recordings', 'SMS', 'Email', 'CRMs', 'Spreadsheets'],
    related: ['estimations', 'chatbots'],
    seoTitle: 'Voice to Plan AI',
    seoDescription:
      'B2W builds voice-to-plan AI systems that accept recordings, extract scope, calculate outputs, and export structured plans.',
  },
];

export function getAiSolutionBySlug(slug: string) {
  return aiSolutions.find((solution) => solution.slug === slug) ?? null;
}
