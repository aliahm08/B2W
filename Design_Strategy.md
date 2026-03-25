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
- Generalized proposal-state homepage card copy that describes the work without naming the client or exposing exact location details
- Monochrome tiered tag treatments when tags are sourced from proposal/profile materials

Not allowed:
- Fabricated metrics or outcomes
- Fake dashboards or fake logs
- Unsupported implementation claims
- Proposal-state homepage cards that reveal business names, exact addresses, or other PII before access is granted
- Instructional page copy that tells the reader how to use or move through the page (for example, proposal-navigation helper text such as "move through the operating scope, rollout plan, and expected business effect")

## 6. CTA and Navigation Rules

- Header nav only: `Work`, `Industries`, `Team`, `Contact`.
- Do not duplicate nav link clusters in page bodies or footer.
- Footer contains mission line only.
- Use one CTA contract everywhere:
  - Label: `Book Intro Call`
  - Target: `mailto:info@b2w-ai.com?subject=B2W%20Intro%20Call`

## 7. Landing Buttons vs Links

- Scope: these rules apply to the B2W landing site only.
- Buttons are action controls. Use them when the user is being redirected to an external page, opening a dialog or modal, executing a command or UI function, or jumping to a section on the same page.
- Buttons do not need directional arrow icons just because they redirect. Their button styling already communicates the action.
- Links are navigational items. Use them for clickable text or link-styled elements that send the user to another page, usually within the same ecosystem.
- On B2W, the landing site and the client portal are separate ecosystems. Cross-page navigation inside one of those ecosystems should generally be expressed as links, not buttons, unless the element is functioning as an action control.
