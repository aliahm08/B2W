import { allowMethods, readJsonBody, sendJson } from '../_lib/http.js';
import { config } from '../_lib/config.js';
import { getProjectPassword, getProjectProposalEmails, isAllowedProposalEmail, setProjectAccessCookie } from '../_lib/projectAccess.js';

type LoginRequestBody = {
  path?: string;
  method?: 'proposal' | 'profile';
  email?: string;
  password?: string;
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const body = await readJsonBody<LoginRequestBody>(req);
  const pathname = String(body.path ?? '').trim();
  const method = body.method;
  const email = String(body.email ?? '').trim();
  const password = String(body.password ?? '');

  if (!pathname || !method) {
    sendJson(res, 400, { error: 'Project path and access method are required.' });
    return;
  }

  if (!config.projectAccess.secret) {
    sendJson(res, 503, { error: 'Project access secret is not configured.' });
    return;
  }

  if (method === 'proposal') {
    if (!email) {
      sendJson(res, 400, { error: 'Proposal email is required.' });
      return;
    }

    const allowedEmails = getProjectProposalEmails(pathname);
    if (allowedEmails.length === 0) {
      sendJson(res, 404, { error: 'Proposal access is not configured for this project.' });
      return;
    }

    if (!isAllowedProposalEmail(pathname, email)) {
      sendJson(res, 401, { error: 'Email address not recognized for proposal access.' });
      return;
    }

    setProjectAccessCookie(res, pathname, 'proposal', email);
    sendJson(res, 200, { accessLevel: 'proposal' });
    return;
  }

  if (method !== 'profile') {
    sendJson(res, 400, { error: 'Unsupported access method.' });
    return;
  }

  if (!password) {
    sendJson(res, 400, { error: 'Business profile password is required.' });
    return;
  }

  const expectedPassword = getProjectPassword(pathname);
  if (!expectedPassword) {
    sendJson(res, 404, { error: 'Business profile access is not configured for this project.' });
    return;
  }

  if (password !== expectedPassword) {
    sendJson(res, 401, { error: 'Incorrect password.' });
    return;
  }

  setProjectAccessCookie(res, pathname, 'profile', expectedPassword);
  sendJson(res, 200, { accessLevel: 'profile' });
}
