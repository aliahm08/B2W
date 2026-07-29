# B2W Content Notes

Last updated: 2026-07-29

This file is a concise strategic reference for Codex. For route-by-route metadata and share-image coverage, use [docs/seo-route-inventory.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/seo-route-inventory.md). For maintenance rules, use [docs/marketability-source-of-truth.md](/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My%20Drive/B2W/Website/docs/marketability-source-of-truth.md).

## Core Positioning

- `B2W`: an operating layer for contracting businesses that connects communication, business context, document creation, and approved actions.
- `Clara`: B2W's voice-to-plan and estimation interface.
- `JasonAI`: a WhatsApp AI Assistant for searching approved contractor communication and creating job summaries.

## Approved Messaging

- B2W should sound direct, technical, and operational. Avoid inflated transformation language.
- The global public navigation uses `Get JasonAI` as the direct product link, with JasonAI's descramble interaction on hover.
- The live `/services` page presents B2W's consulting, diagnostics, implementation, and practical AI services for small and midsize businesses.
- `/internal` is the single password-protected entry point for B2W internal work.
- The private `/internal/services` Operating Map is organized into Growth Map, Optimization, and Diligence. Diligence combines accountability, financial progression, the five-phase JasonAI J-curve, and progress tracking.
- The private `/internal/portal` destination is communicated as the Executive Strategy tracking tool. It uses Gurge, a B2W-built project-management concept under consideration for this role.
- Gurge currently demonstrates portfolio tracking and AI-adapted summaries. Its intended next state is editable and AI-driven: users should be able to update projects, owners, priorities, statuses, evidence, and notes while AI assists with summaries and recommended actions.
- The source Business Plan remains a separate document: `https://drive.google.com/file/d/1o3PUriSophwFozltUmJHx6sim9AxT7z5/view?usp=share_link`.
- Public copy should describe what B2W builds, scopes, or operates in concrete terms: consulting, diagnostics, implementation, estimation, workflow tooling, AI systems.
- JasonAI copy must distinguish product stages: search and summaries are available now; action-item extraction, status reporting, and source-linked answers are in development; financial or contractual automation is future-only after the core workflow is trusted.
- JasonAI standard pricing is `$99/month` plus a one-time `$2,000` setup fee. Pre-launch subscribers receive `$25/month` for the first year with the setup fee removed.
- Clara copy should stay anchored to voice input, estimation, planning, modeling, and actioning structured context.

## Core CTA

- Primary contact email: `info@b2w-ai.com`
- Default CTA framing: book an intro call, book a review, or contact B2W about fit

## Update Rule

- After major public-facing edits, run `npm run marketing:sync`.
- Update this file only when the brand positioning or approved messaging actually changes.

## Revision History

- **2026-07-29:** Established Operating Map, Executive Strategy tracking tool, and Business Plan as three distinct internal artifacts; documented Gurge’s editable, AI-driven product direction.
- **2026-07-29:** Consolidated internal access at `/internal`, with protected Executive Strategy and Gurge Business Plan destinations.
- **2026-07-29:** Replaced the global `Contact` navigation item with a direct, descrambling `Get JasonAI` product link.
- **2026-07-29:** Restored the consulting-led services experience at `/services` and moved the strategy/progress workspace to `/internal/services`.
- **2026-07-29:** Reframed B2W's services positioning around the contracting-business operating layer and its public strategy/progress view.
- **2026-05-11:** Reframed this file as a concise marketability reference. Linked it to the generated SEO inventory and the marketability maintenance doc so Codex can update route metadata, favicon assets, and brand copy from one workflow.
