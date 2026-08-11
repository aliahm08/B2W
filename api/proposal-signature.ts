import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { insertProposalSignatureSubmission } from './_common/formSubmissions.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import type { ProposalSignatureSubmission } from './_common/validation.js';
import { validateHoneypot, validateProposalSignatureSubmission } from './_common/validation.js';

function getInternalEmail() {
  return String(process.env.INTERNAL_NOTIFICATION_EMAIL ?? 'info@b2w-ai.com').trim() || 'info@b2w-ai.com';
}

async function processSubmission(submission: ProposalSignatureSubmission) {
  const internalEmail = getInternalEmail();
  return insertProposalSignatureSubmission(submission, internalEmail);
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`proposal-signature:${clientIp}`);
  if (rateLimit.ok === false) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, { ok: false, error: 'Too many requests. Try again later.' });
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    const honeypot = validateHoneypot(body);
    if (honeypot.ok === false) {
      sendJson(res, honeypot.status, { ok: false, error: 'Unable to submit proposal response.' });
      return;
    }

    const validated = validateProposalSignatureSubmission(body);
    if (validated.ok === false) {
      sendJson(res, validated.status, { ok: false, error: validated.error });
      return;
    }

    const submissionId = await processSubmission(validated.value);
    sendJson(res, 200, { ok: true, submissionId });
  } catch (error) {
    console.error('[proposal-signature] unexpected failure', error);
    sendJson(res, 500, { ok: false, error: 'Unable to submit proposal response right now.' });
  }
}
