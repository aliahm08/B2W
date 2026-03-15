import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env.project-passwords.local'), override: true });

const DEFAULT_EXCLUDED_SEGMENTS = [
  '.git',
  '.vercel',
  'archive-2026-03-08',
  'dist',
  'node_modules',
  'public',
  'tmp_pdf_parser',
];

function splitCsv(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function getEnv(name: string, fallback = ''): string {
  const value = (process.env[name] ?? '').trim();
  return value || fallback;
}

type ProjectAccessRegistryRecord = {
  path?: string;
  title?: string;
  passwordEnvVar?: string;
  proposalEmails?: string[];
  authenticatedPages?: string[];
  notes?: string;
};

type ProjectAccessRegistryFile = {
  projects?: ProjectAccessRegistryRecord[];
};

function resolveRegistryPath(): string {
  const configuredPath = getEnv('PROJECT_ACCESS_REGISTRY_PATH', './project-access.registry.local.json');
  return path.isAbsolute(configuredPath) ? configuredPath : path.join(process.cwd(), configuredPath);
}

function loadProjectAccessRegistry(): Record<string, { password: string; proposalEmails: string[] }> | null {
  const registryPath = resolveRegistryPath();
  if (!fs.existsSync(registryPath)) {
    return null;
  }

  const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as ProjectAccessRegistryFile;
  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];
  const entries = new Map<string, { password: string; proposalEmails: string[] }>();

  for (const project of projects) {
    const proposalEmails = unique(
      (Array.isArray(project.proposalEmails) ? project.proposalEmails : [])
        .map((entry) => String(entry ?? '').trim())
        .filter(Boolean),
    );
    const password = project.passwordEnvVar ? getEnv(project.passwordEnvVar) : '';
    const paths = unique(
      [
        String(project.path ?? '').trim(),
        ...(Array.isArray(project.authenticatedPages) ? project.authenticatedPages.map((entry) => String(entry ?? '').trim()) : []),
      ].filter(Boolean),
    );

    for (const pathname of paths) {
      entries.set(pathname, { password, proposalEmails });
    }
  }

  return Object.fromEntries(entries);
}

const fallbackProjectAccess = {
  '/borek-g': {
    password: getEnv('PROJECT_PASSWORD_BOREK_G'),
    proposalEmails: unique(splitCsv(getEnv('PROJECT_PROPOSAL_EMAILS_BOREK_G'))),
  },
  '/borek-g-operations': {
    password: getEnv('PROJECT_PASSWORD_BOREK_G_OPERATIONS'),
    proposalEmails: unique(splitCsv(getEnv('PROJECT_PROPOSAL_EMAILS_BOREK_G_OPERATIONS'))),
  },
  '/uyghur-eats': {
    password: getEnv('PROJECT_PASSWORD_UYGHUR_EATS'),
    proposalEmails: unique(splitCsv(getEnv('PROJECT_PROPOSAL_EMAILS_UYGHUR_EATS'))),
  },
} satisfies Record<string, { password: string; proposalEmails: string[] }>;

const projectAccessRegistry = loadProjectAccessRegistry() ?? fallbackProjectAccess;

export const config = {
  ollama: {
    apiKey: getEnv('OLLAMA_API_KEY'),
    baseUrl: getEnv('OLLAMA_BASE_URL', 'http://127.0.0.1:11434').replace(/\/$/, ''),
    model: getEnv('OLLAMA_MODEL', 'llama3.1:8b'),
    apiStyle: getEnv('OLLAMA_API_STYLE', 'ollama').toLowerCase(),
  },
  corpus: {
    rootDir: process.cwd(),
    includeExtensions: ['.json', '.md'],
    excludedSegments: DEFAULT_EXCLUDED_SEGMENTS,
    maxDocuments: Number(process.env.KNOWLEDGE_MAX_DOCUMENTS ?? '40'),
    maxSnippetChars: Number(process.env.KNOWLEDGE_MAX_SNIPPET_CHARS ?? '16000'),
  },
  google: {
    serviceAccountJson: getEnv('GOOGLE_SERVICE_ACCOUNT_JSON'),
    allowedCalendarIds: unique(splitCsv(getEnv('GOOGLE_ALLOWED_CALENDAR_IDS'))),
    bookingCalendarId: getEnv('GOOGLE_BOOKING_CALENDAR_ID'),
    internalAttendeeEmails: unique(splitCsv(getEnv('GOOGLE_INTERNAL_ATTENDEE_EMAILS'))),
    allowedAttendeeEmails: unique(splitCsv(getEnv('GOOGLE_ALLOWED_ATTENDEE_EMAILS'))),
    allowedAttendeeDomains: unique(splitCsv(getEnv('GOOGLE_ALLOWED_ATTENDEE_DOMAINS'))),
    allowedDriveFileIds: unique(splitCsv(getEnv('GOOGLE_DRIVE_ALLOWED_FILE_IDS'))),
    allowedDriveFolderIds: unique(splitCsv(getEnv('GOOGLE_DRIVE_ALLOWED_FOLDER_IDS'))),
    bookingFolderId: getEnv('GOOGLE_DRIVE_BOOKING_FOLDER_ID'),
    availabilityDays: Number(getEnv('GOOGLE_BOOKING_LOOKAHEAD_DAYS', '14')),
    slotMinutes: Number(getEnv('GOOGLE_BOOKING_SLOT_MINUTES', '60')),
    workdayStartHour: Number(getEnv('GOOGLE_BOOKING_START_HOUR', '10')),
    workdayEndHour: Number(getEnv('GOOGLE_BOOKING_END_HOUR', '17')),
    timezone: getEnv('GOOGLE_BOOKING_TIMEZONE', 'America/New_York'),
  },
  projectAccess: {
    secret: getEnv('PROJECT_ACCESS_SECRET'),
    registryPath: resolveRegistryPath(),
    passwords: Object.fromEntries(
      Object.entries(projectAccessRegistry).map(([pathname, value]) => [pathname, value.password]),
    ) satisfies Record<string, string>,
    proposalEmails: Object.fromEntries(
      Object.entries(projectAccessRegistry).map(([pathname, value]) => [pathname, value.proposalEmails]),
    ) satisfies Record<string, string[]>,
  },
};

export function isAllowedCalendar(calendarId: string): boolean {
  return config.google.allowedCalendarIds.includes(calendarId);
}

export function isAllowedDriveFile(fileId: string): boolean {
  return config.google.allowedDriveFileIds.includes(fileId);
}

export function isAllowedDriveFolder(folderId: string): boolean {
  return config.google.allowedDriveFolderIds.includes(folderId);
}

export function resolveRelativePath(filePath: string): string {
  return path.relative(config.corpus.rootDir, filePath) || '.';
}
