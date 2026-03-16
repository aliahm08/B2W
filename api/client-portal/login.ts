import { findClientPortalAccountByEmail, setClientPortalCookie, verifyGooglePortalCredential } from '../_lib/clientPortal.js';
import { config } from '../_lib/config.js';
import { allowMethods, readJsonBody, sendJson } from '../_lib/http.js';

type LoginRequestBody = {
  credential?: string;
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  if (!config.clientPortal.secret) {
    sendJson(res, 503, { error: 'Client portal secret is not configured.' });
    return;
  }

  if (!config.google.clientId) {
    sendJson(res, 503, { error: 'Google sign-in is not configured.' });
    return;
  }

  const body = await readJsonBody<LoginRequestBody>(req);
  const credential = String(body.credential ?? '').trim();

  if (!credential) {
    sendJson(res, 400, { error: 'Google credential is required.' });
    return;
  }

  try {
    const profile = await verifyGooglePortalCredential(credential);
    if (!profile) {
      sendJson(res, 401, { error: 'Unable to verify the Google account.' });
      return;
    }

    const account = findClientPortalAccountByEmail(profile.email);
    if (!account) {
      sendJson(res, 403, { error: 'This Google account is not approved for the client portal.' });
      return;
    }

    const status = setClientPortalCookie(res, account, profile);
    if (!status) {
      sendJson(res, 500, { error: 'Unable to create the client portal session.' });
      return;
    }

    sendJson(res, 200, status);
  } catch {
    sendJson(res, 401, { error: 'Google token verification failed.' });
  }
}
