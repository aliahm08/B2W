# Marketability Source Of Truth

Last updated: 2026-05-11

This document is the stable reference for public marketing upkeep on the B2W website. Use it with the generated [docs/seo-route-inventory.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/seo-route-inventory.md) file.

## Current Brand Stack

- `B2W`: consulting, diligence, implementation, and applied AI systems for operators.
- `Clara`: the B2W voice-to-plan and estimation interface.
- `JasonAI`: a WhatsApp AI Assistant for searching approved contractor communication and creating job summaries.

## JasonAI Product And Offer Rules

- Available now: communication search and summaries.
- In development: action-item extraction, status reporting, and source-linked answers.
- Future only: financial or contractual automation, added after the core workflow is trusted.
- Standard price: `$99/month` plus a one-time `$2,000` setup fee.
- Pre-launch subscriber offer: `$25/month` for the first year with the setup fee removed.
- Never present roadmap capabilities as current or include future financial or contractual automation in current ROI calculations.

## Canonical Marketing Files

- The filled `B2WSilhouetteMark` used in the live homepage header is the canonical B2W marketing mark. The favicon generator reads that exact vector path from `src/components/BrandVectorMarks.tsx`; do not substitute the older traced-line logo.
- Route-level SEO, canonicals, robots, and share images live in [src/lib/seo.ts](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/lib/seo.ts).
- Runtime head-tag updates live in [src/components/Seo.tsx](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/src/components/Seo.tsx).
- Static SEO HTML generation lives in [scripts/generate-static-seo.ts](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/scripts/generate-static-seo.ts).
- Favicon, manifest, and share-card generation live in [scripts/sync_marketing_assets.py](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/scripts/sync_marketing_assets.py).
- Generated route and asset inventory lives in [docs/seo-route-inventory.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/seo-route-inventory.md).

## Cheapest Update Loop

Run `npm run marketing:sync` after any major public-facing edit that changes one of these:

- a new public route, removed public route, or redirect change
- page title, page description, canonical path, or `robots` status
- favicon, app icon, touch icon, or manifest branding
- brand naming, product naming, or share-image selection
- homepage, landing-page, or CTA copy that changes how B2W, Clara, or JasonAI are framed

Then:

1. Review [docs/seo-route-inventory.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/seo-route-inventory.md) for route coverage, share images, and noindex decisions.
2. Update this file only if the actual business positioning, product stack, or maintenance rules changed.
3. Run `npm run build` before shipping when SEO metadata or marketing assets changed.

## Rules

- Keep public indexable routes in the central SEO map or a central metadata builder. Do not rely only on page-local `<Seo />` overrides for pages that should have static SEO output.
- Give public indexable routes a share image. Product pages should use product-specific visuals when available; otherwise use the default B2W share card.
- Keep internal, prototype, client, and portal pages on `noindex, nofollow` unless there is a deliberate reason to expose them.
- Treat `content.md` as a concise strategic reference, not a dumping ground for page-by-page copy.
