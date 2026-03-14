import { allowMethods, sendJson } from '../_lib/http';
import { getProjectPassword, hasProjectAccess } from '../_lib/projectAccess';

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

  if (!password) {
    sendJson(res, 404, { error: 'Protected project config not found.' });
    return;
  }

  sendJson(res, 200, { unlocked: hasProjectAccess(req, pathname) });
}
