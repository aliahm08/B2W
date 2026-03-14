import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';
import { projectPipelineContent as currentContent } from '../src/content/projectPipeline.generated';

type RawSheet = {
  properties?: {
    title?: string;
  };
};

type SpreadsheetResponse = {
  sheets?: RawSheet[];
};

type ValuesResponse = {
  values?: string[][];
};

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

const repoRoot = process.cwd();
const gsheetPath = path.join(repoRoot, 'index-projects.gsheet');
const outputPath = path.join(repoRoot, 'src/content/projectPipeline.generated.ts');
const defaultSheetId = process.env.PROJECT_PIPELINE_SHEET_ID?.trim();

const PROJECT_FIELD_ALIASES: Record<keyof Omit<ProjectCard, 'id' | 'tags'>, string[]> = {
  category: ['category', 'industry', 'lane', 'segment'],
  serviceType: ['servicetype', 'service_type', 'service', 'projecttype', 'project_type', 'offer'],
  status: ['status', 'stage', 'phase'],
  clientDescription: ['clientdescription', 'client_description', 'client', 'clientsummary', 'client_summary', 'subtitle'],
  title: ['title', 'projecttitle', 'project_title', 'name'],
  description: ['description', 'summary', 'overview'],
  impact: ['impact', 'result', 'outcome'],
  date: ['date', 'month', 'updated', 'updatedat', 'timeline'],
  link: ['link', 'path', 'url', 'href', 'slug'],
};

const HERO_FIELD_ALIASES: Record<keyof HeroContent, string[]> = {
  headline: ['headline', 'heroheadline', 'hero_headline', 'title'],
  subheadline: ['subheadline', 'hero_subheadline', 'herosubheadline', 'subtitle', 'description'],
  primaryCtaLabel: ['primaryctalabel', 'primary_cta_label', 'cta', 'ctalabel', 'cta_label'],
  primaryCtaHref: ['primaryctahref', 'primary_cta_href', 'ctahref', 'cta_href', 'ctalink', 'cta_link'],
  secondaryCtaLabel: ['secondaryctalabel', 'secondary_cta_label', 'secondarycta', 'secondary_cta'],
  secondaryCtaHref: ['secondaryctahref', 'secondary_cta_href', 'secondaryctalink', 'secondary_cta_link'],
};

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function slugifySegment(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `/${slug}` : '';
}

function splitTags(value: string): string[] {
  return value
    .split(/[|,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getAliasValue(record: Record<string, string>, aliases: string[]): string {
  for (const alias of aliases) {
    const value = record[alias];
    if (value) {
      return value.trim();
    }
  }
  return '';
}

function extractSheetIdFromShortcut(raw: string): string {
  const parsed = JSON.parse(raw) as { doc_id?: string };
  if (!parsed.doc_id) {
    throw new Error('The index-projects.gsheet shortcut is missing a doc_id.');
  }
  return parsed.doc_id;
}

async function getAccessToken(): Promise<string> {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set.');
  }

  const auth = new GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) {
    throw new Error('Failed to acquire a Google access token.');
  }

  return token.token;
}

async function googleFetch<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Sheets API failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

function rowsToRecords(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (header) {
        record[header] = (row[index] ?? '').trim();
      }
    });
    return record;
  }).filter((record) => Object.values(record).some(Boolean));
}

function findHeroInRecord(record: Record<string, string>): Partial<HeroContent> | null {
  const headline = getAliasValue(record, HERO_FIELD_ALIASES.headline);
  const subheadline = getAliasValue(record, HERO_FIELD_ALIASES.subheadline);
  const primaryCtaLabel = getAliasValue(record, HERO_FIELD_ALIASES.primaryCtaLabel);
  const primaryCtaHref = getAliasValue(record, HERO_FIELD_ALIASES.primaryCtaHref);
  const secondaryCtaLabel = getAliasValue(record, HERO_FIELD_ALIASES.secondaryCtaLabel);
  const secondaryCtaHref = getAliasValue(record, HERO_FIELD_ALIASES.secondaryCtaHref);

  if (!headline && !subheadline && !primaryCtaLabel && !secondaryCtaLabel) {
    return null;
  }

  return {
    headline,
    subheadline,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
  };
}

function findHeroInKeyValueRecords(records: Record<string, string>[]): Partial<HeroContent> | null {
  const hero: Partial<HeroContent> = {};

  for (const record of records) {
    const section = (record.section ?? record.group ?? '').trim().toLowerCase();
    const key = normalizeHeader(record.key ?? record.field ?? record.name ?? '');
    const value = (record.value ?? record.content ?? record.copy ?? '').trim();

    if (!value) {
      continue;
    }

    if (section && section !== 'hero') {
      continue;
    }

    for (const [field, aliases] of Object.entries(HERO_FIELD_ALIASES) as Array<[keyof HeroContent, string[]]>) {
      if (aliases.includes(key)) {
        hero[field] = value;
      }
    }
  }

  return Object.keys(hero).length > 0 ? hero : null;
}

