# Marketability Source Of Truth

Last updated: 2026-07-29

This document is the stable reference for public marketing upkeep on the B2W website. Use it with the generated [docs/seo-route-inventory.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/seo-route-inventory.md) file.

## Current Brand Stack

- `B2W`: an operating layer for contracting businesses that connects communication, business context, document creation, and approved actions.
- `Clara`: the B2W voice-to-plan and estimation interface.
- `JasonAI`: a WhatsApp AI Assistant for searching approved contractor communication and creating job summaries.

## Services Route Structure

- `/services`: the live consulting-led services page covering marketing, operations, financial performance, diagnostics, implementation, and practical AI systems.
- `/internal/services`: the private Operating Map organized into Growth Map, Optimization, and Diligence.
- `/internal`: the password-protected entry point for internal work.
- `/internal/portal`: the protected Gurge overview for today’s business activity, clients, metrics, and product direction.
- `/internal/portal/product`: the JasonAI product roadmap and progress workspace, formerly located at `/internal/jason-ai`.
- `Gurge`: a B2W-built project-management concept under consideration as the Executive Strategy tracker. Its next state should be editable and AI-driven.
- `Business Plan`: a separate source document linked from the internal hub in Google Drive.
- `/services/archive/2026-07-29`: the preserved dated snapshot of the consulting-led services page.

## JasonAI Product And Offer Rules

- The global public navigation links directly to `/jasonai` as `Get JasonAI` and uses the JasonAI descramble interaction on hover.
- Available now: communication search and summaries.
- In development: action-item extraction, status reporting, and source-linked answers.
- Future only: financial or contractual automation, added after the core workflow is trusted.
- Standard price: `$99/month` plus a one-time `$2,000` setup fee.
- Pre-launch subscriber offer: `$25/month` for the first year with the setup fee removed.
- Never present roadmap capabilities as current or include future financial or contractual automation in current ROI calculations.

## Canonical Marketing Files

- The approved canonical B2W silhouette is `public/brand/b2w-icon.svg`. Active React usage routes through `src/components/logo/B2WIcon.tsx`, and the favicon generator reads the exact geometry from that SVG. Keep `B2WSilhouetteMark` only as the original inline comparison source for logo verification; do not substitute archived artwork.
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

## Revision History

- **2026-07-29:** Separated the internal Operating Map, Executive Strategy tracking tool, and Business Plan; recorded Gurge’s editable, AI-driven product direction.
- **2026-07-29:** Moved the JasonAI product roadmap from `/internal/jason-ai` to `/internal/portal/product` and retained the former route as a redirect.
- **2026-07-29:** Replaced the global `Contact` navigation item with a descrambling `Get JasonAI` product link.
- **2026-07-29:** Restored the consulting-led services page at `/services` and moved the operating strategy workspace to private `/internal/services`.
- **2026-07-29:** Reframed `/services` around B2W's contracting-business operating layer and preserved the former consulting-led services page at `/services/archive/2026-07-29`.
