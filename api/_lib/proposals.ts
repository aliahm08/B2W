import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { GoogleAuth } from 'google-auth-library';
import { config, isAllowedDriveFolder } from './config.js';
import { getProjectScopeId, getProjectScopeTitle } from './projectAccess.js';
import { proposalsByPath, type ProposalContent, type ProposalScopeOption } from '../../src/content/proposals.js';

type ProposalStorageDescriptor =
  | { kind: 'drive'; fileId: string }
  | { kind: 'local'; filePath: string };

export type ProposalSubmissionRecord = {
  documentId: string;
  path: string;
  scopeId: string;
  scopeTitle: string;
  proposalTitle: string;
  submittedAt: string;
  fullName: string;
  email: string;
  company: string;
  notes: string;
  acceptedTerms: boolean;
  selectedOption: ProposalScopeOption;
  terms: string[];
  assumptions: string[];
  signatureDataUrl: string;
};

type ProposalAccessTokenPayload = {
  documentId: string;
  storage: ProposalStorageDescriptor;
};

const RESEND_API_URL = 'https://api.resend.com/emails';

function getProposalSecret(): string {
  return config.proposalSigning.secret;
}

function parseServiceAccount() {
  if (!config.google.serviceAccountJson) {
    return null;
  }

  return JSON.parse(config.google.serviceAccountJson);
}

async function getGoogleAccessToken(scopes: string[]): Promise<string | null> {
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

function signValue(value: string): string {
  return createHmac('sha256', getProposalSecret()).update(value).digest('base64url');
}

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getProposalContent(pathname: string): ProposalContent {
  const proposal = proposalsByPath[pathname];
  if (!proposal) {
    throw new Error('No proposal configuration found for this page.');
  }

  return proposal;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getSelectedProposalOption(pathname: string, optionId: string): ProposalScopeOption {
  const proposal = getProposalContent(pathname);
  const option = proposal.options.find((entry) => entry.id === optionId) ?? proposal.options[0];
  if (!option) {
    throw new Error('No proposal scope is configured for this page.');
  }

  return option;
}

async function persistProposalLocally(record: ProposalSubmissionRecord): Promise<ProposalStorageDescriptor> {
  const baseDir = path.join(os.tmpdir(), 'b2w-proposal-documents');
  await fs.mkdir(baseDir, { recursive: true });
  const filePath = path.join(baseDir, `${record.documentId}.json`);
  await fs.writeFile(filePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  return { kind: 'local', filePath };
}

async function persistProposalToDrive(record: ProposalSubmissionRecord): Promise<ProposalStorageDescriptor | null> {
  const folderId = config.proposalSigning.driveFolderId;
  if (!folderId || !isAllowedDriveFolder(folderId)) {
    return null;
  }

  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/drive.file']);
  if (!token) {
    return null;
  }

  const boundary = `b2w-proposal-${Date.now()}`;
  const metadata = {
    name: `proposal-${record.scopeId}-${record.documentId}.json`,
    parents: [folderId],
  };

  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(record, null, 2)}\r\n` +
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
    throw new Error(`Failed to store signed proposal transcript in Drive: ${errorText}`);
  }

  const payload = await response.json() as { id: string };
  return { kind: 'drive', fileId: payload.id };
}

export async function storeProposalRecord(record: ProposalSubmissionRecord): Promise<ProposalStorageDescriptor> {
  const driveRecord = await persistProposalToDrive(record);
  if (driveRecord) {
    return driveRecord;
  }

  return persistProposalLocally(record);
}

export async function readStoredProposalRecord(storage: ProposalStorageDescriptor): Promise<ProposalSubmissionRecord> {
  if (storage.kind === 'local') {
    const raw = await fs.readFile(storage.filePath, 'utf8');
    return JSON.parse(raw) as ProposalSubmissionRecord;
  }

  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/drive.readonly']);
  if (!token) {
    throw new Error('Google Drive access is not configured for signed proposal retrieval.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${storage.fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to read signed proposal transcript: ${errorText}`);
  }

  return response.json() as Promise<ProposalSubmissionRecord>;
}

export function createProposalAccessToken(payload: ProposalAccessTokenPayload): string {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signValue(encodedPayload)}`;
}

export function parseProposalAccessToken(token: string): ProposalAccessTokenPayload | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature || !getProposalSecret()) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(encodedPayload)) as ProposalAccessTokenPayload;
  } catch {
    return null;
  }
}

export function getProposalDocumentUrl(req: any, documentId: string, storage: ProposalStorageDescriptor): string {
  const forwardedProto = String(req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? '').trim();
  const protocol = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
  const token = createProposalAccessToken({ documentId, storage });
  return `${protocol}://${host}/api/proposals/document?id=${encodeURIComponent(documentId)}&token=${encodeURIComponent(token)}`;
}

