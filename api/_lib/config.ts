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

type ClientPortalLinkRecord = {
  label?: string;
  href?: string;
  kind?: string;
};

type ClientPortalMilestoneRecord = {
  title?: string;
  dueDate?: string;
  status?: string;
};

type ClientPortalUpdateRecord = {
  date?: string;
  title?: string;
  summary?: string;
};

type ClientPortalContactRecord = {
  name?: string;
  role?: string;
  email?: string;
};

type ClientPortalProjectRecord = {
  id?: string;
  name?: string;
  status?: string;
  summary?: string;
  lastUpdated?: string;
  nextMilestone?: string;
  links?: ClientPortalLinkRecord[];
  milestones?: ClientPortalMilestoneRecord[];
  updates?: ClientPortalUpdateRecord[];
};

type ClientPortalAccountRecord = {
  accountId?: string;
  companyName?: string;
  workspaceTitle?: string;
  allowedEmails?: string[];
  notes?: string;
  supportEmail?: string;
  contacts?: ClientPortalContactRecord[];
  projects?: ClientPortalProjectRecord[];
};

type ClientPortalRegistryFile = {
  accounts?: ClientPortalAccountRecord[];
};

export type ClientPortalLink = {
  label: string;
  href: string;
  kind: string;
};

export type ClientPortalMilestone = {
  title: string;
  dueDate: string;
  status: string;
};

export type ClientPortalUpdate = {
  date: string;
  title: string;
  summary: string;
};

export type ClientPortalContact = {
  name: string;
  role: string;
  email: string;
};

export type ClientPortalProject = {
  id: string;
  name: string;
  status: string;
  summary: string;
  lastUpdated: string;
  nextMilestone: string;
  links: ClientPortalLink[];
  milestones: ClientPortalMilestone[];
  updates: ClientPortalUpdate[];
};

export type ClientPortalAccount = {
  accountId: string;
  companyName: string;
  workspaceTitle: string;
  allowedEmails: string[];
  notes: string;
  supportEmail: string;
  contacts: ClientPortalContact[];
  projects: ClientPortalProject[];
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

function resolveClientPortalRegistryPath(): string {
  const configuredPath = getEnv('CLIENT_PORTAL_REGISTRY_PATH', './client-portal.registry.json');
  return path.isAbsolute(configuredPath) ? configuredPath : path.join(process.cwd(), configuredPath);
}

function loadClientPortalRegistry(): ClientPortalAccount[] | null {
  const registryPath = resolveClientPortalRegistryPath();
  if (!fs.existsSync(registryPath)) {
    return null;
  }

  const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as ClientPortalRegistryFile;
  const accounts = Array.isArray(parsed.accounts) ? parsed.accounts : [];

  return accounts
    .map((account) => {
      const accountId = String(account.accountId ?? '').trim();
      const companyName = String(account.companyName ?? '').trim();
      const workspaceTitle = String(account.workspaceTitle ?? companyName ?? accountId).trim();
      const allowedEmails = unique(
        (Array.isArray(account.allowedEmails) ? account.allowedEmails : [])
          .map((entry) => String(entry ?? '').trim().toLowerCase())
          .filter(Boolean),
      );

      const contacts = (Array.isArray(account.contacts) ? account.contacts : [])
        .map((contact) => ({
          name: String(contact.name ?? '').trim(),
          role: String(contact.role ?? '').trim(),
          email: String(contact.email ?? '').trim(),
        }))
        .filter((contact) => contact.name && contact.email);

      const projects = (Array.isArray(account.projects) ? account.projects : [])
        .map((project) => {
          const projectId = String(project.id ?? '').trim();
          const name = String(project.name ?? '').trim();
          if (!projectId || !name) {
            return null;
          }

          return {
            id: projectId,
            name,
            status: String(project.status ?? 'Active').trim() || 'Active',
            summary: String(project.summary ?? '').trim(),
            lastUpdated: String(project.lastUpdated ?? '').trim(),
            nextMilestone: String(project.nextMilestone ?? '').trim(),
            links: (Array.isArray(project.links) ? project.links : [])
              .map((link) => ({
                label: String(link.label ?? '').trim(),
                href: String(link.href ?? '').trim(),
                kind: String(link.kind ?? 'resource').trim() || 'resource',
              }))
              .filter((link) => link.label && link.href),
            milestones: (Array.isArray(project.milestones) ? project.milestones : [])
              .map((milestone) => ({
                title: String(milestone.title ?? '').trim(),
                dueDate: String(milestone.dueDate ?? '').trim(),
                status: String(milestone.status ?? '').trim(),
              }))
              .filter((milestone) => milestone.title),
            updates: (Array.isArray(project.updates) ? project.updates : [])
              .map((update) => ({
                date: String(update.date ?? '').trim(),
                title: String(update.title ?? '').trim(),
                summary: String(update.summary ?? '').trim(),
              }))
              .filter((update) => update.title && update.summary),
          } satisfies ClientPortalProject;
        })
        .filter((project): project is ClientPortalProject => project !== null);

      if (!accountId || !companyName || allowedEmails.length === 0) {
        return null;
      }

      return {
        accountId,
        companyName,
        workspaceTitle,
        allowedEmails,
        notes: String(account.notes ?? '').trim(),
        supportEmail: String(account.supportEmail ?? 'info@b2w-ai.com').trim() || 'info@b2w-ai.com',
        contacts,
        projects,
      } satisfies ClientPortalAccount;
    })
    .filter((account): account is ClientPortalAccount => account !== null);
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
const clientPortalAccounts = loadClientPortalRegistry() ?? [];

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
    clientId: getEnv('GOOGLE_CLIENT_ID', getEnv('VITE_GOOGLE_CLIENT_ID')),
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
  clientPortal: {
    secret: getEnv('CLIENT_PORTAL_SECRET', getEnv('PROJECT_ACCESS_SECRET')),
    registryPath: resolveClientPortalRegistryPath(),
    accounts: clientPortalAccounts,
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
