import '../_common/env.js';
import { checkRateLimit, getClientIp } from '../_common/rateLimit.js';
import { allowMethods, readJsonBody, sendJson } from './http.js';
import {
  B2W_EXECUTIVE_STRATEGY_COOKIE,
  createB2WExecutiveStrategySessionToken,
  isB2WExecutiveStrategyPasswordValid,
  isB2WExecutiveStrategySessionConfigured,
  isB2WExecutiveStrategySessionValid,
  readB2WExecutiveStrategySessionCookie,
} from '../../server/b2wExecutiveStrategyAccess.js';

function isSecureRequest(req: any) {
  return process.env.NODE_ENV === 'production'
    || String(req.headers?.['x-forwarded-proto'] ?? '') === 'https';
}

function setSessionCookie(req: any, res: any) {
  const token = createB2WExecutiveStrategySessionToken();
  res.setHeader(
    'Set-Cookie',
    `${B2W_EXECUTIVE_STRATEGY_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict${isSecureRequest(req) ? '; Secure' : ''}`,
  );
}

function clearSessionCookie(req: any, res: any) {
  res.setHeader(
    'Set-Cookie',
    `${B2W_EXECUTIVE_STRATEGY_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isSecureRequest(req) ? '; Secure' : ''}`,
  );
}

function hasValidSession(req: any) {
  const token = readB2WExecutiveStrategySessionCookie(String(req.headers?.cookie ?? ''));
  return isB2WExecutiveStrategySessionValid(token);
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;

  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const action = String(url.searchParams.get('action') ?? (req.method === 'GET' ? 'status' : 'login'))
    .trim()
    .toLowerCase();

  if (action === 'status') {
    sendJson(res, 200, {
      ok: true,
      authenticated: hasValidSession(req),
      configured: isB2WExecutiveStrategySessionConfigured(),
    });
    return;
  }

  if (action === 'logout') {
    clearSessionCookie(req, res);
    sendJson(res, 200, { ok: true, authenticated: false });
    return;
  }

  if (action !== 'login') {
    sendJson(res, 400, { ok: false, authenticated: false, error: 'Unsupported action.' });
    return;
  }

  if (!isB2WExecutiveStrategySessionConfigured()) {
    sendJson(res, 503, {
      ok: false,
      authenticated: false,
      error: 'Secure session access is not configured.',
    });
    return;
  }

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

  setSessionCookie(req, res);
  sendJson(res, 200, { ok: true, authenticated: true });
}