function isProjectRecord(record: Record<string, string>): boolean {
  const title = getAliasValue(record, PROJECT_FIELD_ALIASES.title);
  const description = getAliasValue(record, PROJECT_FIELD_ALIASES.description);
  const category = getAliasValue(record, PROJECT_FIELD_ALIASES.category);
  return Boolean(title && (description || category));
}

function recordToProject(record: Record<string, string>, index: number): ProjectCard {
  const rawTags = record.tags ?? record.tag ?? record.keywords ?? '';
  const rawLink = getAliasValue(record, PROJECT_FIELD_ALIASES.link);
  const rawTitle = getAliasValue(record, PROJECT_FIELD_ALIASES.title);
  const idValue = record.id?.trim();
  const numericId = idValue && /^\d+$/.test(idValue) ? Number(idValue) : 1000 + index;
  const normalizedLink = rawLink.startsWith('/') || rawLink.startsWith('http')
    ? rawLink
    : slugifySegment(rawLink || rawTitle);

  return {
    id: numericId,
    category: getAliasValue(record, PROJECT_FIELD_ALIASES.category),
    serviceType: getAliasValue(record, PROJECT_FIELD_ALIASES.serviceType),
    status: getAliasValue(record, PROJECT_FIELD_ALIASES.status),
    clientDescription: getAliasValue(record, PROJECT_FIELD_ALIASES.clientDescription),
    title: rawTitle,
    description: getAliasValue(record, PROJECT_FIELD_ALIASES.description),
    impact: getAliasValue(record, PROJECT_FIELD_ALIASES.impact),
    tags: splitTags(rawTags),
    date: getAliasValue(record, PROJECT_FIELD_ALIASES.date),
    link: normalizedLink,
  };
}

function mergeHero(base: HeroContent, incoming: Partial<HeroContent> | null): HeroContent {
  if (!incoming) {
    return base;
  }

  return {
    headline: incoming.headline || base.headline,
    subheadline: incoming.subheadline || base.subheadline,
    primaryCtaLabel: incoming.primaryCtaLabel || base.primaryCtaLabel,
    primaryCtaHref: incoming.primaryCtaHref || base.primaryCtaHref,
    secondaryCtaLabel: incoming.secondaryCtaLabel || base.secondaryCtaLabel,
    secondaryCtaHref: incoming.secondaryCtaHref || base.secondaryCtaHref,
  };
}

function sanitizeProjects(projects: ProjectCard[], fallback: ProjectCard[]): ProjectCard[] {
  const deduped = new Map<string, ProjectCard>();

  projects.forEach((project) => {
    const key = `${project.title.toLowerCase()}::${project.link.toLowerCase()}`;
    if (!deduped.has(key)) {
      deduped.set(key, project);
    }
  });

  const cleaned = Array.from(deduped.values())
    .filter((project) => project.title && project.description)
    .map((project) => ({
      ...project,
      category: project.category || 'PROJECT',
      serviceType: project.serviceType || 'Project',
      status: project.status || 'Active',
      clientDescription: project.clientDescription || '',
      impact: project.impact || '',
      date: project.date || '',
      link: project.link || '',
      tags: project.tags.filter(Boolean),
    }));

  return cleaned.length > 0 ? cleaned : fallback;
}

function serializeContent(content: ProjectPipelineContent): string {
  return `import type { ProjectPipelineContent } from './projectPipeline';\n\nexport const projectPipelineContent: ProjectPipelineContent = ${JSON.stringify(content, null, 2)};\n`;
}

async function main() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()) {
    console.log('Skipping project content sync because GOOGLE_SERVICE_ACCOUNT_JSON is not set.');
    return;
  }

  const sheetId = defaultSheetId || extractSheetIdFromShortcut(await readFile(gsheetPath, 'utf8'));
  const token = await getAccessToken();
  const spreadsheet = await googleFetch<SpreadsheetResponse>(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties.title`,
    token,
  );

  const sheetNames = (spreadsheet.sheets ?? [])
    .map((sheet) => sheet.properties?.title?.trim())
    .filter((sheetName): sheetName is string => Boolean(sheetName));

  let hero = currentContent.hero;
  const projects: ProjectCard[] = [];

  for (const sheetName of sheetNames) {
    const values = await googleFetch<ValuesResponse>(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`,
      token,
    );
    const records = rowsToRecords(values.values ?? []);
    if (records.length === 0) {
      continue;
    }

    hero = mergeHero(hero, findHeroInKeyValueRecords(records));

    const inlineHeroRecord = records.find((record) => findHeroInRecord(record));
    if (inlineHeroRecord) {
      hero = mergeHero(hero, findHeroInRecord(inlineHeroRecord));
    }

    records
      .filter(isProjectRecord)
      .forEach((record) => {
        projects.push(recordToProject(record, projects.length));
      });
  }

  const nextContent: ProjectPipelineContent = {
    hero,
    projects: sanitizeProjects(projects, currentContent.projects),
  };

  await writeFile(outputPath, serializeContent(nextContent), 'utf8');
  console.log(`Synced project pipeline content from Google Sheets into ${path.relative(repoRoot, outputPath)}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
