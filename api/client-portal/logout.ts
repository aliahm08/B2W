import { clearClientPortalCookie } from '../_lib/clientPortal.js';
import { allowMethods, sendJson } from '../_lib/http.js';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  clearClientPortalCookie(res);
  sendJson(res, 200, {
    authenticated: false,
    account: null,
    profile: null,
    loginEnabled: true,
  });
}
