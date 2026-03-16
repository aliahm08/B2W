import { allowMethods, sendJson } from '../_lib/http.js';
import { getClientPortalStatus } from '../_lib/clientPortal.js';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET'])) {
    return;
  }

  sendJson(res, 200, getClientPortalStatus(req));
}
