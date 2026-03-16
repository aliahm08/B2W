import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import XLSX from 'xlsx';
import { projectShowcaseOverridesByPath } from '../src/content/projectShowcase';

type HeroContent = {
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

type ProjectTag = {
  label: string;
  tier: 1 | 2 | 3;
};

type ProjectCard = {
  id: number;
  category: string;
  projectType: string;
  serviceType: string;
  status: string;
  clientDescription: string;
  title: string;
  description: string;
  impact: string;
  tags: ProjectTag[];
  date: string;
  link: string;
};

type ProjectPipelineContent = {
  hero: HeroContent;
  projects: ProjectCard[];
};

type WorkbookRow = {
  client?: string;
  industry?: string;
  date?: Date | number | string;
  offering?: string;
  topic?: string;
  package?: string;
  location?: string;
  'initial value'?: number | string;
  'growth potential'?: number | string;
  'target value'?: number | string;
  status?: string;
  skills?: string;
  password?: string;
};

type RawSheetRow = Array<string | number | Date | null>;

const repoRoot = process.cwd();
const workbookPath = path.join(repoRoot, 'index-projects.xlsx');
const outputPath = path.join(repoRoot, 'src/content/projectPipeline.generated.ts');
const passwordEnvOutputPath = path.join(repoRoot, '.env.project-passwords.local');
const defaultHero: HeroContent = {
  headline: 'Optimizing growth for small and midsize businesses.',
  subheadline: 'Solving complex problems with simple, effective AI solutions. No hype. Just results.',
  primaryCtaLabel: 'Explore capabilities',
  primaryCtaHref: '/#capabilities',
  secondaryCtaLabel: 'See Projects',
  secondaryCtaHref: '/#industries',
};

const routeMap: Record<string, string> = {
  'borek-g|profile|marketing': '/borek-g',
  'borek-g|prototype|operations': '/borek-g-operations',
  'uyghur eats|profile|finance': '/uyghur-eats-acquisition',
};

const clientDisplayMap: Record<string, string> = {
  'borek-g': 'Borek-G',
  'uyghur eats': 'Uyghur Eats',
  'caravan uyghur': 'Caravan Uyghur',
  'sabucni': 'Sabucni',
};

const locationDisplayMap: Record<string, string> = {
  'falls church, va': 'Falls Church, VA',
  'washington, dc': 'Washington, DC',
  'wall street, ny': 'Wall Street, NY',
  'fairfax, va': 'Fairfax, VA',
};

const projectTypeOverrideMap: Record<string, string> = {
  'borek-g|profile|marketing': 'Consulting',
  'borek-g|prototype|operations': 'Consulting',
  'uyghur eats|profile|finance': 'Consulting',
  'caravan uyghur|profile|marketing': 'Consulting',
  'sabucni|prototype|operations': 'Custom Solution',
};

function titleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word
      .split('-')
      .map((segment) => {
        if (/^[a-z]{2}$/.test(segment)) {
          return segment.toUpperCase();
        }
        return segment.charAt(0).toUpperCase() + segment.slice(1);
      })
      .join('-'))
    .join(' ');
}

