import { createHmac, timingSafeEqual } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { config, type ClientPortalAccount } from './config.js';

const COOKIE_NAME = 'b2w_client_portal_session';
const SESSION_VERSION = 1;

type ClientPortalSessionPayload = {
  v: number;
  accountId: string;
  email: string;
  name: string;
  picture: string | null;
  issuedAt: number;
};

export type ClientPortalProfile = {
  email: string;
  name: string;
  picture: string | null;
};

export type ClientPortalStatus = {
  authenticated: boolean;
  account: {
    accountId: string;
    companyName: string;
    workspaceTitle: string;
    supportEmail: string;
    contacts: ClientPortalAccount['contacts'];
    projects: ClientPortalAccount['projects'];
  } | null;
  profile: ClientPortalProfile | null;
  loginEnabled: boolean;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signValue(value: string): string {
  return createHmac('sha256', config.clientPortal.secret)
    .update(value)
    .digest('base64url');
}

function parseCookies(req: any): Record<string, string> {
  const raw = String(req.headers?.cookie ?? '');

  return raw
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((cookies, entry) => {
      const separatorIndex = entry.indexOf('=');
      if (separatorIndex === -1) {
        return cookies;
      }

      const name = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      cookies[name] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function serializeSession(payload: ClientPortalSessionPayload): string {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signValue(encodedPayload)}`;
}

function parseSession(token: string): ClientPortalSessionPayload | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature || !config.clientPortal.secret) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);
  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as ClientPortalSessionPayload;
    if (parsed.v !== SESSION_VERSION || !parsed.accountId || !parsed.email || !parsed.name) {
      return null;
    }

    return {
      v: SESSION_VERSION,
      accountId: parsed.accountId,
      email: normalizeEmail(parsed.email),
      name: String(parsed.name),
      picture: parsed.picture ? String(parsed.picture) : null,
      issuedAt: Number(parsed.issuedAt ?? Date.now()),
    };
  } catch {
    return null;
  }
}

function sanitizeAccount(account: ClientPortalAccount) {
  return {
    accountId: account.accountId,
    companyName: account.companyName,
    workspaceTitle: account.workspaceTitle,
    supportEmail: account.supportEmail,
    contacts: account.contacts,
    projects: account.projects,
  };
}

function buildStatus(session: ClientPortalSessionPayload | null): ClientPortalStatus {
  if (!session) {
    return {
      authenticated: false,
      account: null,
      profile: null,
      loginEnabled: Boolean(config.google.clientId && config.clientPortal.secret),
    };
  }

  const account = getClientPortalAccountById(session.accountId);
  if (!account || !isAllowedPortalEmail(account, session.email)) {
    return {
      authenticated: false,
      account: null,
      profile: null,
      loginEnabled: Boolean(config.google.clientId && config.clientPortal.secret),
    };
  }

  return {
    authenticated: true,
    account: sanitizeAccount(account),
    profile: {
      email: session.email,
      name: session.name,
      picture: session.picture,
    },
    loginEnabled: Boolean(config.google.clientId && config.clientPortal.secret),
  };
}

export function getClientPortalAccountById(accountId: string): ClientPortalAccount | null {
  return config.clientPortal.accounts.find((account) => account.accountId === accountId) ?? null;
}

export function findClientPortalAccountByEmail(email: string): ClientPortalAccount | null {
  const normalizedEmail = normalizeEmail(email);
  return config.clientPortal.accounts.find((account) => account.allowedEmails.includes(normalizedEmail)) ?? null;
}

export function isAllowedPortalEmail(account: ClientPortalAccount, email: string): boolean {
  return account.allowedEmails.includes(normalizeEmail(email));
}

export function getClientPortalSession(req: any): ClientPortalSessionPayload | null {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    return null;
  }

  return parseSession(token);
}

export function getClientPortalStatus(req: any): ClientPortalStatus {
  return buildStatus(getClientPortalSession(req));
}

export function setClientPortalCookie(
  res: any,
  account: ClientPortalAccount,
  profile: ClientPortalProfile,
): ClientPortalStatus | null {
  if (!config.clientPortal.secret) {
    return null;
  }

  const payload: ClientPortalSessionPayload = {
    v: SESSION_VERSION,
    accountId: account.accountId,
    email: normalizeEmail(profile.email),
    name: profile.name.trim(),
    picture: profile.picture,
    issuedAt: Date.now(),
  };

  const token = serializeSession(payload);
  const isSecure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure ? '; Secure' : ''}`,
  );

  return buildStatus(payload);
}

export function clearClientPortalCookie(res: any): void {
  const isSecure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isSecure ? '; Secure' : ''}`,
  );
}

export async function verifyGooglePortalCredential(credential: string): Promise<ClientPortalProfile | null> {
  if (!credential || !config.google.clientId) {
    return null;
  }

  const client = new OAuth2Client(config.google.clientId);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: config.google.clientId,
  });
  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    return null;
  }

  return {
    email: normalizeEmail(payload.email),
    name: String(payload.name ?? payload.email),
    picture: payload.picture ? String(payload.picture) : null,
  };
}
