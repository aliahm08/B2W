import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import {
  buildProposalSubmissionRecord,
  getProposalDocumentUrl,
  getProposalDownloadFilename,
  getProposalPdfUrl,
  isValidEmail,
  parseProposalAccessToken,
  readStoredProposalRecord,
  renderProposalPdfBuffer,
  renderProposalTranscriptHtml,
  sendProposalTranscriptEmails,
  storeProposalRecord,
} from './_lib/proposals.js';

type ProposalSubmitBody = {
  path?: string;
  fullName?: string;
  email?: string;
  company?: string;
  notes?: string;
  acceptedTerms?: boolean;
  selectedOptionId?: string;
  signatureDataUrl?: string;
};

function getAction(req: any): string {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  return String(url.searchParams.get('action') ?? '').trim().toLowerCase();
}

export default async function handler(req: any, res: any) {
  const action = getAction(req);

  if (action === 'document') {
    if (!allowMethods(req, res, ['GET'])) {
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
    const documentId = url.searchParams.get('id') ?? '';
    const token = url.searchParams.get('token') ?? '';
    const format = String(url.searchParams.get('format') ?? 'html').trim().toLowerCase();

    const parsed = parseProposalAccessToken(token);
    if (!documentId || !parsed || parsed.documentId !== documentId) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Invalid proposal document token.');
      return;
    }

    try {
      const record = await readStoredProposalRecord(parsed.storage);
      if (record.documentId !== documentId) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Signed proposal transcript not found.');
        return;
      }

      if (format === 'pdf') {
        const pdfBuffer = await renderProposalPdfBuffer(record);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${getProposalDownloadFilename(record)}"`);
        res.end(pdfBuffer);
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(renderProposalTranscriptHtml(record, getProposalPdfUrl(req, record.documentId, parsed.storage)));
      return;
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(error instanceof Error ? error.message : 'Unable to load signed proposal transcript.');
      return;
    }
  }

  if (action === 'submit') {
    if (!allowMethods(req, res, ['POST'])) {
      return;
    }

    try {
      const body = await readJsonBody<ProposalSubmitBody>(req);
      const pathname = String(body.path ?? '').trim();
      const fullName = String(body.fullName ?? '').trim();
      const email = String(body.email ?? '').trim().toLowerCase();
      const company = String(body.company ?? '').trim();
      const notes = String(body.notes ?? '').trim();
      const selectedOptionId = String(body.selectedOptionId ?? '').trim();
      const signatureDataUrl = String(body.signatureDataUrl ?? '').trim();
      const acceptedTerms = Boolean(body.acceptedTerms);

      if (!pathname || !fullName || !email || !selectedOptionId || !signatureDataUrl) {
        sendJson(res, 400, { error: 'Path, signer name, email, selected scope, and signature are required.' });
        return;
      }

      if (!acceptedTerms) {
        sendJson(res, 400, { error: 'Proposal terms must be accepted before signing.' });
        return;
      }

      if (!isValidEmail(email)) {
        sendJson(res, 400, { error: 'A valid signer email is required.' });
        return;
      }

      if (!signatureDataUrl.startsWith('data:image/png;base64,')) {
        sendJson(res, 400, { error: 'Signature payload must be a PNG data URL.' });
        return;
      }

      const record = buildProposalSubmissionRecord({
        path: pathname,
        fullName,
        email,
        company,
        notes,
        acceptedTerms,
        selectedOptionId,
        signatureDataUrl,
      });

      const storage = await storeProposalRecord(record);
      const documentUrl = getProposalDocumentUrl(req, record.documentId, storage);
      const pdfUrl = getProposalPdfUrl(req, record.documentId, storage);
      await sendProposalTranscriptEmails({
        record,
        documentUrl,
        pdfUrl,
      });

      sendJson(res, 200, {
        documentId: record.documentId,
        documentUrl,
        pdfUrl,
        createdAt: record.submittedAt,
      });
      return;
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Unable to submit the signed proposal.',
      });
      return;
    }
  }

  sendJson(res, 400, { error: 'Unsupported proposals action.' });
}
