import { createHash } from 'node:crypto';
import { config } from './config.js';

const COOKIE_PREFIX = 'b2w_project_access_';
const PROPOSAL_EMAIL_OVERRIDE = 'info@b2w-ai.com';
export type ProjectAccessLevel = 'proposal' | 'profile';

function toCookieSuffix(pathname: string): string {
  return pathname.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

export function getProjectAccessCookieName(pathname: string): string {
  return `${COOKIE_PREFIX}${toCookieSuffix(pathname)}`;
}

export function getProjectPassword(pathname: string): string {
  return config.projectAccess.passwords[pathname] ?? '';
}

export function getProjectProposalEmails(pathname: string): string[] {
  const configuredEmails = config.projectAccess.proposalEmails[pathname] ?? [];
  if (configuredEmails.length === 0) {
    return [];
  }

  return [PROPOSAL_EMAIL_OVERRIDE];
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createProjectAccessToken(pathname: string, accessLevel: ProjectAccessLevel, credential: string): string {
  return createHash('sha256')
    .update(config.projectAccess.secret)
    .update('::')
    .update(pathname)
    .update('::')
    .update(accessLevel)
    .update('::')
    .update(credential)
    .digest('hex');
}

export function parseCookies(req: any): Record<string, string> {
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

export function getProjectAccessLevel(req: any, pathname: string): ProjectAccessLevel | null {
  const cookies = parseCookies(req);
  const cookieName = getProjectAccessCookieName(pathname);
  const cookieValue = cookies[cookieName];
  const password = getProjectPassword(pathname);
  const proposalEmails = getProjectProposalEmails(pathname);

  if (!cookieValue || !config.projectAccess.secret) {
    return null;
  }

  if (password) {
    const expectedProfileToken = createProjectAccessToken(pathname, 'profile', password);
    if (cookieValue === expectedProfileToken) {
      return 'profile';
    }
  }

  if (proposalEmails.length > 0) {
    for (const email of proposalEmails) {
      const expectedProposalToken = createProjectAccessToken(pathname, 'proposal', normalizeEmail(email));
      if (cookieValue === expectedProposalToken) {
        return 'proposal';
      }
    }
  }

  return null;
}

export function hasProjectAccess(req: any, pathname: string): boolean {
  return getProjectAccessLevel(req, pathname) !== null;
}

export function isAllowedProposalEmail(pathname: string, email: string): boolean {
  const normalizedEmail = normalizeEmail(email);

  return getProjectProposalEmails(pathname).some((allowedEmail) => normalizeEmail(allowedEmail) === normalizedEmail);
}

export function setProjectAccessCookie(res: any, pathname: string, accessLevel: ProjectAccessLevel, credential: string): void {
  const normalizedCredential = accessLevel === 'proposal' ? normalizeEmail(credential) : credential;
  const token = createProjectAccessToken(pathname, accessLevel, normalizedCredential);
  const cookieName = getProjectAccessCookieName(pathname);
  const isSecure = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure ? '; Secure' : ''}`,
  );
}
