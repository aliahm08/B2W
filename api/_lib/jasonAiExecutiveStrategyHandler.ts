import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import '../_common/env.js';
import { checkRateLimit, getClientIp } from '../_common/rateLimit.js';
import { allowMethods, readJsonBody, sendJson } from './http.js';

const COOKIE_NAME = 'b2w_jasonai_executive';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type StrategySession = {
  v: 1;
  exp: number;
};

type LeadRow = {
  submitted_at: string;
  source_path: string | null;
  subject: string | null;
  metadata: Record<string, unknown> | null;
};

type GitHubCommit = {
  sha: string;
  commit?: {
    message?: string;
    author?: {
      name?: string;
      date?: string;
    };
  };
};

function getEnv(name: string, fallback = '') {
  return String(process.env[name] ?? fallback).trim();
}

function getSecret() {
  return getEnv('JASONAI_EXECUTIVE_PORTAL_SECRET', getEnv('PROJECT_ACCESS_SECRET'));
}

function getPassword() {
  return getEnv('JASONAI_EXECUTIVE_PORTAL_PASSWORD');
}

function parseCookies(req: any): Record<string, string> {
  return String(req.headers?.cookie ?? '')
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((cookies, entry) => {
      const separator = entry.indexOf('=');
      if (separator === -1) return cookies;
      cookies[entry.slice(0, separator)] = decodeURIComponent(entry.slice(separator + 1));
      return cookies;
    }, {});
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function createSessionToken() {
  const payload: StrategySession = {
    v: 1,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

function hasValidSession(req: any) {
  const secret = getSecret();
  const token = parseCookies(req)[COOKIE_NAME];
  if (!secret || !token) return false;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as StrategySession;
    return parsed.v === 1 && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function setSessionCookie(req: any, res: any) {
  const isSecure = process.env.NODE_ENV === 'production' || String(req.headers?.['x-forwarded-proto'] ?? '') === 'https';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(createSessionToken())}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${isSecure ? '; Secure' : ''}`,
  );
}

function clearSessionCookie(req: any, res: any) {
  const isSecure = process.env.NODE_ENV === 'production' || String(req.headers?.['x-forwarded-proto'] ?? '') === 'https';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isSecure ? '; Secure' : ''}`,
  );
}

async function fetchLeadSignals(): Promise<{
  connected: boolean;
  rows: LeadRow[];
  message: string;
}> {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL', getEnv('SUPABASE_URL'));
  const key = getEnv('SUPABASE_SECRET_KEY', getEnv('SUPABASE_SERVICE_ROLE_KEY'));
  if (!url || !key) {
    return { connected: false, rows: [], message: 'Supabase credentials are not configured.' };
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('form_submissions')
      .select('submitted_at,source_path,subject,metadata')
      .eq('submission_type', 'lead_inquiry')
      .gte('submitted_at', cutoff)
      .order('submitted_at', { ascending: false })
      .limit(250);

    if (error) throw error;
    return { connected: true, rows: (data ?? []) as LeadRow[], message: 'Live inquiry pipeline connected.' };
  } catch (error) {
    return {
      connected: false,
      rows: [],
      message: error instanceof Error ? error.message : 'Unable to read inquiry signals.',
    };
  }
}

async function fetchBuildSignals(): Promise<{
  connected: boolean;
  commits: GitHubCommit[];
  message: string;
}> {
  const repo = getEnv('JASONAI_EXECUTIVE_GITHUB_REPO', 'aliahm08/b2w');
  const token = getEnv('GITHUB_TOKEN');

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=60`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'b2w-executive-strategy-dashboard',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) throw new Error(`GitHub returned ${response.status}.`);
    const commits = (await response.json()) as GitHubCommit[];
    return { connected: true, commits, message: 'GitHub delivery activity connected.' };
  } catch (error) {
    return {
      connected: false,
      commits: [],
      message: error instanceof Error ? error.message : 'Unable to read delivery activity.',
    };
  }
}

function startOfDayOffset(daysAgo: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.getTime();
}

function countSince(items: Array<{ date: string }>, days: number) {
  const cutoff = startOfDayOffset(days);
  return items.filter((item) => new Date(item.date).getTime() >= cutoff).length;
}

function buildDailySeries(items: Array<{ date: string }>, days = 30) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (days - index - 1));
    const key = date.toISOString().slice(0, 10);
    return { date: key, value: counts.get(key) ?? 0 };
  });
}

function bucketLeadSource(pathname: string | null) {
  const path = String(pathname ?? '').toLowerCase();
  if (path.includes('jasonai')) return 'JasonAI';
  if (path.includes('clara') || path.includes('solutions')) return 'Clara';
  if (path.includes('expertise') || path.includes('growth')) return 'Consulting';
  return 'B2W website';
}

async function buildDashboardData() {
  const [leadSignals, buildSignals] = await Promise.all([fetchLeadSignals(), fetchBuildSignals()]);
  const leadItems = leadSignals.rows.map((row) => ({ date: row.submitted_at }));
  const commitItems = buildSignals.commits
    .map((commit) => ({ date: String(commit.commit?.author?.date ?? '') }))
    .filter((item) => item.date);

  const leadSources = leadSignals.rows.reduce<Record<string, number>>((result, row) => {
    const source = bucketLeadSource(row.source_path);
    result[source] = (result[source] ?? 0) + 1;
    return result;
  }, {});

  const activity = [
    ...leadSignals.rows.slice(0, 6).map((row) => ({
      id: `lead-${row.submitted_at}`,
      type: 'demand',
      title: `New ${bucketLeadSource(row.source_path)} inquiry`,
      detail: String(row.subject || 'Inbound project signal'),
      timestamp: row.submitted_at,
    })),
    ...buildSignals.commits.slice(0, 8).map((commit) => ({
      id: commit.sha,
      type: 'delivery',
      title: String(commit.commit?.message ?? 'Product update').split('\n')[0].slice(0, 110),
      detail: `Delivery activity · ${String(commit.commit?.author?.name ?? 'B2W team')}`,
      timestamp: String(commit.commit?.author?.date ?? new Date().toISOString()),
    })),
  ]
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, 10);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      leads7d: countSince(leadItems, 7),
      leads30d: countSince(leadItems, 30),
      leads90d: leadSignals.rows.length,
      commits7d: countSince(commitItems, 7),
      commits30d: countSince(commitItems, 30),
      commits90d: countSince(commitItems, 90),
    },
    series: {
      leads30d: buildDailySeries(leadItems, 30),
      commits30d: buildDailySeries(commitItems, 30),
    },
    leadSources: Object.entries(leadSources)
      .map(([label, value]) => ({ label, value }))
      .sort((left, right) => right.value - left.value),
    activity,
    connections: [
      { id: 'pipeline', label: 'Inquiry pipeline', connected: leadSignals.connected, detail: leadSignals.message },
      { id: 'delivery', label: 'Delivery activity', connected: buildSignals.connected, detail: buildSignals.message },
      { id: 'dashboard', label: 'Strategy service', connected: true, detail: 'Secure executive API responding normally.' },
    ],
  };
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;

  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const action = String(url.searchParams.get('action') ?? 'status').trim().toLowerCase();

  if (action === 'login') {
    const rateLimit = await checkRateLimit(`jasonai-executive-login:${getClientIp(req)}`);
    if (rateLimit.ok === false) {
      res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
      sendJson(res, 429, { ok: false, error: 'Too many attempts. Try again later.' });
      return;
    }

    const configuredPassword = getPassword();
    const secret = getSecret();
    if (!configuredPassword || !secret) {
      sendJson(res, 503, { ok: false, error: 'Internal portal access is not configured.' });
      return;
    }

    const body: { password?: string } = await readJsonBody<{ password?: string }>(req).catch(() => ({}));
    if (!safeEqual(String(body.password ?? ''), configuredPassword)) {
      sendJson(res, 401, { ok: false, error: 'Incorrect access key.' });
      return;
    }

    setSessionCookie(req, res);
    sendJson(res, 200, { ok: true, authenticated: true });
    return;
  }

  if (action === 'logout') {
    clearSessionCookie(req, res);
    sendJson(res, 200, { ok: true, authenticated: false });
    return;
  }

  const authenticated = hasValidSession(req);
  if (action === 'status') {
    sendJson(res, 200, { ok: true, authenticated, configured: Boolean(getPassword() && getSecret()) });
    return;
  }

  if (action === 'data') {
    if (!authenticated) {
      sendJson(res, 401, { ok: false, error: 'Authentication required.' });
      return;
    }

    const data = await buildDashboardData();
    sendJson(res, 200, { ok: true, ...data });
    return;
  }

  sendJson(res, 400, { ok: false, error: 'Unsupported action.' });
}
