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

export type ProjectAccessLevel = 'proposal' | 'profile';

export type ProjectAccessPageRecord = {
  path: string;
  view: ProjectAccessLevel;
};

export type ProjectAccessScopeRecord = {
  scopeId: string;
  title: string;
  password: string;
  proposalEmails: string[];
  pages: ProjectAccessPageRecord[];
  notes: string;
};

function splitCsv(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function normalizePath(value?: string): string {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeView(value?: string, fallback: ProjectAccessLevel = 'proposal'): ProjectAccessLevel {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (normalized === 'profile' || normalized === 'proposal') {
    return normalized;
  }

  return fallback;
}

function getEnv(name: string, fallback = ''): string {
  const value = (process.env[name] ?? '').trim();
  return value || fallback;
}

type RegistryProjectPageRecord = {
  path?: string;
  view?: string;
};

type LegacyProjectAccessRegistryRecord = {
  path?: string;
  title?: string;
  passwordEnvVar?: string;
  proposalEmails?: string[];
  authenticatedPages?: string[];
  notes?: string;
};

type ProjectAccessRegistryRecord = {
  scopeId?: string;
  title?: string;
  passwordEnvVar?: string;
  proposalEmails?: string[];
  pages?: RegistryProjectPageRecord[];
  notes?: string;
} | LegacyProjectAccessRegistryRecord;

type ProjectAccessRegistryFile = {
  projects?: ProjectAccessRegistryRecord[];
};

function resolveRegistryPath(): string {
  const configuredPath = getEnv('PROJECT_ACCESS_REGISTRY_PATH', './project-access.registry.json');
  return path.isAbsolute(configuredPath) ? configuredPath : path.join(process.cwd(), configuredPath);
}

function loadProjectAccessRegistry(): ProjectAccessScopeRecord[] | null {
  const registryPath = resolveRegistryPath();
  if (!fs.existsSync(registryPath)) {
    return null;
  }

  const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as ProjectAccessRegistryFile;
  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];

  return projects
    .map((project) => {
      const title = String(project.title ?? '').trim();
      const scopeId = String(('scopeId' in project ? project.scopeId : '') ?? '').trim()
        || String(title || ('path' in project ? project.path : '') || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const passwordEnvVar = String(project.passwordEnvVar ?? '').trim();
      const password = passwordEnvVar ? getEnv(passwordEnvVar) : '';
      const proposalEmails = unique(
        (Array.isArray(project.proposalEmails) ? project.proposalEmails : [])
          .map((entry) => String(entry ?? '').trim().toLowerCase())
          .filter(Boolean),
      );

      const pages = (() => {
        if ('pages' in project && Array.isArray(project.pages) && project.pages.length > 0) {
          return unique(
            project.pages
              .map((page) => {
                const pathname = normalizePath(page.path);
                if (!pathname) {
                  return null;
                }

                return `${pathname}::${normalizeView(page.view)}`;
              })
              .filter(Boolean) as string[],
          ).map<ProjectAccessPageRecord>((entry) => {
            const [pathname, view] = entry.split('::');
            return { path: pathname, view: normalizeView(view, 'profile') };
          });
        }

        const primaryPath = normalizePath('path' in project ? project.path : '');
        const authenticatedPages = Array.isArray((project as LegacyProjectAccessRegistryRecord).authenticatedPages)
          ? (project as LegacyProjectAccessRegistryRecord).authenticatedPages ?? []
          : [];
        const allPaths = unique([primaryPath, ...authenticatedPages.map((entry) => normalizePath(entry))].filter(Boolean));

        return allPaths.map<ProjectAccessPageRecord>((pathname) => ({
          path: pathname,
          view: pathname === primaryPath ? 'profile' : 'proposal',
        }));
      })();

      if (!scopeId || pages.length === 0) {
        return null;
      }

      return {
        scopeId,
        title,
        password,
        proposalEmails,
        pages,
        notes: String(project.notes ?? '').trim(),
      } satisfies ProjectAccessScopeRecord;
    })
    .filter((record): record is ProjectAccessScopeRecord => record !== null);
}

const fallbackProjectAccessScopes: ProjectAccessScopeRecord[] = [
  {
    scopeId: 'borek_g',
    title: 'Borek-G',
    password: getEnv('PROJECT_PASSWORD_BOREK_G'),
    proposalEmails: unique(splitCsv(getEnv('PROJECT_PROPOSAL_EMAILS_BOREK_G')).map((email) => email.toLowerCase())),
    pages: [
      { path: '/borek-g', view: 'profile' },
      { path: '/borek-g-operations', view: 'proposal' },
    ],
    notes: '',
  },
  {
    scopeId: 'uyghur_eats',
    title: 'Uyghur Eats',
    password: getEnv('PROJECT_PASSWORD_UYGHUR_EATS'),
    proposalEmails: unique(splitCsv(getEnv('PROJECT_PROPOSAL_EMAILS_UYGHUR_EATS')).map((email) => email.toLowerCase())),
    pages: [
      { path: '/uyghur-eats', view: 'profile' },
    ],
    notes: '',
  },
];

const projectAccessScopes = loadProjectAccessRegistry() ?? fallbackProjectAccessScopes;

const projectAccessPathLookup = Object.fromEntries(
  projectAccessScopes.flatMap((scope) => scope.pages.map((page) => [
    page.path,
    {
      scopeId: scope.scopeId,
      title: scope.title,
      password: scope.password,
      proposalEmails: scope.proposalEmails,
      view: page.view,
      availableViews: Object.fromEntries(scope.pages.map((item) => [item.view, item.path])) as Partial<Record<ProjectAccessLevel, string>>,
    },
  ])),
) satisfies Record<string, {
  scopeId: string;
  title: string;
  password: string;
  proposalEmails: string[];
  view: ProjectAccessLevel;
  availableViews: Partial<Record<ProjectAccessLevel, string>>;
}>;

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
    scopes: projectAccessScopes,
    paths: projectAccessPathLookup,
  },
  proposalSigning: {
    secret: getEnv('PROPOSAL_SIGNING_SECRET', getEnv('PROJECT_ACCESS_SECRET')),
    resendApiKey: getEnv('RESEND_API_KEY'),
    fromEmail: getEnv('PROPOSAL_SIGNING_FROM_EMAIL'),
    internalRecipient: getEnv('PROPOSAL_SIGNING_INTERNAL_EMAIL', 'info@b2w-ai.com'),
    driveFolderId: getEnv('GOOGLE_DRIVE_SIGNED_PROPOSALS_FOLDER_ID'),
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
