# B2W Unified Website Prototype

**Status:** First-run prototype  
**Branch:** `agent/workspace-brand-system`  
**Prototype root:** `/prototype`  
**Live routes affected:** None

## Purpose

This prototype tests whether the strongest design and content patterns already present in the B2W repository can operate as one website system.

The prototype does not replace the current homepage, Services, JasonAI, or Clara routes. It creates an isolated review environment so the structure, voice, navigation, and page relationships can be evaluated before migration.

## Approved first-run scope

| Prototype route | Role | Primary source material |
|---|---|---|
| `/prototype` | Unified homepage | Operating Map flow, B2W parent brand, workspace UI |
| `/prototype/services` | Public service organization | `/services`, Growth / Optimization / Diligence structure |
| `/prototype/jasonai` | Product narrative | `/jasonai`, current capability boundaries, trust and communication problem |
| `/prototype/resources` | Resource library and demonstrations | `/clara`, guided capture-to-output interaction |
| `/prototype/guide` | Reusable long-form content template | Workspace document structure and JasonAI owner-update workflow |

## Shared system

The prototype uses one shared header and footer across every page.

The parent interface uses:

- Warm-neutral workspace canvas
- White content and document surfaces
- Strong black typography
- Green for active or healthy operating conditions
- Gold for gates, decisions, and dependencies
- Red for risk and blockers
- Rust for JasonAI-specific context
- Plum for Clara and Resources-specific context

Product colors identify context. They do not create separate navigation, spacing, typography, or content systems.

## Content model

Every major page follows the same operating progression:

1. **Orient** — State the audience, business condition, and reason to continue.
2. **Diagnose** — Show the operating problem using concrete situations or evidence.
3. **Resolve** — Explain the service, system, or product as a sequence of work.
4. **Prove** — Show current capability, boundaries, evidence, status, and trust controls.
5. **Advance** — Present one primary next action.

## Page intent

### Unified homepage

The homepage positions B2W as one company with three entry points:

- Services improve the business.
- JasonAI improves communication and context recovery.
- Resources improve understanding through guided work.

### Services

Services are organized around business conditions rather than deliverable categories:

- Growth
- Optimization
- Diligence

The engagement flow is business review, diagnosis, designed response, implementation, and proof.

### JasonAI

JasonAI is positioned as a WhatsApp assistant for contracting businesses that searches and summarizes approved job communication.

The prototype explicitly separates:

- Available now
- In development
- Access controls
- Source-aware work
- Human review

### Resources

Resources turn B2W methods into:

- Interactive demonstrations
- Operator guides
- Templates
- Decision tools

The shared resource interaction is Capture → Organize → Review → Apply.

### Guide template

The guide template demonstrates a reusable long-form format with:

- Clear audience and reading time
- Sticky contents navigation
- Numbered sections
- Review questions
- Evidence callouts
- Reusable output template
- Related next actions

## Implementation files

- `src/content/unifiedPrototype.ts`
- `src/components/prototype/UnifiedSiteShell.tsx`
- `src/pages/prototype/UnifiedPrototypePages.tsx`
- `src/pages/prototype/UnifiedPrototypeRouterPage.tsx`
- `src/App.tsx`

The prototype also reuses:

- `src/content/workspaceBrandSystem.ts`
- `src/components/B2WLogoMark.tsx`
- `src/components/Seo.tsx`
- Existing Motion, Tailwind, Lucide, and routing dependencies

## Review checklist

Review the prototype in this order:

1. Does the homepage accurately explain who B2W is?
2. Do Services, JasonAI, and Resources feel like one company?
3. Does each page have one clear primary action?
4. Are current versus planned capabilities clearly separated?
5. Does the Resources experience feel useful rather than promotional?
6. Does the guide template work for future articles, templates, and how-to content?
7. Does the mobile navigation preserve the same hierarchy?
8. Which parts should replace the live routes unchanged?
9. Which content requires revision before migration?

## Migration after approval

Once the prototype is approved:

1. Move `/prototype` to `/`.
2. Move `/prototype/services` to `/services`.
3. Move `/prototype/jasonai` to `/jasonai` while preserving pricing, questions, and privacy subroutes.
4. Move `/prototype/resources` to `/resources`.
5. Decide whether `/clara` remains a product demonstration or redirects into Resources.
6. Add the reusable guide template to the chosen content route.
7. Preserve legacy redirects and confirm SEO metadata.
8. Run type checking, build validation, responsive review, and route testing.
