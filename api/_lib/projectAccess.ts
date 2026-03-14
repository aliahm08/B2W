import { createHash } from 'node:crypto';
import { config } from './config';

const COOKIE_PREFIX = 'b2w_project_access_';

function toCookieSuffix(pathname: string): string {
  return pathname.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

export function getProjectAccessCookieName(pathname: string): string {
  return `${COOKIE_PREFIX}${toCookieSuffix(pathname)}`;
}

export function getProjectPassword(pathname: string): string {
  return config.projectAccess.passwords[pathname] ?? '';
}

export function createProjectAccessToken(pathname: string, password: string): string {
  return createHash('sha256')
    .update(config.projectAccess.secret)
    .update('::')
    .update(pathname)
    .update('::')
    .update(password)
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

export function hasProjectAccess(req: any, pathname: string): boolean {
  const password = getProjectPassword(pathname);

  if (!password || !config.projectAccess.secret) {
    return false;
  }

  const cookies = parseCookies(req);
  const cookieName = getProjectAccessCookieName(pathname);
  const expectedToken = createProjectAccessToken(pathname, password);

  return cookies[cookieName] === expectedToken;
}

export function setProjectAccessCookie(res: any, pathname: string, password: string): void {
  const token = createProjectAccessToken(pathname, password);
  const cookieName = getProjectAccessCookieName(pathname);
  const isSecure = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure ? '; Secure' : ''}`,
  );
}
