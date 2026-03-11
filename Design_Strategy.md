# B2W UX and Design Strategy

Last updated: 2026-03-10

This document defines the active design system for the B2W website.

## 1. UX Principles

- Agency/Portfolio structure: Hero, Case Studies (Work), Industries, Team, and a consistent CTA.
- Light-only visual system for consistency.
- Smooth scrolling and subtle fade-ins only.
- Strict architecture with minimal navigation noise.
- Mission-driven copy: concise and factual.

## 2. Information Architecture

Single-page scroll layout:
- Hero
- `#work` (Case Studies)
- `#industries`
- `#team`
- `#contact` (CTA)

## 3. Visual Systemwe

- Typeface: Inter.
- No grid backgrounds.
- No ornamental or speculative visuals.
- Minimal shadows, restrained borders, consistent spacing.

## 4. Interaction System

- Keep section reveals to simple fade-in + slight upward offset.
- Duration target: short and quiet (around 250-450ms).
- Respect reduced-motion preferences.

## 5. Content Integrity Rules

Allowed:
- Mission statement
- Three audience pillars
- Neutral functional labels

Not allowed:
- Fabricated metrics or outcomes
- Fake dashboards or fake logs
- Unsupported implementation claims

## 6. CTA and Navigation Rules

- Header nav only: `Work`, `Industries`, `Team`, `Contact`.
- Do not duplicate nav link clusters in page bodies or footer.
- Footer contains mission line only.
- Use one CTA contract everywhere:
  - Label: `Book Intro Call`
  - Target: `mailto:team@b2w-ai.com?subject=B2W%20Intro%20Call`
