import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import './_common/env.js';
import { getClientIp } from './_common/rateLimit.js';
import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import {
  analyzeJasonAIProgress,
  getJasonAIModelConfig,
  isJasonAIModelConfigured,
} from './_lib/jasonaiModel.js';
import {
  applyChange,
  buildDeterministicAnalysis,
  buildSessionComparison,
  buildTimelineAssessment,
  normalizeChange,
  normalizeSnapshot,
  snapshotHash,
  summarizeChange,
  type ExecutiveAnalysis,
  type JasonAIProgressSnapshot,
} from './_lib/jasonaiProgress.js';

const PROJECT_ID = String(process.env.JASONAI_PROGRESS_PROJECT_ID ?? 'jason-ai').trim();
const writeBuckets = new Map<string, { count: number; resetAt: number }>();

export const maxDuration = 30;

type VersionRow = {
  id: number;
  created_at: string;
  actor_role: 'CEO' | 'COO' | 'CTO';
  change_type: string;
  entity_id: string;
  change_summary: string;
  changed_fields: Record<string, unknown>;
  snapshot: JasonAIProgressSnapshot;
  timeline: ReturnType<typeof buildTimelineAssessment>;
  analysis: ExecutiveAnalysis;
  model_name: string | null;
};

function getDatabaseConfig() {
  return {
    url: String(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '').trim(),
    key: String(process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim(),
  };
}

function getDatabaseClient(): SupabaseClient | null {
  const { url, key } = getDatabaseConfig();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function isTrustedOrigin(req: any) {
  const origin = String(req.headers?.origin ?? '').trim();
  if (!origin) return true;
  const forwardedHost = String(req.headers?.['x-forwarded-host'] ?? req.headers?.host ?? '').split(',')[0].trim();
  try {
    return new URL(origin).host === forwardedHost;
  } catch {
    return false;
  }
}

function allowProgressWrite(req: any) {
  const key = `${getClientIp(req)}:${PROJECT_ID}`;
  const now = Date.now();
  const existing = writeBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    writeBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (existing.count >= 45) return false;
  existing.count += 1;
  return true;
}

function hashUserAgent(req: any) {
  return createHash('sha256')
    .update(String(req.headers?.['user-agent'] ?? 'unknown'))
    .digest('hex')
    .slice(0, 16);
}

function normalizeActorRole(value: unknown): 'CEO' | 'COO' | 'CTO' {
  const role = String(value ?? '').toUpperCase();
  if (role === 'CEO' || role === 'COO' || role === 'CTO') return role;
  throw new Error('An executive actor role is required.');
}

async function getLatestVersion(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('jasonai_progress_versions')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as VersionRow | null;
}

async function getVersionHistory(supabase: SupabaseClient, limit = 30) {
  const { data, error } = await supabase
    .from('jasonai_progress_versions')
    .select('id,created_at,actor_role,change_type,entity_id,change_summary,timeline,analysis')
    .eq('project_id', PROJECT_ID)
    .order('id', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  const requestUrl = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const action = String(requestUrl.searchParams.get('action') ?? 'state').toLowerCase();
  const supabase = getDatabaseClient();

  if (req.method === 'GET') {
    if (action === 'status') {
      sendJson(res, 200, {
        ok: true,
        databaseConfigured: Boolean(supabase),
        modelConfigured: isJasonAIModelConfigured(),
        model: isJasonAIModelConfigured() ? getJasonAIModelConfig().model : null,
      });
      return;
    }

    if (!supabase) {
      sendJson(res, 200, {
        ok: true,
        configured: false,
        latest: null,
        history: [],
        message: 'Progress persistence is not configured.',
      });
      return;
    }

    try {
      const [latest, history] = await Promise.all([
        getLatestVersion(supabase),
        getVersionHistory(supabase),
      ]);
      sendJson(res, 200, {
        ok: true,
        configured: true,
        modelConfigured: isJasonAIModelConfigured(),
        latest,
        history,
      });
    } catch (error) {
      sendJson(res, 503, {
        ok: false,
        configured: true,
        error: error instanceof Error ? error.message : 'Unable to load progress history.',
      });
    }
    return;
  }

  if (action !== 'sync') {
    sendJson(res, 400, { ok: false, error: 'Unsupported progress action.' });
    return;
  }
  if (!isTrustedOrigin(req)) {
    sendJson(res, 403, { ok: false, error: 'Untrusted request origin.' });
    return;
  }
  if (!allowProgressWrite(req)) {
    sendJson(res, 429, { ok: false, error: 'Too many progress updates. Wait a minute and try again.' });
    return;
  }
  if (!supabase) {
    sendJson(res, 503, { ok: false, error: 'Progress persistence is not configured.' });
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req, 900_000);
    const actorRole = normalizeActorRole(body.actorRole);
    const change = normalizeChange(body.change);
    const latest = await getLatestVersion(supabase);
    const baseSnapshot = latest?.snapshot
      ? normalizeSnapshot(latest.snapshot)
      : normalizeSnapshot(body.snapshot);
    const snapshot = applyChange(baseSnapshot, change);
    const timeline = buildTimelineAssessment(snapshot);
    const changeSummary = summarizeChange(change);
    const sessionComparison = buildSessionComparison(
      snapshot,
      timeline,
      latest
        ? {
            id: latest.id,
            createdAt: latest.created_at,
            snapshot: normalizeSnapshot(latest.snapshot),
            timeline: latest.timeline,
          }
        : null,
      changeSummary,
    );
    const deterministicAnalysis = buildDeterministicAnalysis(
      snapshot,
      timeline,
      sessionComparison,
    );
    let analysis = deterministicAnalysis;
    let modelError: string | null = null;

    if (isJasonAIModelConfigured()) {
      try {
        analysis =
          (await analyzeJasonAIProgress({
            snapshot,
            timeline,
            change,
            actorRole,
            sessionComparison,
            previousAnalysis: latest?.analysis ?? null,
          })) ?? deterministicAnalysis;
      } catch (error) {
        modelError = error instanceof Error ? error.message : 'Model analysis failed.';
      }
    }

    const row = {
      project_id: PROJECT_ID,
      actor_role: actorRole,
      change_type: `${change.scope}.updated`,
      entity_id: change.entityId,
      change_summary: changeSummary,
      changed_fields: {
        before: change.before ?? {},
        after: change.patch,
        interaction: change.interaction ?? 'direct edit',
        sessionComparison,
      },
      snapshot,
      snapshot_hash: snapshotHash(snapshot),
      timeline,
      analysis,
      model_name: analysis.source === 'model' ? analysis.model ?? getJasonAIModelConfig().model : null,
      source: 'internal-portal',
      user_agent_hash: hashUserAgent(req),
    };
    const { data, error } = await supabase
      .from('jasonai_progress_versions')
      .insert(row)
      .select('*')
      .single();
    if (error) throw error;
    const history = await getVersionHistory(supabase);

    sendJson(res, 200, {
      ok: true,
      configured: true,
      modelConfigured: isJasonAIModelConfigured(),
      latest: data,
      history,
      modelError,
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to record the progress update.',
    });
  }
}
