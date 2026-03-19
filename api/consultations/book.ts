import { createBooking } from '../_lib/google.js';
import { allowMethods, readJsonBody, sendJson } from '../_lib/http.js';

type BookingRequest = {
  name?: string;
  email?: string;
  company?: string;
  notes?: string;
  service?: string;
  start?: string;
  end?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody<BookingRequest>(req);
    const name = body.name?.trim() ?? '';
    const email = body.email?.trim().toLowerCase() ?? '';
    const start = body.start?.trim() ?? '';
    const end = body.end?.trim() ?? '';

    if (!name || !email || !start || !end) {
      sendJson(res, 400, { error: 'Name, email, start, and end are required.' });
      return;
    }

    if (!isValidEmail(email)) {
      sendJson(res, 400, { error: 'A valid email address is required.' });
      return;
    }

    const result = await createBooking({
      name,
      email,
      company: body.company?.trim(),
      notes: [body.service?.trim() ? `Requested service: ${body.service.trim()}` : '', body.notes?.trim() ?? '']
        .filter(Boolean)
        .join('\n\n'),
      start,
      end,
    });

    sendJson(res, 200, {
      ok: true,
      eventId: result.eventId,
    });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected booking failure.',
    });
  }
}