function upperLabel(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

function compactText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function displayClient(value: string): string {
  const normalized = compactText(value).toLowerCase();
  return clientDisplayMap[normalized] ?? titleCase(value);
}

function displayLocation(value: string): string {
  const normalized = compactText(value).toLowerCase();
  return locationDisplayMap[normalized] ?? titleCase(value);
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.-]/g, '');
    if (!normalized) {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatCurrency(value: number | null): string {
  if (value === null) {
    return '';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatGrowth(value: number | null): string {
  if (value === null) {
    return '';
  }

  return `${value}x`;
}

function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) {
    return '';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}

function formatMonthYear(value: WorkbookRow['date']): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  if (typeof value === 'number') {
    const jsDate = XLSX.SSF.parse_date_code(value);
    if (jsDate) {
      const parsed = new Date(jsDate.y, jsDate.m - 1, jsDate.d);
      return parsed.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    return compactText(value);
  }

  return '';
}

function splitSkills(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((entry) => compactText(entry))
    .filter(Boolean);
}

function summarizeProject(row: WorkbookRow): string {
  const client = displayClient(String(row.client ?? ''));
  const packageName = compactText(String(row.package ?? ''));
  const offering = compactText(String(row.offering ?? ''));
  const topic = compactText(String(row.topic ?? ''));
  const location = displayLocation(String(row.location ?? ''));
  const initialValue = formatCurrency(parseNumber(row['initial value']));
  const targetValue = formatCurrency(parseNumber(row['target value']));

  return [
    `${client} ${offering} focused on ${topic}, packaged as ${packageName}.`,
    location ? `Based in ${location}.` : '',
    initialValue && targetValue ? `Current value is modeled from ${initialValue} toward ${targetValue}.` : '',
  ].filter(Boolean).join(' ');
}

function isProposalState(status: string): boolean {
  return /(proposal|proposed)/i.test(status);
}

function generalizeIndustryLabel(industry: string): string {
  const normalized = compactText(industry).toLowerCase();

  if (normalized === 'food & beverage' || normalized === 'restaurant') {
    return 'restaurant';
  }

  if (normalized === 'construction') {
    return 'trade-services operator';
  }

  if (normalized) {
    return compactText(industry).toLowerCase();
  }

  return 'business';
}

function buildPublicTitle(row: WorkbookRow): string {
  const client = compactText(String(row.client ?? '')).toLowerCase();
  const offering = compactText(String(row.offering ?? '')).toLowerCase();
  const topic = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = compactText(String(row.package ?? '')).toLowerCase();

  if (offering === 'profile' && topic === 'marketing') {
    return 'Turkish Bistro Social Media Management';
  }

  if (client === 'borek-g' && offering === 'prototype' && topic === 'operations') {
    return 'Turkish Bistro Content and Promotion System';
  }

  if (offering === 'prototype' && topic === 'operations') {
    return packageName.includes('mobile') ? 'Field Crew Coordination Assistant' : 'Frontline Service Copilot';
  }

  if (offering === 'profile' && topic === 'finance') {
    return 'Urban Restaurant Sale Readiness';
  }

  if (offering === 'profile') {
    return `${titleCase(topic || 'Business')} System`;
  }

  if (offering === 'prototype') {
    return `${titleCase(topic || 'Business')} Solution`;
  }

  return titleCase(String(row.package ?? '')) || [titleCase(topic), titleCase(offering)].filter(Boolean).join(' ');
}

function buildPublicClientDescription(row: WorkbookRow): string {
  const client = compactText(String(row.client ?? '')).toLowerCase();
  const industry = generalizeIndustryLabel(String(row.industry ?? ''));
  const topic = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = compactText(String(row.package ?? '')).toLowerCase();

  if (industry === 'restaurant' && topic === 'marketing') {
    return 'Independent restaurant in a high-traffic suburban market';
  }

  if (client === 'borek-g' && industry === 'restaurant' && topic === 'operations') {
    return 'Independent restaurant with strong local demand and underused digital channels';
  }

  if (industry === 'restaurant' && topic === 'operations') {
    return 'Restaurant team managing repeat customer and staff questions';
  }

  if (industry === 'restaurant' && topic === 'finance') {
    return 'Specialty restaurant positioned in a strong urban corridor';
  }

  if (industry === 'trade-services operator' && topic === 'operations') {
    return 'Trade-services operator coordinating field crews across jobsites';
  }

  if (packageName.includes('mobile')) {
    return 'Operator coordinating mobile teams across active work';
  }

  return `${titleCase(industry)} with a defined ${topic || 'project'} brief`;
}

function buildPublicDescription(row: WorkbookRow): string {
  const client = compactText(String(row.client ?? '')).toLowerCase();
  const offering = compactText(String(row.offering ?? '')).toLowerCase();
  const topic = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = compactText(String(row.package ?? '')).toLowerCase();

  if (offering === 'profile' && topic === 'marketing') {
    return 'Restaurant marketing profile covering public reputation, social opportunity, search visibility, and website conversion opportunities.';
  }

  if (client === 'borek-g' && offering === 'prototype' && topic === 'operations') {
    return 'Marketing proposal covering channel strategy, content cadence, local discovery improvements, and digital demand capture.';
  }

  if (offering === 'prototype' && topic === 'operations') {
    return 'Operations proposal focused on repetitive question handling, workflow consistency, escalation rules, and support coverage.';
  }

  if (offering === 'profile' && topic === 'finance') {
    return 'Business profile focused on acquisition readiness, location quality, market position, and differentiated demand drivers.';
  }

  if (packageName.includes('mobile')) {
    return 'Operations prototype focused on mobile coordination, field communication, and faster issue routing.';
  }

  return `${titleCase(topic || 'Project')} ${titleCase(offering || 'overview')} summarizing scope, opportunity, and implementation direction without public client details.`;
}

function buildPublicImpact(row: WorkbookRow): string {
  const client = compactText(String(row.client ?? '')).toLowerCase();
  const offering = compactText(String(row.offering ?? '')).toLowerCase();
  const topic = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = compactText(String(row.package ?? '')).toLowerCase();

  if (offering === 'profile' && topic === 'marketing') {
    return 'Clearer digital demand capture plan';
  }

  if (client === 'borek-g' && offering === 'prototype' && topic === 'operations') {
    return 'Clearer marketing execution plan';
  }

  if (offering === 'prototype' && topic === 'operations') {
    return packageName.includes('mobile') ? 'Better field coordination potential' : 'Faster frontline response flow';
  }

  if (offering === 'profile' && topic === 'finance') {
    return 'Stronger acquisition positioning';
  }

  if (topic === 'marketing') {
    return 'Improved demand generation strategy';
  }

  if (topic === 'operations') {
    return 'Operational leverage opportunity identified';
  }

  return 'General opportunity identified';
}

function buildScopeImpactLabel(row: WorkbookRow): string {
  const industry = compactText(String(row.industry ?? '')).toLowerCase();
  const topic = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = compactText(String(row.package ?? '')).toLowerCase();

  if (topic === 'marketing') {
    return 'sales';
  }

  if (topic === 'finance' || packageName.includes('property sale')) {
    return 'sale value';
  }

  if (topic === 'operations' && packageName.includes('mobile')) {
    return industry === 'construction' ? 'field coordination capacity' : 'coordination capacity';
  }

  if (topic === 'operations' && /(chatbot|assistant)/.test(packageName)) {
    return 'response capacity';
  }

  if (topic === 'operations') {
    return 'operating capacity';
  }

  return 'project value';
}

function buildGrowthImpactPercent(row: WorkbookRow): number | null {
  const initialValue = parseNumber(row['initial value']);
  const targetValue = parseNumber(row['target value']);

  if (
    initialValue !== null
    && targetValue !== null
    && initialValue > 0
    && targetValue > initialValue
  ) {
    return ((targetValue - initialValue) / initialValue) * 100;
  }

  const growthPotential = parseNumber(row['growth potential']);
  if (growthPotential !== null && growthPotential > 1) {
    return (growthPotential - 1) * 100;
  }

  return null;
}

function buildImpact(row: WorkbookRow): string {
  const growthImpactPercent = buildGrowthImpactPercent(row);
  const scopeImpactLabel = buildScopeImpactLabel(row);
  const targetValue = formatCurrency(parseNumber(row['target value']));
  const growthPotential = formatGrowth(parseNumber(row['growth potential']));

  if (growthImpactPercent !== null) {
    return `Modeled ${formatPercent(growthImpactPercent)}% increase in ${scopeImpactLabel}`;
  }

  if (targetValue && scopeImpactLabel) {
    return `${titleCase(scopeImpactLabel)} modeled to ${targetValue}`;
  }

  return targetValue || growthPotential || 'Pipeline opportunity';
}

function buildTitle(row: WorkbookRow): string {
  const client = displayClient(String(row.client ?? ''));
  const topic = titleCase(String(row.topic ?? ''));
  const offering = titleCase(String(row.offering ?? ''));

  if (client && topic && offering) {
    return `${client} ${topic} ${offering}`;
  }

  return [client, topic, offering].filter(Boolean).join(' ');
}

function buildServiceType(row: WorkbookRow): string {
  const client = compactText(String(row.client ?? '')).toLowerCase();
  const offering = compactText(String(row.offering ?? '')).toLowerCase();
  const topicKey = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = titleCase(String(row.package ?? ''));
  const topic = titleCase(String(row.topic ?? ''));

  if (client === 'borek-g' && offering === 'prototype' && topicKey === 'operations') {
    return 'Marketing Proposal';
  }

  return packageName || topic || 'Project';
}

function buildClientDescription(row: WorkbookRow): string {
  const client = displayClient(String(row.client ?? ''));
  const location = displayLocation(String(row.location ?? ''));
  return [client, location].filter(Boolean).join(' in ');
}

function buildTags(row: WorkbookRow): ProjectTag[] {
  const orderedTags: ProjectTag[] = [
    { label: titleCase(String(row.offering ?? '')), tier: 1 },
    { label: titleCase(String(row.topic ?? '')), tier: 2 },
    { label: titleCase(String(row.package ?? '')), tier: 3 },
    ...splitSkills(row.skills).map((label) => ({ label, tier: 3 as const })),
  ].filter((tag) => tag.label);

  return orderedTags.filter((tag, index) => (
    orderedTags.findIndex((candidate) => candidate.label.toLowerCase() === tag.label.toLowerCase()) === index
  ));
}

function buildLink(row: WorkbookRow): string {
  const key = [
    String(row.client ?? '').trim().toLowerCase(),
    String(row.offering ?? '').trim().toLowerCase(),
    String(row.topic ?? '').trim().toLowerCase(),
  ].join('|');

  return routeMap[key] ?? '';
}

function buildPasswordMap(rows: WorkbookRow[]): Record<string, string> {
  return sanitizeRows(rows).reduce<Record<string, string>>((passwords, row) => {
    const link = buildLink(row);
    const password = compactText(String(row.password ?? ''));

    if (link && password) {
      passwords[link] = password;
    }

    return passwords;
  }, {});
}

function normalizeHeader(value: unknown): string {
  return compactText(String(value ?? '')).toLowerCase();
}

function findHeaderRowIndex(sheet: XLSX.WorkSheet): number {
  const rows = XLSX.utils.sheet_to_json<RawSheetRow>(sheet, {
    header: 1,
    raw: false,
    defval: '',
  });

  const index = rows.findIndex((row) => {
    const normalized = row.map((cell) => normalizeHeader(cell));
    return normalized.includes('client') && normalized.includes('industry') && normalized.includes('password');
  });

  if (index === -1) {
    throw new Error('Could not find the project pipeline header row in index-projects.xlsx.');
  }

  return index;
}

function sheetToWorkbookRows(sheet: XLSX.WorkSheet): WorkbookRow[] {
  const rawRows = XLSX.utils.sheet_to_json<RawSheetRow>(sheet, {
    header: 1,
    raw: false,
    defval: '',
  });
  const headerRowIndex = findHeaderRowIndex(sheet);
  const headers = rawRows[headerRowIndex]?.map((cell) => normalizeHeader(cell)) ?? [];

  return rawRows
    .slice(headerRowIndex + 1)
    .map((row) => {
      const record: Record<string, string | number | Date> = {};

      headers.forEach((header, index) => {
        if (header) {
          const value = row[index];
          if (value !== '' && value !== null && value !== undefined) {
            record[header] = value;
          }
        }
      });

      return record as WorkbookRow;
    })
    .filter((row) => Object.keys(row).length > 0);
}

function buildProjectType(row: WorkbookRow): string {
  const client = compactText(String(row.client ?? '')).toLowerCase();
  const offering = compactText(String(row.offering ?? '')).toLowerCase();
  const topic = compactText(String(row.topic ?? '')).toLowerCase();
  const packageName = compactText(String(row.package ?? '')).toLowerCase();
  const overrideKey = [client, offering, topic].join('|');

  if (projectTypeOverrideMap[overrideKey]) {
    return projectTypeOverrideMap[overrideKey];
  }

  if (client === 'borek-g' && offering === 'prototype' && topic === 'operations') {
    return 'Consulting';
  }

  if (['profile', 'audit', 'assessment', 'strategy'].includes(offering)) {
    return 'Consulting';
  }

  if (
    ['implementation', 'integration', 'deployment', 'rollout'].includes(offering)
    || /(implementation|integration|deployment|rollout)/.test(packageName)
  ) {
    return 'Implementation';
  }

  if (
    ['prototype', 'build', 'automation'].includes(offering)
    || /(assistant|chatbot|dashboard|automation|custom)/.test(packageName)
  ) {
    return 'Custom Solution';
  }

  return 'Consulting';
}

function sanitizeRows(rows: WorkbookRow[]): WorkbookRow[] {
  return rows.filter((row) => row.client && row.industry && row.offering && row.topic);
}

function workbookToProjects(rows: WorkbookRow[]): ProjectCard[] {
  return sanitizeRows(rows).map((row, index) => {
    const status = compactText(String(row.status ?? 'Active'));
    const link = buildLink(row);
    const routeOverride = link ? projectShowcaseOverridesByPath[link] : undefined;
    const usePublicProposalCard = isProposalState(status);

    return {
      id: index + 1,
      category: upperLabel(String(row.industry ?? 'Project')),
      projectType: buildProjectType(row),
      serviceType: buildServiceType(row),
      status,
      clientDescription: usePublicProposalCard
        ? routeOverride?.publicClientDescription ?? buildPublicClientDescription(row)
        : buildClientDescription(row),
      title: usePublicProposalCard
        ? routeOverride?.publicTitle ?? buildPublicTitle(row)
        : buildTitle(row),
      description: usePublicProposalCard
        ? routeOverride?.publicDescription ?? buildPublicDescription(row)
        : summarizeProject(row),
      impact: usePublicProposalCard
        ? routeOverride?.publicImpact ?? buildPublicImpact(row)
        : buildImpact(row),
      tags: routeOverride?.tags ?? buildTags(row),
      date: formatMonthYear(row.date),
      link,
    };
  });
}

function serializeContent(content: ProjectPipelineContent): string {
  return `import type { ProjectPipelineContent } from './projectPipeline';\n\nexport const projectPipelineContent: ProjectPipelineContent = ${JSON.stringify(content, null, 2)};\n`;
}

function serializePasswordEnv(passwords: Record<string, string>): string {
  const envVarByRoute: Record<string, string> = {
    '/borek-g': 'PROJECT_PASSWORD_BOREK_G',
    '/borek-g-operations': 'PROJECT_PASSWORD_BOREK_G_OPERATIONS',
    '/uyghur-eats': 'PROJECT_PASSWORD_UYGHUR_EATS',
  };

  const lines = [
    '# Generated from index-projects.xlsx. Do not commit.',
  ];

  for (const [route, envName] of Object.entries(envVarByRoute)) {
    const password = passwords[route];
    if (password) {
      lines.push(`${envName}=${JSON.stringify(password)}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  if (!existsSync(workbookPath)) {
    console.log('Skipping project content sync because index-projects.xlsx is not present.');
    return;
  }

  const workbook = XLSX.readFile(workbookPath, {
    cellDates: true,
    raw: false,
  });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('The workbook does not contain any sheets.');
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = sheetToWorkbookRows(sheet);

  const nextContent: ProjectPipelineContent = {
    hero: defaultHero,
    projects: workbookToProjects(rows),
  };
  const nextPasswords = buildPasswordMap(rows);

  await writeFile(outputPath, serializeContent(nextContent), 'utf8');
  await writeFile(passwordEnvOutputPath, serializePasswordEnv(nextPasswords), 'utf8');
  console.log(`Synced project pipeline content from ${path.basename(workbookPath)} into ${path.relative(repoRoot, outputPath)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