export function renderProposalTranscriptHtml(record: ProposalSubmissionRecord): string {
  const notesMarkup = record.notes
    ? `<section><h2>Notes</h2><p>${escapeHtml(record.notes).replace(/\n/g, '<br />')}</p></section>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(record.proposalTitle)} | Signed Transcript</title>
    <style>
      body { font-family: Georgia, "Times New Roman", serif; margin: 0; background: #f5f1e8; color: #171717; }
      main { max-width: 920px; margin: 0 auto; padding: 48px 20px 72px; }
      .card { background: #fffdf8; border: 1px solid #d4cec1; border-radius: 24px; padding: 28px; margin-top: 20px; }
      .eyebrow { font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: #6b6b6b; }
      h1 { font-size: 42px; line-height: 1.05; margin: 12px 0 12px; }
      h2 { font-size: 18px; margin: 0 0 12px; }
      p, li { font-size: 16px; line-height: 1.65; }
      ul, ol { margin: 0; padding-left: 22px; }
      .meta { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
      .meta-block { background: #f7f3eb; border: 1px solid #e3ddd1; border-radius: 18px; padding: 14px 16px; }
      .meta-label { font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: #6b6b6b; }
      .signature { margin-top: 18px; border: 1px dashed #b9b1a1; border-radius: 18px; background: white; padding: 12px; }
      img { max-width: 100%; height: auto; display: block; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Signed Proposal Transcript</p>
      <h1>${escapeHtml(record.proposalTitle)}</h1>
      <p>${escapeHtml(record.scopeTitle)}</p>

      <section class="card">
        <div class="meta">
          <div class="meta-block"><div class="meta-label">Signer</div><div>${escapeHtml(record.fullName)}</div></div>
          <div class="meta-block"><div class="meta-label">Email</div><div>${escapeHtml(record.email)}</div></div>
          <div class="meta-block"><div class="meta-label">Company</div><div>${escapeHtml(record.company || 'Not provided')}</div></div>
          <div class="meta-block"><div class="meta-label">Signed At</div><div>${escapeHtml(new Date(record.submittedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }))}</div></div>
          <div class="meta-block"><div class="meta-label">Scope</div><div>${escapeHtml(record.selectedOption.title)}</div></div>
          <div class="meta-block"><div class="meta-label">Commercials</div><div>${escapeHtml(record.selectedOption.price)}<br />${escapeHtml(record.selectedOption.timeline)}</div></div>
        </div>
      </section>

      <section class="card">
        <h2>Selected Scope Offerings</h2>
        <p>${escapeHtml(record.selectedOption.summary)}</p>
        <ul>${record.selectedOption.offerings.map((offering) => `<li>${escapeHtml(offering)}</li>`).join('')}</ul>
      </section>

      <section class="card">
        <h2>Key Terms</h2>
        <ol>${record.terms.map((term) => `<li>${escapeHtml(term)}</li>`).join('')}</ol>
      </section>

      <section class="card">
        <h2>Assumptions</h2>
        <ul>${record.assumptions.map((assumption) => `<li>${escapeHtml(assumption)}</li>`).join('')}</ul>
      </section>

      ${notesMarkup}

      <section class="card">
        <h2>Signature</h2>
        <div class="signature"><img src="${record.signatureDataUrl}" alt="Signer signature" /></div>
      </section>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendProposalTranscriptEmails(input: {
  record: ProposalSubmissionRecord;
  documentUrl: string;
}): Promise<void> {
  if (!config.proposalSigning.resendApiKey || !config.proposalSigning.fromEmail) {
    throw new Error('Transactional email is not configured for signed proposal delivery.');
  }

  const recipients = [input.record.email, config.proposalSigning.internalRecipient];
  const text = [
    `${input.record.fullName} signed ${input.record.proposalTitle}.`,
    '',
    `Scope: ${input.record.selectedOption.title}`,
    `Price: ${input.record.selectedOption.price}`,
    `Timeline: ${input.record.selectedOption.timeline}`,
    '',
    `Open signed transcript: ${input.documentUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #171717;">
      <p style="font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: #6b7280;">Signed Proposal</p>
      <h1 style="font-size: 28px; margin-bottom: 12px;">${escapeHtml(input.record.proposalTitle)}</h1>
      <p style="font-size: 16px; line-height: 1.6;">${escapeHtml(input.record.fullName)} signed the proposal and selected <strong>${escapeHtml(input.record.selectedOption.title)}</strong>.</p>
      <p style="font-size: 16px; line-height: 1.6;">Price: ${escapeHtml(input.record.selectedOption.price)}<br />Timeline: ${escapeHtml(input.record.selectedOption.timeline)}</p>
      <p style="font-size: 16px; line-height: 1.6;"><a href="${input.documentUrl}">Open the signed transcript</a></p>
    </div>
  `;

  await Promise.all(
    recipients.map(async (recipient) => {
      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.proposalSigning.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.proposalSigning.fromEmail,
          to: [recipient],
          subject: `Signed proposal: ${input.record.proposalTitle}`,
          text,
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send proposal transcript email: ${errorText}`);
      }
    }),
  );
}

export function buildProposalSubmissionRecord(input: {
  path: string;
  fullName: string;
  email: string;
  company: string;
  notes: string;
  acceptedTerms: boolean;
  selectedOptionId: string;
  signatureDataUrl: string;
}): ProposalSubmissionRecord {
  const proposal = getProposalContent(input.path);
  const selectedOption = getSelectedProposalOption(input.path, input.selectedOptionId);
  const scopeId = getProjectScopeId(input.path);

  if (!scopeId) {
    throw new Error('Proposal scope could not be resolved for this page.');
  }

  return {
    documentId: randomUUID(),
    path: input.path,
    scopeId,
    scopeTitle: getProjectScopeTitle(input.path),
    proposalTitle: proposal.proposalTitle,
    submittedAt: new Date().toISOString(),
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    company: input.company.trim(),
    notes: input.notes.trim(),
    acceptedTerms: input.acceptedTerms,
    selectedOption,
    terms: proposal.terms,
    assumptions: proposal.assumptions,
    signatureDataUrl: input.signatureDataUrl,
  };
}
