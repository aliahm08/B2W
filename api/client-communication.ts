import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { appendSheetRow } from './lib/googleSheets.js';
import { checkRateLimit, getClientIp } from './lib/rateLimit.js';
import { sendEmail } from './lib/resend.js';
import { buildClientCommunicationEmails } from './lib/emailTemplates.js';
import type { ClientCommunicationSubmission } from './lib/validation.js';
import { validateClientCommunicationSubmission, validateHoneypot } from './lib/validation.js';

function getInternalEmail() {
  return String(process.env.INTERNAL_NOTIFICATION_EMAIL ?? 'info@b2w-ai.com').trim() || 'info@b2w-ai.com';
}

async function processSubmission(submission: ClientCommunicationSubmission) {
  const emails = buildClientCommunicationEmails(submission);
  const internalEmail = getInternalEmail();
  const errors: string[] = [];

  try {
    await sendEmail({
      to: internalEmail,
      subject: emails.internal.subject,
      text: emails.internal.text,
      html: emails.internal.html,
      replyTo: emails.internal.replyTo,
    });
  } catch (error) {
    errors.push(`internal email: ${error instanceof Error ? error.message : 'unknown error'}`);
  }

  try {
    await sendEmail({
      to: submission.clientEmail,
      subject: emails.confirmation.subject,
      text: emails.confirmation.text,
      html: emails.confirmation.html,
    });
  } catch (error) {
    errors.push(`confirmation email: ${error instanceof Error ? error.message : 'unknown error'}`);
  }

  try {
    await appendSheetRow('clientCommunication', [
      submission.submittedAt,
      submission.clientName,
      submission.clientEmail,
      submission.company,
      submission.projectName,
      submission.messageCategory,
      submission.message,
      submission.sourcePage || submission.sourcePath,
      submission.referrer,
      errors.length === 0 ? 'received' : `partial_failure: ${errors.join(' | ')}`,
    ]);
  } catch (error) {
    errors.push(`sheets: ${error instanceof Error ? error.message : 'unknown error'}`);
  }

  return errors;
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`client-communication:${clientIp}`);
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

    const errors = await processSubmission(validated.value);
    if (errors.length > 0) {
      console.error('[client-communication] partial failure', { errors, sourcePath: validated.value.sourcePath });
      sendJson(res, 202, {
        ok: true,
        warning: 'Message received, but one or more follow-up actions need operator review.',
      });
      return;
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('[client-communication] unexpected failure', error);
    sendJson(res, 500, { ok: false, error: 'Unable to send message right now.' });
  }
}
