import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { insertClientFormSubmission } from './_common/formSubmissions.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import type { ClientCommunicationSubmission } from './_common/validation.js';
import { validateClientCommunicationSubmission, validateHoneypot } from './_common/validation.js';

function getInternalEmail() {
  return String(process.env.INTERNAL_NOTIFICATION_EMAIL ?? 'info@b2w-ai.com').trim() || 'info@b2w-ai.com';
}

async function processSubmission(submission: ClientCommunicationSubmission) {
  const internalEmail = getInternalEmail();
  return insertClientFormSubmission(submission, internalEmail);
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`client-communication:${clientIp}`);
  if (rateLimit.ok === false) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, { ok: false, error: 'Too many requests. Try again later.' });
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    const honeypot = validateHoneypot(body);
    if (honeypot.ok === false) {
      sendJson(res, honeypot.status, { ok: false, error: 'Unable to send message.' });
      return;
    }

    const validated = validateClientCommunicationSubmission(body);
    if (validated.ok === false) {
      sendJson(res, validated.status, { ok: false, error: validated.error });
      return;
    }

    const submissionId = await processSubmission(validated.value);
    sendJson(res, 200, { ok: true, submissionId });
  } catch (error) {
    console.error('[client-communication] unexpected failure', error);
    sendJson(res, 500, { ok: false, error: 'Unable to send message right now.' });
  }
}
