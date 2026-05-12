---
name: marketability-updates
description: Keep the B2W website's public marketability surface aligned after major website edits. Use when changing public routes, titles, descriptions, canonical paths, robots tags, favicons, share images, brand naming, product framing, homepage or CTA copy, or any other SEO and social-sharing metadata for B2W, Clara, or JasonAI.
---

# Marketability Updates

Keep the public brand surface current with the least amount of Codex work by using the existing sync scripts and central metadata files instead of rediscovering routes or hand-editing tags page by page.

## Workflow

1. Check whether the edit touched any public-facing surface:
   - public route added, removed, or renamed
   - page title, description, canonical, `robots`, or share image changed
   - favicon, app icon, manifest, or top-level brand asset changed
   - B2W, Clara, or JasonAI framing changed in hero copy, CTA copy, nav copy, or page headers
2. Update the real source file first:
   - route metadata: `src/lib/seo.ts`
   - runtime head behavior: `src/components/Seo.tsx`
   - strategic marketing rules: `docs/marketability-source-of-truth.md`
   - concise brand reference: `content.md`
3. Run `npm run marketing:sync`.
4. Review `docs/seo-route-inventory.md` and fix anything the sync exposed.
5. Run `npm run build` before finishing if public metadata or marketing assets changed.

## Preferred Inputs

- Read `docs/marketability-source-of-truth.md` for the current rules and approved positioning.
- Read `docs/seo-route-inventory.md` for the generated route inventory and favicon/share-asset snapshot.
- Use `scripts/sync_marketing_assets.py` for favicon, manifest, and default share-card generation.
- Use `scripts/sync-marketing-docs.ts` for route coverage checks and Markdown inventory refresh.

## Cheap Rules

- Do not audit every page manually unless the central route inventory says coverage is missing.
- Do not add one-off metadata directly in page components when the route should live in the central SEO map.
- Reuse the default B2W share card for indexable public pages unless a product-specific image materially improves the preview.
- Keep private, client, portal, prototype, and internal routes on `noindex, nofollow` unless the task explicitly changes that decision.
