import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { GoogleAuth } from 'google-auth-library';
import PDFDocument from 'pdfkit';
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
  const { protocol, host } = getRequestOriginParts(req);
  const token = createProposalAccessToken({ documentId, storage });
  return `${protocol}://${host}/api/proposals/document?id=${encodeURIComponent(documentId)}&token=${encodeURIComponent(token)}`;
}

export function getProposalPdfUrl(req: any, documentId: string, storage: ProposalStorageDescriptor): string {
  const { protocol, host } = getRequestOriginParts(req);
  const token = createProposalAccessToken({ documentId, storage });
  return `${protocol}://${host}/api/proposals/document?id=${encodeURIComponent(documentId)}&token=${encodeURIComponent(token)}&format=pdf`;
}

function getRequestOriginParts(req: any): { protocol: string; host: string } {
  const forwardedProto = String(req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? '').trim();
  const protocol = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
  return { protocol, host };
}

export function renderProposalTranscriptHtml(record: ProposalSubmissionRecord, pdfUrl?: string): string {
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
      .toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px; }
      .button { display: inline-flex; align-items: center; justify-content: center; padding: 12px 18px; border-radius: 999px; border: 1px solid #171717; color: #171717; text-decoration: none; font-size: 14px; font-weight: 600; }
      .button-primary { background: #171717; color: #fffdf8; }
      img { max-width: 100%; height: auto; display: block; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Signed Proposal Transcript</p>
      <h1>${escapeHtml(record.proposalTitle)}</h1>
      <p>${escapeHtml(record.scopeTitle)}</p>
      ${pdfUrl ? `<div class="toolbar"><a class="button button-primary" href="${escapeHtml(pdfUrl)}">Download PDF</a></div>` : ''}

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

export async function renderProposalPdfBuffer(record: ProposalSubmissionRecord): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: {
      top: 54,
      bottom: 54,
      left: 54,
      right: 54,
    },
    info: {
      Title: `${record.proposalTitle} - Signed Proposal`,
      Author: 'B2W',
      Subject: 'Signed proposal document',
    },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  });

  const completion = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const palette = {
    ink: '#171717',
    muted: '#6b6b6b',
    line: '#d7cfbf',
    paper: '#fffdf8',
    wash: '#f5f0e5',
    accent: '#111111',
  };

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const contentWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;

  const drawHeader = () => {
    doc.save();
    doc.rect(0, 0, pageWidth, 118).fill(palette.accent);
    doc.fillColor('#f4efe5').font('Helvetica-Bold').fontSize(12).text('B2W', doc.page.margins.left, 26, {
      width: contentWidth,
      align: 'left',
    });
    doc.fillColor('#f4efe5').font('Helvetica').fontSize(9).text('Signed proposal document', doc.page.margins.left, 44, {
      width: contentWidth,
      align: 'left',
    });
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(26).text(record.proposalTitle, doc.page.margins.left, 68, {
      width: contentWidth,
      align: 'left',
    });
    doc.restore();
    doc.y = 142;
  };

  const drawFooter = () => {
    doc.save();
    doc.strokeColor(palette.line).lineWidth(1).moveTo(doc.page.margins.left, pageHeight - 42).lineTo(pageWidth - doc.page.margins.right, pageHeight - 42).stroke();
    doc.fillColor(palette.muted).font('Helvetica').fontSize(9).text(
      `B2W confidential proposal transcript - ${record.scopeTitle}`,
      doc.page.margins.left,
      pageHeight - 30,
      { width: contentWidth - 60, align: 'left' },
    );
    doc.text(String(doc.bufferedPageRange().start + doc.bufferedPageRange().count), pageWidth - doc.page.margins.right - 20, pageHeight - 30, {
      width: 20,
      align: 'right',
    });
    doc.restore();
  };

  doc.on('pageAdded', () => {
    drawHeader();
  });

  const addPageIfNeeded = (neededHeight: number) => {
    if (doc.y + neededHeight > pageHeight - 70) {
      drawFooter();
      doc.addPage();
    }
  };

  const writeSectionLabel = (label: string) => {
    addPageIfNeeded(28);
    doc.fillColor(palette.muted).font('Helvetica-Bold').fontSize(9).text(label.toUpperCase(), doc.page.margins.left, doc.y, {
      width: contentWidth,
      characterSpacing: 1.4,
    });
    doc.moveDown(0.6);
  };

  const writeParagraph = (text: string, options: { size?: number; color?: string } = {}) => {
    doc.fillColor(options.color ?? palette.ink).font('Helvetica').fontSize(options.size ?? 11.5).text(text, {
      width: contentWidth,
      lineGap: 3,
    });
    doc.moveDown(0.8);
  };

  const drawMetaGrid = () => {
    const items = [
      ['Signer', record.fullName],
      ['Email', record.email],
      ['Company', record.company || 'Not provided'],
      ['Signed At', new Date(record.submittedAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })],
      ['Scope', record.selectedOption.title],
      ['Commercials', `${record.selectedOption.price}\n${record.selectedOption.timeline}`],
    ];
    const gap = 14;
    const colWidth = (contentWidth - gap) / 2;
    const startX = doc.page.margins.left;
    let currentY = doc.y;

    items.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = startX + col * (colWidth + gap);
      const y = currentY + row * 84;
      addPageIfNeeded((row + 1) * 84 + 10);
      doc.save();
      doc.roundedRect(x, y, colWidth, 70, 16).fillAndStroke(palette.wash, palette.line);
      doc.fillColor(palette.muted).font('Helvetica-Bold').fontSize(8.5).text(item[0].toUpperCase(), x + 14, y + 12, {
        width: colWidth - 28,
        characterSpacing: 1.2,
      });
      doc.fillColor(palette.ink).font('Helvetica').fontSize(11).text(item[1], x + 14, y + 28, {
        width: colWidth - 28,
        lineGap: 3,
      });
      doc.restore();
    });

    doc.y = currentY + Math.ceil(items.length / 2) * 84 + 6;
  };

  const drawBulletList = (items: string[], ordered = false) => {
    items.forEach((item, index) => {
      addPageIfNeeded(28);
      const marker = ordered ? `${index + 1}.` : '\u2022';
      doc.fillColor(palette.ink).font('Helvetica-Bold').fontSize(11).text(marker, doc.page.margins.left, doc.y, {
        width: 16,
      });
      doc.font('Helvetica').text(item, doc.page.margins.left + 18, doc.y - 12, {
        width: contentWidth - 18,
        lineGap: 3,
      });
      doc.moveDown(0.4);
    });
    doc.moveDown(0.6);
  };

  const drawSignature = () => {
    addPageIfNeeded(180);
    writeSectionLabel('Authorized Signature');
    doc.save();
    doc.roundedRect(doc.page.margins.left, doc.y, contentWidth, 122, 18).fillAndStroke('#ffffff', palette.line);
    doc.fillColor(palette.muted).font('Helvetica').fontSize(10).text('Digitally captured signature', doc.page.margins.left + 16, doc.y + 12);
    const signatureBuffer = Buffer.from(record.signatureDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
    doc.image(signatureBuffer, doc.page.margins.left + 16, doc.y + 36, {
      fit: [contentWidth - 32, 66],
      valign: 'center',
    });
    doc.restore();
    doc.y += 138;
  };

  const drawNotes = () => {
    if (!record.notes) {
      return;
    }

    addPageIfNeeded(80);
    writeSectionLabel('Final Notes');
    doc.save();
    doc.font('Helvetica').fontSize(11.5);
    doc.roundedRect(doc.page.margins.left, doc.y, contentWidth, Math.max(80, doc.heightOfString(record.notes, {
      width: contentWidth - 32,
      lineGap: 3,
    }) + 30), 18).fillAndStroke('#ffffff', palette.line);
    doc.fillColor(palette.ink).font('Helvetica').fontSize(11.5).text(record.notes, doc.page.margins.left + 16, doc.y + 14, {
      width: contentWidth - 32,
      lineGap: 3,
    });
    doc.restore();
    doc.moveDown(4.5);
  };

  drawHeader();
  writeSectionLabel('Proposal Summary');
  writeParagraph(record.scopeTitle, { size: 12, color: palette.muted });
  writeParagraph('This document captures the final selected scope, commercial terms, signer details, and signature for the approved B2W engagement.');

  drawMetaGrid();

  writeSectionLabel('Selected Scope');
  doc.font('Helvetica-Bold').fontSize(16).fillColor(palette.ink).text(record.selectedOption.title, {
    width: contentWidth,
  });
  doc.moveDown(0.4);
  writeParagraph(record.selectedOption.summary);
  drawBulletList(record.selectedOption.offerings, false);

  writeSectionLabel('Key Terms');
  drawBulletList(record.terms, true);

  writeSectionLabel('Assumptions');
  drawBulletList(record.assumptions, false);

  drawNotes();
  drawSignature();
  drawFooter();

  doc.end();
  return completion;
}

export function getProposalDownloadFilename(record: ProposalSubmissionRecord): string {
  const normalized = `${record.scopeTitle}-${record.selectedOption.title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return `${normalized || 'b2w-proposal'}-${record.documentId}.pdf`;
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
  pdfUrl: string;
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
    `Download PDF: ${input.pdfUrl}`,
  ].join('\n');

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #171717;">
      <p style="font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: #6b7280;">Signed Proposal</p>
      <h1 style="font-size: 28px; margin-bottom: 12px;">${escapeHtml(input.record.proposalTitle)}</h1>
      <p style="font-size: 16px; line-height: 1.6;">${escapeHtml(input.record.fullName)} signed the proposal and selected <strong>${escapeHtml(input.record.selectedOption.title)}</strong>.</p>
      <p style="font-size: 16px; line-height: 1.6;">Price: ${escapeHtml(input.record.selectedOption.price)}<br />Timeline: ${escapeHtml(input.record.selectedOption.timeline)}</p>
      <p style="font-size: 16px; line-height: 1.6;"><a href="${input.documentUrl}">Open the signed transcript</a></p>
      <p style="font-size: 16px; line-height: 1.6;"><a href="${input.pdfUrl}">Download the PDF version</a></p>
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
