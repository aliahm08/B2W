import './_common/env.js';
import { checkRateLimit, getClientIp } from './_common/rateLimit.js';
import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';
import {
  getJasonAIModelConfig,
  isJasonAIModelConfigured,
} from './_lib/jasonaiModel.js';

export const maxDuration = 30;

type GurgeCopy = {
  eyebrow: string;
  title: string;
  body: string;
  sectionLabel: string;
  sectionTitle: string;
};

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

function cleanText(value: unknown, maxLength = 500) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function normalizeBusiness(value: unknown) {
  const candidate = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const rawProjects = Array.isArray(candidate.projects) ? candidate.projects.slice(0, 12) : [];
  return {
    name: cleanText(candidate.name, 120),
    segment: cleanText(candidate.segment, 120),
    userCategory: cleanText(candidate.userCategory, 120),
    description: cleanText(candidate.description, 800),
    projects: rawProjects.map((project) => {
      const item = project && typeof project === 'object' ? project as Record<string, unknown> : {};
      return {
        name: cleanText(item.name, 140),
        type: cleanText(item.type, 120),
        status: cleanText(item.status, 40),
        summary: cleanText(item.summary, 500),
        metricLabel: cleanText(item.metricLabel, 100),
        metricValue: cleanText(item.metricValue, 100),
        update: cleanText(item.update, 500),
      };
    }),
  };
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

function normalizeCopy(value: Record<string, unknown>): GurgeCopy {
  const copy = {
    eyebrow: cleanText(value.eyebrow, 100),
    title: cleanText(value.title, 160),
    body: cleanText(value.body, 600),
    sectionLabel: cleanText(value.sectionLabel, 80),
    sectionTitle: cleanText(value.sectionTitle, 180),
  };
  if (Object.values(copy).some((entry) => !entry)) {
    throw new Error('The model response was incomplete.');
  }
  return copy;
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) return;
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (!trustedOrigin(req)) {
    sendJson(res, 403, { ok: false, error: 'Untrusted request origin.' });
    return;
  }

  const rateLimit = await checkRateLimit(`gurge-copy:${getClientIp(req)}`);
  if ('retryAfterSeconds' in rateLimit) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    sendJson(res, 429, { ok: false, error: 'Copy refresh limit reached.' });
    return;
  }

  if (!isJasonAIModelConfigured()) {
    sendJson(res, 200, { ok: true, copy: null, source: 'fallback' });
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req, 80_000);
    const business = normalizeBusiness(body.business);
    if (!business.name || business.projects.length === 0) {
      sendJson(res, 400, { ok: false, error: 'A business and its project data are required.' });
      return;
    }

    const config = getJasonAIModelConfig();
    const messages = [
      {
        role: 'system',
        content: [
          'You write interface copy for Gurge, sophisticated project-management software.',
          'Your personality is clear-cut, calm, concise, and helpful.',
          'Describe what the supplied data says. Do not instruct, judge, praise, warn, or invent information.',
          'Prefer concrete project states and counts over slogans.',
          'Return JSON only with: eyebrow, title, body, sectionLabel, sectionTitle.',
          'title must be a direct dashboard headline of 12 words or fewer.',
          'body must be two short sentences or fewer.',
          'sectionLabel must be 4 words or fewer.',
          'sectionTitle must explain what the listed projects represent.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify({
          today: new Date().toISOString(),
          business,
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
    const copy = normalizeCopy(parseJsonObject(content));
    sendJson(res, 200, { ok: true, copy, source: 'model', model: config.model });
  } catch (error) {
    sendJson(res, 200, {
      ok: true,
      copy: null,
      source: 'fallback',
      modelError: error instanceof Error ? error.message : 'Copy generation failed.',
    });
  }
}
