import { createHmac, timingSafeEqual } from 'node:crypto';

export const DEFAULT_EXECUTIVE_STRATEGY_PASSWORD = 'B2W-AI-2026';
export const B2W_EXECUTIVE_STRATEGY_COOKIE = 'b2w_executive_strategy';
export const B2W_EXECUTIVE_STRATEGY_SESSION_TTL_SECONDS = 60 * 60 * 8;

type ExecutiveStrategySession = {
  v: 1;
  exp: number;
};

export function getB2WExecutiveStrategyPassword() {
  return String(
    process.env.B2W_EXECUTIVE_STRATEGY_PASSWORD ?? DEFAULT_EXECUTIVE_STRATEGY_PASSWORD,
  ).trim();
}

export function isB2WExecutiveStrategyPasswordValid(candidate: string) {
  const expected = getB2WExecutiveStrategyPassword();
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return (
    candidateBuffer.length === expectedBuffer.length
    && timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

function getB2WExecutiveStrategySessionSecret() {
  return String(
    process.env.B2W_EXECUTIVE_STRATEGY_SESSION_SECRET
      ?? process.env.PROJECT_ACCESS_SECRET
      ?? (process.env.NODE_ENV === 'production' ? '' : 'b2w-executive-strategy-development-session'),
  ).trim();
}

function signSessionPayload(encoded: string) {
  const secret = getB2WExecutiveStrategySessionSecret();
  if (!secret) return '';
  return createHmac('sha256', secret).update(encoded).digest('base64url');
}

export function isB2WExecutiveStrategySessionConfigured() {
  return Boolean(getB2WExecutiveStrategySessionSecret());
}

export function createB2WExecutiveStrategySessionToken() {
  if (!isB2WExecutiveStrategySessionConfigured()) return '';

  const payload: ExecutiveStrategySession = {
    v: 1,
    exp: Math.floor(Date.now() / 1000) + B2W_EXECUTIVE_STRATEGY_SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${signSessionPayload(encoded)}`;
}

export function isB2WExecutiveStrategySessionValid(token: string) {
  if (!token || !isB2WExecutiveStrategySessionConfigured()) return false;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;

  const expected = signSessionPayload(encoded);
  if (!expected || signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as ExecutiveStrategySession;
    return payload.v === 1 && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function readB2WExecutiveStrategySessionCookie(cookieHeader: string) {
  const prefix = `${B2W_EXECUTIVE_STRATEGY_COOKIE}=`;
  const entry = cookieHeader
    .split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith(prefix));

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : '';
}
