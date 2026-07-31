export type WorkspaceColorToken = {
  name: string;
  value: string;
  role: string;
  usage: string;
};

export type WorkspaceSource = {
  name: string;
  route: string;
  contribution: string;
  preserve: string;
};

export const workspaceBrandSystem = {
  name: 'B2W Workspace',
  version: '1.0',
  promise: 'Make business complexity clear enough to act on.',
  voice: {
    character: ['Clear', 'Grounded', 'Operational', 'Human', 'Decisive'],
    statement:
      'B2W speaks like an experienced operator: calm under pressure, specific about the work, and direct about the next decision.',
    rules: [
      'Lead with the business condition, decision, or result.',
      'Use concrete nouns and active verbs.',
      'Separate what exists now from what is planned next.',
      'Explain technology through the work it improves.',
      'End important sections with one clear next action.',
    ],
    avoid: [
      'Generic transformation language',
      'Unqualified AI claims',
      'Long setup before the point',
      'Multiple competing calls to action',
      'Product language that ignores the operator',
    ],
  },
  principles: [
    {
      number: '01',
      title: 'Clarity is the visual brand.',
      body: 'Strong hierarchy, controlled spacing, and visible evidence should do more work than decoration.',
    },
    {
      number: '02',
      title: 'The interface behaves like an operating system.',
      body: 'Every page should orient the user, show current state, and make the next action obvious.',
    },
    {
      number: '03',
      title: 'Products have accents, not separate identities.',
      body: 'JasonAI and Clara retain recognisable colors and interactions inside one B2W structure.',
    },
    {
      number: '04',
      title: 'Motion explains change.',
      body: 'Animation should reveal sequence, progress, state, or causality. It should never compete with comprehension.',
    },
  ],
  colors: [
    {
      name: 'Canvas',
      value: '#FAFAF8',
      role: 'Primary workspace background',
      usage: 'Dashboards, guides, long-form pages, and quiet sections.',
    },
    {
      name: 'Paper',
      value: '#FFFFFF',
      role: 'Raised content surface',
      usage: 'Cards, documents, forms, and overlays.',
    },
    {
      name: 'Ink',
      value: '#111111',
      role: 'Primary text and decisive controls',
      usage: 'Headlines, body copy, primary actions, and dark panels.',
    },
    {
      name: 'Line',
      value: '#E5E5E5',
      role: 'Structure and separation',
      usage: 'Borders, rules, table divisions, and navigation boundaries.',
    },
    {
      name: 'Active',
      value: '#4F7F52',
      role: 'Progress and healthy status',
      usage: 'Active work, completion, positive evidence, and selected states.',
    },
    {
      name: 'Gate',
      value: '#D8B536',
      role: 'Decision or pending state',
      usage: 'Approvals, dependencies, review points, and roadmap gates.',
    },
    {
      name: 'Risk',
      value: '#C63D2F',
      role: 'Attention and blocked state',
      usage: 'Risks, exceptions, blockers, and destructive actions.',
    },
    {
      name: 'JasonAI',
      value: '#B24A24',
      role: 'JasonAI product accent',
      usage: 'Product demonstrations, highlights, and product-specific calls to action.',
    },
    {
      name: 'Clara',
      value: '#A66589',
      role: 'Clara and guided-resource accent',
      usage: 'Voice workflows, progressive demonstrations, and resource journeys.',
    },
  ] satisfies WorkspaceColorToken[],
  type: {
    family: 'Inter, ui-sans-serif, system-ui, sans-serif',
    display: 'Use medium weight, compressed line height, and negative tracking for major statements.',
    body: 'Use regular weight with generous line height and short readable measures.',
    label: 'Use uppercase, small size, and measured tracking for metadata and system labels.',
    mono: 'Use the existing monospace stack for counts, dates, phases, and machine-like status information.',
  },
  motion: {
    defaultEase: [0.22, 1, 0.36, 1] as const,
    durations: {
      fast: 0.2,
      standard: 0.35,
      reveal: 0.56,
    },
    rules: [
      'Use opacity and 8–20px movement for page and section reveals.',
      'Use layout animation when content changes size or priority.',
      'Use continuous animation only for live status, recording, or progress.',
      'Respect reduced-motion preferences and preserve every interaction without motion.',
    ],
  },
  sources: [
    {
      name: 'Operating Map',
      route: '/internal/services',
      contribution: 'Executive sequence and business-plan flow.',
      preserve: 'Numbered progression, evidence-led sections, gates, ownership, and tracking.',
    },
    {
      name: 'Product Direction',
      route: '/internal/portal',
      contribution: 'Workspace shell and current-state orientation.',
      preserve: 'Role-aware views, update stream, status summaries, metrics, and product direction.',
    },
    {
      name: 'Services',
      route: '/services',
      contribution: 'Public organization of B2W work.',
      preserve: 'Growth, optimization, diligence, project examples, and clear contact paths.',
    },
    {
      name: 'JasonAI',
      route: '/jasonai',
      contribution: 'Customer narrative and commercial trust.',
      preserve: 'Problem tension, current-versus-future capability, objections, privacy, and pricing clarity.',
    },
    {
      name: 'Resources / Clara',
      route: '/clara',
      contribution: 'Guided engagement and progressive demonstration.',
      preserve: 'Capture-to-output journey, participatory controls, contextual motion, and visible transformation.',
    },
    {
      name: 'B2W website shell',
      route: '/',
      contribution: 'Parent brand, navigation, and product relationship.',
      preserve: 'B2W-first hierarchy, product accents, restrained footer, and direct actions.',
    },
  ] satisfies WorkspaceSource[],
  contentModel: [
    {
      title: 'Orient',
      description: 'State who the page is for, what condition exists, and why the user should continue.',
    },
    {
      title: 'Diagnose',
      description: 'Show the business problem with concrete situations, evidence, or operating friction.',
    },
    {
      title: 'Resolve',
      description: 'Explain the service, system, or product as a sequence of work rather than a feature list.',
    },
    {
      title: 'Prove',
      description: 'Use examples, status, metrics, source links, privacy controls, and current-versus-planned labels.',
    },
    {
      title: 'Advance',
      description: 'Offer one primary next action and one lower-emphasis alternative when necessary.',
    },
  ],
} as const;

export const workspaceCssVariables = {
  '--b2w-canvas': '#FAFAF8',
  '--b2w-paper': '#FFFFFF',
  '--b2w-ink': '#111111',
  '--b2w-muted': '#6B7280',
  '--b2w-line': '#E5E5E5',
  '--b2w-active': '#4F7F52',
  '--b2w-gate': '#D8B536',
  '--b2w-risk': '#C63D2F',
  '--b2w-jason': '#B24A24',
  '--b2w-jason-soft': '#F4B28C',
  '--b2w-clara': '#A66589',
  '--b2w-clara-deep': '#3D1F33',
  '--b2w-clara-soft': '#F5DCE8',
} as const;
