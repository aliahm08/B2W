# Changelog

All notable product-facing and documentation-facing updates should be recorded here.

## 2026-03-03

- Replaced "Business Owners" pathway naming with "Individuals" across app routes and copy.
- Renamed manifesto source to `Mission.md` and aligned strategic language.
- Updated header UX:
  - Global CTA moved to top-right action cluster (outside nav links).
  - Added manual light/dark mode toggle.
- Refined typography system to Inter-first styling.
- Updated docs set for ongoing tracking:
  - `README.md`
  - `Mission.md`
  - `Design_Strategy.md`
  - `CHANGELOG.md` (new)

## 2026-03-03 (Mission-Strict Product SaaS Reset)

- Canonical route model set to:
  - `/`, `/individuals`, `/enterprises`, `/government`
- Added compatibility redirects from legacy paths:
  - `/business-owners`, `/federal-agencies`, `/government-solutions`
- Rebuilt all pages with strict mission-aligned product surfaces.
- Removed fabricated demo visuals, fake metrics, and fake logs.
- Standardized CTA label/target across header and page sections.
- Reduced footer to mission line only and removed duplicated nav link clusters.
- Enforced light-only UI with smooth scrolling and subtle fade-in motion.
- Replaced slide-like content stacks with structured product-surface layouts on all pages.
- Added reduced-motion handling for page transitions and section reveals.

## 2026-03-03 (Landing Product + Hosted Demo)

- Repositioned the site as a product landing experience for `B2W AI` and `RelayOS`.
- Added a dedicated hosted demo route at `/demo` with a WhatsApp-style interaction model.
- Integrated a pro UI component system using `@radix-ui/themes`.
- Installed mockup and asset tooling dependencies:
  - `stitch-mcp`
  - `@21st-dev/cli`
  - `@21st-extension/toolbar`
- Added tooling scripts:
  - `npm run mcp:stitch`
  - `npm run mcp:21st:install:cursor`
  - `npm run assets:21st:add`
- Added implementation and tooling docs:
  - `Implementation_Plan.md`
  - `Mockup_Tooling.md`
