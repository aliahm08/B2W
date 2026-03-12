import { GoogleAuth } from 'google-auth-library';
import { config, isAllowedCalendar, isAllowedDriveFile, isAllowedDriveFolder } from './config';

type DriveDocument = {
  id: string;
  path: string;
  content: string;
  source: 'drive';
};

type TimeRange = {
  start: Date;
  end: Date;
};

function parseServiceAccount() {
  if (!config.google.serviceAccountJson) {
    return null;
  }

  return JSON.parse(config.google.serviceAccountJson);
}

async function getAccessToken(scopes: string[]): Promise<string | null> {
  const credentials = parseServiceAccount();

  if (!credentials) {
    return null;
  }

  const auth = new GoogleAuth({
    credentials,
    scopes,
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token ?? null;
}

async function googleFetch<T>(url: string, options: RequestInit, scopes: string[]): Promise<T> {
  const token = await getAccessToken(scopes);

  if (!token) {
    throw new Error('Google integration is not configured.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API request failed (${response.status}): ${errorText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

function sanitizeDriveContent(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .trim();
}

async function readDriveFile(fileId: string, label: string): Promise<DriveDocument | null> {
  try {
    const token = await getAccessToken(['https://www.googleapis.com/auth/drive.readonly']);

    if (!token) {
      return null;
    }

    const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!metadataResponse.ok) {
      return null;
    }

    const metadata = await metadataResponse.json() as { id: string; name: string; mimeType: string };
    let contentResponse: Response;

    if (metadata.mimeType === 'application/vnd.google-apps.document') {
      contentResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } else {
      contentResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }

    if (!contentResponse.ok) {
      return null;
    }

    const content = sanitizeDriveContent(await contentResponse.text());
    if (!content) {
      return null;
    }

    return {
      id: fileId,
      path: `drive/${label}/${metadata.name}`,
      content,
      source: 'drive',
    };
  } catch {
    return null;
  }
}

async function listFolderFiles(folderId: string): Promise<Array<{ id: string; name: string }>> {
  if (!isAllowedDriveFolder(folderId)) {
    return [];
  }

  const response = await googleFetch<{
    files?: Array<{ id: string; name: string }>;
  }>(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`'${folderId}' in parents and trashed = false`)}&pageSize=20&fields=files(id,name)`,
    { method: 'GET' },
    ['https://www.googleapis.com/auth/drive.readonly'],
  );

  return response.files ?? [];
}

export async function getAllowedDriveDocuments(): Promise<DriveDocument[]> {
  if (!config.google.serviceAccountJson) {
    return [];
  }

  const explicitFiles = await Promise.all(
    config.google.allowedDriveFileIds.map((fileId) => readDriveFile(fileId, 'allowed-file')),
  );

  const folderResults = await Promise.all(
    config.google.allowedDriveFolderIds.map(async (folderId) => {
      const files = await listFolderFiles(folderId);
      return Promise.all(
        files.map((file) => readDriveFile(file.id, folderId)),
      );
    }),
  );

  return [...explicitFiles, ...folderResults.flat()].filter((doc): doc is DriveDocument => Boolean(doc));
}

function parseOffsetMinutes(offset: string): number {
  const match = offset.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3]);
  return sign * (hours * 60 + minutes);
}

function getTimezoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
    timeZoneName: 'shortOffset',
  });

  const entries = formatter.formatToParts(date);
  const map = new Map(entries.map((entry) => [entry.type, entry.value]));
  const offsetName = map.get('timeZoneName') ?? 'GMT';
  const offsetMatch = offsetName.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
  const normalizedOffset = offsetMatch
    ? `${offsetMatch[1].startsWith('-') ? '-' : '+'}${offsetMatch[1].replace(/[+-]/, '').padStart(2, '0')}:${(offsetMatch[2] ?? '00').padStart(2, '0')}`
    : '+00:00';

  return {
    year: Number(map.get('year')),
    month: Number(map.get('month')),
    day: Number(map.get('day')),
    hour: Number(map.get('hour')),
    minute: Number(map.get('minute')),
    second: Number(map.get('second')),
    weekday: map.get('weekday') ?? '',
    offset: normalizedOffset,
  };
}

function zonedDate(timeZone: string, year: number, month: number, day: number, hour: number, minute: number): Date {
  const approx = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const parts = getTimezoneParts(approx, timeZone);
  const offsetMinutes = parseOffsetMinutes(parts.offset);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - offsetMinutes * 60_000);
}

function floorToSlot(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setSeconds(0, 0);
  const currentMinutes = result.getMinutes();
  result.setMinutes(currentMinutes - (currentMinutes % minutes), 0, 0);
  return result;
}

function rangesOverlap(left: TimeRange, right: TimeRange): boolean {
  return left.start < right.end && right.start < left.end;
}

function isAllowedGuestEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (config.google.allowedAttendeeEmails.includes(normalized)) {
    return true;
  }

  const domain = normalized.split('@')[1] ?? '';
  return config.google.allowedAttendeeDomains.includes(domain);
}

export function isGoogleBookingConfigured(): boolean {
  return Boolean(
    config.google.serviceAccountJson &&
      config.google.bookingCalendarId &&
      isAllowedCalendar(config.google.bookingCalendarId),
  );
}

export async function getAvailability(): Promise<Array<{ start: string; end: string }>> {
  if (!isGoogleBookingConfigured()) {
    return [];
  }

  const now = new Date();
  const start = floorToSlot(now, config.google.slotMinutes);
  const end = new Date(start.getTime() + config.google.availabilityDays * 24 * 60 * 60_000);

  const freeBusy = await googleFetch<{
    calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>;
  }>(
    'https://www.googleapis.com/calendar/v3/freeBusy',
    {
      method: 'POST',
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: config.google.timezone,
        items: config.google.allowedCalendarIds.map((id) => ({ id })),
      }),
    },
    ['https://www.googleapis.com/auth/calendar'],
  );

  const busyRanges = Object.values(freeBusy.calendars ?? {})
    .flatMap((calendar) => calendar.busy ?? [])
    .map((range) => ({
      start: new Date(range.start),
      end: new Date(range.end),
    }));

  const slots: Array<{ start: string; end: string }> = [];

  for (let dayOffset = 0; dayOffset < config.google.availabilityDays; dayOffset += 1) {
    const day = new Date(now.getTime() + dayOffset * 24 * 60 * 60_000);
    const dayParts = getTimezoneParts(day, config.google.timezone);

    if (dayParts.weekday === 'Sat' || dayParts.weekday === 'Sun') {
      continue;
    }

    for (let hour = config.google.workdayStartHour; hour < config.google.workdayEndHour; hour += 1) {
      for (let minute = 0; minute < 60; minute += config.google.slotMinutes) {
        const slotStart = zonedDate(config.google.timezone, dayParts.year, dayParts.month, dayParts.day, hour, minute);
        const slotEnd = new Date(slotStart.getTime() + config.google.slotMinutes * 60_000);

        if (slotStart <= now) {
          continue;
        }

        const overlapsBusy = busyRanges.some((busyRange) =>
          rangesOverlap({ start: slotStart, end: slotEnd }, busyRange),
        );

        if (!overlapsBusy) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
          });
        }
      }
    }
  }

  return slots.slice(0, 24);
}

type BookingInput = {
  name: string;
  email: string;
  company?: string;
  notes?: string;
  start: string;
  end: string;
};

async function writeBookingRecordToDrive(input: BookingInput): Promise<void> {
  const folderId = config.google.bookingFolderId;

  if (!folderId || !isAllowedDriveFolder(folderId)) {
    return;
  }

  const token = await getAccessToken(['https://www.googleapis.com/auth/drive.file']);
  if (!token) {
    return;
  }

  const boundary = `b2w-${Date.now()}`;
  const metadata = {
    name: `consultation-${new Date().toISOString()}.json`,
    parents: [folderId],
  };

  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(
      {
        ...input,
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    )}\r\n` +
    `--${boundary}--`;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to write booking record to Drive: ${errorText}`);
  }
}

export async function createBooking(input: BookingInput): Promise<{ eventId: string }> {
  if (!isGoogleBookingConfigured()) {
    throw new Error('Google Calendar booking is not configured.');
  }

  const start = new Date(input.start);
  const end = new Date(input.end);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new Error('Invalid booking time range.');
  }

  const availableSlots = await getAvailability();
  const slotStillAvailable = availableSlots.some(
    (slot) => slot.start === start.toISOString() && slot.end === end.toISOString(),
  );

  if (!slotStillAvailable) {
    throw new Error('That consultation slot is no longer available.');
  }

  const attendees = [
    ...config.google.internalAttendeeEmails.map((email) => ({ email })),
    ...(input.email.trim() ? [{ email: input.email.trim() }] : []),
  ];

  if (
    input.email.trim() &&
    !isAllowedGuestEmail(input.email) &&
    !config.google.internalAttendeeEmails.includes(input.email.trim().toLowerCase())
  ) {
    throw new Error('That attendee email is not permitted by the current allowlist.');
  }

  const descriptionParts = [
    `Prospect: ${input.name}`,
    input.company ? `Company: ${input.company}` : '',
    input.notes ? `Notes:\n${input.notes}` : '',
  ].filter(Boolean);

  const created = await googleFetch<{ id: string }>(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.google.bookingCalendarId)}/events?sendUpdates=all`,
    {
      method: 'POST',
      body: JSON.stringify({
        summary: `B2W consultation: ${input.name}`,
        description: descriptionParts.join('\n\n'),
        start: {
          dateTime: start.toISOString(),
          timeZone: config.google.timezone,
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: config.google.timezone,
        },
        attendees,
      }),
    },
    ['https://www.googleapis.com/auth/calendar.events'],
  );

  await writeBookingRecordToDrive(input);

  return { eventId: created.id };
}
