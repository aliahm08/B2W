import './_common/env.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import { isB2WExecutiveStrategyPasswordValid } from '../server/b2wExecutiveStrategyAccess.js';

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) return;

  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  const rateLimit = await checkRateLimit(`b2w-executive-strategy:${getClientIp(req)}`);
  if (rateLimit.ok === false) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, {
      ok: false,
      authenticated: false,
      error: 'Too many attempts. Wait a moment and try again.',
    });
    return;
  }

  const body: { password?: string } = await readJsonBody<{ password?: string }>(req).catch(() => ({}));
  if (!isB2WExecutiveStrategyPasswordValid(String(body.password ?? ''))) {
    sendJson(res, 401, {
      ok: false,
      authenticated: false,
      error: 'That password is not correct.',
    });
    return;
  }

  sendJson(res, 200, { ok: true, authenticated: true });
}
