import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { appendSheetRow } from './_common/googleSheets.js';
import { insertLeadFormSubmission, saveLeadSubmissionBudget } from './_common/formSubmissions.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import { sendEmail } from './_common/resend.js';
import { buildLeadEmails } from './_common/emailTemplates.js';
import type { LeadSubmission } from './_common/validation.js';
import { validateHoneypot, validateLeadSubmission } from './_common/validation.js';

function getInternalEmail() {
  return String(process.env.INTERNAL_NOTIFICATION_EMAIL ?? 'info@b2w-ai.com').trim() || 'info@b2w-ai.com';
}

function hasResendConfig() {
  return Boolean(String(process.env.RESEND_API_KEY ?? '').trim());
}

function hasSheetsConfig() {
  return Boolean(String(process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? '').trim());
}

async function processLeadSubmission(submission: LeadSubmission) {
  const emails = buildLeadEmails(submission);
  const internalEmail = getInternalEmail();
  const errors: string[] = [];

  if (hasResendConfig()) {
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
  }

  if (hasResendConfig()) {
    try {
      await sendEmail({
        to: submission.email,
        subject: emails.confirmation.subject,
        text: emails.confirmation.text,
        html: emails.confirmation.html,
      });
    } catch (error) {
      errors.push(`confirmation email: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  if (hasSheetsConfig()) {
    try {
      await appendSheetRow('lead', [
        submission.submittedAt,
        submission.name,
        submission.email,
        submission.company,
        submission.phone,
        submission.website,
        submission.inquiryType,
        submission.message,
        submission.sourcePage || submission.sourcePath,
        submission.referrer,
        errors.length === 0 ? 'received' : `partial_failure: ${errors.join(' | ')}`,
      ]);
    } catch (error) {
      errors.push(`sheets: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  return errors;
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

    const submissionInsertId = await insertLeadFormSubmission(validated.value, getInternalEmail()).catch((error) => {
      console.error('[contact-lead] insert failure', error);
      throw error;
    });
    const errors = await processLeadSubmission(validated.value);
    if (errors.length > 0) {
      console.error('[contact-lead] partial failure', { errors, sourcePath: validated.value.sourcePath });
      sendJson(res, 202, {
        ok: true,
        submissionId: submissionInsertId,
        warning: 'Inquiry received, but one or more follow-up actions need operator review.',
      });
      return;
    }

    sendJson(res, 200, { ok: true, submissionId: submissionInsertId });
  } catch (error) {
    console.error('[contact-lead] unexpected failure', error);
    sendJson(res, 500, { ok: false, error: 'Unable to submit inquiry right now.' });
  }
}
