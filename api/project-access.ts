import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { config } from './_lib/config.js';
import {
  clearProjectAccessCookie,
  getProjectAccessSession,
  getProjectAccessStatus,
  getProjectAccessStatusForSession,
  getProjectAvailableViews,
  getProjectPassword,
  getProjectProposalEmails,
  isAllowedProposalEmail,
  setProjectAccessCookie,
} from './_lib/projectAccess.js';

type LoginRequestBody = {
  path?: string;
  method?: 'proposal' | 'profile';
  email?: string;
  password?: string;
};

type LogoutRequestBody = {
  path?: string;
};

function getAction(req: any): string {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  return String(url.searchParams.get('action') ?? '').trim().toLowerCase();
}

export default async function handler(req: any, res: any) {
  const action = getAction(req);

  if (action === 'status') {
    if (!allowMethods(req, res, ['GET'])) {
      return;
    }

    const pathname = String(req.query?.path ?? new URL(req.url, `http://${req.headers.host ?? 'localhost'}`).searchParams.get('path') ?? '').trim();

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

    sendJson(res, 200, getProjectAccessStatus(req, pathname));
    return;
  }

  if (action === 'login') {
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

      const proposalPath = getProjectAvailableViews(pathname).proposal;
      const allowedEmails = getProjectProposalEmails(pathname);
      if (!proposalPath || allowedEmails.length === 0) {
        sendJson(res, 404, { error: 'Proposal access is not configured for this project.' });
        return;
      }

      if (!isAllowedProposalEmail(pathname, email)) {
        sendJson(res, 401, { error: 'Email address not recognized for proposal access.' });
        return;
      }

      const session = getProjectAccessSession(req, pathname);
      const nextSession = setProjectAccessCookie(res, pathname, 'proposal', email, session);
      sendJson(res, 200, {
        ...getProjectAccessStatusForSession(proposalPath, nextSession),
        redirectPath: proposalPath,
      });
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

    const profilePath = getProjectAvailableViews(pathname).profile ?? pathname;
    const session = getProjectAccessSession(req, pathname);
    const nextSession = setProjectAccessCookie(res, pathname, 'profile', expectedPassword, session);
    sendJson(res, 200, {
      ...getProjectAccessStatusForSession(profilePath, nextSession),
      redirectPath: profilePath,
    });
    return;
  }

  if (action === 'logout') {
    if (!allowMethods(req, res, ['POST'])) {
      return;
    }

    const body = await readJsonBody<LogoutRequestBody>(req);
    const pathname = String(body.path ?? '').trim();

    if (!pathname) {
      sendJson(res, 400, { error: 'Project path is required.' });
      return;
    }

    if (Object.keys(getProjectAvailableViews(pathname)).length === 0) {
      sendJson(res, 404, { error: 'Protected project config not found.' });
      return;
    }

    clearProjectAccessCookie(res, pathname);
    sendJson(res, 200, getProjectAccessStatus({ headers: {} }, pathname));
    return;
  }

  sendJson(res, 400, { error: 'Unsupported project access action.' });
}
