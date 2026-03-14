import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import XLSX from 'xlsx';

type HeroContent = {
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
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
  tags: string[];
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
  headline: 'We build intelligence.',
  subheadline: 'Solving complex problems with simple, effective AI solutions. No hype. Just results.',
  primaryCtaLabel: 'Explore capabilities',
  primaryCtaHref: '/#capabilities',
  secondaryCtaLabel: 'See Projects',
  secondaryCtaHref: '/#industries',
};

const routeMap: Record<string, string> = {
  'borek-g|profile|marketing': '/borek-g',
  'borek-g|prototype|operations': '/borek-g-operations',
  'uyghur eats|profile|finance': '/uyghur-eats',
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
  'borek-g|prototype|operations': 'Custom Solution',
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

function buildImpact(row: WorkbookRow): string {
  const targetValue = formatCurrency(parseNumber(row['target value']));
  const growthPotential = formatGrowth(parseNumber(row['growth potential']));

  if (targetValue && growthPotential) {
    return `${growthPotential} growth potential to ${targetValue}`;
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
  const packageName = titleCase(String(row.package ?? ''));
  const topic = titleCase(String(row.topic ?? ''));

  return packageName || topic || 'Project';
}

function buildClientDescription(row: WorkbookRow): string {
  const client = displayClient(String(row.client ?? ''));
  const location = displayLocation(String(row.location ?? ''));
  return [client, location].filter(Boolean).join(' in ');
}

function buildTags(row: WorkbookRow): string[] {
  const tags = [
    titleCase(String(row.offering ?? '')),
    titleCase(String(row.topic ?? '')),
    titleCase(String(row.package ?? '')),
    ...splitSkills(row.skills),
  ].filter(Boolean);

  return Array.from(new Set(tags));
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
  return sanitizeRows(rows).map((row, index) => ({
    id: index + 1,
    category: upperLabel(String(row.industry ?? 'Project')),
    projectType: buildProjectType(row),
    serviceType: buildServiceType(row),
    status: compactText(String(row.status ?? 'Active')),
    clientDescription: buildClientDescription(row),
    title: buildTitle(row),
    description: summarizeProject(row),
    impact: buildImpact(row),
    tags: buildTags(row),
    date: formatMonthYear(row.date),
    link: buildLink(row),
  }));
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
