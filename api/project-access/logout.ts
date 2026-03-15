import { allowMethods, readJsonBody, sendJson } from '../_lib/http.js';
import { clearProjectAccessCookie, getProjectAccessStatus, getProjectAvailableViews } from '../_lib/projectAccess.js';

type LogoutRequestBody = {
  path?: string;
};

export default async function handler(req: any, res: any) {
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
}
