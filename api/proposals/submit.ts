import { allowMethods, readJsonBody, sendJson } from '../_lib/http.js';
import {
  buildProposalSubmissionRecord,
  getProposalDocumentUrl,
  getProposalPdfUrl,
  isValidEmail,
  sendProposalTranscriptEmails,
  storeProposalRecord,
} from '../_lib/proposals.js';

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

export default async function handler(req: any, res: any) {
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
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unable to submit the signed proposal.',
    });
  }
}
