import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

type ClientRow = {
  client_key?: string;
  title?: string;
  password_env_var?: string;
  proposal_emails_csv?: string;
  primary_path?: string;
  primary_view?: string;
  notes?: string;
};

type PageRow = {
  client_key?: string;
  path?: string;
  view?: string;
};

type RegistryPage = {
  path: string;
  view: 'proposal' | 'profile';
};

const rootDir = process.cwd();
const workbookPath = path.join(rootDir, 'project-access-registry.local.xlsx');
const outputPath = path.join(rootDir, 'project-access.registry.json');

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function readSheet<T>(workbook: XLSX.WorkBook, name: string): T[] {
  const sheet = workbook.Sheets[name];
  if (!sheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<T>(sheet, {
    defval: '',
    raw: false,
  });
}

function splitCsv(value: string): string[] {
  return unique(
    String(value ?? '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizePath(value: string): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeView(value: string, fallback: RegistryPage['view'] = 'proposal'): RegistryPage['view'] {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'profile' || normalized === 'proposal') {
    return normalized;
  }

  return fallback;
}

function scopeIdFromClientKey(value: string): string {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function buildTemplateWorkbook() {
  const workbook = XLSX.utils.book_new();

  const clientsSheet = XLSX.utils.json_to_sheet([
    {
      client_key: 'borek_g',
      title: 'Borek-G',
      password_env_var: 'PROJECT_PASSWORD_BOREK_G',
      proposal_emails_csv: 'info@b2w-ai.com',
      primary_path: '/borek-g-social-media-management',
      primary_view: 'profile',
      notes: 'Keep the real password only in env vars.',
    },
    {
      client_key: 'uyghur_eats',
      title: 'Uyghur Eats',
      password_env_var: 'PROJECT_PASSWORD_UYGHUR_EATS',
      proposal_emails_csv: '',
      primary_path: '/uyghur-eats',
      primary_view: 'profile',
      notes: 'Add a proposal page once that route exists.',
    },
  ]);

  const pagesSheet = XLSX.utils.json_to_sheet([
    { client_key: 'borek_g', path: '/borek-g-operations', view: 'proposal' },
  ]);

  const readmeSheet = XLSX.utils.aoa_to_sheet([
    ['Project Access Registry'],
    ['Store approved proposal emails, protected paths, and password env var names here.'],
    ['Do not store plaintext passwords in this workbook.'],
    ['Run `npm run sync:project-access` after changes to refresh project-access.registry.json for deployment.'],
  ]);

  clientsSheet['!cols'] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 32 },
    { wch: 40 },
    { wch: 24 },
    { wch: 18 },
    { wch: 48 },
  ];
  pagesSheet['!cols'] = [{ wch: 18 }, { wch: 28 }, { wch: 18 }];
  readmeSheet['!cols'] = [{ wch: 110 }];

  XLSX.utils.book_append_sheet(workbook, clientsSheet, 'clients');
  XLSX.utils.book_append_sheet(workbook, pagesSheet, 'pages');
  XLSX.utils.book_append_sheet(workbook, readmeSheet, 'README');

  XLSX.writeFile(workbook, workbookPath);
}

if (!fs.existsSync(workbookPath)) {
  console.log('Skipping project access sync because project-access-registry.local.xlsx is not present.');
  if (!fs.existsSync(outputPath)) {
    buildTemplateWorkbook();
    console.log('Created a template project-access-registry.local.xlsx because no workbook or deployable registry was found.');
  }
  process.exit(0);
}

const workbook = XLSX.readFile(workbookPath);
const clientRows = readSheet<ClientRow>(workbook, 'clients');
const pageRows = readSheet<PageRow>(workbook, 'pages');
const existingRegistry = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) as {
      projects?: Array<{ scopeId?: string; proposalEmails?: string[] }>;
    }
  : { projects: [] };
const existingProposalEmailsByScope = new Map(
  (existingRegistry.projects ?? []).map((project) => [
    scopeIdFromClientKey(String(project.scopeId ?? '')),
    Array.isArray(project.proposalEmails) ? project.proposalEmails : [],
  ]),
);

const pagesByClient = new Map<string, RegistryPage[]>();
for (const row of pageRows) {
  const clientKey = scopeIdFromClientKey(String(row.client_key ?? ''));
  const pathname = normalizePath(String(row.path ?? ''));
  if (!clientKey || !pathname) {
    continue;
  }

  const current = pagesByClient.get(clientKey) ?? [];
  current.push({
    path: pathname,
    view: normalizeView(String(row.view ?? ''), 'proposal'),
  });
  pagesByClient.set(clientKey, current);
}

const projects = clientRows
  .map((row) => {
    const scopeId = scopeIdFromClientKey(String(row.client_key ?? ''));
    const primaryPath = normalizePath(String(row.primary_path ?? ''));
    const primaryView = normalizeView(String(row.primary_view ?? ''), 'profile');
    const extraPages = (pagesByClient.get(scopeId) ?? []).filter((page) => page.path !== primaryPath);
    const pages = unique(
      [
        primaryPath ? `${primaryPath}::${primaryView}` : '',
        ...extraPages.map((page) => `${page.path}::${page.view}`),
      ].filter(Boolean),
    ).map((entry) => {
      const [pathname, view] = entry.split('::');
      return { path: pathname, view: normalizeView(view, 'profile') };
    });

    if (!scopeId || pages.length === 0) {
      return null;
    }

    const workbookProposalEmails = splitCsv(String(row.proposal_emails_csv ?? ''));
    const looksPlaceholderOnly = workbookProposalEmails.length > 0
      && workbookProposalEmails.every((email) => email.endsWith('@example.com'));
    const hasProposalPage = pages.some((page) => page.view === 'proposal');
    const proposalEmails = hasProposalPage
      ? (looksPlaceholderOnly
        ? (existingProposalEmailsByScope.get(scopeId) ?? [])
        : workbookProposalEmails)
      : [];

    return {
      scopeId,
      title: String(row.title ?? '').trim(),
      passwordEnvVar: String(row.password_env_var ?? '').trim(),
      proposalEmails: proposalEmails.length > 0 ? proposalEmails : (hasProposalPage ? ['info@b2w-ai.com'] : []),
      pages,
      notes: String(row.notes ?? '').trim(),
    };
  })
  .filter(Boolean);

fs.writeFileSync(outputPath, `${JSON.stringify({ projects }, null, 2)}\n`);
console.log(`Synced ${projects.length} project access record(s) to ${path.relative(rootDir, outputPath)}`);
