import fs from 'node:fs/promises';
import path from 'node:path';
import { config, resolveRelativePath } from './config';
import { getAllowedDriveDocuments } from './google';

type KnowledgeDocument = {
  id: string;
  path: string;
  content: string;
  source: 'local' | 'drive';
};

let cachedCorpus: KnowledgeDocument[] | null = null;
let cachedAt = 0;

function shouldSkipSegment(segment: string): boolean {
  return config.corpus.excludedSegments.includes(segment);
}

async function walkDirectory(dirPath: string, collected: string[]): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (shouldSkipSegment(entry.name)) {
      continue;
    }

    const nextPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await walkDirectory(nextPath, collected);
      continue;
    }

    if (!config.corpus.includeExtensions.includes(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    collected.push(nextPath);
  }
}

function normalizeContent(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function readLocalDocument(filePath: string): Promise<KnowledgeDocument | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const normalized = normalizeContent(raw);

    if (!normalized) {
      return null;
    }

    return {
      id: resolveRelativePath(filePath),
      path: resolveRelativePath(filePath),
      content: normalized,
      source: 'local',
    };
  } catch {
    return null;
  }
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2);
}

function scoreDocument(query: string, doc: KnowledgeDocument): number {
  const haystack = `${doc.path}\n${doc.content}`.toLowerCase();
  const terms = tokenize(query);

  if (!terms.length) {
    return 0;
  }

  return terms.reduce((score, term) => {
    if (!haystack.includes(term)) {
      return score;
    }

    const pathWeight = doc.path.toLowerCase().includes(term) ? 4 : 0;
    const contentHits = haystack.split(term).length - 1;
    return score + 1 + pathWeight + Math.min(contentHits, 8);
  }, 0);
}

async function loadCorpus(): Promise<KnowledgeDocument[]> {
  const now = Date.now();
  if (cachedCorpus && now - cachedAt < 5 * 60_000) {
    return cachedCorpus;
  }

  const localPaths: string[] = [];
  await walkDirectory(config.corpus.rootDir, localPaths);

  const localDocs = (
    await Promise.all(localPaths.map((filePath) => readLocalDocument(filePath)))
  ).filter((doc): doc is KnowledgeDocument => Boolean(doc));

  const driveDocs = await getAllowedDriveDocuments();

  cachedCorpus = [...localDocs, ...driveDocs];
  cachedAt = now;
  return cachedCorpus;
}

export async function buildKnowledgeContext(query: string): Promise<string> {
  const corpus = await loadCorpus();
  const ranked = corpus
    .map((doc) => ({ doc, score: scoreDocument(query, doc) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, config.corpus.maxDocuments);

  const selected = ranked.length ? ranked : corpus.slice(0, Math.min(corpus.length, 12)).map((doc) => ({ doc, score: 0 }));

  let remaining = config.corpus.maxSnippetChars;
  const snippets: string[] = [];

  for (const { doc } of selected) {
    if (remaining <= 0) {
      break;
    }

    const snippet = doc.content.slice(0, Math.min(doc.content.length, remaining));
    remaining -= snippet.length;
    snippets.push(`[${doc.source.toUpperCase()}] ${doc.path}\n${snippet}`);
  }

  return snippets.join('\n\n---\n\n');
}
