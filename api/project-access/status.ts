import { allowMethods, sendJson } from '../_lib/http.js';
import { getProjectAccessLevel, getProjectPassword, getProjectProposalEmails } from '../_lib/projectAccess.js';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET'])) {
    return;
  }

  const pathname = String(req.query?.path ?? '').trim();

  if (!pathname) {
    sendJson(res, 400, { error: 'Project path is required.' });
    return;
  }

  const password = getProjectPassword(pathname);
  const proposalEmails = getProjectProposalEmails(pathname);

  if (!password && proposalEmails.length === 0) {
    sendJson(res, 404, { error: 'Protected project config not found.' });
    return;
  }

  sendJson(res, 200, { accessLevel: getProjectAccessLevel(req, pathname) ?? 'locked' });
}
