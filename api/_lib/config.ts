import path from 'node:path';
import dotenv from 'dotenv';

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
    passwords: {
      '/borek-g': getEnv('PROJECT_PASSWORD_BOREK_G'),
      '/borek-g-operations': getEnv('PROJECT_PASSWORD_BOREK_G_OPERATIONS'),
      '/uyghur-eats': getEnv('PROJECT_PASSWORD_UYGHUR_EATS'),
    } satisfies Record<string, string>,
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
