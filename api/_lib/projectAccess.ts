import { createHmac, timingSafeEqual } from 'node:crypto';
import { config, type ProjectAccessLevel } from './config.js';

const COOKIE_PREFIX = 'b2w_project_access_';
const SESSION_VERSION = 1;

type ProjectAccessSessionPayload = {
  v: number;
  scopeId: string;
  grants: ProjectAccessLevel[];
  activeView: ProjectAccessLevel | null;
  email: string | null;
  issuedAt: number;
};

export type ProjectAccessStatus = {
  scopeId: string | null;
  accessLevel: ProjectAccessLevel | 'locked';
  grantedLevels: ProjectAccessLevel[];
  currentView: ProjectAccessLevel | null;
  availableViews: Partial<Record<ProjectAccessLevel, string>>;
  title: string;
};

function toCookieSuffix(scopeId: string): string {
  return scopeId.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

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
  return createHmac('sha256', config.projectAccess.secret)
    .update(value)
    .digest('base64url');
}

function getProjectConfig(pathname: string) {
  return config.projectAccess.paths[pathname] ?? null;
}

function getScopeConfig(scopeId: string | null) {
  if (!scopeId) {
    return null;
  }

  return config.projectAccess.scopes.find((scope) => scope.scopeId === scopeId) ?? null;
}

function buildProjectAccessStatus(
  pathname: string,
  session: ProjectAccessSessionPayload | null,
): ProjectAccessStatus {
  const projectConfig = getProjectConfig(pathname);
  if (!projectConfig) {
    return {
      scopeId: null,
      accessLevel: 'locked',
      grantedLevels: [],
      currentView: null,
      availableViews: {},
      title: '',
    };
  }

  const grantedLevels = session?.grants ?? [];
  const currentView = projectConfig.view;

  return {
    scopeId: projectConfig.scopeId,
    accessLevel: grantedLevels.includes(currentView) ? currentView : 'locked',
    grantedLevels,
    currentView,
    availableViews: projectConfig.availableViews,
    title: projectConfig.title,
  };
}

function serializeSession(payload: ProjectAccessSessionPayload): string {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signValue(encodedPayload)}`;
}

function parseSession(token: string): ProjectAccessSessionPayload | null {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature || !config.projectAccess.secret) {
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
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as ProjectAccessSessionPayload;
    if (parsed.v !== SESSION_VERSION || !parsed.scopeId) {
      return null;
    }

    const grants = Array.isArray(parsed.grants)
      ? parsed.grants.filter((grant): grant is ProjectAccessLevel => grant === 'proposal' || grant === 'profile')
      : [];
    const activeView = parsed.activeView === 'proposal' || parsed.activeView === 'profile' ? parsed.activeView : null;

    return {
      v: SESSION_VERSION,
      scopeId: parsed.scopeId,
      grants: Array.from(new Set(grants)),
      activeView,
      email: parsed.email ? normalizeEmail(parsed.email) : null,
      issuedAt: Number(parsed.issuedAt ?? Date.now()),
    };
  } catch {
    return null;
  }
}

export function getProjectAccessCookieName(scopeId: string): string {
  return `${COOKIE_PREFIX}${toCookieSuffix(scopeId)}`;
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

export function getProjectPassword(pathname: string): string {
  return getProjectConfig(pathname)?.password ?? '';
}

export function getProjectProposalEmails(pathname: string): string[] {
  return getProjectConfig(pathname)?.proposalEmails ?? [];
}

export function getProjectAvailableViews(pathname: string): Partial<Record<ProjectAccessLevel, string>> {
  return getProjectConfig(pathname)?.availableViews ?? {};
}

export function getProjectView(pathname: string): ProjectAccessLevel | null {
  return getProjectConfig(pathname)?.view ?? null;
}

export function getProjectScopeId(pathname: string): string | null {
  return getProjectConfig(pathname)?.scopeId ?? null;
}

export function getProjectScopeTitle(pathname: string): string {
  return getProjectConfig(pathname)?.title ?? '';
}

export function isAllowedProposalEmail(pathname: string, email: string): boolean {
  const normalizedEmail = normalizeEmail(email);
  return getProjectProposalEmails(pathname).some((allowedEmail) => allowedEmail === normalizedEmail);
}

export function getProjectAccessSession(req: any, pathname: string): ProjectAccessSessionPayload | null {
  const scopeId = getProjectScopeId(pathname);
  if (!scopeId || !config.projectAccess.secret) {
    return null;
  }

  const cookies = parseCookies(req);
  const token = cookies[getProjectAccessCookieName(scopeId)];
  if (!token) {
    return null;
  }

  const session = parseSession(token);
  if (!session || session.scopeId !== scopeId) {
    return null;
  }

  return session;
}

export function getProjectAccessStatus(req: any, pathname: string): ProjectAccessStatus {
  return buildProjectAccessStatus(pathname, getProjectAccessSession(req, pathname));
}

export function getProjectAccessStatusForSession(
  pathname: string,
  session: ProjectAccessSessionPayload | null,
): ProjectAccessStatus {
  return buildProjectAccessStatus(pathname, session);
}

export function hasProjectAccess(req: any, pathname: string): boolean {
  return getProjectAccessStatus(req, pathname).accessLevel !== 'locked';
}

export function setProjectAccessCookie(
  res: any,
  pathname: string,
  accessLevel: ProjectAccessLevel,
  credential: string,
  existingSession?: ProjectAccessSessionPayload | null,
): ProjectAccessSessionPayload | null {
  const scopeId = getProjectScopeId(pathname);
  const scope = getScopeConfig(scopeId);
  if (!scopeId || !scope || !config.projectAccess.secret) {
    return null;
  }

  const grants = Array.from(new Set([...(existingSession?.grants ?? []), accessLevel]));
  const nextSession: ProjectAccessSessionPayload = {
    v: SESSION_VERSION,
    scopeId,
    grants,
    activeView: accessLevel,
    email: accessLevel === 'proposal' ? normalizeEmail(credential) : existingSession?.email ?? null,
    issuedAt: Date.now(),
  };
  const token = serializeSession(nextSession);
  const cookieName = getProjectAccessCookieName(scopeId);
  const isSecure = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    `${cookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure ? '; Secure' : ''}`,
  );

  return nextSession;
}

export function clearProjectAccessCookie(res: any, pathname: string): void {
  const scopeId = getProjectScopeId(pathname);
  if (!scopeId) {
    return;
  }

  const cookieName = getProjectAccessCookieName(scopeId);
  const isSecure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isSecure ? '; Secure' : ''}`,
  );
}
