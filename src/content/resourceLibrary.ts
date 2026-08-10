export type SmallBusinessIndustry = 'General Contracting';

export type LibraryDocument = {
  title: string;
  description: string;
  inputs: string;
  status: 'B2W service' | 'Concept phase';
};

export type ExampleFlow = {
  industry: SmallBusinessIndustry;
  title: string;
  description: string;
  status: 'B2W service' | 'Concept phase';
  steps: Array<{
    label: 'Capture' | 'Structure' | 'Review' | 'Generate';
    title: string;
    detail: string;
    artifact: string[];
  }>;
};

export const libraryDocuments: Record<SmallBusinessIndustry, LibraryDocument[]> = {
  'General Contracting': [
    { title: 'Site-visit scope of work', description: 'A structured scope organized by trade, location, condition, exclusions, and open questions.', inputs: 'Voice note, photos, plans, site observations', status: 'B2W service' },
    { title: 'Client proposal', description: 'A polished project proposal covering scope, approach, schedule, responsibilities, and terms.', inputs: 'Approved scope, schedule, company terms', status: 'B2W service' },
    { title: 'Daily field report', description: 'A consistent record of labor, progress, deliveries, conditions, issues, and required decisions.', inputs: 'Foreman notes, messages, photos, weather', status: 'B2W service' },
    { title: 'Change order', description: 'A reviewable record of changed scope, cause, schedule effect, commercial effect, and approval.', inputs: 'Original scope, field condition, customer decision', status: 'B2W service' },
    { title: 'Punch list', description: 'A room- and trade-based closeout list with ownership, evidence, priority, and status.', inputs: 'Walkthrough notes, photos, responsible party', status: 'B2W service' },
    { title: 'Subcontractor work package', description: 'A focused package with scope, interfaces, schedule, documentation, and acceptance criteria.', inputs: 'Project scope, drawings, schedule, standards', status: 'B2W service' },
    { title: 'Project estimate', description: 'A voice- or form-driven line-item estimate with labor, materials, assumptions, margin, and contingency.', inputs: 'Field scope, quantities, pricing rules, allowances', status: 'Concept phase' },
  ],
};

export const exampleFlows: ExampleFlow[] = [
  {
    industry: 'General Contracting',
    title: 'Voice note to project estimate',
    description: 'The Clara estimation model, reframed as a governed General Contracting document workflow.',
    status: 'Concept phase',
    steps: [
      { label: 'Capture', title: 'Record the site condition', detail: 'A contractor speaks naturally while walking the job. B2W retains the source and identifies facts, requested work, and unresolved conditions.', artifact: ['1,200 sq ft living room', 'Six windows and 13 ft ceilings', 'Remove carpet; restore wood floor', 'Glass damage requires confirmation'] },
      { label: 'Structure', title: 'Organize the scope by trade', detail: 'The workflow converts the note into work packages without inventing quantities or costs.', artifact: ['Demolition + disposal', 'Windows + openings', 'Flooring restoration', 'Electrical fixtures', 'Assumptions + open questions'] },
      { label: 'Review', title: 'Confirm scope and pricing rules', detail: 'A human reviews quantities, allowances, exclusions, unit costs, margin, and contingency before anything becomes customer-facing.', artifact: ['Labor and material rules', 'Essential vs. optional items', 'Customer-supplied items', '10% contingency', 'Approval required'] },
      { label: 'Generate', title: 'Produce the estimate document', detail: 'The approved data becomes a line-item estimate with source assumptions and a clear next action.', artifact: ['Base scope · $10,270', 'Contingency · $1,027', 'Illustrative total · $11,297', 'Validity and exclusions', 'Review before sending'] },
    ],
  },
];
