import { allowMethods } from '../_lib/http.js';
import { parseProposalAccessToken, readStoredProposalRecord, renderProposalTranscriptHtml } from '../_lib/proposals.js';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET'])) {
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const documentId = url.searchParams.get('id') ?? '';
  const token = url.searchParams.get('token') ?? '';

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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(renderProposalTranscriptHtml(record));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(error instanceof Error ? error.message : 'Unable to load signed proposal transcript.');
  }
}
