import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

type ClientRow = {
  client_key?: string;
  title?: string;
  password_env_var?: string;
  proposal_emails_csv?: string;
  primary_path?: string;
  notes?: string;
};

type PageRow = {
  client_key?: string;
  path?: string;
};

const rootDir = process.cwd();
const workbookPath = path.join(rootDir, 'project-access-registry.local.xlsx');
const outputPath = path.join(rootDir, 'project-access.registry.local.json');

function unique(values: string[]): string[] {
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
      .map((entry) => entry.trim())
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

function buildTemplateWorkbook() {
  const workbook = XLSX.utils.book_new();

  const clientsSheet = XLSX.utils.json_to_sheet([
    {
      client_key: 'borek_g',
      title: 'Borek-G',
      password_env_var: 'PROJECT_PASSWORD_BOREK_G',
      proposal_emails_csv: 'owner@example.com,ops@example.com',
      primary_path: '/borek-g',
      notes: 'Keep the real password only in env vars.',
    },
    {
      client_key: 'uyghur_eats',
      title: 'Uyghur Eats',
      password_env_var: 'PROJECT_PASSWORD_UYGHUR_EATS',
      proposal_emails_csv: 'buyer@example.com',
      primary_path: '/uyghur-eats',
      notes: 'Add all related authenticated pages in the pages sheet.',
    },
  ]);

  const pagesSheet = XLSX.utils.json_to_sheet([
    { client_key: 'borek_g', path: '/borek-g' },
    { client_key: 'borek_g', path: '/borek-g-operations' },
    { client_key: 'uyghur_eats', path: '/uyghur-eats' },
  ]);

  const readmeSheet = XLSX.utils.aoa_to_sheet([
    ['Project Access Registry'],
    ['Store approved emails, protected paths, and password env var names here.'],
    ['Do not store plaintext passwords in this workbook.'],
    ['Run `npm run sync:project-access` after changes to refresh project-access.registry.local.json for the backend.'],
  ]);

  clientsSheet['!cols'] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 32 },
    { wch: 40 },
    { wch: 24 },
    { wch: 48 },
  ];
  pagesSheet['!cols'] = [{ wch: 18 }, { wch: 28 }];
  readmeSheet['!cols'] = [{ wch: 110 }];

  XLSX.utils.book_append_sheet(workbook, clientsSheet, 'clients');
  XLSX.utils.book_append_sheet(workbook, pagesSheet, 'pages');
  XLSX.utils.book_append_sheet(workbook, readmeSheet, 'README');

  XLSX.writeFile(workbook, workbookPath);
}

if (!fs.existsSync(workbookPath)) {
  buildTemplateWorkbook();
}

const workbook = XLSX.readFile(workbookPath);
const clientRows = readSheet<ClientRow>(workbook, 'clients');
const pageRows = readSheet<PageRow>(workbook, 'pages');

const pagesByClient = new Map<string, string[]>();
for (const row of pageRows) {
  const clientKey = String(row.client_key ?? '').trim();
  const pathname = normalizePath(String(row.path ?? ''));
  if (!clientKey || !pathname) {
    continue;
  }

  const current = pagesByClient.get(clientKey) ?? [];
  current.push(pathname);
  pagesByClient.set(clientKey, current);
}

const projects = clientRows
  .map((row) => {
    const clientKey = String(row.client_key ?? '').trim();
    const primaryPath = normalizePath(String(row.primary_path ?? ''));
    const authenticatedPages = unique([
      primaryPath,
      ...(pagesByClient.get(clientKey) ?? []),
    ].filter(Boolean));

    if (!clientKey || !primaryPath) {
      return null;
    }

    return {
      path: primaryPath,
      title: String(row.title ?? '').trim(),
      passwordEnvVar: String(row.password_env_var ?? '').trim(),
      proposalEmails: splitCsv(String(row.proposal_emails_csv ?? '')),
      authenticatedPages,
      notes: String(row.notes ?? '').trim(),
    };
  })
  .filter(Boolean);

fs.writeFileSync(outputPath, `${JSON.stringify({ projects }, null, 2)}\n`);
console.log(`Synced ${projects.length} project access record(s) to ${path.relative(rootDir, outputPath)}`);
