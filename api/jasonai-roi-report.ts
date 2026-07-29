import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { buildJasonAiRoiReportEmail } from './_common/jasonAiRoiReport.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import { sendEmail } from './_common/resend.js';
import { validateHoneypot, validateJasonAiRoiReportSubmission } from './_common/validation.js';
import { buildJasonAiScenario, calculateJasonAiRoi } from '../src/lib/jasonAiRoi.js';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(`jasonai-roi-report:${clientIp}`);
  if (rateLimit.ok === false) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, { ok: false, error: 'Too many report requests. Try again later.' });
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req, 32_000);
    const honeypot = validateHoneypot(body);
    if (honeypot.ok === false) {
      sendJson(res, honeypot.status, { ok: false, error: 'Unable to email this report.' });
      return;
    }

    const validated = validateJasonAiRoiReportSubmission(body);
    if (validated.ok === false) {
      sendJson(res, validated.status, { ok: false, error: validated.error });
      return;
    }

    if (!String(process.env.RESEND_API_KEY ?? '').trim()) {
      sendJson(res, 503, {
        ok: false,
        error: 'Report email delivery is not configured yet. Please try again after launch.',
      });
      return;
    }

    const submission = validated.value;
    const scenario = buildJasonAiScenario(submission.businessType, {
      employees: submission.employees,
      activeProjects: submission.activeProjects,
      averageProjectWeeks: submission.averageProjectWeeks,
    });
    const model = calculateJasonAiRoi(scenario);
    const report = buildJasonAiRoiReportEmail(submission, model);
    const sent = await sendEmail({
      from: 'JasonAI by B2W <info@b2w-ai.com>',
      to: submission.recipientEmail,
      subject: report.subject,
      text: report.text,
      html: report.html,
      replyTo: 'info@b2w-ai.com',
    });

    sendJson(res, 200, {
      ok: true,
      recipientEmail: submission.recipientEmail,
      messageId: sent?.id ?? null,
    });
  } catch (error) {
    console.error('[jasonai-roi-report] delivery failure', error);
    sendJson(res, 500, { ok: false, error: 'Unable to email this report right now.' });
  }
}
