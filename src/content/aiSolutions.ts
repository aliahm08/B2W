export type AiDemoMode = 'chatbots' | 'estimations' | 'financial-models' | 'voice-to-plan';

export type AiSolution = {
  slug: AiDemoMode;
  navLabel: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  fitSignals: string[];
  buildIncludes: string[];
  stats: Array<{
    label: string;
    value: string;
  }>;
  outputs: string[];
  workflow: Array<{
    title: string;
    body: string;
  }>;
  useCases: Array<{
    title: string;
    body: string;
    outcome: string;
  }>;
  implementationModes: Array<{
    title: string;
    body: string;
  }>;
  successSignals: string[];
  integrations: string[];
  intakePrompt: string;
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
    fitSignals: [
      'Your team repeats the same qualification questions across web, SMS, email, or phone follow-up.',
      'You need a clean handoff from the conversation into scheduling, CRM updates, or an internal queue.',
      'After-hours or high-volume requests are being missed, delayed, or answered inconsistently.',
    ],
    buildIncludes: [
      'Conversation design tuned to your intake questions, qualification logic, and escalation boundaries.',
      'Structured lead or request summaries pushed into the systems your team already works from.',
      'Routing rules for booking, notifications, human takeover, and exception handling.',
      'Deployment across web chat, SMS, internal chat, or blended customer and team channels.',
    ],
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
    useCases: [
      {
        title: 'Website lead capture',
        body: 'The assistant qualifies inbound requests, asks follow-ups, and separates high-fit opportunities from general questions.',
        outcome: 'Sales receives structured leads instead of raw chat transcripts.',
      },
      {
        title: 'Service intake over SMS',
        body: 'Customers text the business, the AI collects the right details, and the request is routed with context.',
        outcome: 'Faster response times without adding another coordinator.',
      },
      {
        title: 'Internal operations copilot',
        body: 'Field or office staff use chat to log issues, request support, or trigger a workflow without leaving their current tools.',
        outcome: 'Ops requests are standardized before they hit the queue.',
      },
    ],
    implementationModes: [
      {
        title: 'Operator assist',
        body: 'The AI gathers the details and drafts the next action while a person stays in approval control.',
      },
      {
        title: 'Autonomous intake',
        body: 'The assistant handles qualification, routing, and booking rules directly for well-defined workflows.',
      },
      {
        title: 'Hybrid support desk',
        body: 'The bot handles first response and context collection, then passes clean summaries to the right teammate.',
      },
    ],
    successSignals: [
      'First-response time drops from hours to seconds.',
      'Every conversation creates a structured record the next person can act on.',
      'Qualified requests get booked, routed, or escalated without manual copy and paste.',
    ],
    integrations: ['Website', 'SMS', 'Slack', 'Email', 'Calendars', 'CRMs'],
    intakePrompt:
      'Tell us what the assistant needs to ask, what systems it must update, and where the human team should stay in the loop.',
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
    fitSignals: [
      'Your team can scope the work, but quote turnaround is too slow or too dependent on one estimator.',
      'Pricing logic lives in scattered spreadsheets, tribal knowledge, or one experienced operator.',
      'You need faster rough pricing without losing visibility into margin, labor, or assumptions.',
    ],
    buildIncludes: [
      'Input flows for operators, forms, chat, or recordings to capture the scope cleanly.',
      'Pricing logic tied to your unit assumptions, labor model, margin targets, and exception rules.',
      'Export outputs for quotes, internal worksheets, follow-up tasks, or planning packets.',
      'Approval and override controls so the team can review sensitive or edge-case estimates.',
    ],
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
    useCases: [
      {
        title: 'Field estimate follow-up',
        body: 'A technician or salesperson captures the job details and the engine returns a usable starting estimate immediately.',
        outcome: 'The customer gets a faster answer while margin stays visible.',
      },
      {
        title: 'Inbound rough pricing',
        body: 'Chat or form inputs are translated into a defined price range with the right assumptions attached.',
        outcome: 'Sales qualifies opportunities before a manual estimator gets involved.',
      },
      {
        title: 'Internal worksheet generation',
        body: 'The estimate becomes an internal planning object with line items, assumptions, and downstream tasks.',
        outcome: 'Ops and sales work from the same numbers.',
      },
    ],
    implementationModes: [
      {
        title: 'Estimator copilot',
        body: 'The AI prepares the first draft and the estimator approves, edits, or escalates the final number.',
      },
      {
        title: 'Instant rough pricing',
        body: 'The system delivers fast directional pricing for clearly bounded jobs and pushes edge cases to review.',
      },
      {
        title: 'Embedded quoting workflow',
        body: 'The engine sits inside intake, CRM, or internal tools so quoting is part of the daily operating flow.',
      },
    ],
    successSignals: [
      'Quote turnaround moves from days to minutes.',
      'Margin assumptions are visible instead of hidden in spreadsheets.',
      'Sales and operations stop re-entering the same scope details.',
    ],
    integrations: ['Forms', 'Website', 'Voice recordings', 'Spreadsheets', 'CRMs', 'Email'],
    intakePrompt:
      'Tell us what inputs drive the quote today, where the pricing logic lives, and what the output needs to look like for your team.',
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
    fitSignals: [
      'You have the core numbers, but they do not reliably produce a clear decision or operating recommendation.',
      'Scenario planning is important, yet every model update still requires manual spreadsheet work.',
      'Owners or operators need to compare moves quickly instead of waiting on a custom analysis each time.',
    ],
    buildIncludes: [
      'Structured models for revenue, labor, gross margin, and operating scenarios.',
      'Decision views that explain what changes when assumptions move up or down.',
      'Recommendation layers tied to the modeled numbers rather than generic commentary.',
      'Interactive controls for operators, owners, or deal teams to test scenarios safely.',
    ],
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
    useCases: [
      {
        title: 'Operator scenario planning',
        body: 'A team models changes in staffing, pricing, demand, or throughput and sees the effect immediately.',
        outcome: 'Management chooses the next move with numbers already translated into tradeoffs.',
      },
      {
        title: 'Owner decision support',
        body: 'An owner tests expansion, cost reduction, or pricing changes without rebuilding the spreadsheet every time.',
        outcome: 'Decisions happen faster and with cleaner assumptions.',
      },
      {
        title: 'Deal and diligence modeling',
        body: 'Historical performance and new assumptions feed into a model that frames upside, downside, and execution risk.',
        outcome: 'The decision conversation stays tied to the operating math.',
      },
    ],
    implementationModes: [
      {
        title: 'Decision dashboard',
        body: 'A live model is exposed through a simple interface for recurring operator or owner use.',
      },
      {
        title: 'Analysis workstation',
        body: 'The system supports analysts or finance leads who need faster scenario creation and cleaner recommendation outputs.',
      },
      {
        title: 'Embedded recommendation layer',
        body: 'The model sits behind another workflow and returns a recommendation when a triggering event occurs.',
      },
    ],
    successSignals: [
      'Scenario analysis becomes fast enough to use in normal operating decisions.',
      'Teams understand the tradeoff, not just the spreadsheet output.',
      'Recommendations stay anchored to the underlying business math.',
    ],
    integrations: ['Spreadsheets', 'Google Workspace', 'POS systems', 'CRMs', 'Dashboards'],
    intakePrompt:
      'Tell us which decisions the model should support, what numbers are available, and what tradeoffs the team needs to see clearly.',
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
    fitSignals: [
      'Your best operators know what to say on-site, but typing the scope later slows everything down.',
      'Critical job details live inside call recordings, voice notes, or spoken walkthroughs.',
      'You need recordings to become structured plans, estimates, or tasks without manual cleanup.',
    ],
    buildIncludes: [
      'Transcription and extraction pipelines tuned to the details your business actually cares about.',
      'Scope parsing that turns free-form speech into structured fields, assumptions, and follow-up questions.',
      'Calculation layers for estimates, worksheets, or action plans driven directly from the recording.',
      'Export outputs that hand the result to sales, ops, dispatch, or delivery without re-entry.',
    ],
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
    useCases: [
      {
        title: 'On-site walkthrough capture',
        body: 'A field operator records the job while looking at the work, and the system structures the scope automatically.',
        outcome: 'The estimate or plan starts from what was actually observed on-site.',
      },
      {
        title: 'Phone-call intake',
        body: 'A recorded customer call becomes a summarized request with the main requirements, assumptions, and missing details.',
        outcome: 'The team stops replaying calls to rebuild context.',
      },
      {
        title: 'Supervisor voice notes',
        body: 'Managers speak updates, findings, or work instructions and the AI converts them into task-ready outputs.',
        outcome: 'Execution moves faster because speaking is easier than typing in the field.',
      },
    ],
    implementationModes: [
      {
        title: 'Recording to estimate',
        body: 'The system transcribes and calculates a first estimate directly from a spoken walkthrough.',
      },
      {
        title: 'Recording to dispatch plan',
        body: 'Voice input becomes tasks, sequencing, and handoff details for the delivery or service team.',
      },
      {
        title: 'Recording to human review',
        body: 'The AI prepares the structured output and flags uncertain details for a coordinator to confirm.',
      },
    ],
    successSignals: [
      'Operators capture details once, in the field, instead of retelling the same job later.',
      'Recordings stop being dead data and start producing structured work objects.',
      'The next person in the workflow gets a usable plan instead of a raw transcript.',
    ],
    integrations: ['Phone', 'Voice recordings', 'SMS', 'Email', 'CRMs', 'Spreadsheets'],
    intakePrompt:
      'Tell us where the recordings come from, what details must be extracted, and what the final export should enable for the next person.',
    related: ['estimations', 'chatbots'],
    seoTitle: 'Voice to Plan AI',
    seoDescription:
      'B2W builds voice-to-plan AI systems that accept recordings, extract scope, calculate outputs, and export structured plans.',
  },
];

export function getAiSolutionBySlug(slug: string) {
  return aiSolutions.find((solution) => solution.slug === slug) ?? null;
}
