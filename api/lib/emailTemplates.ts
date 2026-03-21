import type {
  ClientCommunicationSubmission,
  LeadSubmission,
  ProposalSignatureSubmission,
} from './validation.js';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderFields(fields: Array<[string, string]>) {
  const text = fields.map(([label, value]) => `${label}: ${value || '-'}`).join('\n');
  const html = `
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
      ${fields
        .map(
          ([label, value]) => `
            <tr>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top;">${esc(label)}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;vertical-align:top;">${esc(value || '-')}</td>
            </tr>`,
        )
        .join('')}
    </table>
  `;

  return { text, html };
}

export function buildLeadEmails(submission: LeadSubmission) {
  const fields = renderFields([
    ['Pipeline', 'Lead Inquiry'],
    ['Name', submission.name],
    ['Email', submission.email],
    ['Company', submission.company],
    ['Phone', submission.phone],
    ['Inquiry Type', submission.inquiryType],
    ['ARR', submission.arrRange],
    ['Project Areas', submission.projectAreas.join(', ')],
    ['Message', submission.message],
    ['Source Page', submission.sourcePage || submission.sourcePath],
    ['Referrer', submission.referrer],
  ]);

  return {
    internal: {
      subject: `Lead Inquiry: ${submission.inquiryType} from ${submission.name}`,
      text: fields.text,
      html: `<h2>Lead Inquiry</h2>${fields.html}`,
      replyTo: submission.email,
    },
    confirmation: {
      subject: 'B2W received your inquiry',
      text:
        `Hi ${submission.name},\n\n` +
        `B2W received your inquiry about ${submission.inquiryType}. ` +
        `We will review the business context you shared and follow up by email.\n\n` +
        `Best,\nB2W`,
      html:
        `<p>Hi ${esc(submission.name)},</p>` +
        `<p>B2W received your inquiry about <strong>${esc(submission.inquiryType)}</strong>. ` +
        `We will review the business context you shared and follow up by email.</p>` +
        `<p>Best,<br/>B2W</p>`,
    },
  };
}

export function buildClientCommunicationEmails(submission: ClientCommunicationSubmission) {
  const fields = renderFields([
    ['Pipeline', 'Client Communication'],
    ['Client Name', submission.clientName],
    ['Client Email', submission.clientEmail],
    ['Company', submission.company],
    ['Project / Account', submission.projectName],
    ['Message Category', submission.messageCategory],
    ['Message', submission.message],
    ['Source Page', submission.sourcePage || submission.sourcePath],
    ['Referrer', submission.referrer],
  ]);

  return {
    internal: {
      subject: `Client Communication: ${submission.projectName}`,
      text: fields.text,
      html: `<h2>Client Communication</h2>${fields.html}`,
      replyTo: submission.clientEmail,
    },
    confirmation: {
      subject: 'B2W received your message',
      text:
        `Hi ${submission.clientName},\n\n` +
        `B2W received your message regarding ${submission.projectName}. ` +
        `We will review it and follow up by email.\n\n` +
        `Best,\nB2W`,
      html:
        `<p>Hi ${esc(submission.clientName)},</p>` +
        `<p>B2W received your message regarding <strong>${esc(submission.projectName)}</strong>. ` +
        `We will review it and follow up by email.</p>` +
        `<p>Best,<br/>B2W</p>`,
    },
  };
}

export function buildProposalSignatureEmails(submission: ProposalSignatureSubmission) {
  const fields = renderFields([
    ['Pipeline', 'Proposal Signature'],
    ['Signer Name', submission.signerName],
    ['Signer Email', submission.signerEmail],
    ['Company', submission.company],
    ['Proposal / Project Name', submission.proposalName],
    ['Proposal ID', submission.proposalId],
    ['Proposal URL', submission.proposalUrl],
    ['Action Taken', submission.actionTaken],
    ['Selected Option', submission.selectedOptionTitle],
    ['Selected Option Price', submission.selectedOptionPrice],
    ['Notes', submission.notes],
    ['Source Page', submission.sourcePage || submission.sourcePath],
    ['Referrer', submission.referrer],
  ]);

  return {
    internal: {
      subject: `Proposal Signature: ${submission.proposalName}`,
      text: fields.text,
      html: `<h2>Proposal Signature</h2>${fields.html}`,
      replyTo: submission.signerEmail,
    },
    confirmation: {
      subject: 'B2W received your proposal response',
      text:
        `Hi ${submission.signerName},\n\n` +
        `B2W received your proposal response for ${submission.proposalName}. ` +
        `We will review the submission and follow up by email.\n\n` +
        `Best,\nB2W`,
      html:
        `<p>Hi ${esc(submission.signerName)},</p>` +
        `<p>B2W received your proposal response for <strong>${esc(submission.proposalName)}</strong>. ` +
        `We will review the submission and follow up by email.</p>` +
        `<p>Best,<br/>B2W</p>`,
    },
  };
}
