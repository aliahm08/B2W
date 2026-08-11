import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { insertLeadFormSubmission, saveLeadSubmissionBudget } from './_common/formSubmissions.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import type { LeadSubmission } from './_common/validation.js';
import { validateHoneypot, validateLeadSubmission } from './_common/validation.js';

function getInternalEmail() {
  return String(process.env.INTERNAL_NOTIFICATION_EMAIL ?? 'info@b2w-ai.com').trim() || 'info@b2w-ai.com';
}

async function processLeadSubmission(submission: LeadSubmission) {
  const internalEmail = getInternalEmail();
  return insertLeadFormSubmission(submission, internalEmail);
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`contact-lead:${clientIp}`);
  if (rateLimit.ok === false) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, { ok: false, error: 'Too many requests. Try again later.' });
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    const submissionId = typeof body.submissionId === 'string' ? body.submissionId.trim() : '';
    const budgetRange = typeof body.budgetRange === 'string' ? body.budgetRange.trim() : '';

    if (submissionId && budgetRange) {
      await saveLeadSubmissionBudget(submissionId, budgetRange);
      sendJson(res, 200, { ok: true, submissionId });
      return;
    }

    const honeypot = validateHoneypot(body);
    if (honeypot.ok === false) {
      sendJson(res, honeypot.status, { ok: false, error: 'Unable to submit inquiry.' });
      return;
    }

    const validated = validateLeadSubmission(body);
    if (validated.ok === false) {
      sendJson(res, validated.status, { ok: false, error: validated.error });
      return;
    }

    const leadSubmissionId = await processLeadSubmission(validated.value);
    sendJson(res, 200, { ok: true, submissionId: leadSubmissionId });
  } catch (error) {
    console.error('[contact-lead] unexpected failure', error);
    sendJson(res, 500, { ok: false, error: 'Unable to submit inquiry right now.' });
  }
}
