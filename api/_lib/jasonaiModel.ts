import type {
  ExecutiveAnalysis,
  JasonAIProgressChange,
  JasonAIProgressSnapshot,
  SessionComparison,
  TimelineAssessment,
} from './jasonaiProgress.js';

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

function getEnv(name: string, fallback = '') {
  return String(process.env[name] ?? fallback).trim();
}

export function getJasonAIModelConfig() {
  return {
    apiKey: getEnv('JASONAI_OSS_MODEL_API_KEY'),
    baseUrl: getEnv('JASONAI_OSS_MODEL_BASE_URL').replace(/\/$/, ''),
    model: getEnv('JASONAI_OSS_MODEL_NAME'),
    apiStyle: getEnv('JASONAI_OSS_MODEL_API_STYLE', 'openai').toLowerCase(),
  };
}

export function isJasonAIModelConfigured() {
  const config = getJasonAIModelConfig();
  return Boolean(config.baseUrl && config.model && (config.apiKey || config.baseUrl.includes('127.0.0.1') || config.baseUrl.includes('localhost')));
}

function parseJsonResponse(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error('The model did not return a JSON object.');
  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as Record<string, unknown>;
}

function stringArray(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value.map((item) => String(item ?? '').trim()).filter(Boolean).slice(0, limit)
    : [];
}

function normalizeAnalysis(value: Record<string, unknown>, model: string): ExecutiveAnalysis {
  const allowedStatuses = new Set(['ahead', 'on-track', 'at-risk', 'behind']);
  const allowedConfidence = new Set(['low', 'medium', 'high']);
  const risks = Array.isArray(value.risks)
    ? value.risks.slice(0, 4).map((risk) => {
        const item = risk && typeof risk === 'object' ? (risk as Record<string, unknown>) : {};
        const rawOwner = String(item.owner ?? 'COO').toUpperCase();
        return {
          title: String(item.title ?? 'Progress risk').slice(0, 120),
          owner: (['CEO', 'COO', 'CTO'].includes(rawOwner) ? rawOwner : 'COO') as 'CEO' | 'COO' | 'CTO',
          detail: String(item.detail ?? '').slice(0, 600),
        };
      })
    : [];
  const accountability = Array.isArray(value.accountability)
    ? value.accountability.slice(0, 3).map((entry) => {
        const item = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {};
        const rawOwner = String(item.owner ?? 'COO').toUpperCase();
        return {
          owner: (['CEO', 'COO', 'CTO'].includes(rawOwner) ? rawOwner : 'COO') as 'CEO' | 'COO' | 'CTO',
          commitment: String(item.commitment ?? '').slice(0, 500),
          reason: String(item.reason ?? '').slice(0, 500),
        };
      })
    : [];
  const rawStatus = String(value.status ?? 'on-track');
  const rawConfidence = String(value.confidence ?? 'low');

  return {
    source: 'model',
    model,
    overviewTitle: String(
      value.overviewTitle ?? value.headline ?? 'Executive progress review',
    ).slice(0, 180),
    overviewSubtitle: String(
      value.overviewSubtitle ?? value.executiveSummary ?? '',
    ).slice(0, 800),
    headline: String(value.headline ?? 'Executive progress review').slice(0, 180),
    executiveSummary: String(value.executiveSummary ?? '').slice(0, 1_200),
    status: (allowedStatuses.has(rawStatus) ? rawStatus : 'on-track') as ExecutiveAnalysis['status'],
    timelineAssessment: String(value.timelineAssessment ?? '').slice(0, 900),
    decisions: stringArray(value.decisions, 4),
    risks,
    accountability,
    questions: stringArray(value.questions, 4),
    confidence: (allowedConfidence.has(rawConfidence) ? rawConfidence : 'low') as ExecutiveAnalysis['confidence'],
  };
}

export async function analyzeJasonAIProgress(input: {
  snapshot: JasonAIProgressSnapshot;
  timeline: TimelineAssessment;
  change: JasonAIProgressChange;
  actorRole: 'CEO' | 'COO' | 'CTO';
  sessionComparison: SessionComparison;
  previousAnalysis?: ExecutiveAnalysis | null;
}) {
  const config = getJasonAIModelConfig();
  if (!isJasonAIModelConfigured()) return null;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: [
        'You are the JasonAI executive project manager.',
        'Your job is to help the CEO, COO, and CTO make decisions, review progress, and remain accountable.',
        'Use only the supplied project facts. Never invent results, evidence, dates, customers, or commitments.',
        'Distinguish task execution from measured business performance.',
        'Compare actual progress with the ideal timeline and identify the decision that matters now.',
        'Return JSON only with: overviewTitle, overviewSubtitle, headline, executiveSummary, status, timelineAssessment, decisions, risks, accountability, questions, confidence.',
        'overviewTitle must explain the strongest material change since the previous saved session in 14 words or fewer.',
        'overviewSubtitle must name today, identify the previous-session comparison or baseline, and explain the evidence without inventing facts.',
        'If no previous version exists, say that this is the baseline rather than claiming improvement or decline.',
        'status must be ahead, on-track, at-risk, or behind.',
        'risks entries require title, owner (CEO/COO/CTO), detail.',
        'accountability entries require owner, commitment, reason.',
        'Keep the review concise enough for an executive dashboard.',
      ].join('\n'),
    },
    {
      role: 'user',
      content: JSON.stringify({
        latestChange: input.change,
        changedBy: input.actorRole,
        sessionComparison: input.sessionComparison,
        timeline: input.timeline,
        progressSnapshot: input.snapshot,
        previousAnalysis: input.previousAnalysis ?? null,
      }),
    },
  ];

  const endpoint =
    config.apiStyle === 'openai'
      ? `${config.baseUrl}/chat/completions`
      : `${config.baseUrl}/api/chat`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;
  const body =
    config.apiStyle === 'openai'
      ? {
          model: config.model,
          messages,
          stream: false,
          temperature: 0.15,
          response_format: { type: 'json_object' },
        }
      : {
          model: config.model,
          messages,
          stream: false,
          ...(config.baseUrl.includes('ollama.com') ? {} : { format: 'json' }),
          options: { temperature: 0.15 },
        };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new Error(`OSS model request failed (${response.status}): ${(await response.text()).slice(0, 400)}`);
  }
  const data = await response.json();
  const content =
    config.apiStyle === 'openai'
      ? String(data?.choices?.[0]?.message?.content ?? '')
      : String(data?.message?.content ?? '');
  if (!content.trim()) throw new Error('The OSS model returned an empty response.');

  return normalizeAnalysis(parseJsonResponse(content), config.model);
}
