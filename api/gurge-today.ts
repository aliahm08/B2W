import './_common/env.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import {
  getJasonAIModelConfig,
  isJasonAIModelConfigured,
} from './_lib/jasonaiModel.js';
import { gurgeBusinesses } from '../src/pages/internal/gurgeData.js';

export const maxDuration = 30;

const REFRESH_INTERVAL_MS = 30_000;

function trustedOrigin(req: any) {
  const origin = String(req.headers?.origin ?? '').trim();
  if (!origin) return true;
  const forwardedHost = String(req.headers?.['x-forwarded-host'] ?? req.headers?.host ?? '')
    .split(',')[0]
    .trim();
  try {
    return new URL(origin).host === forwardedHost;
  } catch {
    return false;
  }
}

function cleanText(value: unknown, maxLength = 120) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function parseJsonObject(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('The model did not return JSON.');
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

function fallbackStatement() {
  const company = gurgeBusinesses.find(({ id }) => id === 'b2w');
  const clients = gurgeBusinesses.filter(({ id }) => id !== 'b2w');
  const clientProjects = clients.flatMap(({ projects }) => projects);
  const activeClientWork = clientProjects.filter(({ status }) => status === 'active').length;
  const attentionItems = clientProjects.filter(({ status }) =>
    status === 'pending' || status === 'planned' || status === 'at-risk',
  ).length;
  const jasonAI = company?.projects.find(({ id }) => id === 'jason-ai')?.name ?? 'JasonAI';
  const gurge = company?.projects.find(({ id }) => id === 'gurge')?.name ?? 'Gurge';
  const clara = company?.projects.find(({ id }) => id === 'clara')?.name ?? 'Clara';

  return `Today: ${jasonAI} is preparing for Foundation, ${gurge} remains in product build, and ${clara} is active. Client delivery includes ${activeClientWork} active workstreams${attentionItems ? `, with ${attentionItems} review ${attentionItems === 1 ? 'item' : 'items'} requiring attention` : ''}.`;
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) return;
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (!trustedOrigin(req)) {
    sendJson(res, 403, { ok: false, error: 'Untrusted request origin.' });
    return;
  }

  const rateLimit = await checkRateLimit(`gurge-today:${getClientIp(req)}`, {
    windowMs: 10 * 60 * 1_000,
    maxRequests: 24,
  });
  if ('retryAfterSeconds' in rateLimit) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, { ok: false, error: 'Today analysis refresh limit reached.' });
    return;
  }

  const generatedAt = new Date().toISOString();
  const fallback = fallbackStatement();

  try {
    const body = await readJsonBody<Record<string, unknown>>(req, 10_000);
    const context = {
      executiveRole: cleanText(body.executiveRole, 20),
      selectedProduct: cleanText(body.selectedProduct, 80),
      selectedBusiness: cleanText(body.selectedBusiness, 120),
    };

    if (!isJasonAIModelConfigured()) {
      sendJson(res, 200, {
        ok: true,
        statement: fallback,
        source: 'fallback',
        generatedAt,
        refreshAfterMs: REFRESH_INTERVAL_MS,
      });
      return;
    }

    const config = getJasonAIModelConfig();
    const messages = [
      {
        role: 'system',
        content: [
          'You are the backend business analyst for B2W LLC inside Gurge.',
          'Analyze the entire supplied Gurge snapshot, including B2W products, clients, project states, metrics, updates, and items requiring attention.',
          'Write one current statement for a dashboard titled “Today’s view.”',
          'Lead with the most decision-relevant work happening now.',
          'Mention client delivery or an open gate when material.',
          'Use only supplied facts. Do not invent dates, progress, owners, results, or urgency.',
          'Do not describe the interface or say “the data shows.”',
          'Keep the statement under 55 words and return JSON only with: statement.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify({
          generatedAt,
          context,
          businesses: gurgeBusinesses,
        }),
      },
    ];
    const endpoint = config.apiStyle === 'openai'
      ? `${config.baseUrl}/chat/completions`
      : `${config.baseUrl}/api/chat`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;
    const requestBody = config.apiStyle === 'openai'
      ? {
          model: config.model,
          messages,
          stream: false,
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }
      : {
          model: config.model,
          messages,
          stream: false,
          ...(config.baseUrl.includes('ollama.com') ? {} : { format: 'json' }),
          options: { temperature: 0.1 },
        };
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) throw new Error(`Model request failed with ${response.status}.`);
    const payload = await response.json();
    const content = config.apiStyle === 'openai'
      ? String(payload?.choices?.[0]?.message?.content ?? '')
      : String(payload?.message?.content ?? '');
    const statement = cleanText(parseJsonObject(content).statement, 700);
    if (!statement) throw new Error('The model returned an empty statement.');

    sendJson(res, 200, {
      ok: true,
      statement,
      source: 'model',
      model: config.model,
      generatedAt,
      refreshAfterMs: REFRESH_INTERVAL_MS,
    });
  } catch (error) {
    sendJson(res, 200, {
      ok: true,
      statement: fallback,
      source: 'fallback',
      generatedAt,
      refreshAfterMs: REFRESH_INTERVAL_MS,
      modelError: error instanceof Error ? error.message : 'Today analysis failed.',
    });
  }
}
