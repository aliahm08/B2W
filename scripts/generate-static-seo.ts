import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { listStaticSeoRoutes, type SeoMetadata } from '../src/lib/seo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const siteUrl = 'https://www.b2w-ai.com';

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Please run vite build first.');
  process.exit(1);
}

const originalHtml = fs.readFileSync(indexPath, 'utf-8');
const routes = listStaticSeoRoutes();

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function upsertTag(html: string, regex: RegExp, tag: string) {
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function removeTag(html: string, regex: RegExp) {
  return html.replace(regex, '');
}

function absoluteCanonicalUrl(pathname: string) {
  return pathname === '/' ? `${siteUrl}/` : `${siteUrl}${pathname}`;
}

function replaceSeoTags(html: string, metadata: SeoMetadata) {
  let nextHtml = html;

  nextHtml = upsertTag(nextHtml, /<title>.*?<\/title>/s, `<title>${escapeHtml(metadata.title)}</title>`);
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(metadata.robots)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(metadata.type)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i,
    '<meta property="og:site_name" content="B2W" />',
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(absoluteCanonicalUrl(metadata.canonicalPath))}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:card" content="${escapeHtml(metadata.twitterCard)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
  );
  nextHtml = upsertTag(
    nextHtml,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(absoluteCanonicalUrl(metadata.canonicalPath))}" />`,
  );

  if (metadata.imageUrl) {
    nextHtml = upsertTag(
      nextHtml,
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${escapeHtml(metadata.imageUrl)}" />`,
    );
    nextHtml = upsertTag(
      nextHtml,
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${escapeHtml(metadata.imageUrl)}" />`,
    );
    nextHtml = upsertTag(
      nextHtml,
      /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/i,
      '<meta property="og:image:type" content="image/png" />',
    );
    nextHtml = upsertTag(
      nextHtml,
      /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>/i,
      '<meta property="og:image:width" content="1200" />',
    );
    nextHtml = upsertTag(
      nextHtml,
      /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>/i,
      '<meta property="og:image:height" content="630" />',
    );

    if (metadata.imageAlt) {
      nextHtml = upsertTag(
        nextHtml,
        /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:image:alt" content="${escapeHtml(metadata.imageAlt)}" />`,
      );
      nextHtml = upsertTag(
        nextHtml,
        /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt)}" />`,
      );
    } else {
      nextHtml = removeTag(nextHtml, /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>\s*/i);
      nextHtml = removeTag(nextHtml, /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>\s*/i);
    }
  } else {
    nextHtml = removeTag(nextHtml, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>\s*/i);
    nextHtml = removeTag(nextHtml, /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>\s*/i);
    nextHtml = removeTag(nextHtml, /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>\s*/i);
    nextHtml = removeTag(nextHtml, /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>\s*/i);
    nextHtml = removeTag(nextHtml, /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>\s*/i);
    nextHtml = removeTag(nextHtml, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>\s*/i);
    nextHtml = removeTag(nextHtml, /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>\s*/i);
  }

  return nextHtml;
}

console.log(`Generating static SEO HTML files for ${routes.length} routes...`);

let successCount = 0;

for (const route of routes) {
  const routeDir = route.pathname === '/' ? distPath : path.join(distPath, route.pathname.substring(1));
  const targetHtmlPath = path.join(routeDir, 'index.html');

  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const customHtml = replaceSeoTags(originalHtml, route);
  fs.writeFileSync(targetHtmlPath, customHtml, 'utf-8');
  successCount++;
}

console.log(`Successfully generated ${successCount} static HTML files with custom SEO.`);
