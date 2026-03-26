import { allowMethods, readJsonBody, sendJson } from './_lib/http.js';

type EnrichmentResponse = {
  ok: boolean;
  businessName?: string;
  website?: string;
  email?: string;
  sourceUrl?: string;
  notes?: string[];
  warning?: string;
  error?: string;
};

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripTags(value: string) {
  return cleanText(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
}

function normalizeUrl(value: string) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function extractEmails(text: string) {
  const matches = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  return Array.from(new Set(matches.map((item) => item.toLowerCase()))).filter((item) => !item.includes('example.com'));
}

function extractMetaContent(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return cleanText(match[1]);
    }
  }

  return '';
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? cleanText(match[1]) : '';
}

function deriveBusinessName(inputUrl: URL, html: string) {
  const candidates = [
    extractMetaContent(html, 'og:site_name'),
    extractMetaContent(html, 'application-name'),
    extractTitle(html),
  ]
    .map((value) =>
      cleanText(
        value
          .replace(/\s*[|\-–].*$/, '')
          .replace(/\b(LinkedIn|Instagram|Facebook)\b/gi, '')
          .trim(),
      ),
    )
    .filter(Boolean);

  if (candidates[0]) {
    return candidates[0];
  }

  const host = inputUrl.hostname.replace(/^www\./, '').split('.')[0] ?? '';
  return host
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function extractCanonicalWebsite(html: string) {
  const linkMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (linkMatch?.[1]) {
    return normalizeUrl(linkMatch[1]);
  }

  const ogUrl = extractMetaContent(html, 'og:url');
  return ogUrl ? normalizeUrl(ogUrl) : '';
}

function extractWebsiteFromText(text: string) {
  const match = text.match(/https?:\/\/[^\s"'<>]+/i);
  return match?.[0] ? normalizeUrl(match[0]) : '';
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; B2WProjectBuilder/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.text();
}

async function enrichFromGoogle(query: string) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  const html = await fetchText(url);
  const text = stripTags(html);
  const emails = extractEmails(text);
  const website = extractWebsiteFromText(text);
  return {
    website,
    email: emails[0] ?? '',
    notes: ['Google search checked for corroborating business details.'],
  };
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ['POST'])) {
    return;
  }

  try {
    const body = await readJsonBody<Record<string, unknown>>(req);
    const sourceUrl = normalizeUrl(String(body.sourceUrl ?? ''));

    if (!sourceUrl) {
      sendJson(res, 400, { ok: false, error: 'A website, LinkedIn, or Instagram URL is required.' } satisfies EnrichmentResponse);
      return;
    }

    const inputUrl = new URL(sourceUrl);
    const html = await fetchText(sourceUrl);
    const text = stripTags(html);
    const notes: string[] = ['Primary link scrubbed for business details.'];

    const businessName = deriveBusinessName(inputUrl, html);
    const canonical = extractCanonicalWebsite(html);
    const sameHostWebsite = `${inputUrl.protocol}//${inputUrl.hostname}`;
    let website = canonical || sameHostWebsite;
    let email = extractEmails(html)[0] ?? extractEmails(text)[0] ?? '';

    if (/linkedin\.com|instagram\.com/i.test(inputUrl.hostname)) {
      const googleResult = await enrichFromGoogle(`"${businessName}" ${inputUrl.hostname.includes('linkedin') ? 'LinkedIn' : 'Instagram'} business website email`);
      website = googleResult.website || website;
      email = email || googleResult.email;
      notes.push(...googleResult.notes);
    } else {
      const googleResult = await enrichFromGoogle(`${businessName} official website email`);
      website = website || googleResult.website;
      email = email || googleResult.email;
      notes.push(...googleResult.notes);
    }

    sendJson(res, 200, {
      ok: true,
      businessName,
      website,
      email,
      sourceUrl,
      notes,
      warning: 'Please verify the scraped details before continuing.',
    } satisfies EnrichmentResponse);
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to enrich business details right now.',
    } satisfies EnrichmentResponse);
  }
}
