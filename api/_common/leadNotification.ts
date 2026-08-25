import type { LeadSubmission } from './validation.js';
import { sendEmail } from './resend.js';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCrmUrl() {
  const configured = String(process.env.SUPABASE_CRM_URL ?? '').trim();
  if (configured) return configured;

  const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim();
  const projectRef = supabaseUrl.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co/i)?.[1];
  return projectRef ? `https://supabase.com/dashboard/project/${projectRef}/editor` : 'https://supabase.com/dashboard/projects';
}

export async function sendLeadNotification(submission: LeadSubmission, submissionId: string, recipient: string) {
  const crmUrl = getCrmUrl();
  const fields = [
    ['Name', submission.name],
    ['Email', submission.email],
    ['Phone', submission.phone],
    ['Business', submission.company],
    ['Inquiry', submission.inquiryType],
    ['Project areas', submission.projectAreas.join(', ')],
    ['Budget', submission.budgetRange || submission.arrRange || 'Not provided'],
    ['Source', submission.sourceUrl || submission.sourcePath || 'Not provided'],
    ['Submission ID', submissionId],
  ] as const;
  const textFields = fields.map(([label, value]) => `${label}: ${value}`).join('\n');
  const htmlFields = fields
    .map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`)
    .join('');

  return sendEmail({
    to: recipient,
    subject: `New B2W lead: ${submission.name} — ${submission.company}`,
    replyTo: submission.email,
    text: `A new contact-form submission is saved in Supabase.\n\n${textFields}\n\nMessage:\n${submission.message}\n\nOpen the Supabase CRM: ${crmUrl}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:680px;color:#17211b"><h1 style="font-size:24px">New B2W contact</h1><p>This submission is saved in Supabase.</p><table style="width:100%;border-collapse:collapse">${htmlFields}</table><h2 style="font-size:16px;margin-top:24px">Message</h2><div style="white-space:pre-wrap;padding:16px;background:#f5f5f2;border-radius:8px">${escapeHtml(submission.message)}</div><p style="margin-top:24px"><a href="${escapeHtml(crmUrl)}" style="display:inline-block;padding:12px 18px;background:#1f4938;color:#fff;text-decoration:none;border-radius:999px">Open Supabase CRM</a></p></div>`,
  });
}
