import { allowMethods, readJsonBody, sendJson } from '../_lib/http';
import { config } from '../_lib/config';
import { getProjectPassword, setProjectAccessCookie } from '../_lib/projectAccess';

type LoginRequestBody = {
  path?: string;
  password?: string;
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  const body = await readJsonBody<LoginRequestBody>(req);
  const pathname = String(body.path ?? '').trim();
  const password = String(body.password ?? '');

  if (!pathname || !password) {
    sendJson(res, 400, { error: 'Project path and password are required.' });
    return;
  }

  if (!config.projectAccess.secret) {
    sendJson(res, 503, { error: 'Project access secret is not configured.' });
    return;
  }

  const expectedPassword = getProjectPassword(pathname);

  if (!expectedPassword) {
    sendJson(res, 404, { error: 'Protected project config not found.' });
    return;
  }

  if (password !== expectedPassword) {
    sendJson(res, 401, { error: 'Incorrect password.' });
    return;
  }

  setProjectAccessCookie(res, pathname, expectedPassword);
  sendJson(res, 200, { unlocked: true });
}
